<style>
  .playoff-predictor {
    --popup-border-radius: 20px;
    --simulator-border-color: #2d2d2d;
    --playoff-section-border-color: #E9E9E9;
    --section-bg-color: #fff;
  }

  .playoff-predictor .week-matches-simulation-wrapper .wrapper-header {
    background-color: #0050A0;
  }


  .playoff-predictor .playoff-predictor-tool-wrapper .playoff-section-header-container {
    background-color: #0050A0;
  }

  .playoff-predictor .playoff-predictor-tool-wrapper .playoff-section-header-text {
    color: #fff;
  }

  .playoff-predictor .playoff-section-header-scroll-to-standings-text>span {
    color: #0050A0;
  }

  .playoff-predictor .playoff-section-header-scroll-to-standings-text>img {
    filter: none;
  }

  .playoff-predictor .week-matches-wrapper .week-carousel .week-holder {
    border-radius: 2px;
    padding: 4px;
    display: flex;
    align-items: center;
  }

  .playoff-predictor .week-matches-wrapper .week-carousel .selected-week {
    background-color: #0050A0;
  }

  .playoff-predictor .playoff-predictor-tool-wrapper .predictor-playoff-games-button {
    background-color: #0050A0;
    border-radius: 74px;
    box-shadow: 1px 2px 6px #003670;
  }

  .playoff-predictor .result-button-container .submit-delete-button,
  .playoff-predictor .result-button-container .submit-simulate-button {
    background-color: #0050A0;
    border-radius: 74px;
  }

  .playoff-predictor .simulate-popup-container .selected span,
  .playoff-predictor .delete-popup-container .selected span,
  .playoff-predictor .predict-simulate-popup-container .selected span {
    color: #0050A0
  }

  .playoff-predictor .standings-draft-order-toggle-wrapper .selected {
    background-color: #0050A0;
    color: #FFF;
  }

  .playoff-predictor .standings-draft-order-toggle-wrapper .disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  .playoff-predictor .standings-page-toggle-wrapper button {
    border-radius: unset;
  }

  .playoff-predictor .standings-page-toggle-wrapper .selected {
    background-color: #0050A0;
  }

  .playoff-predictor .conference-standings thead,
  .playoff-predictor .division-standings thead,
  .playoff-predictor .draft-order-table thead {
    background-color: #0050A0;
    color: #fff;
  }

  .playoff-predictor .playoff-predictor-tool-wrapper .combined-ranking-table-header {
    width: 85px;
  }

  .playoff-predictor .playoff-predictor-tool-wrapper .standings-combined-ranking-line {
    border-top: 1px solid #fff;
  }

  .playoff-predictor .playoff-predictor-tool-wrapper .standings-combined-ranking-category-container span {
    color: #fff;
  }

  .playoff-predictor .week-matches-wrapper .week-matches-container .selected-team {
    background-color: #BAF8D7;
  }

  .playoff-predictor .week-matches-wrapper .score-input-container .selected-team {
    border: 1px solid #37C77A;
    background-color: #C6F8BA;
  }

  .playoff-predictor .radio-option-container input[type="radio"]:checked {
    accent-color: #0050A0;
  }

  .playoff-predictor .week-matches-wrapper .current-week-matches-container {
    background-color: #F5F5F5;
  }

  .playoff-predictor .simulator-standings-page-toggle-wrapper .selected {
    background-color: #0050A0;
  }

  .playoff-predictor .standings-page-toggle-wrapper button {
    border-radius: unset;
  }

  .playoff-predictor .standings-page-toggle-wrapper .selected {
    background-color: #0050A0;
    color: #fff;
  }

  .playoff-predictor .playoff-match-details-holder .selected,
  .playoff-predictor .playoff-super-bowl-round-container .selected {
    border: 1px solid #37C77A;
    background-color: #BAF8D7;
  }

  .playoff-predictor .playoff-participants-standings-container .division-team-container {
    padding: 8px 0px;
    width: 100%;
  }

  .playoff-predictor .predict-playoff-games-popup-container .popup-header span {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }

  .download-text,
  .share-text {
    font-size: 14px;
    font-weight: 500;
  }

  .week-matches-playoff-participants-wrapper,
  .standings-draft-order-wrapper,
  .panel,
  .nfl-feeds-container,
  .pfn-text-content-container {
    max-width: 1250px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .content .mobile-top-adv-container {
      max-height: 70px;
      position: fixed;
      top: 70px;
      background: #fff;
      z-index: 9999;
      left: 0;
    }

    .pfn-content-container {
      margin-top: 135px;
    }

    .playoff-predictor .result-button-container .submit-delete-button,
    .playoff-predictor .result-button-container .submit-simulate-button {
      font-size: 15px;
      font-weight: 700;
    }
  }
</style>
