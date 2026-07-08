<script>
  (function() {
      // Step 1: Load AdThrive first (it will load GPT internally)
      function loadAdThrive() {
        return new Promise((resolve) => {
          {if $shouldLazyloadAdthrive}
            window.adthrive = window.adthrive || {};
            window.adthrive.cmd = window.adthrive.cmd || [];
            window.adthrive.plugin = 'adthrive-ads-manual';
            window.adthrive.host = 'ads.adthrive.com';

            var adthriveSrc = "https://" + window.adthrive.host +
              "/sites/5e163f2211916d4860b8f332/ads.min.js?referrer=" +
              window.encodeURIComponent(window.location.href) + "&cb=" + (Math.floor(Math.random() * 100) + 1);

            asyncScriptLoader({
              src: adthriveSrc,
              onUserInteraction: true,
              loadWithDefer: true,
            });
            resolve();
          {else}
            window.adthrive = window.adthrive || {};
            window.adthrive.cmd = window.adthrive.cmd || [];
            window.adthrive.plugin = 'adthrive-ads-manual';
            window.adthrive.host = 'ads.adthrive.com';

            var s = document.createElement('script');
            s.async = true;
            s.defer = true;
            s.referrerpolicy = 'no-referrer-when-downgrade';
            s.src = 'https://' + window.adthrive.host + '/sites/5e163f2211916d4860b8f332/ads.min.js?referrer=' +
              window.encodeURIComponent(window.location.href) + '&cb=' + (Math.floor(Math.random() * 100) + 1);
            s.onload = resolve;
            s.onerror = resolve; // Resolve even on error to prevent hanging

            var n = document.getElementsByTagName('script')[0];
            if (n && n.parentNode) {
              n.parentNode.insertBefore(s, n);
            } else {
              // Fallback: append to head or body
              (document.head || document.body || document.documentElement).appendChild(s);
            }
          {/if}
        });
      }

      // Step 2: Wait for GPT to be available (loaded by AdThrive)
      function waitForGPT() {
        return new Promise((resolve) => {
          if (window.googletag && window.googletag.apiReady) {
            resolve();
            return;
          }

          var checkInterval = setInterval(function() {
            if (window.googletag && window.googletag.apiReady) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);

          // Timeout after 10 seconds
          setTimeout(function() {
            clearInterval(checkInterval);
            resolve();
          }, 10000);
        });
      }

      // Step 3: Initialize video player
      function initVideoPlayer() {
        var COOKIE_NAME = 'pfn_video_player_segment';
        var COOKIE_DAYS = 365;

        function getVideoPlayerCookie(name) {
          var safe = name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1');
          var m = document.cookie.match(new RegExp('(?:^|; )' + safe + '=([^;]*)'));
          return m ? decodeURIComponent(m[1]) : null;
        }

        function setVideoPlayerCookie(name, value, days) {
          var expires = '';
          if (days) {
            var d = new Date(Date.now() + days * 864e5);
            expires = '; expires=' + d.toUTCString();
          }
          var isHttps = location.protocol === 'https:';
          document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax' + (isHttps ?
            '; Secure' : '');
        }

        function getOrCreateSegment() {
          var v = parseInt(getVideoPlayerCookie(COOKIE_NAME), 10);
          if (!isNaN(v) && v >= 1 && v <= 100) return v;
          v = Math.floor(Math.random() * 100) + 1;
          setVideoPlayerCookie(COOKIE_NAME, String(v), COOKIE_DAYS);
          return v;
        }

        function loadSTN(target) {
          window.addEventListener("load", function() {
            if (typeof gtag === "function") {
              console.log("gtag triggered for stn");
              gtag('event', 'STN_Player_Segment', { 'page_url': window.location.href });
            }
          });
          console.log('stn player loaded');

          var playerDiv = document.createElement('div');
          playerDiv.className = 's2nPlayer z6poo5gh';
          playerDiv.setAttribute('data-type', 'float');
          target.appendChild(playerDiv);

          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = 'https://embed.sendtonews.com/player3/embedcode.js?fk=z6poo5gh';
          s.setAttribute('data-type', 's2nScript');
          target.appendChild(s);
        }

        function loadPrimis(target) {
          window.addEventListener("load", function() {
            if (typeof gtag === "function") {
              gtag("event", "Primis_Player_Segment", { page_url: window.location.href });
            }
          });

          var script = document.createElement("script");
          script.async = true;
          script.src = "https://live.primis.tech/live/liveView.php?s=120789&cbuster=%%CACHEBUSTER%%";

          if (target) {
            target.appendChild(script);
          } else {
            (document.body || document.head).appendChild(script);
          }
        }

        var target = document.getElementById('video-player-container');
        if (!target) return;

        if (typeof removeClass === 'function') {
          removeClass(target, "hidden");
        } else {
          target.classList.remove("hidden");
        }

        loadSTN(target);

      //   var segmentValue = getOrCreateSegment();
      //   if (segmentValue <= 50) {
      //     loadSTN(target);
      //   } else {
      //     if ("{$is_desktop}") {
      //     loadPrimis(target);
      //   } else {
      //     loadPrimis();
      //     target.remove();
      //   }
      // }
    }

    // Execute in sequence: AdThrive → Wait for GPT → Video Player
    loadAdThrive()
    .then(() => waitForGPT())
    .then(() => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoPlayer);
      } else {
        initVideoPlayer();
      }
    })
    .catch((err) => console.error('Script loading error:', err));
  })();
</script>
