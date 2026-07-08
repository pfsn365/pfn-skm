<style>
  .ad-wrapper .ad-placeholder.default-variant {
    position: absolute;
    width: 300px;
    height: 250px;
  }

  .ad-wrapper .ad-placeholder.default-variant .ad-placeholder-box {
    position: relative;
    width: 100%;
    height: 100%;
    background: #F7F7F7;
    border-radius: 4px;
    margin: 0 auto;
  }

  :root[data-theme="dark"] .ad-wrapper .ad-placeholder.default-variant .ad-placeholder-box {
    background: #2D2D2D;
  }

  .ad-wrapper .ad-placeholder.default-variant span {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #474747;
    padding: 2px 8px;
    font-size: 14px;
    line-height: 14px;
    border-radius: 4px;
    background: #F8EBD8;
  }

  .ad-wrapper .ad-placeholder.fluid-transparent-header-variant {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    color: #808080;
  }

  {* Fluid Style *}

  {if !$is_desktop}
    .ad-wrapper.fluid-style {
      --labelColor: #999;
      --labelVGap: 8px;
      --labelLineHeight: 12px;
      --borderColor: transparent;

      --adExplicitDeclareHeight: calc(2*var(--labelVGap) + var(--labelLineHeight));

      display: flex;
      flex-direction: column !important;
      justify-content: start !important;
      border-top: 1px solid var(--borderColor);
      border-bottom: 1px solid var(--borderColor);
    }

    :root[data-theme="dark"] .ad-wrapper.fluid-style {
      --labelColor: #666;
    }

    .ad-wrapper.fluid-style::before {
      content: "ADVERTISEMENT";
      margin: var(--labelVGap) 0;
      color: var(--labelColor);
      font-weight: 400;
      font-size: 10px;
      line-height: var(--labelLineHeight);
      opacity: 0;
    }

    {*  *}

    .ad-wrapper.fluid-style.loaded {
      --borderColor: #e9e9e9;
    }

    :root[data-theme="dark"] .ad-wrapper.fluid-style.loaded {
      --borderColor: #2d2d2d;
    }

    .ad-wrapper.fluid-style.loaded::before {
      opacity: 1;
    }

  {/if}

  {*  *}

  .ad-wrapper .ad-placeholder.fluid-variant {
    --backgroundColor: #F7F7F7;
    --foregroundColor: #666;

    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    background-color: var(--backgroundColor);

    .ad-placeholder-box {
      width: 100%;
      padding: 12px;
      color: var(--foregroundColor);
      font-size: 12px;
      line-height: 18px;
      text-align: center;
    }
  }

  :root[data-theme="dark"] .ad-wrapper .ad-placeholder.fluid-variant {
    --backgroundColor: #2D2D2D;
    --foregroundColor: #808080;
  }
</style>
