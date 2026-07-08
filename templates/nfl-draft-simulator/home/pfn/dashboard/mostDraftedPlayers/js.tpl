<script>
  function showMostDraftedPlayersWidget(data, parentSelector) {
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      let allRoundContainers = parentContainer.querySelectorAll(".most-drafted-players-container .round-data");
      if (allRoundContainers.length) {
        allRoundContainers.forEach(container => addClass(container, "hidden"));
      }

      Object.keys(data).forEach(round => {
        if (!data[round]) return;
        let roundContainerSelector = ".most-drafted-players-container .round-data." + round;
        const roundContainer = parentContainer.querySelector(roundContainerSelector);
        if (roundContainer) {
          removeClass(roundContainer, "hidden");
          const playerData = playersListAll.find(player => player.name === data[round]);
          if (playerData) {
            const playerNameHolder = roundContainer.querySelector(".player-name");
            if (playerNameHolder) {
              playerNameHolder.innerHTML = playerData.name;
            }

            const playerPositionHolder = roundContainer.querySelector(".position");
            if (playerPositionHolder) {
              playerPositionHolder.innerHTML = playerData.position;
            }

            const playerCollegeHolder = roundContainer.querySelector(".college");
            if (playerCollegeHolder) {
              playerCollegeHolder.innerHTML = playerData.draftFrom;
            }
          } else {
            addClass(roundContainer, "hidden");
          }
        }
      });
    }
  }
</script>
