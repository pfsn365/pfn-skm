<style>
@media (min-width: 951px) {
   .desktop-tools-top-adv-container {
      min-height: 150px;
   }

   .week-matches-playoff-participants-wrapper {
      display: flex;
      justify-content: center;
      padding: 16px;
      border: 1px solid #E9E9E9;
      gap: 16px;
      background-color: var(--section-bg-color);
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
   }

   .week-matches-simulation-wrapper .wrapper-header {
      background-color: #0050A0;
      color: #FFFFFF;
      text-align: center;
      padding: 12px;
      display: flex;
      justify-content: center;
      border-radius: 12px 12px 0px 0px;
   }

   .week-matches-simulation-wrapper .wrapper-header h2 {
      padding: unset;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0em;
      text-align: left;
      color: #fff;
      line-height: unset;
   }

   .week-matches-simulation-wrapper .week-matches-simulation-wrapper-content {
      display: flex;
   }

   .playoff-predictor-tool-wrapper .sidebar-cta-wrapper {
      width: 20%;
      border-bottom-left-radius: 12px;
      background: transparent;
      border: 1px solid var(--simulator-border-color);
      padding: 8px;
   }

   .playoff-predictor-tool-wrapper .week-carousel-matches-container {
      width: 80%;
   }

   .playoff-predictor-tool-wrapper .week-matches-wrapper {
      border: 1px solid var(--simulator-border-color);
      border-bottom-right-radius: 12px;
      padding: 4px;
      position: relative;
      padding-bottom: 40px;
   }

   .playoff-predictor-tool-wrapper .week-matches-wrapper .bye-teams-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 8px 6px;
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

   .playoff-predictor-tool-wrapper .simulation-ctas-container > button {
      flex: 1;
      text-align: center;
   }

   .playoff-participants-container .playoff-team-win-lose-text {
      width: 45%;
   }

   .standings-section-wrapper .standings-section-header-text,
   .draft-order-section-wrapper .draft-order-section-text {
      font-size: 18px;
      font-weight: 500;
      color: #0050A0;
      flex: 1;
   }

   .draft-order-section-wrapper .draft-order-section-note-text {
      font-size: 13px;
      font-weight: 500;
      color: #0050A0;
      font-style: italic;
   }

   .draft-order-section-wrapper .draft-order-section-text-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      position: relative;
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
      font-size: 16px;
      text-align: center;
   }

   .conference-standings .standings-team-container-td,
   .division-standings .standings-team-container-td {
      width: 80px;
      max-width: 80px;
   }

   .draft-order-table td,
   .draft-order-table th {
      width: 15%;
   }

   .standings-section-wrapper .standings-team-name {
      font-size: 16px;
   }

   .conference-standings thead,
   .division-standings thead,
   .draft-order-table thead {
      position: sticky;
      z-index: 1;
      top: 0;
      background-color: #0050A0;
      color: #fff;
      border-collapse: collapse;
      border-bottom: 2px solid #0050A0;
   }

   .conference-standings thead th,
   .division-standings thead th {
      vertical-align: middle;
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
   .standings-section-wrapper .division-standings>div {
      width: 100%;
      padding: 10px;
      position: relative;
   }

   .draft-order-section-wrapper .draft-order-table>div {
      width: 50%;
      padding: 10px;
      position: relative;
      box-sizing: border-box;
   }


   .conference-standings .standings-header-text,
   .division-standings .standings-header-text {
      padding: 8px 4px;
      font-size: 16px;
      color: #0050A0;
      text-align: left;
      font-weight: 500;
   }

   .playoff-predictor-tool-wrapper .standings-combined-ranking-container {
      font-size: 16px;
   }

   .playoff-predictor-tool-wrapper .standings-combined-ranking-category-container span {
      font-size: 16px;
   }

   .playoff-predictor-tool-wrapper .combined-ranking-table-header {
      overflow: visible;
      min-height: 60px;
      height: 60px;
   }

   .standings-section-wrapper .standings-table-container,
   .draft-order-section-wrapper .draft-order-table-container {
      overflow-x: auto;
      overflow-y: visible;
      border: 1px solid #f5f5f5;
   }

   .standings-section-wrapper .standings-table-container table,
   .draft-order-section-wrapper .draft-order-table-container table {
      width: 100%;
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
      background-color: #FFD166;
      color: #0050A0;
   }

   .playoff-predictor-tool-wrapper .playoff-section {
      width: 57%;
      border: 1px solid var(--playoff-section-border-color);
      border-radius: 12px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
   }

   .playoff-predictor-tool-wrapper .playoff-section img.table-pfn-logo {
      width: 25px;
      height: 25px;
      background: none;
      position: absolute;
      right: 10px;
   }

   .playoff-predictor-tool-wrapper .playoff-section-header-container {
      background-color: #0050A0;
      padding: 10px;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
   }

   .playoff-section-header-scroll-to-standings-text {
      display: flex;
      align-items: center;
      justify-content: end;
      position: absolute;
      right: 40px;
   }

   .nfl-playoff-predictor .playoff-section-header-scroll-to-standings-text {
      width: auto;
   }

   .playoff-section-header-scroll-to-standings-text {
      display: none !important;
   }

   .playoff-section-header-scroll-to-standings-text>img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(150%) contrast(100%);
      background: transparent;
      margin: unset;
      height: unset;
   }

   .playoff-predictor-tool-wrapper .playoff-section-header-text {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0em;
      text-align: center;
      color: #fff;
      padding: unset;
   }

   .playoff-predictor-tool-wrapper .week-matches-container .away-home-text-container {
      background-color: #f5f5f5;
      color: #2d2d2d;
   }

   .playoff-predictor-tool-wrapper .week-carousel .week-holder span {
      font-size: 16px;
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
   }

   .playoff-predictor-tool-wrapper .playoff-section-content {
      padding: 4px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
   }

   .playoff-predictor-tool-wrapper .playoff-participants-standings-container {
      padding-top: 10px;
      position: relative;
   }


   .playoff-section-tab-toggle {
      display: flex;
      gap: 8px;
      margin-left: 12px;
   }

   .playoff-section-tab-toggle .playoff-tab-btn {
      border: 1px solid #E9E9E9;
      background-color: transparent;
      color: #fff;
      padding: 6px 16px;
      border-radius: 28px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
   }

   .playoff-section-tab-toggle .playoff-tab-btn.selected {
      background-color: #FFD166;
      color: #0050A0;
      border-color: #FFD166;
      font-weight: 500;
   }

   .playoff-bracket-tab-content {
      padding: 10px;
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
      margin: 16px 0 16px 0px;
   }

   .nfl-standings-glossary-section .glossary-wrapper {
      justify-content: center;
   }

   .nfl-standings-glossary-section .glossary-container {
      width: 60%;
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
      font-weight: 500;
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
      padding: 4px 6px;
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
      height: 30px;
      object-fit: contain;
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
      font-weight: 500;
      width: 50%;
      border-radius: 28px;
      cursor: pointer;
   }

   .standings-draft-order-toggle-wrapper .selected {
      border-radius: 28px;
      background-color: #0050A0;
      color: #FFF;
   }

   .nfl-playoff-predictor .playoff-participants-standings-container .division-team-container {
      display: flex;
      padding: 10px;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      border-radius: 4px;
   }

   .content-holder {
      width: 1200px;
   }

   .standings-section-header-text-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
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
      border: 1px solid #0050A0;
      border-radius: 14px;
      gap: 3px;
      color: #0050A0;
      padding: 5px;
      align-items: center;
   }

   span.download-text, span.share-text {
      color: #0050A0;
      font-size: 13px;
      font-weight: 500;
      margin-left: unset;
   }

   .draft-order-utility-heading-holder {
      display: flex;
      align-items: center;
   }
}
</style>
