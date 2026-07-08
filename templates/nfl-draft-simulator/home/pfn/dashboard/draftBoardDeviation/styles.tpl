<style>
  .draft-borad-deviations-container {
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
    gap: 12px;
  }

  .draft-borad-deviations-container .biggest-steal-container {
    margin-top: 2px;
  }
  
  .draft-borad-deviations-container .biggest-steal-container,
  .draft-borad-deviations-container .biggest-reach-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #dfdfdf;
    border-radius: 12px;
    width: 100%;
  }

  .biggest-steal-container .biggest-steal-header,
  .biggest-reach-container .biggest-reach-header {
    display: flex;
    justify-content: flex-start;
    padding: 6px 10px;
    color: #202224;
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    border-bottom: 1px solid #dfdfdf;
  }

  .biggest-steal-container .data-holder,
  .biggest-reach-container .data-holder {
    padding: 8px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .data-holder .player-name {
    color: #2d2d2d;
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    max-width: 120px;
  }

  .data-holder .rank-diffrence-holder {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .data-holder .rank-diffrence-holder .separator {
    border-left: 1px solid #dfdfdf;
    height: 48px;
  }

  .data-holder .board-rank-holder,
  .data-holder .drafted-pick-holder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;
  }

  .data-holder .board-rank,
  .data-holder .drafted-pick {
    color: #202224;
    font-size: 18px;
    font-style: italic;
    font-weight: 600;
    line-height: 18px;
  }

  .data-holder .board-rank-text,
  .data-holder .drafted-pick-text {
    color: #202224;
    font-size: 10px;
    font-weight: 400;
    line-height: 12px;
    width: 45px;
    text-align: center;
  }

  @media (max-width: 768px) {
    .data-holder .player-name {
      max-width: 140px;
    }
  }
</style>
