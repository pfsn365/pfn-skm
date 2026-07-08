{literal}
  <script>
    function showTradesCompletionChart(userTradesStartedCount, userTradesFinishedCount, totalTradesStarted,
      totalTradesCompleted, parentSelector) {
      const parentContainer = $(parentSelector);
      if (parentContainer) {
        let usertradeCompletionPercentage = ((userTradesFinishedCount / userTradesStartedCount) * 100).toFixed();
        if (usertradeCompletionPercentage === "NaN") {
          usertradeCompletionPercentage = 0
        }
        let averagetradeCompletionPercentage = ((totalTradesCompleted / totalTradesStarted) * 100).toFixed();
        if (averagetradeCompletionPercentage === "NaN") {
          averagetradeCompletionPercentage = 0
        }
        const userChart = parentContainer.querySelector(".trade-completion-charts-container .user-trade-attempted-chart");
        if (userChart) {
          userChart.style.background = `conic-gradient(#0857C3 0% ${usertradeCompletionPercentage}%, #d2d3d4 ${usertradeCompletionPercentage}% 100%)`;
        }
        const userChartPercentageText = parentContainer.querySelector(
          ".trade-completion-charts-container .user-trade-attempted-chart .chart-percentage-text");
        if (userChartPercentageText) {
          userChartPercentageText.innerHTML = usertradeCompletionPercentage + "%";
        }

        const averageChart = parentContainer.querySelector(".trade-completion-charts-container .average-trade-attempted-chart");
        if (averageChart) {
          averageChart.style.background = `conic-gradient(#4F5378 0% ${averagetradeCompletionPercentage}%, #d2d3d4 ${averagetradeCompletionPercentage}% 100%)`;
        }
        const averageChartPercentageText = parentContainer.querySelector(
          ".trade-completion-charts-container .average-trade-attempted-chart .chart-percentage-text");
        if (averageChartPercentageText) {
          averageChartPercentageText.innerHTML = averagetradeCompletionPercentage + "%";
        }

        const participationTextHolder = parentContainer.querySelector(".trade-completion-count-container .attempted .count");
        if (participationTextHolder) {
          participationTextHolder.innerHTML = userTradesStartedCount + " :";
        }

        const completionTextHolder = parentContainer.querySelector(".trade-completion-count-container .conversion .count");
        if (completionTextHolder) {
          completionTextHolder.innerHTML = userTradesFinishedCount + " :";
        }
      }
    }
  </script>
{/literal}
