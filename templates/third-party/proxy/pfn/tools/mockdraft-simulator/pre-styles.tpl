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

  /* .pfn-content-wrapper's top margin otherwise collapses out through <main> and <body>.
     When Voltax injects its player as body's first child post-load, the margin gets
     re-captured and the body box grows by that margin in one go (~0.15 CLS on mobile).
     A block formatting context on <main> keeps the margin inside from the first paint. */
  .sk-proxied-page {
    display: flow-root;
  }

  .start-draft-btn {
    background: #37C77A;
    border-radius: 6px;
  }

  .team-selection-container {
    max-width: 532px;
  }

  @media (max-width: 768px) {
    /* third-party/proxy/pfn/styles.tpl caps .content at 412px on mobile; this tool releases
       it to --tab-width, but that override lives in styles.tpl -- the last fragment, parsed
       only after the render-blocking axios script in home/js.tpl. So the tool paints 412px
       wide and then snaps out to the viewport width. Reserve the final width up front.
       The var fallback covers the gap before home/styles.tpl declares --tab-width: 600px. */
    .pfn-content-container .content,
    .pfn-content-container .content > * {
      max-width: var(--tab-width, 600px);
    }

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

    /* Each .radio-input is a flex row holding a stray <br>, which becomes an anonymous
       flex item sized by the font strut: 18px on the fallback, 22px once Roboto swaps in.
       That grows every rounds/speed row by 4px and spreads the Draft Settings panel ~8px
       after load. Pin the settled height so the rows never resize. */
    .teams-filters-container .radio-input {
      min-height: 22px;
    }
  }
</style>
