<style>
  .draft-completion-charts-container {
    background: #fff;
    border: 1px solid #DFDFDF;
    box-shadow: 0px 2px 10px 0px #00000014;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 14px 0 0 0;
  }

  .draft-completion-charts-container .draft-completion-text {
    padding: 0 10px;
  }

  .draft-completion-charts-container .draft-completion-charts-holder {
    margin-top: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 80px;
    padding: 0 10px;
  }

  .draft-completion-charts-holder .user-chart-container,
  .draft-completion-charts-holder .average-chart-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .draft-completion-charts-holder .user-text,
  .draft-completion-charts-holder .average-text {
    color: #666666;
    font-size: 13px;
    font-weight: 500;
    line-height: 15px;
  }

  .draft-completion-charts-container .draft-completion-count-container {
    background: #f5f5f5;
    border-top: 1px solid #dfdfdf;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 11px;
    padding: 8px 9px;
    width: 100%;
    margin-top: 10px;
    border-radius: 0 0 12px 12px;
  }

  .draft-completion-charts-container .draft-completion-count-container .participation,
  .draft-completion-charts-container .draft-completion-count-container .completion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .draft-completion-count-container .count {
    color: #2d2d2d;
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
  }

  .draft-completion-count-container .participated-text,
  .draft-completion-count-container .completion-text {
    color: #666666;
    font-size: 13px;
    font-weight: 400;
    line-height: 14px;
  }

  .draft-completion-charts-container .user-draft-participation-chart {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: conic-gradient(#0857C3 0% 50%, #d2d3d4 0% 50%);
    position: relative;
  }

  .draft-completion-charts-container .user-draft-participation-subchart {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #FFFFFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .draft-completion-charts-container .average-draft-participation-chart {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: conic-gradient(#4F5378 0% 61%, #d2d3d4 0% 61%);
    position: relative;
  }

  .draft-completion-charts-container .average-draft-participation-subchart {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #FFFFFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .draft-completion-charts-container .chart-percentage-text {
    position: absolute;
    font-size: 12px;
    top: 52%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #2d2d2d;
    font-size: 15px;
    font-weight: 500;
    line-height: 20px;
  }
</style>
