<style>
  {if $is_desktop}
    #ad-banner-container {
      background-color: #ededed;
      height: 105px;
      position: fixed;
      top: 93px;
      width: 100%;
      z-index: 10000;
      overflow: hidden;
    }

    .pfn-content-container {
      margin-top: 0;
    }

  {/if}

  /* .pfn-content-wrapper's top margin otherwise collapses out through <main> and <body>.
     When Voltax injects its player as body's first child post-load, the margin gets
     re-captured and the body box grows by that margin in one go (~0.15 CLS on mobile).
     A block formatting context on <main> keeps the margin inside from the first paint. */
  .sk-proxied-page {
    display: flow-root;
  }

  .start-draft-btn {
    border-radius: 6px;
  }

  /* The CTA is gold at every width and on both hosts, so the two entry points
     never disagree. theme.tpl already does this above 768 on the desktop host,
     but it is gated on that edge and is not emitted to m.* at all -- so the
     green showed through on mobile and on a narrowed window.

     Scoped to the tool's own body class, not pfn-has-sidebar-nav: that class is
     on both hosts now, but the widget renders through a bare <body> and keeps
     the green it has. body.mockdraft-simulator comes from the tool variable
     third-party/proxy/index.tpl prints onto the body element.

     Ink, not white: #FFD166 is a light face, so white text sits at ~1.7:1
     against it while ink is ~12:1. Colour only -- nothing here moves a box. */
  body.mockdraft-simulator .start-draft-btn {
    background: #FFD166;
    color: #080A3C;
  }

  .team-selection-container {
    max-width: 532px;
  }

  /* ==========================================================================
     Everything from here to the mobile block is the revamp, reserved at first
     paint, and it is gated on the mobile edge for the same reason theme.tpl is:
     below 768 the tool's own mobile stylesheet renders the screen and this must
     be entirely out of its way.
     ========================================================================== */
  {* The revamp reservations below are desktop-host only. The shell ships to
     m.* now, so pfn-has-sidebar-nav is on the body there too -- and that class
     is all that gates these rules. Expressed as a condition on the query
     itself rather than a Smarty wrapper around the block: the block is ~170
     lines and its closing brace is easy to wrap on the wrong side, which emits
     a stray } and silently truncates the rest of the stylesheet. *}
  @media (min-width: {if $is_desktop}768{else}99999{/if}px) {

  /* ------------------------------------------------------------------
     Draft Settings panel, reserved at first paint.

     theme.tpl turns the rounds/speed radios into a segmented control: the
     input is taken out of flow and its label becomes a bordered 40px pill.
     Before that arrives each row is a native radio beside inline text and is
     18px tall, so the panel painted 173px short and the Enter Draft button
     jumped 166px down the page once theme.tpl landed -- the largest single
     shift on the screen.

     Only the box is reserved here. Colour, the :checked treatment and the
     hover states stay in theme.tpl; they can arrive late without moving
     anything.
     ------------------------------------------------------------------ */
  body.pfn-has-sidebar-nav .simulator-content-holder .filters-container {
    display: flex;
    flex-direction: column;
  }

  body.pfn-has-sidebar-nav .filters-container .inputs-container {
    flex: 1;
    gap: 0;
  }

  body.pfn-has-sidebar-nav .rounds-input-container,
  body.pfn-has-sidebar-nav .speed-input-container,
  body.pfn-has-sidebar-nav .players-list-selection-container,
  body.pfn-has-sidebar-nav .inputs-container .custom-draft-order-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 0;
    /* Literal --mds-border; the tokens are declared in theme.tpl and are not
       available this early. */
    border-bottom: 1px solid #DCE4F5;
  }

  body.pfn-has-sidebar-nav .rounds-input-container {
    padding-top: 2px;
  }

  /* The base rule centres this container's children; as a column that pushes
     the label off the left edge the other three groups line up on. */
  body.pfn-has-sidebar-nav .inputs-container .custom-draft-order-container {
    border-bottom: none;
    align-items: stretch;
  }

  body.pfn-has-sidebar-nav .inputs-container .custom-draft-order-container .custom-draft-order-container-holder {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  body.pfn-has-sidebar-nav .custom-draft-order-container .customize-draft-order-btn {
    width: 100%;
    /* Left-aligned, same padding and border as the Big Board select: this is a
       control that opens a panel, not a second call to action under the real
       one. */
    text-align: left;
    padding: 9px 12px;
    border: 1px solid #DCE4F5;
    line-height: 20px;
  }

  body.pfn-has-sidebar-nav .inputs-container .players-list-selection-container {
    align-items: stretch;
  }

  body.pfn-has-sidebar-nav .inputs-container .players-list-selection-container-holder,
  body.pfn-has-sidebar-nav .inputs-container .year-list-selection-container-holder {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  body.pfn-has-sidebar-nav .players-list-selection-container select,
  body.pfn-has-sidebar-nav .year-list-selection-container select {
    width: 100%;
  }

  body.pfn-has-sidebar-nav .start-draft-btn {
    margin-top: auto;
  }

  body.pfn-has-sidebar-nav .number-of-rounds,
  body.pfn-has-sidebar-nav .draft-speed {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  body.pfn-has-sidebar-nav .radio-input {
    flex: 1 1 auto;
    display: block;
    min-height: 0;
  }

  body.pfn-has-sidebar-nav .radio-input br {
    display: none;
  }

  body.pfn-has-sidebar-nav .radio-input input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  body.pfn-has-sidebar-nav .radio-input label {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 9px 10px;
    border: 1px solid #DCE4F5;
    line-height: 20px;
  }

  body.pfn-has-sidebar-nav .teams-container .teams-header {
    padding: 6px 0;
  }

  /* The landing block's 1440px cap only provides a gutter above ~1700px of
     viewport; below that the tool ran edge to edge. Below the mobile edge the
     mobile stylesheet owns the padding, and everything here is gated above it. */
  body.pfn-has-sidebar-nav .simulator-content-container {
    padding-left: 24px;
    padding-right: 24px;
  }

  body.pfn-has-sidebar-nav .final-result-container,
  body.pfn-has-sidebar-nav .draft-simulation-container {
    width: 100%;
  }

  /* The eyebrow headers on the settings panel and the menu rail pick up a 3px
     gold rule under the chrome gradient, which is 3px of height each. */
  body.pfn-has-sidebar-nav .text-filter,
  body.pfn-has-sidebar-nav .draft-option-btns-container .draft-btns-heading {
    border-bottom: 3px solid #FFD166;
  }

  /* Both also become tracked uppercase, which is what sets their width -- the
     MENU cap goes 54px to 63px on that alone. */
  body.pfn-has-sidebar-nav .text-filter,
  body.pfn-has-sidebar-nav .draft-option-btns-container .draft-btns-heading {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  /* The two native selects become pills the same size as the radio labels:
     9px + 20px line box + 9px + two 1px borders = 40px, up from the 20px a
     bare select occupies. */
  body.pfn-has-sidebar-nav .players-list-selection-container select,
  body.pfn-has-sidebar-nav .year-list-selection-container select {
    appearance: none;
    -webkit-appearance: none;
    padding: 9px 34px 9px 12px;
    border: 1px solid #DCE4F5;
    line-height: 20px;
  }

  {if $is_desktop}
  /* ------------------------------------------------------------------
     Landing geometry, reserved at first paint.

     Everything that decides the shape of the landing screen lives here
     rather than in theme.tpl. The tool's own stylesheet and theme.tpl are
     later fragments, parsed only after the render-blocking axios script in
     home/js.tpl -- so the landing painted at its old 985px width with two
     chip columns, then snapped to 1440px with four once those fragments
     arrived.

     This file is parsed before any of that, so the first paint is already
     the final layout. These rules are body-scoped precisely because they
     come first: `body.pfn-has-sidebar-nav ...` outranks the plain
     `.landing-page-container` and `.team-holder` rules that follow, so
     order does not matter and specificity does the work.

     Only things that move boxes belong here. That includes a few rules whose
     intent is cosmetic -- font sizes, paddings, a border width -- because a
     type step that lands late moves everything under it just as surely as a
     width does. Colour and state (hover, :checked, shadows) stay in theme.tpl
     and can arrive whenever.
     ------------------------------------------------------------------ */
    /* The tool ships `width: 985px`; the sidebar layout has room for far
       more, and the prose below the tool already runs the full column. */
    body.pfn-has-sidebar-nav .simulator-content-container .landing-page-container {
      width: 100%;
      max-width: 1440px;
    }

    /* This 532px cap, not the 985px above, was what actually pinned the team
       column narrow. */
    body.pfn-has-sidebar-nav .team-selection-container {
      max-width: none;
      width: auto;
      min-width: 0;
      /* Content height. `flex: 1 1 0` is for the side-by-side case and is set
         at 1024 -- in the stacked column it starts this panel at zero height
         and gives it only what the settings panel leaves, which came out as
         46px with the team grid collapsed behind it. */
      flex: 0 0 auto;
    }

    /* The two conference boxes are flex items with no grow, so they used to
       take their width from the 47% chips inside them. Once the chips stop
       carrying an intrinsic width the boxes shrink-wrap to a single column. */
    body.pfn-has-sidebar-nav .team-selection-container .afc-teams-container,
    body.pfn-has-sidebar-nav .team-selection-container .nfc-teams-container {
      flex: 1 1 0;
      min-width: 0;
    }

    /* The chips were `width: 47%` in a flex-wrap box -- two columns at any
       width, with the extra space going into the gap rather than the chips.
       As a grid they pick their own column count: three per conference at
       this width, four if the conference box ever gets past ~404px inside.

       The gap has to match the 12px theme.tpl settles on. This rule was
       written with 8px, which a later rule in that file raises -- and a gap
       that disagrees here is a shift. */
    body.pfn-has-sidebar-nav .teams-container .teams-holder {
      display: grid;
      /* Explicit counts, not auto-fill. 16 teams divide cleanly into 4 rows of
         four or 8 rows of two; three across leaves five full rows and a single
         orphan on a sixth, which auto-fill was picking across a ~200px band of
         widths. Two is the floor here; the 1600px rule below takes it to four
         once the conference box is wide enough to keep the chips legible. */
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      padding: 12px;
      /* Not `start`: whatever height the settings panel leaves over gets
         spread across the chip rows rather than pooling as white under the
         last one. When the grid is the taller of the two columns there is no
         leftover and this does nothing. The two `flex` rules below are what
         carry that height down from the selection panel to here. */
      align-content: stretch;
    }

    body.pfn-has-sidebar-nav .team-selection-container .teams-container {
      flex: 1 1 auto;
      min-height: 0;
    }

    body.pfn-has-sidebar-nav .afc-teams-container .teams-holder,
    body.pfn-has-sidebar-nav .nfc-teams-container .teams-holder {
      flex: 1 1 auto;
      min-height: 0;
    }

    body.pfn-has-sidebar-nav .teams-container .teams-holder .team-holder {
      width: auto;
      min-width: 0;
    }

    /* At the very bottom of the desktop range two tracks come out around 79px,
       and a flex item's default min-width:auto floors an <img> at its own
       intrinsic width -- so the crest and the abbreviation overflowed the chip
       rather than tightening up. Only bites when the space is genuinely short;
       height is auto, so it scales rather than squashing. */
    body.pfn-has-sidebar-nav .teams-container .teams-holder .team-logo {
      min-width: 0;
    }

    /* The menu rail was 75px, which left "Multiplayer" and "Dashboard"
       filling their line edge to edge. Scoped to this breakpoint: on mobile
       the rail is a horizontal bar across the top and must not be 118px
       wide. Note it is coupled to the grid above -- the rail's width comes
       out of the team area, and four columns only fit while the conference
       boxes stay above ~400px inner width. */
    /* Menu bar, not a menu rail -- see the section 21 banner in theme.tpl.
       Reserved here because it decides the shape of the whole landing block:
       a column with a 44px bar across the top rather than a row with a 118px
       gutter down the left. */
    body.pfn-has-sidebar-nav .simulator-content-container .landing-page-container {
      flex-direction: column;
    }

    body.pfn-has-sidebar-nav .landing-page-container .draft-option-btns-container {
      width: 100%;
      flex: 0 0 auto;
      flex-direction: row;
      align-items: stretch;
      /* The tool's own `max-width: 768px` block puts this bar out of flow at
         50px tall, and it is inclusive -- so at exactly 768, the first pixel
         of the tablet band, both it and this rule apply. Put it back in flow. */
      position: static;
      height: auto;
    }

    body.pfn-has-sidebar-nav .draft-option-btns-container .draft-btns-heading {
      display: flex;
      align-items: center;
    }

    body.pfn-has-sidebar-nav .draft-option-btns-container .draft-option-btn {
      flex: 1 1 0;
      min-width: 0;
      flex-direction: row;
      justify-content: center;
      gap: 10px;
      padding: 12px 16px;
    }

    body.pfn-has-sidebar-nav .draft-option-btn .new-text {
      position: static;
      /* theme.tpl puts the badge on gold at 700; bold is 1px wider than the
         400 it starts at, and 1px is still a shift. */
      font-weight: 700;
    }

    /* The selected tab's pointer. The tool builds a 40x56 wedge aimed right,
       at the panel the rail used to stand beside; theme.tpl turns it into a
       16x7 one aimed down at the lobby below. Reserved because otherwise a
       40x56 blue wedge paints across the bar and then collapses. The colour
       stays in theme.tpl -- only the box is needed here. */
    body.pfn-has-sidebar-nav .draft-option-btn .triangle-right {
      left: 50%;
      top: auto;
      bottom: -7px;
      transform: translateX(-50%);
      border-top: 7px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: none;
      border-left: 8px solid transparent;
    }

    /* Tablet portrait stacks the lobby. The settings panel has a 320px floor,
       which out of a 696px lobby leaves 322px for both conference boxes --
       chips come out 46px wide, which is smaller than the crest inside them.
       Stacked, the teams get the full width and the settings panel takes
       whatever the screen has.

       Settings on top wherever this lobby stacks -- you pick rounds and speed
       before you pick a team, and scrolling a 32-chip grid to reach them reads
       backwards. Done with `order` rather than column-reverse because there
       are three children now, not two: reversing would put the CTA first.
       Above 1024 it turns back into a row. */
    body.pfn-has-sidebar-nav .draft-options-view-container .teams-filters-container {
      flex-direction: column;
      align-items: stretch;
      /* The CTA wraps to its own full-width line in the 1024-1365 row. */
      flex-wrap: wrap;
    }

    body.pfn-has-sidebar-nav .teams-filters-container .filters-container {
      order: 1;
    }

    body.pfn-has-sidebar-nav .teams-filters-container .team-selection-container {
      order: 2;
    }

    body.pfn-has-sidebar-nav .teams-filters-container > .start-draft-btn {
      order: 3;
      width: 100%;
    }

    /* One CTA at a time. Below the desktop edge the lobby's own button sits
       under the teams, as it does on m.*; the copy inside the Draft Settings
       card is the desktop one and waits its turn. */
    body.pfn-has-sidebar-nav .filters-container .start-draft-btn {
      display: none;
    }

    /* The view box took its height from the landing block; stacked, its
       content is taller than that. */
    body.pfn-has-sidebar-nav .simulator-content-container .draft-options-view-container {
      height: auto;
    }

  /* Tablet landscape and up: side by side again, and each panel takes its own
     height. Stretched to match, whichever one is shorter has to put the
     difference somewhere -- and with square chips the team grid cannot absorb
     it in its rows, so it showed up as a band above and below the crests. A
     card that ends where its content ends reads as a card; a card with a void
     in it reads as broken. */
  @media (min-width: 1024px) {
    body.pfn-has-sidebar-nav .draft-options-view-container .teams-filters-container {
      flex-direction: row;
      /* Equal height, not each hugging its own content: side by side, two
         cards ending at different points reads as a mistake rather than as
         two cards. The settings panel anchors its CTA with margin-top:auto,
         so the extra height puts the button at the foot of the card where it
         belongs, and the team grid spreads its rows into the slack via
         align-content on .teams-holder. */
      align-items: stretch;
    }

    body.pfn-has-sidebar-nav .team-selection-container {
      flex: 1 1 0;
    }

    /* The stacked bands put settings first with `order`; in a row that would
       move the whole panel to the left of the teams. Source order is teams,
       settings, CTA -- which is what the row wants -- so hand it back. */
    body.pfn-has-sidebar-nav .teams-filters-container .filters-container,
    body.pfn-has-sidebar-nav .teams-filters-container .team-selection-container,
    body.pfn-has-sidebar-nav .teams-filters-container > .start-draft-btn {
      order: 0;
    }

    /* The CTA follows the layout, not a width: the moment the two panels sit
       side by side there is no "below the teams" to be below, and a full-width
       button under both leaves a void at the foot of the settings card. So it
       goes back inside that card, anchored to its bottom by margin-top:auto,
       and the lobby's own copy stands down.

       These two have to come after the 768 region above, which hides the
       in-panel copy -- a media query adds no specificity, so source order is
       what decides it. */
    body.pfn-has-sidebar-nav .teams-filters-container > .start-draft-btn {
      display: none;
    }

    body.pfn-has-sidebar-nav .filters-container .start-draft-btn {
      display: flex;
    }
  }


    /* The lobby panel was bordered on three sides against a rail on its left;
       with the bar above it the open side is the top. Same three borders
       either way, but on different edges, so it has to be reserved. */
    body.pfn-has-sidebar-nav .simulator-content-container .draft-options-view-container {
      border-left: 1px solid #C0D0ED;
      border-top: none;
    }

    body.pfn-has-sidebar-nav .text-filter {
      font-size: 15px;
      line-height: 20px;
      padding: 10px 12px;
    }

    body.pfn-has-sidebar-nav .draft-option-btn span {
      font-size: 13px;
      line-height: 16px;
    }

    /* Type and padding steps that theme.tpl applies at this breakpoint. They
       are cosmetic in intent but they size boxes, so they have to be reserved
       here too. */
    body.pfn-has-sidebar-nav .team-selection-container {
      padding: 22px;
      gap: 14px;
    }

    body.pfn-has-sidebar-nav .team-holder {
      padding: 12px 10px;
    }

    body.pfn-has-sidebar-nav .team-holder .team-name {
      font-size: 16px;
      line-height: 22px;
      /* Worth a line here even though it is pure cosmetics: on a three-letter
         abbreviation the tracking is the difference between a 30px and a 31px
         text box. */
      letter-spacing: 0.02em;
    }

    body.pfn-has-sidebar-nav .filters-container .inputs-container {
      padding: 22px 24px;
      gap: 22px;
    }

    body.pfn-has-sidebar-nav .selection-text {
      font-size: 20px;
      line-height: 26px;
    }

    body.pfn-has-sidebar-nav .text-all {
      font-size: 16px;
    }

    body.pfn-has-sidebar-nav .rounds-selection-text,
    body.pfn-has-sidebar-nav .speed-selection-text,
    body.pfn-has-sidebar-nav .list-selection-text {
      font-size: 17px;
      line-height: 22px;
      font-weight: 500;
    }

    body.pfn-has-sidebar-nav .inputs-container label {
      font-size: 15px;
      line-height: 20px;
    }

    /* The 636px min-height on the landing block cascades down through
       `min-height: inherit`, so every column held that height. With four
       chips per row and the CTA at the foot of the settings panel, keeping
       it would just move the dead space to the bottom of each column. */
    body.pfn-has-sidebar-nav .simulator-content-container .landing-page-container,
    body.pfn-has-sidebar-nav .draft-options-view-container,
    body.pfn-has-sidebar-nav .teams-filters-container,
    body.pfn-has-sidebar-nav .team-selection-container,
    body.pfn-has-sidebar-nav .filters-container {
      min-height: 0;
    }

  /* Stacked chips. 1520, not the desktop edge -- four square chips need a
     76px track and 1366 only gives 63px. See the 20b banner in theme.tpl.
     Reserved here because the chip's height changes from 58px to ~90px,
     which moves the whole panel. */
  @media (min-width: 1520px) {
    body.pfn-has-sidebar-nav .teams-container .teams-holder {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      /* Leftover height goes into the row gaps, not into bands above and
         below the grid. See the matching note in theme.tpl. */
      align-content: space-between;
    }

    body.pfn-has-sidebar-nav .teams-container .teams-holder .team-holder {
      flex-direction: column-reverse;
      justify-content: center;
      gap: 6px;
      /* Square, tied to whatever the track works out to. Stretched rows made
         these 95x107 -- close enough to square to read as a botched square
         rather than a deliberate rectangle. */
      aspect-ratio: 1 / 1;
      /* Tighter than the 12px 10px the row chip takes. A square chip is only
         as tall as its track is wide, so the padding is part of what decides
         how early four columns can fit: at 8px the stacked content comes to
         76px against the 82px track 1520 gives, which is enough slack to
         survive a font fallback. */
      padding: 8px;
    }

    body.pfn-has-sidebar-nav .teams-container .teams-holder .team-logo {
      width: 44px;
    }
  }

  {/if}
  }

  {if $is_desktop}
    /* ------------------------------------------------------------------
       Below the mobile edge on the desktop host, reserved at first paint.

       The tool picks its MARKUP by hostname, not width -- home/pfn/index.tpl
       includes desktop.tpl or mobile.tpl -- so a narrowed desktop window
       renders the desktop DOM under the mobile stylesheet. The rules that
       sheet uses to release desktop-only sizing target markup that is not
       there, so min-height:636px on the landing block survives and the menu
       bar inherits it through min-height:inherit.

       This has to be here rather than in styles.tpl: that fragment is parsed
       after the render-blocking axios script in home/js.tpl, so releasing it
       there painted a 636px bar and snapped it to 50px -- 22 elements moving
       on load. Same reason the rest of this file exists.
       ------------------------------------------------------------------ */
    @media (max-width: 767px) {
      /* --tab-width caps .content and everything in it at 600px below the
         mobile edge. On a phone that cap never binds, because the viewport is
         narrower than it. In a desktop window between 601px and 767px it does:
         the tool paints a 600px column inside a wider window, while the draft
         screen's toolbar -- fixed, and so no longer laid out by .content --
         keeps spanning the full width, and the two disagree by up to 167px.
         Track the window here, the way every band above this one does. */
      body.pfn-has-sidebar-nav .pfn-content-container .content,
      body.pfn-has-sidebar-nav .pfn-content-container .content > * {
        max-width: 100%;
      }

      body.pfn-has-sidebar-nav .simulator-content-container .landing-page-container,
      body.pfn-has-sidebar-nav .landing-page-container .draft-option-btns-container,
      body.pfn-has-sidebar-nav .draft-options-view-container,
      body.pfn-has-sidebar-nav .teams-filters-container,
      body.pfn-has-sidebar-nav .team-selection-container,
      body.pfn-has-sidebar-nav .filters-container {
        min-height: 0;
      }

      /* The mobile sheet drops the holder's 20px bottom margin, and it is the
         last 20px of page height to settle. */
      body.pfn-has-sidebar-nav .simulator-content-holder {
        margin: unset;
      }

      /* ----------------------------------------------------------------
         Three things the desktop markup has that the mobile markup does
         not. home/pfn/mobile.tpl carries neither the "Menu" cap nor the
         selected-tab pointer -- they are absent from the DOM, not hidden --
         and it includes simulation-input BEFORE teams. The desktop DOM is
         what renders here, so CSS has to stand in for all three.
         ---------------------------------------------------------------- */
      body.pfn-has-sidebar-nav .draft-option-btns-container .draft-btns-heading,
      body.pfn-has-sidebar-nav .draft-option-btn .triangle-right {
        display: none;
      }

      /* Settings above teams, as the mobile markup orders them, with the CTA
         last. `order` rather than column-reverse: there are three children
         here now and reversing would put the button first. Same arrangement
         as the 768-1365 band above. */
      body.pfn-has-sidebar-nav .draft-options-view-container .teams-filters-container {
        flex-direction: column;
      }

      body.pfn-has-sidebar-nav .teams-filters-container .filters-container {
        order: 1;
      }

      body.pfn-has-sidebar-nav .teams-filters-container .team-selection-container {
        order: 2;
      }

      body.pfn-has-sidebar-nav .teams-filters-container > .start-draft-btn {
        order: 3;
        width: 100%;
      }

      body.pfn-has-sidebar-nav .filters-container .start-draft-btn {
        display: none;
      }

      /* The 150px band above the settings panel is the desktop top-ad slot.
         common/sidebar-nav/styles.tpl reserves it deliberately, so the ad
         script's injected div does not shift the page -- but the slot is a
         sibling of .header-wrapper, not a child, so match it the way that
         file does.

         Hidden rather than released. third-party/proxy/pfn/index.tpl emits
         this slot only on the desktop host, so the mobile host never has it at
         all; a window narrowed past the mobile edge should match that. It was previously only released to min-height:0 so
         that a fill would still render and count, but a desktop unit does not
         fill a 430px viewport, and the tool's own mobile design hides its top
         ad outright anyway (hide_mobile_top_adv_container). The trade is that a
         fill here now goes unseen below 768px. */
      body.pfn-has-sidebar-nav .has-sidebar-nav > .desktop-tools-top-adv-container {
        display: none;
      }

      /* The menu bar back into flow, so it sits above the settings and sticks
         on scroll instead of floating over the hero. It can only be in flow if
         its parent is a column -- as a row it becomes a gutter beside the
         lobby, which is what broke when this was tried before. 36px is the
         fixed topbar it parks under. */
      body.pfn-has-sidebar-nav .simulator-content-container .landing-page-container {
        flex-direction: column;
      }

      body.pfn-has-sidebar-nav .landing-page-container .draft-option-btns-container {
        position: sticky;
        top: 36px;
        margin-bottom: 12px;
      }
    }
  {/if}

  /* Mobile: on the desktop host this stops one pixel short of the
     tablet-portrait edge, because max-width:768 and min-width:768 both match
     at exactly 768 and the two blocks disagree. The mobile host has no tablet
     band and keeps the inclusive 768 it always had. */
  @media (max-width: {if $is_desktop}767{else}768{/if}px) {
    /* A shorter hero and promo bar for this tool, so the board starts higher
       up the screen.

       Both live in common/sidebar-nav/styles.tpl and are shared by every PFN
       tool with the sidebar, so the body class keeps the change to MDS. They
       are also the first two things painted above the tool: setting their
       height in styles.tpl -- the last fragment, parsed after the
       render-blocking axios script -- would paint 80px and 55px first and then
       pull everything below up, so it is reserved here instead.

       The hero is one element carrying both classes. Its content comes to a
       21px title over a 14px timestamp -- the timestamp loses its 4px top
       padding and its line-height is set explicitly rather than inherited --
       which leaves room inside the 40px. */
    body.mockdraft-simulator .pfn-hero-banner {
      height: 40px;
    }

    body.mockdraft-simulator .pfn-hero-banner .updated-timestamp-container {
      padding-top: 0;
      line-height: 14px;
      min-height: 14px;
    }

    /* Qualified by .pfn-hero-banner on purpose: .header-container is a generic
       class and the result-screen dashboard has four more of them in its
       widgets, which keep the 4px third-party/proxy/pfn/styles.tpl gives them.
       The rule at common/sidebar-nav/styles.tpl:189 that looks like it already
       zeroes this is on .header-text, a sibling. */
    body.mockdraft-simulator .pfn-hero-banner .header-container {
      margin-bottom: 0;
    }

    body.mockdraft-simulator .pfn-promo-bar {
      height: 24px;
    }

    /* Below 1200px the CTA is hidden and the nav links are all the bar holds.
       They carry 10px of vertical padding, which at 37px does not come close
       to fitting -- dropping it leaves the 17px link text, which the bar's own
       align-items:center then centres in the 24px. */
    body.mockdraft-simulator .pfn-promo-bar .pfn-promo-nav-links {
      padding-top: 0;
      padding-bottom: 0;
    }

    /* third-party/proxy/pfn/styles.tpl caps .content at 412px on mobile; this tool releases
       it to --tab-width, but that override lives in styles.tpl -- the last fragment, parsed
       only after the render-blocking axios script in home/js.tpl. So the tool paints 412px
       wide and then snaps out to the viewport width. Reserve the final width up front.
       The var fallback covers the gap before home/styles.tpl declares --tab-width: 600px. */
    .pfn-content-container .content,
    .pfn-content-container .content > * {
      max-width: var(--tab-width, 600px);
    }

    .pfn-content-wrapper {
      margin-top: 125px;
    }

    .pfn-content-container {
      margin-top: calc(9vh + 20px);
      padding: 12px 0;
    }

    #ad-banner-container {
      width: 100%;
      background-color: #ededed;
      position: fixed;
      min-height: 52px;
      height: 9vh;
      top: unset;
      bottom: 0px;
      z-index: 10000;
    }

    #ad-banner-container .adthrive-draft-simulator-header {
      min-height: 52px;
    }

    .landing-page-container .draft-option-btns-container {
      top: 70px;
      padding: 2px 4px;
      box-shadow: 0px 6px 4px 0px #0000001A;
      background: #f5f5f5;
    }

    .draft-option-btns-container .draft-option-btn.selected {
      border-radius: 6px;
    }

    .pfn-content-container {
      padding: 0px;
      margin-top: calc(9vh + 20px);
    }

    .team-holder {
      min-height: 31px;
    }

    .teams-container .teams-header {
      min-height: 27px;
    }

    .filters-container {
      min-height: 212px;
    }

    /* Each .radio-input is a flex row holding a stray <br>, which becomes an anonymous
       flex item sized by the font strut: 18px on the fallback, 22px once Roboto swaps in.
       That grows every rounds/speed row by 4px and spreads the Draft Settings panel ~8px
       after load. Pin the settled height so the rows never resize. */
    .teams-filters-container .radio-input {
      min-height: 22px;
    }

    /* ----------------------------------------------------------------
       The menu bar under the sidebar shell.

       The shell replaces the old PFN header stack, so the bar cannot stay
       pinned at top:70px -- there it floats over the hero banner. It goes
       back into flow and sticks under the 36px topbar instead, which is what
       common/.../styles.tpl does for this case.

       In flow it becomes a flex ITEM of .landing-page-container, and that is
       a ROW: the bar turned into a 403px gutter beside a 244px lobby. The
       column is what makes an in-flow bar sit above the tool rather than
       beside it. Reserved here because styles.tpl is parsed after the
       render-blocking script and both of these move boxes.
       ---------------------------------------------------------------- */
    body.pfn-has-sidebar-nav .landing-page-container {
      flex-direction: column;
    }

    body.pfn-has-sidebar-nav .landing-page-container .draft-option-btns-container {
      position: sticky;
      top: 36px;
    }

    /* The Big Board row. styles.tpl lays this out unconditionally -- flex
       container, flex holder, 16px label, 14px select -- and that fragment is
       parsed after the render-blocking axios script in home/js.tpl. Unreserved,
       the row paints as a full-width block 20px tall, then shrink-wraps to
       181px and grows a pixel. That pixel pushes the Draft Settings panel, both
       conference boxes and all 32 chips down one -- 131 elements moving on the
       mobile host, and the same row was 21 of them on the desktop host.

       Unscoped on purpose: the mobile host carries no pfn-has-sidebar-nav
       class, so a body-scoped copy would miss the very case this is for. Same
       declarations as styles.tpl, only earlier -- that file still wins the
       cascade, it just finds nothing left to move. */
    .inputs-container .players-list-selection-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .inputs-container .players-list-selection-container .players-list-selection-container-holder {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 5px;
    }

    .players-list-selection-container .list-selection-text,
    .year-list-selection-container .list-selection-text {
      font-size: 16px;
      font-weight: 500;
    }

    .players-list-selection-container #players-lists,
    .year-list-selection-container #years-lists {
      font-size: 14px;
      font-weight: 400;
      border-radius: 6px;
    }
  }
</style>
