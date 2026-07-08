<script>
  function showMilestones(userData, stats, parentSelector) {
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      // Daily data
      const dailyDateHolder = parentContainer.querySelector(".milestones-container .day-drafts .date");
      if (dailyDateHolder) {
        dailyDateHolder.innerHTML = userData.mostDraftedDurationCount.daily.date;
      }

      const dailyUserCountHolder = parentContainer.querySelector(".milestones-container .day-drafts .user-data .draft-count");
      if (dailyUserCountHolder) {
        dailyUserCountHolder.innerHTML = userData.mostDraftedDurationCount.daily.count;
      }

      const dailyHighestCountHolder = parentContainer.querySelector(".milestones-container .day-drafts .highest-data .draft-count");
      if (dailyHighestCountHolder) {
        dailyHighestCountHolder.innerHTML = stats.highestDailyDrafts;
      }

      // Weekly data
      const weeklyDateHolder = parentContainer.querySelector(".milestones-container .week-drafts .date");
      if (weeklyDateHolder) {
        weeklyDateHolder.innerHTML = userData.mostDraftedDurationCount.weekly.date;
      }

      const weeklyUserCountHolder = parentContainer.querySelector(".milestones-container .week-drafts .user-data .draft-count");
      if (weeklyUserCountHolder) {
        weeklyUserCountHolder.innerHTML = userData.mostDraftedDurationCount.weekly.count;
      }

      const weeklyHighestCountHolder = parentContainer.querySelector(".milestones-container .week-drafts .highest-data .draft-count");
      if (weeklyHighestCountHolder) {
        weeklyHighestCountHolder.innerHTML = stats.highestWeeklyDrafts;
      }

      // Monthly data
      const monthlyDateHolder = parentContainer.querySelector(".milestones-container .month-drafts .date");
      if (monthlyDateHolder) {
        monthlyDateHolder.innerHTML = userData.mostDraftedDurationCount.monthly.date;
      }

      const monthlyUserCountHolder = parentContainer.querySelector(".milestones-container .month-drafts .user-data .draft-count");
      if (monthlyUserCountHolder) {
        monthlyUserCountHolder.innerHTML = userData.mostDraftedDurationCount.monthly.count;
      }

      const monthlyHighestCountHolder = parentContainer.querySelector(".milestones-container .month-drafts .highest-data .draft-count");
      if (monthlyHighestCountHolder) {
        monthlyHighestCountHolder.innerHTML = stats.highestMonthlyDrafts;
      }

      // Most Players Drafted in a day mock
      const mostDraftedPlayerDateHolder = parentContainer.querySelector(".milestones-container .most-players-drafts .date");
      if (mostDraftedPlayerDateHolder) {
        mostDraftedPlayerDateHolder.innerHTML = userData.mostPlayersDraftedInSingleDraft.date;
      }

      const mostDraftedPlayerCountHolder = parentContainer.querySelector(".milestones-container .most-players-drafts .user-data .draft-count");
      if (mostDraftedPlayerCountHolder) {
        mostDraftedPlayerCountHolder.innerHTML = userData.mostPlayersDraftedInSingleDraft.count;
      }

      const mostDraftedPlayerHighestCountHolder = parentContainer.querySelector(
        ".milestones-container .most-players-drafts .highest-data .draft-count");
      if (mostDraftedPlayerHighestCountHolder) {
        mostDraftedPlayerHighestCountHolder.innerHTML = stats.mostPlayersDraftedInSingleDraft;
      }

      // Most Trades completed in a day mock
      const mostTradesDateHolder = parentContainer.querySelector(".milestones-container .most-trades-drafts .date");
      if (mostTradesDateHolder) {
        mostTradesDateHolder.innerHTML = userData.mostTradesInSingleDraft.date;
      }

      const mostTradesCountHolder = parentContainer.querySelector(".milestones-container .most-trades-drafts .user-data .draft-count");
      if (mostTradesCountHolder) {
        mostTradesCountHolder.innerHTML = userData.mostTradesInSingleDraft.count;
      }

      const mostTradesHighestCountHolder = parentContainer.querySelector(".milestones-container .most-trades-drafts .highest-data .draft-count");
      if (mostTradesHighestCountHolder) {
        mostTradesHighestCountHolder.innerHTML = stats.mostTradesCompletedInADraft;
      }
    }
  }
</script>
