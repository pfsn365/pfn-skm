<script>
  var parentContainerSelector;

  function updateDashboardSection(e, parentSelector) {
    if (parentSelector) {
      parentContainerSelector = parentSelector;
    } else if (parentContainerSelector) {
      parentSelector = parentContainerSelector;
    } else {
      parentSelector = ".draft-options-view-container .dashboard-container";
    }

    const parentContainer = $(parentSelector);
    if (parentContainer) {
      const allDasboardBtns = parentContainer.querySelectorAll(".dashboard-section-btn");
      allDasboardBtns.forEach(btn => removeClass(btn, "selected"));
      if (e) {
        addClass(e.target, "selected");
        showDashboardSectionData(e.target.dataset.section, parentSelector);
      } else {
        const overallHeaderBtn = parentContainer.querySelector(".dashboard-section-btn.overall");
        if (overallHeaderBtn) {
          addClass(overallHeaderBtn, "selected");
          showDashboardSectionData("overall", parentSelector);
        }
      }
    }
  }

  function showDashboardSectionData(section, parentSelector) {
    if (dashboardUserData.userName) {
      userData = dashboardUserData[section];
      statsData = dashboardUserData["stats"][section];
      if (section === "overall" || section === "multiUser") {
        showMultiUserDraftsWidget(userData, statsData, parentSelector);
      } else {
        hideMultiUserDraftsWidget(parentSelector);
      }

      showPicksByConferenceWidget(userData.conferenceDraftCount, parentSelector);
      showMostDraftedPlayersWidget(userData.mostPickedPlayerInEachRound, parentSelector);
      showDraftDeviationWidget(userData.biggestReach, userData.biggestSteal, parentSelector);
      showMilestones(userData, statsData, parentSelector);
      showDraftsCompletionChart(userData.draftsStartedCount, userData.draftsFinishedCount, statsData.totalDraftsStarted,
        statsData.totalDraftsCompleted, parentSelector);
      showTradesCompletionChart(userData.tradesInitiatedCount, userData.tradesCompletedCount, statsData
        .totalTradesInitiated,
        statsData.totalTradesCompleted, parentSelector);

      const statsTimeSpentData = section === "overall" ? dashboardUserData.stats.overallTimeSpentToppers : statsData
        .timeSpentToppers;
      showTotalTimeSpentWidget(userData.timeSpent, statsTimeSpentData, userData.timeSpentRank, parentSelector);

      const statsDraftFinishedData = section === "overall" ? dashboardUserData.stats.overallDraftsFinishedToppers :
        statsData.draftsFinishedToppers;
      showTotalMockDraftsWidget(userData.draftsFinishedCount, statsDraftFinishedData, userData.draftsFinishedRank,
        parentSelector);

      showUserInsights(dashboardUserData.userName, dashboardUserData.image, userData, parentSelector);
    } else {
      showUserInsights();
    }
  }
</script>
