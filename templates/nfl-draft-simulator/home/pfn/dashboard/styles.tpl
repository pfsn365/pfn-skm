<style>
  .draft-options-view-container .dashboard-container {
    min-height: inherit;
    position: relative;
  }

  .draft-options-view-container .dashboard-container .dashboard-holder,
  .dashboard-holder {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    min-height: inherit;
    position: relative;
  }

  .dashboard-holder .dashboard-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.9;
    z-index: 20;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .dashboard-loading-overlay .loading-overlay-text {
    margin-top: 50px;
    color: #fff;
    font-weight: 700;
    font-size: 44px;
    line-height: 66px;
  }

  .dashboard-holder .dashboard-header {
    background: #fff;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 24px;
    padding: 14px 16px 0 16px;
    border-radius: 0 13px 0 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .dashboard-holder .dashboard-header .header-text-container {
    color: #202224;
    font-size: 20px;
    font-weight: 600;
    line-height: 23px;
  }

  .dashboard-holder .dashboard-sections-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .dashboard-holder .dashboard-sections-btns .dashboard-section-btn {
    border: unset;
    padding: unset;
    padding-bottom: 8px;
    color: #666666;
    font-size: 14px;
    font-weight: 700;
    line-height: 17px;
    border-bottom: 3px solid #fff;
  }

  .dashboard-holder .dashboard-sections-btns .dashboard-section-btn.selected {
    color: #0857C3;
    border-bottom-color: #0857C3;
  }

  .dashboard-holder .dashboard-section-data {
    padding: 16px 18px;
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
  }

  .dashboard-holder .dashboard-section-data .widgets-container {
    width: 33%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .dashboard-section-data .dashboard-widget-heading {
    color: #202224;
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
    text-align: left;
    width: 100%;
  }

  .dashboard-container .login-container-overlay {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 105px;
    background: rgba(223, 223, 223, 0.1);
    backdrop-filter: blur(2px);
  }

  .login-container-overlay .view-performance-text {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: #2d2d2d;
  }

  .login-container-overlay .dashboard-login-btn {
    border: unset;
    border-radius: 6px;
    padding: 12px 0;
    background: linear-gradient(91.11deg, #00AD51 -0.4%, #37C77A 49.94%, #00AD51 100.28%);
    box-shadow: 0px 2.95px 0px 0px #026831;
    color: #fff;
    width: 175px;
    font-size: 16px;
    font-weight: 800;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
  }

  .login-container-overlay .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .dashboard-holder .login-container {
    background: #f5f5f5;
    width: 100%;
    height: 62px;
  }

  .dashboard-header .dashboard-season-selector-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dashboard-season-selector-container .years-dropdown-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 6px 7px;
    margin-bottom: 6px;
    border: 1px solid #e9e9e9;
  }

  .years-dropdown-container .dashboard-year-text,
  .years-dropdown-container .dashboard-data-year {
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
  }

  .years-dropdown-container .dashboard-data-year {
    border: none;
  }

  .years-dropdown-container .dashboard-data-year:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    .dashboard-holder .dashboard-section-data {
      flex-direction: column;
    }

    .dashboard-section-data .user-insights-container {
      width: 100%;
    }

    .dashboard-header .header-text-container {
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      line-height: 21px;
    }

    .dashboard-header .dashboard-sections-btns {
      width: 100%;
      border-bottom: unset;
      gap: unset;
    }

    .dashboard-holder .dashboard-sections-btns .dashboard-section-btn {
      width: 33%;
      border: 1px solid #42526E;
      box-shadow: 1px 1px 4px 0px #00000012;
      background: #F5F6F8;
      color: #42526E;
      padding: 4px 0;
    }

    .dashboard-holder .dashboard-sections-btns .dashboard-section-btn.selected {
      background: #172B4D;
      color: #fff;
    }

    .dashboard-container .dashboard-holder .dashboard-header {
      border-bottom: unset;
      gap: 12px;
    }

    .dashboard-container .dashboard-holder .dashboard-loading-overlay {
      align-items: center;
    }

    .dashboard-loading-overlay .loading-overlay-text {
      margin-top: unset;
    }

    .login-container-overlay .login-container {
      width: 100%;
      flex-direction: column;
      background: #f5f5f5;
      padding: 10px 0;
    }

    .dashboard-holder .dashboard-header .header-text-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-text-container .years-dropdown-container {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #e9e9e9;
      padding: 5px 6px;
    }
  }
</style>
