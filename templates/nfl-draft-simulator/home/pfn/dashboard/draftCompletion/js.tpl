{literal}
  <script>
    function showDraftsCompletionChart(userDraftsStartedCount, userDraftsFinishedCount, totalDraftsStarted,
      totalDraftsCompleted, parentSelector) {
      const parentContainer = $(parentSelector);
      if (parentContainer) {
        let userDraftCompletionPercentage = ((userDraftsFinishedCount / userDraftsStartedCount) * 100).toFixed();
        if (userDraftCompletionPercentage === "NaN") {
          userDraftCompletionPercentage = 0;
        }
        let averageDraftCompletionPercentage = ((totalDraftsCompleted / totalDraftsStarted) * 100).toFixed();
        if (averageDraftCompletionPercentage === "NaN") {
          averageDraftCompletionPercentage = 0;
        }
        const userChart = parentContainer.querySelector(
          ".draft-completion-charts-container .user-draft-participation-chart");
        if (userChart) {
          userChart.style.background = `conic-gradient(#0857C3 0% ${userDraftCompletionPercentage}%, #d2d3d4 ${userDraftCompletionPercentage}% 100%)`;
        }
        const userChartPercentageText = parentContainer.querySelector(
          ".draft-completion-charts-container .user-draft-participation-chart .chart-percentage-text");
        if (userChartPercentageText) {
          userChartPercentageText.innerHTML = userDraftCompletionPercentage + "%";
        }

        const averageChart = parentContainer.querySelector(
          ".draft-completion-charts-container .average-draft-participation-chart");
        if (averageChart) {
          averageChart.style.background = `conic-gradient(#4F5378 0% ${averageDraftCompletionPercentage}%, #d2d3d4 ${averageDraftCompletionPercentage}% 100%)`;
        }
        const averageChartPercentageText = parentContainer.querySelector(
          ".draft-completion-charts-container .average-draft-participation-chart .chart-percentage-text");
        if (averageChartPercentageText) {
          averageChartPercentageText.innerHTML = averageDraftCompletionPercentage + "%";
        }

        const participationTextHolder = parentContainer.querySelector(
          ".draft-completion-count-container .participation .count");
        if (participationTextHolder) {
          participationTextHolder.innerHTML = userDraftsStartedCount + " :";
        }

        const completionTextHolder = parentContainer.querySelector(
        ".draft-completion-count-container .completion .count");
        if (completionTextHolder) {
          completionTextHolder.innerHTML = userDraftsFinishedCount + " :";
        }
      }
    }
  </script>
{/literal}
