<style>
  .simulator-content-container .landing-page-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    width: 985px;
    min-height: 636px;
  }

  .landing-page-container .draft-option-btns-container {
    min-height: inherit;
    width: 75px;
    box-shadow: 2px 0px 4px 0px #0000001A;
    display: flex;
    flex-direction: column;
    border-radius: 13px 0 0 13px;
  }

  .draft-option-btns-container .draft-btns-heading {
    background: #2d2d2d;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    padding: 8px 11px;
    border-radius: 13px 0 0 0;
    text-align: center;
  }

  .draft-option-btn.logout-container {
    cursor: pointer;
    position: relative;
  }

  .draft-option-btns-container .mds-logout-btn {
    position: absolute;
    left: -18px;
    top: -21px;
    width: 86px;
    padding: 6px 34px 6px 10px;
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    background: #fff;
    z-index: 30;
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
    text-wrap: nowrap;
  }

  .simulator-content-container .draft-options-view-container {
    background: #F6F7FF;
    height: 100%;
    min-height: inherit;
    width: 100%;
    border-radius: 0 13px 13px 0;
    border: 1px solid #e9e9e9;
    border-left: none;
  }

  .draft-options-view-container .teams-filters-container,
  .draft-options-view-container .multi-user-create-join-room-container {
    padding: 16px;
  }

  .draft-options-view-container .multi-user-create-join-room-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
    height: 100%;
    min-height: inherit;
  }

  .draft-options-view-container .teams-filters-container {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .draft-options-view-container .multi-user-create-join-room-container .create-room-container {
    height: 100%;
    min-height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    border: 1px solid #D5D5D5;
    gap: 18px;
    background: #F8F8F8;
    border-radius: 8px;
    padding: 16px;
  }

  .draft-option-btns-container .draft-option-btn {
    border: unset;
    padding: 12px 25px;
    background: #fff;
    color: #080A3C;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 7px;
    position: relative;
  }

  .draft-option-btns-container .draft-option-btn.selected {
    background: #0857C3;
    color: #fff;
  }

  .create-room-container .create-room-text {
    color: #2d2d2d;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }

  .create-room-container .create-room-btn {
    border: 1px solid #37C77A;
    background: #E9F7F2;
    width: 100%;
    padding: 6px 16px 6px 16px;
    border-radius: 8px;
    color: #37C77A;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }

  .create-room-container .instructions-btn {
    width: 100px;
    color: #2d2d2d;
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
    text-decoration: underline;
    border: unset;
    padding: unset;
  }

  .draft-option-btn .triangle-right {
    position: absolute;
    left: 50px;
    width: 0;
    height: 0;
    border-top: 28px solid transparent;
    border-left: 40px solid #0857C3;
    border-bottom: 28px solid transparent;
    z-index: 10;
  }

  .draft-option-btn.logout-container img {
    width: 20px;
    height: 4px;
  }

  .draft-option-btn img {
    width: 20px;
    height: 20px;
  }

  .draft-option-btn span {
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
  }

  .draft-option-btn .new-text {
    position: absolute;
    top: 8px;
    right: 0;
    background: #d32f2f;
    color: #fff;
    padding: 1px 5px;
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
    border-radius: 3px;
  }

  .draft-option-btn img,
  .draft-option-btn span {
    z-index: 20;
  }

  @media (max-width: 768px) {
    .mds-roster-result-container {
      top: unset;
      left: 0;
      transform: unset;
      bottom: 0;
      width: 100%;
      max-height: 600px;
      overflow: auto;
    }

    .mds-roster-result-container .mds-roster-result-holder-wrapper {
      padding: unset;
      max-height: 450px;
      overflow: auto;
    }

    .landing-page-container .draft-option-btns-container {
      position: fixed;
      bottom: 0;
      flex-direction: row;
      height: 50px;
      width: 100%;
      z-index: 100;
    }

    .draft-option-btns-container .draft-option-btn {
      width: 33.33%;
    }

    .draft-options-view-container .multi-user-create-join-room-container {
      flex-direction: column-reverse;
    }

    .draft-options-view-container .multi-user-create-join-room-container .create-room-container {
      width: 100%;
    }

    .multi-user-create-join-room-container .join-room-container {
      width: 100%;
      position: sticky;
      top: 195px;
    }

    .join-room-container .join-room-popup-container {
      border: unset;
    }

    .draft-option-btn.logout-container {
      padding: 0;
      width: 35px;
    }

    .draft-option-btn.logout-container img {
      transform: rotate(90deg);
    }

    .draft-option-btns-container .mds-logout-btn {
      left: -60px;
    }

    .bottom-controls .dashboard-btn {
      position: relative;
    }

    .bottom-controls .dashboard-btn .new-text {
      position: absolute;
      top: 1px;
      right: -10px;
      background: #d32f2f;
      color: #fff;
      padding: 1px 5px;
      font-size: 12px;
      line-height: 14px;
      font-weight: 600;
      border-radius: 3px;
    }

    .draft-option-btn .new-text {
      top: 0px;
      right: 24px;
    }

    .sim-content-slider {
      display: flex;
      width: 300%;
      height: 100%;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sim-content-slider.show-rounds-pics-container {
      transform: translateX(0%);
    }

    .sim-content-slider.show-players-container {
      transform: translateX(-33.33%);
    }

    .sim-content-slider.show-mypics-container {
      transform: translateX(-66.66%);
    }

    .sim-content-slider .rounds-pics-container,
    .sim-content-slider .players-container,
    .sim-content-slider .mypicks-container {
      width: 33%;
    }
  }
</style>

{if !$is_desktop}
  {function getMDSHomeMobileCSS}
    <style>
      #sticky-ad-container,
      #sticky-ad-container>div {
        bottom: 0px;
        z-index: 9999;
      }


      .content-wrapper {
        width: 100%;
      }

      .simulator-hero {
        padding: 16px 0 66px;
      }

      .simulator-heading {
        display: flex;
        justify-content: center;
        margin-bottom: unset;
      }

      .simulator-heading h1 {
        font-weight: 600;
        font-size: 20px;
        line-height: 30px;
      }

      .simulator-hero.small {
        height: 0px;
        padding: 16px 0 48px 0;
      }

      .content-holder {
        margin-bottom: 0px;
      }

      .hide-in-custom-pages {
        display: none;
      }

      .teams-filters-container {
        flex-direction: column;
      }

      .teams-filters-container,
      .draft-simulation-container {
        background: white;
      }

      .teams-selection-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #000;
      }

      .teams-selection-header .selection-text {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
      }

      .select-all,
      .clear-all {
        color: #d3bc90;
        width: 20%;
        padding: 15px;
        font-size: 15px;
      }

      .teams-logo-container img {
        width: 50px;
        height: 33px;
      }

      .team-groups {
        display: flex;
        justify-content: center;
        gap: 70px;
      }

      .btn-nfc {
        opacity: 0.4;
      }

      .btn-afc img,
      .btn-nfc img {
        width: 80px;
        height: 40px;
      }

      .start-sim {
        width: 100%;
        padding: 18px;
        background: black;
        color: white;
        font-size: 16px;
        font-weight: 600;
        position: fixed;
        bottom: 0;
      }

      .rounds-pics-holder {
        margin-bottom: 100px;
      }

      .rounds-pics-holder .round-number {
        background-color: #F5F5F5;
        top: 0;
      }

      .draft-simulation-container {
        width: 100%;
        margin-left: 0;
        flex-direction: column;
        padding: unset;
        border: unset;
        height: 79vh;
        gap: unset;
        justify-content: flex-start;
      }

      .simulation-management-buttons-container {
        flex-direction: row;
        width: 100%;
        gap: 0;
        justify-content: space-evenly;
        position: fixed;
        bottom: 0;
        padding-top: 0;
        background: white;
        border: none;
        border-radius: unset;
        box-shadow: 0px 4px 14px rgba(84, 87, 92, 0.1);
        z-index: 101;
        left: 0;
      }

      .resume-draft,
      .pause-draft,
      .team-needs-btn,
      .show-offers,
      .restart-simulation,
      .result-btn,
      .user-proposal,
      .ranking-updates-btn,
      .leave-multi-user-draft,
      .multi-user-draft-participants,
      .back-to-room-btn {
        font-size: 12px;
        line-height: 11px;
        font-weight: 500;
        width: 100%;
        border-radius: 0;
        padding: 18px 0;
      }

      .pic-container img {
        width: 40px;
        height: 27px;
      }

      .rounds-pics-container {
        height: 73vh;
      }

      .players-container {
        height: 80vh;
      }

      .rounds-pics-container,
      .players-container {
        width: 100%;
      }

      .rounds-pics-container {
        border: none;
        margin-bottom: 50px;
      }

      .sim-nav-container {
        display: flex;
        justify-content: space-evenly;
        position: sticky;
        border-radius: 30px;
        padding: 2px;
        margin: 0 20px;
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.07);
        border: 1px solid #E9E9E9;
      }

      .sim-pause-play-buttons {
        width: 100%;
      }

      .draft-result,
      .player-pool,
      .my-picks {
        font-size: 16px;
        font-weight: 500;
        color: #999999;
        padding: 7px 0;
        width: 100%;
        border-radius: 30px;
        border: none;
      }

      .draft-result.selected,
      .player-pool.selected,
      .my-picks.selected {
        color: #fff;
        background: #D32F2F;
      }

      .player {
        padding-left: 10px;
        padding-right: 10px;
      }

      .offer-container,
      .trade-data-container {
        margin: unset;
        width: 100%;
        max-width: var(--tab-width);
        height: 450px;
        transform: translate(-50%, -50%);
      }

      .trade-data-container {
        height: 400px;
      }

      .trade-data-container .offers-separator {
        height: 320px;
      }

      .offers-separator {
        height: 265px;
      }

      .selected-teams-container img {
        width: 33px;
        height: 22px;
        background: transparent !important;
      }

      .bottom-controls {
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        background: white;
      }

      .add-player img {
        width: 28px;
        height: 28px;
      }

      .simulation-management-buttons-container button {
        align-items: center;
      }

      .simulation-management-buttons-container img {
        width: 17px;
        height: 17px;
      }

      .bottom-controls button {
        display: flex;
        flex-direction: column;
        gap: 11px;
        width: 100%;
        border: none;
        justify-content: center;
        align-items: center;
        padding: 8px 0;
        margin: 0 15px;
      }

      .bottom-controls span {
        font-weight: 500;
        font-size: 10px;
        line-height: 11px;
        color: #080A3C;
      }

      .bottom-controls img {
        width: 17px;
        height: 17px;
        background: none;
      }

      .selected-teams-container {
        flex-direction: row;
        gap: 16px;
      }

      .full-result-btn.selected,
      .my-draft-btn.selected,
      .dashboard-btn.selected {
        border-top: 3px solid #D32F2F;
      }

      .full-result-btn.selected span,
      .my-draft-btn.selected span,
      .dashboard-btn.selected span {
        color: #D32F2F;
      }

      .full-result-btn.selected img,
      .my-draft-btn.selected img,
      .dashboard-btn.selected img {
        filter: brightness(0) saturate(100%) invert(26%) sepia(69%) saturate(1965%) hue-rotate(338deg) brightness(96%) contrast(99%);
      }

      .restart-simulation img {
        width: 20px;
      }

      .traded-player-name-position-container {
        margin-left: 12px;
        cursor: pointer;
      }

      .page-content-container {
        margin-top: 30px;
      }

      .future-round-pick-container {
        width: 50%;
        padding-left: 68px;
        margin: unset;
        height: 28px;
      }

      .page-seo-content .cms-content li {
        font-size: 14px !important;
      }

      .pic-container .pick-trade-info-btn {
        margin: 0 auto;
        margin-right: 40px;
      }

      .next-pick-container {
        top: 0;
      }

      .team-needs-picks-container .next-picks-text,
      .team-needs-picks-container .team-needs-text {
        font-size: 11px;
      }

      .team-needs-picks-container .next-picks,
      .team-needs-picks-container .team-needs {
        font-size: 11px;
      }

      .rounds-pics-holder .pic-container .pic-number,
      .players-holder .pic-container .pic-number {
        font-size: 14px;
      }

      .selected-user-teams-container {
        top: 0;
      }

      .trade-proposal-user-teams-conatiner,
      .trade-proposal-all-teams-conatiner,
      .team-needs-container {
        width: 100%;
        max-width: var(--tab-width);
        margin: unset;
        transform: translate(-50%, -50%);
      }

      .team-needs-grid-item {
        height: 60px;
        width: 100%;
        padding: 4px;
      }

      .team-needs-grid-item .team-logo {
        width: 35px;
      }

      .trade-proposal-user-teams-conatiner .user-teams-container {
        height: 315px;
        overflow-y: scroll;
      }

      .selected-picks-container .traded-player-name-position-container .player-name {
        font-size: 15px;
        line-height: 18px;
      }

      .selected-picks-container .single-pick .pick-number {
        font-size: 14px;
      }

      .selected-picks-container .traded-player-name-position-container .player-position-draftfrom-holder {
        font-size: 13px;
      }

      .seo-header-text {
        padding: 12px;
        padding-top: 0;
        overflow: hidden;
        height: auto;
      }

      .seo-header-text p {
        font-size: 13px !important;
        line-height: unset;
      }

      .restart-confirmation-popup-container {
        width: 100%;
        max-width: var(--tab-width);
        left: 50%;
        top: 50%;
        border-radius: 12px 12px 0 0;
        transform: translate(-50%, -50%);
        margin: unset;
      }

      .restart-confirmation-popup-container .confirmation-info-text-container {
        padding: 85px 20px;
      }

      .restart-confirmation-popup-container .confirmation-header {
        border-radius: 12px 12px 0 0;
        padding: 12px 20px;
      }

      .restart-confirmation-popup-container .confirmation-header .header-text {
        font-size: 14px;
      }

      .player-info-popup {
        width: 100%;
        top: 50%;
        left: 50%;
        max-width: var(--tab-width);
        transform: translate(-50%, -50%);
      }

      .player-info-header .player-info-header-text {
        font-weight: 500;
      }

      .player-info-popup .player-info-header {
        padding: 10px 20px;
      }

      .player-info-body .player-name {
        font-size: 16px;
      }

      .player-info-body .player-description-container {
        font-size: 14px;
      }

      .offer-container .current-team-shortname,
      .offer-container .offering-team-shortname {
        font-size: 17px;
        font-weight: 500;
      }

      .offer-container .offers span,
      .offer-container .current-team-pick span {
        font-size: 15px;
      }

      .team-picks-header .team-name {
        font-size: 14px;
      }

      .team-picks-info-popup .team-picks-list-container {
        padding: 8px 0;
      }

      .team-picks-info-popup {
        width: 100%;
        max-width: var(--tab-width);
        margin: unset;
        transform: translate(-50%, -50%);
      }

      .mypicks-container {
        overflow-y: scroll;
      }

      .mypicks-container .selected-picks-container .future-pick {
        font-size: 14px;
      }

      .trade-proposal-all-teams-conatiner {
        height: 455px;
      }

      .trade-proposal-all-teams-conatiner .proposal-header {
        padding: 12px 20px;
      }

      .trade-details-info-container .received-text {
        font-size: 15px;
      }

      .trade-details-info-container .team-picks {
        font-size: 14px;
      }

      .traded-text {
        font-size: 13px;
      }

      .picked-player {
        font-size: 13px;
      }

      .picks-confirmation-container .confirmation-pick {
        font-size: 15px;
        font-weight: unset;
      }

      .restart-confirmation-popup-container .confirmation-info-text-container .confirmation-info-text {
        font-size: 15px;
      }

      .final-trades-holder .future-round-pick {
        font-size: 12px;
      }

      .trade-proposal-response-popup,
      .trade-data-container,
      .multi-user-remove-participants-popup,
      .team-picks-info-popup {
        width: 100%;
        margin: unset;
        transform: translate(-50%, -50%);
      }

      .offer-header {
        padding: 14px 10px;
      }

      .offer-header .offer-number {
        font-size: 14px;
      }

      .offer-header .close-icon {
        right: 0px;
      }

      table .room-name-text {
        max-width: 110px;
        min-width: 75px;
      }

      .simulation-management-buttons-holder {
        flex-direction: row;
      }

      .sim-content-slider {
        display: flex;
        width: 300%;
        height: 100%;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .sim-content-slider.show-rounds-pics-container {
        transform: translateX(0%);
      }

      .sim-content-slider.show-players-container {
        transform: translateX(-33.33%);
      }

      .sim-content-slider.show-mypics-container {
        transform: translateX(-66.66%);
      }

      .sim-content-slider .rounds-pics-container,
      .sim-content-slider .players-container,
      .sim-content-slider .mypicks-container {
        width: 33%;
      }
    </style>
  {/function}
{/if}
<style>
  :root {
    --tab-width: 600px;
  }

  img {
    background: none;
  }

  .mock-draft-simulator .container.editor-width-100-pc .fragments-container {
    width: 100% !important;
  }

  .feed-header {
    display: none;
  }

  .content-wrapper {
    width: 100%;
    margin: 16px 20px;
    background-color: #fff;
  }

  .page-content-container {
    margin-top: 80px;
  }

  .simulator-content-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #F6F7FF;
  }

  .simulator-content-holder {
    padding: 15px 20px;
    border: 1px solid #E9E9E9;
  }

  {if $skip_shift == "true"}
    .simulator-content-holder {
      padding: unset;
      border: unset;
    }

  {/if}

  .simulator-heading h1 {
    font-weight: 700;
    font-size: 36px;
    line-height: 54px;
    color: #fff;
    margin: unset;
    float: unset;
  }

  .seo-header-text {
    text-align: left;
    padding-bottom: 16px;
  }

  .seo-header-text p {
    color: #474747 !important;
    font-size: 14px !important;
    padding: 0 !important;
    line-height: 32px;
  }

  button {
    padding: unset;
    cursor: pointer;
    background: none;
  }

  .loading-overlay .overlay-loading-text {
    color: #fff;
    font-weight: 700;
    font-size: 44px;
    line-height: 66px;
  }

  .teams-filters-container .radio-input {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
  }

  .teams-filters-container .radio-input input {
    margin: unset;
  }

  .offer-container {
    width: 450px;
    height: 465px;
    background: white;
    top: 50%;
    left: 50%;
    position: fixed;
    margin-top: -245px;
    margin-left: -225px;
    z-index: 2002;
    border-radius: 12px 12px 0 0;
  }

  .offers-separator {
    height: 300px;
    border-left: 1px solid #E9E9E9;
  }

  .offer-header {
    border-radius: 12px 12px 0 0;
    padding: 14px 28px;
    position: relative;
    background: #080A3C;
  }

  .offer-header .offer-number {
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }

  .close-icon {
    position: absolute;
    top: calc(50% - 7px);
    right: 21px;
    border: none;
    display: flex;
    align-items: center;
  }

  .nav-next,
  .nav-previous {
    position: absolute;
    color: #474747;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    bottom: 87px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: none;
  }

  .nav-next.disabled,
  .nav-previous.disabled {
    opacity: 0.4;
  }

  .current-team-holder,
  .offering-team-holder {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .current-team-img,
  .offering-team-img {
    width: 39px;
    height: 26px;
  }

  .nav-previous {
    left: 25px;
  }

  .nav-next {
    right: 25px;
  }

  .offer-list {
    display: flex;
    justify-content: space-between;
    padding: 15px 24px;
    max-height: 300px;
    overflow: hidden;
    overflow-y: scroll;
  }

  .current-team .current-team-pick {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .current-team,
  .offering-team {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .offering-team .offers {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .offering-team {
    align-items: flex-end;
  }

  .offer-selection {
    position: absolute;
    width: 100%;
    padding: 16px 20px;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #E9E9E9;
  }

  .offer-selection button {
    color: #fff;
    font-size: 14px;
    line-height: 21px;
    font-weight: 500;
    padding: 10px 25px;
    border: none;
    border-radius: 30px;
  }

  .offer-selection .btn-accept-offer {
    background-color: #37C77A;
  }

  .offer-selection .btn-counter-offer {
    background-color: #080A3C;
  }

  .offer-selection .btn-reject-offer {
    background-color: #D32F2F;
  }

  .content-holder div.traded-player-name-position-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .traded-player-name-position-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .traded-player-name-position-container .player-name {
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
    color: #2D2D2D;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .traded-player-name-position-container .player-position {
    font-size: 13px;
    line-height: 18px;
    font-weight: 400;
    color: #999999;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .players-list .separator {
    border-top: 1px solid #dbdbdb;
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .pic-container {
    display: flex;
    align-items: center;
    position: relative;
    margin: 3px 16px 3px 16px;
    border-bottom: 1px solid #dbdbdb;
    height: 47px;
  }

  .pic-container .pic-number {
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    color: #2D2D2D;
    width: 22px;
  }

  .team-logo-container {
    margin-left: 8px;
  }

  .team-selections-holder .team-selections-header {
    background: linear-gradient(90deg, #080A3C -0.79%, #010573 100%);
  }

  .team-selections-holder .traded-player-name-position-container {
    cursor: pointer;
  }

  .team-selections-header .sk-logo-draft-simulator {
    background: unset;
    margin: unset;
  }

  .team-logo-container .team-logo {
    background: transparent !important;
    width: 45px;
    height: auto;
  }

  .traded-player-name-position-container {
    margin-left: 12px;
  }

  .draft-simulation-container {
    display: flex;
    justify-content: space-between;
    margin-top: 0px;
    width: 100%;
    border: 1px solid #E9E9E9;
    padding: 20px;
    gap: 15px;
  }

  .rounds-pics-container {
    border: 1px solid #080A3C;
    border-radius: 8px;
    background: #fff;
  }

  .draft-simulation-container .rounds-pics-container,
  .draft-simulation-container .players-container {
    overflow-y: scroll;
    height: 65vh;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .players-holder {
    margin-top: 8px;
  }

  .rounds-pics-container {
    width: 45%;
  }

  .draft-result-text {
    background-color: #080A3C;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 12px 21px;
    border-radius: 8px 8px 0 0;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .rounds-pics-holder .round-number {
    color: #000;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    padding: 10px 16px 8px 16px;
    margin-bottom: 4px;
    position: sticky;
    top: 48px;
    z-index: 100;
    background-color: #f5f5f5;
  }

  .simulation-management-buttons-container {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #E9E9E9;
    border-radius: 90px;
  }

  .simulation-management-buttons-holder {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    background: #fff;
  }

  .sim-pause-play-buttons {
    display: flex;
    justify-content: center;
  }

  .simulation-management-buttons-container button {
    display: flex;
    flex-direction: column;
    gap: 7px;
    align-items: center;
  }

  .simulation-management-buttons-container img {
    background: none;
  }

  .resume-draft,
  .pause-draft,
  .show-offers,
  .restart-simulation,
  .result-btn,
  .user-proposal,
  .ranking-updates-btn,
  .leave-multi-user-draft,
  .multi-user-draft-participants {
    font-size: 15px;
    line-height: 17px;
    font-weight: 500;
    color: #080A3C;
    border: none;
  }

  .show-offers-highlighted {
    color: #37C77A;
  }

  .show-offers img {
    width: 18px;
    height: 18px;
  }

  .full-result {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .selected-teams-container {
    display: flex;
    gap: 20px;
    justify-content: center;
  }

  .team-trades {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    width: 80%;
  }

  .team-trades .pic-container {
    width: 100%;
  }

  .pic-container .team-logo-container {
    border: none;
    padding: unset;
  }

  .pic-container .pick-trade-info-btn {
    border: none;
    margin: 0 auto;
    margin-right: 40px;
    margin-left: 5px;
  }

  .pic-container .pick-trade-info-btn .trade-icon {
    background: none;
    width: 24px;
    height: 24px;
  }

  .final-trades-holder .pic-container .pick-trade-info-btn {
    margin-right: unset;
    position: absolute;
    top: 23px;
    left: 63px;
  }

  .final-trades-holder .pic-container .pick-trade-info-btn .trade-icon {
    width: 13px;
    height: 13px;
  }

  .future-round-pick-container {
    width: 30%;
    height: 38px;
    padding-left: 80px;
    margin: 8px 16px 0 20px;
  }

  .future-round-pick {
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    color: #2D2D2D;
  }

  .page-seo-content .cms-content li {
    font-size: 18px !important;
  }

  .page-seo-content .cms-content ul {
    list-style-type: disc !important;
    list-style-position: inside !important;
  }

  .trade-data-container {
    display: flex;
    flex-direction: column;
    width: 450px;
    height: 400px;
    background: white;
    top: 50%;
    left: 50%;
    position: fixed;
    margin-top: -200px;
    margin-left: -225px;
    z-index: 2001;
    border-radius: 12px 12px 0 0;
  }

  .trade-data-container .trade-data-header {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    background: #080A3C;
    box-shadow: -1px 4px 20px rgba(0, 0, 0, 0.04);
    border-radius: 12px 12px 0 0;
  }

  .trade-data-container .trades-holder {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
  }

  .trade-data-container .trades-holder::-webkit-scrollbar {
    display: block;
    width: 5px;
    height: 5px;
  }

  .trade-data-container .trades-holder::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  .trade-data-container .trade-details-text {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
  }

  .trade-data-container .close-trades-info {
    border: unset;
    display: flex;
    align-items: center;
  }

  .trade-data-container .trade-details-info-container {
    margin: 16px 20px;
    display: flex;
    justify-content: space-between;
  }

  .trade-data-container .trade-details-info-container .nfl-team-logo {
    width: 45px;
    height: auto;
  }

  .trade-data-container .giving-team-info,
  .trade-data-container .getting-team-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    width: 40%;
  }

  .trade-details-info-container .received-text {
    color: #474747;
    font-size: 16px;
    font-weight: 600;
  }

  .trade-details-info-container .team-picks {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #2D2D2D;
    font-size: 15px;
    font-weight: 500;
    align-items: center;
  }

  .next-pick-container {
    align-items: center;
    display: flex;
    gap: 6px;
    justify-content: right;
    padding: 4px 16px;
    position: sticky;
    right: 0;
    top: 48px;
    z-index: 101;
    margin-top: -41px;
  }

  .next-pick-container .next-pick-team {
    width: 38px;
    height: auto;
    margin-left: 8px;
    background: none;
  }

  .next-pick-container .next-pick-text-holder {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
  }

  .next-pick-container .next-pick-number {
    color: #2d2d2d;
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
  }

  .next-pick-container .next-pick-text {
    color: #999;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
  }

  .team-needs-picks-container {
    align-items: center;
    background: #dbeaff;
    display: flex;
    gap: 3px;
    justify-content: center;
    padding: 5px 0;
  }

  .team-needs-picks-container .team-logo {
    height: auto;
    width: 38px;
    margin: unset;
  }

  .team-needs-picks-container .next-picks-container {
    align-items: center;
    display: flex;
    gap: 3px;
    height: 100%;
    justify-content: center;
  }

  .team-needs-picks-container .next-picks-container .separator {
    border: unset;
    position: unset;
    width: unset;
    border-left: 1px solid #c3dcff;
    height: 100%;
    margin: 0 10px;
  }

  .team-needs-picks-container .team-needs-text {
    margin-left: 5px;
  }

  .team-needs-picks-container .next-picks-text,
  .team-needs-picks-container .team-needs-text {
    color: #666;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
  }

  .team-needs-picks-container .next-picks,
  .team-needs-picks-container .team-needs {
    color: #2d2d2d;
    font-size: 11px;
    font-weight: 500;
    line-height: 14px;
  }

  .user-proposal,
  .team-needs-btn,
  .ranking-updates-btn {
    border: none;
  }

  .mypicks-btn-container {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
    padding: 6px 18px;
  }

  .mypicks-btn-holder {
    display: flex;
    justify-content: space-evenly;
    position: sticky;
    border-radius: 30px;
    box-shadow: 1px 1px 4px rgb(0 0 0 / 7%);
    border: 1px solid #E9E9E9;
    background: #fff;
  }

  .mypicks-btn-container .draft-result-btn,
  .mypicks-btn-container .my-picks-btn {
    font-size: 14px;
    font-weight: 500;
    color: #999999;
    padding: 7px 0;
    width: 100%;
    border-radius: 30px;
    border: none;
  }

  .mypicks-btn-container .draft-result-btn.selected,
  .mypicks-btn-container .my-picks-btn.selected {
    color: #fff;
    background: #D32F2F;
  }

  .mypicks-container {
    padding-bottom: 40px;
  }

  .selected-user-teams-container {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 4px 0 0 16px;
    background: #f5f5f5;
    position: sticky;
    top: 50px;
    z-index: 99;
  }

  .selected-user-teams-container .team-logo-btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 4px;
    border-bottom: 4px solid transparent;
  }

  .selected-user-teams-container .team-logo-btn-container.selected {
    border-bottom-color: #d32f2f;
  }

  .selected-user-teams-container .team-logo-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    padding: 9px 5px;
    border-radius: 25px;
  }

  .selected-user-teams-container .team-logo-btn-container.selected .team-logo-btn {
    border: 2px solid #d32f2f;
  }

  .selected-user-teams-container .team-logo-btn .team-logo {
    width: 30px;
    height: auto;
    background: #fff;
  }

  .selected-picks-container {
    padding: 6px 16px;
  }

  .selected-picks-container .single-pick {
    display: flex;
    gap: 14px;
    padding: 6px 0;
    justify-content: flex-start;
    align-items: center;
    height: 48px;
    border-bottom: 1px solid #dbdbdb;
  }

  .single-pick .pick-trade-info-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    margin: 0 auto;
    margin-right: 15px;
  }

  .single-pick .pick-trade-info-btn .trade-icon {
    width: 24px;
    height: 24px;
    background: #fff;
  }

  .selected-picks-container .single-pick:last-child {
    border-bottom: none;
  }

  .selected-picks-container .traded-player-name-position-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    cursor: pointer;
  }

  .selected-picks-container .single-pick .pick-number {
    width: 25px;
  }

  .selected-picks-container .traded-player-name-position-container .player-name {
    color: #2D2D2D;
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
  }

  .selected-picks-container .single-pick .pick-number {
    font-size: 14px;
    color: #2D2D2D;
    font-weight: 500;
  }

  .selected-picks-container .traded-player-name-position-container .player-position-draftfrom-holder {
    display: flex;
    gap: 2px;
    color: #999;
    align-items: center;
  }

  .player-position-draftfrom-holder .player-position,
  .player-position-draftfrom-holder .player-draftfrom {
    font-size: 13px;
    font-weight: 400;
    white-space: nowrap;
  }

  .trade-proposal-user-teams-conatiner,
  .trade-proposal-all-teams-conatiner {
    width: 450px;
    height: 448px;
    background: white;
    top: 50%;
    left: 50%;
    position: fixed;
    margin-top: -224px;
    margin-left: -225px;
    z-index: 2001;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }

  .trade-proposal-all-teams-conatiner .info-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding-bottom: 60px;
  }

  .team-needs-container {
    width: 462px;
    height: 552px;
    background: white;
    top: 50%;
    left: 50%;
    position: fixed;
    margin-top: -226px;
    margin-left: -232px;
    z-index: 2001;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }

  .trade-proposal-all-teams-conatiner {
    height: 465px;
    margin-top: -245px;
  }

  .trade-proposal-user-teams-conatiner .proposal-header,
  .trade-proposal-all-teams-conatiner .proposal-header,
  .team-needs-container .team-needs-header {
    padding: 14px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #080A3C;
    height: 52px;
  }

  .trade-proposal-user-teams-conatiner .proposal-header .header-text,
  .trade-proposal-all-teams-conatiner .proposal-header .header-text,
  .team-needs-container .team-needs-header .header-text {
    color: #FFF;
    font-size: 16px;
    font-weight: 500;
  }

  .trade-proposal-user-teams-conatiner .proposal-header .close-btn,
  .trade-proposal-all-teams-conatiner .proposal-header .close-btn,
  .team-needs-container .team-needs-header .close-btn {
    width: 24px;
    height: 24px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .trade-proposal-user-teams-conatiner .user-teams-container {
    padding: 16px;
  }

  .trade-proposal-all-teams-conatiner .all-teams-container {
    padding: 0 16px 16px 16px;
    overflow-y: scroll;
    height: 305px;
  }

  .trade-proposal-user-teams-conatiner .user-teams-container .user-teams-holder,
  .trade-proposal-all-teams-conatiner .all-teams-container .all-teams-holder {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .trade-proposal-user-teams-conatiner .user-teams-container .user-teams-holder .team-btn,
  .trade-proposal-all-teams-conatiner .all-teams-container .all-teams-holder .team-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #E2E2E2;
    padding: 4px 6px;
    gap: 7px;
    border-radius: 2px;
    width: 22%;
  }

  .team-needs-grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(8, 1fr);
    width: 100%;
    margin: 0 auto;
    padding: 13px;
  }


  .team-needs-grid-item {
    border: 1px solid #ccc;
    padding: 5px;
    text-align: center;
    height: 59px;
    width: 109px;
    gap: 10px;
  }

  .team-needs-grid-item .team-needs-logo {
    height: 30px;
  }

  .team-needs-grid-item div {
    padding: 2px;
  }

  .team-needs-grid-item p {
    font-size: 10px;
    line-height: 1;
  }

  .small-selection {
    width: 100% !important;
    justify-content: flex-end !important;
    flex-direction: row-reverse;
  }

  .trade-proposal-user-teams-conatiner .user-teams-container .user-teams-holder .team-btn .team-name,
  .trade-proposal-all-teams-conatiner .all-teams-container .all-teams-holder .team-btn .team-name {
    color: #999;
    font-size: 14px;
    font-weight: 400;
  }

  .trade-proposal-user-teams-conatiner .user-teams-container .user-teams-holder .team-btn.selected,
  .trade-proposal-all-teams-conatiner .all-teams-container .all-teams-holder .team-btn.selected {
    background: #E9F7F2;
    border: 1px solid #37C77A;
  }

  .trade-proposal-user-teams-conatiner .user-teams-container .user-teams-holder .team-btn.selected .team-name,
  .trade-proposal-all-teams-conatiner .all-teams-container .all-teams-holder .team-btn.selected .team-name {
    color: #2D2D2D;
  }

  .trade-proposal-user-teams-conatiner .nav-btn-container,
  .trade-proposal-all-teams-conatiner .nav-btn-container {
    padding: 10px 16px;
    position: absolute;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: #fff;
  }

  .nav-btn-container .nav-btn {
    width: 100%;
  }

  .trade-proposal-user-teams-conatiner .nav-btn-container .nav-btn.next,
  .trade-proposal-all-teams-conatiner .nav-btn-container .nav-btn.next,
  .trade-proposal-all-teams-conatiner .nav-btn-container .nav-btn.confirm {
    width: 100%;
    padding: 8px 16px;
    background: #37C77A;
    color: #fff;
    border: none;
    border-radius: 25px;
    font-size: 15px;
    font-weight: 500;
  }

  .trade-proposal-all-teams-conatiner .nav-btn-container .nav-btn.next:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .trade-proposal-all-teams-conatiner .competing-teams-container {
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin: 13px 16px;
    height: 33px;
  }

  .trade-proposal-all-teams-conatiner .competing-teams-container .user-team-container,
  .trade-proposal-all-teams-conatiner .competing-teams-container .opposing-team-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    width: 74px;
  }

  .competing-teams-container .team-name {
    color: #474747;
    font-size: 18px;
    font-weight: 500;
  }

  .competing-teams-container .trade-with-text {
    color: #999;
    font-size: 15px;
    font-weight: 500;
  }

  .trade-proposal-all-teams-conatiner .competing-teams-container .blank-team-container {
    padding: 8px 33px;
    background: #f5f5f5;
  }

  .trade-proposal-all-teams-conatiner .competing-teams-container .blank-team-container .question-icon {
    width: 10px;
    height: 15px;
  }

  .trade-proposal-all-teams-conatiner .competing-teams-container .trade-with-text {
    align-self: center;
  }

  .trade-proposal-all-teams-conatiner .picks-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding: 0 16px;
    max-height: 236px;
    overflow-y: scroll;
  }

  .picks-container .user-picks,
  .picks-container .opposing-team-picks {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
  }

  .current-year-picks,
  .next-year-picks {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .current-year-picks .picks-holder,
  .next-year-picks .picks-holder {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 57px;
  }

  .trade-proposal-all-teams-conatiner .picks-container .picks-input-holder {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
  }

  .trade-proposal-all-teams-conatiner .picks-container .text {
    color: #2D2D2D;
    font-size: 15px;
    font-weight: 500;
  }

  .picks-input-holder label {
    color: #474747;
    font-size: 13px;
    font-weight: 400;
  }

  .picks-input-holder input:checked {
    accent-color: #D32F2F;
  }

  .nav-btn-container .nav-btn.back {
    border-radius: 74px;
    border: 1px solid #2D2D2D;
    background: #FFF;
    color: #2d2d2d;
    padding: 8px 16px;
  }

  .nav-btn-container .nav-btn.propose {
    border-radius: 74px;
    border: 1px solid transparent;
    background: #37C77A;
    color: #fff;
    padding: 8px 16px;
    opacity: 0.4;
    cursor: not-allowed;
    font-size: 15px;
    font-weight: 500;
  }

  .picks-confirmation-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 8px 16px;
    margin-top: 8px;
    overflow-y: scroll;
    height: 300px;
  }

  .picks-confirmation-container .separator,
  .picks-container .separator {
    border-left: 1px solid #e9e9e9;
    height: 265px;
  }

  .trade-progress-container {
    padding: 10px 16px 16px 16px;
    background: #f8f9fa;
    border-top: 1px solid #e9e9e9;
  }

  .trade-progress-container.hidden {
    display: none;
  }

  .trade-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .trade-progress-label {
    color: #2D2D2D;
    font-size: 13px;
    font-weight: 500;
  }

  .trade-progress-status {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
  }

  .trade-progress-status.likely-accept {
    color: #1b5e20;
    background: #e8f5e9;
  }

  .trade-progress-status.likely-reject {
    color: #c62828;
    background: #ffebee;
  }

  .trade-progress-status.close {
    color: #e65100;
    background: #fff3e0;
  }

  .trade-progress-bar {
    position: relative;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: visible;
  }

  .trade-progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease, background-color 0.3s ease;
    width: 0%;
    background: #c62828;
  }

  .trade-progress-fill.accept {
    background: #37C77A;
  }

  .trade-progress-fill.close {
    background: #ff9800;
  }

  .trade-progress-fill.reject {
    background: #c62828;
  }

  .trade-progress-threshold {
    position: absolute;
    top: -4px;
    width: 2px;
    height: 16px;
    background: #2D2D2D;
    left: 100%;
    transform: translateX(-50%);
  }

  .trade-value-comparison {
    padding: 12px 16px;
    background: #F5F5F5;
    margin-top: 8px;
    position: absolute;
    width: 100%;
    bottom: 113px;
  }

  .trade-value-comparison.confirm-proposal-value {
    left: 0;
    bottom: 57px;
  }

  .trade-value-comparison.hidden {
    display: none;
  }

  .trade-value-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .trade-value-team {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .trade-value-label {
    font-size: 11px;
    color: #666;
  }

  .trade-value-points {
    font-size: 18px;
    font-weight: 500;
  }

  .trade-value-team.user-value .trade-value-points {
    color: #003D7B;
  }

  .trade-value-team.opposing-value {
    text-align: right;
  }

  .trade-value-team.opposing-value .trade-value-points {
    color: #37C77A;
  }

  .trade-value-bar {
    display: flex;
    width: 100%;
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
  }

  .trade-value-bar-user {
    background: #003D7B;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    transition: width 0.3s ease;
  }

  .trade-value-bar-opposing {
    background: #37C77A;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    transition: width 0.3s ease;
  }

  .trade-value-bar-percent {
    font-size: 10px;
    font-weight: 500;
    color: #fff;
  }

  .picks-confirmation-container .user-picks-holder,
  .picks-confirmation-container .opposing-team-picks-holder {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .picks-confirmation-container .confirmation-pick {
    color: #2D2D2D;
    font-size: 14px;
  }

  .trade-accepted-container,
  .trade-rejected-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    height: calc(100% - 115px);
  }

  .trade-accepted-container .trade-accept-icon,
  .trade-rejected-container .trade-reject-icon {
    width: 88px;
    height: 88px;
    background-color: #fff;
  }

  .trade-accepted-container .text,
  .trade-rejected-container .text {
    color: #2D2D2D;
    font-size: 16px;
    font-weight: 600;
  }

  .restart-confirmation-popup-container {
    width: 390px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: #fff;
    filter: drop-shadow(-1px 4px 20px rgba(0, 0, 0, 0.04));
    z-index: 2001;
    top: calc(50% - 210px);
    left: calc(50% - 395px);
    position: fixed;
    border-radius: 12px 12px 0 0;
  }

  .restart-confirmation-popup-container .confirmation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    background: #080A3C;
    width: 100%;
    border-radius: 12px 12px 0 0;
  }

  .restart-confirmation-popup-container .confirmation-header .header-text {
    color: #FFF;
    font-size: 16px;
    font-weight: 600;
  }

  .restart-confirmation-popup-container .confirmation-header .close-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
  }

  .restart-confirmation-popup-container .confirmation-header .close-btn img {
    width: 15px;
    height: 15px;
    background: none;
  }

  .restart-confirmation-popup-container .confirmation-info-text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    padding: 110px 60px;
  }

  .restart-confirmation-popup-container .confirmation-info-text-container .confirmation-info-text {
    color: #000;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
  }

  .restart-confirmation-popup-container .confirmation-btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 22px;
    border-top: 1px solid #e9e9e9;
    width: 100%;
  }

  .restart-confirmation-popup-container .confirmation-btn-container .confirm-restart {
    padding: 10px 16px;
    background: #37C77A;
    border: 1px solid #37C77A;
    border-radius: 25px;
    width: 100%;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
  }

  .player-info-popup {
    width: 462px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    filter: drop-shadow(-1px 4px 20px rgba(0, 0, 0, 0.04));
    z-index: 2001;
    top: calc(50% - 210px);
    left: calc(50% - 231px);
    position: fixed;
    border-radius: 12px 12px 0 0;
  }

  .player-info-popup .player-info-close-icon-container {
    display: flex;
    cursor: pointer;
    border: none;
  }

  .player-info-popup .player-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-radius: 11px 11px 0 0;
    background: #080A3C;
    width: 100%;
  }

  .player-info-header .close-icon {
    position: unset;
  }

  .player-info-header .player-info-header-text {
    color: #FFF;
    font-size: 16px;
    font-weight: 600;
  }

  .player-info-popup .player-info-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 14px 0;
    width: 100%;
    min-height: 400px;
  }

  .player-info-body .player-name-container {
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: baseline;
    padding: 0 16px;
  }

  .player-info-body .player-name {
    color: #2D2D2D;
    font-size: 18px;
    font-weight: 600;
  }

  .player-info-body .player-position,
  .player-info-body .player-draft-from {
    color: #2D2D2D;
    font-size: 13px;
    font-weight: 400;
  }

  .player-info-body .player-body-info-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: #2D2D2D;
    font-size: 15px;
    font-weight: 500;
    margin-top: 8px;
    padding: 0 16px;
  }

  .player-info-body .player-description-container {
    margin-top: 16px;
    color: #000;
    font-size: 15px;
    line-height: 180%;
    max-height: 300px;
    overflow-y: scroll;
    padding: 0 16px;
    width: 100%;
    min-height: 300px;
  }

  .player-info-body .popup-btns-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
    border-top: 1px solid #e9e9e9;
    padding: 12px 20px 0 20px;
    bottom: 0;
    width: 100%;
  }

  .player-info-body .close-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #2D2D2D;
    background: #FFF;
    color: #2D2D2D;
    width: 50%;
  }

  .player-info-body .full-report-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #37C77A;
    background: #37C77A;
    color: #fff;
    width: 50%;
    text-align: center;
    text-decoration: none;
    font-weight: 500;
  }

  .picked-player {
    color: #999;
    font-size: 14px;
    font-weight: 400;
    margin-top: -8px;
  }

  .traded-text {
    color: #999;
    font-size: 14px;
    font-weight: 400;
  }

  .team-selection-container .teams-header img {
    width: 46px;
    height: 21px;
  }

  .player-info-btn img {
    width: 24px;
    height: 24px;
  }

  .offer-container .current-team-shortname,
  .offer-container .offering-team-shortname {
    font-size: 17px;
    font-weight: 500;
  }

  .offer-container .offers span,
  .offer-container .current-team-pick span {
    font-size: 15px;
  }

  .team-picks-info-popup {
    display: flex;
    flex-direction: column;
    border-radius: 12px 12px 0 0;
    width: 450px;
    height: 400px;
    background: white;
    top: 50%;
    left: 50%;
    position: fixed;
    margin-top: -200px;
    margin-left: -225px;
    z-index: 2001;
  }

  .team-picks-info-popup .team-picks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-radius: 12px 12px 0 0;
    background: #080A3C;
  }

  .team-picks-header .team-name {
    color: #FFF;
    font-size: 16px;
    font-weight: 600;
  }

  .team-picks-info-popup .team-picks-list-container {
    display: flex;
    flex-direction: column;
    padding: 12px 0;
    overflow-y: scroll;
  }

  .team-picks-info-popup .close-team-picks-btn {
    border: unset;
    display: flex;
  }

  .team-picks-info-popup .close-team-picks-btn img {
    width: 16px;
    height: 16px;
  }

  .team-picks-info-popup .team-logo-container,
  .team-picks-info-popup .pick-trade-info-btn,
  .team-picks-info-popup .traded-player-name-position-container {
    cursor: default;
  }

  .team-picks-info-popup .team-logo-container {
    cursor: default;
  }

  .team-picks-info-popup .pick-trade-info-btn,
  .team-picks-info-popup .traded-player-name-position-container {
    cursor: pointer;
  }

  .mypicks-container .selected-picks-container .future-pick {
    color: #2D2D2D;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    padding-left: 39px;
  }

  .draft-simulation-container .rounds-pics-container::-webkit-scrollbar,
  .draft-simulation-container .players-container::-webkit-scrollbar,
  .trade-proposal-all-teams-conatiner .all-teams-container::-webkit-scrollbar,
  .trade-proposal-all-teams-conatiner .picks-container::-webkit-scrollbar,
  .player-info-popup .player-description-container::-webkit-scrollbar,
  .selected-user-teams-container::-webkit-scrollbar,
  .teams-result-holder .user-teams-holder::-webkit-scrollbar,
  .mypicks-container::-webkit-scrollbar,
  .team-picks-info-popup .team-picks-list-container::-webkit-scrollbar,
  .picks-confirmation-container::-webkit-scrollbar,
  .offer-list::-webkit-scrollbar,
  .multi-user-room .room-content::-webkit-scrollbar,
  .multi-user-chat-content .multi-user-chat-messages::-webkit-scrollbar,
  .multi-user-remove-participants-popup .participants-list-container::-webkit-scrollbar,
  .join-room-popup-container .popup-content::-webkit-scrollbar {
    display: block;
    width: 5px;
    height: 5px;
  }

  .draft-simulation-container .rounds-pics-container::-webkit-scrollbar-thumb,
  .draft-simulation-container .players-container::-webkit-scrollbar-thumb,
  .trade-proposal-all-teams-conatiner .all-teams-container::-webkit-scrollbar-thumb,
  .trade-proposal-all-teams-conatiner .picks-container::-webkit-scrollbar-thumb,
  .player-info-popup .player-description-container::-webkit-scrollbar-thumb,
  .selected-user-teams-container::-webkit-scrollbar-thumb,
  .teams-result-holder .user-teams-holder::-webkit-scrollbar-thumb,
  .mypicks-container::-webkit-scrollbar-thumb,
  .team-picks-info-popup .team-picks-list-container::-webkit-scrollbar-thumb,
  .picks-confirmation-container::-webkit-scrollbar-thumb,
  .offer-list::-webkit-scrollbar-thumb,
  .multi-user-room .room-content::-webkit-scrollbar-thumb,
  .multi-user-chat-content .multi-user-chat-messages::-webkit-scrollbar-thumb,
  .multi-user-remove-participants-popup .participants-list-container::-webkit-scrollbar-thumb,
  .join-room-popup-container .popup-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  .offer-header .close-icon {
    display: flex;
    justify-content: center;
    align-items: end;
    gap: 5px;
    top: calc(50% - 14px);
  }

  .offer-header .close-icon .hide-text {
    font-size: 14px;
    line-height: 21px;
    font-weight: 500;
    color: #fefefe;
  }

  .pic-container .drafting-info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    right: 0;
  }

  .drafting-info-container .draft-text {
    font-size: 10px;
    line-height: 14px;
    font-weight: 400;
    color: #999999;
  }

  .drafting-info-container .draft-by {
    font-size: 10px;
    line-height: 14px;
    font-weight: 500;
    color: #2d2d2d;
    max-width: 32px;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .teams-result-holder .drafting-info-container {
    visibility: hidden;
  }

  .trade-proposal-response-popup {
    width: 462px;
    height: 465px;
    margin-top: -245px;
    margin-left: -423px;
    background: #fff;
    z-index: 3000;
    border-radius: 12px 12px 0 0;
    top: 50%;
    left: 50%;
    position: fixed;
  }

  .trade-proposal-response-popup .trade-proposal-response-header {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2d2d2d;
  }

  .trade-proposal-response-header .trade-proposal-response-header-text {
    color: #FFF;
    font-size: 16px;
    font-weight: 600;
  }

  .trade-proposal-response-header .close-trade-proposal-response-btn {
    width: 24px;
    height: 24px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .close-trade-proposal-response-btn img {
    background: none;
  }

  .trade-proposal-response-popup .trade-proposal-response-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .trade-proposal-response-container .trade-proposal-response-description {
    color: #000;
    font-size: 16px;
    font-weight: 600;
    width: 80%;
    line-height: 1.5;
    text-align: center;
  }

  .multi-user-remove-participants-popup {
    width: 462px;
    height: 465px;
    margin-top: -245px;
    margin-left: -423px;
    background: #fff;
    z-index: 3000;
    border-radius: 12px 12px 0 0;
    top: 50%;
    left: 50%;
    position: fixed;
  }

  .multi-user-remove-participants-popup .multi-user-remove-articipants-header {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2d2d2d;
    border-radius: 6px 6px 0 0;
  }

  .multi-user-remove-articipants-header .remove-participants-popup-header-text {
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
  }

  .close-remove-participants-popup-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border: unset;
  }

  .close-remove-participants-popup-btn img {
    width: 16px;
    height: 16px;
    background: none;
  }

  .multi-user-remove-participants-popup .participants-list-container .participant-holder {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    padding: 8px 0 8px 15px;
  }

  .multi-user-remove-participants-popup .participants-list-container .participant-holder label {
    color: #2d2d2d;
  }

  .multi-user-remove-participants-popup .participants-list-container .participant-holder input {
    width: 15px;
    height: 15px;
    accent-color: #2d2d2d;
  }

  .multi-user-remove-participants-popup .participants-list-container {
    display: flex;
    flex-direction: column;
    max-height: 355px;
    overflow: hidden;
    overflow-y: scroll;
  }

  .multi-user-remove-participants-popup .remove-participants-btn-container {
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0;
    border-top: 1px solid #E9E9E9;
  }

  .multi-user-remove-participants-popup .remove-participants-btn {
    width: 160px;
    padding: 6px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #37C77A;
    border-radius: 6px;
    background: #37C77A;
    color: #fff;
    font-size: 14px;
    line-height: 21px;
    font-weight: 500;
  }

  .multi-user-remove-participants-popup .remove-participants-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .participants-table {
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
  }

  .participants-table thead {
    background: #f5f5f5;
  }

  .participants-table thead .player-text {
    margin-left: -60px;
  }

  .participants-table thead th {
    padding: 5px 0;
  }

  .participants-table tbody td {
    padding: 5px 10px;
    vertical-align: middle;
    height: 50px;
  }

  .participants-table tbody .team-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .participants-table tbody .team-content .team-logo-holder {
    width: 25px;
    height: 25px;
    border-radius: 25px;
    border: 1px solid #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .participants-table tbody .resume-status {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .multi-user-info-container-popup {
    position: fixed;
    width: 328px;
    min-height: 200px;
    border-radius: 6px;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 12px;
    z-index: 2001;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .multi-user-info-container-popup .info-header {
    display: flex;
    justify-content: flex-end;
  }

  .multi-user-info-container-popup .info-header .close-info-popup-btn {
    border: unset;
  }

  .multi-user-info-container-popup .info-header .close-icon {
    width: 16px;
    height: 16px;
    background: none;
    position: unset;
  }

  .multi-user-info-container-popup .info-holder {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    gap: 5px;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .multi-user-info-container-popup .info-holder .info-text {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
  }

  .multi-user-info-container-popup .info-holder .info-icon {
    width: 28px;
    height: 32px;
    background: none;
  }

  .multi-user-info-container-popup .room-list-btn {
    width: 100%;
    background: #37C77A;
    border: 1px solid #37C77A;
    border-radius: 6px;
    padding: 10px 16px;
    color: #fff;
    margin-top: 30px;
  }

  table .room-name-text {
    max-width: 175px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  .btn-blinker {
    animation: blinker 1.5s linear infinite;
  }

  @media (max-width: 280px) {

    .trade-proposal-user-teams-conatiner .user-teams-container .user-teams-holder .team-btn,
    .trade-proposal-all-teams-conatiner .all-teams-container .all-teams-holder .team-btn {
      width: 29%;
    }
  }
</style>

{if !$is_desktop}
  {call getMDSHomeMobileCSS}
{/if}

{if !$is_desktop}
  {function getMDSPFNMobileCSS}
    <style>
      .pfn-content-container .content {
        width: 100%;
        max-width: var(--tab-width);
      }

      .pfn-content-container .content>* {
        max-width: var(--tab-width);
      }

      .pfn-text-content-container {
        padding: 0 16px;
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

      .draft-simulation-container,
      .final-trades-container {
        margin-top: 5vh;
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

      #ad-banner-container {
        width: 100%;
        background-color: #ededed;
        position: fixed;
        height: 9vh;
        top: 76px;
        z-index: 10000;
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

      .positions-filters {
        top: 33px;
      }

      .resume-draft,
      .pause-draft,
      .show-offers,
      .restart-simulation,
      .result-btn,
      .user-proposal,
      .ranking-updates-btn {
        font-size: 11px;
      }

      .final-trades-container {
        height: 80vh;
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
        margin-bottom: 100px;
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

      .draft-simulation-container .rounds-pics-container,
      .draft-simulation-container .players-container,
      .sim-content-slider .mypicks-container {
        background: #fff;
      }
    </style>
  {/function}
{/if}
<style>
  .pfn-content-wrapper {
    margin-bottom: 30px;
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
  }

  .draft-simulation-container {
    border: unset;
    padding: unset;
    height: 60vh;
    background: #F6F7FF;
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

  .draft-simulation-container .rounds-pics-container,
  .draft-simulation-container .players-container {
    height: 100%;
    background: #fff;
  }

  .selected-user-teams-container {
    top: unset;
  }

  .rounds-pics-holder .round-number {
    top: 44px;
  }

  .start-draft-btn {
    background: #37C77A;
    border-radius: 6px;
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

  .player-info-popup {
    top: 50%;
    left: 50%;
    margin-left: -423px;
    height: 465px;
    margin-top: -245px;
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
    margin-top: -245px;
    margin-left: -423px;
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

  @media (max-width: 768px) {
    .pfn-content-container .content {
      max-width: 100%;
      max-width: var(--tab-width);
    }

    .pfn-content-container .content>* {
      max-width: var(--tab-width);
    }

    .pfn-content-container .landing-page-container {
      margin-top: 3vh;
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
      bottom: 71px;
      padding: 2px auto;
      display: none;
      background: #fff;
      width: 100%;
      justify-content: center;
      align-items: center;
      border-bottom: unset;
      border-top: 1px solid #e9e9e9;
    }
  }
</style>

{if !$is_desktop}
  {call getMDSPFNMobileCSS}
{/if}
