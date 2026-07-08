var rounds;
var executionRate;
const allTeamsNeeds = {};
var processedImages = {};
var userSelectedTeams = [];
var pauseDraftFlag = false;
var offersList = [];
var confirmTradeListener;
var currentOfferTeam;
var currentSection;
var pausedManually;
var feedbackAdded = false;
let feedsUrl = STATIC_URL + "/" + feedsSourcePath;
feedsUrl = feedsUrl.replace("staticd.pr", "staticj.pr");
const dashboardDataPostUrl = GOTHAM_URL_PFN_FRONTEND + "/pfn/nfl/mds/dashboard";
let dashboardDraftedPlayers = [];
let tradesCompletedCount = 0;
var draftHistory = [];
var pendingDashboardEvents = [];

if (!trackGAEventForPage) {
  var trackGAEventForPage = function (eventName, eventParams) {
    eventParams = eventParams || {};
    trackGAEvent(eventName, Object.assign(eventParams, {
      "tool": "mockdraft",
    }));
  };
}

if (sendPageViewEvent) {
  trackGAEventForPage("page_view");
}

function createDraftSnapshot() {
  var teamsState = {};
  for (var i = 0; i < teamsList.length; i++) {
    var t = teamsList[i];
    teamsState[t.shortName] = {
      teamNeed1: t.teamNeed1,
      teamNeed2: t.teamNeed2,
      teamNeed3: t.teamNeed3,
      teamNeed4: t.teamNeed4,
      teamNeed5: t.teamNeed5,
      needQB: t.needQB, needRB: t.needRB, needWR: t.needWR, needTE: t.needTE,
      needOT: t.needOT, needOG: t.needOG, needOC: t.needOC,
      needEDGE: t.needEDGE, needDT: t.needDT, needLB: t.needLB, needCB: t.needCB, needS: t.needS,
      draftedPlayers: t.draftedPlayers.slice(),
      doNotDraft: t.doNotDraft.slice(),
      penaltyPOS: Array.isArray(t.penaltyPOS) ? t.penaltyPOS.slice() : t.penaltyPOS,
      penaltyPOS2: Array.isArray(t.penaltyPOS2) ? t.penaltyPOS2.slice() : t.penaltyPOS2,
      penaltyPOS3: Array.isArray(t.penaltyPOS3) ? t.penaltyPOS3.slice() : t.penaltyPOS3,
      _posDraftCount: t._posDraftCount ? Object.assign({}, t._posDraftCount) : undefined,
      _penaltyInitialized: t._penaltyInitialized,
      targetPlayer: t.targetPlayer,
      qbCount: t.qbCount,
      draftPicks: t.draftPicks.map(function(dp) {
        return { number: dp.number, futurePick: dp.futurePick, futureRound: dp.futureRound, futurePickYear: dp.futurePickYear, futureOriginalTeam: dp.futureOriginalTeam, value: dp.value };
      }),
    };
  }

  var teamNeedsState = {};
  for (var i = 0; i < teamNeedsList.length; i++) {
    var tn = teamNeedsList[i];
    teamNeedsState[tn.shortName] = {
      teamNeed1: tn.teamNeed1,
      teamNeed2: tn.teamNeed2,
      teamNeed3: tn.teamNeed3,
      teamNeed4: tn.teamNeed4,
      teamNeed5: tn.teamNeed5,
    };
  }

  var picksState = picksList.map(function(p) {
    return {
      onTheClock: p.onTheClock,
      playerSelection: p.playerSelection,
      tradedPick: p.tradedPick,
      tradeUpPick: p.tradeUpPick,
      currentTeamShortName: p.currentTeam.shortName,
      grade: p.grade,
      gradeColor: p.gradeColor,
      pickGradeData: p.pickGradeData ? Object.assign({}, p.pickGradeData) : undefined,
      tradeProposals: Array.isArray(p.tradeProposals) ? p.tradeProposals.slice() : undefined,
    };
  });

  return {
    playersListCopy: playersList.slice(),
    picksState: picksState,
    teamsState: teamsState,
    teamNeedsState: teamNeedsState,
    tradesDataLength: tradesData.length,
    dashboardDraftedPlayersLength: dashboardDraftedPlayers.length,
    savedTradesCompletedCount: tradesCompletedCount,
    pendingDashboardEventsLength: pendingDashboardEvents.length,
  };
}

function restoreFromSnapshot(snapshot) {
  playersList = snapshot.playersListCopy.slice();

  for (var i = 0; i < picksList.length; i++) {
    var ps = snapshot.picksState[i];
    if (!ps) continue;
    picksList[i].onTheClock = ps.onTheClock;
    picksList[i].playerSelection = ps.playerSelection;
    picksList[i].tradedPick = ps.tradedPick;
    picksList[i].tradeUpPick = ps.tradeUpPick;
    picksList[i].grade = ps.grade;
    picksList[i].gradeColor = ps.gradeColor;
    picksList[i].pickGradeData = ps.pickGradeData;
    picksList[i].tradeProposals = ps.tradeProposals;
    var team = teamsList.find(function(t) { return t.shortName === ps.currentTeamShortName; });
    if (team) picksList[i].currentTeam = team;
  }

  for (var i = 0; i < teamsList.length; i++) {
    var ts = snapshot.teamsState[teamsList[i].shortName];
    if (!ts) continue;
    teamsList[i].teamNeed1 = ts.teamNeed1;
    teamsList[i].teamNeed2 = ts.teamNeed2;
    teamsList[i].teamNeed3 = ts.teamNeed3;
    teamsList[i].teamNeed4 = ts.teamNeed4;
    teamsList[i].teamNeed5 = ts.teamNeed5;
    teamsList[i].needQB = ts.needQB; teamsList[i].needRB = ts.needRB;
    teamsList[i].needWR = ts.needWR; teamsList[i].needTE = ts.needTE;
    teamsList[i].needOT = ts.needOT; teamsList[i].needOG = ts.needOG;
    teamsList[i].needOC = ts.needOC; teamsList[i].needEDGE = ts.needEDGE;
    teamsList[i].needDT = ts.needDT; teamsList[i].needLB = ts.needLB;
    teamsList[i].needCB = ts.needCB; teamsList[i].needS = ts.needS;
    teamsList[i].draftedPlayers = ts.draftedPlayers.slice();
    teamsList[i].doNotDraft = ts.doNotDraft.slice();
    teamsList[i].penaltyPOS = Array.isArray(ts.penaltyPOS) ? ts.penaltyPOS.slice() : ts.penaltyPOS;
    teamsList[i].penaltyPOS2 = Array.isArray(ts.penaltyPOS2) ? ts.penaltyPOS2.slice() : ts.penaltyPOS2;
    teamsList[i].penaltyPOS3 = Array.isArray(ts.penaltyPOS3) ? ts.penaltyPOS3.slice() : ts.penaltyPOS3;
    teamsList[i]._posDraftCount = ts._posDraftCount ? Object.assign({}, ts._posDraftCount) : undefined;
    teamsList[i]._penaltyInitialized = ts._penaltyInitialized;
    teamsList[i].targetPlayer = ts.targetPlayer;
    teamsList[i].qbCount = ts.qbCount;
    var restoredDraftPicks = [];
    for (var j = 0; j < ts.draftPicks.length; j++) {
      var dpSnap = ts.draftPicks[j];
      if (!dpSnap.futurePick) {
        var pickRef = picksList.find(function(p) { return p.number === dpSnap.number; });
        if (pickRef) restoredDraftPicks.push(pickRef);
      } else {
        var futureRef = picksList.find(function(p) {
          return p.futurePick && p.futureRound === dpSnap.futureRound && p.futurePickYear === dpSnap.futurePickYear && p.futureOriginalTeam === dpSnap.futureOriginalTeam;
        });
        if (futureRef) {
          restoredDraftPicks.push(futureRef);
        } else {
          restoredDraftPicks.push(Object.assign({}, dpSnap));
        }
      }
    }
    teamsList[i].draftPicks = restoredDraftPicks;
  }

  for (var i = 0; i < teamNeedsList.length; i++) {
    var tns = snapshot.teamNeedsState[teamNeedsList[i].shortName];
    if (!tns) continue;
    teamNeedsList[i].teamNeed1 = tns.teamNeed1;
    teamNeedsList[i].teamNeed2 = tns.teamNeed2;
    teamNeedsList[i].teamNeed3 = tns.teamNeed3;
    teamNeedsList[i].teamNeed4 = tns.teamNeed4;
    teamNeedsList[i].teamNeed5 = tns.teamNeed5;
  }

  tradesData.length = snapshot.tradesDataLength;
  dashboardDraftedPlayers.length = snapshot.dashboardDraftedPlayersLength;
  tradesCompletedCount = snapshot.savedTradesCompletedCount;
  pendingDashboardEvents.length = snapshot.pendingDashboardEventsLength;

  for (var i = 0; i < playersList.length; i++) {
    playersList[i].draftedBy = undefined;
  }
  for (var i = 0; i < teamsList.length; i++) {
    for (var j = 0; j < teamsList[i].draftedPlayers.length; j++) {
      teamsList[i].draftedPlayers[j].draftedBy = teamsList[i];
    }
  }
}

function syncPicksDOM() {
  var limit = roundends[rounds];
  for (var i = 0; i < limit; i++) {
    var pick = picksList[i];
    var container = $(".pick-number-" + pick.number);
    if (!container) continue;

    // Update team logo only if changed
    var teamLogoEl = container.querySelector(".team-logo");
    if (teamLogoEl && teamLogoEl.dataset.teamlogo !== pick.currentTeam.teamLogo) {
      teamLogoEl.src = STATIC_URL + teamLogoPath + pick.currentTeam.teamLogo + "?w=80&tag=" + imageRefreshTag;
      teamLogoEl.dataset.teamlogo = pick.currentTeam.teamLogo;
    }

    // Update shortname on container
    container.dataset.shortname = pick.currentTeam.shortName;
    var teamLogoContainer = container.querySelector(".team-logo-container");
    if (teamLogoContainer) teamLogoContainer.dataset.teamname = pick.currentTeam.shortName;

    updateTeamNeedsInPickContainer(container, pick.currentTeam.shortName);

    // Update player name/position or clear
    var playerNameEl = container.querySelector(".player-name");
    var playerPosEl = container.querySelector(".player-position");
    var playerHolder = container.querySelector(".traded-player-name-position-container");

    if (pick.playerSelection && pick.playerSelection !== "" && typeof pick.playerSelection === "object") {
      if (playerNameEl) playerNameEl.innerHTML = pick.playerSelection.name;
      if (playerPosEl) playerPosEl.innerHTML = pick.playerSelection.position + " " + pick.playerSelection.draftFrom;
      if (playerHolder) {
        playerHolder.dataset.name = pick.playerSelection.name;
        playerHolder.style.cursor = "pointer";
        playerHolder.onclick = showPlayerInfo;
      }
    } else {
      if (playerNameEl) playerNameEl.innerHTML = "";
      if (playerPosEl) playerPosEl.innerHTML = "";
      if (playerHolder) {
        playerHolder.dataset.name = "";
        playerHolder.style.cursor = "";
        playerHolder.onclick = null;
      }

      const teamNeedsContainer = container.querySelector(".team-needs-info-container");
      if (teamNeedsContainer) {
        removeClass(teamNeedsContainer, "hidden");
      }
    }

    // Remove currentPick class (will be re-added for the actual current pick)
    removeClass(container, "currentPick");

    // Trade icon: show if pick is in tradesData, hide otherwise
    var tradeIcon = container.querySelector(".pick-trade-info-btn");
    if (tradeIcon) {
      var tradeIndexForPick = -1;
      for (var t = 0; t < tradesData.length; t++) {
        var found = false;
        if (tradesData[t].givingPicks) {
          tradesData[t].givingPicks.forEach(function(p) { if (p.number === pick.number) found = true; });
        }
        if (tradesData[t].gettingPicks) {
          tradesData[t].gettingPicks.forEach(function(p) { if (p.number === pick.number) found = true; });
        }
        if (found) tradeIndexForPick = t;
      }
      if (tradeIndexForPick >= 0) {
        removeClass(tradeIcon, "hidden");
        tradeIcon.dataset.tradeindex = tradeIndexForPick;
      } else {
        addClass(tradeIcon, "hidden");
      }
    }
  }
}

function revertLastPick() {
  if (draftHistory.length === 0 || multiUserDraft) return;

  pauseDraftFlag = true;

  var snapshot = draftHistory.pop();
  restoreFromSnapshot(snapshot);
  calculateAllTeamsNeeds();

  var offerContainer = $(".offer-container");
  if (offerContainer) offerContainer.remove();
  offersList = [];
  var tradeDataContainer = $(".trade-data-container");
  if (tradeDataContainer) tradeDataContainer.remove();
  var offersOverlay = $(".overlay");
  if (offersOverlay) addClass(offersOverlay, "hidden");

  syncPicksDOM();
  fillPlayersList();

  var currentPickData = getCurrentPick();
  var currentPick = currentPickData ? currentPickData.currentPick : null;

  if (currentPick) {
    var pickContainer = $(".pick-number-" + currentPick.number);

    if (pickContainer) {
      var scrollContainer = pickContainer.closest(".rounds-pics-container");
      if (scrollContainer) {
        var containerRect = scrollContainer.getBoundingClientRect();
        var elementRect = pickContainer.getBoundingClientRect();
        var offset = elementRect.top - containerRect.top - scrollContainer.clientHeight / 2 + elementRect.height / 2;
        scrollContainer.scrollTo({
          top: scrollContainer.scrollTop + offset,
          behavior: "auto"
        });
      }
    }

    updateNextPick(currentPick.number);
    updateTeamNeeds(currentPick.number);

    if (pickContainer && userSelectedTeams.includes(pickContainer.dataset.shortname) && currentPick.number > pickstart) {
      pickContainer.classList.add("currentPick");
      unhideUserSelectionIcon();
      enableSimProposeTradeBtn();
      hideResumeDraftBtn();
      showPauseDraftBtn();
      disablePauseDraftBtn();
      disableShowOffersBtn();
      if (!IS_DESKTOP) {
        toggleSimView("pool", true);
      }
      calculateTrades(pickContainer);
    } else {
      hidePauseDraftBtn();
      showResumeDraftBtn();
      enableResumeDraftBtn();
      disableShowOffersBtn();
    }
  } else {
    hidePauseDraftBtn();
    showResumeDraftBtn();
    enableResumeDraftBtn();
    disableShowOffersBtn();
  }

  updateRevertPickBtn();

  trackGAEventForPage("revert_pick");
}

function showRevertPickBtn() {
  var btn = $(".revert-pick");
  if (btn) removeClass(btn, "hidden");
}

function hideRevertPickBtn() {
  var btn = $(".revert-pick");
  if (btn) addClass(btn, "hidden");
}

function enableRevertPickBtn() {
  var btn = $(".revert-pick");
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  }
}

function disableRevertPickBtn() {
  var btn = $(".revert-pick");
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = "0.4";
    btn.style.cursor = "not-allowed";
  }
}

function updateRevertPickBtn() {
  if (draftHistory.length > 0 && !multiUserDraft) {
    enableRevertPickBtn();
  } else {
    disableRevertPickBtn();
  }
}

const roundText = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh"];
const feedsList = [];
var selectedPositionFilter = "all";
let initialStartTimeoutId;

function getPickValue(pickNumber) {
  if (!pickNumber || pickNumber <= 0) return 0;
  for (var i = 0; i < picksList.length; i++) {
    if (picksList[i].number === pickNumber) return picksList[i].value || 0;
  }
  return 0;
}

function getPlayerValue(playerBigBoardNumber) {
  if (!playerBigBoardNumber || playerBigBoardNumber <= 0) return 0;
  for (var i = 0; i < picksList.length; i++) {
    if (picksList[i].number === playerBigBoardNumber) return picksList[i].value || 0;
  }
  return playerBigBoardNumber > 257 ? 1 : 0;
}

function getTradedPlayerValue(player) {
  var name = player.playerName || player.Player || player.name || "";
  if (name && typeof playerTrades !== 'undefined') {
    for (var i = 0; i < playerTrades.length; i++) {
      if (playerTrades[i].Player === name) return playerTrades[i].Value || 0;
    }
  }
  return player.value || 0;
}

function getTeamNeedScore(team, position) {
  var needKey = "need" + position;
  var needVal = team[needKey];
  if (needVal !== undefined && needVal !== null) return Math.min(needVal, 10);
  return 0;
}

function gradePickScore(playerValue, slotValue, needScore, shouldLog, skipClamp) {
  var multiplier = slotValue >= 468 ? gradingConfig.tier1Multiplier
    : slotValue >= 36 ? gradingConfig.tier2Multiplier
    : gradingConfig.tier3Multiplier;
  var tierName = slotValue >= 468 ? "Tier1" : slotValue >= 36 ? "Tier2" : "Tier3";
  var needCoef = slotValue >= gradingConfig.lateRoundThreshold
    ? gradingConfig.needCoefficient : gradingConfig.lateNeedCoefficient;
  var vs = Math.min((playerValue / slotValue) * multiplier, 100);
  var needAdj = (needScore - 5) * needCoef;
  var composite = Math.min(Math.max(vs + needAdj, 0), 100);
  var preClamp = composite;
  if (!skipClamp && slotValue <= gradingConfig.lateRoundThreshold && playerValue <= gradingConfig.lateRoundThreshold) {
    composite = Math.min(Math.max(composite, gradingConfig.lateRoundFloor), gradingConfig.lateRoundCeiling);
  }
  if (playerValue >= gradingConfig.top5Threshold) {
    composite = Math.max(composite, gradingConfig.top5PlayerFloor);
  }
  if (shouldLog) {
    console.log("  [PICK GRADE]",
      "playerVal=" + playerValue, "slotVal=" + slotValue,
      "tier=" + tierName, "mult=" + multiplier,
      "VS=" + vs.toFixed(2),
      "needScore=" + needScore, "needCoef=" + needCoef, "needAdj=" + needAdj,
      "preClamp=" + preClamp.toFixed(2), "final=" + composite.toFixed(2),
      "grade=" + getLetterGrade(composite));
  }
  return composite;
}

function getLetterGrade(score) {
  if (score >= 94) return 'A+';
  if (score >= 87) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 73) return 'B+';
  if (score >= 66) return 'B';
  if (score >= 59) return 'B-';
  if (score >= 52) return 'C+';
  if (score >= 45) return 'C';
  if (score >= 38) return 'C-';
  if (score >= 31) return 'D+';
  if (score >= 24) return 'D';
  if (score >= 17) return 'D-';
  return 'F';
}

function getGradeColorClass(grade) {
  switch (grade) {
    case 'A+': return 'grade-a-plus';
    case 'A': return 'grade-a';
    case 'A-': return 'grade-a-minus';
    case 'B+': return 'grade-b-plus';
    case 'B': return 'grade-b';
    case 'B-': return 'grade-b-minus';
    case 'C+': return 'grade-c-plus';
    case 'C': return 'grade-c';
    case 'C-': return 'grade-c-minus';
    case 'D+': return 'grade-d-plus';
    case 'D': return 'grade-d';
    case 'D-': return 'grade-d-minus';
    default: return 'grade-f';
  }
}

function getPickRoundNumber(pickNumber) {
  if (pickNumber <= roundends[0]) return 1;
  for (var r = 1; r < roundends.length; r++) {
    if (pickNumber <= roundends[r]) return r;
  }
  return 7;
}

function getGradingPlayerValue(rawValue) {
  if (rawValue >= gradingConfig.top5Threshold) return gradingConfig.top5playervalue || 500;
  return rawValue;
}

function getGradingSlotValue(rawValue) {
  if (rawValue >= gradingConfig.top5Threshold) return gradingConfig.top5pickvalue || 450;
  return rawValue;
}

function isGradableTeam(teamShortName) {
  if (userSelectedTeams.includes(teamShortName)) return true;
  if (multiUserDraft && typeof currentRoomData !== 'undefined' && currentRoomData && currentRoomData.selectedTeams) {
    return currentRoomData.selectedTeams.includes(teamShortName);
  }
  return false;
}

function computeAndStorePickGrade(pick) {
  if (!brand || isRedraft) return;
  if (!pick || !pick.playerSelection || !pick.currentTeam) return;
  var rawSlotValue = getPickValue(pick.number);
  var rawPlayerValue = getPlayerValue(pick.playerSelection.number);
  var slotValue = getGradingSlotValue(rawSlotValue);
  var playerValue = getGradingPlayerValue(rawPlayerValue);
  var penaltyApplied = false;
  var penaltyLevel = 0;
  var pickRound = getPickRoundNumber(pick.number);
  var pos = pick.playerSelection.position;
  var team = pick.currentTeam;

  // Initialize penalty tiers: penaltyPOS=L1, penaltyPOS2=L2, penaltyPOS3=L3
  // DND starts as L2, sheet penaltyPOS starts as L1
  if (!team._penaltyInitialized) {
    if (!Array.isArray(team.penaltyPOS)) {
      team.penaltyPOS = (team.penaltyPOS && typeof team.penaltyPOS === 'string') ? team.penaltyPOS.split(',').map(function(s){ return s.trim(); }).filter(Boolean) : [];
    }
    if (!Array.isArray(team.penaltyPOS2)) {
      team.penaltyPOS2 = (team.penaltyPOS2 && typeof team.penaltyPOS2 === 'string') ? team.penaltyPOS2.split(',').map(function(s){ return s.trim(); }).filter(Boolean) : [];
    }
    if (!Array.isArray(team.penaltyPOS3)) {
      team.penaltyPOS3 = (team.penaltyPOS3 && typeof team.penaltyPOS3 === 'string') ? team.penaltyPOS3.split(',').map(function(s){ return s.trim(); }).filter(Boolean) : [];
    }
    if (team.doNotDraft && team.doNotDraft.length) {
      for (var d = 0; d < team.doNotDraft.length; d++) {
        if (team.penaltyPOS2.indexOf(team.doNotDraft[d]) === -1) {
          team.penaltyPOS2.push(team.doNotDraft[d]);
        }
      }
    }
    if (!team._posDraftCount) team._posDraftCount = {};
    team._penaltyInitialized = true;
  }

  // Determine penalty level for this position (L3 > L2 > L1)
  var isLevel3 = team.penaltyPOS3.indexOf(pos) !== -1;
  var isLevel2 = !isLevel3 && team.penaltyPOS2.indexOf(pos) !== -1;
  var isLevel1 = !isLevel3 && !isLevel2 && team.penaltyPOS.indexOf(pos) !== -1;

  // Penalty reductions by round and level:
  // R1:   L1=50% reduction(keep 50%), L2=60%(keep 40%), L3=75%(keep 25%)
  // R2-4: L1=25%(keep 75%),           L2=50%(keep 50%), L3=75%(keep 25%)
  // R5+:  L1=0%(keep 100%),           L2=30%(keep 70%), L3=75%(keep 25%)
  if (isLevel3) {
    playerValue = playerValue * 0.25;
    penaltyLevel = 3;
    penaltyApplied = true;
  } else if (isLevel2) {
    if (pickRound <= 1) {
      playerValue = playerValue * 0.40;
    } else if (pickRound <= 4) {
      playerValue = playerValue * 0.50;
    } else {
      playerValue = playerValue * 0.70;
    }
    penaltyLevel = 2;
    penaltyApplied = true;
  } else if (isLevel1) {
    if (pickRound <= 1) {
      playerValue = playerValue * 0.50;
    } else if (pickRound <= 4) {
      playerValue = playerValue * 0.75;
    }
    // R5+: L1 = 0% reduction, no penalty applied
    if (pickRound <= 4) {
      penaltyLevel = 1;
      penaltyApplied = true;
    }
  }

  var needScore = getTeamNeedScore(team, pos);
  var penaltyText = "";
  if (penaltyApplied) {
    var keepPct;
    if (penaltyLevel === 3) keepPct = "25%";
    else if (penaltyLevel === 2) keepPct = pickRound <= 1 ? "40%" : pickRound <= 4 ? "50%" : "70%";
    else keepPct = pickRound <= 1 ? "50%" : "75%";
    penaltyText = " (penalty L" + penaltyLevel + ", kept " + keepPct + ")";
  }
  console.log("[GRADING PICK #" + pick.number + "]",
    "team=" + team.shortName,
    "player=" + pick.playerSelection.name,
    "pos=" + pos,
    "bigBoard=" + pick.playerSelection.number,
    "slotVal=" + rawSlotValue + "→" + slotValue,
    "playerVal=" + rawPlayerValue + "→" + playerValue + penaltyText,
    "round=" + pickRound, "needScore=" + needScore);
  var score = gradePickScore(playerValue, slotValue, needScore, true, penaltyLevel === 3);
  pick.pickGradeData = {
    score: score,
    grade: getLetterGrade(score),
    playerValue: playerValue,
    slotValue: slotValue,
    needScore: needScore
  };

  // Track position draft count and promote penalty tiers
  // Applies for ALL rounds (entire draft)
  if (!team._posDraftCount[pos]) team._posDraftCount[pos] = 0;
  team._posDraftCount[pos]++;
  var count = team._posDraftCount[pos];
  var isOLine = pos === "OT" || pos === "OG";
  var isQB = pos === "QB";
  var oldLevel = isLevel3 ? 3 : isLevel2 ? 2 : isLevel1 ? 1 : 0;
  var newLevel = oldLevel;

  if (isQB) {
    // QB: 1st selection → L2, 2nd selection → L3
    if (count >= 2 && oldLevel < 3) newLevel = 3;
    else if (count >= 1 && oldLevel < 2) newLevel = 2;
  } else if (isOLine) {
    // OT/OG: 2nd → L1, 3rd → L2, 4th → L3
    if (count >= 4 && oldLevel < 3) newLevel = 3;
    else if (count >= 3 && oldLevel < 2) newLevel = 2;
    else if (count >= 2 && oldLevel < 1) newLevel = 1;
  } else {
    // All others: each selection moves up one level
    if (count + oldLevel >= 3 && oldLevel < 3) newLevel = Math.min(oldLevel + 1, 3);
    else if (count + oldLevel >= 2 && oldLevel < 2) newLevel = Math.min(oldLevel + 1, 3);
    else if (oldLevel < 1) newLevel = Math.min(oldLevel + 1, 3);
  }

  if (newLevel > oldLevel) {
    // Add to new level array (if not already)
    if (newLevel >= 3 && team.penaltyPOS3.indexOf(pos) === -1) team.penaltyPOS3.push(pos);
    if (newLevel >= 2 && team.penaltyPOS2.indexOf(pos) === -1) team.penaltyPOS2.push(pos);
    if (newLevel >= 1 && team.penaltyPOS.indexOf(pos) === -1) team.penaltyPOS.push(pos);
    console.log("[PENALTY POS] " + pos + " → Level " + newLevel + " for " + team.shortName +
      " (selection #" + count + ", was L" + oldLevel + ", round " + pickRound + ")");
  }
}

function adjustTeamNeedsForTradedAwayPlayer(team, player) {
  if (!team || !player) return;
  var pos = player.position || player.Position || "";
  if (!pos) return;
  var playerVal = getTradedPlayerValue(player);
  var needKey = "need" + pos;

  if (!Array.isArray(team.penaltyPOS)) team.penaltyPOS = [];
  if (!Array.isArray(team.penaltyPOS2)) team.penaltyPOS2 = [];
  if (!Array.isArray(team.penaltyPOS3)) team.penaltyPOS3 = [];

  function removeFromAllPenalty(t, p) {
    if (Array.isArray(t.penaltyPOS)) { var i = t.penaltyPOS.indexOf(p); if (i !== -1) t.penaltyPOS.splice(i, 1); }
    if (Array.isArray(t.penaltyPOS2)) { var j = t.penaltyPOS2.indexOf(p); if (j !== -1) t.penaltyPOS2.splice(j, 1); }
    if (Array.isArray(t.penaltyPOS3)) { var k = t.penaltyPOS3.indexOf(p); if (k !== -1) t.penaltyPOS3.splice(k, 1); }
  }

  if (playerVal > 999) {
    team[needKey] = 10;
    if (team.doNotDraft) {
      var dndIdx = team.doNotDraft.indexOf(pos);
      if (dndIdx !== -1) team.doNotDraft.splice(dndIdx, 1);
    }
    removeFromAllPenalty(team, pos);
    console.log("[TRADE ADJUST] " + team.shortName + " traded away " + (player.playerName || player.Player || "") +
      " (" + pos + ") val=" + playerVal + " → need set to 10, removed from doNotDraft & all penalty levels");
  } else if (playerVal > 249) {
    var currentNeed = team[needKey] || 0;
    team[needKey] = Math.min(currentNeed + 5, 10);
    if (team.doNotDraft) {
      var dndIdx2 = team.doNotDraft.indexOf(pos);
      if (dndIdx2 !== -1) team.doNotDraft.splice(dndIdx2, 1);
    }
    removeFromAllPenalty(team, pos);
    console.log("[TRADE ADJUST] " + team.shortName + " traded away " + (player.playerName || player.Player || "") +
      " (" + pos + ") val=" + playerVal + " → need +" + 5 + ", removed from doNotDraft & all penalty levels");
  } else if (playerVal > 20) {
    var currentNeed2 = team[needKey] || 0;
    team[needKey] = Math.min(currentNeed2 + 2, 10);
    console.log("[TRADE ADJUST] " + team.shortName + " traded away " + (player.playerName || player.Player || "") +
      " (" + pos + ") val=" + playerVal + " → need +" + 2);
  }
}

function adjustTeamNeedsForReceivedPlayer(team, player) {
  if (!team || !player) return;
  var pos = player.position || player.Position || "";
  if (!pos) return;
  var playerVal = getTradedPlayerValue(player);
  var needKey = "need" + pos;
  var currentNeed = team[needKey] || 0;
  if (playerVal > 999) {
    team[needKey] = 0;
    if (team.doNotDraft && team.doNotDraft.indexOf(pos) === -1) {
      team.doNotDraft.push(pos);
    }
    if (team.penaltyPOS && team.penaltyPOS.indexOf(pos) === -1) {
      team.penaltyPOS.push(pos);
    }
    console.log("[TRADE ADJUST] " + team.shortName + " received " + (player.playerName || player.Player || "") +
      " (" + pos + ") val=" + playerVal + " → need set to 0, added to doNotDraft & penaltyPOS");
  } else if (playerVal > 249) {
    team[needKey] = Math.max(currentNeed - 5, 0);
    if (team.doNotDraft && team.doNotDraft.indexOf(pos) === -1) {
      team.doNotDraft.push(pos);
    }
    if (team.penaltyPOS && team.penaltyPOS.indexOf(pos) === -1) {
      team.penaltyPOS.push(pos);
    }
    console.log("[TRADE ADJUST] " + team.shortName + " received " + (player.playerName || player.Player || "") +
      " (" + pos + ") val=" + playerVal + " → need -5, added to doNotDraft & penaltyPOS");
  } else if (playerVal > 20) {
    team[needKey] = Math.max(currentNeed - 2, 0);
    if (team.penaltyPOS && team.penaltyPOS.indexOf(pos) === -1) {
      team.penaltyPOS.push(pos);
    }
    console.log("[TRADE ADJUST] " + team.shortName + " received " + (player.playerName || player.Player || "") +
      " (" + pos + ") val=" + playerVal + " → need -2, added to penaltyPOS");
  }
}

function gradeAllUngradedPicks() {
  if (!brand || isRedraft) return;
  var limit = roundends[rounds] || picksList.length;
  for (var i = 0; i < limit; i++) {
    var pick = picksList[i];
    if (pick && pick.playerSelection && pick.currentTeam && !pick.pickGradeData) {
      computeAndStorePickGrade(pick);
    }
  }
}

function getRoundFromRichHillTier(value) {
  if (value >= 184) return 1;
  if (value >= 65) return 2;
  return 4;
}

function getFuturePickValue(futureRound) {
  var midPicks = {"1st": 16, "2nd": 48, "3rd": 80, "4th": 120, "5th": 159, "6th": 196, "7th": 235};
  return getPickValue(midPicks[futureRound] || 150);
}

function computeTradeScore(sent, received, logLabel) {
  var totalSent = sent.reduce(function(s, a) { return s + a.value; }, 0);
  var totalReceived = received.reduce(function(s, a) { return s + a.value; }, 0);
  if (totalSent === 0) return { score: 50, grade: 'C', totalSent: 0, totalReceived: totalReceived };
  var maxVal = Math.max(totalSent, totalReceived);
  var mult = maxVal >= gradingConfig.lateRoundThreshold ? 60 : 50;
  var base = (totalReceived / totalSent) * mult;
  var score = Math.min(base, 100);
  if (logLabel) {
    console.log("  [TRADE SCORE " + logLabel + "]",
      "totalSent=" + Math.round(totalSent), "totalReceived=" + Math.round(totalReceived),
      "base=" + base.toFixed(2), "score=" + score.toFixed(2), "grade=" + getLetterGrade(score));
  }
  return { score: score, grade: getLetterGrade(score), totalSent: totalSent, totalReceived: totalReceived };
}

function buildTradeAssetValues(picks, players) {
  var assets = [];
  if (picks) {
    picks.forEach(function(pick) {
      var val = pick.number ? getPickValue(pick.number) : getFuturePickValue(pick.futureRound);
      assets.push({ value: val });
    });
  }
  if (players && players.length && typeof players !== 'boolean') {
    players.forEach(function(p) {
      assets.push({ value: getTradedPlayerValue(p) });
    });
  }
  return assets;
}

function applyTradeUpOverride(trade, teamGrade, teamName) {
  var sentAssets, receivedPicks;
  if (trade.givingTeamName === teamName) {
    sentAssets = buildTradeAssetValues(trade.givingPicks, trade.givingPlayers);
    receivedPicks = trade.gettingPicks;
  } else {
    sentAssets = buildTradeAssetValues(trade.gettingPicks, trade.gettingPlayers);
    receivedPicks = trade.givingPicks;
  }
  var totalSent = sentAssets.reduce(function(s, a) { return s + a.value; }, 0);
  var receivedAssets = buildTradeAssetValues(receivedPicks, null);
  var totalReceived = receivedAssets.reduce(function(s, a) { return s + a.value; }, 0);

  if (totalSent > totalReceived && receivedPicks) {
    for (var i = 0; i < receivedPicks.length; i++) {
      if (receivedPicks[i].number) {
        var pickObj = picksList.find(function(p) { return p.number === receivedPicks[i].number; });
        if (pickObj && pickObj.pickGradeData && pickObj.currentTeam &&
            pickObj.currentTeam.shortName === teamName && pickObj.pickGradeData.score >= 66) {
          teamGrade.score = 66;
          teamGrade.grade = 'B';
          return;
        }
      }
    }
  }
}

function computeAllTradeGrades() {
  if (!brand || isRedraft) return;
  for (var t = 0; t < tradesData.length; t++) {
    var trade = tradesData[t];
    if (!isGradableTeam(trade.givingTeamName) && !isGradableTeam(trade.gettingTeamName)) continue;

    var givingSent = buildTradeAssetValues(trade.givingPicks, trade.givingPlayers);
    var givingReceived = buildTradeAssetValues(trade.gettingPicks, trade.gettingPlayers);
    var givingTeamGrade = computeTradeScore(givingSent, givingReceived, trade.givingTeamName);

    var gettingSent = buildTradeAssetValues(trade.gettingPicks, trade.gettingPlayers);
    var gettingReceived = buildTradeAssetValues(trade.givingPicks, trade.givingPlayers);
    var gettingTeamGrade = computeTradeScore(gettingSent, gettingReceived, trade.gettingTeamName);

    var allValues = givingSent.concat(gettingSent);
    var maxValue = 0;
    allValues.forEach(function(a) { if (a.value > maxValue) maxValue = a.value; });
    var tradeTier = getRoundFromRichHillTier(maxValue);
    givingTeamGrade.highestRound = tradeTier;
    gettingTeamGrade.highestRound = tradeTier;

    applyTradeUpOverride(trade, givingTeamGrade, trade.givingTeamName);
    applyTradeUpOverride(trade, gettingTeamGrade, trade.gettingTeamName);

    var myTeamInTrade = isGradableTeam(trade.givingTeamName) ? trade.givingTeamName : trade.gettingTeamName;
    var otherTeamInTrade = myTeamInTrade === trade.givingTeamName ? trade.gettingTeamName : trade.givingTeamName;
    var isMyTeamGiving = trade.givingTeamName === myTeamInTrade;
    var myTeamSentPicks = isMyTeamGiving ? trade.givingPicks : trade.gettingPicks;
    var myTeamReceivedPicks = isMyTeamGiving ? trade.gettingPicks : trade.givingPicks;
    var myTeamSentVal = 0, myTeamReceivedVal = 0;
    if (myTeamSentPicks) myTeamSentPicks.forEach(function(p) { myTeamSentVal += p.value; });
    if (myTeamReceivedPicks) myTeamReceivedPicks.forEach(function(p) { myTeamReceivedVal += p.value; });
    var logData = computeTradeCardData(trade, myTeamInTrade);
    console.log("[TRADE #" + t + "] " + myTeamInTrade + " <-> " + otherTeamInTrade);
    console.log("  " + myTeamInTrade + " sent:", Math.round(logData.sentTotal), "received:", Math.round(logData.receivedTotal));
    console.log("  score=" + logData.score.toFixed(2), "grade=" + logData.grade);
    console.log("  netValue=" + Math.round(logData.netValue), "tradeTier=" + tradeTier);

    trade.tradeGradeData = {
      givingTeamGrade: givingTeamGrade,
      gettingTeamGrade: gettingTeamGrade
    };
  }
}

function calculateOverallTeamGrade(teamShortName) {
  if (isRedraft) return null;
  var isMyTeam = isGradableTeam(teamShortName);
  if (isMyTeam) console.log("=== OVERALL GRADE for " + teamShortName + " ===");
  var pickWeightedSum = 0, pickTotalWeight = 0;

  for (var i = 0; i < picksList.length; i++) {
    var pick = picksList[i];
    if (pick.currentTeam && pick.currentTeam.shortName === teamShortName &&
        pick.playerSelection && pick.pickGradeData) {
      var round = getPickRoundNumber(pick.number);
      var weight = gradingConfig.roundWeights[round] || 1;
      pickWeightedSum += pick.pickGradeData.score * weight;
      pickTotalWeight += weight;
      if (isMyTeam) {
        console.log("  Pick #" + pick.number + " " + pick.playerSelection.name,
          "round=" + round, "weight=" + weight,
          "score=" + pick.pickGradeData.score.toFixed(2), "grade=" + pick.pickGradeData.grade,
          "weighted=" + (pick.pickGradeData.score * weight).toFixed(2));
      }
    }
  }
  if (isMyTeam) console.log("  Picks total: weightedSum=" + pickWeightedSum.toFixed(2), "totalWeight=" + pickTotalWeight);

  var r1Trades = [], r23Trades = [], r47Trades = [];
  for (var t = 0; t < tradesData.length; t++) {
    var trade = tradesData[t];
    if (!trade.tradeGradeData) continue;
    var gradeForTeam = null;
    if (trade.givingTeamName === teamShortName) {
      gradeForTeam = trade.tradeGradeData.givingTeamGrade;
    } else if (trade.gettingTeamName === teamShortName) {
      gradeForTeam = trade.tradeGradeData.gettingTeamGrade;
    }
    if (!gradeForTeam) continue;

    if (gradeForTeam.highestRound === 1) r1Trades.push(gradeForTeam);
    else if (gradeForTeam.highestRound <= 3) r23Trades.push(gradeForTeam);
    else r47Trades.push(gradeForTeam);
  }

  var r1Sum = 0, r1Weight = 0;
  r1Trades.forEach(function(tg) { r1Sum += tg.score * 15; r1Weight += 15; });

  var r23Avg = r23Trades.length > 0
    ? r23Trades.reduce(function(s, tg) { return s + tg.score; }, 0) / r23Trades.length : null;
  var r47Avg = r47Trades.length > 0
    ? r47Trades.reduce(function(s, tg) { return s + tg.score; }, 0) / r47Trades.length : null;

  var r23Weight = r23Trades.length > 0 ? 8 : 0;
  var r47Weight = r47Trades.length > 0 ? 4 : 0;

  var totalWeight = pickTotalWeight + r1Weight + r23Weight + r47Weight;
  if (totalWeight === 0) return { score: 0, grade: 'N/A' };

  var tradeComponent = r1Sum
    + (r23Avg !== null ? r23Avg * r23Weight : 0)
    + (r47Avg !== null ? r47Avg * r47Weight : 0);

  var overall = (pickWeightedSum + tradeComponent) / totalWeight;
  if (isMyTeam) {
    console.log("  Trades: R1(" + r1Trades.length + ") sum=" + r1Sum.toFixed(2) + " w=" + r1Weight,
      "R2-3(" + r23Trades.length + ") avg=" + (r23Avg !== null ? r23Avg.toFixed(2) : "N/A") + " w=" + r23Weight,
      "R4-7(" + r47Trades.length + ") avg=" + (r47Avg !== null ? r47Avg.toFixed(2) : "N/A") + " w=" + r47Weight);
    console.log("  OVERALL: (" + pickWeightedSum.toFixed(2) + " + " + tradeComponent.toFixed(2) + ") / " + totalWeight +
      " = " + overall.toFixed(2) + " → " + getLetterGrade(overall));
  }
  return { score: overall, grade: getLetterGrade(overall) };
}

function createPickGradeElement(grade) {
  var el = document.createElement("div");
  el.className = "pick-grade " + getGradeColorClass(grade);
  el.textContent = grade;
  return el;
}

function createTradeGradeBadge(grade) {
  var el = document.createElement("div");
  el.className = "trade-grade-badge " + getGradeColorClass(grade);
  el.textContent = grade;
  return el;
}

function getTradeGradeForTeam(tradeIndex, teamShortName) {
  var trade = tradesData[tradeIndex];
  if (!trade || !trade.tradeGradeData) return null;
  if (trade.givingTeamName === teamShortName) return trade.tradeGradeData.givingTeamGrade;
  if (trade.gettingTeamName === teamShortName) return trade.tradeGradeData.gettingTeamGrade;
  return null;
}

function toggleGrades() {
  var allToggles = $all(".grade-toggle");
  if (allToggles) {
    for (var i = 0; i < allToggles.length; i++) {
      allToggles[i].classList.toggle("active");
    }
  }
  var desktopHolder = $(".final-result-holder");
  var mobileHolder = $(".final-trades-container");
  if (desktopHolder) desktopHolder.classList.toggle("grades-hidden");
  if (mobileHolder) {
    mobileHolder.classList.toggle("grades-hidden");
    mobileHolder.classList.toggle("single-column-picks");

    const teamResultHidden = $(".teams-result-container.hidden");
    if (teamResultHidden) {
      const selectedRoundBtn = $(".round-selector.selected");
      if (selectedRoundBtn) {
        changeRoundData(selectedRoundBtn);
      }
    } else {
      setMyDraftPicksHeight();
    }
  }
}

function getPickRoundLabel(pickNumber) {
  var round = getPickRoundNumber(pickNumber);
  var suffixes = ["st", "nd", "rd", "th", "th", "th", "th", "th"];
  var suffix = suffixes[round - 1] || "th";
  return round + suffix + " Round";
}

function getAssetDescription(pick) {
  if (pick.futurePick) {
    var yr = pick.futureYear || "2026";
    return yr + " " + (pick.futureRound || "") + " Round Pick";
  }
  return "Pick #" + pick.number + " (" + getPickRoundLabel(pick.number) + ")";
}

function computeTradeCardData(trade, teamName) {
  var otherTeam = trade.givingTeamName === teamName ? trade.gettingTeamName : trade.givingTeamName;
  var isSender = trade.givingTeamName === teamName;

  var myPicks = isSender ? trade.givingPicks : trade.gettingPicks;
  var otherPicks = isSender ? trade.gettingPicks : trade.givingPicks;
  var myPlayers = isSender ? trade.givingPlayers : trade.gettingPlayers;
  var otherPlayers = isSender ? trade.gettingPlayers : trade.givingPlayers;

  function buildAssets(picks, players) {
    var assets = [];
    var total = 0;
    if (picks) {
      picks.forEach(function(p) {
        var val = p.value;
        total += val;
        assets.push({ label: getAssetDescription(p), value: val });
      });
    }
    if (players && players.length && typeof players !== "boolean") {
      players.forEach(function(p) {
        var val = getTradedPlayerValue(p);
        total += val;
        var name = p.playerName || p.Player || p.name || "Player";
        var pos = p.position || p.Position || "";
        assets.push({ label: name + (pos ? " (" + pos + ")" : ""), value: val });
      });
    }
    return { assets: assets, total: total };
  }

  var received = buildAssets(myPicks, myPlayers);
  var sent = buildAssets(otherPicks, otherPlayers);

  var receivedPickNumbers = [];
  if (otherPicks) otherPicks.forEach(function(p) { if (p.number) receivedPickNumbers.push(p.number); });
  var highPick = receivedPickNumbers.length > 0 ? Math.min.apply(null, receivedPickNumbers) : null;
  var roundLabel = highPick ? "Round " + getPickRoundNumber(highPick) + " — Pick" + (receivedPickNumbers.length > 1 ? "s " : " ") + receivedPickNumbers.join(", ") : "";

  var netValue = received.total - sent.total;

  // Trade grading uses raw values, no capping
  // Higher value trades (max asset >= 35) get x60 multiplier, lower get x50
  var maxTradeAssetValue = Math.max(received.total, sent.total);
  var tradeMultiplier = maxTradeAssetValue >= 35 ? 60 : 50;
  var base = sent.total > 0 ? (received.total / sent.total) * tradeMultiplier : 50;

  // Need boost only for players RECEIVED, not for picks-only trades
  var needBoost = 0;
  var hasReceivedPlayers = myPlayers && myPlayers.length && typeof myPlayers !== "boolean";
  if (hasReceivedPlayers) {
    var myTeamObj = teamsList.find(function(t) { return t.shortName === teamName; });
    if (myTeamObj) {
      myPlayers.forEach(function(p) {
        var pos = p.position || p.Position || "";
        var playerVal = getTradedPlayerValue(p);
        var needScore = pos ? getTeamNeedScore(myTeamObj, pos) : 0;
        if (received.total > 0) {
          needBoost += (needScore / 10) * (playerVal / received.total) * 15;
        }
      });
    }
  }

  var score = Math.min(base + needBoost, 100);
  var grade = getLetterGrade(score);

  return {
    title: "Trade with " + otherTeam,
    otherTeam: otherTeam,
    roundLabel: roundLabel,
    grade: grade,
    score: score,
    receivedAssets: received.assets,
    sentAssets: sent.assets,
    receivedTotal: received.total,
    sentTotal: sent.total,
    netValue: netValue,
    myPicks: myPicks,
    myPlayers: myPlayers,
    otherPicks: otherPicks,
    otherPlayers: otherPlayers,
    myTeamLogo: isSender ? trade.givingTeamLogo : trade.gettingTeamLogo,
    otherTeamLogo: isSender ? trade.gettingTeamLogo : trade.givingTeamLogo
  };
}

function buildTradeCard(trade, tradeGrade, teamName) {
  var data = computeTradeCardData(trade, teamName);

  var card = document.createElement("div");
  card.className = "trade-card";

  var header = document.createElement("div");
  header.className = "trade-card-header";
  var headerLeft = document.createElement("div");
  var title = document.createElement("div");
  title.className = "trade-card-title";
  title.textContent = data.title;
  headerLeft.appendChild(title);
  header.appendChild(headerLeft);
  header.appendChild(createTradeGradeBadge(data.grade));
  card.appendChild(header);

  var details = document.createElement("div");
  details.className = "trade-details";

  var sentSide = buildTradeSideFromAssets("Received", data.receivedAssets, data.receivedTotal, teamName, data.myTeamLogo);
  var arrow = document.createElement("div");
  arrow.className = "trade-arrow";
  arrow.innerHTML = "&#8644;";
  var recSide = buildTradeSideFromAssets("Sent", data.sentAssets, data.sentTotal, data.otherTeam, data.otherTeamLogo);

  details.appendChild(sentSide);
  details.appendChild(arrow);
  details.appendChild(recSide);
  card.appendChild(details);

  var netEl = document.createElement("div");
  netEl.className = "trade-net-value";
  netEl.textContent = "Net Value: " + (data.netValue >= 0 ? "+" : "") + Math.round(data.netValue);
  card.appendChild(netEl);

  var source = document.createElement("div");
  source.className = "trade-value-source";
  source.textContent = "Trade values via Rich Hill";
  card.appendChild(source);

  return card;
}

function getTeamLogoByName(shortName) {
  for (var i = 0; i < teamsList.length; i++) {
    if (teamsList[i].shortName === shortName) return teamsList[i].teamLogo;
  }
  return "";
}

function createTradeAssetLogo(teamShortName, teamLogo, cssClass) {
  var resolvedLogo = teamLogo || getTeamLogoByName(teamShortName);
  if (resolvedLogo) {
    var img = document.createElement("img");
    img.className = "trade-asset-icon " + cssClass;
    img.src = STATIC_URL + teamLogoPath + resolvedLogo + "?w=48&tag=" + imageRefreshTag;
    img.width = 24;
    img.height = 24;
    img.alt = teamShortName;
    img.setAttribute("crossorigin", "anonymous");
    return img;
  }
  var fallback = document.createElement("div");
  fallback.className = "trade-asset-icon " + cssClass;
  fallback.textContent = teamShortName;
  return fallback;
}

function buildTradeSideFromAssets(label, assets, total, teamShortName, teamLogo) {
  var side = document.createElement("div");
  side.className = "trade-side";
  var sideLabel = document.createElement("div");
  sideLabel.className = "trade-side-label";
  sideLabel.textContent = label;
  side.appendChild(sideLabel);

  var iconClass = label === "Sent" ? "sent" : "received";

  for (var i = 0; i < assets.length; i++) {
    var asset = document.createElement("div");
    asset.className = "trade-asset";
    asset.appendChild(createTradeAssetLogo(teamShortName, teamLogo, iconClass));
    var text = document.createElement("span");
    text.textContent = assets[i].label;
    asset.appendChild(text);
    var valEl = document.createElement("span");
    valEl.className = "trade-asset-value";
    valEl.textContent = Math.round(assets[i].value);
    asset.appendChild(valEl);
    side.appendChild(asset);
  }

  var totalRow = document.createElement("div");
  totalRow.className = "trade-side-total";
  var totalLabel = document.createElement("span");
  totalLabel.textContent = "Total " + label;
  totalRow.appendChild(totalLabel);
  var totalVal = document.createElement("span");
  totalVal.textContent = Math.round(total);
  totalRow.appendChild(totalVal);
  side.appendChild(totalRow);

  return side;
}

function buildTradeSide(label, picks, players, teamShortName, teamLogo) {
  var side = document.createElement("div");
  side.className = "trade-side";
  var sideLabel = document.createElement("div");
  sideLabel.className = "trade-side-label";
  sideLabel.textContent = label;
  side.appendChild(sideLabel);

  var total = 0;
  var iconClass = label === "Sent" ? "sent" : "received";

  if (picks) {
    picks.forEach(function(pick) {
      var val = pick.number ? getPickValue(pick.number) : getFuturePickValue(pick.futureRound);
      total += val;
      var asset = document.createElement("div");
      asset.className = "trade-asset";
      asset.appendChild(createTradeAssetLogo(teamShortName, teamLogo, iconClass));
      var text = document.createElement("span");
      text.textContent = getAssetDescription(pick);
      asset.appendChild(text);
      var valEl = document.createElement("span");
      valEl.className = "trade-asset-value";
      valEl.textContent = Math.round(val);
      asset.appendChild(valEl);
      side.appendChild(asset);
    });
  }

  if (players && players.length && typeof players !== "boolean") {
    players.forEach(function(p) {
      var val = getTradedPlayerValue(p);
      total += val;
      var asset = document.createElement("div");
      asset.className = "trade-asset";
      var playerTeam = p.teamName || teamShortName;
      asset.appendChild(createTradeAssetLogo(playerTeam, null, iconClass));
      var text = document.createElement("span");
      var playerName = p.playerName || p.Player || p.name || "Unknown";
      var playerPos = p.position || p.Position || "";
      text.textContent = playerName + (playerPos ? " (" + playerPos + ")" : "");
      asset.appendChild(text);
      var valEl = document.createElement("span");
      valEl.className = "trade-asset-value";
      valEl.textContent = Math.round(val);
      asset.appendChild(valEl);
      side.appendChild(asset);
    });
  }

  var totalRow = document.createElement("div");
  totalRow.className = "trade-side-total";
  var totalLabel = document.createElement("span");
  totalLabel.textContent = "Total " + label;
  totalRow.appendChild(totalLabel);
  var totalVal = document.createElement("span");
  totalVal.textContent = Math.round(total);
  totalRow.appendChild(totalVal);
  side.appendChild(totalRow);

  return side;
}
// === END GRADING SYSTEM ===

if (typeof mdsWidgetDistinction === 'undefined' || !mdsWidgetDistinction) {
  trackReturningUsers('Mock Draft Simulator', (userAdoptionTypes) => {
    trackGAEventForPage("user_adoption", userAdoptionTypes);
  });
}

document.addEventListener("click", hideOffers);
document.addEventListener("click", hideTradeDetails);
document.addEventListener("click", closePlayerInfoPopup);
document.addEventListener("click", closeTeamPicksInfoPopup);

(function () {
  var searchPlayerInput = document.getElementById("player-input");
  searchPlayerInput.addEventListener("click", function () {
    trackGAEventForPage("search_player")
  });
})();

function getDraftType() {
  if (multiUserDraft) {
    return "multiUser";
  }

  return "solo";
}

function sendDashboardTimeSpent() {
  let dashboardEventData = {
    userId: mdsLoggedInUserId,
    draftType: getDraftType(),
    properties: [{
      propertyName: "timeSpent",
      propertyValue: 10,
    }]
  }
  sendUserDashboardData(dashboardEventData);
}

function startCollectiongDashboardTimeSpentData() {
  if (mdsUserIsLoggedIn && mdsLoggedInUserId) {
    timeSpentTimerId = setInterval(sendDashboardTimeSpent, 10000);
  }
}

function stopCollectiongDashboardTimeSpentData() {
  if (mdsUserIsLoggedIn && mdsLoggedInUserId) {
    clearInterval(timeSpentTimerId);
  }
}

function checkMostDraftedPlayersCountInSingleDraft() {
  const draftType = getDraftType();
  if (!dashboardUserData[draftType]["mostPlayersDraftedInSingleDraft"]) {
    return dashboardDraftedPlayers.length;
  }
  if (dashboardUserData[draftType]["mostPlayersDraftedInSingleDraft"] && (dashboardDraftedPlayers.length > dashboardUserData[draftType]["mostPlayersDraftedInSingleDraft"]["count"])) {
    dashboardUserData[draftType]["mostPlayersDraftedInSingleDraft"] = dashboardDraftedPlayers.length;
    return dashboardDraftedPlayers.length;
  }

  return 0;
}

function checkMostTradesInSingleDraft() {
  const draftType = getDraftType();
  if (!dashboardUserData[draftType]["mostTradesInSingleDraft"]) {
    return tradesCompletedCount;
  }
  if (dashboardUserData[draftType]["mostTradesInSingleDraft"] && (tradesCompletedCount > dashboardUserData[draftType]["mostTradesInSingleDraft"]["count"])) {
    dashboardUserData[draftType]["mostTradesInSingleDraft"] = tradesCompletedCount;
    return tradesCompletedCount;
  }

  return 0;
}

function getBiggestReach() {
  const draftType = getDraftType();
  const existingBiggestReach = dashboardUserData[draftType]["biggestReach"];
  const biggestReach = {};
  dashboardDraftedPlayers.forEach(draft => {
    if (!Object.keys(biggestReach).length) {
      biggestReach.playerName = draft[0].name;
      biggestReach.bigBoardRank = draft[0].number;
      biggestReach.draftedPick = draft[1];
    } else if (draft[0].number - draft[1] > biggestReach.bigBoardRank - biggestReach.draftedPick) {
      biggestReach.playerName = draft[0].name;
      biggestReach.bigBoardRank = draft[0].number;
      biggestReach.draftedPick = draft[1];
    }
  });

  if (!existingBiggestReach || (biggestReach.bigBoardRank - biggestReach.draftedPick > existingBiggestReach.bigBoardRank - existingBiggestReach.draftedPick)) {
    return biggestReach;
  }

  return {
    playerName: "",
    bigBoardRank: 0,
    draftedPick: 0,
  }
}

function getBiggestSteal() {
  const draftType = getDraftType();
  const existingBiggestSteal = dashboardUserData[draftType]["biggestSteal"];
  const biggestSteal = {};
  dashboardDraftedPlayers.forEach(draft => {
    if (!Object.keys(biggestSteal).length) {
      biggestSteal.playerName = draft[0].name;
      biggestSteal.bigBoardRank = draft[0].number;
      biggestSteal.draftedPick = draft[1];
    } else if (draft[1] - draft[0].number > biggestSteal.draftedPick - biggestSteal.bigBoardRank) {
      biggestSteal.playerName = draft[0].name;
      biggestSteal.bigBoardRank = draft[0].number;
      biggestSteal.draftedPick = draft[1];
    }
  });

  if (!existingBiggestSteal || (biggestSteal.draftedPick - biggestSteal.bigBoardRank > existingBiggestSteal.draftedPick - existingBiggestSteal.bigBoardRank)) {
    return biggestSteal;
  }

  return {
    playerName: "",
    bigBoardRank: 0,
    draftedPick: 0,
  }
}

function sendUserDashboardData(data) {
  fetch(dashboardDataPostUrl, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

function checkForAlreadyOpenPopup() {
  const popups = $all(".popup");
  if (popups.length) {
    let popupVisible = false;
    popups.forEach(ele => {
      if (!hasClass(ele, "hidden")) {
        popupVisible = true;
      }
    });

    if (popupVisible) {
      return true;
    }
  }

  return false;
}

function setStartDraftBtnPosition() {
  var startBtn = $(".start-draft-btn");
  var filtersContainer = $(".teams-filters-container");
  if (filtersContainer && !filtersContainer.classList.contains(".hidden")) {
    var filtersHolder = filtersContainer.querySelector(".filters-container");
    if (filtersHolder) {
      var bottomHeight = window.innerHeight - filtersHolder.getBoundingClientRect().bottom;
      if (bottomHeight > 92) {
        if (startBtn) {
          addClass(startBtn, "start-btn-bottom");
        }
      } else {
        removeClass(startBtn, "start-btn-bottom");
      }
    }
  }
}

function downloadImageByBlob(blob) {
  var objectURL = window.URL.createObjectURL(blob);

  var link = document.createElement("a");

  link.setAttribute("href", objectURL);
  if (brand === "pfn") {
    link.setAttribute("download", "PFN_Draft_result_" + Date.now());
  } else if (brand === "cfn") {
    link.setAttribute("download", "CFN_Draft_result_" + Date.now());
  } else {
    link.setAttribute("download", "SK_Draft_result_" + Date.now());
  }

  document.body.appendChild(link);

  link.click();
  link.remove();
};

function shareImageByBlob(blob) {
  var file = new File([blob], "temp_image.png", { type: blob.type });

  var shareData;
  if (brand === "pfn") {
    shareData = {
      text: "Rate my mock draft from the @PFSN365 Mock Draft Simulator — then try yours on the #PFNMDS: https://pfsn.app/nflmockdraft",
      files: [file],
    };
  } else if (brand === "cfn") {
    shareData = {
      text: "Rate my mock draft from the @CFN365 Mock Draft Simulator — then try yours on the #CFNMDS: https://bit.ly/cfnmockdraftsim",
      files: [file],
    };
  } else {
    shareData = {
      files: [file],
    };
  }

  if (!navigator.canShare || !navigator.canShare(shareData)) {
    showShareToast("Looks like sharing isn’t supported here. You can download the image and share it manually.");
    return;
  }

  navigator.share(shareData).catch(function (err) {
    if (err.name === "NotAllowedError" || err.name === "AbortError") {
      showShareToast("Looks like sharing isn’t supported here. You can download the image and share it manually.");
    }
  });
};

function showShareToast(message) {
  var toast = document.createElement("div");
  toast.textContent = message;
  addClass(toast, "share-toast");
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.remove();
  }, 3000);
}

function isGradesToggleActive() {
  var btn = document.getElementById("gradeToggle") || $(".mobile-grade-toggle");
  return btn ? btn.classList.contains("active") : true;
}

function downloadTradeResult() {
  var downloadBtn = $(".download-btn-mds");
  if (downloadBtn) {
    addClass(downloadBtn, "btn-blinker");
  }

  trackGAEventForPage("download_image");

  var resultContainer = $(".final-result-container");
  if (resultContainer) {
    var teamName = resultContainer.dataset.shortname;
    var gradesOn = isGradesToggleActive();
    if (teamName == "full_result") {
      var fullResultGradesOn = !multiUserDraft && gradesOn;
      var fullResultGradeSuffix = fullResultGradesOn ? "_grades" : "_nogrades";
      var selectedRound = parseInt(resultContainer.dataset.round);
      var roundKey = selectedRound + fullResultGradeSuffix;
      if (!processedImages[roundKey]) {
        prepareImageForFullResults(selectedRound, fullResultGradesOn).then(function (blob) {
          processedImages[roundKey] = { blob: blob };
          downloadImageByBlob(blob);
        });
      } else {
        downloadImageByBlob(processedImages[roundKey].blob);
      }
    } else {
      var gradeSuffix = gradesOn ? "_grades" : "_nogrades";
      var teamKey = teamName + gradeSuffix;
      if (!processedImages[teamKey]) {
        prepareImageForTeam(teamName, gradesOn).then(function (blob) {
          processedImages[teamKey] = { blob: blob };
          downloadImageByBlob(blob);
        });
      } else {
        downloadImageByBlob(processedImages[teamKey].blob);
      }
    }
  }

  if (downloadBtn) {
    removeClass(downloadBtn, "btn-blinker");
  }
}

function shareFinalResult() {
  var resultContainer = $(".final-result-container");
  if (!resultContainer) return;

  var teamName = resultContainer.dataset.shortname;
  var gradesOn = isGradesToggleActive();
  var isFullResult = teamName == "full_result";
  var effectiveGradesOn = isFullResult ? (!multiUserDraft && gradesOn) : gradesOn;
  var gradeSuffix = effectiveGradesOn ? "_grades" : "_nogrades";
  var baseKey = isFullResult ? resultContainer.dataset.round : teamName;
  var key = baseKey + gradeSuffix;

  if (processedImages[key]) {
    shareImageByBlob(processedImages[key].blob);
  } else {
    var prepareFunc = isFullResult
      ? prepareImageForFullResults(baseKey, effectiveGradesOn)
      : prepareImageForTeam(baseKey, effectiveGradesOn);

    prepareFunc.then(function (blob) {
      processedImages[key] = { blob: blob };
      shareImageByBlob(blob);
    });
  }

  trackGAEventForPage("share_image");

  var shareBtn = $(".share-btn-mds");
  if (shareBtn) {
    addClass(shareBtn, "btn-blinker");
    setTimeout(function () {
      removeClass(shareBtn, "btn-blinker");
    }, 1000);
  }
}

function getPowerRankingsProviderText() {
  const rankingsProviderSelector = $(".players-list-selection-container #players-lists");
  if (rankingsProviderSelector) {
    const provider = rankingsProviderSelector.value;
    if (provider === "consensus") {
      noteText = "Draft Rankings based on Consensus";
    } else {
      noteText = "Draft Rankings from " + playerRankingProvidersMap[provider];
    }
  }

  return noteText;
}

function prepareImageForFullResults(selectedRound, showGrades) {
  var picks;
  if (selectedRound == 1) {
    picks = picksList.slice(0, roundends[selectedRound])
  } else {
    picks = picksList.slice(roundends[selectedRound - 1], roundends[selectedRound]);
  }

  var cHeight = (picks.length / 2) * 50 + 150;
  let noteText;
  if (showPlayerslistSelectionDropdown) {
    cHeight += 10;
    noteText = getPowerRankingsProviderText();
  }

  let cWidth;
  if (multiUserDraft) {
    cWidth = 450;
  } else {
    cWidth = 400;
  }
  if (showGrades) {
    cWidth += 20;
  }

  var canvas = generateCanvas(0, 15, cWidth, cHeight, 2, picks, false, false, selectedRound, "", noteText, null, null, null, null, null, showGrades);

  return persistPaintedCanvas(canvas, selectedRound);
}

function prepareImageForTeam(teamName, showGrades) {
  var picks = getSpentPicks(teamName);
  var futurePicks = getSelectedFuturePicks(teamName);

  var myTeamLogo;
  for (var team of teamsList) {
    if (team.shortName === teamName) {
      myTeamLogo = team.teamLogo;
      break;
    }
  }
  var acquiredPlayers = [];
  var tradedAwayPicks = [];
  var tradedAwayPlayers = [];
  for (var t = 0; t < tradesData.length; t++) {
    if (tradesData[t].givingPlayers && tradesData[t].givingPlayers.length && tradesData[t].givingTeamName === teamName) {
      for (var p = 0; p < tradesData[t].givingPlayers.length; p++) {
        acquiredPlayers.push({ name: tradesData[t].givingPlayers[p].playerName, position: tradesData[t].givingPlayers[p].position, teamLogo: myTeamLogo });
      }
    }
    if (tradesData[t].gettingPlayers && tradesData[t].gettingPlayers.length && tradesData[t].gettingTeamName === teamName) {
      for (var p = 0; p < tradesData[t].gettingPlayers.length; p++) {
        acquiredPlayers.push({ name: tradesData[t].gettingPlayers[p].playerName, position: tradesData[t].gettingPlayers[p].position, teamLogo: myTeamLogo });
      }
    }
    if (tradesData[t].givingPicks && tradesData[t].givingPicks.length && tradesData[t].gettingTeamName === teamName) {
      for (var p = 0; p < tradesData[t].givingPicks.length; p++) {
        var pick = tradesData[t].givingPicks[p];
        tradedAwayPicks.push({ name: pick.number ? "Pick " + pick.number : pick.futurePickYear + " " + pick.futureOriginalTeam + " " + pick.futureRound, teamLogo: tradesData[t].givingTeamLogo });
      }
    }
    if (tradesData[t].gettingPicks && tradesData[t].gettingPicks.length && tradesData[t].givingTeamName === teamName) {
      for (var p = 0; p < tradesData[t].gettingPicks.length; p++) {
        var pick = tradesData[t].gettingPicks[p];
        tradedAwayPicks.push({ name: pick.number ? "Pick " + pick.number : pick.futurePickYear + " " + pick.futureOriginalTeam + " " + pick.futureRound, teamLogo: tradesData[t].gettingTeamLogo });
      }
    }
    if (tradesData[t].givingPlayers && tradesData[t].givingPlayers.length && tradesData[t].gettingTeamName === teamName) {
      for (var p = 0; p < tradesData[t].givingPlayers.length; p++) {
        tradedAwayPlayers.push({ name: tradesData[t].givingPlayers[p].playerName, position: tradesData[t].givingPlayers[p].position, teamLogo: tradesData[t].givingTeamLogo });
      }
    }
    if (tradesData[t].gettingPlayers && tradesData[t].gettingPlayers.length && tradesData[t].givingTeamName === teamName) {
      for (var p = 0; p < tradesData[t].gettingPlayers.length; p++) {
        tradedAwayPlayers.push({ name: tradesData[t].gettingPlayers[p].playerName, position: tradesData[t].gettingPlayers[p].position, teamLogo: tradesData[t].gettingTeamLogo });
      }
    }
  }

  var upperItems = picks.length + futurePicks.length + acquiredPlayers.length;
  var totalTradedAwayItems = tradedAwayPicks.length + tradedAwayPlayers.length;
  var dividerHeight = totalTradedAwayItems ? 55 : 0;
  var upperTwoCol = upperItems > 5;
  var tradedAwayTwoCol = totalTradedAwayItems > 2;
  var upperRows = upperTwoCol ? Math.ceil(upperItems / 2) : upperItems;
  var tradedAwayRows = tradedAwayTwoCol ? Math.ceil(totalTradedAwayItems / 2) : totalTradedAwayItems;
  var tradedAwayHeight = tradedAwayRows * 50;
  var cHeight = (upperRows * 50) + 100 + dividerHeight + tradedAwayHeight + 80;

  let noteText;
  if (showPlayerslistSelectionDropdown) {
    cHeight += 20;
    noteText = getPowerRankingsProviderText();
  }

  var currentTeam = "";
  for (var team of teamsList) {
    if (team.shortName === teamName) {
      currentTeam = team;
      break;
    }
  }

  var overallGradeStr = null;
  var canvasTradeGrades = [];

  if (showGrades) {
    var overallGrade = calculateOverallTeamGrade(teamName);
    overallGradeStr = (overallGrade && overallGrade.grade !== 'N/A') ? overallGrade.grade : null;
    if (overallGradeStr) {
      cHeight += 35;
    }
  }

  for (var tg = 0; tg < tradesData.length; tg++) {
    var tradeGrade = getTradeGradeForTeam(tg, teamName);
    if (tradeGrade) {
      var data = computeTradeCardData(tradesData[tg], teamName);
      canvasTradeGrades.push({
        title: data.title,
        roundLabel: data.roundLabel,
        grade: showGrades ? data.grade : null,
        sentAssets: data.receivedAssets,
        recAssets: data.sentAssets,
        sentTotal: data.receivedTotal,
        recTotal: data.sentTotal,
        netValue: data.netValue
      });
    }
  }

  if (canvasTradeGrades.length) {
    var maxCardHeight = 0;
    canvasTradeGrades.forEach(function(tg) {
      var totalAssets = tg.sentAssets.length + tg.recAssets.length;
      var cardH = 80 + (totalAssets * 22) + 95;
      if (cardH > maxCardHeight) maxCardHeight = cardH;
    });
    var tradeRows = canvasTradeGrades.length > 1 ? Math.ceil(canvasTradeGrades.length / 2) : canvasTradeGrades.length;
    var tradeGradesHeight = 50 + (tradeRows * (maxCardHeight + 10));
    cHeight += tradeGradesHeight + 60;
  }

  var canvas = generateCanvas(0, 15, 400, cHeight, 2, picks, futurePicks, true, 0, currentTeam, noteText, acquiredPlayers, tradedAwayPicks, tradedAwayPlayers, overallGradeStr, canvasTradeGrades, showGrades);

  return persistPaintedCanvas(canvas, teamName);
}

function getSpentPicks(teamName) {
  var picks = [];
  for (var i = 0; i < picksList.length; i++) {
    if (i == (roundends[rounds])) break;
    if (picksList[i].currentTeam.shortName == teamName) {
      picks.push(picksList[i]);
    }
  }
  return picks;
}

function persistPaintedCanvas(canvas, teamName) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png", 1);
  });
};

function hideOffers(event) {
  var offersContainer = $(".offer-container");
  var offersOverlay = $(".overlay");
  if (!offersContainer) return;
  if (typeof offersContainer != "object") return;
  if (!offersContainer.classList.contains("hidden") && (!event.target.closest(
    ".offer-container") || event.target.closest(".close-icon")) &&
    !event.target.closest(".show-offers")) {
    addClass(offersContainer, "hidden");
    addClass(offersOverlay, "hidden");
  }
  if (event.target.closest(".offer-container .close-icon")) {
    if (!multiUserDraft) {
      hideResumeDraftBtn();
      showPauseDraftBtn();
      disablePauseDraftBtn();
    }

    if (!IS_DESKTOP) {
      if (offersContainer.dataset.autopopulated === "true") {
        offersContainer.dataset.autopopulated = false;
        if (currentSection !== "pool") {
          toggleSimView("pool", true);
        }
      }
    }
  }
}

function hideTradeDetails(event) {
  var tradesContainer = $(".trade-data-container");
  var teamPicksPopup = $(".team-picks-info-popup");
  var tradesOverlay = $(".overlay");
  if (!tradesContainer) return;
  if (typeof tradesContainer != "object") return;
  if (!tradesContainer.classList.contains("hidden") && (!event.target.closest(
    ".trade-data-container") || event.target.closest(".close-trades-info")) &&
    !event.target.closest(".pick-trade-info-btn") && !event.target.closest(".trade-icon-holder")) {
    addClass(tradesContainer, "hidden");
    if (!teamPicksPopup) {
      addClass(tradesOverlay, "hidden");
    }
  }
}

function assignPicks() {
  for (var pick of picksList) {
    for (var team of teamsList) {
      if (team.shortName === pick.shortName) {
        team.draftPicks.push(pick);
        pick.originalTeam = team;
        pick.currentTeam = team;
      }

      // if (widgetData && (pick.currentTeam !== pick.originalTeam)) {
      //   if (team.shortName === pick.currentTeam) {
      //     pick.currentTeam === team;
      //   }
      // }
    }
  }
};

function reassignWidgetData() {
  for (var pick of picksList) {
    for (var team of teamsList) {
      if (team.shortName === pick.currentTeam) {
        pick.currentTeam = team;
      }
      if (team.shortName === pick.originalTeam) {
        pick.originalTeam = team;
      }
    }

    if (mdsWidgetDistinction) {
      const playerIndex = playersListAll.findIndex(player => player.name === pick.playerSelection);
      if (playerIndex > -1) {
        pick.playerSelection = Object.assign({}, playersListAll[playerIndex]);
      }
    }
  }

  for (var team of teamsList) {
    const draftPicksList = [];
    for (var draftPick of team.draftPicks) {
      const pickIndex = picksList.findIndex(pick => pick.number === draftPick.number && pick.futureRound === draftPick.futureRound && pick.futurePickYear === draftPick.futurePickYear && pick.futureOriginalTeam === draftPick.futureOriginalTeam);
      if (pickIndex > -1) {
        draftPicksList.push(picksList[pickIndex]);
      } else {
        // Future picks not in picksList — convert string refs back to objects
        if (draftPick.currentTeam && typeof draftPick.currentTeam === 'string') {
          for (var t of teamsList) {
            if (t.shortName === draftPick.currentTeam) {
              draftPick.currentTeam = t;
              break;
            }
          }
        }
        if (draftPick.originalTeam && typeof draftPick.originalTeam === 'string') {
          for (var t of teamsList) {
            if (t.shortName === draftPick.originalTeam) {
              draftPick.originalTeam = t;
              break;
            }
          }
        }
        draftPicksList.push(draftPick);
      }
    }

    team.draftPicks = draftPicksList;

    team.draftedPlayers.forEach(player => {
      const teamIndex = teamsList.findIndex(team => team.shortName === player.draftedBy);
      if (teamIndex > -1) {
        player.draftedBy = teamsList[teamIndex];
      }
    });
  }

  // Reassign tradesData pick references back to team objects
  if (tradesData && tradesData.length) {
    tradesData.forEach(function(trade) {
      var pickArrays = [trade.givingPicks, trade.gettingPicks];
      pickArrays.forEach(function(picks) {
        if (picks && picks.length) {
          picks.forEach(function(pick) {
            if (pick.currentTeam && typeof pick.currentTeam === 'string') {
              for (var t of teamsList) {
                if (t.shortName === pick.currentTeam) {
                  pick.currentTeam = t;
                  break;
                }
              }
            }
            if (pick.originalTeam && typeof pick.originalTeam === 'string') {
              for (var t of teamsList) {
                if (t.shortName === pick.originalTeam) {
                  pick.originalTeam = t;
                  break;
                }
              }
            }
          });
        }
      });
    });
  }
}

function assignMaxPositionDraftCount() {
  teamsList.forEach(team => {
    team.maxPositionAllowedCount = {
      "QB": 2,
      "RB": 2,
      "WR": 3,
      "TE": 2,
      "OT": 3,
      "OG": 3,
      "OC": 2,
      "EDGE": 3,
      "DT": 3,
      "LB": 3,
      "CB": 3,
      "S": 3,
      "K": 1,
      "P": 1
    }
  })
}

function filterPlayers(currentPosition) {
  if (selectedPositionFilter === currentPosition) {
    return;
  }

  selectedPositionFilter = currentPosition;

  var positionButtonsHolder = $all(".players-positions .positions");
  if (positionButtonsHolder) {
    for (var positionBtn of positionButtonsHolder) {
      removeClass(positionBtn, "selected");
    }

    var selectedPosition = $(".players-positions .positions." + currentPosition);
    if (selectedPosition) {
      addClass(selectedPosition, "selected");
    }
  }

  var selectedFilter = $(".positions-filters .positions .selected");
  if (selectedFilter) {
    removeClass(selectedFilter, "selected");
  }

  function togglePlayersData(position) {
    var playersList = $all(".players-list .player");
    var offenceFiltersHolder = $(".positions-filters .offence");
    var defenceFiltersHolder = $(".positions-filters .defence");
    var stFiltersHolder = $(".positions-filters .st");
    if (position == "all") {
      for (var i = 0; i < playersList.length; i++) {
        removeClass(playersList[i], "hidden");
      }

      if (offenceFiltersHolder) {
        addClass(offenceFiltersHolder, "hidden");
      }
      if (defenceFiltersHolder) {
        addClass(defenceFiltersHolder, "hidden");
      }
      if (stFiltersHolder) {
        addClass(stFiltersHolder, "hidden");
      }
    } else if (position == "offense") {
      for (var i = 0; i < playersList.length; i++) {
        var position = playersList[i].dataset.position;
        if (position == "QB" || position == "RB" || position == "WR" || position == "TE" || position == "OT" ||
          position == "OG" || position == "OC") {
          removeClass(playersList[i], "hidden");
        } else {
          addClass(playersList[i], "hidden");
        }
      }

      if (offenceFiltersHolder) {
        removeClass(offenceFiltersHolder, "hidden");
      }
      if (defenceFiltersHolder) {
        addClass(defenceFiltersHolder, "hidden");
      }
      if (stFiltersHolder) {
        addClass(stFiltersHolder, "hidden");
      }
    } else if (position == "defense") {
      for (var i = 0; i < playersList.length; i++) {
        var position = playersList[i].dataset.position;
        if (position == "DT" || position == "EDGE" || position == "LB" || position == "CB" || position == "S") {
          removeClass(playersList[i], "hidden");
        } else {
          addClass(playersList[i], "hidden");
        }
      }

      if (offenceFiltersHolder) {
        addClass(offenceFiltersHolder, "hidden");
      }
      if (defenceFiltersHolder) {
        removeClass(defenceFiltersHolder, "hidden");
      }
      if (stFiltersHolder) {
        addClass(stFiltersHolder, "hidden");
      }
    } else if (position == "st") {
      for (var i = 0; i < playersList.length; i++) {
        var position = playersList[i].dataset.position;
        if (position == "K" || position == "P") {
          removeClass(playersList[i], "hidden");
        } else {
          addClass(playersList[i], "hidden");
        }
      }

      if (offenceFiltersHolder) {
        addClass(offenceFiltersHolder, "hidden");
      }
      if (defenceFiltersHolder) {
        addClass(defenceFiltersHolder, "hidden");
      }
      if (stFiltersHolder) {
        removeClass(stFiltersHolder, "hidden");
      }
    }
  }

  const teamNeedsContainer = $(".players-container .team-needs-picks-container");
  if (teamNeedsContainer) {
    if (selectedPositionFilter === "all") {
      removeClass(teamNeedsContainer, "team-needs-picks-container-sticky");
    } else {
      addClass(teamNeedsContainer, "team-needs-picks-container-sticky");
    }
  }

  setTimeout(() => togglePlayersData(currentPosition), 200);

  trackGAEventForPage("role_filter", { "role": currentPosition });
}

function changePosition(target) {
  var playersList = $all(".players-list .player");
  var targetPosition;
  if (target) {
    targetPosition = target.dataset.position;
  }
  for (var i = 0; i < playersList.length; i++) {
    var position = playersList[i].dataset.position;
    if (position == targetPosition) {
      removeClass(playersList[i], "hidden");
    } else {
      addClass(playersList[i], "hidden");
    }
  }

  var childrens = target.parentElement.children;
  for (var children of childrens) {
    removeClass(children, "selected");
  }

  addClass(target, "selected");
}

async function startDraft(targetElement) {
  targetElement.setAttribute("disabled", "disabled");

  setTimeout(() => {
    targetElement.removeAttribute("disabled");
    startDraftHelper();
  }, 200);
}

async function startDraftHelper() {
  playerBoardsList = {};
  if (showPlayerslistSelectionDropdown) {
    const rankingsProviderResultContainer = $(".draft-rankings-provider-container");
    if (rankingsProviderResultContainer) {
      removeClass(rankingsProviderResultContainer, "hidden");
      const rankingsProviderResultText = rankingsProviderResultContainer.querySelector(".draft-rankings-provider-text");
      if (rankingsProviderResultText) {
        rankingsProviderResultText.innerHTML = getPowerRankingsProviderText();
      }
    }
  }

  if (!IS_DESKTOP) {
    const footerNav = $(".pfn-content-wrapper .pfn-footer");
    if (footerNav) {
      addClass(footerNav, "hidden");
    }
  }

  startCollectiongDashboardTimeSpentData();
  if (brand && socket) {
    socket.disconnect();
    multiUserDraft = false;
  }

  if (mdsUserIsLoggedIn && mdsLoggedInUserId && !multiUserDraft) {
    let dashboardEventData = {
      userId: mdsLoggedInUserId,
      draftType: getDraftType(),
      properties: [
        {
          propertyName: "draftsStartedCount",
          propertyValue: 1,
        }
      ]
    }
    sendUserDashboardData(dashboardEventData);
  }

  showDraftUI();

  await yieldToMain();

  if (isRedraft) {
    const yearSelector = $(".year-list-selection-container-holder #years-lists");
    if (yearSelector) {
      trackGAEventForPage("sim_started", {
        "year": yearSelector.value,
        "redraft": isRedraft
      });
    }  
  } else {
    trackGAEventForPage("sim_started");
  }

  if (brand) {
    var simContentHolder = $(".simulator-content-holder");
    if (simContentHolder) {
      simContentHolder.style.marginBottom = "10px";
    }
  }

  const toolContainer = $(".pfn-content-container");
  if (toolContainer) {
    toolContainer.style.marginBottom = "unset";
  }

  var seoHeaderText = $(".seo-header-text");
  if (seoHeaderText) {
    addClass(seoHeaderText, "hidden");
  }

  if (widgetData && widgetData.selectedPickStart) {
    pickstart = widgetData.selectedPickStart;
  }

  var roundsInput = mdsWidgetDistinction ? $('#rounds-dropdown') : $('input[name="rounds"]:checked');
  if (roundsInput) {
    rounds = parseInt(roundsInput.value);
    if (mdsWidgetDistinction && rounds > 2) {
      rounds = 2;
    }

    if (widgetData && widgetData.continueRounds) {
      rounds = widgetData.continueRounds;
    }

    trackGAEventForPage("rounds_selected", { "rounds": rounds, "redraft": isRedraft });
  }

  let initialPause = 2500;
  var executionRateInput = $('input[name="speed"]:checked');
  if (executionRateInput) {
    if (executionRateInput.value == "slow") {
      executionRate = 3000;
    } else if (executionRateInput.value == "normal") {
      executionRate = 1000;
    } else if (executionRateInput.value == "fast") {
      executionRate = 150;
    }

    if (widgetData && widgetData.selectedExecutionRate) {
      executionRate = 1;
      initialPause = 1;
    }

    trackGAEventForPage("simulation_speed", { "sim_speed": executionRateInput.value });
  }

  var selectedTeams = $all(".team-holder.selected");
  for (var i = 0; i < selectedTeams.length; i++) {
    userSelectedTeams.push(selectedTeams[i].dataset.shortname);
  }

  if (widgetData && widgetData.selectedUserTeams && widgetData.selectedUserTeams.length) {
    userSelectedTeams = widgetData.selectedUserTeams;
  }

  if (!userSelectedTeams.length) {
    var tradeProposalBtn = $(".simulation-management-buttons-container .user-proposal");
    if (tradeProposalBtn) {
      tradeProposalBtn.disabled = true;
      tradeProposalBtn.style.opacity = "0.4";
      tradeProposalBtn.style.cursor = "not-allowed";
    }

    if (IS_DESKTOP) {
      let myPicksBtn = $(".mypicks-btn-container .my-picks-btn");
      if (myPicksBtn) {
        myPicksBtn.disabled = true;
        myPicksBtn.style.cursor = "not-allowed";
        myPicksBtn.style.opacity = "0.4";
      }
    } else {
      let myPicksBtn = $(".sim-nav-container .my-picks");
      if (myPicksBtn) {
        addClass(myPicksBtn, "hidden");
      }
    }
  }

  trackGAEventForPage("team_selected", { "teams": userSelectedTeams, "redraft": isRedraft });

  currentSection = "result";

  disableShowOffersBtn();

  if (!(widgetData && widgetData.continueRounds)) {
    assignPicks();
  } else {
    reassignWidgetData();
  }

  assignMaxPositionDraftCount();

  await yieldToMain();

  calculateAllTeamsNeeds();
  fillRoundPics();

  var seoContent = $(".tag-page-info-container");
  if (seoContent) {
    addClass(seoContent, "hidden");
  }

  var relatedStories = $(".tag-page-related-stories-section");
  if (relatedStories) {
    addClass(relatedStories, "hidden");
  }

  let currentPick = getCurrentPick().currentPick;
  if (currentPick.number) {
    updateNextPick(currentPick.number);
    updateTeamNeeds(currentPick.number);
  }

  var overlay = document.createElement("div");
  addClass(overlay, "hidden");
  addClass(overlay, "overlay");
  document.body.appendChild(overlay);

  initialStartTimeoutId = setTimeout(() => {
    fillPlayerForAPick();
  }, initialPause);
}

function showDraftUI() {
    var draftSelectionContainer = $(".teams-filters-container");
  if (draftSelectionContainer) {
    addClass(draftSelectionContainer, "hidden");
  }

  var draftSelectionContainer = $(".landing-page-container");
  if (draftSelectionContainer) {
    addClass(draftSelectionContainer, "hidden");
  }

  var infoSection = $(".page-info");
  if (infoSection) {
    addClass(infoSection, "hidden");
  }

  var sectionSeparator = $(".section-separator");
  if (sectionSeparator) {
    addClass(sectionSeparator, "hidden");
  }

  var draftSimulationContainer = $(".draft-simulation-container");
  if (draftSimulationContainer) {
    removeClass(draftSimulationContainer, "hidden");
  }

}

function showPlayerInfo(e) {
  if (isPausingDraftRequired()) {
    pauseDraft();
  }

  var playerNameContainer = e.target.closest(".player") || e.target.closest(".traded-player-name-position-container");
  let playerName;
  if (playerNameContainer) {
    playerName = playerNameContainer.dataset.name
  }

  var playerData;
  for (var player of playersListAll) {
    if (player.name === playerName) {
      playerData = player;
      break;
    }
  }

  trackGAEventForPage("player_info_popup", {
    playerName: playerData.name,
  })

  if (brand && playerData.playerLink) {
    showPfnPlayerInfo(playerData);
  } else {
    showDefaultPlayerInfo(playerData);
  }
}

function showPfnPlayerInfo(playerData) {
  var pfnTemplate = document.getElementById("pfn-player-info");
  if (!pfnTemplate) return;

  closePlayerInfoPopup();

  playerInfoPopup = pfnTemplate.content.cloneNode(true);
  playerInfoPopup = playerInfoPopup.querySelector(".pfn-player-info-popup");
  if (!playerInfoPopup) return;

  var iframe = playerInfoPopup.querySelector(".pfn-player-iframe");
  var loader = playerInfoPopup.querySelector(".pfn-player-iframe-loader");

  if (iframe) {
    iframe.addEventListener("load", function() {
      if (loader) {
        loader.style.display = "none";
      }
      iframe.style.display = "block";
    });

    iframe.src = playerData.playerLink + "?mds-popup"; //query param for removing unwanted elements in player info popup from vercel page
  }

  var overlay = $(".overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  } else {
    var overlay = document.createElement("div");
    addClass(overlay, "overlay");
    document.body.appendChild(overlay);
  }

  addClass(playerInfoPopup, "popup");
  document.body.appendChild(playerInfoPopup);
}

function showDefaultPlayerInfo(playerData) {
  var playerInfoTemplate = document.getElementById("player-info");
  if (!playerInfoTemplate) return;

  closePlayerInfoPopup();

  playerInfoPopup = playerInfoTemplate.content.cloneNode(true);
  playerInfoPopup = playerInfoPopup.querySelector(".player-info-popup");
  if (playerInfoPopup) {
    playerNameHolder = playerInfoPopup.querySelector(".player-name");
    if (playerNameHolder) {
      playerNameHolder.innerHTML = playerData.name;
    }

    playerPositionHolder = playerInfoPopup.querySelector(".player-position");
    if (playerPositionHolder) {
      playerPositionHolder.innerHTML = playerData.position;
    }

    playerDraftFromHolder = playerInfoPopup.querySelector(".player-draft-from");
    if (playerDraftFromHolder) {
      playerDraftFromHolder.innerHTML = playerData.draftFrom;
    }

    playerHeightHolder = playerInfoPopup.querySelector(".player-height");
    if (playerHeightHolder) {
      playerHeightHolder.innerHTML = "Height: " + playerData.plHeight + " |";
    }

    playerWeightHolder = playerInfoPopup.querySelector(".player-weight");
    if (playerWeightHolder) {
      playerWeightHolder.innerHTML = "Weight: " + playerData.plWeight + " lbs |";
    }

    playerRASHolder = playerInfoPopup.querySelector(".player-ras");
    if (playerRASHolder) {
      playerRASHolder.innerHTML = "RAS: " + playerData.plRAS;
    }

    playerDescriptionHolder = playerInfoPopup.querySelector(".player-description");
    if (playerDescriptionHolder) {
      let splitBlurb;
      let formattedBlurb = "";
      if (playerData.blurb) {
        splitBlurb = playerData.blurb.split("\n");
        splitBlurb.map((bio) => {
          formattedBlurb += "<p>" + bio + "</p>";
        });
      }
      playerDescriptionHolder.innerHTML = formattedBlurb || "Coming Soon!";
    }

    if (!brand || playerData.playerLink === "") {
      var fullRepostBtn = playerInfoPopup.querySelector(".full-report-btn");
      if (fullRepostBtn) {
        addClass(fullRepostBtn, "hidden");
      }
    } else {
      var fullReportBtn = playerInfoPopup.querySelector(".full-report-btn");
      fullReportBtn.setAttribute("href", playerData.playerLink);
    }

    var overlay = $(".overlay");
    if (overlay) {
      removeClass(overlay, "hidden");
    } else {
      var overlay = document.createElement("div");
      addClass(overlay, "overlay");
      document.body.appendChild(overlay);
    }

    addClass(playerInfoPopup, "popup");
    document.body.appendChild(playerInfoPopup)
  }
}

function closePlayerInfoPopup(event) {
  var playerInfoPopup = $(".player-info-popup");
  var teamPicksPopup = $(".team-picks-info-popup");
  var overlay = $(".overlay");

  if (!playerInfoPopup) return;
  if (typeof playerInfoPopup != "object") return;

  var shouldClose = !event || (
    !playerInfoPopup.classList.contains("hidden") && (!event.target.closest(
      ".player-info-popup") || event.target.closest(".player-info-popup .player-info-close-icon-container")
      || event.target.closest(".player-info-popup .close-btn"))
      && !event.target.closest(".player-info-btn") && !event.target.closest(".player-details")
      && !event.target.closest(".traded-player-name-position-container")
  );

  if (shouldClose) {
    var iframe = playerInfoPopup.querySelector("iframe");
    if (iframe) {
      iframe.src = "about:blank";
      iframe.remove();
    }
    playerInfoPopup.remove();
    if (overlay && !teamPicksPopup) {
      addClass(overlay, "hidden");
    }
  }
}

function unhideUserSelectionIcon() {
  var addPlayerIcons = $all(".players-list .add-player");
  if (addPlayerIcons) {
    for (var i = 0; i < addPlayerIcons.length; i++) {
      removeClass(addPlayerIcons[i], "hidden");
    }
  }
}

function hideUserSelectionIcon() {
  var addPlayerIcons = $all(".players-list .add-player");
  if (addPlayerIcons) {
    for (var i = 0; i < addPlayerIcons.length; i++) {
      addClass(addPlayerIcons[i], "hidden");
    }
  }
}

function addPlayerToPick(e) {
  let target = e.target;
  if (multiUserDraft) {
    hideUserSelectionIcon();
    disableShowOffersBtn();
    sendMultiUserSelectedPlayerInfo(target);
    if (!IS_DESKTOP) {
      toggleSimView("result", true);
    }

    return;
  }

  var pickContainer = getCurrentPickContainer();
  const teamNeedsContainer = pickContainer.querySelector(".team-needs-info-container");
  if (teamNeedsContainer) {
    addClass(teamNeedsContainer, "hidden");
  }

  var pickNumber;
  if (pickContainer) {
    let selectedPlayerContainer = pickContainer.querySelector(".traded-player-name-position-container");
    if (selectedPlayerContainer) {
      selectedPlayerContainer.dataset.name = target.dataset.name;
      selectedPlayerContainer.style.cursor = "pointer";
      selectedPlayerContainer.onclick = showPlayerInfo;
    }
    var playerNameEl = pickContainer.querySelector(".player-name");
    if (playerNameEl) playerNameEl.innerHTML = target.dataset.name;
    var playerPositionEl = pickContainer.querySelector(".player-position");
    if (playerPositionEl) playerPositionEl.innerHTML = target.dataset.position + " " + target.dataset.draftfrom;
    removeClass(pickContainer, "currentPick");
    pickNumber = parseInt(pickContainer.dataset.number);

    if (!multiUserDraft) {
      draftHistory.push(createDraftSnapshot());
    }

    var parent = target.closest(".player");
    var playerNumber = parseInt(parent.dataset.number);

    var player;
    for (var i = 0; i < playersList.length; i++) {
      if (playersList[i].number === playerNumber) {
        player = playersList.splice(i, 1);
      }
    }

    if (parent) {
      parent.remove();
    }

    addPlayerToPickHelper(target, pickNumber, player);
  }
}

async function addPlayerToPickHelper(target, pickNumber, player) {
  await yieldToMain();
  hideUserSelectionIcon();
  disableRevertPickBtn();
  showPauseDraftBtn();
  enablePauseDraftBtn();
  disableShowOffersBtn();

  var currentPickIndex = picksList.findIndex((i) => i.onTheClock === true);
  picksList[currentPickIndex].onTheClock = false;
  picksList[currentPickIndex + 1].onTheClock = true;
  pauseDraftFlag = false;

  var pickIndex = picksList.findIndex((item) => item.number === pickNumber);
  const pick = picksList[pickIndex];
  pick.playerSelection = player[0];
  computeAndStorePickGrade(pick);
  pick.currentTeam.draftedPlayers.push(pick.playerSelection);
  pick.playerSelection.draftedBy = pick.currentTeam;

  if (pick.currentTeam.teamNeed1 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed1 = "";
  } else if (pick.currentTeam.teamNeed2 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed2 = "";
  } else if (pick.currentTeam.teamNeed3 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed3 = "";
  } else if (pick.currentTeam.teamNeed4 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed4 = "";
  } else if (pick.currentTeam.teamNeed5 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed5 = "";
  }
  if (pick.playerSelection.position === "QB") {
    if (pick.currentTeam.needQB < 1) {
      pick.currentTeam.needQB *= 0;
    } else if (pick.currentTeam.needQB === 1) {
      pick.currentTeam.needQB *= 0.1;
    } else {
      pick.currentTeam.needQB = 0.5;
    }
  } else if (pick.playerSelection.position === "RB") {
    if (pick.currentTeam.needRB < 1) {
      pick.currentTeam.needRB *= 0;
    } else if (pick.currentTeam.needRB === 1) {
      pick.currentTeam.needRB *= 0.1;
    } else {
      pick.currentTeam.needRB = 1;
    }
  } else if (pick.playerSelection.position === "WR") {
    if (pick.currentTeam.needWR < 1) {
      pick.currentTeam.needWR *= 0;
    } else if (pick.currentTeam.needWR === 1) {
      pick.currentTeam.needWR *= 0.1;
    } else {
      pick.currentTeam.needWR = 1;
    }
  } else if (pick.playerSelection.position === "TE") {
    if (pick.currentTeam.needTE < 1) {
      pick.currentTeam.needTE *= 0;
    } else if (pick.currentTeam.needTE === 1) {
      pick.currentTeam.needTE *= 0.1;
    } else {
      pick.currentTeam.needTE = 1;
    }
  } else if (pick.playerSelection.position === "OT") {
    if (pick.currentTeam.needOT < 1) {
      pick.currentTeam.needOT *= 0;
    } else if (pick.currentTeam.needOT === 1) {
      pick.currentTeam.needOT *= 0.1;
    } else {
      pick.currentTeam.needOT = 1;
    }
  } else if (pick.playerSelection.position === "OG") {
    if (pick.currentTeam.needOG < 1) {
      pick.currentTeam.needOG *= 0;
    } else if (pick.currentTeam.needOG === 1) {
      pick.currentTeam.needOG *= 0.1;
    } else {
      pick.currentTeam.needOG = 1;
    }
  } else if (pick.playerSelection.position === "OC") {
    if (pick.currentTeam.needOC < 1) {
      pick.currentTeam.needOC *= 0;
    } else if (pick.currentTeam.needOC === 1) {
      pick.currentTeam.needOC *= 0.1;
    } else {
      pick.currentTeam.needOC = 1;
    }
  } else if (pick.playerSelection.position === "EDGE") {
    if (pick.currentTeam.needEDGE < 1) {
      pick.currentTeam.needEDGE *= 0;
    } else if (pick.currentTeam.needEDGE === 1) {
      pick.currentTeam.needEDGE *= 0.1;
    } else {
      pick.currentTeam.needEDGE = 1;
    }
  } else if (pick.playerSelection.position === "LB") {
    if (pick.currentTeam.needLB < 1) {
      pick.currentTeam.needLB *= 0;
    } else if (pick.currentTeam.needLB === 1) {
      pick.currentTeam.needLB *= 0.1;
    } else {
      pick.currentTeam.needLB = 1;
    }
  } else if (pick.playerSelection.position === "CB") {
    if (pick.currentTeam.needCB < 1) {
      pick.currentTeam.needCB *= 0;
    } else if (pick.currentTeam.needCB === 1) {
      pick.currentTeam.needCB *= 0.1;
    } else {
      pick.currentTeam.needCB = 1;
    }
  } else if (pick.playerSelection.position === "S") {
    if (pick.currentTeam.needS < 1) {
      pick.currentTeam.needS *= 0;
    } else if (pick.currentTeam.needS === 1) {
      pick.currentTeam.needS *= 0.1;
    } else {
      pick.currentTeam.needS = 1;
    }
  }

  updateSingleTeamNeedsContainer(pick.currentTeam.shortName);

  if (mdsUserIsLoggedIn && mdsLoggedInUserId && !multiUserDraft) {
    let roundIndex = roundends.findIndex(num => num >= currentPickIndex + 1);
    if (roundIndex === 0) {
      roundIndex = 1;
    }
    let dashboardEventData = {
      userId: mdsLoggedInUserId,
      draftType: getDraftType(),
      properties: [
        {
          propertyName: "playerDrafted",
          propertyValue: 1,
        }
      ],
      draftedPlayer: {
        playerName: player[0].name,
        position: player[0].position,
        round: roundText[roundIndex - 1],
        college: player[0].draftFrom,
        conference: player[0].Conference,
      }
    }
    pendingDashboardEvents.push(dashboardEventData);
    dashboardDraftedPlayers.push([player[0], currentPickIndex + 1]);
  }

  trackGAEventForPage("player_selected", {
    "playerName": target.dataset.name,
    "pick_number": pickNumber,
    "team": picksList[currentPickIndex].currentTeam.name,
    "redraft": isRedraft,
  });

  if (brand && prodDBSimNum && !isRedraft) {
    var dataToPost = {
      sim: prodDBSimNum,
      pick: pickNumber,
      team: picksList[currentPickIndex].currentTeam.shortName,
      player: player[0].name,
      position: player[0].position,
      school: player[0].draftFrom,
      pfnrank: player[0].number,
    }

    axios.post(
      "https://ufpf71himc.execute-api.us-east-1.amazonaws.com/access_pfn_db_production/",
      dataToPost
    );

    var vaultDataToPost = {
      pick: pickNumber,
      team: picksList[currentPickIndex].currentTeam.shortName,
      player: player[0].name,
      position: player[0].position,
      school: player[0].draftFrom,
      pfnrank: player[0].number,
    }

    axios.post(
      "https://www.profootballnetwork.com/nfl-mds-draft-pick-vault",
      vaultDataToPost
    );
  }

  if (!IS_DESKTOP) {
    toggleSimView("result", true);
  } else {
    let myPicksBtn = $(".mypicks-btn-holder .my-picks-btn");
    if (myPicksBtn && myPicksBtn.classList.contains("selected")) {
      let selectedTeamBtn = $(".selected-user-teams-container .team-logo-btn-container.selected button.team-logo-btn");
      if (selectedTeamBtn) {
        selectedTeamBtn.click();
      }
    }
  }

  setTimeout(() => {
    fillPlayerForAPick();
  }, executionRate);
}

function showPauseDraftBtn() {
  var pauseDraftButton = $(".pause-draft");
  if (pauseDraftButton) {
    removeClass(pauseDraftButton, "hidden");
  }
}

function hidePauseDraftBtn() {
  var pauseDraftButton = $(".pause-draft");
  if (pauseDraftButton) {
    addClass(pauseDraftButton, "hidden");
  }
}

function disablePauseDraftBtn() {
  var pauseDraftButton = $(".pause-draft");
  if (pauseDraftButton) {
    pauseDraftButton.disabled = true;
    pauseDraftButton.style.opacity = "0.4";
    pauseDraftButton.style.cursor = "not-allowed";
  }
}

function enablePauseDraftBtn() {
  var pauseDraftButton = $(".pause-draft");
  if (pauseDraftButton) {
    pauseDraftButton.disabled = false;
    pauseDraftButton.style.opacity = "1";
    pauseDraftButton.style.cursor = "pointer";
  }
}

function isResumingDraftRequired() {
  var resumeDraftButton = $(".resume-draft");
  if (!resumeDraftButton) return;
  if (typeof resumeDraftButton != "object") return;
  if (!resumeDraftButton.classList.contains("hidden") && !resumeDraftButton.disabled && pauseDraftFlag) {
    return true;
  }
  return false;
}

function isPausingDraftRequired() {
  var pauseDraftButton = $(".pause-draft");
  if (!pauseDraftButton) return;
  if (typeof pauseDraftButton != "object") return;
  if (!pauseDraftButton.classList.contains("hidden") && !pauseDraftButton.disabled && !pauseDraftFlag) {
    return true;
  }
  return false;
}

function pauseDraft(manual) {
  if (manual) {
    pausedManually = manual;
  }
  pauseDraftFlag = true;
  hidePauseDraftBtn();
  showResumeDraftBtn();
  updateRevertPickBtn();
}

function resumeDraft(manual) {
  if (!multiUserDraft) {
    if (manual) {
      pausedManually = false;
    }

    pauseDraftFlag = false;
    showPauseDraftBtn();
    enablePauseDraftBtn();
    hideResumeDraftBtn();
    disableRevertPickBtn();

    if (initialStartTimeoutId) {
      clearTimeout(initialStartTimeoutId);
    }

    setTimeout(() => {
      fillPlayerForAPick();
    }, 100);
  } else {
    if (manual) {
      disableResumeDraftBtn();
      socket.emit("chat", {
        socketId: currentUserSocketId,
        roomId: currentRoomData.roomId,
        type: "proposal_resume",
      });

      socket.emit("proposal-resume", {
        socketId: currentUserSocketId,
        roomId: currentRoomData.roomId,
        runSim: true,
      });
    }
  }
}

function disableResumeDraftBtn() {
  var resumeDraftButton = $(".resume-draft");
  if (resumeDraftButton) {
    resumeDraftButton.disabled = true;
    resumeDraftButton.style.opacity = "0.4";
    resumeDraftButton.style.cursor = "not-allowed";

    if (multiUserDraft) {
      removeClass(resumeDraftButton, "btn-blinker");
      let resumeIconBlack = resumeDraftButton.querySelector(".resume-icon-black");
      if (resumeIconBlack) {
        removeClass(resumeIconBlack, "hidden");
      }

      let resumeIconGreen = resumeDraftButton.querySelector(".resume-icon-green");
      if (resumeIconGreen) {
        addClass(resumeIconGreen, "hidden");
      }

      let resumeText = resumeDraftButton.querySelector(".resume-draft-text");
      if (resumeText) {
        resumeText.style.color = "#080A3C";
      }
    }
  }
}

function enableResumeDraftBtn() {
  var resumeDraftButton = $(".resume-draft");
  if (resumeDraftButton) {
    resumeDraftButton.disabled = false;
    resumeDraftButton.style.opacity = "1";
    resumeDraftButton.style.cursor = "pointer";

    if (multiUserDraft) {
      addClass(resumeDraftButton, "btn-blinker");
      let resumeIconBlack = resumeDraftButton.querySelector(".resume-icon-black");
      if (resumeIconBlack) {
        addClass(resumeIconBlack, "hidden");
      }

      let resumeIconGreen = resumeDraftButton.querySelector(".resume-icon-green");
      if (resumeIconGreen) {
        removeClass(resumeIconGreen, "hidden");
      }

      let resumeText = resumeDraftButton.querySelector(".resume-draft-text");
      if (resumeText) {
        resumeText.style.color = "#37C77A";
      }
    }
  }
}

function hideResumeDraftBtn() {
  var resumeDraftButton = $(".resume-draft");
  if (resumeDraftButton) {
    addClass(resumeDraftButton, "hidden");
  }
}

function showResumeDraftBtn() {
  var resumeDraftButton = $(".resume-draft");
  if (resumeDraftButton) {
    removeClass(resumeDraftButton, "hidden");
  }
}

function disableTradeOffersBtn() {
  var showOffersButton = $(".show-offers");
  if (showOffersButton) {
    showOffersButton.disabled = true;
    showOffersButton.style.opacity = "0.4";
    showOffersButton.style.cursor = "not-allowed";
  }
}

function restartSimulation() {
  trackGAEventForPage("restart");
  openRestartConfirmationPopup();
  if (isPausingDraftRequired()) {
    pauseDraftFlag = true;
    hidePauseDraftBtn();
    showResumeDraftBtn();
  }
}

function openRestartConfirmationPopup() {
  var existingPopup = $(".restart-confirmation-popup-container");
  if (existingPopup) {
    existingPopup.remove();
  }

  var restartTemplate = document.getElementById("restart-confirmation");
  if (!restartTemplate) return;
  confirmationPopup = restartTemplate.content.cloneNode(true);
  confirmationPopup = confirmationPopup.querySelector(".restart-confirmation-popup-container");
  if (confirmationPopup) {
    var closeBtn = confirmationPopup.querySelector(".close-btn");
    if (closeBtn) {
      closeBtn.onclick = closeRestartConfirmationPopup;
    }

    var confirmBtn = confirmationPopup.querySelector(".confirm-restart");
    if (confirmBtn) {
      confirmBtn.onclick = restartDraft;
    }

    var overlay = $(".overlay");
    if (overlay) {
      removeClass(overlay, "hidden");
    } else {
      var overlay = document.createElement("div");
      addClass(overlay, "overlay");
      document.body.appendChild(overlay);
    }

    addClass(confirmationPopup, "popup");
    document.body.appendChild(confirmationPopup)
  }
}

function restartDraft() {
  if (isRedraft) {
    let pathName = window.location.origin + window.location.pathname;
    if (!window.location.search) {
      pathName += "?mds-redraft";
    } else {
      pathName += window.location.search + "&mds-redraft";
    }

    window.history.replaceState('', '', pathName);
    window.location.reload();
  } else {
    window.location.reload();
  }
};

function closeRestartConfirmationPopup() {
  confirmationPopup = $(".restart-confirmation-popup-container");
  if (confirmationPopup) {
    confirmationPopup.remove();
  }

  var overlay = $(".overlay");
  if (overlay) {
    addClass(overlay, "hidden");
  }
}

function startNewSimulation() {
  trackGAEventForPage("start_new_sim");
  restartDraft();
}

function disableShowOffersBtn() {
  var showOffersButton = $(".show-offers");
  if (showOffersButton) {
    showOffersButton.disabled = true;
    showOffersButton.style.opacity = "0.4";
    showOffersButton.style.cursor = "not-allowed";
    removeClass(showOffersButton, "show-offers-highlighted");

    let tradeIconGreen = $(".trade-icon-green");
    let tradeIconBlack = $(".trade-icon-black");
    if (tradeIconGreen && tradeIconBlack) {
      addClass(tradeIconGreen, "hidden");
      removeClass(tradeIconBlack, "hidden");
    }
  }
}

function enableShowOffersBtn() {
  var showOffersButton = $(".show-offers");
  if (showOffersButton) {
    showOffersButton.disabled = false;
    showOffersButton.style.opacity = "1";
    showOffersButton.style.cursor = "pointer";
    addClass(showOffersButton, "show-offers-highlighted");

    let tradeIconGreen = $(".trade-icon-green");
    let tradeIconBlack = $(".trade-icon-black");
    if (tradeIconGreen && tradeIconBlack) {
      removeClass(tradeIconGreen, "hidden");
      addClass(tradeIconBlack, "hidden");
    }
  }
}

function calculateTrades(pickContainer) {
  var currentDataset = pickContainer.dataset
  var pickNumber = parseInt(currentDataset.number);
  var currentPick = picksList[picksList.findIndex((i) => i.number === pickNumber)];
  var currentNeedyTeams = getCurrentNeedyTeams();

  while (
    pickNumber < 2
      ? currentNeedyTeams.length > 6
      : pickNumber < 11
        ? currentNeedyTeams.length > 4
        : pickNumber <= roundends[1]
          ? currentNeedyTeams.length > 3
          : pickNumber <= roundends[3]
            ? currentNeedyTeams.length > 2
            : currentNeedyTeams.length > 1
  ) {
    var index = Math.floor(Math.random() * Math.floor(currentNeedyTeams.length));
    currentNeedyTeams.splice(index, 1);
  }

  var minValue;
  if (pickNumber < 2) {
    minValue = 1.2;
  } else if (pickNumber < 3) {
    minValue = 1;
  } else if (pickNumber < 17) {
    minValue = 1;
  } else if (pickNumber < roundends[3]) {
    minValue = 0.9;
  } else {
    minValue = 1;
  }

  var maxValue;
  if (pickNumber < 2) {
    maxValue = 1.4;
  } else if (pickNumber < 3) {
    maxValue = 1.1;
  } else if (pickNumber < 17) {
    maxValue = 1.2;
  } else if (pickNumber < roundends[3]) {
    maxValue = 1.15;
  } else {
    maxValue = 1.1;
  }

  var offersArray = fetchTrades(currentNeedyTeams, currentPick, minValue, maxValue);
  offersList = [];
  for (var i = 0; i < offersArray.length; i++) {
    offersList[i] = offersArray[i].team;
    offersList[i].allUserPicksToTrade = offersArray[i].allUserPicksToTrade;
    offersList[i].offerList = offersArray[i].draftPicks;
    offersList[i].offerPlayersList = [];
    offersList[i].allUserPlayersToTrade = [];
  }

  var logo = currentPick.currentTeam.teamLogo;
  if (offersList.length > 0) {
    showOffer(currentDataset.shortname, pickNumber, logo, 0, true);
  } else {
    if (!multiUserDraft) {
      disablePauseDraftBtn();
    }
    hideResumeDraftBtn();
    toggleSimView("pool", true);
  }

  return;
}

function showPreviousOffer() {
  var index = offersList.findIndex((item) => item.currentOffer === true) - 1;
  if (index > -1) {
    var offerContainer = $(".offer-container");
    var picknumber;
    if (offerContainer) {
      picknumber = parseInt(offerContainer.dataset.picknumber);
    }
    showOffer("", picknumber, "", index, true);
  }
}

function showNextOffer() {
  var index = offersList.findIndex((item) => item.currentOffer === true) + 1;
  if (index > -1) {
    var offerContainer = $(".offer-container");
    var picknumber;
    if (offerContainer) {
      picknumber = parseInt(offerContainer.dataset.picknumber);
    }
    showOffer("", picknumber, "", index, true);
  }
}

function rejectOffer() {
  for (let i = 0; i < offersList.length; i++) {
    if (offersList[i].currentOffer == true) {
      let rejectedOfferTeam = offersList.splice(i, 1);
      let counteredTeamIndex = counteredTeams.findIndex(teamName => teamName === rejectedOfferTeam[0].shortName);
      if (counteredTeamIndex > -1) {
        counteredTeams.splice(counteredTeamIndex, 1);
      }

      let systemOfferIndex = multiUserSystemOffersList.findIndex(offer => offer.offeringTeamShortName === rejectedOfferTeam[0].shortName);
      if (systemOfferIndex > -1) {
        multiUserSystemOffersList.splice(systemOfferIndex, 1);
      }

      let counterOfferIndex = multiUserCounterOffersList.findIndex(offer => offer.offeringTeamShortName === rejectedOfferTeam[0].shortName);
      if (counterOfferIndex > -1) {
        let rejectedOffer = {
          allUserPicksToTrade: [],
          offerList: [],
          offeringTeamShortName: "",
          currentTeamName: "",
          pickNumber: currentMultiUserPick,
          roomId: currentRoomData.roomId,
        };
        let offer = multiUserCounterOffersList.splice(counterOfferIndex, 1);
        rejectedOffer.currentTeamName = offer[0].currentTeamName;
        rejectedOffer.allUserPicksToTrade = offer[0].allUserPicksToTrade;
        rejectedOffer.offeringTeamShortName = offer[0].offeringTeamShortName;
        rejectedOffer.offerList = offer[0].offerList;

        let counteredTeamIndex = counteredTeams.findIndex(teamName => offer[0].currentTeamName === teamName || offer[0]
          .offeringTeamShortName === teamName);
        if (counteredTeamIndex >= 0) {
          counteredTeams.splice(counteredTeamIndex, 1);
        }

        console.log("rejected counter offer->", rejectedOffer);
        socket.emit("counter-offer-rejected", rejectedOffer);

        let offeredToTeamName;
        if (rejectedOfferTeam[0].shortName === rejectedOffer.offeringTeamShortName) {
          offeredToTeamName = rejectedOffer.currentTeamName;
        } else {
          offeredToTeamName = rejectedOffer.offeringTeamShortName;
        }

        socket.emit("chat", {
          roomId: currentRoomData.roomId,
          offeringTeam: rejectedOfferTeam[0].shortName,
          toTeam: offeredToTeamName,
          type: "counter_offer_rejected",
        });
      }

      let tradeOfferIndex = multiUserTradeOffersList.findIndex(offer => offer.offeringTeamShortName === rejectedOfferTeam[0].shortName);
      if (tradeOfferIndex > -1) {
        let rejectedOffer = {
          allUserPicksToTrade: [],
          offerList: [],
          offeringTeamShortName: "",
          currentTeamName: "",
          pickNumber: currentMultiUserPick,
          roomId: currentRoomData.roomId,
        };
        let offer = multiUserTradeOffersList.splice(tradeOfferIndex, 1);
        rejectedOffer.currentTeamName = offer[0].currentTeamName;
        rejectedOffer.allUserPicksToTrade = offer[0].allUserPicksToTrade;
        rejectedOffer.offeringTeamShortName = offer[0].offeringTeamShortName;
        rejectedOffer.offerList = offer[0].offerList;

        let counteredTeamIndex = counteredTeams.findIndex(teamName => offer[0].currentTeamName === teamName || offer[0]
          .offeringTeamShortName === teamName);
        if (counteredTeamIndex >= 0) {
          counteredTeams.splice(counteredTeamIndex, 1);
        }

        console.log("rejected user trade offer->", rejectedOffer);
        socket.emit("trade-offer-rejected", rejectedOffer);

        let offeredToTeamName;
        if (rejectedOfferTeam[0].shortName === rejectedOffer.offeringTeamShortName) {
          offeredToTeamName = rejectedOffer.currentTeamName;
        } else {
          offeredToTeamName = rejectedOffer.offeringTeamShortName;
        }

        socket.emit("chat", {
          roomId: currentRoomData.roomId,
          offeringTeam: rejectedOfferTeam[0].shortName,
          toTeam: offeredToTeamName,
          type: "trade_offer_rejected",
        });
      }

      break;
    }
  }

  if (offersList.length) {
    let offerContainer = $(".offer-container");
    let picknumber;
    if (offerContainer) {
      picknumber = parseInt(offerContainer.dataset.picknumber);
    }
    showOffer("", picknumber, "", 0, true);
  } else {
    clearOffers();
  }
}

function clearOffers(check) {
  if (!multiUserDraft) {
    var offerContainer = $(".offer-container");
    if (offerContainer) {
      offerContainer.remove();
      offersList = [];
    }
    var offersOverlay = $(".overlay");
    if (offersOverlay) {
      addClass(offersOverlay, "hidden");
    }

    if (!IS_DESKTOP && !check) {
      hideResumeDraftBtn();
      if (offerContainer && offerContainer.dataset.autopopulated === "true") {
        offerContainer.dataset.autopopulated === "false";
        toggleSimView("pool", true);
      }
    } else if (!IS_DESKTOP && check) {
      hideResumeDraftBtn();
      toggleSimView("result", true);
    }

    disableShowOffersBtn();

    if (check) {
      pauseDraftFlag = false;
      enablePauseDraftBtn();
      fillPlayerForAPick();
    }
  } else {
    if (!offersList.length) {
      var offerContainer = $(".offer-container");
      if (offerContainer) {
        offerContainer.remove();
        offersList = [];
      }
      var offersOverlay = $(".overlay");
      if (offersOverlay) {
        addClass(offersOverlay, "hidden");
      }

      if (!IS_DESKTOP && !check) {
        if (offerContainer && offerContainer.dataset.autopopulated === "true") {
          offerContainer.dataset.autopopulated === "false";
          toggleSimView("pool", true);
        }
      } else if (!IS_DESKTOP && check) {
        toggleSimView("result", true);
      }

      disableShowOffersBtn();
    } else {
      let offerContainer = $(".offer-container");
      if (offerContainer && !hasClass(offerContainer, "hidden")) {
        let offeredTeam;
        if (offersList[0].allUserPicksToTrade && offersList[0].allUserPicksToTrade.length) {
          offeredTeam = offersList[0].allUserPicksToTrade[0].currentTeam;
        } else if (offersList[0].allUserPlayersToTrade && offersList[0].allUserPlayersToTrade.length) {
          offeredTeam = teamsList.find(team => team.shortName === offersList[0].allUserPlayersToTrade[0].teamName);
        }
        if (offeredTeam) {
          showOffer(offeredTeam.shortName, currentMultiUserPick, offeredTeam.teamLogo, 0, true);
        }
      }
    }
  }
}

function showTradeData(e) {
  trackGAEventForPage("trade_icon_clicks");
  var tradeInfoBtn = e.target.closest(".pick-trade-info-btn");
  if (!tradeInfoBtn) return;
  var dataset = tradeInfoBtn.dataset;
  var tradeIndex = parseInt(dataset.tradeindex);
  var offersOverlay = $(".overlay");
  if (offersOverlay) {
    removeClass(offersOverlay, "hidden");
  }

  for (var i = 0; i < tradesData.length; i++) {
    if (tradeIndex === i) {
      let tradeData = tradesData[i];
      let previousTrades = [];
      if (tradeData.previousTradeNumbers && tradeData.previousTradeNumbers.length > 0) {
        previousTrades = tradeData.previousTradeNumbers;
      }

      var tradeDataContainer = $(".trade-data-container");
      var tradeDataContainerExists = false;

      if (!tradeDataContainer) {
        var tradesDataTemplate = document.getElementById("trades-data");
        if (!tradesDataTemplate) return;
        tradeDataContainer = tradesDataTemplate.content.cloneNode(true);
        tradeDataContainer = tradeDataContainer.querySelector(".trade-data-container");
      } else {
        tradeDataContainerExists = true;
      }

      let tradesHolders = tradeDataContainer.querySelector(".trades-holder");
      let detailsHolders = tradeDataContainer.querySelectorAll(".trade-details-info-container");
      let currentTradeInfoContainer = detailsHolders[0].cloneNode(true);
      detailsHolders.forEach((ele) => {
        ele.remove();
      })

      if (tradesHolders && currentTradeInfoContainer) {
        if (previousTrades.length > 0) {
          previousTrades.forEach((tradeNumber) => {
            let previousTradeInfoContainer = currentTradeInfoContainer.cloneNode(true);
            if (previousTradeInfoContainer) {
              let givingPicksContainer = previousTradeInfoContainer.querySelector(".giving-team-info .team-picks");
              let givingTeamLogo = previousTradeInfoContainer.querySelector(".giving-team-info .nfl-team-logo");
              let offerSeparator = previousTradeInfoContainer.querySelector(".offers-separator");
              if (offerSeparator) {
                addClass(offerSeparator, "hidden");
              }

              let currentOfferSeparator = currentTradeInfoContainer.querySelector(".offers-separator");
              if (currentOfferSeparator) {
                addClass(currentOfferSeparator, "hidden");
              }

              if (givingTeamLogo) {
                givingTeamLogo.src = STATIC_URL + teamLogoPath + tradesData[tradeNumber].givingTeamLogo + "?w=80&tag=" + imageRefreshTag;
              }

              if (givingPicksContainer) {
                givingPicksContainer.innerHTML = "";
                for (let j = 0; j < tradesData[tradeNumber].givingPicks.length; j++) {
                  let span = document.createElement("span");
                  let pickedPlayer = "";

                  if (!tradesData[tradeNumber].givingPicks[j].futurePick) {
                    span.innerHTML = "Pick " + tradesData[tradeNumber].givingPicks[j].number;
                    if (tradesData[tradeNumber].givingPicks[j].currentTeam.shortName !== tradesData[tradeNumber].givingTeamName) {
                      let tradedTextHolder = document.createElement("span");
                      addClass(tradedTextHolder, "traded-text");
                      tradedTextHolder.innerHTML = " (Traded Again)";
                      span.appendChild(tradedTextHolder);
                    } else {
                      pickedPlayer = document.createElement("span");
                      addClass(pickedPlayer, "picked-player");
                      if (tradesData[tradeNumber].givingPicks[j].playerSelection) {
                        pickedPlayer.innerHTML = tradesData[tradeNumber].givingPicks[j].playerSelection.name;
                      }
                    }
                  } else {
                    span.innerHTML = tradesData[tradeNumber].givingPicks[j].futurePickYear + " " + tradesData[tradeNumber].givingPicks[j].futureOriginalTeam +
                      " " + tradesData[tradeNumber].givingPicks[j].futureRound;
                  }

                  givingPicksContainer.appendChild(span);
                  if (pickedPlayer != "" && pickedPlayer.innerHTML != "undefined") {
                    givingPicksContainer.appendChild(pickedPlayer);
                  }
                }

                if (tradesData[tradeNumber].givingPlayers && tradesData[tradeNumber].givingPlayers.length) {
                  for (let j = 0; j < tradesData[tradeNumber].givingPlayers.length; j++) {
                    let span = document.createElement("span");
                    span.innerHTML = formatPlayerName(tradesData[tradeNumber].givingPlayers[j].playerName, tradesData[tradeNumber].givingPlayers[j].position);
                    givingPicksContainer.appendChild(span);
                  }
                }
              }

              let gettingPicksContainer = previousTradeInfoContainer.querySelector(".getting-team-info .team-picks");
              let gettingTeamLogo = previousTradeInfoContainer.querySelector(".getting-team-info .nfl-team-logo");
              if (gettingTeamLogo) {
                gettingTeamLogo.src = STATIC_URL + teamLogoPath + tradesData[tradeNumber].gettingTeamLogo + "?w=80&tag=" + imageRefreshTag;
              }

              if (gettingPicksContainer) {
                gettingPicksContainer.innerHTML = "";
                for (let j = 0; j < tradesData[tradeNumber].gettingPicks.length; j++) {
                  let span = document.createElement("span");
                  let pickedPlayer = "";

                  if (!tradesData[tradeNumber].gettingPicks[j].futurePick) {
                    span.innerHTML = "Pick " + tradesData[tradeNumber].gettingPicks[j].number;

                    if (tradesData[tradeNumber].gettingPicks[j].currentTeam.shortName !== tradesData[tradeNumber].gettingTeamName) {
                      let tradedTextHolder = document.createElement("span");
                      addClass(tradedTextHolder, "traded-text");
                      tradedTextHolder.innerHTML = " (Traded Again)";
                      span.appendChild(tradedTextHolder);
                    } else {
                      pickedPlayer = document.createElement("span");
                      addClass(pickedPlayer, "picked-player");
                      if (tradesData[tradeNumber].gettingPicks[j].playerSelection) {
                        pickedPlayer.innerHTML = tradesData[tradeNumber].gettingPicks[j].playerSelection.name;
                      }
                    }
                  } else {
                    span.innerHTML = tradesData[tradeNumber].gettingPicks[j].futurePickYear + " " + tradesData[tradeNumber].gettingPicks[j].futureOriginalTeam +
                      " " + tradesData[tradeNumber].gettingPicks[j].futureRound;
                  }

                  gettingPicksContainer.appendChild(span);
                  if (pickedPlayer != "" && pickedPlayer.innerHTML != "undefined") {
                    gettingPicksContainer.appendChild(pickedPlayer);
                  }
                }

                if (tradesData[tradeNumber].gettingPlayers && tradesData[tradeNumber].gettingPlayers.length) {
                  for (let j = 0; j < tradesData[tradeNumber].gettingPlayers.length; j++) {
                    let span = document.createElement("span");
                    span.innerHTML = formatPlayerName(tradesData[tradeNumber].gettingPlayers[j].playerName, tradesData[tradeNumber].gettingPlayers[j].position);
                    gettingPicksContainer.appendChild(span);
                  }
                }
              }

              tradesHolders.appendChild(previousTradeInfoContainer);
            }
          })
        }

        let givingPicksContainer = currentTradeInfoContainer.querySelector(".giving-team-info .team-picks");
        let givingTeamLogo = currentTradeInfoContainer.querySelector(".giving-team-info .nfl-team-logo");
        if (givingTeamLogo) {
          givingTeamLogo.src = STATIC_URL + teamLogoPath + tradeData.givingTeamLogo + "?w=80&tag=" + imageRefreshTag;
        }

        if (givingPicksContainer) {
          givingPicksContainer.innerHTML = "";
          for (let j = 0; tradeData.givingPicks && j < tradeData.givingPicks.length; j++) {
            let span = document.createElement("span");
            let pickedPlayer = "";

            if (!tradeData.givingPicks[j].futurePick) {
              span.innerHTML = "Pick " + tradeData.givingPicks[j].number;
              if (tradeData.givingPicks[j].currentTeam.shortName !== tradeData.givingTeamName) {
                let tradedTextHolder = document.createElement("span");
                addClass(tradedTextHolder, "traded-text");
                tradedTextHolder.innerHTML = " (Traded Again)";
                span.appendChild(tradedTextHolder);
              } else {
                pickedPlayer = document.createElement("span");
                addClass(pickedPlayer, "picked-player");
                if (tradeData.givingPicks[j].playerSelection) {
                  pickedPlayer.innerHTML = tradeData.givingPicks[j].playerSelection.name;
                }
              }
            } else {
              span.innerHTML = tradeData.givingPicks[j].futurePickYear + " " + tradeData.givingPicks[j].futureOriginalTeam +
                " " + tradeData.givingPicks[j].futureRound;
            }

            givingPicksContainer.appendChild(span);
            if (pickedPlayer != "" && pickedPlayer.innerHTML != "undefined") {
              givingPicksContainer.appendChild(pickedPlayer);
            }
          }

          if (tradeData.givingPlayers && tradeData.givingPlayers.length) {
            for (let j = 0; j < tradeData.givingPlayers.length; j++) {
              let span = document.createElement("span");
              span.innerHTML = formatPlayerName(tradeData.givingPlayers[j].playerName, tradeData.givingPlayers[j].position);
              givingPicksContainer.appendChild(span);
            }
          }
        }

        let gettingPicksContainer = currentTradeInfoContainer.querySelector(".getting-team-info .team-picks");
        let gettingTeamLogo = currentTradeInfoContainer.querySelector(".getting-team-info .nfl-team-logo");
        if (gettingTeamLogo) {
          gettingTeamLogo.src = STATIC_URL + teamLogoPath + tradeData.gettingTeamLogo + "?w=80&tag=" + imageRefreshTag;
        }

        if (gettingPicksContainer) {
          gettingPicksContainer.innerHTML = "";
          for (let j = 0; tradeData.gettingPicks && j < tradeData.gettingPicks.length; j++) {
            let span = document.createElement("span");
            let pickedPlayer = "";

            if (!tradeData.gettingPicks[j].futurePick) {
              span.innerHTML = "Pick " + tradeData.gettingPicks[j].number;

              if (tradeData.gettingPicks[j].currentTeam.shortName !== tradeData.gettingTeamName) {
                let tradedTextHolder = document.createElement("span");
                addClass(tradedTextHolder, "traded-text");
                tradedTextHolder.innerHTML = " (Traded Again)";
                span.appendChild(tradedTextHolder);
              } else {
                pickedPlayer = document.createElement("span");
                addClass(pickedPlayer, "picked-player");
                if (tradeData.gettingPicks[j].playerSelection) {
                  pickedPlayer.innerHTML = tradeData.gettingPicks[j].playerSelection.name;
                }
              }
            } else {
              span.innerHTML = tradeData.gettingPicks[j].futurePickYear + " " + tradeData.gettingPicks[j].futureOriginalTeam +
                " " + tradeData.gettingPicks[j].futureRound;
            }

            gettingPicksContainer.appendChild(span);
            if (pickedPlayer != "" && pickedPlayer.innerHTML != "undefined") {
              gettingPicksContainer.appendChild(pickedPlayer);
            }
          }

          if (tradeData.gettingPlayers && tradeData.gettingPlayers.length) {
            for (let j = 0; j < tradeData.gettingPlayers.length; j++) {
              let span = document.createElement("span");
              span.innerHTML = formatPlayerName(tradeData.gettingPlayers[j].playerName, tradeData.gettingPlayers[j].position);
              gettingPicksContainer.appendChild(span);
            }
          }
        }

        tradesHolders.appendChild(currentTradeInfoContainer);
      }

      if (!tradeDataContainerExists) {
        addClass(tradeDataContainer, "popup");
        document.body.appendChild(tradeDataContainer);
      } else {
        removeClass(tradeDataContainer, "hidden");
      }

      let teamPicksPopup = $(".team-picks-info-popup");
      if (teamPicksPopup) {
        tradeDataContainer.style.zIndex = "10000";
      }

      break;
    }
  }
}

function setTradesData(givingTeamdata, gettingTeamData, givingPlayers, gettingPlayers) {
  if ((givingTeamdata.length || (givingPlayers && givingPlayers.length)) && (gettingTeamData.length || (gettingPlayers && gettingPlayers.length))) {
    let tradesDataIndex = tradesData.length;
    let alreadyTradedPicks = [];
    let previousTradeNumbers = [];
    givingTeamdata.forEach((pick) => {
      if (pick.tradedPick) {
        alreadyTradedPicks.push(pick);
      }
    })

    gettingTeamData.forEach((pick) => {
      if (pick.tradedPick) {
        alreadyTradedPicks.push(pick);
      }
    })

    if (alreadyTradedPicks.length > 0) {
      alreadyTradedPicks.forEach((alreadyTradedPick) => {
        for (let i = 0; i < tradesData.length; i++) {
          tradesData[i].gettingPicks.forEach((pick) => {
            if (pick.number === alreadyTradedPick.number && pick.futureRound === alreadyTradedPick.futureRound &&
              pick.futureOriginalTeam === alreadyTradedPick.futureOriginalTeam) {
              previousTradeNumbers.push(tradesData[i].tradeNumber);
            }
          });

          tradesData[i].givingPicks.forEach((pick) => {
            if (pick.number === alreadyTradedPick.number && pick.futureRound === alreadyTradedPick.futureRound &&
              pick.futureOriginalTeam === alreadyTradedPick.futureOriginalTeam) {
              previousTradeNumbers.push(tradesData[i].tradeNumber);
            }
          });
        }
      })
    }

    previousTradeNumbers = [...new Set(previousTradeNumbers)].sort();

    tradesData[tradesDataIndex] = {};
    tradesData[tradesDataIndex].tradeNumber = tradesDataIndex;

    if (givingTeamdata.length) {
      tradesData[tradesDataIndex].givingTeamLogo = givingTeamdata[0].currentTeam.teamLogo;
      tradesData[tradesDataIndex].givingTeamName = givingTeamdata[0].currentTeam.shortName;
    } else if (givingPlayers && givingPlayers.length) {
      for (var i = 0; i < teamsList.length; i++) {
        if (teamsList[i].shortName === givingPlayers[0].teamName) {
          tradesData[tradesDataIndex].givingTeamLogo = teamsList[i].teamLogo;
          tradesData[tradesDataIndex].givingTeamName = teamsList[i].shortName;
          break;
        }
      }
    }

    tradesData[tradesDataIndex].givingPicks = givingTeamdata;

    if (gettingTeamData.length) {
      tradesData[tradesDataIndex].gettingTeamLogo = gettingTeamData[0].currentTeam.teamLogo;
      tradesData[tradesDataIndex].gettingTeamName = gettingTeamData[0].currentTeam.shortName;
    } else if (gettingPlayers && gettingPlayers.length) {
      for (var i = 0; i < teamsList.length; i++) {
        if (teamsList[i].shortName === gettingPlayers[0].teamName) {
          tradesData[tradesDataIndex].gettingTeamLogo = teamsList[i].teamLogo;
          tradesData[tradesDataIndex].gettingTeamName = teamsList[i].shortName;
          break;
        }
      }
    }

    tradesData[tradesDataIndex].gettingPicks = gettingTeamData;
    tradesData[tradesDataIndex].givingPlayers = givingPlayers || [];
    tradesData[tradesDataIndex].gettingPlayers = gettingPlayers || [];
    tradesData[tradesDataIndex].previousTradeNumbers = previousTradeNumbers;

    // Adjust team needs for players traded away by user's teams
    // After trade acceptance, p.teamName reflects the NEW team (post-swap)
    // So if p.teamName is NOT the user's team, the player was originally ON the user's team and was traded away
    var tradeGivingName = tradesData[tradesDataIndex].givingTeamName;
    var tradeGettingName = tradesData[tradesDataIndex].gettingTeamName;
    var allTradePlayers = [];
    if (givingPlayers && givingPlayers.length && typeof givingPlayers !== 'boolean') {
      allTradePlayers = allTradePlayers.concat(givingPlayers);
    }
    if (gettingPlayers && gettingPlayers.length && typeof gettingPlayers !== 'boolean') {
      allTradePlayers = allTradePlayers.concat(gettingPlayers);
    }
    allTradePlayers.forEach(function(p) {
      var playerNewTeam = p.teamName || "";

      // Whichever side no longer holds the player traded them away
      if (playerNewTeam !== tradeGivingName) {
        var givingTeamObj = teamsList.find(function(t) { return t.shortName === tradeGivingName; });
        if (givingTeamObj) {
          adjustTeamNeedsForTradedAwayPlayer(givingTeamObj, p);
        }
      } else if (playerNewTeam !== tradeGettingName) {
        var gettingTeamObj = teamsList.find(function(t) { return t.shortName === tradeGettingName; });
        if (gettingTeamObj) {
          adjustTeamNeedsForTradedAwayPlayer(gettingTeamObj, p);
        }
      }

      // Whichever side ended up holding the player received them
      if (playerNewTeam === tradeGivingName) {
        var recGivingTeamObj = teamsList.find(function(t) { return t.shortName === tradeGivingName; });
        if (recGivingTeamObj) {
          adjustTeamNeedsForReceivedPlayer(recGivingTeamObj, p);
        }
      } else if (playerNewTeam === tradeGettingName) {
        var recGettingTeamObj = teamsList.find(function(t) { return t.shortName === tradeGettingName; });
        if (recGettingTeamObj) {
          adjustTeamNeedsForReceivedPlayer(recGettingTeamObj, p);
        }
      }
    });
  }

  return;
}

function counterOffer() {
  var offerContainer = $(".offer-container");
  if (offerContainer) {
    var dataset = offerContainer.dataset;
    var currentTeam = dataset.currentteam;
    var currentTeamPicks = JSON.parse(dataset.currentteamgivingpicks);
    var offeringTeam = dataset.offeringteam;
    var offeringTeamPicks = JSON.parse(dataset.currentteamgettingpicks);
    addClass(offerContainer, "hidden");

    setTimeout(() => {
      proposeTrade(currentTeam, offeringTeam, currentTeamPicks, offeringTeamPicks);
    }, 200);
  }
}

function populateAcceptedOffer() {
  let originalTeam;
  if (multiUserCurrentOfferTeam.allUserPicksToTrade && multiUserCurrentOfferTeam.allUserPicksToTrade.length) {
    originalTeam = multiUserCurrentOfferTeam.allUserPicksToTrade[0].currentTeam;
  } else if (multiUserCurrentOfferTeam.allUserPlayersToTrade && multiUserCurrentOfferTeam.allUserPlayersToTrade.length) {
    originalTeam = teamsList.find(team => team.shortName === multiUserCurrentOfferTeam.allUserPlayersToTrade[0].teamName);
  }
  if (!originalTeam) return;
  let originalTeamName = originalTeam.shortName;
  let opposingTeamName = multiUserCurrentOfferTeam.shortName;
  let originalTeamOwner;
  let opposingTeamOwner;
  if (currentRoomData.selectedTeams.includes(originalTeamName) || currentRoomData.selectedTeams.includes(opposingTeamName)) {
    currentRoomData.members.forEach(member => {
      if (member.teams.includes(originalTeamName)) {
        originalTeamOwner = member.userName;
      }

      if (member.teams.includes(opposingTeamName)) {
        opposingTeamOwner = member.userName;
      }
    })
  }
  var tradeIndex = tradesData.length;
  let currentPickContainer;
  if (multiUserDraft) {
    currentPickContainer = $(".pick-number-" + currentMultiUserPick);
  } else {
    currentPickContainer = $(".pic-container.currentPick");
  }

  if (currentPickContainer) {
    var tradeIconHolder = currentPickContainer.querySelector(".pick-trade-info-btn");
    let acceptedUserPicks = multiUserCurrentOfferTeam.allUserPicksToTrade;
    let currentPickTraded = false;
    if (acceptedUserPicks) {
      acceptedUserPicks.forEach(acceptedPick => {
        if (acceptedPick.number === currentMultiUserPick) {
          currentPickTraded = true;
        }
      });
    }

    if (currentPickTraded) {
      removeDraftingUserInfo();
    }

    if (tradeIconHolder && currentPickTraded) {
      removeClass(tradeIconHolder, "hidden");
    }

    var originalTeamLogo = originalTeam.teamLogo;

    var givingPicks = multiUserCurrentOfferTeam.allUserPicksToTrade;

    for (var offer of givingPicks) {
      offer.tradedPick = true;
      if (offer.futurePick) {
        for (var i = 0; i < picksList.length; i++) {
          if (picksList[i].futureRound == offer.futureRound && picksList[i].futureOriginalTeam == offer
            .futureOriginalTeam) {
            picksList[i].currentTeam = multiUserCurrentOfferTeam;
          }
        }
      } else {
        var number = offer.number;
        var tradingTeamPickListIndex = picksList.findIndex((item) => item.number === number);
        picksList[tradingTeamPickListIndex].currentTeam = multiUserCurrentOfferTeam;
        var tradeContainer = $(".pic-container.pick-number-" + number);
        if (tradeContainer) {
          var tradeIconHolderNext = tradeContainer.querySelector(".pick-trade-info-btn");
          if (tradeIconHolderNext) {
            removeClass(tradeIconHolderNext, "hidden");
            tradeIconHolderNext.dataset.tradeindex = tradeIndex;
          }

          let draftingInfoContainer = tradeContainer.querySelector(".drafting-info-container");
          if (opposingTeamOwner && draftingInfoContainer) {
            removeClass(draftingInfoContainer, "hidden");
            draftingInfoContainer.dataset.picknumber = offer.number;
            let member = currentRoomData.members.find(member => member.teams.includes(picksList[tradingTeamPickListIndex].currentTeam.shortName));
            if (member) {
              draftingInfoContainer.dataset.socketid = member.socketId;
            }
            let userNameContainer = draftingInfoContainer.querySelector(".draft-by");
            if (userNameContainer) {
              userNameContainer.innerHTML = opposingTeamOwner;
            }
          } else {
            addClass(draftingInfoContainer, "hidden");
            draftingInfoContainer.dataset.socketid = "";
          }

          tradeContainer.dataset.shortname = multiUserCurrentOfferTeam.shortName;
          let teamLogoContainer = tradeContainer.querySelector(".team-logo-container");
          if (teamLogoContainer) {
            teamLogoContainer.dataset.teamname = multiUserCurrentOfferTeam.shortName;
          }

          let teamLogoHolder = tradeContainer.querySelector(".team-logo");
          if (teamLogoHolder) {
            teamLogoHolder.src = STATIC_URL + teamLogoPath + multiUserCurrentOfferTeam.teamLogo + "?w=80&tag=" + imageRefreshTag;
            teamLogoHolder.dataset.teamlogo = multiUserCurrentOfferTeam.teamLogo;
          }

          updateTeamNeedsInPickContainer(tradeContainer, multiUserCurrentOfferTeam.shortName);
        }
      }
    }

    var indexList = [];
    for (var i = 0; i < originalTeam.draftPicks.length; i++) {
      for (var j = 0; j < givingPicks.length; j++) {
        if (originalTeam.draftPicks[i].number === givingPicks[j].number && originalTeam.draftPicks[i].futureRound ===
          givingPicks[j].futureRound && originalTeam.draftPicks[i].futureOriginalTeam === givingPicks[j].futureOriginalTeam) {
          indexList.push(i);
        }
      }
    }

    for (var i = indexList.length - 1; i >= 0; i--) {
      originalTeam.draftPicks.splice(indexList[i], 1);
    }

    for (var i = 0; i < multiUserCurrentOfferTeam.offerList.length; i++) {
      originalTeam.draftPicks.push(multiUserCurrentOfferTeam.offerList[i]);
    }

    indexList = [];
    for (var i = 0; i < multiUserCurrentOfferTeam.draftPicks.length; i++) {
      for (var j = 0; j < multiUserCurrentOfferTeam.offerList.length; j++) {
        if (multiUserCurrentOfferTeam.offerList[j].number === multiUserCurrentOfferTeam.draftPicks[i].number && multiUserCurrentOfferTeam
          .offerList[j].futureRound === multiUserCurrentOfferTeam.draftPicks[i].futureRound &&
          multiUserCurrentOfferTeam.draftPicks[i].futureOriginalTeam === multiUserCurrentOfferTeam.offerList[j].futureOriginalTeam) {
          indexList.push(i);
        }
      }
    }

    for (var i = indexList.length - 1; i >= 0; i--) {
      multiUserCurrentOfferTeam.draftPicks.splice(indexList[i], 1);
    }

    for (var i = 0; i < givingPicks.length; i++) {
      multiUserCurrentOfferTeam.draftPicks.push(givingPicks[i]);
    }

    for (var offer of multiUserCurrentOfferTeam.offerList) {
      offer.tradedPick = true;
      if (offer.futurePick) {
        for (var i = 0; i < picksList.length; i++) {
          if (picksList[i].futureRound == offer.futureRound && picksList[i].futureOriginalTeam == offer
            .futureOriginalTeam) {
            picksList[i].currentTeam = originalTeam;
          }
        }
      } else {
        var number = offer.number;
        var tradingTeamPickListIndex = picksList.findIndex((item) => item.number === number);
        picksList[tradingTeamPickListIndex].currentTeam = teamsList[teamsList.findIndex((item) => item.shortName ===
          originalTeamName)];
        var tradeContainer = $(".pic-container.pick-number-" + number);
        if (tradeContainer) {
          var tradeIconHolderNext = tradeContainer.querySelector(".pick-trade-info-btn");
          if (tradeIconHolderNext) {
            removeClass(tradeIconHolderNext, "hidden");
            tradeIconHolderNext.dataset.tradeindex = tradeIndex;
          }

          let draftingInfoContainer = tradeContainer.querySelector(".drafting-info-container");
          if (originalTeamOwner && draftingInfoContainer) {
            draftingInfoContainer.dataset.picknumber = offer.number;
            let member = currentRoomData.members.find(member => member.teams.includes(picksList[tradingTeamPickListIndex].currentTeam.shortName));
            if (member) {
              draftingInfoContainer.dataset.socketid = member.socketId;
            }
            removeClass(draftingInfoContainer, "hidden");
            let userNameContainer = draftingInfoContainer.querySelector(".draft-by");
            if (userNameContainer) {
              userNameContainer.innerHTML = originalTeamOwner;
            }
          } else {
            addClass(draftingInfoContainer, "hidden");
            draftingInfoContainer.dataset.socketid = "";
          }

          tradeContainer.dataset.shortname = originalTeamName;
          let teamLogoContainer = tradeContainer.querySelector(".team-logo-container");
          if (teamLogoContainer) {
            teamLogoContainer.dataset.teamname = originalTeamName;
          }

          let teamLogoHolder = tradeContainer.querySelector(".team-logo");
          if (teamLogoHolder) {
            teamLogoHolder.src = STATIC_URL + teamLogoPath + originalTeamLogo + "?w=80&tag=" + imageRefreshTag;
            teamLogoHolder.dataset.teamlogo = originalTeamLogo;
          }

          updateTeamNeedsInPickContainer(tradeContainer, originalTeamName);
        }
      }
    }

    var givingPlayers = multiUserCurrentOfferTeam.allUserPlayersToTrade || [];
    var gettingPlayers = multiUserCurrentOfferTeam.offerPlayersList || [];

    // Update playerTrades - move traded players to their new teams
    for (var i = 0; i < givingPlayers.length; i++) {
      for (var j = 0; j < playerTrades.length; j++) {
        if (playerTrades[j].Player === givingPlayers[i].playerName && playerTrades[j].Team === givingPlayers[i].teamName) {
          playerTrades[j].Team = multiUserCurrentOfferTeam.shortName;
          break;
        }
      }
      givingPlayers[i].teamName = multiUserCurrentOfferTeam.shortName;
    }
    for (var i = 0; i < gettingPlayers.length; i++) {
      for (var j = 0; j < playerTrades.length; j++) {
        if (playerTrades[j].Player === gettingPlayers[i].playerName && playerTrades[j].Team === gettingPlayers[i].teamName) {
          playerTrades[j].Team = originalTeamName;
          break;
        }
      }
      gettingPlayers[i].teamName = originalTeamName;
    }

    setTradesData(multiUserCurrentOfferTeam.allUserPicksToTrade, multiUserCurrentOfferTeam.offerList, givingPlayers, gettingPlayers);
    if (currentPickIsMine && currentPickTraded) {
      currentPickIsMine = false;
      removeClass(currentPickContainer, "currentPick");
      hideUserSelectionIcon();
      disableResumeDraftBtn();
      socket.emit("proposal-resume", {
        socketId: currentUserSocketId,
        roomId: currentRoomData.roomId,
        runSim: false,
      });
    }

    var currentPickIndex = picksList.findIndex((i) => i.onTheClock === true);
    picksList[currentPickIndex].tradedPick = true;
    picksList[currentPickIndex].tradeUpPick = true;
    clearOffers(true);

    originalTeam.draftPicks.sort(function (x, y) {
      if (x.number && y.number) {
        return x.number - y.number;
      } else if (!x.number && !y.number) {
        return parseInt(x.futureRound.charAt(0)) - parseInt(y.futureRound.charAt(0));
      } else if (!x.number || !y.number) {
        if (!x.number) {
          return 1;
        } else if (!y.number) {
          return -1;
        }
      }
    });

    multiUserCurrentOfferTeam.draftPicks.sort(function (x, y) {
      if (x.number && y.number) {
        return x.number - y.number;
      } else if (!x.number && !y.number) {
        return parseInt(x.futureRound.charAt(0)) - parseInt(y.futureRound.charAt(0));
      } else if (!x.number || !y.number) {
        if (!x.number) {
          return 1;
        } else if (!y.number) {
          return -1;
        }
      }
    });

    if (IS_DESKTOP) {
      let myPicksBtn = $(".mypicks-btn-holder .my-picks-btn");
      if (myPicksBtn && myPicksBtn.classList.contains("selected")) {
        let selectedTeamBtn = $(".selected-user-teams-container .team-logo-btn-container.selected button.team-logo-btn");
        if (selectedTeamBtn) {
          selectedTeamBtn.click();
        }
      }
    }

    multiUserCurrentOfferTeam = {};
  }
}

function handleAccumulatedOffers() {
  if (toBeHandledOffers.rejectedCounterOffers && toBeHandledOffers.rejectedCounterOffers.length) {
    socket.emit("counter-offer-rejected", toBeHandledOffers.rejectedCounterOffers[0]);
    toBeHandledOffers.rejectedCounterOffers.splice(0, 1);
    return;
  }

  if (toBeHandledOffers.rejectedTradeOffers && toBeHandledOffers.rejectedTradeOffers.length) {
    socket.emit("trade-offer-rejected", toBeHandledOffers.rejectedTradeOffers[0]);
    toBeHandledOffers.rejectedTradeOffers.splice(0, 1);
    return;
  }

  if (toBeHandledOffers.revertedOffers && toBeHandledOffers.revertedOffers.length) {
    socket.emit("offer-reverted", toBeHandledOffers.revertedOffers[0]);
    toBeHandledOffers.revertedOffers.splice(0, 1);
    return;
  }

  if (toBeHandledOffers.acceptedOffer) {
    socket.emit(toBeHandledOffers.acceptedOfferType, toBeHandledOffers.acceptedOffer);
    toBeHandledOffers.acceptedOffer = "";
    toBeHandledOffers.acceptedOfferType = "";
    return;
  }

  if (toBeHandledOffers.selectedPlayer) {
    socket.emit("player_selected", toBeHandledOffers.selectedPlayer);
    toBeHandledOffers.selectedPlayer = "";
    return;
  }
}

async function acceptOffer(serverSimulated) {
  var tradeIndex = tradesData.length;
  let currentPickContainer;
  if (multiUserDraft) {
    currentPickContainer = $(".pick-number-" + currentMultiUserPick);
  } else {
    currentPickContainer = $(".pic-container.currentPick");
  }

  if (currentPickContainer) {
    var tradeIconHolder = currentPickContainer.querySelector(".pick-trade-info-btn");
    if (tradeIconHolder && !multiUserDraft) {
      removeClass(tradeIconHolder, "hidden");
    }

    var dataset = currentPickContainer.dataset;
    var originalTeamName = dataset.shortname;
    var originalPickNumber = parseInt(dataset.number);
    var originalTeamIndex = picksList.findIndex((item) => item.number === originalPickNumber);
    var originalTeam = picksList[originalTeamIndex].currentTeam;
    var originalTeamLogo = originalTeam.teamLogo;

    if (multiUserDraft && !serverSimulated) {
      let acceptedOffer = {
        allUserPicksToTrade: [],
        offerList: [],
        offerPlayersList: [],
        allUserPlayersToTrade: [],
        offeringTeamShortName: "",
        currentTeamName: "",
        pickNumber: currentMultiUserPick,
        roomId: currentRoomData.roomId,
      };
      let acceptedOfferIndex;
      let counterOfferAccepted = false;
      let tradeOfferAccepted = false;
      let acceptedSystemOffer = multiUserSystemOffersList.find((offer) => offer.offeringTeamShortName === currentOfferTeam.shortName);
      if (acceptedSystemOffer) {
        acceptedOffer.allUserPicksToTrade = acceptedSystemOffer.allUserPicksToTrade;
        acceptedOffer.offerList = acceptedSystemOffer.offerList;
        acceptedOffer.offeringTeamShortName = currentOfferTeam.shortName;
        acceptedOffer.currentTeamName = originalTeam.shortName;

        let remainingOffers = [];
        offersList.forEach(offer => {
          let commonFound = false;
          for (let i = 0; i < offer.allUserPicksToTrade.length; i++) {
            if (!commonFound) {
              for (let j = 0; j < acceptedOffer.offerList.length; j++) {
                if (offer.allUserPicksToTrade[i].number === acceptedOffer.offerList[j].number && offer.allUserPicksToTrade[i].futureRound === acceptedOffer.offerList[j].futureRound &&
                  offer.allUserPicksToTrade[i].futurePickYear === acceptedOffer.offerList[j].futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === acceptedOffer.offerList[j].futureOriginalTeam) {
                  commonFound = true;
                  break;
                }
              }
            }

            if (!commonFound) {
              for (let j = 0; j < acceptedOffer.allUserPicksToTrade.length; j++) {
                if (offer.allUserPicksToTrade[i].number === acceptedOffer.allUserPicksToTrade[j].number && offer.allUserPicksToTrade[i].futureRound === acceptedOffer.allUserPicksToTrade[j].futureRound &&
                  offer.allUserPicksToTrade[i].futurePickYear === acceptedOffer.allUserPicksToTrade[j].futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === acceptedOffer.allUserPicksToTrade[j].futureOriginalTeam) {
                  commonFound = true;
                  break;
                }
              }
            }
          }

          if (!commonFound) {
            for (let i = 0; i < offer.offerList.length; i++) {
              if (!commonFound) {
                for (let j = 0; j < acceptedOffer.offerList.length; j++) {
                  if (offer.offerList[i].number === acceptedOffer.offerList[j].number && offer.offerList[i].futureRound === acceptedOffer.offerList[j].futureRound &&
                    offer.offerList[i].futurePickYear === acceptedOffer.offerList[j].futurePickYear && offer.offerList[i].futureOriginalTeam === acceptedOffer.offerList[j].futureOriginalTeam) {
                    commonFound = true;
                    break;
                  }
                }
              }

              if (!commonFound) {
                for (let j = 0; j < acceptedOffer.allUserPicksToTrade.length; j++) {
                  if (offer.offerList[i].number === acceptedOffer.allUserPicksToTrade[j].number && offer.offerList[i].futureRound === acceptedOffer.allUserPicksToTrade[j].futureRound &&
                    offer.offerList[i].futurePickYear === acceptedOffer.allUserPicksToTrade[j].futurePickYear && offer.offerList[i].futureOriginalTeam === acceptedOffer.allUserPicksToTrade[j].futureOriginalTeam) {
                    commonFound = true;
                    break;
                  }
                }
              }
            }
          }

          if (!commonFound) {
            remainingOffers.push(offer);
          } else {
            let counteredTeamIndex = counteredTeams.findIndex(teamName => offer.shortName === teamName);
            if (counteredTeamIndex > -1) {
              counteredTeams.splice(counteredTeamIndex, 1);
            }
          }
        });

        offersList = [...remainingOffers];
        remainingOffers.length = 0;

        multiUserSystemOffersList.length = 0;
      }

      if (!acceptedSystemOffer) {
        acceptedOfferIndex = multiUserCounterOffersList.findIndex((offer) => offer.offeringTeamShortName === currentOfferTeam.shortName);
        let offer;
        if (acceptedOfferIndex == -1) {
          tradeOfferAccepted = true;
          acceptedOfferIndex = multiUserTradeOffersList.findIndex((offer) => offer.offeringTeamShortName === currentOfferTeam.shortName);
          if (acceptedOfferIndex == -1) return;
          offer = multiUserTradeOffersList.splice(acceptedOfferIndex, 1);
        } else {
          counterOfferAccepted = true;
          offer = multiUserCounterOffersList.splice(acceptedOfferIndex, 1);
        }

        if (!offer || !offer[0]) return;

        acceptedOffer.allUserPicksToTrade = offer[0].offerList;
        acceptedOffer.offerList = offer[0].allUserPicksToTrade;
        acceptedOffer.offerPlayersList = offer[0].allUserPlayersToTrade || [];
        acceptedOffer.allUserPlayersToTrade = offer[0].offerPlayersList || [];
        acceptedOffer.offeringTeamShortName = offer[0].currentTeamName;
        acceptedOffer.currentTeamName = offer[0].offeringTeamShortName;

        let remainingOffers = [];
        offersList.forEach(offer => {
          let commonFound = false;
          for (let i = 0; i < offer.allUserPicksToTrade.length; i++) {
            if (!commonFound) {
              for (let j = 0; j < acceptedOffer.offerList.length; j++) {
                if (offer.allUserPicksToTrade[i].number === acceptedOffer.offerList[j].number && offer.allUserPicksToTrade[i].futureRound === acceptedOffer.offerList[j].futureRound &&
                  offer.allUserPicksToTrade[i].futurePickYear === acceptedOffer.offerList[j].futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === acceptedOffer.offerList[j].futureOriginalTeam) {
                  commonFound = true;
                  break;
                }
              }
            }

            if (!commonFound) {
              for (let j = 0; j < acceptedOffer.allUserPicksToTrade.length; j++) {
                if (offer.allUserPicksToTrade[i].number === acceptedOffer.allUserPicksToTrade[j].number && offer.allUserPicksToTrade[i].futureRound === acceptedOffer.allUserPicksToTrade[j].futureRound &&
                  offer.allUserPicksToTrade[i].futurePickYear === acceptedOffer.allUserPicksToTrade[j].futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === acceptedOffer.allUserPicksToTrade[j].futureOriginalTeam) {
                  commonFound = true;
                  break;
                }
              }
            }
          }

          if (!commonFound) {
            for (let i = 0; i < offer.offerList.length; i++) {
              if (!commonFound) {
                for (let j = 0; j < acceptedOffer.offerList.length; j++) {
                  if (offer.offerList[i].number === acceptedOffer.offerList[j].number && offer.offerList[i].futureRound === acceptedOffer.offerList[j].futureRound &&
                    offer.offerList[i].futurePickYear === acceptedOffer.offerList[j].futurePickYear && offer.offerList[i].futureOriginalTeam === acceptedOffer.offerList[j].futureOriginalTeam) {
                    commonFound = true;
                    break;
                  }
                }
              }

              if (!commonFound) {
                for (let j = 0; j < acceptedOffer.allUserPicksToTrade.length; j++) {
                  if (offer.offerList[i].number === acceptedOffer.allUserPicksToTrade[j].number && offer.offerList[i].futureRound === acceptedOffer.allUserPicksToTrade[j].futureRound &&
                    offer.offerList[i].futurePickYear === acceptedOffer.allUserPicksToTrade[j].futurePickYear && offer.offerList[i].futureOriginalTeam === acceptedOffer.allUserPicksToTrade[j].futureOriginalTeam) {
                    commonFound = true;
                    break;
                  }
                }
              }
            }
          }

          if (!commonFound) {
            remainingOffers.push(offer);
          } else {
            let counteredTeamIndex = counteredTeams.findIndex(teamName => offer.shortName === teamName);
            if (counteredTeamIndex > -1) {
              counteredTeams.splice(counteredTeamIndex, 1);
            }
          }
        });

        offersList = [...remainingOffers];
      }

      // For player-only trades (no picks), the pick-matching above won't remove the accepted offer.
      // Explicitly remove it by team name.
      if (!acceptedOffer.offerList.length && !acceptedOffer.allUserPicksToTrade.length) {
        offersList = offersList.filter(offer => offer.shortName !== currentOfferTeam.shortName);
      }

      let rejectedOffers = [];
      multiUserCounterOffersList.forEach((offer) => {
        let commonPickFound = false;
        acceptedOffer.offerList.forEach(trade => {
          offer.allUserPicksToTrade.forEach(userPick => {
            if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
              commonPickFound = true;
            }
          });

          offer.offerList.forEach(userPick => {
            if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
              commonPickFound = true;
            }
          });
        });

        acceptedOffer.allUserPicksToTrade.forEach(trade => {
          offer.allUserPicksToTrade.forEach(userPick => {
            if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
              commonPickFound = true;
            }
          });

          offer.offerList.forEach(userPick => {
            if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
              commonPickFound = true;
            }
          });
        });

        if (commonPickFound) {
          rejectedOffers.push(offer);
          let counteredTeamIndex = counteredTeams.findIndex(teamName => offer.currentTeamName === teamName || offer
            .offeringTeamShortName === teamName);
          if (counteredTeamIndex >= 0) {
            counteredTeams.splice(counteredTeamIndex, 1);
          }
        }
      });

      console.log("rejected counter offers->", rejectedOffers);
      rejectedOffers.forEach((offer) => {
        let rejectedOffer = {
          allUserPicksToTrade: "",
          offerList: "",
          currentTeamName: "",
          offeringTeamShortName: "",
          pickNumber: currentMultiUserPick,
          roomId: currentRoomData.roomId,
        };

        rejectedOffer.allUserPicksToTrade = offer.allUserPicksToTrade;
        rejectedOffer.offerList = offer.offerList;
        rejectedOffer.currentTeamName = offer.currentTeamName;
        rejectedOffer.offeringTeamShortName = offer.offeringTeamShortName;

        toBeHandledOffers.rejectedCounterOffers.push(rejectedOffer);

        for (let i = 0; i < multiUserCounterOffersList.length; i++) {
          if (offer.offeringTeamShortName === multiUserCounterOffersList[i].offeringTeamShortName) {
            multiUserCounterOffersList.splice(i, 1);
            break;
          }
        }
      });

      rejectedOffers.length = 0;

      multiUserTradeOffersList.forEach((offer) => {
        let commonPickFound = false;
        acceptedOffer.offerList.forEach(trade => {
          offer.allUserPicksToTrade.forEach(userPick => {
            if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
              commonPickFound = true;
            }
          });

          offer.offerList.forEach(userPick => {
            if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
              commonPickFound = true;
            }
          });
        });

        acceptedOffer.allUserPicksToTrade.forEach(trade => {
          offer.allUserPicksToTrade.forEach(userPick => {
            if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
              commonPickFound = true;
            }
          });

          offer.offerList.forEach(userPick => {
            if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
              commonPickFound = true;
            }
          });
        });

        if (commonPickFound) {
          rejectedOffers.push(offer);
          let counteredTeamIndex = counteredTeams.findIndex(teamName => offer.currentTeamName === teamName || offer
            .offeringTeamShortName === teamName);
          if (counteredTeamIndex >= 0) {
            counteredTeams.splice(counteredTeamIndex, 1);
          }
        }
      });

      console.log("rejected trade offers->", rejectedOffers);
      rejectedOffers.forEach((offer) => {
        let rejectedOffer = {
          allUserPicksToTrade: "",
          offerList: "",
          currentTeamName: "",
          offeringTeamShortName: "",
          pickNumber: currentMultiUserPick,
          roomId: currentRoomData.roomId,
        };

        rejectedOffer.allUserPicksToTrade = offer.allUserPicksToTrade;
        rejectedOffer.offerList = offer.offerList;
        rejectedOffer.currentTeamName = offer.currentTeamName;
        rejectedOffer.offeringTeamShortName = offer.offeringTeamShortName;

        toBeHandledOffers.rejectedTradeOffers.push(rejectedOffer);

        for (let i = 0; i < multiUserTradeOffersList.length; i++) {
          if (offer.offeringTeamShortName === multiUserTradeOffersList[i].offeringTeamShortName) {
            multiUserTradeOffersList.splice(i, 1);
            break;
          }
        }
      });

      rejectedOffers.length = 0;

      console.log("counter offers list->", multiUserCounterOffersList);
      console.log("trade offers list->", multiUserTradeOffersList);
      console.log("system offers list->", multiUserSystemOffersList);
      console.log("offers list->", offersList);
      console.log("offers list length->", offersList.length);
      console.log("accepted-offer->", acceptedOffer);

      let offeredToTeamName;
      if (acceptedOffer.offeringTeamShortName === currentOfferTeam.shortName) {
        offeredToTeamName = acceptedOffer.currentTeamName;
      } else {
        offeredToTeamName = acceptedOffer.offeringTeamShortName;
      }

      revertCommonCounteredTradeOffers(acceptedOffer, currentOfferTeam.shortName, "offer-accepted");

      if (counterOfferAccepted) {
        toBeHandledOffers.acceptedOfferType = "counter-offer-accepted-other";
        socket.emit("chat", {
          roomId: currentRoomData.roomId,
          offeringTeam: currentOfferTeam.shortName,
          toTeam: offeredToTeamName,
          type: "counter_offer_accepted",
        });
      } else if (tradeOfferAccepted) {
        toBeHandledOffers.acceptedOfferType = "trade-offer-accepted-other";
        socket.emit("chat", {
          roomId: currentRoomData.roomId,
          offeringTeam: currentOfferTeam.shortName,
          toTeam: offeredToTeamName,
          type: "trade_offer_accepted",
        });
      } else {
        toBeHandledOffers.acceptedOfferType = "offer-accepted";
      }

      toBeHandledOffers.acceptedOffer = acceptedOffer;

      handleAccumulatedOffers();

      lastAcceptedOffer = acceptedOffer;
      setTimeout(() => {
        lastAcceptedOffer = "";
      }, 3000);

      return;
    }

    if (!multiUserDraft) {
      draftHistory.push(createDraftSnapshot());
      disableRevertPickBtn();
    }

    var givingPicks = currentOfferTeam.allUserPicksToTrade;

    for (var offer of givingPicks) {
      offer.tradedPick = true;
      if (offer.futurePick) {
        for (var i = 0; i < picksList.length; i++) {
          if (picksList[i].futureRound == offer.futureRound && picksList[i].futureOriginalTeam == offer
            .futureOriginalTeam) {
            picksList[i].currentTeam = currentOfferTeam;
          }
        }
      } else {
        var number = offer.number;
        var tradingTeamPickListIndex = picksList.findIndex((item) => item.number === number);
        picksList[tradingTeamPickListIndex].currentTeam = currentOfferTeam;
        var tradeContainer = $(".pic-container.pick-number-" + number);
        if (tradeContainer) {
          var tradeIconHolderNext = tradeContainer.querySelector(".pick-trade-info-btn");
          if (tradeIconHolderNext) {
            removeClass(tradeIconHolderNext, "hidden");
            tradeIconHolderNext.dataset.tradeindex = tradeIndex;
          }

          tradeContainer.dataset.shortname = currentOfferTeam.shortName;
          let teamLogoContainer = tradeContainer.querySelector(".team-logo-container");
          if (teamLogoContainer) {
            teamLogoContainer.dataset.teamname = currentOfferTeam.shortName;
          }

          let teamLogoHolder = tradeContainer.querySelector(".team-logo");
          if (teamLogoHolder) {
            teamLogoHolder.src = STATIC_URL + teamLogoPath + currentOfferTeam.teamLogo + "?w=80&tag=" + imageRefreshTag;
            teamLogoHolder.dataset.teamlogo = currentOfferTeam.teamLogo;
          }

          updateTeamNeedsInPickContainer(tradeContainer, currentOfferTeam.shortName);
        }
      }
    }

    var indexList = [];
    for (var i = 0; i < originalTeam.draftPicks.length; i++) {
      for (var j = 0; j < givingPicks.length; j++) {
        if (originalTeam.draftPicks[i].number === givingPicks[j].number && originalTeam.draftPicks[i].futureRound ===
          givingPicks[j].futureRound && originalTeam.draftPicks[i].futureOriginalTeam === givingPicks[j].futureOriginalTeam) {
          indexList.push(i);
        }
      }
    }

    for (var i = indexList.length - 1; i >= 0; i--) {
      originalTeam.draftPicks.splice(indexList[i], 1);
    }

    for (var i = 0; i < currentOfferTeam.offerList.length; i++) {
      originalTeam.draftPicks.push(currentOfferTeam.offerList[i]);
    }

    indexList = [];
    for (var i = 0; i < currentOfferTeam.draftPicks.length; i++) {
      for (var j = 0; j < currentOfferTeam.offerList.length; j++) {
        if (currentOfferTeam.offerList[j].number === currentOfferTeam.draftPicks[i].number && currentOfferTeam
          .offerList[j].futureRound === currentOfferTeam.draftPicks[i].futureRound &&
          currentOfferTeam.draftPicks[i].futureOriginalTeam === currentOfferTeam.offerList[j].futureOriginalTeam) {
          indexList.push(i);
        }
      }
    }

    for (var i = indexList.length - 1; i >= 0; i--) {
      currentOfferTeam.draftPicks.splice(indexList[i], 1);
    }

    for (var i = 0; i < givingPicks.length; i++) {
      currentOfferTeam.draftPicks.push(givingPicks[i]);
    }

    for (var offer of currentOfferTeam.offerList) {
      offer.tradedPick = true;
      if (offer.futurePick) {
        for (var i = 0; i < picksList.length; i++) {
          if (picksList[i].futureRound == offer.futureRound && picksList[i].futureOriginalTeam == offer
            .futureOriginalTeam) {
            picksList[i].currentTeam = originalTeam;
          }
        }
      } else {
        var number = offer.number;
        var tradingTeamPickListIndex = picksList.findIndex((item) => item.number === number);
        picksList[tradingTeamPickListIndex].currentTeam = teamsList[teamsList.findIndex((item) => item.shortName ===
          originalTeamName)];
        var tradeContainer = $(".pic-container.pick-number-" + number);
        if (tradeContainer) {
          var tradeIconHolderNext = tradeContainer.querySelector(".pick-trade-info-btn");
          if (tradeIconHolderNext) {
            removeClass(tradeIconHolderNext, "hidden");
            tradeIconHolderNext.dataset.tradeindex = tradeIndex;
          }

          tradeContainer.dataset.shortname = originalTeamName;
          let teamLogoContainer = tradeContainer.querySelector(".team-logo-container");
          if (teamLogoContainer) {
            teamLogoContainer.dataset.teamname = originalTeamName;
          }

          let teamLogoHolder = tradeContainer.querySelector(".team-logo");
          if (teamLogoHolder) {
            teamLogoHolder.src = STATIC_URL + teamLogoPath + originalTeamLogo + "?w=80&tag=" + imageRefreshTag;
            teamLogoHolder.dataset.teamlogo = originalTeamLogo;
          }

          updateTeamNeedsInPickContainer(tradeContainer, originalTeamName);
        }
      }
    }

    await yieldToMain();

    setTradesData(currentOfferTeam.allUserPicksToTrade, currentOfferTeam.offerList, true);
    removeClass(currentPickContainer, "currentPick");
    hideUserSelectionIcon();
    var currentPickIndex = picksList.findIndex((i) => i.onTheClock === true);
    picksList[currentPickIndex].tradedPick = true;
    picksList[currentPickIndex].tradeUpPick = true;
    clearOffers(true);

    originalTeam.draftPicks.sort(function (x, y) {
      if (x.number && y.number) {
        return x.number - y.number;
      } else if (!x.number && !y.number) {
        return parseInt(x.futureRound.charAt(0)) - parseInt(y.futureRound.charAt(0));
      } else if (!x.number || !y.number) {
        if (!x.number) {
          return 1;
        } else if (!y.number) {
          return -1;
        }
      }
    });

    currentOfferTeam.draftPicks.sort(function (x, y) {
      if (x.number && y.number) {
        return x.number - y.number;
      } else if (!x.number && !y.number) {
        return parseInt(x.futureRound.charAt(0)) - parseInt(y.futureRound.charAt(0));
      } else if (!x.number || !y.number) {
        if (!x.number) {
          return 1;
        } else if (!y.number) {
          return -1;
        }
      }
    });

    if (IS_DESKTOP) {
      let myPicksBtn = $(".mypicks-btn-holder .my-picks-btn");
      if (myPicksBtn && myPicksBtn.classList.contains("selected")) {
        let selectedTeamBtn = $(".selected-user-teams-container .team-logo-btn-container.selected button.team-logo-btn");
        if (selectedTeamBtn) {
          selectedTeamBtn.click();
        }
      }
    }
  }
}

function showOffer(currentTeamName, currentTeamPickNumber, currentTeamImage, index, isAutoToggled) {
  if (!offersList.length) {
    return;
  }
  if (!isAutoToggled) {
    trackGAEventForPage("trade_offer");
  }

  enableShowOffersBtn();
  if (!multiUserDraft) {
    disablePauseDraftBtn();
  }

  var offerContainer = $(".offer-container");
  var containerExists;
  if (!offerContainer) {
    containerExists = false;
    var availableTradesTemplate = document.getElementById("available-trades");
    if (!availableTradesTemplate) return;
    offerContainer = availableTradesTemplate.content.cloneNode(true);
    offerContainer = offerContainer.querySelector(".offer-container");

    offerContainer.dataset.currentteam = currentTeamName;
    offerContainer.dataset.picknumber = currentTeamPickNumber;
    offerContainer.dataset.teamimage = currentTeamImage;

    if (currentTeamName && currentTeamImage) {
      offerContainer.dataset.autopopulated = true;
    }
  } else {
    containerExists = true;
    removeClass(offerContainer, "hidden");
    if (currentTeamName) {
      offerContainer.dataset.currentteam = currentTeamName;
    }
    if (currentTeamPickNumber) {
      offerContainer.dataset.picknumber = currentTeamPickNumber;
    }
    if (currentTeamImage) {
      offerContainer.dataset.teamimage = currentTeamImage;
    }

    if (currentTeamName && currentTeamImage) {
      offerContainer.dataset.autopopulated = true;
    }

    currentTeamName = offerContainer.dataset.currentteam;
    currentTeamPickNumber = offerContainer.dataset.picknumber;
    currentTeamImage = offerContainer.dataset.teamimage;
  }

  var overlay = $(".overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  }

  var currentOffer;
  var currentIndex;
  if (index >= 0) {
    currentIndex = index;
  } else {
    currentIndex = 0;
  }

  if (currentIndex > -1 && currentIndex < (offersList.length)) {
    currentOffer = offersList[currentIndex];
    offersList[currentIndex].currentOffer = true;
    if (offersList[currentIndex - 1]) {
      offersList[currentIndex - 1].currentOffer = false;
    }
  } else {
    return;
  }

  currentOfferTeam = currentOffer;

  var offerNumberHolder = offerContainer.querySelector(".offer-number");
  if (offerNumberHolder) {
    if (!multiUserCounterOffersList.length) {
      offerNumberHolder.innerHTML = "You have " + offersList.length + " Trade Offer(s)";
    } else if (offersList.length === multiUserCounterOffersList.length) {
      offerNumberHolder.innerHTML = "You have " + multiUserCounterOffersList.length + " Counter Offer(s)";
    } else if (offersList.length > multiUserCounterOffersList.length) {
      offerNumberHolder.innerHTML = "You have " + (offersList.length - multiUserCounterOffersList
        .length) + " Trade Offer(s) & " +
        multiUserCounterOffersList.length + " Counter Offer(s)";
    }
  }

  var btnPreviousHolder = offerContainer.querySelector(".nav-previous");
  if (btnPreviousHolder && currentIndex > 0) {
    removeClass(btnPreviousHolder, "disabled");
    btnPreviousHolder.disabled = false;
  } else if (btnPreviousHolder && currentIndex == 0) {
    addClass(btnPreviousHolder, "disabled");
    btnPreviousHolder.disabled = true;
  }

  var btnNextHolder = offerContainer.querySelector(".nav-next");
  if (btnNextHolder && currentIndex >= 0 && currentIndex < offersList.length - 1) {
    removeClass(btnNextHolder, "disabled");
    btnNextHolder.disabled = false;
  } else if (btnNextHolder && currentIndex == offersList.length - 1) {
    addClass(btnNextHolder, "disabled");
    btnNextHolder.disabled = true;
  }

  var currentTeamImageHolder = offerContainer.querySelector(".current-team-img");
  if (currentTeamImageHolder) {
    currentTeamImageHolder.src = STATIC_URL + teamLogoPath + currentTeamImage + "?w=80&tag=" + imageRefreshTag;
  }

  var currentTeamShortnameHolder = offerContainer.querySelector(".current-team-shortname");
  if (currentTeamShortnameHolder) {
    currentTeamShortnameHolder.innerHTML = currentTeamName;
  }

  var currentTeamPickNumberHolder = offerContainer.querySelector(".current-team-pick");
  currentTeamPickNumberHolder.innerHTML = "";
  if (currentTeamPickNumberHolder) {
    var offers = currentOffer.allUserPicksToTrade
    for (var offer of offers) {
      if (offer) {
        var span = document.createElement("span");
        if (!offer.futurePick) {
          span.innerHTML = "Pick " + offer.number;
        } else {
          span.innerHTML = offer.futurePickYear + " " + offer.futureOriginalTeam + " " + offer.futureRound;
        }

        currentTeamPickNumberHolder.appendChild(span);
      }
    }

    if (currentOffer.allUserPlayersToTrade && currentOffer.allUserPlayersToTrade.length) {
      for (var player of currentOffer.allUserPlayersToTrade) {
        var span = document.createElement("span");
        span.innerHTML = formatPlayerName(player.playerName, player.position);
        currentTeamPickNumberHolder.appendChild(span);
      }
    }
  }

  var offersHolder = offerContainer.querySelector(".offering-team .offers");
  offersHolder.innerHTML = "";
  if (offersHolder) {
    var offers = currentOffer.offerList
    for (var offer of offers) {
      if (offer) {
        var span = document.createElement("span");
        if (!offer.futurePick) {
          span.innerHTML = "Pick " + offer.number;
        } else {
          span.innerHTML = offer.futurePickYear + " " + offer.futureOriginalTeam + " " + offer.futureRound;
        }

        offersHolder.appendChild(span);
      }
    }

    if (currentOffer.offerPlayersList && currentOffer.offerPlayersList.length) {
      for (var player of currentOffer.offerPlayersList) {
        var span = document.createElement("span");
        span.innerHTML = formatPlayerName(player.playerName, player.position);
        offersHolder.appendChild(span);
      }
    }
  }

  var offeringTeamImageHolder = offerContainer.querySelector(".offering-team-img");
  if (offeringTeamImageHolder) {
    var offeringTeamLogo = currentOffer.teamLogo;
    offeringTeamImageHolder.src = STATIC_URL + teamLogoPath + offeringTeamLogo + "?w=80&tag=" + imageRefreshTag;
  }

  var offeringTeamShortnameHolder = offerContainer.querySelector(".offering-team-shortname");
  if (offeringTeamShortnameHolder) {
    offeringTeamShortnameHolder.innerHTML = currentOffer.shortName;
    offerContainer.dataset.offeringteam = currentOffer.shortName;
  }

  var allOffers = currentOffer.allUserPicksToTrade;
  var offersData = {};
  var offerPicks = [];
  var offerFuturePicks = [];
  var offerPicksValue = 0;
  var futurePicksValue = 0;
  var playerPicksValue = 0;
  for (var offer of allOffers) {
    if (offer.number) {
      offerPicks.push(offer.number);
      offerPicksValue += offer.value;
    } else {
      offerFuturePicks.push(offer.futureRound + "-" + offer.futurePickYear + "-" + offer.futureOriginalTeam);
      futurePicksValue += offer.value;
    }
  }

  var offerPlayers = [];
  if (currentOffer.allUserPlayersToTrade && currentOffer.allUserPlayersToTrade.length) {
    for (var player of currentOffer.allUserPlayersToTrade) {
      playerPicksValue += player.value || 0;
      offerPlayers.push(player.playerName);
    }
  }

  if (offerPicks.length) {
    offersData.picks = offerPicks;
  }

  if (offerFuturePicks.length) {
    offersData.futurePicks = offerFuturePicks;
  }

  if (offerPlayers.length) {
    offersData.players = offerPlayers;
  }

  offersData.team = currentTeamName;
  offersData.value = offerPicksValue + futurePicksValue + playerPicksValue;

  offerContainer.dataset.currentteamgivingpicks = JSON.stringify(offersData);


  allOffers = currentOffer.offerList;
  offersData = {};
  offerPicks = [];
  offerFuturePicks = [];
  offerPicksValue = 0;
  futurePicksValue = 0;
  playerPicksValue = 0;
  for (var offer of allOffers) {
    if (offer.number) {
      offerPicks.push(offer.number);
      offerPicksValue += offer.value;
    } else {
      offerFuturePicks.push(offer.futureRound + "-" + offer.futurePickYear + "-" + offer.futureOriginalTeam);
      futurePicksValue += offer.value;
    }
  }

  offerPlayers = [];
  if (currentOffer.offerPlayersList && currentOffer.offerPlayersList.length) {
    for (var player of currentOffer.offerPlayersList) {
      playerPicksValue += player.value || 0;
      offerPlayers.push(player.playerName);
    }
  }

  if (offerPicks.length) {
    offersData.picks = offerPicks;
  }

  if (offerFuturePicks.length) {
    offersData.futurePicks = offerFuturePicks;
  }

  if (offerPlayers.length) {
    offersData.players = offerPlayers;
  }

  offersData.team = currentOffer.shortName;
  offersData.value = offerPicksValue + futurePicksValue + playerPicksValue;

  offerContainer.dataset.currentteamgettingpicks = JSON.stringify(offersData);

  // Trade value comparison widget
  var valueComparison = offerContainer.querySelector(".trade-value-comparison");
  if (valueComparison) {
    var userTotalValue = JSON.parse(offerContainer.dataset.currentteamgivingpicks).value || 0;
    var opposingTotalValue = JSON.parse(offerContainer.dataset.currentteamgettingpicks).value || 0;
    var positiveUserVal = Math.max(0, userTotalValue);
    var positiveOpposingVal = Math.max(0, opposingTotalValue);
    var totalValue = positiveUserVal + positiveOpposingVal;
    var userPercent = totalValue > 0 ? (positiveUserVal / totalValue * 100).toFixed(1) : "0.0";
    var opposingPercent = totalValue > 0 ? (positiveOpposingVal / totalValue * 100).toFixed(1) : "0.0";

    var userValueSection = valueComparison.querySelector(".trade-value-team.user-value");
    if (userValueSection) {
      var userPoints = userValueSection.querySelector(".trade-value-points");
      if (userPoints) {
        userPoints.textContent = userTotalValue;
      }
    }

    var opposingValueSection = valueComparison.querySelector(".trade-value-team.opposing-value");
    if (opposingValueSection) {
      var opposingPoints = opposingValueSection.querySelector(".trade-value-points");
      if (opposingPoints) {
        opposingPoints.textContent = opposingTotalValue;
      }
    }

    var barUser = valueComparison.querySelector(".trade-value-bar-user");
    var barOpposing = valueComparison.querySelector(".trade-value-bar-opposing");
    if (barUser && barOpposing) {
      barUser.style.width = userPercent + "%";
      var barUserPercent = barUser.querySelector(".trade-value-bar-percent");
      if (barUserPercent) {
        barUserPercent.textContent = userPercent + "%";
      }
      barOpposing.style.width = opposingPercent + "%";
      var barOpposingPercent = barOpposing.querySelector(".trade-value-bar-percent");
      if (barOpposingPercent) {
        barOpposingPercent.textContent = opposingPercent + "%";
      }
    }
  }

  if (!containerExists) {
    addClass(offerContainer, "popup");
    document.body.appendChild(offerContainer);
  }

  return;
}

function getCurrentNeedyTeams() {
  var currentPick = getCurrentPick().currentPick;
  var currentNeedyTeams = [];
  var upcomingPicks = picksList.slice(
    picksList.indexOf(currentPick) + 1
  );

  var upcomingPicks = upcomingPicks.filter(
    function (pick) {
      return !userSelectedTeams.includes(pick.currentTeam.shortName);
    }
  );

  var participatingTeams = [];

  for (var i = 0; i < upcomingPicks.length; i++) {
    if (!participatingTeams.includes(upcomingPicks[i].currentTeam)) {
      participatingTeams.push(upcomingPicks[i].currentTeam);
    }
  }

  for (var team of participatingTeams) {
    if (currentPick.number === 1) {
      if (team.needQB >= 5) {
        const qbPlayer = playersList.find(player => player.position === "QB");
        team.targetPlayer = qbPlayer;
        // team.targetPlayer = playersList[0];
        if (
          !currentNeedyTeams.includes(team) &&
          currentPick.currentTeam.shortName !== team.shortName
        ) {
          currentNeedyTeams.push(team);
        }
      }
    } else {
      for (var i = 0; i < 3; i++) { // to be done for top 3 player ranks
        if (
          (team.teamNeed1 === playersList[i].position ||
            team.teamNeed2 === playersList[i].position) &&
          currentPick.currentTeam.shortName !== team.shortName
        ) {
          team.targetPlayer = playersList[i];
          if (!currentNeedyTeams.includes(team)) {
            currentNeedyTeams.push(team);
          }
        }
      }
    }

    if (currentPick.number > roundends[3]) {
      for (var i = 0; i < 5; i++) { // to be done for top 5 player ranks
        if (
          (team.teamNeed1 === playersList[i].position ||
            team.teamNeed2 === playersList[i].position ||
            team.teamNeed3 === playersList[i].position) &&
          currentPick.currentTeam.shortName !== team.shortName
        ) {
          team.targetPlayer = playersList[i];
          if (!currentNeedyTeams.includes(team)) {
            currentNeedyTeams.push(team);
          }
        }
      }
    }
  }

  currentNeedyTeams = currentNeedyTeams.filter(function (team) {
    return team.draftPicks.some(checkCurrentPickNeed);
  });

  return currentNeedyTeams;
};

function checkCurrentPickNeed(pick) {
  return pick.playerSelection === "" && !pick.futurePick;
}

function fetchTrades(currentNeedyTeams, currentPick, minValue, maxValue) {
  var offersBundle = [];
  if (currentNeedyTeams && currentNeedyTeams.length > 0) {
    for (var team of currentNeedyTeams) {
      var adjustedMinValue;
      if (currentPick.number < 227) {
        adjustedMinValue = parseFloat(minValue + (maxValue - minValue) * Math.random());
      } else {
        adjustedMinValue = currentPick.value - 0.1;
      }

      var adjustedMaxValue;
      if (currentPick.number < 227) {
        adjustedMaxValue = parseFloat(adjustedMinValue + 0.1);
      } else {
        adjustedMaxValue = adjustedMinValue * 2 + 0.3;
      }

      team.draftPicks.sort(function (x, y) {
        return y.value - x.value;
      });

      var possibleTrades = {
        team: team,
        draftPicks: [],
        value: 0,
        accepted: false,
        addUserPick: false,
        allUserPicksToTrade: [currentPick],
      };

      possibleTrades.draftPicks = team.draftPicks.filter(
        function (pick) {
          return pick.playerSelection === "" && pick.futurePick === false;
        }).slice(0, 1);

      var possibleFutureTradePicks;
      if (currentPick.number < roundends[3]) {
        possibleFutureTradePicks = team.draftPicks.filter(
          function (pick) {
            return pick.number > possibleTrades.draftPicks[0].number || pick.futurePick === true;
          });
      } else {
        possibleFutureTradePicks = team.draftPicks.filter(
          function (pick) {
            return pick.number > possibleTrades.draftPicks[0].number && !(pick.futurePick === true);
          });
      }

      possibleTrades.value = possibleTrades.draftPicks[0].value;

      if (team.targetPlayer.position !== "QB") {
        possibleFutureTradePicks = possibleFutureTradePicks.filter(
          function (pick) {
            return !(pick.futurePick && pick.value === 150);
          });
      }

      var randomNum = Math.floor(Math.random() * 100);
      var randomNumCompare;
      if (currentPick.number === 1) {
        randomNumCompare = 0;
      } else if (currentPick.number < 11) {
        randomNumCompare = 25;
      } else {
        randomNumCompare = 50;
      }

      if (randomNum < randomNumCompare) {
        possibleTrades.addUserPick = true;
      } else {
        possibleTrades.addUserPick = false;
      }

      function addMostValuedPickToBundle(x) {
        if (possibleTrades.draftPicks.length > 4 || x > possibleFutureTradePicks.length - 1) {
          return;
        }
        if (possibleFutureTradePicks.length > possibleTrades.draftPicks.length) {
          if ((currentPick.number < roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[x].value) < (
            currentPick.value * adjustedMinValue))) ||
            (currentPick.number >= roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[x].value) <
              adjustedMinValue))) {
            possibleTrades.draftPicks.push(possibleFutureTradePicks[x]);
            possibleTrades.value += possibleFutureTradePicks[x].value;
            addMostValuedPickToBundle(x + 1);
          } else if ((currentPick.number < roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[x]
            .value) > (currentPick.value * (adjustedMaxValue + 0.15)))) ||
            (currentPick.number >= roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[x].value) >
              adjustedMaxValue))
          ) {
            addMostValuedPickToBundle(x + 1);
          } else {
            possibleTrades.draftPicks.push(possibleFutureTradePicks[x]);
            possibleTrades.value += possibleFutureTradePicks[x].value;
            possibleTrades.draftPicks = possibleTrades.draftPicks.sort(
              function (x, y) {
                if (x.futurePick < y.futurePick) return -1;
                if (x.futurePick > y.futurePick) return 1;
                if (x.value > y.value) return -1;
                if (x.value < y.value) return 1;
                if (x.number < y.number) return -1;
                if (x.number > y.number) return 1;
                return 1;
              }
            );
            return possibleTrades;
          }
        }
      }

      function addLeastValuedPickToBundle(x) {
        if (possibleTrades.draftPicks.length < maxPicksInPackage) {
          if (possibleFutureTradePicks.length > possibleTrades.draftPicks.length) {
            for (var i = possibleFutureTradePicks.length - 1; i >= x; i--) {
              if ((currentPick.number < roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[i].value) >
                (currentPick.value * adjustedMinValue))) ||
                (currentPick.number >= roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[i].value) >
                  adjustedMinValue))
              ) {
                if ((currentPick.number < roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[i]
                  .value) < (currentPick.value * adjustedMaxValue))) ||
                  (currentPick.number >= roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[i].value) <
                    adjustedMaxValue))
                ) {
                  possibleTrades.draftPicks.push(possibleFutureTradePicks[i]);
                  possibleTrades.value += possibleFutureTradePicks[i].value;
                  possibleTrades.draftPicks = possibleTrades.draftPicks.sort(
                    function (x, y) {
                      if (x.futurePick < y.futurePick) return -1;
                      if (x.futurePick > y.futurePick) return 1;
                      if (x.value > y.value) return -1;
                      if (x.value < y.value) return 1;
                      if (x.number < y.number) return -1;
                      if (x.number > y.number) return 1;
                      return 1;
                    }
                  );
                  return possibleTrades;
                } else {
                  return;
                }
              }
            }
            possibleTrades.draftPicks.push(possibleFutureTradePicks[x]);
            possibleTrades.value += possibleTrades.draftPicks[x + 1].value;
            addLeastValuedPickToBundle(x + 1);
          }
        }
      }

      if (possibleTrades.addUserPick) {
        addMostValuedPickToBundle(0);
      } else {
        addLeastValuedPickToBundle(0);
      }

      if ((currentPick.number < roundends[6] && (possibleTrades.value >= (currentPick.value * adjustedMinValue)) ||
        currentPick.number >= roundends[6] && possibleTrades.value >= adjustedMinValue) &&
        possibleTrades.draftPicks.length > 1) {
        offersBundle.push(possibleTrades);
      }

      if (currentPick.number === 1 && !offersBundle.includes(possibleTrades)) {
        possibleTrades.draftPicks = possibleTrades.draftPicks.sort(
          function (x, y) {
            if (x.futurePick < y.futurePick) return -1;
            if (x.futurePick > y.futurePick) return 1;
            if (x.value > y.value) return -1;
            if (x.value < y.value) return 1;
            if (x.number < y.number) return -1;
            if (x.number > y.number) return 1;
            return 1;
          }
        );
        offersBundle.push(possibleTrades);
      }
    }

    for (var i = 0; i < offersBundle.length; i++) {
      if (offersBundle[i].addUserPick) {
        insertPickInBundle(offersBundle[i]);
      }
    }

    if (offersBundle.length > 0 && currentPick.number > blockTradeUpPick) {
      offersBundle = randomizeOffers(offersBundle);
    }
  }
  return offersBundle;
}

function insertPickInBundle(tradeOffer) {
  var currentPick = getCurrentPick().currentPick;

  var possibleUserFutureTradePicks = currentPick.currentTeam.draftPicks.filter(
    function (pick) {
      return pick.number > currentPick.number || pick.futurePick === true;
    }
  );

  function getFairValueUserPick(tradeOffer, x) {
    if (x + 1 < possibleUserFutureTradePicks.length) {
      if ((currentPick.number < 190 && (Math.abs((currentPick.value + possibleUserFutureTradePicks[x].value) * 1.1 - tradeOffer.value) <
        Math.abs((currentPick.value + possibleUserFutureTradePicks[x + 1].value) * 1.1 - tradeOffer.value))) ||
        currentPick.number >= 190 && (Math.abs((currentPick.value + possibleUserFutureTradePicks[x].value) * 1.3 - tradeOffer.value) <
          Math.abs((currentPick.value + possibleUserFutureTradePicks[x + 1].value) * 1.3 - tradeOffer.value))) {
        if (currentPick.value + possibleUserFutureTradePicks[x].value < tradeOffer.value) {
          var addedUserPick = possibleUserFutureTradePicks[x];
          tradeOffer.allUserPicksToTrade.push(addedUserPick);
          return addedUserPick;
        }
      }
      getFairValueUserPick(tradeOffer, x + 1);
    } else {
      tradeOffer.allUserPicksToTrade.push(
        possibleUserFutureTradePicks[possibleUserFutureTradePicks.length - 1]
      );
    }
  }

  getFairValueUserPick(tradeOffer, 0);
};

function randomizeOffers(offers) {
  for (var i = offers.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tempOffer = offers[i];
    offers[i] = offers[j];
    offers[j] = tempOffer;
  }

  return offers;
};

async function changeRoundSelectorData(target) {
  var roundSelectors = $all(".round-trades-selector");
  if (roundSelectors) {
    for (var selector of roundSelectors) {
      removeClass(selector, "selected");
    }
  }

  var resultContainer = $(".final-result-container");
  if (resultContainer) {
    resultContainer.dataset.shortname = "full_result";
    resultContainer.dataset.round = target.dataset.round;
  }

  addClass(target, "selected");

  await yieldToMain();

  var roundsPicsHolder = $(".rounds-pics-container .rounds-pics-holder");
  var draftResult = roundsPicsHolder ? roundsPicsHolder.children : [];
  var resultContainer = $(".round-trades-container .round-selection-body");
  if (draftResult && resultContainer) {
    resultContainer.innerHTML = "";
    for (var element of draftResult) {
      if (element.dataset.roundnumber == target.dataset.round) {
        var clone = element.cloneNode(true);
        var playerHolder = clone.querySelector(".traded-player-name-position-container");
        if (playerHolder) {
          playerHolder.onclick = showPlayerInfo;
        }

        let draftedInfoContainer = clone.querySelector(".drafting-info-container");
        if (draftedInfoContainer && !hasClass(draftedInfoContainer, "hidden")) {
          playerHolder.style.maxWidth = "149px";
          playerHolder.style.textOverflow = "ellipsis";
          playerHolder.style.overflow = "hidden";
        }

        if (!multiUserDraft) {
          var fullPickNum = parseInt(clone.dataset.number);
          var fullPickObj = picksList.find(function(p) { return p.number === fullPickNum; });
          if (fullPickObj && fullPickObj.pickGradeData) {
            clone.appendChild(createPickGradeElement(fullPickObj.pickGradeData.grade));
          }
        }

        resultContainer.appendChild(clone);
      }
    }

    let roundPicks = resultContainer.children;
    let height = (32 + (48 * roundPicks.length) + 80) / 3;

    if (multiUserDraft && !IS_DESKTOP) {
      resultContainer.setAttribute("style", `max-height:2600px !important`);
      let pickContainers = $all(".final-trades-holder .pic-container");
      if (pickContainers.length) {
        pickContainers.forEach(ele => ele.style.width = "100%");
      }
    } else {
      resultContainer.setAttribute("style", `max-height:${height}px !important`);
    }
  }
}

function listRoundsSelectors() {
  var roundsHolder = $(".all-rounds-trades-container .all-rounds-container");
  if (roundsHolder) {
    roundsHolder.innerHTML = "";
    var rounds = $all(".rounds-pics-container .rounds-pics-holder .round-number");
    if (rounds && rounds.length > 0) {
      for (var round of rounds) {
        var btn = document.createElement("button");
        btn.innerHTML = "R" + round.dataset.round;
        addClass(btn, "round-trades-selector");
        addClass(btn, round.dataset.round);
        btn.setAttribute("onclick", "changeRoundSelectorData(this)");
        btn.dataset.round = round.dataset.round;
        roundsHolder.appendChild(btn);
      }
    }

    if (rounds.length > 1) {
      removeClass(roundsHolder, "hidden");
    } else {
      addClass(roundsHolder, "hidden");
    }
  }
}

function navigateToLoginScreen() {
  trackGAEventForPage("result_screen_login_cta_click");
  window.location = loginRedirectUrl;
}

async function showResultScreenDashboard() {
  trackGAEventForPage("result_screen_dashboard_cta_click");
  var myDraftBtn = $(".result-btns-holder .my-draft-btn");
  if (myDraftBtn) {
    removeClass(myDraftBtn, "selected");
  }

  var fullResultBtn = $(".result-btns-holder .full-results-btn");
  if (fullResultBtn) {
    removeClass(fullResultBtn, "selected");
  }

  var dashboardBtn = $(".result-btns-holder .dashboard-btn");
  if (dashboardBtn) {
    addClass(dashboardBtn, "selected");
  }

  var teamsResultHolder = $(".final-result-container .teams-result-holder");
  if (teamsResultHolder) {
    addClass(teamsResultHolder, "hidden");
  }

  var roundsResultHolder = $(".final-result-container .all-rounds-trades-container");
  if (roundsResultHolder) {
    addClass(roundsResultHolder, "hidden");
  }

  var dummyDashboardHolder = $(".final-result-container .result-screen-dashboard");
  if (dummyDashboardHolder) {
    removeClass(dummyDashboardHolder, "hidden");
  }

  const utilityContainer = $(".final-result-container .utility-container");
  if (utilityContainer) {
    const downloadBtn = utilityContainer.querySelector(".download-btn-mds");
    const shareBtn = utilityContainer.querySelector(".share-btn-mds");
    if (shareBtn && downloadBtn) {
      addClass(shareBtn, "hidden");
      addClass(downloadBtn, "hidden");
    }

    const gradeToggleDashboard = utilityContainer.querySelector(".grade-toggle");
    if (gradeToggleDashboard) {
      addClass(gradeToggleDashboard, "hidden");
    }
  }

  var allDashboardGradeToggles = $all(".grade-toggle");
  if (allDashboardGradeToggles) {
    for (var dgt = 0; dgt < allDashboardGradeToggles.length; dgt++) {
      addClass(allDashboardGradeToggles[dgt], "hidden");
    }
  }

  await yieldToMain();

  if (mdsLoggedInUserId) {
    const parentSelector = ".final-result-container .result-screen-dashboard";
    const loginContainer = $(".result-screen-dashboard .dashboard-holder .login-container");
    if (loginContainer) {
      addClass(loginContainer, "hidden");
    }

    const loginContainerOverlay = $(".result-screen-dashboard .login-container-overlay");
    addClass(loginContainerOverlay, "hidden");

    const dashboardLoadingOverlay = $(".result-screen-dashboard .dashboard-loading-overlay");
    if (!(Object.keys(dashboardUserData.solo).length || Object.keys(dashboardUserData.multiUser).length)) {
      if (dashboardLoadingOverlay) {
        dashboardLoadingOverlay.style.display = "block";
        removeClass(dashboardLoadingOverlay, "hidden");
      }
      fetchDashboardData(parentSelector);
    } else {
      if (dashboardLoadingOverlay) {
        addClass(dashboardLoadingOverlay, "hidden");
      }
      updateDashboardSection("", parentSelector);
    }
  } else {
    const loginContainerOverlay = $(".result-screen-dashboard .login-container-overlay");
    removeClass(loginContainerOverlay, "hidden");
    const dashboardLoadingOverlay = $(".result-screen-dashboard .dashboard-loading-overlay");
    addClass(dashboardLoadingOverlay, "hidden");
  }
}

async function showAllRoundsResult() {
  var myDraftBtn = $(".result-btns-holder .my-draft-btn");
  if (myDraftBtn) {
    removeClass(myDraftBtn, "selected");
  }

  const dashboardBtn = $(".result-btns-holder .dashboard-btn");
  if (dashboardBtn) {
    removeClass(dashboardBtn, "selected");
  }

  var fullResultBtn = $(".result-btns-holder .full-results-btn");
  if (fullResultBtn) {
    addClass(fullResultBtn, "selected");
  }

  var teamsResultHolder = $(".final-result-container .teams-result-holder");
  if (teamsResultHolder) {
    addClass(teamsResultHolder, "hidden");
  }

  var resultScreenDashboardHolder = $(".final-result-container .result-screen-dashboard");
  if (resultScreenDashboardHolder) {
    addClass(resultScreenDashboardHolder, "hidden");
  }

  var roundsResultHolder = $(".final-result-container .all-rounds-trades-container");
  if (roundsResultHolder) {
    removeClass(roundsResultHolder, "hidden");
  }

  await yieldToMain();

  var allRoundsHolder = $(".all-rounds-trades-container .all-rounds-container");
  if (allRoundsHolder.innerHTML == "") {
    listRoundsSelectors();
    var roundOneSelector = $all(".round-trades-selector")[0];
    if (roundOneSelector) {
      roundOneSelector.click();
    }
  }

  var resultContainer = $(".final-result-container");
  if (resultContainer) {
    resultContainer.dataset.shortname = "full_result";
  }

  const utilityContainer = $(".final-result-container .utility-container");
  if (utilityContainer) {
    const downloadBtn = utilityContainer.querySelector(".download-btn-mds");
    const shareBtn = utilityContainer.querySelector(".share-btn-mds");
    if (shareBtn && downloadBtn) {
      removeClass(shareBtn, "hidden");
      removeClass(downloadBtn, "hidden");
    }

    const gradeToggleFullResult = utilityContainer.querySelector(".grade-toggle");
    if (gradeToggleFullResult) {
      if (isRedraft || multiUserDraft) {
        addClass(gradeToggleFullResult, "hidden");
      } else {
        removeClass(gradeToggleFullResult, "hidden");
      }
    }

    removeClass(utilityContainer, "hidden");
  }
}

function addFeedbackForm() {
  if (!feedbackAdded) {
    setTimeout(() => {
      feedbackAdded = true;
      showMdsFeedback();
    }, 1000);
  }
}

function showSelectedTeamsResult() {
  var myDraftBtn = $(".result-btns-holder .my-draft-btn");
  if (myDraftBtn) {
    addClass(myDraftBtn, "selected");
  }

  const dashboardBtn = $(".result-btns-holder .dashboard-btn");
  if (dashboardBtn) {
    removeClass(dashboardBtn, "selected");
  }

  var fullResultBtn = $(".result-btns-holder .full-results-btn");
  if (fullResultBtn) {
    removeClass(fullResultBtn, "selected");
  }

  var teamsResultHolder = $(".final-result-container .teams-result-holder");
  if (teamsResultHolder) {
    removeClass(teamsResultHolder, "hidden");
  }

  var roundsResultHolder = $(".final-result-container .all-rounds-trades-container");
  if (roundsResultHolder) {
    addClass(roundsResultHolder, "hidden");
  }

  var resultScreenDashboardHolder = $(".final-result-container .result-screen-dashboard");
  if (resultScreenDashboardHolder) {
    addClass(resultScreenDashboardHolder, "hidden");
  }

  var selectedTeam = $(".teams-result-holder .user-selected-teams button.selected");
  if (selectedTeam) {
    var resultContainer = $(".final-result-container");
    if (resultContainer) {
      resultContainer.dataset.shortname = selectedTeam.dataset.shortname;
    }
  }

  const utilityContainer = $(".final-result-container .utility-container");
  if (utilityContainer) {
    const downloadBtn = utilityContainer.querySelector(".download-btn-mds");
    const shareBtn = utilityContainer.querySelector(".share-btn-mds");
    if (shareBtn && downloadBtn) {
      removeClass(shareBtn, "hidden");
      removeClass(downloadBtn, "hidden");
    }

    const gradeToggle = utilityContainer.querySelector(".grade-toggle");
    if (gradeToggle) {
      if (isRedraft) {
        addClass(gradeToggle, "hidden");
      } else {
        removeClass(gradeToggle, "hidden");
      }
    }

    removeClass(utilityContainer, "hidden");
  }
}

function backToRoom() {
  trackGAEventForPage("back_to_room");
  if (!IS_DESKTOP) {
    let bottomControls = $(".room-bottom-controls");
    if (bottomControls) {
      bottomControls.style.width = "100%";
      bottomControls.style.bottom = "0";
      bottomControls.style.left = "unset";
      bottomControls.style.backgroundColor = "#fff";
      bottomControls.style.padding = "12px 24px";
      let draftNowBtn = bottomControls.querySelector(".draft-now-btn-container");
      if (draftNowBtn) {
        addClass(draftNowBtn, "hidden");
      }

      let chatBtn = bottomControls.querySelector(".chat-btn-container");
      if (chatBtn) {
        chatBtn.style.width = "35%";
      }

      let draftBtnContainer = bottomControls.querySelector(".draft-now-btn-container");
      if (draftBtnContainer) {
        removeClass(draftBtnContainer, "hidden");
      }
    }

    let finalResultHolder = $(".final-trades-container");
    if (finalResultHolder) {
      addClass(finalResultHolder, "hidden");
    }

    let roomContainer = $(".multi-user-room-container");
    if (roomContainer) {
      removeClass(roomContainer, "hidden");
      roomContainer.style.width = "unset";

      let room = roomContainer.querySelector(".multi-user-room");
      if (room) {
        removeClass(room, "hidden");
      }
    }

    let finalScreenControls = $(".bottom-controls");
    if (finalScreenControls) {
      addClass(finalScreenControls, "hidden");
    }
  }

  processedImages = {};
  usersLeftInfo = [];
  simFinishedRoomData = "";
  dashboardDraftedPlayers = [];
  tradesCompletedCount = 0;
  tradesData = [];
  offersList = [];
  multiUserSystemOffersList = [];
  multiUserCounterOffersList = [];
  multiUserTradeOffersList = [];
  counteredTeams = [];
  proposedTeamsData = [];
  toBeHandledOffers = {
    rejectedTradeOffers: [],
    rejectedCounterOffers: [],
    revertedOffers: [],
    acceptedOffer: "",
    acceptedOfferType: "",
    selectedPlayer: "",
  };
  currentPickIsMine = false;
  currentMultiUserPick = 0;
  multiUserCurrentOfferTeam = {};
  lastAcceptedOffer = "";
  playerTrades = JSON.parse(JSON.stringify(playerTradesOriginal));

  let multiUserRoom = $(".simulator-content-holder .multi-user-room");
  if (multiUserRoom) {
    removeClass(multiUserRoom, "hidden");
  }

  let finalResultHolder = $(".simulator-content-holder .final-result-container");
  if (finalResultHolder) {
    addClass(finalResultHolder, "hidden");
  }

  let roomContainer = $(".multi-user-room-container");
  if (roomContainer) {
    roomContainer.style.width = "unset";
  }

  let chatContainer = $(".multi-user-chat");
  if (chatContainer) {
    removeClass(chatContainer, "draft-chat-container");
  }

  let draftStartConter = $(".draft-start-counter.main");
  if (draftStartConter) {
    addClass(draftStartConter, "hidden");
  }

  let chatContent = $(".multi-user-chat .multi-user-chat-content");
  if (chatContent) {
    removeClass(chatContent, "hidden");
  }

  let chatInput = $(".multi-user-chat .multi-user-chat-input");
  if (chatInput) {
    removeClass(chatInput, "hidden");
  }

  let upsideDownButton = $('.multi-user-chat-header .upside-down-button');
  if (upsideDownButton) {
    addClass(upsideDownButton, "hidden");

    let downIcon = upsideDownButton.querySelector('img');
    if (downIcon) {
      downIcon.classList.toggle("transform-btn-upsidedown");
    }
  }

  let countDownBannerList = $all(".draft-start-counter");
  if (countDownBannerList.length) {
    countDownBannerList.forEach((banner) => {
      let countDownTimer = banner.querySelector(".countdown-timer");
      if (countDownTimer) {
        countDownTimer.innerHTML = 3;
      }
    })
  }

  enableSimProposeTradeBtn();

  socket.emit("join-room-back", {
    roomId: currentRoomData.roomId,
    userName: currentUserMultiDraftData.userName,
  })
}

function showRSSFeeds(feedsData) {
  const headers = feedsData[0];
  for (let i = 1; i < feedsData.length; i++) {
    const feed = {};
    for (let j = 0; j < headers.length; j++) {
      feed[headers[j]] = feedsData[i][j];
    }
    feedsList.push(feed);
  }

  if (feedsList.length) {
    const feedsContainer = document.createElement("div");
    addClass(feedsContainer, "nfl-feeds-container");

    const headerContainer = document.createElement("div");
    addClass(headerContainer, "header-container");

    const headerBar = document.createElement("div");
    addClass(headerBar, "header-bar");
    headerContainer.appendChild(headerBar);

    const headerText = document.createElement("div");
    addClass(headerText, "header-text");
    headerText.innerHTML = "Latest NFL Draft Analysis";
    headerContainer.appendChild(headerText);
    feedsContainer.appendChild(headerContainer);

    const feedsHolder = document.createElement("div");
    addClass(feedsHolder, "feeds-holder");
    let feedsLength = feedsList.length > 10 ? 10 : feedsList.length;
    for (let i = 0; i < feedsLength; i++) {
      const singleFeed = document.createElement("a");
      singleFeed.setAttribute("href", feedsList[i].Link);
      singleFeed.setAttribute("target", "_blank");

      addClass(singleFeed, "single-feed");
      const image = document.createElement("img");
      image.setAttribute("src", feedsList[i].Image);
      if (IS_DESKTOP) {
        image.setAttribute("width", 100);
        image.setAttribute("height", 80);
      } else {
        image.setAttribute("width", 84);
        image.setAttribute("height", 73);
      }
      singleFeed.appendChild(image);

      const feedData = document.createElement("div");
      addClass(feedData, "feed-data-container");
      singleFeed.appendChild(feedData);

      const feedTitle = document.createElement("div");
      addClass(feedTitle, "feed-title");
      feedTitle.innerHTML = feedsList[i].Title;
      feedData.appendChild(feedTitle);

      const updatedTime = document.createElement("span");
      addClass(updatedTime, "feed-time");
      let fullDate = new Date(feedsList[i].Date.replace("+0000", ""));
      fullDate.setHours(fullDate.getHours() - 4);
      const month = getShortMonthNames()[fullDate.getMonth()];
      const date = fullDate.getDate();
      const year = fullDate.getFullYear();
      let hours = fullDate.getHours();
      let minutes = fullDate.getMinutes();
      if (hours > 12) {
        hours = hours - 12;
        if (minutes > 0) {
          hours = hours + ":" + minutes + " PM";
        } else {
          hours = hours + " PM";
        }
      } else if (hours == 12) {
        if (minutes > 0) {
          hours = hours + ":" + minutes + " PM";
        } else {
          hours = hours + " PM";
        }
      } else if (hours == 0) {
        hours = 12;
        if (minutes > 0) {
          hours = hours + ":" + minutes + " AM";
        } else {
          hours = hours + " AM";
        }
      } else {
        if (minutes > 0) {
          hours = hours + ":" + minutes + " AM";
        } else {
          hours = hours + " AM";
        }
      }
      updatedTime.innerHTML = month + " " + date + ", " + year + " | " + hours + " EDT";
      feedData.appendChild(updatedTime);

      feedsHolder.appendChild(singleFeed);
    }

    feedsContainer.appendChild(feedsHolder);

    if (feedsList.length > 10) {
      const loadMoreBtn = document.createElement("button");
      addClass(loadMoreBtn, "load-more-feeds-btn");
      loadMoreBtn.innerHTML = "View More";
      loadMoreBtn.addEventListener("click", loadMoreFeeds);

      feedsContainer.appendChild(loadMoreBtn);
    }

    const resultContainer = $(".final-result-container");
    if (resultContainer) {
      resultContainer.appendChild(feedsContainer);
    }
  }
}

function loadMoreFeeds() {
  let feedsHolder = $(".nfl-feeds-container .feeds-holder");
  if (feedsHolder) {
    let shownFeeds = feedsHolder.children.length;
    if (shownFeeds < feedsList.length) {
      const lastFeedIndex = feedsList.length >= (shownFeeds + 10) ? (shownFeeds + 10) : (shownFeeds + (feedsList.length - shownFeeds));
      for (let i = shownFeeds; i < lastFeedIndex; i++) {
        const singleFeed = document.createElement("a");
        singleFeed.setAttribute("href", feedsList[i].Link);
        singleFeed.setAttribute("target", "_blank");

        addClass(singleFeed, "single-feed");
        const image = document.createElement("img");
        image.setAttribute("src", feedsList[i].Image);
        if (IS_DESKTOP) {
          image.setAttribute("width", 100);
          image.setAttribute("height", 80);
        } else {
          image.setAttribute("width", 84);
          image.setAttribute("height", 73);
        }
        singleFeed.appendChild(image);

        const feedData = document.createElement("div");
        addClass(feedData, "feed-data-container");
        singleFeed.appendChild(feedData);

        const feedTitle = document.createElement("div");
        addClass(feedTitle, "feed-title");
        feedTitle.innerHTML = feedsList[i].Title;
        feedData.appendChild(feedTitle);

        const updatedTime = document.createElement("span");
        addClass(updatedTime, "feed-time");
        let fullDate = new Date(feedsList[i].Date.replace("+0000", ""));
        fullDate.setHours(fullDate.getHours() - 4);
        const month = getShortMonthNames()[fullDate.getMonth()];
        const date = fullDate.getDate();
        const year = fullDate.getFullYear();
        let hours = fullDate.getHours();
        const minutes = fullDate.getMinutes();
        if (hours > 12) {
          hours = hours - 12;
          if (minutes > 0) {
            hours = hours + ":" + minutes + " PM";
          } else {
            hours = hours + " PM";
          }
        } else if (hours == 12) {
          if (minutes > 0) {
            hours = hours + ":" + minutes + " PM";
          } else {
            hours = hours + " PM";
          }
        } else if (hours == 0) {
          hours = 12;
          if (minutes > 0) {
            hours = hours + ":" + minutes + " AM";
          } else {
            hours = hours + " AM";
          }
        } else {
          if (minutes > 0) {
            hours = hours + ":" + minutes + " AM";
          } else {
            hours = hours + " AM";
          }
        }
        updatedTime.innerHTML = month + " " + date + ", " + year + " | " + hours + " EDT";
        feedData.appendChild(updatedTime);

        feedsHolder.appendChild(singleFeed);
      }

      if (lastFeedIndex === feedsList.length) {
        const loadMoreBtn = $(".nfl-feeds-container .load-more-feeds-btn");
        if (loadMoreBtn) {
          addClass(loadMoreBtn, "hidden");
        }
      }
    }
  }
}

function getRSSFeeds() {
  fetch(feedsUrl)
    .then(res => res.json())
    .then(showRSSFeeds)
    .catch(err => console.log(err));
}

function showFinalResult() {
  gradeAllUngradedPicks();
  computeAllTradeGrades();

  // Hide grade toggle and grades for redraft mode
  if (isRedraft) {
    var gradeToggleBtn = document.getElementById("gradeToggle");
    if (gradeToggleBtn) addClass(gradeToggleBtn, "hidden");
  }

  var finalResultContainer = $(".final-result-container");
  if (finalResultContainer) {
    removeClass(finalResultContainer, "hidden");

    var quickLinksSections = $all("section.quick-links-widget");
    quickLinksSections.forEach(function (quickLinksSection) {
      quickLinksSection.style.display = "block";
    });
  }

  var shareBtn = $(".utility-container .share-btn-mds");
  if (shareBtn && (!navigator || !navigator.share)) {
    addClass(shareBtn, "hidden");
  }

  var simulationContainer = $(".draft-simulation-container");
  if (simulationContainer) {
    addClass(simulationContainer, "hidden");
  }

  if (multiUserDraft) {
    let backToRoomBtn = $(".utility-container .back-to-room-btn");
    if (backToRoomBtn) {
      removeClass(backToRoomBtn, "hidden");
    }

    let restartBtn = $(".utility-container .restart-sim-btn");
    if (restartBtn) {
      addClass(restartBtn, "hidden");
    }
  }

  if (userSelectedTeams.length > 0) {
    var teamsContainer = finalResultContainer.querySelector(".user-teams-holder .user-selected-teams");
    if (teamsContainer) {
      teamsContainer.innerHTML = "";
      let firstChild;
      for (var i = 0; i < teamsList.length; i++) {
        if (userSelectedTeams.includes(teamsList[i].shortName) || (multiUserDraft && currentRoomData.selectedTeams.includes(teamsList[i].shortName))) {
          teamShortName = teamsList[i].shortName;
          var selectionBtn = document.createElement("button");
          selectionBtn.dataset.shortname = teamShortName;
          selectionBtn.setAttribute("onclick", "showTeamSelections(this)");
          var teamLogo = teamsList[teamsList.findIndex((item) => item.shortName === teamShortName)].teamLogo;
          var image = document.createElement("img");
          image.setAttribute("src", STATIC_URL + teamLogoPath + teamLogo + "?w=80&tag=" + imageRefreshTag);
          if (IS_DESKTOP) {
            image.setAttribute("width", 50);
            image.setAttribute("height", 33);
          } else {
            image.setAttribute("width", 30);
            image.setAttribute("height", 22);
          }
          image.setAttribute("alt", teamShortName);
          image.dataset.teamlogo = teamLogo;
          image.setAttribute("crossorigin", "anonymous");
          selectionBtn.appendChild(image);

          if (userSelectedTeams[0] === teamShortName) {
            firstChild = selectionBtn;
          } else {
            teamsContainer.appendChild(selectionBtn);
          }
        }
      }

      teamsContainer.prepend(firstChild);
      if (IS_DESKTOP) {
        showTeamInResultHeader(firstChild);
        addClass(firstChild, "selected");
      } else {
        addClass(firstChild, "selected");
        showTeamNameInResultHeader(firstChild.dataset.shortname);
      }
    }

    showSelectedTeamsResult();
    if (multiUserDraft) {
      let teamName = userSelectedTeams[0];
      let teamsHolder = $(".teams-result-holder .user-selected-teams");
      if (teamsHolder && teamsHolder.children.length) {
        for (let i = 0; i < teamsHolder.children.length; i++) {
          if (teamsHolder.children[i].dataset.shortname === teamName) {
            showTeamSelections(teamsHolder.children[i]);
            break;
          }
        }
      }
    } else {
      var userSelectedTeamsList = $(".teams-result-holder .user-selected-teams");
      var firstTeam = userSelectedTeamsList ? userSelectedTeamsList.children[0] : null;
      if (firstTeam) {
        showTeamSelections(firstTeam);
      }
    }
  } else {
    showAllRoundsResult();
    var myDraftBtn = $(".final-result-header .my-draft-btn");
    if (myDraftBtn) {
      addClass(myDraftBtn, "hidden");
    }
  }

  var featuredToolsContainer = $(".more-pfn-tools-container");
  if (featuredToolsContainer) {
    addClass(featuredToolsContainer, "hidden");
  }

  if (brand && !mdsWidgetDistinction) {
    const feedsContainer = $(".nfl-feeds-container");
    if (!feedsContainer) {
      getRSSFeeds();
    }
  }
}

function showTeamSelections(target) {
  var userSelectedTeamsEl = $(".teams-result-holder .user-selected-teams");
  var allTeams = userSelectedTeamsEl ? userSelectedTeamsEl.children : [];
  for (var team of allTeams) {
    removeClass(team, "selected");
  }

  if (target) {
    addClass(target, "selected");
  }

  var tradesHolder = $(".teams-result-holder .team-selection-body");
  var teamName = "";
  if (target) {
    teamName = target.dataset.shortname;
  }
  if (tradesHolder) {
    tradesHolder.innerHTML = "";
    if (!teamName) {
      teamName = userSelectedTeams[0];
    }

    var resultContainer = $(".final-result-container");
    if (resultContainer) {
      resultContainer.dataset.shortname = teamName;
    }

    var teamInfoHolder = $(".team-selections-header .team-result-logo-container");
    var teamLogo;
    if (teamInfoHolder) {
      teamInfoHolder.innerHTML = "";
      for (var team of teamsList) {
        if (team.shortName === teamName) {
          teamLogo = team.teamLogo;
          break;
        }
      }

      var image = document.createElement("img");
      addClass(image, "result-header-team-logo");
      image.setAttribute("src", STATIC_URL + teamLogoPath + teamLogo + "?w=80&tag=" + imageRefreshTag);
      image.setAttribute("width", 50);
      image.setAttribute("height", 33);
      image.setAttribute("alt", teamName);

      teamInfoHolder.appendChild(image);

      var teamNameHolder = document.createElement("span");
      addClass(teamNameHolder, "result-header-team-name");
      teamNameHolder.innerHTML = teamName;
      teamInfoHolder.appendChild(teamNameHolder);

    }

    var teamSelectionsHeader = $(".team-selections-header");
    if (teamSelectionsHeader) {
      var existingOverallRow = teamSelectionsHeader.parentNode.querySelector(".overall-grade-row");
      if (existingOverallRow) existingOverallRow.remove();
      var overallGrade = calculateOverallTeamGrade(teamName);
      if (overallGrade && overallGrade.grade !== 'N/A') {
        var overallRow = document.createElement("div");
        addClass(overallRow, "overall-grade-row");
        var overallLabel = document.createElement("span");
        addClass(overallLabel, "overall-grade-label");
        overallLabel.textContent = "Overall Draft Grade:";
        overallRow.appendChild(overallLabel);
        var overallGradeText = document.createElement("div");
        addClass(overallGradeText, "header-grade");
        overallGradeText.textContent = overallGrade.grade;
        overallRow.appendChild(overallGradeText);
        teamSelectionsHeader.parentNode.insertBefore(overallRow, teamSelectionsHeader.nextSibling);
      }
    }

    var finalSelection = $all(".rounds-pics-container .pic-container");
    let currentPicksCount;
    if (finalSelection) {
      for (var selection of finalSelection) {
        if (selection.dataset.shortname == teamName) {
          var clone = selection.cloneNode(true);
          let playerInfoBtn = clone.querySelector(".traded-player-name-position-container");
          if (playerInfoBtn) {
            playerInfoBtn.onclick = showPlayerInfo;
          }

          let draftedInfoContainer = clone.querySelector(".drafting-info-container");
          if (draftedInfoContainer && playerInfoBtn) {
            playerInfoBtn.style.maxWidth = "250px";
          }

          var pickNum = parseInt(clone.dataset.number);
          var pickObj = picksList.find(function(p) { return p.number === pickNum; });
          if (pickObj && pickObj.pickGradeData) {
            clone.appendChild(createPickGradeElement(pickObj.pickGradeData.grade));
          }

          tradesHolder.appendChild(clone);
        }
      }

      currentPicksCount = tradesHolder.children ? tradesHolder.children.length : 0;
    }

    var futurePicks = getSelectedFuturePicks(teamName);

    for (var i = 0; i < futurePicks.length; i++) {
      var futureRoundContainer = document.createElement("div");
      addClass(futureRoundContainer, "future-round-pick-container");
      var futureRoundPick = document.createElement("span");
      futureRoundPick.innerHTML = futurePicks[i].futurePickYear + " " + futurePicks[i].futureOriginalTeam + " " +
        futurePicks[i].futureRound;
      addClass(futureRoundPick, "future-round-pick");
      futureRoundContainer.appendChild(futureRoundPick);
      tradesHolder.appendChild(futureRoundContainer);
    }

    // Show traded players acquired by this team
    var allAcquiredPlayers = [];
    for (var t = 0; t < tradesData.length; t++) {
      if (tradesData[t].givingPlayers && tradesData[t].givingPlayers.length && tradesData[t].givingTeamName === teamName) {
        allAcquiredPlayers = allAcquiredPlayers.concat(tradesData[t].givingPlayers);
      }
      if (tradesData[t].gettingPlayers && tradesData[t].gettingPlayers.length && tradesData[t].gettingTeamName === teamName) {
        allAcquiredPlayers = allAcquiredPlayers.concat(tradesData[t].gettingPlayers);
      }
    }
    for (var p = 0; p < allAcquiredPlayers.length; p++) {
      var playerContainer = document.createElement("div");
      addClass(playerContainer, "future-round-pick-container");
      addClass(playerContainer, "traded-players-container");
      if (teamLogo) {
        var logoImg = document.createElement("img");
        logoImg.setAttribute("src", STATIC_URL + teamLogoPath + teamLogo + "?w=80&tag=" + imageRefreshTag);
        logoImg.setAttribute("width", 45);
        logoImg.setAttribute("height", 30);
        addClass(logoImg, "traded-away-team-logo");
        playerContainer.appendChild(logoImg);
      }
      var playerSpan = document.createElement("span");
      playerSpan.innerHTML = formatPlayerName(allAcquiredPlayers[p].playerName, allAcquiredPlayers[p].position);
      addClass(playerSpan, "future-round-pick");
      playerContainer.appendChild(playerSpan);
      tradesHolder.appendChild(playerContainer);
    }

    // Show traded away picks and players below the column layout
    var allTradedAwayPicks = [];
    var allTradedAwayPlayers = [];
    for (var t = 0; t < tradesData.length; t++) {
      if (tradesData[t].givingPicks && tradesData[t].givingPicks.length && tradesData[t].gettingTeamName === teamName) {
        for (var p = 0; p < tradesData[t].givingPicks.length; p++) {
          tradesData[t].givingPicks[p].tradedToLogo = tradesData[t].givingTeamLogo;
        }
        allTradedAwayPicks = allTradedAwayPicks.concat(tradesData[t].givingPicks);
      }
      if (tradesData[t].gettingPicks && tradesData[t].gettingPicks.length && tradesData[t].givingTeamName === teamName) {
        for (var p = 0; p < tradesData[t].gettingPicks.length; p++) {
          tradesData[t].gettingPicks[p].tradedToLogo = tradesData[t].gettingTeamLogo;
        }
        allTradedAwayPicks = allTradedAwayPicks.concat(tradesData[t].gettingPicks);
      }
      if (tradesData[t].givingPlayers && tradesData[t].givingPlayers.length && tradesData[t].gettingTeamName === teamName) {
        for (var p = 0; p < tradesData[t].givingPlayers.length; p++) {
          tradesData[t].givingPlayers[p].tradedToLogo = tradesData[t].givingTeamLogo;
        }
        allTradedAwayPlayers = allTradedAwayPlayers.concat(tradesData[t].givingPlayers);
      }
      if (tradesData[t].gettingPlayers && tradesData[t].gettingPlayers.length && tradesData[t].givingTeamName === teamName) {
        for (var p = 0; p < tradesData[t].gettingPlayers.length; p++) {
          tradesData[t].gettingPlayers[p].tradedToLogo = tradesData[t].gettingTeamLogo;
        }
        allTradedAwayPlayers = allTradedAwayPlayers.concat(tradesData[t].gettingPlayers);
      }
    }
    var tradedAwayContainer = tradesHolder.parentElement.querySelector(".traded-away-container");
    if (tradedAwayContainer) {
      tradedAwayContainer.remove();
    }
    var existingTradeGradesSection = tradesHolder.parentElement.querySelector(".trade-grades-section");
    if (existingTradeGradesSection) {
      existingTradeGradesSection.remove();
    }
    var totalTradedAwayItems = allTradedAwayPicks.length + allTradedAwayPlayers.length;
    if (totalTradedAwayItems) {
      tradedAwayContainer = document.createElement("div");
      addClass(tradedAwayContainer, "traded-away-container");
      var divider = document.createElement("div");
      addClass(divider, "traded-players-divider");
      tradedAwayContainer.appendChild(divider);
      var tradedAwayLabel = document.createElement("div");
      addClass(tradedAwayLabel, "traded-away-label");
      tradedAwayLabel.innerHTML = "Traded Away";
      tradedAwayContainer.appendChild(tradedAwayLabel);
      var playersHolder = document.createElement("div");
      addClass(playersHolder, "traded-away-players-holder");
      for (var p = 0; p < allTradedAwayPicks.length; p++) {
        var pickContainer = document.createElement("div");
        addClass(pickContainer, "future-round-pick-container");
        addClass(pickContainer, "traded-players-container");
        var pickTeamLogo = allTradedAwayPicks[p].tradedToLogo || null;
        if (pickTeamLogo) {
          var logoImg = document.createElement("img");
          logoImg.setAttribute("src", STATIC_URL + teamLogoPath + pickTeamLogo + "?w=80&tag=" + imageRefreshTag);
          logoImg.setAttribute("width", 45);
          logoImg.setAttribute("height", 30);
          addClass(logoImg, "traded-away-team-logo");
          pickContainer.appendChild(logoImg);
        }
        var pickSpan = document.createElement("span");
        if (allTradedAwayPicks[p].number) {
          pickSpan.innerHTML = "Pick " + allTradedAwayPicks[p].number;
        } else {
          pickSpan.innerHTML = allTradedAwayPicks[p].futurePickYear + " " + allTradedAwayPicks[p].futureOriginalTeam + " " + allTradedAwayPicks[p].futureRound;
        }
        addClass(pickSpan, "future-round-pick");
        pickContainer.appendChild(pickSpan);
        playersHolder.appendChild(pickContainer);
      }
      for (var p = 0; p < allTradedAwayPlayers.length; p++) {
        var playerContainer = document.createElement("div");
        addClass(playerContainer, "future-round-pick-container");
        addClass(playerContainer, "traded-players-container");
        var playerTeamLogo = allTradedAwayPlayers[p].tradedToLogo || null;
        if (playerTeamLogo) {
          var logoImg = document.createElement("img");
          logoImg.setAttribute("src", STATIC_URL + teamLogoPath + playerTeamLogo + "?w=80&tag=" + imageRefreshTag);
          logoImg.setAttribute("width", 45);
          logoImg.setAttribute("height", 30);
          addClass(logoImg, "traded-away-team-logo");
          playerContainer.appendChild(logoImg);
        }
        var playerSpan = document.createElement("span");
        playerSpan.innerHTML = formatPlayerName(allTradedAwayPlayers[p].playerName, allTradedAwayPlayers[p].position);
        addClass(playerSpan, "future-round-pick");
        playerContainer.appendChild(playerSpan);
        playersHolder.appendChild(playerContainer);
      }
      addClass(playersHolder, "multi-column");
      var colHeight = Math.ceil(totalTradedAwayItems / 3) * 48;
      playersHolder.style.maxHeight = colHeight + "px";
      tradedAwayContainer.appendChild(playersHolder);

      tradesHolder.parentElement.appendChild(tradedAwayContainer);
    }

    var hasTeamTrades = false;
    if (!isRedraft) {
      for (var tgCheck = 0; tgCheck < tradesData.length; tgCheck++) {
        if (getTradeGradeForTeam(tgCheck, teamName)) { hasTeamTrades = true; break; }
      }
    }
    if (hasTeamTrades) {
      var tradeGradesSection = document.createElement("div");
      addClass(tradeGradesSection, "trade-grades-section");
      var tradeGradesLabel = document.createElement("div");
      addClass(tradeGradesLabel, "trade-grades-label");
      tradeGradesLabel.textContent = "Trade Grades";
      tradeGradesSection.appendChild(tradeGradesLabel);
      for (var tg = 0; tg < tradesData.length; tg++) {
        var tradeGrade = getTradeGradeForTeam(tg, teamName);
        if (tradeGrade) {
          tradeGradesSection.appendChild(buildTradeCard(tradesData[tg], tradeGrade, teamName));
        }
      }
      tradesHolder.parentElement.appendChild(tradeGradesSection);
    }

    let roundPicks = tradesHolder.children;
    let adjustedHeight = 80;
    if (futurePicks.length > currentPicksCount) {
      adjustedHeight = 120;
    }
    let height = 32 + (((48 * roundPicks.length) + adjustedHeight) / 3);

    if (multiUserDraft && !IS_DESKTOP) {
      resultContainer.setAttribute("style", `max-height:2600px !important`);
      let pickContainers = $all(".final-trades-holder .pic-container");
      if (pickContainers.length) {
        pickContainers.forEach(ele => ele.style.width = "100%");
      }
    } else {
      let teamSelectionHolder = resultContainer.querySelector(".team-selection-body");
      if (teamSelectionHolder) {
        teamSelectionHolder.setAttribute("style", `max-height:${height}px !important`);
      }
    }

    if (!tradesHolder.children.length) {
      showAllRoundsResult();
      var myDraftBtn = $(".final-result-header .my-draft-btn");
      var fullResultBtn = $(".final-result-header .full-results-btn");
      if (myDraftBtn && fullResultBtn) {
        addClass(myDraftBtn, "hidden");
        addClass(fullResultBtn, "hidden");
      }
    }
  }
}

function showFinalTrades() {
  gradeAllUngradedPicks();
  computeAllTradeGrades();
  var finalTradesContainer = $(".final-trades-container");
  if (finalTradesContainer && !IS_DESKTOP) {
    if (isGradesToggleActive()) {
      addClass(finalTradesContainer, "single-column-picks");
    } else {
      removeClass(finalTradesContainer, "single-column-picks");
    }
  }
  if (multiUserDraft && !IS_DESKTOP) {
    let restartBtn = $(".bottom-controls .restart-simulation");
    if (restartBtn) {
      addClass(restartBtn, "hidden");
    }

    let backRoomBtn = $(".bottom-controls .back-to-room-btn");
    if (backRoomBtn) {
      removeClass(backRoomBtn, "hidden");
    }
  }

  var shareBtn = $(".share-btn-mds");
  if (shareBtn) {
    if (!navigator || !navigator.share) {
      addClass(shareBtn, "hidden");
    }
  }

  var bottomControls = $(".bottom-controls");
  if (bottomControls) {
    removeClass(bottomControls, "hidden");
  }

  var simulationContainer = $(".draft-simulation-container");
  if (simulationContainer) {
    addClass(simulationContainer, "hidden");
  }

  var finalTradesContainer = $(".final-trades-container");
  if (finalTradesContainer) {
    removeClass(finalTradesContainer, "hidden");

    var quickLinksSections = $all("section.quick-links-widget");
    quickLinksSections.forEach(function (quickLinksSection) {
      quickLinksSection.style.display = "block";
    });
  }

  if (userSelectedTeams.length > 0) {
    var teamsContainer = finalTradesContainer.querySelector(".selected-teams-container");
    if (teamsContainer) {
      teamsContainer.innerHTML = "";
      let firstChild;
      for (var i = 0; i < teamsList.length; i++) {
        if (userSelectedTeams.includes(teamsList[i].shortName) || (multiUserDraft && currentRoomData.selectedTeams.includes(teamsList[i].shortName))) {
          teamShortName = teamsList[i].shortName;
          var selectionBtn = document.createElement("button");
          selectionBtn.dataset.shortname = teamShortName;
          selectionBtn.setAttribute("onclick", "showTeamTrades(this)");
          var teamLogo = teamsList[teamsList.findIndex((item) => item.shortName === teamShortName)].teamLogo;
          var image = document.createElement("img");
          image.setAttribute("src", STATIC_URL + teamLogoPath + teamLogo + "?w=80&tag=" + imageRefreshTag);
          if (IS_DESKTOP) {
            image.setAttribute("width", 50);
            image.setAttribute("height", 35);
          } else {
            image.setAttribute("width", 30);
            image.setAttribute("height", 22);
          }
          image.setAttribute("alt", teamShortName);
          image.dataset.teamlogo = teamLogo;
          image.setAttribute("crossorigin", "anonymous");
          selectionBtn.appendChild(image);

          if (IS_DESKTOP) {
            var span = document.createElement("span");
            span.innerHTML = teamShortName;
            selectionBtn.appendChild(span);
          }

          if (userSelectedTeams[0] === teamShortName) {
            firstChild = selectionBtn;
          } else {
            teamsContainer.appendChild(selectionBtn);
          }
        }
      }

      teamsContainer.prepend(firstChild);

      if (IS_DESKTOP) {
        showTeamInResultHeader(firstChild);
        addClass(firstChild, "selected");
      } else {
        addClass(firstChild, "selected");
        showTeamNameInResultHeader(firstChild.dataset.shortname);

        var existingMobileToggle = teamsContainer.parentNode.querySelector(".grade-toggle");
        if (!existingMobileToggle && brand && !isRedraft) {
          var mobileToggleBtn = document.createElement("button");
          addClass(mobileToggleBtn, "grade-toggle");
          addClass(mobileToggleBtn, "active");
          addClass(mobileToggleBtn, "mobile-grade-toggle");
          mobileToggleBtn.setAttribute("onclick", "toggleGrades()");
          mobileToggleBtn.innerHTML = '<div class="toggle-track"><div class="toggle-knob"></div></div> <span>Grades</span>';
          if (mdsWidgetDistinction) {
            const utilityContainer = teamsContainer.parentNode.querySelector(".tools-btn-utility-container");
            if (utilityContainer) {
              utilityContainer.prepend(mobileToggleBtn);
            }
          } else {
            teamsContainer.parentNode.appendChild(mobileToggleBtn);
          }
        }
      }
    }


    listTeamTrades();
    setMyDraftPicksHeight();
    removeClass($(".draft-picks-text"), "hidden");
  } else {
    showFullResult();
    var myDraftBtn = $(".bottom-controls .my-draft-btn");
    if (myDraftBtn) {
      myDraftBtn.disabled = true;
      myDraftBtn.style.opacity = 0.4;
      myDraftBtn.style.cursor = "not-allowed";
    }
  }

  var featuredToolsContainer = $(".more-pfn-tools-container");
  if (featuredToolsContainer) {
    addClass(featuredToolsContainer, "hidden");
  }

  if (IS_DESKTOP) {
    createRoundsSelector();
  }

  if (brand && !mdsWidgetDistinction) {
    const feedsContainer = $(".nfl-feeds-container");
    if (!feedsContainer) {
      getRSSFeeds();
    }
  }
}

function setMyDraftPicksHeight() {
  if (IS_DESKTOP) return;
  var gradesOn = isGradesToggleActive();
  var resultListContainer = $(".final-trades-container .final-trades-holder");
  if (!resultListContainer) return;
  var upperPicksHolder = resultListContainer.querySelector(".upper-picks-holder");
  if (!upperPicksHolder) return;

  if (gradesOn) {
    upperPicksHolder.removeAttribute("style");
  } else {
    var finalPicks = upperPicksHolder.children;
    if (finalPicks.length > 8) {
      var bufferHeight = 52;
      var height = ((finalPicks.length * 30) + (finalPicks.length * 6)) / 2 + bufferHeight;
      upperPicksHolder.setAttribute("style", "max-height:" + height + "px !important");
    }
  }
}

function createRoundsSelector() {
  let roundsLengthRestriction = 0;
  var roundsHolder = $(".rounds-holder");
  if (roundsHolder) {
    roundsHolder.innerHTML = "";
    var rounds = $all(".rounds-pics-container .rounds-pics-holder .round-number");
    if (rounds && rounds.length > roundsLengthRestriction) {
      removeClass($(".rounds-container"), "hidden");
      for (var round of rounds) {
        var btn = document.createElement("button");
        btn.innerHTML = "R" + round.dataset.round;
        addClass(btn, "round-selector");
        addClass(btn, round.dataset.round);
        btn.setAttribute("onclick", "changeRoundData(this)");
        btn.dataset.round = round.dataset.round;
        roundsHolder.appendChild(btn);
      }

      if (!IS_DESKTOP) {
        const roundsContainer = $(".rounds-utilities-container .rounds-container");
        if (roundsContainer) {
          var existingMobileToggle = roundsContainer.querySelector(".grade-toggle");
          if (!existingMobileToggle && brand && !isRedraft) {
            var mobileToggleBtn = document.createElement("button");
            addClass(mobileToggleBtn, "grade-toggle");
            addClass(mobileToggleBtn, "active");
            addClass(mobileToggleBtn, "mobile-grade-toggle");
            mobileToggleBtn.setAttribute("onclick", "toggleGrades()");
            mobileToggleBtn.innerHTML = '<div class="toggle-track"><div class="toggle-knob"></div></div> <span>Grades</span>';
            // if (mdsWidgetDistinction) {
            //   const utilityContainer = teamsContainer.parentNode.querySelector(".tools-btn-utility-container");
            //   if (utilityContainer) {
            //     utilityContainer.prepend(mobileToggleBtn);
            //   }
            // } else {
            if (isGradesToggleActive()) {
              roundsHolder.style.width = "70%";
              roundsContainer.style.display = "flex";
              roundsContainer.style.gap = "10px";
              roundsContainer.style.justifyContent = "space-between";
              roundsContainer.style.alignItems = "center";
              roundsHolder.style.maxWidth = "70%";
              roundsHolder.style.overflowX = "scroll";
              roundsContainer.appendChild(mobileToggleBtn);
            }
            // }
          }
        }
      }

      if (mdsWidgetDistinction && rounds.length == 1) { // to hide round 1 selector button in case of mds widget and only show download and share buttons
        const roundSelectorBtn = $(".rounds-holder .round-selector");
        if (roundSelectorBtn) {
          addClass(roundSelectorBtn, "hidden");
        }
      }
    }
  }
}

function changeRoundData(target) {
  trackGAEventForPage("rounds_full_results", { "round": target.dataset.round });
  addClass($(".team-container"), "hidden");
  removeClass($(".full-result-header-text-container"), "hidden");
  var resultContainer = $(".final-result-container");
  if (resultContainer) {
    resultContainer.dataset.shortname = "full_result";
    resultContainer.dataset.round = target.dataset.round;
  }

  var roundSelectors = $all(".round-selector");
  if (roundSelectors) {
    for (var selector of roundSelectors) {
      removeClass(selector, "selected");
    }
  }

  addClass(target, "selected");
  addClass($(".draft-picks-text"), "hidden");

  var resultNavButtons = $all(".teams-result-container button");
  if (resultNavButtons) {
    for (var button of resultNavButtons) {
      removeClass(button, "selected");
    }
  }

  var resultBtn = $(".result-btn");
  if (resultBtn) {
    addClass(resultBtn, "selected");
  }

  var roundsPicsHolder2 = $(".rounds-pics-container .rounds-pics-holder");
  var draftResult = roundsPicsHolder2 ? roundsPicsHolder2.children : [];
  var resultContainer = $(".final-trades-container .final-trades-holder");
  if (draftResult && resultContainer) {
    resultContainer.innerHTML = "";
    for (var element of draftResult) {
      if (element.dataset.roundnumber == target.dataset.round) {
        var clone = element.cloneNode(true);
        let playerInfoBtn = clone.querySelector(".traded-player-name-position-container");
        if (playerInfoBtn) {
          playerInfoBtn.onclick = showPlayerInfo;
        }

        let draftedInfoContainer = clone.querySelector(".drafting-info-container");
        if (draftedInfoContainer && !hasClass(draftedInfoContainer, "hidden")) {
          playerInfoBtn.style.maxWidth = "149px";
          playerInfoBtn.style.textOverflow = "ellipsis";
          playerInfoBtn.style.overflow = "hidden";
        }

        if (!multiUserDraft) {
          var mFullPickNum = parseInt(clone.dataset.number);
          var mFullPickObj = picksList.find(function(p) { return p.number === mFullPickNum; });
          if (mFullPickObj && mFullPickObj.pickGradeData) {
            clone.appendChild(createPickGradeElement(mFullPickObj.pickGradeData.grade));
          }
        }

        resultContainer.appendChild(clone);
      }
    }

    let roundPicks = resultContainer.children;
    let height = (16 + (40 * roundPicks.length) + 80) / 2;
    if (multiUserDraft && !IS_DESKTOP) {
      resultContainer.setAttribute("style", `max-height:2600px !important`);
      let pickContainers = $all(".final-trades-holder .pic-container");
      if (pickContainers.length) {
        pickContainers.forEach(ele => ele.style.width = "100%");
      }
    } else if (!IS_DESKTOP && isGradesToggleActive()) {
      resultContainer.removeAttribute("style");
    } else {
      resultContainer.setAttribute("style", `max-height:${height}px !important`);
    }
  }
}

function showTeamInResultHeader(element) {
  var headerTeamHolder = $(".result-header .team-container");
  if (element && headerTeamHolder) {
    var clone = element.cloneNode(true);
    headerTeamHolder.innerHTML = "";
    headerTeamHolder.appendChild(clone);
    var teamContainer = headerTeamHolder.querySelector("button");
    if (teamContainer) {
      teamContainer.style.opacity = "1";
    }
  }
}

function showTeamNameInResultHeader(teamName) {
  var headerTeamHolder = $(".result-header .team-container");
  headerTeamHolder.innerHTML = "";
  var teamImage = $(".selected-teams-container button.selected");
  if (teamImage) {
    var cloneImage = teamImage.cloneNode(true);
    cloneImage.style.opacity = "1";
    headerTeamHolder.appendChild(cloneImage);
  }
  if (teamName && headerTeamHolder) {
    var span = document.createElement("span");
    span.innerHTML = teamName;
    headerTeamHolder.appendChild(span);
  }
}

function listTeamTrades(teamName) {
  addClass($(".rounds-holder"), "hidden");
  var simHeading = $(".simulator-hero");
  if (simHeading) {
    addClass(simHeading, "small");
  }
  var tradesHolder = $(".final-trades-container .final-trades-holder");
  if (tradesHolder) {
    tradesHolder.innerHTML = "";
    if (!IS_DESKTOP) {
      tradesHolder.removeAttribute("style");
    }
    if (!teamName) {
      teamName = userSelectedTeams[0];
    }

    var mobileOverallGrade = calculateOverallTeamGrade(teamName);
    if (mobileOverallGrade && mobileOverallGrade.grade !== 'N/A') {
      var mobileGradeContainer = document.createElement("div");
      addClass(mobileGradeContainer, "overall-grade-row");
      addClass(mobileGradeContainer, "mobile-overall-grade");
      var mobileGradeLabel = document.createElement("span");
      addClass(mobileGradeLabel, "overall-grade-label");
      mobileGradeLabel.textContent = "Overall Draft Grade:";
      mobileGradeContainer.appendChild(mobileGradeLabel);
      var mobileGradeText = document.createElement("div");
      addClass(mobileGradeText, "header-grade");
      mobileGradeText.textContent = mobileOverallGrade.grade;
      mobileGradeContainer.appendChild(mobileGradeText);
      tradesHolder.appendChild(mobileGradeContainer);
    }

    var upperPicksHolder = document.createElement("div");
    addClass(upperPicksHolder, "upper-picks-holder");

    var finalSelection = $all(".rounds-pics-container .pic-container");
    if (finalSelection) {
      for (var selection of finalSelection) {
        if (selection.dataset.shortname == teamName) {
          var clone = selection.cloneNode(true);
          let playerInfoBtn = clone.querySelector(".traded-player-name-position-container");
          if (playerInfoBtn) {
            playerInfoBtn.onclick = showPlayerInfo;
          }

          if (multiUserDraft) {
            let draftingInfo = clone.querySelector(".drafting-info-container");
            if (draftingInfo) {
              addClass(draftingInfo, "hidden");
            }
          }

          var mPickNum = parseInt(clone.dataset.number);
          var mPickObj = picksList.find(function(p) { return p.number === mPickNum; });
          if (mPickObj && mPickObj.pickGradeData) {
            clone.appendChild(createPickGradeElement(mPickObj.pickGradeData.grade));
          }

          upperPicksHolder.appendChild(clone);
        }
      }
    }

    var futurePicks = getSelectedFuturePicks(teamName);

    for (var i = 0; i < futurePicks.length; i++) {
      var futureRoundContainer = document.createElement("div");
      addClass(futureRoundContainer, "future-round-pick-container");
      var futureRoundPick = document.createElement("span");
      futureRoundPick.innerHTML = futurePicks[i].futurePickYear + " " + futurePicks[i].futureOriginalTeam + " " +
        futurePicks[i].futureRound;
      addClass(futureRoundPick, "future-round-pick");
      futureRoundContainer.appendChild(futureRoundPick);
      upperPicksHolder.appendChild(futureRoundContainer);
    }

    // Show traded players acquired by this team
    var mobileTeamLogo;
    for (var i = 0; i < teamsList.length; i++) {
      if (teamsList[i].shortName === teamName) {
        mobileTeamLogo = teamsList[i].teamLogo;
        break;
      }
    }
    var allAcquiredPlayers = [];
    for (var t = 0; t < tradesData.length; t++) {
      if (tradesData[t].givingPlayers && tradesData[t].givingPlayers.length && tradesData[t].givingTeamName === teamName) {
        allAcquiredPlayers = allAcquiredPlayers.concat(tradesData[t].givingPlayers);
      }
      if (tradesData[t].gettingPlayers && tradesData[t].gettingPlayers.length && tradesData[t].gettingTeamName === teamName) {
        allAcquiredPlayers = allAcquiredPlayers.concat(tradesData[t].gettingPlayers);
      }
    }
    for (var p = 0; p < allAcquiredPlayers.length; p++) {
      var playerContainer = document.createElement("div");
      addClass(playerContainer, "future-round-pick-container");
      addClass(playerContainer, "traded-players-container");
      if (mobileTeamLogo) {
        var logoImg = document.createElement("img");
        logoImg.setAttribute("src", STATIC_URL + teamLogoPath + mobileTeamLogo + "?w=80&tag=" + imageRefreshTag);
        logoImg.setAttribute("width", 45);
        logoImg.setAttribute("height", 30);
        addClass(logoImg, "traded-away-team-logo");
        playerContainer.appendChild(logoImg);
      }
      var playerSpan = document.createElement("span");
      playerSpan.innerHTML = formatPlayerName(allAcquiredPlayers[p].playerName, allAcquiredPlayers[p].position);
      addClass(playerSpan, "future-round-pick");
      playerContainer.appendChild(playerSpan);
      upperPicksHolder.appendChild(playerContainer);
    }

    var upperItemCount = upperPicksHolder.children.length;
    if (upperItemCount > 5 && !IS_DESKTOP) {
      addClass(upperPicksHolder, "mobile-multi-column");
      var colHeight = Math.ceil(upperItemCount / 2) * 34;
      upperPicksHolder.style.maxHeight = colHeight + "px";
    }
    tradesHolder.appendChild(upperPicksHolder);

    // Show traded away picks and players below the column layout
    var allTradedAwayPicks = [];
    var allTradedAwayPlayers = [];
    for (var t = 0; t < tradesData.length; t++) {
      if (tradesData[t].givingPicks && tradesData[t].givingPicks.length && tradesData[t].gettingTeamName === teamName) {
        for (var p = 0; p < tradesData[t].givingPicks.length; p++) {
          tradesData[t].givingPicks[p].tradedToLogo = tradesData[t].givingTeamLogo;
        }
        allTradedAwayPicks = allTradedAwayPicks.concat(tradesData[t].givingPicks);
      }
      if (tradesData[t].gettingPicks && tradesData[t].gettingPicks.length && tradesData[t].givingTeamName === teamName) {
        for (var p = 0; p < tradesData[t].gettingPicks.length; p++) {
          tradesData[t].gettingPicks[p].tradedToLogo = tradesData[t].gettingTeamLogo;
        }
        allTradedAwayPicks = allTradedAwayPicks.concat(tradesData[t].gettingPicks);
      }
      if (tradesData[t].givingPlayers && tradesData[t].givingPlayers.length && tradesData[t].gettingTeamName === teamName) {
        for (var p = 0; p < tradesData[t].givingPlayers.length; p++) {
          tradesData[t].givingPlayers[p].tradedToLogo = tradesData[t].givingTeamLogo;
        }
        allTradedAwayPlayers = allTradedAwayPlayers.concat(tradesData[t].givingPlayers);
      }
      if (tradesData[t].gettingPlayers && tradesData[t].gettingPlayers.length && tradesData[t].givingTeamName === teamName) {
        for (var p = 0; p < tradesData[t].gettingPlayers.length; p++) {
          tradesData[t].gettingPlayers[p].tradedToLogo = tradesData[t].gettingTeamLogo;
        }
        allTradedAwayPlayers = allTradedAwayPlayers.concat(tradesData[t].gettingPlayers);
      }
    }
    var tradedAwayContainer = tradesHolder.querySelector(".traded-away-container");
    if (tradedAwayContainer) {
      tradedAwayContainer.remove();
    }
    var existingMobileTradeGrades = tradesHolder.querySelector(".trade-grades-section");
    if (existingMobileTradeGrades) {
      existingMobileTradeGrades.remove();
    }
    if (tradesHolder.parentElement) {
      var existingParentTradeGrades = tradesHolder.parentElement.querySelector(".trade-grades-section");
      if (existingParentTradeGrades) {
        existingParentTradeGrades.remove();
      }
    }
    var totalTradedAwayItems = allTradedAwayPicks.length + allTradedAwayPlayers.length;
    if (totalTradedAwayItems) {
      tradedAwayContainer = document.createElement("div");
      addClass(tradedAwayContainer, "traded-away-container");
      var divider = document.createElement("div");
      addClass(divider, "traded-players-divider");
      tradedAwayContainer.appendChild(divider);
      var tradedAwayLabel = document.createElement("div");
      addClass(tradedAwayLabel, "traded-away-label");
      tradedAwayLabel.innerHTML = "Traded Away";
      tradedAwayContainer.appendChild(tradedAwayLabel);
      var playersHolder = document.createElement("div");
      addClass(playersHolder, "traded-away-players-holder");
      for (var p = 0; p < allTradedAwayPicks.length; p++) {
        var pickContainer = document.createElement("div");
        addClass(pickContainer, "future-round-pick-container");
        addClass(pickContainer, "traded-players-container");
        var pickTeamLogo = allTradedAwayPicks[p].tradedToLogo || null;
        if (pickTeamLogo) {
          var logoImg = document.createElement("img");
          logoImg.setAttribute("src", STATIC_URL + teamLogoPath + pickTeamLogo + "?w=80&tag=" + imageRefreshTag);
          logoImg.setAttribute("width", 45);
          logoImg.setAttribute("height", 30);
          addClass(logoImg, "traded-away-team-logo");
          pickContainer.appendChild(logoImg);
        }
        var pickSpan = document.createElement("span");
        if (allTradedAwayPicks[p].number) {
          pickSpan.innerHTML = "Pick " + allTradedAwayPicks[p].number;
        } else {
          pickSpan.innerHTML = allTradedAwayPicks[p].futurePickYear + " " + allTradedAwayPicks[p].futureOriginalTeam + " " + allTradedAwayPicks[p].futureRound;
        }
        addClass(pickSpan, "future-round-pick");
        pickContainer.appendChild(pickSpan);
        playersHolder.appendChild(pickContainer);
      }
      for (var p = 0; p < allTradedAwayPlayers.length; p++) {
        var playerContainer = document.createElement("div");
        addClass(playerContainer, "future-round-pick-container");
        addClass(playerContainer, "traded-players-container");
        var playerTeamLogo = allTradedAwayPlayers[p].tradedToLogo || null;
        if (playerTeamLogo) {
          var logoImg = document.createElement("img");
          logoImg.setAttribute("src", STATIC_URL + teamLogoPath + playerTeamLogo + "?w=80&tag=" + imageRefreshTag);
          logoImg.setAttribute("width", 45);
          logoImg.setAttribute("height", 30);
          addClass(logoImg, "traded-away-team-logo");
          playerContainer.appendChild(logoImg);
        }
        var playerSpan = document.createElement("span");
        playerSpan.innerHTML = formatPlayerName(allTradedAwayPlayers[p].playerName, allTradedAwayPlayers[p].position);
        addClass(playerSpan, "future-round-pick");
        playerContainer.appendChild(playerSpan);
        playersHolder.appendChild(playerContainer);
      }
      if (totalTradedAwayItems > 5 && !IS_DESKTOP) {
        addClass(playersHolder, "mobile-multi-column");
        var colHeight = Math.ceil(totalTradedAwayItems / 2) * 28;
        playersHolder.style.maxHeight = colHeight + "px";
      } else if (totalTradedAwayItems > 3 && IS_DESKTOP) {
        addClass(playersHolder, "multi-column");
        var colHeight = Math.ceil(totalTradedAwayItems / 3) * 48;
        playersHolder.style.maxHeight = colHeight + "px";
      }
      tradedAwayContainer.appendChild(playersHolder);
      tradesHolder.appendChild(tradedAwayContainer);
    }

    var mobileHasTeamTrades = false;
    if (!isRedraft) {
      for (var tgMobile = 0; tgMobile < tradesData.length; tgMobile++) {
        if (getTradeGradeForTeam(tgMobile, teamName)) { mobileHasTeamTrades = true; break; }
      }
    }
    if (mobileHasTeamTrades) {
      var mobileTradeGradesSection = document.createElement("div");
      addClass(mobileTradeGradesSection, "trade-grades-section");
      var mobileTradeGradesLabel = document.createElement("div");
      addClass(mobileTradeGradesLabel, "trade-grades-label");
      mobileTradeGradesLabel.textContent = "Trade Grades";
      mobileTradeGradesSection.appendChild(mobileTradeGradesLabel);
      for (var tgm = 0; tgm < tradesData.length; tgm++) {
        var mobileTradeGrade = getTradeGradeForTeam(tgm, teamName);
        if (mobileTradeGrade) {
          mobileTradeGradesSection.appendChild(buildTradeCard(tradesData[tgm], mobileTradeGrade, teamName));
        }
      }
      mobileTradeGradesSection.style.flexBasis = "100%";
      tradesHolder.appendChild(mobileTradeGradesSection);
    }

    var resultContainer = $(".final-result-container");
    if (resultContainer) {
      resultContainer.dataset.shortname = teamName;
    }

    let pickContainers = $all(".final-trades-holder .pic-container");
    if (pickContainers.length && IS_DESKTOP) {
      pickContainers.forEach(ele => ele.style.width = "100%");
    }

    if (!tradesHolder.children.length) {
      showFullResult();
      var myDraftBtn = $(".bottom-controls .my-draft-btn");
      if (myDraftBtn) {
        myDraftBtn.disabled = true;
        myDraftBtn.style.opacity = 0.4;
        myDraftBtn.style.cursor = "not-allowed";
      }
    }
  }
}

function getSelectedFuturePicks(teamName) {
  var futurePicks = [];
  for (var i = 0; i < picksList.length; i++) {
    if (picksList[i].futurePick && picksList[i].currentTeam.shortName == teamName && picksList[i].originalTeam
      .shortName !== teamName) {
      futurePicks.push(picksList[i]);
    }
  }

  return futurePicks;
}

function showResultScreenDashboardMobile() {
  trackGAEventForPage("result_screen_dashboard_cta_click");
  const userTeamsResultContainer = $(".rounds-utilities-container");
  if (userTeamsResultContainer) {
    addClass(userTeamsResultContainer, "hidden");
  }

  const fullResultContainer = $(".final-result-container");
  if (fullResultContainer) {
    addClass(fullResultContainer, "hidden");
  }

  const dashboardContainer = $(".result-screen-dashboard");
  if (dashboardContainer) {
    removeClass(dashboardContainer, "hidden");
  }

  const utilityContainer = $(".final-trades-container .tools-btn-utility-container");
  if (utilityContainer) {
    addClass(utilityContainer, "hidden");
  }

  var bottomControlButtons = $all(".bottom-controls button");
  if (bottomControlButtons) {
    for (var button of bottomControlButtons) {
      removeClass(button, "selected");
    }
  }

  var dashboardBtn = $(".bottom-controls .dashboard-btn");
  if (dashboardBtn) {
    addClass(dashboardBtn, "selected");
  }

  if (mdsLoggedInUserId) {
    const parentSelector = ".final-trades-container .result-screen-dashboard";
    const loginContainer = $(".result-screen-dashboard .dashboard-holder .login-container");
    if (loginContainer) {
      addClass(loginContainer, "hidden");
    }

    const loginContainerOverlay = $(".result-screen-dashboard .login-container-overlay");
    addClass(loginContainerOverlay, "hidden");

    const dashboardLoadingOverlay = $(".result-screen-dashboard .dashboard-loading-overlay");
    if (!(Object.keys(dashboardUserData.solo).length || Object.keys(dashboardUserData.multiUser).length)) {
      if (dashboardLoadingOverlay) {
        dashboardLoadingOverlay.style.display = "block";
        removeClass(dashboardLoadingOverlay, "hidden");
      }
      fetchDashboardData(parentSelector);
    } else {
      if (dashboardLoadingOverlay) {
        addClass(dashboardLoadingOverlay, "hidden");
      }
      updateDashboardSection("", parentSelector);
    }
  } else {
    const loginContainerOverlay = $(".result-screen-dashboard .login-container-overlay");
    removeClass(loginContainerOverlay, "hidden");
    const dashboardLoadingOverlay = $(".result-screen-dashboard .dashboard-loading-overlay");
    addClass(dashboardLoadingOverlay, "hidden");
    const resultScreenDashboard = $(".result-screen-dashboard");
    if (resultScreenDashboard) {
      resultScreenDashboard.style.position = "fixed";
    }
  }
}

function showMyDraft() {
  removeClass($(".teams-result-container"), "hidden");
  addClass($(".rounds-holder"), "hidden");
  addClass($(".rounds-container"), "hidden");
  removeClass($(".draft-picks-text"), "hidden");
  removeClass($(".team-container"), "hidden");
  addClass($(".full-result-header-text-container"), "hidden");
  var mobileToggleShow = $(".mobile-grade-toggle");
  if (mobileToggleShow) removeClass(mobileToggleShow, "hidden");
  var roundsSelectorContainer = $(".final-trades-container .rounds-utilities-container");
  if (!roundsSelectorContainer) return;
  if (typeof roundsSelectorContainer != "object") return;
  if (roundsSelectorContainer.classList.contains("hidden")) {
    removeClass(roundsSelectorContainer, "hidden");
  }
  showFinalTrades();

  const fullResultContainer = $(".final-result-container");
  if (fullResultContainer) {
    removeClass(fullResultContainer, "hidden");
  }

  var bottomControlButtons = $all(".bottom-controls button");
  if (bottomControlButtons) {
    for (var button of bottomControlButtons) {
      removeClass(button, "selected");
    }
  }

  var draftBtn = $(".my-draft-btn");
  if (draftBtn) {
    addClass(draftBtn, "selected");
  }

  var roundsContainer = $(".rounds-container");
  if (roundsContainer) {
    addClass(roundsContainer, "hidden");
  }

  const utilityContainer = $(".final-trades-container .tools-btn-utility-container");
  if (utilityContainer) {
    removeClass(utilityContainer, "hidden");
  }

  const dashboardContainer = $(".result-screen-dashboard");
  if (dashboardContainer) {
    addClass(dashboardContainer, "hidden");
  }

  setMyDraftPicksHeight();
}

function showFullResult() {
  trackGAEventForPage("show_full_result");
  var mobileToggle = $(".mobile-grade-toggle");
  if (mobileToggle) {
    if (isRedraft || multiUserDraft) {
      addClass(mobileToggle, "hidden");
    } else {
      removeClass(mobileToggle, "hidden");
    }
  }
  removeClass($(".rounds-holder"), "hidden");

  var resultContainer = $(".final-result-container");
  if (resultContainer) {
    removeClass(resultContainer, "hidden");
    resultContainer.dataset.shortname = "full_result";
    resultContainer.dataset.round = "1";
  }
  removeClass($(".full-result-header-text-container"), "hidden");
  addClass($(".team-container"), "hidden");
  var resultNavButtons = $all(".teams-result-container button");
  if (resultNavButtons) {
    for (var button of resultNavButtons) {
      removeClass(button, "selected");
    }
  }

  var resultBtn = $(".result-btn");
  if (resultBtn) {
    addClass(resultBtn, "selected");
  }

  addClass($(".draft-picks-text"), "hidden");

  var finalSelection = $all(".rounds-pics-container .pic-container");
  var resultContainer = $(".final-trades-container .final-trades-holder");
  if (finalSelection) {
    if (!IS_DESKTOP) {
      removeClass(finalSelection, "hidden");
      addClass($(".teams-result-container"), "hidden");
      removeClass($(".rounds-holder"), "hidden");
      removeClass($(".rounds-container"), "hidden");

      var utilitiesContainer = $(".rounds-container");
      if (utilitiesContainer) {
        removeClass(utilitiesContainer, "hidden");
      }

      var simHeading = $(".simulator-hero");
      if (simHeading) {
        addClass(simHeading, "small");
      }

      var bottomControlButtons = $all(".bottom-controls button");
      if (bottomControlButtons) {
        for (var button of bottomControlButtons) {
          removeClass(button, "selected");
        }
      }

      var resultBtn = $(".full-result-btn");
      if (resultBtn) {
        addClass(resultBtn, "selected");
      }

      const utilityContainer = $(".final-trades-container .tools-btn-utility-container");
      if (utilityContainer) {
        removeClass(utilityContainer, "hidden");
      }

      const dashboardContainer = $(".result-screen-dashboard");
      if (dashboardContainer) {
        addClass(dashboardContainer, "hidden");
      }
    } else {
      resultContainer.setAttribute("style", "max-height:unset !important");

      if (multiUserDraft && !IS_DESKTOP) {
        let pickContainers = $all(".final-trades-holder .pic-container");
        if (pickContainers.length) {
          pickContainers.forEach(ele => ele.style.width = "100%");
        }
      }
    }

    if (resultContainer) {
      resultContainer.innerHTML = "";
      for (var container of finalSelection) {
        if (container.dataset.roundnumber == "1") {
          var clone = container.cloneNode(true);
          let playerInfoBtn = clone.querySelector(".traded-player-name-position-container");
          if (playerInfoBtn) {
            playerInfoBtn.onclick = showPlayerInfo;
          }

          let draftedInfoContainer = clone.querySelector(".drafting-info-container");
          if (draftedInfoContainer && !hasClass(draftedInfoContainer, "hidden")) {
            playerInfoBtn.style.maxWidth = "149px";
            playerInfoBtn.style.textOverflow = "ellipsis";
            playerInfoBtn.style.overflow = "hidden";
          }

          if (!multiUserDraft) {
            var fullR1PickNum = parseInt(clone.dataset.number);
            var fullR1PickObj = picksList.find(function(p) { return p.number === fullR1PickNum; });
            if (fullR1PickObj && fullR1PickObj.pickGradeData) {
              clone.appendChild(createPickGradeElement(fullR1PickObj.pickGradeData.grade));
            }
          }

          resultContainer.appendChild(clone);
        }
      }
    }

    let roundPicks = resultContainer.children;
    let height = (16 + (40 * roundPicks.length) + 80) / 2;
    if (multiUserDraft && !IS_DESKTOP) {
      resultContainer.setAttribute("style", `max-height:2600px !important`);
      let pickContainers = $all(".final-trades-holder .pic-container");
      if (pickContainers.length) {
        pickContainers.forEach(ele => ele.style.width = "100%");
      }
    } else {
      resultContainer.setAttribute("style", `max-height:${height}px !important`);
    }

    if (!IS_DESKTOP && isGradesToggleActive()) {
      resultContainer.removeAttribute("style");
    }
  }

  createRoundsSelector();

  var btnRound1 = $('button[data-round="1"]');
  if (btnRound1) {
    addClass(btnRound1, "selected");
  } else {
    var roundsSelectorContainer = $(".final-trades-container .rounds-utilities-container");
    if (roundsSelectorContainer) {
      addClass(roundsSelectorContainer, "hidden");
    }
  }
}

function showTeamTrades(target) {
  var mobileToggleMyDraft = $(".mobile-grade-toggle");
  if (mobileToggleMyDraft) removeClass(mobileToggleMyDraft, "hidden");
  removeClass($(".draft-picks-text"), "hidden");
  removeClass($(".team-container"), "hidden");
  addClass($(".full-result-header-text-container"), "hidden");
  addClass($(".rounds-holder"), "hidden");
  var resultNavButtons = $all(".teams-result-container button");
  if (resultNavButtons) {
    for (var button of resultNavButtons) {
      removeClass(button, "selected");
    }
  }
  addClass(target, "selected");
  var roundSelectors = $all(".round-selector");
  if (roundSelectors) {
    for (var selector of roundSelectors) {
      removeClass(selector, "selected");
    }
  }

  if (IS_DESKTOP) {
    showTeamInResultHeader(target);
  } else {
    showTeamNameInResultHeader(target.dataset.shortname);
  }
  var teamsContainer = $(".final-trades-container .selected-teams-container");
  if (teamsContainer) {
    var teamsHolder = teamsContainer.children;
    if (teamsHolder.length > 1) {
      for (var team of teamsHolder) {
        team.style.opacity = "0.4";
      }
    }
    target.style.opacity = "1";
    listTeamTrades(target.dataset.shortname);
  }

  setMyDraftPicksHeight();
}

function getCurrentPick() {
  var simPicks = picksList.slice(0, roundends[rounds]);

  var currentPick;
  var index;
  for (var i = 0; i < simPicks.length; i++) {
    if (simPicks[i].onTheClock) {
      currentPick = simPicks[i];
      index = i;
      break;
    }
  }

  return {
    currentPick,
    index
  }
}

function updateTeamNeeds(currentPickNumber) {
  var simPicks = picksList.slice(0, roundends[rounds]);
  var teamNeedsContainer = $(".team-needs-picks-container");
  removeClass(teamNeedsContainer, "hidden");
  var team;
  var nextPicksArray = [];
  if (teamNeedsContainer) {
    for (var i = currentPickNumber - 1; i < simPicks.length; i++) {
      if (!team) {
        if (userSelectedTeams.includes(simPicks[i].currentTeam.shortName)) {
          team = simPicks[i].currentTeam;
        } else if (currentRoomData && currentRoomData.selectedTeams.includes(simPicks[i].currentTeam.shortName)) {
          team = simPicks[i].currentTeam;
        } else {
          continue;
        }
      }

      if (team && simPicks[i].currentTeam.shortName === team.shortName) {
        if (nextPicksArray.length < 4) {
          nextPicksArray.push(simPicks[i].number);
        } else {
          break;
        }
      }
    }

    nextPicksArray.shift();

    if (team) {
      var teamLogo = teamNeedsContainer.querySelector(".team-logo");
      if (teamLogo) {
        teamLogo.src = STATIC_URL + teamLogoPath + team.teamLogo + "?w=80&tag=" + imageRefreshTag;
      } else {
        var image = document.createElement("img");
        addClass(image, "team-logo")
        image.setAttribute("width", "38");
        image.setAttribute("height", "25");
        image.setAttribute("alt", team.shortName);
        image.setAttribute("src", STATIC_URL + teamLogoPath + team.teamLogo + "?w=80&tag=" + imageRefreshTag);
        var teamNeedsStrengthContainer = teamNeedsContainer.querySelector(".team-needs-strengths-container");
        if (teamNeedsStrengthContainer) {
          teamNeedsContainer.insertBefore(image, teamNeedsStrengthContainer);
        }
      }

      var teamNeeds;
      var teamStrengths;
      for (var i = 0; i < teamsList.length; i++) {
        if (teamsList[i].shortName === team.shortName) {
          var needsArray = [
            teamsList[i].teamNeed1,
            teamsList[i].teamNeed2,
            teamsList[i].teamNeed3,
            teamsList[i].teamNeed4,
            teamsList[i].teamNeed5
          ].filter(function (need) { return need; });
          teamNeeds = needsArray.join(", ");
          teamStrengths = [...new Set([...teamNeedsList[i].doNotDraft, ...teamNeedsList[i].penaltyPOS])];
          teamStrengths = teamStrengths.join(", ");
          break;
        }
      }

      var teamNeedsHolder = teamNeedsContainer.querySelector(".team-needs");
      if (teamNeedsHolder) {
        teamNeedsHolder.innerHTML = teamNeeds;
      }

      var teamStrengthsHolder = teamNeedsContainer.querySelector(".team-strengths");
      if (teamStrengthsHolder) {
        teamStrengthsHolder.innerHTML = teamStrengths;
      }

      var nextPicksContainer = teamNeedsContainer.querySelector(".next-picks-container");
      var nextPicksHolder = teamNeedsContainer.querySelector(".next-picks");
      if (nextPicksHolder) {
        var nextPicks = "";
        for (var i = 0; i < nextPicksArray.length; i++) {
          if (i === (nextPicksArray.length - 1)) {
            nextPicks += nextPicksArray[i];
          } else {
            nextPicks += nextPicksArray[i] + ", ";
          }
        }

        if (nextPicks) {
          removeClass(nextPicksContainer, "hidden");
          nextPicksHolder.innerHTML = nextPicks;
        } else {
          addClass(nextPicksContainer, "hidden");
        }
      }
    } else {
      addClass(teamNeedsContainer, "hidden");
    }
  }
}

function updateTeamNeedsForTradedPlayer(team, position) {
  if (team.teamNeed1 === position) {
    team.teamNeed1 = "";
  } else if (team.teamNeed2 === position) {
    team.teamNeed2 = "";
  } else if (team.teamNeed3 === position) {
    team.teamNeed3 = "";
  } else if (team.teamNeed4 === position) {
    team.teamNeed4 = "";
  } else if (team.teamNeed5 === position) {
    team.teamNeed5 = "";
  }

  for (var i = 0; i < teamNeedsList.length; i++) {
    if (teamNeedsList[i].shortName === team.shortName) {
      if (teamNeedsList[i].teamNeed1 === position) {
        teamNeedsList[i].teamNeed1 = "";
      } else if (teamNeedsList[i].teamNeed2 === position) {
        teamNeedsList[i].teamNeed2 = "";
      } else if (teamNeedsList[i].teamNeed3 === position) {
        teamNeedsList[i].teamNeed3 = "";
      } else if (teamNeedsList[i].teamNeed4 === position) {
        teamNeedsList[i].teamNeed4 = "";
      } else if (teamNeedsList[i].teamNeed5 === position) {
        teamNeedsList[i].teamNeed5 = "";
      }
      break;
    }
  }

  var needKey = "need" + position;
  if (team[needKey] !== undefined) {
    if (team[needKey] < 1) {
      team[needKey] = 0;
    } else if (team[needKey] === 1) {
      team[needKey] = 0.1;
    } else {
      team[needKey] = position === "QB" ? 0.5 : 1;
    }
  }
}

function updateNextPick(currentPickNumber) {
  var simPicks = picksList.slice(0, roundends[rounds]);
  var nextPickContainer = $(".next-pick-container");
  if (currentSection === "result") {
    removeClass(nextPickContainer, "hidden");
  }

  var nextPickSet = false;
  if (nextPickContainer) {
    for (var i = currentPickNumber; i < simPicks.length; i++) {
      if (userSelectedTeams.includes(simPicks[i].currentTeam.shortName) || (currentRoomData && currentRoomData.selectedTeams.includes(simPicks[i].currentTeam.shortName))) {
        var teamLogoHolder = nextPickContainer.querySelector(".next-pick-team");
        if (teamLogoHolder) {
          teamLogoHolder.src = STATIC_URL + teamLogoPath + simPicks[i].currentTeam.teamLogo + "?w=80&tag=" + imageRefreshTag;
        } else {
          var image = document.createElement("img");
          addClass(image, "next-pick-team")
          image.setAttribute("width", "38");
          image.setAttribute("height", "25");
          image.setAttribute("alt", simPicks[i].currentTeam.shortName);
          image.setAttribute("src", STATIC_URL + teamLogoPath + simPicks[i].currentTeam.teamLogo + "?w=80&tag=" + imageRefreshTag);
          var imageContainer = nextPickContainer.querySelector(".image-container");
          if (imageContainer) {
            imageContainer.appendChild(image);
          }
        }

        var teamNumberHolder = nextPickContainer.querySelector(".next-pick-number");
        if (teamNumberHolder) {
          teamNumberHolder.innerHTML = simPicks[i].number;
        }

        nextPickSet = true;
        break;
      }
    }

    if (!nextPickSet) {
      addClass(nextPickContainer, "hidden");
    }
  }
}

function checkPicksForUserSelectedTeams(currentIndex) {
  if (!multiUserDraft) {
    for (var i = currentIndex; i < roundends[rounds]; i++) {
      if (userSelectedTeams.includes(picksList[i].currentTeam.shortName)) {
        return;
      }
    }
  } else {
    let picksRemaining = false;
    for (let i = 0; i < userSelectedTeams.length; i++) {
      let userTeam = teamsList.find(team => userSelectedTeams[i] === team.shortName);
      if (userTeam) {
        for (let j = 0; j < userTeam.draftPicks.length; j++) {
          if (!userTeam.draftPicks[j].playerSelection) {
            picksRemaining = true;
          }
        }
      }
    }

    if (picksRemaining) {
      return;
    }
  }

  disableSimProposeTradeBtn();
}

function fillDraftedPlayer(pick) {
  if (!multiUserDraft) {
    draftHistory.push(createDraftSnapshot());
  }
  var selectedPlayer = "";
  for (var i = 0; i < playersList.length; i++) {
    if (playersList[i].name == pick.playerSelection) {
      selectedPlayer = playersList[i];
    }
  }
  pick.playerSelection = selectedPlayer;
  computeAndStorePickGrade(pick);

  pick.currentTeam.draftedPlayers.push(pick.playerSelection);

  pick.playerSelection.draftedBy = pick.currentTeam;

  playersList.splice(playersList.indexOf(pick.playerSelection), 1);
  pick.currentTeam.doNotDraft.push(
    pick.playerSelection.position
  );

  if (pick.currentTeam.teamNeed1 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed1 = "";
  } else if (pick.currentTeam.teamNeed2 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed2 = "";
  } else if (pick.currentTeam.teamNeed3 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed3 = "";
  } else if (pick.currentTeam.teamNeed4 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed4 = "";
  } else if (pick.currentTeam.teamNeed5 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed5 = "";
  }
  if (pick.playerSelection.position === "QB") {
    if (pick.currentTeam.needQB < 1) {
      pick.currentTeam.needQB *= 0;
    } else if (pick.currentTeam.needQB === 1) {
      pick.currentTeam.needQB *= 0.1;
    } else {
      pick.currentTeam.needQB = 0.5;
    }
  } else if (pick.playerSelection.position === "RB") {
    if (pick.currentTeam.needRB < 1) {
      pick.currentTeam.needRB *= 0;
    } else if (pick.currentTeam.needRB === 1) {
      pick.currentTeam.needRB *= 0.1;
    } else {
      pick.currentTeam.needRB = 1;
    }
  } else if (pick.playerSelection.position === "WR") {
    if (pick.currentTeam.needWR < 1) {
      pick.currentTeam.needWR *= 0;
    } else if (pick.currentTeam.needWR === 1) {
      pick.currentTeam.needWR *= 0.1;
    } else {
      pick.currentTeam.needWR = 1;
    }
  } else if (pick.playerSelection.position === "TE") {
    if (pick.currentTeam.needTE < 1) {
      pick.currentTeam.needTE *= 0;
    } else if (pick.currentTeam.needTE === 1) {
      pick.currentTeam.needTE *= 0.1;
    } else {
      pick.currentTeam.needTE = 1;
    }
  } else if (pick.playerSelection.position === "OT") {
    if (pick.currentTeam.needOT < 1) {
      pick.currentTeam.needOT *= 0;
    } else if (pick.currentTeam.needOT === 1) {
      pick.currentTeam.needOT *= 0.1;
    } else {
      pick.currentTeam.needOT = 1;
    }
  } else if (pick.playerSelection.position === "OG") {
    if (pick.currentTeam.needOG < 1) {
      pick.currentTeam.needOG *= 0;
    } else if (pick.currentTeam.needOG === 1) {
      pick.currentTeam.needOG *= 0.1;
    } else {
      pick.currentTeam.needOG = 1;
    }
  } else if (pick.playerSelection.position === "OC") {
    if (pick.currentTeam.needOC < 1) {
      pick.currentTeam.needOC *= 0;
    } else if (pick.currentTeam.needOC === 1) {
      pick.currentTeam.needOC *= 0.1;
    } else {
      pick.currentTeam.needOC = 1;
    }
  } else if (pick.playerSelection.position === "EDGE") {
    if (pick.currentTeam.needEDGE < 1) {
      pick.currentTeam.needEDGE *= 0;
    } else if (pick.currentTeam.needEDGE === 1) {
      pick.currentTeam.needEDGE *= 0.1;
    } else {
      pick.currentTeam.needEDGE = 1;
    }
  } else if (pick.playerSelection.position === "LB") {
    if (pick.currentTeam.needLB < 1) {
      pick.currentTeam.needLB *= 0;
    } else if (pick.currentTeam.needLB === 1) {
      pick.currentTeam.needLB *= 0.1;
    } else {
      pick.currentTeam.needLB = 1;
    }
  } else if (pick.playerSelection.position === "CB") {
    if (pick.currentTeam.needCB < 1) {
      pick.currentTeam.needCB *= 0;
    } else if (pick.currentTeam.needCB === 1) {
      pick.currentTeam.needCB *= 0.1;
    } else {
      pick.currentTeam.needCB = 1;
    }
  } else if (pick.playerSelection.position === "S") {
    if (pick.currentTeam.needS < 1) {
      pick.currentTeam.needS *= 0;
    } else if (pick.currentTeam.needS === 1) {
      pick.currentTeam.needS *= 0.1;
    } else {
      pick.currentTeam.needS = 1;
    }
  }

  var pickContainer = $(".pick-number-" + pick.number);
  if (pick && pickContainer) {
    var playersContainer = $(".players-holder .players-list");
    var playerHolders;
    if (playersContainer) {
      playerHolders = playersContainer.children;
    }

    var playerContainer;
    for (var j = 0; j < playerHolders.length; j++) {
      if (pick.playerSelection && (playerHolders[j].dataset.name == pick.playerSelection.name)) {
        playerContainer = playerHolders[j];
        break;
      }
    }

    if (pickContainer && playerContainer) {
      fillSelectedPlayerInPick(pickContainer, playerContainer, pick.playerSelection);
    }

    if (widgetData && widgetData.selectedTradesData && widgetData.selectedTradesData.length) {
      let enableTradeButton = false;
      let tradeIndex;
      widgetData.selectedTradesData.forEach(trade => {
        trade.gettingPicks.forEach(gettingPick => {
          if (gettingPick.number === pick.number) {
            enableTradeButton = true;
            tradeIndex = trade.tradeNumber;
          } 
        });
        trade.givingPicks.forEach(givingPick => {
          if (givingPick.number === pick.number) {
            enableTradeButton = true;
            tradeIndex = trade.tradeNumber;
          } 
        });
      });

      if (enableTradeButton) {
        const tradeInfoBtn = pickContainer.querySelector(".pick-trade-info-btn");
        if (tradeInfoBtn) {
          tradeInfoBtn.dataset.tradeindex = tradeIndex;
          removeClass(tradeInfoBtn, "hidden");
        }
      }
    } 
  }
}

function showWidgetContinuePopup() {
  var existingWidgetPopup = document.querySelector("body > .widget-continue-pfsn-container");
  if (existingWidgetPopup) {
    existingWidgetPopup.remove();
  }

  var template = document.getElementById("widget-continue-pfsn");
  if (!template) return;
  var clone = template.content.cloneNode(true);
  var popup = clone.querySelector(".widget-continue-pfsn-container");

  var overlay = $(".overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  } else {
    overlay = document.createElement("div");
    addClass(overlay, "overlay");
    document.body.appendChild(overlay);
  }

  var closeBtn = popup.querySelector(".close-btn");
  closeBtn.onclick = function() {
    closeWidgetContinuePopup();
  };

  overlay.onclick = function() {
    closeWidgetContinuePopup();
  };

  var noBtn = popup.querySelector(".no-btn");
  noBtn.onclick = function() {
    closeWidgetContinuePopup();
  };

  var continueBtn = popup.querySelector(".yes-btn");
  continueBtn.addEventListener("click", function() {
    let selectedProvider;
    const rankingsProviderSelector = $(".players-list-selection-container #players-lists");
    if (rankingsProviderSelector) {
      selectedProvider = rankingsProviderSelector.value;
    }

    var roundsDropdown = $('#rounds-dropdown');
    var roundsChecked = $('input[name="rounds"]:checked');
    const selectedContinueRounds = mdsWidgetDistinction ? (roundsDropdown ? roundsDropdown.value : "") : (roundsChecked ? roundsChecked.value : "");

    picksList.forEach(pick => {
      pick.currentTeam = pick.currentTeam.shortName;
      pick.originalTeam = pick.originalTeam.shortName;
      if (pick.playerSelection) {
        pick.playerSelection = pick.playerSelection.name;
      }
      pick.tradeProposals = [];
      pick.onTheClock = false;
    });

    picksList[0].onTheClock = true;

    teamsList.forEach(team => {
      team.draftPicks.forEach(pick => {
        if (pick.currentTeam && typeof pick.currentTeam === 'object') {
          pick.currentTeam = pick.currentTeam.shortName;
        }
        if (pick.originalTeam && typeof pick.originalTeam === 'object') {
          pick.originalTeam = pick.originalTeam.shortName;
        }
        if (pick.playerSelection && typeof pick.playerSelection === 'object') {
          pick.playerSelection = pick.playerSelection.name;
        }
      });

      team.draftedPlayers.forEach(player => {
        if (player.draftedBy && typeof player.draftedBy === 'object') {
          player.draftedBy = player.draftedBy.shortName;
        }
      });
    });

     // Convert tradesData pick references to avoid circular refs
    tradesData.forEach(function(trade) {
      var pickArrays = [trade.givingPicks, trade.gettingPicks];
      pickArrays.forEach(function(picks) {
        if (picks && picks.length) {
          picks.forEach(function(pick) {
            if (pick.currentTeam && typeof pick.currentTeam === 'object') {
              pick.currentTeam = pick.currentTeam.shortName;
            }
            if (pick.originalTeam && typeof pick.originalTeam === 'object') {
              pick.originalTeam = pick.originalTeam.shortName;
            }
            if (pick.playerSelection && typeof pick.playerSelection === 'object') {
              pick.playerSelection = pick.playerSelection.name;
            }
          });
        }
      });
    });

    widgetData = {
      selectedRounds: rounds,
      continueRounds: Number(selectedContinueRounds),
      selectedExecutionRate: Number(executionRate),
      selectedUserTeams: userSelectedTeams,
      selectedTradesData: tradesData,
      selectedPickStart: roundends[rounds],
      selectedPicksList: picksList,
      selectedTeamsList: teamsList,
      selectedTeamNeedsList: teamNeedsList,
      selectedPlayerTrades: playerTrades,
      selectedProvider,
    }

    var widgetDataStr = JSON.stringify(widgetData);
    localStorage.setItem("pfsnWidgetData", widgetDataStr);
    reassignWidgetData();
    var pfsnUrl = widgetTrackingURL;
    var newTab = window.open(pfsnUrl, "_blank");
    // For cross-origin iframe scenarios, post data to the new tab via postMessage
    if (newTab) {
      var pfsnOrigin = new URL(pfsnUrl).origin;
      var postAttempts = 0;
      var postInterval = setInterval(function() {
        try {
          newTab.postMessage({ type: "pfsnWidgetData", data: widgetDataStr }, pfsnOrigin);
        } catch(e) {}
        postAttempts++;
        if (postAttempts > 20) {
          clearInterval(postInterval);
          window.removeEventListener("message", handleWidgetAck);
        }
      }, 500);
      function handleWidgetAck(event) {
        if (event.data && event.data.type === "pfsnWidgetDataAck") {
          clearInterval(postInterval);
          window.removeEventListener("message", handleWidgetAck);
        }
      }
      window.addEventListener("message", handleWidgetAck);
    }
    closeWidgetContinuePopup();
  });

  addClass(popup, "popup");
  document.body.appendChild(popup);
}

function closeWidgetContinuePopup() {
  var popup = document.querySelector("body > .widget-continue-pfsn-container");
  if (popup) {
    popup.remove();
  }
  var overlay = $(".overlay");
  if (overlay) {
    addClass(overlay, "hidden");
  }

  fillPlayerForAPick(true);
}

function fillPlayerForAPick(skipWidgetCheck) {
  if (!pauseDraftFlag) {
    var pickData = getCurrentPick();
    var currentPick = pickData.currentPick;

    if (mdsWidgetDistinction && !currentPick && !skipWidgetCheck) {
      var roundsDropdownEl = $('#rounds-dropdown');
      var roundsCheckedEl = $('input[name="rounds"]:checked');
      const roundsInputValue = mdsWidgetDistinction ? (roundsDropdownEl ? roundsDropdownEl.value : "") : (roundsCheckedEl ? roundsCheckedEl.value : "");
      if (Number(roundsInputValue) > 2) {
        showWidgetContinuePopup();
        return;
      }
    }

    if (skipWidgetCheck) {
      currentPick = "";
    }

    if (!currentPick) {
      disableResumeDraftBtn();
      disableShowOffersBtn();
      hideUserSelectionIcon();
      if (!IS_DESKTOP) {
        const footerNav = $(".pfn-content-wrapper .pfn-footer");
        if (footerNav) {
          removeClass(footerNav, "hidden");
        }
        showFinalTrades();
      } else {
        showFinalResult();
      }
      window.scrollTo(0, 0);
      if (mdsUserIsLoggedIn && mdsLoggedInUserId && !multiUserDraft) {
        stopCollectiongDashboardTimeSpentData();
        for (var pe = 0; pe < pendingDashboardEvents.length; pe++) {
          sendUserDashboardData(pendingDashboardEvents[pe]);
        }
        pendingDashboardEvents.length = 0;
        let dashboardEventData = {
          userId: mdsLoggedInUserId,
          draftType: getDraftType(),
          properties: [
            {
              propertyName: "totalRounds",
              propertyValue: rounds,
            },
            {
              propertyName: "mostPlayersDraftedInSingleDraft",
              propertyValue: checkMostDraftedPlayersCountInSingleDraft(),
            },
            {
              propertyName: "mostTradesInSingleDraft",
              propertyValue: checkMostTradesInSingleDraft(),
            },
            {
              propertyName: "biggestReach",
              propertyValue: 1
            },
            {
              propertyName: "biggestSteal",
              propertyValue: 1,
            },
            {
              propertyName: "draftsFinishedCount",
              propertyValue: 1,
            },
          ],
          biggestReach: getBiggestReach(),
          biggestSteal: getBiggestSteal(),
        }
        sendUserDashboardData(dashboardEventData);
      }
      return;
    }

    var tradeProposalBtn = $(".simulation-management-buttons-container .user-proposal");
    if (tradeProposalBtn && !tradeProposalBtn.disabled) {
      checkPicksForUserSelectedTeams(currentPick.number - 1, tradeProposalBtn);
    }

    updateNextPick(currentPick.number);
    updateTeamNeeds(currentPick.number);

    var nextUp = picksList[currentPick.number];

    if (widgetData && currentPick.number > widgetData.selectedPickStart) {
      executionRate = Number(widgetData.selectedExecutionRate);
      var overlay = $(".loading-overlay");
      if (overlay) {
        overlay.remove();
      }
    }
    var pickContainer = $(".pick-number-" + currentPick.number);
    if (pickContainer) {
      if (currentPick.number <= pickstart) {
        currentPick.currentTeam.targetPlayer = "";
        fillDraftedPlayer(currentPick);
      } else if (userSelectedTeams.includes(pickContainer.dataset.shortname) && !pickContainer.classList.contains(
        "currentPick")) {
        pickContainer.classList.add("currentPick");
        unhideUserSelectionIcon();

        var pickNumber = parseInt(pickContainer.dataset.number);

        if (!currentPick.tradeUpPick) {
          if (pickNumber === 1) {
            var tradeProbability = Math.floor(Math.random() * 100);
            if (tradeProbability <= 90) {
              calculateTrades(pickContainer);
            } else {
              hideResumeDraftBtn();
              showPauseDraftBtn();
              if (!multiUserDraft) {
                disablePauseDraftBtn();
              }
              toggleSimView("pool", true);
            }
          } else {
            calculateTrades(pickContainer);
          }
        } else {
          hideResumeDraftBtn();
          showPauseDraftBtn();
          if (!multiUserDraft) {
            disablePauseDraftBtn();
          }
          toggleSimView("pool", true);
        }
        updateRevertPickBtn();
        return;
      } else {
        if (!multiUserDraft) {
          draftHistory.push(createDraftSnapshot());
        }
        var trades;
        picksList.forEach(function (pick) {
          if (!pick.tradeUpPick) {
            pick.currentTeam.targetPlayer = "";
          }
        });

        if (!currentPick.tradeUpPick) {
          if (currentPick.number === 1 || currentPick.number === 2) {
            trades = fetchPossibleTrades(tradeinittoppick[0], tradeinittoppick[1], tradeinittoppick[2]);
          } else if (currentPick.number <= roundends[0]) {
            trades = fetchPossibleTrades(tradeinittopten[0], tradeinittopten[1], tradeinittopten[2]);
          } else if (currentPick.number <= roundends[1]) {
            trades = fetchPossibleTrades(tradeinitfirst[0], tradeinitfirst[1], tradeinitfirst[2]);
          } else {
            trades = fetchPossibleTrades(tradeinitallelse[0], tradeinitallelse[1], tradeinitallelse[2]);
          }
        }

        if (trades) {
          var tradeIndex = tradesData.length;
          updateTradedPicks(trades.tradeUpPicks, tradeIndex);
          updateTradedPicks(trades.tradeBackPicks, tradeIndex);
          setTradesData(trades.tradeUpPicks, trades.tradeBackPicks);

          if (currentPick.tradeUpPick && currentPick.currentTeam.targetPlayer) {
            currentPick.playerSelection = currentPick.currentTeam.targetPlayer;
            computeAndStorePickGrade(currentPick);
            currentPick.currentTeam.draftedPlayers.push(currentPick.currentTeam.targetPlayer);
            currentPick.currentTeam.targetPlayer.draftedBy = currentPick.currentTeam;
            currentPick.currentTeam.doNotDraft.push(
              currentPick.currentTeam.targetPlayer.position
            );
            if (currentPick.currentTeam.teamNeed1 === currentPick.currentTeam.targetPlayer.position) {
              currentPick.currentTeam.teamNeed1 = "";
            } else if (currentPick.currentTeam.teamNeed2 === currentPick.currentTeam.targetPlayer.position) {
              currentPick.currentTeam.teamNeed2 = "";
            } else if (currentPick.currentTeam.teamNeed3 === currentPick.currentTeam.targetPlayer.position) {
              currentPick.currentTeam.teamNeed3 = "";
            } else if (currentPick.currentTeam.teamNeed4 === currentPick.currentTeam.targetPlayer.position) {
              currentPick.currentTeam.teamNeed4 = "";
            } else if (currentPick.currentTeam.teamNeed5 === currentPick.currentTeam.targetPlayer.position) {
              currentPick.currentTeam.teamNeed5 = "";
            }
            if (currentPick.currentTeam.targetPlayer.position === "QB") {
              if (currentPick.currentTeam.needQB < 1) {
                currentPick.currentTeam.needQB *= 0;
              } else if (currentPick.currentTeam.needQB === 1) {
                currentPick.currentTeam.needQB *= 0.1;
              } else {
                currentPick.currentTeam.needQB = 0.5;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "RB") {
              if (currentPick.currentTeam.needRB < 1) {
                currentPick.currentTeam.needRB *= 0;
              } else if (currentPick.currentTeam.needRB === 1) {
                currentPick.currentTeam.needRB *= 0.1;
              } else {
                currentPick.currentTeam.needRB = 1;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "WR") {
              if (currentPick.currentTeam.needWR < 1) {
                currentPick.currentTeam.needWR *= 0;
              } else if (currentPick.currentTeam.needWR === 1) {
                currentPick.currentTeam.needWR *= 0.1;
              } else {
                currentPick.currentTeam.needWR = 1;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "TE") {
              if (currentPick.currentTeam.needTE < 1) {
                currentPick.currentTeam.needTE *= 0;
              } else if (currentPick.currentTeam.needTE === 1) {
                currentPick.currentTeam.needTE *= 0.1;
              } else {
                currentPick.currentTeam.needTE = 1;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "OT") {
              if (currentPick.currentTeam.needOT < 1) {
                currentPick.currentTeam.needOT *= 0;
              } else if (currentPick.currentTeam.needOT === 1) {
                currentPick.currentTeam.needOT *= 0.1;
              } else {
                currentPick.currentTeam.needOT = 1;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "OG") {
              if (currentPick.currentTeam.needOG < 1) {
                currentPick.currentTeam.needOG *= 0;
              } else if (currentPick.currentTeam.needOG === 1) {
                currentPick.currentTeam.needOG *= 0.1;
              } else {
                currentPick.currentTeam.needOG = 1;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "OC") {
              if (currentPick.currentTeam.needOC < 1) {
                currentPick.currentTeam.needOC *= 0;
              } else if (currentPick.currentTeam.needOC === 1) {
                currentPick.currentTeam.needOC *= 0.1;
              } else {
                currentPick.currentTeam.needOC = 1;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "EDGE") {
              if (currentPick.currentTeam.needEDGE < 1) {
                currentPick.currentTeam.needEDGE *= 0;
              } else if (currentPick.currentTeam.needEDGE === 1) {
                currentPick.currentTeam.needEDGE *= 0.1;
              } else {
                currentPick.currentTeam.needEDGE = 1;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "LB") {
              if (currentPick.currentTeam.needLB < 1) {
                currentPick.currentTeam.needLB *= 0;
              } else if (currentPick.currentTeam.needLB === 1) {
                currentPick.currentTeam.needLB *= 0.1;
              } else {
                currentPick.currentTeam.needLB = 1;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "CB") {
              if (currentPick.currentTeam.needCB < 1) {
                currentPick.currentTeam.needCB *= 0;
              } else if (currentPick.currentTeam.needCB === 1) {
                currentPick.currentTeam.needCB *= 0.1;
              } else {
                currentPick.currentTeam.needCB = 1;
              }
            } else if (currentPick.currentTeam.targetPlayer.position === "S") {
              if (currentPick.currentTeam.needS < 1) {
                currentPick.currentTeam.needS *= 0;
              } else if (currentPick.currentTeam.needS === 1) {
                currentPick.currentTeam.needS *= 0.1;
              } else {
                currentPick.currentTeam.needS = 1;
              }
            }
          }

          for (var j = 0; j < playersList.length; j++) {
            if (playersList[j].name === currentPick.playerSelection.name) {
              playersList.splice(j, 1);
            }
          }

          var pickContainer = $(".pick-number-" + currentPick.number);
          if (currentPick) {
            var playersContainer = $(".players-holder .players-list");
            var playerHolders;
            if (playersContainer) {
              playerHolders = playersContainer.children;
            }

            var playerContainer;
            for (var i = 0; i < playerHolders.length; i++) {
              if (playerHolders[i].dataset.name == trades.tradeUpPicks[0].currentTeam.targetPlayer.name) {
                playerContainer = playerHolders[i];
                break;
              }
            }

            if (pickContainer && playerContainer) {
              fillSelectedPlayerInPick(pickContainer, playerContainer, currentPick.currentTeam.targetPlayer);
            }

            updateSingleTeamNeedsContainer(currentPick.currentTeam.shortName);
          }

        } else {
          var playersData;
          var pickSlice = 1;
          if (currentPick.number <= roundends[0]) {
            pickSlice = poolslice[0];
          } else if (currentPick.number <= roundends[1]) {
            pickSlice = poolslice[1];
          } else if (currentPick.number <= roundends[3]) {
            pickSlice = poolslice[2];
          } else {
            pickSlice = poolslice[3];
          }
          if (currentPick.number >= roundends[3]) {
            const teamDraftedPositionsCount = {};
            currentPick.currentTeam.draftedPlayers.forEach(player => {
              if (teamDraftedPositionsCount.hasOwnProperty(player.position)) {
                teamDraftedPositionsCount[player.position]++;
              } else {
                teamDraftedPositionsCount[player.position] = 1;
              }
            })
            const maxCountReachedPositions = [];
            for (const [draftedKey, draftedValue] of Object.entries(teamDraftedPositionsCount)) {
              for (const [maxKey, maxValue] of Object.entries(currentPick.currentTeam.maxPositionAllowedCount)) {
                if (draftedKey === maxKey && draftedValue === maxValue) {
                  maxCountReachedPositions.push(draftedKey);
                }
              }
            }
            playersData =
              currentPick.number > roundends[3] ?
                playersList.slice(0, pickSlice) :
                playersList.filter(
                  function (player) {
                    return !maxCountReachedPositions.includes(player.position);
                  }).slice(0, pickSlice);
          } else {
            playersData = playersList.filter(
              function (player) {
                return !currentPick.currentTeam.doNotDraft.includes(player.position);
              }).slice(0, pickSlice);
          }
          playersData.forEach(function (player, i) {
            if (currentPick.number <= roundends[0]) {
              player.score = highpickvalues[i];
            } else if (currentPick.number <= roundends[1]) {
              player.score = midpickvalues[i];
            } else {
              player.score = lowpickvalues[i];
            }
            if (player.pickModifier !== "" && currentPick.number >= player.pickFloor) {
              player.score *= player.pickModifier;
            }
            if (player.position === "QB") {
              player.score *= currentPick.currentTeam.needQB;
            } else if (player.position === "S") {
              player.score *= currentPick.currentTeam.needS;
            } else if (player.position === "RB") {
              player.score *= currentPick.currentTeam.needRB;
            } else if (player.position === "EDGE") {
              player.score *= currentPick.currentTeam.needEDGE;
            } else if (player.position === "WR") {
              player.score *= currentPick.currentTeam.needWR;
            } else if (player.position === "TE") {
              player.score *= currentPick.currentTeam.needTE;
            } else if (player.position === "OG") {
              player.score *= currentPick.currentTeam.needOG;
            } else if (player.position === "OC") {
              player.score *= currentPick.currentTeam.needOC;
            } else if (player.position === "OT") {
              player.score *= currentPick.currentTeam.needOT;
            } else if (player.position === "LB") {
              player.score *= currentPick.currentTeam.needLB;
            } else if (player.position === "CB") {
              player.score *= currentPick.currentTeam.needCB;
            }


            if (player.pickModifier !== "" && ((currentPick.number >= player.pickCap && player.pickModifier >=
              1) || (currentPick.number < player.pickCap && player.pickModifier < 1))) {
              player.score *= player.pickModifier;
            }

            if (player.position === "QB" && currentPick.currentTeam.qbCount === 2) {
              player.score *= 0;
            }
          });

          processCurrentPick(currentPick, playersData);
        }

      }
    }

    currentPick.onTheClock = false;
    nextUp.onTheClock = true;

    setTimeout(() => {
      fillPlayerForAPick();
    }, executionRate);
  }
}

function processCurrentPick(pick, playersCollection) {
  var totalScore = 0;

  for (var player of playersCollection) {
    totalScore += player.score;
  }

  var randomVal = Math.floor(Math.random() * Math.floor(totalScore));

  playersCollection.sort(function (x, y) {
    if (x.score < y.score) {
      return 1;
    } else {
      return -1;
    }
  });

  for (var i = 0; i < playersCollection.length; i++) {
    if (randomVal <= playersCollection.slice(0, i + 1).reduce(function (val, singlePlayer) {
      return val + singlePlayer.score;
    }, 0)) {
      pick.playerSelection = playersCollection[i];
      computeAndStorePickGrade(pick);

      var pickContainer = $(".pick-number-" + pick.number);
      if (pick && pickContainer) {
        var playersContainer = $(".players-holder .players-list");
        var playerHolders;
        if (playersContainer) {
          playerHolders = playersContainer.children;
        }

        var playerContainer;
        for (var j = 0; j < playerHolders.length; j++) {
          if (playerHolders[j].dataset.name == playersCollection[i].name) {
            playerContainer = playerHolders[j];
            break;
          }
        }

        if (pickContainer && playerContainer) {
          fillSelectedPlayerInPick(pickContainer, playerContainer, playersCollection[i]);
        }
      }

      pick.currentTeam.draftedPlayers.push(playersCollection[i]);

      playersCollection[i].draftedBy = pick.currentTeam;

      for (var j = 0; j < playersList.length; j++) {
        if (playersList[j].name === playersCollection[i].name) {
          playersList.splice(j, 1);
        }
      }

      if (!pick.currentTeam.doNotDraft.includes(playersCollection[i].position)) {
        pick.currentTeam.doNotDraft.push(playersCollection[i].position);
      }

      if (pick.currentTeam.teamNeed1 === playersCollection[i].position) {
        pick.currentTeam.teamNeed1 = "";
      } else if (pick.currentTeam.teamNeed2 === playersCollection[i].position) {
        pick.currentTeam.teamNeed2 = "";
      } else if (pick.currentTeam.teamNeed3 === playersCollection[i].position) {
        pick.currentTeam.teamNeed3 = "";
      } else if (pick.currentTeam.teamNeed4 === playersCollection[i].position) {
        pick.currentTeam.teamNeed4 = "";
      } else if (pick.currentTeam.teamNeed5 === playersCollection[i].position) {
        pick.currentTeam.teamNeed5 = "";
      }
      if (playersCollection[i].position === "QB") {
        if (pick.currentTeam.needQB < 1) {
          pick.currentTeam.needQB *= 0;
        } else if (pick.currentTeam.needQB === 1) {
          pick.currentTeam.needQB *= 0.1;
        } else {
          pick.currentTeam.needQB = 0.5;
        }
      } else if (playersCollection[i].position === "RB") {
        if (pick.currentTeam.needRB < 1) {
          pick.currentTeam.needRB *= 0;
        } else if (pick.currentTeam.needRB === 1) {
          pick.currentTeam.needRB *= 0.1;
        } else {
          pick.currentTeam.needRB = 1;
        }
      } else if (playersCollection[i].position === "WR") {
        if (pick.currentTeam.needWR < 1) {
          pick.currentTeam.needWR *= 0;
        } else if (pick.currentTeam.needWR === 1) {
          pick.currentTeam.needWR *= 0.1;
        } else {
          pick.currentTeam.needWR = 1;
        }
      } else if (playersCollection[i].position === "TE") {
        if (pick.currentTeam.needTE < 1) {
          pick.currentTeam.needTE *= 0;
        } else if (pick.currentTeam.needTE === 1) {
          pick.currentTeam.needTE *= 0.1;
        } else {
          pick.currentTeam.needTE = 1;
        }
      } else if (playersCollection[i].position === "OT") {
        if (pick.currentTeam.needOT < 1) {
          pick.currentTeam.needOT *= 0;
        } else if (pick.currentTeam.needOT === 1) {
          pick.currentTeam.needOT *= 0.1;
        } else {
          pick.currentTeam.needOT = 1;
        }
      } else if (playersCollection[i].position === "OG") {
        if (pick.currentTeam.needOG < 1) {
          pick.currentTeam.needOG *= 0;
        } else if (pick.currentTeam.needOG === 1) {
          pick.currentTeam.needOG *= 0.1;
        } else {
          pick.currentTeam.needOG = 1;
        }
      } else if (playersCollection[i].position === "OC") {
        if (pick.currentTeam.needOC < 1) {
          pick.currentTeam.needOC *= 0;
        } else if (pick.currentTeam.needOC === 1) {
          pick.currentTeam.needOC *= 0.1;
        } else {
          pick.currentTeam.needOC = 1;
        }
      } else if (playersCollection[i].position === "EDGE") {
        if (pick.currentTeam.needEDGE < 1) {
          pick.currentTeam.needEDGE *= 0;
        } else if (pick.currentTeam.needEDGE === 1) {
          pick.currentTeam.needEDGE *= 0.1;
        } else {
          pick.currentTeam.needEDGE = 1;
        }
      } else if (playersCollection[i].position === "LB") {
        if (pick.currentTeam.needLB < 1) {
          pick.currentTeam.needLB *= 0;
        } else if (pick.currentTeam.needLB === 1) {
          pick.currentTeam.needLB *= 0.1;
        } else {
          pick.currentTeam.needLB = 1;
        }
      } else if (playersCollection[i].position === "CB") {
        if (pick.currentTeam.needCB < 1) {
          pick.currentTeam.needCB *= 0;
        } else if (pick.currentTeam.needCB === 1) {
          pick.currentTeam.needCB *= 0.1;
        } else {
          pick.currentTeam.needCB = 1;
        }
      } else if (playersCollection[i].position === "S") {
        if (pick.currentTeam.needS < 1) {
          pick.currentTeam.needS *= 0;
        } else if (pick.currentTeam.needS === 1) {
          pick.currentTeam.needS *= 0.1;
        } else {
          pick.currentTeam.needS = 1;
        }
      }

      if (playersCollection[i].position === "QB") {
        pick.currentTeam.qbCount = pick.currentTeam.qbCount + 1;
      }

      updateSingleTeamNeedsContainer(pick.currentTeam.shortName);

      return;
    }
  }
};

function updateTradedPicks(tradedPicks, tradeIndex) {
  var picksHolder = $(".rounds-pics-holder").children;
  if (picksHolder) {
    for (var i = 0; i < tradedPicks.length; i++) {
      for (var j = 0; j < picksHolder.length; j++) {
        if (parseInt(picksHolder[j].dataset.number) === tradedPicks[i].number) {
          picksHolder[j].dataset.shortname = tradedPicks[i].currentTeam.shortName;
          var logoContainer = picksHolder[j].querySelector(".team-logo-container");
          if (logoContainer) {
            logoContainer.dataset.teamname = tradedPicks[i].currentTeam.shortName;
          }

          var logoHolder = picksHolder[j].querySelector(".team-logo");
          if (logoHolder) {
            logoHolder.src = STATIC_URL + teamLogoPath + tradedPicks[i].currentTeam.teamLogo + "?w=80&tag=" + imageRefreshTag;
            logoHolder.dataset.teamlogo = tradedPicks[i].currentTeam.teamLogo;
          }
          var tradeIconHolder = picksHolder[j].querySelector(".pick-trade-info-btn");
          if (tradeIconHolder) {
            removeClass(tradeIconHolder, "hidden");
            tradeIconHolder.dataset.tradeindex = tradeIndex;
          }
          updateTeamNeedsInPickContainer(picksHolder[j], tradedPicks[i].currentTeam.shortName);
        }
      }
    }
  }
}

function fetchPossibleTrades(minValue, maxValue, tradingPossibility) {
  var currentPick = getCurrentPick().currentPick;

  if (currentPick.tradeUpPick) {
    return;
  }

  for (var i = 0; i < 3; i++) {
    if ((currentPick.currentTeam.teamNeed1 === playersList[i].position || currentPick.currentTeam.teamNeed2 ===
      playersList[i].position) && currentPick.currentTeam.needQB > 0) {
      if (currentPick.number < 6) {
        tradingPossibility = tradingPossibility / 25;
      } else {
        tradingPossibility = tradingPossibility / 3;
      }
    }
  }

  var readyForTrade = Math.floor(Math.random() * 100);

  if (readyForTrade < tradingPossibility) {
    currentPick.tradeProposals = [];

    var currentNeedyTeams = getCurrentNeedyTeams();

    for (var team of currentNeedyTeams) {
      var adjustedMinValue;
      if (currentPick.number < roundends[6]) {
        adjustedMinValue = parseFloat(minValue + (maxValue - minValue) * Math.random());
      } else {
        adjustedMinValue = currentPick.value - 0.1;
      }

      var adjustedMaxValue;
      if (currentPick.number < roundends[6]) {
        adjustedMaxValue = parseFloat(adjustedMinValue + 0.1);
      } else {
        adjustedMaxValue = adjustedMinValue * 2 + 0.3;
      }

      team.draftPicks.sort((x, y) => y.value - x.value);

      var possibleTrades = {
        draftPicks: [],
        value: 0,
        team: team,
        accepted: false,
      };

      possibleTrades.draftPicks = team.draftPicks.filter(function (pick) {
        return pick.playerSelection === "" && pick.futurePick === false
      }).slice(0, 1);

      var possibleFutureTradePicks;
      if (currentPick.number < roundends[3]) {
        possibleFutureTradePicks = team.draftPicks.filter(function (pick) {
          return pick.number > possibleTrades
            .draftPicks[0].number || pick.futurePick
        });
      } else {
        possibleFutureTradePicks = team.draftPicks.filter(function (pick) {
          return pick.number > possibleTrades
            .draftPicks[0].number && !pick.futurePick
        });
      }

      possibleTrades.value = possibleTrades.draftPicks[0].value;

      var lessPreferredPositions;
      if (team.targetPlayer.position === "DT" || team.targetPlayer.position === "S" || team.targetPlayer.position ===
        "RB" || team.targetPlayer.position === "TE" || team.targetPlayer.position === "LB" || team.targetPlayer
          .position === "OG" || team.targetPlayer.position === "OC") {
        lessPreferredPositions = true;
      } else {
        lessPreferredPositions = false;
      }

      var highValuePlayers;
      if (team.targetPlayer.name === "Caleb Williams" || team.targetPlayer.name === "Drake Maye") {
        highValuePlayers = true;
      } else {
        highValuePlayers = false;
      }

      if (currentPick !== 1 && currentPick !== 2) {
        if (highValuePlayers == false) {
          if (lessPreferredPositions == false) {
            possibleFutureTradePicks = possibleFutureTradePicks.filter(function (pick) {
              return !(pick.futurePick && pick
                .futureRound === "1st")
            });
          } else {
            possibleFutureTradePicks = possibleFutureTradePicks.filter(function (pick) { return !pick.futurePick });
          }
        }
      }

      function insertMorePossibleTrade(x) {
        if ((!highValuePlayers && possibleTrades.draftPicks.length < 3) || (highValuePlayers && possibleTrades
          .draftPicks
          .length < maxPicksInPackage)) {
          if (possibleFutureTradePicks.length > possibleTrades.draftPicks.length) {
            for (var i = possibleFutureTradePicks.length - 1; i >= x; i--) {
              if (((currentPick.number < roundends[6]) && (possibleTrades.value + possibleFutureTradePicks[i].value >
                currentPick.value * adjustedMinValue)) || ((currentPick.number >= roundends[6]) && (possibleTrades
                  .value +
                  possibleFutureTradePicks[i].value > adjustedMinValue))) {
                if (((currentPick.number < roundends[6]) && (possibleTrades.value + possibleFutureTradePicks[i]
                  .value <
                  currentPick.value * adjustedMaxValue)) || ((currentPick.number >= roundends[6]) && (possibleTrades
                    .value +
                    possibleFutureTradePicks[i].value < adjustedMaxValue))) {
                  possibleTrades.draftPicks.push(possibleFutureTradePicks[i]);
                  possibleTrades.value += possibleFutureTradePicks[i].value;
                  possibleTrades.draftPicks = possibleTrades.draftPicks.sort(
                    function (x, y) {
                      if (x.futurePick < y.futurePick)
                        return -1;
                      if (x.futurePick > y.futurePick)
                        return 1;
                      if (x.value > y.value)
                        return -1;
                      if (x.value < y.value) return 1;
                      if (x.number < y.number)
                        return -1;
                      if (x.number > y.number)
                        return 1;
                      return 1;
                    }
                  );
                  return possibleTrades;
                } else {
                  return;
                }
              }
            }
            possibleTrades.draftPicks.push(possibleFutureTradePicks[x]);
            possibleTrades.value += possibleTrades.draftPicks[x + 1].value;
            insertMorePossibleTrade(x + 1);
          }
        }
      }

      insertMorePossibleTrade(0);

      if (possibleTrades.value > currentPick.value * adjustedMinValue) {
        currentPick.tradeProposals.push(possibleTrades);
      }
    }

    currentPick.tradeProposals = currentPick.tradeProposals.filter(
      function (offer) {
        return offer.value < 480 || offer.team.needQB >= 5
      });


    if (currentPick.tradeProposals.length === 0) {
      return;
    } else if (currentPick.tradeProposals.length === 1) {
      tempTradeArray = {
        tradeBackTeam: currentPick.currentTeam,
        tradeUpTeam: currentPick.tradeProposals[0].team,
        picks: [currentPick.number],
        tradeBackPicks: currentPick.tradeProposals[0].draftPicks,
        tradeUpPicks: [currentPick],
      };

      for (var pick of currentPick.tradeProposals[0].draftPicks) {
        pick.tradedPick = true;
        currentPick.currentTeam.draftPicks.push(pick);
        tempTradeArray.picks.push(
          pick.number
        );
        pick.currentTeam = currentPick.currentTeam;
      }

      currentPick.tradeProposals[0].team.draftPicks = currentPick.tradeProposals[0].team.draftPicks.filter(
        function (pick) {
          return pick.currentTeam !== currentPick.currentTeam
        });

      currentPick.tradeProposals[0].team.draftPicks.push(currentPick);

      currentPick.currentTeam.draftPicks.splice(
        currentPick.currentTeam.draftPicks.indexOf(currentPick),
        1
      );

      currentPick.currentTeam.draftPicks = currentPick.currentTeam.draftPicks.sort(
        function (x, y) {
          if (x.futurePick < y.futurePick) return -1;
          if (x.futurePick > y.futurePick) return 1;
          if (x.value > y.value) return -1;
          if (x.value < y.value) return 1;
          if (x.number < y.number) return -1;
          if (x.number > y.number) return 1;
          return 1;
        }
      );

      currentPick.tradeProposals[0].team.draftPicks = currentPick.tradeProposals[0].team.draftPicks.sort(
        function (x, y) {
          if (x.futurePick < y.futurePick) return -1;
          if (x.futurePick > y.futurePick) return 1;
          if (x.value > y.value) return -1;
          if (x.value < y.value) return 1;
          if (x.number < y.number) return -1;
          if (x.number > y.number) return 1;
          return 1;
        }
      );

      currentPick.currentTeam = currentPick.tradeProposals[0].team;

      currentPick.tradeUpPick = true;
      currentPick.tradedPick = true;

      return tempTradeArray;
    } else {

      var index = Math.floor(
        Math.random() * Math.floor(currentPick.tradeProposals.length)
      );

      tempTradeArray = {
        tradeBackTeam: currentPick.currentTeam,
        tradeUpTeam: currentPick.tradeProposals[index].team,
        picks: [currentPick.number],
        tradeBackPicks: currentPick.tradeProposals[index].draftPicks,
        tradeUpPicks: [currentPick],
      };

      for (var pick of currentPick.tradeProposals[index].draftPicks) {
        pick.tradedPick = true;
        currentPick.currentTeam.draftPicks.push(pick);
        tempTradeArray.picks.push(
          pick.number
        );
        pick.currentTeam = currentPick.currentTeam;
      }

      currentPick.tradeProposals[index].team.draftPicks = currentPick.tradeProposals[index].team.draftPicks.filter(
        function (pick) {
          return pick.currentTeam !== currentPick.currentTeam
        });

      currentPick.tradeProposals[index].team.draftPicks.push(currentPick);

      currentPick.currentTeam.draftPicks.splice(currentPick.currentTeam.draftPicks.indexOf(currentPick), 1);

      currentPick.currentTeam.draftPicks = currentPick.currentTeam.draftPicks.sort(
        function (x, y) {
          if (x.futurePick < y.futurePick) return -1;
          if (x.futurePick > y.futurePick) return 1;
          if (x.value > y.value) return -1;
          if (x.value < y.value) return 1;
          if (x.number < y.number) return -1;
          if (x.number > y.number) return 1;
          return 1;
        }
      );

      currentPick.tradeProposals[index].team.draftPicks = currentPick.tradeProposals[index].team.draftPicks.sort(
        function (x, y) {
          if (x.futurePick < y.futurePick) return -1;
          if (x.futurePick > y.futurePick) return 1;
          if (x.value > y.value) return -1;
          if (x.value < y.value) return 1;
          if (x.number < y.number) return -1;
          if (x.number > y.number) return 1;
          return 1;
        });

      currentPick.currentTeam = currentPick.tradeProposals[index].team;

      currentPick.tradeUpPick = true;
      currentPick.tradedPick = true;

      return tempTradeArray;
    }
  } else {
    return;
  }
};

function fillSelectedPlayerInPick(pickContainer, playerContainer, player) {
  const teamNeedsContainer = pickContainer.querySelector(".team-needs-info-container");
  if (teamNeedsContainer) {
    addClass(teamNeedsContainer, "hidden");
  }
  var pickNumber = parseInt(pickContainer.dataset.number);
  var pickIndex = picksList.findIndex((item) => item.number === pickNumber);
  picksList[pickIndex].playerSelection = player;
  var playerHolder = pickContainer.querySelector(".traded-player-name-position-container");
  if (playerHolder) {
    playerHolder.style.cursor = "pointer";
    playerHolder.dataset.name = playerContainer.dataset.name;
    playerHolder.onclick = showPlayerInfo;
  }
  var playerNameEl2 = pickContainer.querySelector(".player-name");
  if (playerNameEl2) playerNameEl2.innerHTML = playerContainer.dataset.name;
  var playerPositionEl2 = pickContainer.querySelector(".player-position");
  if (playerPositionEl2) playerPositionEl2.innerHTML = playerContainer.dataset.position + " " + playerContainer.dataset.draftfrom;

  if (multiUserDraft) {
    let draftedInfoContainer = pickContainer.querySelector(".drafting-info-container");
    if (draftedInfoContainer && !hasClass(draftedInfoContainer, "hidden")) {
      playerHolder.style.maxWidth = "149px";
      playerHolder.style.textOverflow = "ellipsis";
      playerHolder.style.overflow = "hidden";
    }
  }

  const scrollContainer = pickContainer.closest(".rounds-pics-container");
  if (scrollContainer) {
    const containerRect = scrollContainer.getBoundingClientRect();
    const elementRect = pickContainer.getBoundingClientRect();

    const offset =
      elementRect.top -
      containerRect.top -
      scrollContainer.clientHeight / 2 +
      elementRect.height / 2;

    scrollContainer.scrollTo({
      top: scrollContainer.scrollTop + offset,
      behavior: "auto"
    });
  }

  playerContainer.remove();

  return;
}

function calculateAllTeamsNeeds() {
  teamsList.forEach(team => {
    var needsArray = [
      team.teamNeed1,
      team.teamNeed2,
      team.teamNeed3,
      team.teamNeed4,
      team.teamNeed5
    ].filter(function (need) { return need; });
    allTeamsNeeds[team.shortName] = needsArray.join(", ");
  });
}

function updateSingleTeamNeedsContainer(teamShortName) {
  const teamIndex = teamsList.findIndex(team => team.shortName === teamShortName);
  if (teamIndex > -1) {
    var needsArray = [
      teamsList[teamIndex].teamNeed1,
      teamsList[teamIndex].teamNeed2,
      teamsList[teamIndex].teamNeed3,
      teamsList[teamIndex].teamNeed4,
      teamsList[teamIndex].teamNeed5
    ].filter(function (need) { return need; });
    allTeamsNeeds[teamShortName] = needsArray.join(", ");
  
    const pickContainers = $all("div[data-shortname=" + teamShortName + "]");
    for (let i = 0; i < pickContainers.length; i++) {
      const teamNeedsContainer = pickContainers[i].querySelector(".team-needs-info-container .team-needs-info-text");
      if (teamNeedsContainer) {
        teamNeedsContainer.innerHTML = allTeamsNeeds[teamShortName] || "";
      }
    }
  }
}

function updateTeamNeedsInPickContainer(pickContainer, teamShortName) {
  if (!pickContainer) return;
  var teamNeedsText = pickContainer.querySelector(".team-needs-info-container .team-needs-info-text");
  if (teamNeedsText) {
    teamNeedsText.innerHTML = allTeamsNeeds[teamShortName] || "";
  }
}

function fillRoundPics() {
  var picsHolder = $(".rounds-pics-holder");

  if (!picsHolder) {
    return;
  }

  picsHolder.innerHTML = "";

  var roundNumber = 0;
  if (picsHolder) {
    var limit = roundends[rounds];
    for (var i = 0; i < limit; i++) {
      if (i == 0 || i == roundends[1] || i == roundends[2] || i == roundends[3] || i == roundends[4] || i ==
        roundends[5] || i == roundends[6]) {
        roundNumber += 1;
        var roundNumberHolder = document.createElement("div");
        addClass(roundNumberHolder, "round-number");
        roundNumberHolder.textContent = "Round " + roundNumber;
        roundNumberHolder.dataset.round = roundNumber;
        picsHolder.appendChild(roundNumberHolder);
      }
      var singleRoundTemplate = document.getElementById("single-round");
      if (!singleRoundTemplate) continue;
      var roundClone = singleRoundTemplate.content.cloneNode(true);
      // roundClone.querySelector(".team-logo").setAttribute("data-teamlogo", picksList[i].teamLogo);
      var teamLogoEl = roundClone.querySelector(".team-logo");
      if (teamLogoEl) {
        teamLogoEl.setAttribute("data-teamlogo", picksList[i].currentTeam.teamLogo);
        teamLogoEl.setAttribute("crossorigin", "anonymous");
        teamLogoEl.setAttribute("alt", picksList[i].shortName);
        teamLogoEl.src = STATIC_URL + teamLogoPath + picksList[i].currentTeam.teamLogo + "?w=80&tag=" + imageRefreshTag;
      }

      const teamNeedsContainer = roundClone.querySelector(".team-needs-info-container .team-needs-info-text");
      if (teamNeedsContainer) {
        teamNeedsContainer.innerHTML = allTeamsNeeds[picksList[i].currentTeam.shortName];
      }
      var picNumberEl = roundClone.querySelector(".pic-number");
      if (picNumberEl) picNumberEl.textContent = picksList[i].number + ".";
      var teamLogoContainerEl = roundClone.querySelector(".team-logo-container");
      if (teamLogoContainerEl) teamLogoContainerEl.dataset.teamname = picksList[i].shortName;
      var pickContainer = roundClone.querySelector(".pic-container");
      if (!pickContainer) continue;
      pickContainer.classList.add("pick-number-" + picksList[i].number);
      pickContainer.dataset.number = picksList[i].number;
      pickContainer.dataset.shortname = picksList[i].currentTeam.shortName;
      pickContainer.dataset.roundnumber = roundNumber;
      pickContainer.dataset.playerselection = picksList[i].playerSelection;
      if (multiUserDraft && currentRoomData.selectedTeams.includes(picksList[i].currentTeam.shortName) && (picksList[i].number > pickstart)) {
        let draftingInfoContainer = roundClone.querySelector(".drafting-info-container");
        if (draftingInfoContainer) {
          removeClass(draftingInfoContainer, "hidden");
          let draftBy = draftingInfoContainer.querySelector(".draft-by");
          if (draftBy) {
            let userName = "";
            for (let j = 0; j < currentRoomData.members.length; j++) {
              if (currentRoomData.members[j].teams.includes(picksList[i].currentTeam.shortName)) {
                userName = currentRoomData.members[j].userName;
                draftingInfoContainer.dataset.socketid = currentRoomData.members[j].socketId;
                draftingInfoContainer.dataset.picknumber = picksList[i].number;
                break;
              }
            }
            draftBy.textContent = userName;
          }
        }
      }
      picsHolder.appendChild(roundClone);
    }
  }
}

function showTeamPicks(target) {
  var pickContainer = target.closest(".pic-container");
  var teamName = "";
  if (pickContainer) {
    teamName = pickContainer.dataset.shortname;
  }

  // Remove existing team picks popup to prevent DOM accumulation
  var existingTeamPicksPopup = $(".team-picks-info-popup");
  if (existingTeamPicksPopup) {
    existingTeamPicksPopup.remove();
  }

  var teamPicksInfoEl = document.getElementById("team-picks-info");
  if (!teamPicksInfoEl) return;
  var teamPicksInfoPopupTemplate = teamPicksInfoEl.content.cloneNode(true);
  var teamPicksInfoPopup = teamPicksInfoPopupTemplate.querySelector(".team-picks-info-popup");
  if (!teamPicksInfoPopup) return;
  var closeBtn = teamPicksInfoPopup.querySelector(".close-team-picks-btn");
  if (closeBtn) {
    closeBtn.onclick = closeTeamPicksInfoPopup;
  }

  var teamNameHolder = teamPicksInfoPopup.querySelector(".team-name");
  if (teamNameHolder) {
    for (var i = 0; i < teamsList.length; i++) {
      if (teamsList[i].shortName == teamName) {
        teamNameHolder.innerHTML = teamsList[i].name;
      }
    }
  }

  var teamPicksHolder = teamPicksInfoPopup.querySelector(".team-picks-list-container .team-picks-list-holder");
  var teamPicksContainer = teamPicksInfoPopup.querySelector(".team-picks-list-container");
  if (teamPicksHolder && teamPicksContainer) {
    var resultScreenContainer = IS_DESKTOP ? $(".final-result-container") : $(".final-trades-container");
    var onResultScreen = resultScreenContainer && !hasClass(resultScreenContainer, "hidden");
    var showGradesInPopup = !multiUserDraft && onResultScreen && isGradesToggleActive();
    if (showGradesInPopup) {
      var overallTeamGrade = calculateOverallTeamGrade(teamName);
      if (overallTeamGrade && overallTeamGrade.grade !== 'N/A') {
        var overallRow = document.createElement("div");
        addClass(overallRow, "overall-grade-row");
        var overallLabel = document.createElement("span");
        addClass(overallLabel, "overall-grade-label");
        overallLabel.textContent = "Overall Draft Grade:";
        overallRow.appendChild(overallLabel);
        var overallGradeText = document.createElement("div");
        addClass(overallGradeText, "header-grade");
        overallGradeText.textContent = overallTeamGrade.grade;
        overallRow.appendChild(overallGradeText);
        teamPicksInfoPopup.insertBefore(overallRow, teamPicksContainer);
      }
    }
    var allPickContainers = $all(".draft-simulation-container .rounds-pics-container .pic-container");
    for (var i = 0; i < allPickContainers.length; i++) {
      if (allPickContainers[i].dataset.shortname == teamName) {
        var clone = allPickContainers[i].cloneNode(true);
        var teamLogoBtn = clone.querySelector(".team-logo-container");
        if (teamLogoBtn) {
          teamLogoBtn.attributes.removeNamedItem("onclick");
        }

        let originalTradeInfoBtn = allPickContainers[i].querySelector(".pick-trade-info-btn");
        if (originalTradeInfoBtn) {
          let tradeInfoBtn = clone.querySelector(".pick-trade-info-btn");
          tradeInfoBtn.dataset.tradeindex = originalTradeInfoBtn.dataset.tradeindex;
          if (tradeInfoBtn) {
            tradeInfoBtn.onclick = showTradeData;
          }
        }

        let originalPlayerInfoBtn = allPickContainers[i].querySelector(".traded-player-name-position-container");
        if (originalPlayerInfoBtn) {
          let playerInfoBtn = clone.querySelector(".traded-player-name-position-container");
          playerInfoBtn.dataset.name = originalPlayerInfoBtn.dataset.name;
          if (playerInfoBtn) {
            playerInfoBtn.onclick = showPlayerInfo;
          }

          let draftedInfoContainer = clone.querySelector(".drafting-info-container");
          if (draftedInfoContainer) {
            playerInfoBtn.style.maxWidth = "250px";
          }
        }

        if (showGradesInPopup) {
          var tpPickNum = parseInt(clone.dataset.number);
          var tpPickObj = picksList.find(function(p) { return p.number === tpPickNum; });
          if (tpPickObj && tpPickObj.pickGradeData) {
            clone.appendChild(createPickGradeElement(tpPickObj.pickGradeData.grade));
          }
        }

        teamPicksHolder.appendChild(clone);
      }
    }
  }

  var overlay = $(".overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  } else {
    var overlay = document.createElement("div");
    addClass(overlay, "overlay");
    document.body.appendChild(overlay);
  }

  addClass(teamPicksInfoPopup, "popup");
  if (!multiUserDraft) {
    addClass(teamPicksInfoPopup, "mockdraft-simulator");
  }
  document.body.appendChild(teamPicksInfoPopup);
}

function closeTeamPicksInfoPopup(event) {
  var teamPicksInfoPopup = $(".team-picks-info-popup");
  var overlay = $(".overlay");
  if (!teamPicksInfoPopup) return;
  if (typeof teamPicksInfoPopup != "object") return;
  if (!teamPicksInfoPopup.classList.contains("hidden") && (!event.target.closest(
    ".team-picks-info-popup") || event.target.closest(".close-team-picks-btn")) &&
    !event.target.closest(".team-logo-container") && !event.target.closest(".player-info-popup")
    && !event.target.closest(".trade-data-container")) {
    teamPicksInfoPopup.remove();
    if (!checkForAlreadyOpenPopup()) {
      addClass(overlay, "hidden");
    }
  }
}

function toggleTeams(group) {
  var btnAfc = $(".btn-afc");
  var btnNfc = $(".btn-nfc")
  var containerNfc = $(".teams-container.nfc");
  var containerAfc = $(".teams-container.afc");

  if (btnAfc && btnNfc && containerAfc && containerNfc) {
    if (group == "nfc") {
      removeClass(containerNfc, "hidden");
      addClass(containerAfc, "hidden");
      btnAfc.style.opacity = "0.4";
      btnNfc.style.opacity = "1";
    } else {
      addClass(containerNfc, "hidden");
      removeClass(containerAfc, "hidden");
      btnAfc.style.opacity = "1";
      btnNfc.style.opacity = "0.4";
    }
  }
}

function toggleSimView(view, isRedirected) {
  var draftBtn = $(".draft-result");
  var poolBtn = $(".player-pool");
  var myPicksBtn = $(".my-picks");

  var contentSlider = $(".sim-content-slider");

  if (draftBtn && poolBtn && contentSlider) {
    if (view == "result") {
      if (!isRedirected) trackGAEventForPage("draft_result_tab");
      currentSection = "result";
      addClass(draftBtn, "selected");
      removeClass(poolBtn, "selected");
      removeClass(myPicksBtn, "selected");

      contentSlider.className = "sim-content-slider show-rounds-pics-container";
    } else if (view == "pool") {
      if (!isRedirected) trackGAEventForPage("player_pool_tab");
      currentSection = "pool";
      removeClass(draftBtn, "selected");
      addClass(poolBtn, "selected");
      removeClass(myPicksBtn, "selected");

      contentSlider.className = "sim-content-slider show-players-container";
    } else if (view == "mypicks") {
      if (!isRedirected) trackGAEventForPage("my_picks_tab");
      currentSection = "mypicks";
      removeClass(draftBtn, "selected");
      removeClass(poolBtn, "selected");
      addClass(myPicksBtn, "selected");

      contentSlider.className = "sim-content-slider show-mypics-container";
      fillMyPicks();
    }
  }
}

function fillMyPicks() {
  var myTeamsHolder = $(".mypicks-container .selected-user-teams-container");
  if (myTeamsHolder) {
    myTeamsHolder.innerHTML = "";
    let firstTeam;
    for (var i = 0; i < teamsList.length; i++) {
      if (userSelectedTeams.includes(teamsList[i].shortName) || (multiUserDraft && currentRoomData.selectedTeams.includes(teamsList[i].shortName))) {
        var logoContainer = document.createElement("div");
        logoContainer.dataset.team = teamsList[i].shortName;
        addClass(logoContainer, "team-logo-btn-container");
        if (i == 0) {
          addClass(logoContainer, "selected");
        }
        var logoHolder = document.createElement("button");
        logoHolder.dataset.team = teamsList[i].shortName;
        logoHolder.onclick = showSelectedTeamPicks;
        addClass(logoHolder, "team-logo-btn");
        var teamLogo = document.createElement("img");
        addClass(teamLogo, "team-logo");
        teamLogo.setAttribute("src", STATIC_URL + teamLogoPath + teamsList[i].teamLogo + "?w=80&tag=" + imageRefreshTag);
        teamLogo.setAttribute("width", 30);
        teamLogo.setAttribute("alt", teamsList[i].shortName);
        logoHolder.appendChild(teamLogo);
        logoContainer.appendChild(logoHolder);
        if (userSelectedTeams[0] === teamsList[i].shortName) {
          firstTeam = logoContainer;
        } else {
          myTeamsHolder.appendChild(logoContainer);
        }
      }
    }

    myTeamsHolder.prepend(firstTeam);
    showSelectedTeamPicks();
  }
}

function showSelectedTeamPicks(e) {
  var picksContainer = $(".mypicks-container .selected-picks-container");
  var myTeamsHolder = $(".mypicks-container .selected-user-teams-container");
  if (picksContainer) picksContainer.innerHTML = "";
  if (e) {
    var teamName = e.target.parentElement.dataset.team;
    var previousSelectedTeam = $(".team-logo-btn-container.selected");
    removeClass(previousSelectedTeam, "selected");
    for (var i = 0; myTeamsHolder && i < myTeamsHolder.children.length; i++) {
      if (myTeamsHolder.children[i].dataset.team === teamName) {
        addClass(myTeamsHolder.children[i], "selected");
      }
    }
  } else {
    if (myTeamsHolder) {
      if (multiUserDraft) {
        teamName = userSelectedTeams[0];
        for (let i = 0; i < myTeamsHolder.children.length; i++) {
          if (myTeamsHolder.children[i].dataset.team === teamName) {
            addClass(myTeamsHolder.children[i], "selected");
          }
        }
      } else {
        teamName = myTeamsHolder.children[0].dataset.team;
        addClass(myTeamsHolder.children[0], "selected");
      }
    }
  }
  var teamPicks;
  for (var i = 0; i < teamsList.length; i++) {
    if (teamName === teamsList[i].shortName) {
      teamPicks = teamsList[i].draftPicks;
      break;
    }
  }

  teamPicks.sort(function (x, y) {
    return x.number - y.number;
  });

  var teamFuturePicks = teamPicks.filter((pick) => !pick.number && pick.currentTeam.shortName !== pick.originalTeam.shortName);
  var teamCurrentPicks = teamPicks.filter((pick) => pick.number);

  for (var i = 0; i < teamCurrentPicks.length; i++) {
    if (teamCurrentPicks[i].number <= roundends[rounds]) {
      var pickHolder = document.createElement("div");
      addClass(pickHolder, "single-pick");
      var pickNumberHolder = document.createElement("span");
      addClass(pickNumberHolder, "pick-number");
      pickNumberHolder.innerHTML = teamCurrentPicks[i].number + ".";

      pickHolder.appendChild(pickNumberHolder);

      if (teamCurrentPicks[i].playerSelection.name) {
        var playerDetailsContainer = document.createElement("div");
        addClass(playerDetailsContainer, "traded-player-name-position-container");
        var playerNameHolder = document.createElement("span");
        addClass(playerNameHolder, "player-name");
        playerNameHolder.innerHTML = teamCurrentPicks[i].playerSelection.name;

        playerDetailsContainer.appendChild(playerNameHolder);
        playerDetailsContainer.dataset.name = teamCurrentPicks[i].playerSelection.name;
        playerDetailsContainer.onclick = showPlayerInfo;

        var playerPositionDraftfromHolder = document.createElement("div");
        addClass(playerPositionDraftfromHolder, "player-position-draftfrom-holder");

        var playerPositionHolder = document.createElement("span");
        addClass(playerPositionHolder, "player-position");
        playerPositionHolder.innerHTML = teamCurrentPicks[i].playerSelection.position + " " + teamCurrentPicks[i].playerSelection.draftFrom;

        playerPositionDraftfromHolder.appendChild(playerPositionHolder);

        playerDetailsContainer.appendChild(playerPositionDraftfromHolder);

        pickHolder.appendChild(playerDetailsContainer);
      }

      if (teamCurrentPicks[i].currentTeam.shortName !== teamCurrentPicks[i].originalTeam.shortName) {
        var tradeIconHolder = document.createElement("button");
        tradeIconHolder.dataset.teamname = teamCurrentPicks[i].currentTeam.shortName;
        let originalPickHolder = $(".pick-number-" + teamCurrentPicks[i].number);
        if (originalPickHolder) {
          let tradeInfoBtn = originalPickHolder.querySelector(".pick-trade-info-btn");
          if (tradeInfoBtn) {
            tradeIconHolder.dataset.tradeindex = tradeInfoBtn.dataset.tradeindex;
          }
        }

        addClass(tradeIconHolder, "pick-trade-info-btn");
        tradeIconHolder.onclick = showTradeData;
        var tradeIcon = document.createElement("img");
        addClass(tradeIcon, "trade-icon");
        if (brand === "pfn") {
          tradeIcon.setAttribute("src", STATIC_URL + "/skm/assets/nfl-mockup/trade-details-icon-blue-new.png");
        } else {
          tradeIcon.setAttribute("src", STATIC_URL + "/skm/assets/nfl-mockup/trade-icon.svg");
        }

        tradeIcon.setAttribute("width", 24);
        tradeIcon.setAttribute("height", 24);
        tradeIcon.setAttribute("alt", "trade-icon");
        tradeIcon.setAttribute("crossorigin", "anonymous");

        tradeIconHolder.appendChild(tradeIcon);
        pickHolder.appendChild(tradeIconHolder);
      }

      picksContainer.appendChild(pickHolder);
    } else {
      break;
    }
  }

  teamFuturePicks.sort((x, y) => x.value - y.value);
  for (var i = 0; i < teamFuturePicks.length; i++) {
    var pickHolder = document.createElement("div");
    addClass(pickHolder, "single-pick");
    var pickNumberHolder = document.createElement("span");
    addClass(pickNumberHolder, "future-pick");
    pickNumberHolder.innerHTML = teamFuturePicks[i].futurePickYear + " " + teamFuturePicks[i].futureOriginalTeam + " " + teamFuturePicks[i].futureRound;
    pickHolder.appendChild(pickNumberHolder);

    picksContainer.appendChild(pickHolder);
  }

  // Show traded players acquired by this team
  for (var t = 0; t < tradesData.length; t++) {
    var acquiredPlayers = [];
    if (tradesData[t].givingPlayers && tradesData[t].givingPlayers.length && tradesData[t].givingTeamName === teamName) {
      acquiredPlayers = acquiredPlayers.concat(tradesData[t].givingPlayers);
    }
    if (tradesData[t].gettingPlayers && tradesData[t].gettingPlayers.length && tradesData[t].gettingTeamName === teamName) {
      acquiredPlayers = acquiredPlayers.concat(tradesData[t].gettingPlayers);
    }
    for (var p = 0; p < acquiredPlayers.length; p++) {
      var playerHolder = document.createElement("div");
      addClass(playerHolder, "single-pick");
      addClass(playerHolder, "traded-player-item");
      var nameSpan = document.createElement("span");
      addClass(nameSpan, "future-pick");
      nameSpan.innerHTML = formatPlayerName(acquiredPlayers[p].playerName, acquiredPlayers[p].position);
      playerHolder.appendChild(nameSpan);
      picksContainer.appendChild(playerHolder);
    }
  }

  var roundsPicksHolder = $(".rounds-pics-container");
  if (roundsPicksHolder) {
    roundsPicksHolder.scrollTo(0, 0);
  }
}

function filterInputPlayers(target) {
  var searchInput = target.value.toLowerCase();
  var selectedPositionFilter = $(".positions-filters .positions .selected");
  var selectedPosition = "";
  if (selectedPositionFilter) {
    selectedPosition = selectedPositionFilter.dataset.position;
  }
  var playersList = $(".players-holder .players-list").children;
  if (playersList && searchInput) {
    for (var i = 0; i < playersList.length - 1; i++) {
      var playerName = playersList[i].dataset.name.toLowerCase();
      var playerPosition = playersList[i].dataset.position;
      if (playerName.includes(searchInput) && (playerPosition === selectedPosition || selectedPosition === "")) {
        removeClass(playersList[i], "hidden");
      } else {
        addClass(playersList[i], "hidden");
      }
    }
  } else {
    for (var i = 0; i < playersList.length; i++) {
      removeClass(playersList[i], "hidden");
    }

    if (selectedPosition) {
      for (var i = 0; i < playersList.length - 1; i++) {
        var playerPosition = playersList[i].dataset.position;
        if (playerPosition !== selectedPosition) {
          addClass(playersList[i], "hidden");
        }
      }
    }
  }
}

async function toggleMyPicks(target) {
  var draftResultBtn = $(".draft-result-btn");
  var myPicksBtn = $(".my-picks-btn");
  var nextPicksContainer = $(".next-pick-container");
  var roundPicksContainer = $(".rounds-pics-holder");
  var myPicksContainer = $(".mypicks-container");
  var redirectedFromSection = currentSection;

  await yieldToMain();

  if (redirectedFromSection == "mypicks" || target.classList.contains("draft-result-btn")) {
    if (target) trackGAEventForPage("draft_result_tab");
    currentSection = "result";
    removeClass(myPicksBtn, "selected");
    addClass(draftResultBtn, "selected");
    addClass(myPicksContainer, "hidden");
    removeClass(nextPicksContainer, "hidden");
    removeClass(roundPicksContainer, "hidden");
    var currentPickContainer = getCurrentPickContainer();
    if (currentPickContainer) {
      const scrollContainer = currentPickContainer.closest(".rounds-pics-container");
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = currentPickContainer.getBoundingClientRect();

      const offset =
        elementRect.top -
        containerRect.top -
        scrollContainer.clientHeight / 2 +
        elementRect.height / 2;

      scrollContainer.scrollTo({
        top: scrollContainer.scrollTop + offset,
        behavior: "auto"
      });
    }
  } else {
    if (target) trackGAEventForPage("my_picks_tab");
    currentSection = "mypicks";
    addClass(myPicksBtn, "selected");
    removeClass(draftResultBtn, "selected");
    removeClass(myPicksContainer, "hidden");
    addClass(nextPicksContainer, "hidden");
    addClass(roundPicksContainer, "hidden");
    fillMyPicks();
  }
}

function showTeamNeeds() {
  if (isPausingDraftRequired()) {
    pauseDraft();
  }

  var existingTeamNeeds = $(".team-needs-container");
  if (existingTeamNeeds) {
    existingTeamNeeds.remove();
  }

  var teamNeedsEl = document.getElementById("team-needs-template");
  if (!teamNeedsEl) return;
  var teamNeedsTemplate = teamNeedsEl.content.cloneNode(true);
  var teamNeedsContainer = teamNeedsTemplate.querySelector(".team-needs-container");
  var closeBtn = teamNeedsTemplate.querySelector(".close-btn");
  trackGAEventForPage("team_needs");
  closeBtn.onclick = closeTeamNeeds;
  var teamNeedsHolder = teamNeedsTemplate.querySelector(".team-needs-holder");
  addClass(teamNeedsHolder, "team-needs-grid-container");
  teamsList.forEach((team) => {
    var gridItem = document.createElement('div');
    addClass(gridItem, "team-needs-grid-item");
    var teamLogo = document.createElement("img");
    addClass(teamLogo, "team-logo");
    teamLogo.setAttribute("src", STATIC_URL + teamLogoPath + team.teamLogo + "?w=80&tag=" + imageRefreshTag);
    teamLogo.setAttribute("width", 40);
    teamLogo.setAttribute("alt", team.shortName);

    var teamNeedsLogo = document.createElement('div');
    addClass(teamNeedsLogo, "team-needs-logo");
    teamNeedsLogo.appendChild(teamLogo);

    gridItem.appendChild(teamNeedsLogo);

    var teamNeedtext = document.createElement('div');
    var teamNeedsList = [];
    for (var i = 1; i <= 5; i++) {
      if (team["teamNeed" + i]) {
        teamNeedsList.push(team["teamNeed" + i]);
      }
    }
    teamNeedsList = teamNeedsList.join(", ");
    var teamNeedpara = document.createElement('p');
    teamNeedpara.innerHTML = teamNeedsList;
    teamNeedtext.appendChild(teamNeedpara);
    gridItem.appendChild(teamNeedtext);

    teamNeedsHolder.appendChild(gridItem);
  })

  var overlay = $(".overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  } else {
    var overlay = document.createElement("div");
    addClass(overlay, "overlay");
    document.body.appendChild(overlay);
  }

  addClass(teamNeedsContainer, "popup");
  document.body.appendChild(teamNeedsContainer);
}

function proposeTrade(currentTeam, offeringTeam, currentTeamPicks, offeringTeamPicks) {
  if (multiUserDraft) {
    if (!currentTeam) {
      if (!currentPickIsMine) {
        enableResumeDraftBtn();
        socket.emit("proposal-pause", {
          socketId: currentUserSocketId,
          roomId: currentRoomData.roomId,
        });
      }

      socket.emit("chat", {
        socketId: currentUserSocketId,
        roomId: currentRoomData.roomId,
        type: "proposal_offer",
      });
    }
  }

  if (isPausingDraftRequired()) {
    pauseDraft();
  }
  var userTeamsForTradeEl = document.getElementById("user-teams-for-trade");
  if (!userTeamsForTradeEl) return;
  var userTeamsContainer = userTeamsForTradeEl.content.cloneNode(true);
  var teamsContainer = userTeamsContainer.querySelector(".trade-proposal-user-teams-conatiner");
  var navNextBtn = userTeamsContainer.querySelector(".nav-btn.next");
  trackGAEventForPage("propose_trade");
  navNextBtn.onclick = function () {
    showAllTeamsSelectionPopupForTradeProposal(offeringTeam, currentTeamPicks, offeringTeamPicks);
  };
  var closeBtn = userTeamsContainer.querySelector(".close-btn");
  closeBtn.onclick = closeProposalPopup;
  var teamsHolder = userTeamsContainer.querySelector(".user-teams-holder");
  if (teamsHolder) {
    var teams = [];
    teamsList.forEach(function (team) {
      if (userSelectedTeams.includes(team.shortName)) {
        teams.push(team);
      }
    });

    teams.forEach(function (team) {
      var teamHolder = document.createElement("button");
      addClass(teamHolder, "team-btn");
      teamHolder.onclick = selectTeamForUserTrade;
      teamHolder.dataset.teamname = team.shortName;
      teamHolder.dataset.teamlogo = team.teamLogo;
      var teamName = document.createElement("span");
      addClass(teamName, "team-name");
      teamName.innerHTML = team.shortName;
      teamHolder.appendChild(teamName);

      var teamLogo = document.createElement("img");
      addClass(teamLogo, "team-logo");
      teamLogo.setAttribute("src", STATIC_URL + teamLogoPath + team.teamLogo + "?w=80&tag=" + imageRefreshTag);
      teamLogo.setAttribute("width", 25);
      teamLogo.setAttribute("alt", team.shortName);

      teamHolder.appendChild(teamLogo);
      if (userSelectedTeams.length < 8) {
        addClass(teamHolder, "small-selection");
      }
      if (userSelectedTeams.length == 1) {
        addClass(teamHolder, "selected");
      }

      teamsHolder.appendChild(teamHolder);
    });
  }

  if (userSelectedTeams.length < 8) {
    teamsHolder.style.flexDirection = "column";
  }

  var overlay = $(".overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  } else {
    var overlay = document.createElement("div");
    addClass(overlay, "overlay");
    document.body.appendChild(overlay);
  }

  addClass(teamsContainer, "popup");
  document.body.appendChild(teamsContainer);
  if (currentTeam) {
    var userTeamsHolder = $(".trade-proposal-user-teams-conatiner .user-teams-holder");
    if (userTeamsHolder) {
      var allTeams = userTeamsHolder.children;
      for (var team of allTeams) {
        if (team.dataset.teamname === currentTeam) {
          team.click();
          navNextBtn.click();
          break;
        }
      }
    }
  } else if (teams.length === 1) {
    navNextBtn.click();
  }
}

function selectTeamForUserTrade(e) {
  var selectedTeam = $(".user-teams-holder .team-btn.selected");
  if (selectedTeam) {
    removeClass(selectedTeam, "selected");
  }

  var target;
  if (e.target.classList.contains("team-btn")) {
    target = e.target;
  } else {
    target = e.target.parentElement;
  }

  addClass(target, "selected");
}

function closeTeamNeeds(e) {
  if (e.target.closest(".team-needs-container")) {
    const container = $(".team-needs-container");
    if (container) {
      container.remove();
    }

    const overlay = $(".overlay");
    if (overlay && !checkForAlreadyOpenPopup()) {
      addClass(overlay, "hidden");
    }
  }
}

function closeProposalPopup(e) {
  var container;
  if (e) {
    if (e.target.closest(".trade-proposal-user-teams-conatiner")) {
      container = $(".trade-proposal-user-teams-conatiner");
    } else if (e.target.closest(".trade-proposal-all-teams-conatiner")) {
      container = $(".trade-proposal-all-teams-conatiner");
    }
  } else {
    container = $(".trade-proposal-all-teams-conatiner");
  }

  if (container) {
    container.remove();
    if (multiUserDraft) {
      socket.emit("chat", {
        socketId: currentUserSocketId,
        roomId: currentRoomData.roomId,
        type: "proposal_cancelled",
      });
    }
  }

  const overlay = $(".overlay");
  if (overlay && !checkForAlreadyOpenPopup()) {
    addClass(overlay, "hidden");
  }
}

function showAllTeamsSelectionPopupForTradeProposal(offeringTeam, currentTeamPicks, offeringTeamPicks) {
  if (isPausingDraftRequired()) {
    pauseDraft();
  }
  var userTeamsSelectionContainer = $(".trade-proposal-user-teams-conatiner");
  var allTeamsForTradeEl = document.getElementById("all-teams-for-trade");
  if (!allTeamsForTradeEl) return;
  var allTeamsContainer = allTeamsForTradeEl.content.cloneNode(true);
  var teamsContainer = allTeamsContainer.querySelector(".trade-proposal-all-teams-conatiner");
  var navNextBtn = allTeamsContainer.querySelector(".nav-btn.next");
  navNextBtn.onclick = function () {
    showAvailablePicksForSelectedTeams(currentTeamPicks, offeringTeamPicks);
  };
  var closeBtn = allTeamsContainer.querySelector(".close-btn");
  closeBtn.onclick = closeProposalPopup;

  var userSelectedTeam = userTeamsSelectionContainer.querySelector(".team-btn.selected");
  var teamLogo = userSelectedTeam.dataset.teamlogo;
  var teamName = userSelectedTeam.dataset.teamname;
  if (userSelectedTeam) {
    var userTeamContainer = teamsContainer.querySelector(".competing-teams-container .user-team-container");
    if (userTeamContainer) {
      userTeamContainer.dataset.teamname = teamName;
      userTeamContainer.dataset.teamlogo = teamLogo;
    }
    var userTeamLogo = teamsContainer.querySelector(".competing-teams-container .user-team-container .team-logo");
    userTeamLogo.setAttribute("src", STATIC_URL + teamLogoPath + teamLogo + "?w=80&tag=" + imageRefreshTag);

    var userTeamName = teamsContainer.querySelector(".competing-teams-container .user-team-container .team-name");
    userTeamName.innerHTML = teamName;
  }

  var allTeamsHolder = allTeamsContainer.querySelector(".all-teams-container .all-teams-holder");
  if (allTeamsHolder) {
    teamsList.forEach(function (team) {
      var teamHolder = document.createElement("button");
      addClass(teamHolder, "team-btn");
      teamHolder.onclick = selectOppositionTeamForTrade;
      teamHolder.dataset.teamname = team.shortName;
      teamHolder.dataset.teamlogo = team.teamLogo;
      var teamName = document.createElement("span");
      addClass(teamName, "team-name");
      teamName.innerHTML = team.shortName;
      teamHolder.appendChild(teamName);

      var teamLogo = document.createElement("img");
      addClass(teamLogo, "team-logo");
      teamLogo.setAttribute("src", STATIC_URL + teamLogoPath + team.teamLogo + "?w=80&tag=" + imageRefreshTag);
      teamLogo.setAttribute("width", 25);
      teamLogo.setAttribute("alt", team.shortName);

      teamHolder.appendChild(teamLogo);
      var teamSelectedForTrade = $(".user-teams-container .user-teams-holder .team-btn.selected");
      if (team.shortName === teamSelectedForTrade.dataset.teamname || (multiUserDraft && counteredTeams.includes(team.shortName) && !offeringTeam)) {
        teamHolder.style.opacity = 0.4;
        teamHolder.style.cursor = "not-allowed";
        teamHolder.disabled = true;
      }

      if (multiUserDraft && currentRoomData.selectedTeams.includes(team.shortName)) {
        teamHolder.style.backgroundColor = "#E7F1FF";
      }

      allTeamsHolder.appendChild(teamHolder);
    });
  }

  userTeamsSelectionContainer.remove();

  addClass(teamsContainer, "popup");
  document.body.appendChild(teamsContainer);

  if (offeringTeam) {
    var allTeamsHolder = $(".trade-proposal-all-teams-conatiner .all-teams-holder");
    if (allTeamsHolder) {
      var allTeams = allTeamsHolder.children;
      for (var team of allTeams) {
        if (team.dataset.teamname === offeringTeam) {
          team.click();
          navNextBtn.disabled = false;
          navNextBtn.click();
          break;
        }
      }
    }
  }
}

function selectOppositionTeamForTrade(e) {
  var target;
  if (e.target.parentElement.classList.contains("team-btn")) {
    target = e.target.parentElement;
  } else {
    target = e.target;
  }

  var selectedTeam = $(".all-teams-holder .team-btn.selected");
  if (selectedTeam) {
    removeClass(selectedTeam, "selected");
  }

  addClass(target, "selected");
  var blankTeamContainer = $(".blank-team-container");
  if (blankTeamContainer) {
    addClass(blankTeamContainer, "hidden");
  }

  var opposingTeamContainer = $(".opposing-team-container");
  if (opposingTeamContainer) {
    removeClass(opposingTeamContainer, "hidden");
    opposingTeamContainer.dataset.teamname = target.dataset.teamname;
    opposingTeamContainer.dataset.teamlogo = target.dataset.teamlogo;
    var teamNameEl = opposingTeamContainer.querySelector(".team-name");
    if (teamNameEl) teamNameEl.innerHTML = target.dataset.teamname;
    var teamLogoEl2 = opposingTeamContainer.querySelector(".team-logo");
    if (teamLogoEl2) teamLogoEl2.setAttribute("src", STATIC_URL + teamLogoPath + target.dataset.teamlogo + "?w=80&tag=" + imageRefreshTag);
  }

  var navBtn = $(".trade-proposal-all-teams-conatiner .nav-btn-container .nav-btn.next");
  if (navBtn) {
    navBtn.setAttribute("opacity", 1);
    navBtn.disabled = false;
  }
}

function showAvailablePicksForSelectedTeams(currentTeamPicks, offeringTeamPicks) {
  var tradeProposalContainer = $(".trade-proposal-all-teams-conatiner");
  if (tradeProposalContainer) {
    var headerTextHolder = tradeProposalContainer.querySelector(".header-text");
    if (headerTextHolder) {
      headerTextHolder.innerHTML = "Select Pick(s)";
    }

    // Record counter-offer context on THIS freshly-cloned proposal container so the
    // trade-acceptance bar can detect counter offers reliably. A fresh manual proposal
    // clones a new container without these datasets, so their absence deterministically
    // means "not a counter-offer" — instead of relying on a stale, merely-hidden
    // .offer-container left behind by a previous AI offer.
    if (currentTeamPicks && offeringTeamPicks) {
      tradeProposalContainer.dataset.countergivingpicks = JSON.stringify(currentTeamPicks);
      tradeProposalContainer.dataset.countergettingpicks = JSON.stringify(offeringTeamPicks);
    } else {
      delete tradeProposalContainer.dataset.countergivingpicks;
      delete tradeProposalContainer.dataset.countergettingpicks;
    }

    var userTeamContainer = tradeProposalContainer.querySelector(".competing-teams-container .user-team-container");
    var userTeamName;
    if (userTeamContainer) {
      userTeamName = userTeamContainer.dataset.teamname;
    }

    var opposingTeamContainer = tradeProposalContainer.querySelector(".competing-teams-container .opposing-team-container");
    var opposingTeamName;
    if (opposingTeamContainer) {
      opposingTeamName = opposingTeamContainer.dataset.teamname;
    }

    var userTeamPicks;
    var opposingTeamPicks;
    for (var i = 0; i < teamsList.length; i++) {
      if (!userTeamPicks || !opposingTeamPicks) {
        if (teamsList[i].shortName === userTeamName) {
          userTeamPicks = teamsList[i].draftPicks;
        } else if (teamsList[i].shortName === opposingTeamName) {
          opposingTeamPicks = teamsList[i].draftPicks;
        }
      } else {
        break;
      }
    }

    userTeamPicks.sort(function (x, y) {
      if (x.number && y.number) {
        return x.number - y.number;
      } else if (!x.number && !y.number) {
        return parseInt(x.futureRound.charAt(0)) - parseInt(y.futureRound.charAt(0));
      } else if (!x.number || !y.number) {
        if (!x.number) {
          return 1;
        } else if (!y.number) {
          return -1;
        }
      }
    });

    opposingTeamPicks.sort(function (x, y) {
      if (x.number && y.number) {
        return x.number - y.number;
      } else if (!x.number && !y.number) {
        return parseInt(x.futureRound.charAt(0)) - parseInt(y.futureRound.charAt(0));
      } else if (!x.number || !y.number) {
        if (!x.number) {
          return 1;
        } else if (!y.number) {
          return -1;
        }
      }
    });

    var allTeamsContainer = tradeProposalContainer.querySelector(".all-teams-container");
    if (allTeamsContainer) {
      addClass(allTeamsContainer, "hidden");
    }

    var picksSelectionContainer = tradeProposalContainer.querySelector(".picks-container");
    if (picksSelectionContainer) {
      removeClass(picksSelectionContainer, "hidden");
      var currentYearUserPicksHolder = picksSelectionContainer.querySelector(".user-picks .current-year-picks .picks-holder");
      var nextYearUserPicksHolder = picksSelectionContainer.querySelector(".user-picks .next-year-picks .picks-holder");
      var currentYearOpposingTeamPicksHolder = picksSelectionContainer.querySelector(".opposing-team-picks .current-year-picks .picks-holder");
      var nextYearOpposingTeamPicksHolder = picksSelectionContainer.querySelector(".opposing-team-picks .next-year-picks .picks-holder");
      var futurePickYear;

      if (currentYearUserPicksHolder && nextYearUserPicksHolder && currentYearOpposingTeamPicksHolder && nextYearOpposingTeamPicksHolder) {
        currentYearUserPicksHolder.innerHTML = "";
        nextYearUserPicksHolder.innerHTML = "";
        currentYearOpposingTeamPicksHolder.innerHTML = "";
        nextYearOpposingTeamPicksHolder.innerHTML = "";

        // Populate player trade checkboxes
        var userPlayersHolder = picksSelectionContainer.querySelector(".user-picks .player-trades-section .players-holder");
        var opposingPlayersHolder = picksSelectionContainer.querySelector(".opposing-team-picks .player-trades-section .players-holder");
        var userPlayerSection = picksSelectionContainer.querySelector(".user-picks .player-trades-section");
        var opposingPlayerSection = picksSelectionContainer.querySelector(".opposing-team-picks .player-trades-section");
        var userPicksSection = picksSelectionContainer.querySelector(".user-picks .picks-section");
        var opposingPicksSection = picksSelectionContainer.querySelector(".opposing-team-picks .picks-section");
        var userHasPlayers = false;
        var opposingHasPlayers = false;

        if (userPlayersHolder) {
          userPlayersHolder.innerHTML = "";
          for (var p = 0; p < playerTrades.length; p++) {
            if (playerTrades[p].Team === userTeamName) {
              userHasPlayers = true;
              var input = document.createElement("input");
              input.setAttribute("type", "checkbox");
              input.dataset.for = "players";
              input.dataset.teamname = playerTrades[p].Team;
              input.dataset.playername = playerTrades[p].Player;
              input.dataset.position = playerTrades[p].Position;
              input.setAttribute("value", playerTrades[p].Value);
              var playerId = "player-" + playerTrades[p].Player.replace(/\s+/g, "-");
              input.setAttribute("id", playerId);
              input.setAttribute("name", playerId);
              input.addEventListener("change", enableTradeProposalProposeTradeButton);

              var label = document.createElement("label");
              label.setAttribute("for", playerId);
              label.innerHTML = formatPlayerName(playerTrades[p].Player, playerTrades[p].Position);

              var inputHolder = document.createElement("div");
              addClass(inputHolder, "picks-input-holder");
              inputHolder.dataset.teamname = playerTrades[p].Team;
              inputHolder.dataset.playername = playerTrades[p].Player;
              inputHolder.dataset.position = playerTrades[p].Position;
              inputHolder.appendChild(input);
              inputHolder.appendChild(label);
              userPlayersHolder.appendChild(inputHolder);
            }
          }
        }

        if (opposingPlayersHolder) {
          opposingPlayersHolder.innerHTML = "";
          for (var p = 0; p < playerTrades.length; p++) {
            if (playerTrades[p].Team === opposingTeamName) {
              opposingHasPlayers = true;
              var input = document.createElement("input");
              input.setAttribute("type", "checkbox");
              input.dataset.for = "players";
              input.dataset.teamname = playerTrades[p].Team;
              input.dataset.playername = playerTrades[p].Player;
              input.dataset.position = playerTrades[p].Position;
              input.setAttribute("value", playerTrades[p].Value);
              var playerId = "player-opp-" + playerTrades[p].Player.replace(/\s+/g, "-");
              input.setAttribute("id", playerId);
              input.setAttribute("name", playerId);
              input.addEventListener("change", enableTradeProposalProposeTradeButton);

              var label = document.createElement("label");
              label.setAttribute("for", playerId);
              label.innerHTML = formatPlayerName(playerTrades[p].Player, playerTrades[p].Position);

              var inputHolder = document.createElement("div");
              addClass(inputHolder, "picks-input-holder");
              inputHolder.dataset.teamname = playerTrades[p].Team;
              inputHolder.dataset.playername = playerTrades[p].Player;
              inputHolder.dataset.position = playerTrades[p].Position;
              inputHolder.appendChild(input);
              inputHolder.appendChild(label);
              opposingPlayersHolder.appendChild(inputHolder);
            }
          }
        }

        // Setup dropdowns - default to Picks view
        var userDropdown = picksSelectionContainer.querySelector('.user-picks .trade-type-select');
        var opposingDropdown = picksSelectionContainer.querySelector('.opposing-team-picks .trade-type-select');

        var separator = picksSelectionContainer.querySelector(".separator");

        function updateSeparatorHeight() {
          if (!separator) return;
          var userSide = picksSelectionContainer.querySelector(".user-picks");
          var opposingSide = picksSelectionContainer.querySelector(".opposing-team-picks");
          var maxH = Math.max(userSide ? userSide.scrollHeight : 0, opposingSide ? opposingSide.scrollHeight : 0);
          separator.style.height = maxH ? maxH + "px" : "auto";
        }

        if (userDropdown) {
          userDropdown.value = "picks";
          if (!userHasPlayers) {
            addClass(userDropdown.parentElement, "hidden");
          } else {
            removeClass(userDropdown.parentElement, "hidden");
          }
          userDropdown.addEventListener("change", function () {
            if (this.value === "players") {
              addClass(userPicksSection, "hidden");
              removeClass(userPlayerSection, "hidden");
            } else {
              removeClass(userPicksSection, "hidden");
              addClass(userPlayerSection, "hidden");
            }
            setTimeout(updateSeparatorHeight, 0);
          });
        }
        // Default state: show picks, hide players
        if (userPicksSection) removeClass(userPicksSection, "hidden");
        if (userPlayerSection) addClass(userPlayerSection, "hidden");

        if (opposingDropdown) {
          opposingDropdown.value = "picks";
          if (!opposingHasPlayers) {
            addClass(opposingDropdown.parentElement, "hidden");
          } else {
            removeClass(opposingDropdown.parentElement, "hidden");
          }
          opposingDropdown.addEventListener("change", function () {
            if (this.value === "players") {
              addClass(opposingPicksSection, "hidden");
              removeClass(opposingPlayerSection, "hidden");
            } else {
              removeClass(opposingPicksSection, "hidden");
              addClass(opposingPlayerSection, "hidden");
            }
            setTimeout(updateSeparatorHeight, 0);
          });
        }
        // Default state: show picks, hide players
        if (opposingPicksSection) removeClass(opposingPicksSection, "hidden");
        if (opposingPlayerSection) addClass(opposingPlayerSection, "hidden");

        setTimeout(updateSeparatorHeight, 0);

        for (var i = 0; i < userTeamPicks.length; i++) {
          if (!futurePickYear) {
            if (userTeamPicks[i].futurePickYear) {
              futurePickYear = userTeamPicks[i].futurePickYear;
            }
          }
          if (!userTeamPicks[i].playerSelection) {
            var input = document.createElement("input");
            input.dataset.for = "picks";
            input.dataset.futurepick = userTeamPicks[i].futurePick;
            input.dataset.teamname = userTeamPicks[i].currentTeam.shortName;
            input.dataset.futureoriginalteam = userTeamPicks[i].futureOriginalTeam;
            input.dataset.number = userTeamPicks[i].number;
            input.dataset.futurepickyear = userTeamPicks[i].futurePickYear;
            input.dataset.futureround = userTeamPicks[i].futureRound;
            input.addEventListener("change", enableTradeProposalProposeTradeButton);
            input.setAttribute("type", "checkbox");
            var teamName = "";
            if (!userTeamPicks[i].number) {
              teamName = userTeamPicks[i].futureOriginalTeam;
            } else {
              teamName = userTeamPicks[i].originalTeam.shortName;
            }

            var id = userTeamPicks[i].number ? userTeamPicks[i].number : userTeamPicks[i].futureRound;
            input.setAttribute("id", teamName + " " + id);
            input.setAttribute("name", teamName + " " + id);
            input.setAttribute("value", userTeamPicks[i].value);

            var label = document.createElement("label");
            label.setAttribute("for", teamName + " " + id);

            var inputHolder = document.createElement("div");
            addClass(inputHolder, "picks-input-holder");
            inputHolder.dataset.teamname = userTeamPicks[i].currentTeam.shortName;
            inputHolder.dataset.futureoriginalteam = userTeamPicks[i].futureOriginalTeam;
            inputHolder.dataset.number = userTeamPicks[i].number;
            inputHolder.dataset.futurepickyear = userTeamPicks[i].futurePickYear;
            inputHolder.dataset.futureround = userTeamPicks[i].futureRound;
            inputHolder.appendChild(input);
            inputHolder.appendChild(label);

            if (userTeamPicks[i].number) {
              label.innerHTML = userTeamPicks[i].number;
              currentYearUserPicksHolder.appendChild(inputHolder);
            } else {
              label.innerHTML = userTeamPicks[i].futureOriginalTeam + " " + userTeamPicks[i].futureRound;
              nextYearUserPicksHolder.appendChild(inputHolder);
            }
          }
        }

        for (var i = 0; i < opposingTeamPicks.length; i++) {
          if (!futurePickYear) {
            if (opposingTeamPicks[i].futurePickYear) {
              futurePickYear = opposingTeamPicks[i].futurePickYear;
            }
          }
          if (!opposingTeamPicks[i].playerSelection) {
            var input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.dataset.for = "picks";
            input.dataset.futurepick = opposingTeamPicks[i].futurePick;
            input.dataset.teamname = opposingTeamPicks[i].currentTeam.shortName;
            input.dataset.futureoriginalteam = opposingTeamPicks[i].futureOriginalTeam;
            input.dataset.number = opposingTeamPicks[i].number;
            input.dataset.futurepickyear = opposingTeamPicks[i].futurePickYear;
            input.dataset.futureround = opposingTeamPicks[i].futureRound;
            input.addEventListener("change", enableTradeProposalProposeTradeButton);
            var teamName = "";
            if (!opposingTeamPicks[i].number) {
              teamName = opposingTeamPicks[i].futureOriginalTeam;
            } else {
              teamName = opposingTeamPicks[i].originalTeam.shortName;
            }
            var id = opposingTeamPicks[i].number ? opposingTeamPicks[i].number : opposingTeamPicks[i].futureRound;
            input.setAttribute("id", teamName + " " + id);
            input.setAttribute("name", teamName + " " + id);
            input.setAttribute("value", opposingTeamPicks[i].value);

            var label = document.createElement("label");
            label.setAttribute("for", teamName + " " + id);

            var inputHolder = document.createElement("div");
            addClass(inputHolder, "picks-input-holder");
            inputHolder.dataset.teamname = opposingTeamPicks[i].currentTeam.shortName;
            inputHolder.dataset.futureoriginalteam = opposingTeamPicks[i].futureOriginalTeam;
            inputHolder.dataset.number = opposingTeamPicks[i].number;
            inputHolder.dataset.futurepickyear = opposingTeamPicks[i].futurePickYear;
            inputHolder.dataset.futureround = opposingTeamPicks[i].futureRound;
            inputHolder.appendChild(input);
            inputHolder.appendChild(label);

            if (opposingTeamPicks[i].number) {
              label.innerHTML = opposingTeamPicks[i].number;
              currentYearOpposingTeamPicksHolder.appendChild(inputHolder);
            } else {
              label.innerHTML = opposingTeamPicks[i].futureOriginalTeam + " " + opposingTeamPicks[i].futureRound;
              nextYearOpposingTeamPicksHolder.appendChild(inputHolder);
            }
          }
        }
      }

      var nextYearTextHolders = $all(".next-year-picks .text");
      nextYearTextHolders[0].innerHTML = futurePickYear;
      nextYearTextHolders[1].innerHTML = futurePickYear;
    }

    var confirmBtn = $(".nav-btn-container .nav-btn.next");
    if (confirmBtn) {
      addClass(confirmBtn, "hidden");
    }

    var backBtn = $(".nav-btn-container .nav-btn.back");
    if (backBtn) {
      removeClass(backBtn, "hidden");
      backBtn.onclick = showAllTeamsForUserSelection;
    }

    var proposeBtn = $(".nav-btn-container .nav-btn.propose");
    if (proposeBtn) {
      removeClass(proposeBtn, "hidden");
      let newProposeBtn = proposeBtn.cloneNode(true);
      proposeBtn.parentNode.replaceChild(newProposeBtn, proposeBtn);
      if (currentTeamPicks && offeringTeamPicks) {
        newProposeBtn.onclick = function () {
          showTradeConfirmationInfo(true);
        };
      } else {
        newProposeBtn.onclick = function () {
          showTradeConfirmationInfo(false);
        };
      }
    }

    if (currentTeamPicks && offeringTeamPicks && offeringTeamPicks.team == opposingTeamName) {
      var allCurrentTeamPicks = $all(".trade-proposal-all-teams-conatiner .user-picks .current-year-picks input");
      var allOfferingTeamPicks = $all(".trade-proposal-all-teams-conatiner .opposing-team-picks .current-year-picks input");
      var allCurrentTeamFuturePicks = $all(".trade-proposal-all-teams-conatiner .user-picks .next-year-picks input");
      var allOfferingTeamFuturePicks = $all(".trade-proposal-all-teams-conatiner .opposing-team-picks .next-year-picks input");

      if (currentTeamPicks.picks) {
        for (var teamPick of allCurrentTeamPicks) {
          for (var i = 0; i < currentTeamPicks.picks.length; i++) {
            if (currentTeamPicks.picks[i] === parseInt(teamPick.dataset.number)) {
              teamPick.checked = true;
            }
          }
        }
      }

      if (currentTeamPicks.futurePicks) {
        for (var teamPick of allCurrentTeamFuturePicks) {
          for (var i = 0; i < currentTeamPicks.futurePicks.length; i++) {
            var futureArray = currentTeamPicks.futurePicks[i].split("-");
            if (futureArray[0] == teamPick.dataset.futureround && futureArray[1] == teamPick.dataset.futurepickyear && futureArray[2] == teamPick.dataset.futureoriginalteam) {
              teamPick.checked = true;
            }
          }
        }
      }

      if (offeringTeamPicks.picks) {
        for (var teamPick of allOfferingTeamPicks) {
          for (var i = 0; i < offeringTeamPicks.picks.length; i++) {
            if (offeringTeamPicks.picks[i] === parseInt(teamPick.dataset.number)) {
              teamPick.checked = true;
            }
          }
        }
      }

      if (offeringTeamPicks.futurePicks) {
        for (var teamPick of allOfferingTeamFuturePicks) {
          for (var i = 0; i < offeringTeamPicks.futurePicks.length; i++) {
            var futureArray = offeringTeamPicks.futurePicks[i].split("-");
            if (futureArray[0] == teamPick.dataset.futureround && futureArray[1] == teamPick.dataset.futurepickyear && futureArray[2] == teamPick.dataset.futureoriginalteam) {
              teamPick.checked = true;
            }
          }
        }
      }

      if (currentTeamPicks.players && currentTeamPicks.players.length) {
        var allCurrentTeamPlayerInputs = $all(".trade-proposal-all-teams-conatiner .user-picks .player-trades-section input[data-for='players']");
        for (var playerInput of allCurrentTeamPlayerInputs) {
          for (var i = 0; i < currentTeamPicks.players.length; i++) {
            if (currentTeamPicks.players[i] === playerInput.dataset.playername) {
              playerInput.checked = true;
            }
          }
        }
      }

      if (offeringTeamPicks.players && offeringTeamPicks.players.length) {
        var allOfferingTeamPlayerInputs = $all(".trade-proposal-all-teams-conatiner .opposing-team-picks .player-trades-section input[data-for='players']");
        for (var playerInput of allOfferingTeamPlayerInputs) {
          for (var i = 0; i < offeringTeamPicks.players.length; i++) {
            if (offeringTeamPicks.players[i] === playerInput.dataset.playername) {
              playerInput.checked = true;
            }
          }
        }
      }

      var proposeTradeBtn = $(".nav-btn.propose");
      if (proposeTradeBtn) {
        proposeTradeBtn.disabled = false;
        proposeTradeBtn.style.opacity = 1;
        proposeTradeBtn.style.cursor = "pointer";
      }

      updateTradeProgressBar();
    }
  }
}

function showTradeConfirmationInfo(counterOffer) {
  var tradeProposalContainer = $(".trade-proposal-all-teams-conatiner");
  if (tradeProposalContainer) {
    var headerTextHolder = tradeProposalContainer.querySelector(".header-text");
    if (headerTextHolder) {
      headerTextHolder.innerHTML = "Confirm Proposal";
    }
    var picksSelectionContainer = tradeProposalContainer.querySelector(".picks-container");
    if (picksSelectionContainer) {
      addClass(picksSelectionContainer, "hidden");
    }

    var progressContainer = tradeProposalContainer.querySelector(".trade-progress-container");
    if (progressContainer) {
      addClass(progressContainer, "hidden");
    }

    var confirmationInfoContainer = tradeProposalContainer.querySelector(".picks-confirmation-container");
    if (confirmationInfoContainer) {
      removeClass(confirmationInfoContainer, "hidden");
      var userPicks = picksSelectionContainer.querySelector(".user-picks");
      var userSelectedPicks = userPicks.querySelectorAll('input[data-for="picks"]:checked');
      var userSelectedPlayers = userPicks.querySelectorAll('input[data-for="players"]:checked');
      var opposingTeamPicks = picksSelectionContainer.querySelector(".opposing-team-picks");
      var opposingTeamSelectedPicks = opposingTeamPicks.querySelectorAll('input[data-for="picks"]:checked');
      var opposingTeamSelectedPlayers = opposingTeamPicks.querySelectorAll('input[data-for="players"]:checked');

      if ((userSelectedPicks.length || userSelectedPlayers.length) && (opposingTeamSelectedPicks.length || opposingTeamSelectedPlayers.length)) {
        var userPicksHolder = confirmationInfoContainer.querySelector(".user-picks-holder");
        if (userPicksHolder) {
          userPicksHolder.innerHTML = "";
          for (var i = 0; i < userSelectedPicks.length; i++) {
            var dataset = userSelectedPicks[i].dataset;
            var pickHolder = document.createElement("span");
            addClass(pickHolder, "confirmation-pick");
            if (dataset.number) {
              pickHolder.innerHTML = "Pick " + dataset.number;
            } else {
              pickHolder.innerHTML = dataset.futurepickyear + " " + dataset.futureoriginalteam + " " + dataset.futureround;
            }

            userPicksHolder.appendChild(pickHolder);
          }
          for (var i = 0; i < userSelectedPlayers.length; i++) {
            var dataset = userSelectedPlayers[i].dataset;
            var pickHolder = document.createElement("span");
            addClass(pickHolder, "confirmation-pick");
            pickHolder.innerHTML = formatPlayerName(dataset.playername, dataset.position);
            userPicksHolder.appendChild(pickHolder);
          }
        }

        var opposingTeamPicksHolder = confirmationInfoContainer.querySelector(".opposing-team-picks-holder");
        if (opposingTeamPicksHolder) {
          opposingTeamPicksHolder.innerHTML = "";
          for (var i = 0; i < opposingTeamSelectedPicks.length; i++) {
            var dataset = opposingTeamSelectedPicks[i].dataset;
            var pickHolder = document.createElement("span");
            addClass(pickHolder, "confirmation-pick");
            if (dataset.number) {
              pickHolder.innerHTML = "Pick " + dataset.number;
            } else {
              pickHolder.innerHTML = dataset.futurepickyear + " " + dataset.futureoriginalteam + " " + dataset.futureround;
            }

            opposingTeamPicksHolder.appendChild(pickHolder);
          }
          for (var i = 0; i < opposingTeamSelectedPlayers.length; i++) {
            var dataset = opposingTeamSelectedPlayers[i].dataset;
            var pickHolder = document.createElement("span");
            addClass(pickHolder, "confirmation-pick");
            pickHolder.innerHTML = formatPlayerName(dataset.playername, dataset.position);
            opposingTeamPicksHolder.appendChild(pickHolder);
          }
        }

        // Populate trade value comparison widget
        var confirmValueComparison = confirmationInfoContainer.querySelector(".trade-value-comparison");
        if (confirmValueComparison) {
          var confirmUserPicksValue = 0;
          var confirmOpposingPicksValue = 0;
          for (var i = 0; i < userSelectedPicks.length; i++) {
            confirmUserPicksValue += parseInt(userSelectedPicks[i].value) || 0;
          }
          for (var i = 0; i < userSelectedPlayers.length; i++) {
            confirmUserPicksValue += parseInt(userSelectedPlayers[i].value) || 0;
          }
          for (var i = 0; i < opposingTeamSelectedPicks.length; i++) {
            confirmOpposingPicksValue += parseInt(opposingTeamSelectedPicks[i].value) || 0;
          }
          for (var i = 0; i < opposingTeamSelectedPlayers.length; i++) {
            confirmOpposingPicksValue += parseInt(opposingTeamSelectedPlayers[i].value) || 0;
          }

          var positiveUserValue = Math.max(0, confirmUserPicksValue);
          var positiveOpposingValue = Math.max(0, confirmOpposingPicksValue);
          var confirmTotalValue = positiveUserValue + positiveOpposingValue;
          var confirmUserPercent = confirmTotalValue > 0 ? (positiveUserValue / confirmTotalValue * 100).toFixed(1) : "0.0";
          var confirmOpposingPercent = confirmTotalValue > 0 ? (positiveOpposingValue / confirmTotalValue * 100).toFixed(1) : "0.0";

          var confirmUserSection = confirmValueComparison.querySelector(".trade-value-team.user-value");
          if (confirmUserSection) {
            var confirmUserPoints = confirmUserSection.querySelector(".trade-value-points");
            if (confirmUserPoints) {
              confirmUserPoints.textContent = confirmUserPicksValue;
            }
          }

          var confirmOpposingSection = confirmValueComparison.querySelector(".trade-value-team.opposing-value");
          if (confirmOpposingSection) {
            var confirmOpposingPoints = confirmOpposingSection.querySelector(".trade-value-points");
            if (confirmOpposingPoints) {
              confirmOpposingPoints.textContent = confirmOpposingPicksValue;
            }
          }

          var confirmBarUser = confirmValueComparison.querySelector(".trade-value-bar-user");
          var confirmBarOpposing = confirmValueComparison.querySelector(".trade-value-bar-opposing");
          if (confirmBarUser && confirmBarOpposing) {
            confirmBarUser.style.width = confirmUserPercent + "%";
            var confirmBarUserPercent = confirmBarUser.querySelector(".trade-value-bar-percent");
            if (confirmBarUserPercent) {
              confirmBarUserPercent.textContent = confirmUserPercent + "%";
            }
            confirmBarOpposing.style.width = confirmOpposingPercent + "%";
            var confirmBarOpposingPercent = confirmBarOpposing.querySelector(".trade-value-bar-percent");
            if (confirmBarOpposingPercent) {
              confirmBarOpposingPercent.textContent = confirmOpposingPercent + "%";
            }
          }
        }
      }
    }

    var proposeBtn = $(".nav-btn-container .nav-btn.propose");
    if (proposeBtn) {
      addClass(proposeBtn, "hidden");
    }

    var confirmBtn = $(".nav-btn-container .nav-btn.confirm");
    if (confirmBtn) {
      removeClass(confirmBtn, "hidden");
      if (confirmTradeListener) {
        confirmBtn.removeEventListener("click", confirmTradeListener);
      }
      confirmTradeListener = function () {
        checkUserTradePossibility(counterOffer);
      };
      confirmBtn.onclick = confirmTradeListener;
    }

    var backBtn = $(".nav-btn-container .nav-btn.back");
    if (backBtn) {
      backBtn.onclick = unhidePicksForUserSelection;
    }
  }
}

function unhidePicksForUserSelection() {
  var picksConfirmationContainer = $(".trade-proposal-all-teams-conatiner .picks-confirmation-container");
  if (picksConfirmationContainer) {
    var tradeProposalContainer = $(".trade-proposal-all-teams-conatiner");
    if (tradeProposalContainer) {
      var headerTextHolder = tradeProposalContainer.querySelector(".header-text");
      if (headerTextHolder) {
        headerTextHolder.innerHTML = "Select Pick(s)";
      }
    }

    if (picksConfirmationContainer) {
      addClass(picksConfirmationContainer, "hidden");
    }

    var picksContainer = $(".trade-proposal-all-teams-conatiner .picks-container");
    if (picksContainer) {
      removeClass(picksContainer, "hidden");
    }

    updateTradeProgressBar();

    var backBtn = $(".nav-btn-container .nav-btn.back");
    if (backBtn) {
      backBtn.onclick = showAllTeamsForUserSelection;
    }

    var proposeBtn = $(".nav-btn-container .nav-btn.propose");
    if (proposeBtn) {
      removeClass(proposeBtn, "hidden");
    }

    var confirmBtn = $(".nav-btn-container .nav-btn.confirm");
    if (confirmBtn) {
      addClass(confirmBtn, "hidden");
      if (confirmTradeListener) {
        confirmBtn.removeEventListener("click", confirmTradeListener);
        confirmTradeListener = null;
      }
    }
  }
}

function getCurrentPickContainer() {
  var currentPick = getCurrentPick().currentPick;
  let currentPickNumber;
  if (multiUserDraft) {
    currentPickNumber = currentMultiUserPick;
  } else {
    currentPickNumber = currentPick.number;
  }

  var currentPickContainer = $(".pick-number-" + currentPickNumber);
  if (currentPickContainer) {
    return currentPickContainer;
  }
}

function checkUserTradePossibility(counterOffer) {
  let tradeProposalContainer = $(".trade-proposal-all-teams-conatiner");
  if (tradeProposalContainer) {
    var picksSelectionContainer = tradeProposalContainer.querySelector(".picks-container");
    let opposingTeamContainer = tradeProposalContainer.querySelector(".opposing-team-container");
    let opposingTeamName;
    if (opposingTeamContainer) {
      opposingTeamName = opposingTeamContainer.dataset.teamname;
    }
    let userTeamContainer = tradeProposalContainer.querySelector(".user-team-container");
    let userTeamName;
    if (userTeamContainer) {
      userTeamName = userTeamContainer.dataset.teamname;
    }
    var userPicks = picksSelectionContainer.querySelector(".user-picks");
    var userSelectedPicks = userPicks.querySelectorAll('input[data-for="picks"]:checked');
    var userSelectedPlayers = userPicks.querySelectorAll('input[data-for="players"]:checked');
    var opposingTeamPicks = picksSelectionContainer.querySelector(".opposing-team-picks");
    var opposingTeamSelectedPicks = opposingTeamPicks.querySelectorAll('input[data-for="picks"]:checked');
    var opposingTeamSelectedPlayers = opposingTeamPicks.querySelectorAll('input[data-for="players"]:checked');
    let currentPick = getCurrentPick().currentPick;
    let currentPickTeam = currentPick.currentTeam.shortName;
    let currentPickNumber = parseInt(currentPick.number);
    let currentPickIncludedInTrade = false;

    if ((multiUserDraft && currentRoomData && !currentRoomData.selectedTeams.includes(opposingTeamName)) || !multiUserDraft) {
      if ((userSelectedPicks.length || userSelectedPlayers.length) && (opposingTeamSelectedPicks.length || opposingTeamSelectedPlayers.length)) {
        var tradeAccepted = false;
        var userPicksValue = 0;
        var opposingTeamPicksValue = 0;
        for (var i = 0; i < userSelectedPicks.length; i++) {
          if (userSelectedPicks[i].dataset.number == currentPickNumber) {
            currentPickIncludedInTrade = true;
          }
          userPicksValue += parseInt(userSelectedPicks[i].value);
        }

        for (var i = 0; i < opposingTeamSelectedPicks.length; i++) {
          opposingTeamPicksValue += parseInt(opposingTeamSelectedPicks[i].value);
        }

        for (var i = 0; i < userSelectedPlayers.length; i++) {
          userPicksValue += parseInt(userSelectedPlayers[i].value);
        }

        for (var i = 0; i < opposingTeamSelectedPlayers.length; i++) {
          opposingTeamPicksValue += parseInt(opposingTeamSelectedPlayers[i].value);
        }

        if (counterOffer) {
          var offerContainer = $(".offer-container");
          if (offerContainer) {
            var dataset = offerContainer.dataset;
            var currentTeamPicks = JSON.parse(dataset.currentteamgivingpicks);
            var offeringTeamPicks = JSON.parse(dataset.currentteamgettingpicks);
            var originalPackageRatio = offeringTeamPicks.value / currentTeamPicks.value;
            var oddsOfOfferingMore = Math.floor(Math.random() * 100);
            var newPackageRatio = opposingTeamPicksValue / userPicksValue;
            if (
              newPackageRatio === originalPackageRatio ||
              (oddsOfOfferingMore < 50
                ? newPackageRatio < originalPackageRatio
                : oddsOfOfferingMore < 85
                  ? newPackageRatio < originalPackageRatio + 0.05
                  : newPackageRatio < originalPackageRatio + 0.15)
            ) {
              tradeAccepted = true;
            } else {
              tradeAccepted = false;
            }
          } else {
            tradeAccepted = false;
          }
        } else {
          var opposingPickNum = opposingTeamSelectedPicks.length ? parseInt(opposingTeamSelectedPicks[0].dataset.number) : NaN;
          var userPickNum = userSelectedPicks.length ? parseInt(userSelectedPicks[0].dataset.number) : NaN;
          var highestValuePick;

          if (!isNaN(opposingPickNum) && !isNaN(userPickNum)) {
            highestValuePick = Math.min(opposingPickNum, userPickNum);
          } else if (!isNaN(opposingPickNum)) {
            highestValuePick = opposingPickNum;
          } else if (!isNaN(userPickNum)) {
            highestValuePick = userPickNum;
          }

          if (highestValuePick !== undefined) {
            if ((highestValuePick < 3 && userPicksValue >= opposingTeamPicksValue * 1) ||
              (highestValuePick >= 3 && highestValuePick < 11 && userPicksValue > opposingTeamPicksValue * 0.99) ||
              (highestValuePick >= 11 && highestValuePick < 33 && userPicksValue > opposingTeamPicksValue * 0.975) ||
              (highestValuePick >= 33 && userPicksValue > opposingTeamPicksValue * 0.95)) {
              tradeAccepted = true;
            }
          } else {
            if (userPicksValue > opposingTeamPicksValue * 0.95) {
              tradeAccepted = true;
            }
          }
        }

        let closeProposalContainerBtn = $(".trade-proposal-all-teams-conatiner .close-btn");
        if (closeProposalContainerBtn) {
          addClass(closeProposalContainerBtn, "hidden");
        }

        if (tradeAccepted) {
          if (!multiUserDraft) {
            draftHistory.push(createDraftSnapshot());
          }
          if (mdsUserIsLoggedIn && mdsLoggedInUserId && !multiUserDraft) {
            pendingDashboardEvents.push({
              userId: mdsLoggedInUserId,
              draftType: getDraftType(),
              properties: [{
                propertyName: "tradesInitiatedCount",
                propertyValue: 1,
              }]
            });
            pendingDashboardEvents.push({
              userId: mdsLoggedInUserId,
              draftType: getDraftType(),
              properties: [{
                propertyName: "tradesCompletedCount",
                propertyValue: 1,
              }]
            });
          }
          tradesCompletedCount++;
          var givingTeam;
          var gettingTeam;
          for (var i = 0; i < teamsList.length; i++) {
            if (!givingTeam || !gettingTeam) {
              if (userTeamName === teamsList[i].shortName) {
                givingTeam = teamsList[i];
              }

              if (opposingTeamName === teamsList[i].shortName) {
                gettingTeam = teamsList[i];
              }
            } else {
              break;
            }
          }
          var givingPicks = [];
          var gettingPicks = [];
          if (userSelectedPicks.length || opposingTeamSelectedPicks.length) {
            for (var i = 0; i < teamsList.length; i++) {
              if (userSelectedPicks.length && userSelectedPicks[0].dataset.teamname === teamsList[i].shortName) {
                for (var j = 0; j < teamsList[i].draftPicks.length; j++) {
                  for (var k = 0; k < userSelectedPicks.length; k++) {
                    if ((!teamsList[i].draftPicks[j].number || teamsList[i].draftPicks[j].number === parseInt(userSelectedPicks[k].dataset.number)) && teamsList[i].draftPicks[j].futureRound === userSelectedPicks[k].dataset.futureround && teamsList[i].draftPicks[j].futureOriginalTeam === userSelectedPicks[k].dataset.futureoriginalteam) {
                      givingPicks.push(teamsList[i].draftPicks[j]);
                      if (!multiUserDraft) {
                        teamsList[i].draftPicks[j].currentTeam = gettingTeam;
                        teamsList[i].draftPicks.splice(j, 1);
                      }
                    }
                  }
                }
              }

              if (opposingTeamSelectedPicks.length && opposingTeamSelectedPicks[0].dataset.teamname === teamsList[i].shortName) {
                for (var j = 0; j < teamsList[i].draftPicks.length; j++) {
                  for (var k = 0; k < opposingTeamSelectedPicks.length; k++) {
                    if ((!teamsList[i].draftPicks[j].number || teamsList[i].draftPicks[j].number === parseInt(opposingTeamSelectedPicks[k].dataset.number)) && teamsList[i].draftPicks[j].futureRound === opposingTeamSelectedPicks[k].dataset.futureround && teamsList[i].draftPicks[j].futureOriginalTeam === opposingTeamSelectedPicks[k].dataset.futureoriginalteam) {
                      gettingPicks.push(teamsList[i].draftPicks[j]);
                      if (!multiUserDraft) {
                        teamsList[i].draftPicks[j].currentTeam = givingTeam;
                        teamsList[i].draftPicks.splice(j, 1);
                      }
                    }
                  }
                }
              }
            }

            for (var i = 0; i < givingPicks.length; i++) {
              givingPicks[i].tradedPick = true;
              if (!multiUserDraft) {
                gettingTeam.draftPicks.push(givingPicks[i]);
              }
            }

            for (var i = 0; i < gettingPicks.length; i++) {
              gettingPicks[i].tradedPick = true;
              if (!multiUserDraft) {
                givingTeam.draftPicks.push(gettingPicks[i]);
              }
            }

            gettingTeam.draftPicks.sort(function (x, y) {
              if (x.number && y.number) {
                return x.number - y.number;
              } else if (!x.number && !y.number) {
                return parseInt(x.futureRound.charAt(0)) - parseInt(y.futureRound.charAt(0));
              } else if (!x.number || !y.number) {
                if (!x.number) {
                  return 1;
                } else if (!y.number) {
                  return -1;
                }
              }
            });

            givingTeam.draftPicks.sort(function (x, y) {
              if (x.number && y.number) {
                return x.number - y.number;
              } else if (!x.number && !y.number) {
                return parseInt(x.futureRound.charAt(0)) - parseInt(y.futureRound.charAt(0));
              } else if (!x.number || !y.number) {
                if (!x.number) {
                  return 1;
                } else if (!y.number) {
                  return -1;
                }
              }
            });
          }

          if (multiUserDraft) {
            let acceptedOffer = {
              allUserPicksToTrade: [],
              offerList: [],
              offerPlayersList: [],
              allUserPlayersToTrade: [],
              offeringTeamShortName: opposingTeamName,
              currentTeamName: userTeamName,
              pickNumber: currentMultiUserPick,
              roomId: currentRoomData.roomId,
            };

            givingPicks.forEach(givingPick => {
              let pick = {
                number: givingPick.number,
                futureRound: givingPick.futureRound,
                futurePickYear: givingPick.futurePickYear,
                futureOriginalTeam: givingPick.futureOriginalTeam,
              }

              acceptedOffer.allUserPicksToTrade.push(pick);
            });

            gettingPicks.forEach(gettingPick => {
              let pick = {
                number: gettingPick.number,
                futureRound: gettingPick.futureRound,
                futurePickYear: gettingPick.futurePickYear,
                futureOriginalTeam: gettingPick.futureOriginalTeam,
              }

              acceptedOffer.offerList.push(pick);
            });

            for (var i = 0; i < userSelectedPlayers.length; i++) {
              acceptedOffer.allUserPlayersToTrade.push({
                playerName: userSelectedPlayers[i].dataset.playername,
                position: userSelectedPlayers[i].dataset.position,
                teamName: userSelectedPlayers[i].dataset.teamname,
                value: parseInt(userSelectedPlayers[i].value)
              });
            }
            for (var i = 0; i < opposingTeamSelectedPlayers.length; i++) {
              acceptedOffer.offerPlayersList.push({
                playerName: opposingTeamSelectedPlayers[i].dataset.playername,
                position: opposingTeamSelectedPlayers[i].dataset.position,
                teamName: opposingTeamSelectedPlayers[i].dataset.teamname,
                value: parseInt(opposingTeamSelectedPlayers[i].value)
              });
            }

            let offerAcceptedByTeamName;
            if (userSelectedTeams.includes(acceptedOffer.currentTeamName)) {
              offerAcceptedByTeamName = acceptedOffer.offeringTeamShortName;
            } else {
              offerAcceptedByTeamName = acceptedOffer.currentTeamName;
            }

            revertCommonCounteredTradeOffers(acceptedOffer, offerAcceptedByTeamName, "offer-accepted");

            let remainingOffers = [];

            offersList.forEach(offer => {
              let commonFound = false;
              for (let i = 0; i < offer.allUserPicksToTrade.length; i++) {
                if (!commonFound) {
                  for (let j = 0; j < acceptedOffer.offerList.length; j++) {
                    if (offer.allUserPicksToTrade[i].number === acceptedOffer.offerList[j].number && offer.allUserPicksToTrade[i].futureRound === acceptedOffer.offerList[j].futureRound &&
                      offer.allUserPicksToTrade[i].futurePickYear === acceptedOffer.offerList[j].futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === acceptedOffer.offerList[j].futureOriginalTeam) {
                      commonFound = true;
                      break;
                    }
                  }
                }

                if (!commonFound) {
                  for (let j = 0; j < acceptedOffer.allUserPicksToTrade.length; j++) {
                    if (offer.allUserPicksToTrade[i].number === acceptedOffer.allUserPicksToTrade[j].number && offer.allUserPicksToTrade[i].futureRound === acceptedOffer.allUserPicksToTrade[j].futureRound &&
                      offer.allUserPicksToTrade[i].futurePickYear === acceptedOffer.allUserPicksToTrade[j].futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === acceptedOffer.allUserPicksToTrade[j].futureOriginalTeam) {
                      commonFound = true;
                      break;
                    }
                  }
                }
              }

              if (!commonFound) {
                for (let i = 0; i < offer.offerList.length; i++) {
                  if (!commonFound) {
                    for (let j = 0; j < acceptedOffer.offerList.length; j++) {
                      if (offer.offerList[i].number === acceptedOffer.offerList[j].number && offer.offerList[i].futureRound === acceptedOffer.offerList[j].futureRound &&
                        offer.offerList[i].futurePickYear === acceptedOffer.offerList[j].futurePickYear && offer.offerList[i].futureOriginalTeam === acceptedOffer.offerList[j].futureOriginalTeam) {
                        commonFound = true;
                        break;
                      }
                    }
                  }

                  if (!commonFound) {
                    for (let j = 0; j < acceptedOffer.allUserPicksToTrade.length; j++) {
                      if (offer.offerList[i].number === acceptedOffer.allUserPicksToTrade[j].number && offer.offerList[i].futureRound === acceptedOffer.allUserPicksToTrade[j].futureRound &&
                        offer.offerList[i].futurePickYear === acceptedOffer.allUserPicksToTrade[j].futurePickYear && offer.offerList[i].futureOriginalTeam === acceptedOffer.allUserPicksToTrade[j].futureOriginalTeam) {
                        commonFound = true;
                        break;
                      }
                    }
                  }
                }
              }

              if (!commonFound) {
                remainingOffers.push(offer);
              } else {
                let counteredTeamIndex = counteredTeams.findIndex(teamName => offer.shortName === teamName);
                if (counteredTeamIndex > -1) {
                  counteredTeams.splice(counteredTeamIndex, 1);
                }
              }
            });

            offersList = [...remainingOffers];
            remainingOffers.length = 0;

            multiUserSystemOffersList.forEach(offer => {
              let commonFound = false;
              for (let i = 0; i < offer.allUserPicksToTrade.length; i++) {
                if (!commonFound) {
                  for (let j = 0; j < acceptedOffer.offerList.length; j++) {
                    if (offer.allUserPicksToTrade[i].number === acceptedOffer.offerList[j].number && offer.allUserPicksToTrade[i].futureRound === acceptedOffer.offerList[j].futureRound &&
                      offer.allUserPicksToTrade[i].futurePickYear === acceptedOffer.offerList[j].futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === acceptedOffer.offerList[j].futureOriginalTeam) {
                      commonFound = true;
                      break;
                    }
                  }
                }

                if (!commonFound) {
                  for (let j = 0; j < acceptedOffer.allUserPicksToTrade.length; j++) {
                    if (offer.allUserPicksToTrade[i].number === acceptedOffer.allUserPicksToTrade[j].number && offer.allUserPicksToTrade[i].futureRound === acceptedOffer.allUserPicksToTrade[j].futureRound &&
                      offer.allUserPicksToTrade[i].futurePickYear === acceptedOffer.allUserPicksToTrade[j].futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === acceptedOffer.allUserPicksToTrade[j].futureOriginalTeam) {
                      commonFound = true;
                      break;
                    }
                  }
                }
              }

              if (!commonFound) {
                for (let i = 0; i < offer.offerList.length; i++) {
                  if (!commonFound) {
                    for (let j = 0; j < acceptedOffer.offerList.length; j++) {
                      if (offer.offerList[i].number === acceptedOffer.offerList[j].number && offer.offerList[i].futureRound === acceptedOffer.offerList[j].futureRound &&
                        offer.offerList[i].futurePickYear === acceptedOffer.offerList[j].futurePickYear && offer.offerList[i].futureOriginalTeam === acceptedOffer.offerList[j].futureOriginalTeam) {
                        commonFound = true;
                        break;
                      }
                    }
                  }

                  if (!commonFound) {
                    for (let j = 0; j < acceptedOffer.allUserPicksToTrade.length; j++) {
                      if (offer.offerList[i].number === acceptedOffer.allUserPicksToTrade[j].number && offer.offerList[i].futureRound === acceptedOffer.allUserPicksToTrade[j].futureRound &&
                        offer.offerList[i].futurePickYear === acceptedOffer.allUserPicksToTrade[j].futurePickYear && offer.offerList[i].futureOriginalTeam === acceptedOffer.allUserPicksToTrade[j].futureOriginalTeam) {
                        commonFound = true;
                        break;
                      }
                    }
                  }
                }
              }

              if (!commonFound) {
                remainingOffers.push(offer);
              } else {
                let counteredTeamIndex = counteredTeams.findIndex(teamName => offer.currentTeamName === teamName || offer
                  .offeringTeamShortName === teamName);
                if (counteredTeamIndex >= 0) {
                  counteredTeams.splice(counteredTeamIndex, 1);
                }
              }
            });

            multiUserSystemOffersList = [...remainingOffers];
            remainingOffers.length = 0;

            let rejectedOffers = [];
            multiUserCounterOffersList.forEach((offer) => {
              let commonPickFound = false;
              acceptedOffer.offerList.forEach(trade => {
                offer.allUserPicksToTrade.forEach(userPick => {
                  if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                    commonPickFound = true;
                  }
                });

                offer.offerList.forEach(userPick => {
                  if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                    commonPickFound = true;
                  }
                });
              });

              acceptedOffer.allUserPicksToTrade.forEach(trade => {
                offer.allUserPicksToTrade.forEach(userPick => {
                  if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                    commonPickFound = true;
                  }
                });

                offer.offerList.forEach(userPick => {
                  if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                    commonPickFound = true;
                  }
                });
              });

              if (commonPickFound) {
                rejectedOffers.push(offer);
                let counteredTeamIndex = counteredTeams.findIndex(teamName => offer.currentTeamName === teamName || offer
                  .offeringTeamShortName === teamName);
                if (counteredTeamIndex >= 0) {
                  counteredTeams.splice(counteredTeamIndex, 1);
                }
              }
            });

            console.log("rejected counter offers->", rejectedOffers);
            rejectedOffers.forEach((offer) => {
              let rejectedOffer = {
                allUserPicksToTrade: "",
                offerList: "",
                currentTeamName: "",
                offeringTeamShortName: "",
                pickNumber: currentMultiUserPick,
                roomId: currentRoomData.roomId,
              };

              rejectedOffer.allUserPicksToTrade = offer.allUserPicksToTrade;
              rejectedOffer.offerList = offer.offerList;
              rejectedOffer.currentTeamName = offer.currentTeamName;
              rejectedOffer.offeringTeamShortName = offer.offeringTeamShortName;

              toBeHandledOffers.rejectedCounterOffers.push(rejectedOffer);

              for (let i = 0; i < multiUserCounterOffersList.length; i++) {
                if (offer.offeringTeamShortName === multiUserCounterOffersList[i].offeringTeamShortName) {
                  multiUserCounterOffersList.splice(i, 1);
                  break;
                }
              }
            });

            multiUserTradeOffersList.forEach((offer) => {
              let commonPickFound = false;
              acceptedOffer.offerList.forEach(trade => {
                offer.allUserPicksToTrade.forEach(userPick => {
                  if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                    commonPickFound = true;
                  }
                });

                offer.offerList.forEach(userPick => {
                  if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                    commonPickFound = true;
                  }
                });
              });

              acceptedOffer.allUserPicksToTrade.forEach(trade => {
                offer.allUserPicksToTrade.forEach(userPick => {
                  if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                    commonPickFound = true;
                  }
                });

                offer.offerList.forEach(userPick => {
                  if (trade.number === userPick.number && trade.futureRound === userPick.futureRound && trade.futurePickYear === userPick.futurePickYear && trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                    commonPickFound = true;
                  }
                });
              });

              if (commonPickFound) {
                rejectedOffers.push(offer);
                let counteredTeamIndex = counteredTeams.findIndex(teamName => offer.currentTeamName === teamName || offer
                  .offeringTeamShortName === teamName);
                if (counteredTeamIndex >= 0) {
                  counteredTeams.splice(counteredTeamIndex, 1);
                }
              }
            });

            console.log("rejected trade offers->", rejectedOffers);
            rejectedOffers.forEach((offer) => {
              let rejectedOffer = {
                allUserPicksToTrade: "",
                offerList: "",
                currentTeamName: "",
                offeringTeamShortName: "",
                pickNumber: currentMultiUserPick,
                roomId: currentRoomData.roomId,
              };

              rejectedOffer.allUserPicksToTrade = offer.allUserPicksToTrade;
              rejectedOffer.offerList = offer.offerList;
              rejectedOffer.currentTeamName = offer.currentTeamName;
              rejectedOffer.offeringTeamShortName = offer.offeringTeamShortName;

              toBeHandledOffers.rejectedTradeOffers.push(rejectedOffer);

              for (let i = 0; i < multiUserTradeOffersList.length; i++) {
                if (offer.offeringTeamShortName === multiUserTradeOffersList[i].offeringTeamShortName) {
                  multiUserTradeOffersList.splice(i, 1);
                  break;
                }
              }
            });

            console.log("accepted system offer->", acceptedOffer);
            toBeHandledOffers.acceptedOffer = acceptedOffer;
            toBeHandledOffers.acceptedOfferType = "offer-accepted";
            if (currentPickIsMine) {
              socket.emit("proposal-resume", {
                socketId: currentUserSocketId,
                roomId: currentRoomData.roomId,
                runSim: false,
              });
            }

            if (!counterOffer) {
              socket.emit("chat", {
                roomId: currentRoomData.roomId,
                offeringTeam: opposingTeamName,
                toTeam: userTeamName,
                type: "offer_accepted",
              });
            }

            removeClass($(".trade-accepted-container"), "hidden");
            addClass($(".picks-confirmation-container"), "hidden");
            addClass($(".nav-btn-container"), "hidden");
            addClass($(".competing-teams-container"), "hidden");
            setTimeout(function () {
              var proposalContainer = $(".trade-proposal-all-teams-conatiner");
              if (proposalContainer) {
                proposalContainer.remove();
              }

              var overlay = $(".overlay");
              if (overlay && !checkForAlreadyOpenPopup()) {
                addClass(overlay, "hidden");
              }

              handleAccumulatedOffers();
            }, 1500, acceptedOffer);
            return;
          }

          var givingPlayers = [];
          var gettingPlayers = [];
          for (var i = 0; i < userSelectedPlayers.length; i++) {
            givingPlayers.push({
              playerName: userSelectedPlayers[i].dataset.playername,
              position: userSelectedPlayers[i].dataset.position,
              teamName: userSelectedPlayers[i].dataset.teamname,
              value: parseInt(userSelectedPlayers[i].value)
            });
          }
          for (var i = 0; i < opposingTeamSelectedPlayers.length; i++) {
            gettingPlayers.push({
              playerName: opposingTeamSelectedPlayers[i].dataset.playername,
              position: opposingTeamSelectedPlayers[i].dataset.position,
              teamName: opposingTeamSelectedPlayers[i].dataset.teamname,
              value: parseInt(opposingTeamSelectedPlayers[i].value)
            });
          }

          // Update playerTrades - move traded players to their new teams
          for (var i = 0; i < givingPlayers.length; i++) {
            for (var j = 0; j < playerTrades.length; j++) {
              if (playerTrades[j].Player === givingPlayers[i].playerName && playerTrades[j].Team === givingPlayers[i].teamName) {
                playerTrades[j].Team = opposingTeamName;
                break;
              }
            }
            givingPlayers[i].teamName = opposingTeamName;
          }
          for (var i = 0; i < gettingPlayers.length; i++) {
            for (var j = 0; j < playerTrades.length; j++) {
              if (playerTrades[j].Player === gettingPlayers[i].playerName && playerTrades[j].Team === gettingPlayers[i].teamName) {
                playerTrades[j].Team = userTeamName;
                break;
              }
            }
            gettingPlayers[i].teamName = userTeamName;
          }

          // // Update team needs for traded players
          // for (var i = 0; i < givingPlayers.length; i++) {
          //   updateTeamNeedsForTradedPlayer(gettingTeam, givingPlayers[i].position);
          // }
          // for (var i = 0; i < gettingPlayers.length; i++) {
          //   updateTeamNeedsForTradedPlayer(givingTeam, gettingPlayers[i].position);
          // }

          var tradeIndex = tradesData.length;
          updateTradedPicks(givingPicks, tradeIndex);
          updateTradedPicks(gettingPicks, tradeIndex);
          setTradesData(givingPicks, gettingPicks, givingPlayers, gettingPlayers);
          disableShowOffersBtn();
          offersList = [];
          var currentPickContainer = getCurrentPickContainer();
          if (currentPickContainer) {
            removeClass(currentPickContainer, "currentPick");
          }

          removeClass($(".trade-accepted-container"), "hidden");
        } else {
          if (multiUserDraft) {
            if (!counterOffer) {
              socket.emit("chat", {
                roomId: currentRoomData.roomId,
                offeringTeam: opposingTeamName,
                toTeam: userTeamName,
                type: "offer_rejected",
              });
            }
          }
          removeClass($(".trade-rejected-container"), "hidden");
        }

        addClass($(".picks-confirmation-container"), "hidden");
        addClass($(".nav-btn-container"), "hidden");
        addClass($(".competing-teams-container"), "hidden");

        setTimeout(function () {
          var proposalContainer = $(".trade-proposal-all-teams-conatiner");
          if (proposalContainer) {
            proposalContainer.remove();
          }

          var overlay = $(".overlay");
          if (overlay && !checkForAlreadyOpenPopup()) {
            addClass(overlay, "hidden");
          }

          if (IS_DESKTOP) {
            let myPicksBtn = $(".mypicks-btn-holder .my-picks-btn");
            if (myPicksBtn && myPicksBtn.classList.contains("selected")) {
              let selectedTeamBtn = $(".selected-user-teams-container .team-logo-btn-container.selected button.team-logo-btn");
              if (selectedTeamBtn) {
                selectedTeamBtn.click();
              }
            }
          }

          if (userSelectedTeams.includes(currentPickTeam)) {
            if (tradeAccepted && currentPickIncludedInTrade) {
              hideUserSelectionIcon();
              resumeDraft();
            } else if (!tradeAccepted && currentPickIncludedInTrade) {
              toggleSimView("pool", true);
            }
          }
        }, 1500, tradeAccepted, currentPickIncludedInTrade, pausedManually, currentPickTeam);
      }
    } else {
      let counteredTeamIndex = counteredTeams.findIndex(teamName => teamName === opposingTeamName);
      if (!(counteredTeamIndex > -1)) {
        counteredTeams.push(opposingTeamName);
      }
      let counterProposalData = {
        currentTeamName: opposingTeamName,
        offeringTeamShortName: userTeamName,
        allUserPicksToTrade: [],
        offerList: [],
        offerPlayersList: [],
        allUserPlayersToTrade: [],
        pickNumber: currentMultiUserPick,
        roomId: currentRoomData.roomId,
      }

      userSelectedPicks.forEach((pick) => {
        let pickData = {
          number: pick.dataset.number ? parseInt(pick.dataset.number) : "",
          futureRound: pick.dataset.futureround,
          futurePickYear: pick.dataset.futurepickyear ? parseInt(pick.dataset.futurepickyear) : "",
          futureOriginalTeam: pick.dataset.futureoriginalteam,
        }

        counterProposalData.offerList.push(pickData);
      });

      opposingTeamSelectedPicks.forEach((pick) => {
        let pickData = {
          number: pick.dataset.number ? parseInt(pick.dataset.number) : "",
          futureRound: pick.dataset.futureround,
          futurePickYear: pick.dataset.futurepickyear ? parseInt(pick.dataset.futurepickyear) : "",
          futureOriginalTeam: pick.dataset.futureoriginalteam,
        }

        counterProposalData.allUserPicksToTrade.push(pickData);
      });

      userSelectedPlayers.forEach((player) => {
        counterProposalData.offerPlayersList.push({
          playerName: player.dataset.playername,
          position: player.dataset.position,
          teamName: player.dataset.teamname,
          value: parseInt(player.value)
        });
      });

      opposingTeamSelectedPlayers.forEach((player) => {
        counterProposalData.allUserPlayersToTrade.push({
          playerName: player.dataset.playername,
          position: player.dataset.position,
          teamName: player.dataset.teamname,
          value: parseInt(player.value)
        });
      });

      if (counterOffer) {
        socket.emit("counter-offer", counterProposalData);
        socket.emit("chat", {
          roomId: currentRoomData.roomId,
          offeringTeam: userTeamName,
          toTeam: opposingTeamName,
          type: "counter_offer",
        });

      } else {
        socket.emit("trade-offer", counterProposalData);
        socket.emit("chat", {
          roomId: currentRoomData.roomId,
          offeringTeam: userTeamName,
          toTeam: opposingTeamName,
          type: "trade_offer",
        });

        if (mdsUserIsLoggedIn && mdsLoggedInUserId && multiUserDraft) {
          let dashboardEventData = {
            userId: mdsLoggedInUserId,
            draftType: getDraftType(),
            properties: [
              {
                propertyName: "tradesInitiatedCount",
                propertyValue: 1,
              }
            ]
          }
          sendUserDashboardData(dashboardEventData);
        }
      }

      let proposedTeamIndex = proposedTeamsData.findIndex(propsedTeamData => {
        let teamName = Object.keys(propsedTeamData)[0];
        if (teamName === opposingTeamName || teamName === userTeamName) {
          return true;
        }
      });

      if (proposedTeamIndex < 0) {
        let counteredData = {};
        counteredData[opposingTeamName] = counterProposalData;
        proposedTeamsData.push(counteredData);
      }

      let tradeOfferIndex = multiUserTradeOffersList.findIndex(offer => (offer.offeringTeamShortName === opposingTeamName && offer.currentTeamName === userTeamName) || (offer.currentTeamName === opposingTeamName && offer.offeringTeamShortName === userTeamName));
      if (tradeOfferIndex > -1) {
        multiUserTradeOffersList.splice(tradeOfferIndex, 1);
      }

      let counterOfferIndex = multiUserCounterOffersList.findIndex(offer => (offer.offeringTeamShortName === opposingTeamName && offer.currentTeamName === userTeamName) || (offer.currentTeamName === opposingTeamName && offer.offeringTeamShortName === userTeamName));
      if (counterOfferIndex > -1) {
        multiUserCounterOffersList.splice(counterOfferIndex, 1);
      }

      let offerIndex = offersList.findIndex(offer => offer.shortName === opposingTeamName);
      if (offerIndex > -1) {
        offersList.splice(offerIndex, 1);
      }

      if (!offersList.length) {
        disableShowOffersBtn();
      }

      var proposalContainer = $(".trade-proposal-all-teams-conatiner");
      if (proposalContainer) {
        proposalContainer.remove();
      }

      var tradeProposalResponseEl = document.getElementById("trade-proposal-response");
      if (!tradeProposalResponseEl) return;
      tradeProposalResponseContainer = tradeProposalResponseEl.content.cloneNode(true);
      tradeProposalResponseContainer = tradeProposalResponseContainer.querySelector(".trade-proposal-response-popup");
      if (tradeProposalResponseContainer) {
        let proposalDescriptionContainer = tradeProposalResponseContainer.querySelector(".trade-proposal-response-container .trade-proposal-response-description");
        if (proposalDescriptionContainer) {
          proposalDescriptionContainer.innerHTML = "Trade Proposal has been sent";
        }

        document.body.appendChild(tradeProposalResponseContainer);

        setTimeout(() => {
          let proposalResponseContainer = $(".trade-proposal-response-popup");
          if (proposalResponseContainer) {
            proposalResponseContainer.remove();
          }

          let overlay = $(".overlay");
          if (overlay && !checkForAlreadyOpenPopup()) {
            addClass(overlay, "hidden");
          }
        }, 1000);
      }
    }
  }
}

function showAllTeamsForUserSelection() {
  var tradeProposalContainer = $(".trade-proposal-all-teams-conatiner");
  if (tradeProposalContainer) {
    var headerTextHolder = tradeProposalContainer.querySelector(".header-text");
    if (headerTextHolder) {
      headerTextHolder.innerHTML = "Select Team(s)";
    }

    var picksSelectionContainer = tradeProposalContainer.querySelector(".picks-container");
    if (picksSelectionContainer) {
      addClass(picksSelectionContainer, "hidden");
      picksSelectionContainer.style.maxHeight = "310px";
    }

    var progressContainer = tradeProposalContainer.querySelector(".trade-progress-container");
    if (progressContainer) {
      addClass(progressContainer, "hidden");
    }

    var allTeamsContainer = tradeProposalContainer.querySelector(".all-teams-container");
    if (allTeamsContainer) {
      removeClass(allTeamsContainer, "hidden");
    }

    var confirmBtn = $(".nav-btn-container .nav-btn.next");
    if (confirmBtn) {
      removeClass(confirmBtn, "hidden");
    }

    var backBtn = $(".nav-btn-container .nav-btn.back");
    if (backBtn) {
      addClass(backBtn, "hidden");
    }

    var proposeBtn = $(".nav-btn-container .nav-btn.propose");
    if (proposeBtn) {
      addClass(proposeBtn, "hidden");
      proposeBtn.disabled = true;
      proposeBtn.style.opacity = 0.4;
      proposeBtn.style.cursor = "not-allowed";
    }
  }
}

function formatPlayerName(name, position) {
  return position ? name + " (" + position + ")" : name;
}

function enableTradeProposalProposeTradeButton() {
  var userPickInput = $('.user-picks input[data-for="picks"]:checked');
  var userPlayerInput = $('.user-picks input[data-for="players"]:checked');
  var opposingTeamPickInput = $('.opposing-team-picks input[data-for="picks"]:checked');
  var opposingTeamPlayerInput = $('.opposing-team-picks input[data-for="players"]:checked');
  var userHasSelection = userPickInput || userPlayerInput;
  var opposingHasSelection = opposingTeamPickInput || opposingTeamPlayerInput;
  var proposeBtn = $(".nav-btn-container .nav-btn.propose");
  if (userHasSelection && opposingHasSelection && proposeBtn) {
    if (proposeBtn) {
      proposeBtn.disabled = false;
      proposeBtn.style.opacity = 1;
      proposeBtn.style.cursor = "pointer";
    }
  } else {
    proposeBtn.disabled = true;
    proposeBtn.style.opacity = 0.4;
    proposeBtn.style.cursor = "not-allowed";
  }
  updateTradeProgressBar();
}

function updateTradeProgressBar() {
  var progressContainer = $(".trade-progress-container");
  var picksContainer = $(".trade-proposal-all-teams-conatiner .picks-container");
  if (!progressContainer) return;

  var userSelectedPicks = $all('.user-picks input[data-for="picks"]:checked');
  var opposingTeamSelectedPicks = $all('.opposing-team-picks input[data-for="picks"]:checked');
  var userSelectedPlayers = $all('.user-picks input[data-for="players"]:checked');
  var opposingTeamSelectedPlayers = $all('.opposing-team-picks input[data-for="players"]:checked');

  if ((!userSelectedPicks.length && !userSelectedPlayers.length) || (!opposingTeamSelectedPicks.length && !opposingTeamSelectedPlayers.length)) {
    addClass(progressContainer, "hidden");
    if (picksContainer) {
      picksContainer.style.maxHeight = "310px";
    }
    return;
  }

  removeClass(progressContainer, "hidden");
  if (picksContainer) {
    picksContainer.style.maxHeight = "236px";
  }

  var userPicksValue = 0;
  var opposingTeamPicksValue = 0;
  var userLowestPickNumber = Infinity;
  var opposingLowestPickNumber = Infinity;

  for (var i = 0; i < userSelectedPicks.length; i++) {
    userPicksValue += parseInt(userSelectedPicks[i].value) || 0;
    var pickNum = parseInt(userSelectedPicks[i].dataset.number);
    if (pickNum && pickNum < userLowestPickNumber) {
      userLowestPickNumber = pickNum;
    }
  }

  for (var i = 0; i < opposingTeamSelectedPicks.length; i++) {
    opposingTeamPicksValue += parseInt(opposingTeamSelectedPicks[i].value) || 0;
    var pickNum = parseInt(opposingTeamSelectedPicks[i].dataset.number);
    if (pickNum && pickNum < opposingLowestPickNumber) {
      opposingLowestPickNumber = pickNum;
    }
  }

  for (var i = 0; i < userSelectedPlayers.length; i++) {
    userPicksValue += parseInt(userSelectedPlayers[i].value) || 0;
  }

  for (var i = 0; i < opposingTeamSelectedPlayers.length; i++) {
    opposingTeamPicksValue += parseInt(opposingTeamSelectedPlayers[i].value) || 0;
  }

  var isCounterOffer = false;
  var likelyAccept = false;
  var likelyClose = false;
  var progressPercent = 0;

  var counterContainer = $(".trade-proposal-all-teams-conatiner");
  if (counterContainer && counterContainer.dataset.countergivingpicks && counterContainer.dataset.countergettingpicks) {
    isCounterOffer = true;
    var originalCurrentTeamPicks = JSON.parse(counterContainer.dataset.countergivingpicks);
    var originalOfferingTeamPicks = JSON.parse(counterContainer.dataset.countergettingpicks);
    var originalPackageRatio = originalOfferingTeamPicks.value / originalCurrentTeamPicks.value;
    var newPackageRatio = userPicksValue > 0 ? opposingTeamPicksValue / userPicksValue : 0;

    if (newPackageRatio <= originalPackageRatio) {
      likelyAccept = true;
      progressPercent = 100;
    } else if (newPackageRatio < originalPackageRatio + 0.15) {
      likelyClose = true;
      var excess = newPackageRatio - originalPackageRatio;
      progressPercent = Math.max(50, 100 - (excess / 0.15) * 50);
    } else {
      progressPercent = Math.max(10, 50 - ((newPackageRatio - originalPackageRatio - 0.15) / 0.15) * 50);
    }
  }

  if (!isCounterOffer) {
    var isUserTradingUp = opposingLowestPickNumber < userLowestPickNumber;
    var highestValuePick = isUserTradingUp ? opposingLowestPickNumber : userLowestPickNumber;

    var requiredRatio;
    if (highestValuePick < 3) {
      requiredRatio = 1.0;
    } else if (highestValuePick < 11) {
      requiredRatio = 0.99;
    } else if (highestValuePick < 33) {
      requiredRatio = 0.975;
    } else {
      requiredRatio = 0.95;
    }

    var currentRatio;
    if (opposingTeamPicksValue > 0) {
      currentRatio = userPicksValue / opposingTeamPicksValue;
    } else if (opposingTeamPicksValue < 0 || userPicksValue > 0) {
      currentRatio = 2;
    } else {
      currentRatio = 0;
    }
    progressPercent = requiredRatio > 0 ? Math.min((currentRatio / requiredRatio) * 100, 150) : 0;

    if (currentRatio >= requiredRatio) {
      likelyAccept = true;
    } else if (currentRatio >= requiredRatio * 0.9) {
      likelyClose = true;
    }
  }

  var progressFill = progressContainer.querySelector(".trade-progress-fill");
  var progressStatus = progressContainer.querySelector(".trade-progress-status");

  if (progressFill) {
    progressFill.style.width = Math.max(0, Math.min(progressPercent, 100)) + "%";
    removeClass(progressFill, "accept");
    removeClass(progressFill, "close");
    removeClass(progressFill, "reject");

    if (likelyAccept) {
      addClass(progressFill, "accept");
    } else if (likelyClose) {
      addClass(progressFill, "close");
    } else {
      addClass(progressFill, "reject");
    }
  }

  if (progressStatus) {
    removeClass(progressStatus, "likely-accept");
    removeClass(progressStatus, "likely-reject");
    removeClass(progressStatus, "close");

    if (likelyAccept) {
      progressStatus.textContent = "Likely Accept";
      addClass(progressStatus, "likely-accept");
    } else if (likelyClose) {
      progressStatus.textContent = "Close";
      addClass(progressStatus, "close");
    } else {
      progressStatus.textContent = "Likely Reject";
      addClass(progressStatus, "likely-reject");
    }
  }

}

function toggleFeaturedPFNTools() {
  var featuredToolsContainer = $(".more-pfn-tools-container");

  if (featuredToolsContainer.classList.contains("hidden")) {
    removeClass(featuredToolsContainer, "hidden");
  } else {
    addClass(featuredToolsContainer, "hidden");
  }
}

function enableSimProposeTradeBtn() {
  var tradeProposalBtn = $(".simulation-management-buttons-container .user-proposal");
  if (tradeProposalBtn) {
    tradeProposalBtn.disabled = false;
    tradeProposalBtn.style.opacity = "1";
    tradeProposalBtn.style.cursor = "pointer";
  }
}

function disableSimProposeTradeBtn() {
  var tradeProposalBtn = $(".simulation-management-buttons-container .user-proposal");
  if (tradeProposalBtn) {
    tradeProposalBtn.disabled = true;
    tradeProposalBtn.style.opacity = "0.4";
    tradeProposalBtn.style.cursor = "not-allowed";
  }
}

function fillPlayersList() {
  let playersHolder = $(".players-container .players-holder");
  if (playersHolder) {
    playersHolder.innerHTML = "";
    let playersListContainer = document.createElement("div");
    addClass(playersListContainer, "players-list");
    playersList.forEach(player => {
      let singlePlayer = document.createElement("div");
      addClass(singlePlayer, "player");
      singlePlayer.dataset.name = player.name;
      singlePlayer.dataset.draftfrom = player.draftFrom;
      singlePlayer.dataset.position = player.position;
      singlePlayer.dataset.number = player.number;

      let playerDetailsHolder = document.createElement("div");
      addClass(playerDetailsHolder, "player-details");
      playerDetailsHolder.dataset.name = player.name;
      playerDetailsHolder.onclick = showPlayerInfo;

      let playerNumber = document.createElement("span");
      addClass(playerNumber, "player-number");
      playerNumber.innerHTML = player.number + ".";

      playerDetailsHolder.appendChild(playerNumber);

      let playerNamePositionContainer = document.createElement("div");
      addClass(playerNamePositionContainer, "player-name-position-container");

      let playerName = document.createElement("span");
      addClass(playerName, "name");
      playerName.innerHTML = player.name;

      playerNamePositionContainer.appendChild(playerName);

      let playerPosition = document.createElement("span");
      addClass(playerPosition, "position");
      playerPosition.innerHTML = player.position + " " + player.draftFrom;

      playerNamePositionContainer.appendChild(playerPosition);
      playerDetailsHolder.appendChild(playerNamePositionContainer);
      singlePlayer.appendChild(playerDetailsHolder);

      let playerBtnsContainer = document.createElement("div");
      addClass(playerBtnsContainer, "player-buttons-container");

      let playerInfoBtn = document.createElement("button");
      addClass(playerInfoBtn, "player-info-btn");
      playerInfoBtn.onclick = showPlayerInfo;
      playerInfoBtn.dataset.name = player.name;

      let playerInfoIcon = document.createElement("img");
      playerInfoIcon.src = STATIC_URL + "/skm/assets/nfl-mockup/player-info-icon.png";
      playerInfoIcon.style.width = "24px";
      playerInfoIcon.style.height = "24px";
      playerInfoIcon.alt = "player-info-icon";

      playerInfoBtn.appendChild(playerInfoIcon);
      playerBtnsContainer.appendChild(playerInfoBtn);

      let playerDraftBtn = document.createElement("button");
      playerDraftBtn.innerHTML = "Draft";
      addClass(playerDraftBtn, "add-player");
      addClass(playerDraftBtn, "hidden");
      playerDraftBtn.onclick = addPlayerToPick;
      playerDraftBtn.dataset.name = player.name;
      playerDraftBtn.dataset.draftfrom = player.draftFrom;
      playerDraftBtn.dataset.position = player.position;

      playerBtnsContainer.appendChild(playerDraftBtn);
      singlePlayer.appendChild(playerBtnsContainer);

      let separator = document.createElement("div");
      addClass(separator, "separator");
      singlePlayer.appendChild(separator);

      playersListContainer.appendChild(singlePlayer);
    });
    playersHolder.appendChild(playersListContainer);
  }
}

async function selectMDSPlayersList(e) {
  if (!widgetData) {
    var overlay = document.createElement("div");
    addClass(overlay, "loading-overlay");
    var loadingText = document.createElement("span");
    addClass(loadingText, "overlay-loading-text");
    loadingText.innerHTML = "Loading...";
    overlay.appendChild(loadingText);
    document.body.appendChild(overlay);
  }

  const rankingsProviderSelector = $(".players-list-selection-container #players-lists");
  if (rankingsProviderSelector) {
    const value = rankingsProviderSelector.value;
    if (playerBoardsList[value]) {
        playersList = JSON.parse(JSON.stringify(playerBoardsList[value]));
        playersListAll = JSON.parse(JSON.stringify(playerBoardsList[value]));
    } else {
        let playersListUrl = STATIC_URL +
            "/assets/sheets/tools/mockdraft-simulator/playerBoards/" + value + ".json";

        playersListUrl = playersListUrl.replace("staticd.pr", "staticj.pr");
        try {
            const response = await fetch(playersListUrl);
            const result = await response.json();
            const playersListNew = prepareMDSPlayersList(result);
            if (!playerBoardsList[value]) {
                playerBoardsList[value] = JSON.parse(JSON.stringify(playersListNew));
                playersList = JSON.parse(JSON.stringify(playersListNew));
                playersListAll = JSON.parse(JSON.stringify(playersListNew));
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    renderMDSPlayersList(playersList);
  }

  if (!widgetData) {
    var overlay = $(".loading-overlay");
    if (overlay) {
        overlay.remove();
    }
  }
}

function prepareMDSPlayersList(data) {
  const playersListNew = [];
  const headers = data[0];
  // Fields that should be parsed as comma-separated arrays
  const arrayFields = ["penaltyPOS", "penaltyPOS2", "penaltyPOS3", "doNotDraft"];
  for (let i = 1; i < data.length; i++) {
      const player = {};
      for (let j = 0; j < headers.length; j++) {
          const key = headers[j];
          if (key) {
              let value = data[i][j];
              if (value === undefined || value === null) {
                  value = "";
              }
              // Handle array fields (comma-separated strings)
              if (arrayFields.includes(key)) {
                  if (Array.isArray(value)) {
                      // already an array
                  } else if (typeof value === "string" && value.trim() !== "") {
                      value = value.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
                  } else {
                      value = [];
                  }
              }
              // Auto-detect numeric values (non-empty, non-array, parseable as number)
              else if (!Array.isArray(value) && value !== "" && !isNaN(value) && typeof value === "string") {
                  value = Number(value);
              }
              player[key] = value;
          }
      }
      playersListNew.push(player);
  }
  return playersListNew;
}

function renderMDSPlayersList(players) {
  var container = $(".players-holder .players-list");
  // Safety check
  if (!container) return;
  // 1. Build the HTML string
  var playersHtml = players.map(function(player) {
      // Handle potential null/undefined values
      var pName = player.name || '';
      var pNum = player.number || '';
      var pPos = player.position || '';
      var pDraftFrom = player.draftFrom || '';
      var html = '<div class="player ' + pPos + ' ' + pNum + '" ' +
          'data-name="' + pName + '" ' +
          'data-draftFrom="' + pDraftFrom + '" ' +
          'data-position="' + pPos + '" ' +
          'data-number="' + pNum + '">' +
          '<div class="player-details" onclick="showPlayerInfo(event)" data-name="' + pName + '">' +
          '<span class="player-number">' + pNum + '.</span>' +
          '<div class="player-name-position-container">' +
          '<span class="name">' + pName + '</span>' +
          '<span class="position">' + pPos + ' ' + pDraftFrom + '</span>' +
          '</div>' +
          '</div>' +
          '<div class="player-buttons-container">' +
          '<button class="player-info-btn" onclick="showPlayerInfo(event)" data-name="' + pName + '">' +
          '<img src="' + STATIC_URL +
          '/skm/assets/nfl-mockup/player-info-icon.png" width="24" height="24" ' +
          'alt="player-info-icon">' +
          '</button>' +
          '<button class="add-player hidden" onclick="addPlayerToPick(event)" ' +
          'data-name="' + pName + '" ' +
          'data-draftFrom="' + pDraftFrom + '" ' +
          'data-position="' + pPos + '">Draft</button>' +
          '</div>' +
          '<div class="separator"></div>' +
          '</div>';
      return html;
  }).join('');
  // 2. Inject into the DOM
  container.innerHTML = playersHtml;
}

async function loadWidgetData() {
  localStorage.removeItem("pfsnWidgetData");
  if (window.handleWidgetMessage) {
    window.removeEventListener("message", window.handleWidgetMessage);
    window.handleWidgetMessage = null;
  }
  if (widgetData.selectedPicksList) {
    picksList = widgetData.selectedPicksList;
    // Older widget builds set pick.tradeProposals to {} (an object) before serialization.
    // Normalize to an array so consumers like createDraftSnapshot() can safely call .slice().
    picksList.forEach(function(pick) {
      if (!Array.isArray(pick.tradeProposals)) {
        pick.tradeProposals = [];
      }
    });
  }

  if (widgetData.selectedTeamNeedsList) {
    teamNeedsList = widgetData.selectedTeamNeedsList;
  }

  if (widgetData.selectedTeamsList) {
    teamsList = widgetData.selectedTeamsList;
  }

  if (widgetData.selectedTradesData) {
    tradesData = widgetData.selectedTradesData;
  }

  if (widgetData.selectedPlayerTrades) {
    playerTrades = widgetData.selectedPlayerTrades;
  }

  const rankingsProviderSelector = $(".players-list-selection-container #players-lists");
  if (rankingsProviderSelector) {
    rankingsProviderSelector.value = widgetData.selectedProvider;
    await selectMDSPlayersList();
  }

  const startDraftBtn = $(".start-draft-btn");
  if (startDraftBtn) {
    startDraftBtn.click();
  }
}

async function selectMDSYear(year) {
  var overlay = document.createElement("div");
  addClass(overlay, "loading-overlay");
  var loadingText = document.createElement("span");
  addClass(loadingText, "overlay-loading-text");
  loadingText.innerHTML = "Loading...";
  overlay.appendChild(loadingText);
  document.body.appendChild(overlay);

  const yearsProviderSelector = $(".year-list-selection-container #years-lists");
  if (yearsProviderSelector) {
    let value = yearsProviderSelector.value;
    if (year) {
      value = year;
    }

    isRedraft = true;
    pickstart = 0;

    // Cache the raw JSON response to avoid circular reference issues
    // (picks reference teams which reference picks back via draftPicks)
    if (redraftDataList[value] && redraftDataList[value].rawData) {
        var redraftData = prepareRedraftCollections(redraftDataList[value].rawData);
        playersList = redraftData.players;
        playersListAll = JSON.parse(JSON.stringify(redraftData.players));
        picksList = redraftData.picks;
        teamsList = redraftData.teams;
        teamNeedsList = redraftData.teamsClone;
    } else {
      let yearDataUrl = STATIC_URL +
          "/assets/sheets/tools/mockdraft-simulator/redraft/" + value + "Data.json";

      yearDataUrl = yearDataUrl.replace("staticd.pr", "staticj.pr");
      try {
          const response = await fetch(yearDataUrl);
          const result = await response.json();
          // Cache the raw response (no circular refs)
          redraftDataList[value].rawData = result;
          var redraftData = prepareRedraftCollections(result);
          playersList = redraftData.players;
          playersListAll = JSON.parse(JSON.stringify(redraftData.players));
          picksList = redraftData.picks;
          teamsList = redraftData.teams;
          teamNeedsList = redraftData.teamsClone;
      } catch (error) {
          console.error(error.message);
      }
    }

    if (redraftDataList[value] && redraftDataList[value].roundends) {
      roundends = redraftDataList[value].roundends;
    }

    // Clear trade data for redraft (not applicable to historical drafts)
    playerTrades = [];
    playerTradesOriginal = [];
    tradesData = [];

    renderMDSPlayersList(playersList);
  }

  var overlay = $(".loading-overlay");
  if (overlay) {
      overlay.remove();
  }
}

function prepareRedraftCollections(result) {
  var collections = result.collections || [];
  var playersData, picksData, teamsData;

  for (var i = 0; i < collections.length; i++) {
    var name = collections[i].sheetName || "";
    if (name.indexOf("_players") !== -1) {
      playersData = collections[i].data;
    } else if (name.indexOf("_picks") !== -1) {
      picksData = collections[i].data;
    } else if (name.indexOf("_teams") !== -1) {
      teamsData = collections[i].data;
    }
  }

  var players = playersData ? prepareMDSPlayersList(playersData) : [];
  var teams = teamsData ? prepareRedraftTeams(teamsData) : [];
  // Clone teams before linking (linking creates circular refs)
  var teamsClone = JSON.parse(JSON.stringify(teams));
  var picks = picksData ? prepareRedraftPicks(picksData, teams) : [];

  return { players: players, picks: picks, teams: teams, teamsClone: teamsClone };
}

function prepareRedraftTeams(data) {
  var teamsList = [];
  var headers = data[0];
  // Fields that are JSON-encoded strings in the sheet
  var jsonFields = ["draftPicks", "draftedPlayers", "doNotDraft", "penaltyPOS", "penaltyPOS2", "penaltyPOS3"];
  var booleanFields = ["isUser", "tradeUserTeam", "tradeTargetTeam"];

  for (var i = 1; i < data.length; i++) {
    var team = {};
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j];
      if (!key) continue;
      var value = data[i][j];
      if (value === undefined || value === null) value = "";

      if (jsonFields.includes(key)) {
        if (Array.isArray(value)) {
          // already an array
        } else if (typeof value === "string" && value.trim() !== "") {
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = value.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
          }
        } else {
          value = [];
        }
      } else if (booleanFields.includes(key)) {
        value = (value === "TRUE" || value === true);
      } else if (!Array.isArray(value) && value !== "" && !isNaN(value) && typeof value === "string") {
        value = Number(value);
      }

      team[key] = value;
    }
    // Ensure required array fields exist
    if (!Array.isArray(team.draftedPlayers)) team.draftedPlayers = [];
    if (!Array.isArray(team.draftPicks)) team.draftPicks = [];
    if (!Array.isArray(team.doNotDraft)) team.doNotDraft = [];
    if (!Array.isArray(team.penaltyPOS)) team.penaltyPOS = [];
    // Convert .gif logos to .png and extract filename only
    if (team.teamLogo && typeof team.teamLogo === "string") {
      team.teamLogo = team.teamLogo.replace(/\.gif$/i, ".png");
      var lastSlash = team.teamLogo.lastIndexOf("/");
      if (lastSlash !== -1) {
        team.teamLogo = team.teamLogo.substring(lastSlash + 1);
      }
    }
    teamsList.push(team);
  }
  return teamsList;
}

function prepareRedraftPicks(data, teams) {
  var picksList = [];
  var headers = data[0];
  var booleanFields = ["onTheClock", "tradeUpPick", "futurePick"];

  for (var i = 1; i < data.length; i++) {
    var pick = {};
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j];
      if (!key) continue;
      var value = data[i][j];
      if (value === undefined || value === null) value = "";

      if (booleanFields.includes(key)) {
        value = (value === "TRUE" || value === true);
      } else if (!Array.isArray(value) && value !== "" && !isNaN(value) && typeof value === "string") {
        value = Number(value);
      }

      pick[key] = value;
    }

    // Set currentTeam reference by looking up team from shortName
    pick.currentTeam = teams.find(function(t) { return t.shortName === pick.shortName; }) || {};
    // Ensure playerSelection is empty (not drafted yet)
    if (!pick.playerSelection || pick.playerSelection === "") {
      pick.playerSelection = "";
    }

    picksList.push(pick);
  }

  return picksList;
}

function relinkPicksToTeams(picks, teams) {
  for (var i = 0; i < picks.length; i++) {
    var team = teams.find(function(t) { return t.shortName === picks[i].shortName; });
    if (team) picks[i].currentTeam = team;
  }
}

function restoreOriginalMDSData() {
  picksList = JSON.parse(JSON.stringify(originalMDSData.picksList));
  teamsList = JSON.parse(JSON.stringify(originalMDSData.teamsList));
  teamNeedsList = JSON.parse(JSON.stringify(originalMDSData.teamsList));
  playersList = JSON.parse(JSON.stringify(originalMDSData.playersList));
  playersListAll = JSON.parse(JSON.stringify(originalMDSData.playersList));
  playerTrades = JSON.parse(JSON.stringify(originalMDSData.playerTrades));
  playerTradesOriginal = JSON.parse(JSON.stringify(originalMDSData.playerTrades));
  roundends = JSON.parse(JSON.stringify(originalMDSData.roundends));
  tradesData = [];
  pickstart = originalMDSData.pickstart;
  isRedraft = false;

  // Re-link currentTeam references on picks
  relinkPicksToTeams(picksList, teamsList);
  // Re-render players list
  renderMDSPlayersList(playersList);
}
