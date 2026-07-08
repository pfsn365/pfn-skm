<script>
  function showUserInsights(userName, userImage, data, parentSelector) {
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      const nameHolder = parentContainer.querySelector(".user-insights-container .username");
      if (!userName) {
        userName = decodeURIComponent(getCookie("fw_name"));
      }

      if (nameHolder && userName) {
        nameHolder.innerHTML = userName;
      }

      const imageHolder = parentContainer.querySelector(".user-insights-container .user-image");
      if (!userImage) {
        userImage = decodeURIComponent(getCookie("{$.const.COOKIE_USER_PICTURE_LARGE}"));
        if (!userImage) {
          userImage = STATIC_URL + "/skm/assets/nfl-mockup/dash-default-user-img.png";
        }
      }

      if (imageHolder && userImage) {
        imageHolder.src = userImage;
      }

      if (data) {
        const totalDraftsHolder = parentContainer.querySelector(".user-insights-container .drafted-data-section .drafts .drafted-info-value");
        if (totalDraftsHolder) {
          totalDraftsHolder.innerHTML = data.draftsFinishedCount;
        }

        const hostDraftedPlayer = parentContainer.querySelector(
          ".user-insights-container .drafted-data-section .most-drafted-player .drafted-info-value");
        if (hostDraftedPlayer) {
          hostDraftedPlayer.innerHTML = data.mostDraftedPlayer;
        }

        const averageRounds = parentContainer.querySelector(".user-insights-container .drafted-data-section .average-rounds .drafted-info-value");
        if (averageRounds) {
          let averageRoundsCount = Math.round(data.totalRounds / data.draftsFinishedCount).toFixed();
          if (averageRoundsCount === "NaN") {
            averageRoundsCount = 0;
          }
          averageRounds.innerHTML = averageRoundsCount;
        }

        const favouriteCollege = parentContainer.querySelector(
          ".user-insights-container .drafted-data-section .favourite-college .drafted-info-value");
        if (favouriteCollege) {
          favouriteCollege.innerHTML = data.favouriteCollege;
        }

        const tradesCompleted = parentContainer.querySelector(
          ".user-insights-container .drafted-data-section .trades-completed .drafted-info-value");
        if (tradesCompleted) {
          tradesCompleted.innerHTML = data.tradesCompletedCount;
        }
      }
    }
  }
</script>
