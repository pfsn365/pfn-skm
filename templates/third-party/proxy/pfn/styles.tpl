{assign var="fontFamilyToUse" value="'Roboto', -apple-system, BlinkMacSystemFont, Segoe UI, Liberation Sans, sans-serif" scope=root}

<style>
  @font-face {
    font-style: normal;
    font-weight: normal;
    font-family: "Roboto"; src: url("{$smarty.const.STATIC_URL}/assets/fonts/roboto-regular-400.woff2") format("woff2");
    font-display: swap;
  }

  @font-face {
    font-style: normal;
    font-weight: 500;
    font-family: "Roboto"; src: url("{$smarty.const.STATIC_URL}/assets/fonts/roboto-medium-500.woff2") format("woff2");
    font-display: swap;
  }

  {if isset($use_open_sans_font) && $use_open_sans_font}
    @font-face {
      font-style: normal;
      font-weight: 500;
      font-family: "Open Sans"; src: url("{$smarty.const.STATIC_URL}/assets/fonts/open-sans-400.woff2") format("woff2");
      font-display: swap;
    }
  {/if}

  body,
  button,
  input {
    font-family: {$fontFamilyToUse};
  }

  select {
    font-family: {$fontFamilyToUse} !important;
  }

  .header-wrapper {
    padding-top: 10px;
    margin-bottom: 25px;
  }

  .header-wrapper .desktop-tools-top-adv-container,
  .content .desktop-pages-top-adv-container {
    min-height: 150px;
  }

  .header-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  .updated-timestamp-container {
    display: block;
    text-align: center;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    min-height: 18px;
    color: #172B4D;
  }

  .header-container .left-header-border,
  .header-container .right-header-border {
    width: 102px;
    height: 6px;
    border-radius: 6px;
  }

  .header-container .left-header-border {
    background: linear-gradient(90deg, #FFFFFF 0%, #172B4D 100%);
  }

  .header-container .right-header-border {
    background: linear-gradient(270deg, #FFFFFF 0%, #172B4D 100%);
  }

  h1.header-text {
    font-weight: 700;
    font-size: 28px;
    line-height: 34px;
    letter-spacing: 0.5px;
    color: #172B4D;
  }

  .pfn-content-container .glossary-container {
    --background: #F6F8FD;
    --border-color: #0857C3;
    --border-radius: 4px;
  }

  .pfn-content-wrapper {
    width: 100%;
    {if isset($pfn_content_wrapper_margin_top) && $pfn_content_wrapper_margin_top}
      margin-top: {$pfn_content_wrapper_margin_top};
    {else}
      margin-top: 95px;
    {/if}
    margin-bottom: 100px;
  }

  .pfn-content-container {
    width: 100%;
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: flex-start;
  }

  .pfn-content-container .content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    z-index: 2;
    width: 720px;
  }

  .pfn-content-container .content.full-width {
    width: 1200px;
  }

  .pfn-content-container .calculator-container .calculator-content {
    border: 1px solid #0857C3;
    background: #f5f9ff;
  }

  .pfn-content-container .right-sidebar-container {
    width: 100%;
  }

  .pfn-content-container .right-sidebar-container .tool-widget-container {
    padding: 0px 12px;
  }

  @media (min-width: 769px) {
    .pfn-content-container .right-sidebar-container {
      width: 360px;
      border: 1px solid #E9E9E9;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .pfn-content-container .right-sidebar {
      width: 360px;
      min-height: 600px;
    }

    .pfn-content-container .ad-content {
      display: none;
    }

    .pfn-nfl-shared .more-teams-list .more-team-body {
      width: 650px;
    }
  }

  .sticky-ad-container {
    width: 100%;
    height: 95px;
    min-height: 55px;
    position: fixed;
    display: block;
    bottom: 0;
    z-index: 1;
  }

  .calculator-content,
  .pfn-text-content-container {
    border: 1px solid #E9E9E9;
    padding: 20px;
  }

  .pfn-text-content-container p {
    font-weight: 400;
    font-size: 16px;
    line-height: 27px;
    color: #666666;
    margin-top: 12px;
  }

  h2:not(:first-child) {
    margin-top: 20px;
  }

  .pfn-content-container .parlay-calculator,
  .pfn-content-container .odds-calculator,
  .pfn-text-content-container {
    width: 100%;
  }

  .pfn-content-container .calculator-container {
    border: 1px solid #E9E9E9;
    border-radius: unset;
    background-color: #fff;
  }

  .pfn-content-container .calculator-content .calculator-input-group .calculator-input--label .calculator-input--label-text {
    font-weight: 500;
    line-height: 16px;
  }

  .pfn-content-container .calculator-content .calculator-input-group .calculator-input--field input {
    border: 1px solid #D8E9FF;
    line-height: 16px;
    font-weight: 400;
  }

  .pfn-content-container .calculator-content .calculator-form--reset-button {
    background: #0857C3;
    font-weight: 500;
  }

  .pfn-content-container .calculator-content button.calculator-input--add-button {
    border: 1px solid #0857C3;
    color: #0857C3;
    border-radius: 28px;
    background: #E9F1FD;
    line-height: 16px;
    font-weight: 400;
  }

  .pfn-content-container .calculator-footer-content {
    background: #fff;
  }

  .pfn-content-container .calculator-footer-content .calculator-input--field {
    border: 1px solid #2D2D2D;
    border-radius: 4px;
  }

  .pfn-text-content-container {
    font-family: {$robotoFont};
  }

  .pfn-text-content-container h2 {
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;
    margin-bottom: 10px;
  }

  .pfn-text-content-container h3 {
    line-height: 29px;
    margin-top: 10px;
    font-size: 16px;
    font-weight: 500;
  }

  .pfn-text-content-container ul {
    padding-left: 20px;
    list-style: disc;
  }

  .pfn-text-content-container ul li,
  .pfn-text-content-container ol li {
    margin-left: 20px;
    font-weight: 400;
    font-size: 16px;
    line-height: 27px;
    color: #666666;
  }

  .pfn-text-content-container ol li {
    margin-left: 35px;
    list-style-type: auto;
  }

  .pfn-text-content-container ul li ul {
    list-style: circle;
  }

  .pfn-text-content-container h2 {
    margin-bottom: 10px;
  }

  .pfn-nfl-shared .pfn-content-container {
    margin-bottom: 104px;
  }

  .pfn-nfl-shared main div h1 {
    color: #172B4D !important;
    border-left: 4px solid #172B4D !important;
    padding-left: 8px !important;
  }

  #video-player-container {
    position: fixed;
    z-index: 10;
    left: 10px;
    bottom: 60px;
  }

  @media (max-width: 768px) {
    #video-player-container {
      left: 50%;
      bottom: 45px;
    }
    
    .pfn-content-wrapper {
      margin-top: 95px;
    }

    .pfn-content-container {
      padding: 12px;
      margin-top: 95px;
      margin-bottom: 100px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .pfn-nfl-shared .pfn-content-container {
      margin-bottom: 16px;
      padding: 0;
    }

    .content {
      max-width: 412px;
    }

    .content .mobile-top-adv-container {
      width: 100%;
      min-height: 70px;
      max-height: 70px;
      overflow: hidden;
    }

    .pfn-content-container .parlay-calculator,
    .pfn-content-container .odds-calculator,
    .pfn-content-container .content,
    .pfn-text-content-container {
      width: 100%;
    }

    .pfn-text-content-container .p {
      font-size: 14px;
      margin-top: 8px;
    }

    .pfn-text-content-container h2 {
      font-weight: 600;
      font-size: 18px;
      line-height: 24px;
    }

    .pfn-text-content-container,
    .pfn-content-container .calculator-container {
      border: unset;
      padding: unset;
    }

    .pfn-content-container .ad-content {
      width: 100%;
      text-align: center;
      min-height: 250px;
    }

    .sticky-ad-container {
      width: 100%;
      height: 55px;
      position: fixed;
      display: block;
      bottom: 0;
      z-index: 1;
    }

    .more-teams-list .items-container {
      height: 80vh !important;
      padding-bottom: 80px;
    }

    .more-teams-list .items-container .more-team-head {
      position: fixed;
      width: 100%;
      border-radius: 25px 25px 0 0;
      background-color: white;
    }

    .more-teams-list .items-container .nfl-zone-title {
      margin-top: 60px;
    }
  }
</style>
