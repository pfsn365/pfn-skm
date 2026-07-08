<script>
  function showDraftDeviationWidget(biggestReach, biggestSteal, parentSelector) {
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      const biggestReachPlayerNameHolder = parentContainer.querySelector(".draft-borad-deviations-container .biggest-reach-container .player-name");
      if (biggestReachPlayerNameHolder) {
        biggestReachPlayerNameHolder.innerHTML = biggestReach.playerName != "" ? biggestReach.playerName : "--";
      }

      const biggestReachRankHolder = parentContainer.querySelector(".draft-borad-deviations-container .biggest-reach-container .board-rank");
      if (biggestReachRankHolder) {
        biggestReachRankHolder.innerHTML = biggestReach.bigBoardRank != "" ? biggestReach.bigBoardRank : "00";
      }

      const biggestReachPickHolder = parentContainer.querySelector(".draft-borad-deviations-container .biggest-reach-container .drafted-pick");
      if (biggestReachPickHolder) {
        biggestReachPickHolder.innerHTML = biggestReach.draftedPick != "" ? biggestReach.draftedPick : "00";
      }

      const biggestStealPlayerNameHolder = parentContainer.querySelector(".draft-borad-deviations-container .biggest-steal-container .player-name");
      if (biggestStealPlayerNameHolder) {
        biggestStealPlayerNameHolder.innerHTML = biggestSteal.playerName != "" ? biggestSteal.playerName : "--";
      }

      const biggestStealRankHolder = parentContainer.querySelector(".draft-borad-deviations-container .biggest-steal-container .board-rank");
      if (biggestStealRankHolder) {
        biggestStealRankHolder.innerHTML = biggestSteal.bigBoardRank != "" ? biggestSteal.bigBoardRank : "00";
      }

      const biggestStealPickHolder = parentContainer.querySelector(".draft-borad-deviations-container .biggest-steal-container .drafted-pick");
      if (biggestStealPickHolder) {
        biggestStealPickHolder.innerHTML = biggestSteal.draftedPick != "" ? biggestSteal.draftedPick : "00";
      }
    }
  }
</script>
