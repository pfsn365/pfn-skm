<style>
    .playoff-participants-standings-container .stadings-logo-header-container {
        display: flex;
        width: 100%;
    }

    .playoff-participants-standings-container .afc-logo-header-container,
    .playoff-participants-standings-container .nfc-logo-header-container {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px 0;
    }

    .playoff-participants-standings-container .afc-logo-header-container {
        background-color: #CE1127;
    }

    .playoff-participants-standings-container .nfc-logo-header-container {
        background-color: #003369;
    }

    .playoff-participants-standings-container .nfc-logo-header-container .nfc-header-logo,
    .playoff-participants-standings-container .afc-logo-header-container .afc-header-logo {
        height: 30px;
        object-fit: contain;
    }

    .playoff-participants-standings-container .standings-container {
        display: flex;
    }

    .playoff-participants-standings-container .afc-standings-container,
    .playoff-participants-standings-container .nfc-standings-container {
        width: 47%;
    }

    .playoff-participants-standings-container .rank-container {
        width: 6%;
        background-color: #f5f5f5;
        text-align: center;
        color: #666666;
        display: flex;
        flex-direction: column;
        padding: 4px;
    }

    .playoff-participants-standings-container .rank-header-spacer {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        margin-bottom: 8px;
    }

    .playoff-participants-standings-container .rank-text-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 4px;
        padding: 0 0 4px 0;
    }

    .playoff-participants-standings-container .rank-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .playoff-participants-standings-container .rank-container .rank-text {
        padding: unset;
        width: unset;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0.01em;
        text-align: center;
        color: #666666;
    }

    .playoff-participants-standings-container .division-header-container {
        display: flex;
        width: 100%;
        padding: 4px;
        margin-bottom: 8px;
    }

    .playoff-participants-standings-container .division-name {
        font-size: 16px;
        font-weight: 500;
        padding: unset;
        color: #666666;
        width: 25%;
        text-align: center;
    }

    .playoff-participants-standings-container .nfc-conference-standings-container,
    .playoff-participants-standings-container .afc-conference-standings-container {
        display: flex;
        width: 100%;
        padding: 4px;
        padding-top: 0;
        gap: 4px;
    }

    .nfc-conference-standings-container .division-standings-container,
    .afc-conference-standings-container .division-standings-container {
        width: 25%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .playoff-participants-standings-container .division-team-container {
        border: 1px solid #e9e9e9;
        padding: 4px 0px;
        border-collapse: collapse;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 4px;
    }

    .playoff-participants-standings-container .division-team-container>img {
        height: 20px;
        width: 30px;
    }

    .playoff-participants-standings-container .division-team-win-lose-text {
        padding: unset;
        font-size: 15px;
        font-weight: 400;
        text-align: center;
        color: #666666;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
    }

    .playoff-participants-standings-container .standings-conf-tab-btn {
        border: 1px solid #E9E9E9;
        background-color: #f5f6f8;
        color: #666666;
        padding: 8px 16px;
        border-radius: 28px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
    }

    .playoff-participants-standings-container .standings-conf-tab-btn.selected {
        background-color: #FFD166;
        color: #0050A0;
        border-color: #FFD166;
        font-weight: 500;
    }

    @media (min-width: 951px) {
        .playoff-participants-standings-container .standings-conference-tab-toggle {
            display: none;
        }

        .playoff-participants-standings-container .afc-standings-container.hidden,
        .playoff-participants-standings-container .nfc-standings-container.hidden {
            display: block !important;
        }

        .standings-conference-bar {
            display: none !important;
        }
    }
</style>

