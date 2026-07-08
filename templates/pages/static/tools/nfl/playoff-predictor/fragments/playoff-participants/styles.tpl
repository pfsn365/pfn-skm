<style>
    .playoff-participants-container .afc-rank-1-team-container,
    .playoff-participants-container .nfc-rank-1-team-container {
        display: flex;
        justify-content: center;
        padding: 4px;
        align-items: center;
    }

    .playoff-participants-container .afc-rank-1-team-container>img,
    .playoff-participants-container .nfc-rank-1-team-container>img {
        margin: unset;
        height: 24px;
        width: 36px;
    }

    .playoff-participants-container .afc-rank-1-team-container > img.question-mark,
    .playoff-participants-container .nfc-rank-1-team-container > img.question-mark {
        margin: unset;
        height: 24px;
        width: 36px;
        object-fit: contain;
    }

    .playoff-participants-container .playoff-team-details-holder {
        padding: 4px 4px;
        border: 1px solid #e9e9e9;
        display: flex;
        gap: 4px;
        align-items: center;
        border-radius: 4px;
    }

    .playoff-participants-container .playoff-team-details-holder>img {
        height: 22px;
        width: 33px;
    }

    .playoff-participants-container .playoff-team-details-holder > img.question-mark {
        height: 22px;
        width: 33px;
        object-fit: contain;
    }

    .playoff-participants-container .playoff-game-details-holder {
        display: flex;
        justify-content: space-around;
        padding: 4px;
    }

    .playoff-predictor-tool-wrapper .playoff-participants-container {
        display: flex;
        width: 100%;
        position: relative;
        z-index: 1;
    }

    .playoff-participants-container .afc-playoff-participants,
    .playoff-participants-container .nfc-playoff-participants {
        width: 50%;
    }

    .playoff-participants-container .rank-1-team-text {
        width: unset;
        font-size: 16px;
        color: #474747;
        font-weight: 500;
        text-align: center;
        padding: 4px;
    }

    .playoff-participants-container .playoff-team-rank {
        color: #474747;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        padding: 0 2px;
        width: unset;
    }

    .playoff-participants-container .playoff-team-win-lose-text {
        color: #666666;
        font-size: 15px;
        font-weight: 400;
        text-align: center;
        padding: unset;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .playoff-participants-container .verses-text {
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        color: #666666;
        margin: unset;
        width: unset;
        padding: unset;
    }

    .playoff-participants-container .verses-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

</style>
