<style>
  .ultimate-simulator-container {
    border: 1px solid #e9e9e9;
    border-radius: 12px;
  }

  .ultimate-simulator-container #ad-banner-container {
    background-color: #ededed;
    height: 105px;
    position: fixed;
    top: 93px;
    left: 0;
    width: 100%;
    z-index: 10000;
    overflow: hidden;
  }

  .ultimate-simulator-container .steps-wrap {
    display: flex;
    align-items: stretch;
    background: #fff;
    border-radius: 12px 12px 0 0;
    box-shadow: 0px 4px 4px 0px #0000000D;
  }

  .ultimate-simulator-container .steps-aside {
    background: #172B4D;
    color: #fff;
    padding: 14px 18px;
    min-width: 92px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px 0 0 0;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
  }

  .ultimate-simulator-container .steps-aside-title {
    font-size: 16px;
    font-weight: 600;
    text-align: center
  }

  .ultimate-simulator-container .steps-bar {
    display: flex;
    gap: 0px;
    align-items: center;
    padding: 12px 18px;
    margin: 0;
    list-style: none;
    width: 100%;
    overflow-x: auto;
  }

  .ultimate-simulator-container .step-node {
    position: relative;
    display: grid;
    grid-template-columns: auto;
    justify-items: center;
    min-width: 88px;
    color: #8a97ab;
  }

  .ultimate-simulator-container .arrow {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ultimate-simulator-container .arrow .arrow-point {
    border: solid #666;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 5px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    margin-left: -12px;
  }

  .ultimate-simulator-container .arrow .arrow-shaft {
    border-top: 3px solid #666;
    width: 38px;
  }

  .ultimate-simulator-container .arrow.blue .arrow-shaft {
    border-top: 3px solid #0857C3;
  }

  .ultimate-simulator-container .arrow.blue .arrow-point {
    border-right: 3px solid #0857C3;
    border-bottom: 3px solid #0857C3;
  }

  .ultimate-simulator-container .step-node .step-num {
    width: 30px;
    height: 30px;
    color: #666666;
    border: 2px solid #666666;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: 600;
    font-size: 13px;
    background: #fff;
  }

  .ultimate-simulator-container .step-node .step-completed .completed-tick {
    width: 16px;
    height: 12px;
    background: unset;
  }

  .ultimate-simulator-container .step-node .step-completed {
    width: 30px;
    height: 30px;
    border: 2px solid #0857C3;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0857C3;
  }

  .ultimate-simulator-container .step-node .step-label {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    width: 66px;
    color: #666666;
  }

  .ultimate-simulator-container .step-node.is-active .step-num {
    border-color: #2e5ac7;
    color: #2e5ac7;
  }

  .ultimate-simulator-container .step-node.is-active .step-label {
    color: #2e5ac7;
  }

  #screen-select .select-team-text-container {
    padding: 8px 15px;
    text-align: left;
    background: #fff;
    margin-top: 5px;
  }

  .select-team-text-container .select-team-text {
    font-size: 16px;
    font-weight: 600;
    color: #172B4D;
  }

  .ultimate-simulator-container .select-teams {
    background: #F6F7FF;
    padding: 16px 20px;
    border-radius: 0 0 12px 12px;
  }

  .ultimate-simulator-container .conf-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px
  }

  .ultimate-simulator-container .conf-row {
    grid-template-columns: 1fr 1fr
  }

  .ultimate-simulator-container .conf-card {
    background: #f7f8fb;
    border-radius: 14px;
    border: 1px solid #e9e9e9
  }

  .ultimate-simulator-container .conf-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 12px;
    border-radius: 10px 10px 0 0;
    color: #fff;
  }

  .ultimate-simulator-container .conf-afc .conf-header {
    background: #CE1127;
  }

  .ultimate-simulator-container .conf-nfc .conf-header {
    background: #003B74;
  }

  .ultimate-simulator-container .conf-badge {
    display: inline-grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background: rgba(255, 255, 255, .16);
    font-weight: 700;
    font-size: 14px
  }

  .ultimate-simulator-container .conf-title {
    font-weight: 700;
    font-size: 15px;
    letter-spacing: .3px
  }

  .ultimate-simulator-container .teams-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 14px;
  }

  .ultimate-simulator-container .team-tile {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-content: center;
    gap: 8px;
    padding: 12px;
    width: 23%;
    border: 1px solid #e9e9e9;
    background: #fff;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 1px 1px 7px 0px #00000012;
    flex-wrap: wrap;
  }

  .ultimate-simulator-container .team-tile:hover {
    border-color: #666666
  }

  .ultimate-simulator-container .team-tile img {
    width: 36px;
    height: 25px;
    object-fit: contain
  }

  .ultimate-simulator-container .team-name {
    font-size: 16px;
    font-weight: 500;
    color: #2d2d2d;
  }

  .ultimate-simulator-container .team-tile.is-selected {
    border-color: #2f63d7;
    background: #ebf2ff;
    box-shadow: 0 0 0 3px #dfe9ff inset;
  }

  .ultimate-simulator-container .info-text {
    text-align: center;
    color: #7b8798;
    font-size: 14px;
    margin: 18px 0 10px
  }

  .ultimate-simulator-container .bottom-primary {
    display: flex;
    justify-content: center;
    margin-top: 8px
  }

  .ultimate-simulator-container .bottom-primary.gap {
    gap: 10px;
  }

  .ultimate-simulator-container .continue-btn {
    background: #37C77A;
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 12px 28px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  .ultimate-simulator-container .continue-btn:disabled,
  .standings-draftOrder-copy .continue-next-screen:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .ultimate-simulator-container .info-text-continue-btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #F6F7FF;
    padding: 0 21px 16px 21px;
    border-radius: 0 0 12px 12px;
  }

  .info-text-continue-btn-container .info-text {
    font-size: 14px;
    font-weight: 600;
    font-style: italic;
    color: #666666;
  }

  .standings-draftOrder-copy {
    background: #fff;
    top: 50%;
    left: 50%;
    position: fixed;
    z-index: 3000;
    transform: translateY(-50%) translateX(-50%);
    width: 58%;
    height: 70%;
    overflow-y: scroll;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .standings-draftOrder-copy .continue-next-screen {
    width: 400px;
    margin: 0 20px 20px 20px;
    border: unset;
    background: #37C77A;
    color: #fff;
    border-radius: 25px;
    padding: 10px 0;
    font-size: 16px;
    font-weight: 600;
  }

  .playoff-predictor-tool-mapping .current-year-container {
    padding: 8px 15px;
    text-align: left;
    font-size: 16px;
    font-weight: 600;
    color: #172B4D;
  }

  .mds-roster-result-holder.custom-scrollbar .table-wrapper.no-scrollbar {
    overflow: unset;
  }

  .mds-roster-result-container .mds-roster-result-holder.custom-scrollbar table {
    box-shadow: unset;
  }

  .ultimate-result-screen .ultimate-result-header-container {
    padding: 8px 20px 12px 20px;
  }

  .ultimate-result-header-container .result-header-text {
    color: #172B4D;
    font-size: 16px;
    font-weight: 600;
  }

  .ultimate-result-header-container .result-header-btns-container {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ultimate-result-header-container .result-header-btns-container .result-section-btns {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ultimate-result-header-container .result-header-btns-container .result-section-btns button {
    border: unset;
    font-size: 14px;
    font-weight: 600;
    color: #999999;
    background: #f5f5f5;
    padding: 9px 25px;
  }

  .ultimate-result-header-container .result-header-btns-container .result-section-btns button.result-overview-btn {
    border-radius: 4px 0 0 4px;
  }

  .ultimate-result-header-container .result-header-btns-container .result-section-btns button.draft-order-result-btn {
    border-radius: 0 4px 4px 0;
  }

  .ultimate-result-header-container .result-header-btns-container .result-section-btns .selected {
    background: #0857C3;
    color: #fff;
  }

  .ultimate-result-screen .utility-section-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }

  .ultimate-result-screen .utility-section-btns button {
    padding: 6px 9px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border: 1px solid #202224;
    color: #202224;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 500;
    background: #fff;
  }

  .ultimate-result-screen .utility-section-btns button .download-icon {
    width: 15px;
    height: 15px;
    background: unset;
  }

  .ultimate-result-screen .utility-section-btns button .download-icon {
    width: 12px;
    height: 13px;
    background: unset;
  }

  .ultimate-result-header-container .result-header-predicted-standings-btns-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
  }

  .ultimate-result-header-container .result-header-predicted-standings-btns-container button {
    background: #F5F6F8;
    color: #42526E;
    border: unset;
    padding: 8px 12px;
  }

  .ultimate-result-header-container .result-header-predicted-standings-btns-container button.selected {
    background: #172B4D;
    color: #fff;
  }

  .ultimate-result-header-container .result-header-team-logos-container {
    margin-top: 16px;
    overflow-x: auto;
  }

  .ultimate-result-header-container .result-header-team-logos-container .result-header-team-logos-holder {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 18px;
  }

  .ultimate-result-header-container .result-header-team-logos-container .result-header-team-logos-holder .team-image-holder {
    display: flex;
    padding: 5px 0;
    border: unset;
    background: #fff;
  }

  .ultimate-result-header-container .result-header-team-logos-container .result-header-team-logos-holder .team-image-holder.selected {
    border-radius: 25px;
    border: 2px solid #0857C3;
  }

  .mds-roster-result-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    width: 60%;
    border-radius: 6px;
    background: #fff;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  .loading-next-screen-popup {
    position: fixed;
    top: 90px;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .loading-next-screen-popup .loading-popup-text {
    font-size: 21px;
    font-weight: 600;
    color: #172B4D;
    animation: blinker 1.5s linear infinite;
    margin-bottom: 225px;
  }

  .ultimate-result-screen .mds-roster-result-container {
    position: unset;
    transform: unset;
    width: 100%;
    border: 1px solid #000;
  }

  .ultimate-result-screen .mds-roster-result-container .mds-roster-result-header {
    border-bottom: 1px solid #000;
  }

  .ultimate-result-screen .mds-roster-result-container .mds-roster-result-holder-wrapper {
    padding: unset;
  }

  .ultimate-result-screen .mds-roster-result-container .mds-roster-result-header {
    padding-left: 16px;
  }

  .ultimate-result-screen thead tr th:first-child {
    border-top-left-radius: 0px;
  }

  .ultimate-result-screen thead tr th:last-child {
    border-top-right-radius: 0px;
  }

  /* .ultimate-result-screen .mds-roster-result-header-text {
    color: #2d2d2d;
    font-weight: 500;
    font-size: 14px;
  } */

  .mds-roster-result-container .mds-roster-result-header {
    width: 100%;
    text-align: left;
    padding: 16px 20px;
    border-bottom: 1px solid #e9e9e9;
    background: #fff;
  }

  .mds-roster-result-header .mds-roster-result-header-text {
    font-size: 16px;
    font-weight: 600;
    color: #666666;
  }

  .ultimate-result-screen .mds-roster-result-header .mds-roster-result-header-text {
    font-size: 14px;
    font-weight: 500;
    color: #2d2d2d;
  }

  .mds-roster-result-container .mds-roster-result-holder-wrapper {
    padding: 16px 20px;
    width: 100%;
  }

  .mds-roster-result-holder-wrapper .table-wrapper {
    width: 50%;
  }

  .mds-roster-result-container .mds-roster-result-holder {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
  }

  .mds-roster-result-container .continue-simulate-next-year-games {
    margin: 16px 0 16px 0;
    padding: 10px 50px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    border-radius: 25px;
    background: #37C77A;
    border: unset;
  }

  .ultimate-result-screen .result-data-container {
    padding: 16px 28px;
    background: #f6f7ff;
  }

  .ultimate-result-screen .result-data-container .division-standings>div,
  .ultimate-result-screen .result-data-container .conference-standings>div,
  .ultimate-result-screen .result-data-container .draft-order-table>div {
    border: 1px solid #000;
    border-radius: 6px;
    width: 49%;
  }

  .ultimate-result-screen .result-data-container .conference-standings .standings-header-text,
  .ultimate-result-screen .result-data-container .division-standings .standings-header-text {
    display: inline-block;
    padding: 11px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #2d2d2d;
    width: 100%;
    background: #fff;
    border-radius: 6px 6px 0 0;
  }

  .ultimate-result-screen .result-data-container .conference-standings thead,
  .ultimate-result-screen .result-data-container .division-standings thead,
  .ultimate-result-screen .result-data-container .draft-order-table thead {
    border-radius: 6px 6px 0 0;
  }

  .ultimate-result-screen .result-data-container .conference-standings thead th,
  .ultimate-result-screen .result-data-container .division-standings thead th {
    color: #999;
    background: #f5f5f5;
    border-top: 1px solid #000;
  }

  .ultimate-result-screen .result-data-container .draft-order-table thead th {
    color: #999;
    background: #f5f5f5;
  }

  .ultimate-result-screen .result-data-container .division-standings,
  .ultimate-result-screen .result-data-container .conference-standings,
  .ultimate-result-screen .result-data-container .draft-order-table {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  .ultimate-result-screen .result-data-container .predict-playoff-games-popup-content {
    background: #fff;
    width: 50%;
    border: 1px solid #000;
    border-radius: 6px;
  }

  .ultimate-result-screen .result-data-container .standings-team-container-td {
    justify-content: center;
  }

  .mds-overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    background: #000;
    opacity: 0.8;
    left: 0;
    top: 0;
    z-index: 20000;
  }

  .glossary-container .glossary-header::after {
    display: none !important;
  }

  .ultimate-result-screen .draft-order-table td,
  .ultimate-result-screen .draft-order-table th {
    width: unset;
  }

  .team-overview-result {
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  .team-overview-result .overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #0957C3;
    padding: 4px 14px;
    border-radius: 8px 8px 0 0;
  }

  .team-overview-result .overview-header .team-logo-text-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }

  .team-overview-result .overview-header .team-logo-text-container .team-logo-holder {
    display: flex;
    border-radius: 25px;
    background: #fff;
    padding: 6px 2px;
  }

  .team-overview-result .overview-header .team-logo-text-container .team-logo {
    width: 30px;
    height: 20x;
  }

  .team-overview-result .overview-header .team-logo-text-container .team-name {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
  }

  .team-overview-result .performance-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 12px;
    gap: 12px;
  }

  .team-overview-result .performance-container .year-performance {
    display: flex;
    flex-direction: column;
    border: 1px solid #dfdfdf;
    border-radius: 12px;
    padding: 14px 12px;
    width: 50%;
    gap: 14px;
  }

  .team-overview-result .performance-container .year-performance .season-text {
    font-size: 16px;
    font-weight: 600;
    color: #202224;
  }

  .team-overview-result .performance-container .year-performance .record-rank-container,
  .team-overview-result .performance-container .year-performance .rank-round-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .team-overview-result .performance-container .year-performance .record-container,
  .team-overview-result .performance-container .year-performance .rank-container {
    width: 200px;
  }

  .team-overview-result .performance-container .year-performance .record-container .text,
  .team-overview-result .performance-container .year-performance .rank-container .text,
  .team-overview-result .performance-container .year-performance .round-container .text {
    font-size: 12px;
    font-weight: 400;
    color: #202224;
  }

  .team-overview-result .performance-container .year-performance .record-container .value,
  .team-overview-result .performance-container .year-performance .rank-container .value,
  .team-overview-result .performance-container .year-performance .round-container .value {
    font-size: 16px;
    font-weight: 600;
    color: #202224;
  }

  .team-overview-result .roster-changes-container .roster-changes-header,
  .team-overview-result .match-predictions-container .match-predictions-header {
    display: flex;
    justify-content: center;
    background: linear-gradient(90deg, #022049 0%, #136DE8 49%, #022049 100%);
    padding: 8px 0;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }

  .team-overview-result .match-predictions-container {
    margin-top: 16px;
  }

  .team-overview-result .roster-tables-container,
  .team-overview-result .match-predictions-tables-container {
    display: flex;
  }

  .team-overview-result .match-predictions-tables-container img {
    width: 30px;
    height: 20px;
  }

  .team-overview-result .roster-tables-container th,
  .team-overview-result .match-predictions-container th {
    font-size: 12px;
  }

  .team-overview-result .roster-tables-container td,
  .team-overview-result .match-predictions-container td {
    font-size: 12px;
    font-weight: 500;
    color: #2d2d2d;
  }

  .team-overview-result .roster-tables-container td .position {
    color: #999999;
    font-size: 12px;
    font-weight: 400;
  }

  .team-overview-result .match-predictions-container td.opposition {
    padding: 9px;
  }

  .team-overview-result .match-predictions-container th.opposition,
  .team-overview-result .match-predictions-container th.result,
  .team-overview-result .match-predictions-container td.opposition,
  .team-overview-result .match-predictions-container td.result {
    text-align: center;
  }

  .team-overview-result table {
    box-shadow: unset;
    border-right: 1px solid #E4E6EE;
  }

  .team-overview-result table tbody tr:last-child td:first-child,
  .team-overview-result table tbody tr:last-child td:last-child {
    border-radius: 0px;
  }

  @media(max-width: 768px) {
    .pfn-content-wrapper {
      margin-top: 75px;
    }

    .ultimate-simulator-container {
      border: unset;
    }

    .ultimate-simulator-container .steps-bar {
      padding: 8px 6px 0px 6px;
      gap: 8px;
    }

    .ultimate-simulator-container .steps-bar::-webkit-scrollbar {
      display: none;
    }

    .ultimate-simulator-container .step-node .step-num {
      width: 23px;
      height: 23px;
      font-size: 10px;
      font-weight: 500;
    }

    .ultimate-simulator-container .step-node .step-label {
      font-size: 10px;
      font-weight: 500;
      width: 52px;
    }

    .ultimate-simulator-container .step-node {
      min-width: 56px;
      padding-bottom: 5px;
    }

    .ultimate-simulator-container .step-node.is-active-border {
      border-bottom: 3px solid #0857C3;
    }

    .ultimate-simulator-container .arrow {
      --head: 8px;
    }

    #screen-select .select-team-text-container {
      padding: 6px 16px;
    }

    .select-team-text-container .select-team-text {
      font-size: 14px;
    }

    .ultimate-simulator-container .select-teams {
      padding: 12px 16px;
      box-shadow: 0px 4px 4px 0px #0000000D;
      background: #fff;
    }

    .ultimate-simulator-container .conf-row {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ultimate-simulator-container .conf-header {
      gap: 5px;
      justify-content: flex-start;
      width: 76px;
      border-radius: 4px 4px 0 0;
      position: relative;
    }

    .ultimate-simulator-container .conf-header::after {
      content: "";
      position: absolute;
      top: 0;
      right: -8px;
      width: 10px;
      height: 100%;
      background: #CE1127;
      clip-path: polygon(0 0, 30% 23%, 100% 100%, 0 100%);
    }

    .ultimate-simulator-container .conf-nfc .conf-header::after {
      background: #003B74;
    }

    .ultimate-simulator-container .conf-header span {
      font-size: 12px;
      font-weight: 500;
      font-style: italic;
    }

    .ultimate-simulator-container .conf-card {
      background: #fff;
      border: unset;
    }

    .ultimate-simulator-container .team-tile {
      width: 23%;
    }

    .ultimate-simulator-container .teams-grid {
      padding: 6px 0;
      gap: 6px;
    }

    .ultimate-simulator-container .team-tile {
      padding: 5px 2px;
      flex-direction: row;
    }

    .ultimate-simulator-container .team-tile img {
      width: 32px;
      height: 18px;
    }

    .ultimate-simulator-container .team-name {
      font-size: 12px;
    }

    .conf-header img {
      width: 24px;
      height: 17px;
    }

    .info-text-continue-btn-container .info-text {
      font-size: 12px;
      margin: unset;
    }

    .ultimate-simulator-container .continue-btn {
      font-size: 14px;
      width: 90%;
    }

    .ultimate-simulator-container .simulation-ctas-container .continue-btn {
      width: 130%;
      padding: 10px 20px;
    }

    .ultimate-simulator-container .info-text-continue-btn-container {
      flex-direction: column-reverse;
      background: #fff;
      gap: 16px;
    }

    .playoff-predictor-tool-mapping .current-year-container {
      font-size: 14px;
      font-weight: 600;
      color: #2d2d2d;
      border-bottom: 1px solid #e0e0e0;
    }

    .ultimate-simulator-container .playoff-predictor-tool-wrapper {
      padding: 4px 16px;
    }

    .standings-draftOrder-copy {
      top: 10%;
      left: 0;
      transform: unset;
      width: 100%;
      height: 84%;
    }

    .mds-roster-result-container .mds-roster-result-header {
      border-radius: 16px 16px 0 0;
    }

    #AdThrive_Footer_1_phone {
      display: none;
    }

    .pfn-content-container {
      padding: unset;
      margin-top: 145px;
    }

    .ultimate-result-header-container .result-header-btns-container .result-section-btns {
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 0;
      height: 50px;
      z-index: 1000;
    }

    .ultimate-result-header-container .result-header-btns-container .result-section-btns button {
      height: 50px;
      border-radius: 0;
      font-size: 12px;
      font-weight: 500;
      color: #080A3C;
    }

    .ultimate-result-header-container .result-header-btns-container .result-section-btns button.result-overview-btn,
    .ultimate-result-header-container .result-header-btns-container .result-section-btns button.draft-order-result-btn {
      border-radius: 0px;
    }

    .ultimate-result-header-container .result-header-btns-container .result-section-btns button.draft-order-result-btn,
    .ultimate-result-header-container .result-header-btns-container .result-section-btns button.standings-result-btn {
      border-left: 1px solid #E4E6EE;
    }

    .ultimate-result-screen .result-data-container {
      padding: 12px;
      background: #fff;
    }

    .ultimate-result-screen .mds-roster-result-container .mds-roster-result-header {
      padding: 8px 14px;
    }

    .ultimate-result-screen .result-header-predicted-standings-btns-holder {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }

    .ultimate-result-header-container .result-header-team-logos-container {
      display: flex;
      flex-direction: column;
      overflow-x: unset;
      gap: 12px;
    }

    .ultimate-result-header-container .result-header-team-logos-container .result-header-team-logos-holder {
      overflow: auto;
    }

    .ultimate-result-screen .result-data-container .division-standings>div,
    .ultimate-result-screen .result-data-container .conference-standings>div,
    .ultimate-result-screen .result-data-container .draft-order-table>div {
      width: 100%;
    }

    .ultimate-result-screen .result-data-container .predict-playoff-games-popup-content {
      width: 100%;
    }

    .ultimate-result-header-container .result-header-btns-container {
      margin-top: unset;
    }

    .ultimate-result-screen .mds-roster-result-header-text {
      color: #2d2d2d;
      font-weight: 500;
      font-size: 14px;
    }

    .ultimate-simulator-container .arrow .arrow-point {
      padding: 3px;
      margin-left: -7px;
      border-width: 0 2px 2px 0;
    }

    .ultimate-simulator-container .arrow .arrow-shaft {
      border-top: 2px solid #666;
      width: 12px;
    }

    .ultimate-simulator-container .arrow.blue .arrow-shaft {
      border-top: 2px solid #0857C3;
    }

    .ultimate-simulator-container .arrow.blue .arrow-point {
      border-right: 2px solid #0857C3;
      border-bottom: 2px solid #0857C3;
    }

    .standings-draftOrder-copy .continue-next-screen {
      width: 90%;
    }

    .ultimate-simulator-container .steps-wrap {
      /* position: sticky;
      top: 70px; */
      background: #fff;
      z-index: 1000;
    }

    .loading-next-screen-popup {
      top: 70px;
    }

    .loading-next-screen-popup .loading-popup-text {
      font-size: 18px;
      margin: 0 10px 150px 10px;
    }

    .sticky-ad-container {
      display: none;
      bottom: -100px;
    }

    .ad-content,
    #AdThrive_Footer_1_phone,
    #AdThrive_Content_1_phone {
      display: none;
    }

    .team-overview-result .performance-container {
      flex-direction: column;
      padding: 8px 0;
    }

    .team-overview-result .performance-container .year-performance {
      width: 100%;
    }

    .team-overview-result .performance-container .year-performance .record-container,
    .team-overview-result .performance-container .year-performance .rank-container {
      width: 130px;
    }

    .ultimate-result-header-container .result-header-btns-container .result-section-btns button {
      padding: 9px 16px;
    }

    .content .mobile-top-adv-container {
      width: 100%;
      min-height: 70px;
      max-height: 70px;
      position: fixed;
      top: 70px;
      background: #fff;
      z-index: 9999;
      left: 0;
      overflow: hidden;
    }
  }
</style>
