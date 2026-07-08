<style>
  .playoff-predictor-tool-wrapper .sticky-bottom-cta-wrapper {
    left: 0;
    background: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 0px 4px 14px 0px #54575C1A;
    padding: 10px;
    z-index: 100;
  }

  .playoff-predictor-tool-wrapper .week-matches-wrapper {
    width: 100%;
    border-bottom: 3px solid var(--simulator-border-color);
  }

  .playoff-predictor-tool-wrapper .week-matches-container {
    height: 256px;
    border: 1px solid #2D2D2D;
  }

  .playoff-predictor-tool-wrapper .playoff-participants-container {
    height: 258px;
  }

  .playoff-predictor-tool-wrapper .draft-order-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    padding-top: 12px;
  }

  .playoff-predictor-tool-wrapper .standings-page {
    display: flex;
    flex-direction: column;
    padding-top: 12px;
    gap: 4px;
  }

  .playoff-predictor-tool-wrapper .playoff-participants-standings-container {
    position: relative;
  }

  .playoff-participants-standings-container .nfc-conference-standings-container,
  .playoff-participants-standings-container .afc-conference-standings-container {
    height: 224px;
  }

  .week-matches-wrapper .week-carousel {
    height: 45px;
  }

  .simulate-popup-container {
    background: #fff;
    top: 50%;
    left: 50%;
    position: fixed;
    z-index: 2002;
    margin: unset;
    left: unset;
    bottom: 0;
    top: unset;
    width: 100%;
  }

  .delete-popup-container {
    background: #fff;
    top: 50%;
    left: 50%;
    position: fixed;
    z-index: 2002;
    margin: unset;
    left: unset;
    bottom: 0;
    top: unset;
    width: 100%;
  }

  .predict-simulate-popup-container {
    background: #fff;
    top: 50%;
    left: 50%;
    position: fixed;
    z-index: 3000;
    margin: unset;
    left: unset;
    bottom: 0;
    top: unset;
    width: 100%;
  }

  .predict-playoff-games-popup-container {
    background: #fff;
    bottom: 0;
    z-index: 3000;
    margin: unset;
    left: unset;
    width: 100%;
    border-radius: 20px 20px 0 0;
  }

  .predict-playoff-games-popup-container .popup-header .header-text-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .predict-playoff-games-popup-container .popup-header .styler {
    border-top: 1px solid #e9e9e9;
    width: 100%;
  }

  .simulate-popup-container .popup-header,
  .delete-popup-container .popup-header,
  .predict-simulate-popup-container .popup-header {
    background-color: #080A3C;
  }

  .predict-playoff-games-popup-container .popup-header {
    background-color: #fff;
    flex-direction: column;
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
    color: #2d2d2d;
  }

  .simulation-ctas-container {
    justify-content: space-around;
    background-color: #fff;
  }

  .standings-page .conference-standings th,
  .standings-page .conference-standings td,
  .standings-page .division-standings th,
  .standings-page .division-standings td,
  .draft-order-page .draft-order-table th,
  .draft-order-page .draft-order-table td {
    text-align: center;
    min-width: 50px;
    padding: 6px 4px;
    font-size: 12px;
  }

  .division-standings>div,
  .conference-standings>div,
  .draft-order-table>div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .conference-standings thead,
  .division-standings thead,
  .draft-order-table thead {
    position: sticky;
    z-index: 1;
    top: 0;
    background-color: #222222;
    color: #fff;
    border-collapse: collapse;
    border-bottom: 2px solid #2d2d2d;
  }

  .standings-table-container .positive-pd {
    color: #37C77A;
  }

  .standings-table-container .negative-pd {
    color: #CE1127;
  }

  .conference-standings tbody,
  .division-standings tbody,
  .draft-order-table tbody {
    background-color: #F6F8FD;
    color: #42526E;
  }

  .conference-standings .standings-header-text,
  .division-standings .standings-header-text {
    padding: 8px 16px;
    font-size: 12px;
    color: #172B4D;
    font-weight: 600;
  }

  .standings-table-container {
    overflow: auto;
    border: 1px solid #f5f5f5;
  }

  .simulator-standings-page-toggle-wrapper {
    display: flex;
    justify-content: center;
    gap: 6px;
    align-items: center;
  }

  .draft-order-page .draft-order-section-note-text {
    font-size: 12px;
    font-weight: 400;
    color: #172B4D;
    font-style: italic;
  }

  .simulator-standings-page-toggle-wrapper button {
    border: unset;
    padding: 8px 0px;
    background-color: #fff;
    color: #666666;
    border: 1px solid #E9E9E9;
    border-radius: 28px;
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.07);
  }

  .simulator-standings-page-toggle-wrapper button:nth-child(1) {
    width: 40%;
  }

  .simulator-standings-page-toggle-wrapper button:nth-child(2) {
    width: 30%;
  }

  .simulator-standings-page-toggle-wrapper button:nth-child(3) {
    width: 30%;
  }

  .simulator-standings-page-toggle-wrapper .selected {
    border-radius: 28px;
    background-color: #080A3C;
    color: #FFF;
  }

  .standings-page .playoff--standings-popup-header-text {
    font-size: 14px;
    font-weight: 600;
    color: #172B4D;
    margin: 16px;
  }

  .standings-page-toggle-wrapper {
    display: flex;
    justify-content: left;
    gap: 8px;
    margin-left: 16px;
  }

  .standings-page-toggle-wrapper button {
    border: unset;
    background-color: #f5f6f8;
    color: #666666;
    padding: 8px 12px;
    border-radius: 28px;
    border: 1px solid #E9E9E9;
    box-shadow: 1px 1px 4px 0px #00000012;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
  }

  .standings-page-toggle-wrapper .selected {
    background-color: #37C77A;
    color: #fff;
  }

  .standings-page-toggle-wrapper .utility-container {
    justify-content: flex-end;
    gap: 5px;
  }

  .standings-page-toggle-wrapper .utility-container .download-btn,
  .standings-page-toggle-wrapper .utility-container .share-btn {
    box-shadow: unset;
    padding: 0 6px;
  }

  .playoff-participants-header {
    position: relative;
    text-align: center;
    margin: 20px 0;
  }

  .playoff-participants-header-line {
    border-top: 1px solid #e9e9e9;
    width: 100%;
    padding: 2px;
  }

  .playoff-participants-header-text {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 0 10px;
    font-weight: 500;
  }

  .week-matches-wrapper .away-team-container,
  .week-matches-wrapper .home-team-container {
    padding: 4px 8px;
  }

  .playoff-team-details-holder {
    flex-direction: column;
    width: 40%;
    text-align: center;
  }

  .playoff-team-logo {
    margin: 0 auto;
  }

  .week-carousel .week-holder .week-number {
    font-size: 12px;
  }

  .week-matches-container .away-home-text-container {
    background-color: #2d2d2d;
    color: #fff;

  }

  .playoff-predictor-tool-wrapper .reverse-content {
    flex-direction: column-reverse;
  }

  .predictor-button-container {
    padding: 16px;
    position: sticky;
    bottom: 45px;
    z-index: 100;
  }

  .simulate-popup-container,
  .delete-popup-container,
  .predict-simulate-popup-container {
    border-radius: var(--popup-border-radius) var(--popup-border-radius) 0 0;
  }

  .nfl-standings-glossary-section {
    margin: 16px 0 16px 0px;
  }

  .nfl-standings-glossary-section .glossary-container .glossary-content .glossary-items .stats-glossary {
    width: 100%;
  }

  .nfl-standings-glossary-section .nfl-standings-glossary-list>div {
    font-size: 12px;
    line-height: 13px;
    color: #666666;
    display: flex;
  }

  .nfl-standings-glossary-section .nfl-standings-glossary-list>div span:first-child {
    font-weight: 600;
    color: #2D2D2D;
    width: 80px;
    min-width: 80px;
  }

  .nfl-standings-glossary-section .nfl-standings-glossary-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .playoff-predictor-tool-wrapper .current-week-matches-container {
    gap: 4px;
  }

  .draft-order-page .draft-order-table th:nth-child(2) {
    text-align: left;
    padding-left: 12px;
  }

  .result-data-container .draft-order-table td,
  .result-data-container .draft-order-table th {
    width: unset;
  }

  .draft-order-page .draft-order-page-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .draft-order-page .draft-order-page-header-text {
    font-size: 14px;
    font-weight: 700;
    text-align: left;
    color: #172B4D;
    float: unset;
  }

  .nfl-playoff-predictor .content-holder img {
    height: unset;
    width: unset;
  }

  .nfl-playoff-predictor .playoff-predictor-tool-wrapper {
    padding: 0 16px;
    border: unset;
  }

  .nfl-playoff-predictor .simulation-ctas-container>button>img {
    width: 18px;
    height: 18px;
  }

  .content-holder {
    width: 100%;
  }

  .nfl-playoff-predictor .week-matches-wrapper .week-carousel {
    gap: 4px;
  }

  .nfl-playoff-predictor .week-carousel .week-holder .week-number {
    padding: unset;
  }

  .nfl-playoff-predictor .playoff-participants-header-text {
    border-radius: 6px 6px 0 0;
  }

  .playoff-participants-header-text h2 {
    float: none;
    color: #2D2D2D;
    font-size: 14px;
    font-weight: 600;
    padding: 10px;
    white-space: nowrap;
    margin: unset;
    line-height: unset;
  }

  .nfl-playoff-predictor .playoff-predictor-tool-wrapper .sticky-bottom-cta-wrapper {
    z-index: 2000;
  }

  .nfl-playoff-predictor .tag-page-bg {
    margin-bottom: 16px;
  }

  .playoff-predictor-tool-wrapper .conference-standings th,
  .playoff-predictor-tool-wrapper .division-standings th,
  .playoff-predictor-tool-wrapper .draft-order-table th {
    font-weight: 600;
  }

  .nfl-playoff-predictor table::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }

  .nfl-playoff-predictor .playoff-participants-standings-container .division-team-container {
    padding: 8px 0px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .predict-playoff-games-popup-container .playoff-games-popup-footer {
    padding-bottom: 8px;
  }

  .nfl-playoff-predictor .predictor-button-container {
    bottom: 55px;
  }

  .nfl-playoff-predictor .container,
  .nfl-playoff-predictor .content-holder {
    overflow: unset;
  }

  .nfl-playoff-predictor .container::after {
    content: "";
    display: block;
    clear: both;
  }

  .draft-order-page .utility-container {
    justify-content: flex-end;
    width: 20%;
  }

  .draft-order-heading-utility-holder {
    display: flex;
    justify-content: space-between;
  }

  .draft-order-page-header .draft-order-heading-utility-holder {
    margin: 14px 16px;
  }

  .predict-playoff-games-popup-container .utility-container {
    padding-bottom: 8px;
  }

  .playoff-predictor-tool-wrapper .playoff-participants-container.simulation-overlay::before,
  .playoff-predictor-tool-wrapper .playoff-participants-standings-container.simulation-overlay::before,
  .standings-section-wrapper .conference-standings.simulation-overlay>div::before,
  .standings-section-wrapper .division-standings.simulation-overlay>div::before,
  .draft-order-section-wrapper .draft-order-table.simulation-overlay>div::before {
    background: url("{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/loading.gif?w=20") no-repeat 38% 50%;
  }

  .vidazoo-player-container {
    margin-bottom: 16px;
  }

  .standings-draft-order-toggle-wrapper {
    display: flex;
    justify-content: center;
    border-radius: 28px;
    width: 90%;
    border: 1px solid #E9E9E9;
    background-color: #fff;
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.07);
    margin: 0 auto;
    margin-top: 12px;
  }

  .standings-draft-order-toggle-wrapper button {
    border: unset;
    padding: 8px 0px;
    background-color: #fff;
    color: #666666;
    font-weight: 600;
    width: 50%;
    border-radius: 28px;
    cursor: pointer;
  }

  .standings-draft-order-toggle-wrapper .selected {
    border-radius: 28px;
    background-color: #080A3C;
    color: #FFF;
  }

  .glossary-mweb-container {
    padding: 0 10px;
  }
</style>
