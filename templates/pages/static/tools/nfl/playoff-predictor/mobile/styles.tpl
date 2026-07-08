<style>
@media (max-width: 950px) {
    .playoff-predictor-tool-wrapper .sticky-bottom-cta-wrapper {
        left: 0;
        background: #fff;
        position: fixed;
        bottom: 0px;
        width: 100%;
        box-shadow: 0px 4px 14px 0px #54575C1A;
        padding: 10px;
        z-index: 100;
    }

    .playoff-predictor-tool-wrapper .simulator-standings-page-toggle-wrapper,
    .playoff-predictor-tool-wrapper .simulator-page {
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
    }

    .playoff-predictor-tool-wrapper .week-matches-wrapper {
        width: 100%;
        border-bottom: none;
    }

    .playoff-predictor-tool-wrapper .week-matches-container {
        height: 430px;
        border: 1px solid #0050A0;
    }

    .playoff-predictor-tool-wrapper .playoff-participants-container {
        height: auto;
    }

    .playoff-participants-tab-content .participants-logo-header {
        display: flex;
        width: 100%;
    }

    .playoff-participants-tab-content .participants-afc-logo-header,
    .playoff-participants-tab-content .participants-nfc-logo-header {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px 0;
    }

    .playoff-participants-tab-content .participants-afc-logo-header {
        background-color: #CE1127;
    }

    .playoff-participants-tab-content .participants-nfc-logo-header {
        background-color: #003369;
    }

    .playoff-participants-tab-content .participants-afc-logo-header img,
    .playoff-participants-tab-content .participants-nfc-logo-header img {
        height: 30px;
        object-fit: contain;
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
        margin-top: 8px;
    }

    .playoff-participants-standings-container .nfc-conference-standings-container,
    .playoff-participants-standings-container .afc-conference-standings-container {
        height: auto;
    }

    .week-matches-wrapper .week-carousel {
        height: 45px;
    }

    .simulation-ctas-container {
        justify-content: space-between;
        background-color: #fff;
        gap: 8px;
    }

    .simulation-ctas-container > button {
        flex: 1;
        text-align: center;
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
        font-size: 15px;
    }

    .standings-page .combined-ranking-table-header,
    .standings-page .standings-combined-ranking-container {
        font-size: 12px;
    }

    .standings-page .division-standings th.combined-ranking-table-header,
    .standings-page .conference-standings th.combined-ranking-table-header {
        min-width: 128px;
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
        background-color: #0050A0;
        color: #fff;
        border-collapse: collapse;
        border-bottom: 2px solid #0050A0;
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
        padding: 8px 4px;
        font-size: 14px;
        color: #0050A0;
        font-weight: 500;
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
        color: #0050A0;
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
        font-size: 16px;
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
        background-color: #0050A0;
        color: #FFF;
    }

    .standings-page-toggle-wrapper {
        display: flex;
        justify-content: left;
        gap: 8px;
    }

    .standings-page-toggle-wrapper button {
        border: unset;
        background-color: #f5f6f8;
        color: #666666;
        padding: 10px;
        border-radius: 28px;
        font-size: 16px;
        border: 1px solid #E9E9E9;
        box-shadow: 1px 1px 4px 0px #00000012;
        cursor: pointer;
    }

    .standings-page-toggle-wrapper .selected {
        background-color: #FFD166;
        color: #0050A0;
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
        width: auto;
        flex-shrink: 0;
    }

    .week-matches-wrapper .away-team-win-lose-holder,
    .week-matches-wrapper .home-team-win-lose-holder {
        font-size: 11px;
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
        background-color: #0050A0;
        color: #fff;

    }

    .playoff-predictor-tool-wrapper .reverse-content {
        flex-direction: column-reverse;
    }

    .playoff-section-tab-toggle {
        display: flex;
        gap: 8px;
        justify-content: center;
        padding: 10px 0;
    }

    .playoff-section-tab-toggle .playoff-tab-btn {
        border: 1px solid #E9E9E9;
        background-color: #f5f6f8;
        color: #666666;
        padding: 8px 16px;
        border-radius: 28px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
    }

    .playoff-section-tab-toggle .playoff-tab-btn.selected {
        background-color: #FFD166;
        color: #0050A0;
        border-color: #FFD166;
        font-weight: 500;
    }

    .playoff-bracket-tab-content {
        padding: 8px;
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
        font-weight: 500;
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

    .draft-order-table td,
    .draft-order-table th {
        width: 15%;
    }

    .draft-order-page .draft-order-page-header {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .draft-order-page .draft-order-page-header-text {
        font-size: 14px;
        font-weight: 500;
        text-align: left;
        color: #0050A0;
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
        color: #0050A0;
        font-size: 14px;
        font-weight: 500;
        padding: 10px;
        white-space: nowrap;
        margin: unset;
        line-height: unset;
    }

    .nfl-playoff-predictor .playoff-predictor-tool-wrapper .sticky-bottom-cta-wrapper {
        z-index: 2000;
    }

    @media (min-width: 601px) {
        .playoff-predictor-tool-wrapper .sticky-bottom-cta-wrapper {
            bottom: 92px;
        }

        .week-matches-wrapper .away-team-container,
        .week-matches-wrapper .home-team-container {
            max-width: 120px;
        }

        .week-matches-wrapper .week-matches-container {
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }

        .week-matches-wrapper .week-matches-container .match-container {
            justify-content: center;
            gap: 4px;
        }

        .week-matches-wrapper .score-input-container {
            width: auto;
            gap: 4px;
        }
    }

    .nfl-playoff-predictor .tag-page-bg {
        margin-bottom: 16px;
    }

    .playoff-predictor-tool-wrapper .conference-standings th,
    .playoff-predictor-tool-wrapper .division-standings th,
    .playoff-predictor-tool-wrapper .draft-order-table th {
        font-weight: 500;
    }

    .nfl-playoff-predictor table::-webkit-scrollbar {
        width: 2px;
        height: 2px;
    }

    .playoff-predictor-tool-wrapper .playoff-participants-standings-container .division-name {
        font-size: 12px;
    }

    .playoff-predictor-tool-wrapper .playoff-participants-standings-container .division-header-container,
    .playoff-predictor-tool-wrapper .playoff-participants-standings-container .rank-header-spacer {
        padding-bottom: 16px;
    }

    .playoff-participants-standings-container .stadings-logo-header-container {
        display: none !important;
    }

    .playoff-participants-standings-container .standings-conference-tab-toggle {
        display: flex;
        gap: 8px;
        justify-content: center;
        padding: 10px 0;
    }

    .playoff-participants-standings-container .nfc-standings-container.hidden,
    .playoff-participants-standings-container .afc-standings-container.hidden {
        display: none !important;
    }

    .playoff-participants-standings-container .afc-standings-container,
    .playoff-participants-standings-container .nfc-standings-container {
        width: auto;
        flex: 1;
    }

    .playoff-participants-standings-container .standings-container {
        flex-wrap: wrap;
    }

    .standings-conference-bar {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px 0;
    }

    .standings-conference-bar img {
        height: 30px;
        object-fit: contain;
    }

    .standings-conference-bar.hidden {
        display: none !important;
    }

    .afc-conference-bar {
        background-color: #CE1127;
    }

    .nfc-conference-bar {
        background-color: #003369;
    }

    .nfl-playoff-predictor .playoff-participants-standings-container .division-team-container {
        padding: 8px 0px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        border-radius: 4px;
    }

    .nfl-playoff-predictor .playoff-bracket-tab-content {
        padding: 8px 0;
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

    .predict-playoff-games-popup-container .playoff-games-popup-footer {
        padding-bottom: 8px;
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
}
</style>
