{if !$is_desktop}
  {function getMDSPFNMobileCSS}
    <style>
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
        padding: 16px;
        /* margin-bottom: 100px; */
      }

      .nfl-feeds-container .header-container .header-text {
        font-size: 14px;
        line-height: 19px;
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

      .nfl-feeds-container .feeds-holder .single-feed img {
        width: 84px;
        height: 73px;
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
    </style>
    <style>
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
    </style>
  {/function}
{/if}
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
    border: 1px solid #DFE1E6;
    padding: 23px;
    gap: 16px;
  }

  .nfl-feeds-container .header-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .nfl-feeds-container .header-container .header-bar {
    width: 4px;
    background: #172B4D;
    height: 21px;
  }

  .nfl-feeds-container .header-container .header-text {
    font-size: 16px;
    line-height: 21px;
    font-weight: 700;
    color: #172B4D;
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
    justify-content: center;
    align-items: center;
  }

  .nfl-feeds-container .feeds-holder .single-feed img {
    border-radius: 12px;
    width: 100px;
    height: 80px;
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
    background: #172B4D;
    color: #fff;
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
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
    justify-content: flex-start;
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

  @media(max-width: 1280px) {
    .pfn-player-info-popup {
      width: 80vw;
    }
  }

  @media (max-width: 768px) {
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
      justify-content: center;
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
  }
</style>

{if !$is_desktop}
  {call getMDSPFNMobileCSS}
{/if}
