<script>
  function showTotalMockDraftsWidget(userDraftFinishedCount, stats, userRank, parentSelector) {
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      const draftCountHolder = parentContainer.querySelector(".total-drafts-container .drafts-count");
      if (draftCountHolder) {
        draftCountHolder.innerHTML = userDraftFinishedCount;
      }

      const userRankHolder = parentContainer.querySelector(".total-drafts-container .rank-count");
      if (userRankHolder) {
        userRankHolder.innerHTML = userRank == 0 ? ">100" : userRank;
      }

      const allLeaders = parentContainer.querySelectorAll(".total-drafts-container .single-leader");
      if (allLeaders.length) {
        allLeaders.forEach(element => addClass(element, "hidden"));
      }

      if (stats) {
        for (let i = 0; i < stats.length; i++) {
          removeClass(allLeaders[i], "hidden");
          const nameHolder = allLeaders[i].querySelector(".leader-name");
          if (nameHolder) {
            nameHolder.innerHTML = stats[i].userName;
          }

          const countHolder = allLeaders[i].querySelector(".drafts-count");
          if (countHolder) {
            countHolder.innerHTML = stats[i].value;
          }
        }
      }
    }
  }
</script>
