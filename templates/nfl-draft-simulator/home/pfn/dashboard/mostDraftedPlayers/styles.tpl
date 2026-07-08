<style>
  .most-drafted-players-container {
    background: #fff;
    border: 1px solid #DFDFDF;
    box-shadow: 0px 2px 10px 0px #00000014;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 14px 10px;
    gap: 14px;
  }

  .most-drafted-players-container .drafted-players-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }

  .drafted-players-list .round-data {
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-bottom: 12px;
  }

  .drafted-players-list .round-data:last-child {
    padding-bottom: unset;
    border-bottom: unset;
  }

  .round-data .player-data {
    display: flex;
    flex-direction: column;
    gap: 3px;
    justify-content: center;
    align-items: flex-start;
  }

  .round-data .player-data .player-name {
    color: #2d2d2d;
    font-size: 13px;
    font-weight: 500;
    line-height: 14px;
  }

  .player-data .player-info {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
    color: #999999;
    font-size: 12px;
    font-weight: 400;
    line-height: 13px;
  }

  .round-data .round-number {
    color: #999999;
    font-size: 13px;
    font-weight: 500;
    line-height: 14px;
  }
</style>
