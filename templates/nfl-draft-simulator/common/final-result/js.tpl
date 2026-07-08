<script>
    var userVisitCount = getLocalStorageData("multi_user_mds_visit_count");

    if (!userVisitCount) userVisitCount = 1;
    else userVisitCount++;
    setLocalStorageData("multi_user_mds_visit_count", userVisitCount);

    function showMdsFeedback() {
        if (userVisitCount == 1) {
            var feedbackContainer = $('.nfl-feedback-container');
            if (feedbackContainer && hasClass(feedbackContainer, "hidden")) {
                removeClass(feedbackContainer, "hidden");
            }
        }
    }
</script>
