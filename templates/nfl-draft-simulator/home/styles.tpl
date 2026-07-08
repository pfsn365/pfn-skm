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
      .revert-pick,
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

      .revert-pick,
      .restart-simulation {
        padding: 9px 0;
      }

      .revert-pick .second-line-text,
      .restart-simulation .second-line-text {
        margin-top: -5px;
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
      .team-needs-picks-container .team-needs-text,
      .team-needs-picks-container .team-strengths-text {
        font-size: 11px;
      }

      .team-needs-picks-container .next-picks,
      .team-needs-picks-container .team-needs,
      .team-needs-picks-container .team-strengths {
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
        padding: 0 0 8px 0;
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
        line-height: 14px;
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

      .upper-picks-holder {
        width: 100%;
      }

      .upper-picks-holder.mobile-multi-column {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
      }

      .traded-away-container {
        width: 100%;
        overflow: hidden;
        padding: 0;
      }

      .traded-away-label {
        padding-left: 12px;
      }

      .traded-away-players-holder {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
      }

      .traded-away-players-holder.mobile-multi-column {
        flex-direction: column;
      }

      .traded-players-container {
        width: 50%;
        padding-left: 30px;
        position: relative;
        margin: unset;
        height: 28px;
        display: flex;
        align-items: center;
      }

      .traded-away-team-logo {
        width: 27px;
        height: 18px;
      }

      .traded-players-divider {
        width: 100%;
      }

      .team-needs-picks-container {
        top: 32px
      }

      .team-needs-picks-container-sticky {
        top: 80px;
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
    margin: 0 auto;
  }

  .page-content-container {
    margin-top: 80px;
  }

  .simulator-content-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .simulator-content-holder {
      display: flex;
      justify-content: center;
      border: 1px solid #E9E9E9;
      margin-bottom: 20px;
    }

  {if $skip_shift == "true"}
    .simulator-content-holder {
      padding: unset;
      border: unset;
      margin-bottom: 20px;
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

  .overlay,
  .loading-overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    background: #000;
    opacity: 0.5;
    left: 0;
    top: 35px;
    z-index: 2000;
  }

  .loading-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
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
    height: 225px;
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
    max-height: 225px;
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
  .revert-pick,
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

  .traded-away-container {
    padding: 0;
  }

  .traded-players-container {
    display: flex;
    align-items: center;
    padding-left: 30px;
    position: relative;
    gap: 14px;
  }

  .traded-away-players-holder.multi-column {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
  }

  .traded-away-players-holder.multi-column .future-round-pick-container,
  .traded-away-players-holder.multi-column .traded-players-container {
    width: 30%;
  }

  .traded-players-divider {
    border-top: 1px solid #ccc;
    margin: 0 0 10px 0;
    width: 100%;
  }

  .traded-away-label {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    padding: 4px 0;
    width: 100%;
    padding-left: 30px;
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
    position: sticky;
    top: 34px;
    z-index: 100;
  }

  .team-needs-picks-container-sticky {
    top: 80px;
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

  .team-needs-picks-container .team-needs-strengths-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .team-needs-picks-container .next-picks-text,
  .team-needs-picks-container .team-needs-text,
  .team-needs-picks-container .team-strengths-text {
    color: #666;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
  }

  .team-needs-picks-container .next-picks,
  .team-needs-picks-container .team-needs,
  .team-needs-picks-container .team-strengths {
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
    max-height: 310px;
    overflow-y: scroll;
  }

  .picks-container .user-picks,
  .picks-container .opposing-team-picks {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .picks-container .opposing-team-picks {
    align-items: flex-end;
  }

  .picks-container .user-picks {
    align-items: flex-start;
  }

  .picks-container .picks-section {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
  }

  .trade-type-dropdown {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }

  .trade-type-select {
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    color: #2D2D2D;
    background: #fff;
    cursor: pointer;
  }

  .current-year-picks,
  .next-year-picks,
  .player-trades-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .current-year-picks .picks-holder,
  .next-year-picks .picks-holder,
  .player-trades-section .players-holder {
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
    height: 224px;
  }

  .picks-confirmation-container .separator,
  .picks-container .separator {
    border-left: 1px solid #e9e9e9;
    align-self: stretch;
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
    padding: 0 0 12px 0;
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

  .share-toast {
    position: fixed;
    bottom: 200px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    z-index: 9999;
    font-size: 14px;
  }

  .pic-container .team-needs-info-container {
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
  }

  .pic-container .team-needs-info-container .team-needs-lable-text {
    color: #666;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
  }

  .pic-container .team-needs-info-container .team-needs-info-text {
    color: #2d2d2d;
    font-size: 11px;
    font-weight: 500;
    line-height: 15px;
  }
</style>

{if !$is_desktop}
  {call getMDSHomeMobileCSS}
{/if}
