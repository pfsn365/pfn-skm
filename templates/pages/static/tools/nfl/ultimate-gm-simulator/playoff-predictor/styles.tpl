<style>
  .nfl-playoff-predictor .tag-page-header {
    padding: 0 0 5px 0;
  }

  .overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    background: #000;
    opacity: 0.5;
    left: 0;
    top: 50px;
    z-index: 2000;
  }

  .playoff-predictor-tool-wrapper .predictor-button-container {
    text-align: center;
  }

  .nfl-playoff-predictor {
    --popup-border-radius: 6px;
    --simulator-border-color: #080A3C;
    --playoff-section-border-color: #C0D0ED;
    --section-bg-color: #F6F7FF;
  }

  .playoff-predictor-tool-wrapper .predictor-playoff-games-button {
    border: unset;
    background-color: #37C77A;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0em;
    text-align: left;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }

  .ultimate-gm-simulator .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.8;
    z-index: 9999;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    z-index: 20000;
  }

  .ultimate-gm-simulator .loading-overlay-text {
    color: #fff;
    font-weight: 500;
    font-size: 44px;
  }

  .ultimate-gm-simulator .loader,
  .nfl-playoff-predictor .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #555;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
    z-index: 10000;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .ultimate-gm-simulator .standings-table-container .standings-team-container {
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .playoff-predictor-tool-wrapper .playoff-status-text {
    font-weight: 400;
    position: relative;
    top: -0.5em;
    padding-left: 2px;
    font-size: 9px !important;
  }

  .ultimate-gm-simulator .draft-order-table-container .standings-team-container {
    display: flex;
    justify-content: left;
    gap: 4px;
    align-items: center;
  }

  .ultimate-gm-simulator .draft-order-table-container .standings-team-container-td {
    justify-content: left;
    display: flex;
    gap: 8px;
    align-items: center;
    margin: unset;
  }

  .draft-order-table th:nth-child(2) {
    text-align: left;
    padding-left: 12px;
  }

  .ultimate-gm-simulator .standings-table-container .standings-team-logo,
  .ultimate-gm-simulator.draft-order-table-container .standings-team-logo {
    width: 20px;
    height: 13px;
  }

  .ultimate-gm-simulator .standings-table-container .standings-team-name {
    padding: unset;
    padding-left: 4px;
    font-weight: 600;
  }

  .ultimate-gm-simulator .draft-order-table-container .standings-team-name {
    font-weight: 600;
    line-height: unset;
    padding: unset;
    font-size: 11px;
  }

  .ultimate-gm-simulator .standings-combined-ranking-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 9px;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .ultimate-gm-simulator .combined-ranking-table-header {
    padding: 0;
    width: 100%;
    position: relative;
    text-align: center;
  }

  .ultimate-gm-simulator .standings-combined-ranking-line {
    border-top: 1px solid #ffffff;
  }

  .ultimate-gm-simulator .standings-combined-ranking-category-container {
    display: flex;
    justify-content: space-around;
    padding-top: 1px;
  }

  .ultimate-gm-simulator .standings-combined-ranking-category-container span {
    margin: unset;
    padding: unset;
    width: unset;
    font-size: 8px;
  }

  .playoff-predictor .result-button-container .submit-delete-button,
  .playoff-predictor .result-button-container .submit-simulate-button {
    font-size: 15px;
    font-weight: 700;
  }

  .ultimate-gm-simulator .dark-background-row {
    background-color: #f5f5f5;
  }

  .ultimate-gm-simulator .light-background-row {
    background-color: #fff;
  }

  .ultimate-gm-simulator .playoff-winner-animation-team-logo {
    animation: popup 2s;
  }

  .draft-order-table tr td.draft-order-category-heading {
    background-color: #d3d3d3;
    font-family: unset;
    font-size: 12px;
    font-weight: 700;
    color: #42526E;
    padding: 6px 16px;
    text-align: left;
  }

  .standings-team-container-td .traded-team-container {
    opacity: 0.5;
  }

  .right-sidebar {
    visibility: hidden;
  }

  .draft-order-table-container .standings-team-container-td .trade-icon {
    height: 12px;
    width: 18px;
  }

  .nfl-playoff-predictor .draft-order-table-container .standings-team-container-td .trade-icon {
    filter: hue-rotate(135deg);
  }

  .nfl-playoff-predictor .container {
    line-height: unset;
  }

  .nfl-playoff-predictor .content-holder span {
    line-height: unset;
  }

  .nfl-playoff-predictor .content-holder img {
    background: transparent;
    height: unset;
    max-width: unset;
  }

  .nfl-playoff-predictor .content-holder table tr:nth-of-type(odd) {
    background: #fff;
  }

  .nfl-playoff-predictor .content-holder table tr:nth-of-type(even) {
    background: #fff;
  }

  .nfl-playoff-predictor .content-holder table td,
  .nfl-playoff-predictor .content-holder table th {
    text-align: center;
  }

  .nfl-playoff-predictor table {
    margin-bottom: unset;
  }

  .nfl-playoff-predictor .taxonomy-content span {
    line-height: 32px;
  }

  .playoff-predictor-tool-wrapper .playoff-participants-container.simulation-overlay::after {
    border-radius: 12px;
  }

  .playoff-predictor-tool-wrapper .playoff-participants-container.simulation-overlay::after,
  .playoff-predictor-tool-wrapper .playoff-participants-standings-container.simulation-overlay::after,
  .standings-section-wrapper .conference-standings.simulation-overlay>div::after,
  .standings-section-wrapper .division-standings.simulation-overlay>div::after,
  .draft-order-section-wrapper .draft-order-table.simulation-overlay>div::after {
    content: "Simulating";
    width: 100%;
    height: 100%;
    z-index: 2;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666666;
    background: #f5f5f5;
    opacity: 0.7;
    top: 0;
    left: 0;
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
  }

  .playoff-predictor-tool-wrapper .playoff-participants-container.simulation-overlay::before,
  .playoff-predictor-tool-wrapper .playoff-participants-standings-container.simulation-overlay::before,
  .standings-section-wrapper .conference-standings.simulation-overlay>div::before,
  .standings-section-wrapper .division-standings.simulation-overlay>div::before,
  .draft-order-section-wrapper .draft-order-table.simulation-overlay>div::before {
    content: "";
    background: url("{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/loading.gif?w=20") no-repeat 41% 50%;
    background-size: 20px;
    width: 100%;
    height: 100%;
    z-index: 2;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
  }

  @keyframes popup {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.4);
    }

    60% {
      transform: scale(1.1);
    }

    70% {
      transform: scale(1.2);
    }

    80% {
      transform: scale(1);
    }

    90% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

  {if !$is_desktop}
    .playoff-predictor-bottom-sticky-ad-container .sticky-container {
      bottom: 56px;
      height: 50px;
    }

    .playoff-predictor-bottom-sticky-ad-container .sticky-container div {
      bottom: 56px;
      background-color: #fff;
    }

    .playoff-predictor-bottom-sticky-ad-container .bottom-sticky-container {
      bottom: 0;
    }

    .playoff-predictor-bottom-sticky-ad-container .bottom-sticky-container div {
      bottom: 0;
    }

  {/if}
