<style>
  ul {
    list-style: none;
    padding-left: 0px;
  }

  ul li {
    position: relative;
    padding-left: 20px;
  }

  ul li::before {
    content: '•';
    color: #666666;
    font-size: 20px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .pfn-footer ul li {
    padding-left: 0px;
  }

  .pfn-footer ul li::before {
    content: unset;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif;
  }

  .step-connector .chevron-icon {
    position: absolute;
    right: 0;
    transform: translate(calc(50% - 2px), calc(-50% + 1px));
    height: 16px;
    width: 16px;
    color: #e5e7eb;
  }

  .step-connector.completed .chevron-icon {
    color: #2563eb;
  }

  #screen1 {
    min-height: 860px;
  }

  .screen {
    display: none;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .screen .header {
    display: flex;
    justify-content: space-between;
    padding: 8px 20px;
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }

  .screen#screen2 .header,
  .screen#screen3 .header,
  .screen#screen4 .header,
  .screen#screen5 .header {
    padding: 0;
    padding-left: 20px;
    align-items: center;
  }

  .screen .header h2 {
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
    color: #172B4D;
    text-transform: uppercase;
  }

  .screen .header .team-logo-container {
    background: linear-gradient(90deg, rgba(174, 181, 193, 0) 0%, #AEB5C1 100%);
    align-self: stretch;
    padding: 5px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .screen .header .team-logo-container span {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #2D2D2D;
  }

  .screen .header .team-logo-container img {
    width: 26px;
    height: 26px;
    object-fit: contain;
  }

  .screen .footer {
    padding: 20px;
    background: #F6F7FF;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .screen .footer span {
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
    color: #666666;
    font-style: italic;
  }

  .screen .footer span.light {
    font-weight: 400;
  }

  .screen .team-grid {
    background: #F6F7FF;
  }

  .active {
    display: block;
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 20px;
    padding: 20px;
  }

  .team-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    color: #2D2D2D;
  }

  .team-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .team-card.selected {
    background: #EEF2F7;
    border: 1px solid #0857C3;
    color: #0857C3;
  }

  .team-card img {
    width: 46px;
    height: 46px;
    object-fit: contain;
  }

  .team-card h3 {
    font-size: 16px;
    line-height: 18px;
    font-weight: 500;
  }

  .table-container {
    background: #F6F7FF;
    padding: 16px 24px 0 24px;
  }

  .table-wrapper {
    max-height: 352px;
    overflow-y: scroll;
    border-radius: 0 0 8px 8px;
  }

  .table-wrapper:has(#availableList) {
    max-height: 300px;
  }

  .table-wrapper.mobile {
    display: none;
  }

  .custom-scrollbar {
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: thin;
    scrollbar-color: #E0E0E0 transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #E0E0E0;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .no-scrollbar {
    overflow: hidden;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .summary-table-wrapper {
    max-height: 352px;
    overflow-y: scroll;
  }

  table {
    width: 100%;
    border-collapse: separate;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: none;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  tr {
    background: #FFFFFF;
  }

  thead tr {
    background: none;
  }

  thead tr th:first-child {
    border-top-left-radius: 6px;
  }

  thead tr th:last-child {
    border-top-right-radius: 6px;
  }

  tbody tr:last-child td:first-child {
    border-bottom-left-radius: 6px;
    /* Sets bottom-left corner radius for the first <td> in the last row */
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: 6px;
    /* Sets bottom-right corner radius for the last <td> in the last row */
  }

  th,
  td {
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th.center,
  td.center,
  .summary-table th.center,
  .summary-table td.center {
    text-align: center;
  }

  td {
    font-size: 12px;
    line-height: 20px;
    color: #2D2D2D;
    font-weight: 400;
    padding: 8px 15px;
    white-space: nowrap;
  }

  td.status,
  td.cap,
  td.years {
    font-weight: 600;
  }

  td.amount,
  td.position,
  td.team {
    font-weight: 500;
  }

  th {
    background: #F5F5F5;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: #999999;
    padding: 8px 15px;
    vertical-align: middle;
  }

  th span {
    display: flex;
    height: 100%;
    align-items: center;
  }

  #availableList .player-row th.player,
  #availableList .player-row td.player {
    width: 44%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th.pos,
  td.pos {
    width: 82px;
    max-width: 82px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
    margin-right: 4px;
    background: none;
  }

  .button.button-undo,
  .button.button-cut {
    padding: 8px 12px;
  }

  .button img,
  .tag-button img,
  .franchise-button img {
    width: 20px;
    height: 20px;
    position: relative;
    top: 4px;
  }

  .button:hover {
    opacity: 0.9;
  }

  .navigation {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  .modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10001;
  }

  .modal {
    background: white;
    padding: 24px;
    border-radius: 8px;
    width: 90%;
    max-width: 900px;
    position: relative;
    max-height: min(70vh, calc(100vh - 150px));
    overflow-y: scroll;
  }

  #responseModal .modal {
    max-width: 340px;
    width: 100%;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .modal-overlay#restructureModal .modal,
  .modal-overlay#instructionsModal .modal {
    padding: 0;
  }

  .modal-overlay#restructureModal .modal-header,
  .modal-overlay#instructionsModal .modal-header {
    background: #FFFFFF;
    border-bottom: 1px solid #E9E9E9;
    box-shadow: -1px 4px 20px 0px #0000000A;
    padding: 16px 20px;
  }

  .modal-overlay#restructureModal .modal-content,
  .modal-overlay#instructionsModal .modal-content {
    padding: 0px 20px 16px 20px;
  }

  .modal-overlay#instructionsModal h3 {
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #2D2D2D;
  }

  .modal-overlay#instructionsModal p {
    font-size: 13px;
    font-weight: 400;
    line-height: 23px;
    color: #2D2D2D;
    margin-bottom: 16px;
  }

  .modal-overlay#instructionsModal ul {
    margin-bottom: 20px;
  }

  .modal-overlay#instructionsModal ul li {
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 8px;
    color: #2D2D2D;
  }

  .desired-contract-info {
    background: rgba(55, 199, 122, 0.13);
    border: 1px solid #E2E6EC;
    border-radius: 6px;
    padding: 14px 16px;
    margin-bottom: 20px;
  }

  .desired-contract-title {
    font-size: 14px;
    font-weight: 600;
    color: #2d2d2d;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .desired-contract-info-icon {
    position: relative;
    font-size: 15px;
    color: #888888;
    cursor: pointer;
  }

  .desired-contract-tooltip {
    display: none;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + 6px);
    background: #2D2D2D;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    padding: 8px 12px;
    border-radius: 6px;
    white-space: normal;
    width: 220px;
    z-index: 10;
    pointer-events: none;
  }

  .desired-contract-info-icon.show-tooltip .desired-contract-tooltip {
    display: block;
  }

  .desired-contract-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  .desired-contract-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .desired-contract-label {
    font-size: 11px;
    font-weight: 500;
    color: #888888;
  }

  .desired-contract-value {
    font-size: 14px;
    font-weight: 600;
    color: #2D2D2D;
  }

  .modal-overlay#restructureModal .continue-btn {
    width: 80%;
    max-width: 420px;
  }

  .modal-title {
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
    margin: 0;
    color: #666666;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 4px;
    color: #666;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .offer-button {
    width: 100%;
    padding: 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .offer-button:hover {
    background: #45a049;
  }

  .response-modal {
    text-align: center;
    padding: 32px;
  }

  .response-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 16px;
  }

  .response-message {
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #474747;
  }

  .response-button {
    padding: 12px 24px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }

  .summary-table {
    width: 100%;
    margin-bottom: 20px;
  }

  .summary-table th {
    background: #f8f9fa;
    padding: 12px;
    text-align: left;
  }

  .summary-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  .summary-row {
    background: #f8fff8;
  }

  .team-circle {
    width: 24px;
    height: 24px;
    border: 2px solid #ddd;
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  .tag-button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 4px;
    font-size: 0.9rem;
  }

  .resign-button {
    background: none;
    color: white;
  }

  .sign-btn {
    padding: 4px 26px;
    cursor: pointer;
    border-radius: 6px;
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
    color: #FFFFFF;
    background: #37C77A;
    border: none;
  }

  .transition-button {
    background: none;
    color: white;
  }

  .franchise-button {
    background: none;
    color: white;
  }

  .cap-summary {
    display: grid;
    grid-template-columns: 1fr 1fr 1.2fr 1fr 1fr 1fr;
    background: #F5F5F5;
    padding: 0px 20px;
    border-bottom: 1px solid #E0E0E0;
  }

  #screen4 .cap-summary {
    grid-template-columns: 1fr 1fr 1fr;
  }

  #screen4 .cap-summary .cap-info {
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    color: #666666;
  }

  #screen4 .cap-summary .cap-info #capSpaceDisplay {
    font-weight: 700;
    font-size: 16px;
    line-height: 18px;
    color: #202224;
  }

  .cap-item {
    background: #F5F5F5;
    padding: 15px;
    border-radius: 0;
    border-right: 1px solid #E0E0E0;
  }

  .cap-item:last-child {
    border-right: none;
  }

  .cap-item-label {
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    color: #666666;
    margin-bottom: 4px;
  }

  .cap-item-value {
    font-size: 16px;
    line-height: 18px;
    font-weight: 700;
    color: #202224;
  }

  .renewal-summary-modal {
    max-width: 800px !important;
  }

  .renewal-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .small-text {
    font-size: 12px;
  }

  .renewal-table th {
    background: #f8f9fa;
    padding: 12px;
    text-align: left;
    color: #666;
    font-weight: 500;
  }

  .renewal-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  .renewal-table tr:nth-child(even) {
    background-color: #f8fff8;
  }

  .team-circle {
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }

  .continue-button {
    width: 100%;
    padding: 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 24px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 20px;
  }

  .free-agency-header {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 20px;
    padding: 20px;
    background: #fff;
    margin-bottom: 20px;
  }

  .cap-info {
    font-size: 1.25rem;
    font-weight: 500;
  }

  .team-needs {
    font-size: 1.25rem;
  }

  .instructions-link {
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: right;
    color: #202224;
    text-decoration: none;
    font-weight: 500;
    align-self: center;
    font-size: 14px;
    line-height: 16px;
  }

  .roster-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    padding: 20px;
    background: #F6F7FF;
  }

  .roster-panel {
    background: white;
    border-radius: 8px;
    border: 1px solid #000;
    max-height: 450px;
    overflow: hidden;
  }

  .roster-title {
    padding: 16px;
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    border-bottom: 1px solid #000000;
    text-align: center;
  }

  .player-search-wrapper {
    padding: 8px 16px;
    border-bottom: 1px solid #eee;
  }

  .player-search-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
  }

  .player-search-input:focus {
    border-color: #999;
  }

  .position-filters {
    border-bottom: 1px solid #eee;
    width: 100%;
    position: relative;
  }

  .filters-container {
    padding: 12px 25px;
    gap: 12px;
    display: flex;
    overflow-x: auto;
    width: 100%;
    max-width: 450px;
  }

  .position-filters .move-left-btn {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border: 1px solid #DFDFDF;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    border-radius: 0 25px 25px 0;
    background: #FFFFFF;
  }

  .position-filters .move-right-btn {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    border: 1px solid #DFDFDF;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    border-radius: 25px 0 0 25px;
    background: #FFFFFF;
  }

  .position-filter {
    padding: 2px 0px;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    color: #2D2D2D;
    font-size: 12px;
    line-height: 14px;
    font-weight: 600;
  }

  .position-filter.active {
    color: #0857C3;
  }

  .position-filter.active span {
    position: relative;
    top: 14px;
    display: block;
    width: 100%;
    height: 2px;
    background: #0857C3;
  }

  .player-list {
    padding: 12px;
  }

  .player-row {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  #screen4 table {
    margin-top: 0;
  }

  .offer-button {
    background: #4CAF50;
    color: white;
    padding: 6px 16px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }

  .complete-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 16px 32px;
    border: none;
    border-radius: 30px;
    font-size: 1.1rem;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .results-container {
    background: white;
    border-radius: 8px;
    border: 1px solid #000000;
    margin: 20px;
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 16px;
    border-bottom: 1px solid #000000;
  }

  .results-title {
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    color: #2D2D2D;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
  }

  .download-button,
  .share-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    border: 1px solid #202224;
    border-radius: 99px;
    background: white;
    cursor: pointer;
    font-size: 12px;
    line-height: 18px;
  }

  .results-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .player-number {
    color: #666;
    width: 40px;
  }



  .result-container {
    display: flex;
    flex-direction: row;
    max-height: 352px;
    /* Set the maximum height for the entire container */
    overflow-y: auto;
    /* Add vertical scrolling to the entire container */
    overflow-x: auto;
  }

  .result-container .table-wrapper {
    min-width: 50%;
    flex-shrink: 0;
    flex-grow: 0;
    max-height: unset;
    align-self: start;
  }

  .result-container .table-wrapper:first-of-type {
    border-right: 1px solid #E4E6EE;
  }

  .results-row {
    padding: 12px 20px;
    border-bottom: 1px solid #eee;
  }

  .results-row:nth-child(even) {
    background: #f8f9fa;
  }

  .footer-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding: 20px;
  }

  .pfn-button {
    padding: 10px 38px;
    border-radius: 24px;
    /* border: 1px solid #172B4D;
    background: #FFFFFF;
    color: #172B4D; */
    border: 1px solid #37C77A;
    background: #37C77A;
    color: #FFFFFF;
    font-weight: 500;
    cursor: pointer;
    font-size: 16px;
    line-height: 18px;
    text-decoration: none;
  }

  .restart-button {
    padding: 10px 38px;
    border-radius: 24px;
    border: 1px solid #37C77A;
    background: #37C77A;
    color: #FFFFFF;
    font-weight: 700;
    cursor: pointer;
    font-size: 16px;
    line-height: 18px;
  }

  tr.player-cut {
    background: #fff3f1;
  }

  tr.player-restructured {
    background: #d9e8ff;
  }

  tr.player-own {
    background-color: #f6fff2;
  }

  .steps-container {
    display: flex;
    align-items: center;
    max-width: 1000px;
    margin: -10px 0;
    font-family: Arial, sans-serif;
    background: #fff;
    height: 100px;
  }

  .title-section {
    background-color: #1a2644;
    color: white;
    padding: 20px;
    width: 200px;
    height: 80px;
    display: flex;
    align-items: center;
    position: relative;
    clip-path: polygon(0 0, 100% 0, 91% 100%, 0 100%);
    justify-content: center;
  }

  .title-text {
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
  }

  .steps-section {
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding: 0 20px;
    background-color: #fff;
  }

  .step {
    display: flex;
    align-items: center;
    flex: 1;
    flex-direction: column;
    position: relative;
  }

  .step .underline {
    position: absolute;
    bottom: -9px;
    height: 3px;
    width: 100%;
    background: none;
    display: none;
  }

  .step.current .underline {
    background: #0857C3;
  }

  .step.first {
    flex: 0.9;
  }

  .step.second {
    flex: 2;
  }

  .step.third {
    flex: 1.2;
  }

  .step.fourth {
    flex: 1.6;
  }

  .step-circle {
    width: 30px;
    min-width: 30px;
    height: 30px;
    font-size: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin-bottom: 3px;
  }

  .step.completed .step-circle {
    border: 2px solid #0857C3;
    background-color: #0857C3;
    color: white;
  }

  .step.current .step-circle {
    border: 2px solid #0857C3;
    color: #0857C3;
  }

  .step.current .step-text,
  .step.completed .step-text {
    color: #0857C3;
  }

  .step.pending .step-circle {
    border: 2px solid #e5e7eb;
    background-color: #e5e7eb;
    color: #6b7280;
  }

  .step-text {
    display: flex;
    flex-direction: column;
    color: #1f2937;
  }

  .step-subtitle {
    font-size: 10px;
    line-height: 15px;
    font-weight: 500;
    text-align: center;
  }

  .step-connector {
    height: 2px;
    min-width: 20px;
    flex: 0.6;
    margin: 0 10px;
    background-color: #e5e7eb;
    transition: background-color 0.3s ease;
    position: relative;
  }

  .step-connector.completed {
    background-color: #2563eb;
  }

  .all-screens-container {
    width: 100%;
    /* max-width: 1000px; */
    /* margin: 0 auto; */
    overflow: hidden;
    background: #fff;
    border-radius: 0 0 12px 12px;
    /*border: 1px solid #E9E9E9; */
  }

  .teamNeed {
    font-weight: normal;
    font-size: 14px;
    background: #e7f0fe;
    padding: 2px 8px;
    border-radius: 10px;
    display: inline-block;
    margin: 0 3px;
    color: #1b73e8;
  }

  .continue-btn {
    padding: 10px 50px;
    background: #37C77A;
    border: none;
    border-radius: 74px;
    color: #FFFFFF;
    font-size: 16px;
    line-height: 18px;
    font-weight: 700;
    display: block;
  }

  .continue-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal .continue-btn {
    margin: 16px auto;
  }

  .roster-tables-tabs {
    display: none;
  }

  .continue-btn.free-agency {
    margin-left: auto;
  }

  .instructions-link.mobile {
    display: none;
  }

  .team-data-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    top: 4px;
    gap: 4px;
  }

  .team-data-container img {
    height: 20px;
    width: 20px;
    object-fit: contain;
  }

  #rosterList td.pos,
  #rosterList td.status,
  #rosterList td.cap {
    font-weight: 400;
  }

  #rosterList td.status,
  #rosterList td.pos,
  #screen4 th.pos,
  #screen4 th.status {
    width: 100px;
  }

  #rosterList td.pos,
  #availableList td.pos,
  #screen4 th.pos {
    text-align: center;
  }

  #rosterList td.player {
    font-weight: 600;
  }

  #rosterList td,
  #availableList td {
    padding: 8px;
  }

  #offseason-banner-container {
    width: 100%;
    min-height: 250px;
  }

  @media (max-width: 768px) {
    #ad-banner-container {
      width: 100%;
      background-color: #ededed;
      position: fixed;
      height: 105px;
      top: 76px;
      z-index: 10000;
    }

    .screen .header,
    .screen#screen3 .header,
    .screen#screen4 .header,
    .screen#screen5 .header {
      padding-left: 10px;
      position: relative;
      z-index: 1;
    }

    .screen#screen2 .header {
      padding-left: 4px;
    }

    .screen .header h2 {
      font-size: 12px;
      line-height: 14px;
    }

    .title-section {
      display: none;
    }

    .all-screens-container {
      width: 100%;
      padding: 0;
      border: none;
      z-index: 2;
    }

    .screen .team-grid {
      min-height: 400px;
    }

    .screen .team-grid,
    .screen .footer,
    .table-container {
      background: #FFFFFF;
    }

    .table-container {
      padding: 16px 0 0 0;
    }

    .team-grid {
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 10px;
      padding: 12px;
    }

    .screen .footer {
      padding: 8px;
    }

    .team-card {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;

    }

    .steps-container {
      overflow-x: scroll;
    }

    .steps-section {
      padding: 0px 12px;
    }

    .step.first,
    .step.second,
    .step.third,
    .step.fourth,
    .step.fifth {
      flex: initial;
      flex-shrink: 0;
    }

    .cap-summary {
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto auto;
      padding: 0px;
    }

    .screen .footer {
      display: flex;
      flex-direction: column-reverse;
      justify-content: center;
      gap: 12px;
    }

    th.sticky-cut,
    td.sticky-cut {
      position: sticky;
      right: 60px;
      z-index: 1;
      border-left: 1px solid #E0E0E0;
      margin-left: -1px;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    }

    th.amount,
    td.amount {
      width: 100px;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    th.sticky-2,
    td.sticky-2 {
      position: sticky;
      right: 60px;
      z-index: 1;
    }

    th.sticky-1,
    td.sticky-1 {
      position: sticky;
      right: 120px;
      z-index: 1;
      border-left: 1px solid #E0E0E0;
      margin-left: -1px;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    }

    td.sticky-cut,
    td.sticky-restructure,
    td.sticky-1,
    td.sticky-2,
    td.sticky-3 {
      background: #FFFFFF;
    }

    th.sticky-restructure,
    td.sticky-restructure,
    th.sticky-3,
    td.sticky-3 {
      position: sticky;
      right: 0;
      z-index: 2;
    }

    th.sticky-cut,
    th.sticky-restructure,
    th.sticky-1,
    th.sticky-2,
    th.sticky-3 {
      top: 0;
    }

    th,
    td {
      padding: 4px;
    }

    .summary-table td,
    .summary-table th {
      padding: 4px 8px;
    }

    td.name {
      white-space: nowrap;
    }

    .modal-overlay {
      top: 0;
      align-items: flex-end;
    }

    .modal {
      width: 100%;
    }

    .team-card img {
      width: 28px;
      height: 28px;
    }

    .team-card h3 {
      font-size: 12px;
      line-height: 14px;
    }

    #responseModal .modal {
      max-width: 900px;
    }

    .instructions-link {
      display: none;
    }

    #screen4 .cap-summary {
      grid-template-columns: 1fr 1fr;
    }

    .roster-title {
      display: none;
    }

    .roster-container {
      display: block;
    }

    .position-filters {
      justify-content: unset;
    }

    .roster-panel.m-hidden {
      display: none;
    }

    .roster-tables-tabs {
      display: flex;
    }

    .roster-tables-tabs .tab {
      flex-grow: 1;
      padding: 8px;
      border-bottom: 3px solid transparent;
      display: flex;
      justify-content: center;
      color: #666666;
      font-size: 12px;
      line-height: 14px;
      font-weight: 500;
      width: 100%;
    }

    .roster-tables-tabs .tab.active {
      border-bottom: 3px solid #0857C3;
      color: #0857C3;
    }

    .continue-btn.free-agency {
      margin-left: 0;
      margin: 0 auto;
    }

    .roster-container {
      background: #FFFFFF;
    }

    .instructions-link.mobile {
      font-size: 14px;
      line-height: 16px;
      font-weight: 500;
      color: 500;
      text-decoration: underline;
      background: none;
      display: block;
      margin: 0 auto;
    }

    .download-button,
    .share-button {
      border: none;
      padding: 0;
    }

    .table-wrapper.mobile {
      display: block;
    }

    .footer-buttons {
      justify-content: unset;
    }

    .footer-buttons button,
    .footer-buttons a {
      flex-grow: 1;
      width: 100%;
      font-size: 14px;
    }

    .pfn-button,
    .restart-button {
      padding: 10px 24px;
    }

    .step .underline {
      display: block;
    }

    .cap-item-label {
      font-size: 10px;
      line-height: 12px;
    }

    .cap-item-value {
      font-size: 14px;
      line-height: 16px;
    }

    .cap-item {
      padding: 8px;
    }

    .steps-container {
      position: relative;
      z-index: 1;
    }

    .modal {
      padding: 0px;
    }

    .modal .modal-header {
      padding: 24px;
      padding-bottom: 0px;
      padding-left: 8px;
      margin-bottom: 12px;
    }

    .roster-container {
      padding: 8px;
    }

    .modal-overlay#instructionsModal .modal-header {
      padding: 12px 8px 0px 8px;
    }

    #instructionsModal .modal-content {
      height: 423px;
      overflow-y: scroll;
    }

    .instructions-link.mobile {
      margin-bottom: 8px;
    }

    .results-header {
      padding: 5px 8px;
    }

    thead tr th:first-child {
      border-top-left-radius: 0px;
    }

    thead tr th:last-child {
      border-top-right-radius: 0px;
    }

    #availableList .player-row td.player {
      width: 48%;
    }

    .roster-panel {
      max-height: 399px;
    }
  }
</style>
