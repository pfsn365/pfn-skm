<style>
  .trade-completion-charts-container {
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

  .trade-completion-charts-container .trade-completion-text {
    padding: 0 10px;
  }

  .trade-completion-charts-container .trade-completion-charts-holder {
    margin-top: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 80px;
    padding: 0 10px;
  }

  .trade-completion-charts-holder .user-chart-container,
  .trade-completion-charts-holder .average-chart-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .trade-completion-charts-holder .user-text,
  .trade-completion-charts-holder .average-text {
    color: #666666;
    font-size: 13px;
    font-weight: 500;
    line-height: 15px;
  }

  .trade-completion-charts-container .trade-completion-count-container {
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

  .trade-completion-charts-container .trade-completion-count-container .participation,
  .trade-completion-charts-container .trade-completion-count-container .completion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .trade-completion-count-container .count {
    color: #2d2d2d;
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
  }

  .trade-completion-count-container .attempted-text,
  .trade-completion-count-container .converted-text {
    color: #666666;
    font-size: 13px;
    font-weight: 400;
    line-height: 14px;
  }

  .trade-completion-charts-container .user-trade-attempted-chart {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: conic-gradient(#0857C3 0% 50%, #d2d3d4 0% 50%);
    position: relative;
  }

  .trade-completion-charts-container .user-trade-attempted-subchart {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #FFFFFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .trade-completion-charts-container .average-trade-attempted-chart {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: conic-gradient(#4F5378 0% 45%, #d2d3d4 0% 45%);
    position: relative;
  }

  .trade-completion-charts-container .average-trade-attempted-subchart {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #FFFFFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .trade-completion-charts-container .chart-percentage-text {
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
