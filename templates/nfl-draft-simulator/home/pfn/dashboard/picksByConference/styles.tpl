<style>
  .picks-by-conference-container {
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

  .picks-by-conference-container .conferences-holder {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .conferences-holder .single-conference {
    border: 1px solid #dfdfdf;
    border-radius: 8px;
    padding: 10px 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 31%;
  }

  .single-conference .picks-count {
    color: #2d2d2d;
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
  }

  .single-conference .conference-name {
    color: #999999;
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
  }

  @media(max-width: 768px) {
    .conferences-holder .single-conference {
      width: 31.5%;
    }
  }
</style>
