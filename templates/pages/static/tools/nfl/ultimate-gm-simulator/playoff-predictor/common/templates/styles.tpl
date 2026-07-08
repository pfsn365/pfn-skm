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
    border-radius: 20px;
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

  #screen-predict-playoffs .predict-playoff-games-popup-container .popup-header {
    border-radius: 12px 12px 0 0;
  }

  .simulate-popup-container .popup-header span,
  .delete-popup-container .popup-header span,
  .predict-simulate-popup-container .popup-header span,
  .predict-playoff-games-popup-container .popup-header span {
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    padding: 6px;

  }

  .popup-header .close-icon {
    background-color: transparent;
    border: unset;
    cursor: pointer;
    top: unset;
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
    background-color: #37C77A;
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
    font-weight: 600;
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
    font-weight: 600;
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
    width: 100%;
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

  .playoff-winner-animation-gif {
    height: 270px;
    width: 270px;
  }

  .playoff-winner-animation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 1;
    z-index: 3003;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px
  }

  .playoff-winner-animation-gif-container {
    position: relative;
    z-index: 2005;
  }

  .playoff-winner-animation-team-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2004;
  }

  .predict-playoff-games-popup-content>div.playoff-games-popup-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    position: absolute;
    bottom: 10px;
    width: 100%;
  }

  .playoff-games-popup-footer button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .playoff-games-popup-footer .playoff-games-reset-btn {
    padding: 8px 12px;
    background: #FBEBEB;
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
    border: 1px solid #0857C3;
    border-radius: 4px;
    width: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0857C3;
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

  .predict-playoff-games-popup-content>div {
    display: flex;
    flex-direction: column;
  }

  .draft-order-table .team-pos-not-decided {
    opacity: 0.4;
  }

  .utility-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .utility-container .download-btn-mds,
  .utility-container .share-btn-mds,
  .utility-container .download-btn,
  .utility-container .share-btn {
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

  @media (max-width: 768px) {

    .playoff-games-popup-footer .playoff-games-reset-btn,
    .playoff-games-popup-footer .playoff-games-sim-btn,
    .playoff-games-popup-footer .playoff-games-pause-btn {
      width: 95px;
    }

    .predict-playoff-games-popup-content>div.playoff-games-popup-footer {
      position: unset;
      margin-bottom: 10px;
    }
  }
</style>
