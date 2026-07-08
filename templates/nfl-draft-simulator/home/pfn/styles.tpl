<style>
  .simulator-content-container .landing-page-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    width: 985px;
    min-height: 636px;
  }

  .landing-page-container .draft-option-btns-container {
    min-height: inherit;
    width: 75px;
    box-shadow: 2px 0px 4px 0px #0000001A;
    display: flex;
    flex-direction: column;
    border-radius: 13px 0 0 13px;
  }

  .draft-option-btns-container .draft-btns-heading {
    background: #2d2d2d;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    padding: 8px 11px;
    border-radius: 13px 0 0 0;
    text-align: center;
  }

  .draft-option-btn.logout-container {
    cursor: pointer;
    position: relative;
  }

  .draft-option-btns-container .mds-logout-btn {
    position: absolute;
    left: -18px;
    top: -21px;
    width: 86px;
    padding: 6px 34px 6px 10px;
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    background: #fff;
    z-index: 30;
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
    text-wrap: nowrap;
  }

  .simulator-content-container .draft-options-view-container {
    background: #F6F7FF;
    height: 100%;
    min-height: inherit;
    width: 100%;
    border-radius: 0 13px 13px 0;
    border: 1px solid #e9e9e9;
    border-left: none;
  }

  .draft-options-view-container .teams-filters-container,
  .draft-options-view-container .multi-user-create-join-room-container {
    padding: 16px;
  }

  .draft-options-view-container .multi-user-create-join-room-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
    height: 100%;
    min-height: inherit;
  }

  .draft-options-view-container .teams-filters-container {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .draft-options-view-container .multi-user-create-join-room-container .create-room-container {
    height: 100%;
    min-height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    border: 1px solid #D5D5D5;
    gap: 18px;
    background: #F8F8F8;
    border-radius: 8px;
    padding: 16px;
  }

  .draft-option-btns-container .draft-option-btn {
    border: unset;
    padding: 12px 25px;
    background: #fff;
    color: #080A3C;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 7px;
    position: relative;
  }

  .draft-option-btns-container .draft-option-btn.selected {
    background: #0857C3;
    color: #fff;
  }

  .create-room-container .create-room-text {
    color: #2d2d2d;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }

  .create-room-container .create-room-btn {
    border: 1px solid #37C77A;
    background: #E9F7F2;
    width: 100%;
    padding: 6px 16px 6px 16px;
    border-radius: 8px;
    color: #37C77A;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }

  .create-room-container .instructions-btn {
    width: 100px;
    color: #2d2d2d;
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
    text-decoration: underline;
    border: unset;
    padding: unset;
  }

  .draft-option-btn .triangle-right {
    position: absolute;
    left: 50px;
    width: 0;
    height: 0;
    border-top: 28px solid transparent;
    border-left: 40px solid #0857C3;
    border-bottom: 28px solid transparent;
    z-index: 10;
  }

  .draft-option-btn.logout-container img {
    width: 20px;
    height: 4px;
  }

  .draft-option-btn img {
    width: 20px;
    height: 20px;
  }

  .draft-option-btn span {
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
  }

  .draft-option-btn .new-text {
    position: absolute;
    top: 8px;
    right: 0;
    background: #d32f2f;
    color: #fff;
    padding: 1px 5px;
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
    border-radius: 3px;
  }

  .draft-option-btn img,
  .draft-option-btn span {
    z-index: 20;
  }

  @media (max-width: 768px) {
    .landing-page-container .draft-option-btns-container {
      position: fixed;
      flex-direction: row;
      height: 50px;
      width: 100%;
      z-index: 100;
    }

    .draft-option-btns-container .draft-option-btn {
      width: 33.33%;
    }

    .draft-options-view-container .multi-user-create-join-room-container {
      flex-direction: column-reverse;
    }

    .draft-options-view-container .multi-user-create-join-room-container .create-room-container {
      width: 100%;
    }

    .multi-user-create-join-room-container .join-room-container {
      width: 100%;
      position: sticky;
      top: 195px;
    }

    .join-room-container .join-room-popup-container {
      border: unset;
    }

    .draft-option-btn.logout-container {
      padding: 0;
      width: 35px;
    }

    .draft-option-btn.logout-container img {
      transform: rotate(90deg);
    }

    .draft-option-btns-container .mds-logout-btn {
      left: -60px;
    }

    .bottom-controls .dashboard-btn {
      position: relative;
    }

    .bottom-controls .dashboard-btn .new-text {
      position: absolute;
      top: 1px;
      right: -10px;
      background: #d32f2f;
      color: #fff;
      padding: 1px 5px;
      font-size: 12px;
      line-height: 14px;
      font-weight: 600;
      border-radius: 3px;
    }

    .draft-option-btn .new-text {
      top: 0px;
      right: 8px;
    }

    .sim-content-slider {
      display: flex;
      width: 300%;
      height: 100%;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sim-content-slider.show-rounds-pics-container {
      transform: translateX(0%);
    }
    .sim-content-slider.show-players-container {
      transform: translateX(-33.33%);
    }
    .sim-content-slider.show-mypics-container {
      transform: translateX(-66.66%);
    }

    .sim-content-slider .rounds-pics-container,
    .sim-content-slider .players-container,
    .sim-content-slider .mypicks-container {
      width: 33%;
    }
  }
</style>
