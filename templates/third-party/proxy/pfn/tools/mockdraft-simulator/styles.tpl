{function getMDSPFNMobileCSS}
      .pfn-content-wrapper {
        margin-top: 125px;
      }

      .pfn-content-container {
        padding: 0px;
        margin-top: calc(9vh + 20px);
      }

      .pfn-content-container .content {
        width: 100%;
        max-width: var(--tab-width);
      }

      .pfn-content-container .content>* {
        max-width: var(--tab-width);
      }

      .result-header .pfn-logo-draft-simulator {
        width: 30px;
        height: 30px;
      }

      .final-trades-container .final-trades-holder {
        overflow: unset;
        margin-bottom: 100px;
      }

      .final-result-container {
        position: relative;
        gap: unset;
      }

      .picked-player {
        margin-top: -10px;
      }

      .teams-filters-container,
      .draft-simulation-container {
        position: fixed;
        top: 105px;
      }

      .draft-simulation-container {
        margin-top: calc(3vh);
      }

      .final-trades-container {
        margin-top: 10px;
      }

      .teams-filters-container,
      .final-trades-container {
        position: unset;
      }

      .draft-simulation-container {
        position: fixed;
        height: 69vh;
      }

      .draft-simulation-container .rounds-pics-container {
        height: 73vh;
        margin-bottom: unset;
      }

      .rounds-pics-holder .round-number {
        top: 0;
      }

      .draft-result.selected,
      .player-pool.selected,
      .my-picks.selected {
        background: #0857C3;
      }

      .result-header {
        min-height: 45px
      }

      .next-pick-container {
        top: 0px;
      }

      .more-pfn-tools-container .more-tools-text {
        font-size: 16px;
        font-weight: 600;
      }

      .start-draft-btn {
        bottom: 55px;
      }

      .team-selection-container {
        width: 100%;
      }

      .resume-draft,
      .pause-draft,
      .show-offers,
      .restart-simulation,
      .result-btn,
      .user-proposal,
      .ranking-updates-btn {
        font-size: 11px;
        padding: 7px 0;
      }

      .bottom-controls {
        bottom: unset;
        top: 70px;
        box-shadow: 0px 6px 4px 0px #0000001A;
        padding: 2px 4px;
        background: #f5f5f5;
      }

      .bottom-controls button {
        padding: 4px 0;
        margin: 0 2px;
      }

      .full-result-btn.selected,
      .my-draft-btn.selected,
      .dashboard-btn.selected {
        border-top: unset;
        border-radius: 6px;
        background: #0857C3;
      }

      .full-result-btn.selected span,
      .my-draft-btn.selected span,
      .dashboard-btn.selected span {
        color: #fff;
      }

      .full-result-btn.selected img,
      .my-draft-btn.selected img,
      .dashboard-btn.selected img {
        filter: brightness(0) saturate(100%) invert(100%);
      }

      .simulation-management-buttons-holder {
        background: #f5f5f5;
        box-shadow: 0px 6px 4px 0px #0000001A;
      }

      .draft-option-btns-container .draft-option-btn {
        background: #f5f5f5;
      }

      .final-trades-container {
        height: unset;
      }


      .competing-teams-container .team-name {
        font-size: 15px
      }

      .offer-container {
        width: 100%;
        margin-left: unset;
      }

      .trade-proposal-user-teams-conatiner,
      .trade-proposal-all-teams-conatiner {
        width: 100%;
        margin-left: unset;
      }

      .simulator-content-holder {
        margin: unset;
      }

      .player-info-popup {
        margin: unset;
      }

      .nfl-feeds-container {
        border: unset;
        padding: 10px;
      }

      .nfl-feeds-container .header-container .header-text {
        font-size: 16px;
        line-height: 24px;
      }

      .nfl-feeds-container .header-container .header-bar {
        width: 2px;
        height: 18px;
      }

      .nfl-feeds-container .feeds-holder {
        gap: 14px;
        flex-direction: column;
      }

      .nfl-feeds-container .feeds-holder .single-feed {
        width: 100%;
      }

      .single-feed .feed-data-container .feed-title {
        font-size: 12px;
        line-height: 18px;
        max-height: 55px;
      }

      .single-feed .feed-data-container .feed-time {
        font-size: 10px;
        line-height: 15px;
      }

      .final-trades-container .final-trades-holder {
        margin-bottom: 10px;
      }

      .simulation-management-buttons-container {
        bottom: unset;
        top: 70px;
      }

      .pfn-content-wrapper .pfn-footer {
        margin-top: 0px;
      }

      .sim-content-slider .rounds-pics-container, .sim-content-slider .players-container, .sim-content-slider .mypicks-container {
        height: 74vh;
        background: #fff;
      }

      .draft-simulation-container {
        padding-top: 10px;
      }

      .teams-filters-container, .draft-simulation-container {
        top: 97px;
      }

    /* Tablet band on the mobile host. On the desktop host this now sits inside
       the 767px wrapper the call site adds, so it can never match -- which is
       right: 768-1400 is the tablet regime's business there, and theme.tpl
       owns it. It stays live on m.*, which has no tablet regime. */
    @media (min-width: 768px) and (max-width: 1400px) {
        .sk-proxied-page {
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .pfn-content-wrapper {
          width: 600px;
          margin-top: 15px;
        }

        .pfn-content-container {
          margin-top: 93px;
        }

        .landing-page-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .landing-page-container .draft-option-btns-container {
          flex-direction: row;
          width: unset;
        }

        .bottom-controls {
          top: 100px;
        }

        .final-trades-container {
          margin-top: 80px;
        }

        .sim-content-slider.show-rounds-pics-container {
          height: calc(100% - 100px);
        }

        .pfn-header-wrapper .pfn-header-container {
          color: #fff;
        }

        .updated-timestamp-container {
          color: #fff;
        }

        .draft-simulation-container {
          overflow-x: hidden;
          height: 87vh;
          margin-top: unset;
        }

        .simulation-management-buttons-container {
          position: unset;
          width: 100%;
        }

        .sim-nav-container {
          margin-top: 10px;
        }

        .draft-simulation-container .rounds-pics-container,
        .draft-simulation-container .players-container {
          height: 73vh;
        }

        /* Navigation */

        .pfn-header-wrapper .pfn-header-container .header-logo-container {
          left: unset;
          transform: unset;
          position: unset;
        }

        .pfn-secondary-wrapper .pfn-secondary-container {
          height: 100%;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-category {
          display: flex;
          flex-direction: row;
          gap: 6px;
          align-items: center;
          border: none;
          background: none;
          outline: none;
          position: relative;
          height: 100%;
          min-width: 64px;
          padding: 0 12px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-category .separator {
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-category .category-text {
          z-index: 2;
          color: #000000;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown {
          position: absolute;
          width: 17vw;
          background: #FFFF;
          border: 1px solid #E9E9E9;
          border-radius: 6px;
          margin-top: 12px;
          margin-left: 8px;
          z-index: 10;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .close-container {
          width: 100%;
          padding: 8px;
          border-bottom: 1px solid #E9E9E9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pfn-secondary-wrapper .page-category .nav-down-icon {
          width: 10px;
          height: 6px;
          z-index: 100;
        }

        .pfn-header-container .header-h1-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
        }

        .pfn-header-container .header-h1-container h1 {
          font-size: 20px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .close-container button {
          outline: none;
          border: unset;
          background: unset;
        }

        .pfn-header-wrapper .pfn-header-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pfn-header-wrapper .pfn-header-container.with-header {
          justify-content: space-between;
          padding: 0 12px;
        }

        .pfn-header-wrapper .pfn-header-container .header-logo-container .header-logo {
          width: 25px;
          height: 25px;
        }

        .pfn-header-wrapper .pfn-header-container.with-header h1 {
          font-size: 13px;
          color: #FFFFFF;
          line-height: 16px;
          font-weight: 600;
        }

        .pfn-header-container .header-h1-container h1:has(+ .updated-timestamp-container) {
          font-size: 12px;
          line-height: 12px;
        }

        .pfn-header-container .header-h1-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;
          gap: 1px;
        }

        .pfn-header-container .header-h1-container .updated-timestamp-container {
          font-size: 10px;
          line-height: 16px;
          min-height: 16px;
          font-weight: 400;
          color: #fff;
        }

        .pfn-header-wrapper {
          height: 35px;
        }

        .pfn-secondary-wrapper {
          top: 34.5px;
          height: 35px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container {
          display: flex;
          width: 100%;
          justify-content: space-between;
          padding-left: 0;
          left: 0;
        }

        .pfn-header-wrapper .pfn-header-container .header-logo-container {
          left: 50%;
          transform: translateX(-50%);
        }

        .pfn-secondary-wrapper .pfn-secondary-container .category-links-container {
          display: flex;
          align-items: center;
          gap: 27px;
          flex-grow: 1;
          overflow-x: scroll;
          scrollbar-width: none;
          margin-left: 0px;
          padding: 0 12px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container {
          position: relative;
          flex-shrink: 0;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown {
          position: absolute;
          width: 97vw;
          background: #FFFF;
          border: 1px solid #E9E9E9;
          border-radius: 6px;
          margin-left: 8px;
          z-index: 10;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .close-container {
          width: 100%;
          padding: 8px;
          border-bottom: 1px solid #E9E9E9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .close-container span {
          font-weight: 600;
          font-size: 16px;
          line-height: 19px;
          color: #474747;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .close-container button {
          outline: none;
          border: unset;
          background: unset;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container {
          width: 100%;
          height: 274px;
          overflow-y: scroll;
          scrollbar-width: none;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container::-webkit-scrollbar {
          display: none;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item,
        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item,
        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container,
        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container .mobile-menu-sub-sub-sub-item {
          text-decoration: none;
          color: inherit;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-menu-item-text,
        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-menu-sub-item-text,
        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item-text,
        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container .mobile-menu-sub-sub-sub-item .mobile-menu-sub-sub-sub-item-text {
          font-weight: 500;
          font-size: 15px;
          line-height: 19px;
          color: #474747;
          display: flex;
          padding: 10px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-menu-sub-item-text {
          font-weight: 400;
          font-size: 14px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item-text {
          font-weight: 400;
          font-size: 13px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container .mobile-menu-sub-sub-sub-item .mobile-menu-sub-sub-sub-item-text {
          font-weight: 400;
          font-size: 12px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-menu-item-text .collapse-sign,
        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-menu-sub-item-text .collapse-sign,
        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-menu-sub-sub-item-text .collapse-sign {
          margin-left: auto;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-menu-item-text .collapse-sign i,
        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-menu-sub-item-text .collapse-sign i {
          transform: scale(1.4);
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container {
          padding-left: 8px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container {
          display: block;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container {
          padding-left: 8px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item {
          display: block;
          text-decoration: none;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container {
          display: block;
          padding-left: 8px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container .mobile-menu-sub-sub-sub-item {
          display: block;
          text-decoration: none;
          padding-left: 8px;
          color: #474747;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-category {
          display: flex;
          flex-direction: row;
          gap: 6px;
          align-items: center;
          border: none;
          background: none;
          outline: none;
          position: relative;
          height: 35px;
          min-width: 64px;
          padding: 0 12px;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-category .category-text {
          z-index: 2;
          color: #000000;
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-category i {
          z-index: 2;
          color: #FFFF;
          transform: scale(1.2);
        }

        .pfn-secondary-wrapper .pfn-secondary-container .page-category .separator {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
        }

        .pfn-secondary-wrapper .page-category .nav-down-icon {
          width: 10px;
          height: 6px;
          z-index: 100;
        }

        .header-items-container .nav-right-icon {
          width: 8px;
          height: 14px;
          z-index: 100;
        }

        .header-items-container .nav-down-icon {
          width: 14px;
          height: 8px;
          z-index: 100;
        }

        .header-items-container .mobile-menu-sub-sub-item .nav-right-icon {
          width: 4px;
          height: 7px;
          z-index: 100;
        }

        .header-items-container .mobile-menu-sub-sub-item .nav-down-icon {
          width: 7px;
          height: 4px;
          z-index: 100;
        }
      }

      /* ----------------------------------------------------------------
         Popup chrome, ported from the desktop theme.

         theme.tpl carries the revamp's popup colours, but it is emitted only
         on the desktop host AND wrapped in min-width:768px -- so neither the
         mobile host nor a narrowed desktop window ever sees them, and the
         offers container, the propose-trade flow and the player info popup
         keep their original grey-black headers. This is that treatment, with
         the token values written out because the theme's custom properties
         are not defined here.

         Only the chrome travels: the popup surface, its header and the
         primary action. Counter and Reject keep their own red and black on
         the desktop theme too -- they carry meaning that gold would erase.
         ---------------------------------------------------------------- */
      .offer-header,
      .trade-data-container .trade-data-header,
      .trade-proposal-user-teams-conatiner .proposal-header,
      .trade-proposal-all-teams-conatiner .proposal-header,
      .team-needs-container .team-needs-header,
      .team-picks-info-popup .team-picks-header,
      .restart-confirmation-popup-container .confirmation-header,
      .player-info-popup .player-info-header,
      .trade-proposal-response-popup .trade-proposal-response-header,
      .multi-user-remove-participants-popup .multi-user-remove-articipants-header,
      .custom-draft-order-popup .custom-draft-order-header {
        background: linear-gradient(180deg, #0050A0 0%, #003A75 100%);
        border-bottom: 3px solid #FFD166;
        border-radius: 14px 14px 0 0;
        color: #fff;
      }

      .offer-container,
      .trade-data-container,
      .trade-proposal-user-teams-conatiner,
      .trade-proposal-all-teams-conatiner,
      .team-needs-container,
      .team-picks-info-popup,
      .restart-confirmation-popup-container,
      .player-info-popup,
      .trade-proposal-response-popup,
      .multi-user-remove-participants-popup,
      .custom-draft-order-popup,
      .multi-user-info-container-popup {
        border-radius: 14px;
        box-shadow: 0 8px 24px rgba(8, 10, 60, 0.16), 0 24px 64px rgba(8, 10, 60, 0.24);
        overflow: hidden;
      }

      /* The dimmers were flat 50% black; brand navy sits better under the
         blue headers above. */
      .overlay,
      .overlay2 {
        background: #080A3C;
      }

      .offer-selection .btn-accept-offer,
      .confirmation-btn-container .confirm-restart,
      /* Qualified by the popup, to match the specificity home/styles.tpl uses
         for the green these replace -- a bare .nav-btn-container .nav-btn.next
         loses to it. */
      .trade-proposal-user-teams-conatiner .nav-btn-container .nav-btn.next,
      .trade-proposal-user-teams-conatiner .nav-btn-container .nav-btn.confirm,
      .trade-proposal-user-teams-conatiner .nav-btn-container .nav-btn.propose,
      .trade-proposal-all-teams-conatiner .nav-btn-container .nav-btn.next,
      .trade-proposal-all-teams-conatiner .nav-btn-container .nav-btn.confirm,
      .trade-proposal-all-teams-conatiner .nav-btn-container .nav-btn.propose {
        background: #FFD166;
        border-color: #E3B100;
        color: #080A3C;
      }

      /* The drafting team's logo in the results header, on a white disc, the
         same as the desktop header.

         Different element on this side: showTeamInResultHeader() clones the
         team button out of .selected-teams-container into
         .result-header .team-container, so the logo is a bare img inside a
         button rather than the desktop's .result-header-team-logo. The image
         is 30x22 here against 50x33 there, so the disc is smaller to match --
         it still has to sit inside the 45px header band without growing it.

         The disc goes on the button, not the image: final-result/styles.tpl
         carries `.result-header img { background: none !important }`, which no
         amount of specificity on an img selector gets past. The button is the
         clone's root and that rule does not touch it. */
      .result-header .team-container button {
        box-sizing: border-box;
        width: 30px;
        height: 30px;
        padding: 4px;
        border-radius: 50%;
        background: #fff;
      }

      .result-header .team-container button img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      /* Selected team in the propose-trade grid. The desktop theme turns this
         tinted green into tinted gold; selectors are qualified the same way
         home/styles.tpl qualifies the green, so they carry equal weight and
         win on order. */
      .trade-proposal-user-teams-conatiner .user-teams-container .user-teams-holder .team-btn.selected,
      .trade-proposal-all-teams-conatiner .all-teams-container .all-teams-holder .team-btn.selected {
        background: #FFF7E3;
        border: 1px solid #E3B100;
        color: #080A3C;
      }

      /* Value-offered split bar. The opposing side carried the green; gold
         keeps it distinct from the navy user side while dropping the last
         green surface in the trade popups. The percent label inside is #fff by
         default, which vanishes on a light gold, so it goes to ink -- and the
         points figure above it takes the darker gold that reads as text. */
      .trade-value-bar .trade-value-bar-opposing {
        background: #FFD166;
      }

      .trade-value-bar .trade-value-bar-opposing .trade-value-bar-percent {
        color: #080A3C;
      }

      .trade-value-team.opposing-value .trade-value-points {
        color: #8A6A00;
      }

      /* .pfn-player-info-popup is positioned from the bottom -- bottom:100px
         with height:82vh -- so its top is a function of the viewport height:
         at 858px it clears the topbar, at 700px it resolves to 26px and the
         Player Info header disappears behind the fixed 36px bar. Pinning both
         edges instead makes the height fall out of the viewport rather than
         the other way round, so the header stays put at any height. */
      .pfn-player-info-popup {
        top: 52px;
        bottom: 16px;
        height: auto;
      }

      /* Page copy and site footer, while a draft is running.

         The draft screen is pinned over the viewport, so the page behind it has
         nothing left to show and anything below it only gives the page
         somewhere to scroll to. On the mobile host the screen is 69vh rather
         than full height, which left the page copy visible in the band beneath
         it. Landing and result screens keep both.

         In this function rather than in the sidebar-nav block below, because it
         is the one place both hosts read: the desktop host takes it through a
         max-width:767px media query, the mobile host takes it whole. The body
         class comes from the tool variable, so the widget's bare body does not
         match -- and it has neither element anyway. */
      body.mockdraft-simulator:has(.draft-simulation-container:not(.hidden)) .pfn-text-content-container,
      body.mockdraft-simulator:has(.draft-simulation-container:not(.hidden)) .pfn-footer {
        display: none;
      }
{/function}
<style>
  .ad-container-sticky-right {
    position: fixed;
    width: 160px;
    height: 600px;
    top: 231px;
    overflow: hidden;
  }

  .ad-container-sticky-right {
    right: .5%;
  }

  .team-selection-container {
    width: 63%;
  }

  .team-holder {
    width: 47%;
  }

  .final-trades-container {
    border: unset;
    padding: unset;
    height: 60vh;
  }

  .final-trades-container .final-trades-holder {
    height: 550px;
    max-width: 825px;
    overflow: unset;
  }

  .simulator-content-holder {
    padding: unset;
    border: unset;
    margin-bottom: 20px;
  }

  .draft-simulation-container {
    border: unset;
    padding: unset;
    height: 60vh;
  }

  {if $is_desktop}
    .pfn-content-container {
      margin-top: 0px;
    }
    
    #ad-banner-container {
      background-color: #ededed;
      height: 105px;
      position: fixed;
      top: 93px;
      width: 100%;
      z-index: 10000;
      overflow: hidden;
    }
  {/if}
  .draft-simulation-container .rounds-pics-container,
  .draft-simulation-container .players-container {
    height: 100%;
  }

  .selected-user-teams-container {
    top: unset;
  }

  .rounds-pics-holder .round-number {
    top: 44px;
  }

  .start-draft-btn:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .mypicks-btn-container .draft-result-btn.selected,
  .mypicks-btn-container .my-picks-btn.selected {
    background: #0857C3;
  }

  .players-positions .positions.selected {
    color: #0857C3;
    border-bottom-color: #0857C3;
  }

  .offer-selection button,
  .teams-result-container .restart-simulation,
  .trade-proposal-user-teams-conatiner .nav-btn-container .nav-btn.next,
  .trade-proposal-all-teams-conatiner .nav-btn-container .nav-btn.next,
  .trade-proposal-all-teams-conatiner .nav-btn-container .nav-btn.confirm,
  .nav-btn-container .nav-btn.back,
  .nav-btn-container .nav-btn.propose,
  .nav-btn-container .nav-btn.back {
    border-radius: 6px;
  }

  .offer-header,
  .trade-proposal-user-teams-conatiner .proposal-header,
  .trade-proposal-all-teams-conatiner .proposal-header,
  .team-needs-container .team-needs-header,
  .restart-confirmation-popup-container .confirmation-header,
  .text-filter {
    background: #2d2d2d;
  }

  .positions-filters {
    top: 32px;
  }

  .players-positions {
    top: -1px;
  }

  .resume-draft,
  .pause-draft,
  .show-offers,
  .restart-simulation,
  .result-btn,
  .user-proposal,
  .ranking-updates-btn {
    font-size: 16px;
  }

  .positions-filters .positions .selected {
    background-color: #0857C3;
  }

  .selected-user-teams-container .team-logo-btn-container.selected .team-logo-btn,
  .teams-result-container button.selected {
    border-color: #0857C3;
  }

  .selected-user-teams-container .team-logo-btn-container.selected {
    border-bottom-color: #0857C3;
  }

  .picks-input-holder input:checked {
    accent-color: #0857C3;
  }

  .result-header {
    background: #0957c3;
  }

  .teams-result-holder .team-selections-header {
    background: #0957c3;
    padding: 3px 6px;
  }

  .final-result-header .result-btns-holder button.selected {
    background: #0857c3;
  }

  .round-trades-container .rounds-trades-header {
    background: #0957c3;
    padding: 3px 16px;
  }

  .all-rounds-container .round-trades-selector.selected {
    background: #2d2d2d;
  }

  .player-info-popup .player-info-header {
    background: #2d2d2d;
  }

  .utility-container .restart-sim-btn,
  .utility-container .back-to-room-btn {
    background: #000;
  }

  .trade-data-container .trade-data-header {
    background: #2d2d2d;
  }

  .next-pick-container {
    top: 43px;
  }

  .offer-selection .btn-counter-offer {
    background: #2d2d2d;
  }

  .restart-confirmation-popup-container .confirmation-btn-container .confirm-restart {
    border-radius: 4px;
  }

  .team-picks-info-popup .team-picks-header {
    background: #2d2d2d;
  }

  .add-player {
    color: #fff;
    border: unset;
    background: #0857C3;
    box-shadow: 1px 2px 6px #07316A;
  }

  .offer-container {
    width: 462px;
    margin-left: -423px;
  }

  .trade-proposal-user-teams-conatiner,
  .trade-proposal-all-teams-conatiner {
    width: 462px;
    margin-left: -423px;
  }

  .player-info-body .player-description-container {
    min-height: 268px;
  }

  .trade-data-container {
    width: 462px;
    height: 465px;
    margin-top: -245px;
    margin-left: -423px;
  }

  .team-picks-info-popup {
    width: 462px;
    height: 465px;
  }

  .simulation-management-buttons-container {
    border-radius: 8px;
  }

  .simulation-management-buttons-container .pick-timer-container {
    padding: 6px auto;
    display: none;
    flex-direction: column;
    background: #fff;
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 75px;
    border-bottom: 1px solid #e9e9e9;
  }

  .pick-timer-container .drafting-info {
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
    color: #2d2d2d;
  }

  .pick-timer-container .pick-timer {
    font-size: 14px;
    line-height: 21px;
    font-weight: 600;
    color: #E3B100;
  }

  .simulation-management-buttons-container .pick-timer-container.urgent {
    background: #FFF8F8;
  }

  .simulation-management-buttons-container .pick-timer-container.urgent .pick-timer {
    color: #D32F2F;
  }

  .nfl-feeds-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  /* Scoped: this file is shared with the mobile host and the widget, and
     neither carries the body class. Both had no padding here before. */
  body.pfn-has-sidebar-nav .nfl-feeds-container {
    padding: 14px 22px;
  }

  .nfl-feeds-container .header-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    width: 100%;
    background: #0957c3;
    padding: 10px 20px;
    border-radius: 12px;
  }

  .nfl-feeds-container .header-container .header-bar {
    width: 4px;
    background: #fff;
    height: 21px;
  }

  .nfl-feeds-container .header-container .header-text {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    color: #fff;
  }

  .nfl-feeds-container .feeds-holder {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .nfl-feeds-container .feeds-holder .single-feed {
    width: calc(50% - 10px);
    display: flex;
    gap: 16px;
    text-decoration: none;
    justify-content: left;
    align-items: center;
  }

  .nfl-feeds-container .feeds-holder .single-feed img {
    border-radius: 12px;
    width: 120px;
    height: 68px;
  }

  .single-feed .feed-data-container {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    gap: 4px;
    justify-content: space-between;
    align-items: center;
  }

  .single-feed .feed-data-container .feed-title {
    font-size: 14px;
    line-height: 21px;
    font-weight: 500;
    color: #0A0A0A;
    max-height: 65px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .single-feed .feed-data-container .feed-time {
    font-size: 11px;
    line-height: 16px;
    font-weight: 400;
    color: #0A0A0A;
    align-self: flex-start;
  }

  .nfl-feeds-container button.load-more-feeds-btn {
    margin-top: 5px;
    width: 100%;
    padding: 8px 0;
    background: #0957c3;
    color: #fff;
    font-size: 16px;
    line-height: 18px;
    font-weight: 500;
    border: unset;
    border-radius: 2px;
  }

  .inputs-container .players-list-selection-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .inputs-container .players-list-selection-container img.widget-pfsn-logo {
    width: 26px;
    height: 26px;
    background: unset;
  }

  .inputs-container .players-list-selection-container .players-list-selection-container-holder {
    display: flex;
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

  .draft-rankings-provider-container {
    display: flex;
    /* with the custom order note hidden the single child still sits left */
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    font-style: italic;
    margin-top: -10px;
  }

  .pfn-player-info-body {
    flex: 1;
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  .pfn-player-iframe-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 16px;
    color: #666;
  }

  .pfn-player-iframe {
    display: none;
    width: 100%;
    height: 100%;
    border: none;
  }

  .pfn-player-info-popup {
    width: 70vw;
    height: 82vh;
    top: unset;
    bottom: 100px;
    left: 50%;
    transform: translate(-50%);
  }

  .final-result-container .quick-links-widget .panel-header {
    background: #0957c3;
    color: #fff;
    border-radius: 12px;
  }

  .final-result-container .panel-header>.panel-heading {
    font-weight: 500;
  }

  /* Tablet landscape and below -- see the breakpoint table in theme.tpl. This
     file is also served to /sk-proxy/:brand/mockdraft-simulator-widget, which
     has no sidebar-nav body class, so moving the edge off 1280 is scoped to
     the tool. The widget keeps the rule it had. */
  @media (max-width: 1280px) {
    body:not(.pfn-has-sidebar-nav) .pfn-player-info-popup {
      width: 80vw;
    }
  }

  @media (max-width: 1365px) {
    body.pfn-has-sidebar-nav .pfn-player-info-popup {
      width: 80vw;
    }
  }

  /* Mobile. On the desktop host this stops at 767 rather than 768: the
     tablet-portrait rules start AT 768, and this block caps .content to
     --tab-width (600px), which squeezed the whole tool to 600px on the first
     pixel of the tablet band. The mobile host has no tablet band and keeps
     the inclusive 768 it always had. */
  @media (max-width: {if $is_desktop}767{else}768{/if}px) {
    .pfn-content-container .content {
      max-width: 100%;
      max-width: var(--tab-width);
    }

    .pfn-content-container .content>* {
      max-width: var(--tab-width);
    }

    .pfn-text-content-container {
      padding: 20px;
    }

    .draft-simulation-container,
    .final-trades-container {
      margin-top: 9vh;
    }

    .trade-proposal-response-popup,
    .trade-data-container,
    .multi-user-remove-participants-popup,
    .team-picks-info-popup {
      width: 100%;
      margin: unset;
      transform: translate(-50%, -50%);
    }

    .simulation-management-buttons-container .pick-timer-container {
      flex-direction: row;
      gap: 7px;
      height: 30px;
      position: fixed;
      bottom: 84px;
      padding: 2px auto;
      display: none;
      background: #fff;
      width: 100%;
      justify-content: center;
      align-items: center;
      border-bottom: unset;
      border-top: 1px solid #e9e9e9;
    }

    .draft-rankings-provider-container {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2px;
      padding: 0 22px;
      font-size: 12px;
      margin-top: unset;
    }

    .pfn-player-info-popup {
      width: 100%;
      max-width: var(--tab-width);
      height: 70vh;
      top: 25px;
    }

    .final-result-container .quick-links-widget .panel-header {
      margin: 10px 10px 0 10px;
      padding: 8px;
      width: unset;
    }

    .nfl-feeds-container .feeds-holder .single-feed img {
      width: 112px;
      height: 63px;
    }

    .nfl-feeds-container,
    .nfl-feeds-container .header-container {
      padding: 8px;
    }
  }
</style>

{* Mobile stylesheet -- see the note in nfl-draft-simulator/common/teams/styles.tpl.
   Width-based on the desktop host, unconditional on the mobile host. *}
{if $is_desktop}
  <style>
    @media (max-width: 767px) {
      {call getMDSPFNMobileCSS}
    }
  </style>
{else}
  <style>
    {call getMDSPFNMobileCSS}
  </style>
{/if}

<style>
  /* ==========================================================================
     About / FAQ section.

     routes/sk-proxy.php builds page_text_content for this tool as one intro
     block plus eight question cards; third-party/proxy/pfn/index.tpl drops it
     into .pfn-text-content-container. The default treatment there is a white
     bordered box of stacked h2/p pairs, which for nine of them is a long grey
     wall. This lays it out the way the other PFN tool pages present theirs:
     the intro on the left, the questions as cards in a two-up grid.

     Scoped to the tool's body class so the widget, which renders through a
     bare body, and every other page using this container are untouched.
     Heading levels are unchanged -- the questions are still h2, sized down by
     context rather than demoted, so the document outline stays as it was. */
  body.mockdraft-simulator .pfn-text-content-container {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr);
    gap: 40px;
    align-items: start;
    background: #080A3C;
    border: none;
    border-radius: 12px;
    padding: 40px;
  }

  body.mockdraft-simulator .pfn-text-content-container .mds-about-eyebrow {
    display: block;
    margin-bottom: 14px;
    color: #FFD166;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  body.mockdraft-simulator .pfn-text-content-container .mds-about h2 {
    margin: 0 0 18px;
    color: #fff;
    font-size: 34px;
    line-height: 1.18;
    font-weight: 700;
  }

  body.mockdraft-simulator .pfn-text-content-container .mds-about p {
    margin: 0;
    color: #C3C9DF;
    font-size: 16px;
    line-height: 1.7;
  }

  /* Columns rather than a grid, because these answers are not balanced --
     "How Does the NFL Draft Work?" runs three paragraphs against neighbours of
     one. A grid sizes each row to its tallest card, which leaves either a
     mostly empty bordered box next to the long one (align-items: stretch) or a
     400px void before the next row (align-items: start). Columns have no rows
     to align, so the cards pack continuously and the two columns come out
     level. The trade is reading order: down the left column, then the right,
     rather than left-to-right in pairs. */
  body.mockdraft-simulator .pfn-text-content-container .mds-faq-grid {
    columns: 2;
    column-gap: 20px;
  }

  body.mockdraft-simulator .pfn-text-content-container .mds-faq-card {
    padding: 20px 22px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.045);
    /* A column-gap covers the horizontal space; the vertical rhythm has to
       come from the cards. break-inside keeps a card whole rather than letting
       it split across the column boundary. */
    margin-bottom: 20px;
    break-inside: avoid;
  }

  body.mockdraft-simulator .pfn-text-content-container .mds-faq-card h2 {
    margin: 0 0 10px;
    color: #fff;
    font-size: 17px;
    line-height: 1.35;
    font-weight: 700;
  }

  body.mockdraft-simulator .pfn-text-content-container .mds-faq-card p {
    margin: 0;
    color: #B9C2D8;
    font-size: 15px;
    line-height: 1.6;
  }

  body.mockdraft-simulator .pfn-text-content-container .mds-faq-card p + p {
    margin-top: 10px;
  }

  /* The intro column stops earning its width once the grid beside it is
     narrower than the text; stack it above the cards instead. */
  @media (max-width: 1023px) {
    body.mockdraft-simulator .pfn-text-content-container {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
      padding: 28px;
    }

    body.mockdraft-simulator .pfn-text-content-container .mds-about h2 {
      font-size: 28px;
    }
  }

  @media (max-width: 767px) {
    body.mockdraft-simulator .pfn-text-content-container {
      gap: 22px;
      padding: 20px;
    }

    body.mockdraft-simulator .pfn-text-content-container .mds-about h2 {
      font-size: 24px;
    }

    body.mockdraft-simulator .pfn-text-content-container .mds-faq-grid {
      columns: 1;
    }

    body.mockdraft-simulator .pfn-text-content-container .mds-faq-card {
      margin-bottom: 14px;
    }
  }
</style>

{* ============================================================================
   Sidebar-nav layout overrides.

   This stylesheet is shared with /sk-proxy/:brand/mockdraft-simulator-widget,
   so everything below is scoped to body.pfn-has-sidebar-nav. Only the full tool
   page carries that class; the widget renders through
   templates/pages/static/widgets/iframe/index.tpl with a bare <body> and cannot
   match. The body class (rather than the .has-sidebar-nav wrapper class) is the
   hook because several MDS popups are appended to document.body by
   multiuser-js.tpl and so are not descendants of .pfn-content-wrapper.
   ============================================================================ *}
<style>
  {if !$is_desktop}
    /* The 35px PFN header + 35px secondary nav are replaced by the sidebar's
       36px mobile topbar, so every bar that was pinned under that stack moves
       up by 34px (70px -> 36px, 97px -> 63px). */
    body.pfn-has-sidebar-nav .bottom-controls,
    body.pfn-has-sidebar-nav .simulation-management-buttons-container {
      top: 36px;
    }

    /* ...but moving a fixed bar does not reserve room for it. .bottom-controls
       is the last element in mobile.tpl and only fixed into place at the top,
       so the page never accounted for its height; the original layout covered
       that by reserving 125px on .pfn-content-wrapper for the whole header
       stack. The sidebar shell reserves 35px there, enough for its own fixed
       header and nothing else, which left the result screen's hero title row
       (measured 51->71) sitting under this bar's 36->87 band.

       Reserve the bar as well, but only while it is showing -- it carries the
       hidden class on every other screen, and the landing page must not start
       87px down. 36px is the bar's own offset above, 51px its measured height.

       !important because common/sidebar-nav/styles.tpl pins this margin to
       35px with one, and nothing short of that reaches it. */
    body.pfn-has-sidebar-nav:has(.bottom-controls:not(.hidden)) .pfn-content-wrapper.has-sidebar-nav {
      margin-top: calc(36px + 51px) !important;
    }

    body.pfn-has-sidebar-nav .draft-simulation-container {
      top: 63px;
    }

    /* The landing-page menu bar was fixed under the header, with its space
       reserved by .pfn-content-wrapper's 125px margin. That margin is zeroed by
       the sidebar layout and the hero banner + promo bar now sit at the top of
       the wrapper, so the bar has to flow with the page and stick instead --
       fixed at 36px it would cover the hero banner at scroll top. */
    body.pfn-has-sidebar-nav .landing-page-container .draft-option-btns-container {
      position: sticky;
      top: 36px;
    }

    /* Was 195px: 36px topbar + the 50px menu bar it sticks below. */
    body.pfn-has-sidebar-nav .multi-user-create-join-room-container .join-room-container {
      top: 86px;
    }
  {/if}

  /* The dimming overlays started below the fixed PFN header (35px on mobile,
     50px for the multi-user one). The sidebar layout drops that header, so they
     cover the full viewport instead of leaving an undimmed strip over the hero
     banner. The mobile topbar sits at z-index 2010 and still paints above them. */
  body.pfn-has-sidebar-nav .overlay,
  body.pfn-has-sidebar-nav .loading-overlay,
  body.pfn-has-sidebar-nav .overlay2 {
    top: 0;
  }

  /* The landing block's width, the team grid's column count and the menu rail
     are all reserved in pre-styles.tpl instead. They decide the shape of the
     screen, and this file is parsed after the render-blocking axios script in
     home/js.tpl -- setting them here meant painting the old layout first and
     snapping to the new one. */

  {* Desktop host only. This file ships to both hosts and pfn-has-sidebar-nav
     is on both, so an ungated max-width:767px block here would land on real
     phones -- and a phone in landscape is wide enough to match the 768-1023
     band below it as well. The mobile host has no width regimes: it serves the
     mobile markup under the mobile sheet at every width, exactly as before. *}
  {if $is_desktop}
  /* The narrow-width Player Pool tab from home/pfn/desktop.tpl. Hidden by
     default; the block below turns it on under 768px. */
  body.pfn-has-sidebar-nav .player-pool-btn {
    display: none;
  }

  /* ==========================================================================
     Result screen below the mobile edge.

     The desktop result markup renders here -- final-result/index.tpl picks
     desktop.tpl or mobile.tpl by hostname, so a narrowed window gets the
     desktop one -- and its header is a single non-wrapping row: three tabs,
     a Grades toggle, download, share and Restart. At 500px that runs 129px
     past the viewport and drags the whole page into a horizontal scroll.

     Not in pre-styles.tpl with the landing reservations: this screen ships
     hidden and only appears after a draft finishes, by which time every
     stylesheet has long arrived, so there is nothing to reserve.
     ========================================================================== */
  /* The drafting team's logo in the results header sits straight on the dark
     blue band, so anything with dark strokes -- most of them -- loses its
     outline against it. Put it on a white disc.

     The image is 50x33 and built in js/fragments/mockdraft-simulator.js
     (.result-header-team-logo), so the disc comes from a square box with
     object-fit:contain rather than from the image's own dimensions; padding
     keeps the mark off the edge and border-box stops it growing the header. */
  body.pfn-has-sidebar-nav .teams-result-holder .result-header-team-logo {
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    padding: 5px;
    border-radius: 50%;
    background: #fff;
    object-fit: contain;
  }

  /* Wrapping is not pinned to a breakpoint because the row does not fail at
     one: the tabs grow with the dashboard button and the label lengths, and
     at 768px it misses by nine pixels. Let flex decide. */
  body.pfn-has-sidebar-nav .final-result-header {
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 767px) {
    body.pfn-has-sidebar-nav .final-result-header .result-btns-holder,
    body.pfn-has-sidebar-nav .final-result-header .utility-container {
      width: 100%;
      justify-content: flex-start;
    }

    /* The holder is justify-content:center and the grey belongs to the buttons,
       so a full-width holder still renders the tab strip as a short centred
       block with bare card either side of it. On its own row it should read as
       a segmented control across the full width -- share the row three ways.
       Horizontal padding goes to zero because at 500px three lots of 25px a
       side no longer fit; flex sizing replaces it. */
    body.pfn-has-sidebar-nav .final-result-header .result-btns-holder button {
      flex: 1 1 0;
      padding-left: 0;
      padding-right: 0;
      white-space: nowrap;
    }

    /* The draft screen as an app shell, the way the mobile sheet intends it:
       pinned under the topbar, filling the rest of the viewport, with the
       board and pool scrolling inside it rather than the page scrolling around
       them. The controls sit at the top of that shell and so stay put.

       This was briefly switched to position:static because the pinned box was
       landing 83px off the left edge. That was never the pinning's fault --
       .simulator-content-holder was capped at --tab-width (600px), so from
       601px up the fixed box resolved its edges against a containing block
       narrower than the window. pre-styles.tpl releases that cap now, so the
       shell lands correctly: measured x=0 and full width at both 390px and
       700px.

       36px is the bottom of the sidebar shell's fixed .pfn-mobile-topbar. dvh
       follows vh for browsers that have it, so a phone's collapsing URL bar
       does not leave the pool cut off. z-index stays low: the offer and trade
       popups are appended to document.body at 10001 and must stay above. */
    body.pfn-has-sidebar-nav .draft-simulation-container {
      position: fixed;
      top: 36px;
      left: 0;
      width: 100%;
      height: calc(100vh - 36px);
      height: calc(100dvh - 36px);
      margin-top: 0;
      z-index: 4;
      background: #fff;
    }

    /* Below the mobile edge the board and the pool stack, so the pool sat
       under the board instead of beside it. mobile.tpl answers this with a
       third tab over a .sim-content-slider; that structure does not exist in
       the desktop markup, where the pool is a permanent second column and the
       two tabs only swap the board for My Picks. So the third tab drives the
       same one-pane-at-a-time switch through the panes this markup does have.
       Above the edge the grid shows both columns and the tab is hidden. */
    body.pfn-has-sidebar-nav .player-pool-btn {
      display: block;
    }

    /* home/styles.tpl styles the two original tabs by class, so the third one
       arrived as a default button with a border. Same pill, same selected
       colours -- #0857C3 is the PFN override of that sheet's red. */
    body.pfn-has-sidebar-nav .mypicks-btn-container .player-pool-btn {
      font-size: 14px;
      font-weight: 500;
      color: #999999;
      background: transparent;
      border: none;
      border-radius: 30px;
    }

    body.pfn-has-sidebar-nav .mypicks-btn-container .player-pool-btn.selected {
      color: #fff;
      background: #0857C3;
    }

    /* The two original tabs carry an explicit 260px width, which left the
       third one 42px of a space-evenly row. Let all three share the row. */
    body.pfn-has-sidebar-nav .mypicks-btn-holder > button {
      flex: 1 1 0;
      width: auto;
      min-width: 0;
      padding: 7px 0;
    }

    body.pfn-has-sidebar-nav .draft-simulation-container .players-container {
      display: none;
    }

    body.pfn-has-sidebar-nav .draft-simulation-container.show-pool .players-container {
      display: flex;
    }

    /* The tabs live inside .rounds-pics-container, so it stays in the flow to
       carry them and collapses to just that row. flex:0 0 auto undoes the
       flex:1 1 0 the panes carry inside the shell -- without it the collapsed
       board still claims its share of the height and the pool gets half a
       screen. */
    body.pfn-has-sidebar-nav .draft-simulation-container.show-pool .rounds-pics-container {
      height: auto;
      overflow: visible;
      flex: 0 0 auto;
    }

    body.pfn-has-sidebar-nav .draft-simulation-container.show-pool .next-pick-container,
    body.pfn-has-sidebar-nav .draft-simulation-container.show-pool .rounds-pics-holder,
    body.pfn-has-sidebar-nav .draft-simulation-container.show-pool .mypicks-container {
      display: none;
    }

    /* The toolbar is pinned too, and on its own -- it is a child of the draft
       screen but positions against the viewport, so with the screen back in
       the flow it floated up over the page header. Flowing it puts it between
       the board and the pool, which is its DOM position; order pulls it back
       to the top, where the grid above 768px also puts it. */
    body.pfn-has-sidebar-nav .simulation-management-buttons-container {
      position: static;
      order: -1;
    }

    /* Fill the shell instead of carrying fixed heights: whichever pane the tabs
       are showing takes the space left under the controls, and scrolls inside
       itself. min-height:0 because a flex item will not shrink below its
       content otherwise, which would push the pane's bottom past the shell. */
    body.pfn-has-sidebar-nav .draft-simulation-container .rounds-pics-container,
    body.pfn-has-sidebar-nav .draft-simulation-container .players-container {
      height: auto;
      flex: 1 1 0;
      min-height: 0;
    }

    /* Pick rows sit 1px off the card edge below the mobile edge -- the pick
       number reads as if it is touching the border. The 20px margin-left the
       desktop board carries was dropped when these lists moved to CSS columns,
       because a margin there indents every column rather than just insetting
       the row. Padding does the inset without touching the column geometry.

       16px matches .rounds-trades-header's own text inset, so the number lines
       up with the card title above it rather than picking an arbitrary gap.
       Above 768px the rows already clear the edge by 9px and are left alone. */
    body.pfn-has-sidebar-nav .all-rounds-trades-container .round-selection-body .pic-container,
    body.pfn-has-sidebar-nav .teams-result-holder .team-selection-body .pic-container {
      padding-left: 16px;
    }

    /* Dashboard login overlay.

       The base rule keeps this overlay inside .result-screen-dashboard, which
       is position:relative, so the blur it carries covers the dashboard and
       nothing else. common/final-result/styles.tpl then switches it to
       position:fixed for mobile, and because the base rule also gives it
       top:0/left:0/100%/100%, fixed re-resolves all four against the viewport:
       opening the dashboard blurs the entire page, the result header and its
       buttons included. Put it back in the dashboard's own box.

       The login prompt goes back in the flow with it -- pinned at a fixed
       312px it would sit over the header once the overlay stopped being
       viewport-sized -- and the overlay already centres it with
       justify-content/align-items. */
    body.pfn-has-sidebar-nav .result-screen-dashboard .login-container-overlay {
      position: absolute;
    }

    body.pfn-has-sidebar-nav .result-screen-dashboard .login-container-overlay .login-container {
      position: static;
      top: auto;
      z-index: auto;
    }

    /* Keep the tabs and the Grades/download/share/Restart row reachable while
       the dashboard scrolls under them. 36px is the bottom of the sidebar
       shell's fixed .pfn-mobile-topbar, which this has to sit below; the
       z-index only needs to clear the result content, not that bar. */
    body.pfn-has-sidebar-nav .final-result-header {
      position: sticky;
      top: 36px;
      z-index: 5;
      background: #fff;
    }

    /* common/pfn-more-tools/styles.tpl turns this panel    /* common/pfn-more-tools/styles.tpl turns this panel into a fixed bottom
       sheet -- bottom:0, z-index:10001, a close button. That is right on the
       mobile host, where the sheet is opened from a trigger, but the desktop
       markup carries the same panel inline at the foot of the result and has
       nothing to open or close it. Left fixed it pins itself over the results
       card. Keep it in the flow and take only the cosmetic half of the sheet. */
    body.pfn-has-sidebar-nav .more-pfn-tools-container {
      position: static;
      width: auto;
      z-index: auto;
      border-radius: 0;
    }

    body.pfn-has-sidebar-nav .more-pfn-tools-container .close-icon-btn {
      display: none;
    }

  }

  /* ==========================================================================
     Result board columns.

     The board lays picks out column-major with flex-wrap in a column-direction
     box, so the number of columns is a side effect of two things that have
     nothing to do with the viewport: the container's max-height and how tall a
     row happens to be. The column WIDTH is then a separate fixed guess -- 30%
     of the card, which only adds up while exactly three columns form. Let the
     two disagree, by a taller row or a different pick count, and the columns
     that do form no longer fit: at 1200px the third one crosses the card edge,
     and with taller rows a fourth appears and hangs outside it entirely.

     CSS columns invert that. The count is the input and the browser derives the
     width from it, so the columns always add up to the card no matter how tall
     the rows are or how many picks there are. Fill order is unchanged -- down a
     column, then across to the next -- which is what the flex version produced.
     ========================================================================== */
  body.pfn-has-sidebar-nav .all-rounds-trades-container .round-selection-body,
  body.pfn-has-sidebar-nav .teams-result-holder .team-selection-body {
    display: block;
    max-height: none;
    column-gap: 20px;
  }

  body.pfn-has-sidebar-nav .all-rounds-trades-container .round-selection-body .pic-container,
  body.pfn-has-sidebar-nav .teams-result-holder .team-selection-body .pic-container {
    width: auto;
    margin-left: 0;
    /* Rows are a fixed height and must not be split down the middle. */
    break-inside: avoid;
  }

  body.pfn-has-sidebar-nav .all-rounds-trades-container .round-selection-body,
  body.pfn-has-sidebar-nav .teams-result-holder .team-selection-body {
    columns: 1;
  }

  @media (min-width: 768px) {
    body.pfn-has-sidebar-nav .all-rounds-trades-container .round-selection-body,
    body.pfn-has-sidebar-nav .teams-result-holder .team-selection-body {
      columns: 2;
    }
  }

  @media (min-width: 1024px) {
    body.pfn-has-sidebar-nav .all-rounds-trades-container .round-selection-body,
    body.pfn-has-sidebar-nav .teams-result-holder .team-selection-body {
      columns: 3;
    }
  }

  /* Below the mobile edge the column count follows the Grades toggle: one
     column with grades on, because the grade chip needs the width, and two
     without it.

     The state comes from the class toggleGrades() puts on .final-result-holder
     in js/fragments/mockdraft-simulator.js. That function has a second branch
     that rewrites an inline max-height to set the count, but it is reached
     through $(".final-trades-container"), which only exists in the mobile
     host's markup -- this host renders final-result/desktop.tpl, so the class
     is the only signal that arrives here. */
  @media (max-width: 767px) {
    body.pfn-has-sidebar-nav .final-result-holder.grades-hidden .all-rounds-trades-container .round-selection-body,
    body.pfn-has-sidebar-nav .final-result-holder.grades-hidden .teams-result-holder .team-selection-body {
      columns: 2;
    }
  }
  {/if}

  /* Viewport-centred popups land half the rail's width left of the content
     column once the sidebar is pinned, so re-centre them on the content. Below
     1200px the rail is off-canvas and the originals are already correct. */
  @media (min-width: 1200px) {
    body.pfn-has-sidebar-nav .offer-container,
    body.pfn-has-sidebar-nav .trade-data-container,
    body.pfn-has-sidebar-nav .trade-proposal-user-teams-conatiner,
    body.pfn-has-sidebar-nav .trade-proposal-all-teams-conatiner,
    body.pfn-has-sidebar-nav .team-needs-container,
    body.pfn-has-sidebar-nav .team-picks-info-popup,
    body.pfn-has-sidebar-nav .trade-proposal-response-popup,
    body.pfn-has-sidebar-nav .multi-user-remove-participants-popup,
    body.pfn-has-sidebar-nav .multi-user-info-container-popup,
    body.pfn-has-sidebar-nav .multi-user-chat-popup,
    body.pfn-has-sidebar-nav .pfn-player-info-popup,
    body.pfn-has-sidebar-nav .share-toast {
      left: calc(50% + var(--sidebar-width) / 2);
    }

    body.pfn-has-sidebar-nav .restart-confirmation-popup-container {
      left: calc(50% - 395px + var(--sidebar-width) / 2);
    }

    body.pfn-has-sidebar-nav .player-info-popup {
      left: calc(50% - 231px + var(--sidebar-width) / 2);
    }
  }
</style>