</style>

<style>
  .ultimate-gm-simulator {
    --popup-border-radius: 20px;
    --simulator-border-color: #2d2d2d;
    --playoff-section-border-color: #E9E9E9;
    --section-bg-color: #fff;
  }

  .ultimate-gm-simulator .week-matches-simulation-wrapper .wrapper-header {
    background-color: #f5f5f5;
  }


  .ultimate-gm-simulator .playoff-predictor-tool-wrapper .playoff-section-header-container {
    background-color: #f5f5f5;
  }

  .ultimate-gm-simulator .playoff-predictor-tool-wrapper .playoff-section-header-text {
    color: #2d2d2d;
  }

  .ultimate-gm-simulator .playoff-section-header-scroll-to-standings-text>span {
    color: #0857C3;
  }

  .ultimate-gm-simulator .playoff-section-header-scroll-to-standings-text>img {
    filter: none;
  }

  .ultimate-gm-simulator .week-matches-wrapper .week-carousel .week-holder {
    border-radius: 2px;
    padding: 4px;
    display: flex;
    align-items: center;
  }

  .ultimate-gm-simulator .week-matches-wrapper .week-carousel .selected-week {
    background-color: #222222;
  }

  .ultimate-gm-simulator .playoff-predictor-tool-wrapper .predictor-playoff-games-button {
    background-color: #0857C3;
    border-radius: 74px;
    box-shadow: 1px 2px 6px #07316A;
  }

  .ultimate-gm-simulator .result-button-container .submit-delete-button,
  .ultimate-gm-simulator .result-button-container .submit-simulate-button {
    background-color: #D32F2F;
    border-radius: 74px;
  }

  .ultimate-gm-simulator .simulate-popup-container .selected span,
  .ultimate-gm-simulator .delete-popup-container .selected span,
  .ultimate-gm-simulator .predict-simulate-popup-container .selected span {
    color: #D32F2F
  }

  .ultimate-gm-simulator .standings-draft-order-toggle-wrapper .selected {
    background-color: #0857C3;
    color: #FFF;
  }

  .ultimate-gm-simulator .standings-draft-order-toggle-wrapper .disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  .ultimate-gm-simulator .standings-page-toggle-wrapper button {
    border-radius: unset;
  }

  .ultimate-gm-simulator .standings-page-toggle-wrapper .selected {
    background-color: #172B4D;
  }

  .ultimate-gm-simulator .conference-standings thead th,
  .ultimate-gm-simulator .division-standings thead th,
  .ultimate-gm-simulator .draft-order-table thead th {
    background-color: #222222;
    color: #fff;
  }

  .ultimate-gm-simulator .playoff-predictor-tool-wrapper .combined-ranking-table-header {
    width: 85px;
  }

  .ultimate-gm-simulator .playoff-predictor-tool-wrapper .standings-combined-ranking-line {
    border-top: 1px solid #fff;
  }

  .ultimate-gm-simulator .playoff-predictor-tool-wrapper .standings-combined-ranking-category-container span {
    color: #fff;
  }

  .ultimate-gm-simulator .week-matches-wrapper .week-matches-container .selected-team {
    background-color: #BAF8D7;
  }

  .ultimate-gm-simulator .week-matches-wrapper .score-input-container .selected-team {
    border: 1px solid #FF7122;
    background-color: #FFF8F4;
  }

  .ultimate-gm-simulator .radio-option-container input[type="radio"]:checked {
    accent-color: #D32F2F;
  }

  .ultimate-gm-simulator .simulator-standings-page-toggle-wrapper .selected {
    background-color: #0857C3;
  }

  .ultimate-gm-simulator .standings-page-toggle-wrapper button {
    border-radius: unset;
  }

  .ultimate-gm-simulator .standings-page-toggle-wrapper .selected {
    background-color: #172B4D;
    color: #fff;
  }

  .ultimate-gm-simulator .playoff-match-details-holder .selected,
  .ultimate-gm-simulator .playoff-super-bowl-round-container .selected {
    border: 1px solid #37C77A;
    background-color: #BAF8D7;
  }

  .ultimate-gm-simulator .playoff-participants-standings-container .division-team-container {
    padding: 8px 0px;
    width: 100%;
  }

  .ultimate-gm-simulator .predict-playoff-games-popup-container .popup-header span {
    font-size: 16px;
    font-weight: 500;
  }

  .popup-header .standings-draftorder-btn {
    border: unset;
    background: unset;
    padding: unset;
    margin: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .popup-header .standings-draftorder-btn span.full-standings-text {
    font-size: 16px;
    font-weight: 500;
    color: #0857C3;
  }

  .standings-draftorder-btn img {
    width: 5px;
    height: 10px;
    background: unset;
  }

  .playoff-section .playoffs-overlay {
    padding: 0 12px;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(4px);
    background: linear-gradient(157.69deg, rgba(253, 248, 224, 0.6) -1.51%, rgba(255, 240, 237, 0.6) 102.29%);
    flex-direction: row;
    z-index: 100;
  }

  .playoff-section .playoffs-overlay img {
    width: 20px;
    height: 41px;
    background: unset;
    animation: slide 2s ease 4;
  }

  .playoff-section .predict-playoff-games-popup-content {
    height: calc(100% - 47px);
    position: relative;
  }

  .playoff-section .playoffs-overlay .complete-prediction-text {
    color: #2d2d2d;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    width: 50%;
  }

  .playoff-section .empty-image {
    width: 28px;
    height: 28px;
    background: #f5f5f5;
    border-radius: 2px;
  }

  .standings-draftOrder-copy .standings-draftOrder-copy-header {
    width: 100%;
    padding: 18px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
  }

  .standings-draftOrder-copy .standings-draftOrder-copy-header-text {
    font-size: 16px;
    font-weight: 600;
    color: #666666;
  }

  .standings-draftOrder-copy .standings-draftOrder-copy-header-close-btn {
    border: unset;
    padding: unset;
    background: unset;
    display: flex;
    cursor: pointer;
  }

  .standings-draftOrder-copy .standings-draftOrder-copy-header-close-icon {
    width: 15px;
    height: 15px;
    background: none;
  }

  .standings-draftOrder-copy .standings-draft-order-wrapper {
    margin-top: 16px;
    width: 100%;
  }

  .standings-draftOrder-copy .glossary-container {
    border: 1px solid #0857C3;
    background: #F6F8FD;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    /* .pfn-content-container {
      margin-top: 75px;
    } */

    .playoffs-section .playoffs-overlay {
      flex-direction: column;
      justify-content: flex-start;
      padding-top: 35px;
      z-index: 100;
    }

    .ultimate-gm-simulator .predict-playoff-games-popup-container .popup-header span {
      min-width: 125px;
      padding: 6px 0;
      text-align: center;
    }

    .popup-header .standings-draftorder-btn {
      gap: 9px;
    }

    .standings-draftorder-btn img {
      width: 8px;
      height: 14px;
    }

    .standings-draftOrder-copy .standings-draftOrder-copy-header {
      padding: 13px 16px;
    }

    .standings-draftOrder-copy .standings-draftOrder-copy-header-text {
      font-size: 14px;
      color: #666;
    }

    .playoff-section .playoffs-overlay {
      flex-direction: column;
    }

    .playoff-section .playoffs-overlay img {
      width: 47px;
      height: 37px;
    }

    .playoff-section .playoffs-overlay .complete-prediction-text {
      width: 100%;
    }

    .ultimate-gm-simulator .draft-order-table-container .standings-team-container-td {
      width: unset;
    }

    .ultimate-gm-simulator .draft-order-table-container .standings-team-container {
      min-height: 24px;
    }
  }
</style>
