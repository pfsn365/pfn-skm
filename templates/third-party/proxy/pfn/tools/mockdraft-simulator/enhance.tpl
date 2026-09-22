{* Pick counter and entrance motion for the PFN Mock Draft Simulator.

   The simulation itself lives in js/fragments/mockdraft-simulator.js, which
   skm and the widget also build from, so nothing here touches it. This reads
   the board out of the DOM instead: a pick is "made" when its row's
   .player-name has text, which is what fillSelectedPlayerInPick() does. That
   keeps the whole feature inside the PFN theme layer.

   The counter goes into the board's own sticky ROUND band rather than into
   the action bar it started in. The band already names the round, so the
   count only has to add "N of M picks" beside it -- and the bar gets back the
   ~215px the readout and its divider were taking.

   Loaded from routes/sk-proxy.php on /sk-proxy/:brand/mockdraft-simulator
   only -- not the -widget route. *}
<script>
  {literal}
  (function () {
    "use strict";

    var PROGRESS_HTML =
      '<span class="mds-round-count"><b>0</b> of 0 picks</span>' +
      '<span class="mds-round-track"><span class="mds-round-fill"></span></span>';

    var FLASH_MS = 950;
    var JELLY_MS = 560;
    var JELLY_STAGGER_MS = 40;
    var JELLY_ROWS = 12;

    var holder = null;

    // Pick numbers already counted as made, so a rebuild of the board does not
    // re-flash every row that was already on it.
    var seen = Object.create(null);
    var seenCount = 0;
    var primed = false;
    var queued = false;
    // Identity of the board's first row, to tell "the board was just built"
    // from "a pick landed in the board we already had".
    var firstRow = null;

    function isPicked(row) {
      var name = row.querySelector(".player-name");
      return !!(name && name.textContent.trim() !== "");
    }

    function flash(row) {
      row.classList.add("mds-just-picked");
      window.setTimeout(function () {
        row.classList.remove("mds-just-picked");
      }, FLASH_MS);
    }

    // Cascade the squash down a run of rows. The stagger is what makes the list
    // behave like one elastic sheet instead of N boxes twitching together, and
    // the cap keeps a ~770-player pool from animating rows nobody can see.
    //
    // Entrance only. This deliberately does not run while the draft is going:
    // a pick already announces itself with the team-colour flash, and having
    // the rows around it wobble too made a running simulation restless.
    function jelly(rows) {
      var end = Math.min(rows.length, JELLY_ROWS);
      for (var i = 0; i < end; i++) {
        (function (row, step) {
          row.classList.remove("mds-jelly");
          // Force a reflow so a row rippled twice in quick succession restarts
          // rather than ignoring the re-added class.
          void row.offsetWidth;
          row.style.animationDelay = (step * JELLY_STAGGER_MS) + "ms";
          row.classList.add("mds-jelly");
          window.setTimeout(function () {
            row.classList.remove("mds-jelly");
            row.style.animationDelay = "";
          }, JELLY_MS + step * JELLY_STAGGER_MS);
        })(rows[i], i);
      }
    }

    // The band is built by fillRoundPics() as a bare text node, so the counter
    // is appended alongside it rather than replacing anything. A rebuild of the
    // board discards the band and this puts a fresh one on the new node.
    function counterFor(band) {
      var el = band.querySelector(".mds-round-progress");
      if (!el) {
        el = document.createElement("span");
        el.className = "mds-round-progress";
        el.setAttribute("role", "status");
        el.setAttribute("aria-live", "polite");
        el.innerHTML = PROGRESS_HTML;
        band.appendChild(el);
      }
      return el;
    }

    function render() {
      queued = false;

      var rows = holder.querySelectorAll(".pic-container");
      var total = rows.length;

      if (!total) {
        firstRow = null;
        return;
      }

      // fillRoundPics() clears and refills the holder, so a new first row means
      // the whole board just arrived -- entering a draft, restarting, or
      // changing the round count. Cascade it in. Filling a pick leaves the row
      // nodes alone, so this cannot fire on every pick.
      if (rows[0] !== firstRow) {
        firstRow = rows[0];
        jelly(rows);
      }

      var made = 0;
      var fresh = [];
      var i;
      var row;
      var number;

      for (i = 0; i < total; i++) {
        row = rows[i];
        if (!isPicked(row)) {
          continue;
        }
        made++;
        number = row.dataset.number;
        if (number && !seen[number]) {
          fresh.push(row);
        }
      }

      // A restart empties the board; drop the history so the next draft
      // animates from the first pick again.
      if (made < seenCount) {
        seen = Object.create(null);
        seenCount = 0;
        primed = false;
      }

      for (i = 0; i < fresh.length; i++) {
        number = fresh[i].dataset.number;
        if (number) {
          seen[number] = true;
        }
        // Skip the first pass: a draft restored mid-way would otherwise flash
        // every completed row at once.
        if (primed) {
          flash(fresh[i]);
        }
      }

      seenCount = made;
      primed = true;

      // Whole board, not the band's own round. Every band carries the same
      // figure; only one is ever on screen, because they are sticky and the
      // list only shows one round's worth of rows at a time.
      var countHtml = "<b>" + made + "</b> of " + total + " picks";
      var pct = ((made / total) * 100).toFixed(2) + "%";
      var bands = holder.querySelectorAll(".round-number");

      for (i = 0; i < bands.length; i++) {
        var el = counterFor(bands[i]);
        el.querySelector(".mds-round-count").innerHTML = countHtml;
        el.querySelector(".mds-round-fill").style.width = pct;
      }
    }

    function schedule() {
      if (queued) {
        return;
      }
      queued = true;
      window.requestAnimationFrame(render);
    }

    function init() {
      holder = document.querySelector(".rounds-pics-holder");

      if (!holder) {
        return;
      }

      // The board is built and refilled by fillRoundPics()/fillSelectedPlayerInPick(),
      // neither of which emits an event, so the DOM is the only signal.
      new MutationObserver(schedule).observe(holder, {
        childList: true,
        subtree: true,
        characterData: true
      });

      schedule();
      watchPlayerPool();
    }

    // Observe .players-holder, not .players-list: the list element is built by
    // the simulator after this script runs, and is replaced outright whenever
    // the big board changes. Binding to the list directly meant watching a
    // node that was no longer in the document.
    function watchPlayerPool() {
      var holderEl = document.querySelector(".players-holder");
      if (!holderEl) {
        return;
      }

      new MutationObserver(function (records) {
        var pool = holderEl.querySelector(".players-list");
        if (!pool) {
          return;
        }
        for (var i = 0; i < records.length; i++) {
          var r = records[i];
          if (r.target !== pool) {
            continue;
          }
          // Several nodes in at once means the pool was just rendered --
          // entering the draft, or switching the big board. Cascade it in.
          //
          // Nothing else here animates: drafting a player removes a single row
          // and the rows below shift up, but that happens mid-simulation and
          // is left alone. Position filters and the search box only toggle a
          // `hidden` class, so they never reach this branch either.
          if (r.addedNodes.length > 1) {
            jelly(pool.children);
            return;
          }
        }
      }).observe(holderEl, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
  {/literal}
</script>

{* Narrow-width Player Pool tab.

   home/pfn/desktop.tpl carries a third tab that only shows below the mobile
   edge, where the board and the pool stack rather than sitting side by side.
   The two tabs it ships with call toggleMyPicks() in
   js/fragments/mockdraft-simulator.js, which swaps the board for My Picks and
   knows nothing about the pool -- and that file is shared with skm and the
   widget, so the pool switch is wired here instead of there.

   This also answers toggleSimView() for this layout. That function is how the
   simulation decides which pane to show -- your pick coming up, an offer being
   dismissed, a player being drafted -- and it drives the mobile host through
   .sim-content-slider, which this markup does not have. Rather than teach the
   shared file about these classes, it looks for the two hooks published at the
   bottom of this script. *}
<script>
  {literal}
  (function () {
    "use strict";

    var sim = null;
    var poolBtn = null;
    var holder = null;

    function select(btn) {
      var buttons = holder ? holder.querySelectorAll("button") : [];
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("selected");
      }
      if (btn) btn.classList.add("selected");
    }

    function showPool() {
      sim.classList.add("show-pool");
      select(poolBtn);
    }

    // The board pane, showing either the running draft or My Picks. This is the
    // same DOM swap toggleMyPicks() performs, without its GA event: everything
    // routed here is a redirect the simulation decided on, not a tab the user
    // tapped, which is what toggleSimView's isRedirected flag marks.
    function showBoard(view) {
      var isMyPicks = view === "mypicks";
      sim.classList.remove("show-pool");
      select(document.querySelector(isMyPicks ? ".my-picks-btn" : ".draft-result-btn"));

      var mine = document.querySelector(".mypicks-container");
      var rounds = document.querySelector(".rounds-pics-holder");
      var next = document.querySelector(".next-pick-container");
      if (mine) mine.classList.toggle("hidden", !isMyPicks);
      if (rounds) rounds.classList.toggle("hidden", isMyPicks);
      if (next) next.classList.toggle("hidden", isMyPicks);
      if (isMyPicks && typeof fillMyPicks === "function") fillMyPicks();
    }

    function init() {
      sim = document.querySelector(".draft-simulation-container");
      poolBtn = document.querySelector(".player-pool-btn");
      if (!sim || !poolBtn) return;

      holder = poolBtn.parentElement;

      poolBtn.addEventListener("click", function () {
        showPool();
      });

      // The other two tabs run toggleMyPicks, which leaves show-pool alone and
      // would otherwise reveal My Picks underneath a still-open pool. Drop back
      // to the board pane whenever either of them is clicked; they set their
      // own selected state themselves.
      holder.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn || btn === poolBtn) return;
        sim.classList.remove("show-pool");
        poolBtn.classList.remove("selected");
      });

      // Read by isSimViewTabbed(). The tab is display:none from 768px up, where
      // the board and the pool sit side by side and there is no pane to switch.
      window.mdsSimViewTabbed = function () {
        return !!poolBtn && getComputedStyle(poolBtn).display !== "none";
      };

      // Read by toggleSimView() when there is no .sim-content-slider.
      window.mdsToggleSimViewFallback = function (view) {
        if (!sim || !poolBtn || !window.mdsSimViewTabbed()) return;
        if (view === "pool") showPool();
        else showBoard(view);
      };
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
  {/literal}
</script>

{* Result board height cap.

   js/fragments/mockdraft-simulator.js sizes the full-results and my-draft
   boards by hand, in several places, all shaped like this:

     let height = (32 + (48 * picks.length) + 80) / 3;
     container.setAttribute("style", `max-height:${height}px !important`);

   The divisor is the column count. Those boards are column-wrap flex boxes, so
   capping the height at a third of the content is how three columns are made.

   The PFN layout sets the count with CSS columns instead, which keeps the
   columns inside the card at any width. A height cap defeats that: a multicol
   box that cannot fit its content in the given height spills into extra
   columns, so the hand-computed cap still forces three -- 1404px of them
   against a 477px card at phone widths. An inline !important cannot be
   overridden from a stylesheet, and that file is shared with skm and the
   widget, so the cap is removed here instead. max-height is the only thing
   those call sites ever write to the attribute. *}
<script>
  {literal}
  (function () {
    "use strict";

    var SELECTOR = ".round-selection-body, .team-selection-body";

    function strip(el) {
      if (el && el.hasAttribute("style") && /max-height/i.test(el.getAttribute("style"))) {
        el.removeAttribute("style");
      }
    }

    function stripAll(root) {
      var nodes = root.querySelectorAll(SELECTOR);
      for (var i = 0; i < nodes.length; i++) strip(nodes[i]);
    }

    function init() {
      var root = document.querySelector(".final-result-container");
      if (!root) return;

      stripAll(root);

      // The cap is written when a round is selected and whenever the result
      // screen is rebuilt, so watching the attribute is what keeps it off.
      // Removing it re-fires the observer, but the guard in strip() makes that
      // second pass a no-op rather than a loop.
      new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          var t = records[i].target;
          if (t.nodeType === 1 && t.matches && t.matches(SELECTOR)) strip(t);
        }
      }).observe(root, { attributes: true, attributeFilter: ["style"], subtree: true });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
  {/literal}
</script>
