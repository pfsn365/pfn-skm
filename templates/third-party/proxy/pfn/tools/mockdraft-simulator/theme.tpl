{*
  ============================================================================
  Mock Draft Simulator -- sidebar-nav design layer.

  Loaded only by /sk-proxy/:brand/mockdraft-simulator (last fragment, after
  tools/mockdraft-simulator/styles.tpl) and scoped throughout to
  body.pfn-has-sidebar-nav. The widget renders through
  templates/pages/static/widgets/iframe/index.tpl with a bare <body>, and the
  SKM/CFN pages never set the class, so nothing here can reach them.

  The tool is two design eras stacked on each other. The original screens use
  #E9E9E9 and #999 hairlines, 2px radii and #D32F2F selections. The grades
  module bolted on later already speaks a modern language -- a neutral ramp
  (#e5e7eb / #6b7280 / #f9fafb), 8-10px radii, uppercase micro-labels at 700/800
  -- and its overall-grade banner is already #FFD166, the exact yellow of the
  new promo bar.

  So this layer does not import a foreign style. It takes the direction the
  tool was already evolving in, extends it across the older screens, and
  anchors it to two colours the product already owns:

  1. PFSN blue (#0050A0 -> #003A75) replaces the tool's stray blues (#0857C3,
     #0b56bf, #2563eb) and its navy chrome (#080A3C), so rail, hero, promo bar
     and tool are one system.

  2. Gold (#FFD166) runs on a three-step intensity ramp -- tint for context,
     border for what is happening now, solid for the headline result -- which
     is how the grade banner already used it.

  Structure follows: #E9E9E9/#2D2D2D hairlines move to the Playoff Predictor's
  #C0D0ED, radii settle on 8px for controls and 14px for panels, and the type
  scale steps up about one notch throughout.

  What is deliberately preserved, so it still reads as the same tool: the
  AFC/NFC conference red and navy, the green go-CTA, the A+-to-F grade colour
  scale, the pick-card anatomy and the two-column board.

  Desktop and mobile values are split on $is_desktop, matching how the
  component stylesheets in nfl-draft-simulator/common/ are built. Semantic
  colours are left alone: #37C77A stays confirm/accept and #D32F2F stays
  reject/urgent.
  ============================================================================
*}
<style>
  /* ==========================================================================
     The whole sheet is gated on the mobile edge.

     Below 768px the tool's own mobile stylesheet is what renders -- it became
     width-driven when the getMDS*MobileCSS functions stopped being gated on
     the hostname -- and the revamp has to be entirely out of its way, chrome
     included. Colours and gradients leaking under a layout they were not
     written for is what put a 600px blue slab where the menu bar should be.

     Nesting media queries inside this one is valid CSS and is how the
     breakpoints in section 0 still work.
     ========================================================================== */
  @media (min-width: 768px) {
  body.pfn-has-sidebar-nav {
    /* The blue the rail, hero and promo CTA already use. */
    --mds-accent: #0050A0;
    --mds-accent-deep: #003A75;
    --mds-accent-bright: #0A6FD8;
    --mds-accent-soft: #C0D0ED;

    /* The promo bar's yellow, plus the gold the pick timer already ran on. */
    --mds-gold: #FFD166;
    --mds-gold-deep: #E3B100;
    --mds-gold-tint: #FFF7E3;
    /* Gold that stays legible as text on white: #E3B100 is only ~2:1 there,
       this is ~5.1:1. */
    --mds-gold-text: #8A6A00;
    /* Button face. #FFD166 is light, so gold buttons take ink text (~12:1);
       white on gold would be ~1.7:1 and unreadable. */
    --mds-gold-btn-hover: #F7C245;

    --mds-ink: #080A3C;
    --mds-surface: #F6F7FF;
    --mds-border: #DCE4F5;

    /* The hero banner's gradient, reused for every piece of tool chrome. */
    --mds-chrome: linear-gradient(180deg, #0050A0 0%, #003A75 100%);

    /* The console's own surface. It is the largest single area on the draft
       screen and holds the least important content -- the board and the player
       pool are what you read, the actions are what you reach for once. So it
       is the quietest surface in the tool: a pale blue that separates it from
       the two white panels without asking to be looked at. */
    --mds-console: #EAF0F9;

    /* One easing curve and two durations for the whole tool, so every moving
       thing shares a physical character instead of each rule inventing one. */
    --mds-ease: cubic-bezier(0.2, 0.7, 0.3, 1);
    --mds-dur-fast: 120ms;
    --mds-dur: 200ms;

    --mds-radius-control: 8px;
    --mds-radius-panel: 14px;
    --mds-radius-card: 14px;

    --mds-shadow-card: 0 1px 2px rgba(8, 10, 60, 0.06), 0 6px 20px rgba(8, 10, 60, 0.08);
    --mds-shadow-popup: 0 8px 24px rgba(8, 10, 60, 0.16), 0 24px 64px rgba(8, 10, 60, 0.24);
    --mds-glow-accent: 0 2px 10px rgba(0, 80, 160, 0.35);
    --mds-glow-gold: 0 2px 10px rgba(227, 177, 0, 0.35);
  }

  /* ==========================================================================
     0. Breakpoints

     Four regimes, by viewport width:

       mobile             < 768px
       tablet portrait    768px  - 1023px
       tablet landscape   1024px - 1365px
       desktop           >= 1366px

     The layout switches at 768: below it the tool is the mobile app shell,
     at and above it the menu is a bar over a lobby that reflows. 1024 and
     1366 are declared here and carry no rules of their own yet -- the lobby
     scales continuously between them and has not needed a step.

     One query does not sit on an edge: the team grid goes four-wide at
     1520px, because that is the first width where four square chips actually
     fit. Section 20b has the measurements. It is a step inside the desktop
     band, not a fifth regime.

     CSS has no variables in media queries, so these are written out. If one
     moves, it moves in both files together.

     A note on which regime a device actually gets: $is_desktop here is not
     device detection, it is the hostname -- nginx sets DEVICE_TYPE per server
     and only m.* is "mobile". A tablet lands on the desktop host, so the
     width rules below are what shape it. The mobile host has its own app
     shell and is deliberately left out of the desktop-only blocks: at 768px
     and up they would otherwise reformat a tool already capped to
     --tab-width.
     ========================================================================== */

  /* ==========================================================================
     1. Accent unification -- #0857C3 -> the chrome's #0050A0
     ========================================================================== */

  body.pfn-has-sidebar-nav .draft-option-btns-container .draft-option-btn.selected,
  body.pfn-has-sidebar-nav .mypicks-btn-container .draft-result-btn.selected,
  body.pfn-has-sidebar-nav .mypicks-btn-container .my-picks-btn.selected,
  body.pfn-has-sidebar-nav .draft-result.selected,
  body.pfn-has-sidebar-nav .player-pool.selected,
  body.pfn-has-sidebar-nav .my-picks.selected,
  body.pfn-has-sidebar-nav .full-result-btn.selected,
  body.pfn-has-sidebar-nav .my-draft-btn.selected,
  body.pfn-has-sidebar-nav .dashboard-btn.selected,
  body.pfn-has-sidebar-nav .positions-filters .positions .selected,
  body.pfn-has-sidebar-nav .final-result-header .result-btns-holder button.selected,
  body.pfn-has-sidebar-nav .result-header {
    background: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .players-positions .positions.selected {
    color: var(--mds-accent);
    border-bottom: 3px solid var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .selected-user-teams-container .team-logo-btn-container.selected {
    border-bottom-color: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .selected-user-teams-container .team-logo-btn-container.selected .team-logo-btn,
  body.pfn-has-sidebar-nav .teams-result-container button.selected {
    border-color: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .picks-input-holder input:checked {
    accent-color: var(--mds-accent);
  }

  /* The selected menu button's pointer arrow has to track the button's fill. */
  body.pfn-has-sidebar-nav .draft-option-btn .triangle-right {
    border-left-color: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .add-player {
    background: var(--mds-accent);
    border-color: var(--mds-accent);
    color: #fff;
    box-shadow: var(--mds-glow-accent);
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  body.pfn-has-sidebar-nav .add-player:hover {
    background: var(--mds-accent-bright);
  }

  /* ==========================================================================
     2. Tool chrome -- the hero's gradient, ruled off in the promo bar's gold
     ========================================================================== */

  body.pfn-has-sidebar-nav .offer-header,
  body.pfn-has-sidebar-nav .trade-data-container .trade-data-header,
  body.pfn-has-sidebar-nav .trade-proposal-user-teams-conatiner .proposal-header,
  body.pfn-has-sidebar-nav .trade-proposal-all-teams-conatiner .proposal-header,
  body.pfn-has-sidebar-nav .team-needs-container .team-needs-header,
  body.pfn-has-sidebar-nav .team-picks-info-popup .team-picks-header,
  body.pfn-has-sidebar-nav .restart-confirmation-popup-container .confirmation-header,
  body.pfn-has-sidebar-nav .player-info-popup .player-info-header,
  body.pfn-has-sidebar-nav .trade-proposal-response-popup .trade-proposal-response-header,
  body.pfn-has-sidebar-nav .multi-user-remove-participants-popup .multi-user-remove-articipants-header,
  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-header,
  body.pfn-has-sidebar-nav .team-selections-holder .team-selections-header,
  body.pfn-has-sidebar-nav .draft-result-text,
  body.pfn-has-sidebar-nav .text-filter,
  body.pfn-has-sidebar-nav .draft-option-btns-container .draft-btns-heading {
    background: var(--mds-chrome);
    border-bottom: 3px solid var(--mds-gold);
  }

  /* Section labels sitting on that chrome become eyebrows. */
  body.pfn-has-sidebar-nav .text-filter,
  body.pfn-has-sidebar-nav .draft-option-btns-container .draft-btns-heading {
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  /* ==========================================================================
     3. Popups -- floating cards
     ========================================================================== */

  body.pfn-has-sidebar-nav .offer-container,
  body.pfn-has-sidebar-nav .trade-data-container,
  body.pfn-has-sidebar-nav .trade-proposal-user-teams-conatiner,
  body.pfn-has-sidebar-nav .trade-proposal-all-teams-conatiner,
  body.pfn-has-sidebar-nav .team-needs-container,
  body.pfn-has-sidebar-nav .team-picks-info-popup,
  body.pfn-has-sidebar-nav .restart-confirmation-popup-container,
  body.pfn-has-sidebar-nav .player-info-popup,
  body.pfn-has-sidebar-nav .trade-proposal-response-popup,
  body.pfn-has-sidebar-nav .multi-user-remove-participants-popup,
  body.pfn-has-sidebar-nav .custom-draft-order-popup,
  body.pfn-has-sidebar-nav .multi-user-info-container-popup {
    box-shadow: var(--mds-shadow-popup);
    /* Safe to clip: no descendant of these popups is positioned outside them,
       and it keeps headers whose own radius differs from the card's in line. */
    overflow: hidden;
  }

  /* The originals mix 6px, 11px and 12px top corners; one radius across the set. */
  body.pfn-has-sidebar-nav .offer-container,
  body.pfn-has-sidebar-nav .trade-data-container,
  body.pfn-has-sidebar-nav .trade-proposal-user-teams-conatiner,
  body.pfn-has-sidebar-nav .trade-proposal-all-teams-conatiner,
  body.pfn-has-sidebar-nav .team-needs-container,
  body.pfn-has-sidebar-nav .team-picks-info-popup,
  body.pfn-has-sidebar-nav .restart-confirmation-popup-container,
  body.pfn-has-sidebar-nav .player-info-popup,
  body.pfn-has-sidebar-nav .trade-proposal-response-popup,
  body.pfn-has-sidebar-nav .multi-user-remove-participants-popup,
  body.pfn-has-sidebar-nav .custom-draft-order-popup {
    border-radius: var(--mds-radius-card);
  }

  body.pfn-has-sidebar-nav .offer-header,
  body.pfn-has-sidebar-nav .trade-data-container .trade-data-header,
  body.pfn-has-sidebar-nav .trade-proposal-user-teams-conatiner .proposal-header,
  body.pfn-has-sidebar-nav .trade-proposal-all-teams-conatiner .proposal-header,
  body.pfn-has-sidebar-nav .team-needs-container .team-needs-header,
  body.pfn-has-sidebar-nav .team-picks-info-popup .team-picks-header,
  body.pfn-has-sidebar-nav .restart-confirmation-popup-container .confirmation-header,
  body.pfn-has-sidebar-nav .player-info-popup .player-info-header,
  body.pfn-has-sidebar-nav .trade-proposal-response-popup .trade-proposal-response-header,
  body.pfn-has-sidebar-nav .multi-user-remove-participants-popup .multi-user-remove-articipants-header,
  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-header {
    border-radius: var(--mds-radius-card) var(--mds-radius-card) 0 0;
  }

  /* The dimmers were flat 50% black; brand navy sits better under blue headers. */
  body.pfn-has-sidebar-nav .overlay,
  body.pfn-has-sidebar-nav .overlay2 {
    background: var(--mds-ink);
  }

  /* ==========================================================================
     3b. Customize Draft Order popup

     Later markup than the rest of the tool, so it was never added to the two
     lists above and kept the old palette on its own: a #2D2D2D header, a
     #E2E2E2 rule per row and #F4F4F4 arrow keys, under a gold-ruled blue
     header everywhere else in the tool. The card and the header are handled
     by sections 2 and 3 now; this is the inside of it.
     ========================================================================== */

  body.pfn-has-sidebar-nav .custom-draft-order-popup .close-custom-draft-order-btn {
    opacity: 0.85;
    transition: opacity var(--mds-dur) var(--mds-ease);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .close-custom-draft-order-btn:hover {
    opacity: 1;
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-info-text {
    color: #6B7490;
    padding: 14px 20px 10px;
    line-height: 18px;
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-row {
    border-bottom: 1px solid var(--mds-border);
    border-radius: var(--mds-radius-control);
    transition: background-color var(--mds-dur-fast) var(--mds-ease);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-row:hover {
    background: var(--mds-surface);
  }

  /* The last row's rule lands right on top of the footer's own border. */
  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-row:last-child {
    border-bottom-color: transparent;
  }

  /* Was a 50%-opacity grey, which reads as disabled rather than picked up.
     Gold is what marks the thing you are acting on everywhere else. */
  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-row.dragging {
    opacity: 1;
    background: var(--mds-gold-tint);
    box-shadow: inset 3px 0 0 var(--mds-gold-deep);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-number {
    color: var(--mds-ink);
    /* The list runs to 32 and the numbers are right-aligned in a fixed 28px
       column, so proportional digits made the column edge waver. */
    font-variant-numeric: tabular-nums;
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-team-name,
  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-current-team {
    color: var(--mds-ink);
    font-weight: 600;
  }

  /* On a traded pick this is the team that gave it up -- context, not the
     answer to "who picks here". */
  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-original-team {
    color: #8A93AD;
    font-weight: 500;
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-handle {
    background-image: linear-gradient(var(--mds-accent-soft) 2px, transparent 2px);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-row:hover .custom-draft-order-handle {
    background-image: linear-gradient(var(--mds-accent) 2px, transparent 2px);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-arrows button {
    border: 1px solid var(--mds-border);
    border-radius: var(--mds-radius-control);
    background: var(--mds-surface);
    color: #46506E;
    transition:
      background-color var(--mds-dur) var(--mds-ease),
      border-color var(--mds-dur) var(--mds-ease),
      color var(--mds-dur) var(--mds-ease);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-arrows button:hover {
    background: #fff;
    border-color: var(--mds-accent);
    color: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-popup .custom-draft-order-footer {
    padding: 14px 20px;
    border-top: 1px solid var(--mds-border);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-footer .custom-draft-order-reset-btn {
    border: 1px solid var(--mds-border);
    border-radius: var(--mds-radius-control);
    color: var(--mds-ink);
    transition:
      background-color var(--mds-dur) var(--mds-ease),
      border-color var(--mds-dur) var(--mds-ease),
      color var(--mds-dur) var(--mds-ease);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-footer .custom-draft-order-reset-btn:hover {
    background: var(--mds-surface);
    border-color: var(--mds-accent);
    color: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-footer .custom-draft-order-apply-btn {
    background: var(--mds-accent);
    border-radius: var(--mds-radius-control);
    box-shadow: var(--mds-glow-accent);
    font-weight: 600;
    transition:
      background-color var(--mds-dur) var(--mds-ease),
      transform var(--mds-dur-fast) var(--mds-ease);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-footer .custom-draft-order-apply-btn:hover {
    background: var(--mds-accent-bright);
  }

  body.pfn-has-sidebar-nav .custom-draft-order-footer .custom-draft-order-apply-btn:active {
    transform: translateY(1px);
  }

  /* The list is the one scroller in the tool that shows a default OS bar --
     the rules that thin the others were written before this popup existed. */
  body.pfn-has-sidebar-nav .custom-draft-order-list-container::-webkit-scrollbar {
    width: 6px;
  }

  body.pfn-has-sidebar-nav .custom-draft-order-list-container::-webkit-scrollbar-track {
    background: transparent;
  }

  body.pfn-has-sidebar-nav .custom-draft-order-list-container::-webkit-scrollbar-thumb {
    background: var(--mds-accent-soft);
    border-radius: 999px;
  }

  /* ==========================================================================
     4. Landing shell -- Playoff Predictor borders, opened-up boxes
     ========================================================================== */

  body.pfn-has-sidebar-nav .simulator-content-container .draft-options-view-container {
    background: var(--mds-surface);
    border-color: var(--mds-accent-soft);
  }

  body.pfn-has-sidebar-nav .landing-page-container .draft-option-btns-container {
    box-shadow: 2px 0 12px rgba(8, 10, 60, 0.10);
  }

  body.pfn-has-sidebar-nav .simulator-content-holder {
    border-radius: var(--mds-radius-panel);
    box-shadow: var(--mds-shadow-card);
  }

  /* The panel borders were #2D2D2D and #E2E2E2 hairlines -- near-black against
     white. Both move onto the Playoff Predictor's accent border. */
  body.pfn-has-sidebar-nav .team-selection-container,
  body.pfn-has-sidebar-nav .simulator-content-holder .filters-container {
    border: 1px solid var(--mds-accent-soft);
    border-radius: var(--mds-radius-panel);
    box-shadow: var(--mds-shadow-card);
  }

  body.pfn-has-sidebar-nav .team-selection-container .afc-teams-container,
  body.pfn-has-sidebar-nav .team-selection-container .nfc-teams-container {
    border-color: var(--mds-accent-soft);
    border-radius: var(--mds-radius-panel);
  }

  body.pfn-has-sidebar-nav .teams-container .teams-header {
    border-radius: var(--mds-radius-panel) var(--mds-radius-panel) 0 0;
    padding: 6px 0;
  }

  /* 2px corners were the single most dated thing on the landing screen. */
  body.pfn-has-sidebar-nav .team-holder {
    border: 1px solid var(--mds-border);
    border-radius: var(--mds-radius-control);
    transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
  }

  body.pfn-has-sidebar-nav .team-holder:hover:not(.selected) {
    border-color: var(--mds-accent-soft);
    background: var(--mds-surface);
  }

  body.pfn-has-sidebar-nav .draft-option-btns-container .draft-option-btn {
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  body.pfn-has-sidebar-nav .draft-option-btns-container .draft-option-btn:not(.selected):hover {
    background: var(--mds-surface);
    color: var(--mds-accent);
  }

  /* "New" flags move off red -- red reads as an error next to the reject
     buttons -- and onto the promo bar's gold. */
  body.pfn-has-sidebar-nav .draft-option-btn .new-text,
  body.pfn-has-sidebar-nav .bottom-controls .dashboard-btn .new-text {
    background: var(--mds-gold);
    color: var(--mds-ink);
    font-weight: 700;
  }

  /* ==========================================================================
     Gold action buttons

     Every green (#37C77A) button surface becomes gold. Because #FFD166 is a
     light face, the label goes to ink rather than white -- white on gold is
     about 1.7:1 and unreadable, ink is about 12:1. A #E3B100 edge keeps the
     buttons defined against white panels.

     Deliberately NOT converted: the A-to-F grade scale (#2e7d32 for grade A is
     semantic, not a button) and the .trade-progress-fill offer ramp, which is a
     red/orange/green traffic light -- gold next to its #ff9800 "close" step
     would read as the same colour and collapse two states into one.
     ========================================================================== */

  body.pfn-has-sidebar-nav .start-draft-btn,
  body.pfn-has-sidebar-nav .offer-selection .btn-accept-offer,
  body.pfn-has-sidebar-nav .nav-btn-container .nav-btn.next,
  body.pfn-has-sidebar-nav .nav-btn-container .nav-btn.confirm,
  body.pfn-has-sidebar-nav .nav-btn-container .nav-btn.propose,
  body.pfn-has-sidebar-nav .confirmation-btn-container .confirm-restart,
  body.pfn-has-sidebar-nav .player-info-body .full-report-btn,
  body.pfn-has-sidebar-nav .multi-user-remove-participants-popup .remove-participants-btn,
  body.pfn-has-sidebar-nav .multi-user-info-container-popup .room-list-btn,
  body.pfn-has-sidebar-nav .join-room-popup-container table .join-room-btn,
  body.pfn-has-sidebar-nav .multi-user-room-section .select-team-btn,
  body.pfn-has-sidebar-nav .draft-now-btn,
  body.pfn-has-sidebar-nav #confirmation-box-container .confirmation-box-btn,
  body.pfn-has-sidebar-nav #create-room-form .submit-form-btn,
  body.pfn-has-sidebar-nav .select-teams-popup-container .update-button-conatainer button,
  body.pfn-has-sidebar-nav .submit-password-button,
  body.pfn-has-sidebar-nav .teams-result-container .restart-simulation,
  body.pfn-has-sidebar-nav .multi-user-section .create-room-btn,
  body.pfn-has-sidebar-nav .result-screen-dashboard .login-container-overlay .dashboard-login-btn {
    background: var(--mds-gold);
    border-color: var(--mds-gold-deep);
    color: var(--mds-ink);
    transition: background-color 0.15s ease, box-shadow 0.2s ease, transform 0.1s ease;
  }

  body.pfn-has-sidebar-nav .start-draft-btn:hover:not(:disabled),
  body.pfn-has-sidebar-nav .offer-selection .btn-accept-offer:hover:not(:disabled),
  body.pfn-has-sidebar-nav .nav-btn-container .nav-btn.next:hover:not(:disabled),
  body.pfn-has-sidebar-nav .nav-btn-container .nav-btn.confirm:hover:not(:disabled),
  body.pfn-has-sidebar-nav .confirmation-btn-container .confirm-restart:hover:not(:disabled),
  body.pfn-has-sidebar-nav .player-info-body .full-report-btn:hover,
  body.pfn-has-sidebar-nav .multi-user-remove-participants-popup .remove-participants-btn:hover,
  body.pfn-has-sidebar-nav .multi-user-info-container-popup .room-list-btn:hover,
  body.pfn-has-sidebar-nav .join-room-popup-container table .join-room-btn:hover,
  body.pfn-has-sidebar-nav .multi-user-room-section .select-team-btn:hover,
  body.pfn-has-sidebar-nav .draft-now-btn:hover:not(:disabled),
  body.pfn-has-sidebar-nav #confirmation-box-container .confirmation-box-btn:hover,
  body.pfn-has-sidebar-nav #create-room-form .submit-form-btn:hover,
  body.pfn-has-sidebar-nav .submit-password-button:hover,
  body.pfn-has-sidebar-nav .teams-result-container .restart-simulation:hover,
  body.pfn-has-sidebar-nav .multi-user-section .create-room-btn:hover {
    background: var(--mds-gold-btn-hover);
  }

  /* The primary CTA carries the extra depth it had as the green button. */
  body.pfn-has-sidebar-nav .start-draft-btn {
    background: linear-gradient(180deg, #FFDA85 0%, #FFD166 100%);
    box-shadow: 0 2px 10px rgba(227, 177, 0, 0.35);
  }

  body.pfn-has-sidebar-nav .start-draft-btn:hover:not(:disabled) {
    box-shadow: 0 4px 16px rgba(227, 177, 0, 0.45);
  }

  body.pfn-has-sidebar-nav .start-draft-btn:active:not(:disabled) {
    transform: translateY(1px);
  }

  /* Tinted/outlined green -- selection states and secondary buttons. */
  body.pfn-has-sidebar-nav .create-room-container .create-room-btn,
  body.pfn-has-sidebar-nav .all-teams-container .all-teams-holder .team-btn.selected,
  body.pfn-has-sidebar-nav .user-teams-container .user-teams-holder .team-btn.selected,
  body.pfn-has-sidebar-nav .afc-container-teams .selected,
  body.pfn-has-sidebar-nav .nfc-container-teams .selected {
    background: var(--mds-gold-tint);
    border-color: var(--mds-gold-deep);
    color: var(--mds-ink);
  }

  /* Selected team chips on the landing screen. */
  body.pfn-has-sidebar-nav .team-holder.selected {
    background: var(--mds-gold-tint);
    border-color: var(--mds-gold-deep);
    box-shadow: 0 0 0 1px var(--mds-gold-deep), 0 2px 8px rgba(227, 177, 0, 0.28);
  }

  body.pfn-has-sidebar-nav .team-holder.selected .team-name {
    color: var(--mds-ink);
  }

  /* The "All" toggle and the incoming-offer highlight. */
  body.pfn-has-sidebar-nav input:checked + .slider {
    background-color: var(--mds-gold-deep);
  }

  body.pfn-has-sidebar-nav input:focus + .slider {
    box-shadow: 0 0 1px var(--mds-gold-deep);
  }

  body.pfn-has-sidebar-nav .show-offers-highlighted {
    color: var(--mds-gold-deep);
  }

  /* Value-offered split bar. The opposing side carried the green; gold keeps
     it distinct from the navy user side while dropping the last green surface
     in the trade popups. The percent label inside is #fff by default, which
     vanishes on a light gold, so it goes to ink. */
  body.pfn-has-sidebar-nav .trade-value-bar .trade-value-bar-opposing {
    background: var(--mds-gold);
  }

  body.pfn-has-sidebar-nav .trade-value-bar .trade-value-bar-opposing .trade-value-bar-percent {
    color: var(--mds-ink);
  }

  body.pfn-has-sidebar-nav .trade-value-team.opposing-value .trade-value-points {
    color: var(--mds-gold-text);
  }

  /* ==========================================================================
     5. Draft board -- gold marks what is live
     ========================================================================== */

  body.pfn-has-sidebar-nav .rounds-pics-container {
    border-color: var(--mds-accent-soft);
    border-radius: var(--mds-radius-panel);
    box-shadow: var(--mds-shadow-card);
  }

  body.pfn-has-sidebar-nav .draft-result-text {
    border-radius: var(--mds-radius-panel) var(--mds-radius-panel) 0 0;
  }

  /* Gold runs on a three-step intensity ramp so it keeps one meaning --
     "this is the headline" -- rather than becoming decoration:
       tint   -> round dividers (context)
       border -> the next-pick strip (happening now)
       solid  -> the overall grade banner (the result)
     Round dividers therefore take the tint only, with the accent doing the
     structural work. */
  body.pfn-has-sidebar-nav .rounds-pics-holder .round-number {
    background-color: var(--mds-gold-tint);
    border-left: 4px solid var(--mds-accent);
    color: var(--mds-ink);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* The next-pick indicator is the one thing on the board that is about to
     happen. It is sticky-right and sits ON the round band, so it has to stay
     one compact line -- a full-width bar covers the round heading, and the
     stacked number-over-label makes it taller than the band itself. Logo,
     number and label all go inside a single pill. */
  body.pfn-has-sidebar-nav .next-pick-container {
    /* A block-level flex fills its parent, so margin-left:auto alone cannot
       shrink it -- it stayed 436px wide and painted over the round heading.
       fit-content shrink-wraps it; the offset centres it in the 43px band. */
    width: fit-content;
    margin-left: auto;
    margin-right: 12px;
    top: 61px;
    gap: 6px;
    padding: 3px 10px 3px 5px;
    background: var(--mds-gold-tint);
    border: 1px solid var(--mds-gold);
    border-radius: 999px;
  }

  body.pfn-has-sidebar-nav .next-pick-container .next-pick-text-holder {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 5px;
    padding: 0;
    background: none;
    border: none;
  }

  body.pfn-has-sidebar-nav .next-pick-container .image-container {
    display: flex;
    align-items: center;
  }

  body.pfn-has-sidebar-nav .next-pick-container .next-pick-team {
    width: 24px;
    margin-left: 0;
  }

  body.pfn-has-sidebar-nav .next-pick-container .next-pick-number {
    color: var(--mds-ink);
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    font-variant-numeric: tabular-nums;
  }

  body.pfn-has-sidebar-nav .next-pick-container .next-pick-text {
    color: #7A6420;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    font-size: 10px;
    line-height: 14px;
    white-space: nowrap;
  }

  body.pfn-has-sidebar-nav .pick-timer-container .pick-timer {
    color: var(--mds-gold-deep);
    font-weight: 700;
  }

  body.pfn-has-sidebar-nav .mypicks-btn-holder {
    border-color: var(--mds-accent-soft);
  }

  body.pfn-has-sidebar-nav .simulation-management-buttons-holder {
    border-top: 1px solid var(--mds-border);
  }

  /* ==========================================================================
     6. Players panel
     ========================================================================== */

  body.pfn-has-sidebar-nav .players-container {
    border-color: var(--mds-accent-soft);
    border-radius: var(--mds-radius-panel);
  }

  body.pfn-has-sidebar-nav .players-positions {
    border: none;
    border-bottom: 1px solid var(--mds-accent-soft);
  }

  body.pfn-has-sidebar-nav .positions-filters .positions button {
    border-color: var(--mds-border);
    background-color: var(--mds-surface);
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  }

  /* Hovering a position chip used to pull the label to accent blue, which on
     a near-white chip just read as "everything went blue". Gold separates
     hover from the selected state, which is the solid accent fill.

     The label is 12px, so it takes --mds-gold-text (~5.1:1 on the tint)
     rather than --mds-gold-deep, which is only ~2:1 and would be worse than
     what it replaced. :not(.selected) matters -- this rule outweighs the
     selected chip's own styling, and gold on the blue fill is unreadable. */
  body.pfn-has-sidebar-nav .positions-filters .positions button:not(.selected):hover {
    background-color: var(--mds-gold-tint);
    border-color: var(--mds-gold);
    color: var(--mds-gold-text);
  }

  body.pfn-has-sidebar-nav .player-pool-text {
    background: var(--mds-surface);
    color: var(--mds-ink);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 700;
    border-bottom: 1px solid var(--mds-border);
  }

  body.pfn-has-sidebar-nav .search-icon-holder,
  body.pfn-has-sidebar-nav .search-icon-holder .search-icon,
  body.pfn-has-sidebar-nav .search-player-input {
    background: var(--mds-surface);
  }

  body.pfn-has-sidebar-nav .players-positions .positions,
  body.pfn-has-sidebar-nav .mypicks-btn-container .draft-result-btn,
  body.pfn-has-sidebar-nav .mypicks-btn-container .my-picks-btn {
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  /* ==========================================================================
     7. Controls
     ========================================================================== */

  body.pfn-has-sidebar-nav .resume-draft,
  body.pfn-has-sidebar-nav .pause-draft,
  body.pfn-has-sidebar-nav .show-offers,
  body.pfn-has-sidebar-nav .restart-simulation,
  body.pfn-has-sidebar-nav .result-btn,
  body.pfn-has-sidebar-nav .user-proposal,
  body.pfn-has-sidebar-nav .ranking-updates-btn,
  body.pfn-has-sidebar-nav .revert-pick,
  body.pfn-has-sidebar-nav .team-needs-btn {
    border-radius: var(--mds-radius-control);
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  /* ==========================================================================
     8. Results screen -- the oldest surfaces, brought up to the newest language
     ========================================================================== */

  /* Two more navy/purple gradient headers the chrome group did not reach. */
  body.pfn-has-sidebar-nav .all-rounds-trades-container .rounds-trades-header,
  body.pfn-has-sidebar-nav .round-trades-container .rounds-trades-header {
    background: var(--mds-chrome);
    border-bottom: 3px solid var(--mds-gold);
  }

  /* #E9E9E9 and #080a3c outlines -> the Playoff Predictor's accent border. */
  body.pfn-has-sidebar-nav .final-trades-container,
  body.pfn-has-sidebar-nav .final-result-container .final-result-holder,
  body.pfn-has-sidebar-nav .result-btn,
  body.pfn-has-sidebar-nav .selected-teams-container button,
  body.pfn-has-sidebar-nav .teams-result-holder .team-selections-holder,
  body.pfn-has-sidebar-nav .all-rounds-trades-container .round-trades-container {
    border-color: var(--mds-accent-soft);
  }

  body.pfn-has-sidebar-nav .teams-result-holder .team-selections-holder,
  body.pfn-has-sidebar-nav .all-rounds-trades-container .round-trades-container,
  body.pfn-has-sidebar-nav .final-result-container .final-result-holder {
    border-radius: var(--mds-radius-panel);
    box-shadow: var(--mds-shadow-card);
  }

  body.pfn-has-sidebar-nav .teams-result-holder .team-selections-header,
  body.pfn-has-sidebar-nav .round-trades-container .rounds-trades-header {
    border-radius: var(--mds-radius-panel) var(--mds-radius-panel) 0 0;
  }

  /* Neutral #F5F5F5 / #E9E9E9 fills -> the tinted surface used everywhere else. */
  body.pfn-has-sidebar-nav .draft-picks-text,
  body.pfn-has-sidebar-nav .url-holder,
  body.pfn-has-sidebar-nav .round-selector,
  body.pfn-has-sidebar-nav .final-result-header .result-btns-holder button,
  body.pfn-has-sidebar-nav .all-rounds-container .round-trades-selector,
  body.pfn-has-sidebar-nav .result-screen-dashboard .login-container {
    background: var(--mds-surface);
  }

  body.pfn-has-sidebar-nav .round-selector.selected,
  body.pfn-has-sidebar-nav .all-rounds-container .round-trades-selector.selected,
  body.pfn-has-sidebar-nav .final-trades-container .load-pfn-tools-btn {
    background: var(--mds-accent);
    color: #fff;
  }

  /* Round chips were 2px corners on a flat grey; they become real controls. */
  body.pfn-has-sidebar-nav .all-rounds-container .round-trades-selector {
    border: 1px solid var(--mds-border);
    border-radius: var(--mds-radius-control);
    box-shadow: none;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  }

  body.pfn-has-sidebar-nav .all-rounds-container .round-trades-selector:hover:not(.selected) {
    border-color: var(--mds-accent-soft);
    color: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .final-result-holder .utility-container .download-btn-mds,
  body.pfn-has-sidebar-nav .final-result-holder .utility-container .share-btn-mds {
    background: var(--mds-surface);
    border-color: var(--mds-accent-soft);
    border-radius: var(--mds-radius-control);
  }

  body.pfn-has-sidebar-nav .tools-btn-utility-container .utility-container {
    background: var(--mds-ink);
  }

  body.pfn-has-sidebar-nav .final-result-container .dashboard-btn .new-text {
    background: var(--mds-gold);
    color: var(--mds-ink);
    font-weight: 700;
  }

  /* ==========================================================================
     9. Grades module -- already the newest language, just re-anchored

     Its neutral ramp stays; only the blues move onto PFSN blue so the module
     stops reading as a different product. The A+-to-F colour scale is
     untouched -- it is the tool's own semantic and the thing regulars know.
     ========================================================================== */

  body.pfn-has-sidebar-nav .grade-toggle,
  body.pfn-has-sidebar-nav .mobile-grade-toggle {
    border-color: var(--mds-border);
    border-radius: var(--mds-radius-control);
  }

  body.pfn-has-sidebar-nav .grade-toggle:hover {
    background: var(--mds-surface);
    border-color: var(--mds-accent-soft);
  }

  body.pfn-has-sidebar-nav .grade-toggle.active,
  body.pfn-has-sidebar-nav .mobile-grade-toggle.active {
    background: var(--mds-surface);
    border-color: var(--mds-accent);
    color: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .grade-toggle.active .toggle-track,
  body.pfn-has-sidebar-nav .mobile-grade-toggle.active .toggle-track {
    background: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .trade-card {
    background: var(--mds-surface);
    border-color: var(--mds-border);
    border-radius: 12px;
  }

  body.pfn-has-sidebar-nav .trade-grades-section {
    border-top: 2px solid var(--mds-accent-soft);
  }

  /* The banner is the solid step of the gold ramp -- the one headline on the
     screen. It only needs the weight and tracking the other labels now carry. */
  body.pfn-has-sidebar-nav .overall-grade-row .overall-grade-label,
  body.pfn-has-sidebar-nav .overall-grade-row .header-grade,
  body.pfn-has-sidebar-nav .mobile-overall-grade .overall-grade-label {
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  /* Micro-labels across both eras settle on one tracking. */
  body.pfn-has-sidebar-nav .trade-grades-section .trade-grades-label,
  body.pfn-has-sidebar-nav .trade-side-label {
    letter-spacing: 0.06em;
  }

  /* ==========================================================================
     10. Focus states

     The tool shipped with none -- keyboard users get nothing on any control.
     One accent ring everywhere is the cheapest quality signal available.
     ========================================================================== */

  body.pfn-has-sidebar-nav :is(
    .pfn-content-container, .offer-container, .trade-data-container,
    .trade-proposal-user-teams-conatiner, .trade-proposal-all-teams-conatiner,
    .team-needs-container, .team-picks-info-popup, .player-info-popup,
    .restart-confirmation-popup-container, .trade-proposal-response-popup,
    .multi-user-remove-participants-popup, .multi-user-info-container-popup
  ) :is(button, a, input, select, [tabindex]):focus-visible {
    outline: 2px solid var(--mds-accent);
    outline-offset: 2px;
  }

  /* On the blue chrome headers the ring has to switch to gold to stay visible. */
  body.pfn-has-sidebar-nav :is(
    .offer-header, .proposal-header, .team-needs-header, .team-picks-header,
    .confirmation-header, .player-info-header, .trade-proposal-response-header,
    .multi-user-remove-articipants-header, .team-selections-header,
    .rounds-trades-header, .result-header
  ) :is(button, a, [tabindex]):focus-visible {
    outline: 2px solid var(--mds-gold);
    outline-offset: 2px;
  }

  /* ==========================================================================
     11. Scroll areas
     ========================================================================== */

  body.pfn-has-sidebar-nav :is(
    .final-trades-holder, .rounds-pics-holder, .players-container,
    .mypicks-container, .selected-user-teams-container, .team-selection-body
  )::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  body.pfn-has-sidebar-nav :is(
    .final-trades-holder, .rounds-pics-holder, .players-container,
    .mypicks-container, .selected-user-teams-container, .team-selection-body
  )::-webkit-scrollbar-thumb {
    background: var(--mds-accent-soft);
    border-radius: 6px;
  }

  body.pfn-has-sidebar-nav :is(
    .final-trades-holder, .rounds-pics-holder, .players-container,
    .mypicks-container, .selected-user-teams-container, .team-selection-body
  )::-webkit-scrollbar-track {
    background: transparent;
  }

  /* ==========================================================================
     12. Draft Settings -- real controls instead of browser defaults

     The markup is input[type=radio] + label inside .radio-input, which is all
     a segmented control needs: hide the input, style the label, key the
     selected state off :checked. No markup change, no JS -- the existing
     handlers still read the same inputs.
     ========================================================================== */

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

  /* Each .radio-input carries a stray <br> that becomes an anonymous flex item. */
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
    border: 1px solid var(--mds-border);
    border-radius: var(--mds-radius-control);
    background: #fff;
    color: #46506E;
    font-weight: 500;
    line-height: 20px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  body.pfn-has-sidebar-nav .radio-input label:hover {
    border-color: var(--mds-accent-soft);
    background: var(--mds-surface);
    color: var(--mds-accent);
  }

  body.pfn-has-sidebar-nav .radio-input input[type="radio"]:checked + label {
    background: var(--mds-accent);
    border-color: var(--mds-accent);
    color: #fff;
    box-shadow: var(--mds-glow-accent);
  }

  body.pfn-has-sidebar-nav .radio-input input[type="radio"]:focus-visible + label {
    outline: 2px solid var(--mds-accent);
    outline-offset: 2px;
  }

  /* Native selects, given the same shape as the segmented pills. */
  body.pfn-has-sidebar-nav .players-list-selection-container select,
  body.pfn-has-sidebar-nav .year-list-selection-container select {
    appearance: none;
    -webkit-appearance: none;
    padding: 9px 34px 9px 12px;
    border: 1px solid var(--mds-border);
    border-radius: var(--mds-radius-control);
    background-color: #fff;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%230050A0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    color: var(--mds-ink);
    font-weight: 600;
    line-height: 20px;
    cursor: pointer;
    transition: border-color 0.15s ease;
  }

  body.pfn-has-sidebar-nav .players-list-selection-container select:hover,
  body.pfn-has-sidebar-nav .year-list-selection-container select:hover {
    border-color: var(--mds-accent-soft);
  }

  /* ==========================================================================
     13. Draft Settings panel -- the ~340px of dead space under the CTA

     The panel matched the team grid's height with everything crammed at the
     top. Each setting becomes a ruled block so the groups read as separate
     decisions, and the CTA anchors to the bottom of the panel where a commit
     action belongs, which is also what closes the gap.

     The block padding is deliberately tight: the rules already separate the
     groups, so the spacing only has to stop them touching. Anything more and
     the panel outgrows the team grid beside it again.
     ========================================================================== */

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
    border-bottom: 1px solid var(--mds-border);
  }

  body.pfn-has-sidebar-nav .rounds-input-container {
    padding-top: 2px;
  }

  /* Whichever block ends the panel drops its rule, so the last thing above the
     CTA is white. Custom draft order is PFN-only markup and is always last on
     this route; the Big Board block only becomes last if
     $show_playerslist_selection_dropdown is off, and a stray hairline there is
     the harmless failure. */
  /* The base rule centres this container's children; as a column that pushes
     the label off the left edge the other three groups line up on. */
  body.pfn-has-sidebar-nav .inputs-container .custom-draft-order-container {
    border-bottom: none;
    align-items: stretch;
  }

  /* Customize Draft Order shipped as a label and a small outlined button on
     one line -- the only setting in the panel that was not a stacked
     label-over-control block. Same markup shape as the Big Board block
     (holder > label + control), so it takes the same treatment. */
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
    border: 1px solid var(--mds-border);
    border-radius: var(--mds-radius-control);
    background: #fff;
    color: var(--mds-ink);
    font-weight: 400;
    line-height: 20px;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  body.pfn-has-sidebar-nav .custom-draft-order-container .customize-draft-order-btn:hover {
    border-color: var(--mds-accent-soft);
    color: var(--mds-accent);
  }

  /* The tool marks a reordered draft green. Gold is what means "you changed
     this" everywhere else in the theme. */
  body.pfn-has-sidebar-nav .custom-draft-order-container .customize-draft-order-btn.customized {
    border-color: var(--mds-gold-deep);
    background: var(--mds-gold-tint);
    color: var(--mds-gold-text);
  }

  /* The original sets align-items:center on this container; once it becomes a
     column that centres the label horizontally, so it drifts off the left edge
     the other two groups line up on. */
  body.pfn-has-sidebar-nav .inputs-container .players-list-selection-container {
    align-items: stretch;
  }

  /* Stacked label-over-control, matching Rounds and Speed. */
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

  body.pfn-has-sidebar-nav .players-list-selection-container .list-selection-text,
  body.pfn-has-sidebar-nav .year-list-selection-container .list-selection-text,
  body.pfn-has-sidebar-nav .custom-draft-order-container .list-selection-text {
    text-align: left;
  }

  body.pfn-has-sidebar-nav .start-draft-btn {
    margin-top: auto;
  }

  /* ==========================================================================
     14. Team chips -- the primary interaction, currently reading as disabled

     #999 abbreviations behind hairline borders looked like greyed-out form
     fields. They carry the abbreviation at ink weight, a larger logo, and
     states you can actually see.
     ========================================================================== */

  body.pfn-has-sidebar-nav .team-holder .team-name {
    color: var(--mds-ink);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  /* ==========================================================================
     15. Utility buttons on the results screen

     Restart was pure #000 -- the only black element on the page, sitting right
     beside the outlined download and share buttons. It becomes their sibling
     instead of a slab: same surface, same accent border, same radius.
     ========================================================================== */

  body.pfn-has-sidebar-nav .utility-container .restart-sim-btn,
  body.pfn-has-sidebar-nav .utility-container .back-to-room-btn {
    background: var(--mds-surface);
    border: 1px solid var(--mds-accent-soft);
    border-radius: var(--mds-radius-control);
    color: var(--mds-ink);
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  body.pfn-has-sidebar-nav .utility-container .restart-sim-btn:hover,
  body.pfn-has-sidebar-nav .utility-container .back-to-room-btn:hover {
    background: #fff;
    border-color: var(--mds-accent);
    color: var(--mds-accent);
  }

  /* ------------------------------------------------------------------
     Gutter

     The landing block caps at 1440px, so above ~1700px of viewport it
     already floats clear of both edges. Below that there was nothing: the
     tool ran from the sidebar's edge to the window's, with the panel borders
     sitting flush against both. A gutter on the container holds at every
     width and does nothing at the ones where the cap already has it covered.

     The draft and result views were carrying their own proportional inset --
     95% of whatever they were given -- which on top of this reads as a
     double margin, and drifted with the viewport rather than staying put.
     ------------------------------------------------------------------ */

  body.pfn-has-sidebar-nav .simulator-content-container {
    padding-left: 12px;
    padding-right: 12px;
  }

  /* Narrower below the tablet-portrait edge, where 24px a side is a real share
     of the screen. Must match pre-styles.tpl -- a flat 24px here against its
     12px was a 12px shift on every box in the tool at 500px wide. */
  @media (min-width: 768px) {
    body.pfn-has-sidebar-nav .simulator-content-container {
      padding-left: 24px;
      padding-right: 24px;
    }
  }

  body.pfn-has-sidebar-nav .final-result-container,
  body.pfn-has-sidebar-nav .draft-simulation-container {
    width: 100%;
  }

  /* ==========================================================================
     16. Motion

     The tool carried 4 transitions and 1 keyframe across 2,900 lines of CSS --
     nothing responded to being touched, and nothing indicated the draft was
     running. That is most of why a finished-looking page still read as a
     static document. Everything below moves only the things that actually
     change state: controls under the cursor, the row that just got picked,
     and the pick about to happen.
     ========================================================================== */

  body.pfn-has-sidebar-nav .team-holder,
  body.pfn-has-sidebar-nav .players-list > *,
  body.pfn-has-sidebar-nav .add-player,
  body.pfn-has-sidebar-nav .players-positions button,
  body.pfn-has-sidebar-nav .positions-filters .positions button,
  body.pfn-has-sidebar-nav .draft-result-btn,
  body.pfn-has-sidebar-nav .my-picks-btn,
  body.pfn-has-sidebar-nav .draft-option-btn,
  body.pfn-has-sidebar-nav .start-draft-btn,
  body.pfn-has-sidebar-nav .nav-btn,
  body.pfn-has-sidebar-nav .btn-accept-offer,
  body.pfn-has-sidebar-nav .btn-counter-offer,
  body.pfn-has-sidebar-nav .btn-reject-offer {
    transition:
      background-color var(--mds-dur) var(--mds-ease),
      border-color var(--mds-dur) var(--mds-ease),
      color var(--mds-dur) var(--mds-ease),
      box-shadow var(--mds-dur) var(--mds-ease),
      transform var(--mds-dur-fast) var(--mds-ease);
  }

  /* Press depth. Without it a click has no acknowledgement until the DOM
     changes, which on a slow pick reads as an unresponsive button. */
  body.pfn-has-sidebar-nav .start-draft-btn:active,
  body.pfn-has-sidebar-nav .nav-btn:active,
  body.pfn-has-sidebar-nav .btn-accept-offer:active,
  body.pfn-has-sidebar-nav .btn-counter-offer:active,
  body.pfn-has-sidebar-nav .btn-reject-offer:active,
  body.pfn-has-sidebar-nav .draft-option-btn:active,
  body.pfn-has-sidebar-nav .team-holder:active {
    transform: translateY(1px);
  }

  /* Team chips are the primary interaction on the landing screen and were
     completely inert. */
  body.pfn-has-sidebar-nav .team-holder:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(8, 10, 60, 0.14);
    border-color: var(--mds-accent-soft);
  }

  body.pfn-has-sidebar-nav .team-holder.selected:hover {
    border-color: var(--mds-gold-deep);
  }

  body.pfn-has-sidebar-nav .start-draft-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(227, 177, 0, 0.38);
  }

  body.pfn-has-sidebar-nav .players-list > *:hover {
    background-color: var(--mds-surface);
  }

  body.pfn-has-sidebar-nav .add-player:hover {
    transform: scale(1.06);
  }

  /* The pick landing on the board. The row already exists and only its
     contents change, so this flashes the row rather than sliding it in, and
     runs the player name in from the side to show where the new data went.

     The flash is the row's own team colour, so a pick reads as that team
     lighting up and settling into its resting wash, rather than a generic
     gold blink.

     Not the flat colour: at full opacity the near-black teams (PIT, NO, LV)
     would black the row out and take the ink text with it for the better part
     of a second. This started at 0.42, where the darkest team, PIT, blended to
     #9B9EA1 and -- measured across all 32 -- the worst case held the row's ink
     text at 7.0:1 for the whole flash.

     Halved twice from there -- 0.42 to 0.21 to 0.105 -- because the flash was
     too loud once you watch a full round of it. Lightening the wash only adds
     contrast headroom: PIT now lands near #E6E7E8, well clear of the floor the
     original figure was chosen to protect.

     Note this is now below the 0.12 hover tint further down, so a row reacts
     more to the pointer than to a pick landing on it. Deliberate at this
     value, but it is the thing to revisit if the flash reads as too quiet. */
  @keyframes mds-pick-flash {
    from {
      background-color: rgba(var(--mds-team-rgb), 0.105);
    }
    to {
      /* Safe to end on transparent: the team wash lives on background-image,
         so this animation's persisting final keyframe cannot erase it. */
      background-color: transparent;
    }
  }

  @keyframes mds-pick-name-in {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container.mds-just-picked {
    animation: mds-pick-flash 900ms var(--mds-ease) both;
  }

  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container.mds-just-picked .traded-player-name-position-container {
    animation: mds-pick-name-in 380ms var(--mds-ease) both;
  }

  /* The next-pick chip is the one thing on the board that is pending, so it
     is the one thing that breathes. Slow and low-contrast on purpose -- it
     sits on screen for the whole draft. */
  @keyframes mds-next-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(227, 177, 0, 0);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(227, 177, 0, 0.24);
    }
  }

  body.pfn-has-sidebar-nav .next-pick-container {
    animation: mds-next-pulse 2.4s ease-in-out infinite;
  }

  /* ==========================================================================
     17. Pick counter

     Markup injected by enhance.tpl, so these classes have no legacy rules to
     fight. It rides in the board's own sticky ROUND band: that band already
     names the round and is already pinned to the top of the list you are
     watching, so the count has somewhere to live that costs no new chrome --
     and the action bar gets back the width the standalone readout was using.

     The figure is the whole board -- picks made of picks in the draft -- and
     every band carries the same one. They are sticky, so only the current
     round's band is ever on screen.
     ========================================================================== */

  body.pfn-has-sidebar-nav .rounds-pics-holder .round-number {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  /* display:contents so the count and the track are laid out by the band
     itself -- the count as a flex item beside the heading, the track free to
     position against the band's own box. */
  body.pfn-has-sidebar-nav .mds-round-progress {
    display: contents;
  }

  /* The band is uppercase with tracking; the count is data and reads as data. */
  body.pfn-has-sidebar-nav .mds-round-count {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: normal;
    text-transform: none;
    color: #6B7490;
    font-variant-numeric: tabular-nums;
  }

  body.pfn-has-sidebar-nav .mds-round-count b {
    font-weight: 700;
    color: var(--mds-ink);
  }

  /* Along the foot of the band rather than beside the text: a track long
     enough to read would push the next-pick pill off the row, and the band's
     bottom edge is already a line the eye follows. The band is sticky, so it
     is a containing block for this without further help. */
  body.pfn-has-sidebar-nav .mds-round-track {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    overflow: hidden;
    background: rgba(8, 10, 60, 0.10);
  }

  body.pfn-has-sidebar-nav .mds-round-fill {
    display: block;
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, var(--mds-gold-deep) 0%, var(--mds-gold) 100%);
    transition: width 400ms var(--mds-ease);
  }

  /* ==========================================================================
     17b. Empty labels in the player-pool header

     "Team Needs:", "Low Priority:" and "Next Picks:" are static markup in
     common/players/index.tpl; the JS only fills the value span beside each.
     A team with nothing on its do-not-draft list -- ARI at pick 1, for one --
     leaves .team-strengths as an empty string, so the label sits there
     labelling nothing. Same for .next-picks on a team with no further picks.

     Dropping the whole holder when its value is empty is a parent-selector
     job, which is what :has is for. Browsers without it fall back to today's
     behaviour, so this can only improve the render.
     ========================================================================== */

  body.pfn-has-sidebar-nav .team-needs-holder:has(.team-needs:empty),
  body.pfn-has-sidebar-nav .team-strength-holder:has(.team-strengths:empty),
  body.pfn-has-sidebar-nav .next-picks-container:has(.next-picks:empty) {
    display: none;
  }

  {if !$is_desktop}
    /* Same sticky misalignment the desktop board had, and worse here: 19px
       instead of 11px. .next-pick-container carries margin-top:-41px (source,
       so it can overlay the round band) and is 22px tall, contributing -19px
       to flow -- so the holder's content starts 19px above the scroller's top
       edge while the band sticks at top:0. At rest the band is pushed down
       over the first row, which only shows once a row holds a drafted player
       and runs to two lines. Padding the holder by that same 19px makes the
       band's resting and stuck positions identical. */
    body.pfn-has-sidebar-nav .rounds-pics-holder {
      padding-top: 19px;
    }

    /* Section 5 sets top:61px on this chip to centre it in the desktop band,
       but that rule is not desktop-scoped and was overriding mobile's own
       top:0. The band is 39px here and the chip 22px, so it centres at 8px. */
    body.pfn-has-sidebar-nav .next-pick-container {
      top: 8px;
    }
  {/if}

  /* ==========================================================================
     18. Reduced motion

     There was no prefers-reduced-motion handling anywhere in the tool. The
     pulse and the pick flash are the two that matter -- both repeat.
     ========================================================================== */

  @media (prefers-reduced-motion: reduce) {
    body.pfn-has-sidebar-nav *,
    body.pfn-has-sidebar-nav *::before,
    body.pfn-has-sidebar-nav *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* ==========================================================================
     19. Team colour

     32 rows of identical navy-on-white gave the board no scannability -- you
     had to read every logo to find your own pick. Colour restores that with no
     markup and no JS: fillRoundPics() already writes
     pickContainer.dataset.shortname from currentTeam.shortName, so the colour
     follows a pick through a trade for free. The results screen builds its
     rows with cloneNode(true) of these same rows, so it inherits the attribute
     and only needed the selectors.

     The wash is a gradient anchored to the edge, not a flat fill across the
     row. Colour sits where the marker is and is gone by the time it reaches
     the player name, so the row stays legible and reads as a tinted edge
     rather than a highlighter stroke. It lives on background-image, which
     leaves background-color free for hover and for the pick-flash -- those two
     no longer have to know anything about team colour.

     On colour choice: these are real team colours, but chosen for separability
     where a team has more than one. Six differ from the obvious primary purely
     to break an exact tie, each using that team's own alternate:
       HOU -> Deep Steel Blue (was tied with ATL's red)
       DEN -> the deeper orange     (was tied with CIN)
       DAL -> Cowboys navy          (was tied with LAR's royal)
       SEA -> Action Green          (was tied with NE's navy)
       NO  -> Old Gold, muted       (was tied with PIT's black)
       LV  -> Raiders silver        (was tied with PIT's black)
     CHI, CLE and TEN also use a secondary because their primaries (#0B162A,
     #311D00, #0C2340) are near-black and read as no colour at all.

     No two teams now share a value, but several remain in the same family --
     the reds especially. That is the real palette, and the logo sitting beside
     the stripe is the actual identifier; this is a scannability aid, not a
     brand swatch.
     ========================================================================== */

body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname] {
    /* Neutral fallback so a row whose team is not in the map still looks
       deliberate rather than losing its edge entirely. */
    --mds-team-rgb: 190, 200, 220;

    box-shadow: inset 5px 0 0 rgb(var(--mds-team-rgb));
    background-image: linear-gradient(
      90deg,
      rgba(var(--mds-team-rgb), 0.16) 0%,
      rgba(var(--mds-team-rgb), 0.05) 30%,
      rgba(var(--mds-team-rgb), 0) 62%
    );
  }

  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="ARI"] { --mds-team-rgb: 151, 35, 63; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="ATL"] { --mds-team-rgb: 167, 25, 48; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="BAL"] { --mds-team-rgb: 36, 23, 115; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="BUF"] { --mds-team-rgb: 0, 51, 141; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="CAR"] { --mds-team-rgb: 0, 133, 202; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="CHI"] { --mds-team-rgb: 200, 56, 3; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="CIN"] { --mds-team-rgb: 251, 79, 20; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="CLE"] { --mds-team-rgb: 107, 66, 38; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="DAL"] { --mds-team-rgb: 4, 30, 66; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="DEN"] { --mds-team-rgb: 194, 58, 12; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="DET"] { --mds-team-rgb: 0, 118, 182; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="GB"] { --mds-team-rgb: 32, 55, 49; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="HOU"] { --mds-team-rgb: 3, 32, 47; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="IND"] { --mds-team-rgb: 0, 44, 95; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="JAX"] { --mds-team-rgb: 0, 103, 120; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="KC"] { --mds-team-rgb: 227, 24, 55; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="LV"] { --mds-team-rgb: 77, 83, 87; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="LAC"] { --mds-team-rgb: 0, 128, 198; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="LAR"] { --mds-team-rgb: 0, 53, 148; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="MIA"] { --mds-team-rgb: 0, 142, 151; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="MIN"] { --mds-team-rgb: 79, 38, 131; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="NE"] { --mds-team-rgb: 0, 34, 68; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="NO"] { --mds-team-rgb: 159, 137, 88; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="NYG"] { --mds-team-rgb: 11, 34, 101; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="NYJ"] { --mds-team-rgb: 18, 87, 64; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="PHI"] { --mds-team-rgb: 0, 76, 84; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="PIT"] { --mds-team-rgb: 16, 24, 32; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="SEA"] { --mds-team-rgb: 105, 190, 40; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="SF"] { --mds-team-rgb: 170, 0, 0; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="TB"] { --mds-team-rgb: 213, 10, 10; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="TEN"] { --mds-team-rgb: 75, 146, 219; }
  body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container[data-shortname="WAS"] { --mds-team-rgb: 90, 20, 20; }

  {if $is_desktop}
  /* ==========================================================================
     20. Landing geometry

     Mirrored in pre-styles.tpl. That file is parsed before the tool's own
     stylesheets, so it is what makes the first paint land on the final layout
     instead of painting 985px wide with two chip columns and snapping to
     1440px with four. These are the same rules kept here with the rest of the
     landing work, so the layout is legible in one place.

     If the two ever disagree, this file wins -- it is a later fragment at the
     same specificity -- and the first paint will visibly correct itself to
     whatever is set here. Change both together.
     ========================================================================== */

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
       today's width, four if the conference box ever gets past ~404px of
       inner width. The gap below is what decides it -- see pre-styles.tpl,
       which has to carry the same value. */
    body.pfn-has-sidebar-nav .teams-container .teams-holder {
      display: grid;
      /* Explicit counts, not auto-fill. 16 teams divide cleanly into 4 rows of
         four or 8 rows of two; three across leaves five full rows and a single
         orphan on a sixth, which auto-fill was picking across a ~200px band of
         widths. Two is the floor here; the 1600px rule below takes it to four
         once the conference box is wide enough to keep the chips legible. */
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
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

    /* The 636px min-height on the landing block cascades down through
       `min-height: inherit`, so every column held that height. With four chips
       per row and the CTA at the foot of the settings panel, keeping it would
       just move the dead space to the bottom of each column. */
    body.pfn-has-sidebar-nav .simulator-content-container .landing-page-container,
    body.pfn-has-sidebar-nav .draft-options-view-container,
    body.pfn-has-sidebar-nav .teams-filters-container,
    body.pfn-has-sidebar-nav .team-selection-container,
    body.pfn-has-sidebar-nav .filters-container {
      min-height: 0;
    }

  /* ==========================================================================
     20b. Stacked team chips

     At the tool's full width the grid fits four chips per conference row, so
     the 32 teams land in four rows -- shorter than the settings panel beside
     them, which left ~140px of white under the last row.

     align-content:stretch in section 20 already hands that height to the rows,
     at every desktop width. This is the other half: at four columns the rows
     grow by ~55px each, which is far too much air around a single line, so
     the chip stacks -- logo over abbreviation -- and fills it. A stacked chip
     wants ~90px on its own, close enough to a stretched four-row grid that
     the rows are being filled rather than inflated. The markup is
     name-then-logo, so the stack is column-reverse rather than an edit to
     common/teams/index.tpl, which skm and the widget also build from.

     1520px, and NOT the desktop edge -- this is the one place the geometry
     and the four edges in section 0 disagree. A square chip is only as tall
     as its track is wide, so the track cannot go below the 76px the stacked
     content needs. Measured tracks: 63px at 1366, 72px at 1440, 77px at 1480,
     82px at 1520. Inside the desktop band the grid therefore runs 2-wide,
     then 4-wide from 1520.

     Measured against the 256px sidebar, the 24px gutter, the 320px floor on
     the settings panel and the 12px grid gap -- retune if any of those move.
     ========================================================================== */

  @media (min-width: 1520px) {
    /* Four across. It moved down from 1600 when the menu became a bar -- the
       118px that rail was holding went straight into the team columns. */
    body.pfn-has-sidebar-nav .teams-container .teams-holder {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      /* The chips are a fixed shape here, so the rows can no longer take the
         leftover height. It goes into the row gaps rather than into bands
         above and below the grid -- the first and last rows stay against the
         box's edges, which is what stops it reading as unused space. Falls
         back to start if the grid is ever taller than the box. */
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

  /* ==========================================================================
     21. Menu bar

     Solo / Redraft / Multiplayer / Dashboard were a 118px gutter down the left
     of the landing block -- four short labels in a column, holding a column's
     worth of width away from the thing the screen is for. As a bar across the
     top the lobby gets that width back, and the tabs get room to sit on one
     line each.

     Scoped to the breakpoint rather than to $is_desktop: below 1200px the
     tool's own styles already make this a fixed horizontal bar with its own
     geometry, and none of this should reach it. Mirrored in pre-styles.tpl.
     ========================================================================== */

    body.pfn-has-sidebar-nav .simulator-content-container .landing-page-container {
      flex-direction: column;
    }

    body.pfn-has-sidebar-nav .landing-page-container .draft-option-btns-container {
      width: 100%;
      /* The 118px basis this carried as a left-hand column is a HEIGHT now
         that the landing block is a column, and it made the bar 118px tall
         for a 44px row. */
      flex: 0 0 auto;
      flex-direction: row;
      align-items: stretch;
      /* The tool's own `max-width: 768px` block puts this bar out of flow at
         50px tall, and it is inclusive -- so at exactly 768, the first pixel
         of the tablet band, both it and this rule apply. Put it back in flow. */
      position: static;
      height: auto;
      /* Was a 13px left-hand pill against a panel on its right. */
      border-radius: var(--mds-radius-panel) var(--mds-radius-panel) 0 0;
      box-shadow: 0 2px 12px rgba(8, 10, 60, 0.10);
    }

    body.pfn-has-sidebar-nav .draft-option-btns-container .draft-btns-heading {
      display: flex;
      align-items: center;
      border-radius: var(--mds-radius-panel) 0 0 0;
    }

    /* Four tabs sharing the bar, each icon and label on one line. Stacked they
       made the bar 67px tall for two words. */
    body.pfn-has-sidebar-nav .draft-option-btns-container .draft-option-btn {
      flex: 1 1 0;
      min-width: 0;
      flex-direction: row;
      justify-content: center;
      gap: 10px;
      padding: 12px 16px;
    }

    /* Flows after the label now. Pinned to the button's top-right it sat a
       long way from the word it qualifies once the button is 300px wide. */
    body.pfn-has-sidebar-nav .draft-option-btn .new-text {
      position: static;
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


    /* The pointer aimed right, into the panel the rail stood beside. The panel
       is underneath now. The tool's own rule builds a 40x56 wedge out of three
       borders, so all four have to be restated. */
    body.pfn-has-sidebar-nav .draft-option-btn .triangle-right {
      left: 50%;
      top: auto;
      bottom: -7px;
      transform: translateX(-50%);
      border-top: 7px solid var(--mds-accent);
      border-right: 8px solid transparent;
      border-bottom: none;
      border-left: 8px solid transparent;
    }

    body.pfn-has-sidebar-nav .simulator-content-container .draft-options-view-container {
      border-radius: 0 0 var(--mds-radius-panel) var(--mds-radius-panel);
      border-left: 1px solid var(--mds-accent-soft);
      border-top: none;
    }

  {/if}

  /* ==========================================================================
     22. Jelly ripple

     Runs when a list first appears -- entering a draft, restarting, switching
     the big board -- and at no other time. Both lists used to arrive fully
     formed in a single frame, which read as a jump rather than an arrival.

     The cascade is a squash-and-settle, staggered down the rows so the
     movement travels instead of happening all at once: the rows behave like
     one elastic sheet being pushed rather than a stack of independent boxes.

     transform-origin is the top edge, so the squash compresses toward where
     the push came from -- that is what makes it read as jelly and not a
     bounce.

     Deliberately not used during the simulation. A landing pick already
     announces itself with the team-colour flash, and having the surrounding
     rows wobble on every pick made a running draft feel restless.
     ========================================================================== */

  @keyframes mds-jelly-up {
    0% {
      transform: translateY(13px) scaleY(1.07);
    }
    50% {
      transform: translateY(-3px) scaleY(0.98);
    }
    78% {
      transform: translateY(1px) scaleY(1.006);
    }
    100% {
      transform: none;
    }
  }

  body.pfn-has-sidebar-nav .mds-jelly {
    animation: mds-jelly-up 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
    transform-origin: top center;
  }

  {if $is_desktop}
    /* ========================================================================
       15. Desktop type scale and box sizing

       Each value steps up roughly one notch from the original noted alongside.
       ======================================================================== */

    /* Popup and section headers: 16px -> 18px */
    body.pfn-has-sidebar-nav .trade-proposal-user-teams-conatiner .proposal-header .header-text,
    body.pfn-has-sidebar-nav .trade-proposal-all-teams-conatiner .proposal-header .header-text,
    body.pfn-has-sidebar-nav .team-needs-container .team-needs-header .header-text,
    body.pfn-has-sidebar-nav .restart-confirmation-popup-container .confirmation-header .header-text,
    body.pfn-has-sidebar-nav .player-info-header .player-info-header-text,
    body.pfn-has-sidebar-nav .trade-proposal-response-header .trade-proposal-response-header-text,
    body.pfn-has-sidebar-nav .multi-user-remove-articipants-header .remove-participants-popup-header-text,
    body.pfn-has-sidebar-nav .offer-header .offer-number {
      font-size: 18px;
      line-height: 26px;
    }

    body.pfn-has-sidebar-nav .offer-header,
    body.pfn-has-sidebar-nav .trade-proposal-user-teams-conatiner .proposal-header,
    body.pfn-has-sidebar-nav .trade-proposal-all-teams-conatiner .proposal-header,
    body.pfn-has-sidebar-nav .team-needs-container .team-needs-header {
      padding: 16px 28px;
    }

    /* Team selection: 18px -> 20px heading, roomier cards, 15px -> 16px names */
    body.pfn-has-sidebar-nav .selection-text {
      font-size: 20px;
      line-height: 26px;
    }

    body.pfn-has-sidebar-nav .text-all {
      font-size: 16px;
    }

    body.pfn-has-sidebar-nav .team-selection-container {
      padding: 22px;
      gap: 14px;
    }

    body.pfn-has-sidebar-nav .teams-container .teams-holder {
      padding: 12px;
      gap: 12px;
    }

    body.pfn-has-sidebar-nav .team-holder {
      padding: 12px 10px;
    }

    body.pfn-has-sidebar-nav .team-holder .team-name {
      font-size: 16px;
      line-height: 22px;
    }

    /* Draft settings: 16px -> 17px labels, 14px -> 15px inputs, roomier panel */
    body.pfn-has-sidebar-nav .filters-container .inputs-container {
      padding: 22px 24px;
      gap: 22px;
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

    body.pfn-has-sidebar-nav .multi-user-section .header-text {
      font-size: 17px;
    }

    body.pfn-has-sidebar-nav .text-filter {
      font-size: 15px;
      line-height: 20px;
      padding: 10px 12px;
    }

    /* Left menu rail: 12px -> 13px labels. The heading stays 12px because the
       rail is only 75px wide and it is now uppercase with letter-spacing. */
    body.pfn-has-sidebar-nav .draft-option-btn span {
      font-size: 13px;
      line-height: 16px;
    }

    /* Board: 16px -> 18px title, 14px -> 15px round labels, 14px -> 16px pick */
    body.pfn-has-sidebar-nav .draft-result-text {
      font-size: 18px;
      line-height: 26px;
      padding: 14px 22px;
    }

    body.pfn-has-sidebar-nav .rounds-pics-holder .round-number {
      font-size: 15px;
      line-height: 22px;
      padding: 11px 18px 10px 16px;
    }

    body.pfn-has-sidebar-nav .next-pick-container .next-pick-number {
      font-size: 16px;
      line-height: 20px;
    }

    body.pfn-has-sidebar-nav .next-pick-container .next-pick-text {
      font-size: 13px;
      line-height: 16px;
    }

    /* Tab bar: 14px -> 15px. Growing it moves the sticky headers that park
       below it, so the height is pinned deterministically here --
       6 + 9 + 22 + 9 + 6 = 52px -- and the three dependent offsets follow. */
    body.pfn-has-sidebar-nav .mypicks-btn-container .draft-result-btn,
    body.pfn-has-sidebar-nav .mypicks-btn-container .my-picks-btn {
      font-size: 15px;
      line-height: 22px;
      padding: 9px 0;
    }

    body.pfn-has-sidebar-nav .rounds-pics-holder .round-number {
      top: 52px;
    }

    body.pfn-has-sidebar-nav .next-pick-container {
      top: 62px;
    }

    body.pfn-has-sidebar-nav .player-info-popup {
      left: 56%;
    }

    body.pfn-has-sidebar-nav .selected-user-teams-container {
      top: 54px;
    }

    /* Players panel: 14px -> 15px tabs, 12px -> 13px chips, 15px -> 16px names.
       .positions-filters parks below .players-positions, so that bar's height
       is pinned the same way -- 10 + 22 + 10 + 1 = 43px, offset to 44px. */
    body.pfn-has-sidebar-nav .players-positions button {
      font-size: 15px;
      line-height: 22px;
      padding: 10px 14px;
    }

    body.pfn-has-sidebar-nav .positions-filters {
      top: 44px;
    }

    body.pfn-has-sidebar-nav .positions-filters .positions button {
      font-size: 13px;
      line-height: 14px;
      padding: 9px 14px;
    }

    body.pfn-has-sidebar-nav .player-pool-text {
      font-size: 17px;
      line-height: 26px;
      padding: 8px 20px;
    }

    body.pfn-has-sidebar-nav .player-details .player-number {
      font-size: 15px;
    }

    body.pfn-has-sidebar-nav .player-name-position-container .name {
      font-size: 16px;
      line-height: 20px;
    }

    body.pfn-has-sidebar-nav .add-player {
      font-size: 13px;
      line-height: 18px;
      padding: 5px 14px;
    }

    body.pfn-has-sidebar-nav .team-needs-picks-container .team-needs-text,
    body.pfn-has-sidebar-nav .team-needs-picks-container .team-strengths-text {
      font-size: 13px;
      line-height: 16px;
    }

    /* ------------------------------------------------------------------
       The in-draft action bar

       These six actions have been a full-height middle column since the tool
       shipped, and the column never had enough in it: first spread by
       justify-content:space-evenly, then given an equal 1/6 share of the
       height, then collapsed to a centred island. Every version put the
       screen's least-read content in its most valuable place -- the middle,
       between the two panels you actually read.

       So it stops being a column. The bar spans the top, the board and the
       player pool sit side by side underneath it, and both get the ~230px of
       width the column was taking.

       That means placing three children in two rows, and the markup order is
       board, console, pool -- the console is in the middle of the DOM, not
       the front. Grid can place it out of order without touching
       home/pfn/desktop.tpl, which skm builds from as well; flex-wrap with
       `order` could not have sized the two rows independently.
       ------------------------------------------------------------------ */

    body.pfn-has-sidebar-nav .draft-simulation-container {
      display: grid;
      /* The board gets the smaller share: the pool carries a search field, a
         four-tab bar and two lines per player. minmax(0, 1fr) rather than 1fr
         so the tracks can go narrower than the scrollers' content. */
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
      grid-template-rows: auto minmax(0, 1fr);
      /* A fixed screen rather than one that grows with the board. The height
         was previously whatever the two scrollers came to, which drifted with
         the viewport and the round length. Row 1 takes the control bar at its
         own height and row 2 (1fr) gets the rest, so the board and pool absorb
         the change; they already carry min-height:0, which is what lets them
         shrink into the track and scroll rather than push it open. */
      height: 600px;
      gap: 16px;
    }

    body.pfn-has-sidebar-nav .draft-simulation-container .simulation-management-buttons-container {
      grid-column: 1 / -1;
      grid-row: 1;
      width: auto;
      height: auto;
      flex-direction: row;
      align-items: stretch;
      justify-content: flex-start;
      border-radius: var(--mds-radius-panel);
      border-color: var(--mds-accent-soft);
      overflow: hidden;
    }

    body.pfn-has-sidebar-nav .draft-simulation-container .rounds-pics-container {
      grid-column: 1;
      grid-row: 2;
    }

    body.pfn-has-sidebar-nav .draft-simulation-container .players-container {
      grid-column: 2;
      grid-row: 2;
    }

    /* Both scrollers carried `height: 100%` against a flex row that was the
       full height of the container. In a grid they are stretched into their
       track already, and 100% of a track that is itself sized from content
       would feed back on itself. min-height:0 is what lets the track shrink
       to the space the bar leaves rather than to the length of a 32-pick
       board. */
    body.pfn-has-sidebar-nav .draft-simulation-container .rounds-pics-container,
    body.pfn-has-sidebar-nav .draft-simulation-container .players-container {
      width: auto;
      height: auto;
      min-width: 0;
      min-height: 0;
    }

    body.pfn-has-sidebar-nav .simulation-management-buttons-holder {
      flex: 1 1 auto;
      flex-direction: row;
      align-items: stretch;
      /* Spread rather than grown. Stretching each button to fill made a lone
         wrapped Restart span the whole second line at the bottom of the
         desktop range, which reads as a mistake; at natural width it just
         sits at the start of that line. */
      justify-content: space-between;
      height: auto;
      gap: 4px;
      padding: 6px 8px;
      /* The labels cannot compress -- they are nowrap, so min-content is the
         full string -- and the six of them want ~870px. That is fine at the
         tool's full width and is not at the bottom of the desktop range, so
         the row wraps rather than running out under the panel's own
         overflow:hidden. */
      flex-wrap: wrap;
    }

    body.pfn-has-sidebar-nav .simulation-management-buttons-holder > button,
    body.pfn-has-sidebar-nav .simulation-management-buttons-holder > .sim-pause-play-buttons {
      flex: 0 0 auto;
      min-height: 44px;
    }

    /* Restart is the one destructive action in here, so it keeps a rule
       between itself and Trade Offer -- which is now to its left rather than
       above it. */
    body.pfn-has-sidebar-nav .simulation-management-buttons-holder > .restart-simulation {
      border-left: 1px solid var(--mds-border);
      padding-left: 20px;
    }

    body.pfn-has-sidebar-nav .simulation-management-buttons-holder .sim-pause-play-buttons {
      width: auto;
      display: flex;
      flex-direction: row;
    }

    body.pfn-has-sidebar-nav .sim-pause-play-buttons button {
      height: 100%;
    }

    body.pfn-has-sidebar-nav .simulation-management-buttons-holder button,
    body.pfn-has-sidebar-nav .sim-pause-play-buttons button {
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: auto;
      padding: 0 12px;
      border-radius: var(--mds-radius-control);
      text-align: left;
      /* "Ranking Updates" and "Resume Draft" both wrap at these widths, and a
         two-line label inside a 44px row sets the height of the whole bar. */
      white-space: nowrap;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    body.pfn-has-sidebar-nav .simulation-management-buttons-holder button:hover:not(:disabled) {
      background: var(--mds-surface);
      color: var(--mds-accent);
    }

    /* ------------------------------------------------------------------
       The console

       Five grey rows floating in a tall white box read as a dropdown menu
       rather than the controls of a running simulation, and with a white
       list either side the middle column had nothing to distinguish it.

       A pale blue wash is enough to separate it. This column holds the
       least important content on the screen -- the board and the player
       pool are what you read -- so it should be the last thing your eye
       goes to. A dark slab was tried here and pulled far too much focus.

       Desktop only: the mobile console is a different layout entirely and
       keeps its own light treatment.
       ------------------------------------------------------------------ */

    body.pfn-has-sidebar-nav .simulation-management-buttons-container {
      background: var(--mds-console);
      border-color: var(--mds-accent-soft);
      box-shadow: none;
    }

    /* The holder is the only thing in the bar now, so it can no longer claim
       height:100% of a container it is itself sizing. */
    body.pfn-has-sidebar-nav .simulation-management-buttons-container .simulation-management-buttons-holder {
      flex: 1 1 auto;
      height: auto;
      border-top: none;
    }

    body.pfn-has-sidebar-nav .simulation-management-buttons-holder button,
    body.pfn-has-sidebar-nav .sim-pause-play-buttons button {
      background: transparent;
      color: var(--mds-ink);
    }

    /* The icons are monochrome dark SVGs and PNGs, which is what this ground
       wants -- no filter at all. They only needed inverting while the console
       was dark. */
    body.pfn-has-sidebar-nav .simulation-management-buttons-holder button img {
      opacity: 0.78;
      transition: opacity var(--mds-dur) var(--mds-ease);
    }

    body.pfn-has-sidebar-nav .simulation-management-buttons-holder button:hover:not(:disabled) {
      background: #fff;
      color: var(--mds-accent);
    }

    body.pfn-has-sidebar-nav .simulation-management-buttons-holder button:hover:not(:disabled) img {
      opacity: 1;
    }

    /* Gold keeps meaning "this needs you", but an incoming trade offer is the
       one state in this console you must not miss, and gold does not survive
       a pale ground: --mds-gold is 1.3:1 here and --mds-gold-deep only 1.7:1.
       This is the darkest step of the same hue -- 7.3:1, still unmistakably
       gold against the ink of every other label. */
    body.pfn-has-sidebar-nav .show-offers-highlighted {
      color: #634A00;
      font-weight: 700;
    }

    /* The two green PNGs the JS swaps in for the active resume/offer states.
       They are images, so the only lever from CSS is a hue rotation: green
       sits near 150deg and gold near 45deg. The brightness lift that went
       with this on the dark console is gone -- it would wash them out here. */
    body.pfn-has-sidebar-nav .simulation-management-buttons-holder button img.trade-icon-green,
    body.pfn-has-sidebar-nav .simulation-management-buttons-holder button img.resume-icon-green {
      filter: hue-rotate(-105deg) saturate(1.4);
      opacity: 1;
    }

    /* Multiplayer only -- empty in a solo draft. */
    body.pfn-has-sidebar-nav .pick-timer-container {
      color: #556279;
    }

    body.pfn-has-sidebar-nav .pick-timer-container .pick-timer {
      color: #6E5200;
      font-variant-numeric: tabular-nums;
      font-weight: 700;
    }

    /* ------------------------------------------------------------------
       Draft board rows (left panel)

       Every row read at one weight: a #2D2D2D pick number the same size as
       the body text, then "Needs:" repeated 32 times at nearly the same
       colour as its own values, over a hard #dbdbdb rule. Scoped to
       .rounds-pics-holder so the results screen's own .pic-container
       layouts are untouched.
       ------------------------------------------------------------------ */

    /* The sticky chain in this panel did not line up. The tabs bar is 54px
       tall and sticks at top:0, but the round band sticks at top:52 while its
       natural position is only 38px down the scroller -- so at rest the band
       is pushed 15px below where it sits in flow and paints over the row
       under it. With one-line "Needs:" rows that overlap landed on empty
       padding and never showed; a row carrying a drafted player is two lines,
       and the name gets its top sliced off. Starting the list below the tabs
       makes the band's resting position and its sticky position the same. */
    body.pfn-has-sidebar-nav .rounds-pics-holder {
      padding-top: 16px;
    }

    body.pfn-has-sidebar-nav .rounds-pics-holder .round-number {
      top: 54px;
    }

    body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container {
      margin: 0 10px;
      padding: 0 6px;
      border-bottom: 1px solid var(--mds-border);
      border-radius: var(--mds-radius-control);
      transition: background-color 0.12s ease;
    }

    /* Deepens the row's own colour under the gradient rather than replacing
       it with flat grey. */
    body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container:hover {
      background-color: rgba(var(--mds-team-rgb), 0.12);
    }

    /* The pick number is the row's anchor -- tabular so the column stays
       true from 1 to 32, and heavy enough to scan down. Ink, not accent:
       these are ordinals, not links or state, and a column of blue numerals
       down the board claimed an emphasis they have not earned. Weight and
       alignment do the scanning work. */
    body.pfn-has-sidebar-nav .rounds-pics-holder .pic-container .pic-number {
      width: 26px;
      font-size: 15px;
      font-weight: 700;
      color: var(--mds-ink);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    /* "Needs:" becomes a label, its values become the content. */
    body.pfn-has-sidebar-nav .rounds-pics-holder .team-needs-info-container {
      gap: 6px;
    }

    body.pfn-has-sidebar-nav .rounds-pics-holder .team-needs-lable-text {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #8A93AD;
    }

    /* 500, not 600. The needs list repeats on every unpicked row, so at 600
       it was the loudest thing on a board where the drafted names should be;
       and the half-step above regular renders soft rather than heavy on
       displays without subpixel antialiasing. */
    body.pfn-has-sidebar-nav .rounds-pics-holder .team-needs-info-text {
      font-size: 13px;
      font-weight: 500;
      color: var(--mds-ink);
    }

    /* ------------------------------------------------------------------
       My Picks rows -- same treatment again

       This pane has its own anatomy: .single-pick / .pick-number rather than
       the board's .pic-container / .pic-number, and the position sits in a
       .player-position-draftfrom-holder alongside the draft-from text. Same
       hierarchy applied: accent tabular index, ink name, muted position.
       ------------------------------------------------------------------ */

    body.pfn-has-sidebar-nav .selected-picks-container .single-pick {
      border-bottom: 1px solid var(--mds-border);
      border-radius: var(--mds-radius-control);
      padding: 6px 8px;
      transition: background-color 0.12s ease;
    }

    body.pfn-has-sidebar-nav .selected-picks-container .single-pick:hover {
      background: var(--mds-surface);
    }

    body.pfn-has-sidebar-nav .selected-picks-container .single-pick .pick-number {
      width: 30px;
      font-size: 15px;
      font-weight: 700;
      color: var(--mds-ink);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    body.pfn-has-sidebar-nav .selected-picks-container .traded-player-name-position-container .player-name {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
      color: var(--mds-ink);
    }

    body.pfn-has-sidebar-nav .selected-picks-container .traded-player-name-position-container .player-position-draftfrom-holder {
      color: #6B7490;
    }

    body.pfn-has-sidebar-nav .selected-picks-container .player-position-draftfrom-holder .player-position,
    body.pfn-has-sidebar-nav .selected-picks-container .player-position-draftfrom-holder .player-draftfrom {
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    /* A pick not yet made -- muted so it reads as pending, not as a result. */
    body.pfn-has-sidebar-nav .mypicks-container .selected-picks-container .future-pick {
      color: #8A93AD;
      font-weight: 500;
    }

    /* ------------------------------------------------------------------
       Results screen rows -- same treatment as the draft board

       Both result panes are JS-populated .pic-container rows: MY DRAFT into
       .team-selection-body, FULL RESULTS into .round-selection-body. They
       carry the same anatomy as the board rows, so they get the same
       hierarchy: accent tabular index, ink name, muted position and school.
       Width and margin are left alone -- .round-selection-body wraps into
       three columns off them -- and box-sizing keeps the added padding from
       widening the 30% columns.
       ------------------------------------------------------------------ */

    body.pfn-has-sidebar-nav .team-selection-body .pic-container,
    body.pfn-has-sidebar-nav .round-selection-body .pic-container {
      box-sizing: border-box;
      padding: 0 8px;
      border-radius: var(--mds-radius-control);
      transition: background-color 0.12s ease;
    }

    body.pfn-has-sidebar-nav .team-selection-body .pic-container:hover,
    body.pfn-has-sidebar-nav .round-selection-body .pic-container:hover {
      background: var(--mds-surface);
    }

    body.pfn-has-sidebar-nav .team-selection-body .pic-container .pic-number,
    body.pfn-has-sidebar-nav .round-selection-body .pic-container .pic-number {
      width: 26px;
      font-size: 15px;
      font-weight: 700;
      color: var(--mds-ink);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    body.pfn-has-sidebar-nav .team-selection-body .traded-player-name-position-container .player-name,
    body.pfn-has-sidebar-nav .round-selection-body .traded-player-name-position-container .player-name {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
      color: var(--mds-ink);
    }

    body.pfn-has-sidebar-nav .team-selection-body .traded-player-name-position-container .player-position,
    body.pfn-has-sidebar-nav .round-selection-body .traded-player-name-position-container .player-position {
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: #6B7490;
    }

    /* ------------------------------------------------------------------
       Player pool rows (right panel)
       ------------------------------------------------------------------ */

    body.pfn-has-sidebar-nav .players-list .player {
      margin: 0 12px;
      padding: 5px 8px;
      border-radius: var(--mds-radius-control);
      transition: background-color 0.12s ease;
    }

    body.pfn-has-sidebar-nav .players-list .player:hover {
      background: var(--mds-surface);
    }

    body.pfn-has-sidebar-nav .players-list .separator {
      border-top-color: var(--mds-border);
    }

    body.pfn-has-sidebar-nav .players-list .player-details .player-number {
      width: 28px;
      font-size: 15px;
      font-weight: 700;
      color: var(--mds-ink);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    body.pfn-has-sidebar-nav .players-list .player-name-position-container .name {
      font-size: 16px;
      font-weight: 500;
      color: var(--mds-ink);
    }

    body.pfn-has-sidebar-nav .players-list .player-name-position-container .position {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: #6B7490;
    }

    /* The pale #dbeaff needs strip, brought onto the system's surface. */
    body.pfn-has-sidebar-nav .team-needs-picks-container {
      background: var(--mds-surface);
      border-bottom: 1px solid var(--mds-accent-soft);
    }

    body.pfn-has-sidebar-nav .team-needs-picks-container .team-needs-text,
    body.pfn-has-sidebar-nav .team-needs-picks-container .team-strengths-text,
    body.pfn-has-sidebar-nav .team-needs-picks-container .next-picks-text {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #8A93AD;
    }

    body.pfn-has-sidebar-nav .team-needs-picks-container .team-needs,
    body.pfn-has-sidebar-nav .team-needs-picks-container .team-strengths {
      font-size: 13px;
      font-weight: 500;
      color: var(--mds-ink);
    }

    /* Search field, matching the selects on the landing screen. */
    body.pfn-has-sidebar-nav .search-icon-holder {
      border: 1px solid var(--mds-border);
      border-right: none;
      border-radius: var(--mds-radius-control) 0 0 var(--mds-radius-control);
    }

    body.pfn-has-sidebar-nav .search-player-input {
      border: 1px solid var(--mds-border);
      border-left: none;
      border-radius: 0 var(--mds-radius-control) var(--mds-radius-control) 0;
    }


  {else}
    /* ========================================================================
       16. Mobile type scale and box sizing

       Smaller steps than desktop -- the tool runs as a fixed app shell here, so
       anything that grows eats the board rather than the page.
       ======================================================================== */

    body.pfn-has-sidebar-nav .selection-text {
      font-size: 17px;
    }

    body.pfn-has-sidebar-nav .team-holder {
      padding: 5px 8px;
    }

    body.pfn-has-sidebar-nav .team-holder .team-name {
      font-size: 15px;
    }

    body.pfn-has-sidebar-nav .text-filter {
      font-size: 14px;
      line-height: 18px;
      padding: 8px 10px;
    }

    body.pfn-has-sidebar-nav .player-details .player-number {
      font-size: 15px;
    }

    body.pfn-has-sidebar-nav .player-name-position-container .name {
      font-size: 16px;
    }

    body.pfn-has-sidebar-nav .player-name-position-container .position {
      font-size: 13px;
    }

    /* The chip is fixed at 50x26; the larger label needs the box to follow. */
    body.pfn-has-sidebar-nav .add-player {
      width: 58px;
      height: 28px;
      font-size: 13px;
      padding: 4px 10px;
    }

    body.pfn-has-sidebar-nav .players-positions button {
      font-size: 15px;
    }

    body.pfn-has-sidebar-nav .rounds-pics-holder .round-number {
      font-size: 15px;
    }

    body.pfn-has-sidebar-nav .next-pick-container .next-pick-number {
      font-size: 15px;
    }
  {/if}
  }
</style>
