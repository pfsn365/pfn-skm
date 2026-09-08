<style>
  .container {
    line-height: unset;
  }

  .content-holder {
    width: 1110px;
  }

  table tr {
    border: none !important;
    border-bottom: 1px solid #f5f5f5 !important;
  }

  .content-holder table {
    max-width: unset;
    display: inline-table;
  }

  .content-holder table td,
  .content-holder table th {
    text-align: center;
    padding: 6px 0;
    margin: 0px;
  }

  .content-holder table th.player-details-header {
    text-align: start;
    padding-left: 10px;
  }

  .players-lineups-container .players-pool {
    height: 534px;
  }

  .right-sidebar {
    visibility: hidden;
  }

  button {
    cursor: pointer;
  }

  .lineup-optimizer-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .lineup-optimizer-container .players-lineups-container {
    border: 1px solid #E9E9E9;
    background: #FFF;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .lineup-optimizer-container .players-lineups-holder {
    display: flex;
    gap: 18px;
    width: 100%;
  }

  .players-lineups-container .feedback-container {
    margin: -5px 0px -20px 0;
  }

  .players-lineups-container .feedback-parent-container .feedback-cta-container {
    justify-content: flex-end;
  }

  .players-lineups-container .players-pool {
    border-radius: 12px;
    border: 1px solid #E9E9E9;
    background: #FFF;
    display: flex;
    flex-direction: column;
    width: 60%;
  }

  .players-pool .player-pool-text-container {
    display: flex;
    justify-content: flex-start;
    padding: 12px 20px;
  }

  .player-pool-text-container .player-pool-text {
    color: #474747;
    font-size: 16px;
    font-weight: 500;
  }

  .players-pool .players-category-remaining-salary-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.05);
  }

  .players-category-remaining-salary-container .players-category-buttons-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }

  .players-category-buttons-container .players-category {
    color: #666;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 12px;
    border: unset;
    background: #fff;
    border-bottom: 2px solid transparent;
  }

  .players-category-buttons-container .players-category.selected {
    color: #37C77A;
    border-bottom-color: #37C77A;
  }

  .players-category-remaining-salary-container .remaining-salary-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
    padding: 8px 0;
  }

  .remaining-salary-container .remaining-salary,
  .remaining-salary-container .locked-players {
    color: #858585;
    font-size: 11px;
    font-weight: 600;
  }

  .remaining-salary-container .text {
    color: #999;
    font-size: 11px;
    font-weight: 400;
  }

  .remaining-salary-container .separator {
    border-left: 1px solid #E9E9E9;
    height: 14px;
    margin: 0 10px;
  }

  .players-pool .player-positions-filters-search-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
  }

  .player-positions-filters-search-container .players-positions-filters-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  button.position-filter {
    display: flex;
    padding: 8px 12px;
    color: #474747;
    border-radius: 25px;
    border: 1px solid #E9E9E9;
    background: #F5F5F5;
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.07);
  }

  button.position-filter.selected {
    border-color: #e9e9e9;
    background-color: #37C77A;
    color: #fff;
  }

  .players-pool .player-search-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .player-search-container .search-icon-holder {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0 8px 10px;
    border-radius: 25px 0 0 25px;
    border: 1px solid #e9e9e9;
    border-right: unset;
  }

  .player-search-container .search-icon-holder .search-icon {
    width: 16px;
    height: 16px;
    background-color: #fff;
  }

  .player-search-container .player-search-input {
    padding: 6px 0 6px 10px;
    color: #2d2d2d;
    border: 1px solid #e9e9e9;
    border-left: unset;
    border-radius: 0 25px 25px 0;
    outline: none;
  }

  .players-info-container-header {
    background: #f5f5f5;
    position: sticky;
    top: 0;
  }

  .players-info-container-header th {
    padding: 6px 0;
    color: #999;
    font-size: 12px;
    font-weight: 500;
  }

  .salary-sort-descending-btn,
  .salary-sort-ascending-btn,
  .value-sort-descending-btn,
  .value-sort-ascending-btn,
  .points-sort-descending-btn,
  .points-sort-ascending-btn {
    border: none;
    background: #f5f5f5;
  }

  .lock-player-btn,
  .unlock-player-btn,
  .remove-player-btn {
    border: none;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lock-player-btn img {
    width: 16px;
    height: 13px;
  }

  .remove-player-btn img {
    width: 16px;
    height: 16px;
  }

  .lineup-optimizer-container .players-table-container {
    height: 395px;
    overflow-y: scroll;
    position: relative;
  }

  .players-list-table thead {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .players-list-table td {
    padding: 6px 0;
    text-align: center;
    vertical-align: middle;
  }

  .players-list-table .first-header {
    padding-left: 20px;
  }

  .players-list-table td:first-child {
    padding-left: 20px;
  }

  .players-list-table td:last-child {
    padding-right: 5px;
  }

  .players-list-table .player-name-header {
    text-align: start;
    padding-left: 15px;
  }

  .players-list-table .single-player-row {
    border-bottom: 1px solid #f5f5f5;
  }

  .single-player-row .player-position {
    color: #2D2D2D;
    font-size: 12px;
    font-weight: 600;
    width: 58px;
  }

  .single-player-row .player-name {
    color: #2D2D2D;
    font-size: 12px;
    font-weight: 500;
    text-align: start;
    padding-left: 15px;
    width: 215px;
  }

  .single-player-row .team-name {
    color: #999;
    font-size: 12px;
    font-weight: 400;
  }

  .single-player-row .player-records {
    color: #2D2D2D;
    font-size: 12px;
    font-weight: 400;
  }

  .single-player-row .actions-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
  }

  .single-player-row .add-player-button {
    display: flex;
    padding: 2px 10px;
    justify-content: center;
    align-items: center;
    gap: 2px;
    border-radius: 23px;
    border: 1px solid #2D2D2D;
    color: #2D2D2D;
    background: none;
  }

  .players-lineups-container .lineups-container {
    display: flex;
    flex-direction: column;
    border: 2px solid #2d2d2d;
    border-radius: 6px;
    height: 534px;
    width: 40%;
    position: relative;
    overflow-x: hidden;
  }

  .lineups-container .lineups-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: #222;
  }

  .lineups-header-container .header-text {
    color: #FFF;
    font-size: 16px;
    font-weight: 500;
  }

  .lineups-header-container .points-salary-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .points-salary-container .remaining-salary-holder,
  .points-salary-container .remaining-points-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
  }

  .lineup-optimizer-container .disabled-build-btn {
    opacity: 0.6;
    pointer-events: none;
    cursor: not-allowed;
  }

  .remaining-salary-holder .remaining-salary-amount,
  .remaining-points-container .remaining-points-count {
    color: #FFF;
    font-size: 16px;
    font-weight: 600;
  }

  .remaining-salary-holder .remaining-salary-text,
  .remaining-points-container .projected-points-text {
    color: #999;
    font-size: 11px;
    font-weight: 400;
  }

  .build-lineups-bottom {
    display: flex;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 6px;
    background: #37C77A;
    margin: 8px 23px;
    position: absolute;
    bottom: 0;
    border: none;
    width: calc(100% - 46px);
    color: #fff;
  }

  .lineups-table .lineups-header-row {
    background: #f5f5f5;
  }

  .lineups-header-row th {
    color: #999;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 0;
  }

  .lineups-table button {
    border: none;
    background: #f5f5f5;
  }

  .player-points-value-select-container select {
    border: 1px solid #e9e9e9;
    border-radius: 25px;
    background: #f5f5f5;
    color: #2D2D2D;
    font-size: 12px;
    font-weight: 500;
  }

  .lineups-buttons-container {
    padding: 5px 0;
  }

  .lineups-buttons-container .lineups-buttons-holder {
    display: flex;
    justify-content: flex-start;
    align-items: end;
    padding: 0px 18px;
    gap: 8px;
    overflow-x: scroll;
  }

  .lineups-buttons-container .lineups-buttons-holder::-webkit-scrollbar {
    display: none;
  }

  .lineups-buttons-holder .lineup-selection-btn {
    border: none;
    background: #e9e9e9;
    padding: 8px 12px;
    color: #474747;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
  }

  .lineups-buttons-holder .lineup-selection-btn.selected {
    color: #fff;
    background: #222;
  }

  .lineup-single-player-row {
    border-bottom: 1px solid #f5f5f5;
  }

  .lineup-single-player-row td {
    padding: 6px 0;
    text-align: center;
    vertical-align: middle;
  }

  .lineup-single-player-row .lineup-player-position {
    color: #2D2D2D;
    font-size: 14px;
    font-weight: 600;
    padding-left: 10px;
    text-align: start;
  }

  .lineup-player-details-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
  }

  .lineup-player-details-container .lineup-player-name {
    color: #2D2D2D;
    font-size: 12px;
    font-weight: 500;
    text-align: start;
  }

  .lineup-teams-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .lineup-teams-container .lineup-team {
    color: #999;
    font-size: 11px;
    font-weight: 400;
  }

  .player-points-value-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lineup-player-salary,
  .player-points-value-container span {
    color: #2D2D2D;
    font-size: 12px;
    font-weight: 400;
  }

  .lineup-locked-icon {
    width: 17px;
    height: 15px;
    opacity: 0.4;
    background: none;
  }

  .lineup-remove-icon {
    width: 16px;
    height: 16px;
    background: none;
  }

  .lineup-substitute-player-icon {
    width: 16px;
    height: 10px;
    background: none;
  }

  .lineups-table .lineup-remove-player-btn,
  .lineups-table .lineup-substitute-player-icon {
    background: #fff;
  }

  .lineup-single-player-row td.lineup-player-details-holder {
    display: flex;
    justify-content: start;
    align-items: center;
    padding-left: 10px;
    width: 155px;
  }

  th.player-details-header {
    text-align: start;
    padding-left: 10px;
  }

  .refresh-lineup-download-csv-container {
    width: calc(100% - 46px);
    margin: 0px 23px 6px 23px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    gap: 10px;
  }

  .refresh-lineup-download-csv-container .refresh-lineup-btn {
    display: flex;
    width: 177px;
    padding: 9px 16px;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    background: #37C77A;
    border: none;
    color: #fff;
  }

  .refresh-lineup-download-csv-container .reset-lineup-btn,
  .refresh-lineup-download-csv-container .download-csv-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    color: #2D2D2D;
    font-size: 14px;
    font-weight: 500;
    border: none;
    background: #fff;
    padding: 8px 16px;
    border-radius: 25px;
    border: 1px solid #2d2d2d;
    width: 100%;
  }

  .refresh-lineup-download-csv-container .download-csv-btn {
    width: 142px;
  }

  .refresh-lineup-download-csv-container .reset-lineup-btn,
  .refresh-lineup-download-csv-container .refresh-lineup-btn {
    width: 33%;
  }

  .reset-lineup-btn img,
  .download-csv-btn img {
    width: 16px;
    height: 16px;
    background: #fff;
    margin: 0;
  }

  .download-csv-btn img {
    width: 13px;
    height: 13px;
  }

  .players-list-table .player-salary-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .lineup-remove-player-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lineup-single-player-row .actions-container .lineup-remove-player-btn {
    margin: unset;
    padding: unset;
  }

  .lineup-single-player-row .actions-container .lineup-locked-icon {
    margin: 0;
    margin-right: 5px;
  }

  .lineup-single-player-row .actions-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .players-info-container-header th:last-child {
    padding-right: 10px;
  }

  .lineups-table button.lineup-add-substituted-player-btn {
    background: none;
  }

  .player-salary-header .salary-sort-descending-btn,
  .player-salary-header .salary-sort-ascending-btn,
  th .points-sort-descending-btn,
  th .points-sort-ascending-btn,
  th .value-sort-descending-btn,
  th .value-sort-ascending-btn,
  .lineup-salary-container .lineup-salary-sort-descending-btn,
  .lineup-salary-container .lineup-salary-sort-ascending-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: #999;
    font-size: 12px;
    font-weight: 500;
  }

  .lineups-table .action-header {
    margin-right: 10px;
  }

  .blink {
    animation: blinker 1.5s infinite;
  }

  .lineups-buttons-container .lineups-carousel-control-right-btn-holder {
    position: absolute;
    top: 11.2%;
    transform: translateY(-50%);
    z-index: 999;
    right: -15px;
  }

  .lineups-buttons-container .right-scroll-button {
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #dfdfdf;
    box-shadow: 3px 1px 10px rgba(0, 0, 0, 0.05);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: unset;
  }

  .lineups-buttons-container .right-scroll-button img {
    width: 7px;
    height: 12px;
    object-fit: cover;
    display: block;
    position: relative;
    left: -5px;
  }

  .lineups-buttons-container .left-scroll-button img {
    width: 7px;
    height: 12px;
    object-fit: cover;
    display: block;
    position: relative;
    rotate: 180deg;
    right: -5px;
  }

  .lineups-buttons-container .left-scroll-button {
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #dfdfdf;
    box-shadow: 3px 1px 10px rgba(0, 0, 0, 0.05);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: unset;
  }

  .lineups-buttons-container .lineups-carousel-control-left-btn-holder {
    position: absolute;
    top: 11.2%;
    transform: translateY(-50%);
    z-index: 999;
    left: -15px;
  }

  .sorted-column {
    background: #F7F7FA;
  }

  .players-table-container .salary-tooltip-container,
  .players-table-container .points-tooltip-container,
  .players-table-container .value-tooltip-container,
  .players-table-container .action-tooltip-container {
    display: flex;
    padding: 8px;
    border: 1px solid #E9E9E9;
    position: absolute;
    z-index: 1000;
    background: #fff;
    top: 28px;
  }

  .players-table-container .salary-tooltip-container {
    left: 152px;
    width: 258px;
  }

  .players-table-container .action-tooltip-container {
    left: 361px;
    width: 230px;
  }

  .players-table-container .value-tooltip-container {
    left: 275px;
    width: 239px;
  }

  .players-table-container .points-tooltip-container {
    left: 157px;
    width: 302px;
  }

  .players-table-container .up-pointer {
    width: 0;
    height: 0px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 9px solid #fff;
    display: inline-block;
    position: absolute;
    top: -9px;
    z-index: 1000;
  }

  .salary-tooltip-container .up-pointer {
    left: 220px;
  }

  .points-tooltip-container .up-pointer {
    left: 266px;
  }

  .value-tooltip-container .up-pointer {
    left: 212px;
  }

  .action-tooltip-container .up-pointer {
    left: 205px;
  }

  .tooltip-text {
    color: #666;
    font-size: 12px;
    font-weight: 400;
  }

  .overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    background: #000;
    opacity: 0.5;
    left: 0;
    top: 50px;
    z-index: 1000;
  }

  .white-overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    background: #fff;
    opacity: 0.9;
    left: 0;
    top: 50px;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .overlayText {
    color: #474747;
    font-size: 14px;
    font-weight: 500;
  }

  .player-substitution-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 312px;
    padding: 15px 14px;
    gap: 10px;
    position: fixed;
    top: calc(50% - 200px);
    left: calc(50% - 156px);
    z-index: 1000;
    background: #fff;
    border-radius: 12px;
  }

  .player-substitution-container .substitution-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }

  .substitution-header .close-btn {
    border: none;
    background: none;
    padding: unset;
  }

  .substitution-header .close-btn .close-icon {
    width: 16px;
    height: 16px;
    background: #fff;
  }

  .player-substitution-container .auto-substitute-player-btn {
    width: 100%;
    border-radius: 6px;
    background: #37C77A;
    border: none;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 0;
  }

  .player-substitution-container .or-text {
    color: #999;
    font-size: 11px;
    font-weight: 400;
  }

  .player-substitution-container .substituted-player-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .substituted-player-container .substitute-text {
    color: #999;
    font-size: 14px;
    font-weight: 400;
  }

  .substituted-player-container .substituted-player-name {
    color: #474747;
    font-size: 14px;
    font-weight: 600;
  }

  .player-substitution-container .substitute-players-list {
    background: #fff;
  }

  .substitute-players-list thead tr {
    background: #f5f5f5;
  }

  .substitute-players-list tbody tr {
    border-bottom: 1px solid #f5f5f5;
  }

  .substitute-players-list tr th {
    color: #999;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 9px;
  }

  .substitute-players-list .player-text-header,
  .substitute-players-list .points-text-header {
    text-align: start;
  }

  .player-substitution-container .substitute-players-table-container {
    height: 300px;
    overflow-y: scroll;
    border: 1px solid #2d2d2d;
    width: 100%;
  }

  .substitute-players-list thead {
    position: sticky;
    top: 0;
  }

  .substitute-players-list td {
    padding: 6px 10px;
    vertical-align: middle;
    white-space: pre-wrap;
  }

  .substitute-players-list td.substitute-player-details-holder {
    width: 150px;
  }

  .substitute-players-list .substitute-player-details-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 4px;
  }

  .substitute-players-list .substitute-team-position-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }

  .substitute-player-details-container .substitute-player-name {
    color: #2D2D2D;
    font-size: 12px;
    font-weight: 500;
  }

  .substitute-team-position-container .substitute-player-position {
    color: #2D2D2D;
    font-size: 11px;
    font-weight: 400;
  }

  .substitute-team-position-container .substitute-team,
  .substitute-team-position-container .player-details-separator {
    color: #999;
    font-size: 11px;
    font-weight: 400;
  }

  .substitute-players-list .substitute-player-salary,
  .substitute-players-list .substitute-player-points {
    color: #2D2D2D;
    font-size: 12px;
    font-weight: 400;
  }

  .substitute-players-list .right-arrow-icon {
    width: 16px;
    height: 16px;
    background: #fff;
  }

  .substitute-player-points .player-points-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 55px;
  }

  .matches-holder img {
    background: #fff;
    width: 33px;
    height: 22px;
  }

  .carousel-control-left-btn-holder img,
  .carousel-control-right-btn-holder img {
    background: #fff;
  }

  .players-list-table img,
  .lineups-table img {
    background: none;
    max-width: unset;
  }

  .players-list-table thead th,
  .lineups-table thead th {
    background: #f5f5f5;
  }

  .content-holder table tr:nth-of-type(odd) {
    background: #fff;
  }

  .lineups-buttons-container .right-scroll-button img,
  .lineups-buttons-container .left-scroll-button img {
    background: #fff;
  }

  .reset-confirmation-popup {
    width: 312px;
    background: #fff;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;
    position: fixed;
    top: calc(50% - 200px);
    left: calc(50% - 156px);
    z-index: 1000;
    padding: 16px 12px;
  }

  .reset-confirmation-popup .reset-header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .reset-confirmation-popup .confirmation-text-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .reset-confirmation-popup .confirmation-text-container .confirmation-text {
    color: #474747;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
  }

  .reset-confirmation-popup .confirmation-btns-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .confirmation-btns-container .cancel-reset {
    color: #666;
    border: 1px solid #f5f5f5;
    background: #fff;
  }

  .confirmation-btns-container .confirm-reset {
    color: #FFF;
    border: none;
    background: #37C77A;
  }

  .confirmation-btns-container .cancel-reset,
  .confirmation-btns-container .confirm-reset {
    font-size: 14px;
    font-weight: 500;
    display: flex;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
    width: 100%;
  }

  .reset-header .close-btn {
    background: #fff;
    border: none;
  }

  .download-csv-btn .website-icon {
    width: 18px;
    height: 18px;
  }

  .lineup-optimizer-container p.header-info-text {
    font-size: 14px !important;
    line-height: 32px;
    padding: 0px;
  }

  .captain-header {
    color: #999;
    font-size: 12px;
    font-weight: 500;
  }

  .captain-holder {
    text-align: center;
  }

  .captain-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lock-captain-btn,
  .unlock-captain-btn {
    border: none;
    background: transparent;
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lock-captain-btn img,
  .unlock-captain-btn img {
    opacity: 1;
    transition: opacity 0.2s;
  }

  .lock-captain-btn:disabled,
  .lock-player-btn:disabled,
  .remove-player-btn:disabled {
    cursor: not-allowed;
  }

  .lock-captain-btn:disabled img,
  .lock-player-btn:disabled img {
    opacity: 0.4;
  }

  .single-player-row.captain-selected {
    background: #FFF9E6 !important;
  }

  .single-player-row.captain-selected .captain-container .unlock-captain-btn img {
    filter: none;
  }

  .matches-container.hidden {
    display: none;
  }

  .lineup-optimizer-loading-overlay {
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
  }

  .lineup-optimizer-loading-overlay.hidden {
    display: none;
  }

  .lineup-optimizer-loading-overlay-text {
    color: #fff;
    font-weight: 500;
    font-size: 44px;
  }

  @keyframes blinker {
    from {
      opacity: 1.0;
    }

    50% {
      opacity: 0.3;
    }

    to {
      opacity: 1.0;
    }
  }

  @media (max-width: 768px) {
    .content-holder {
      width: 100%;
    }

    .content-holder .players-table-container table tr:nth-of-type(odd) {
      background: #fff;
    }

    .pfn-content-container {
      padding: 12px 0 !important;
      margin-bottom: 0px;
    }

    .lineup-optimizer-container {
      gap: 14px;
    }

    .filters-container .filters-holder {
      padding: 10px 0;
    }

    .websites-slates-container label {
      width: 90px;
    }

    .lineup-optimizer-container .players-lineups-container {
      padding: unset;
      border: unset;
      display: unset;
      gap: unset;
    }

    .players-lineups-container .players-pool {
      border: unset;
      border-radius: unset;
      width: unset;
      /* border-top: 1px solid #E9E9E9; */
      margin-top: 13px;
      border-bottom: 1px solid #e9e9e9;
    }

    .players-pool .player-pool-text-container {
      /* padding: unset; */
      padding: 0 16px;
      align-items: center;
      justify-content: space-between;
      margin-top: -11px;
    }

    .player-pool-text-container .player-pool-text {
      background: #fff;
      text-align: start;
      /* text-align: center; */
      width: 125px;
      font-size: 14px;
      font-weight: 600;
    }

    .players-lineups-container .feedback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: unset;
    }

    .players-lineups-container .feedback-parent-container .feedback-cta-container {
      margin: unset;
    }

    .players-pool .players-category-remaining-salary-container {
      margin-top: 13px;
      flex-direction: column;
      align-items: start;
      padding: unset;
      box-shadow: unset;
    }

    .players-category-remaining-salary-container .players-category-buttons-container {
      justify-content: space-between;
      gap: unset;
      width: 100%;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.05);
    }

    .players-category.lineups {
      opacity: 0.4;
    }

    .players-category-remaining-salary-container .remaining-salary-container {
      justify-content: space-between;
      width: 100%;
      gap: unset;
      padding: unset;
    }

    .remaining-salary-container .salary-holder,
    .remaining-salary-container .locked-count-holder {
      padding: 13px 16px;
      border-right: 1px solid #e9e9e9;
      border-bottom: 1px solid #e9e9e9;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2px;
    }

    .remaining-salary-container .player-search-container {
      padding: 4px 10px;
      border-bottom: 1px solid #e9e9e9;
    }

    button.build-lineups {
      width: 330px;
      background: #37C77A;
      padding: 10px 0;
      border-radius: 6px;
      border: none;
      color: #FFF;
      font-size: 14px;
      font-weight: 500;
      margin: 0 auto;
      position: sticky;
      bottom: 0px;
      left: calc(50% - 165px);
      z-index: 1000;
      margin-bottom: 15px;
    }

    .player-points-value-select-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .player-points-value-select-container button {
      border: none;
      background: #f5f5f5;
    }

    .single-player-row .single-row-player-details-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
      width: 150px;
    }

    .single-row-player-details-container .player-name {
      padding: unset;
    }

    .single-player-row .player-position {
      font-size: 11px;
      font-weight: 400;
      width: unset;
    }

    .single-player-row .team-name {
      font-size: 11px;
    }

    .single-player-row .player-details-separator {
      color: #999;
    }

    .single-player-row .single-row-player-details-holder {
      display: flex;
      gap: 4px;
      justify-content: center;
      align-items: center;
    }

    .players-list-table td:first-child {
      width: 150px;
    }

    .lineup-single-player-row .lineup-player-position {
      font-size: 11px;
      font-weight: 400;
      padding-left: unset;
    }

    .lineup-remove-player-btn {
      background: #fff;
      border: none;
    }

    button.position-filter {
      font-size: 12px;
      font-weight: 500;
    }

    .players-pool .player-positions-filters-search-container {
      padding: 4px 0;
      align-items: start;
      flex-direction: column;
    }

    .lineups-buttons-container .lineups-buttons-holder {
      gap: 8px;
      height: unset;
      padding: unset;
    }

    .lineups-buttons-holder .lineup-selection-btn {
      color: #474747;
      border-radius: 2px;
      border: 1px solid #E9E9E9;
      background: #F5F5F5;
      box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.07);
      padding: 8px 12px;
    }

    .lineups-buttons-holder .lineup-selection-btn.selected {
      border-bottom-color: transparent;
      background: #222;
      color: #fff;
    }

    .lineup-optimizer-container .players-table-container {
      height: 380px;
    }

    .refresh-lineup-download-csv-container {
      width: 100%;
      position: sticky;
      bottom: 0;
      align-self: center;
      z-index: 1000;
      background: #fff;
      padding: 0 12px;
    }

    .players-info-container-header .player-name-header {
      text-align: start;
      padding-left: 16px;
    }

    .lineup-teams-container .player-details-separator {
      color: #999;
    }

    .lineup-single-player-row td {
      padding: 3px 0;
    }

    .lineup-single-player-row td.lineup-player-details-holder {
      padding-left: 16px;
    }

    .player-positions-filters-search-container .points-salary-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 21px;
      padding: 10px 16px;
      border-bottom: 1px solid #e9e9e9;
      width: 100%;
    }

    .player-positions-filters-search-container .lineups-buttons-container {
      padding: 5px 16px;
      width: 100%;
    }

    .remaining-salary-holder .remaining-salary-amount,
    .remaining-points-container .remaining-points-count {
      color: #2d2d2d;
      font-size: 11px;
    }

    .player-positions-filters-search-container .players-positions-filters-container {
      padding: 0 16px;
      max-width: 100%;
    }

    .count-build-container .lineup-count-selection-text {
      font-size: 12px;
    }

    .players-positions-filters-holder {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 8px;
      overflow-x: scroll;
    }

    .players-positions-filters-holder::-webkit-scrollbar {
      display: none;
    }

    .refresh-lineup-download-csv-container .reset-lineup-btn,
    .refresh-lineup-download-csv-container .download-csv-btn {
      width: unset;
      border-radius: 25px;
      border: 1px solid #E9E9E9;
      padding: 10px;
      font-size: 12px;
    }

    .refresh-lineup-download-csv-container .download-csv-btn {
      width: 112px;
    }

    .refresh-lineup-download-csv-container .reset-lineup-btn {
      width: 31%;
    }

    .refresh-lineup-download-csv-container .refresh-lineup-btn {
      width: 33%;
    }

    .players-lineups-container .players-pool {
      height: 505px;
    }

    img.sort-descending-icon,
    img.sort-ascending-icon,
    .points-value-sort-descending-btn img,
    .points-value-sort-ascending-btn img .lineup-salary-sort-ascending-btn img,
    .lineup-salary-sort-descending-btn img {
      width: 7px;
      height: 7px;
    }

    img.lineup-remove-icon {
      width: 16px;
      height: 16px;
    }

    .pfn-content-container .top-text-content-container {
      padding: 0 16px;
      height: 116px;
      overflow: hidden;
      position: relative;
      z-index: 2000;
      background: #fff;
    }

    .pfn-content-container .top-text-content-container .read-more-content-btn,
    .pfn-content-container .top-text-content-container .read-less-content-btn {
      color: #0B65F0;
      padding: 0;
      border: unset;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      right: 20px;
      font-size: 16px;
      font-weight: 400;
      width: 88px;
    }

    .top-text-content-container .pfn-text-content-container {
      margin-bottom: 0;
    }

    .top-text-content-container .pfn-text-content-container p {
      font-size: 15px;
    }

    .lineup-optimizer-container p.header-info-text {
      font-size: 13px !important;
      line-height: 20px;
      padding: 0 16px;
    }
  }

  @media (max-width: 300px) {
    .player-search-container .player-search-input {
      width: 102px;
    }

    .remaining-salary-container .salary-holder,
    .remaining-salary-container .locked-count-holder {
      padding: 12px 5px;
    }

    button.build-lineups {
      width: 230px;
      left: calc(50% - 115px);
    }

    .player-substitution-container {
      width: 272px;
      left: calc(50% - 136px);
    }
  }
</style>
