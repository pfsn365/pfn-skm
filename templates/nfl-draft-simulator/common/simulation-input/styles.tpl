{if !$is_desktop}
  {function getMDSSimulationInputMobileCSS}
    <style>
      .teams-filters-container {
        padding: 0px 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        max-width: var(--tab-width);
        margin: 0 auto;
      }

      .number-of-rounds .radio-input {
        gap: 7px;
      }

      .simulator-content-holder .filters-container {
        min-width: unset;
      }

      .inputs-container label {
        margin-right: unset;
      }

      .filters-container {
        padding: 8px;
        border: 1px solid #2D2D2D;
        border-radius: 6px;
        width: 100%;
      }

      .start-draft-btn {
        position: unset;
        width: calc(100% - 24px);
      }

      .filters-container .inputs-container {
        gap: 14px;
        padding: 8px 8px 4px 8px;
      }

      .rounds-input-container,
      .speed-input-container {
        gap: 8px;
      }

      .text-filter {
        padding: 6px 6px 6px 8px;
        font-size: 14px;
        line-height: 18px;
      }

      .multi-user-section .button-container {
        display: flex;
        flex-direction: row;
        gap: 12px;
        padding: unset;
      }

      .multi-user-section {
        border: unset;
        padding: 2px;
        gap: 12px;
        background-color: #fff;
      }

      .multi-user-seperator-container {
        display: none;
      }

      .multi-user-section .create-room-btn {
        width: 50%;
        padding: 6px;

      }

      .multi-user-section .join-room-btn {
        width: 50%;
        padding: 6px;
      }

      .filters-container .text-filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .filters-container .text-filter img {
        background: unset;
        width: 100px;
        height: 18px;
      }
    </style>
  {/function}
{/if}
<style>
  .simulator-content-holder .filters-container {
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    border: 1px solid #2d2d2d;
    background: #fff;
    min-width: 320px;
  }

  .filters-container .inputs-container {
    padding: 20px 21px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .text-filter {
    padding: 12px 0 12px 21px;
    {if !$brand}
      background: #080A3C;
    {else}
      background: #2d2d2d;
    {/if}
    color: #ffffff;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    border-radius: 8px 8px 0 0;
  }

  .inputs-container label {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: black;
    margin-right: 4px;
  }

  .rounds-input-container,
  .speed-input-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .rounds-selection-text,
  .speed-selection-text {
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
  }

  .number-of-rounds,
  .draft-speed {
    display: flex;
    gap: 4px;
    align-items: start;
    flex-wrap: wrap;
  }

  .start-draft-btn {
    padding: 10px 0;
    display: flex;
    justify-content: center;
    {if !$brand}
      background: #D32F2F;
      border-radius: 74px;
    {/if}
    border: none;
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
    width: 100%;
    margin-top: 5px;
  }

  .start-btn-bottom {
    position: absolute;
    bottom: 20px;
    width: calc(100% - 42px);
  }

  .number-of-rounds .radio-input {
    gap: 4px;
    display: flex;
    align-items: center;
  }

  .multi-user-seperator-line {
    border-top: 1px solid #E2E2E2;
    width: 100%;
  }

  .multi-user-seperator-text {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff; 
    padding: 0 10px;
    color: #999;
    font-size: 11px;
    font-weight: 400;
  }

  .multi-user-section {
    border-radius: 8px;
    background: #F4F4F4;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .multi-user-section .header-text {
    color: #2D2D2D;
    font-size: 16px;
    font-weight: 500;
  }

  .multi-user-section .button-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 4px;
  }

  .multi-user-section .create-room-btn {
    display: flex;
    width: 296px;
    padding: 6px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    border: 1px solid #37C77A;
    background: #E9F7F2;
    color: #37C77A;
    font-size: 14px;
    font-weight: 500;
  }

  .multi-user-section .join-room-btn {
    display: flex;
    width: 296px;
    padding: 6px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    border: 1px solid #E2E2E2;
    background: #FFF;
    color: #2D2D2D;
    font-size: 14px;
    font-weight: 500;
  }
</style>

{if !$is_desktop}
  {call getMDSSimulationInputMobileCSS}
{/if}
