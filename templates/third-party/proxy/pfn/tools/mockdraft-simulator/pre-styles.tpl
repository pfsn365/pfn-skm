<style>
  {if $is_desktop}
    #ad-banner-container {
      background-color: #ededed;
      height: 105px;
      position: fixed;
      top: 93px;
      width: 100%;
      z-index: 10000;
      overflow: hidden;
    }

    .pfn-content-container {
      margin-top: 0;
    }

  {/if}

  .start-draft-btn {
    background: #37C77A;
    border-radius: 6px;
  }

  .team-selection-container {
    max-width: 532px;
  }

  @media (max-width: 768px) {
    .pfn-content-wrapper {
      margin-top: 125px;
    }

    .pfn-content-container {
      margin-top: calc(9vh + 20px);
      padding: 12px 0;
    }

    #ad-banner-container {
      width: 100%;
      background-color: #ededed;
      position: fixed;
      height: 9vh;
      top: unset;
      bottom: 0px;
      z-index: 10000;
    }

    .landing-page-container .draft-option-btns-container {
      top: 70px;
      padding: 2px 4px;
      box-shadow: 0px 6px 4px 0px #0000001A;
      background: #f5f5f5;
    }

    .draft-option-btns-container .draft-option-btn.selected {
      border-radius: 6px;
    }

    .pfn-content-container {
      padding: 0px;
      margin-top: calc(9vh + 20px);
    }

    .team-holder {
      min-height: 31px;
    }

    .teams-container .teams-header {
      min-height: 27px;
    }

    .filters-container {
      min-height: 212px;
    }
  }
</style>
