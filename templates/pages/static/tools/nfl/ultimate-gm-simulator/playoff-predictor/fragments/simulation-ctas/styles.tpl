<style>
  .simulation-ctas-container {
    display: flex;
    position: relative;
  }

  .simulation-ctas-container .delete-button,
  .simulation-ctas-container .simulate-button,
  .simulation-ctas-container .pause-button,
  .simulation-ctas-container .resume-button {
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
  .simulation-ctas-container .resume-button {
    background-color: #EEF2F7;
    border: 1px solid #0857C3;
  }

  .simulation-ctas-container .pause-button {
    background-color: #F5F5F5;
    border: 1px solid #E9E9E9;
    box-shadow: none;
  }

  .simulation-ctas-container .simulate-button span,
  .simulation-ctas-container .resume-button span {
    color: #0857C3;
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
  .simulation-ctas-container .resume-button span {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0em;
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
    background: #080A3C;
    position: relative;
    top: 6px;
    color: white;
    font-weight: 400;
    font-size: 12px;
    line-height: 15.4px;
    padding: 8px;
    border-radius: 2px;
  }

  .simulation-ctas-container .tooltip .up-arrow {
    width: 0;
    height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 9px solid #080A3C;
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
    .simulation-ctas-container .resume-button {
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
      right: 0;
    }

    .simulation-ctas-container .tooltip .up-arrow {
      top: auto;
      bottom: -9px;
      left: auto;
      right: 48px;
      transform: rotate(180deg);
    }
  }
</style>
