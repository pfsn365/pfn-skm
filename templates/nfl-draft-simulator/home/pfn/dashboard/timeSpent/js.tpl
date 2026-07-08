<script>
  function convertSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  }

  function showTotalTimeSpentWidget(userTimeSpent, stats, userRank, parentSelector) {
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      const userTime = parentContainer.querySelector(".total-time-spent-container .time-count");
      if (userTime) {
        const time = convertSeconds(userTimeSpent);
        userTime.innerHTML = time.hours + "h :" + "&nbsp&nbsp&nbsp" + time.minutes + "m :" + "&nbsp&nbsp&nbsp" + time
          .seconds + "s";
      }

      const userRankHolder = parentContainer.querySelector(".total-time-spent-container .rank-count");
      if (userRankHolder) {
        userRankHolder.innerHTML = userRank == 0 ? ">100" : userRank;
      }

      const allLeaders = parentContainer.querySelectorAll(".total-time-spent-container .single-leader");
      if (allLeaders.length) {
        allLeaders.forEach(element => addClass(element, "hidden"));
      }

      if (stats) {
        for (let i = 0; i < stats.length; i++) {
          const time = convertSeconds(stats[i].value);
          const nameHolder = allLeaders[i].querySelector(".leader-name");
          removeClass(allLeaders[i], "hidden");
          if (nameHolder) {
            nameHolder.innerHTML = stats[i].userName;
          }

          const hoursHolder = allLeaders[i].querySelector(".hours");
          if (hoursHolder) {
            hoursHolder.innerHTML = time.hours + "h";
          }

          const minutesHolder = allLeaders[i].querySelector(".minutes");
          if (minutesHolder) {
            minutesHolder.innerHTML = time.minutes + "m";
          }

          const secondsHolder = allLeaders[i].querySelector(".seconds");
          if (secondsHolder) {
            secondsHolder.innerHTML = time.seconds + "s";
          }
        }
      }
    }
  }
</script>
