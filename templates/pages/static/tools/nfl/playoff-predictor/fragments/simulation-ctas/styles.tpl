<style>
    .simulation-ctas-container {
        display: flex;
        position: relative;
    }


    .simulation-ctas-container .delete-button,
    .simulation-ctas-container .simulate-button,
    .simulation-ctas-container .pause-button,
    .simulation-ctas-container .resume-button,
    .simulation-ctas-container .power-rank-button,
    .simulation-ctas-container .settings-button {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0px 2px 4px 0px #00000040;
        border-radius: 4px;
        padding: 8px;
        width: content;
    }

    .simulation-ctas-container .delete-button {
        background-color: #FBEBEB;
        border: 1px solid #D32F2F;
    }

    .simulation-ctas-container .simulate-button,
    .simulation-ctas-container .resume-button,
    .simulation-ctas-container .power-rank-button,
    .simulation-ctas-container .settings-button {
        background-color: #EEF2F7;
        border: 1px solid #0050A0;
    }

    .simulation-ctas-container .pause-button {
        background-color: #F5F5F5;
        border: 1px solid #E9E9E9;
        box-shadow: none;
    }

    .simulation-ctas-container .simulate-button span,
    .simulation-ctas-container .resume-button span,
    .simulation-ctas-container .power-rank-button span,
    .simulation-ctas-container .settings-button span {
        color: #0050A0;
    }

    .simulation-ctas-container .delete-button span {
        color: #D32F2F;
    }

    .simulation-ctas-container .pause-button span {
        color: #474747;
    }

    .simulation-ctas-container .delete-button span,
    .simulation-ctas-container .simulate-button span,
    .simulation-ctas-container .pause-button span,
    .simulation-ctas-container .resume-button span,
    .simulation-ctas-container .power-rank-button span,
    .simulation-ctas-container .settings-button span {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0em;
    }

    .simulation-ctas-container .power-rank-button,
    .simulation-ctas-container .settings-button {
        position: relative;
    }

    .simulation-ctas-container .new-indicator {
        position: absolute;
        top: -6px;
        right: -6px;
        font-size: 10px;
        font-weight: 700;
        color: #FFFFFF !important;
        background-color: #D32F2F;
        border: 1.5px solid #D32F2F;
        border-radius: 3px;
        padding: 1px 4px;
        line-height: 1;
        letter-spacing: 0.02em;
    }

    .disabled-button {
        opacity: 0.5;
    }

    .simulation-ctas-container .default-disabled-button {
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
    }

    .simulation-ctas-container .tooltip {
        z-index: 2;
        width: 297px;
        background: #0050A0;
        position: relative;
        top: 6px;
        color: white;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        padding: 8px;
        border-radius: 2px;
    }

    .simulation-ctas-container .tooltip .up-arrow {
        width: 0;
        height: 0px;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 9px solid #0050A0;
        display: inline-block;
        position: absolute;
        top: -9px;
        left: 24px;
    }

    @media (max-width: 768px) {
        .simulation-ctas-container {
            gap: 16px;
        }

        .simulation-ctas-container .delete-button,
        .simulation-ctas-container .simulate-button,
        .simulation-ctas-container .pause-button,
        .simulation-ctas-container .resume-button,
        .simulation-ctas-container .power-rank-button,
        .simulation-ctas-container .settings-button {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: 100%;
        }

        .simulation-ctas-container .tooltip {
            position: absolute;
            top: -64px;
            left: 0;
        }

        .simulation-ctas-container .tooltip .up-arrow {
            top: auto;
            bottom: -9px;
            left: 24px;
            right: auto;
            transform: rotate(180deg);
        }
    }
</style>

