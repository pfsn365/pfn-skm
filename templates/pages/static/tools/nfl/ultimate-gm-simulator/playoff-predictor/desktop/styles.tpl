<style>
  .week-matches-playoff-participants-wrapper {
    display: flex;
    justify-content: center;
    padding: 16px;
    gap: 16px;
    background-color: #F6F7FF;
  }

  .playoff-predictor-tool-wrapper .section-seperator {
    height: 16px;
  }


  .playoff-predictor-tool-wrapper .standings-draft-order-wrapper {
    padding: 16px;
    border: 1px solid #E9E9E9;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    background-color: var(--section-bg-color);
  }

  .playoff-predictor-tool-wrapper .week-matches-simulation-wrapper {
    width: 43%;
    border-radius: 12px;
    background-color: #fff;
    border: 1px solid #e9e9e9;
  }

  .week-matches-simulation-wrapper .wrapper-header {
    background-color: #080A3C;
    color: #FFFFFF;
    text-align: center;
    padding: 12px;
    display: flex;
    justify-content: flex-start;
    border-radius: 12px 12px 0px 0px;
  }

  .week-matches-simulation-wrapper .wrapper-header span.remaining-matches {
    padding: unset;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0em;
    text-align: left;
    color: #2d2d2d;
    line-height: unset;
  }

  .week-matches-simulation-wrapper .week-matches-simulation-wrapper-content {
    display: flex;
  }

  .playoff-predictor-tool-wrapper .sidebar-cta-wrapper {
    width: 20%;
    border-bottom-left-radius: 12px;
    background: transparent;
    padding: 8px;
    box-shadow: 4px 4px 14px 0px #54575C1A;
  }

  .playoff-predictor-tool-wrapper .week-carousel-matches-container {
    width: 80%;
  }

  .playoff-predictor-tool-wrapper .week-matches-wrapper {
    border-bottom-right-radius: 12px;
    padding: 4px;
  }

  .playoff-predictor-tool-wrapper .week-matches-container {
    min-height: 300px;
    max-height: 490px;
  }

  .playoff-predictor-tool-wrapper .simulation-ctas-container {
    flex-direction: column;
    height: 95%;
    gap: 10px;
    padding-top: 6px;
    box-shadow: 0;
  }

  .playoff-participants-container .playoff-team-win-lose-text {
    width: 45%;
  }

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
    height: 100%;
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

  .simulate-popup-container,
  .delete-popup-container,
  .predict-simulate-popup-container,
  .predict-playoff-games-popup-container {
    border-radius: var(--popup-border-radius);
  }

  .simulate-popup-container .popup-header,
  .delete-popup-container .popup-header,
  .predict-simulate-popup-container .popup-header {
    background-color: #F5F5F5;
  }

  .predict-playoff-games-popup-container .popup-header {
    background-color: #f5f5f5;
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

  .standings-section-wrapper .standings-section-header-text,
  .draft-order-section-wrapper .draft-order-section-text {
    font-size: 18px;
    font-weight: 700;
    color: #172B4D;
    flex: 1;
  }

  .draft-order-section-wrapper .draft-order-section-note-text {
    font-size: 13px;
    font-weight: 500;
    color: #172B4D;
    font-style: italic;
  }

  .draft-order-section-wrapper .draft-order-section-text-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    position: relative;
    margin-top: 16px;
    text-align: center;
  }

  .standings-section-wrapper .standings-section,
  .draft-order-section-wrapper .draft-order-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    justify-content: center;
  }

  .conference-standings th,
  .conference-standings td,
  .division-standings th,
  .division-standings td,
  .draft-order-table td,
  .draft-order-table th {
    min-width: 30px;
    padding: 6px 4px;
    font-size: 11px;
    text-align: center;
  }

  .standings-section-wrapper .standings-team-name {
    font-size: 11px;
  }

  .conference-standings thead,
  .division-standings thead,
  .draft-order-table thead {
    position: sticky;
    z-index: 1;
    top: 0;
    background-color: #fff;
    color: #2D2D2D;
    border-collapse: collapse;
    border-bottom: 2px solid #2d2d2d;
  }

  .standings-section-wrapper .positive-pd {
    color: #37C77A;
  }

  .standings-section-wrapper .negative-pd {
    color: #CE1127;
  }

  .conference-standings tbody,
  .division-standings tbody,
  .draft-order-table tbody {
    background-color: #F6F8FD;
    color: #42526E;
  }

  .standings-section-wrapper .conference-standings,
  .standings-section-wrapper .division-standings,
  .draft-order-section-wrapper .draft-order-table {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    text-align: left;
  }

  .standings-section-wrapper .conference-standings>div,
  .standings-section-wrapper .division-standings>div,
  .draft-order-section-wrapper .draft-order-table>div {
    width: 50%;
    padding: 10px;
    position: relative;
  }


  .conference-standings .standings-header-text,
  .division-standings .standings-header-text {
    padding: 8px 4px;
    font-size: 14px;
    color: #172B4D;
    text-align: left;
    font-weight: 600;
  }

  .standings-section-wrapper .standings-table-container,
  .draft-order-section-wrapper .draft-order-table-container {
    overflow: auto;
    border: 1px solid #f5f5f5;
  }

  .draft-order-section-wrapper {
    width: 100%;
  }

  .standings-page-toggle-wrapper {
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .standings-page-toggle-wrapper button {
    border: unset;
    background-color: #f5f6f8;
    padding: 8px 16px;
    font-weight: 500;
    border-radius: 28px;
    border: 1px solid #E9E9E9;
    box-shadow: 1px 1px 4px 0px #00000012;
    cursor: pointer;
  }

  .standings-page-toggle-wrapper .selected {
    background-color: #37C77A;
    color: #fff;
  }

  .playoff-predictor-tool-wrapper .playoff-section {
    width: 57%;
    border: 1px solid var(--playoff-section-border-color);
    border-radius: 12px;
    background-color: #fff;
  }

  .playoff-predictor-tool-wrapper .playoff-section img.table-pfn-logo {
    width: 25px;
    height: 25px;
    background: none;
  }

  .playoff-predictor-tool-wrapper .playoff-section-header-container {
    background-color: #080A3C;
    padding: 10px;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .playoff-section-header-scroll-to-standings-text {
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .nfl-playoff-predictor .playoff-section-header-scroll-to-standings-text {
    width: 390px;
  }

  .playoff-section-header-scroll-to-standings-text>span {
    display: flex;
    align-items: center;
    gap: 2px;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    padding: 8px;
    cursor: pointer;
    line-height: unset;
  }

  .playoff-section-header-scroll-to-standings-text>img {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(150%) contrast(100%);
    background: transparent;
    margin: unset;
    height: unset;
  }

  .playoff-predictor-tool-wrapper .playoff-section-header-text {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: left;
    color: #fff;
    padding: unset;
  }

  .playoff-predictor-tool-wrapper .week-matches-container .away-home-text-container {
    background-color: #f5f5f5;
    color: #2d2d2d;
  }

  .playoff-predictor-tool-wrapper .week-carousel .week-holder span {
    font-size: 12px;
    padding: unset;
    line-height: unset;
  }

  .week-matches-wrapper .week-carousel .selected-week span {
    color: #E9E9E9;
  }


  .playoff-predictor-tool-wrapper .playoff-team-details-holder {
    flex-direction: row;
    align-items: center;
    width: 45%;
  }

  .playoff-predictor-tool-wrapper .playoff-participants-container {
    border: 1px solid #E9E9E9;
    border-radius: 12px;
    padding: 10px;
  }

  .playoff-predictor-tool-wrapper .playoff-section-content {
    padding: 10px;
  }

  .playoff-predictor-tool-wrapper .playoff-participants-standings-container {
    padding-top: 10px;
    position: relative;
  }


  .playoff-predictor-tool-wrapper .predictor-button-container {
    padding-bottom: 20px;
    margin: 10px 0 -18px 0;
  }

  .week-matches-container::-webkit-scrollbar-track,
  .week-matches-container::-webkit-scrollbar,
  .standings-table-container::-webkit-scrollbar-track,
  .standings-table-container::-webkit-scrollbar {
    display: block;
    width: 5px;
    height: 5px;
  }

  .week-matches-container::-webkit-scrollbar-thumb,
  .standings-table-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  .nfl-standings-glossary-section {
    margin: 16px;
  }

  .nfl-standings-glossary-section .glossary-container .glossary-content .glossary-items {
    flex-direction: column;
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
    width: 75px;
    min-width: 50px;
  }

  .nfl-standings-glossary-section .nfl-standings-glossary-list {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, 1fr);
    gap: 16px;
  }

  .week-matches-wrapper .away-team-container,
  .week-matches-wrapper .home-team-container {
    padding: 6px 12px;
  }

  .standings-table-container th:first-child {
    width: 30px;
  }

  .standings-team-container-td {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    align-items: center;
  }

  .division-standings td,
  .conference-standings td,
  .draft-order-table td {
    position: relative;
    vertical-align: middle;
    text-align: center;
  }

  .afc-header-logo,
  .nfc-header-logo {
    height: 45px;
  }

  .week-carousel::-webkit-scrollbar {
    display: block;
    width: 2px;
    height: 4px;
  }

  .week-carousel::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  .playoff-predictor-tool-wrapper .current-week-matches-container {
    gap: 8px;
  }

  .standings-draft-order-toggle-wrapper {
    display: flex;
    justify-content: center;
    border-radius: 28px;
    width: 35%;
    border: 1px solid #E9E9E9;
    background-color: #fff;
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.07);
    margin: 0 auto;
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

  .nfl-playoff-predictor .playoff-participants-standings-container .division-team-container {
    display: flex;
    padding: 10px;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .content-holder {
    width: 1110px;
  }

  .standings-section-header-text-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top: 16px;
    text-align: center;
  }

  .draft-order-section .utility-container,
  .standings-section .utility-container {
    width: unset;
    position: absolute;
    right: 10px;
  }

  .draft-order-section .download-btn-mds,
  .draft-order-section .share-btn-mds,
  .standings-section .download-btn,
  .standings-section .share-btn {
    border: 1px solid #0857C3;
    border-radius: 14px;
    gap: 3px;
    color: #0857C3;
    padding: 5px;
    align-items: center;
  }

  span.download-text,
  span.share-text {
    color: #0857C3;
    font-size: 13px;
    font-weight: 600;
    margin-left: unset;
  }

  .draft-order-utility-heading-holder {
    display: flex;
    align-items: center;
  }
</style>
