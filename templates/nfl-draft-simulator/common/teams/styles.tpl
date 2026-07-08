{if !$is_desktop}
  {function getMDSTeamsMobileCSS}
    <style>
      .team-selection-container {
        width: 100%;
        border: none;
        padding: 0 4px;
        min-height: unset;
      }

      .team-holder .team-logo {
        width: 27px;
        height: 18px;
        background: transparent !important;
      }

      .teams-container {
        gap: unset;
      }

      .team-holder {
        padding: 4px 6px;
        width: 46%;
      }

      .teams-container .teams-holder.afc {
        padding: 6px;
      }

      .teams-container .teams-holder.nfc {
        padding: 6px;
        border-left: unset;
      }

      .team-selection-container .afc-teams-container {
        border: 1px solid #C0D0ED;
        border-right: unset;
        border-radius: 14px 14px 0 0;
        box-shadow: 4px 4px 4px 0px #E9F2FA;
      }

      .team-selection-container .nfc-teams-container {
        border: 1px solid #C0D0ED;
        border-left: 1px solid #E2E2E2;
        border-radius: 14px 14px 0 0;
        box-shadow: 4px 4px 4px 0px #E9F2FA;
      }

      .teams-container .teams-holder {
        gap: 8px;
      }

      .selection-text {
        font-size: 16px;
      }
    </style>

  {/function}
{/if}
<style>
  .team-selection-container {
    width: 63%;
    padding: 20px;
    border: 1px solid #2D2D2D;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 604px;
    background: #fff;
  }

  .selection-header {
    display: flex;
    justify-content: space-between;
  }

  .teams-container {
    display: flex;
    gap: 16px;
  }

  .team-selection-container .afc-teams-container,
  .team-selection-container .nfc-teams-container {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    border: 1px solid #E2E2E2;
    background: #FFF;
    box-shadow: 0px 4px 4px 0px #E9F2FA;
  }

  .teams-container .teams-header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px 0;
    border-radius: 12px 12px 0 0;
  }

  .afc-teams-container .teams-header {
    background: #CE1127;
  }

  .nfc-teams-container .teams-header {
    background: #003B74;
  }

  .teams-container .teams-holder {
    display: flex;
    padding: 11px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .selection-text {
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    color: black;
  }

  .slider-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 7px;
  }

  .text-all {
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: black;
  }

  .team-holder {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 48%;
    border: 1px solid #E2E2E2;
    border-radius: 2px;
    padding: 11px 8px;
    color: #999999;
  }

  {if $skip_shift == "true"}
    .team-holder {
      width: 47%;
      min-width: 47%;
    }
  {/if}

  .team-holder.selected {
    border-color: #37C77A;
    color: #2D2D2D;
    background: #c3f5d9;
  }

  .team-holder .team-name {
    font-weight: 500;
    font-size: 15px;
    line-height: 21px;
  }

  .team-holder .team-logo {
    width: 40px;
    height: auto;
    background: transparent !important;
    margin: unset;
  }

  .team-logo {
    background: transparent !important;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 27px;
    height: 16px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #999999;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 1px;
    bottom: 1px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked+.slider {
    background-color: #37C77A;
  }

  input:focus+.slider {
    box-shadow: 0 0 1px #37C77A;
  }

  input:checked+.slider:before {
    -webkit-transform: translateX(11px);
    -ms-transform: translateX(11px);
    transform: translateX(11px);
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>

{if !$is_desktop}
  {call getMDSTeamsMobileCSS}
{/if}
