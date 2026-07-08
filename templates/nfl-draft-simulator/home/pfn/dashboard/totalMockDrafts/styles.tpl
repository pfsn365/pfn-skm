<style>
  .total-drafts-container {
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

  .total-drafts-container .header-container {
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

  .header-container .user-drafts-rank-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }

  .user-drafts-rank-container .rank-container,
  .user-drafts-rank-container .drafts-count-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .user-drafts-rank-container .separator {
    border-left: 1px solid #dfdfdf;
    height: 41px;
  }

  .user-drafts-rank-container .rank-text,
  .user-drafts-rank-container .drafts-count-text {
    color: #666666;
    font-size: 12px;
    font-weight: 400;
    line-height: 13px;
  }

  .user-drafts-rank-container .rank-count,
  .user-drafts-rank-container .drafts-count {
    color: #202224;
    font-size: 24px;
    font-style: italic;
    font-weight: 600;
    line-height: 28px;
  }

  .total-drafts-container .leaders-container {
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

  .single-leader .drafts-count {
    color: #2d2d2d;
    font-size: 13px;
    font-weight: 600;
    line-height: 15px;
  }

  @media (max-width: 768px) {
    .user-drafts-rank-container .rank-container,
    .user-drafts-rank-container .drafts-count-container {
      align-items: flex-start;
    }
  }
</style>
