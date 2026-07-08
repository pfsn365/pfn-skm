{if !$is_desktop}
  {function getMDSMoreToolsMobileCSS}
    <style>
      .more-pfn-tools-container {
        background: #fff;
        border: 1px solid #dfdfdf;
        border-radius: 14px 14px 0 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        position: fixed;
        width: 100%;
        z-index: 10001;
      }

      .more-pfn-tools-container .more-tools-header {
        padding: 13px 16px;
      }

      .more-pfn-tools-container .more-tools-holder {
        flex-direction: column;
        gap: 6px;
        padding: 16px 15px;
      }

      .more-pfn-tools-container .tool-holder {
        border: initial;
        padding: initial;
      }

      .tool-holder .tool-image-icon-holder {
        gap: 12px;
      }

      .more-pfn-tools-container .separator {
        border-top: 1px solid #f5f5f5;
        display: block;
      }

      .more-pfn-tools-container .close-icon-btn {
        display: flex;
        border: none;
      }

      .more-pfn-tools-container .close-icon-btn img {
        width: 20px;
        height: 20px;
      }
    </style>
  {/function}
{/if}
<style>
  .more-pfn-tools-container {
    border: 1px solid #e9e9e9;
    display: flex;
    flex-direction: column;
  }

  .more-pfn-tools-container .more-tools-header {
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
  }

  .more-tools-header .header-text {
    color: #474747;
    font-size: 16px;
    font-weight: 600;
  }

  .more-pfn-tools-container .more-tools-holder {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    padding: 16px 20px;
  }

  .more-pfn-tools-container .tool-holder {
    align-items: center;
    border: 1px solid #dfdfdf;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    min-width: 305px;
    padding: 14px;
    white-space: nowrap;
    text-decoration: none;
  }

  .tool-holder .tool-image-icon-holder {
    align-items: center;
    display: flex;
    gap: 6px;
    justify-content: center;
  }

  .tool-holder .tool-icon-holder {
    border: 1px solid #e9e9e9;
    border-radius: 25px;
    display: flex;
    padding: 8px;
  }

  .tool-holder .tool-name {
    color: #0b65f0;
    font-size: 14px;
  }

  .more-tools-holder .separator {
    display: none;
  }
</style>

{if !$is_desktop}
  {call getMDSMoreToolsMobileCSS}
{/if}
