<style>
    .radio-option-container {
        display: flex;
        cursor: pointer;
        padding: 10px;
    }

    .radio-option-container.disabled-option span {
        opacity: 50%;
    }

    .radio-option-container span {
        color: #666666;
        width: 90%;
        font-weight: 500;
        font-size: 13px;
    }

    .predict-playoff-games-popup-container {
        border-radius: 0;
        width: 100%;
    }

    .predict-playoff-games-popup-container .popup-header-brand-logo {
        height: 22px;
        width: auto;
    }

    .simulate-popup-container .selected span,
    .delete-popup-container .selected span,
    .predict-simulate-popup-container .selected span {
        color: #37C77A;
    }

    .radio-option-container input[type="radio"] {
        width: 20px;
        height: 20px;
    }

    .radio-option-container input[type="radio"]:checked {
        accent-color: seagreen;
        outline: none;
    }

    .simulate-popup-container .seperator,
    .delete-popup-container .seperator,
    .predict-simulate-popup-container .seperator,
    .predict-playoff-games-popup-container .seperator {
        width: 95%;
        border-top: 1px solid #E9E9E9;
        margin: auto;
    }

    .predict-playoff-games-popup-container .completed-match-container {
        pointer-events: none;
    }

    .team-info-popup-body {
        flex: 1;
        position: relative;
        overflow: hidden;
        width: 100%;
    }

    .team-info-iframe-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: #666666;
    }

    .team-info-iframe {
        display: none;
        width: 100%;
        height: 100%;
        border: none;
    }

    .team-info-popup-container .popup-header,
    .power-rank-popup-container .popup-header,
    .settings-popup-container .popup-header,
    .simulate-popup-container .popup-header,
    .delete-popup-container .popup-header,
    .predict-simulate-popup-container .popup-header,
    .predict-playoff-games-popup-container .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border-radius: var(--popup-border-radius) var(--popup-border-radius) 0 0;
    }

    .team-info-popup-container .popup-header span,
    .power-rank-popup-container .popup-header span,
    .settings-popup-container .popup-header span,
    .simulate-popup-container .popup-header span,
    .delete-popup-container .popup-header span,
    .predict-simulate-popup-container .popup-header span,
    .predict-playoff-games-popup-container .popup-header span {
        font-size: 14px;
        font-weight: 500;
        text-align: left;
        padding: 6px;

    }

    .power-rank-popup-container .popup-header span,
    .settings-popup-container .popup-header span {
        font-size: 16px;
    }

    .popup-header .close-icon {
        background-color: transparent;
        border: unset;
        cursor: pointer;
    }

    .simulate-popup-container .result-button-container,
    .delete-popup-container .result-button-container,
    .predict-simulate-popup-container .result-button-container,
    .predict-playoff-games-popup-container .result-button-container {
        padding: 10px;
    }

    .result-button-container .submit-delete-button,
    .result-button-container .submit-simulate-button {
        padding: 10px 16px;
        background-color: #0050A0;
        color: #fff;
        width: 100%;
        border-radius: 6px;
        border: unset;
        cursor: pointer;
    }

    .predict-playoff-games-popup-content .playoff-popup-conference-header {
        display: flex;
        width: 100%;
        flex-direction: row;
    }

    .afc-playoff-popup-header,
    .nfc-playoff-popup-header {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px 0;
    }

    .afc-playoff-popup-header {
        background-color: #CE1127;
    }

    .nfc-playoff-popup-header {
        background-color: #003369;
    }

    .playoff-wildcard-round-text,
    .playoff-divisional-round-text,
    .playoff-conference-round-text,
    .playoff-super-bowl-round-text {
        font-size: 12px;
        font-style: italic;
        font-weight: 500;
        text-align: center;
        padding: 4px;

    }


    .playoff-wildcard-round-container,
    .playoff-divisional-round-container,
    .playoff-conference-round-container,
    .playoff-super-bowl-round-container {
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 4px;
    }

    .vertical-container-seperator {
        border-left: 1px solid #474747;
    }

    .afc-playoff-wildcard-round-container,
    .nfc-playoff-wildcard-round-container,
    .nfc-playoff-divisional-round-container,
    .afc-playoff-divisional-round-container,
    .afc-playoff-conference-round-container,
    .nfc-playoff-conference-round-container {
        width: 100%;
        padding: 4px;
    }

    .afc-playoff-super-bowl-round-container,
    .nfc-playoff-super-bowl-round-container {
        width: 100%;
        padding: 6px;
    }

    .playoff-match-details-holder {
        display: flex;
        width: 100%;
        padding: 2px;
    }

    .playoff-match-team-details-holder {
        display: flex;
        border: 1px solid #E9E9E9;
        width: 42%;
        padding: 4px;
        justify-content: space-around;
        cursor: pointer;
    }

    .playoff-match-verses-container {
        width: 16%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .playoff-match-verses-text {
        font-size: 14px;
        font-weight: 400;
        text-align: center;

    }

    .playoff-match-team-rank-holder {
        color: #474747;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 4px;
    }

    .playoff-match-team-logo-holder {
        width: 33px;
        height: 22px;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .afc-playoff-super-bowl-round-container {
        display: flex;
        justify-content: right;
    }

    .disabled-round {
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.5;
    }

    .playoff-match-details-holder .selected,
    .playoff-super-bowl-round-container .selected {
        border: 1px solid #37C77A;
        background-color: #C6F8BA;
    }

    .afc-playoff-popup-header-logo,
    .nfc-playoff-popup-header-logo {
        height: 30px;
        object-fit: contain;
    }

    .predict-playoff-games-popup-content .playoff-predict-popup-footer {
        padding: 10px;
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .playoff-predict-popup-footer-text {
        text-align: center;
        width: 60%;
        font-size: 10px;
        font-weight: 400;
        text-align: center;
        color: #666666;
    }

    .playoff-winner-animation-overlay {
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 3003;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .playoff-winner-animation-modal {
        background: #fff;
        border-radius: 12px;
        padding: 32px 40px;
        position: relative;
        box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
        animation: modalFadeIn 0.4s ease-out forwards;
    }

    .close-winner-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: unset;
        cursor: pointer;
        z-index: 1;
    }

    .close-winner-btn .close-winner-icon {
        height: 20px;
        width: 20px;
    }

    .playoff-winner-animation-team-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .playoff-winner-superbowl-logo {
        height: 80px;
        object-fit: contain;
        animation: superbowlFadeScaleIn 0.8s ease-out forwards;
    }

    .playoff-winner-animation-team-logo {
        width: 150px;
        height: 100px;
        object-fit: contain;
        animation: teamLogoReveal 0.8s ease-out 0.4s both;
    }

    .playoff-winner-text {
        font-size: 18px;
        font-weight: 500;
        color: #0050A0;
        text-align: center;
        animation: teamLogoReveal 0.6s ease-out 0.8s both;
    }

    @keyframes modalFadeIn {
        0% {
            opacity: 0;
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes superbowlFadeScaleIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.15);
        }
        70% {
            transform: scale(0.95);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes teamLogoReveal {
        0% {
            opacity: 0;
            transform: scale(0.5) translateY(20px);
        }
        60% {
            transform: scale(1.1) translateY(0);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    .predict-playoff-games-popup-content>div {
        display: flex;
        flex-direction: column;
    }

    .draft-order-table .team-pos-not-decided {
        opacity: 0.4;
    }

    .playoff-games-popup-footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0px 20px;
    }

    .playoff-games-popup-footer button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .playoff-games-popup-footer .playoff-games-reset-btn {
        padding: 8px 12px;
        background: #FDECEA;
        border: 1px solid #D32F2F;
        border-radius: 4px;
        width: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #D32F2F;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0px 2px 4px 0px #00000040;
        gap: 6px;
    }

    .playoff-games-popup-footer .playoff-games-sim-btn {
        padding: 8px 12px;
        background: #EEF2F7;
        border: 1px solid #0050A0;
        border-radius: 4px;
        width: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #0050A0;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0px 2px 4px 0px #00000040;
        gap: 6px;
    }

    .playoff-games-popup-footer .playoff-games-pause-btn {
        padding: 8px 12px;
        background: #F5F5F5;
        border: 1px solid #E9E9E9;
        border-radius: 4px;
        width: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #474747;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0px 2px 4px 0px #00000040;
        gap: 6px;
    }

    .utility-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    .utility-container .download-btn-mds, .utility-container .share-btn-mds,
    .utility-container .download-btn, .utility-container .share-btn {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
    }
    @keyframes blinker {
        50% {
        opacity: 0;
        }
    }

  .btn-blinker {
    animation: blinker 1.5s linear infinite;
  }

    /* Power Rank Popup Styles */
    .power-rank-popup-content {
        padding: 10px;
    }

    .power-rank-list {
        max-height: 400px;
        overflow-y: auto;
    }

    .power-rank-team-row {
        display: flex;
        align-items: center;
        padding: 6px 8px;
        border-bottom: 1px solid #E9E9E9;
        gap: 10px;
    }

    .power-rank-team-row:hover {
        background-color: #F5F8FC;
    }

    .power-rank-number {
        font-size: 16px;
        font-weight: 500;
        color: #474747;
        min-width: 24px;
        text-align: center;
    }

    .power-rank-team-logo {
        width: 28px;
        height: 18px;
        object-fit: contain;
    }

    .power-rank-team-name {
        font-size: 16px;
        font-weight: 500;
        color: #2d2d2d;
        flex: 1;
    }

    .power-rank-arrows {
        display: flex;
        gap: 8px;
    }

    .power-rank-arrows button {
        background: none;
        border: 1px solid #E9E9E9;
        border-radius: 4px;
        cursor: pointer;
        padding: 12px;
        min-width: 44px;
        min-height: 44px;
        font-size: 10px;
        color: #474747;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .power-rank-arrows button:hover {
        background-color: #EEF2F7;
        border-color: #0050A0;
    }

    .power-rank-team-row[draggable="true"] {
        cursor: grab;
        -webkit-user-select: none;
        user-select: none;
    }

    .power-rank-team-row.dragging {
        opacity: 0.4;
        cursor: grabbing;
    }

    .power-rank-popup-footer {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        gap: 10px;
        border-top: 1px solid #E9E9E9;
    }

    .power-rank-reset-btn {
        padding: 8px 16px;
        background-color: #F5F5F5;
        color: #474747;
        border: 1px solid #E9E9E9;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
    }

    .power-rank-apply-btn {
        padding: 8px 16px;
        background-color: #0050A0;
        color: #fff;
        border: unset;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        flex: 1;
    }

    /* Settings Popup Styles */
    .settings-popup-content {
        padding: 16px;
    }

    .settings-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .settings-section-title {
        font-size: 16px;
        font-weight: 500;
        color: #2d2d2d;
    }

    .settings-section-subtitle {
        font-size: 14px;
        color: #666666;
        font-weight: 400;
    }

    .settings-popup-content .seperator {
        width: 100%;
        border-top: 1px solid #E9E9E9;
        margin: 16px 0;
    }

    .chaos-slider-wrapper {
        position: relative;
    }

    .chaos-slider-container {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
    }

    .chaos-label-low,
    .chaos-label-high {
        font-size: 14px;
        color: #666666;
        white-space: nowrap;
    }

    .chaos-slider {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 6px;
        background: #E9E9E9;
        border-radius: 3px;
        outline: none;
    }

    .chaos-slider:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .chaos-slider:disabled::-webkit-slider-thumb {
        cursor: not-allowed;
    }

    .chaos-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        background: #0050A0;
        border-radius: 50%;
        cursor: pointer;
    }

    .chaos-value-text {
        font-size: 16px;
        font-weight: 500;
        color: #0050A0;
        position: relative;
        left: 50%;
        display: inline-block;
    }

    .scenario-presets-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }

    .scenario-preset-btn {
        padding: 12px 16px;
        min-height: 44px;
        background-color: #F5F5F5;
        border: 1px solid #E9E9E9;
        border-radius: 20px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        color: #474747;
    }

    .scenario-preset-btn:hover {
        border-color: #0050A0;
        color: #0050A0;
    }

    .scenario-preset-btn.active {
        background-color: #EEF2F7;
        border-color: #0050A0;
        color: #0050A0;
        font-weight: 500;
    }

    .settings-popup-footer {
        padding: 10px;
        border-top: 1px solid #E9E9E9;
    }

    .settings-apply-btn {
        padding: 10px 16px;
        background-color: #0050A0;
        color: #fff;
        width: 100%;
        border-radius: 6px;
        border: unset;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
    }

    /* Custom Settings Banner */
    .custom-settings-banner {
        font-size: 12px;
        text-align: center;
        padding: 4px 10px;
        background-color: transparent;
        border: 1px solid transparent;
        color: transparent;
    }

    .custom-settings-banner.active {
        background-color: #FFF3CD;
        border: 1px solid #FFECB5;
        color: #856404;
    }

    .power-rank-list::-webkit-scrollbar {
        width: 5px;
    }

    .power-rank-list::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }

</style>
