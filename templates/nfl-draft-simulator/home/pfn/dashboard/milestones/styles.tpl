<style>
  .milestones-container {
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

  .milestones-container .milestones-data-holder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .milestones-data-holder .milestone {
    border: 1px solid #DFDFDF;
    border-radius: 12px;
    width: 100%;
  }

  .milestone .header-text {
    padding: 6px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #DFDFDF;
    color: #202224;
    font-size: 13px;
    font-weight: 400;
    line-height: 14px;
  }

  .milestone .milestone-data {
    padding: 12px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .milestone-data .date {
    color: #202224;
    font-size: 13px;
    font-weight: 600;
    line-height: 14px;
  }

  .milestone-data .vs-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  .vs-container .separator {
    border-left: 1px solid #dfdfdf;
    height: 36px;
  }

  .vs-container .user-data,
  .vs-container .highest-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;
  }

  .user-data .draft-count {
    color: #0857C3;
    font-size: 18px;
    font-style: italic;
    font-weight: 600;
    line-height: 18px;
  }

  .highest-data .draft-count {
    color: #202224;
    font-size: 18px;
    font-style: italic;
    font-weight: 600;
    line-height: 18px;
  }

  .vs-container .user-text,
  .vs-container .highest-text {
    color: #202224;
    font-size: 11px;
    font-weight: 400;
    line-height: 12px;
  }
</style>
