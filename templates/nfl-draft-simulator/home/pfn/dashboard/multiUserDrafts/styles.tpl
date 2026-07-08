<style>
  .multi-user-draft-data-container {
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
  }

  .multi-user-draft-data-container .drafts-hosted-container {
    border-bottom: 1px solid #E9E9E9;
    margin-top: 14px;
    padding-bottom: 8px;
  }

  .multi-user-draft-data-container .drafts-hosted-container,
  .multi-user-draft-data-container .drafts-joined-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .multi-user-draft-data-container .drafts-joined-container {
    margin-top: 8px;
  }

  .multi-user-draft-data-container .drafts-hosted-container .separator,
  .multi-user-draft-data-container .drafts-joined-container .separator {
    border-left: 1px solid #dfdfdf;
    height: 36px;
  }

  .drafts-hosted-container .hosted-text,
  .drafts-joined-container .joined-text {
    color: #666666;
    font-size: 13px;
    font-weight: 400;
    line-height: 15px;
  }

  .multi-user-draft-data-container .vs-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 0 18px;
  }

  .vs-container .user-data,
  .vs-container .average-data {
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

  .average-data .draft-count {
    color: #202224;
    font-size: 18px;
    font-style: italic;
    font-weight: 600;
    line-height: 18px;
  }

  .user-text,
  .average-text {
    color: #202224;
    font-size: 10px;
    font-weight: 400;
    line-height: 12px;
  }
</style>
