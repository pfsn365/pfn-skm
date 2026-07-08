{assign var="fontFamilyToUse" value="'Roboto', -apple-system, BlinkMacSystemFont, Segoe UI, Liberation Sans, sans-serif" scope=root}
<style>
  @font-face {
    font-style: normal;
    font-weight: normal;
    font-family: "Roboto"; src: url("{$smarty.const.STATIC_URL}/assets/fonts/roboto-regular-400.woff2") format("woff2");
    font-display: swap;
  }

  @font-face {
    font-style: normal;
    font-weight: 500;
    font-family: "Roboto"; src: url("{$smarty.const.STATIC_URL}/assets/fonts/roboto-medium-500.woff2") format("woff2");
    font-display: swap;
  }

  {if isset($use_open_sans_font) && $use_open_sans_font}
    @font-face {
      font-style: normal;
      font-weight: 500;
      font-family: "Open Sans"; src: url("{$smarty.const.STATIC_URL}/assets/fonts/open-sans-400.woff2") format("woff2");
      font-display: swap;
    }
  {/if}
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body, button, input {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, Segoe UI, Liberation Sans, sans-serif;
  }

  body {
    max-width: 480px;
    margin: 0 auto;
    overflow-x: hidden;
  }

  .nfl-draft-simulator-widget {
    width: 100vw;
    max-width: 480px;
    margin: 0 auto;
  }

  .popup {
    border: 1px solid #000;
  }

  .nfl-draft-simulator-widget .simulation-management-buttons-container {
    top: 0 !important;
    margin-top: 0 !important;
    transform: none !important;
    left: 0 !important;
    right: 0 !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .nfl-draft-simulator-widget .draft-simulation-container {
    top: 55px !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
    transform: none !important;
    left: 0 !important;
    right: 0 !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .nfl-draft-simulator-widget .bottom-controls {
    top: 55px !important;
    margin-top: 0 !important;
    transform: none !important;
    left: 0 !important;
    right: 0 !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .nfl-draft-simulator-widget .draft-simulation-container,
  .nfl-draft-simulator-widget .bottom-controls,
  .nfl-draft-simulator-widget .simulation-management-buttons-container {
    max-width: 480px;
    width: 100%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  }

  .nfl-draft-simulator-widget .draft-simulation-container {
    overflow: hidden;
  }


  .nfl-draft-simulator-widget .simulation-management-buttons-holder {
    max-width: 480px;
  }

  .nfl-draft-simulator-widget .start-draft-btn {
    max-width: 480px;
    position: fixed;
    bottom: 10px;
  }

  /* Popups and overlays appended to document.body (outside widget div) */
  body > .overlay,
  body > .loading-overlay {
    max-width: 480px;
    left: 50%;
    transform: translateX(-50%);
  }

  body > .offer-container,
  body > .player-info-popup,
  body > .trade-data-container,
  body > .team-picks-info-popup,
  body > .team-needs-container,
  body > .restart-confirmation-popup-container,
  body > .trade-proposal-user-teams-conatiner,
  body > .trade-proposal-all-teams-conatiner,
  body > .trade-proposal-response-popup,
  body > .multi-user-remove-participants-popup,
  body > .multi-user-info-container-popup {
    width: 100%;
    max-width: 480px;
    margin-left: 0;
    margin-right: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
  }

  body > .offer-container .offer-selection {
    box-sizing: border-box;
  }

  .nfl-draft-simulator-widget .radio-input.widget-disabled {
    position: relative;
    cursor: not-allowed;
  }

  .nfl-draft-simulator-widget .radio-input.widget-disabled input {
    pointer-events: none;
    opacity: 0.4;
  }

  .nfl-draft-simulator-widget .radio-input.widget-disabled label {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .nfl-draft-simulator-widget .radio-input.widget-disabled .widget-tooltip {
    display: none;
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: #080A3C;
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    padding: 6px 10px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 10;
  }

  .nfl-draft-simulator-widget .radio-input.widget-disabled .widget-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #080A3C;
  }

  .nfl-draft-simulator-widget .radio-input.widget-disabled:hover .widget-tooltip {
    display: block;
  }

  .widget-bottom-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 16px;
    background: #e9e9e9;
    border-radius: 6px;
    margin-top: 10px;
  }

  .widget-bottom-bar a {
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
    color: #333;
  }

  .nfl-draft-simulator-widget .sim-content-slider {
    max-height: 580px;
    overflow: hidden;
  }

  .nfl-draft-simulator-widget .draft-simulation-container {
    height: 580px;
  }

  .nfl-draft-simulator-widget .ad-container-sticky-right {
    visibility: hidden;
  }

  .nfl-draft-simulator-widget .sticky-ad-container {
    visibility: hidden;
  }
  
  .nfl-draft-simulator-widget #video-player-container {
    visibility: hidden;
  }

  .overlay,
  .loading-overlay {
    top: 0px;
  }

  .nfl-draft-simulator-widget .sim-content-slider .rounds-pics-container,
  .nfl-draft-simulator-widget .sim-content-slider .players-container,
  .nfl-draft-simulator-widget .sim-content-slider .mypicks-container {
    height: 580px;
  }

  .nfl-draft-simulator-widget .bottom-controls {
    top: unset;
    top: 0px !important;
  }

  .nfl-draft-simulator-widget .final-trades-container {
    margin-top: 60px;
    margin-bottom: 10px;
  }

  /* Continue on PFSN popup */
  body > .widget-continue-pfsn-container {
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    border-radius: 12px 12px 0 0;
    background: #fff;
    filter: drop-shadow(-1px 4px 20px rgba(0, 0, 0, 0.04));
    z-index: 2001;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
  }

  .widget-continue-pfsn-container .continue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    background: #2d2d2d;
    width: 100%;
    border-radius: 12px 12px 0 0;
  }

  .widget-continue-pfsn-container .continue-header .header-text {
    color: #FFF;
    font-size: 16px;
    font-weight: 600;
  }

  .widget-continue-pfsn-container .continue-header .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .widget-continue-pfsn-container .continue-body {
    display: flex;
    flex-direction: column;
    padding: 24px 20px;
    gap: 20px;
  }

  .widget-continue-pfsn-container .continue-info-text {
    font-size: 14px;
    font-weight: 400;
    color: #333;
    line-height: 1.5;
  }

  .widget-continue-pfsn-container .rounds-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .widget-continue-pfsn-container .continue-rounds-selection {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .widget-continue-pfsn-container .continue-rounds {
    display: flex;
    gap: 4px;
  }

  .widget-continue-pfsn-container .continue-rounds .radio-input {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .widget-continue-pfsn-container .continue-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 22px;
    border-top: 1px solid #e9e9e9;
    width: 100%;
    gap: 10px;
  }

  .widget-continue-pfsn-container .continue-footer .continue-btn {
    padding: 10px 16px;
    border-radius: 25px;
    width: 100%;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
  }

  .widget-continue-pfsn-container .continue-footer .yes-btn {
    background: #37C77A;
    border: 1px solid #37C77A;
    color: #fff;
  }

  .widget-continue-pfsn-container .continue-footer .no-btn {
    background: #fff;
    border: 1px solid #e9e9e9;
    color: #333;
  }

  .nfl-draft-simulator-widget .draft-simulation-container {
    margin-top: 7px !important;
  }

  .nfl-draft-simulator-widget .teams-result-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .nfl-draft-simulator-widget .final-trades-container .tools-btn-utility-container {
    position: unset;
    width: unset;
    flex: 0 0 auto;
  }

  .nfl-draft-simulator-widget .final-trades-container .tools-btn-utility-container .tools-btn-utility-holder {
    width: 100px;
  }

  .nfl-draft-simulator-widget.mockdraft-simulator .tools-btn-utility-container .mobile-grade-toggle {
    width: unset;
  }

  .nfl-draft-simulator-widget.mockdraft-simulator .teams-result-container .selected-teams-container {
    width: unset;
    flex: 1 1 auto;
  }

  .nfl-draft-simulator-widget .final-trades-container .rounds-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nfl-draft-simulator-widget .result-header .team-container,
  .nfl-draft-simulator-widget .result-header .full-result-header-text-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nfl-draft-simulator-widget .result-header {
    padding: 5px 17px;
  }

  .nfl-draft-simulator-widget .teams-filters-container {
    gap: 6px;
  }

  .nfl-draft-simulator-widget .team-selection-container {
    gap: 4px;
    margin-bottom: 100px;
  }

  .nfl-draft-simulator-widget .result-header:not(:has(.third-party-logo)) {
    justify-content: end;
  }

  .nfl-draft-simulator-widget .result-header:not(:has(.third-party-logo)) .team-container,
  .nfl-draft-simulator-widget .result-header:not(:has(.third-party-logo)) .full-result-header-text-container {
    position: absolute;
    left: 17px;
    transform: unset;
  }

  .nfl-draft-simulator-widget .filters-container {
    min-height: 186px;
  }

  .nfl-draft-simulator-widget .rounds-input-container {
    flex-direction: row !important;
    gap: 12px !important;
  }
</style>
