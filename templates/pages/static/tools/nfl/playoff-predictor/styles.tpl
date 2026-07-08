<style>
  /* Dual-template view toggling for playoff predictor */
  /* Double-class selectors to beat .hidden { display:none!important } specificity */
  @media (min-width: 951px) {
    .pp-desktop-view.pp-desktop-view { display: block !important; }
    .pp-tablet-mobile-view.pp-tablet-mobile-view { display: none !important; }
  }
  @media (max-width: 950px) {
    .pp-desktop-view.pp-desktop-view { display: none !important; }
    .pp-tablet-mobile-view.pp-tablet-mobile-view { display: block !important; }
  }

  /* Two-column draft order layout at wider viewports */
  @media (min-width: 701px) {
    .draft-order-table {
      display: flex;
      flex-wrap: wrap;
    }
    .draft-order-table > div {
      width: 50%;
      box-sizing: border-box;
      padding: 10px;
    }
  }

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
    top: 0;
    z-index: 2000;
  }

  .playoff-predictor-tool-wrapper .predictor-button-container {
    text-align: center;
  }

  .nfl-playoff-predictor {
    --popup-border-radius: 6px;
    --simulator-border-color: #0050A0;
    --playoff-section-border-color: #C0D0ED;
    --section-bg-color: #F6F7FF;
  }

  .playoff-predictor-tool-wrapper .predictor-playoff-games-button {
    border: unset;
    background-color: #0050A0;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0em;
    text-align: left;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }

  .playoff-predictor .loading-overlay,
  .nfl-playoff-predictor .loading-overlay {
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
    gap: 10px
  }

  .playoff-predictor .loading-overlay-text,
  .nfl-playoff-predictor .loading-overlay-text {
    color: #fff;
    font-weight: 500;
    font-size: 44px;
  }

  .playoff-predictor .loader,
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

  .playoff-predictor-tool-wrapper .standings-table-container .standings-team-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .playoff-predictor-tool-wrapper .standings-table-container .standings-team-container-td {
    text-align: left;
  }

  .playoff-predictor-tool-wrapper .playoff-status-text {
    font-weight: 400;
    position: relative;
    top: -0.5em;
    padding-left: 2px;
    font-size: 9px !important;
  }

  .playoff-predictor-tool-wrapper .draft-order-table-container .standings-team-container {
    display: flex;
    justify-content: left;
    gap: 4px;
    align-items: center;
  }

  .playoff-predictor-tool-wrapper .draft-order-table-container .standings-team-container-td {
    justify-content: left;
    display: flex;
    gap: 8px;
    align-items: center;
    margin: unset;
    width: 40%;
  }

  .draft-order-table th:nth-child(2),
  .standings-table-container table th:nth-child(2) {
    text-align: left;
    padding-left: 12px;
  }

  .playoff-predictor-tool-wrapper .standings-table-container .standings-team-logo,
  .playoff-predictor-tool-wrapper .draft-order-table-container .standings-team-logo {
    width: 20px;
    height: 13px;
  }

  .playoff-predictor-tool-wrapper .standings-table-container .standings-team-name {
    padding: unset;
    padding-left: 4px;
    font-weight: 500;
  }

  .playoff-predictor-tool-wrapper .draft-order-table-container .standings-team-name {
    font-weight: 500;
    line-height: unset;
    padding: unset;
    font-size: 16px;
  }

  .playoff-predictor-tool-wrapper .standings-combined-ranking-container {
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

  .playoff-predictor-tool-wrapper .combined-ranking-table-header {
    padding: 0;
    width: 100%;
    position: relative;
    text-align: center;
  }

  .playoff-predictor-tool-wrapper .standings-combined-ranking-line {
    border-top: 1px solid #2d2d2d;
  }

  .playoff-predictor-tool-wrapper .standings-combined-ranking-category-container {
    display: flex;
    justify-content: space-around;
    padding-top: 1px;
  }

  .playoff-predictor-tool-wrapper .standings-combined-ranking-category-container span {
    margin: unset;
    padding: unset;
    width: unset;
    font-size: 8px;
    color: #2d2d2d;
  }

  .playoff-predictor-tool-wrapper .dark-background-row {
    background-color: #f5f5f5;
  }

  .playoff-predictor-tool-wrapper .light-background-row {
    background-color: #fff;
  }

  .playoff-predictor-tool-wrapper .playoff-winner-animation-team-logo {
    animation: popup 2s;
  }

  .draft-order-table tr td.draft-order-category-heading {
    background-color: #d3d3d3;
    font-family: unset;
    font-size: 16px;
    font-weight: 500;
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
  .standings-section-wrapper .conference-standings.simulation-overlay > div::after,
  .standings-section-wrapper .division-standings.simulation-overlay > div::after,
  .draft-order-section-wrapper .draft-order-table.simulation-overlay > div::after {
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
  .standings-section-wrapper .conference-standings.simulation-overlay > div::before,
  .standings-section-wrapper .division-standings.simulation-overlay > div::before,
  .draft-order-section-wrapper .draft-order-table.simulation-overlay > div::before {
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

  /* Popup styles - desktop (>950px) */
  @media (min-width: 951px) {
    .simulate-popup-container {
      background: #fff;
      top: 50%;
      left: 50%;
      position: fixed;
      z-index: 2002;
      transform: translateY(-50%) translateX(-50%);
      width: 400px;
    }

    .predict-simulate-popup-container {
      background: #fff;
      top: 50%;
      left: 50%;
      position: fixed;
      z-index: 2002;
      transform: translateY(-50%) translateX(-50%);
      width: 450px;
    }

    .predict-playoff-games-popup-container {
      background: #fff;
      position: relative;
      width: 100%;
      height: auto;
    }

    .delete-popup-container {
      background: #fff;
      top: 50%;
      left: 50%;
      position: fixed;
      z-index: 3000;
      transform: translateY(-50%) translateX(-50%);
      width: 400px;
    }

    .team-info-popup-container {
      background: #fff;
      top: 45%;
      left: 50%;
      position: fixed;
      z-index: 2002;
      transform: translate(-50%, -50%);
      width: 70vw;
      height: 75vh;
      border-radius: var(--popup-border-radius);
      display: flex;
      flex-direction: column;
    }

    .team-info-popup-container .popup-header {
      background-color: #F5F5F5;
    }

    .team-info-popup-container .popup-header span {
      color: #474747;
    }

    .simulate-popup-container,
    .delete-popup-container,
    .predict-simulate-popup-container,
    .power-rank-popup-container,
    .settings-popup-container {
      border-radius: var(--popup-border-radius);
    }

    .power-rank-popup-container,
    .settings-popup-container {
      background: #fff;
      top: 50%;
      left: 50%;
      position: fixed;
      z-index: 2002;
      transform: translateY(-50%) translateX(-50%);
      width: 450px;
    }

    .power-rank-popup-container .popup-header,
    .settings-popup-container .popup-header {
      background-color: #F5F5F5;
    }

    .power-rank-popup-container .popup-header span,
    .settings-popup-container .popup-header span {
      color: #474747;
    }

    .simulate-popup-container .popup-header,
    .delete-popup-container .popup-header,
    .predict-simulate-popup-container .popup-header {
      background-color: #F5F5F5;
    }

    .predict-playoff-games-popup-container .popup-header {
      background-color: #fff;
    }

    .simulate-popup-container .popup-header span,
    .delete-popup-container .popup-header span,
    .predict-simulate-popup-container .popup-header span {
      color: #474747;
    }

    .predict-playoff-games-popup-container .popup-header span {
      color: #2d2d2d;
    }

    .popup-header .close-icon img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(150%) contrast(100%);
    }
  }

  /* Popup styles - mobile/tablet (<=950px) */
  @media (max-width: 950px) {
    .simulate-popup-container {
      background: #fff;
      position: fixed;
      z-index: 2002;
      bottom: 0;
      left: 0;
      top: unset;
      width: 100%;
    }

    .delete-popup-container {
      background: #fff;
      position: fixed;
      z-index: 2002;
      bottom: 0;
      left: 0;
      top: unset;
      width: 100%;
    }

    .predict-simulate-popup-container {
      background: #fff;
      position: fixed;
      z-index: 3000;
      bottom: 0;
      left: 0;
      top: unset;
      width: 100%;
    }

    .predict-playoff-games-popup-container {
      background: #fff;
      position: relative;
      width: 100%;
      border-radius: 0;
    }

    .simulate-popup-container .popup-header,
    .delete-popup-container .popup-header,
    .predict-simulate-popup-container .popup-header {
      background-color: #0050A0;
    }

    .predict-playoff-games-popup-container .popup-header {
      background-color: #fff;
    }

    .predict-playoff-games-popup-container .popup-header .close-icon img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(150%) contrast(100%);
    }

    .simulate-popup-container .popup-header span,
    .delete-popup-container .popup-header span,
    .predict-simulate-popup-container .popup-header span {
      color: #fff;
    }

    .predict-playoff-games-popup-container .popup-header span {
      color: #0050A0;
    }

    .team-info-popup-container {
      background: #fff;
      position: fixed;
      z-index: 2002;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 80vh;
      border-radius: var(--popup-border-radius) var(--popup-border-radius) 0 0;
      display: flex;
      flex-direction: column;
    }

    .team-info-popup-container .popup-header {
      background-color: #0050A0;
    }

    .team-info-popup-container .popup-header span {
      color: #fff;
    }

    .simulate-popup-container,
    .delete-popup-container,
    .predict-simulate-popup-container,
    .power-rank-popup-container,
    .settings-popup-container {
      border-radius: var(--popup-border-radius) var(--popup-border-radius) 0 0;
    }

    .power-rank-popup-container,
    .settings-popup-container {
      background: #fff;
      position: fixed;
      z-index: 2002;
      bottom: 0;
      left: 0;
      top: unset;
      width: 100%;
    }

    .power-rank-popup-container .popup-header,
    .settings-popup-container .popup-header {
      background-color: #0050A0;
    }

    .power-rank-popup-container .popup-header span,
    .settings-popup-container .popup-header span {
      color: #fff;
    }
  }

  /* Tablet popups - vertically centered instead of bottom sheets */
  @media (min-width: 601px) and (max-width: 950px) {
    .simulate-popup-container,
    .delete-popup-container,
    .predict-simulate-popup-container,
    .power-rank-popup-container,
    .settings-popup-container {
      bottom: unset;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 450px;
      border-radius: var(--popup-border-radius);
    }

    .team-info-popup-container {
      bottom: unset;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 80%;
      max-width: 600px;
      height: 70vh;
      border-radius: var(--popup-border-radius);
    }
  }

  /* Sidebar-nav: CTA button widths at <1200px */
  @media (max-width: 1199px) {
    .has-sidebar-nav .simulation-ctas-container .delete-button,
    .has-sidebar-nav .simulation-ctas-container .simulate-button,
    .has-sidebar-nav .simulation-ctas-container .pause-button,
    .has-sidebar-nav .simulation-ctas-container .resume-button,
    .has-sidebar-nav .simulation-ctas-container .power-rank-button,
    .has-sidebar-nav .simulation-ctas-container .settings-button {
      width: auto;
    }
  }

  /* ================================================================
     Sidebar-nav: playoff predictor layout adjustments
     ================================================================ */

  /* Move CTAs above weeks when sidebar is present */
  .has-sidebar-nav .week-matches-simulation-wrapper .week-matches-simulation-wrapper-content {
    flex-direction: column;
  }
  .has-sidebar-nav .playoff-predictor-tool-wrapper .sidebar-cta-wrapper {
    width: 100%;
    border-bottom-left-radius: 0;
    border: none;
    border-left: 1px solid var(--simulator-border-color);
    border-right: 1px solid var(--simulator-border-color);
    padding: 0;
  }
  .has-sidebar-nav .playoff-predictor-tool-wrapper .simulation-ctas-container {
    flex-direction: row !important;
    height: auto !important;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 12px;
  }
  .has-sidebar-nav .simulation-ctas-container img,
  .has-sidebar-nav .simulation-ctas-container svg {
    display: none;
  }
  .has-sidebar-nav .playoff-predictor-tool-wrapper .week-carousel-matches-container {
    width: 100%;
  }
  .has-sidebar-nav .playoff-predictor-tool-wrapper .week-matches-wrapper {
    border-bottom-left-radius: 12px;
  }

  /* Center popups relative to content area (accounting for sidebar width) */
  @media (min-width: 1200px) {
    .team-info-popup-container,
    .simulate-popup-container,
    .predict-simulate-popup-container,
    .delete-popup-container,
    .power-rank-popup-container,
    .settings-popup-container {
      left: calc(50% + var(--sidebar-width) / 2) !important;
    }
  }
  @media (min-width: 951px) and (max-width: 1199px) {
    .team-info-popup-container,
    .simulate-popup-container,
    .predict-simulate-popup-container,
    .delete-popup-container,
    .power-rank-popup-container,
    .settings-popup-container {
      left: 50% !important;
    }
  }

  /* ================================================================
     Sidebar-nav: responsive clamped sizing for tool elements
     ================================================================ */

  /* Base sizes for desktop view with sidebar nav (951px+) */
  @media (min-width: 951px) {
    .has-sidebar-nav .week-matches-playoff-participants-wrapper {
      padding: 4px;
      border: none;
      gap: 10px;
    }
    .has-sidebar-nav .playoff-predictor-tool-wrapper .week-matches-simulation-wrapper {
      width: 380px;
      flex-shrink: 0;
    }
    .has-sidebar-nav .playoff-predictor-tool-wrapper .playoff-section {
      width: 525px;
      flex-shrink: 0;
    }
    .has-sidebar-nav .week-matches-wrapper .away-team-container,
    .has-sidebar-nav .week-matches-wrapper .home-team-container {
      width: 115px;
      flex-shrink: 0;
      padding: 6px;
    }
    .has-sidebar-nav .week-matches-wrapper .score-input-container {
      width: 100px;
    }
    .has-sidebar-nav .week-matches-wrapper .week-matches-container .away-team-logo,
    .has-sidebar-nav .week-matches-wrapper .week-matches-container .home-team-logo {
      width: 33px;
      height: 22px;
    }
    .has-sidebar-nav .playoff-participants-container .afc-rank-1-team-container,
    .has-sidebar-nav .playoff-participants-container .nfc-rank-1-team-container {
      padding: 6px;
    }
    .has-sidebar-nav .playoff-participants-container .afc-rank-1-team-container > img,
    .has-sidebar-nav .playoff-participants-container .nfc-rank-1-team-container > img {
      width: 42px;
      height: 28px;
    }
    .has-sidebar-nav .playoff-participants-container .playoff-team-details-holder {
      width: 115px;
      flex-shrink: 0;
      height: 40px;
    }
    .has-sidebar-nav .playoff-participants-container .playoff-game-details-holder {
      width: 250px;
      flex-shrink: 0;
      padding: 8px;
    }
    .has-sidebar-nav .playoff-participants-standings-container .division-team-container {
      width: 60px;
    }
    .has-sidebar-nav .playoff-participants-standings-container .division-name {
      width: 60px;
    }
    .has-sidebar-nav .playoff-participants-standings-container .division-header-container {
      gap: 2px;
      justify-content: center;
    }
    .has-sidebar-nav .playoff-participants-standings-container .nfc-conference-standings-container,
    .has-sidebar-nav .playoff-participants-standings-container .afc-conference-standings-container {
      justify-content: center;
      gap: 2px;
    }
  }

  /* First growth range: 950px+ */
  @media (min-width: 950px) {
    .has-sidebar-nav .week-matches-playoff-participants-wrapper {
      gap: clamp(10px, calc((100vw - 950px) * 0.03 + 10px), 25px);
    }
    .has-sidebar-nav .playoff-predictor-tool-wrapper .week-matches-simulation-wrapper {
      width: clamp(380px, calc(380px + (100vw - 950px) * 0.2), 480px);
    }
    .has-sidebar-nav .playoff-predictor-tool-wrapper .playoff-section {
      width: clamp(525px, calc(525px + (100vw - 950px) * 0.39), 720px);
    }
    .has-sidebar-nav .week-matches-wrapper .away-team-container,
    .has-sidebar-nav .week-matches-wrapper .home-team-container {
      width: clamp(115px, calc(115px + (100vw - 950px) * 0.07), 150px);
      padding: 6px clamp(6px, calc(6px + (100vw - 950px) * 0.008), 10px);
    }
    .has-sidebar-nav .week-matches-wrapper .score-input-container {
      width: clamp(100px, calc(100px + (100vw - 950px) * 0.06), 130px);
    }
    .has-sidebar-nav .week-matches-wrapper .week-matches-container .away-team-logo,
    .has-sidebar-nav .week-matches-wrapper .week-matches-container .home-team-logo {
      width: clamp(33px, calc(33px + (100vw - 950px) * 0.018), 42px);
      height: clamp(22px, calc(22px + (100vw - 950px) * 0.012), 28px);
    }
    .has-sidebar-nav .playoff-participants-container .playoff-team-details-holder {
      width: clamp(115px, calc(115px + (100vw - 950px) * 0.07), 150px);
    }
    .has-sidebar-nav .playoff-participants-container .playoff-team-details-holder > img {
      width: clamp(33px, calc(33px + (100vw - 950px) * 0.018), 42px);
      height: clamp(22px, calc(22px + (100vw - 950px) * 0.012), 28px);
    }
    .has-sidebar-nav .playoff-participants-container .playoff-game-details-holder {
      width: clamp(250px, calc(250px + (100vw - 950px) * 0.14), 320px);
    }
    .has-sidebar-nav .playoff-participants-standings-container .division-header-container {
      gap: clamp(2px, calc(2px + (100vw - 950px) * 0.016), 10px);
    }
    .has-sidebar-nav .playoff-participants-standings-container .nfc-conference-standings-container,
    .has-sidebar-nav .playoff-participants-standings-container .afc-conference-standings-container {
      gap: clamp(2px, calc(2px + (100vw - 950px) * 0.016), 10px);
    }
    .has-sidebar-nav .playoff-participants-standings-container .division-team-container {
      width: clamp(60px, calc(60px + (100vw - 950px) * 0.03), 75px);
    }
    .has-sidebar-nav .playoff-participants-standings-container .division-name {
      width: clamp(60px, calc(60px + (100vw - 950px) * 0.03), 75px);
    }
  }

  /* Second growth range: 1200px+ */
  @media (min-width: 1200px) {
    .has-sidebar-nav .week-matches-playoff-participants-wrapper {
      gap: clamp(10px, calc((100vw - 1200px) * 0.05 + 10px), 25px);
    }
    .has-sidebar-nav .playoff-predictor-tool-wrapper .week-matches-simulation-wrapper {
      width: clamp(380px, calc(380px + (100vw - 1200px) * 0.333), 480px);
    }
    .has-sidebar-nav .playoff-predictor-tool-wrapper .playoff-section {
      width: clamp(525px, calc(525px + (100vw - 1200px) * 0.65), 720px);
    }
    .has-sidebar-nav .week-matches-wrapper .away-team-container,
    .has-sidebar-nav .week-matches-wrapper .home-team-container {
      width: clamp(115px, calc(115px + (100vw - 1200px) * 0.117), 150px);
      padding: 6px clamp(6px, calc(6px + (100vw - 1200px) * 0.0133), 10px);
    }
    .has-sidebar-nav .week-matches-wrapper .score-input-container {
      width: clamp(100px, calc(100px + (100vw - 1200px) * 0.1), 130px);
    }
    .has-sidebar-nav .week-matches-wrapper .week-matches-container .away-team-logo,
    .has-sidebar-nav .week-matches-wrapper .week-matches-container .home-team-logo {
      width: clamp(33px, calc(33px + (100vw - 1200px) * 0.03), 42px);
      height: clamp(22px, calc(22px + (100vw - 1200px) * 0.02), 28px);
    }
    .has-sidebar-nav .playoff-participants-container .playoff-team-details-holder {
      width: clamp(115px, calc(115px + (100vw - 1200px) * 0.117), 150px);
    }
    .has-sidebar-nav .playoff-participants-container .playoff-team-details-holder > img {
      width: clamp(33px, calc(33px + (100vw - 1200px) * 0.03), 42px);
      height: clamp(22px, calc(22px + (100vw - 1200px) * 0.02), 28px);
    }
    .has-sidebar-nav .playoff-participants-container .playoff-game-details-holder {
      width: clamp(250px, calc(250px + (100vw - 1200px) * 0.233), 320px);
    }
    .has-sidebar-nav .playoff-participants-standings-container .division-header-container {
      gap: clamp(2px, calc(2px + (100vw - 1200px) * 0.0267), 10px);
    }
    .has-sidebar-nav .playoff-participants-standings-container .nfc-conference-standings-container,
    .has-sidebar-nav .playoff-participants-standings-container .afc-conference-standings-container {
      gap: clamp(2px, calc(2px + (100vw - 1200px) * 0.0267), 10px);
    }
    .has-sidebar-nav .playoff-participants-standings-container .division-team-container {
      width: clamp(60px, calc(60px + (100vw - 1200px) * 0.05), 75px);
    }
    .has-sidebar-nav .playoff-participants-standings-container .division-name {
      width: clamp(60px, calc(60px + (100vw - 1200px) * 0.05), 75px);
    }
  }
</style>
