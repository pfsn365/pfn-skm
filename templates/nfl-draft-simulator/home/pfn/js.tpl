<script>
  const dashboardUserDataUrl = "{$smarty.const.GOTHAM_URL_PFN_FRONTEND}" + "/pfn/nfl/mds/dashboard";
  const dashboardStatsDataUrl = "{$smarty.const.GOTHAM_URL_PFN_FRONTEND}" + "/pfn/nfl/mds/dashboard/stats";
  const logoutUrl = "{$smarty.const.GOTHAM_URL_PFN_FRONTEND}" + "/pfn/logout";

  function logoutMDS() {
    fetch(logoutUrl, {
        method: "POST",
        credentials: 'include',
      })
      .then(res => res.json())
      .then(res => {
        if (res.status === true) {
          removeFromLocalStorage("PFN_MDS_USER_IMAGE");
          removeFromLocalStorage("PFN_MDS_USER_NAME");
          window.location.reload();
        }
      })
      .catch(err => console.log(err))
  }

  function showMDSLogoutButton() {
    const mdsLogoutBtn = $(".draft-option-btn .mds-logout-btn");
    if (mdsLogoutBtn) {
      if (hasClass(mdsLogoutBtn, "hidden")) {
        removeClass(mdsLogoutBtn, "hidden");
      } else {
        addClass(mdsLogoutBtn, "hidden");
      }
    }
  }

  async function changeDraftOption(e) {
    let draftOptions = $all(".landing-page-container .draft-option-btn");
    if (draftOptions.length) {
      draftOptions.forEach(option => removeClass(option, "selected"));
    }

    let rightArrows = $all(".draft-option-btn .triangle-right");
    if (rightArrows.length) {
      rightArrows.forEach(arrow => addClass(arrow, "hidden"));
    }

    let whiteLogos = $all(".draft-option-btn .logo-white");
    if (whiteLogos.length) {
      whiteLogos.forEach(logo => addClass(logo, "hidden"));
    }

    let blackLogos = $all(".draft-option-btn .logo-black");
    if (blackLogos.length) {
      blackLogos.forEach(logo => removeClass(logo, "hidden"));
    }

    await yieldToMain();

    targetBtn = e.target.closest(".draft-option-btn");
    if (targetBtn) {
      if (targetBtn.dataset.type === "solo" || targetBtn.dataset.type === "solo-year") {
        addClass(targetBtn, "selected");
        let rightArrow = targetBtn.querySelector(".triangle-right");
        if (rightArrow) {
          removeClass(rightArrow, "hidden");
        }

        const whiteLogo = targetBtn.querySelector(".logo-white");
        if (whiteLogo) {
          removeClass(whiteLogo, "hidden");
        }

        const blackLogo = targetBtn.querySelector(".logo-black");
        if (blackLogo) {
          addClass(blackLogo, "hidden");
        }

        showSoloDraftView(targetBtn.dataset.type);
      }

      if (targetBtn.dataset.type === "multi") {
        addClass(targetBtn, "selected");
        let rightArrow = targetBtn.querySelector(".triangle-right");
        if (rightArrow) {
          removeClass(rightArrow, "hidden");
        }

        const whiteLogo = targetBtn.querySelector(".logo-white");
        if (whiteLogo) {
          removeClass(whiteLogo, "hidden");
        }

        const blackLogo = targetBtn.querySelector(".logo-black");
        if (blackLogo) {
          addClass(blackLogo, "hidden");
        }

        showMultiDraftView();
      }

      if (targetBtn.dataset.type === "dashboard") {
        addClass(targetBtn, "selected");
        let rightArrow = targetBtn.querySelector(".triangle-right");
        if (rightArrow) {
          removeClass(rightArrow, "hidden");
        }

        const whiteLogo = targetBtn.querySelector(".logo-white");
        if (whiteLogo) {
          removeClass(whiteLogo, "hidden");
        }

        const blackLogo = targetBtn.querySelector(".logo-black");
        if (blackLogo) {
          addClass(blackLogo, "hidden");
        }

        showMDSDashboard();
      }
    }
  }

  function showSoloDraftView(type) {
    if (type === "solo") {
      const soloDraftView = $(".draft-options-view-container .teams-filters-container");
      if (soloDraftView) {
        removeClass(soloDraftView, "hidden");
      }

      const playersListSelectionContainer = $(".draft-options-view-container .players-list-selection-container");
      if (playersListSelectionContainer) {
        removeClass(playersListSelectionContainer, "hidden");
      }

      const yearSelectionContainer = $(".draft-options-view-container .year-list-selection-container");
      if (yearSelectionContainer) {
        addClass(yearSelectionContainer, "hidden");
      }

      // Restore original data when switching back from redraft
      if (isRedraft) {
        restoreOriginalMDSData();
      }
    }

    if (type === "solo-year") {
      const soloDraftView = $(".draft-options-view-container .teams-filters-container");
      if (soloDraftView) {
        removeClass(soloDraftView, "hidden");
      }

      const yearSelectionContainer = $(".draft-options-view-container .year-list-selection-container");
      if (yearSelectionContainer) {
        removeClass(yearSelectionContainer, "hidden");
      }

      const playersListSelectionContainer = $(".draft-options-view-container .players-list-selection-container");
      if (playersListSelectionContainer) {
        addClass(playersListSelectionContainer, "hidden");
      }

      if (!redraftDataList[2026].rawData) {
        selectMDSYear(2026);
      }
    }

    const multiDraftView = $(".draft-options-view-container .multi-user-create-join-room-container");
    if (multiDraftView) {
      addClass(multiDraftView, "hidden");
    }

    const dashboardView = $(".draft-options-view-container .dashboard-container");
    if (dashboardView) {
      addClass(dashboardView, "hidden");
    }
  }

  function showMultiDraftView() {
    const soloDraftView = $(".draft-options-view-container .teams-filters-container");
    if (soloDraftView) {
      addClass(soloDraftView, "hidden");
    }

    const multiDraftView = $(".draft-options-view-container .multi-user-create-join-room-container");
    if (multiDraftView) {
      removeClass(multiDraftView, "hidden");
    }

    const dashboardView = $(".draft-options-view-container .dashboard-container");
    if (dashboardView) {
      addClass(dashboardView, "hidden");
    }

    showAvailableRoomsContainer();
  }

  function hideDashboardLoadingOverlay(parentSelector) {
    if (!parentSelector) {
      parentSelector = ".draft-options-view-container .dashboard-container";
    }
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      const loadingOverlay = parentContainer.querySelector(".dashboard-holder .dashboard-loading-overlay");
      if (loadingOverlay) {
        addClass(loadingOverlay, "hidden");
      }
    }
  }

  function showMDSDashboard() {
    trackGAEventForPage("mds_dashboard");

    const soloDraftView = $(".draft-options-view-container .teams-filters-container");
    if (soloDraftView) {
      addClass(soloDraftView, "hidden");
    }

    const multiDraftView = $(".draft-options-view-container .multi-user-create-join-room-container");
    if (multiDraftView) {
      addClass(multiDraftView, "hidden");
    }

    const dashboardView = $(".draft-options-view-container .dashboard-container");
    if (dashboardView) {
      removeClass(dashboardView, "hidden");
    }

    if (!mdsLoggedInUserId) {
      hideDashboardLoadingOverlay();
      const loginContainerOverlay = $(".login-container-overlay");
      if (loginContainerOverlay) {
        removeClass(loginContainerOverlay, "hidden");
      }

      const dashboardContainer = $(".draft-options-view-container .dashboard-container");
      if (dashboardContainer && !IS_DESKTOP) {
        dashboardContainer.style.position = "fixed";
      }
      return;
    }

    const loginBoxContainer = $(".dashboard-holder .login-container");
    if (loginBoxContainer) {
      loginBoxContainer.style.display = "none";
    }

    // if dashboard data is not available then fetch and store the data
    if (Object.keys(dashboardUserData.solo).length || Object.keys(dashboardUserData.multiUser).length) {
      hideDashboardLoadingOverlay();
    } else {
      fetchDashboardData();
    }
  }

  async function fetchDashboardData(parentSelector) {
    let selectedYear;
    const yearSelector = $(".dashboard-container .dashboard-data-year");
    let userDataUrl;
    let statsDataUrl;
    if (yearSelector) {
      selectedYear = yearSelector.value;
      if (selectedYear !== "") {
        userDataUrl = dashboardUserDataUrl + "?year=" + selectedYear;
        statsDataUrl = dashboardStatsDataUrl + "?year=" + selectedYear;
      }
    }

    try {
      let userData = await fetch(userDataUrl, {
        method: 'GET',
        credentials: 'include',
      });
      userData = await userData.json();
      if (userData.status === "Success") {
        storeDashboardData(userData.data);
        let statsData = await fetch(statsDataUrl, {
          method: 'GET',
          credentials: 'include',
        });
        statsData = await statsData.json();
        if (statsData.status === "Success") {
          storeStatsData(statsData.data);
          updateDashboardSection("", parentSelector);
          hideDashboardLoadingOverlay(parentSelector);
        }
      } else {
        updateDashboardSection("", parentSelector);
        hideDashboardLoadingOverlay(parentSelector);
      }
    } catch (error) {
      console.error('Error while fetching dashboard data:', error);
    }
  }

  function storeDashboardData(data) {
    let userImageUrl;
    let userName;
    if (!data.userImage) {
      userImageUrl = decodeURIComponent(getCookie("{$smarty.const.COOKIE_USER_PICTURE_LARGE}"));
      if (userImageUrl) {
        dashboardUserData.image = userImageUrl;
      }
      setLocalStorageData("PFN_MDS_USER_IMAGE", false);
    } else {
      dashboardUserData.image = data.userImage;
      setLocalStorageData("PFN_MDS_USER_IMAGE", true);
    }
    if (!data.userName) {
      userName = decodeURIComponent(getCookie("fw_name"));
      if (userName) {
        dashboardUserData.userName = userName;
        setLocalStorageData("PFN_MDS_USER_NAME", false);
      }
    } else {
      dashboardUserData.userName = data.userName;
      setLocalStorageData("PFN_MDS_USER_NAME", true);
    }
    dashboardUserData.solo = data.solo;
    dashboardUserData.multiUser = data.multiUser;
    dashboardUserData.overall = data.overall;

    dashboardUserData.overall.draftsStartedCount = data.solo.draftsStartedCount + data.multiUser.draftsStartedCount;
    dashboardUserData.overall.totalRounds = data.solo.totalRounds + data.multiUser.totalRounds;
    dashboardUserData.overall.tradesCompletedCount = data.solo.tradesCompletedCount + data.multiUser
      .tradesCompletedCount;
    dashboardUserData.overall.tradesInitiatedCount = data.solo.tradesInitiatedCount + data.multiUser
      .tradesInitiatedCount;
    dashboardUserData.overall.multiUserDraftsHostedCount = dashboardUserData.multiUser.multiUserDraftsHostedCount;
    dashboardUserData.overall.multiUserDraftsJoinedCount = dashboardUserData.multiUser.multiUserDraftsJoinedCount;
    dashboardUserData.overall.mostPlayersDraftedInSingleDraft = data.solo.mostPlayersDraftedInSingleDraft.count > data
      .multiUser.mostPlayersDraftedInSingleDraft.count ? data.solo.mostPlayersDraftedInSingleDraft : data.multiUser
      .mostPlayersDraftedInSingleDraft;
    dashboardUserData.overall.mostTradesInSingleDraft = data.solo.mostTradesInSingleDraft.count > data.multiUser
      .mostTradesInSingleDraft.count ? data.solo.mostTradesInSingleDraft : data.multiUser.mostTradesInSingleDraft;

    if (dashboardUserData.solo.biggestReach.bigBoardRank && dashboardUserData.multiUser.biggestReach.bigBoardRank) {
      if (dashboardUserData.solo.biggestReach.bigBoardRank - dashboardUserData.solo.biggestReach.draftedPick >
        dashboardUserData.multiUser.biggestReach.bigBoardRank - dashboardUserData.multiUser.biggestReach.draftedPick) {
        dashboardUserData.overall.biggestReach = dashboardUserData.solo.biggestReach;
      } else {
        dashboardUserData.overall.biggestReach = dashboardUserData.multiUser.biggestReach;
      }
    } else {
      if (!dashboardUserData.solo.biggestReach.bigBoardRank) {
        dashboardUserData.overall.biggestReach = dashboardUserData.multiUser.biggestReach;
      }

      if (!dashboardUserData.multiUser.biggestReach.bigBoardRank) {
        dashboardUserData.overall.biggestReach = dashboardUserData.solo.biggestReach;
      }
    }

    if (dashboardUserData.solo.biggestSteal.bigBoardRank && dashboardUserData.multiUser.biggestSteal.bigBoardRank) {
      if (dashboardUserData.solo.biggestSteal.bigBoardRank - dashboardUserData.solo.biggestSteal.draftedPick <
        dashboardUserData.multiUser.biggestSteal.bigBoardRank - dashboardUserData.multiUser.biggestSteal.draftedPick) {
        dashboardUserData.overall.biggestSteal = dashboardUserData.solo.biggestSteal;
      } else {
        dashboardUserData.overall.biggestSteal = dashboardUserData.multiUser.biggestSteal;
      }
    } else {
      if (!dashboardUserData.solo.biggestSteal.bigBoardRank) {
        dashboardUserData.overall.biggestSteal = dashboardUserData.multiUser.biggestSteal;
      }

      if (!dashboardUserData.multiUser.biggestSteal.bigBoardRank) {
        dashboardUserData.overall.biggestSteal = dashboardUserData.solo.biggestSteal;
      }
    }

    dashboardUserData.overall.conferenceDraftCount = {
      'ACC': "",
      'Big Ten': "",
      'Big 12': "",
      'SEC': "",
      'INDEPENDENTS': "",
      'Pac-12': "",
      'AAC': "",
      'CUSA': "",
      'MAC': "",
      'MW': "",
      'Sun Belt': "",
      'Others': "",
    };

    Object.keys(dashboardUserData.overall.conferenceDraftCount).forEach(conf => {
      dashboardUserData.overall.conferenceDraftCount[conf] = dashboardUserData.solo.conferenceDraftCount[conf] +
        dashboardUserData.multiUser.conferenceDraftCount[conf];
    });
  }

  function storeStatsData(data) {
    dashboardUserData.stats = data;
    dashboardUserData.stats.overall = {};
    dashboardUserData.stats.overall.highestDailyDrafts = dashboardUserData.stats.solo.highestDailyDrafts +
      dashboardUserData.stats.multiUser.highestDailyDrafts;
    dashboardUserData.stats.overall.highestMonthlyDrafts = dashboardUserData.stats.solo.highestMonthlyDrafts +
      dashboardUserData.stats.multiUser.highestMonthlyDrafts;
    dashboardUserData.stats.overall.highestWeeklyDrafts = dashboardUserData.stats.solo.highestWeeklyDrafts +
      dashboardUserData.stats.multiUser.highestWeeklyDrafts;
    dashboardUserData.stats.overall.mostPlayersDraftedInSingleDraft = dashboardUserData.stats.solo
      .mostPlayersDraftedInSingleDraft > dashboardUserData.stats.multiUser.mostPlayersDraftedInSingleDraft ?
      dashboardUserData.stats.solo.mostPlayersDraftedInSingleDraft : dashboardUserData.stats.multiUser
      .mostPlayersDraftedInSingleDraft;
    dashboardUserData.stats.overall.mostTradesCompletedInADraft = dashboardUserData.stats.solo
      .mostTradesCompletedInADraft > dashboardUserData.stats.multiUser.mostTradesCompletedInADraft ? dashboardUserData
      .stats.solo.mostTradesCompletedInADraft : dashboardUserData.stats.multiUser.mostTradesCompletedInADraft;
    dashboardUserData.stats.overall.totalDraftsCompleted = dashboardUserData.stats.solo.totalDraftsCompleted +
      dashboardUserData.stats.multiUser.totalDraftsCompleted;
    dashboardUserData.stats.overall.totalDraftsStarted = dashboardUserData.stats.solo.totalDraftsStarted +
      dashboardUserData.stats.multiUser.totalDraftsStarted;
    dashboardUserData.stats.overall.totalTradesCompleted = dashboardUserData.stats.solo.totalTradesCompleted +
      dashboardUserData.stats.multiUser.totalTradesCompleted;
    dashboardUserData.stats.overall.totalTradesInitiated = dashboardUserData.stats.solo.totalTradesInitiated +
      dashboardUserData.stats.multiUser.totalTradesInitiated;
    dashboardUserData.stats.overall.highestMultiUserDraftsHosted = dashboardUserData.stats.multiUser
      .highestMultiUserDraftsHosted;
    dashboardUserData.stats.overall.highestMultiUserDraftsJoined = dashboardUserData.stats.multiUser
      .highestMultiUserDraftsJoined;
  }

  (function() {
    const userName = decodeURIComponent(getCookie("fw_name"));
    if (userName) {
      const logoutContainer = $(".draft-option-btn.logout-container");
      if (logoutContainer) {
        removeClass(logoutContainer, "hidden");
      }
    }
  })();
</script>
