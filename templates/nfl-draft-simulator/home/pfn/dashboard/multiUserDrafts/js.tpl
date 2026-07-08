<script>
  function showMultiUserDraftsWidget(data, stats, parentSelector) {
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      const multiUserDraftsWidget = parentContainer.querySelector(".multi-user-draft-data-container");
      if (multiUserDraftsWidget) {
        removeClass(multiUserDraftsWidget, "hidden");
      }

      const hostedUserCountHolder = parentContainer.querySelector(".drafts-hosted-container .user-data .draft-count");
      if (hostedUserCountHolder) {
        hostedUserCountHolder.innerHTML = data.multiUserDraftsHostedCount;
      }

      const avgUserCountHolder = parentContainer.querySelector(".drafts-hosted-container .average-data .draft-count");
      if (avgUserCountHolder) {
        avgUserCountHolder.innerHTML = stats.highestMultiUserDraftsHosted.toFixed();
      }

      const joinedUserCountHolder = parentContainer.querySelector(".drafts-joined-container .user-data .draft-count");
      if (joinedUserCountHolder) {
        joinedUserCountHolder.innerHTML = data.multiUserDraftsJoinedCount;
      }

      const avgJoinedCountHolder = parentContainer.querySelector(".drafts-joined-container .average-data .draft-count");
      if (avgJoinedCountHolder) {
        avgJoinedCountHolder.innerHTML = stats.highestMultiUserDraftsJoined.toFixed();
      }
    }
  }

  function hideMultiUserDraftsWidget(parentSelector) {
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      const multiUserDraftsWidget = parentContainer.querySelector(".multi-user-draft-data-container");
      if (multiUserDraftsWidget) {
        addClass(multiUserDraftsWidget, "hidden");
      }
    }
  }
</script>
