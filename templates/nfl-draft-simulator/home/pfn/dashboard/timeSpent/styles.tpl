<style>
  .total-time-spent-container {
    background: #fff;
    border: 1px solid #DFDFDF;
    box-shadow: 0px 2px 10px 0px #00000014;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .total-time-spent-container .header-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;
    padding: 14px 10px;
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid #f5f5f5;
    background: linear-gradient(180deg, #FFFFFF 0%, #FFF8ED 100%);
    box-shadow: 0px 2px 10px 0px #00000014;
  }

  .header-container .user-rank-time-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .user-rank-time-container .rank-container,
  .user-rank-time-container .time-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .user-rank-time-container .time-container {
    align-items: flex-end;
    gap: 5px;
  }

  .user-rank-time-container .rank-text,
  .user-rank-time-container .time-text {
    color: #666666;
    font-size: 12px;
    font-weight: 400;
    line-height: 13px;
  }

  .user-rank-time-container .rank-count {
    color: #202224;
    font-size: 24px;
    font-style: italic;
    font-weight: 600;
    line-height: 28px;
  }

  .user-rank-time-container .time-count {
    color: #202224;
    font-size: 15px;
    font-weight: 500;
    line-height: 15px;
  }

  .total-time-spent-container .leaders-container {
    padding: 16px 9px 14px 9px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 8px;
  }

  .leaders-container .leaders-header-text {
    color: #666666;
    font-size: 12px;
    font-weight: 600;
    line-height: 14px;
  }

  .leaders-container .leaders-holder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    gap: 8px;
    width: 100%;
  }

  .leaders-holder .single-leader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 8px;
    width: 100%;
  }

  .leaders-holder .single-leader:last-child {
    border-bottom: unset;
    padding-bottom: unset;
  }

  .single-leader .rank-name-holder {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .rank-name-holder .leader-rank {
    color: #2d2d2d;
    font-size: 20px;
    font-style: italic;
    font-weight: 600;
    line-height: 23px;
  }

  .rank-name-holder .leader-name {
    color: #666666;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
  }

  .single-leader .time-spent-count {
    color: #202224;
    font-size: 13px;
    font-weight: 500;
    line-height: 15px;
  }

  .single-leader .time-spent-count .hours,
  .single-leader .time-spent-count .minutes,
  .single-leader .time-spent-count .seconds {
    display: inline-block;
    width: 25px;
    text-align: end;
  }

  @media (max-width: 768px) {
    .user-rank-time-container .rank-container {
      align-items: flex-start;
    }
  }
</style>
