{if !$is_desktop}
  {function getMDSPlayersMobileCSS}
    <style>
      .players-container {
        border: none;
        width: 100%;
      }

      .players-positions {
        border: none;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
      }

      .add-player {
        width: 50px;
        height: 26px;
        padding: 4px 10px;
      }

      .positions-filters .positions {
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
      }

      .filters-container {
        background: white;
      }

      .sim-nav-container {
        background: white;
      }

      .player-details .player-number {
        font-size: 14px;
      }

      .player-name-position-container .name {
        font-size: 15px;
      }

      .player-name-position-container .position {
        font-size: 13px;
      }

      .search-player-input {
        font-size: 16px;
      }
    </style>
  {/function}
{/if}
<style>
  .player-pool-text {
    padding: 5px 19px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #2D2D2D;
    background: #F5F5F5;
  }

  .teams-filters-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    width: 100%;
  }

  .players-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #E9E9E9;
    width: 60%;
  }

  .players-positions {
    display: flex;
    justify-content: space-evenly;
    border: 1px solid #E9E9E9;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1000;
  }

  .players-positions button {
    padding: 5px 10px;
    font-size: 14px;
    line-height: 21px;
    font-weight: 500;
    color: #666666;
    border: none;
  }

  .players-positions .positions.selected {
    color: #D32F2F;
    border-bottom: 2px solid #D32F2F;
  }

  .positions-filters {
    position: sticky;
    top: 45px;
    background: white;
    z-index: 1000;
  }

  .positions-filters .positions {
    display: flex;
    justify-content: flex-start;
    gap: 8px;
    padding: 10px 20px;
  }

  .positions-filters .positions button {
    font-size: 12px;
    line-height: 10px;
    font-weight: 500;
    padding: 8px 12px;
    color: #474747;
    border: 1px solid #E9E9E9;
    border-radius: 28px;
    background-color: #F5F5F5;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.07);
  }

  .positions-filters .positions .selected {
    background-color: #D32F2F;
    border: transparent;
    color: #fff;
  }

  .players-list {
    display: flex;
    flex-direction: column;
  }

  .player {
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 3px 4px 3px 0;
    margin: 0 20px;
    align-items: center;
  }

  .player img {
    background: none;
    height: unset;
  }

  .player-details {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 3px;
    cursor: pointer;
  }

  .player-details .player-number {
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    color: #2D2D2D;
    width: 24px;
  }

  .player-name-position-container {
    display: flex;
    flex-direction: column;
  }

  .player-name-position-container .name {
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
    color: #2D2D2D;
  }

  .player-name-position-container .position {
    font-size: 13px;
    line-height: 18px;
    font-weight: 400;
    color: #999999;
  }

  .player-buttons-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
  }

  .add-player {
    border: 1px solid #999999;
    border-radius: 28px;
    padding: 4px 12px;
    color: #999999;
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
  }

  .player-search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    padding: 0 20px;
  }

  .search-icon-holder {
    display: flex;
    justify-content: end;
    align-items: center;
    background: #f5f5f5;
    padding: 9px;
    border-radius: 25px 0 0 25px;
  }

  .search-icon-holder .search-icon {
    width: 16px;
    height: 16px;
    background: none;
    background: #f5f5f5;
  }

  .search-player-input {
    border: none;
    background: #f5f5f5;
    border-radius: 0 25px 25px 0;
    padding: 8px 12px 8px 0;
    width: 100%;
  }

  .search-player-input:focus {
    outline: none;
  }

  .player-info-btn {
    border: unset;
    display: flex;
  }
</style>

{if !$is_desktop}
  {call getMDSPlayersMobileCSS}
{/if}
