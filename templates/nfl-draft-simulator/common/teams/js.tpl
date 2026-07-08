<script>
  function teamSelected(target) {
    if (target.classList.contains("selected")) {
      removeClass(target, "selected");
    } else {
      addClass(target, "selected");
    }
  }

  function enableStartBtn() {
    var teams = $all(".teams-container .team-holder");
    var enabled = false;
    for (var i = 0; i < teams.length; i++) {
      if (teams[i].classList.contains("selected")) {
        enabled = true;
        break;
      }
    }
    var startBtn = $(".start-draft-btn");
    if (startBtn) {
      if (enabled) {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
      } else {
        startBtn.disabled = true;
        startBtn.style.opacity = "0.4";
      }
    }
  }

  function selectAllTeams(target) {
    var teams = $all(".teams-container .team-holder");
    var startBtn = $(".start-draft-btn");
    if (target.checked) trackGAEventForPage("select_all_teams");
    else trackGAEventForPage("clear_all_teams");
    if (teams.length > 0) {
      for (var i = 0; i < teams.length; i++) {
        if (target.checked) {
          addClass(teams[i], "selected");
        } else {
          removeClass(teams[i], "selected");
        }
      }
    }
  }
</script>
