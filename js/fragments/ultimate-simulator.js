var picksList = [];
var mdsTeamsList;
var teamNeedsList;
var playersList;
var playersListAll;

const nflTeamShortNames = [
  "ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE",
  "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAX", "KC",
  "LV", "LAR", "LAC", "MIA", "MIN", "NE", "NO", "NYG",
  "NYJ", "PHI", "PIT", "SF", "SEA", "TB", "TEN", "WAS"
];
let nflTeamsPlayersList = [];

const teamsDownloadData = {
  ARI: {},
  ATL: {},
  BAL: {},
  BUF: {},
  CAR: {},
  CHI: {},
  CIN: {},
  CLE: {},
  DAL: {},
  DEN: {},
  DET: {},
  GB: {},
  HOU: {},
  IND: {},
  JAX: {},
  KC: {},
  LV: {},
  LAR: {},
  LAC: {},
  MIA: {},
  MIN: {},
  NE: {},
  NO: {},
  NYG: {},
  NYJ: {},
  PHI: {},
  PIT: {},
  SF: {},
  SEA: {},
  TB: {},
  TEN: {},
  WAS: {}
};

let userSelectedGMTeam = "";
const calculatedNFLTeamValues = {};

var weekMatchesData = [];
var defaultWeekMatchesData = [];
var teamsData = {};
var defaultTeamsData = {};
var teamsList = [];
var winProbabilityGrid = [];
let reverseWinProbabilityGrid = true;
var totalWeeks = 18;
var landingWeek = "0";
var firstFiveWeeksMatchesCompleted = false;
var currentWeek = landingWeek;
var simulationSpeed = 75;
var randomScoreData = {
  min: 15,
  max: 35,
  outliersMin: 10,
  outliersMax: 40,
  outliersChances: 0.05,
};
var pauseSimulatorFlag = false;

var leagueData = [];
var conferenceData = {};
var divisionData = {};
let playoffParticipants = {};
let playoffMatchesData = {};
var playerOffCompletedMatchesData = {};
var playoffSimulationTimeoutId = null;
let draftOrderTeamsSequence = [];
let sevenRoundDraftOrder;

// Cached clones of playoff predictor elements for result screen
var cachedDivisionStandings = null;
var cachedConferenceStandings = null;
var cachedPlayoffBracket = null;
var cachedDraftOrderTable = null;

var abbrDict = {
  AFC: "American Football Conference",
  NFC: "National Football Conference",
  "AFC E": "AFC East",
  "AFC W": "AFC West",
  "AFC S": "AFC South",
  "AFC N": "AFC North",
  "NFC E": "NFC East",
  "NFC W": "NFC West",
  "NFC S": "NFC South",
  "NFC N": "NFC North",
};

var prevSimulationPausedState;
var autoPopupPlayoffPredictorFlag = false;

if (SEND_PAGE_VIEW_EVENT == true) {
  (function () {
    trackGAEventForPage("page_view");
  })();
}

function generateRandomScore(limit = "") {
  minScore = randomScoreData.min;
  maxScore = randomScoreData.max;
  minOutlierScore = randomScoreData.outliersMin;
  maxOutlierScore = randomScoreData.outliersMax;
  if (limit) {
    minScore = Math.min(minScore, limit);
    minOutlierScore = Math.min(minOutlierScore, limit);
    maxScore = limit;
    maxOutlierScore = limit;
  }
  var randomNumber = Math.random();
  if (randomNumber < 1 - randomScoreData.outliersChances) {
    return Math.floor(randomNumber * (maxScore - minScore)) + minScore;
  } else {
    return (
      Math.floor(randomNumber * (maxOutlierScore - minOutlierScore)) +
      minOutlierScore
    );
  }
}

function setDeafultWeekMatchesData() {
  weekMatchesData = [];
  prepareWeekMatchesData(defaultWeekMatchesData);
}

function prepareWeekMatchesData(rawData) {
  defaultWeekMatchesData = rawData;
  var headers = rawData[0];
  var landingWeekUpdated = false;
  for (var i = 1; i < rawData.length; i++) {
    matchData = {};
    for (var j = 0; j < headers.length; j++) {
      if (headers[j]) {
        matchData[headers[j]] = isNaN(rawData[i][j]) ?
          rawData[i][j] :
          Number(rawData[i][j]);
        if (headers[j] == "Winner") {
          matchData["completed"] = false;
          if (rawData[i][j]) {
            matchData["completed"] = true;
          } else {
            matchData["Away Score"] = 0;
            matchData["Home Score"] = 0;
          }
        }
      }
    }
    weekMatchesData.push(matchData);
  }
}

function setDeafultTeamsData() {
  teamsData = {};
  prepareTeamsData(defaultTeamsData);
}

function prepareTeamsData(rawData) {
  defaultTeamsData = rawData;
  var headers = rawData[0];
  for (var i = 1; i < rawData.length; i++) {
    teamData = {};
    for (var j = 0; j < headers.length; j++) {
      if (headers[j]) {
        teamData[headers[j]] = isNaN(rawData[i][j]) ?
          rawData[i][j] :
          Number(rawData[i][j]);
      }
    }
    teamData["logo"] =
      STATIC_URL +
      teamLogoPath +
      teamData["Team"] +
      ".png" + logoCacheBuster;
    teamData["PA"] = 0;
    teamData["PF"] = 0;
    teamData["PD"] = 0;
    teamData["SOS"] = 0;
    teamData["SOV"] = 0;
    teamData["DivisionCounts"] = {
      Wins: 0,
      Losses: 0,
      Ties: 0,
    };
    teamData["ConferenceCounts"] = {
      Wins: 0,
      Losses: 0,
      Ties: 0,
    };
    teamsData[teamData["Team"]] = teamData;
  }

  teamsList = Object.keys(teamsData);
}

function preparePlayoffsData(rawData) {
  for (var i = 1; i < rawData.length; i++) {
    var [roundName, conferenceName, teamA, teamB, winner] = rawData[i];
    var matchData = {
      teamA,
      teamB,
      winner
    };
    if (conferenceName == "AFC" || conferenceName == "NFC") {
      playerOffCompletedMatchesData[conferenceName] ??= {};
      playerOffCompletedMatchesData[conferenceName][roundName] ||= [];
      playerOffCompletedMatchesData[conferenceName][roundName].push(matchData);
    } else if (roundName == "SuperBowl") {
      playerOffCompletedMatchesData[roundName] = matchData;
    }
  }
}

function prepareWinningProbabilityData(data) {
  winProbabilityGrid = data;
}

function createMatchElement(matchNumber) {
  var matchData = weekMatchesData[matchNumber];

  var matchContainer = document.createElement("div");
  addClass(matchContainer, "match-container");
  addClass(matchContainer, "match-" + matchNumber);

  var awayTeamName = matchData["Away"];
  var homeTeamName = matchData["Home"];
  var winnerTeamName = matchData["Winner"];
  var awayTeamScore = matchData["Away Score"];
  var homeTeamScore = matchData["Home Score"];
  var matchAlreadyHeld = matchData["completed"];

  // Away Team Container
  var awayTeamContainer = document.createElement("div");
  addClass(awayTeamContainer, "away-team-container");
  if (awayTeamName == winnerTeamName)
    addClass(awayTeamContainer, "selected-team");

  var awayTeamLogo = document.createElement("img");
  addClass(awayTeamLogo, "away-team-logo");
  awayTeamLogo.setAttribute("src", teamsData[awayTeamName]["logo"]);
  awayTeamLogo.setAttribute("alt", awayTeamName);
  awayTeamLogo.setAttribute("width", "33px");
  awayTeamLogo.setAttribute("height", "22px");
  awayTeamContainer.appendChild(awayTeamLogo);

  var awayTeamDetailsHolder = document.createElement("div");
  addClass(awayTeamDetailsHolder, "away-team-details-holder");
  var awayTeamNameHolder = document.createElement("span");
  addClass(awayTeamNameHolder, "away-team-name-holder");
  awayTeamNameHolder.innerHTML = awayTeamName;
  awayTeamDetailsHolder.appendChild(awayTeamNameHolder);
  awayTeamWinLoseHolder = document.createElement("span");
  addClass(awayTeamWinLoseHolder, "away-team-win-lose-holder");
  awayTeamWinLoseHolder.setAttribute("data-team-name", awayTeamName);
  awayTeamWinLoseHolder.innerHTML = generateWinLoseTieText(awayTeamName);
  awayTeamDetailsHolder.appendChild(awayTeamWinLoseHolder);
  awayTeamContainer.appendChild(awayTeamDetailsHolder);
  if (!matchAlreadyHeld)
    awayTeamContainer.addEventListener(
      "click",
      updateMatchWinner.bind(null, awayTeamName, matchNumber, "")
    );

  // Score Container
  var scoreContainer = document.createElement("div");
  addClass(scoreContainer, "score-input-container");

  var awayTeamScoreContainer = document.createElement("div");
  addClass(awayTeamScoreContainer, "away-team-score-container");
  var awayTeamScoreInput = document.createElement("input");
  addClass(awayTeamScoreInput, "away-team-score-input");
  addClass(awayTeamScoreInput, "away-score-match-" + matchNumber);
  awayTeamScoreInput.setAttribute("type", "number");
  awayTeamScoreInput.setAttribute("value", awayTeamScore);
  awayTeamScoreInput.setAttribute("data-team-name", awayTeamName);
  awayTeamScoreInput.setAttribute("data-match-number", matchNumber);
  if (matchAlreadyHeld) {
    addClass(awayTeamScoreInput, "disabled-input");
    awayTeamScoreInput.setAttribute("disabled", "disabled");
  } else {
    awayTeamScoreInput.addEventListener("change", updateScoreInput);
  }
  awayTeamScoreContainer.appendChild(awayTeamScoreInput);
  scoreContainer.appendChild(awayTeamScoreContainer);
  var tieContainer = document.createElement("div");
  addClass(tieContainer, "tie-container");
  if (winnerTeamName == "TIE") addClass(tieContainer, "selected-team");
  var tieContainerText = document.createElement("span");
  addClass(tieContainerText, "tie-container-text");
  tieContainerText.innerHTML = "TIE";
  tieContainer.appendChild(tieContainerText);
  if (!matchAlreadyHeld)
    tieContainer.addEventListener(
      "click",
      updateMatchWinner.bind(null, "TIE", matchNumber, "")
    );
  addClass(tieContainer, "TIE" + "-team-container-" + matchNumber);
  scoreContainer.appendChild(tieContainer);

  var homeTeamScoreContainer = document.createElement("div");
  addClass(homeTeamScoreContainer, "home-team-score-container");
  var homeTeamScoreInput = document.createElement("input");
  addClass(homeTeamScoreInput, "home-team-score-input");
  addClass(homeTeamScoreInput, "home-score-match-" + matchNumber);
  homeTeamScoreInput.setAttribute("type", "number");
  homeTeamScoreInput.setAttribute("value", homeTeamScore);
  homeTeamScoreInput.setAttribute("data-team-name", homeTeamName);
  homeTeamScoreInput.setAttribute("data-match-number", matchNumber);
  if (matchAlreadyHeld) {
    addClass(homeTeamScoreInput, "disabled-input");
    homeTeamScoreInput.setAttribute("disabled", "disabled");
  } else {
    homeTeamScoreInput.addEventListener("change", updateScoreInput);
  }
  homeTeamScoreContainer.appendChild(homeTeamScoreInput);
  scoreContainer.appendChild(homeTeamScoreContainer);

  // Home team container
  var homeTeamContainer = document.createElement("div");
  addClass(homeTeamContainer, "home-team-container");
  if (homeTeamName == winnerTeamName)
    addClass(homeTeamContainer, "selected-team");

  var homeTeamLogo = document.createElement("img");
  addClass(homeTeamLogo, "home-team-logo");
  homeTeamLogo.setAttribute("src", teamsData[homeTeamName]["logo"]);
  homeTeamLogo.setAttribute("alt", homeTeamName);
  homeTeamLogo.setAttribute("width", "33px");
  homeTeamLogo.setAttribute("height", "22px");

  var homeTeamDetailsHolder = document.createElement("div");
  addClass(homeTeamDetailsHolder, "home-team-details-holder");
  var homeTeamNameHolder = document.createElement("span");
  addClass(homeTeamNameHolder, "home-team-name-holder");
  homeTeamNameHolder.innerHTML = homeTeamName;
  homeTeamDetailsHolder.appendChild(homeTeamNameHolder);
  homeTeamWinLoseHolder = document.createElement("span");
  addClass(homeTeamWinLoseHolder, "home-team-win-lose-holder");
  homeTeamWinLoseHolder.setAttribute("data-team-name", homeTeamName);
  homeTeamWinLoseHolder.innerHTML = generateWinLoseTieText(homeTeamName);
  homeTeamDetailsHolder.appendChild(homeTeamWinLoseHolder);
  homeTeamContainer.appendChild(homeTeamDetailsHolder);
  homeTeamContainer.appendChild(homeTeamLogo);
  if (!matchAlreadyHeld)
    homeTeamContainer.addEventListener(
      "click",
      updateMatchWinner.bind(null, homeTeamName, matchNumber, "")
    );

  addClass(
    awayTeamContainer,
    awayTeamName + "-team-container-" + matchNumber
  );
  addClass(
    homeTeamContainer,
    homeTeamName + "-team-container-" + matchNumber
  );
  matchContainer.appendChild(awayTeamContainer);
  matchContainer.appendChild(scoreContainer);
  matchContainer.appendChild(homeTeamContainer);

  return matchContainer;
}

function removeAllChild(cls) {
  if (cls) {
    cls.innerHTML = "";
  }
}

function showOverlay(check) {
  var overlay = $(".mds-overlay");
  if (check) {
    if (overlay && hasClass(overlay, "hidden")) {
      removeClass(overlay, "hidden");
    }
  } else {
    if (overlay && !hasClass(overlay, "hidden")) {
      addClass(overlay, "hidden");
    }
  }
}

function generateWinLoseTieText(teamName) {
  var teamData = teamsData[teamName];
  var winLoseTieText = teamData["Wins"] + " - " + teamData["Losses"];
  if (teamData["Ties"] > 0) {
    winLoseTieText = winLoseTieText + " - " + teamData["Ties"];
  }
  return winLoseTieText;
}

function generateWinLoseTieTextForStandings(teamName) {
  var teamData = teamsData[teamName];
  var winLoseTieText = teamData["Wins"] + "-" + teamData["Losses"];
  if (teamData["Ties"] > 0) {
    winLoseTieText = winLoseTieText + "-" + teamData["Ties"];
  }
  return winLoseTieText;
}

function generateConfWinLoseTieText(teamName) {
  var teamData = teamsData[teamName];
  var teamDataConf = teamData["ConferenceCounts"];
  var winLoseTieText = teamDataConf["Wins"] + "-" + teamDataConf["Losses"];
  if (teamDataConf["Ties"] > 0) {
    winLoseTieText = winLoseTieText + "-" + teamDataConf["Ties"];
  }
  return winLoseTieText;
}

function generateDivWinLoseTieText(teamName) {
  var teamData = teamsData[teamName];
  var teamDataDiv = teamData["DivisionCounts"];
  var winLoseTieText = teamDataDiv["Wins"] + "-" + teamDataDiv["Losses"];
  if (teamDataDiv["Ties"] > 0) {
    winLoseTieText = winLoseTieText + "-" + teamDataDiv["Ties"];
  }
  return winLoseTieText;
}

function scrollMatchContainer(matchNumber) {
  var weekContainer = $(".week-matches-container");
  var matchContainer = $(".match-" + matchNumber);
  if (
    matchContainer.offsetTop + matchContainer.offsetHeight >
    weekContainer.offsetHeight + weekContainer.offsetTop
  ) {
    weekContainer.scrollTop =
      matchContainer.offsetTop -
      weekContainer.offsetTop -
      weekContainer.offsetHeight + matchContainer.offsetHeight;
  }
}

function deleteWinLoseTieCount(matchNumber) {
  var homeTeam = weekMatchesData[matchNumber]["Home"];
  var awayTeam = weekMatchesData[matchNumber]["Away"];

  updateConferenceWinLoseCount(matchNumber, "");
  updateDivisonWinLoseCount(matchNumber, "");

  var previousMatchWinner = weekMatchesData[matchNumber]["Winner"];
  weekMatchesData[matchNumber]["Winner"] = "";

  if (previousMatchWinner == "TIE") {
    teamsData[homeTeam]["Ties"]--;
    teamsData[awayTeam]["Ties"]--;
  } else if (previousMatchWinner == homeTeam) {
    teamsData[homeTeam]["Wins"]--;
    teamsData[awayTeam]["Losses"]--;
  } else if (previousMatchWinner == awayTeam) {
    teamsData[awayTeam]["Wins"]--;
    teamsData[homeTeam]["Losses"]--;
  }
}

function deleteScoreInput(matchNumber) {
  weekMatchesData[matchNumber]["Away Score"] = 0;
  weekMatchesData[matchNumber]["Home Score"] = 0;
}

function deleteMatchData(matchNumber) {
  weekMatchesData[matchNumber]["systemGeneratedScore"] = false;
  deleteScoreStats(matchNumber);
  deleteWinLoseTieCount(matchNumber);
  deleteScoreInput(matchNumber);
  updateTeamStats(matchNumber);
}

function deleteMatchesWithWeek() {
  var week = currentWeek;

  if (week !== "0") {
    for (var i = 0; i < weekMatchesData.length; i++) {
      var matchData = weekMatchesData[i];
      if (
        matchData["Week"] == week &&
        !matchData["completed"] &&
        matchData["Winner"]
      ) {
        deleteMatchData(i);
      }
    }
  } else {
    for (var i = 0; i < weekMatchesData.length; i++) {
      var matchData = weekMatchesData[i];
      if (
        (matchData["Away"] === userSelectedGMTeam || matchData["Home"] === userSelectedGMTeam) &&
        !matchData["completed"] &&
        matchData["Winner"]
      ) {
        deleteMatchData(i);
      }
    }
  }

  showWeekData(currentWeek);
  updateStandingsData();
  updateSimulationButtonDisableStatus();
  disableDraftOrderSection(!canShowDraftOrder());
}

function deleteMatchesFromWeek() {
  var week = currentWeek;

  for (var i = 0; i < weekMatchesData.length; i++) {
    var matchData = weekMatchesData[i];
    if (
      matchData["Week"] >= week &&
      !matchData["completed"] &&
      matchData["Winner"]
    ) {
      deleteMatchData(i);
    }
  }

  showWeekData(currentWeek);
  updateStandingsData();
  updateSimulationButtonDisableStatus();
  disableDraftOrderSection(!canShowDraftOrder());
}

function deleteMatchesBeforeWeek() {
  var week = currentWeek;

  for (var i = 0; i < weekMatchesData.length; i++) {
    var matchData = weekMatchesData[i];
    if (
      matchData["Week"] < week &&
      !matchData["completed"] &&
      matchData["Winner"]
    ) {
      deleteMatchData(i);
    }
  }

  showWeekData(currentWeek);
  updateStandingsData();
  updateSimulationButtonDisableStatus();
  disableDraftOrderSection(!canShowDraftOrder());
}

function deleteMatchesAllWeek() {
  var week = currentWeek;

  for (var i = 0; i < weekMatchesData.length; i++) {
    var matchData = weekMatchesData[i];
    if (!matchData["completed"] && matchData["Winner"]) {
      deleteMatchData(i);
    }
  }

  showWeekData(currentWeek);
  updateStandingsData();
  updateSimulationButtonDisableStatus();
  disableDraftOrderSection(!canShowDraftOrder());
}

function startDeletion() {
  var container = $(".delete-popup-container");
  if (container) {
    var radioInputs = container.querySelectorAll(
      'input[type="radio"][name="delete"]'
    );
    var selectedOption;
    radioInputs.forEach((radio) => {
      if (radio.checked) {
        selectedOption = radio.value;
      }
    });
    if (selectedOption) {
      if (selectedOption == "option1") {
        deleteMatchesWithWeek();
      } else if (selectedOption == "option2") {
        deleteMatchesFromWeek();
      } else if (selectedOption == "option3") {
        deleteMatchesBeforeWeek();
      } else if (selectedOption == "option4") {
        deleteMatchesAllWeek();
      } else if (selectedOption == "option5") {
        resetPlayoffPredictions();
      }

      const playoffsOverlay = $(".predict-playoff-games-popup-content .playoffs-overlay");
      if (playoffsOverlay) {
        removeClass(playoffsOverlay, "hidden");
      }
    } else {
    }

    setUnpredictedMatchedCountText();
  }
  closeDeletePopUp();

  let continueBtn;
  if (IS_DESKTOP) {
    continueBtn = $(".info-text-continue-btn-container .continue-btn");
  } else {
    continueBtn = $(".simulation-ctas-container .continue-btn");
  }
  if (continueBtn) {
    if (playoffMatchesData["Super Bowl"]["winner"] == "") {
      continueBtn.disabled = true;
    } else {
      continueBtn.disabled = false;
    }
  }
}

function predictWinner(team1, team2) {
  var team1Pos = teamsList.indexOf(team1);
  var team2Pos = teamsList.indexOf(team2);

  var winningProbability = winProbabilityGrid[team2Pos][team1Pos];
  var randomNumber = Math.random().toFixed(2);

  if (reverseWinProbabilityGrid) {
    if (randomNumber < winningProbability) {
      return team1;
    } else {
      return team2;
    }
  } else {
    if (randomNumber < winningProbability) {
      return team2;
    } else {
      return team1;
    }
  }
}

function resumeSimulationFunction(matchNumber, simulateFunction, week) {
  return function (event) {
    var simulateButtonsContainer = $(".simulation-ctas-container");
    var pauseButton = simulateButtonsContainer.querySelector(".pause-button");
    var resumeButton =
      simulateButtonsContainer.querySelector(".resume-button");
    pauseSimulatorFlag = false;
    simulateFunction(matchNumber, week);
    if (resumeButton) {
      simulateButtonsContainer.removeChild(resumeButton);
    }
    if (hasClass(pauseButton, "hidden")) {
      removeClass(pauseButton, "hidden");
    }

    showSimulationOverLays();
  };
}

function addResumeButton(matchNumber, simulateFunction, week) {
  var simulateButtonsContainer = $(".simulation-ctas-container");
  var pauseButton = simulateButtonsContainer.querySelector(".pause-button");

  if (!hasClass(pauseButton, "hidden")) {
    addClass(pauseButton, "hidden");
  }

  var resumeButton = document.createElement("button");
  resumeButton.addEventListener(
    "click",
    resumeSimulationFunction(matchNumber, simulateFunction, week)
  );
  addClass(resumeButton, "resume-button");

  var icon = document.createElement("img");
  icon.setAttribute(
    "src",
    STATIC_URL + "/skm/assets/playoff-predictor/simulate-btn-blue.png"
  );
  icon.setAttribute("width", "18px");

  var paragraph = document.createElement("span");
  paragraph.textContent = "Resume";

  resumeButton.appendChild(icon);
  resumeButton.appendChild(paragraph);

  const continueBtn = simulateButtonsContainer.querySelector(".continue-btn");
  if (continueBtn && !IS_DESKTOP) {
    simulateButtonsContainer.insertBefore(resumeButton, continueBtn);
  } else {
    simulateButtonsContainer.appendChild(resumeButton);
  }
}

function showSimulationOverLays() {
  let playoffParticipantsContainer = $(".playoff-predictor-tool-wrapper .playoff-participants-container");
  if (playoffParticipantsContainer) {
    addClass(playoffParticipantsContainer, "simulation-overlay");
  }

  let playoffStandingsContainer = $(".playoff-predictor-tool-wrapper .playoff-participants-standings-container");
  if (playoffStandingsContainer) {
    addClass(playoffStandingsContainer, "simulation-overlay");
  }

  let standingsConferenceContainer = $(".standings-section .conference-standings");
  if (standingsConferenceContainer) {
    addClass(standingsConferenceContainer, "simulation-overlay");
  }

  let standingsDivisionContainer = $(".playoff-predictor-tool-wrapper .division-standings");
  if (standingsDivisionContainer) {
    addClass(standingsDivisionContainer, "simulation-overlay");
  }

  let draftOrderContainer = $(".draft-order-section-wrapper .draft-order-table");
  if (draftOrderContainer) {
    addClass(draftOrderContainer, "simulation-overlay");
  }

  let utilityContainers = $all(".utility-container");
  if (utilityContainers.length) {
    utilityContainers.forEach(container => addClass(container, "hidden"));
  }
}

function removeSimulationOverLays() {
  let playoffParticipantsContainer = $(".playoff-predictor-tool-wrapper .playoff-participants-container");
  if (playoffParticipantsContainer) {
    removeClass(playoffParticipantsContainer, "simulation-overlay");
  }

  let playoffStandingsContainer = $(".playoff-predictor-tool-wrapper .playoff-participants-standings-container");
  if (playoffStandingsContainer) {
    removeClass(playoffStandingsContainer, "simulation-overlay");
  }

  let standingsConferenceContainer = $(".standings-section .conference-standings");
  if (standingsConferenceContainer) {
    removeClass(standingsConferenceContainer, "simulation-overlay");
  }

  let standingsDivisionContainer = $(".playoff-predictor-tool-wrapper .division-standings");
  if (standingsDivisionContainer) {
    removeClass(standingsDivisionContainer, "simulation-overlay");
  }

  let draftOrderContainer = $(".draft-order-section-wrapper .draft-order-table");
  if (draftOrderContainer) {
    removeClass(draftOrderContainer, "simulation-overlay");
  }

  let utilityContainers = $all(".utility-container");
  if (utilityContainers.length) {
    utilityContainers.forEach(container => removeClass(container, "hidden"));
  }
}

function calculateSimulationResults() {
  showConferenceStandingsData();
  showDivisionStandingsData();
  setPlayoffParticipants();
  setPlayoffParticipantsStandings();
  updateDraftOrder();

  removeSimulationOverLays();
}

function simulateMyGamesMatches() {
  let matchNumber;
  for (let i = 0; i < weekMatchesData.length; i++) {
    if ((weekMatchesData[i]["Home"] === userSelectedGMTeam || weekMatchesData[i]["Away"] === userSelectedGMTeam) && !
      weekMatchesData[i]["Winner"] &&
      !weekMatchesData["completed"]) {
      matchNumber = i;
      break;
    }
  }
  if (matchNumber === undefined) {
    setUnpredictedMatchedCountText();
    const pauseBtn = $(".simulation-ctas-container .pause-button");
    if (pauseBtn) {
      addClass(pauseBtn, "hidden");
    }

    const simulateBtn = $(".simulation-ctas-container .simulate-button");
    if (simulateBtn) {
      removeClass(simulateBtn, "hidden");
      const unpredictedMatchesCount = getUnpredictedMatchesCount();
      if (unpredictedMatchesCount === 0) {
        addClass(simulateBtn, "default-disabled-button");
      }
    }

    const resetBtn = $(".simulation-ctas-container .delete-button");
    if (resetBtn) {
      removeClass(resetBtn, "disabled-button");
      resetBtn.disabled = false;
    }
    return;
  }
  var matchData = weekMatchesData[matchNumber];
  if (matchNumber >= weekMatchesData.length) {
    disabledSimulateCTA(false);

    calculateSimulationResults();
    return;
  }
  if (pauseSimulatorFlag) {
    addResumeButton(matchNumber, simulateMyGamesMatches, "0");
    return;
  }
  if (
    !matchData["Winner"] &&
    !matchData["completed"] &&
    matchNumber < weekMatchesData.length
  ) {
    setTimeout(() => {
      scheduleMatchResultUpdate(matchNumber, true);
      simulateMyGamesMatches();
      autoPopupPlayoffPredictor();
    }, simulationSpeed);
  } else {
    simulateMyGamesMatches(matchNumber + 1);
  }
}

function simulateMatchesWithCurrentWeek(matchNumber = 0, week) {
  var matchData = weekMatchesData[matchNumber];
  if (matchNumber >= weekMatchesData.length || matchData["Week"] > week) {
    setUnpredictedMatchedCountText();
    disabledSimulateCTA(false);

    calculateSimulationResults();
    return;
  }
  if (pauseSimulatorFlag) {
    addResumeButton(matchNumber, simulateMatchesWithCurrentWeek, week);
    return;
  }
  if (
    !matchData["Winner"] &&
    matchData["Week"] == week &&
    !matchData["completed"]
  ) {
    setTimeout(() => {
      scheduleMatchResultUpdate(matchNumber);
      simulateMatchesWithCurrentWeek(matchNumber + 1, week);
      autoPopupPlayoffPredictor();
    }, simulationSpeed);
  } else {
    simulateMatchesWithCurrentWeek(matchNumber + 1, week);
  }
}

function simulateMatchesWithAllWeek(matchNumber = 0, week) {
  if (matchNumber >= weekMatchesData.length) {
    setUnpredictedMatchedCountText();
    disabledSimulateCTA(false);
    calculateSimulationResults();
    return;
  }
  if (pauseSimulatorFlag) {
    addResumeButton(matchNumber, simulateMatchesWithAllWeek, week);
    return;
  }
  var matchData = weekMatchesData[matchNumber];
  if (!matchData["Winner"] && !matchData["completed"]) {
    setTimeout(() => {
      scheduleMatchResultUpdate(matchNumber);
      simulateMatchesWithAllWeek(matchNumber + 1, week);
      autoPopupPlayoffPredictor();
    }, simulationSpeed);
  } else {
    simulateMatchesWithAllWeek(matchNumber + 1, week);
  }
}

var startTime = Date.now();

function simulateMatchesWithAllWeekForQual(matchNumber = 0, week) {
  if (matchNumber >= weekMatchesData.length) {
    return;
  }
  var matchData = weekMatchesData[matchNumber];
  if (!matchData["completed"]) {
    simulateMatchResultUpdate(matchNumber);
    simulateMatchesWithAllWeekForQual(matchNumber + 1, week);
  } else {
    simulateMatchesWithAllWeekForQual(matchNumber + 1, week);
  }
}

function autoPopupPlayoffPredictor() {
  if (checkAllWeekMatchesCompleted()) {
    setTimeout(() => {
      showPredictPlayoffGamesPopup();
      const playoffsOverlay = $(".predict-playoff-games-popup-content .playoffs-overlay");
      if (playoffsOverlay) {
        addClass(playoffsOverlay, "hidden");
      }
    }, 100);
  }
}

function simulateMatchesFromCurrentWeek(matchNumber = 0, week) {
  if (matchNumber >= weekMatchesData.length) {
    setUnpredictedMatchedCountText();
    disabledSimulateCTA(false);

    calculateSimulationResults();
    return;
  }
  if (pauseSimulatorFlag) {
    addResumeButton(matchNumber, simulateMatchesFromCurrentWeek, week);
    return;
  }
  var matchData = weekMatchesData[matchNumber];
  if (
    !matchData["Winner"] &&
    matchData["Week"] >= week &&
    !matchData["completed"]
  ) {
    setTimeout(() => {
      scheduleMatchResultUpdate(matchNumber);
      simulateMatchesFromCurrentWeek(matchNumber + 1, week);
      autoPopupPlayoffPredictor();
    }, simulationSpeed);
  } else {
    simulateMatchesFromCurrentWeek(matchNumber + 1, week);
  }
}

function scheduleMatchResultUpdate(matchNumber, myGames) {
  var matchData = weekMatchesData[matchNumber];
  var matchWinner = predictWinner(matchData["Home"], matchData["Away"]);
  var matchWeek = matchData["Week"];
  if (!myGames) {
    if (matchWeek != currentWeek) changeWeek("", matchData["Week"]);
  }
  updateMatchWinner(matchWinner, matchNumber, true, "");
  scrollMatchContainer(matchNumber);
}

function simulateMatchResultUpdate(matchNumber) {
  var matchData = weekMatchesData[matchNumber];
  var matchWinner = predictWinner(matchData["Home"], matchData["Away"]);

  var matchWeek = matchData["Week"];
  simulateMatchWinner(matchWinner, matchNumber);
  disableDraftOrderSection(!canShowDraftOrder());
}

function simulateMatchWinner(winnerTeamName, matchNumber) {
  weekMatchesData[matchNumber]["Winner"] = winnerTeamName;
  updateScoreInputWithRandom(winnerTeamName, matchNumber);
}

function disabledSimulateCTA(check) {
  var simulateButtonsContainer = $(".simulation-ctas-container");
  var deleteButton = simulateButtonsContainer.querySelector(".delete-button");
  var pauseButton = simulateButtonsContainer.querySelector(".pause-button");
  var simulateButton =
    simulateButtonsContainer.querySelector(".simulate-button");
  if (check) {
    if (!deleteButton.hasAttribute("disabled")) {
      deleteButton.setAttribute("disabled", "disabled");
    }
    if (!hasClass(deleteButton, "disabled-button")) {
      addClass(deleteButton, "disabled-button");
    }
  } else {
    if (deleteButton.hasAttribute("disabled")) {
      deleteButton.removeAttribute("disabled");
    }
    if (hasClass(deleteButton, "disabled-button")) {
      removeClass(deleteButton, "disabled-button");
    }
  }

  if (check) {
    if (hasClass(pauseButton, "hidden")) {
      removeClass(pauseButton, "hidden");
    }
    if (!hasClass(simulateButton, "hidden")) {
      addClass(simulateButton, "hidden");
    }
  } else {
    if (!hasClass(pauseButton, "hidden")) {
      addClass(pauseButton, "hidden");
    }
    if (hasClass(simulateButton, "hidden")) {
      removeClass(simulateButton, "hidden");
    }
  }
}

function pauseSimulation() {
  pauseSimulatorFlag = true;
  setUnpredictedMatchedCountText();

  calculateSimulationResults();
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function startSimulation() {
  var container = $(".simulate-popup-container");
  if (container) {
    var radioInputs = container.querySelectorAll(
      'input[type="radio"][name="simulate"]'
    );
    var selectedOption;
    radioInputs.forEach((radio) => {
      if (radio.checked) {
        selectedOption = radio.value;
      }
    });

    if (selectedOption) {
      pauseSimulatorFlag = false;
      autoPopupPlayoffPredictorFlag = true;
      disabledSimulateCTA(true);
      scrollToTop();
      if (currentWeek === "0" && selectedOption == "option1") {
        simulateMyGamesMatches();
      } else {
        if (selectedOption == "option1") {
          simulateMatchesWithCurrentWeek(0, currentWeek);
        } else if (selectedOption == "option2") {
          simulateMatchesFromCurrentWeek(0, currentWeek);
        } else if (selectedOption == "option3") {
          simulateMatchesWithAllWeek(0, landingWeek);
        } else if (selectedOption == "option4") {
          var playoffSimBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
          var playoffPauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
          simulatePlayoffMatches();
          if (playoffSimBtn && playoffPauseBtn) {
            playoffSimBtn.classList.add("hidden");
            playoffPauseBtn.classList.remove("hidden");
          }
        }
      }

      showSimulationOverLays();
    } else {
    }
  }
  closeSimulatePopUp();
}

function deleteScoreStats(matchNumber) {
  var matchData = weekMatchesData[matchNumber];

  var awayTeam = matchData["Away"];
  var homeTeam = matchData["Home"];

  teamsData[awayTeam]["PF"] =
    teamsData[awayTeam]["PF"] - matchData["Away Score"];
  teamsData[homeTeam]["PF"] =
    teamsData[homeTeam]["PF"] - matchData["Home Score"];

  teamsData[awayTeam]["PA"] =
    teamsData[awayTeam]["PA"] - matchData["Home Score"];
  teamsData[homeTeam]["PA"] =
    teamsData[homeTeam]["PA"] - matchData["Away Score"];

  teamsData[homeTeam]["PD"] =
    teamsData[homeTeam]["PF"] - teamsData[homeTeam]["PA"];
  teamsData[awayTeam]["PD"] =
    teamsData[awayTeam]["PF"] - teamsData[awayTeam]["PA"];
}

function updateScoreStats(matchNumber) {
  var matchData = weekMatchesData[matchNumber];

  var awayTeam = matchData["Away"];
  var homeTeam = matchData["Home"];

  teamsData[awayTeam]["PF"] =
    teamsData[awayTeam]["PF"] + matchData["Away Score"];
  teamsData[homeTeam]["PF"] =
    teamsData[homeTeam]["PF"] + matchData["Home Score"];

  teamsData[awayTeam]["PA"] =
    teamsData[awayTeam]["PA"] + matchData["Home Score"];
  teamsData[homeTeam]["PA"] =
    teamsData[homeTeam]["PA"] + matchData["Away Score"];

  teamsData[homeTeam]["PD"] =
    teamsData[homeTeam]["PF"] - teamsData[homeTeam]["PA"];
  teamsData[awayTeam]["PD"] =
    teamsData[awayTeam]["PF"] - teamsData[awayTeam]["PA"];
}

function updateScoreInput(e) {
  var matchNumber = e.target.getAttribute("data-match-number");
  var teamName = e.target.getAttribute("data-team-name");
  var scoreValue = e.target.value;
  var matchData = weekMatchesData[matchNumber];

  if (isNaN(scoreValue)) return;

  scoreValue = Number(scoreValue);

  deleteScoreStats(matchNumber);

  var userEnteredScore = e.target.getAttribute("data-user-score");
  if (!userEnteredScore && !weekMatchesData[matchNumber]["systemGeneratedScore"]) {
    e.target.setAttribute("data-user-score", 1);
  }

  if (matchData["Away"] == teamName) {
    matchData["Away Score"] = scoreValue;
    updateScoreStats(matchNumber);
    if (matchData["Home Score"] == 0) return;
  } else {
    matchData["Home Score"] = scoreValue;
    updateScoreStats(matchNumber);
    if (matchData["Away Score"] == 0) return;
  }


  if (weekMatchesData[matchNumber]["systemGeneratedScore"]) {
    e.target.setAttribute("data-user-score", 1);
    weekMatchesData[matchNumber]["systemGeneratedScore"] = false;
  }


  var homeScore = matchData["Home Score"];
  var awayScore = matchData["Away Score"];

  let awayTeamSelector = `.away-team-container.` + matchData["Away"] + `-team-container-` + matchNumber;
  let homeTeamSelector = `.home-team-container.` + matchData["Home"] + `-team-container-` + matchNumber;
  let awayTeamContainer = $(awayTeamSelector);
  let homeTeamContainer = $(homeTeamSelector);
  if (homeScore > awayScore) {
    if (!hasClass(homeTeamContainer, "selected-team")) {
    }
    updateMatchContainer(matchData["Home"], matchNumber);
  } else if (homeScore < awayScore) {
    if (!hasClass(awayTeamContainer, "selected-team")) {
    }
    updateMatchContainer(matchData["Away"], matchNumber);
  } else {
    if (!hasClass(awayTeamContainer, "selected-team") && !hasClass(homeTeamContainer, "selected-team")) {
    }
    updateMatchContainer("TIE", matchNumber);
  }

  updateStandingsData();
  updateSimulationButtonDisableStatus();
}

function updateMatchWinner(winnerTeamName, matchNumber, autoSim, event) {
  weekMatchesData[matchNumber]["systemGeneratedScore"] = true;
  if (weekMatchesData[matchNumber]["Winner"] == winnerTeamName) return;

  updateMatchContainer(winnerTeamName, matchNumber);

  setTimeout(function () {
    deleteScoreStats(matchNumber);
    updateScoreInputWithRandom(winnerTeamName, matchNumber);
    updateScoreStats(matchNumber);
    updateStandingsData(autoSim);
    updateSimulationButtonDisableStatus();
    disableDraftOrderSection(!canShowDraftOrder());
  }, 50);

  setUnpredictedMatchedCountText();
  if (!autoSim) {
    autoPopupPlayoffPredictor();
  }
}

function updateMatchContainer(winnerTeamName, matchNumber) {
  var homeTeam = weekMatchesData[matchNumber]["Home"];
  var awayTeam = weekMatchesData[matchNumber]["Away"];
  var previousMatchWinner = weekMatchesData[matchNumber]["Winner"];
  var winnerOptions = [homeTeam, awayTeam, "TIE"];

  if (previousMatchWinner == winnerTeamName) return;

  winnerOptions.forEach(function (option) {
    var optionContainer = $("." + option + "-team-container-" + matchNumber);
    if (option == winnerTeamName) {
      if (!hasClass(optionContainer, "selected-team")) {
        addClass(optionContainer, "selected-team");
      }
    } else {
      if (hasClass(optionContainer, "selected-team")) {
        removeClass(optionContainer, "selected-team");
      }
    }
  });

  updateWinLoseTieCount(winnerTeamName, matchNumber);
  updateTeamStats(matchNumber);
  updateWinLoseTieText();
}

function updateTeamStats(matchNumber) {
  var matchData = weekMatchesData[matchNumber];

  var homeTeam = matchData["Home"];
  var awayTeam = matchData["Away"];

  var totalHomeTeamMatches =
    teamsData[homeTeam]["Wins"] +
    teamsData[homeTeam]["Losses"] +
    teamsData[homeTeam]["Ties"];
  var totalAwayTeamMatches =
    teamsData[awayTeam]["Wins"] +
    teamsData[awayTeam]["Losses"] +
    teamsData[awayTeam]["Ties"];

  teamsData[homeTeam]["Winning %"] =
    (teamsData[homeTeam]["Wins"] + teamsData[homeTeam]["Ties"] / 2) /
    totalHomeTeamMatches;
  teamsData[awayTeam]["Winning %"] =
    (teamsData[awayTeam]["Wins"] + teamsData[awayTeam]["Ties"] / 2) /
    totalAwayTeamMatches;
}

function simulateDivisionWinLoseCount(matchNumber) {
  var matchData = weekMatchesData[matchNumber];
  var awayTeam = matchData["Away"];
  var homeTeam = matchData["Home"];

  var winnerTeamName = matchData["Winner"];

  if (teamsData[awayTeam]["Division"] == teamsData[homeTeam]["Division"]) {
    if (winnerTeamName) {
      if (winnerTeamName == "TIE") {
        teamsData[homeTeam]["DivisionCounts"]["Ties"]++;
        teamsData[awayTeam]["DivisionCounts"]["Ties"]++;
      } else if (winnerTeamName == homeTeam) {
        teamsData[homeTeam]["DivisionCounts"]["Wins"]++;
        teamsData[awayTeam]["DivisionCounts"]["Losses"]++;
      } else if (winnerTeamName == awayTeam) {
        teamsData[awayTeam]["DivisionCounts"]["Wins"]++;
        teamsData[homeTeam]["DivisionCounts"]["Losses"]++;
      }
    }
  }
}

function simulateConferenceWinLoseCount(matchNumber) {
  var matchData = weekMatchesData[matchNumber];
  var awayTeam = matchData["Away"];
  var homeTeam = matchData["Home"];

  var winnerTeamName = matchData["Winner"];
  if (teamsData[awayTeam]["Conference"] == teamsData[homeTeam]["Conference"]) {
    if (winnerTeamName) {
      if (winnerTeamName == "TIE") {
        teamsData[homeTeam]["ConferenceCounts"]["Ties"]++;
        teamsData[awayTeam]["ConferenceCounts"]["Ties"]++;
      } else if (winnerTeamName == homeTeam) {
        teamsData[homeTeam]["ConferenceCounts"]["Wins"]++;
        teamsData[awayTeam]["ConferenceCounts"]["Losses"]++;
      } else if (winnerTeamName == awayTeam) {
        teamsData[awayTeam]["ConferenceCounts"]["Wins"]++;
        teamsData[homeTeam]["ConferenceCounts"]["Losses"]++;
      }
    }
  }
}

function updateDivisonWinLoseCount(matchNumber, winnerTeamName) {
  var matchData = weekMatchesData[matchNumber];
  var awayTeam = matchData["Away"];
  var homeTeam = matchData["Home"];

  var previousMatchWinner = matchData["Winner"];

  if (teamsData[awayTeam]["Division"] == teamsData[homeTeam]["Division"]) {
    if (previousMatchWinner) {
      if (previousMatchWinner == "TIE") {
        teamsData[homeTeam]["DivisionCounts"]["Ties"]--;
        teamsData[awayTeam]["DivisionCounts"]["Ties"]--;
      } else if (previousMatchWinner == homeTeam) {
        teamsData[homeTeam]["DivisionCounts"]["Wins"]--;
        teamsData[awayTeam]["DivisionCounts"]["Losses"]--;
      } else if (previousMatchWinner == awayTeam) {
        teamsData[awayTeam]["DivisionCounts"]["Wins"]--;
        teamsData[homeTeam]["DivisionCounts"]["Losses"]--;
      }
    }

    if (winnerTeamName) {
      if (winnerTeamName == "TIE") {
        teamsData[homeTeam]["DivisionCounts"]["Ties"]++;
        teamsData[awayTeam]["DivisionCounts"]["Ties"]++;
      } else if (winnerTeamName == homeTeam) {
        teamsData[homeTeam]["DivisionCounts"]["Wins"]++;
        teamsData[awayTeam]["DivisionCounts"]["Losses"]++;
      } else if (winnerTeamName == awayTeam) {
        teamsData[awayTeam]["DivisionCounts"]["Wins"]++;
        teamsData[homeTeam]["DivisionCounts"]["Losses"]++;
      }
    }
  }
}

function updateConferenceWinLoseCount(matchNumber, winnerTeamName) {
  var matchData = weekMatchesData[matchNumber];
  var awayTeam = matchData["Away"];
  var homeTeam = matchData["Home"];

  var previousMatchWinner = matchData["Winner"];
  if (
    teamsData[awayTeam]["Conference"] == teamsData[homeTeam]["Conference"]
  ) {
    if (previousMatchWinner) {
      if (previousMatchWinner == "TIE") {
        teamsData[homeTeam]["ConferenceCounts"]["Ties"]--;
        teamsData[awayTeam]["ConferenceCounts"]["Ties"]--;
      } else if (previousMatchWinner == homeTeam) {
        teamsData[homeTeam]["ConferenceCounts"]["Wins"]--;
        teamsData[awayTeam]["ConferenceCounts"]["Losses"]--;
      } else if (previousMatchWinner == awayTeam) {
        teamsData[awayTeam]["ConferenceCounts"]["Wins"]--;
        teamsData[homeTeam]["ConferenceCounts"]["Losses"]--;
      }
    }

    if (winnerTeamName) {
      if (winnerTeamName == "TIE") {
        teamsData[homeTeam]["ConferenceCounts"]["Ties"]++;
        teamsData[awayTeam]["ConferenceCounts"]["Ties"]++;
      } else if (winnerTeamName == homeTeam) {
        teamsData[homeTeam]["ConferenceCounts"]["Wins"]++;
        teamsData[awayTeam]["ConferenceCounts"]["Losses"]++;
      } else if (winnerTeamName == awayTeam) {
        teamsData[awayTeam]["ConferenceCounts"]["Wins"]++;
        teamsData[homeTeam]["ConferenceCounts"]["Losses"]++;
      }
    }
  }
}

function updateWinLoseTieCount(winnerTeamName, matchNumber) {
  var homeTeam = weekMatchesData[matchNumber]["Home"];
  var awayTeam = weekMatchesData[matchNumber]["Away"];
  var previousMatchWinner = weekMatchesData[matchNumber]["Winner"];

  if (previousMatchWinner == "TIE") {
    teamsData[homeTeam]["Ties"]--;
    teamsData[awayTeam]["Ties"]--;
  } else if (previousMatchWinner == homeTeam) {
    teamsData[homeTeam]["Wins"]--;
    teamsData[awayTeam]["Losses"]--;
  } else if (previousMatchWinner == awayTeam) {
    teamsData[awayTeam]["Wins"]--;
    teamsData[homeTeam]["Losses"]--;
  }

  if (winnerTeamName == "TIE") {
    teamsData[homeTeam]["Ties"]++;
    teamsData[awayTeam]["Ties"]++;
  } else if (winnerTeamName == homeTeam) {
    teamsData[homeTeam]["Wins"]++;
    teamsData[awayTeam]["Losses"]++;
  } else if (winnerTeamName == awayTeam) {
    teamsData[awayTeam]["Wins"]++;
    teamsData[homeTeam]["Losses"]++;
  }

  updateDivisonWinLoseCount(matchNumber, winnerTeamName);
  updateConferenceWinLoseCount(matchNumber, winnerTeamName);

  weekMatchesData[matchNumber]["Winner"] = winnerTeamName;
}

function simulateWinLoseTieCount(matchNumber) {
  var homeTeam = weekMatchesData[matchNumber]["Home"];
  var awayTeam = weekMatchesData[matchNumber]["Away"];

  if (weekMatchesData[matchNumber]["completed"]) return;

  var winnerTeamName = weekMatchesData[matchNumber]["Winner"];

  if (winnerTeamName == "TIE") {
    teamsData[homeTeam]["Ties"]++;
    teamsData[awayTeam]["Ties"]++;
  } else if (winnerTeamName == homeTeam) {
    teamsData[homeTeam]["Wins"]++;
    teamsData[awayTeam]["Losses"]++;
  } else if (winnerTeamName == awayTeam) {
    teamsData[awayTeam]["Wins"]++;
    teamsData[homeTeam]["Losses"]++;
  }

  simulateDivisionWinLoseCount(matchNumber);
  simulateConferenceWinLoseCount(matchNumber);

  weekMatchesData[matchNumber]["Winner"] = winnerTeamName;
}

function updateScoreInputWithRandom(winnerTeamName, matchNumber) {
  var homeTeam = weekMatchesData[matchNumber]["Home"];
  var awayTeam = weekMatchesData[matchNumber]["Away"];
  var winnerScore = generateRandomScore();
  if (winnerTeamName == "TIE") {
    weekMatchesData[matchNumber]["Away Score"] = winnerScore;
    weekMatchesData[matchNumber]["Home Score"] = winnerScore;
  } else {
    var loserScore = generateRandomScore(winnerScore - 1);
    if (winnerTeamName == awayTeam) {
      weekMatchesData[matchNumber]["Away Score"] = winnerScore;
      weekMatchesData[matchNumber]["Home Score"] = loserScore;
    } else {
      weekMatchesData[matchNumber]["Home Score"] = winnerScore;
      weekMatchesData[matchNumber]["Away Score"] = loserScore;
    }
  }
  var awayTeamScoreInput = $(".away-score-match-" + matchNumber);
  if (awayTeamScoreInput) {
    awayTeamScoreInput.value = weekMatchesData[matchNumber]["Away Score"];
  }
  var homeTeamScoreInput = $(".home-score-match-" + matchNumber);
  if (homeTeamScoreInput) {
    homeTeamScoreInput.value = weekMatchesData[matchNumber]["Home Score"];
  }
}

function updateWinLoseTieText() {
  var awayTeamTextElement = $all(".away-team-win-lose-holder");
  var homeTeamTextElement = $all(".home-team-win-lose-holder");

  awayTeamTextElement.forEach(function (element) {
    var teamName = element.getAttribute("data-team-name");

    element.innerHTML = generateWinLoseTieText(teamName);
  });

  homeTeamTextElement.forEach(function (element) {
    var teamName = element.getAttribute("data-team-name");

    element.innerHTML = generateWinLoseTieText(teamName);
  });
}

function showWeekData(weekNumber) {
  var weekMatchesContainer = $(".week-matches-container");

  removeAllChild(weekMatchesContainer);

  var awayHomeTextContainer = document.createElement("div");
  addClass(awayHomeTextContainer, "away-home-text-container");

  var awayContainerHeader = document.createElement("div");
  addClass(awayContainerHeader, "away-container-header");

  var awayContainerHeaderText = document.createElement("span");
  addClass(awayContainerHeaderText, "away-container-header-text");
  awayContainerHeaderText.innerHTML = "AWAY";

  awayContainerHeader.appendChild(awayContainerHeaderText);
  awayHomeTextContainer.appendChild(awayContainerHeader);

  var homeContainerHeader = document.createElement("div");
  addClass(homeContainerHeader, "home-container-header");

  var homeContainerHeaderText = document.createElement("span");
  addClass(homeContainerHeaderText, "home-container-header-text");
  homeContainerHeaderText.innerHTML = "HOME";

  homeContainerHeader.appendChild(homeContainerHeaderText);
  awayHomeTextContainer.appendChild(homeContainerHeader);

  weekMatchesContainer.appendChild(awayHomeTextContainer);

  var currentWeekMatchesContainer = document.createElement("div");
  addClass(currentWeekMatchesContainer, "current-week-matches-container");

  if (weekNumber !== "0") {
    for (var i = 0; i < weekMatchesData.length; i++) {
      if (weekMatchesData[i]["Week"] == weekNumber) {
        currentWeekMatchesContainer.appendChild(createMatchElement(i));
      }
    }
  } else {
    for (var i = 0; i < weekMatchesData.length; i++) {
      if (weekMatchesData[i]["Away"] === userSelectedGMTeam || weekMatchesData[i]["Home"] === userSelectedGMTeam) {
        currentWeekMatchesContainer.appendChild(createMatchElement(i));
      }
    }
  }

  weekMatchesContainer.appendChild(currentWeekMatchesContainer);

  weekMatchesContainer.scrollTop = 0;

  if (weekNumber !== "0") {
    showTeamsOnBye(weekNumber);
  } else {
    const byeTeamsContainer = $(".bye-teams-container");
    removeAllChild(byeTeamsContainer);
  }
}

function showTeamsOnBye(weekNumber) {
  var teamsPlayed = [];
  for (var i = 0; i < weekMatchesData.length; i++) {
    if (weekMatchesData[i]["Week"] == weekNumber) {
      var matchData = weekMatchesData[i];
      teamsPlayed.push(matchData["Home"]);
      teamsPlayed.push(matchData["Away"]);
    }
  }

  var teamsOnByeList = teamsList.filter(function (item) {
    return teamsPlayed.indexOf(item) === -1;
  });

  var byeTeamsContainer = $(".bye-teams-container");

  removeAllChild(byeTeamsContainer);

  if (teamsOnByeList.length) {
    var teamsOnByeText = document.createElement("span");
    addClass(teamsOnByeText, "teams-on-bye-text");
    teamsOnByeText.innerHTML = "Teams on Bye :";
    byeTeamsContainer.appendChild(teamsOnByeText);
  }

  for (var i = 0; i < teamsOnByeList.length; i++) {
    var teamsOnByeLogo = document.createElement("img");
    addClass(teamsOnByeLogo, "teams-on-bye-logo");
    teamsOnByeLogo.setAttribute("src", teamsData[teamsOnByeList[i]]["logo"]);
    teamsOnByeLogo.setAttribute("alt", teamsOnByeList[i]);
    teamsOnByeLogo.setAttribute("height", "30px");
    teamsOnByeLogo.setAttribute("width", "20px");
    byeTeamsContainer.appendChild(teamsOnByeLogo);
  }
}

function changeWeek(e, week = "") {
  var weekNumber = week;
  if (!weekNumber && weekNumber !== "0") {
    weekNumber = e.target.getAttribute("data-week-number");
  }
  currentWeek = weekNumber;

  var prevSelectedWeek = $(".selected-week");
  if (prevSelectedWeek) {
    removeClass(prevSelectedWeek, "selected-week");
  }

  var weekClassName = ".week" + weekNumber + "-holder";
  var selectedWeek = $(weekClassName);

  if (selectedWeek) {
    addClass(selectedWeek, "selected-week");

    var weekScrollableContainer = $(".week-carousel");

    if (selectedWeek.offsetLeft - weekScrollableContainer.offsetLeft > 0) {
      weekScrollableContainer.scrollLeft =
        selectedWeek.offsetLeft -
        weekScrollableContainer.offsetLeft -
        2 * selectedWeek.offsetWidth;
    }
  }

  showWeekData(weekNumber);
}

function setWeekCarousel() {
  var weekCarouselContainer = $(".week-carousel");
  if (weekCarouselContainer) {
    weekCarouselContainer.innerHTML = "";
  }

  var weekHolder = document.createElement("div");
  addClass(weekHolder, "week-holder");
  addClass(weekHolder, "week0-holder");
  weekHolder.setAttribute("data-week-number", "0");
  addClass(weekHolder, "selected-week");
  var weekNumber = document.createElement("span");
  addClass(weekNumber, "week-number");
  weekNumber.innerHTML = "My Games";
  weekNumber.setAttribute("data-week-number", "0");
  weekHolder.appendChild(weekNumber);
  weekHolder.addEventListener("click", changeWeek);
  weekCarouselContainer.appendChild(weekHolder);

  for (var i = 1; i <= totalWeeks; i++) {
    var weekHolder = document.createElement("div");
    addClass(weekHolder, "week-holder");
    addClass(weekHolder, "week" + i + "-holder");
    weekHolder.setAttribute("data-week-number", i);
    var weekNumber = document.createElement("span");
    addClass(weekNumber, "week-number");
    weekNumber.innerHTML = "Week " + i;
    weekNumber.setAttribute("data-week-number", i);
    weekHolder.appendChild(weekNumber);
    weekHolder.addEventListener("click", changeWeek);
    weekCarouselContainer.appendChild(weekHolder);
  }

  var leftScrollButton = $(".week-carousel-control-btn.left-scroll-button");
  var rightScrollButton = $(".week-carousel-control-btn.right-scroll-button");

  if (IS_DESKTOP) {
    initListScroll(
      weekCarouselContainer,
      leftScrollButton,
      rightScrollButton
    );
  }
}

function initListScroll(container, leftScrollButton, rightScrollButton) {
  leftScrollButton.onclick = function () {
    container.scrollBy({
      behavior: "smooth",
      top: 0,
      left: -300,
    });
  };

  rightScrollButton.onclick = function () {
    container.scrollBy({
      behavior: "smooth",
      top: 0,
      left: 300,
    });
  };

  new KeedaCarousalControlsHelper({
    target: container,
    whenFistItemInViewport: function (entry) {
      addClass(leftScrollButton, "hidden");
    },
    whenFistItemNotInViewport: function (entry) {
      if (container.children.length > 0) {
        removeClass(leftScrollButton, "hidden");
      }
    },
    whenLastItemInViewport: function (entry) {
      addClass(rightScrollButton, "hidden");
    },
    whenLastItemNotInViewport: function (entry) {
      if (container.children.length > 0) {
        removeClass(rightScrollButton, "hidden");
      }
    },
  }).observeTarget();
}

function updateSimulationButtonDisableStatus() {
  var deleteButton = $(".delete-button");
  if (!checkAnyAllWeekMatchesCompleted()) {
    if (!hasClass(deleteButton, "default-disabled-button")) {
      addClass(deleteButton, "default-disabled-button");
    }
  } else {
    if (hasClass(deleteButton, "default-disabled-button")) {
      removeClass(deleteButton, "default-disabled-button");
    }
  }

  var simulateButton = $(".simulate-button");

  if (checkAllWeekMatchesCompleted()) {
    if (!hasClass(simulateButton, "default-disabled-button")) {
      addClass(simulateButton, "default-disabled-button");
    }
  } else {
    if (hasClass(simulateButton, "default-disabled-button")) {
      removeClass(simulateButton, "default-disabled-button");
    }
  }
}

function showDeletePopUp() {
  showOverlay(true);

  var deletePopUp = document
    .getElementById("delete-popup")
    .content.cloneNode(true);

  let anyCurrentWeekMatchCompleted;
  if (currentWeek === "0") {
    anyCurrentWeekMatchCompleted = !checkAnyMyGamesMatchesCompleted();
  } else {
    anyCurrentWeekMatchCompleted = !checkAnyCurrentWeekMatchesCompleted(currentWeek);
  }
  if (anyCurrentWeekMatchCompleted) {
    var optionContainer = deletePopUp.querySelector(".option1");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }

    var seperator = deletePopUp.querySelector(".option1-seperator");
    if (seperator && !hasClass(seperator, "hidden")) {
      addClass(seperator, "hidden");
    }
  }

  if (currentWeek === "0") {
    const currentWeekText = deletePopUp.querySelector(".radio-option-container.option1 .current-week-text");
    if (currentWeekText) {
      currentWeekText.innerHTML = "My Games Predictions only";
    }
  }

  if (!checkAnyAfterCurrentWeekMatchesCompleted(currentWeek) || currentWeek === "0") {
    var optionContainer = deletePopUp.querySelector(".option2");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }

    var seperator = deletePopUp.querySelector(".option2-seperator");
    if (seperator && !hasClass(seperator, "hidden")) {
      addClass(seperator, "hidden");
    }
  }

  if (!checkAnyBeforeCurrentWeekMatchesCompleted(currentWeek)) {
    var optionContainer = deletePopUp.querySelector(".option3");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }

    var seperator = deletePopUp.querySelector(".option3-seperator");
    if (seperator && !hasClass(seperator, "hidden")) {
      addClass(seperator, "hidden");
    }
  }

  if (!checkAnyAllWeekMatchesCompleted()) {
    var optionContainer = deletePopUp.querySelector(".option4");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }
  }

  var playoffOption = deletePopUp.querySelector(".option5");
  var playoffSeperator = deletePopUp.querySelector(".option5-seperator");
  var playoffInput = deletePopUp.querySelector('input[value="option5"]');

  if (hasPlayoffPredictions()) {
    // Enable playoff reset
    if (playoffOption && hasClass(playoffOption, "disabled-option")) {
      removeClass(playoffOption, "disabled-option");
    }
    if (playoffInput) {
      playoffInput.removeAttribute("disabled");
    }
  } else {
    // Hide playoff option if no playoff predictions exist
    if (playoffOption && !hasClass(playoffOption, "disabled-option")) {
      addClass(playoffOption, "disabled-option");
    }
    if (playoffInput) {
      playoffInput.setAttribute("disabled", "");
    }
  }

  var closeIcon = deletePopUp.querySelector(".close-icon");
  closeIcon.addEventListener("click", closeDeletePopUp);
  var currentWeekElements = deletePopUp.querySelectorAll(".current-week");
  currentWeekElements.forEach(function (currentWeekText) {
    currentWeekText.innerHTML = currentWeek;
  });

  var deleteButton = deletePopUp.querySelector(".submit-delete-button");
  deleteButton.addEventListener("click", startDeletion);

  document.body.appendChild(deletePopUp);
  addPopUpEventListeners();
}

function canShowDraftOrder() {
  if (firstFiveWeeksMatchesCompleted) {
    return true;
  } else {
    var weeksMatchesCompleted = 0;
    for (var i = 1; i <= totalWeeks; i++) {
      if (checkCurrentWeekMatchesCompleted(i)) {
        weeksMatchesCompleted++;
        if (weeksMatchesCompleted >= 5) {
          return true;
        }
      }
    }
    return false;
  }
}

function checkCurrentWeekMatchesCompleted(week) {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      weekMatchesData[matchIndex]["Week"] == week &&
      !weekMatchesData[matchIndex]["completed"]
    ) {
      if (!weekMatchesData[matchIndex]["Winner"]) return false;
    }
  }
  return true;
}

function checkMyGamesMatchesCompleted() {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      !weekMatchesData[matchIndex]["completed"]
    ) {
      if (!weekMatchesData[matchIndex]["Winner"] && (weekMatchesData[matchIndex]["Away"] === userSelectedGMTeam ||
        weekMatchesData[matchIndex]["Home"] === userSelectedGMTeam)) return false;
    }
  }
  return true;
}

function checkAnyMyGamesMatchesCompleted() {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      (weekMatchesData[matchIndex]["Away"] === userSelectedGMTeam || weekMatchesData[matchIndex]["Home"] ===
        userSelectedGMTeam) &&
      weekMatchesData[matchIndex]["completed"]
    ) {
      if (weekMatchesData[matchIndex]["Winner"]) return true;
    }
  }
  return true;
}

function checkAfterCurrentWeekMatchesCompleted(week) {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      weekMatchesData[matchIndex]["Week"] >= week &&
      !weekMatchesData[matchIndex]["completed"]
    ) {
      if (!weekMatchesData[matchIndex]["Winner"]) return false;
    }
  }
  return true;
}

function checkBeforeCurrentWeekMatchesCompleted(week) {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      weekMatchesData[matchIndex]["Week"] < week &&
      !weekMatchesData[matchIndex]["completed"]
    ) {
      if (!weekMatchesData[matchIndex]["Winner"]) return false;
    }
  }
  return true;
}

function checkAllWeekMatchesCompleted() {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      !weekMatchesData[matchIndex]["Winner"] &&
      !weekMatchesData[matchIndex]["completed"]
    )
      return false;
  }
  return true;
}

function checkAnyCurrentWeekMatchesCompleted(week) {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      weekMatchesData[matchIndex]["Week"] == week &&
      !weekMatchesData[matchIndex]["completed"]
    ) {
      if (weekMatchesData[matchIndex]["Winner"]) return true;
    }
  }
  return false;
}

function checkAnyAfterCurrentWeekMatchesCompleted(week) {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      weekMatchesData[matchIndex]["Week"] >= week &&
      !weekMatchesData[matchIndex]["completed"]
    ) {
      if (weekMatchesData[matchIndex]["Winner"]) {
        return true;
      }
    }
  }
  return false;
}

function checkAnyBeforeCurrentWeekMatchesCompleted(week) {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      weekMatchesData[matchIndex]["Week"] < week &&
      !weekMatchesData[matchIndex]["completed"]
    ) {
      if (weekMatchesData[matchIndex]["Winner"]) return true;
    }
  }
  return false;
}

function checkAnyAllWeekMatchesCompleted() {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (
      weekMatchesData[matchIndex]["Winner"] &&
      !weekMatchesData[matchIndex]["completed"]
    )
      return true;
  }
  return false;
}

function showSimulatePopUp() {
  showOverlay(true);

  var simulatePopUp = document
    .getElementById("simulate-popup")
    .content.cloneNode(true);

  let currentWeekMatchesCompleted;
  if (currentWeek === "0") {
    currentWeekMatchesCompleted = checkMyGamesMatchesCompleted();
  } else {
    currentWeekMatchesCompleted = checkCurrentWeekMatchesCompleted(currentWeek);
  }

  if (currentWeekMatchesCompleted) {
    var optionContainer = simulatePopUp.querySelector(".option1");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }

    var seperator = simulatePopUp.querySelector(".option1-seperator");
    if (seperator && !hasClass(seperator, "hidden")) {
      addClass(seperator, "hidden");
    }
  }

  if (checkAfterCurrentWeekMatchesCompleted(currentWeek)) {
    var optionContainer = simulatePopUp.querySelector(".option2");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }

    var seperator = simulatePopUp.querySelector(".option2-seperator");
    if (seperator && !hasClass(seperator, "hidden")) {
      addClass(seperator, "hidden");
    }
  }

  if (checkAllWeekMatchesCompleted()) {
    var optionContainer = simulatePopUp.querySelector(".option3");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }
  }

  var playoffOption = simulatePopUp.querySelector(".option4");
  var playoffSeperator = simulatePopUp.querySelector(".option4-seperator");
  var playoffInput = simulatePopUp.querySelector('.option4 input');

  if (checkAllWeekMatchesCompleted()) {
    if (playoffOption && hasClass(playoffOption, "disabled-option")) {
      removeClass(playoffOption, "disabled-option");
    }
    if (playoffInput) {
      playoffInput.removeAttribute("disabled");
      playoffInput.checked = true;
    }
  } else {
    if (playoffOption && !hasClass(playoffOption, "disabled-option")) {
      addClass(playoffOption, "disabled-option");
    }
    if (playoffInput) {
      playoffInput.setAttribute("disabled", "");
      playoffInput.checked = false;
    }
  }

  var closeIcon = simulatePopUp.querySelector(".close-icon");
  closeIcon.addEventListener("click", closeSimulatePopUp);
  if (currentWeek === "0") {
    var remainingGamesText = simulatePopUp.querySelector(".remaining-games-text");
    remainingGamesText.innerHTML = "Your Remaining Games";
    const myGamesRemainingCount = getUnpredictedMyGamesCount();
    if (myGamesRemainingCount === 0) {
      addClass(remainingGamesText, "disabled-button");
      const option1Radio = simulatePopUp.querySelector(".radio-option-container.option1 input");
      if (option1Radio) {
        option1Radio.disabled = true;
      }
    }
    const option2 = simulatePopUp.querySelector(".radio-option-container.option2");
    if (option2) {
      addClass(option2, "hidden");
    }
  } else {
    var currentWeekElements = simulatePopUp.querySelectorAll(".current-week");
    currentWeekElements.forEach(function (currentWeekText) {
      currentWeekText.innerHTML = currentWeek;
    });
  }


  var submitButton = simulatePopUp.querySelector(".submit-simulate-button");
  submitButton.addEventListener("click", startSimulation);

  document.body.appendChild(simulatePopUp);
  addPopUpEventListeners();
}

function closeSimulatePopUp(e) {
  var container = $(".simulate-popup-container");

  if (container) {
    container.remove();
  }

  showOverlay(false);
}

function closeStandingsDraftOrderPopup(e) {
  var container = $(".standings-draftOrder-copy");

  if (container) {
    container.remove();
  }

  showOverlay(false);
}

function closeDeletePopUp(e) {
  var container = $(".delete-popup-container");

  if (container) {
    container.remove();
  }

  showOverlay(false);
}

function calculateStatsData() {
  weekMatchesData.forEach((matchData) => {
    var homeTeam = matchData["Home"];
    var awayTeam = matchData["Away"];
    var winnerTeam = matchData["Winner"];
    teamsData[homeTeam]["PF"] += matchData["Home Score"];
    teamsData[awayTeam]["PF"] += matchData["Away Score"];

    teamsData[homeTeam]["PA"] += matchData["Away Score"];
    teamsData[awayTeam]["PA"] += matchData["Home Score"];

    teamsData[homeTeam]["PD"] =
      teamsData[homeTeam]["PF"] - teamsData[homeTeam]["PA"];
    teamsData[awayTeam]["PD"] =
      teamsData[awayTeam]["PF"] - teamsData[awayTeam]["PA"];

    if (
      teamsData[homeTeam]["Conference"] == teamsData[awayTeam]["Conference"]
    ) {
      if (winnerTeam == homeTeam) {
        teamsData[homeTeam]["ConferenceCounts"]["Wins"]++;
        teamsData[awayTeam]["ConferenceCounts"]["Losses"]++;
      } else if (winnerTeam == awayTeam) {
        teamsData[awayTeam]["ConferenceCounts"]["Wins"]++;
        teamsData[homeTeam]["ConferenceCounts"]["Losses"]++;
      } else if (winnerTeam == "TIE") {
        teamsData[awayTeam]["ConferenceCounts"]["Ties"]++;
        teamsData[homeTeam]["ConferenceCounts"]["Ties"]++;
      }
    }

    if (teamsData[homeTeam]["Division"] == teamsData[awayTeam]["Division"]) {
      if (winnerTeam == homeTeam) {
        teamsData[homeTeam]["DivisionCounts"]["Wins"]++;
        teamsData[awayTeam]["DivisionCounts"]["Losses"]++;
      } else if (winnerTeam == awayTeam) {
        teamsData[awayTeam]["DivisionCounts"]["Wins"]++;
        teamsData[homeTeam]["DivisionCounts"]["Losses"]++;
      } else if (winnerTeam == "TIE") {
        teamsData[awayTeam]["DivisionCounts"]["Ties"]++;
        teamsData[homeTeam]["DivisionCounts"]["Ties"]++;
      }
    }
  });
}

function simulateStandingsData() {
  for (var team in teamsData) {
    teamsData[team]["totalMatches"] =
      teamsData[team]["Wins"] +
      teamsData[team]["Losses"] +
      teamsData[team]["Ties"];

    if (teamsData[team]["totalMatches"]) {
      teamsData[team]["Winning %"] =
        (teamsData[team]["Wins"] + teamsData[team]["Ties"] / 2) /
        teamsData[team]["totalMatches"];
    }

    if (Object.hasOwnProperty.call(teamsData, team)) {
      teamsData[team]["opposingSumRecord"] = 0;
      teamsData[team]["opposingSumWinRecord"] = 0;
      teamsData[team]["opponentsWonForSov"] = 0;
      teamsData[team]["opponentsPlayedForSov"] = 0;
      teamsData[team]["opponentsWonForSos"] = 0;
      teamsData[team]["opponentsPlayedForSos"] = 0;
    }
  }

  weekMatchesData.forEach((matchData) => {
    var homeTeam = matchData["Home"];
    var awayTeam = matchData["Away"];
    var winnerTeam = matchData["Winner"];

    teamsData[homeTeam]["Winning %"] = Number(
      teamsData[homeTeam]["Winning %"].toFixed(3)
    );
    teamsData[awayTeam]["Winning %"] = Number(
      teamsData[awayTeam]["Winning %"].toFixed(3)
    );

    if (winnerTeam) {
      teamsData[homeTeam]["opposingSumRecord"] +=
        teamsData[awayTeam]["Winning %"];
      teamsData[awayTeam]["opposingSumRecord"] +=
        teamsData[homeTeam]["Winning %"];

      teamsData[homeTeam]["opponentsWonForSos"] +=
        teamsData[awayTeam]["Wins"] + teamsData[awayTeam]["Ties"] / 2;
      teamsData[homeTeam]["opponentsPlayedForSos"] +=
        teamsData[awayTeam]["totalMatches"];

      teamsData[awayTeam]["opponentsWonForSos"] +=
        teamsData[homeTeam]["Wins"] + teamsData[homeTeam]["Ties"] / 2;
      teamsData[awayTeam]["opponentsPlayedForSos"] +=
        teamsData[homeTeam]["totalMatches"];
    }

    if (winnerTeam == homeTeam) {
      teamsData[homeTeam]["opposingSumWinRecord"] +=
        teamsData[awayTeam]["Winning %"];
      teamsData[homeTeam]["opponentsWonForSov"] +=
        teamsData[awayTeam]["Wins"];
      teamsData[homeTeam]["opponentsPlayedForSov"] +=
        teamsData[awayTeam]["totalMatches"];
    } else if (winnerTeam == awayTeam) {
      teamsData[awayTeam]["opposingSumWinRecord"] +=
        teamsData[homeTeam]["Winning %"];
      teamsData[awayTeam]["opponentsWonForSov"] +=
        teamsData[homeTeam]["Wins"];
      teamsData[awayTeam]["opponentsPlayedForSov"] +=
        teamsData[homeTeam]["totalMatches"];
    }
  });

  for (var team in teamsData) {
    var teamDataConf = teamsData[team]["ConferenceCounts"];
    var totalConfMatch =
      teamDataConf["Wins"] + teamDataConf["Losses"] + teamDataConf["Ties"];
    if (totalConfMatch) {
      teamsData[team]["ConferenceCounts"]["Winning %"] =
        (teamDataConf["Wins"] + teamDataConf["Ties"] / 2) / totalConfMatch;
    } else {
      teamsData[team]["ConferenceCounts"]["Winning %"] = 0;
    }

    var teamDataDiv = teamsData[team]["DivisionCounts"];
    var totalDivMatch =
      teamDataDiv["Wins"] + teamDataDiv["Losses"] + teamDataDiv["Ties"];
    if (totalDivMatch) {
      teamsData[team]["DivisionCounts"]["Winning %"] =
        (teamDataDiv["Wins"] + teamDataDiv["Ties"] / 2) / totalDivMatch;
    } else {
      teamsData[team]["DivisionCounts"]["Winning %"] = 0;
    }

    if (teamsData[team]["opponentsPlayedForSov"]) {
      teamsData[team]["SOV"] =
        teamsData[team]["opponentsWonForSov"] /
        teamsData[team]["opponentsPlayedForSov"];
    } else {
      teamsData[team]["SOV"] = 0;
    }

    if (teamsData[team]["opponentsPlayedForSos"]) {
      teamsData[team]["SOS"] =
        teamsData[team]["opponentsWonForSos"] /
        teamsData[team]["opponentsPlayedForSos"];
    } else {
      teamsData[team]["SOS"] = 0;
    }

    teamsData[team]["SOS"] = Number(teamsData[team]["SOS"].toFixed(3));
    teamsData[team]["SOV"] = Number(teamsData[team]["SOV"].toFixed(3));
  }

  setLeagueStandingsData();
  setConferenceStandingsData();
  setDivisionStandingsData();
  updateCombinedRankingData();

  sortDivisionData();
  sortConferenceData();

  setPlayoffParticipantsData();
  setPlayoffMatchesData();
  setAndSimulatePlayoffMatches();
}

function setAndSimulatePlayoffMatches() {
  var conferenceNames = ["AFC", "NFC"];
  conferenceNames.forEach(conference => {
    playoffMatchesData[conference]["wildcard-winners"] = [];
    for (var i = 0; i < playoffMatchesData[conference]["Wildcard Round"].length; i++) {
      let matchData = playoffMatchesData[conference]["Wildcard Round"][i];
      let matchWinner;

      for (var j = 0; j < playerOffCompletedMatchesData[conference]["Wildcard Round"].length; j++) {
        let completedMatchData = playerOffCompletedMatchesData[conference]["Wildcard Round"][j];

        if (completedMatchData['teamA'] == matchData['teamA'] && completedMatchData['teamB'] == matchData[
          'teamB']) {
          matchWinner = completedMatchData['winner'];
        }
      }

      if (!matchWinner) {
        matchWinner = predictWinner(matchData['teamA'], matchData['teamB']);
      }

      if (matchWinner == matchData['teamA']) {
        playoffMatchesData[conference]["wildcard-winners"].push({
          winner: matchWinner,
          rank: matchData['teamARank']
        });
      } else {
        playoffMatchesData[conference]["wildcard-winners"].push({
          winner: matchWinner,
          rank: matchData['teamBRank']
        });
      }
    }

    playoffMatchesData[conference]["wildcard-winners"].sort((a, b) => b.rank - a.rank);

    playoffMatchesData[conference]["divisional-winners"] = [];
    playoffMatchesData[conference]["Divisional Playoffs"][0]["teamA"] = playoffMatchesData[conference][
      "wildcard-winners"
    ][0]["winner"];
    playoffMatchesData[conference]["Divisional Playoffs"][0]["teamARank"] = playoffMatchesData[conference][
      "wildcard-winners"
    ][0]["rank"];

    playoffMatchesData[conference]["Divisional Playoffs"][1]["teamA"] = playoffMatchesData[conference][
      "wildcard-winners"
    ][1]["winner"];
    playoffMatchesData[conference]["Divisional Playoffs"][1]["teamARank"] = playoffMatchesData[conference][
      "wildcard-winners"
    ][1]["rank"];

    playoffMatchesData[conference]["Divisional Playoffs"][1]["teamB"] = playoffMatchesData[conference][
      "wildcard-winners"
    ][2]["winner"];
    playoffMatchesData[conference]["Divisional Playoffs"][1]["teamBRank"] = playoffMatchesData[conference][
      "wildcard-winners"
    ][2]["rank"];

    for (var j = 0; j < playerOffCompletedMatchesData[conference]["Divisional Playoffs"].length; j++) {
      let completedMatchData = playerOffCompletedMatchesData[conference]["Divisional Playoffs"][j];
      let matchData = playoffMatchesData[conference]["Divisional Playoffs"][0];

      if (completedMatchData['teamA'] == matchData['teamA'] && completedMatchData['teamB'] == matchData[
        'teamB']) {
        playoffMatchesData[conference]["Divisional Playoffs"][0]['winner'] = completedMatchData['winner'];
      }
      matchData = playoffMatchesData[conference]["Divisional Playoffs"][1];

      if (completedMatchData['teamA'] == matchData['teamA'] && completedMatchData['teamB'] == matchData[
        'teamB']) {
        playoffMatchesData[conference]["Divisional Playoffs"][1]['winner'] = completedMatchData['winner'];
      }
    }

    if (!playoffMatchesData[conference]["Divisional Playoffs"][0]['winner']) {
      let matchData = playoffMatchesData[conference]["Divisional Playoffs"][0];
      playoffMatchesData[conference]["Divisional Playoffs"][0]['winner'] = predictWinner(matchData['teamA'],
        matchData['teamB']);
    }

    if (!playoffMatchesData[conference]["Divisional Playoffs"][1]['winner']) {
      let matchData = playoffMatchesData[conference]["Divisional Playoffs"][1];
      playoffMatchesData[conference]["Divisional Playoffs"][1]['winner'] = predictWinner(matchData['teamA'],
        matchData['teamB']);
    }

    playoffMatchesData[conference]["divisional-winners"].push(playoffMatchesData[conference][
      "Divisional Playoffs"
    ][0]['winner']);
    playoffMatchesData[conference]["divisional-winners"].push(playoffMatchesData[conference][
      "Divisional Playoffs"
    ][1]['winner']);

    playoffMatchesData[conference]["conference-winner"] = [];

    if (playerOffCompletedMatchesData[conference]["Conference Championships"][0]['winner']) {
      playoffMatchesData[conference]["conference-winner"].push(playerOffCompletedMatchesData[conference][
        "Conference Championships"
      ][0]['winner']);
    } else {
      var divisionalWinners = playoffMatchesData[conference]["divisional-winners"];
      playoffMatchesData[conference]["conference-winner"].push(predictWinner(divisionalWinners[0],
        divisionalWinners[1]));
    }
  });

  playoffMatchesData["superbowl-winner"] = [];

  if (playerOffCompletedMatchesData['SuperBowl']['winner']) {
    playoffMatchesData["superbowl-winner"].push(playerOffCompletedMatchesData['SuperBowl']['winner']);
  } else {
    var predictedSuperBowlWinner = predictWinner(playoffMatchesData["AFC"]["conference-winner"][0],
      playoffMatchesData["NFC"]["conference-winner"][0]);
    playoffMatchesData["superbowl-winner"].push(predictedSuperBowlWinner);
  }
}


function updateStandingsData(autoSim) {
  for (var team in teamsData) {
    teamsData[team]["totalMatches"] =
      teamsData[team]["Wins"] +
      teamsData[team]["Losses"] +
      teamsData[team]["Ties"];

    if (teamsData[team]["totalMatches"]) {
      teamsData[team]["Winning %"] =
        (teamsData[team]["Wins"] + teamsData[team]["Ties"] / 2) /
        teamsData[team]["totalMatches"];
    }

    if (Object.hasOwnProperty.call(teamsData, team)) {
      teamsData[team]["opposingSumRecord"] = 0;
      teamsData[team]["opposingSumWinRecord"] = 0;
      teamsData[team]["opponentsWonForSov"] = 0;
      teamsData[team]["opponentsPlayedForSov"] = 0;
      teamsData[team]["opponentsWonForSos"] = 0;
      teamsData[team]["opponentsPlayedForSos"] = 0;
    }
  }

  weekMatchesData.forEach((matchData) => {
    var homeTeam = matchData["Home"];
    var awayTeam = matchData["Away"];
    var winnerTeam = matchData["Winner"];

    teamsData[homeTeam]["Winning %"] = Number(
      teamsData[homeTeam]["Winning %"].toFixed(3)
    );
    teamsData[awayTeam]["Winning %"] = Number(
      teamsData[awayTeam]["Winning %"].toFixed(3)
    );

    if (winnerTeam) {
      teamsData[homeTeam]["opposingSumRecord"] +=
        teamsData[awayTeam]["Winning %"];
      teamsData[awayTeam]["opposingSumRecord"] +=
        teamsData[homeTeam]["Winning %"];

      teamsData[homeTeam]["opponentsWonForSos"] +=
        teamsData[awayTeam]["Wins"] + teamsData[awayTeam]["Ties"] / 2;
      teamsData[homeTeam]["opponentsPlayedForSos"] +=
        teamsData[awayTeam]["totalMatches"];

      teamsData[awayTeam]["opponentsWonForSos"] +=
        teamsData[homeTeam]["Wins"] + teamsData[homeTeam]["Ties"] / 2;
      teamsData[awayTeam]["opponentsPlayedForSos"] +=
        teamsData[homeTeam]["totalMatches"];
    }

    if (winnerTeam == homeTeam) {
      teamsData[homeTeam]["opposingSumWinRecord"] +=
        teamsData[awayTeam]["Winning %"];
      teamsData[homeTeam]["opponentsWonForSov"] +=
        teamsData[awayTeam]["Wins"];
      teamsData[homeTeam]["opponentsPlayedForSov"] +=
        teamsData[awayTeam]["totalMatches"];
    } else if (winnerTeam == awayTeam) {
      teamsData[awayTeam]["opposingSumWinRecord"] +=
        teamsData[homeTeam]["Winning %"];
      teamsData[awayTeam]["opponentsWonForSov"] +=
        teamsData[homeTeam]["Wins"];
      teamsData[awayTeam]["opponentsPlayedForSov"] +=
        teamsData[homeTeam]["totalMatches"];
    }
  });

  for (var team in teamsData) {
    var teamDataConf = teamsData[team]["ConferenceCounts"];
    var totalConfMatch =
      teamDataConf["Wins"] + teamDataConf["Losses"] + teamDataConf["Ties"];
    if (totalConfMatch) {
      teamsData[team]["ConferenceCounts"]["Winning %"] =
        (teamDataConf["Wins"] + teamDataConf["Ties"] / 2) / totalConfMatch;
    } else {
      teamsData[team]["ConferenceCounts"]["Winning %"] = 0;
    }

    var teamDataDiv = teamsData[team]["DivisionCounts"];
    var totalDivMatch =
      teamDataDiv["Wins"] + teamDataDiv["Losses"] + teamDataDiv["Ties"];
    if (totalDivMatch) {
      teamsData[team]["DivisionCounts"]["Winning %"] =
        (teamDataDiv["Wins"] + teamDataDiv["Ties"] / 2) / totalDivMatch;
    } else {
      teamsData[team]["DivisionCounts"]["Winning %"] = 0;
    }

    if (teamsData[team]["opponentsPlayedForSov"]) {
      teamsData[team]["SOV"] =
        teamsData[team]["opponentsWonForSov"] /
        teamsData[team]["opponentsPlayedForSov"];
    } else {
      teamsData[team]["SOV"] = 0;
    }

    if (teamsData[team]["opponentsPlayedForSos"]) {
      teamsData[team]["SOS"] =
        teamsData[team]["opponentsWonForSos"] /
        teamsData[team]["opponentsPlayedForSos"];
    } else {
      teamsData[team]["SOS"] = 0;
    }

    teamsData[team]["SOS"] = Number(teamsData[team]["SOS"].toFixed(3));
    teamsData[team]["SOV"] = Number(teamsData[team]["SOV"].toFixed(3));
  }

  setLeagueStandingsData();
  setConferenceStandingsData();
  setDivisionStandingsData();
  updateCombinedRankingData();

  sortDivisionData();
  sortConferenceData();

  if (!autoSim) {
    showConferenceStandingsData();
    showDivisionStandingsData();
    setPlayoffParticipants();
    setPlayoffParticipantsStandings();
  }

  setPlayoffMatchesData();

  if (!autoSim) {
    updateDraftOrder();
  }
}

// Draft Order begins

function getPlayoffLosers(roundType) {
  if (!playoffMatchesData) {
    return [];
  }

  var losersTeamList = [];
  var conferencesList = ['AFC', 'NFC'];
  var roundIsCompleted = true;

  conferencesList.forEach(conference => {
    for (var matchIndex = 0; matchIndex < playoffMatchesData[conference][roundType].length; matchIndex++) {
      var matchData = playoffMatchesData[conference][roundType][matchIndex];
      if (!matchData['winner']) {
        roundIsCompleted = false;
      } else {
        var loserTeam = (matchData['winner'] == matchData['teamA'] ? matchData['teamB'] : matchData['teamA']);
        losersTeamList.push(teamsData[loserTeam]);
      }
    }
  });
  return (roundIsCompleted ? losersTeamList : []);
}

function removePlayoffLosers(playoffTeamsList, allLosersList) {
  var loserRemovedList = [];
  for (var playoffTeamsListIndex = 0; playoffTeamsListIndex < playoffTeamsList.length; playoffTeamsListIndex++) {
    var teamLost = false;
    for (var allLosersListIndex = 0; allLosersListIndex < allLosersList.length; allLosersListIndex++) {
      if (playoffTeamsList[playoffTeamsListIndex]['Team'] == allLosersList[allLosersListIndex]['Team']) {
        teamLost = true;
        break;
      }
    }
    if (!teamLost) {
      loserRemovedList.push(playoffTeamsList[playoffTeamsListIndex]);
    }
  }
  return loserRemovedList;
}

function updateDraftOrder() {
  var teamNamesInPlayoff = [];
  var topTeamInEachConference = [];
  var secondRankedTeamInConference = [];
  var thirdFourthTeamInConference = [];
  var fifthToSeventhTeamInConference = [];
  for (var conference in playoffParticipants) {
    for (
      var teamIndex = 0; teamIndex < playoffParticipants[conference].length; teamIndex++
    ) {
      teamNamesInPlayoff.push(playoffParticipants[conference][teamIndex]);
    }
    topTeamInEachConference.push(conferenceData[conference][0]);
    secondRankedTeamInConference.push(conferenceData[conference][1]);
    thirdFourthTeamInConference.push(conferenceData[conference][2]);
    thirdFourthTeamInConference.push(conferenceData[conference][3]);
    fifthToSeventhTeamInConference.push(conferenceData[conference][4]);
    fifthToSeventhTeamInConference.push(conferenceData[conference][5]);
    fifthToSeventhTeamInConference.push(conferenceData[conference][6]);
  }

  var teamsNameNotInPlayoff = Object.keys(teamsData).filter(function (team) {
    return teamNamesInPlayoff.indexOf(team) === -1;
  });

  var teamsNotInPlayoff = [];

  for (var teamIndex in teamsNameNotInPlayoff) {
    teamsNotInPlayoff.push(teamsData[teamsNameNotInPlayoff[teamIndex]]);
  }

  var wildCardLosers = getPlayoffLosers("Wildcard Round");
  var divisionalLosers = getPlayoffLosers("Divisional Playoffs");
  var conferenceLosers = getPlayoffLosers("Conference Championships");

  var allLoserTeams = [...wildCardLosers, ...divisionalLosers, ...conferenceLosers];

  if (allLoserTeams.length) {
    fifthToSeventhTeamInConference = removePlayoffLosers(fifthToSeventhTeamInConference, allLoserTeams);
    thirdFourthTeamInConference = removePlayoffLosers(thirdFourthTeamInConference, allLoserTeams);
    secondRankedTeamInConference = removePlayoffLosers(secondRankedTeamInConference, allLoserTeams);
    topTeamInEachConference = removePlayoffLosers(topTeamInEachConference, allLoserTeams);
  }

  var draftOrderTeams = [];
  const teamsInplayoffs = [];

  draftOrderTeams.push(teamsNotInPlayoff);
  draftOrderTeams.push(wildCardLosers);
  draftOrderTeams.push(divisionalLosers);
  draftOrderTeams.push(conferenceLosers);
  teamsInplayoffs.push(fifthToSeventhTeamInConference);
  teamsInplayoffs.push(thirdFourthTeamInConference);
  teamsInplayoffs.push(secondRankedTeamInConference);
  teamsInplayoffs.push(topTeamInEachConference);

  const lockedInOrderTeams = [...teamsNotInPlayoff, ...allLoserTeams];

  const sortedTeamsNotInPlayoff = sortDraftOrderTeams(teamsNotInPlayoff);
  const sortedWildCardLosers = sortDraftOrderTeams(wildCardLosers);
  const sortedDivisionalLosers = sortDraftOrderTeams(divisionalLosers);
  const sortedConferenceLosers = sortDraftOrderTeams(conferenceLosers);
  const sortedDraftOrderTeamsData = [...sortedTeamsNotInPlayoff, ...sortedWildCardLosers, ...sortedDivisionalLosers, ...sortedConferenceLosers];
  const sortedFifthToSeventhTeamInConference = sortDraftOrderTeams(fifthToSeventhTeamInConference);
  const sortedThirdFourthTeamInConference = sortDraftOrderTeams(thirdFourthTeamInConference);
  const sortedSecondRankedTeamInConference = sortDraftOrderTeams(secondRankedTeamInConference);
  const sortedTopTeamInEachConference = sortDraftOrderTeams(topTeamInEachConference);
  sortedDraftOrderTeamsData.push(...sortedFifthToSeventhTeamInConference, ...sortedThirdFourthTeamInConference, ...sortedSecondRankedTeamInConference, ...sortedTopTeamInEachConference);
  setDraftOrderContainer(sortedDraftOrderTeamsData, lockedInOrderTeams);
}

function teamPositionNotDecided(lockedInOrderTeams, teamName) {
  for (var teamIndex = 0; teamIndex < lockedInOrderTeams.length; teamIndex++) {
    if (lockedInOrderTeams[teamIndex]['Team'] == teamName) {
      return false;
    }
  }
  return true;
}

function setDraftOrderContainer(draftOrderTeamsData, lockedInOrderTeams) {
  var draftOrderContainer = $(".draft-order-table");
  removeAllChild(draftOrderContainer);

  var draftOrderTableContainerWrapper = document.createElement("div");
  var draftOrderTableContainer = document.createElement("div");
  addClass(draftOrderTableContainer, "draft-order-table-container");

  var draftOrderTable = document.createElement("table");

  var draftOrdertableHeader = ["PICK", "TEAM", "REC", "WIN %", "SOS"];

  var thead = document.createElement("thead");
  var tableRow = document.createElement("tr");

  for (
    var tableHeaderIndex = 0; tableHeaderIndex < draftOrdertableHeader.length; tableHeaderIndex++
  ) {
    var tableHeaderEl = document.createElement("th");
    tableHeaderEl.innerHTML = draftOrdertableHeader[tableHeaderIndex];
    tableRow.appendChild(tableHeaderEl);
  }

  thead.appendChild(tableRow);
  draftOrderTable.appendChild(thead);

  var tbody = document.createElement("tbody");

  for (
    var teamIndex = 0; teamIndex < (IS_DESKTOP ? 16 : draftOrderTeamsData.length); teamIndex++
  ) {
    var teamName = draftOrderTeamsData[teamIndex]["Team"];

    var tableRow = document.createElement("tr");

    if (teamPositionNotDecided(lockedInOrderTeams, teamName)) {
      addClass(tableRow, "team-pos-not-decided");
    }

    if (teamIndex % 2) {
      addClass(tableRow, "dark-background-row");
    } else {
      addClass(tableRow, "light-background-row");
    }

    var td = document.createElement("td");
    td.innerHTML = teamIndex + 1;
    tableRow.appendChild(td);

    tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

    var td = document.createElement("td");
    td.innerHTML = generateWinLoseTieTextForStandings(teamName);
    tableRow.appendChild(td);

    var td = document.createElement("td");
    td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
    tableRow.appendChild(td);

    var td = document.createElement("td");
    td.innerHTML = teamsData[teamName]["DraftOrderSOS"].toFixed(3);
    tableRow.appendChild(td);

    tbody.appendChild(tableRow);
  }

  draftOrderTable.appendChild(tbody);
  draftOrderTableContainer.appendChild(draftOrderTable);

  draftOrderTableContainerWrapper.appendChild(draftOrderTableContainer);
  draftOrderContainer.appendChild(draftOrderTableContainerWrapper);

  if (IS_DESKTOP) {
    var draftOrderTableContainerWrapper = document.createElement("div");
    var draftOrderTableContainer = document.createElement("div");
    addClass(draftOrderTableContainer, "draft-order-table-container");

    var draftOrderTable = document.createElement("table");

    var draftOrdertableHeader = ["PICK", "TEAM", "REC", "WIN %", "SOS"];

    var thead = document.createElement("thead");
    var tableRow = document.createElement("tr");

    for (
      var tableHeaderIndex = 0; tableHeaderIndex < draftOrdertableHeader.length; tableHeaderIndex++
    ) {
      var tableHeaderEl = document.createElement("th");
      tableHeaderEl.innerHTML = draftOrdertableHeader[tableHeaderIndex];
      tableRow.appendChild(tableHeaderEl);
    }

    thead.appendChild(tableRow);
    draftOrderTable.appendChild(thead);

    var tbody = document.createElement("tbody");

    for (
      var teamIndex = 16; teamIndex < draftOrderTeamsData.length; teamIndex++
    ) {
      var teamName = draftOrderTeamsData[teamIndex]["Team"];

      var tableRow = document.createElement("tr");

      if (teamPositionNotDecided(lockedInOrderTeams, teamName)) {
        addClass(tableRow, "team-pos-not-decided");
      }

      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = teamIndex + 1;
      tableRow.appendChild(td);

      tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

      var td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(teamName);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["DraftOrderSOS"].toFixed(3);
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    draftOrderTable.appendChild(tbody);
    draftOrderTableContainer.appendChild(draftOrderTable);

    draftOrderTableContainerWrapper.appendChild(draftOrderTableContainer);
    draftOrderContainer.appendChild(draftOrderTableContainerWrapper);
  }
}

function generateDraftOrderCategory(categoryName) {
  var tableRow = document.createElement("tr");
  var td = document.createElement("td");
  td.setAttribute("colspan", "5");
  addClass(td, "draft-order-category-heading");
  td.innerHTML = categoryName.toUpperCase();
  tableRow.appendChild(td);
  return tableRow;
}

function generateDraftOrderTeamContainer(teamName) {
  td = document.createElement("td");
  addClass(td, "standings-team-container-td");

  var standingsTeamContainer = document.createElement("div");
  addClass(standingsTeamContainer, "standings-team-container");
  var standingsTeamLogo = document.createElement("img");
  addClass(standingsTeamLogo, "standings-team-logo");
  addClass(standingsTeamLogo, teamName);
  standingsTeamLogo.setAttribute("src", teamsData[teamName]["logo"]);
  standingsTeamLogo.setAttribute("alt", teamName);
  standingsTeamLogo.setAttribute("width", "18px");
  standingsTeamLogo.setAttribute("height", "12px");
  standingsTeamLogo.setAttribute("crossorigin", "anonymous");
  standingsTeamContainer.appendChild(standingsTeamLogo);

  var standingsTeamName = document.createElement("span");
  addClass(standingsTeamName, "standings-team-name");
  standingsTeamName.innerHTML = teamName;
  standingsTeamContainer.appendChild(standingsTeamName);

  if (teamsData[teamName]["Picks Traded"]) {
    addClass(standingsTeamContainer, "traded-team-container");
    td.appendChild(standingsTeamContainer);

    var tradeIcon = document.createElement("img");
    addClass(tradeIcon, "trade-icon");
    tradeIcon.setAttribute(
      "src",
      STATIC_URL + "/skm/assets/playoff-predictor/icons/trade-icon.png"
    );
    tradeIcon.setAttribute("alt", "Trade Icon");
    tradeIcon.setAttribute("width", "12px");
    tradeIcon.setAttribute("height", "12px");
    tradeIcon.setAttribute("crossorigin", "anonymous")
    td.appendChild(tradeIcon);

    var tradedTeamName = teamsData[teamName]["Picks Traded"];
    var standingsTeamContainer = document.createElement("div");
    addClass(standingsTeamContainer, "standings-team-container");

    var standingsTeamName = document.createElement("span");
    addClass(standingsTeamName, "standings-team-name");
    standingsTeamName.innerHTML = tradedTeamName;
    standingsTeamContainer.appendChild(standingsTeamName);

    var standingsTeamLogo = document.createElement("img");
    addClass(standingsTeamLogo, "standings-team-logo");
    standingsTeamLogo.setAttribute("src", teamsData[tradedTeamName]["logo"]);
    standingsTeamLogo.setAttribute("alt", tradedTeamName);
    standingsTeamLogo.setAttribute("width", "18px");
    standingsTeamLogo.setAttribute("height", "12px");
    standingsTeamLogo.setAttribute("crossorigin", "anonymous");
    standingsTeamContainer.appendChild(standingsTeamLogo);

    td.appendChild(standingsTeamContainer);
  } else {
    td.appendChild(standingsTeamContainer);
  }

  return td;
}

function setAfterPlayoffDraftOrderContainer(draftOrderTeamsData, superBowlWinner) {
  draftOrderTeamsSequence.length = 0;
  var draftOrderContainer = $(".draft-order-table");
  removeAllChild(draftOrderContainer);

  var draftOrderTableContainerWrapper = document.createElement("div");
  var draftOrderTableContainer = document.createElement("div");
  addClass(draftOrderTableContainer, "draft-order-table-container");

  var draftOrderTable = document.createElement("table");

  var draftOrdertableHeader = ["PICK", "TEAM", "REC", "WIN %", "SOS"];

  var pickCount = 1;

  var thead = document.createElement("thead");
  var tableRow = document.createElement("tr");

  for (
    var tableHeaderIndex = 0; tableHeaderIndex < draftOrdertableHeader.length; tableHeaderIndex++
  ) {
    var tableHeaderEl = document.createElement("th");
    tableHeaderEl.innerHTML = draftOrdertableHeader[tableHeaderIndex];
    tableRow.appendChild(tableHeaderEl);
  }

  thead.appendChild(tableRow);
  draftOrderTable.appendChild(thead);

  var tbody = document.createElement("tbody");

  for (
    var teamIndex = 0; teamIndex < draftOrderTeamsData["teamsNotInPlayoff"].length; teamIndex++
  ) {
    var teamName =
      draftOrderTeamsData["teamsNotInPlayoff"][teamIndex]["Team"];

    draftOrderTeamsSequence.push(draftOrderTeamsData["teamsNotInPlayoff"][teamIndex]);

    var tableRow = document.createElement("tr");

    if (teamIndex % 2) {
      addClass(tableRow, "dark-background-row");
    } else {
      addClass(tableRow, "light-background-row");
    }

    var td = document.createElement("td");
    td.innerHTML = pickCount++;
    tableRow.appendChild(td);

    tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

    var td = document.createElement("td");
    td.innerHTML = generateWinLoseTieTextForStandings(teamName);
    tableRow.appendChild(td);

    var td = document.createElement("td");
    td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
    tableRow.appendChild(td);

    var td = document.createElement("td");
    td.innerHTML = teamsData[teamName]["SOS"].toFixed(3);
    tableRow.appendChild(td);

    tbody.appendChild(tableRow);
  }

  draftOrderTable.appendChild(tbody);
  draftOrderTableContainer.appendChild(draftOrderTable);

  draftOrderTableContainerWrapper.appendChild(draftOrderTableContainer);
  draftOrderContainer.appendChild(draftOrderTableContainerWrapper);

  if (!IS_DESKTOP) {
    tbody.appendChild(generateDraftOrderCategory("WildCard Losers"));

    for (
      var teamIndex = 0; teamIndex < draftOrderTeamsData["wildCardLosers"].length; teamIndex++
    ) {
      var teamName = draftOrderTeamsData["wildCardLosers"][teamIndex]["Team"];
      draftOrderTeamsSequence.push(draftOrderTeamsData["wildCardLosers"][teamIndex]);

      var tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = pickCount++;
      tableRow.appendChild(td);

      tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

      var td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(teamName);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    tbody.appendChild(generateDraftOrderCategory("Divisional Losers"));

    for (
      var teamIndex = 0; teamIndex < draftOrderTeamsData["divisionalLosers"].length; teamIndex++
    ) {
      var teamName =
        draftOrderTeamsData["divisionalLosers"][teamIndex]["Team"];

      draftOrderTeamsSequence.push(draftOrderTeamsData["divisionalLosers"][teamIndex]);

      var tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = pickCount++;
      tableRow.appendChild(td);

      tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

      var td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(teamName);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    tbody.appendChild(generateDraftOrderCategory("Conference Losers"));

    for (
      var teamIndex = 0; teamIndex < draftOrderTeamsData["conferenceLosers"].length; teamIndex++
    ) {
      var teamName =
        draftOrderTeamsData["conferenceLosers"][teamIndex]["Team"];

      draftOrderTeamsSequence.push(draftOrderTeamsData["conferenceLosers"][teamIndex]);

      var tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = pickCount++;
      tableRow.appendChild(td);

      tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

      var td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(teamName);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    tbody.appendChild(generateDraftOrderCategory("Super Bowl Teams"));

    let superBownWinnerIndex = draftOrderTeamsData["superBowlTeams"].findIndex(teamData => teamData.Team ===
      superBowlWinner);
    if (superBownWinnerIndex > -1) {
      let winnerTeam = draftOrderTeamsData["superBowlTeams"].splice(superBownWinnerIndex, 1);
      if (winnerTeam) {
        draftOrderTeamsData["superBowlTeams"].push(winnerTeam[0]);
      }
    }

    for (
      var teamIndex = 0; teamIndex < draftOrderTeamsData["superBowlTeams"].length; teamIndex++
    ) {
      var teamName = draftOrderTeamsData["superBowlTeams"][teamIndex]["Team"];
      draftOrderTeamsSequence.push(draftOrderTeamsData["superBowlTeams"][teamIndex]);

      var tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = pickCount++;
      tableRow.appendChild(td);

      tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

      var td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(teamName);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    draftOrderTable.appendChild(tbody);
    draftOrderTableContainer.appendChild(draftOrderTable);

    draftOrderTableContainerWrapper.appendChild(draftOrderTableContainer);
    draftOrderContainer.appendChild(draftOrderTableContainerWrapper);
  }

  if (IS_DESKTOP) {
    var draftOrderTableContainerWrapper = document.createElement("div");
    var draftOrderTableContainer = document.createElement("div");
    addClass(draftOrderTableContainer, "draft-order-table-container");

    var draftOrderTable = document.createElement("table");

    var draftOrdertableHeader = ["PICK", "TEAM", "REC", "WIN %", "SOS"];

    var thead = document.createElement("thead");
    var tableRow = document.createElement("tr");

    for (
      var tableHeaderIndex = 0; tableHeaderIndex < draftOrdertableHeader.length; tableHeaderIndex++
    ) {
      var tableHeaderEl = document.createElement("th");
      tableHeaderEl.innerHTML = draftOrdertableHeader[tableHeaderIndex];
      tableRow.appendChild(tableHeaderEl);
    }

    thead.appendChild(tableRow);
    draftOrderTable.appendChild(thead);

    var tbody = document.createElement("tbody");

    tbody.appendChild(generateDraftOrderCategory("WildCard Losers"));

    for (
      var teamIndex = 0; teamIndex < draftOrderTeamsData["wildCardLosers"].length; teamIndex++
    ) {
      var teamName = draftOrderTeamsData["wildCardLosers"][teamIndex]["Team"];
      draftOrderTeamsSequence.push(draftOrderTeamsData["wildCardLosers"][teamIndex]);

      var tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = pickCount++;
      tableRow.appendChild(td);

      tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

      var td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(teamName);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    tbody.appendChild(generateDraftOrderCategory("Divisional Losers"));

    for (
      var teamIndex = 0; teamIndex < draftOrderTeamsData["divisionalLosers"].length; teamIndex++
    ) {
      var teamName =
        draftOrderTeamsData["divisionalLosers"][teamIndex]["Team"];

      draftOrderTeamsSequence.push(draftOrderTeamsData["divisionalLosers"][teamIndex]);

      var tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = pickCount++;
      tableRow.appendChild(td);

      tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

      var td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(teamName);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    tbody.appendChild(generateDraftOrderCategory("Conference Losers"));

    for (
      var teamIndex = 0; teamIndex < draftOrderTeamsData["conferenceLosers"].length; teamIndex++
    ) {
      var teamName =
        draftOrderTeamsData["conferenceLosers"][teamIndex]["Team"];

      draftOrderTeamsSequence.push(draftOrderTeamsData["conferenceLosers"][teamIndex]);

      var tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = pickCount++;
      tableRow.appendChild(td);

      tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

      var td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(teamName);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    tbody.appendChild(generateDraftOrderCategory("Super Bowl Teams"));

    let superBownWinnerIndex = draftOrderTeamsData["superBowlTeams"].findIndex(teamData => teamData.Team ===
      superBowlWinner);
    if (superBownWinnerIndex > -1) {
      let winnerTeam = draftOrderTeamsData["superBowlTeams"].splice(superBownWinnerIndex, 1);
      if (winnerTeam) {
        draftOrderTeamsData["superBowlTeams"].push(winnerTeam[0]);
      }
    }

    for (
      var teamIndex = 0; teamIndex < draftOrderTeamsData["superBowlTeams"].length; teamIndex++
    ) {
      var teamName = draftOrderTeamsData["superBowlTeams"][teamIndex]["Team"];
      draftOrderTeamsSequence.push(draftOrderTeamsData["superBowlTeams"][teamIndex]);

      var tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = pickCount++;
      tableRow.appendChild(td);

      tableRow.appendChild(generateDraftOrderTeamContainer(teamName));

      var td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(teamName);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["Winning %"].toFixed(3);
      tableRow.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = teamsData[teamName]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    draftOrderTable.appendChild(tbody);
    draftOrderTableContainer.appendChild(draftOrderTable);

    draftOrderTableContainerWrapper.appendChild(draftOrderTableContainer);
    draftOrderContainer.appendChild(draftOrderTableContainerWrapper);

  }

  generateSevenRoundDraftOrder(draftOrderTeamsSequence, {
    nonPlayoff: draftOrderTeamsData["teamsNotInPlayoff"].length,
    wildCard: draftOrderTeamsData["wildCardLosers"].length,
    divisional: draftOrderTeamsData["divisionalLosers"].length,
    conference: draftOrderTeamsData["conferenceLosers"].length,
    superBowl: draftOrderTeamsData["superBowlTeams"].length
  });
}

function generateSevenRoundDraftOrder(teams, groupSizes) {
  var baseOrder = teams;

  // --- STEP 2: Group teams by W/L ---
  function groupByRecord(arr) {
    var groups = {};
    arr.forEach(function (t) {
      var key = t.Wins + '-' + t.Losses;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }

  var grouped = groupByRecord(baseOrder);

  // Build playoff-stage buckets so same-record rotation stays within a stage.
  // Super Bowl teams must never rotate.
  var buckets = [];
  var cursor = 0;
  var bucketOrder = [
    { name: "nonPlayoff", rotatable: true },
    { name: "wildCard", rotatable: true },
    { name: "divisional", rotatable: true },
    { name: "conference", rotatable: true },
    { name: "superBowl", rotatable: false }
  ];
  bucketOrder.forEach(function (b) {
    var size = groupSizes && groupSizes[b.name] ? groupSizes[b.name] : 0;
    if (size > 0) {
      buckets.push({ start: cursor, end: cursor + size, rotatable: b.rotatable });
      cursor += size;
    }
  });

  function getBucket(idx) {
    for (var b = 0; b < buckets.length; b++) {
      if (idx >= buckets[b].start && idx < buckets[b].end) return buckets[b];
    }
    return null;
  }

  // --- STEP 3: Generate all 7 rounds ---
  function generateDraftPicks(baseOrder, totalRounds) {
    if (typeof totalRounds === "undefined") totalRounds = 7;
    var allPicks = [];

    for (var r = 0; r < totalRounds; r++) {
      var round = [];
      var i = 0;

      while (i < baseOrder.length) {
        var record = baseOrder[i].Wins + '-' + baseOrder[i].Losses;
        var bucket = getBucket(i);
        var bucketEnd = bucket ? bucket.end : baseOrder.length;
        var rotatable = bucket ? bucket.rotatable : true;

        // find members of this record group, clamped to the current bucket
        var groupIndices = [];
        for (var j = i; j < bucketEnd; j++) {
          if (baseOrder[j].Wins + '-' + baseOrder[j].Losses === record) {
            groupIndices.push(j);
          } else {
            break;
          }
        }

        // slice that group
        var slice = baseOrder.slice(i, i + groupIndices.length);

        // rotate group based on round # (skip for non-rotatable buckets, e.g. Super Bowl)
        var rotated = rotatable
          ? slice.map(function (_, idx) {
              return slice[(idx + r) % slice.length];
            })
          : slice;

        // push into round
        Array.prototype.push.apply(round, rotated);

        i += slice.length;
      }

      // push this round's team names into all picks
      Array.prototype.push.apply(allPicks, round.map(function (t) { return t.Team; }));
    }
    return allPicks;
  }

  sevenRoundDraftOrder = generateDraftPicks(baseOrder, 7);
}

function setDraftOrderTeamSOS(team) {
  const teamName = team["Team"];
  let opponentsWonForSos = 0;
  let opponentsPlayedForSos = 0;
  weekMatchesData.forEach(match => {
    if (match["Home"] === teamName || match["Away"] === teamName) {
      let opponent;
      if (match["Home"] === teamName) {
        opponent = teamsData[match["Away"]];
      }

      if (match["Away"] === teamName) {
        opponent = teamsData[match["Home"]];
      }

      if (opponent) {
        opponentsWonForSos += opponent["Wins"] + opponent["Ties"] / 2;
        opponentsPlayedForSos += opponent["totalMatches"];
      }
    }
  });

  team["opponentsPlayedForDraftOrderSos"] = opponentsPlayedForSos;
  team["opponentsWonForDraftOrderSos"] = opponentsWonForSos;

  team["DraftOrderSOS"] = team["opponentsWonForDraftOrderSos"] / team["opponentsPlayedForDraftOrderSos"];
  team["DraftOrderSOS"] = Number(team["DraftOrderSOS"].toFixed(3));
}

function sortDraftOrderTeams(draftOrderTeams) {
  let copyDraftOrderTeams = [...draftOrderTeams];
  let concatenatedDraftOrderTeams = [];
  draftOrderTeams = [];
  for (var i = 0; i < copyDraftOrderTeams.length; i++) {
    concatenatedDraftOrderTeams = concatenatedDraftOrderTeams.concat(
      copyDraftOrderTeams[i]
    );
  }

  draftOrderTeams.push([...concatenatedDraftOrderTeams]);
  delete copyDraftOrderTeams;
  delete concatenatedDraftOrderTeams;

  draftOrderTeams.forEach(teams => {
    if (teams.length) {
      teams.forEach(team => setDraftOrderTeamSOS(team));
    }
  });

  for (var i = 0; i < draftOrderTeams.length; i++) {
    var breakedWithSameRec = breakDraftOrderWithSameRec(draftOrderTeams[i]);
    draftOrderTeams[i] = [];
    for (var j = 0; j < breakedWithSameRec.length; j++) {
      draftOrderTeams[i] = draftOrderTeams[i].concat(
        breakDraftOrderWithSameSOS(breakedWithSameRec[j])
      );
    }
  }

  var divisionalBreakedDown = [];
  for (var i = 0; i < draftOrderTeams.length; i++) {
    for (var j = 0; j < draftOrderTeams[i].length; j++) {
      if (draftOrderTeams[i][j].length == 1) {
        divisionalBreakedDown.push(draftOrderTeams[i][j]);
      } else {
        var breakedDraftOrderWithSameDivisionList =
          breakDraftOrderWithSameDivision(draftOrderTeams[i][j]);
        divisionalBreakedDown = divisionalBreakedDown.concat(
          breakedDraftOrderWithSameDivisionList
        );
      }
    }
  }

  var conferenceBreakedDown = [];

  for (var i = 0; i < divisionalBreakedDown.length; i++) {
    if (divisionalBreakedDown[i].length == 1) {
      conferenceBreakedDown.push(divisionalBreakedDown[i]);
    } else {
      conferenceBreakedDown = conferenceBreakedDown.concat(
        breakDraftOrderWithSameConference(divisionalBreakedDown[i])
      );
    }
  }

  var headToHeadBreakedDown = [];

  for (var i = 0; i < conferenceBreakedDown.length; i++) {
    if (conferenceBreakedDown[i].length == 1) {
      headToHeadBreakedDown.push(conferenceBreakedDown[i]);
    } else {
      headToHeadBreakedDown = headToHeadBreakedDown.concat(
        breakDraftOrderWithHeadToHead(conferenceBreakedDown[i])
      );
    }
  }

  var sortedDraftOrderBreakedDown = [];

  for (var i = 0; i < headToHeadBreakedDown.length; i++) {
    if (headToHeadBreakedDown[i].length == 1) {
      sortedDraftOrderBreakedDown.push(headToHeadBreakedDown[i]);
    } else {
      sortedDraftOrderBreakedDown = sortedDraftOrderBreakedDown.concat(
        headToHeadBreakedDown[i].sort(function (a, b) {
          return draftOrderSortingTieBreaker(a["Team"], b["Team"]);
        })
      );
    }
  }

  var formattedSortedDraftOrderData = [];
  for (var i = 0; i < sortedDraftOrderBreakedDown.length; i++) {
    formattedSortedDraftOrderData = formattedSortedDraftOrderData.concat(
      sortedDraftOrderBreakedDown[i]
    );
  }

  return formattedSortedDraftOrderData;
}

function breakDraftOrderWithHeadToHead(teamList) {
  var teamWonAllList = [];
  var teamUnpredicted = [];
  var teamLoseAllList = [];

  for (
    var teamListIndex = 0; teamListIndex < teamList.length; teamListIndex++
  ) {
    if (checkAllHeadWon(teamList[teamListIndex], teamList)) {
      teamWonAllList.push(teamList[teamListIndex]);
    } else if (checkAllHeadLose(teamList[teamListIndex], teamList)) {
      teamLoseAllList.push(teamList[teamListIndex]);
    } else {
      teamUnpredicted.push(teamList[teamListIndex]);
    }
  }

  var breakedHeadToHead = [];

  if (teamLoseAllList.length > 0) {
    breakedHeadToHead.push(teamLoseAllList);
  }

  if (teamUnpredicted.length > 0) {
    breakedHeadToHead.push(teamUnpredicted);
  }

  if (teamWonAllList.length > 0) {
    breakedHeadToHead.push(teamWonAllList);
  }

  return breakedHeadToHead;
}

function breakDraftOrderWithSameDivision(teamList) {
  var divisionMap = {};

  teamList.forEach(function (obj) {
    if (!divisionMap[obj["Division"]]) {
      divisionMap[obj["Division"]] = [];
    }
    divisionMap[obj["Division"]].push(obj);
  });

  var divisionWinners = [];
  var divisionMiddle = [];
  var divisionLosers = [];

  for (var divisionKey in divisionMap) {
    divisionMap[divisionKey].sort(function (a, b) {
      var divIndexOfA = divisionData[divisionKey].findIndex(
        (obj) => obj["Team"] === a["Team"]
      );
      var divIndexOfB = divisionData[divisionKey].findIndex(
        (obj) => obj["Team"] === b["Team"]
      );
      return divIndexOfB - divIndexOfA;
    });

    divisionWinners.push(divisionMap[divisionKey][0]);

    if (divisionMap[divisionKey].length > 1) {
      divisionLosers.push(
        divisionMap[divisionKey][divisionMap[divisionKey].length - 1]
      );
    }

    if (divisionMap[divisionKey].length > 2) {
      for (
        var teamIndexRankMap = 1; teamIndexRankMap < divisionMap[divisionKey].length - 1; teamIndexRankMap++
      ) {
        divisionMiddle.push(divisionMap[divisionKey][teamIndexRankMap]);
      }
    }
  }

  var divisionBreakedData = [];

  if (divisionLosers.length > 0) {
    divisionBreakedData.push(divisionLosers);
  }

  if (divisionMiddle.length > 0) {
    divisionBreakedData.push(divisionMiddle);
  }

  if (divisionWinners.length > 0) {
    divisionBreakedData.push(divisionWinners);
  }

  return divisionBreakedData;
}

function breakDraftOrderWithSameConference(teamList) {
  var conferenceMap = {};

  teamList.forEach(function (obj) {
    if (!conferenceMap[obj["Conference"]]) {
      conferenceMap[obj["Conference"]] = [];
    }
    conferenceMap[obj["Conference"]].push(obj);
  });

  var conferenceWinners = [];
  var conferenceMiddle = [];
  var conferenceLosers = [];

  for (var conferenceKey in conferenceMap) {
    conferenceMap[conferenceKey].sort(function (a, b) {
      var divIndexOfA = conferenceData[conferenceKey].findIndex(
        (obj) => obj["Team"] === a["Team"]
      );
      var divIndexOfB = conferenceData[conferenceKey].findIndex(
        (obj) => obj["Team"] === b["Team"]
      );
      return divIndexOfB - divIndexOfA;
    });

    conferenceWinners.push(conferenceMap[conferenceKey][0]);

    if (conferenceMap[conferenceKey].length > 1) {
      conferenceLosers.push(
        conferenceMap[conferenceKey][conferenceMap[conferenceKey].length - 1]
      );
    }

    if (conferenceMap[conferenceKey].length > 2) {
      for (
        var teamIndexRankMap = 1; teamIndexRankMap < conferenceMap[conferenceKey].length - 1; teamIndexRankMap++
      ) {
        conferenceMiddle.push(conferenceMap[conferenceKey][teamIndexRankMap]);
      }
    }
  }

  var conferenceBreakedData = [];

  if (conferenceLosers.length > 0) {
    conferenceBreakedData.push(conferenceLosers);
  }

  if (conferenceMiddle.length > 0) {
    conferenceBreakedData.push(conferenceMiddle);
  }

  if (conferenceWinners.length > 0) {
    conferenceBreakedData.push(conferenceWinners);
  }

  return conferenceBreakedData;
}

function breakDraftOrderWithSameRec(teamList) {
  var rankMap = {};

  teamList.forEach(function (obj) {
    if (!rankMap[obj["Winning %"]]) {
      rankMap[obj["Winning %"]] = [];
    }
    rankMap[obj["Winning %"]].push(obj);
  });

  var sortedByREC = Object.keys(rankMap)
    .sort(function (a, b) {
      return a - b;
    })
    .map(function (key) {
      return rankMap[key];
    });

  return sortedByREC;
}

function breakDraftOrderWithSameSOS(teamList) {
  var rankMap = {};

  teamList.forEach(function (obj) {
    if (!rankMap[obj["DraftOrderSOS"]]) {
      rankMap[obj["DraftOrderSOS"]] = [];
    }
    rankMap[obj["DraftOrderSOS"]].push(obj);
  });

  var sortedByREC = Object.keys(rankMap)
    .sort(function (a, b) {
      return a - b;
    })
    .map(function (key) {
      return rankMap[key];
    });

  return sortedByREC;
}

function draftOrderSortingTieBreaker(teamA, teamB) {
  var teamAwon = 0;
  var teamBwon = 0;
  var commonGamesObject = {};
  var teamAplayedWith = [];
  var teamBplayedWith = [];

  weekMatchesData.forEach((matchData) => {
    if (matchData["Winner"] && matchData["Winner"] != "TIE") {
      if (
        (matchData["Home"] == teamA && matchData["Away"] == teamB) ||
        (matchData["Away"] == teamA && matchData["Home"] == teamB)
      ) {
        if (matchData["Winner"] == teamA) {
          teamAwon++;
        } else {
          teamBwon++;
        }
      }
    }

    if (matchData["Winner"]) {
      if (matchData["Home"] == teamA && matchData["Away"] != teamB) {
        teamAplayedWith.push(matchData["Away"]);
      } else if (matchData["Away"] == teamA && matchData["Home"] != teamB) {
        teamAplayedWith.push(matchData["Home"]);
      }

      if (matchData["Home"] == teamB && matchData["Away"] != teamA) {
        teamBplayedWith.push(matchData["Away"]);
      } else if (matchData["Away"] == teamB && matchData["Home"] != teamA) {
        teamBplayedWith.push(matchData["Home"]);
      }
    }
  });

  var commonTeamsPlayedWith = teamAplayedWith.filter((value) =>
    teamBplayedWith.includes(value)
  );

  var commonGamesRecord = {
    teamAWins: 0,
    teamALosses: 0,
    teamATies: 0,
    teamATotalGames: 0,
    teamBWins: 0,
    teamBTies: 0,
    teamBLosses: 0,
    teamBTotalGames: 0,
  };

  weekMatchesData.forEach((matchData) => {
    if (matchData["Winner"]) {
      if (
        matchData["Home"] == teamA &&
        commonTeamsPlayedWith.includes(matchData["Away"])
      ) {
        commonGamesRecord["teamATotalGames"]++;
        if (matchData["Winner"] == teamA) commonGamesRecord["teamAWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamATies"]++;
        else commonGamesRecord["teamALosses"]++;
      } else if (
        matchData["Away"] == teamA &&
        commonTeamsPlayedWith.includes(matchData["Home"])
      ) {
        commonGamesRecord["teamATotalGames"]++;
        if (matchData["Winner"] == teamA) commonGamesRecord["teamAWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamATies"]++;
        else commonGamesRecord["teamALosses"]++;
      }

      if (
        matchData["Home"] == teamB &&
        commonTeamsPlayedWith.includes(matchData["Away"])
      ) {
        commonGamesRecord["teamBTotalGames"]++;
        if (matchData["Winner"] == teamB) commonGamesRecord["teamBWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamBTies"]++;
        else commonGamesRecord["teamBLosses"]++;
      } else if (
        matchData["Away"] == teamB &&
        commonTeamsPlayedWith.includes(matchData["Home"])
      ) {
        commonGamesRecord["teamBTotalGames"]++;
        if (matchData["Winner"] == teamB) commonGamesRecord["teamBWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamBTies"]++;
        else commonGamesRecord["teamBLosses"]++;
      }
    }
  });

  if (commonGamesRecord["teamATotalGames"]) {
    commonGamesRecord["teamAWin%"] =
      (commonGamesRecord["teamAWins"] + commonGamesRecord["teamATies"] / 2) /
      commonGamesRecord["teamATotalGames"];
  } else {
    commonGamesRecord["teamAWin%"] = 0;
  }

  if (commonGamesRecord["teamBTotalGames"]) {
    commonGamesRecord["teamBWin%"] =
      (commonGamesRecord["teamBWins"] + commonGamesRecord["teamBTies"] / 2) /
      commonGamesRecord["teamBTotalGames"];
  } else {
    commonGamesRecord["teamBWin%"] = 0;
  }

  var teamAData = teamsData[teamA];
  var teamBData = teamsData[teamB];

  if (
    commonTeamsPlayedWith.length < 4 ||
    commonGamesRecord["teamBWin%"] == commonGamesRecord["teamAWin%"]
  ) {
    if (teamAData["SOV"] == teamBData["SOV"]) {
      if (
        teamAData["CombinedConferenceRank"] ==
        teamBData["CombinedConferenceRank"]
      ) {
        if (
          teamAData["CombinedLeagueRank"] == teamBData["CombinedLeagueRank"]
        ) {
          return teamAData["PD"] == teamBData["PD"] ?
            teamAData["PA"] - teamBData["PA"] :
            teamAData["PD"] - teamBData["PD"];
        } else {
          return (
            teamBData["CombinedLeagueRank"] - teamAData["CombinedLeagueRank"]
          );
        }
      } else {
        return (
          teamBData["CombinedConferenceRank"] -
          teamAData["CombinedConferenceRank"]
        );
      }
    } else {
      return teamAData["SOV"] - teamBData["SOV"];
    }
  } else {
    return commonGamesRecord["teamAWin%"] - commonGamesRecord["teamBWin%"];
  }
}

function setAfterPlayoffDraft(playoffMatchesData) {
  var draftOrderData = prepareDraftOrderData(playoffMatchesData);
  for (var draftCategory in draftOrderData) {
    var sortedCategoryDraftOrder = sortDraftOrderTeams([
      draftOrderData[draftCategory],
    ]);
    draftOrderData[draftCategory] = sortedCategoryDraftOrder;
  }
  setAfterPlayoffDraftOrderContainer(draftOrderData, playoffMatchesData["Super Bowl"]["winner"]);
}

function prepareDraftOrderData(playoffMatchesData) {
  var afterPlayoffDraftOrderData = {};

  var teamNamesInPlayoff = [];
  for (var conference in playoffParticipants) {
    for (
      var teamIndex = 0; teamIndex < playoffParticipants[conference].length; teamIndex++
    ) {
      teamNamesInPlayoff.push(playoffParticipants[conference][teamIndex]);
    }
  }

  var teamsNameNotInPlayoff = Object.keys(teamsData).filter(function (team) {
    return teamNamesInPlayoff.indexOf(team) === -1;
  });

  var teamsNotInPlayoff = [];

  for (var teamIndex in teamsNameNotInPlayoff) {
    teamsNotInPlayoff.push(teamsData[teamsNameNotInPlayoff[teamIndex]]);
  }

  afterPlayoffDraftOrderData["teamsNotInPlayoff"] = teamsNotInPlayoff;
  afterPlayoffDraftOrderData["wildCardLosers"] = [];

  for (var wildCardMatchesIndex in playoffMatchesData["AFC"][
    "Wildcard Round"
  ]) {
    var wildCardMatch =
      playoffMatchesData["AFC"]["Wildcard Round"][wildCardMatchesIndex];
    if (wildCardMatch["teamA"] == wildCardMatch["winner"]) {
      afterPlayoffDraftOrderData["wildCardLosers"].push(
        teamsData[wildCardMatch["teamB"]]
      );
    } else {
      afterPlayoffDraftOrderData["wildCardLosers"].push(
        teamsData[wildCardMatch["teamA"]]
      );
    }
  }

  for (var wildCardMatchesIndex in playoffMatchesData["NFC"][
    "Wildcard Round"
  ]) {
    var wildCardMatch =
      playoffMatchesData["NFC"]["Wildcard Round"][wildCardMatchesIndex];
    if (wildCardMatch["teamA"] == wildCardMatch["winner"]) {
      afterPlayoffDraftOrderData["wildCardLosers"].push(
        teamsData[wildCardMatch["teamB"]]
      );
    } else {
      afterPlayoffDraftOrderData["wildCardLosers"].push(
        teamsData[wildCardMatch["teamA"]]
      );
    }
  }

  afterPlayoffDraftOrderData["divisionalLosers"] = [];

  for (var divisionalMatchesIndex in playoffMatchesData["AFC"][
    "Divisional Playoffs"
  ]) {
    var divisionalMatch =
      playoffMatchesData["AFC"]["Divisional Playoffs"][
      divisionalMatchesIndex
      ];
    if (divisionalMatch["teamA"] == divisionalMatch["winner"]) {
      afterPlayoffDraftOrderData["divisionalLosers"].push(
        teamsData[divisionalMatch["teamB"]]
      );
    } else {
      afterPlayoffDraftOrderData["divisionalLosers"].push(
        teamsData[divisionalMatch["teamA"]]
      );
    }
  }

  for (var divisionalMatchesIndex in playoffMatchesData["NFC"][
    "Divisional Playoffs"
  ]) {
    var divisionalMatch =
      playoffMatchesData["NFC"]["Divisional Playoffs"][
      divisionalMatchesIndex
      ];
    if (divisionalMatch["teamA"] == divisionalMatch["winner"]) {
      afterPlayoffDraftOrderData["divisionalLosers"].push(
        teamsData[divisionalMatch["teamB"]]
      );
    } else {
      afterPlayoffDraftOrderData["divisionalLosers"].push(
        teamsData[divisionalMatch["teamA"]]
      );
    }
  }

  afterPlayoffDraftOrderData["conferenceLosers"] = [];

  for (var conferenceMatchesIndex in playoffMatchesData["AFC"][
    "Conference Championships"
  ]) {
    var conferenceMatch =
      playoffMatchesData["AFC"]["Conference Championships"][
      conferenceMatchesIndex
      ];
    if (conferenceMatch["teamA"] == conferenceMatch["winner"]) {
      afterPlayoffDraftOrderData["conferenceLosers"].push(
        teamsData[conferenceMatch["teamB"]]
      );
    } else {
      afterPlayoffDraftOrderData["conferenceLosers"].push(
        teamsData[conferenceMatch["teamA"]]
      );
    }
  }

  for (var conferenceMatchesIndex in playoffMatchesData["NFC"][
    "Conference Championships"
  ]) {
    var conferenceMatch =
      playoffMatchesData["NFC"]["Conference Championships"][
      conferenceMatchesIndex
      ];
    if (conferenceMatch["teamA"] == conferenceMatch["winner"]) {
      afterPlayoffDraftOrderData["conferenceLosers"].push(
        teamsData[conferenceMatch["teamB"]]
      );
    } else {
      afterPlayoffDraftOrderData["conferenceLosers"].push(
        teamsData[conferenceMatch["teamA"]]
      );
    }
  }

  afterPlayoffDraftOrderData["superBowlTeams"] = [
    teamsData[playoffMatchesData["Super Bowl"]["teamA"]],
    teamsData[playoffMatchesData["Super Bowl"]["teamB"]],
  ];

  return afterPlayoffDraftOrderData;
}

function scrollStandingPageInView() {
  var standingsSectionWrapper = $(".standings-draft-order-wrapper");

  if (standingsSectionWrapper) {
    window.scrollTo({
      top: standingsSectionWrapper.offsetTop,
      behavior: "smooth",
    });
  }
}

// Draft Order ends

function setDefaultDivisionalRound(forConference = "") {
  for (var conference in playoffParticipants) {
    if (!forConference || forConference == conference) {
      playoffMatchesData[conference]["Divisional Playoffs"] = [{
        teamA: "",
        teamARank: "",
        teamB: playoffParticipants[conference][0],
        teamBRank: 1,
        winner: "",
      },
      {
        teamA: "",
        teamARank: "",
        teamB: "",
        teamBRank: "",
        winner: "",
      },
      ];
    }
  }
}

function setDefaultConferenceRound(forConference = "") {
  for (var conference in playoffParticipants) {
    if (!forConference || forConference == conference) {
      playoffMatchesData[conference]["Conference Championships"] = [{
        teamA: "",
        teamARank: "",
        teamB: "",
        teamBRank: "",
        winner: "",
      },];
    }
  }
}

function setDefaultSuperbowlRound(forConference = "") {
  if (!forConference) {
    playoffMatchesData["Super Bowl"] = {
      teamA: "",
      teamARank: "",
      teamB: "",
      teamBRank: "",
      winner: "",
    };
  } else if (forConference == "AFC") {
    playoffMatchesData["Super Bowl"]["teamA"] = "";
    playoffMatchesData["Super Bowl"]["teamARank"] = "";
    playoffMatchesData["Super Bowl"]["winner"] = "";
  } else if (forConference == "NFC") {
    playoffMatchesData["Super Bowl"]["teamB"] = "";
    playoffMatchesData["Super Bowl"]["teamBRank"] = "";
    playoffMatchesData["Super Bowl"]["winner"] = "";
  }
}

function setDeafultWildcardRound() {
  for (var conference in playoffParticipants) {
    playoffMatchesData[conference] = {};
    playoffMatchesData[conference]["Wildcard Round"] = [];
    for (
      var teamIndex = 1; teamIndex < playoffParticipants[conference].length / 2; teamIndex++
    ) {
      var oppositeTeamIndex =
        playoffParticipants[conference].length - teamIndex;
      playoffMatchesData[conference]["Wildcard Round"].push({
        teamA: playoffParticipants[conference][oppositeTeamIndex],
        teamARank: oppositeTeamIndex + 1,
        teamB: playoffParticipants[conference][teamIndex],
        teamBRank: teamIndex + 1,
        winner: "",
      });
    }
  }
}

function setPlayoffMatchesData() {
  setDeafultWildcardRound();
  setDefaultDivisionalRound();
  setDefaultConferenceRound();
  setDefaultSuperbowlRound();
}

function setPlayoffPredictorConatainer() {
  setWildcardRoundContainer();
  setDivisionalRoundContainer();
  setConferenceRoundContainer();
  setSuperBowlContainer();
}

function selectSuperBowlMatchWinner(e) {
  var selectedTeamElement = e.target.closest(
    ".playoff-match-team-details-holder"
  );
  var selectedWinnerTeamName =
    selectedTeamElement.getAttribute("data-team-name");
  var selectedTeamConferenceName = selectedTeamElement.getAttribute(
    "data-team-conference"
  );
  var superBowlMatch = playoffMatchesData["Super Bowl"];
  if (selectedWinnerTeamName && selectedTeamConferenceName) {

    superBowlMatch["winner"] = selectedWinnerTeamName;
    if (superBowlMatch["teamA"] == selectedWinnerTeamName) {
      superBowlMatch["winnerRank"] = superBowlMatch["teamARank"];
    } else {
      superBowlMatch["winnerRank"] = superBowlMatch["teamBRank"];
    }

    var matchContainer = $(".playoff-super-bowl-round-container");
    var teamDetailsHolderContainers = matchContainer.getElementsByClassName(
      "playoff-match-team-details-holder"
    );

    for (
      var teamDetailsHolderContainerIndex = 0; teamDetailsHolderContainerIndex < teamDetailsHolderContainers
        .length; teamDetailsHolderContainerIndex++
    ) {
      var teamDetailsHolderContainer =
        teamDetailsHolderContainers[teamDetailsHolderContainerIndex];
      if (hasClass(teamDetailsHolderContainer, "selected")) {
        removeClass(teamDetailsHolderContainer, "selected");
      }
    }

    if (!hasClass(selectedTeamElement, "selected")) {
      addClass(selectedTeamElement, "selected");
    }

    setAfterPlayoffDraft(playoffMatchesData);

    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
      continueBtn.disabled = false;
    }

    var playoffSimBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
    var playoffPauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
    var resetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
    if (playoffSimBtn && playoffPauseBtn && resetBtn) {
      playoffSimBtn.classList.remove("hidden");
      playoffSimBtn.disabled = true;
      playoffPauseBtn.classList.add("hidden");
      resetBtn.disabled = false;
    }
  }
}

function setSuperBowlContainer() {
  var superBowlMatch = playoffMatchesData["Super Bowl"];

  // AFC side
  var containerClassName = ".afc-playoff-super-bowl-round-container";
  var conferenceSuperBowlContainer = $(containerClassName);
  conferenceSuperBowlContainer.innerHTML = "";

  var superBowlTeamContainer = document.createElement("div");
  addClass(superBowlTeamContainer, "playoff-match-team-details-holder");
  superBowlTeamContainer.addEventListener(
    "click",
    selectSuperBowlMatchWinner
  );
  superBowlTeamContainer.setAttribute("data-match-index", 0);
  superBowlTeamContainer.setAttribute(
    "data-team-name",
    superBowlMatch["teamA"]
  );
  superBowlTeamContainer.setAttribute("data-team-conference", "AFC");

  var superBowlTeamRank = document.createElement("span");
  superBowlTeamRank.innerHTML = "#" + superBowlMatch["teamARank"];
  addClass(superBowlTeamRank, "playoff-match-team-rank-holder");

  var superbowlTeamLogoHolder = document.createElement("div");
  addClass(superbowlTeamLogoHolder, "playoff-match-team-logo-holder");

  if (teamsData[superBowlMatch["teamA"]]) {
    var superbowlTeamLogo = document.createElement("img");
    addClass(superbowlTeamLogo, "playoff-match-team-logo");
    superbowlTeamLogo.setAttribute(
      "src",
      teamsData[superBowlMatch["teamA"]]["logo"]
    );
    superbowlTeamLogo.setAttribute("alt", superBowlMatch["teamA"]);
    superbowlTeamLogo.setAttribute("width", "33px");
    superbowlTeamLogo.setAttribute("height", "22px");
    superbowlTeamLogo.setAttribute("crossorigin", "anonymous");
    superbowlTeamLogoHolder.appendChild(superbowlTeamLogo);
  } else {
    superbowlTeamLogoHolder.style.backgroundColor = "#F5F5F5";
    superbowlTeamLogoHolder.innerHTML = "?";
  }

  superBowlTeamContainer.appendChild(superBowlTeamRank);
  superBowlTeamContainer.appendChild(superbowlTeamLogoHolder);

  conferenceSuperBowlContainer.appendChild(superBowlTeamContainer);

  // NFC
  var containerClassName = ".nfc-playoff-super-bowl-round-container";
  var conferenceSuperBowlContainer = $(containerClassName);
  conferenceSuperBowlContainer.innerHTML = "";

  var superBowlTeamContainer = document.createElement("div");
  addClass(superBowlTeamContainer, "playoff-match-team-details-holder");
  superBowlTeamContainer.addEventListener(
    "click",
    selectSuperBowlMatchWinner
  );
  superBowlTeamContainer.setAttribute("data-match-index", 0);
  superBowlTeamContainer.setAttribute(
    "data-team-name",
    superBowlMatch["teamB"]
  );
  superBowlTeamContainer.setAttribute("data-team-conference", "NFC");

  var superBowlTeamRank = document.createElement("span");
  superBowlTeamRank.innerHTML = "#" + superBowlMatch["teamBRank"];
  addClass(superBowlTeamRank, "playoff-match-team-rank-holder");

  var superbowlTeamLogoHolder = document.createElement("div");
  addClass(superbowlTeamLogoHolder, "playoff-match-team-logo-holder");

  if (teamsData[superBowlMatch["teamB"]]) {
    var superbowlTeamLogo = document.createElement("img");
    addClass(superbowlTeamLogo, "playoff-match-team-logo");
    superbowlTeamLogo.setAttribute(
      "src",
      teamsData[superBowlMatch["teamB"]]["logo"]
    );
    superbowlTeamLogo.setAttribute("alt", superBowlMatch["teamB"]);
    superbowlTeamLogo.setAttribute("width", "33px");
    superbowlTeamLogo.setAttribute("height", "22px");
    superbowlTeamLogo.setAttribute("crossorigin", "anonymous");
    superbowlTeamLogoHolder.appendChild(superbowlTeamLogo);
  } else {
    superbowlTeamLogoHolder.style.backgroundColor = "#F5F5F5";
    superbowlTeamLogoHolder.innerHTML = "?";
  }

  superBowlTeamContainer.appendChild(superbowlTeamLogoHolder);
  superBowlTeamContainer.appendChild(superBowlTeamRank);
  conferenceSuperBowlContainer.appendChild(superBowlTeamContainer);
}

function setWildcardRoundContainer() {
  for (var conference in playoffParticipants) {
    var containerClassName =
      "." + conference.toLowerCase() + "-playoff-wildcard-round-container";
    var conferenceWildcardMatchesContainer = $(containerClassName);
    conferenceWildcardMatchesContainer.innerHTML = "";
    var wildcardMatches = playoffMatchesData[conference]["Wildcard Round"];
    for (
      var matchIndex = 0; matchIndex < wildcardMatches.length; matchIndex++
    ) {
      var wildcardMatchContainer = document.createElement("div");
      addClass(wildcardMatchContainer, "playoff-match-details-holder");
      addClass(
        wildcardMatchContainer,
        conference + "-wildcard-match-" + matchIndex
      );

      var wildCardMatchTeamContainer = document.createElement("div");
      addClass(
        wildCardMatchTeamContainer,
        "playoff-match-team-details-holder"
      );
      wildCardMatchTeamContainer.addEventListener(
        "click",
        selectWildcardRoundMatchWinner
      );
      wildCardMatchTeamContainer.setAttribute("data-match-index", matchIndex);
      wildCardMatchTeamContainer.setAttribute(
        "data-team-name",
        wildcardMatches[matchIndex]["teamA"]
      );
      wildCardMatchTeamContainer.setAttribute(
        "data-team-conference",
        conference
      );

      var wildcardTeamRank = document.createElement("span");
      wildcardTeamRank.innerHTML =
        "#" + wildcardMatches[matchIndex]["teamARank"];
      addClass(wildcardTeamRank, "playoff-match-team-rank-holder");

      var wildcardteamLogo = document.createElement("img");
      addClass(wildcardteamLogo, "playoff-match-team-logo");
      wildcardteamLogo.setAttribute(
        "src",
        teamsData[wildcardMatches[matchIndex]["teamA"]]["logo"]
      );
      wildcardteamLogo.setAttribute(
        "alt",
        wildcardMatches[matchIndex]["teamA"]
      );
      wildcardteamLogo.setAttribute("width", "33px");
      wildcardteamLogo.setAttribute("height", "22px");
      wildcardteamLogo.setAttribute("crossorigin", "anonymous");

      wildCardMatchTeamContainer.appendChild(wildcardTeamRank);
      wildCardMatchTeamContainer.appendChild(wildcardteamLogo);

      wildcardMatchContainer.appendChild(wildCardMatchTeamContainer);

      var playoffmatchVersesConatiner = document.createElement("div");
      addClass(playoffmatchVersesConatiner, "playoff-match-verses-container");

      var playoffmatchVersesText = document.createElement("span");
      addClass(playoffmatchVersesText, "playoff-match-verses-text");
      playoffmatchVersesText.innerHTML = "@";

      playoffmatchVersesConatiner.appendChild(playoffmatchVersesText);
      wildcardMatchContainer.appendChild(playoffmatchVersesConatiner);

      var wildCardMatchTeamContainer = document.createElement("div");
      addClass(
        wildCardMatchTeamContainer,
        "playoff-match-team-details-holder"
      );
      wildCardMatchTeamContainer.addEventListener(
        "click",
        selectWildcardRoundMatchWinner
      );
      wildCardMatchTeamContainer.setAttribute("data-match-index", matchIndex);
      wildCardMatchTeamContainer.setAttribute(
        "data-team-name",
        wildcardMatches[matchIndex]["teamB"]
      );
      wildCardMatchTeamContainer.setAttribute(
        "data-team-conference",
        conference
      );

      var wildcardTeamRank = document.createElement("span");
      wildcardTeamRank.innerHTML =
        "#" + wildcardMatches[matchIndex]["teamBRank"];
      addClass(wildcardTeamRank, "playoff-match-team-rank-holder");

      var wildcardteamLogo = document.createElement("img");
      addClass(wildcardteamLogo, "playoff-match-team-logo");
      wildcardteamLogo.setAttribute(
        "src",
        teamsData[wildcardMatches[matchIndex]["teamB"]]["logo"]
      );
      wildcardteamLogo.setAttribute(
        "alt",
        wildcardMatches[matchIndex]["teamB"]
      );
      wildcardteamLogo.setAttribute("width", "33px");
      wildcardteamLogo.setAttribute("height", "22px");
      wildcardteamLogo.setAttribute("crossorigin", "anonymous");


      wildCardMatchTeamContainer.appendChild(wildcardteamLogo);
      wildCardMatchTeamContainer.appendChild(wildcardTeamRank);

      wildcardMatchContainer.appendChild(wildCardMatchTeamContainer);

      conferenceWildcardMatchesContainer.appendChild(wildcardMatchContainer);
    }
  }
}

function setDivisionalRoundContainer(forConference = "") {
  for (var conference in playoffParticipants) {
    if (!forConference || forConference == conference) {
      var containerClassName =
        "." +
        conference.toLowerCase() +
        "-playoff-divisional-round-container";
      var conferenceDivisionMatchesContainer = $(containerClassName);
      conferenceDivisionMatchesContainer.innerHTML = "";
      var divisionMatches =
        playoffMatchesData[conference]["Divisional Playoffs"];
      for (
        var matchIndex = 0; matchIndex < divisionMatches.length; matchIndex++
      ) {
        var divisionMatchContainer = document.createElement("div");
        addClass(divisionMatchContainer, "playoff-match-details-holder");
        addClass(
          divisionMatchContainer,
          conference + "-division-match-" + matchIndex
        );

        var divisionMatchTeamContainer = document.createElement("div");
        addClass(
          divisionMatchTeamContainer,
          "playoff-match-team-details-holder"
        );

        divisionMatchTeamContainer.addEventListener(
          "click",
          selectDivisionRoundMatchWinner
        );
        divisionMatchTeamContainer.setAttribute(
          "data-match-index",
          matchIndex
        );
        divisionMatchTeamContainer.setAttribute(
          "data-team-name",
          divisionMatches[matchIndex]["teamA"]
        );
        divisionMatchTeamContainer.setAttribute(
          "data-team-conference",
          conference
        );

        var divisionTeamRank = document.createElement("span");
        divisionTeamRank.innerHTML =
          "#" + divisionMatches[matchIndex]["teamARank"];
        addClass(divisionTeamRank, "playoff-match-team-rank-holder");

        var divisionTeamLogoHolder = document.createElement("div");
        addClass(divisionTeamLogoHolder, "playoff-match-team-logo-holder");
        if (teamsData[divisionMatches[matchIndex]["teamA"]]) {
          var divisionteamLogo = document.createElement("img");
          addClass(divisionteamLogo, "playoff-match-team-logo");
          divisionteamLogo.setAttribute(
            "src",
            teamsData[divisionMatches[matchIndex]["teamA"]]["logo"]
          );
          divisionteamLogo.setAttribute(
            "alt",
            divisionMatches[matchIndex]["teamA"]
          );
          divisionteamLogo.setAttribute("width", "33px");
          divisionteamLogo.setAttribute("height", "22px");
          divisionteamLogo.setAttribute("crossorigin", "anonymous");
          divisionTeamLogoHolder.appendChild(divisionteamLogo);
        } else {
          divisionTeamLogoHolder.style.backgroundColor = "#F5F5F5";
          divisionTeamLogoHolder.innerHTML = "?";
        }

        divisionMatchTeamContainer.appendChild(divisionTeamRank);
        divisionMatchTeamContainer.appendChild(divisionTeamLogoHolder);

        divisionMatchContainer.appendChild(divisionMatchTeamContainer);

        var playoffmatchVersesConatiner = document.createElement("div");
        addClass(
          playoffmatchVersesConatiner,
          "playoff-match-verses-container"
        );

        var playoffmatchVersesText = document.createElement("span");
        addClass(playoffmatchVersesText, "playoff-match-verses-text");
        playoffmatchVersesText.innerHTML = "@";

        playoffmatchVersesConatiner.appendChild(playoffmatchVersesText);
        divisionMatchContainer.appendChild(playoffmatchVersesConatiner);

        var divisionMatchTeamContainer = document.createElement("div");
        addClass(
          divisionMatchTeamContainer,
          "playoff-match-team-details-holder"
        );

        divisionMatchTeamContainer.addEventListener(
          "click",
          selectDivisionRoundMatchWinner
        );
        divisionMatchTeamContainer.setAttribute(
          "data-match-index",
          matchIndex
        );
        divisionMatchTeamContainer.setAttribute(
          "data-team-name",
          divisionMatches[matchIndex]["teamB"]
        );
        divisionMatchTeamContainer.setAttribute(
          "data-team-conference",
          conference
        );

        var divisionTeamRank = document.createElement("span");
        divisionTeamRank.innerHTML =
          "#" + divisionMatches[matchIndex]["teamBRank"];
        addClass(divisionTeamRank, "playoff-match-team-rank-holder");

        var divisionTeamLogoHolder = document.createElement("div");
        addClass(divisionTeamLogoHolder, "playoff-match-team-logo-holder");
        if (teamsData[divisionMatches[matchIndex]["teamB"]]) {
          var divisionteamLogo = document.createElement("img");
          addClass(divisionteamLogo, "playoff-match-team-logo");
          divisionteamLogo.setAttribute(
            "src",
            teamsData[divisionMatches[matchIndex]["teamB"]]["logo"]
          );
          divisionteamLogo.setAttribute(
            "alt",
            divisionMatches[matchIndex]["teamB"]
          );
          divisionteamLogo.setAttribute("width", "33px");
          divisionteamLogo.setAttribute("height", "22px");
          divisionteamLogo.setAttribute("crossorigin", "anonymous");
          divisionTeamLogoHolder.appendChild(divisionteamLogo);
        } else {
          divisionTeamLogoHolder.style.backgroundColor = "#F5F5F5";
          divisionTeamLogoHolder.innerHTML = "?";
        }

        divisionMatchTeamContainer.appendChild(divisionTeamLogoHolder);
        divisionMatchTeamContainer.appendChild(divisionTeamRank);

        divisionMatchContainer.appendChild(divisionMatchTeamContainer);

        conferenceDivisionMatchesContainer.appendChild(
          divisionMatchContainer
        );
      }
    }
  }
}

function selectDivisionRoundMatchWinner(e) {
  var selectedTeamElement = e.target.closest(
    ".playoff-match-team-details-holder"
  );
  var selectedWinnerTeamName =
    selectedTeamElement.getAttribute("data-team-name");
  var selectedWinnerMatchIndex =
    selectedTeamElement.getAttribute("data-match-index");
  var selectedTeamConferenceName = selectedTeamElement.getAttribute(
    "data-team-conference"
  );

  if (
    selectedWinnerMatchIndex &&
    selectedWinnerTeamName &&
    selectedWinnerTeamName
  ) {
    var divisionMatches =
      playoffMatchesData[selectedTeamConferenceName]["Divisional Playoffs"];
    if (
      divisionMatches[selectedWinnerMatchIndex]["winner"] ==
      selectedWinnerTeamName
    )
      return;
    divisionMatches[selectedWinnerMatchIndex]["winner"] =
      selectedWinnerTeamName;
    if (
      divisionMatches[selectedWinnerMatchIndex]["teamA"] ==
      selectedWinnerTeamName
    ) {
      divisionMatches[selectedWinnerMatchIndex]["winnerRank"] =
        divisionMatches[selectedWinnerMatchIndex]["teamARank"];
    } else {
      divisionMatches[selectedWinnerMatchIndex]["winnerRank"] =
        divisionMatches[selectedWinnerMatchIndex]["teamBRank"];
    }

    var matchContainer = $(
      "." +
      selectedTeamConferenceName +
      "-division-match-" +
      selectedWinnerMatchIndex
    );
    var teamDetailsHolderContainers = matchContainer.getElementsByClassName(
      "playoff-match-team-details-holder"
    );

    for (
      var teamDetailsHolderContainerIndex = 0; teamDetailsHolderContainerIndex < teamDetailsHolderContainers
        .length; teamDetailsHolderContainerIndex++
    ) {
      var teamDetailsHolderContainer =
        teamDetailsHolderContainers[teamDetailsHolderContainerIndex];
      if (hasClass(teamDetailsHolderContainer, "selected")) {
        removeClass(teamDetailsHolderContainer, "selected");
      }
    }

    if (!hasClass(selectedTeamElement, "selected")) {
      addClass(selectedTeamElement, "selected");
    }

    if (checkAllDivisionalMatchesCompletion()) {
    }

    var playoffResetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
    if (playoffResetBtn) {
      playoffResetBtn.removeAttribute("disabled");
    }

    updateConferencePlayoffsData(selectedTeamConferenceName);
    setDefaultSuperbowlRound(selectedTeamConferenceName);
    updateSuperbowlPlayoffsData(selectedTeamConferenceName);

    updateDraftOrder();

    if (playoffMatchesData["Super Bowl"]["winner"] == "") {
      const continueBtn = document.getElementById('continueBtn');
      if (continueBtn) {
        continueBtn.disabled = true;
      }

      var simBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
      var pauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
      var resetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
      if (simBtn && pauseBtn && resetBtn) {
        simBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
        simBtn.disabled = false;
        resetBtn.disabled = false;
      }
    }
  }
}

function selectWildcardRoundMatchWinner(e) {
  var selectedTeamElement = e.target.closest(
    ".playoff-match-team-details-holder"
  );
  var selectedWinnerTeamName =
    selectedTeamElement.getAttribute("data-team-name");
  var selectedWinnerMatchIndex =
    selectedTeamElement.getAttribute("data-match-index");
  var selectedTeamConferenceName = selectedTeamElement.getAttribute(
    "data-team-conference"
  );
  if (
    selectedWinnerMatchIndex &&
    selectedWinnerTeamName &&
    selectedTeamConferenceName
  ) {
    var wildcardMatches =
      playoffMatchesData[selectedTeamConferenceName]["Wildcard Round"];
    if (
      wildcardMatches[selectedWinnerMatchIndex]["winner"] ==
      selectedWinnerTeamName
    )
      return;
    wildcardMatches[selectedWinnerMatchIndex]["winner"] =
      selectedWinnerTeamName;
    if (
      wildcardMatches[selectedWinnerMatchIndex]["teamA"] ==
      selectedWinnerTeamName
    ) {
      wildcardMatches[selectedWinnerMatchIndex]["winnerRank"] =
        wildcardMatches[selectedWinnerMatchIndex]["teamARank"];
    } else {
      wildcardMatches[selectedWinnerMatchIndex]["winnerRank"] =
        wildcardMatches[selectedWinnerMatchIndex]["teamBRank"];
    }

    var matchContainer = $(
      "." +
      selectedTeamConferenceName +
      "-wildcard-match-" +
      selectedWinnerMatchIndex
    );
    var teamDetailsHolderContainers = matchContainer.getElementsByClassName(
      "playoff-match-team-details-holder"
    );

    for (
      var teamDetailsHolderContainerIndex = 0; teamDetailsHolderContainerIndex < teamDetailsHolderContainers
        .length; teamDetailsHolderContainerIndex++
    ) {
      var teamDetailsHolderContainer =
        teamDetailsHolderContainers[teamDetailsHolderContainerIndex];
      if (hasClass(teamDetailsHolderContainer, "selected")) {
        removeClass(teamDetailsHolderContainer, "selected");
      }
    }

    if (!hasClass(selectedTeamElement, "selected")) {
      addClass(selectedTeamElement, "selected");
    }

    if (checkAllWildcardMatchesCompletion()) {
    }

    var playoffResetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
    if (playoffResetBtn) {
      playoffResetBtn.removeAttribute("disabled");
    }

    updateDivisionalPlayoffsData(selectedTeamConferenceName);
    setDefaultConferenceRound(selectedTeamConferenceName);
    updateConferencePlayoffsData(selectedTeamConferenceName);
    setDefaultSuperbowlRound(selectedTeamConferenceName);
    updateSuperbowlPlayoffsData(selectedTeamConferenceName);

    updateDraftOrder();

    if (playoffMatchesData["Super Bowl"]["winner"] == "") {
      const continueBtn = document.getElementById('continueBtn');
      if (continueBtn) {
        continueBtn.disabled = true;
      }

      var simBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
      var pauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
      var resetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
      if (simBtn && pauseBtn && resetBtn) {
        simBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
        simBtn.disabled = false;
        resetBtn.disabled = false;
      }
    }
  }
}

function selectConferenceRoundWinner(e) {
  var selectedTeamElement = e.target.closest(
    ".playoff-match-team-details-holder"
  );
  var selectedWinnerTeamName =
    selectedTeamElement.getAttribute("data-team-name");
  var selectedWinnerMatchIndex =
    selectedTeamElement.getAttribute("data-match-index");
  var selectedTeamConferenceName = selectedTeamElement.getAttribute(
    "data-team-conference"
  );

  if (
    selectedWinnerMatchIndex &&
    selectedWinnerTeamName &&
    selectedTeamConferenceName
  ) {
    var conferenceMatches =
      playoffMatchesData[selectedTeamConferenceName][
      "Conference Championships"
      ];
    if (
      conferenceMatches[selectedWinnerMatchIndex]["winner"] ==
      selectedWinnerTeamName
    )
      return;
    conferenceMatches[selectedWinnerMatchIndex]["winner"] =
      selectedWinnerTeamName;
    if (
      conferenceMatches[selectedWinnerMatchIndex]["teamA"] ==
      selectedWinnerTeamName
    ) {
      conferenceMatches[selectedWinnerMatchIndex]["winnerRank"] =
        conferenceMatches[selectedWinnerMatchIndex]["teamARank"];
    } else {
      conferenceMatches[selectedWinnerMatchIndex]["winnerRank"] =
        conferenceMatches[selectedWinnerMatchIndex]["teamBRank"];
    }

    var matchContainer = $(
      "." +
      selectedTeamConferenceName +
      "-conference-match-" +
      selectedWinnerMatchIndex
    );
    var teamDetailsHolderContainers = matchContainer.getElementsByClassName(
      "playoff-match-team-details-holder"
    );

    for (
      var teamDetailsHolderContainerIndex = 0; teamDetailsHolderContainerIndex < teamDetailsHolderContainers
        .length; teamDetailsHolderContainerIndex++
    ) {
      var teamDetailsHolderContainer =
        teamDetailsHolderContainers[teamDetailsHolderContainerIndex];
      if (hasClass(teamDetailsHolderContainer, "selected")) {
        removeClass(teamDetailsHolderContainer, "selected");
      }
    }

    if (!hasClass(selectedTeamElement, "selected")) {
      addClass(selectedTeamElement, "selected");
    }

    updateSuperbowlPlayoffsData(selectedTeamConferenceName);

    updateDraftOrder();

    var playoffResetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
    if (playoffResetBtn) {
      playoffResetBtn.removeAttribute("disabled");
    }

    if (playoffMatchesData["Super Bowl"]["winner"] == "") {
      const continueBtn = document.getElementById('continueBtn');
      if (continueBtn) {
        continueBtn.disabled = true;
      }

      var simBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
      var pauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
      var resetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
      if (simBtn && pauseBtn && resetBtn) {
        simBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
        simBtn.disabled = false;
        resetBtn.disabled = false;
      }
    }
  }
}

function updateSuperbowlPlayoffsData(forConference) {
  var conferenceAFCMatchData =
    playoffMatchesData["AFC"]["Conference Championships"][0];
  var conferenceNFCMatchData =
    playoffMatchesData["NFC"]["Conference Championships"][0];

  if (
    forConference == "AFC" &&
    conferenceAFCMatchData["winner"] &&
    conferenceAFCMatchData["winnerRank"]
  ) {
    playoffMatchesData["Super Bowl"]["teamA"] =
      conferenceAFCMatchData["winner"];
    playoffMatchesData["Super Bowl"]["teamARank"] =
      conferenceAFCMatchData["winnerRank"];
  }

  if (
    forConference == "NFC" &&
    conferenceNFCMatchData["winner"] &&
    conferenceNFCMatchData["winnerRank"]
  ) {
    playoffMatchesData["Super Bowl"]["teamB"] =
      conferenceNFCMatchData["winner"];
    playoffMatchesData["Super Bowl"]["teamBRank"] =
      conferenceNFCMatchData["winnerRank"];
  }

  var superBowlContainerAFC = $(".afc-playoff-super-bowl-round-container");
  var superBowlContainerNFC = $(".nfc-playoff-super-bowl-round-container");

  if (
    conferenceAFCMatchData["winner"] &&
    conferenceAFCMatchData["winnerRank"] &&
    conferenceNFCMatchData["winner"] &&
    conferenceNFCMatchData["winnerRank"]
  ) {

    if (
      superBowlContainerAFC &&
      hasClass(superBowlContainerAFC, "disabled-round")
    ) {
      removeClass(superBowlContainerAFC, "disabled-round");
    }

    if (
      superBowlContainerNFC &&
      hasClass(superBowlContainerNFC, "disabled-round")
    ) {
      removeClass(superBowlContainerNFC, "disabled-round");
    }
  } else {
    if (
      superBowlContainerAFC &&
      !hasClass(superBowlContainerAFC, "disabled-round")
    ) {
      addClass(superBowlContainerAFC, "disabled-round");
    }

    if (
      superBowlContainerNFC &&
      !hasClass(superBowlContainerNFC, "disabled-round")
    ) {
      addClass(superBowlContainerNFC, "disabled-round");
    }
  }

  setSuperBowlContainer();
}

function checkAllDivisionalMatchesCompletion() {
  var allMatchesComplete = true;
  playoffMatchesData["AFC"]["Divisional Playoffs"].forEach(
    (divisionalMatchData) => {
      if (!divisionalMatchData["winner"] || !divisionalMatchData["winnerRank"]) {
        allMatchesComplete = false;
      }
    }
  );
  playoffMatchesData["NFC"]["Divisional Playoffs"].forEach(
    (divisionalMatchData) => {
      if (!divisionalMatchData["winner"] || !divisionalMatchData["winnerRank"]) {
        allMatchesComplete = false;
      }
    }
  );

  return allMatchesComplete;
}

function checkAllWildcardMatchesCompletion() {
  var allMatchesComplete = true;
  playoffMatchesData["AFC"]["Wildcard Round"].forEach(
    (wildcardMatchData) => {
      if (!wildcardMatchData["winner"] || !wildcardMatchData["winnerRank"]) {
        allMatchesComplete = false;
      }
    }
  );
  playoffMatchesData["NFC"]["Wildcard Round"].forEach(
    (wildcardMatchData) => {
      if (!wildcardMatchData["winner"] || !wildcardMatchData["winnerRank"]) {
        allMatchesComplete = false;
      }
    }
  );

  return allMatchesComplete;
}

function updateConferencePlayoffsData(conferenceName) {
  var divisionalWinnersData = [];
  playoffMatchesData[conferenceName]["Divisional Playoffs"].forEach(
    (divisionalMatchData) => {
      if (
        divisionalMatchData["winner"] &&
        divisionalMatchData["winnerRank"]
      ) {
        divisionalWinnersData.push({
          rank: divisionalMatchData["winnerRank"],
          team: divisionalMatchData["winner"],
        });
      }
    }
  );

  var conferenceRoundConatiner = $(
    "." + conferenceName.toLowerCase() + "-playoff-conference-round-container"
  );

  if (
    divisionalWinnersData.length ==
    playoffMatchesData[conferenceName]["Divisional Playoffs"].length
  ) {
    divisionalWinnersData.sort(function (a, b) {
      return a["rank"] - b["rank"];
    });

    playoffMatchesData[conferenceName]["Conference Championships"][0][
      "teamA"
    ] = divisionalWinnersData[1]["team"];
    playoffMatchesData[conferenceName]["Conference Championships"][0][
      "teamARank"
    ] = divisionalWinnersData[1]["rank"];
    playoffMatchesData[conferenceName]["Conference Championships"][0][
      "winner"
    ] = "";

    playoffMatchesData[conferenceName]["Conference Championships"][0][
      "teamB"
    ] = divisionalWinnersData[0]["team"];
    playoffMatchesData[conferenceName]["Conference Championships"][0][
      "teamBRank"
    ] = divisionalWinnersData[0]["rank"];

    if (
      conferenceRoundConatiner &&
      hasClass(conferenceRoundConatiner, "disabled-round")
    ) {
      removeClass(conferenceRoundConatiner, "disabled-round");
    }
  } else {
    if (
      conferenceRoundConatiner &&
      !hasClass(conferenceRoundConatiner, "disabled-round")
    ) {
      addClass(conferenceRoundConatiner, "disabled-round");
    }
  }

  setConferenceRoundContainer(conferenceName);
}

function updateDivisionalPlayoffsData(conferenceName) {
  var wildCardWinnersData = [];
  playoffMatchesData[conferenceName]["Wildcard Round"].forEach(
    (wildCardMatchData) => {
      if (wildCardMatchData["winner"] && wildCardMatchData["winnerRank"]) {
        wildCardWinnersData.push({
          rank: wildCardMatchData["winnerRank"],
          team: wildCardMatchData["winner"],
        });
      }
    }
  );
  if (
    wildCardWinnersData.length ==
    playoffMatchesData[conferenceName]["Wildcard Round"].length
  ) {
    wildCardWinnersData.sort(function (a, b) {
      return a["rank"] - b["rank"];
    });

    playoffMatchesData[conferenceName]["Divisional Playoffs"][0]["teamA"] =
      wildCardWinnersData[2]["team"];
    playoffMatchesData[conferenceName]["Divisional Playoffs"][0][
      "teamARank"
    ] = wildCardWinnersData[2]["rank"];
    playoffMatchesData[conferenceName]["Divisional Playoffs"][0]["winner"] =
      "";

    playoffMatchesData[conferenceName]["Divisional Playoffs"][1]["teamA"] =
      wildCardWinnersData[1]["team"];
    playoffMatchesData[conferenceName]["Divisional Playoffs"][1][
      "teamARank"
    ] = wildCardWinnersData[1]["rank"];

    playoffMatchesData[conferenceName]["Divisional Playoffs"][1]["teamB"] =
      wildCardWinnersData[0]["team"];
    playoffMatchesData[conferenceName]["Divisional Playoffs"][1][
      "teamBRank"
    ] = wildCardWinnersData[0]["rank"];
    playoffMatchesData[conferenceName]["Divisional Playoffs"][1]["winner"] =
      "";

    var divisionalRoundConatiner = $(
      "." +
      conferenceName.toLowerCase() +
      "-playoff-divisional-round-container"
    );
    if (hasClass(divisionalRoundConatiner, "disabled-round")) {
      removeClass(divisionalRoundConatiner, "disabled-round");
    }

    setDivisionalRoundContainer(conferenceName);
  }
}

function setConferenceRoundContainer(forConference = "") {
  for (var conference in playoffParticipants) {
    if (!forConference || conference == forConference) {
      var containerClassName =
        "." +
        conference.toLowerCase() +
        "-playoff-conference-round-container";
      var conferenceChampionshipMatchesContainer = $(containerClassName);
      conferenceChampionshipMatchesContainer.innerHTML = "";
      var conferenceMatches =
        playoffMatchesData[conference]["Conference Championships"];
      for (
        var matchIndex = 0; matchIndex < conferenceMatches.length; matchIndex++
      ) {
        var conferenceMatchContainer = document.createElement("div");
        addClass(conferenceMatchContainer, "playoff-match-details-holder");
        addClass(
          conferenceMatchContainer,
          conference + "-conference-match-" + matchIndex
        );

        var conferenceMatchTeamContainer = document.createElement("div");
        addClass(
          conferenceMatchTeamContainer,
          "playoff-match-team-details-holder"
        );

        conferenceMatchTeamContainer.addEventListener(
          "click",
          selectConferenceRoundWinner
        );
        conferenceMatchTeamContainer.setAttribute(
          "data-match-index",
          matchIndex
        );
        conferenceMatchTeamContainer.setAttribute(
          "data-team-name",
          conferenceMatches[matchIndex]["teamA"]
        );
        conferenceMatchTeamContainer.setAttribute(
          "data-team-conference",
          conference
        );

        var conferenceTeamRank = document.createElement("span");
        conferenceTeamRank.innerHTML =
          "#" + conferenceMatches[matchIndex]["teamARank"];
        addClass(conferenceTeamRank, "playoff-match-team-rank-holder");

        var conferenceTeamLogoHolder = document.createElement("div");
        addClass(conferenceTeamLogoHolder, "playoff-match-team-logo-holder");
        if (teamsData[conferenceMatches[matchIndex]["teamA"]]) {
          var conferenceteamLogo = document.createElement("img");
          addClass(conferenceteamLogo, "playoff-match-team-logo");
          conferenceteamLogo.setAttribute(
            "src",
            teamsData[conferenceMatches[matchIndex]["teamA"]]["logo"]
          );
          conferenceteamLogo.setAttribute(
            "alt",
            conferenceMatches[matchIndex]["teamA"]
          );
          conferenceteamLogo.setAttribute("width", "33px");
          conferenceteamLogo.setAttribute("height", "22px");
          conferenceteamLogo.setAttribute("crossorigin", "anonymous");
          conferenceTeamLogoHolder.appendChild(conferenceteamLogo);
        } else {
          conferenceTeamLogoHolder.innerHTML = "?";
        }

        conferenceMatchTeamContainer.appendChild(conferenceTeamRank);
        conferenceMatchTeamContainer.appendChild(conferenceTeamLogoHolder);

        conferenceMatchContainer.appendChild(conferenceMatchTeamContainer);

        var playoffmatchVersesConatiner = document.createElement("div");
        addClass(
          playoffmatchVersesConatiner,
          "playoff-match-verses-container"
        );

        var playoffmatchVersesText = document.createElement("span");
        addClass(playoffmatchVersesText, "playoff-match-verses-text");
        playoffmatchVersesText.innerHTML = "@";

        playoffmatchVersesConatiner.appendChild(playoffmatchVersesText);
        conferenceMatchContainer.appendChild(playoffmatchVersesConatiner);

        var conferenceMatchTeamContainer = document.createElement("div");
        addClass(
          conferenceMatchTeamContainer,
          "playoff-match-team-details-holder"
        );

        conferenceMatchTeamContainer.addEventListener(
          "click",
          selectConferenceRoundWinner
        );
        conferenceMatchTeamContainer.setAttribute(
          "data-match-index",
          matchIndex
        );
        conferenceMatchTeamContainer.setAttribute(
          "data-team-name",
          conferenceMatches[matchIndex]["teamB"]
        );
        conferenceMatchTeamContainer.setAttribute(
          "data-team-conference",
          conference
        );

        var conferenceTeamRank = document.createElement("span");
        conferenceTeamRank.innerHTML =
          "#" + conferenceMatches[matchIndex]["teamBRank"];
        addClass(conferenceTeamRank, "playoff-match-team-rank-holder");

        var conferenceTeamLogoHolder = document.createElement("div");
        addClass(conferenceTeamLogoHolder, "playoff-match-team-logo-holder");
        if (teamsData[conferenceMatches[matchIndex]["teamB"]]) {
          var conferenceteamLogo = document.createElement("img");
          addClass(conferenceteamLogo, "playoff-match-team-logo");
          conferenceteamLogo.setAttribute(
            "src",
            teamsData[conferenceMatches[matchIndex]["teamB"]]["logo"]
          );
          conferenceteamLogo.setAttribute(
            "alt",
            conferenceMatches[matchIndex]["teamB"]
          );
          conferenceteamLogo.setAttribute("width", "33px");
          conferenceteamLogo.setAttribute("height", "22px");
          conferenceteamLogo.setAttribute("crossorigin", "anonymous");
          conferenceTeamLogoHolder.appendChild(conferenceteamLogo);
        } else {
          conferenceTeamLogoHolder.innerHTML = "?";
        }

        conferenceMatchTeamContainer.appendChild(conferenceTeamLogoHolder);
        conferenceMatchTeamContainer.appendChild(conferenceTeamRank);

        conferenceMatchContainer.appendChild(conferenceMatchTeamContainer);

        conferenceChampionshipMatchesContainer.appendChild(
          conferenceMatchContainer
        );
      }
    }
  }
}

function setPlayoffParticipantsData() {
  playoffParticipants = {};
  for (var conference in conferenceData) {
    playoffParticipants[conference] = [];
    for (var i = 0; i < 7; i++) {
      playoffParticipants[conference].push(
        conferenceData[conference][i]["Team"]
      );
    }
  }
}

function checkDataIsInitial() {
  for (let i = 0; i < teamsList.length; i++) {
    if (teamsData[teamsList[i]].Wins !== 0 || teamsData[teamsList[i]].Losses !== 0 || teamsData[teamsList[i]].Ties !==
      0) return false;
  }

  return true;
}

function setPlayoffParticipants() {
  playoffParticipants = {};
  let initailDataFlag = checkDataIsInitial();
  for (var conference in conferenceData) {
    playoffParticipants[conference] = [];
    for (var i = 0; i < 7; i++) {
      playoffParticipants[conference].push(
        conferenceData[conference][i]["Team"]
      );
    }
  }
}

function setPlayoffParticipantsStandings() {
}

function showConferenceStandingsData() {
  var standingContainer = $(".conference-standings");
  removeAllChild(standingContainer);

  var conferenceDataSequence = ["AFC", "NFC"];

  for (
    var sequenceIndex = 0; sequenceIndex < conferenceDataSequence.length; sequenceIndex++
  ) {
    var conference = conferenceDataSequence[sequenceIndex];
    var ConfStandingContainer = document.createElement("div");
    var confStandingType = document.createElement("span");
    addClass(confStandingType, "standings-header-text");
    confStandingType.innerHTML = conference;
    ConfStandingContainer.appendChild(confStandingType);

    var confData = conferenceData[conference];

    var standingsTableContainer = document.createElement("div");
    addClass(standingsTableContainer, "standings-table-container");

    var standingsTable = document.createElement("table");

    var tableHeader = [
      "#",
      "TEAM",
      "REC",
      "DIV",
      "CONF",
      "SOS",
      "SOV",
      "PF",
      "PA",
      "PD",
      "CR. L",
      "CR. C",
    ];

    var thead = document.createElement("thead");
    var tableRow = document.createElement("tr");

    for (
      var tableHeaderIndex = 0; tableHeaderIndex < tableHeader.length - 2; tableHeaderIndex++
    ) {
      var tableHeaderEl = document.createElement("th");
      tableHeaderEl.innerHTML = tableHeader[tableHeaderIndex];
      tableRow.appendChild(tableHeaderEl);
    }

    var tableHeaderEl = document.createElement("th");
    addClass(tableHeaderEl, "combined-ranking-table-header");
    tableHeaderEl.setAttribute("colspan", 2);

    tableHeaderEl.appendChild(creatCombinedRankingDesignHeader());
    tableRow.appendChild(tableHeaderEl);

    thead.appendChild(tableRow);
    standingsTable.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var teamIndex = 0; teamIndex < confData.length; teamIndex++) {
      tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = teamIndex + 1;
      tableRow.appendChild(td);

      td = document.createElement("td");
      addClass(td, "standings-team-container-td");

      var standingsTeamContainer = document.createElement("div");
      addClass(standingsTeamContainer, "standings-team-container");
      var standingsTeamLogo = document.createElement("img");
      addClass(standingsTeamLogo, "standings-team-logo");
      standingsTeamLogo.setAttribute(
        "src",
        teamsData[confData[teamIndex]["Team"]]["logo"]
      );
      standingsTeamLogo.setAttribute(
        "alt",
        confData[teamIndex]["Team"]
      );
      standingsTeamLogo.setAttribute("width", "18px");
      standingsTeamLogo.setAttribute("height", "12px");
      standingsTeamLogo.setAttribute("crossorigin", "anonymous");
      standingsTeamContainer.appendChild(standingsTeamLogo);

      var standingsTeamName = document.createElement("span");
      addClass(standingsTeamName, "standings-team-name");
      standingsTeamName.innerHTML = confData[teamIndex]["Team"];
      standingsTeamContainer.appendChild(standingsTeamName);

      if (teamsData[confData[teamIndex]["Team"]]["Playoff Status"]) {
        var playoffStatusText = document.createElement("span");
        addClass(playoffStatusText, "playoff-status-text");
        playoffStatusText.innerHTML = teamsData[confData[teamIndex]["Team"]]["Playoff Status"];
        standingsTeamContainer.appendChild(playoffStatusText);
      }

      td.appendChild(standingsTeamContainer);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(
        confData[teamIndex]["Team"]
      );
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = generateDivWinLoseTieText(confData[teamIndex]["Team"]);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = generateConfWinLoseTieText(confData[teamIndex]["Team"]);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = confData[teamIndex]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = confData[teamIndex]["SOV"].toFixed(3);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = confData[teamIndex]["PF"];
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = confData[teamIndex]["PA"];
      tableRow.appendChild(td);

      td = document.createElement("td");
      if (confData[teamIndex]["PD"] == 0) {
        td.innerHTML = confData[teamIndex]["PD"];
        addClass(td, "positive-pd");
      } else if (confData[teamIndex]["PD"] > 0) {
        td.innerHTML = "+" + confData[teamIndex]["PD"];
        addClass(td, "positive-pd");
      } else {
        td.innerHTML = confData[teamIndex]["PD"];
        addClass(td, "negative-pd");
      }

      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = confData[teamIndex]["CombinedLeagueRank"];
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = confData[teamIndex]["CombinedConferenceRank"];
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    standingsTable.appendChild(tbody);
    standingsTableContainer.appendChild(standingsTable);
    ConfStandingContainer.appendChild(standingsTableContainer);
    standingContainer.appendChild(ConfStandingContainer);
  }
}

function creatCombinedRankingDesignHeader() {
  var combinedRankingContainer = document.createElement("div");
  addClass(combinedRankingContainer, "standings-combined-ranking-container");

  var combinedRankingText = document.createElement("div");
  addClass(combinedRankingText, "standings-combined-ranking-text");
  combinedRankingText.innerHTML = "COMBINED RANKING";
  combinedRankingContainer.appendChild(combinedRankingText);

  var combinedRankingLine = document.createElement("div");
  addClass(combinedRankingLine, "standings-combined-ranking-line");
  combinedRankingContainer.appendChild(combinedRankingLine);

  var combineRankingCategoryContainer = document.createElement("div");
  addClass(
    combineRankingCategoryContainer,
    "standings-combined-ranking-category-container"
  );

  var combineRankingCategoryName = document.createElement("span");
  addClass(
    combineRankingCategoryName,
    "standings-combined-ranking-category-name"
  );
  combineRankingCategoryName.innerHTML = "LEAGUE";
  combineRankingCategoryContainer.appendChild(combineRankingCategoryName);

  var combineRankingCategoryName = document.createElement("span");
  addClass(
    combineRankingCategoryName,
    "standings-combined-ranking-category-name"
  );
  combineRankingCategoryName.innerHTML = "CONF.";
  combineRankingCategoryContainer.appendChild(combineRankingCategoryName);

  combinedRankingContainer.appendChild(combineRankingCategoryContainer);

  return combinedRankingContainer;
}

function showDivisionStandingsData() {
  var standingContainer = $(".division-standings");

  removeAllChild(standingContainer);

  var divisionDataSequence = [
    "AFC E",
    "AFC N",
    "AFC S",
    "AFC W",
    "NFC E",
    "NFC N",
    "NFC S",
    "NFC W",
  ];

  if (IS_DESKTOP) {
    divisionDataSequence = [
      "AFC E",
      "NFC E",
      "AFC N",
      "NFC N",
      "AFC S",
      "NFC S",
      "AFC W",
      "NFC W",
    ];
  }

  for (
    var sequenceIndex = 0; sequenceIndex < divisionDataSequence.length; sequenceIndex++
  ) {
    var division = divisionDataSequence[sequenceIndex];
    var DivStandingContainer = document.createElement("div");
    var divStandingType = document.createElement("span");
    addClass(divStandingType, "standings-header-text");
    divStandingType.innerHTML = abbrDict[division];
    DivStandingContainer.appendChild(divStandingType);

    var divData = divisionData[division];

    var standingsTableContainer = document.createElement("div");
    addClass(standingsTableContainer, "standings-table-container");
    var standingsTable = document.createElement("table");

    var tableHeader = [
      "#",
      "TEAM",
      "REC",
      "DIV",
      "CONF",
      "SOS",
      "SOV",
      "PF",
      "PA",
      "PD",
      "CR. L",
      "CR. C",
    ];

    var thead = document.createElement("thead");
    var tableRow = document.createElement("tr");

    for (
      var tableHeaderIndex = 0; tableHeaderIndex < tableHeader.length - 2; tableHeaderIndex++
    ) {
      var tableHeaderEl = document.createElement("th");
      tableHeaderEl.innerHTML = tableHeader[tableHeaderIndex];
      tableRow.appendChild(tableHeaderEl);
    }

    var tableHeaderEl = document.createElement("th");
    addClass(tableHeaderEl, "combined-ranking-table-header");
    tableHeaderEl.setAttribute("colspan", 2);

    tableHeaderEl.appendChild(creatCombinedRankingDesignHeader());
    tableRow.appendChild(tableHeaderEl);

    thead.appendChild(tableRow);
    standingsTable.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var teamIndex = 0; teamIndex < divData.length; teamIndex++) {
      tableRow = document.createElement("tr");
      if (teamIndex % 2) {
        addClass(tableRow, "dark-background-row");
      } else {
        addClass(tableRow, "light-background-row");
      }

      var td = document.createElement("td");
      td.innerHTML = teamIndex + 1;
      tableRow.appendChild(td);

      td = document.createElement("td");
      addClass(td, "standings-team-container-td");

      var standingsTeamContainer = document.createElement("div");
      addClass(standingsTeamContainer, "standings-team-container");
      var standingsTeamLogo = document.createElement("img");
      addClass(standingsTeamLogo, "standings-team-logo");
      standingsTeamLogo.setAttribute(
        "src",
        teamsData[divData[teamIndex]["Team"]]["logo"]
      );
      standingsTeamLogo.setAttribute(
        "alt",
        divData[teamIndex]["Team"]
      );
      standingsTeamLogo.setAttribute("width", "18px");
      standingsTeamLogo.setAttribute("height", "12px");
      standingsTeamLogo.setAttribute("crossorigin", "anonymous");
      standingsTeamContainer.appendChild(standingsTeamLogo);

      var standingsTeamName = document.createElement("span");
      addClass(standingsTeamName, "standings-team-name");
      standingsTeamName.innerHTML = divData[teamIndex]["Team"];
      standingsTeamContainer.appendChild(standingsTeamName);

      if (teamsData[divData[teamIndex]["Team"]]["Playoff Status"]) {
        var playoffStatusText = document.createElement("span");
        addClass(playoffStatusText, "playoff-status-text");
        playoffStatusText.innerHTML = teamsData[divData[teamIndex]["Team"]]["Playoff Status"];
        standingsTeamContainer.appendChild(playoffStatusText);
      }

      td.appendChild(standingsTeamContainer);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = generateWinLoseTieTextForStandings(
        divData[teamIndex]["Team"]
      );
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = generateDivWinLoseTieText(divData[teamIndex]["Team"]);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = generateConfWinLoseTieText(divData[teamIndex]["Team"]);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = divData[teamIndex]["SOS"].toFixed(3);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = divData[teamIndex]["SOV"].toFixed(3);
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = divData[teamIndex]["PF"];
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = divData[teamIndex]["PA"];
      tableRow.appendChild(td);

      td = document.createElement("td");
      if (divData[teamIndex]["PD"] == 0) {
        td.innerHTML = divData[teamIndex]["PD"];
        addClass(td, "positive-pd");
      } else if (divData[teamIndex]["PD"] > 0) {
        td.innerHTML = "+" + divData[teamIndex]["PD"];
        addClass(td, "positive-pd");
      } else {
        td.innerHTML = divData[teamIndex]["PD"];
        addClass(td, "negative-pd");
      }
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = divData[teamIndex]["CombinedLeagueRank"];
      tableRow.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = divData[teamIndex]["CombinedConferenceRank"];
      tableRow.appendChild(td);

      tbody.appendChild(tableRow);
    }

    standingsTable.appendChild(tbody);
    standingsTableContainer.appendChild(standingsTable);
    DivStandingContainer.appendChild(standingsTableContainer);
    standingContainer.appendChild(DivStandingContainer);
  }
}

function setConferenceStandingsData() {
  conferenceData = {};
  for (var teamData of Object.values(teamsData)) {
    var conference = teamData["Conference"];
    conferenceData[conference] = (conferenceData[conference] || []).concat(
      teamData
    );
  }
}

function setDivisionStandingsData() {
  divisionData = {};

  for (var teamData of Object.values(teamsData)) {
    var division = teamData["Division"];
    divisionData[division] = (divisionData[division] || []).concat(teamData);
  }
}

function setLeagueStandingsData() {
  leagueData = [];

  for (var teamData of Object.values(teamsData)) {
    leagueData.push(teamData);
  }
}

function updateCombinedRankingData() {
  var dataToRank = leagueData;

  var rankedDataLeaguePA = dataToRank.map(function (league, index, array) {
    var rank = 1;
    for (var i = 0; i < array.length; i++) {
      if (array[i].PA < league.PA) {
        rank++;
      }
    }
    return Object.assign({}, league, { rank: rank });
  });

  var rankedDataLeaguePF = dataToRank.map(function (league, index, array) {
    var rank = 1;
    for (var i = 0; i < array.length; i++) {
      if (array[i].PF > league.PF) {
        rank++;
      }
    }
    return Object.assign({}, league, { rank: rank });
  });

  var rankedDataConfPA = [];
  var rankedDataConfPF = [];

  for (var conf in conferenceData) {
    var dataToRank = conferenceData[conf];

    var signleRankedDataConfPA = dataToRank.map(function (
      conference,
      index,
      array
    ) {
      var rank = 1;
      for (var i = 0; i < array.length; i++) {
        if (array[i].PA < conference.PA) {
          rank++;
        }
      }
      return Object.assign({}, conference, { rank: rank });
    });

    rankedDataConfPA[conf] = signleRankedDataConfPA;

    var singleRankedDataConfPF = dataToRank.map(function (
      conference,
      index,
      array
    ) {
      var rank = 1;
      for (var i = 0; i < array.length; i++) {
        if (array[i].PF > conference.PF) {
          rank++;
        }
      }
      return Object.assign({}, conference, { rank: rank });
    });

    rankedDataConfPF[conf] = singleRankedDataConfPF;
  }

  leagueData.forEach((leagueTeamData) => {
    var teamName = leagueTeamData["Team"];
    var confName = leagueTeamData["Conference"];

    var indexOfConfPA = rankedDataConfPA[confName].findIndex(
      (obj) => obj["Team"] === teamName
    );
    var indexOfConfPF = rankedDataConfPF[confName].findIndex(
      (obj) => obj["Team"] === teamName
    );

    leagueTeamData["CombinedConferenceRank"] =
      rankedDataConfPA[confName][indexOfConfPA]["rank"] +
      rankedDataConfPF[confName][indexOfConfPF]["rank"];

    var indexOfLeaguePA = rankedDataLeaguePA.findIndex(
      (obj) => obj["Team"] === teamName
    );
    var indexOfLeaguePF = rankedDataLeaguePF.findIndex(
      (obj) => obj["Team"] === teamName
    );

    leagueTeamData["CombinedLeagueRank"] =
      rankedDataLeaguePA[indexOfLeaguePA]["rank"] +
      rankedDataLeaguePF[indexOfLeaguePF]["rank"];
  });
}

function sortLeagueData() {
  var leagueDataSorted = leagueData.slice();
  leagueDataSorted.sort(function (a, b) {
    if (a["Wins"] === b["Wins"]) {
      if (a["Ties"] === b["Ties"]) {
        if (a["Losses"] === b["Losses"]) {
          return a["CombinedLeagueRank"] - b["CombinedLeagueRank"];
        } else {
          return a["Losses"] - b["Losses"];
        }
      } else {
        return b["Ties"] - a["Ties"];
      }
    } else {
      return b["Wins"] - a["Wins"];
    }
  });
  leagueData = leagueDataSorted;
}

function conferenceTieBreaker(teamA, teamB) {
  var teamAwon = 0;
  var teamBwon = 0;
  var commonGamesObject = {};
  var teamAplayedWith = [];
  var teamBplayedWith = [];

  weekMatchesData.forEach((matchData) => {
    if (matchData["Winner"] && matchData["Winner"] != "TIE") {
      if (
        (matchData["Home"] == teamA && matchData["Away"] == teamB) ||
        (matchData["Away"] == teamA && matchData["Home"] == teamB)
      ) {
        if (matchData["Winner"] == teamA) {
          teamAwon++;
        } else {
          teamBwon++;
        }
      }
    }

    if (matchData["Winner"]) {
      if (matchData["Home"] == teamA && matchData["Away"] != teamB) {
        teamAplayedWith.push(matchData["Away"]);
      } else if (matchData["Away"] == teamA && matchData["Home"] != teamB) {
        teamAplayedWith.push(matchData["Home"]);
      }

      if (matchData["Home"] == teamB && matchData["Away"] != teamA) {
        teamBplayedWith.push(matchData["Away"]);
      } else if (matchData["Away"] == teamB && matchData["Home"] != teamA) {
        teamBplayedWith.push(matchData["Home"]);
      }
    }
  });

  var commonTeamsPlayedWith = teamAplayedWith.filter((value) =>
    teamBplayedWith.includes(value)
  );

  var commonGamesRecord = {
    teamAWins: 0,
    teamALosses: 0,
    teamATies: 0,
    teamATotalGames: 0,
    teamBWins: 0,
    teamBTies: 0,
    teamBLosses: 0,
    teamBTotalGames: 0,
  };

  weekMatchesData.forEach((matchData) => {
    if (matchData["Winner"]) {
      if (
        matchData["Home"] == teamA &&
        commonTeamsPlayedWith.includes(matchData["Away"])
      ) {
        commonGamesRecord["teamATotalGames"]++;
        if (matchData["Winner"] == teamA) commonGamesRecord["teamAWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamATies"]++;
        else commonGamesRecord["teamALosses"]++;
      } else if (
        matchData["Away"] == teamA &&
        commonTeamsPlayedWith.includes(matchData["Home"])
      ) {
        commonGamesRecord["teamATotalGames"]++;
        if (matchData["Winner"] == teamA) commonGamesRecord["teamAWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamATies"]++;
        else commonGamesRecord["teamALosses"]++;
      }

      if (
        matchData["Home"] == teamB &&
        commonTeamsPlayedWith.includes(matchData["Away"])
      ) {
        commonGamesRecord["teamBTotalGames"]++;
        if (matchData["Winner"] == teamB) commonGamesRecord["teamBWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamBTies"]++;
        else commonGamesRecord["teamBLosses"]++;
      } else if (
        matchData["Away"] == teamB &&
        commonTeamsPlayedWith.includes(matchData["Home"])
      ) {
        commonGamesRecord["teamBTotalGames"]++;
        if (matchData["Winner"] == teamB) commonGamesRecord["teamBWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamBTies"]++;
        else commonGamesRecord["teamBLosses"]++;
      }
    }
  });

  if (commonGamesRecord["teamATotalGames"]) {
    commonGamesRecord["teamAWin%"] =
      (commonGamesRecord["teamAWins"] + commonGamesRecord["teamATies"] / 2) /
      commonGamesRecord["teamATotalGames"];
  } else {
    commonGamesRecord["teamAWin%"] = 0;
  }

  if (commonGamesRecord["teamBTotalGames"]) {
    commonGamesRecord["teamBWin%"] =
      (commonGamesRecord["teamBWins"] + commonGamesRecord["teamBTies"] / 2) /
      commonGamesRecord["teamBTotalGames"];
  } else {
    commonGamesRecord["teamBWin%"] = 0;
  }

  var teamAData = teamsData[teamA];
  var teamBData = teamsData[teamB];

  if (
    teamsData[teamA]["ConferenceCounts"]["Winning %"] ==
    teamsData[teamB]["ConferenceCounts"]["Winning %"]
  ) {
    if (
      commonTeamsPlayedWith.length < 4 ||
      commonGamesRecord["teamBWin%"] == commonGamesRecord["teamAWin%"]
    ) {
      return teamAData["SOV"] == teamBData["SOV"] ?
        teamAData["SOS"] == teamBData["SOS"] ?
          teamAData["CombinedConferenceRank"] ==
            teamBData["CombinedConferenceRank"] ?
            teamAData["CombinedLeagueRank"] -
            teamBData["CombinedLeagueRank"] :
            teamAData["CombinedConferenceRank"] -
            teamBData["CombinedConferenceRank"] :
          teamBData["SOS"] - teamAData["SOS"] :
        teamBData["SOV"] - teamAData["SOV"];
    } else {
      return commonGamesRecord["teamBWin%"] - commonGamesRecord["teamAWin%"];
    }
  } else {
    return (
      teamsData[teamB]["ConferenceCounts"]["Winning %"] -
      teamsData[teamA]["ConferenceCounts"]["Winning %"]
    );
  }
}

function divisionTieBreaker(teamA, teamB) {
  var teamAwon = 0;
  var teamBwon = 0;
  var teamAplayedWith = [];
  var teamBplayedWith = [];

  weekMatchesData.forEach((matchData) => {
    if (matchData["Winner"] && matchData["Winner"] != "TIE") {
      if (
        (matchData["Home"] == teamA && matchData["Away"] == teamB) ||
        (matchData["Away"] == teamA && matchData["Home"] == teamB)
      ) {
        if (matchData["Winner"] == teamA) {
          teamAwon++;
        } else {
          teamBwon++;
        }
      }
    }

    if (matchData["Winner"]) {
      if (matchData["Home"] == teamA && matchData["Away"] != teamB) {
        teamAplayedWith.push(matchData["Away"]);
      } else if (matchData["Away"] == teamA && matchData["Home"] != teamB) {
        teamAplayedWith.push(matchData["Home"]);
      }

      if (matchData["Home"] == teamB && matchData["Away"] != teamA) {
        teamBplayedWith.push(matchData["Away"]);
      } else if (matchData["Away"] == teamB && matchData["Home"] != teamA) {
        teamBplayedWith.push(matchData["Home"]);
      }
    }
  });

  if (teamAwon !== teamBwon) {
    return teamBwon - teamAwon;
  }

  var commonTeamsPlayedWith = teamAplayedWith.filter((value) =>
    teamBplayedWith.includes(value)
  );

  var commonGamesRecord = {
    teamAWins: 0,
    teamALosses: 0,
    teamATies: 0,
    teamATotalGames: 0,
    teamBWins: 0,
    teamBTies: 0,
    teamBLosses: 0,
    teamBTotalGames: 0,
  };

  weekMatchesData.forEach((matchData) => {
    if (matchData["Winner"]) {
      if (
        matchData["Home"] == teamA &&
        commonTeamsPlayedWith.includes(matchData["Away"])
      ) {
        commonGamesRecord["teamATotalGames"]++;
        if (matchData["Winner"] == teamA) commonGamesRecord["teamAWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamATies"]++;
        else commonGamesRecord["teamALosses"]++;
      } else if (
        matchData["Away"] == teamA &&
        commonTeamsPlayedWith.includes(matchData["Home"])
      ) {
        commonGamesRecord["teamATotalGames"]++;
        if (matchData["Winner"] == teamA) commonGamesRecord["teamAWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamATies"]++;
        else commonGamesRecord["teamALosses"]++;
      }

      if (
        matchData["Home"] == teamB &&
        commonTeamsPlayedWith.includes(matchData["Away"])
      ) {
        commonGamesRecord["teamBTotalGames"]++;
        if (matchData["Winner"] == teamB) commonGamesRecord["teamBWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamBTies"]++;
        else commonGamesRecord["teamBLosses"]++;
      } else if (
        matchData["Away"] == teamB &&
        commonTeamsPlayedWith.includes(matchData["Home"])
      ) {
        commonGamesRecord["teamBTotalGames"]++;
        if (matchData["Winner"] == teamB) commonGamesRecord["teamBWins"]++;
        else if (matchData["Winner"] == "TIES")
          commonGamesRecord["teamBTies"]++;
        else commonGamesRecord["teamBLosses"]++;
      }
    }
  });

  if (commonGamesRecord["teamATotalGames"]) {
    commonGamesRecord["teamAWin%"] =
      (commonGamesRecord["teamAWins"] + commonGamesRecord["teamATies"] / 2) /
      commonGamesRecord["teamATotalGames"];
  } else {
    commonGamesRecord["teamAWin%"] = 0;
  }

  if (commonGamesRecord["teamBTotalGames"]) {
    commonGamesRecord["teamBWin%"] =
      (commonGamesRecord["teamBWins"] + commonGamesRecord["teamBTies"] / 2) /
      commonGamesRecord["teamBTotalGames"];
  } else {
    commonGamesRecord["teamBWin%"] = 0;
  }

  var teamAData = teamsData[teamA];
  var teamBData = teamsData[teamB];

  if (
    teamsData[teamA]["DivisionCounts"]["Winning %"] ==
    teamsData[teamB]["DivisionCounts"]["Winning %"]
  ) {
    if (
      commonGamesRecord["teamBWin%"] == commonGamesRecord["teamAWin%"]
    ) {
      if (
        teamsData[teamA]["ConferenceCounts"]["Winning %"] ==
        teamsData[teamB]["ConferenceCounts"]["Winning %"]
      ) {
        return teamAData["SOV"] == teamBData["SOV"] ?
          teamAData["SOS"] == teamBData["SOS"] ?
            teamAData["CombinedConferenceRank"] ==
              teamBData["CombinedConferenceRank"] ?
              teamAData["CombinedLeagueRank"] -
              teamBData["CombinedLeagueRank"] :
              teamAData["CombinedConferenceRank"] -
              teamBData["CombinedConferenceRank"] :
            teamBData["SOS"] - teamAData["SOS"] :
          teamBData["SOV"] - teamAData["SOV"];
      } else {
        return (
          teamsData[teamB]["ConferenceCounts"]["Winning %"] -
          teamsData[teamA]["ConferenceCounts"]["Winning %"]
        );
      }
    } else {
      return commonGamesRecord["teamBWin%"] - commonGamesRecord["teamAWin%"];
    }
  } else {
    return (
      teamsData[teamB]["DivisionCounts"]["Winning %"] -
      teamsData[teamA]["DivisionCounts"]["Winning %"]
    );
  }
}

function getTopFourOfConference(conference) {
  var top4TeamsList = [];
  for (var division in divisionData) {
    if (division.includes(conference)) {
      top4TeamsList.push(divisionData[division][0]);
    }
  }
  return top4TeamsList;
}

function breakWithSameWinRec(teamList) {
  var rankMap = {};

  teamList.forEach(function (obj) {
    if (!rankMap[obj["Winning %"]]) {
      rankMap[obj["Winning %"]] = [];
    }
    rankMap[obj["Winning %"]].push(obj);
  });

  var sortedByREC = Object.keys(rankMap)
    .sort(function (a, b) {
      return b - a;
    })
    .map(function (key) {
      return rankMap[key];
    });

  return sortedByREC;
}

function breakWithDivisionRanking(teamList) {
  var rankMap = {};

  teamList.forEach(function (obj) {
    if (!rankMap[obj["Division"]]) {
      rankMap[obj["Division"]] = [];
    }
    rankMap[obj["Division"]].push(obj);
  });

  var divisionWinners = [];
  var divisionMiddle = [];
  var divisionLosers = [];

  for (var divisionKey in rankMap) {
    rankMap[divisionKey].sort(function (a, b) {
      var divIndexOfA = divisionData[divisionKey].findIndex(
        (obj) => obj["Team"] === a["Team"]
      );
      var divIndexOfB = divisionData[divisionKey].findIndex(
        (obj) => obj["Team"] === b["Team"]
      );
      return divIndexOfA - divIndexOfB;
    });

    divisionWinners.push(rankMap[divisionKey][0]);
    if (rankMap[divisionKey].length > 1) {
      divisionLosers.push(
        rankMap[divisionKey][rankMap[divisionKey].length - 1]
      );
    }

    if (rankMap[divisionKey].length > 2) {
      for (
        var teamIndexRankMap = 1; teamIndexRankMap < rankMap[divisionKey].length - 1; teamIndexRankMap++
      ) {
        divisionMiddle.push(rankMap[divisionKey][teamIndexRankMap]);
      }
    }
  }

  var divisionBreakedData = [];

  if (divisionWinners.length > 0) {
    divisionBreakedData.push(divisionWinners);
  }
  if (divisionMiddle.length > 0) {
    divisionBreakedData.push(divisionMiddle);
  }
  if (divisionLosers.length > 0) {
    divisionBreakedData.push(divisionLosers);
  }

  return divisionBreakedData;
}

function breakWithDivisionRec(teamList) {
  var rankMap = {};

  teamList.forEach(function (obj) {
    if (!rankMap[obj["DivisionCounts"]["Winning %"]]) {
      rankMap[obj["DivisionCounts"]["Winning %"]] = [];
    }
    rankMap[obj["DivisionCounts"]["Winning %"]].push(obj);
  });

  var maxOfDivisonRec = 0;
  var divisionWinningRecList = Object.keys(rankMap);

  for (var recListIndex = 0; recListIndex < divisionWinningRecList.length; recListIndex++) {
    maxOfDivisonRec = Math.max(maxOfDivisonRec, Number(divisionWinningRecList[recListIndex]));
  }

  return rankMap[maxOfDivisonRec];
}

function sortDivisionData() {
  for (var division in divisionData) {
    var divisionList = breakWithSameWinRec(divisionData[division]);

    var breakedHeadToHeadData = [];

    for (var listIndex in divisionList) {
      if (divisionList[listIndex].length == 1) {
        breakedHeadToHeadData.push(divisionList[listIndex]);
      } else {
        breakedHeadToHeadData.push(
          multiWayTieBreakerDivision(divisionList[listIndex])
        );
      }
    }

    var finalSortedData = [];

    for (var headListIndex in breakedHeadToHeadData) {
      if (
        breakedHeadToHeadData[headListIndex].length == 1 &&
        !Array.isArray(breakedHeadToHeadData[headListIndex][0])
      ) {
        finalSortedData.push(breakedHeadToHeadData[headListIndex]);
      } else {
        for (
          var headBreakedListIndex = 0; headBreakedListIndex < breakedHeadToHeadData[headListIndex]
            .length; headBreakedListIndex++
        ) {
          if (
            breakedHeadToHeadData[headListIndex][headBreakedListIndex]
              .length == 1
          ) {
            finalSortedData.push(
              breakedHeadToHeadData[headListIndex][headBreakedListIndex]
            );
          } else if (
            breakedHeadToHeadData[headListIndex][headBreakedListIndex]
              .length > 1
          ) {
            breakedHeadToHeadData[headListIndex][headBreakedListIndex] =
              breakedHeadToHeadData[headListIndex][headBreakedListIndex].sort(
                function (a, b) {
                  return divisionTieBreaker(a["Team"], b["Team"]);
                }
              );
            finalSortedData.push(
              breakedHeadToHeadData[headListIndex][headBreakedListIndex]
            );
          }
        }
      }
    }

    var finalFormattedConferenceData = [];

    for (
      var finalSortedDataIndex = 0; finalSortedDataIndex < finalSortedData.length; finalSortedDataIndex++
    ) {
      finalFormattedConferenceData = finalFormattedConferenceData.concat(
        finalSortedData[finalSortedDataIndex]
      );
    }
    divisionData[division] = finalFormattedConferenceData;
  }
}

function decideTieBreakerWinner(divisionBreakedTeam) {
  var breakedHeadToHeadData = [];

  breakedHeadToHeadData = breakWithHeadToHead(divisionBreakedTeam);

  if (breakedHeadToHeadData.length >= 2) {
    if (breakedHeadToHeadData[0].length == 1) {
      return breakedHeadToHeadData[0][0];
    }
  }

  var headToHeadBreakedData = breakedHeadToHeadData[0];

  var confRecBreakedData = breakWithConfRec(headToHeadBreakedData);

  if (confRecBreakedData.length == 1) {
    return confRecBreakedData[0];
  } else if (confRecBreakedData.length < headToHeadBreakedData.length) {
    return decideTieBreakerWinner(confRecBreakedData);
  }

  var tieBreakerDataToSort = confRecBreakedData;

  tieBreakerDataToSort.sort(
    function (a, b) {
      return conferenceTieBreaker(a["Team"], b["Team"]);
    }
  );

  return tieBreakerDataToSort[0];
}

function decideTieBreakerWinnerDivison(divisionBreakedTeam) {
  var breakedHeadToHeadData = [];

  breakedHeadToHeadData = breakWithHeadToHead(divisionBreakedTeam);

  if (breakedHeadToHeadData.length >= 2) {
    if (breakedHeadToHeadData[0].length == 1) {
      return breakedHeadToHeadData[0][0];
    }
  }

  var tieBreakerDataToSort = breakedHeadToHeadData[0];

  var breakedTieBreakerWithDivision = breakWithDivisionRec(tieBreakerDataToSort);

  if (breakedTieBreakerWithDivision.length == 1) {
    return breakedTieBreakerWithDivision[0];
  }

  breakedTieBreakerWithDivision.sort(
    function (a, b) {
      return divisionTieBreaker(a["Team"], b["Team"]);
    }
  );

  return breakedTieBreakerWithDivision[0];
}

function breakWithConfRec(teamListToBreak) {
  var maxConfRec = 0;
  teamListToBreak.forEach(function (obj) {
    if (obj["ConferenceCounts"]["Winning %"] > maxConfRec) {
      maxConfRec = obj["ConferenceCounts"]["Winning %"];
    }
  });
  var teamsWithMaxConfRec = teamListToBreak.filter(function (obj) {
    return obj["ConferenceCounts"]["Winning %"] === maxConfRec;
  });
  return teamsWithMaxConfRec;
}

function multiWayTieBreakerDivision(tieBreakerTeamList) {
  var noOfIteration = tieBreakerTeamList.length;
  var tieBreakerSortedData = [];

  for (var iteration = 0; iteration < noOfIteration; iteration++) {
    var tieBreakerWinner = decideTieBreakerWinnerDivison(tieBreakerTeamList);
    tieBreakerSortedData.push([tieBreakerWinner]);
    if (tieBreakerTeamList.length) {
      tieBreakerTeamList = tieBreakerTeamList.filter(function (obj) {
        return obj["Team"] !== tieBreakerWinner["Team"];
      });
    }
  }

  return tieBreakerSortedData;
}

function multiWayTieBreaker(tieBreakerTeamList) {
  var noOfIteration = tieBreakerTeamList.length;
  var tieBreakerSortedData = [];

  for (var iteration = 0; iteration < noOfIteration; iteration++) {
    var breakedTieBreakerWithDivision = breakWithDivisionRanking(tieBreakerTeamList);
    var tieBreakerWinner = decideTieBreakerWinner(breakedTieBreakerWithDivision[0]);
    tieBreakerSortedData.push([tieBreakerWinner]);
    if (tieBreakerTeamList.length) {
      tieBreakerTeamList = tieBreakerTeamList.filter(obj => obj["Team"] !== tieBreakerWinner["Team"]);
    }
  }

  return tieBreakerSortedData;
}

function sortConferenceData() {
  for (var conference in conferenceData) {
    var topFourTeamsOfConference = getTopFourOfConference(conference);
    var otherTeamsOfConference = conferenceData[conference].filter(function (
      teamData
    ) {
      for (
        var topTeamsIndex = 0; topTeamsIndex < topFourTeamsOfConference.length; topTeamsIndex++
      ) {
        if (
          topFourTeamsOfConference[topTeamsIndex]["Team"] == teamData["Team"]
        )
          return false;
      }
      return true;
    });

    topFourTeamsOfConference = breakWithSameWinRec(topFourTeamsOfConference);
    otherTeamsOfConference = breakWithSameWinRec(otherTeamsOfConference);

    var conferenceList = topFourTeamsOfConference.concat(
      otherTeamsOfConference
    );

    var updatedConferenceList = [];

    for (var listIndex in conferenceList) {
      if (conferenceList[listIndex].length == 1) {
        updatedConferenceList.push(conferenceList[listIndex]);
      } else {
        updatedConferenceList.push(
          multiWayTieBreaker(conferenceList[listIndex])
        );
      }
    }

    var breakedHeadToHeadData = [];

    for (var listIndex in updatedConferenceList) {
      if (conferenceList[listIndex].length == 1) {
        breakedHeadToHeadData.push(updatedConferenceList[listIndex]);
      } else {
        for (
          var divisionBreakedlistIndex = 0; divisionBreakedlistIndex < updatedConferenceList[listIndex]
            .length; divisionBreakedlistIndex++
        ) {
          if (
            updatedConferenceList[listIndex][divisionBreakedlistIndex]
              .length == 1
          ) {
            breakedHeadToHeadData.push(
              updatedConferenceList[listIndex][divisionBreakedlistIndex]
            );
          } else if (
            updatedConferenceList[listIndex][divisionBreakedlistIndex]
              .length > 1
          ) {
            breakedHeadToHeadData.push(
              breakWithHeadToHead(
                updatedConferenceList[listIndex][divisionBreakedlistIndex]
              )
            );
          }
        }
      }
    }

    var finalSortedData = [];

    for (var headListIndex in breakedHeadToHeadData) {
      if (
        breakedHeadToHeadData[headListIndex].length == 1 &&
        !Array.isArray(breakedHeadToHeadData[headListIndex][0])
      ) {
        finalSortedData.push(breakedHeadToHeadData[headListIndex]);
      } else {
        for (
          var headBreakedListIndex = 0; headBreakedListIndex < breakedHeadToHeadData[headListIndex]
            .length; headBreakedListIndex++
        ) {
          if (
            breakedHeadToHeadData[headListIndex][headBreakedListIndex]
              .length == 1
          ) {
            finalSortedData.push(
              breakedHeadToHeadData[headListIndex][headBreakedListIndex]
            );
          } else if (
            breakedHeadToHeadData[headListIndex][headBreakedListIndex]
              .length > 1
          ) {
            breakedHeadToHeadData[headListIndex][headBreakedListIndex] =
              breakedHeadToHeadData[headListIndex][headBreakedListIndex].sort(
                function (a, b) {
                  return conferenceTieBreaker(a["Team"], b["Team"]);
                }
              );
            finalSortedData.push(
              breakedHeadToHeadData[headListIndex][headBreakedListIndex]
            );
          }
        }
      }
    }

    var finalFormattedConferenceData = [];

    for (
      var finalSortedDataIndex = 0; finalSortedDataIndex < finalSortedData.length; finalSortedDataIndex++
    ) {
      finalFormattedConferenceData = finalFormattedConferenceData.concat(
        finalSortedData[finalSortedDataIndex]
      );
    }
    conferenceData[conference] = finalFormattedConferenceData;
  }
}

function breakWithHeadToHead(teamList) {
  var teamWonAllList = [];
  var teamUnpredicted = [];
  var teamLoseAllList = [];

  for (
    var teamListIndex = 0; teamListIndex < teamList.length; teamListIndex++
  ) {
    if (checkAllHeadWon(teamList[teamListIndex], teamList)) {
      teamWonAllList.push(teamList[teamListIndex]);
    } else if (checkAllHeadLose(teamList[teamListIndex], teamList)) {
      teamLoseAllList.push(teamList[teamListIndex]);
    } else {
      teamUnpredicted.push(teamList[teamListIndex]);
    }
  }

  var breakedHeadToHead = [];

  if (teamWonAllList.length > 0) {
    breakedHeadToHead.push(teamWonAllList);
  }

  if (teamUnpredicted.length > 0) {
    breakedHeadToHead.push(teamUnpredicted);
  }

  if (teamLoseAllList.length > 0) {
    breakedHeadToHead.push(teamLoseAllList);
  }

  return breakedHeadToHead;
}

function checkAllHeadWon(teamObj, teamListInHead) {
  var totalWonInHead = 0;
  var totalPlayedInHead = 0;

  for (
    var headTeamListIndex = 0; headTeamListIndex < teamListInHead.length; headTeamListIndex++
  ) {
    if (teamListInHead[headTeamListIndex]["Team"] != teamObj["Team"]) {
      var wonWithThisHead = 0;
      var playedWithThisHead = 0;

      weekMatchesData.forEach((headMatchData) => {
        if (headMatchData["Winner"]) {
          if (
            headMatchData["Home"] == teamObj["Team"] &&
            headMatchData["Away"] == teamListInHead[headTeamListIndex]["Team"]
          ) {
            playedWithThisHead++;
            if (headMatchData["Winner"] == teamObj["Team"]) wonWithThisHead++;
          } else if (
            headMatchData["Away"] == teamObj["Team"] &&
            headMatchData["Home"] == teamListInHead[headTeamListIndex]["Team"]
          ) {
            playedWithThisHead++;
            if (headMatchData["Winner"] == teamObj["Team"]) wonWithThisHead++;
          }
        }
      });

      if (playedWithThisHead == 0) return 0;
      totalWonInHead += wonWithThisHead;
      totalPlayedInHead += playedWithThisHead;
    }
  }
  var headToHeadPerc = (totalWonInHead / totalPlayedInHead) > 0.5;
  if (totalPlayedInHead > 0 && headToHeadPerc) return 1;
  return 0;
}

function checkAllHeadLose(teamObj, teamListInHead) {
  var totalWonInLose = 0;
  var totalPlayedInHead = 0;

  for (
    var headTeamListIndex = 0; headTeamListIndex < teamListInHead.length; headTeamListIndex++
  ) {
    if (teamListInHead[headTeamListIndex]["Team"] != teamObj["Team"]) {
      var loseWithThisHead = 0;
      var playedWithThisHead = 0;

      weekMatchesData.forEach((headMatchData) => {
        if (headMatchData["Winner"]) {
          if (
            headMatchData["Home"] == teamObj["Team"] &&
            headMatchData["Away"] == teamListInHead[headTeamListIndex]["Team"]
          ) {
            playedWithThisHead++;
            if (headMatchData["Winner"] != teamObj["Team"])
              loseWithThisHead++;
          } else if (
            headMatchData["Away"] == teamObj["Team"] &&
            headMatchData["Home"] == teamListInHead[headTeamListIndex]["Team"]
          ) {
            playedWithThisHead++;
            if (headMatchData["Winner"] != teamObj["Team"])
              loseWithThisHead++;
          }
        }
      });

      if (playedWithThisHead == 0) return 0;
      totalWonInLose += loseWithThisHead;
      totalPlayedInHead += playedWithThisHead;
    }
  }

  if (totalPlayedInHead > 0 && totalPlayedInHead == totalWonInLose) return 1;
  return 0;
}

function showStandingsSection(e) {
  var standingsSection = $(".standings-draftOrder-copy .standings-section-wrapper");
  var draftOrderSection = $(".standings-draftOrder-copy .draft-order-section-wrapper");

  var standingsToggleButton = $(".standings-draftOrder-copy .standings-section-toggle-btn");
  var draftOrderToggleButton = $(".standings-draftOrder-copy .draft-order-section-toggle-btn");

  if (standingsToggleButton && !hasClass(standingsToggleButton, "selected")) {
    addClass(standingsToggleButton, "selected");
  }

  if (
    draftOrderToggleButton &&
    hasClass(draftOrderToggleButton, "selected")
  ) {
    removeClass(draftOrderToggleButton, "selected");
  }

  if (standingsSection && hasClass(standingsSection, "hidden")) {
    removeClass(standingsSection, "hidden");
  }

  if (draftOrderSection && !hasClass(draftOrderSection, "hidden")) {
    addClass(draftOrderSection, "hidden");
  }
}

function showDraftOrderSection() {
  var standingsSection = $(".standings-draftOrder-copy .standings-section-wrapper");
  var draftOrderSection = $(".standings-draftOrder-copy .draft-order-section-wrapper");

  var standingsToggleButton = $(".standings-draftOrder-copy .standings-section-toggle-btn");
  var draftOrderToggleButton = $(".standings-draftOrder-copy .draft-order-section-toggle-btn");

  if (hasClass(draftOrderToggleButton, "disabled")) return;

  if (standingsToggleButton && hasClass(standingsToggleButton, "selected")) {
    removeClass(standingsToggleButton, "selected");
  }

  if (
    draftOrderToggleButton &&
    !hasClass(draftOrderToggleButton, "selected")
  ) {
    addClass(draftOrderToggleButton, "selected");
  }

  if (standingsSection && !hasClass(standingsSection, "hidden")) {
    addClass(standingsSection, "hidden");
  }

  if (draftOrderSection && hasClass(draftOrderSection, "hidden")) {
    removeClass(draftOrderSection, "hidden");
  }
}

function disableDraftOrderSection(shouldDisable = true) {
  var draftOrderToggleButton = $(".draft-order-section-toggle-btn");
  if (shouldDisable) {
    showStandingsSection();
    addClass(draftOrderToggleButton, "disabled");
  } else {
    removeClass(draftOrderToggleButton, "disabled");
  }
}

function updateStickyAdContainerClasses(activePage) {
  var stickyAdContainer = $(".playoff-predictor-bottom-sticky-ad-container #sticky-ad-container");

  if (stickyAdContainer) {
    if (activePage == "simulator-page" && hasClass(stickyAdContainer, "bottom-sticky-container")) {
      removeClass(stickyAdContainer, "bottom-sticky-container");
    } else if (!hasClass(stickyAdContainer, "bottom-sticky-container")) {
      addClass(stickyAdContainer, "bottom-sticky-container");
    }
  }
}

function showStandingsPage() {
  var standingsToggleButton = $(".standings-page-toggle-btn");
  if (hasClass(standingsToggleButton, "selected")) return;

  var standingsPage = $(".standings-page");
  var simulatorPage = $(".simulator-page");
  var draftOrderPage = $(".draft-order-page");
  var simulateToggleButton = $(".simulator-page-toggle-btn");
  var draftOrderToggleButton = $(".draft-order-page-toggle-btn");

  updateStickyAdContainerClasses("standings-page");

  var bottomButtonMenu = $(".sticky-bottom-cta-wrapper");
  if (bottomButtonMenu && !hasClass(bottomButtonMenu, "hidden")) {
    addClass(bottomButtonMenu, "hidden");
  }

  if (playoffMatchesData["Super Bowl"]["winner"] === "") {
    prevSimulationPausedState = pauseSimulatorFlag;
    pauseSimulation();
  }

  var glossaryContainer = $(".glossary-mweb-container");
  if (glossaryContainer && hasClass(glossaryContainer, "hidden")) {
    removeClass(glossaryContainer, "hidden");
  }

  if (!hasClass(standingsToggleButton, "selected")) {
    addClass(standingsToggleButton, "selected");
  }

  if (hasClass(simulateToggleButton, "selected")) {
    removeClass(simulateToggleButton, "selected");
  }

  if (hasClass(draftOrderToggleButton, "selected")) {
    removeClass(draftOrderToggleButton, "selected");
  }

  if (hasClass(standingsPage, "hidden")) {
    removeClass(standingsPage, "hidden");
  }

  if (!hasClass(simulatorPage, "hidden")) {
    addClass(simulatorPage, "hidden");
  }

  if (!hasClass(draftOrderPage, "hidden")) {
    addClass(draftOrderPage, "hidden");
  }
}

function showDraftOrderPage() {
  var draftOrderToggleButton = $(".draft-order-page-toggle-btn");
  if (hasClass(draftOrderToggleButton, "selected")) return;

  var standingsPage = $(".standings-page");
  var simulatorPage = $(".simulator-page");
  var draftOrderPage = $(".draft-order-page");
  var standingsToggleButton = $(".standings-page-toggle-btn");
  var simulateToggleButton = $(".simulator-page-toggle-btn");

  updateStickyAdContainerClasses("draft-order-page");

  var bottomButtonMenu = $(".sticky-bottom-cta-wrapper");
  if (bottomButtonMenu && !hasClass(bottomButtonMenu, "hidden")) {
    addClass(bottomButtonMenu, "hidden");
  }

  if (playoffMatchesData["Super Bowl"]["winner"] === "") {
    prevSimulationPausedState = pauseSimulatorFlag;
    pauseSimulation();
  }

  var glossaryContainer = $(".glossary-mweb-container");
  if (glossaryContainer && hasClass(glossaryContainer, "hidden")) {
    removeClass(glossaryContainer, "hidden");
  }

  if (!hasClass(draftOrderToggleButton, "selected")) {
    addClass(draftOrderToggleButton, "selected");
  }

  if (hasClass(standingsToggleButton, "selected")) {
    removeClass(standingsToggleButton, "selected");
  }

  if (hasClass(simulateToggleButton, "selected")) {
    removeClass(simulateToggleButton, "selected");
  }

  if (hasClass(draftOrderPage, "hidden")) {
    removeClass(draftOrderPage, "hidden");
  }

  if (!hasClass(simulatorPage, "hidden")) {
    addClass(simulatorPage, "hidden");
  }

  if (!hasClass(standingsPage, "hidden")) {
    addClass(standingsPage, "hidden");
  }
}

function showSimulatorPage() {
  var simulateToggleButton = $(".simulator-page-toggle-btn");
  if (hasClass(simulateToggleButton, "selected")) return;

  var standingsPage = $(".standings-page");
  var simulatorPage = $(".simulator-page");
  var draftOrderPage = $(".draft-order-page");
  var standingsToggleButton = $(".standings-page-toggle-btn");
  var draftOrderToggleButton = $(".draft-order-page-toggle-btn");

  updateStickyAdContainerClasses("simulator-page");

  var bottomButtonMenu = $(".sticky-bottom-cta-wrapper");
  if (bottomButtonMenu && hasClass(bottomButtonMenu, "hidden")) {
    removeClass(bottomButtonMenu, "hidden");
  }

  var resumeButton = $(".resume-button");
  if (resumeButton) {
    setTimeout(() => {
      resumeButton.click();
    }, 500);
  }

  var glossaryContainer = $(".glossary-mweb-container");
  if (glossaryContainer && !hasClass(glossaryContainer, "hidden")) {
    addClass(glossaryContainer, "hidden");
  }

  if (hasClass(standingsToggleButton, "selected")) {
    removeClass(standingsToggleButton, "selected");
  }

  if (hasClass(draftOrderToggleButton, "selected")) {
    removeClass(draftOrderToggleButton, "selected");
  }

  if (!hasClass(simulateToggleButton, "selected")) {
    addClass(simulateToggleButton, "selected");
  }

  if (hasClass(simulatorPage, "hidden")) {
    removeClass(simulatorPage, "hidden");
  }

  if (!hasClass(standingsPage, "hidden")) {
    addClass(standingsPage, "hidden");
  }

  if (!hasClass(draftOrderPage, "hidden")) {
    addClass(draftOrderPage, "hidden");
  }
}

function showConferenceStandingsPage() {
  var conferenceStandingsPage = $(".standings-draftOrder-copy .conference-standings");
  var divisionStandingsPage = $(".standings-draftOrder-copy .division-standings");
  var conferenceToggleBtn = $(".standings-draftOrder-copy .conference-toggle-btn");
  var divisionToggleBtn = $(".standings-draftOrder-copy .division-toggle-btn");

  if (!hasClass(conferenceToggleBtn, "selected")) {
    addClass(conferenceToggleBtn, "selected");
  }

  if (hasClass(divisionToggleBtn, "selected")) {
    removeClass(divisionToggleBtn, "selected");
  }

  if (hasClass(conferenceStandingsPage, "hidden")) {
    removeClass(conferenceStandingsPage, "hidden");
  }

  if (!hasClass(divisionStandingsPage, "hidden")) {
    addClass(divisionStandingsPage, "hidden");
  }
}

function showDivisionStandingsPage() {
  var conferenceStandingsPage = $(".standings-draftOrder-copy .conference-standings");
  var divisionStandingsPage = $(".standings-draftOrder-copy .division-standings");
  var conferenceToggleBtn = $(".standings-draftOrder-copy .conference-toggle-btn");
  var divisionToggleBtn = $(".standings-draftOrder-copy .division-toggle-btn");

  if (hasClass(conferenceToggleBtn, "selected")) {
    removeClass(conferenceToggleBtn, "selected");
  }

  if (!hasClass(divisionToggleBtn, "selected")) {
    addClass(divisionToggleBtn, "selected");
  }

  if (!hasClass(conferenceStandingsPage, "hidden")) {
    addClass(conferenceStandingsPage, "hidden");
  }

  if (hasClass(divisionStandingsPage, "hidden")) {
    removeClass(divisionStandingsPage, "hidden");
  }
}

function checkAllMatchCompletion() {
  for (
    var matchIndex = 0; matchIndex < weekMatchesData.length; matchIndex++
  ) {
    if (!weekMatchesData[matchIndex]["Winner"]) {
      return false;
    }
  }
  return true;
}

function closePredictSimulatePopUp(e) {
  var container = $(".predict-simulate-popup-container");

  if (container) {
    container.remove();
  }

  showOverlay(false);
}

function startPredictSimulation() {
  var container = $(".predict-simulate-popup-container");
  if (container) {
    var radioInputs = container.querySelectorAll(
      'input[type="radio"][name="simulate"]'
    );
    var selectedOption;
    radioInputs.forEach((radio) => {
      if (radio.checked) {
        selectedOption = radio.value;
      }
    });
    if (selectedOption) {
      pauseSimulatorFlag = false;
      autoPopupPlayoffPredictorFlag = true;
      scrollToTop();
      disabledSimulateCTA(true);
      if (selectedOption == "option1") {
        simulateMatchesWithAllWeek(0, landingWeek);
      } else if (selectedOption == "option2") {
        simulateMatchesWithCurrentWeek(0, currentWeek);
      } else if (selectedOption == "option3") {
        simulateMatchesFromCurrentWeek(0, currentWeek);
      }

      showSimulationOverLays();
    } else {
    }
  }
  closePredictSimulatePopUp();
}

function closePredictPlayoffGamesPopUp(e) {
  var container = $(".predict-playoff-games-popup-container");

  if (container && !hasClass(container, "hidden")) {
    addClass(container, "hidden");
  }

  showOverlay(false);
  clearTimeout(playoffSimulationTimeoutId);
  removeSimulationOverLays();
  updateSimulationButtonDisableStatus();
  var playoffBtn = document.querySelector(".predictor-playoff-games-button");
  var simBtn = document.querySelector(".simulation-ctas-container .simulate-button");
  var pauseBtn = document.querySelector(".simulation-ctas-container .pause-button");
  var resetBtn = document.querySelector(".simulation-ctas-container .delete-button");
  if (pauseBtn && !hasClass(pauseBtn, "hidden")) {
    addClass(pauseBtn, "hidden");
  }
  if (simBtn && hasClass(simBtn, "hidden")) {
    removeClass(simBtn, "hidden");
  }
  if (playoffBtn) {
    removeClass(playoffBtn, "disabled-button");
    playoffBtn.removeAttribute("disabled");
  }
  if (resetBtn) {
    removeClass(resetBtn, "disabled-button");
    resetBtn.removeAttribute("disabled");
  }
}

function showPredictPlayoffGamesPopup() {
  const superbowlMatch = playoffMatchesData["Super Bowl"];
  const superbowlWinner = superbowlMatch["winner"];

  const predictionsExist = hasPlayoffPredictions();

  if (!predictionsExist) {
    setPlayoffMatchesData();
    setPlayoffPredictorConatainer();
    addPopUpEventListeners();
    setCompletedPlayoffMatchesData();
  }

  var simBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
  var pauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
  var resetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");

  if (simBtn) {
    if (!superbowlWinner) {
      simBtn.removeAttribute("disabled");
    } else {
      simBtn.setAttribute("disabled", "");
    }
    simBtn.classList.remove("hidden");
    simBtn.removeEventListener("click", simulatePlayoffs);
    simBtn.addEventListener("click", simulatePlayoffs);
  }

  if (pauseBtn) {
    pauseBtn.classList.add("hidden");
    pauseBtn.removeEventListener("click", pausePlayoffSimulation);
    pauseBtn.addEventListener("click", pausePlayoffSimulation);
  }

  if (resetBtn) {
    if (superbowlWinner) {
      resetBtn.removeAttribute("disabled");
    } else {
      resetBtn.setAttribute("disabled", "");
    }
    resetBtn.removeEventListener("click", resetPlayoffs);
    resetBtn.addEventListener("click", resetPlayoffs);
  }
}

function pausePlayoffSimulation(e) {
  var simBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
  var pauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
  e.stopPropagation();
  clearTimeout(playoffSimulationTimeoutId);
  playoffSimulationTimeoutId = null;
  simBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
}

function simulatePlayoffs(e) {
  var simBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
  var pauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
  e.stopPropagation();
  simulatePlayoffMatches(false);
  pauseBtn.classList.remove("hidden");
  simBtn.classList.add("hidden");
}

function resetPlayoffs(e) {
  var simBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
  var pauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
  var resetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
  e.stopPropagation();
  clearTimeout(playoffSimulationTimeoutId);
  playoffSimulationTimeoutId = null;
  resetPlayoffPredictions();
  simBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
  simBtn.removeAttribute("disabled");
  resetBtn.setAttribute("disabled", "");

  let continueBtn;
  if (IS_DESKTOP) {
    continueBtn = $(".info-text-continue-btn-container .continue-btn");
  } else {
    continueBtn = $(".simulation-ctas-container .continue-btn");
  }
  if (continueBtn) {
    if (playoffMatchesData["Super Bowl"]["winner"] == "") {
      continueBtn.disabled = true;
    } else {
      continueBtn.disabled = false;
    }
  }
}

function canSimulatePlayoffs() {
  if (!checkAllWeekMatchesCompleted()) return false;
  return hasUnpredictedPlayoffMatches();
}

function hasUnpredictedPlayoffMatches() {
  var conferenceNames = ["AFC", "NFC"];

  // Check wildcard round
  for (var conference of conferenceNames) {
    if (playoffMatchesData[conference] && playoffMatchesData[conference]["Wildcard Round"]) {
      for (var match of playoffMatchesData[conference]["Wildcard Round"]) {
        if (!match.winner) {
          return true;
        }
      }
    }
  }

  // Check divisional playoffs
  for (var conference of conferenceNames) {
    if (playoffMatchesData[conference] && playoffMatchesData[conference]["Divisional Playoffs"]) {
      for (var match of playoffMatchesData[conference]["Divisional Playoffs"]) {
        if (!match.winner) {
          return true;
        }
      }
    }
  }

  // Check conference championships
  for (var conference of conferenceNames) {
    if (playoffMatchesData[conference] && playoffMatchesData[conference]["Conference Championships"]) {
      for (var match of playoffMatchesData[conference]["Conference Championships"]) {
        if (!match.winner) {
          return true;
        }
      }
    }
  }

  // Check Super Bowl
  if (playoffMatchesData["Super Bowl"] && !playoffMatchesData["Super Bowl"]["winner"]) {
    return true;
  }

  return false;
}

function hasPlayoffPredictions() {
  var conferenceNames = ["AFC", "NFC"];

  // Check wildcard round
  for (var conference of conferenceNames) {
    if (playoffMatchesData[conference] && playoffMatchesData[conference]["Wildcard Round"]) {
      for (var match of playoffMatchesData[conference]["Wildcard Round"]) {
        if (match.winner) {
          return true;
        }
      }
    }
  }

  // Check divisional playoffs
  for (var conference of conferenceNames) {
    if (playoffMatchesData[conference] && playoffMatchesData[conference]["Divisional Playoffs"]) {
      for (var match of playoffMatchesData[conference]["Divisional Playoffs"]) {
        if (match.winner) {
          return true;
        }
      }
    }
  }

  // Check conference championships
  for (var conference of conferenceNames) {
    if (playoffMatchesData[conference] && playoffMatchesData[conference]["Conference Championships"]) {
      for (var match of playoffMatchesData[conference]["Conference Championships"]) {
        if (match.winner) {
          return true;
        }
      }
    }
  }

  // Check Super Bowl
  if (playoffMatchesData["Super Bowl"] && playoffMatchesData["Super Bowl"]["winner"]) {
    return true;
  }

  return false;
}

function simulatePlayoffMatches(showPopup = true) {
  function determineCurrentPlayoffStage() {
    for (let conference of conferenceNames) {
      const conferenceMatches = playoffMatchesData[conference];
      const confWCMatches = conferenceMatches["Wildcard Round"];
      if (conferenceMatches && confWCMatches) {
        for (let match of confWCMatches) {
          if (!match.winner) {
            return "wildcard";
          }
        }
      }
    }

    for (let conference of conferenceNames) {
      const conferenceMatches = playoffMatchesData[conference];
      const confDivMatches = conferenceMatches["Divisional Playoffs"];
      if (conferenceMatches && confDivMatches) {
        for (let match of confDivMatches) {
          if (!match.winner) {
            return "divisional";
          }
        }
      }
    }

    for (let conference of conferenceNames) {
      const conferenceMatches = playoffMatchesData[conference];
      const confChampMatches = conferenceMatches["Conference Championships"];
      if (conferenceMatches && confChampMatches) {
        for (let match of confChampMatches) {
          if (!match.winner) {
            return "conference";
          }
        }
      }
    }

    const superBowlMatch = playoffMatchesData["Super Bowl"];
    if (superBowlMatch && !superBowlMatch["winner"]) {
      return "superbowl";
    }

    return "completed";
  }

  function simulateWildcardRound() {
    var wildcardMatches = [];

    conferenceNames.forEach(conference => {
      if (playoffMatchesData[conference] && playoffMatchesData[conference]["Wildcard Round"]) {
        playoffMatchesData[conference]["Wildcard Round"].forEach((match, index) => {
          if (!match.winner) {
            wildcardMatches.push({
              type: "wildcard",
              conference: conference,
              match: match,
              index: index
            });
          }
        });
      }
    });

    simulateMatches(wildcardMatches, 0, () => {
      conferenceNames.forEach(conference => {
        updateDivisionalPlayoffsData(conference);
      });
      simulateDivisionalRound();
    });
  }

  function simulateDivisionalRound() {
    var divisionalMatches = [];

    conferenceNames.forEach(conference => {
      if (playoffMatchesData[conference] && playoffMatchesData[conference]["Divisional Playoffs"]) {
        if (shouldUpdateDivisionalData(conference)) {
          updateDivisionalPlayoffsData(conference);
        }

        playoffMatchesData[conference]["Divisional Playoffs"].forEach((match, index) => {
          if (!match.winner && match.teamA && match.teamB) {
            divisionalMatches.push({
              type: "divisional",
              conference: conference,
              match: match,
              index: index
            });
          }
        });
      }
    });

    simulateMatches(divisionalMatches, 0, () => {
      conferenceNames.forEach(conference => {
        updateConferencePlayoffsData(conference);
      });
      simulateConferenceRound();
    });
  }

  function simulateConferenceRound() {
    var conferenceMatches = [];

    conferenceNames.forEach(conference => {
      if (playoffMatchesData[conference] && playoffMatchesData[conference]["Conference Championships"]) {
        if (shouldUpdateConferenceData(conference)) {
          updateConferencePlayoffsData(conference);
        }

        playoffMatchesData[conference]["Conference Championships"].forEach((match, index) => {
          if (!match.winner && match.teamA && match.teamB) {
            conferenceMatches.push({
              type: "conference",
              conference: conference,
              match: match,
              index: index
            });
          }
        });
      }
    });

    simulateMatches(conferenceMatches, 0, () => {
      conferenceNames.forEach(conference => {
        updateSuperbowlPlayoffsData(conference);
      });
      simulateSuperBowl();
    });
  }

  function simulateSuperBowl() {
    var superBowlMatches = [];

    if (shouldUpdateSuperBowlData()) {
      conferenceNames.forEach(conference => {
        updateSuperbowlPlayoffsData(conference);
      });
    }

    if (playoffMatchesData["Super Bowl"] && !playoffMatchesData["Super Bowl"]["winner"] &&
      playoffMatchesData["Super Bowl"]["teamA"] && playoffMatchesData["Super Bowl"]["teamB"]) {
      superBowlMatches.push({
        type: "superbowl",
        match: playoffMatchesData["Super Bowl"]
      });
    }

    simulateMatches(superBowlMatches, 0, () => {
      playoffSimulationTimeoutId = setTimeout(() => {
        updateDraftOrder();
        if (playoffMatchesData["Super Bowl"]["winner"]) {
          setAfterPlayoffDraft(playoffMatchesData);
          removeSimulationOverLays();
          var playoffBtn = document.querySelector(".predictor-playoff-games-button");
          var simBtn = document.querySelector(".simulation-ctas-container .simulate-button");
          var pauseBtn = document.querySelector(".simulation-ctas-container .pause-button");
          var resetBtn = document.querySelector(".simulation-ctas-container .delete-button");
          var playoffSimBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
          var playoffPauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
          if (pauseBtn && !hasClass(pauseBtn, "hidden")) {
            addClass(pauseBtn, "hidden");
          }
          if (simBtn && hasClass(simBtn, "hidden")) {
            removeClass(simBtn, "hidden");
          }
          if (playoffBtn) {
            removeClass(playoffBtn, "disabled-button");
            playoffBtn.removeAttribute("disabled");
          }
          if (resetBtn) {
            removeClass(resetBtn, "disabled-button");
            resetBtn.removeAttribute("disabled");
          }
          if (playoffSimBtn && playoffPauseBtn) {
            playoffSimBtn.classList.remove("hidden");
            playoffSimBtn.setAttribute("disabled", "");
            playoffPauseBtn.classList.add("hidden");
          }

          let continueBtn;
          if (IS_DESKTOP) {
            continueBtn = $(".info-text-continue-btn-container .continue-btn");
          } else {
            continueBtn = $(".simulation-ctas-container .continue-btn");
          }
          if (continueBtn) {
            if (playoffMatchesData["Super Bowl"]["winner"] == "") {
              continueBtn.disabled = true;
            } else {
              continueBtn.disabled = false;
            }
          }
        }
      }, 150);
    });
  }

  function shouldUpdateDivisionalData(conference) {
    var divisionalMatches = playoffMatchesData[conference]["Divisional Playoffs"];
    var wildcardMatches = playoffMatchesData[conference]["Wildcard Round"];
    var allWildcardComplete = wildcardMatches.every(match => match.winner);
    var divisionalNeedsSetup = divisionalMatches.some(match => !match.teamA || !match.teamB);
    return allWildcardComplete && divisionalNeedsSetup;
  }

  function shouldUpdateConferenceData(conference) {
    var conferenceMatches = playoffMatchesData[conference]["Conference Championships"];
    var divisionalMatches = playoffMatchesData[conference]["Divisional Playoffs"];
    var allDivisionalComplete = divisionalMatches.every(match => match.winner);
    var conferenceNeedsSetup = conferenceMatches.some(match => !match.teamA || !match.teamB);
    return allDivisionalComplete && conferenceNeedsSetup;
  }

  function shouldUpdateSuperBowlData() {
    var superBowlMatch = playoffMatchesData["Super Bowl"];
    var afcChampComplete = playoffMatchesData["AFC"]["Conference Championships"].every(match => match.winner);
    var nfcChampComplete = playoffMatchesData["NFC"]["Conference Championships"].every(match => match.winner);
    var superBowlNeedsSetup = !superBowlMatch.teamA || !superBowlMatch.teamB;
    return afcChampComplete && nfcChampComplete && superBowlNeedsSetup;
  }

  function simulateMatches(matches, matchIndex, callback) {
    var playoffResetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
    if (playoffResetBtn) {
      playoffResetBtn.removeAttribute("disabled");
    }

    let currentIndex = matchIndex;

    function processNextMatch() {
      if (currentIndex >= matches.length) {
        callback();
        return;
      }

      var matchData = matches[currentIndex];
      var winner = predictWinner(matchData.match.teamA, matchData.match.teamB);

      matchData.match.winner = winner;
      if (winner === matchData.match.teamA) {
        matchData.match.winnerRank = matchData.match.teamARank;
      } else {
        matchData.match.winnerRank = matchData.match.teamBRank;
      }

      var matchContainer;
      if (matchData.type === "wildcard") {
        matchContainer = $('.' + matchData.conference + '-wildcard-match-' + matchData.index);
      } else if (matchData.type === "divisional") {
        matchContainer = $('.' + matchData.conference + '-division-match-' + matchData.index);
      } else if (matchData.type === "conference") {
        matchContainer = $('.' + matchData.conference + '-conference-match-' + matchData.index);
      } else if (matchData.type === "superbowl") {
        matchContainer = $('.playoff-super-bowl-round-container');
      }

      if (matchContainer) {
        var teamContainers = matchContainer.querySelectorAll('.playoff-match-team-details-holder');
        teamContainers.forEach(teamContainer => {
          var teamName = teamContainer.getAttribute('data-team-name');
          if (teamName === winner) {
            if (!hasClass(teamContainer, "selected")) {
              addClass(teamContainer, "selected");
            }
          } else {
            if (hasClass(teamContainer, "selected")) {
              removeClass(teamContainer, "selected");
            }
          }
        });
      }

      currentIndex++;
      playoffSimulationTimeoutId = setTimeout(processNextMatch, 150);
    }

    playoffSimulationTimeoutId = setTimeout(processNextMatch, 150);
  }

  function matchesAlreadyCompleted() {
    var playoffSimBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
    var playoffPauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
    if (playoffSimBtn && playoffPauseBtn) {
      playoffSimBtn.classList.remove("hidden");
      playoffSimBtn.setAttribute("disabled", "");
      playoffPauseBtn.classList.add("hidden");
    }
  }

  var conferenceNames = ["AFC", "NFC"];

  if (playoffSimulationTimeoutId) {
    clearTimeout(playoffSimulationTimeoutId);
    playoffSimulationTimeoutId = null;
  }

  var currentStage = determineCurrentPlayoffStage();

  switch (currentStage) {
    case "wildcard":
      simulateWildcardRound();
      break;
    case "divisional":
      simulateDivisionalRound();
      break;
    case "conference":
      simulateConferenceRound();
      break;
    case "superbowl":
      simulateSuperBowl();
      break;
    default:
      matchesAlreadyCompleted();
      break;
  }
}

function resetPlayoffPredictions() {
  var conferenceNames = ["AFC", "NFC"];

  // Reset Wildcard Round
  conferenceNames.forEach(conference => {
    if (playoffMatchesData[conference] && playoffMatchesData[conference]["Wildcard Round"]) {
      playoffMatchesData[conference]["Wildcard Round"].forEach((match, index) => {
        match.winner = "";
        match.winnerRank = "";

        // Reset UI if wildcard container exists
        var matchContainer = $('.' + conference + '-wildcard-match-' + index);
        if (matchContainer) {
          var teamContainers = matchContainer.querySelectorAll('.playoff-match-team-details-holder');
          teamContainers.forEach(teamContainer => {
            if (hasClass(teamContainer, "selected")) {
              removeClass(teamContainer, "selected");
            }
          });
        }
      });
    }
  });

  // Reset Divisional Round
  conferenceNames.forEach(conference => {
    if (playoffMatchesData[conference] && playoffMatchesData[conference]["Divisional Playoffs"]) {
      playoffMatchesData[conference]["Divisional Playoffs"].forEach((match, index) => {
        match.winner = "";
        match.winnerRank = "";

        // Reset UI if divisional container exists
        var matchContainer = $('.' + conference + '-division-match-' + index);
        if (matchContainer) {
          var teamContainers = matchContainer.querySelectorAll('.playoff-match-team-details-holder');
          teamContainers.forEach(teamContainer => {
            if (hasClass(teamContainer, "selected")) {
              removeClass(teamContainer, "selected");
            }
          });
        }
      });
    }
  });

  // Reset Conference Championships
  conferenceNames.forEach(conference => {
    if (playoffMatchesData[conference] && playoffMatchesData[conference]["Conference Championships"]) {
      playoffMatchesData[conference]["Conference Championships"].forEach((match, index) => {
        match.winner = "";
        match.winnerRank = "";

        // Reset UI if conference container exists
        var matchContainer = $('.' + conference + '-conference-match-' + index);
        if (matchContainer) {
          var teamContainers = matchContainer.querySelectorAll('.playoff-match-team-details-holder');
          teamContainers.forEach(teamContainer => {
            if (hasClass(teamContainer, "selected")) {
              removeClass(teamContainer, "selected");
            }
          });
        }
      });
    }
  });

  // Reset Super Bowl
  if (playoffMatchesData["Super Bowl"]) {
    playoffMatchesData["Super Bowl"]["winner"] = "";
    playoffMatchesData["Super Bowl"]["winnerRank"] = "";

    // Reset UI if Super Bowl container exists
    var matchContainer = $('.playoff-super-bowl-round-container');
    if (matchContainer) {
      var teamContainers = matchContainer.querySelectorAll('.playoff-match-team-details-holder');
      teamContainers.forEach(teamContainer => {
        if (hasClass(teamContainer, "selected")) {
          removeClass(teamContainer, "selected");
        }
      });
    }
  }

  // Reset playoff structure to initial state
  setPlayoffMatchesData();

  // Regenerate playoff UI if popup is open
  var playoffPopup = $('.predict-playoff-games-popup-container');
  if (playoffPopup && !hasClass(playoffPopup, "hidden")) {
    setPlayoffPredictorConatainer();
  }

  // Update draft order
  updateDraftOrder();
}

function setCompletedPlayoffMatchesData() {
  var conferencesList = ["AFC", "NFC"];

  conferencesList.forEach(conference => {
    if (playerOffCompletedMatchesData[conference]) {
      var wildCardCompletedMatches = playerOffCompletedMatchesData[conference]["Wildcard Round"];

      for (var matchIndex = 0; matchIndex < wildCardCompletedMatches.length; matchIndex++) {
        var matchContainer = $('.' + conference + '-wildcard-match-' + matchIndex);
        var teamContainers = matchContainer.querySelectorAll('.playoff-match-team-details-holder');
        teamContainers.forEach(teamContainer => {
          var teamName = teamContainer.getAttribute('data-team-name');
          if (teamName == wildCardCompletedMatches[matchIndex]['winner']) {
            teamContainer.click();
            if (!hasClass(matchContainer, "completed-match-container")) {
              addClass(matchContainer, "completed-match-container");
            }
          }
        });
      }

      var divisionalCompletedMatches = playerOffCompletedMatchesData[conference]["Divisional Playoffs"];

      for (var matchIndex = 0; matchIndex < divisionalCompletedMatches.length; matchIndex++) {
        var matchContainer = $('.' + conference + '-division-match-' + matchIndex);
        var teamContainers = matchContainer.querySelectorAll('.playoff-match-team-details-holder');
        teamContainers.forEach(teamContainer => {
          var teamName = teamContainer.getAttribute('data-team-name');
          if (teamName == divisionalCompletedMatches[matchIndex]['winner']) {
            teamContainer.click();
            if (!hasClass(matchContainer, "completed-match-container")) {
              addClass(matchContainer, "completed-match-container");
            }
          }
        });
      }

      var conferenceCompletedMatches = playerOffCompletedMatchesData[conference]["Conference Championships"];
      for (var matchIndex = 0; matchIndex < conferenceCompletedMatches.length; matchIndex++) {
        var matchContainer = $('.' + conference + '-conference-match-' + matchIndex);
        var teamContainers = matchContainer.querySelectorAll('.playoff-match-team-details-holder');
        teamContainers.forEach(teamContainer => {
          var teamName = teamContainer.getAttribute('data-team-name');
          if (teamName == conferenceCompletedMatches[matchIndex]['winner']) {
            teamContainer.click();
            if (!hasClass(matchContainer, "completed-match-container")) {
              addClass(matchContainer, "completed-match-container");
            }
          }
        });
      }

    }
  });

  if (playerOffCompletedMatchesData["SuperBowl"]) {
    var matchContainer = $('.playoff-super-bowl-round-container');
    var teamContainers = matchContainer.querySelectorAll('.playoff-match-team-details-holder');
    teamContainers.forEach(teamContainer => {
      var teamName = teamContainer.getAttribute('data-team-name');
      if (teamName && teamName == playerOffCompletedMatchesData["SuperBowl"]['winner']) {
        teamContainer.click();
        if (!hasClass(matchContainer, "completed-match-container")) {
          addClass(matchContainer, "completed-match-container");
        }
      }
    });
  }
}

function closeAllPopUps() {
  closeDeletePopUp();
  closePredictPlayoffGamesPopUp();
  closePredictSimulatePopUp();
  closeSimulatePopUp();
  closeStandingsDraftOrderPopup();
}

function showPredictSimulationPopup() {
  showOverlay(true);

  var simulatePopUp = document
    .getElementById("predict-simulate-popup")
    .content.cloneNode(true);

  if (checkAllWeekMatchesCompleted()) {
    var optionContainer = predictPlayoffPopup.querySelector(".option1");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }

    var seperator = simulatePopUp.querySelector(".option1-seperator");
    if (seperator && !hasClass(seperator, "hidden")) {
      addClass(seperator, "hidden");
    }
  }

  if (checkCurrentWeekMatchesCompleted(currentWeek)) {
    var optionContainer = simulatePopUp.querySelector(".option2");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }

    var seperator = simulatePopUp.querySelector(".option2-seperator");
    if (seperator && !hasClass(seperator, "hidden")) {
      addClass(seperator, "hidden");
    }
  }

  if (checkAfterCurrentWeekMatchesCompleted(currentWeek)) {
    var optionContainer = simulatePopUp.querySelector(".option3");
    if (optionContainer && !hasClass(optionContainer, "hidden")) {
      addClass(optionContainer, "hidden");
    }
  }

  var closeIcon = simulatePopUp.querySelector(".close-icon");
  closeIcon.addEventListener("click", closePredictSimulatePopUp);
  var currentWeekElements = simulatePopUp.querySelectorAll(".current-week");
  currentWeekElements.forEach(function (currentWeekText) {
    currentWeekText.innerHTML = currentWeek;
  });

  var submitButton = simulatePopUp.querySelector(".submit-simulate-button");
  submitButton.addEventListener("click", startPredictSimulation);

  document.body.appendChild(simulatePopUp);
  addPopUpEventListeners();
}

function predictPlayoffGames() {
  if (checkAllMatchCompletion()) {
    showPredictPlayoffGamesPopup();
  } else {
    showPredictSimulationPopup();
  }
}

function updateSimulatedStats() {
  for (let matchNumber = 0; matchNumber < weekMatchesData.length; matchNumber++) {
    updateScoreStats(matchNumber);
    simulateWinLoseTieCount(matchNumber);
  }
  simulateStandingsData();
}

function checkForSimulatedTeamCount(simulationTeamCount) {

  var conferenceNames = ["AFC", "NFC"];

  conferenceNames.forEach(conference => {
    playoffParticipants[conference].forEach(teamName => {
      simulationTeamCount[teamName]["playoff"]++;
    });

    playoffMatchesData[conference]["wildcard-winners"].forEach(teamData => {
      simulationTeamCount[teamData['winner']]["wildcard"]++;
    })

    playoffMatchesData[conference]["divisional-winners"].forEach(teamName => {
      simulationTeamCount[teamName]["divisional"]++;
    });

    playoffMatchesData[conference]["conference-winner"].forEach(teamName => {
      simulationTeamCount[teamName]["conference"]++;
    });
  });

  for (let division in divisionData) {
    var topTeam = divisionData[division][0]["Team"];
    simulationTeamCount[topTeam]["divisionTop"]++;
  }

  for (let conference in conferenceData) {
    var topTeam = conferenceData[conference][0]["Team"];
    simulationTeamCount[topTeam]["conferenceTop"]++;
  }

  simulationTeamCount[playoffMatchesData["superbowl-winner"][0]]["superbowl"]++;
}

function showTooltip() {
  const accessedNum = localStorage.getItem("playoff-predictor__accessed-num");
  const setLocalStorage = (prevValue) => {
    const num = prevValue ? parseInt(prevValue) + 1 : 2;
    localStorage.setItem("playoff-predictor__accessed-num", num);
  }
  if (!accessedNum || parseInt(accessedNum) <= 2) {
    $(".simulation-ctas-container .tooltip").classList.remove("hidden");
    setTimeout(() => {
      $(".simulation-ctas-container .tooltip").classList.add("hidden");
    }, 7000);
  }
  setLocalStorage(accessedNum);
}

function closeTooltip(event) {
  if (!event.target.closest(".tooltip")) {
    $(".simulation-ctas-container .tooltip").classList.add("hidden");
  }
}

function showStandingsDraftOrderPopup() {
  showOverlay(true);
  const standingsDraftorderWrapper = $(".standings-draft-order-wrapper");
  if (standingsDraftorderWrapper) {
    const newWrapper = document.importNode(standingsDraftorderWrapper, true);
    removeClass(newWrapper, "hidden");
    const parentDiv = document.createElement("div");
    addClass(parentDiv, "standings-draftOrder-copy");
    const parentDivHeader = document.createElement("div");
    addClass(parentDivHeader, "standings-draftOrder-copy-header");
    const parentDivHeaderText = document.createElement("span");
    addClass(parentDivHeaderText, "standings-draftOrder-copy-header-text");
    parentDivHeaderText.innerHTML = "STANDINGS AND DRAFT ORDER"
    const parentDivHeaderCloseBtn = document.createElement("button");
    addClass(parentDivHeaderCloseBtn, "standings-draftOrder-copy-header-close-btn");
    parentDivHeaderCloseBtn.addEventListener("click", closeStandingsDraftOrderPopup);
    const parentDivHeaderCloseIcon = document.createElement("img");
    addClass(parentDivHeaderCloseIcon, "standings-draftOrder-copy-header-close-icon");
    parentDivHeaderCloseIcon.setAttribute("src", STATIC_URL +
      "/skm/assets/pfn/tools/ultimate-gm-simulator/close-icon.png");
    parentDivHeaderCloseIcon.setAttribute("width", 15);
    parentDivHeaderCloseIcon.setAttribute("height", 15);
    parentDivHeaderCloseIcon.setAttribute("alt", "Close icon");
    parentDivHeaderCloseBtn.appendChild(parentDivHeaderCloseIcon);
    parentDivHeader.appendChild(parentDivHeaderText);
    parentDivHeader.appendChild(parentDivHeaderCloseBtn);
    parentDiv.appendChild(parentDivHeader);

    parentDiv.appendChild(newWrapper);

    const continueBtn = document.createElement("button");
    continueBtn.innerHTML = "Continue";
    addClass(continueBtn, "continue-next-screen");
    const activeNode = $(".step-node.is-active");
    if (activeNode.dataset.step === "8") {
      continueBtn.addEventListener("click", showUltimateFinalResult);
    } else {
      continueBtn.addEventListener("click", initializeOffseasonManager);
    }

    if (playoffMatchesData["Super Bowl"]["winner"] == "") {
      continueBtn.disabled = true;
    } else {
      continueBtn.disabled = false;
    }

    parentDiv.appendChild(continueBtn);

    document.body.appendChild(parentDiv);

    $(".standings-draftOrder-copy .standings-page-toggle-wrapper .conference-toggle-btn").addEventListener("click",
      showConferenceStandingsPage);
    $(".standings-draftOrder-copy .standings-page-toggle-wrapper .division-toggle-btn").addEventListener("click",
      showDivisionStandingsPage);
    if ($(".standings-draftOrder-copy .standings-section-toggle-btn")) {
      $(".standings-draftOrder-copy .standings-section-toggle-btn").addEventListener("click", showStandingsSection);
    }

    if ($(".standings-draftOrder-copy .draft-order-section-toggle-btn")) {
      $(".standings-draftOrder-copy .draft-order-section-toggle-btn").addEventListener("click",
        showDraftOrderSection);
    }

    const nextSeasonSimulation = $(".step-node.seven.is-active");
    if (nextSeasonSimulation) {
      const standingsHeaderText = $(".standings-draftOrder-copy .standings-section-header-text-container .standings-section-header-text");
      if (standingsHeaderText) {
        standingsHeaderText.innerHTML = "Predicted NFL Standings " + upcomingSeason;
      }

      const draftOrderHeaderText = $(".standings-draftOrder-copy .draft-order-utility-heading-holder .draft-order-section-text");
      if (draftOrderHeaderText) {
        draftOrderHeaderText.innerHTML = "Predicted NFL Draft Order " + upcomingSeason;
      }
    }
  }
}

function setUnpredictedMatchedCountText() {
  const unpredictedCount = getUnpredictedMatchesCount();
  const remainingMatchesCount = $(".week-matches-simulation-wrapper .wrapper-header .remaining-matches");
  if (remainingMatchesCount) {
    remainingMatchesCount.innerHTML = "Predictions Remaining: " + unpredictedCount;
  }
}

function getUnpredictedMatchesCount() {
  let unpredictedMatchesCount = 0;
  weekMatchesData.forEach(match => {
    if (!match["Winner"]) {
      unpredictedMatchesCount++;
    }
  });

  return unpredictedMatchesCount;
}

function getUnpredictedMyGamesCount() {
  let unpredictedMatchesCount = 0;
  weekMatchesData.forEach(match => {
    if ((match["Home"] === userSelectedGMTeam || match["Away"] === userSelectedGMTeam) && !match["Winner"]) {
      unpredictedMatchesCount++;
    }
  });

  return unpredictedMatchesCount;
}

async function initializePlayoffPredictorTool(setEventListeners) {
  const continueBtn = document.getElementById('continueBtn');
  if (continueBtn && setEventListeners) {
    continueBtn.removeEventListener("click", moveToCurrentYearPlayoffPredictor);
    continueBtn.addEventListener("click", initializeOffseasonManager);
    continueBtn.disabled = true;

    const yearText = $(".playoff-predictor-tool-mapping .current-year-text");
    if (yearText) {
      yearText.innerHTML = currentSeason + " Results";
    }
  } else {
    showOverlay(false);
    const yearText = $(".playoff-predictor-tool-mapping .current-year-text");
    if (yearText) {
      yearText.innerHTML = upcomingSeason + " Predictions";
    }
    const bottomInfoContainer = $(".info-text-continue-btn-container");
    if (bottomInfoContainer) {
      removeClass(bottomInfoContainer, "hidden");
    }

    let continueBtn;
    if (IS_DESKTOP) {
      continueBtn = bottomInfoContainer.querySelector(".continue-btn");
    } else {
      continueBtn = $(".simulation-ctas-container .continue-btn");
    }

    if (continueBtn) {
      continueBtn.innerHTML = "FINAL RESULTS";
      continueBtn.addEventListener("click", showUltimateFinalResult);
      continueBtn.disabled = true;
    }
  }

  setUnpredictedMatchedCountText();
  setWeekCarousel();
  const sectionPlayoffPredictor = $("#screen-predict-playoffs");
  if (sectionPlayoffPredictor) {
    removeClass(sectionPlayoffPredictor, "hidden");
  }

  const sectionTeamSelect = $("#screen-select");
  if (sectionTeamSelect) {
    // Destroy team selection DOM — not revisited after team is chosen
    sectionTeamSelect.innerHTML = "";
    addClass(sectionTeamSelect, "hidden");
  }

  await yieldToMain();

  changeWeek("", landingWeek);
  calculateStatsData();
  updateStandingsData();
  updateSimulationButtonDisableStatus();

  firstFiveWeeksMatchesCompleted = canShowDraftOrder();
  disableDraftOrderSection(!firstFiveWeeksMatchesCompleted);

  if (checkAllWeekMatchesCompleted()) {
    showPredictPlayoffGamesPopup();
    const playoffsOverlay = $(".predict-playoff-games-popup-content .playoffs-overlay");
    if (playoffsOverlay) {
      addClass(playoffsOverlay, "hidden");
    }
  }

  if (setEventListeners && sectionPlayoffPredictor) {
    sectionPlayoffPredictor.querySelector(".simulation-ctas-container .simulate-button").addEventListener("click", showSimulatePopUp);
    sectionPlayoffPredictor.querySelector(".simulation-ctas-container .delete-button").addEventListener("click", showDeletePopUp);
    sectionPlayoffPredictor.querySelector(".simulation-ctas-container .pause-button").addEventListener("click", pauseSimulation);
    if (sectionPlayoffPredictor.querySelector(".simulator-standings-page-toggle-wrapper .standings-page-toggle-btn")) {
      sectionPlayoffPredictor.querySelector(".simulator-standings-page-toggle-wrapper .standings-page-toggle-btn").addEventListener("click",
        showStandingsPage);
    }
    if (sectionPlayoffPredictor.querySelector(".simulator-standings-page-toggle-wrapper .simulator-page-toggle-btn")) {
      sectionPlayoffPredictor.querySelector(".simulator-standings-page-toggle-wrapper .simulator-page-toggle-btn").addEventListener("click",
        showSimulatorPage);
    }
    if (sectionPlayoffPredictor.querySelector(".simulator-standings-page-toggle-wrapper .draft-order-page-toggle-btn")) {
      sectionPlayoffPredictor.querySelector(".simulator-standings-page-toggle-wrapper .draft-order-page-toggle-btn").addEventListener("click",
        showDraftOrderPage);
    }

    sectionPlayoffPredictor.querySelector(".standings-draftorder-btn").addEventListener("click", showStandingsDraftOrderPopup);

    if (sectionPlayoffPredictor.querySelector(".playoff-section-header-scroll-to-standings-text")) {
      sectionPlayoffPredictor.querySelector(".playoff-section-header-scroll-to-standings-text").addEventListener("click", scrollStandingPageInView);
    }

    if (sectionPlayoffPredictor.querySelector(".standings-section-toggle-btn")) {
      sectionPlayoffPredictor.querySelector(".standings-section-toggle-btn").addEventListener("click", showStandingsSection);
    }

    if (sectionPlayoffPredictor.querySelector(".draft-order-section-toggle-btn")) {
      sectionPlayoffPredictor.querySelector(".draft-order-section-toggle-btn").addEventListener("click", showDraftOrderSection);
    }
  }
}

function initSelectScreen() {
  const tiles = document.querySelectorAll('.team-tile');
  const continueBtn = $(".info-text-continue-btn-container .continue-btn");

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      document.querySelectorAll('.team-tile').forEach(t => t.classList.remove('is-selected'));
      tile.classList.add('is-selected');
      selectedTeam = tile.dataset.team;
      continueBtn.disabled = false;
    });
  });

  continueBtn.addEventListener('click', moveToCurrentYearPlayoffPredictor);
}

function moveToCurrentYearPlayoffPredictor() {
  const textContent = $(".pfn-text-content-container");
  if (textContent) {
    addClass(textContent, "hidden");
  }
  const previousStepNode = $(".step-node.one");
  if (previousStepNode) {
    removeClass(previousStepNode, "is-active-border");
  }
  const stepNode = $(".step-node.two");
  if (stepNode) {
    addClass(stepNode, "is-active");
    addClass(stepNode, "is-active-border");
  }
  const stepNum = $(".step-node.one .step-num");
  if (stepNum) {
    addClass(stepNum, "hidden");
  }
  const stepCompleted = $(".step-node.one .step-completed");
  if (stepCompleted) {
    removeClass(stepCompleted, "hidden");
  }
  const arrow = $(".arrow.two");
  if (arrow) {
    addClass(arrow, "blue");
    arrow.style.setProperty('--after-color', '#0857C3');
  }

  if (!IS_DESKTOP) {
    const continueBtn = $(".info-text-continue-btn-container .continue-btn");
    if (continueBtn) {
      addClass(continueBtn, "hidden");
    }
  }

  const selectedTeamBtn = $(".team-tile.is-selected");
  if (selectedTeamBtn) {
    userSelectedGMTeam = selectedTeamBtn.dataset.team;
    trackGAEventForPage("team_selection_continue_click", {
      team: userSelectedGMTeam,
    });
  } else {
    return;
  }
  initializePlayoffPredictorTool(true);
}

// originalPlayerStates removed — was populated but never read

let players;
let teams;
let teamLogos = {};
let freeAgencySimulatorResultPlayers = [];

const teamAbbreviations = {
  "Arizona Cardinals": "ARI",
  "Atlanta Falcons": "ATL",
  "Baltimore Ravens": "BAL",
  "Buffalo Bills": "BUF",
  "Carolina Panthers": "CAR",
  "Chicago Bears": "CHI",
  "Cincinnati Bengals": "CIN",
  "Cleveland Browns": "CLE",
  "Dallas Cowboys": "DAL",
  "Denver Broncos": "DEN",
  "Detroit Lions": "DET",
  "Green Bay Packers": "GB",
  "Houston Texans": "HOU",
  "Indianapolis Colts": "IND",
  "Jacksonville Jaguars": "JAX",
  "Kansas City Chiefs": "KC",
  "Las Vegas Raiders": "LV",
  "Los Angeles Rams": "LAR",
  "Los Angeles Chargers": "LAC",
  "Miami Dolphins": "MIA",
  "Minnesota Vikings": "MIN",
  "New England Patriots": "NE",
  "New Orleans Saints": "NO",
  "New York Giants": "NYG",
  "New York Jets": "NYJ",
  "Philadelphia Eagles": "PHI",
  "Pittsburgh Steelers": "PIT",
  "San Francisco 49ers": "SF",
  "Seattle Seahawks": "SEA",
  "Tampa Bay Buccaneers": "TB",
  "Tennessee Titans": "TEN",
  "Washington Commanders": "WAS"
};

async function getEncodedJSON(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

const availableListRenderer = createAvailableListRenderer();

let dataFetched = [];


getUltimateSimData()
  .then(() => {
    players = getPlayersData();
    dataFetched.push("players");

    teams = getTeamsData();
    teamLogos = teams.reduce((acc, team) => {
      acc[team.id] = team.logo;
      return acc;
    }, {});
    renderTeamGrid();
    dataFetched.push("teams");

    prepareWeekMatchesData(ultimateSimData.current_season_simulation);
    prepareTeamsData(ultimateSimData.team_level_data);
    prepareWinningProbabilityData(ultimateSimData.winning_probability);
    preparePlayoffsData(ultimateSimData.playoffs);
    ultimateSimData.mds_team.forEach(team => {
      team.draftPicks = [];
      team.draftedPlayers = [];
      team.doNotDraft = JSON.parse(team.doNotDraft);
      team.teamLogo = team.teamLogo.replace("/mockdraft/nfl-team-logos/", "").replace(".gif", ".png");
    });
    ultimateSimData.mds_player.forEach(player => {
      player.plWeight = Number(player.plWeight);
      player.score = Number(player.score);
      player.number = Number(player.number);
      player.pickModifier = Number(player.pickModifier);
      player.pickCap = player.pickCap ? Number(player.pickCap) : "";
    });
    mdsTeamsList = ultimateSimData.mds_team;
    teamNeedsList = ultimateSimData.mds_team;
    playersList = ultimateSimData.mds_player.slice();
    playersListAll = ultimateSimData.mds_player;

    // Free raw data no longer needed after processing
    delete ultimateSimData.offseason_sim_player;
    delete ultimateSimData.offseason_sim_team;
    delete ultimateSimData.current_season_simulation;
    delete ultimateSimData.winning_probability;
    delete ultimateSimData.playoffs;

    const loadingOverlay = $(".ultimate-gm-simulator .loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  })
  .catch(error => {
    console.error("Error processing teams data:", error);
    alert("Something went wrong! Please reload the page and try again.");
  });


let selectedTeamID = null;
let capData = {}; // Same as team data, only filtered. Can even use the same object
let selectedTeam = {};

// Utility Functions
var moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});
function formatMoney(amount) {
  return moneyFormatter.format(amount);
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

function selectTeamIntent(event, teamId) {
  selectedTeamID = teamId;
  const continueBtn = document.querySelector(".continue-btn");
  if (continueBtn) {
    continueBtn.classList.remove("disabled");
  }
  const teamCard = event.target.closest('.team-card');
  if (teamCard) {
    document.querySelectorAll('.team-card.selected').forEach(card => {
      card.classList.remove('selected');
    });
    teamCard.classList.add('selected');
  }
}

// generates a random year based on the player's min and max amount of years for the new contract
function getRandomYears(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generates a random amount based on the player's min and max amount for the new contract
function calculateContractAmount(min, max) {
  const randomValue = Math.random() * (max - min) + min;
  return Math.ceil(randomValue / 100) * 100;
}

// Event Handlers
function selectFreeAgencySimulatorTeam() {
  showScreen('screen2');
  findAndAssignSelectedTeamByID(selectedTeamID);

  goToStep(2);
  renderTeamLogo(2);
  updateCapSummary();
  renderPlayerTable();
  window.scrollTo(0, 0);
}

function findAndAssignSelectedTeamByID(teamID) {
  teams.forEach(team => {
    if (team.id === teamID) {
      selectedTeam = team;
      return;
    }
  });
}

function navigateToMDS() {
  trackGAEventForPage("navigate_to_mds_screen", {
    team: userSelectedGMTeam,
  });
  if (!IS_DESKTOP) {
    const stepsBar = document.querySelector('.steps-wrap .steps-bar');
    stepsBar.scrollBy({
      left: 180,
      behavior: 'smooth'
    });
  }
  const previousStepNode = $(".step-node.five");
  if (previousStepNode) {
    removeClass(previousStepNode, "is-active-border");
  }
  const stepNode = $(".step-node.six");
  if (stepNode) {
    addClass(stepNode, "is-active");
    addClass(stepNode, "is-active-border");
  }
  const stepNum = $(".step-node.five .step-num");
  if (stepNum) {
    addClass(stepNum, "hidden");
  }
  const stepCompleted = $(".step-node.five .step-completed");
  if (stepCompleted) {
    removeClass(stepCompleted, "hidden");
  }
  const arrow = $(".arrow.six");
  if (arrow) {
    addClass(arrow, "blue");
    arrow.style.setProperty('--after-color', '#0857C3');
  }

  // Clean up resize listeners before destroying DOM
  cleanupScrollControlResizeHandlers();

  const offseasonManager = $("#screen-offseason-manager");
  if (offseasonManager) {
    // Preserve style tags (needed by later sections) before clearing DOM
    var styleTags = offseasonManager.querySelectorAll("style");
    offseasonManager.innerHTML = "";
    styleTags.forEach(function (tag) {
      offseasonManager.appendChild(tag);
    });
    addClass(offseasonManager, "hidden");
  }

  // Free free-agency-only data (selectedTeam kept as-is — async callbacks may still reference it)
  capData = {};

  showNextScreenLoadingPopup("Draft rookie players for the next season with our Mock Draft Simulator...");

  const mockdraftSimulator = $("#mockdraft-simulator");
  if (mockdraftSimulator) {
    removeClass(mockdraftSimulator, "hidden");
  }

  initializeMockdraftSimulator();
}

function cutPlayer(playerId) {
  const player = players.find(p => p.id === playerId);
  if (player) {
    if (player.status === 'cut') {
      // Player is being cut
      player.status = 'active';
      selectedTeam.activeCapHit += player.capHit;
      selectedTeam.deadMoney -= player.deadMoney;
      selectedTeam.capSpaceRemaining -= player.capSavings;
      // Reduce team needs as this player is being un-cut
      selectedTeam.teamNeeds[player.position] -= 1;
      player.oldFreeAgentStatus = player.freeAgent;
      player.freeAgent = false;
    } else {
      // Player is being uncut
      player.status = 'cut';
      selectedTeam.activeCapHit -= player.capHit;
      selectedTeam.deadMoney += player.deadMoney;
      selectedTeam.capSpaceRemaining += player.capSavings;
      player.oldFreeAgentStatus = player.freeAgent;
      player.freeAgent = true;
      // Increase team needs as this player is being cut
      selectedTeam.teamNeeds[player.position] += 1;
    }

    renderPlayerTable();
    updateCapSummary();
  }
}
let currentPlayerId = null;
let currentPlayer = null;

function showRosterManagementSummary() {
  const summaryBody = document.getElementById('rosterManagementBody');

  const allTeamActions = getAllTeamsRosterActions();

  // Get all teams' actions
  const selectedTeamActions = allTeamActions
    .filter(action => action.team == selectedTeamID)
    .sort((a, b) => getPlayerValue(b) - getPlayerValue(a));

  const cutPlayers = [];
  const restructuredPlayers = [];
  selectedTeamActions.forEach(player => {
    if (player.status === "cut") {
      cutPlayers.push(player.name);
    }

    if (player.status === "restructured") {
      restructuredPlayers.push(player.name);
    }
  })

  if (cutPlayers.length || restructuredPlayers.length) {
    trackGAEventForPage("cut/restructure_click", {
      team: userSelectedGMTeam,
      cutPlayers,
      restructuredPlayers,
    });
  }

  const otherTeamActions = allTeamActions
    .filter(action => action.team != selectedTeamID);

  // Group otherTeamActions by team
  const groupedOtherTeamActions = otherTeamActions.reduce((acc, action) => {
    if (!acc[action.team]) {
      acc[action.team] = [];
    }
    acc[action.team].push(action);
    return acc;
  }, {});

  // Sort team names alphabetically
  const sortedTeamNames = Object.keys(groupedOtherTeamActions).sort();

  // Internal function to render a table row
  function renderTableRow(action, isOwnTeam) {
    return '' +
      '<tr class="' + (isOwnTeam ? 'player-own' : '') + '">' +
      '<td class="name">' + action.name + '</td>' +
      '<td class="center">' + action.position + '</td>' +
      '<td class="center">' +
      '<div class="team-data-container">' +
      '<img ' +
      'src="' + teamLogos[action.team] + '" ' +
      'alt="' + action.team + '" ' +
      'width="20" ' +
      'height="20" ' +
      '/>' +
      action.team +
      '</div>' +
      '</td>' +
      '<td class="center">' + formatStatus(action.status) + '</td>' +
      '<td class="center">' + formatMoney(getPlayerValue(action)) + '</td>' +
      '</tr>';
  }


  // Render selectedTeamActions first
  let htmlContent = selectedTeamActions.map(action => renderTableRow(action, true)).join('');

  // Render other teams' actions in alphabetical order
  sortedTeamNames.forEach(teamName => {
    const teamActions = groupedOtherTeamActions[teamName]
      .sort((a, b) => getPlayerValue(b) - getPlayerValue(a)); // Sort by value descending

    htmlContent += teamActions.map(action => renderTableRow(action, false)).join('');
  });

  summaryBody.innerHTML = htmlContent;
  document.getElementById('rosterManagementModal').style.display = 'flex';
}

// Function to process all teams' roster actions
function getAllTeamsRosterActions() {
  let allActions = [];

  // First, add user's team actions
  const userTeamActions = players.filter(p =>
    (!p.freeAgent || p.status === "cut") &&
    p.team === selectedTeamID &&
    p.status !== 'active'
  );
  allActions = [...userTeamActions];

  // Process other teams
  const otherTeamActions = processRosterChanges(teams, players, selectedTeamID);

  allActions = [...allActions, ...otherTeamActions];

  return allActions;
}

/**
 * Processes roster changes based on probability and budget constraints
 * @param Array teams - Array of team objects with cap information
 * @param Array players - Array of player objects with cut/restructure probabilities
 * @returns Array Array of processed players with updated statuses
 */

function processRosterChanges(teams, players, selectedTeamID) {
  const changedPlayers = [];

  teams.forEach(team => {
    if (team.id === selectedTeamID) {
      return;
    }

    const teamPlayers = players.filter(player => player.team === team.teamCode);

    // Calculate maximum number of players that can be cut or restructured
    const maxCuts = Math.floor((teamPlayers.length * team.maxCapCutPercentage) / 100);
    const maxRestructures = Math.floor((teamPlayers.length * team.maxCapRestructurePercentage) / 100);

    // Track count of processed players
    let cutsProcessed = 0;
    let restructuresProcessed = 0;

    // Sort players by their cut and restructure probabilities (highest first)
    const sortedForCuts = [...teamPlayers]
      .filter(p => p.cutPercent > 0)
      .sort((a, b) => b.cutPercent - a.cutPercent);

    const sortedForRestructure = [...teamPlayers]
      .filter(p => p.restructurePercent > 0)
      .sort((a, b) => b.restructurePercent - a.restructurePercent);

    // Process cuts first
    sortedForCuts.forEach(player => {
      if (cutsProcessed < maxCuts) {
        const roll = Math.random() * 100;

        if (roll < player.cutPercent) {
          team.activeCapHit -= player.capHit;
          team.deadMoney += player.deadMoney;
          team.capSpaceRemaining += player.capSavings;
          // Increase team needs as this player is being cut
          team.teamNeeds[player.position] += 1;
          player.status = "cut";
          player.capHit = player.deadMoney;
          player.oldFreeAgentStatus = player.freeAgent;
          player.freeAgent = true;

          changedPlayers.push(player);
          cutsProcessed++;
        }
      }
    });

    // Process restructures
    sortedForRestructure.forEach(player => {
      // Skip if player was already cut
      if (changedPlayers.some(p => p.id === player.id && p.status === 'cut')) {
        return;
      }

      if (restructuresProcessed < maxRestructures) {
        const roll = Math.random() * 100;

        if (roll < player.restructurePercent) {
          team.activeCapHit -= player.restructureSavings;
          team.capSpaceRemaining += player.restructureSavings;

          player.status = "restructured";
          player.capHit = player.capHit - player.restructureSavings;
          player.oldFreeAgentStatus = player.freeAgent;
          player.freeAgent = false;

          changedPlayers.push(player);
          restructuresProcessed++;
        }
      }
    });
  });

  return changedPlayers;
}

function showReSigningModal(playerId, source) {
  const player = players.find(p => p.id === playerId);
  if (player) {
    currentPlayer = player;

    // Update modal title and button based on type
    const modalTitle = document.querySelector('.modal-title');
    const submitButton = document.querySelector('.offer-button');

    document.getElementById('restructureModal').style.display = 'flex';
    // Reset form
    document.getElementById('moneyPerYear').value = '1,000,000';
    document.getElementById('years').value = '3';
    document.getElementById('percentGuaranteed').value = '10';

    // Populate desired contract info with randomization (cached per player)
    if (!player.desiredContract) {
      var basePerYear = player.perYearMinimum;
      var perYearMultiplier = 1 + (Math.random() * 0.2);
      var baseGuaranteedPct = player.perYearMinimum > 0 ? (player.guaranteedMinimum / player.perYearMinimum) * 100 : 0;
      var guaranteedPctIncrease = Math.random() * 10;
      player.desiredContract = {
        perYear: Math.round(basePerYear * perYearMultiplier),
        guaranteedPct: Math.min(Math.round(baseGuaranteedPct + guaranteedPctIncrease), 100),
        minYears: player.minimumYears + (Math.random() < 0.5 ? 0 : 1)
      };
    }

    var desiredPerYear = $("#desiredPerYear");
    var desiredGuaranteedPct = $("#desiredGuaranteedPct");
    var desiredMinYears = $("#desiredMinYears");
    if (desiredPerYear) desiredPerYear.innerText = '$' + player.desiredContract.perYear.toLocaleString('en-US');
    if (desiredGuaranteedPct) desiredGuaranteedPct.innerText = player.desiredContract.guaranteedPct + '%';
    if (desiredMinYears) desiredMinYears.innerText = player.desiredContract.minYears;

    const restructureModal = document.getElementById('restructureModal');
    if (restructureModal) {
      const continueBtn = restructureModal.querySelector(".continue-btn");
      if (continueBtn) {
        continueBtn.dataset.source = source;
      }
    }
  }
}

function closeRestructureModal() {
  document.getElementById('restructureModal').style.display = 'none';
  currentPlayerId = null;
}

function closeInstructionsModal() {
  document.getElementById('instructionsModal').style.display = 'none';
  currentPlayerId = null;
}

function formatMoneyInput(input) {
  // Remove all non-digits
  let value = input.value.replace(/\D/g, '');
  // Format with commas
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  input.value = value;
}

function getCapHitForContract(moneyPerYear, years) {
  if (moneyPerYear <= 1300000) return moneyPerYear;
  var capPct = {1: 1, 2: 0.7, 3: 0.5, 4: 0.4, 5: 0.3};
  var hit = Math.round(moneyPerYear * (capPct[years] || 1));
  return Math.max(hit, 1300000);
}

function isOfferWithinLimits(moneyPerYear, years) {
  return selectedTeam.capSpaceRemaining > getCapHitForContract(moneyPerYear, years);
}

function isOfferAcceptable(moneyPerYear, years, percentGuaranteed) {
  return moneyPerYear >= currentPlayer.perYearMinimum && years >= currentPlayer.minimumYears && ((percentGuaranteed *
    moneyPerYear) / 100) >= currentPlayer.guaranteedMinimum;
}

function makeReSigningOffer(e) {
  const player = currentPlayer;
  if (!player) {
    alert("Error");
    return;
  }
  const source = e.target.dataset.source;
  let event = "offer_newcontract_submit_click";
  if (source && source === "resigning") {
    event = "player_resign_confirm_click";
  }

  const moneyPerYear = parseInt(document.getElementById('moneyPerYear').value.replace(/\D/g, ''));
  const years = parseInt(document.getElementById('years').value);
  const percentGuaranteed = parseInt(document.getElementById('percentGuaranteed').value);

  if (!isOfferWithinLimits(moneyPerYear, years)) {
    // Show error
    alert("This offer is in excess of your team's remaining cap space");
    return;
  }


  const isAccepted = isOfferAcceptable(moneyPerYear, years, percentGuaranteed);

  if (isAccepted) {
    trackGAEventForPage(event, {
      team: userSelectedGMTeam,
      moneyPerYear,
      years,
      percentGuaranteed,
    });
    player.oldStatus = player.status; // Store old status for reference
    if (selectedTeamID !== player.team) {
      // This is a signing, not a re-signing
      player.status = 'signed';
    } else {
      player.status = 're-signed';
    }
    var capHit = getCapHitForContract(moneyPerYear, years);
    player.newContract = {
      moneyPerYear: moneyPerYear,
      years: years,
      percentGuaranteed: percentGuaranteed,
      capHit: capHit
    };
    player.contractYears = years;
    player.team = selectedTeamID; // Applicable in case of last screen when we are signing available free agents
    player.oldFreeAgentStatus = player.freeAgent;
    player.freeAgent = false;
    // Update team cap details
    selectedTeam.activeCapHit += capHit;
    selectedTeam.capSpaceRemaining -= capHit;
    player.capHit = capHit;
    selectedTeam.teamNeeds[player.position] -= 1; // Offer was accepted, reduce team need by one
  }

  // Show response modal
  showResponseModal(isAccepted);

  // Important: After showing response modal, update the table
  renderReSigningTable();
  updateCapSummary();

  updateCapSpaceDisplay(); // update Cap Space Remaining
  updateTeamNeeds();
  renderRosterList(); // applicable for the last screen, since we are calling the same function
  availableListRenderer
    .renderAvailableList(true); // applicable for the last screen, since we are calling the same function
}

function updateTeamNeeds() {
  var teamNeedsEl = document.querySelector("#teamNeeds");
  if (!teamNeedsEl || !selectedTeam.teamNeeds) return;

  const sortedKeys = Object.entries(selectedTeam.teamNeeds)
    .sort(([, valueA], [, valueB]) => valueB - valueA)
    .map(([key]) => key)
    .slice(0, 5);

  teamNeedsEl.innerHTML = sortedKeys.join(', ');
}

// Modify the restructurePlayer function to show modal instead of direct status change
function restructurePlayer(playerId) {
  const player = players.find(p => p.id === playerId);
  if (player) {
    if (player.status === 'restructured') {
      // If already restructured, undo it
      player.status = 'active';
      selectedTeam.activeCapHit += player.restructureSavings;
      selectedTeam.capSpaceRemaining -= player.restructureSavings;
      player.capHit = player.oldCapHit;
    } else {
      // restructure the player and account for expenses
      player.status = 'restructured';
      selectedTeam.activeCapHit -= player.restructureSavings;
      selectedTeam.capSpaceRemaining += player.restructureSavings;
      player.oldCapHit = player.capHit;
      player.capHit = player.capHit - player.restructureSavings;
    }

    renderPlayerTable();
    updateCapSummary();
  }
}

// Rendering Functions
function renderTeamGrid() {
  var grid = document.getElementById('teamGrid');
  grid.innerHTML = teams.map(function (team) {
    return '' +
      '<div class="team-card" data-team="' + team.id + '" onclick="selectTeamIntent(event, \'' + team.id +
      '\')">' +
      '<img src="' + team.logo + '?w=160" alt="' + team.name + '" crossorigin="anonymous">' +
      '<h3>' + teamAbbreviations[team.name] + '</h3>' +
      '</div>';
  }).join('');
}


function updateCapSummary() {
  var summaryHTML = '' +
    '<div class="cap-item">' +
    '<div class="cap-item-label">Salary Cap</div>' +
    '<div class="cap-item-value">' + formatMoney(selectedTeam.salaryCap) + '</div>' +
    '</div>' +
    '<div class="cap-item">' +
    '<div class="cap-item-label">Carryover</div>' +
    '<div class="cap-item-value">' + formatMoney(selectedTeam.carryOver) + '</div>' +
    '</div>' +
    '<div class="cap-item">' +
    '<div class="cap-item-label">' + (IS_DESKTOP ? "Reserved" : "Res.") + ' for Draft Picks</div>' +
    '<div class="cap-item-value">' + formatMoney(selectedTeam.reservedForDraft) + '</div>' +
    '</div>' +
    '<div class="cap-item">' +
    '<div class="cap-item-label">Active Cap Hit</div>' +
    '<div class="cap-item-value">' + formatMoney(selectedTeam.activeCapHit) + '</div>' +
    '</div>' +
    '<div class="cap-item">' +
    '<div class="cap-item-label">Dead Money</div>' +
    '<div class="cap-item-value">' + formatMoney(selectedTeam.deadMoney) + '</div>' +
    '</div>' +
    '<div class="cap-item">' +
    '<div class="cap-item-label">Cap Space Rem.</div>' +
    '<div class="cap-item-value">' + formatMoney(selectedTeam.capSpaceRemaining) + '</div>' +
    '</div>';

  // Update both cap summary divs
  document.getElementById('capSummary').innerHTML = summaryHTML;
  const screen3Summary = document.getElementById('screen3CapSummary');
  const screen5Summary = document.getElementById("finalCapSummary");
  if (screen3Summary) {
    screen3Summary.innerHTML = summaryHTML;
  }
  if (screen5Summary) {
    screen5Summary.innerHTML = summaryHTML;
  }
}

function renderTeamLogo(screenNumber) {
  const id = "#screen" + screenNumber;
  const logo = selectedTeam.logo;
  var imgEle = document.querySelector(id + ' .team-logo-container img');
  var spanEle = document.querySelector(id + ' .team-logo-container span');
  if (logo && imgEle && spanEle) {
    imgEle.src = logo;
    imgEle.alt = selectedTeam.id;
    spanEle.innerText = selectedTeam.teamCode;
  }
}

function renderPlayerTable() {
  // Only show players from the selected team for cut/restructure
  // TODO: Figure out sorting logic after a user has done cutting or restructuring
  var teamPlayers = players
    .filter(function (p) {
      return p.team === selectedTeamID && (!p.freeAgent || p.status === "cut");
    })
    .sort(function (a, b) {
      var aCapHit = a.oldCapHit ? a.oldCapHit : a.capHit;
      var bCapHit = b.oldCapHit ? b.oldCapHit : b.capHit;
      return bCapHit - aCapHit;
    });

  var table = document.getElementById('playerTable');
  table.innerHTML = teamPlayers.map(function (player) {
    return '' +
      '<tr class="' +
      (player.status === 'cut' ? 'player-cut' :
        (player.status === 'restructured' ? 'player-restructured' : '')) +
      '">' +
      '<td class="name">' + player.name + '</td>' +
      '<td class="position center">' + player.position + '</td>' +
      '<td class="amount center">' +
      (player.status === 'cut' ? formatMoney(player.deadMoney) :
        (player.status === 'restructured' ? formatMoney(player.capHit) : formatMoney(player.capHit))) +
      '</td>' +
      '<td class="amount center">' + formatMoney(player.deadMoney) + '</td>' +
      '<td class="amount center">' + formatMoney(player.capSavings) + '</td>' +
      '<td class="amount restructure center">' + formatMoney(player.restructureSavings) + '</td>' +
      '<td class="center sticky-cut">' + renderPlayerCutAction(player) + '</td>' +
      '<td class="center sticky-restructure">' + renderPlayerRestructureAction(player) + '</td>' +
      '</tr>';
  }).join('');
}

function renderPlayerCutAction(player) {
  var buttonHTML = '';
  if (player.status === 'active') {
    buttonHTML =
      '<button class="button button-cut" onclick="cutPlayer(' + player.id + ')">' +
      '<img src="' + crossIcon + '" width="20" height="20" alt="cut icon" />' +
      '</button>';
    return buttonHTML;
  } else if (player.status === 'cut') {
    return '' +
      '<button class="button button-undo" onclick="cutPlayer(' + player.id + ')">' +
      '<img src="' + minusRedIcon + '" width="20" height="20" alt="undo-cut icon" />' +
      '</button>';
  } else if (player.status === 'restructured') {
    return ''; // empty string instead of template literal
  }
}

function renderPlayerRestructureAction(player) {
  var buttonHTML = '';
  if (player.status === 'active') {
    if (player.restructurable) {
      buttonHTML =
        '<button class="button button-restructure" onclick="restructurePlayer(' + player.id + ')">' +
        '<img src="' + plusIcon + '" width="20" height="20" alt="restructure icon" />' +
        '</button>';
    }
    return buttonHTML;
  } else if (player.status === 'cut') {
    return ''; // empty string instead of template literal
  } else if (player.status === 'restructured') {
    return '' +
      '<button class="button button-undo" onclick="restructurePlayer(' + player.id + ')">' +
      '<img src="' + minusBlueIcon + '" width="20" height="20" alt="undo-restructure icon" />' +
      '</button>';
  }
}

let currentOfferAcceptanceStatus = null;

function showResponseModal(accepted) {
  const responseModal = document.getElementById('responseModal');
  const responseIcon = document.getElementById('responseIcon');
  const responseMessage = document.getElementById('responseMessage');

  currentOfferAcceptanceStatus = accepted;

  responseIcon.src = accepted ? checkGreenOutlineIcon : crossRedOutlineIcon;
  responseIcon.className = "response-icon " + (accepted ? "accept" : "reject");

  responseMessage.textContent = accepted ? "Offer Accepted!" : "Offer Rejected";
  responseMessage.className = "response-message " + (accepted ? "accept" : "reject");

  document.getElementById('restructureModal').style.display = 'none';
  responseModal.style.display = 'flex';

  setTimeout(() => {
    responseModal.style.display = 'none';
  }, 2000); // Close the modal after 2 seconds
}

function closeResponseModal() {
  document.getElementById('responseModal').style.display = 'none';

  if (!currentOfferAcceptanceStatus) {
    // Offer was rejected. Allow player to make another offer
    reSignPlayer(currentPlayer.id);
    return;
  }

  // Refresh the relevant table one more time to ensure it's up to date
  renderReSigningTable();
}

function formatStatus(status) {
  switch (status) {
    case 'restructured':
      return 'Restructured'; // For roster players who restructured
    case 'cut':
      return 'Cut'; // For roster players who were cut
    default:
      return status;
  }
}

function goToScreen3() {
  goToStep(3);
  renderTeamLogo(3);
  document.getElementById('rosterManagementModal').style.display = 'none';
  showScreen('screen3');
  renderReSigningTable();
  window.scrollTo(0, 0);
  // Cap summary will be updated via showScreen
}

function renderReSigningTable() {
  var playerStatusesToInclude = ["cut", "franchise", "signed", "re-signed"];
  var filteredPlayers = players.filter(function (p) {
    return (p.team === selectedTeamID && ((p.status !== "restructured" && p.freeAgent) || playerStatusesToInclude
      .indexOf(p.status) !== -1));
  });

  const positions = ["QB", "RB", "FB", "WR", "TE", "OT", "OG", "OC", "OL", "DT", "EDGE", "LB", "CB", "S", "K", "P", "LS"];
  filteredPlayers.sort((a, b) => {
    return positions.indexOf(a.position) - positions.indexOf(b.position);
  });
  document.getElementById('reSigningTable').innerHTML = filteredPlayers.map(function (player) {
    return '' +
      '<tr>' +
      '<td>' + player.name + '</td>' +
      '<td>' + player.position + '</td>' +
      '<td class="center">' + formatMoney(player.transitionValue) + '</td>' +
      '<td class="center">' + formatMoney(player.franchiseValue) + '</td>' +
      renderReSigningActions(player) +
      '</tr>';
  }).join('');
}

var transitionOrFranchiseTagSelected = false;

function renderSigningActions(player) {
  return '' +
    '<button class="sign-btn" onclick="reSignPlayer(' + player.id + ')">Offer</button>';
}

function renderReSigningActions(player) {
  // If player has been signed or tagged, show their status
  if (player.status === 'franchise') {
    return '' +
      '<td class="center sticky-1"></td>' +
      '<td class="center sticky-2"></td>' +
      '<td class="center sticky-3">' +
      '<button class="button button-undo" onclick="franchiseTagPlayer(' + player.id + ')">' +
      '<img src="' + minusBlueIcon + '" width="20" height="20" alt="minus icon" />' +
      '</button>' +
      '</td>';
  }
  if (player.status === 'transition') {
    return '' +
      '<td class="center sticky-1"></td>' +
      '<td class="center sticky-2">' +
      '<button class="button button-undo" onclick="transitionTagPlayer(' + player.id + ')">' +
      '<img src="' + minusBlueIcon + '" width="20" height="20" alt="minus icon" />' +
      '</button>' +
      '</td>' +
      '<td class="sticky-3"></td>';
  }
  if (player.status === 're-signed') {
    return '' +
      '<td class="center sticky-1">' +
      '<button class="button button-undo" onclick="reSignPlayer(' + player.id + ')">' +
      '<img src="' + checkGreenIcon + '" width="20" height="20" alt="check icon" />' +
      '</button>' +
      '</td>' +
      '<td class="center sticky-2"></td>' +
      '<td class="center sticky-3"></td>';
  }
  if (['signed', 'transition', 'franchise'].indexOf(player.status) !== -1) {
    return formatStatus(player.status);
  }

  // Show action buttons for both available free agents and cut players
  return '' +
    '<td class="center sticky-1">' +
    '<button class="tag-button resign-button" onclick="reSignPlayer(' + player.id + ', \'resigning\')">' +
    '<img src="' + plusIcon + '" width="20" height="20" alt="plus icon" />' +
    '</button>' +
    '</td>' +
    '<td class="center sticky-2">' +
    (player.transitionTagEligible && !transitionOrFranchiseTagSelected ?
      '<button class="tag-button transition-button" onclick="transitionTagPlayer(' + player.id + ')">' +
      '<img src="' + plusIcon + '" width="20" height="20" alt="plus icon" />' +
      '</button>' :
      '') +
    '</td>' +
    '<td class="center sticky-3">' +
    (player.franchiseTagEligible && !transitionOrFranchiseTagSelected ?
      '<button class="tag-button franchise-button" onclick="franchiseTagPlayer(' + player.id + ')">' +
      '<img src="' + plusIcon + '" width="20" height="20" alt="plus icon" />' +
      '</button>' :
      '') +
    '</td>';
}


function reSignPlayer(playerId, source) {
  // if player is currently re-signed, this is an action to undo that.
  let player = players.find(p => p.id === playerId);
  if (!player) {
    return; // Invalid state
  }
  if (player.status === 're-signed') {
    // Player was re-signed and now the offer is being cancelled
    selectedTeam.activeCapHit -= player.newContract.capHit;
    selectedTeam.capSpaceRemaining += player.newContract.capHit;
    player.status = player.oldStatus;
    player.contractYears = null;
    player.oldFreeAgentStatus = player.freeAgent;
    player.freeAgent =
      true; // We're undoing the action of re-signing the player, so they'll revert back to a free agent
    updateCapSummary();
    renderReSigningTable()
    return;
  }

  let event = "offer_newcontract_click";
  if (source && source === "resigning") {
    event = "player_resign_click";
  }

  showReSigningModal(playerId, source);
  // The cap will be updated when the restructure offer is accepted
}

function transitionTagPlayer(playerId) {
  let player = players.find(p => p.id === playerId);

  if (player.status === 'transition') {
    // Undo transition
    transitionOrFranchiseTagSelected = false;
    player.status = player.oldStatus; // Preserve old status for the cases where user undoes the transitiontag
    selectedTeam.activeCapHit -= player.transitionValue;
    selectedTeam.capSpaceRemaining += player.transitionValue;
  } else {
    if (selectedTeam.capSpaceRemaining < player.transitionValue) {
      // Team can't affort to transition tag this player
      alert("You do not have enough cap space remaining to transition tag this player");
      return;
    }
    transitionOrFranchiseTagSelected = true;
    // Mark this player for transition
    player.oldStatus = player.status;
    player.status = 'transition';
    selectedTeam.activeCapHit += player.transitionValue;
    selectedTeam.capSpaceRemaining -= player.transitionValue;
  }
  updateCapSummary();
  renderReSigningTable();
}

function submitNewContract() {
  const player = currentPlayer;

  if (player) {
    const moneyPerYear = document.getElementById('moneyPerYear').value.replace(/\D/g, '');
    const years = document.getElementById('years').value;
    const percentGuaranteed = document.getElementById('percentGuaranteed').value;

    const isAccepted = Math.random() >= 0.5;

    if (isAccepted) {
      // Set status to 'signed' regardless of whether they were cut or a free agent
      player.status = 'signed';
      player.team = selectedTeamID;
      var offerCapHit = getCapHitForContract(parseInt(moneyPerYear), parseInt(years));
      player.newContract = {
        moneyPerYear: parseInt(moneyPerYear),
        years: parseInt(years),
        percentGuaranteed: parseInt(percentGuaranteed),
        capHit: offerCapHit
      };
    }

    showResponseModal(isAccepted);
    availableListRenderer.renderAvailableList();
  }
}

function franchiseTagPlayer(playerId) {
  let player = players.find(p => p.id === playerId);

  if (player.status === 'franchise') {
    // Undo transition
    transitionOrFranchiseTagSelected = false;
    player.status = player.oldStatus; // Preserve old status for the cases where user undoes the transitiontag
    selectedTeam.activeCapHit -= player.franchiseValue;
    selectedTeam.capSpaceRemaining += player.franchiseValue;
    player.freeAgent = player
      .oldFreeAgentStatus; // If the player was a free agent earlier, it should be reversed accordingly
  } else {
    if (selectedTeam.capSpaceRemaining < player.franchiseValue) {
      // Team can't affort to transition tag this player
      alert("You do not have enough cap space remaining to franchise tag this player");
      return;
    }
    transitionOrFranchiseTagSelected = true;
    // Mark this player for transition
    player.oldStatus = player.status;
    player.status = 'franchise';
    player.oldFreeAgentStatus = player.freeAgent;
    player.freeAgent = false;
    selectedTeam.activeCapHit += player.franchiseValue;
    selectedTeam.capSpaceRemaining -= player.franchiseValue;
  }
  updateCapSummary();
  renderReSigningTable();
}

// Modify the nextScreen function to show summary
function nextScreen() {
  const previousStepNode = $(".step-node.three");
  if (previousStepNode) {
    removeClass(previousStepNode, "is-active-border");
  }
  const stepNode = $(".step-node.four");
  if (stepNode) {
    addClass(stepNode, "is-active");
    addClass(stepNode, "is-active-border");
  }
  const stepNum = $(".step-node.three .step-num");
  if (stepNum) {
    addClass(stepNum, "hidden");
  }
  const stepCompleted = $(".step-node.three .step-completed");
  if (stepCompleted) {
    removeClass(stepCompleted, "hidden");
  }
  const arrow = $(".arrow.four");
  if (arrow) {
    addClass(arrow, "blue");
    arrow.style.setProperty('--after-color', '#0857C3');
  }

  if (selectedTeam.capSpaceRemaining < 0) {
    alert("You must have a positive cap space remaining before proceeding.");
    return;
  }
  showRosterManagementSummary();
  window.scrollTo(0, 0);
}

function manageTeamContracts() {
  // Process each team
  teams.forEach(team => {
    if (team.id === selectedTeamID) {
      return;
    }

    let updatedCapHit = team.activeCapHit;
    let remainingCap = team.capSpaceRemaining;
    let spentOnResigning = 0;
    let hasTaggedPlayer = false;

    // Get team's players who are free agents
    const teamPlayers = players.filter(player =>
      player.team === team.teamCode &&
      player.freeAgent &&
      !JSON.parse(team.doNotSign).includes(player.position)
    );

    let maxPlayersToBeResigned = Math.round((teamPlayers.length * team.maxCapResigningPercentage) / 100);

    // First, consider tagging one player
    const tagEligiblePlayers = teamPlayers.filter(player =>
      player.franchiseTagEligible || player.transitionTagEligible
    );

    for (let i = 0; i < tagEligiblePlayers.length; i++) {
      const playerToTag = tagEligiblePlayers[i];
      if (remainingCap > 0) {
        const randRoll = Math.random();
        // Randomly choose between franchise and transition tag if both are available
        if (playerToTag.franchiseTagEligible &&
          remainingCap >= playerToTag.franchiseValue &&
          playerToTag.franchiseTagFrequency &&
          randRoll > (playerToTag.franchiseTagFrequency / 100)) {
          remainingCap -= playerToTag.franchiseValue;
          updatedCapHit += playerToTag.franchiseValue;
          hasTaggedPlayer = playerToTag.id;
          playerToTag.status = 'franchise';
          playerToTag.freeAgent = false;
          break; // Exit the loop
        } else if (playerToTag.transitionTagEligible &&
          remainingCap >= playerToTag.transitionValue &&
          playerToTag.transitionTagFrequency &&
          randRoll > (playerToTag.transitionTagFrequency / 100)) {
          remainingCap -= playerToTag.transitionValue;
          updatedCapHit += playerToTag.transitionValue;
          hasTaggedPlayer = playerToTag.id;
          playerToTag.status = 'transition';
          playerToTag.freeAgent = false;
          break; // Exit the loop
        }
      }
    }

    teamPlayers.sort((a, b) => b.perYearMaximum - a.perYearMaximum);

    let numResigned = 0;
    for (let i = 0; i < teamPlayers.length; i++) {
      let player = teamPlayers[i];
      // Skip if already tagged
      if (hasTaggedPlayer && (player.franchiseTagEligible || player.transitionTagEligible)) {
        continue;
      }

      // Check if player wants to re-sign based on reSigningPercent
      if (Math.random() * 100 <= player.reSigningPercent) {
        const yearsOffered = getRandomYears(player.minimumYears, player.maximumYears);
        const amountPerYear = calculateContractAmount(player.perYearMinimum, player.perYearMaximum);
        const totalContract = amountPerYear * yearsOffered;
        // Check if we can afford this contract under our re-signing cap
        var contractCapHit = getCapHitForContract(amountPerYear, yearsOffered);
        if (numResigned <= maxPlayersToBeResigned && remainingCap >= contractCapHit) {
          spentOnResigning += contractCapHit;
          remainingCap -= contractCapHit;
          updatedCapHit += contractCapHit;
          player.status = 're-signed';
          player.contractYears = yearsOffered;
          player.newContract = {
            moneyPerYear: amountPerYear,
            years: yearsOffered,
            percentGuaranteed: Math.round(Math.random() * 100 / 2),
            capHit: contractCapHit
          }
          player.freeAgent = false;
          numResigned++;
        } else {
          break;
        }
      }
    }

    team.capSpaceRemaining = remainingCap;
    team.activeCapHit = updatedCapHit;
  });
}

async function showContractSummary() {
  if (!IS_DESKTOP) {
    const stepsBar = document.querySelector('.steps-wrap .steps-bar');
    stepsBar.scrollBy({
      left: 180,
      behavior: 'smooth'
    });
  }
  const previousStepNode = $(".step-node.four");
  if (previousStepNode) {
    removeClass(previousStepNode, "is-active-border");
  }
  const stepNode = $(".step-node.five");
  if (stepNode) {
    addClass(stepNode, "is-active");
    addClass(stepNode, "is-active-border");
  }
  const stepNum = $(".step-node.four .step-num");
  if (stepNum) {
    addClass(stepNum, "hidden");
  }
  const stepCompleted = $(".step-node.four .step-completed");
  if (stepCompleted) {
    removeClass(stepCompleted, "hidden");
  }
  const arrow = $(".arrow.five");
  if (arrow) {
    addClass(arrow, "blue");
    arrow.style.setProperty('--after-color', '#0857C3');
  }

  goToStep(4);
  renderTeamLogo(4);
  manageTeamContracts();

  await yieldToMain();

  const summaryBody = document.getElementById('contractRenewalBody');

  // Combine and process all modified players
  const modifiedPlayers = players.filter(p =>
    p.status !== 'active' && p.status !== 'cut' && p.status !== "restructured" // Only modified players
  );

  modifiedPlayers.sort((a, b) => getPlayerValue(b) - getPlayerValue(a));
  modifiedPlayers.sort((a, b) => a.team.localeCompare(b.team));
  let userChanges = modifiedPlayers.filter(p =>
    p.team === selectedTeam.id
  );

  const resignedPlayers = [];
  const transitionPlayers = [];
  const franchisePlayers = [];
  userChanges.forEach(player => {
    if (player.status === "re-signed") {
      resignedPlayers.push(player.name);
    }

    if (player.status === "transition") {
      transitionPlayers.push(player.name);
    }

    if (player.status === "franchise") {
      franchisePlayers.push(player.name);
    }
  })

  if (resignedPlayers.length || transitionPlayers.length || franchisePlayers.length) {
    trackGAEventForPage("resign/transition/franchise_click", {
      team: userSelectedGMTeam,
      resignedPlayers,
      transitionPlayers,
      franchisePlayers,
    });
  }

  let botChanges = modifiedPlayers.filter(p =>
    p.team !== selectedTeam.id
  );

  userChanges.sort((a, b) => getPlayerValue(b) - getPlayerValue(a));

  // Group botChanges by team
  const groupedBotChanges = botChanges.reduce((acc, player) => {
    if (!acc[player.team]) {
      acc[player.team] = [];
    }
    acc[player.team].push(player);
    return acc;
  }, {});

  // Sort team names alphabetically
  const sortedTeamNames = Object.keys(groupedBotChanges).sort();

  // Internal function to render a table row
  function renderTableRow(player, isOwnTeam) {
    return '' +
      '<tr ' + (isOwnTeam ? 'class="player-own"' : '') + '>' +
      '<td>' + player.name + '</td>' +
      '<td class="center">' + player.position + '</td>' +
      '<td class="center">' +
      '<div class="team-data-container">' +
      '<img src="' + teamLogos[player.team] + '" alt="' + player.team + '" />' +
      player.team +
      '</div>' +
      '</td>' +
      '<td class="center">' + formatContractStatus(player.status) + '</td>' +
      '<td class="center">' + formatMoney(getPlayerValue(player)) + '</td>' +
      '<td class="center">' + (player.contractYears ? player.contractYears : 1) + '</td>' +
      '</tr>';
  }

  // Render userChanges first
  let htmlContent = userChanges.map(player => renderTableRow(player, true)).join('');

  // Render botChanges in alphabetical order of team names
  sortedTeamNames.forEach(teamName => {
    const teamPlayers = groupedBotChanges[teamName]
      .sort((a, b) => getPlayerValue(b) - getPlayerValue(a)); // Sort by value descending

    htmlContent += teamPlayers.map(player => renderTableRow(player, false)).join('');
  });

  summaryBody.innerHTML = htmlContent;
  document.getElementById('contractRenewalModal').style.display = 'flex';
  window.scrollTo(0, 0);
}

function formatContractStatus(status) {
  switch (status) {
    case 'restructured':
      return 'Restructured';
    case 're-signed':
      return 'Re-signed';
    case 'transition':
      return 'Transition Tagged';
    case 'franchise':
      return 'Franchise Tagged';
    default:
      return status;
  }
}

function getPlayerValue(player) {
  if (player.status === 're-signed' || player.status === 'signed') {
    return player.newContract.moneyPerYear;
  }
  if (player.status === 'franchise') {
    return player.franchiseValue;
  }
  if (player.status === 'transition') {
    return player.transitionValue;
  }
  if (player.status === 'restructured') {
    return player.restructureCapHit
  }
  if (player.status === 'cut') {
    return player.deadMoney;
  }
}

function getContractYears(player) {
  if (player.status === 'restructured' && player.newContract) {
    return player.newContract.years;
  }
  return '-'; // For cut players or other statuses
}

function proceedToNextPhase() {
  document.getElementById('contractRenewalModal').style.display = 'none';
  showScreen('screen4');
  initializeFreeAgency();
  updateTeamNeeds();
  window.scrollTo(0, 0);
}

function initializeFreeAgency() {
  // Update cap space display
  updateCapSpaceDisplay();

  // Initialize position filters
  initializeFilters();

  enableSimulationTablesScrollControls();

  // Render initial player lists
  renderRosterList();
  availableListRenderer.renderAvailableList(true);
}

function updateCapSpaceDisplay() {
  document.getElementById('capSpaceDisplay').textContent =
    formatMoney(selectedTeam.capSpaceRemaining);
}

function initializeFilters() {
  // Add click handlers for roster filters
  document.querySelectorAll('#rosterFilters .position-filter').forEach(filter => {
    filter.addEventListener('click', (e) => {
      toggleFilter(e.target, 'roster');
      renderRosterList();
    });
  });

  // Add click handlers for available player filters
  document.querySelectorAll('#availableFilters .position-filter').forEach(filter => {
    filter.addEventListener('click', (e) => {
      toggleFilter(e.target, 'available');
      availableListRenderer.renderAvailableList(true);
    });
  });
}

function toggleFilter(filterElement, section) {
  // Remove active class from all filters in the section
  document.querySelectorAll("#" + section + "Filters .position-filter")
    .forEach(f => f.classList.remove('active'));
  // Add active class to clicked filter
  filterElement.classList.add('active');
}

var scrollControlResizeHandlers = [];

function cleanupScrollControlResizeHandlers() {
  scrollControlResizeHandlers.forEach(function (handler) {
    window.removeEventListener("resize", handler);
  });
  scrollControlResizeHandlers = [];
}

function enableSimulationTablesScrollControls() {
  const rosterFilters = document.getElementById("rosterFilters");
  const availableFilters = document.getElementById("availableFilters");

  if (!(rosterFilters && availableFilters)) return;

  const rosterFiltersContainer = rosterFilters.querySelector(".filters-container");
  const rosterFiltersLeftCtrl = rosterFilters.querySelector(".move-left-btn");
  const rosterFiltersRightCtrl = rosterFilters.querySelector(".move-right-btn");
  const availableFiltersContainer = availableFilters.querySelector(".filters-container");
  const availableFiltersLeftCtrl = availableFilters.querySelector(".move-left-btn");
  const availableFiltersRightCtrl = availableFilters.querySelector(".move-right-btn");

  function handleScrollControls(container, leftCtrl, rightCtrl) {
    if (!(container && leftCtrl && rightCtrl)) return;

    const updateControlsVisibility = () => {
      const isScrollable = container.scrollWidth > container.clientWidth;
      leftCtrl.style.display = isScrollable ? "flex" : "none";
      rightCtrl.style.display = isScrollable ? "flex" : "none";
    };

    leftCtrl.addEventListener("click", () => {
      container.scrollBy({ left: -50, behavior: "smooth" });
    });

    rightCtrl.addEventListener("click", () => {
      container.scrollBy({ left: 50, behavior: "smooth" });
    });

    updateControlsVisibility();

    window.addEventListener("resize", updateControlsVisibility);
    scrollControlResizeHandlers.push(updateControlsVisibility);
  }

  handleScrollControls(rosterFiltersContainer, rosterFiltersLeftCtrl, rosterFiltersRightCtrl);
  handleScrollControls(availableFiltersContainer, availableFiltersLeftCtrl, availableFiltersRightCtrl);
}

function renderRosterList() {
  const playersForCurrentTeam = players.filter((p) => p.team === selectedTeamID && p.status !== 'cut');
  const activeFilter = document.querySelector('#rosterFilters .active').textContent;
  const rosterPlayers = playersForCurrentTeam.filter(p => !p.freeAgent);
  const filteredPlayers = filterPlayers(rosterPlayers, activeFilter);

  const positionOrder = ["QB", "RB", "WR", "TE", "OT", "OG", "OC", "DT", "EDGE", "LB", "CB", "S", "LS", "FB", "K",
    "P"
  ];

  const sortedPlayers = filteredPlayers.sort((a, b) => {
    // Sort by positionOrder first
    const positionA = positionOrder.indexOf(a.position);
    const positionB = positionOrder.indexOf(b.position);

    if (positionA !== positionB) {
      return positionA - positionB; // Positions are different, sort by position order
    }

    // If positions are the same, sort by capHit or franchiseValue
    const valueA = a.status === 'franchise' ? a.franchiseValue : a.capHit;
    const valueB = b.status === 'franchise' ? b.franchiseValue : b.capHit;

    return valueB - valueA; // Sort descending by value
  });

  document.getElementById('rosterList').innerHTML = sortedPlayers.map(function (player) {
    return '' +
      '<tr class="player-row">' +
      '<td class="player">' + player.name + '</td>' +
      '<td class="position pos">' + player.position + '</td>' +
      '<td class="small-text center status">' + (player.status ? capitalizeFirstLetter(player.status) : '-') +
      '</td>' +
      '<td class="center cap">' + formatMoney(player.status === 'franchise' ? player.franchiseValue : player
        .capHit) + '</td>' +
      '</tr>';
  }).join('');

}

function createAvailableListRenderer() {
  let sortedPlayers = [];
  const container = document.getElementById('availableList').closest(".table-wrapper");
  const tableContainer = document.getElementById('availableList');
  const rowHeight = 43;
  const buffer = 5; // Number of buffer rows to render above and below the viewport
  const minVisibleRows = 15; // Minimum number of rows to display

  function renderRows() {
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    let endIdx = Math.min(sortedPlayers.length, Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer);

    // Ensure at least `minVisibleRows` are shown
    if (endIdx - startIdx < minVisibleRows) {
      endIdx = Math.min(sortedPlayers.length, startIdx + minVisibleRows);
    }

    const visiblePlayers = sortedPlayers.slice(startIdx, endIdx);
    const offsetY = startIdx * rowHeight;

    tableContainer.innerHTML =
      '<div style="height: ' + offsetY + 'px;"></div>' +
      visiblePlayers.map(function (player) {
        return '' +
          '<tr class="player-row" style="height: ' + rowHeight + 'px;">' +
          '<td class="player">' + player.name + '</td>' +
          '<td class="position pos">' + player.position + '</td>' +
          '<td></td>' +
          '<td class="center">' +
          renderSigningActions(player) +
          '</td>' +
          '</tr>';
      }).join('') +
      '<div style="height: ' + ((sortedPlayers.length - endIdx) * rowHeight) + 'px;"></div>';
  }

  return {
    renderAvailableList: function (alphabeticalSort) {
      const activeFilter = document.querySelector('#availableFilters .active').textContent;
      // Get both original free agents and cut players
      const availablePlayers = players.filter(p =>
        // Original free agents
        (p.freeAgent && (p.status === "active" || p.status === "cut"))
      );
      var filteredPlayers = filterPlayers(availablePlayers, activeFilter);
      var searchInput = document.getElementById('availablePlayerSearch');
      if (searchInput && searchInput.value.trim()) {
        var searchTerm = searchInput.value.trim().toLowerCase();
        filteredPlayers = filteredPlayers.filter(function (p) {
          return p.name.toLowerCase().includes(searchTerm);
        });
      }
      if (alphabeticalSort) {
        sortedPlayers = filteredPlayers.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        sortedPlayers = filteredPlayers.sort((a, b) => b.perYearMinimum - a.perYearMinimum);
      }

      // Remove any existing scroll event listener
      container.removeEventListener('scroll', renderRows);

      // Add the new scroll event listener
      container.addEventListener('scroll', renderRows);

      container.scrollTop = 0;
      renderRows(container);
    }
  }
}

function filterPlayers(playerList, position) {
  if (position === 'ALL') return playerList;
  return playerList.filter(p => p.position === position);
}

function makeOffer(playerId) {
  // Reuse existing restructure modal for offers
  showReSigningModal(playerId);
}

function runFreeAgencySimulation() {
  allTeamsToOfferContracts();
  showFreeAgencyModal();
  window.scrollTo(0, 0);
  // On completion, call completeAndShowResults();
}

function showFreeAgencyModal() {
  let freeAgencyHTML = '';
  let freeAgencyModal = document.querySelector("#freeAgencyModal .modal");
  let tableBody = freeAgencyModal.querySelector("tbody");
  const playersWithNewContract = players.filter(p => p.status === 'signed');
  // Get players picked by the user
  const userPickedPlayers = playersWithNewContract.filter(p => p.team === selectedTeam.id);
  const botPickedPlayers = playersWithNewContract
    .filter(p => p.team !== selectedTeam.id)
    .sort((a, b) => {
      const teamComparison = a.team.localeCompare(b.team);
      if (teamComparison !== 0) {
        return teamComparison;
      }
      return getPlayerValue(b) - getPlayerValue(a);
    });

  const playersToDisplay = [...userPickedPlayers, ...botPickedPlayers];

  playersToDisplay.forEach(function (p) {
    freeAgencyHTML += '' +
      '<tr ' + (p.team === selectedTeam.id ? 'class="player-own"' : '') + '>' +
      '<td>' + p.name + '</td>' +
      '<td class="position">' + p.position + '</td>' +
      '<td class="center team">' +
      '<div class="team-data-container">' +
      '<img src="' + teamLogos[p.team] + '" alt="' + p.team + '" />' +
      p.team +
      '</div>' +
      '</td>' +
      '<td class="center">' + formatMoney(getPlayerValue(p)) + '</td>' +
      '<td class="center">' + (p.newContract.years ? p.newContract.years : 1) + '</td>' +
      '</tr>';
  });
  tableBody.innerHTML = freeAgencyHTML;
  freeAgencyModal.parentElement.style.display = "flex";
}

function allTeamsToOfferContracts() {
  const recommendations = {}; // Object to store recommendations by team ID
  const recommendedPlayers = {}; // Object to track players already recommended

  // helper function to create a new contract for signing on a free-agent player
  const calculateAffordableContract = (player, team) => {
    const yearlyBudget = team.capSpaceRemaining;
    const maxYearlySpend = Math.min(player.perYearMaximum, yearlyBudget);

    return {
      amount: calculateContractAmount(player.perYearMinimum, maxYearlySpend),
      years: getRandomYears(player.minimumYears, player.maximumYears),
      guaranteed: Math.max(
        player.guaranteedMinimum,
        (maxYearlySpend * 0.4) // 40% guaranteed as baseline
      )
    };
  };

  // function that gives us how many players for a position the team can sign
  // it also gives us the final need score for that position after signing all of these recommendations
  // for now, the need score is halved for each new recommendation for a free agent signing
  // this should be tweaked based on our needs
  function getNumSigningRecsForTeamPosition(needVal, numRecs = 0) {
    const updatedNeedVal = needVal / 4;
    const updatedNumRecs = needVal + 1;
    if (needVal > 1) {
      return getNumSigningRecsForTeamPosition(updatedNeedVal, updatedNumRecs);
    } else {
      return [numRecs, needVal];
    }
  }

  // this helper function is used for generating recommendations for 
  // a team's eligible free agent signings for a position
  // we generate a random index to get a player that can be pushed into the team's list of recommendations
  // we get the signingLimit from getNumSigningRecsForTeamPosition()
  // this process of getting recommendations for a position continues till the list of players has been exhausted
  // OR the number of recommendations have exceeded the signingLimit
  // NOTE: we want to ensure that a player with a 100% signing chance is always added to the recommendations
  function findPositionRecommendations(team, prioritizedPlayers, otherPlayers, signingLimit, numRecommended = 0,
    need) {
    let player;

    const recommendationsSufficient = numRecommended >= signingLimit;
    const playersToRecommendDoNotExist = prioritizedPlayers.length === 0 && otherPlayers.length === 0;

    if (recommendationsSufficient || playersToRecommendDoNotExist) {
      return true;
    }

    if (prioritizedPlayers.length > 0) {
      const randPrioritized = Math.floor(Math.random() * prioritizedPlayers.length);
      player = prioritizedPlayers[randPrioritized];
      prioritizedPlayers.splice(randPrioritized, 1);
    } else if (otherPlayers.length > 0) {
      const randOthers = Math.floor(Math.random() * otherPlayers.length);
      player = otherPlayers[randOthers];
      otherPlayers.splice(randOthers, 1);
    }

    const contract = calculateAffordableContract(player, team);

    if (!recommendations[team.id]) {
      recommendations[team.id] = [];
    }

    if (!recommendedPlayers[player.id]) {
      recommendations[team.id].push({
        team: team.id,
        player: player.name,
        playerID: player.id,
        position: player.position,
        newContract: {
          moneyPerYear: contract.amount,
          years: contract.years,
          percentGuaranteed: contract.guaranteed
        },
        needScore: need,
        signingLikelihood: player.freeAgentSigningPercent
      });

      numRecommended += 1;

      recommendedPlayers[player.id] = team.id;
    }

    return findPositionRecommendations(team, prioritizedPlayers, otherPlayers, signingLimit, numRecommended, need);
  }

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const teamIsSelectedByPlayer = team.id === selectedTeam.id;
    const teamDoesNotHaveCapSpace = team.capSpaceRemaining <= 0;

    const alwaysSignPositions = {};

    if (teamIsSelectedByPlayer || teamDoesNotHaveCapSpace) {
      continue;
    }

    const doNotSignPositions = JSON.parse(team.doNotSign || '[]');

    const numRecommendations = {};

    const prioritizedNeeds = team.teamNeeds && typeof team.teamNeeds === 'object' ?
      Object.entries(team.teamNeeds)
        .filter(([pos, need]) => need > 0 && !doNotSignPositions.includes(pos))
        .sort((a, b) => b[1] - a[1]) : [];

    // get the number of free-agent signing recommendations allowed 
    // for each position in the team
    for (let j = 0; j < prioritizedNeeds.length; j++) {
      const [pos, need] = prioritizedNeeds[j];
      if (!numRecommendations[pos]) {
        numRecommendations[pos] = getNumSigningRecsForTeamPosition(need)[0];
      }
    }

    // Get recommendations for each of the team's position needs
    for (let k = 0; k < prioritizedNeeds.length; k++) {
      const [pos, need] = prioritizedNeeds[k];
      const availablePlayers = players.filter(player =>
        player.freeAgent &&
        player.team !== team.id &&
        player.position === pos &&
        player.perYearMaximum <= team.capSpaceRemaining &&
        !recommendedPlayers[player.id]
      );

      const signingLimit = numRecommendations[pos]; // signing limit for the position

      const prioritizedPlayers = availablePlayers.filter(player => player.freeAgentSigningPercent === 100);
      const otherPlayers = availablePlayers.filter(player => player.freeAgentSigningPercent !== 100);

      findPositionRecommendations(team, prioritizedPlayers, otherPlayers, signingLimit, 0, need);
    }

    const reccoForThisTeam = recommendations[team.id] || [];
    // Iterate through the recommendations
    reccoForThisTeam.forEach((oneRecommendation, idx) => {
      const luck = Math.floor(Math.random() * 100) + 1;
      var recCapHit = getCapHitForContract(oneRecommendation.newContract.moneyPerYear, oneRecommendation.newContract.years);
      const cannotAffordPlayer = team.capSpaceRemaining - recCapHit < 0;
      const teamNeedScore = team.teamNeeds[oneRecommendation.position] || 0;
      const alwaysSignPositionsArr = JSON.parse(team.alwaysSign || '[]');
      const playerShouldBeSigned = alwaysSignPositionsArr.includes(oneRecommendation.position) && !!
        alwaysSignPositions[oneRecommendation.position];
      // If the player should always be signed and the team can afford them, bypass the condition
      if (
        (!playerShouldBeSigned || cannotAffordPlayer) &&
        // Apply conditions if the player is not a "must sign" or the team can't afford them
        (cannotAffordPlayer || luck > oneRecommendation.signingLikelihood || teamNeedScore < 1)
      ) {
        // this ensures that other teams can pick this player up as a recommendation,
        // since this current team is unable to sign the player
        recommendedPlayers[oneRecommendation.playerID] = "";
        return;
      }
      if (playerShouldBeSigned) {
        alwaysSignPositions[oneRecommendation.position] = true;
      }
      // reduce the team need score for this position by half
      team.teamNeeds[oneRecommendation.position] = teamNeedScore / 4;
      team.capHit += recCapHit;
      team.capSpaceRemaining -= recCapHit;
      let thisPlayer = players.find(p => p.id === oneRecommendation.playerID);
      thisPlayer.status = 'signed';
      thisPlayer.team = team.id;
      oneRecommendation.newContract.capHit = recCapHit;
      thisPlayer.newContract = oneRecommendation.newContract;
    });
  }
}

function completeAndShowResults() {
  document.querySelector("#freeAgencyModal").style.display = "none";
  goToStep(5);
  renderTeamLogo(5);
  showScreen('screen5');
  renderResults();
  window.scrollTo(0, 0);
}

function renderResults() {
  // Update final cap summary
  updateCapSummary();

  const positionOrder = ["QB", "RB", "WR", "TE", "OT", "OG", "OC", "DT", "EDGE", "LB", "CB", "S", "LS", "FB", "K",
    "P"
  ];

  const statusesToFilter = ["franchise", "signed", "re-signed", "transition", "active", "restructured"];
  let myTeamPlayers = players.filter(p => p.team === selectedTeamID && statusesToFilter.includes(p.status) && !p
    .freeAgent);


  const sortedPlayers = myTeamPlayers.sort((a, b) => {
    const positionA = positionOrder.indexOf(a.position);
    const positionB = positionOrder.indexOf(b.position);

    if (positionA !== positionB) {
      return positionA - positionB; // Sort by position order
    }

    // If positions are the same, sort by getFinalValue
    return getFinalValue(b) - getFinalValue(a); // Descending order by value
  });

  freeAgencySimulatorResultPlayers = sortedPlayers;

  const resultListMobile = document.getElementById("resultListMobile");
  const resultListOdd = document.getElementById('resultListOdd');
  const resultListEven = document.getElementById('resultListEven');

  if (resultListMobile) {
    resultListMobile.innerHTML = "";
  } else if (resultListOdd && resultListEven) {
    resultListOdd.innerHTML = "";
    resultListEven.innerHTML = "";
  }

  sortedPlayers.forEach((player, index) => {
    const playerRowHTML = renderPlayerRow(player, index + 1);
    if (resultListMobile) {
      resultListMobile.innerHTML += playerRowHTML;
    } else if (resultListOdd && resultListEven) {
      if ((index + 1) % 2 === 0) {
        resultListEven.innerHTML += playerRowHTML;
      } else {
        resultListOdd.innerHTML += playerRowHTML;
      }
    }
  });
}

function renderPlayerRow(player, number) {
  return '' +
    '<tr class="results-row">' +
    '<td>' + player.name + '</td>' +
    '<td>' + player.position + '</td>' +
    '<td class="center">' + formatFinalStatus(player.status) + '</td>' +
    '<td>' + formatMoney(getFinalValue(player)) + '</td>' +
    '</tr>';
}


function formatFinalStatus(status) {
  switch (status) {
    case 'restructured':
      return 'Restructured';
    case 'cut':
      return 'Cut';
    case 're-signed':
      return 'Re-signed';
    case 'transition':
      return 'Tr. Tagged';
    case 'franchise':
      return 'Fr. Tagged';
    case 'signed':
      return 'Signed';
    default:
      return "-";
  }
}

function getFinalValue(player) {
  switch (player.status) {
    case 'signed':
      return player.newContract.moneyPerYear;
    case 'restructured':
      return player.capHit;
    case 'transition':
      return player.transitionValue;
    case 'franchise':
      return player.franchiseValue;
    case 'cut':
      return player.deadMoney;
    default:
      return player.capHit;
  }
}

document.querySelector('.continue-btn.free-agency').addEventListener('click', runFreeAgencySimulation);


function goToStep(stepNumber) {
  const steps = document.querySelectorAll('.step');
  const connectors = document.querySelectorAll('.step-connector');

  steps.forEach((step, index) => {
    const circle = step.querySelector('.step-circle');

    // Reset all classes first
    step.classList.remove('completed', 'current', 'pending');

    if (index + 1 < stepNumber) {
      // Previous steps
      step.classList.add('completed');
      circle.innerHTML =
        '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (index + 1 === stepNumber) {
      // Current step
      step.classList.add('current');
      circle.innerHTML = String(index + 1).padStart(2, '0');
    } else {
      // Future steps
      step.classList.add('pending');
      circle.innerHTML = String(index + 1).padStart(2, '0');
    }
  });

  // Update connectors
  connectors.forEach((connector, index) => {
    if (index < stepNumber - 1) {
      connector.classList.add('completed');
    } else {
      connector.classList.remove('completed');
    }
  });
}

function showNextScreenLoadingPopup(text) {
  const loadingPopup = document.createElement("div");
  addClass(loadingPopup, "loading-next-screen-popup");
  const loadingPopupText = document.createElement("span");
  addClass(loadingPopupText, "loading-popup-text");
  loadingPopupText.innerHTML = text;
  loadingPopup.appendChild(loadingPopupText);
  document.body.appendChild(loadingPopup);
  setTimeout(() => {
    const loadingPopup = $(".loading-next-screen-popup");
    if (loadingPopup) {
      loadingPopup.remove();
    }
  }, 3000);
}

async function initializeOffseasonManager() {
  trackGAEventForPage("navigate_to_offseason_manager", {
    team: userSelectedGMTeam,
  });

  showNextScreenLoadingPopup("Manage your roster for the next season with our Offseason Manager...");

  collectTeamsConferenceAndRecordsRank(conferenceData, "previous");
  collectTeamsDivisionRank(divisionData, "previous");
  collectPlayoffMatchesData(playoffMatchesData, "previous");
  closeStandingsDraftOrderPopup();

  await yieldToMain();

  const previousStepNode = $(".step-node.two");
  if (previousStepNode) {
    removeClass(previousStepNode, "is-active-border");
  }
  const stepNode = $(".step-node.three");
  if (stepNode) {
    addClass(stepNode, "is-active");
    addClass(stepNode, "is-active-border");
  }
  const stepNum = $(".step-node.two .step-num");
  if (stepNum) {
    addClass(stepNum, "hidden");
  }
  const stepCompleted = $(".step-node.two .step-completed");
  if (stepCompleted) {
    removeClass(stepCompleted, "hidden");
  }
  const arrow = $(".arrow.three");
  if (arrow) {
    addClass(arrow, "blue");
    arrow.style.setProperty('--after-color', '#0857C3');
  }

  const continueBtn = document.getElementById('continueBtn');
  if (continueBtn) {
    continueBtn.removeEventListener("click", initializeOffseasonManager);
  }
  const bottomInfoContainer = $(".info-text-continue-btn-container");
  if (bottomInfoContainer) {
    addClass(bottomInfoContainer, "hidden");
  }

  const playoffPredictorSection = $("#screen-predict-playoffs");
  if (playoffPredictorSection) {
    addClass(playoffPredictorSection, "hidden");
  }

  // Free playoff predictor data no longer needed (section DOM is reused for next-season predictions)
  defaultWeekMatchesData = [];
  defaultTeamsData = {};
  playerOffCompletedMatchesData = {};
  if (playoffSimulationTimeoutId) {
    clearTimeout(playoffSimulationTimeoutId);
    playoffSimulationTimeoutId = null;
  }

  const offSeasonManagerSection = $("#screen-offseason-manager");
  if (offSeasonManagerSection) {
    removeClass(offSeasonManagerSection, "hidden");
  }

  selectedTeamID = userSelectedGMTeam;
  selectFreeAgencySimulatorTeam();
  window.scrollTo(0, 0);

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  });

  const instructionsBtns = document.querySelectorAll("button.instructions-link");
  instructionsBtns.forEach(instructionsBtn => {
    instructionsBtn.addEventListener("click", () => {
      const instructionsModal = document.getElementById("instructionsModal");
      if (instructionsModal) {
        instructionsModal.style.display = "flex"; // Show the modal
      }
    });
  });

  const tabs = document.querySelectorAll('.roster-tables-tabs .tab');
  const panels = document.querySelectorAll('.roster-panel');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach((panel, panelIndex) => {
        if (index === panelIndex) {
          panel.classList.remove('m-hidden');
        } else {
          panel.classList.add('m-hidden');
        }
      });

      enableSimulationTablesScrollControls();
    });
  });
}

var rounds;
var executionRate;
var userSelectedTeams = [];
var pauseDraftFlag = false;
var offersList = [];
var currentOfferTeam;
var currentSection;
var pausedManually;
var feedbackAdded = false;
let tradesCompletedCount = 0;
const roundText = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh"];
var selectedPositionFilter = "all";

var tradesData = [];

document.addEventListener("click", hideOffers);
document.addEventListener("click", hideTradeDetails);
document.addEventListener("click", closePlayerInfoPopup);
document.addEventListener("click", closeTeamPicksInfoPopup);

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

function hideOffers(event) {
  var offersContainer = $(".offer-container");
  var offersOverlay = $(".mds-overlay");
  if (!offersContainer) return;
  if (typeof offersContainer != "object") return;
  if (!offersContainer.classList.contains("hidden") && (!event.target.closest(
    ".offer-container") || event.target.closest(".close-icon")) &&
    !event.target.closest(".show-offers")) {
    addClass(offersContainer, "hidden");
    addClass(offersOverlay, "hidden");
  }
  if (event.target.closest(".offer-container .close-icon")) {
    hideResumeDraftBtn();
    showPauseDraftBtn();
    disablePauseDraftBtn();

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
  var tradesOverlay = $(".mds-overlay");
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
    for (var team of mdsTeamsList) {
      if (team.shortName === pick.shortName) {
        team.draftPicks.push(pick);
        pick.originalTeam = team;
        pick.currentTeam = team;
      }
    }
  }
};

function assignMaxPositionDraftCount() {
  mdsTeamsList.forEach(team => {
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

function filterMDSPlayers(position) {
  if (selectedPositionFilter === position) {
    return;
  }

  selectedPositionFilter = position;
  var playersList = $all(".players-list .player");
  var offenceFiltersHolder = $(".positions-filters .offence");
  var defenceFiltersHolder = $(".positions-filters .defence");
  var stFiltersHolder = $(".positions-filters .st");

  var positionButtonsHolder = $all(".players-positions .positions");
  if (positionButtonsHolder) {
    for (var positionBtn of positionButtonsHolder) {
      removeClass(positionBtn, "selected");
    }

    var selectedPosition = $(".players-positions .positions." + position);
    if (selectedPosition) {
      addClass(selectedPosition, "selected");
    }
  }

  var selectedFilter = $(".positions-filters .positions .selected");
  if (selectedFilter) {
    removeClass(selectedFilter, "selected");
  }

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

async function startDraftHelper() {
  showDraftUI();

  await yieldToMain();

  const toolContainer = $(".pfn-content-container");
  if (toolContainer) {
    toolContainer.style.marginBottom = "unset";
  }

  var seoHeaderText = $(".seo-header-text");
  if (seoHeaderText) {
    addClass(seoHeaderText, "hidden");
  }

  rounds = 7;
  executionRate = 150;
  userSelectedTeams.push(userSelectedGMTeam);

  currentSection = "result";

  disableShowOffersBtn();

  assignPicks();
  assignMaxPositionDraftCount();

  await yieldToMain();

  fillRoundPics();
  fillPlayersList();

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
    updateMDSTeamNeeds(currentPick.number);
  }

  var overlay = document.createElement("div");
  addClass(overlay, "hidden");
  addClass(overlay, "mds-overlay");
  document.body.appendChild(overlay);

  setTimeout(() => {
    fillPlayerForAPick();
  }, 5500);
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

  playerInfoPopup = document.getElementById("player-info").content.cloneNode(true);
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

    if (playerData.playerLink === "") {
      var fullRepostBtn = playerInfoPopup.querySelector(".full-report-btn");
      if (fullRepostBtn) {
        addClass(fullRepostBtn, "hidden");
      }
    } else {
      var fullReportBtn = playerInfoPopup.querySelector(".full-report-btn");
      fullReportBtn.setAttribute("href", playerData.playerLink);
    }

    var overlay = $(".mds-overlay");
    if (overlay) {
      removeClass(overlay, "hidden");
    } else {
      var overlay = document.createElement("div");
      addClass(overlay, "mds-overlay");
      document.body.appendChild(overlay);
    }

    addClass(playerInfoPopup, "popup");
    document.body.appendChild(playerInfoPopup)
  }
}

function closePlayerInfoPopup(event) {
  var playerInfoPopup = $(".player-info-popup");
  var teamPicksPopup = $(".team-picks-info-popup");
  var overlay = $(".mds-overlay");

  if (!playerInfoPopup) return;
  if (typeof playerInfoPopup != "object") return;
  if (!playerInfoPopup.classList.contains("hidden") && (!event.target.closest(
    ".player-info-popup") || event.target.closest(".player-info-popup .player-info-close-icon-container") ||
    event.target.closest(".player-info-popup .close-btn")) &&
    !event.target.closest(".player-info-btn") && !event.target.closest(".player-details") &&
    !event.target.closest(".traded-player-name-position-container")) {
    if (playerInfoPopup && overlay) {
      playerInfoPopup.remove();
      if (!teamPicksPopup) {
        addClass(overlay, "hidden");
      }
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

  var pickContainer = getCurrentPickContainer();
  var pickNumber;
  if (pickContainer) {
    let selectedPlayerContainer = pickContainer.querySelector(".traded-player-name-position-container");
    if (selectedPlayerContainer) {
      selectedPlayerContainer.dataset.name = target.dataset.name;
      selectedPlayerContainer.style.cursor = "pointer";
      selectedPlayerContainer.addEventListener("click", showPlayerInfo);
    }
    pickContainer.querySelector(".player-name").innerHTML = target.dataset.name;
    pickContainer.querySelector(".player-position").innerHTML = target.dataset.position + " " + target.dataset
      .draftfrom;
    removeClass(pickContainer, "currentPick");
    pickNumber = parseInt(pickContainer.dataset.number);

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
    hideUserSelectionIcon();
    showPauseDraftBtn();
    enablePauseDraftBtn();
    disableShowOffersBtn();

    var currentPickIndex = picksList.findIndex((i) => i.onTheClock === true);
    picksList[currentPickIndex].onTheClock = false;
    picksList[currentPickIndex + 1].onTheClock = true;
    pauseDraftFlag = false;

    var pickIndex = picksList.findIndex((item) => item.number === pickNumber);
    picksList[pickIndex].playerSelection = player[0];

    const pickTeam = picksList[pickIndex].currentTeam.shortName;
    if (pickTeam) {
      var teamIndex = mdsTeamsList.findIndex((item) => item.shortName === pickTeam);
      if (teamIndex > -1) {
        mdsTeamsList[teamIndex].draftedPlayers.push(player[0]);
      }
    }

    trackGAEventForPage("player_selected", {
      "playerName": target.dataset.name,
      "pick_number": pickNumber,
      "team": picksList[currentPickIndex].currentTeam.name,
    });

    if (!IS_DESKTOP) {
      toggleSimView("result", true);
    } else {
      let myPicksBtn = $(".mypicks-btn-holder .my-picks-btn");
      if (myPicksBtn && myPicksBtn.classList.contains("selected")) {
        let selectedTeamBtn = $(
          ".selected-user-teams-container .team-logo-btn-container.selected button.team-logo-btn");
        if (selectedTeamBtn) {
          selectedTeamBtn.click();
        }
      }
    }

    setTimeout(() => {
      fillPlayerForAPick();
    }, executionRate);
  }
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
}

function resumeDraft(manual) {
  if (manual) {
    pausedManually = false;
  }

  pauseDraftFlag = false;
  showPauseDraftBtn();
  enablePauseDraftBtn();
  hideResumeDraftBtn();

  setTimeout(() => {
    fillPlayerForAPick();
  }, 100);
}

function disableResumeDraftBtn() {
  var resumeDraftButton = $(".resume-draft");
  if (resumeDraftButton) {
    resumeDraftButton.disabled = true;
    resumeDraftButton.style.opacity = "0.4";
    resumeDraftButton.style.cursor = "not-allowed";
  }
}

function enableResumeDraftBtn() {
  var resumeDraftButton = $(".resume-draft");
  if (resumeDraftButton) {
    resumeDraftButton.disabled = false;
    resumeDraftButton.style.opacity = "1";
    resumeDraftButton.style.cursor = "pointer";
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
    pickNumber < 2 ?
      currentNeedyTeams.length > 6 :
      pickNumber < 11 ?
        currentNeedyTeams.length > 4 :
        pickNumber <= ultimateSimData.mds_constants.roundends[1] ?
          currentNeedyTeams.length > 3 :
          pickNumber <= ultimateSimData.mds_constants.roundends[3] ?
            currentNeedyTeams.length > 2 :
            currentNeedyTeams.length > 1
  ) {
    var index = Math.floor(Math.random() * Math.floor(currentNeedyTeams.length));
    currentNeedyTeams.splice(index, 1);
  }

  var minValue;
  if (pickNumber < 2) {
    minValue = 1.2;
  } else if (pickNumber < 3) {
    minValue = 1.1;
  } else if (pickNumber < 17) {
    minValue = 1;
  } else if (pickNumber < ultimateSimData.mds_constants.roundends[3]) {
    minValue = 0.9;
  } else {
    minValue = 1;
  }

  var maxValue;
  if (pickNumber < 2) {
    maxValue = 1.4;
  } else if (pickNumber < 3) {
    maxValue = 1.25;
  } else if (pickNumber < 17) {
    maxValue = 1.2;
  } else if (pickNumber < ultimateSimData.mds_constants.roundends[3]) {
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
  }

  var logo = currentPick.currentTeam.teamLogo;
  if (offersList.length > 0) {
    showOffer(currentDataset.shortname, pickNumber, logo, 0, true);
  } else {
    disablePauseDraftBtn();
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
  var offerContainer = $(".offer-container");
  if (offerContainer) {
    offerContainer.remove();
    offersList = [];
  }
  var offersOverlay = $(".mds-overlay");
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
}

function showTradeData(e) {
  var dataset = e.target.closest(".pick-trade-info-btn").dataset;
  var tradeIndex = parseInt(dataset.tradeindex);
  var offersOverlay = $(".mds-overlay");
  if (offersOverlay) {
    removeClass(offersOverlay, "hidden");
  }

  for (var i = 0; i < tradesData.length; i++) {
    if (tradeIndex === i) {
      let tradeData = tradesData[i];
      let previousTrades = [];
      if (tradeData.previousTradeNumbers.length > 0) {
        previousTrades = tradeData.previousTradeNumbers;
      }

      var tradeDataContainer = $(".trade-data-container");
      var tradeDataContainerExists = false;

      if (!tradeDataContainer) {
        tradeDataContainer = document.getElementById("trades-data").content.cloneNode(true);
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
              let givingPicksContainer = previousTradeInfoContainer.querySelector(
                ".giving-team-info .team-picks");
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
                givingTeamLogo.src = STATIC_URL + teamLogoPath + tradesData[tradeNumber]
                  .givingTeamLogo;
              }

              if (givingPicksContainer) {
                givingPicksContainer.innerHTML = "";
                for (let j = 0; j < tradesData[tradeNumber].givingPicks.length; j++) {
                  let span = document.createElement("span");
                  let pickedPlayer = "";

                  if (!tradesData[tradeNumber].givingPicks[j].futurePick) {
                    span.innerHTML = "Pick " + tradesData[tradeNumber].givingPicks[j].number;
                    if (tradesData[tradeNumber].givingPicks[j].currentTeam.shortName !== tradesData[tradeNumber]
                      .givingTeamName) {
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
                    span.innerHTML = tradesData[tradeNumber].givingPicks[j].futurePickYear + " " + tradesData[
                      tradeNumber].givingPicks[j].futureOriginalTeam +
                      " " + tradesData[tradeNumber].givingPicks[j].futureRound;
                  }

                  givingPicksContainer.appendChild(span);
                  if (pickedPlayer != "" && pickedPlayer.innerHTML != "undefined") {
                    givingPicksContainer.appendChild(pickedPlayer);
                  }
                }
              }

              let gettingPicksContainer = previousTradeInfoContainer.querySelector(
                ".getting-team-info .team-picks");
              let gettingTeamLogo = previousTradeInfoContainer.querySelector(".getting-team-info .nfl-team-logo");
              if (gettingTeamLogo) {
                gettingTeamLogo.src = STATIC_URL + teamLogoPath + tradesData[tradeNumber]
                  .gettingTeamLogo;
              }

              if (gettingPicksContainer) {
                gettingPicksContainer.innerHTML = "";
                for (let j = 0; j < tradesData[tradeNumber].gettingPicks.length; j++) {
                  let span = document.createElement("span");
                  let pickedPlayer = "";

                  if (!tradesData[tradeNumber].gettingPicks[j].futurePick) {
                    span.innerHTML = "Pick " + tradesData[tradeNumber].gettingPicks[j].number;

                    if (tradesData[tradeNumber].gettingPicks[j].currentTeam.shortName !== tradesData[tradeNumber]
                      .gettingTeamName) {
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
                    span.innerHTML = tradesData[tradeNumber].gettingPicks[j].futurePickYear + " " + tradesData[
                      tradeNumber].gettingPicks[j].futureOriginalTeam +
                      " " + tradesData[tradeNumber].gettingPicks[j].futureRound;
                  }

                  gettingPicksContainer.appendChild(span);
                  if (pickedPlayer != "" && pickedPlayer.innerHTML != "undefined") {
                    gettingPicksContainer.appendChild(pickedPlayer);
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
          givingTeamLogo.src = STATIC_URL + teamLogoPath + tradeData.givingTeamLogo;
        }

        if (givingPicksContainer) {
          givingPicksContainer.innerHTML = "";
          for (let j = 0; j < tradeData.givingPicks.length; j++) {
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
              span.innerHTML = tradeData.givingPicks[j].futurePickYear + " " + tradeData.givingPicks[j]
                .futureOriginalTeam +
                " " + tradeData.givingPicks[j].futureRound;
            }

            givingPicksContainer.appendChild(span);
            if (pickedPlayer != "" && pickedPlayer.innerHTML != "undefined") {
              givingPicksContainer.appendChild(pickedPlayer);
            }
          }
        }

        let gettingPicksContainer = currentTradeInfoContainer.querySelector(".getting-team-info .team-picks");
        let gettingTeamLogo = currentTradeInfoContainer.querySelector(".getting-team-info .nfl-team-logo");
        if (gettingTeamLogo) {
          gettingTeamLogo.src = STATIC_URL + teamLogoPath + tradeData.gettingTeamLogo;
        }

        if (gettingPicksContainer) {
          gettingPicksContainer.innerHTML = "";
          for (let j = 0; j < tradeData.gettingPicks.length; j++) {
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
              span.innerHTML = tradeData.gettingPicks[j].futurePickYear + " " + tradeData.gettingPicks[j]
                .futureOriginalTeam +
                " " + tradeData.gettingPicks[j].futureRound;
            }

            gettingPicksContainer.appendChild(span);
            if (pickedPlayer != "" && pickedPlayer.innerHTML != "undefined") {
              gettingPicksContainer.appendChild(pickedPlayer);
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

function setTradesData(givingTeamdata, gettingTeamData) {
  if (givingTeamdata.length && gettingTeamData.length) {
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
            if (pick.number === alreadyTradedPick.number && pick.futureRound === alreadyTradedPick
              .futureRound &&
              pick.futureOriginalTeam === alreadyTradedPick.futureOriginalTeam) {
              previousTradeNumbers.push(tradesData[i].tradeNumber);
            }
          });

          tradesData[i].givingPicks.forEach((pick) => {
            if (pick.number === alreadyTradedPick.number && pick.futureRound === alreadyTradedPick
              .futureRound &&
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
    tradesData[tradesDataIndex].givingTeamLogo = givingTeamdata[0].currentTeam.teamLogo;
    tradesData[tradesDataIndex].givingTeamName = givingTeamdata[0].currentTeam.shortName;
    tradesData[tradesDataIndex].givingPicks = givingTeamdata;
    tradesData[tradesDataIndex].gettingTeamLogo = gettingTeamData[0].currentTeam.teamLogo;
    tradesData[tradesDataIndex].gettingTeamName = gettingTeamData[0].currentTeam.shortName;
    tradesData[tradesDataIndex].gettingPicks = gettingTeamData;
    tradesData[tradesDataIndex].previousTradeNumbers = previousTradeNumbers;
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
    proposeTrade(currentTeam, offeringTeam, currentTeamPicks, offeringTeamPicks);
  }
}

function acceptOffer(serverSimulated) {
  var tradeIndex = tradesData.length;
  let currentPickContainer = $(".pic-container.currentPick");

  if (currentPickContainer) {
    var tradeIconHolder = currentPickContainer.querySelector(".pick-trade-info-btn");
    if (tradeIconHolder) {
      removeClass(tradeIconHolder, "hidden");
    }

    var dataset = currentPickContainer.dataset;
    var originalTeamName = dataset.shortname;
    var originalPickNumber = parseInt(dataset.number);
    var originalTeamIndex = picksList.findIndex((item) => item.number === originalPickNumber);
    var originalTeam = picksList[originalTeamIndex].currentTeam;
    var originalTeamLogo = originalTeam.teamLogo;

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
            teamLogoHolder.src = STATIC_URL + teamLogoPath + currentOfferTeam.teamLogo;
            teamLogoHolder.dataset.teamlogo = currentOfferTeam.teamLogo;
          }

        }
      }
    }

    var indexList = [];
    for (var i = 0; i < originalTeam.draftPicks.length; i++) {
      for (var j = 0; j < givingPicks.length; j++) {
        if (originalTeam.draftPicks[i].number === givingPicks[j].number && originalTeam.draftPicks[i].futureRound ===
          givingPicks[j].futureRound && originalTeam.draftPicks[i].futureOriginalTeam === givingPicks[j]
            .futureOriginalTeam) {
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
        picksList[tradingTeamPickListIndex].currentTeam = mdsTeamsList[mdsTeamsList.findIndex((item) => item.shortName ===
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
            teamLogoHolder.src = STATIC_URL + teamLogoPath + originalTeamLogo;
            teamLogoHolder.dataset.teamlogo = originalTeamLogo;
          }

        }
      }
    }

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
        let selectedTeamBtn = $(
          ".selected-user-teams-container .team-logo-btn-container.selected button.team-logo-btn");
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

  enableShowOffersBtn();
  disablePauseDraftBtn();

  var offerContainer = $(".offer-container");
  var containerExists;
  if (!offerContainer) {
    containerExists = false;
    offerContainer = document.getElementById("available-trades").content.cloneNode(true);
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

  var overlay = $(".mds-overlay");
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
    offerNumberHolder.innerHTML = "You have " + offersList.length + " Trade Offer(s)";
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
    currentTeamImageHolder.src = STATIC_URL + teamLogoPath + currentTeamImage;
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
  }

  var offeringTeamImageHolder = offerContainer.querySelector(".offering-team-img");
  if (offeringTeamImageHolder) {
    var offeringTeamLogo = currentOffer.teamLogo;
    offeringTeamImageHolder.src = STATIC_URL + teamLogoPath + offeringTeamLogo;
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
  for (var offer of allOffers) {
    if (offer.number) {
      offerPicks.push(offer.number);
      offerPicksValue += offer.value;
    } else {
      offerFuturePicks.push(offer.futureRound + "-" + offer.futurePickYear + "-" + offer.futureOriginalTeam);
      futurePicksValue += offer.value;
    }
  }

  if (offerPicks.length) {
    offersData.picks = offerPicks;
  }

  if (offerFuturePicks.length) {
    offersData.futurePicks = offerFuturePicks;
  }

  offersData.team = currentTeamName;
  offersData.value = offerPicksValue + futurePicksValue;

  offerContainer.dataset.currentteamgivingpicks = JSON.stringify(offersData);


  allOffers = currentOffer.offerList;
  offersData = {};
  offerPicks = [];
  offerFuturePicks = [];
  offerPicksValue = 0;
  futurePicksValue = 0;
  for (var offer of allOffers) {
    if (offer.number) {
      offerPicks.push(offer.number);
      offerPicksValue += offer.value;
    } else {
      offerFuturePicks.push(offer.futureRound + "-" + offer.futurePickYear + "-" + offer.futureOriginalTeam);
      futurePicksValue += offer.value;
    }
  }

  if (offerPicks.length) {
    offersData.picks = offerPicks;
  }

  if (offerFuturePicks.length) {
    offersData.futurePicks = offerFuturePicks;
  }

  offersData.team = currentOffer.shortName;
  offersData.value = offerPicksValue + futurePicksValue;

  offerContainer.dataset.currentteamgettingpicks = JSON.stringify(offersData);

  // Trade value comparison widget
  var valueComparison = offerContainer.querySelector(".trade-value-comparison");
  if (valueComparison) {
    var userTotalValue = JSON.parse(offerContainer.dataset.currentteamgivingpicks).value || 0;
    var opposingTotalValue = JSON.parse(offerContainer.dataset.currentteamgettingpicks).value || 0;
    var totalValue = userTotalValue + opposingTotalValue;
    var userPercent = totalValue > 0 ? (userTotalValue / totalValue * 100).toFixed(1) : "0.0";
    var opposingPercent = totalValue > 0 ? (opposingTotalValue / totalValue * 100).toFixed(1) : "0.0";

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

    if (currentPick.number > ultimateSimData.mds_constants.roundends[3]) {
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
      if (currentPick.number < ultimateSimData.mds_constants.roundends[3]) {
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
          if ((currentPick.number < ultimateSimData.mds_constants.roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[x].value) < (
            currentPick.value * adjustedMinValue))) ||
            (currentPick.number >= ultimateSimData.mds_constants.roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[x].value) <
              adjustedMinValue))) {
            possibleTrades.draftPicks.push(possibleFutureTradePicks[x]);
            possibleTrades.value += possibleFutureTradePicks[x].value;
            addMostValuedPickToBundle(x + 1);
          } else if ((currentPick.number < ultimateSimData.mds_constants.roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[x]
            .value) > (currentPick.value * (adjustedMaxValue + 0.15)))) ||
            (currentPick.number >= ultimateSimData.mds_constants.roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[x].value) >
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
        if (possibleTrades.draftPicks.length < ultimateSimData.mds_constants.maxPicksInPackage) {
          if (possibleFutureTradePicks.length > possibleTrades.draftPicks.length) {
            for (var i = possibleFutureTradePicks.length - 1; i >= x; i--) {
              if ((currentPick.number < ultimateSimData.mds_constants.roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[i].value) >
                (currentPick.value * adjustedMinValue))) ||
                (currentPick.number >= ultimateSimData.mds_constants.roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[i].value) >
                  adjustedMinValue))
              ) {
                if ((currentPick.number < ultimateSimData.mds_constants.roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[i]
                  .value) < (currentPick.value * adjustedMaxValue))) ||
                  (currentPick.number >= ultimateSimData.mds_constants.roundends[6] && ((possibleTrades.value + possibleFutureTradePicks[i].value) <
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

      if ((currentPick.number < ultimateSimData.mds_constants.roundends[6] && (possibleTrades.value >= (currentPick.value * adjustedMinValue)) ||
        currentPick.number >= ultimateSimData.mds_constants.roundends[6] && possibleTrades.value >= adjustedMinValue) &&
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

    if (offersBundle.length > 0 && currentPick.number > ultimateSimData.mds_constants.blockTradeUpPick) {
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
      if ((currentPick.number < 190 && (Math.abs((currentPick.value + possibleUserFutureTradePicks[x].value) * 1.1 -
        tradeOffer.value) <
        Math.abs((currentPick.value + possibleUserFutureTradePicks[x + 1].value) * 1.1 - tradeOffer.value))) ||
        currentPick.number >= 190 && (Math.abs((currentPick.value + possibleUserFutureTradePicks[x].value) * 1.3 -
          tradeOffer.value) <
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

function changeRoundSelectorData(target) {
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

  var draftResult = $(".rounds-pics-container .rounds-pics-holder").children;
  var resultContainer = $(".round-trades-container .round-selection-body");
  if (draftResult && resultContainer) {
    resultContainer.innerHTML = "";
    for (var element of draftResult) {
      if (element.dataset.roundnumber == target.dataset.round) {
        var clone = element.cloneNode(true);
        var playerHolder = clone.querySelector(".traded-player-name-position-container");
        if (playerHolder) {
          playerHolder.addEventListener("click", showPlayerInfo);
        }

        let draftedInfoContainer = clone.querySelector(".drafting-info-container");
        if (draftedInfoContainer && !hasClass(draftedInfoContainer, "hidden")) {
          playerHolder.style.maxWidth = "149px";
          playerHolder.style.textOverflow = "ellipsis";
          playerHolder.style.overflow = "hidden";
        }
        resultContainer.appendChild(clone);
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

function getCurrentPick() {
  var simPicks = picksList.slice(0, ultimateSimData.mds_constants.roundends[rounds]);

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

function updateMDSTeamNeeds(currentPickNumber) {
  var simPicks = picksList.slice(0, ultimateSimData.mds_constants.roundends[rounds]);
  var teamNeedsContainer = $(".team-needs-picks-container");
  removeClass(teamNeedsContainer, "hidden");
  var team;
  var nextPicksArray = [];
  if (teamNeedsContainer) {
    for (var i = currentPickNumber - 1; i < simPicks.length; i++) {
      if (!team) {
        if (userSelectedTeams.includes(simPicks[i].currentTeam.shortName)) {
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
        teamLogo.src = STATIC_URL + teamLogoPath + team.teamLogo + logoCacheBuster;
      } else {
        var image = document.createElement("img");
        addClass(image, "team-logo")
        image.setAttribute("width", "38");
        image.setAttribute("height", "25");
        image.setAttribute("alt", team.shortName);
        image.setAttribute("src", STATIC_URL + teamLogoPath + team.teamLogo + logoCacheBuster);
        var teamNeedsText = teamNeedsContainer.querySelector(".team-needs-text");
        if (teamNeedsText) {
          teamNeedsContainer.insertBefore(image, teamNeedsText);
        }
      }

      var teamNeeds;
      for (var i = 0; i < teamNeedsList.length; i++) {
        if (teamNeedsList[i].shortName === team.shortName) {
          teamNeeds = teamNeedsList[i].teamNeed1 + ", " + teamNeedsList[i].teamNeed2 + ", " + teamNeedsList[i]
            .teamNeed3 + ", " + teamNeedsList[i].teamNeed4;
          if (teamNeedsList[i].teamNeed5) {
            teamNeeds = teamNeeds + ", " + teamNeedsList[i].teamNeed5;
          }

          break;
        }
      }

      var teamNeedsHolder = teamNeedsContainer.querySelector(".team-needs");
      if (teamNeedsHolder) {
        teamNeedsHolder.innerHTML = teamNeeds;
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

function updateNextPick(currentPickNumber) {
  var simPicks = picksList.slice(0, ultimateSimData.mds_constants.roundends[rounds]);
  var nextPickContainer = $(".next-pick-container");
  if (currentSection === "result") {
    removeClass(nextPickContainer, "hidden");
  }

  var nextPickSet = false;
  if (nextPickContainer) {
    for (var i = currentPickNumber; i < simPicks.length; i++) {
      if (userSelectedTeams.includes(simPicks[i].currentTeam.shortName)) {
        var teamLogoHolder = nextPickContainer.querySelector(".next-pick-team");
        if (teamLogoHolder) {
          teamLogoHolder.src = STATIC_URL + teamLogoPath + simPicks[i].currentTeam.teamLogo + logoCacheBuster;
        } else {
          var image = document.createElement("img");
          addClass(image, "next-pick-team")
          image.setAttribute("width", "38");
          image.setAttribute("height", "25");
          image.setAttribute("alt", simPicks[i].currentTeam.shortName);
          image.setAttribute("src", STATIC_URL + teamLogoPath + simPicks[i].currentTeam
            .teamLogo + logoCacheBuster);
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
  let picksRemaining = false;
  for (let i = 0; i < userSelectedTeams.length; i++) {
    let userTeam = mdsTeamsList.find(team => userSelectedTeams[i] === team.shortName);
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

  disableSimProposeTradeBtn();
}

function fillDraftedPlayer(pick) {
  var selectedPlayer = "";
  for (var i = 0; i < playersList.length; i++) {
    if (playersList[i].name == pick.playerSelection) {
      selectedPlayer = playersList[i];
    }
  }
  pick.playerSelection = selectedPlayer;

  pick.currentTeam.draftedPlayers.push(pick.playerSelection);

  pick.playerSelection.draftedBy = pick.currentTeam;

  playersList.splice(playersList.indexOf(pick.playerSelection), 1);
  pick.currentTeam.doNotDraft.push(
    pick.playerSelection.position
  );

  if (pick.currentTeam.teamNeed1 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed1 = "";
  }
  if (pick.currentTeam.teamNeed2 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed2 = "";
  }
  if (pick.currentTeam.teamNeed3 === pick.playerSelection.position) {
    pick.currentTeam.teamNeed3 = "";
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
  }
}

function showDraftedAndSignedPlayersPopup() {
  let mdsDraftedPlayers;
  const userSelectedTeamIndex = mdsTeamsList.findIndex(team => team.shortName === userSelectedGMTeam);
  if (userSelectedTeamIndex > -1) {
    const userTeam = mdsTeamsList[userSelectedTeamIndex];
    if (userTeam.shortName) {
      mdsDraftedPlayers = userTeam.draftedPlayers;
    }
  }

  const positionOrder = ["QB", "RB", "WR", "TE", "OT", "OG", "OC", "DT", "EDGE", "LB", "CB", "S", "LS", "FB", "K",
    "P"
  ];

  const sortedPlayers = freeAgencySimulatorResultPlayers.sort((a, b) => {
    const positionA = positionOrder.indexOf(a.position);
    const positionB = positionOrder.indexOf(b.position);

    if (positionA !== positionB) {
      return positionA - positionB; // Sort by position order
    }

    // If positions are the same, sort by getFinalValue
    return getFinalValue(b) - getFinalValue(a); // Descending order by value
  });

  mdsDraftedPlayers.forEach(mdsPlayer => {
    const playerIndex = sortedPlayers.findIndex(player => player.position === mdsPlayer.position);
    if (playerIndex > -1) {
      sortedPlayers.splice(playerIndex, 0, mdsPlayer);
    } else {
      sortedPlayers.push(mdsPlayer);
    }
  });

  let resultTemplateId;
  if (IS_DESKTOP) {
    resultTemplateId = "mds-roster-result-desktop";
  } else {
    resultTemplateId = "mds-roster-result-mobile";
  }

  var resultContainer = document.getElementById(resultTemplateId).content.cloneNode(true);
  resultContainer = resultContainer.querySelector(".mds-roster-result-container");
  const predictNextYearGamesBtn = resultContainer.querySelector(".continue-simulate-next-year-games");
  if (predictNextYearGamesBtn) {
    removeClass(predictNextYearGamesBtn, "hidden");
    predictNextYearGamesBtn.addEventListener("click", showFinalPredictionsSection);
  }

  const resultListMobile = resultContainer.querySelector("#resultListMobile");
  const resultListOdd = resultContainer.querySelector("#resultListOdd");
  const resultListEven = resultContainer.querySelector("#resultListEven");

  if (resultListMobile) {
    resultListMobile.innerHTML = "";
  } else if (resultListOdd && resultListEven) {
    resultListOdd.innerHTML = "";
    resultListEven.innerHTML = "";
  }

  sortedPlayers.forEach((player, index) => {
    let playerRowHTML;
    if (player.hasOwnProperty("id")) {
      playerRowHTML = renderPlayerRow(player, index + 1);
    } else {
      playerRowHTML = renderMDSDraftedPlayerRow(player, index + 1);
    }
    if (resultListMobile) {
      resultListMobile.innerHTML += playerRowHTML;
    } else if (resultListOdd && resultListEven) {
      if ((index + 1) % 2 === 0) {
        resultListEven.innerHTML += playerRowHTML;
      } else {
        resultListOdd.innerHTML += playerRowHTML;
      }
    }
  });

  document.body.appendChild(resultContainer);
  var overlay = $(".mds-overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  }

  calculateNFLTeamValues();
}

function renderMDSDraftedPlayerRow(player, number) {
  return '' +
    '<tr class="results-row">' +
    '<td>' + player.name + '</td>' +
    '<td>' + player.position + '</td>' +
    '<td class="center">Drafted</td>' +
    '<td>-</td>' +
    '</tr>';
}

function calculateNFLTeamValues() {
  segregateNFLTeamPlayers();
  calculateTeamValuesAsPerPositionComposition();
  calculateWinningProbabilityOfNFLTeams();
}

function segregateNFLTeamPlayers() {
  const statusesToFilter = ["franchise", "signed", "re-signed", "transition", "active", "restructured"];
  nflTeamShortNames.forEach(teamName => {
    let team = {};
    let teamPlayers = players.filter(p => p.team === teamName && statusesToFilter.includes(p.status));

    const matchingTeamIndex = mdsTeamsList.findIndex(team => team.shortName === teamName);
    let draftedPlayers;
    if (matchingTeamIndex > -1) {
      draftedPlayers = mdsTeamsList[matchingTeamIndex].draftedPlayers;
      teamPlayers.push(...draftedPlayers);
    }

    teamPlayers.sort((a, b) => getPlayerRatingsValue(b) - getPlayerRatingsValue(a));

    team["teamName"] = teamName;
    team["playersList"] = teamPlayers;
    nflTeamsPlayersList.push(team);
  });
}

function calculateTeamValuesAsPerPositionComposition() {
  teamsList.forEach(teamName => {
    const teamObj = nflTeamsPlayersList.find(teamObj => teamObj.teamName === teamName);
    const teamPlayersList = teamObj.playersList;
    const teamValue = segregateAndGetValueOfNFLTeamsAsPerPlayersPosition(teamPlayersList);
    calculatedNFLTeamValues[teamName] = teamValue;
  });
}

function calculateWinningProbabilityOfNFLTeams() {
  winProbabilityGrid = [];
  const teams = [
    "ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
    "GB", "HOU", "IND", "JAX", "KC", "LAC", "LAR", "LV", "MIA", "MIN", "NE", "NO",
    "NYG", "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"
  ];

  const matrix = {};

  for (let i = 0; i < teams.length; i++) {
    matrix[i] = {};

    for (let j = 0; j < teams.length; j++) {
      if (i === j) {
        matrix[i][j] = "0.5"; // same team — no matchup
        continue;
      }

      const teamA = teams[i];
      const teamB = teams[j];

      const valueA = calculatedNFLTeamValues[teamA];
      const valueB = calculatedNFLTeamValues[teamB];

      const stronger = valueA >= valueB ? teamA : teamB;
      const weaker = stronger === teamA ? teamB : teamA;

      const strongerVal = calculatedNFLTeamValues[stronger];
      const weakerVal = calculatedNFLTeamValues[weaker];
      const diffPercent = ((strongerVal - weakerVal) / weakerVal) * 100;
      const winProbStronger = getWinProbability(diffPercent);

      // Store probability that team i beats team j
      matrix[i][j] =
        (teamA === stronger ? winProbStronger : 1 - winProbStronger).toFixed(2);
    }
  }

  winProbabilityGrid = matrix;
}



function getWinProbability(diffPercent) {
  if (diffPercent <= 1) return 0.50;
  if (diffPercent <= 2) return 0.55;
  if (diffPercent <= 3) return 0.60;
  if (diffPercent <= 4) return 0.65;
  if (diffPercent <= 5) return 0.70;
  if (diffPercent <= 6) return 0.75;
  if (diffPercent <= 7) return 0.80;
  if (diffPercent <= 8) return 0.85;
  if (diffPercent <= 9) return 0.90;
  return 0.95;
}

function getPlayerRatingsValue(player) {
  const playerData = ultimateSimData.player_ratings.find(data => data["Player Name"] == player.name && data["Position"] == player.position);
  if (playerData && playerData["Rating"]) {
    return Number(playerData["Rating"]);
  } else {
    return 50;
  }
}

function segregateAndGetValueOfNFLTeamsAsPerPlayersPosition(teamPlayersList) {
  let teamValue = 0;

  function addValue(player, percent, position, index) {
    if (!player) return;

    const rating = getPlayerRatingsValue(player);
    const value = (rating * percent) / 100;

    teamValue += value;
  }

  const qbPlayers = teamPlayersList.filter(player => player.position === "QB");
  addValue(qbPlayers[0], 18, "QB", 0);
  addValue(qbPlayers[1], 2, "QB", 1);

  const rbPlayers = teamPlayersList.filter(player => player.position === "RB");
  addValue(rbPlayers[0], 3, "RB", 0);
  addValue(rbPlayers[1], 1.5, "RB", 1);
  addValue(rbPlayers[2], 0.5, "RB", 2);

  const wrPlayers = teamPlayersList.filter(player => player.position === "WR");
  addValue(wrPlayers[0], 4, "WR", 0);
  addValue(wrPlayers[1], 2.4, "WR", 1);
  addValue(wrPlayers[2], 0.8, "WR", 2);
  addValue(wrPlayers[3], 0.8, "WR", 3);

  const tePlayers = teamPlayersList.filter(player => player.position === "TE");
  addValue(tePlayers[0], 4, "TE", 0);
  addValue(tePlayers[1], 1, "TE", 1);

  const otPlayers = teamPlayersList.filter(player => player.position === "OT");
  addValue(otPlayers[0], 5, "OT", 0);
  addValue(otPlayers[1], 3.5, "OT", 1);
  addValue(otPlayers[2], 1.5, "OT", 2);

  const ogPlayers = teamPlayersList.filter(player => player.position === "OG");
  addValue(ogPlayers[0], 2.4, "OG", 0);
  addValue(ogPlayers[1], 2.4, "OG", 1);
  addValue(ogPlayers[2], 1.2, "OG", 2);

  const ocPlayers = teamPlayersList.filter(player => player.position === "OC");
  addValue(ocPlayers[0], 4.8, "OC", 0);
  addValue(ocPlayers[1], 1.2, "OC", 1);

  const dtPlayers = teamPlayersList.filter(player => player.position === "DT");
  addValue(dtPlayers[0], 2.1, "DT", 0);
  addValue(dtPlayers[1], 1.8, "DT", 1);
  addValue(dtPlayers[2], 1.2, "DT", 2);
  addValue(dtPlayers[3], 0.9, "DT", 3);

  const edgePlayers = teamPlayersList.filter(player => player.position === "EDGE");
  addValue(edgePlayers[0], 3.5, "EDGE", 0);
  addValue(edgePlayers[1], 3, "EDGE", 1);
  addValue(edgePlayers[2], 2, "EDGE", 2);
  addValue(edgePlayers[3], 1.5, "EDGE", 3);

  const lbPlayers = teamPlayersList.filter(player => player.position === "LB");
  addValue(lbPlayers[0], 2.5, "LB", 0);
  addValue(lbPlayers[1], 1.5, "LB", 1);
  addValue(lbPlayers[2], 1, "LB", 2);

  const cbPlayers = teamPlayersList.filter(player => player.position === "CB");
  addValue(cbPlayers[0], 3.5, "CB", 0);
  addValue(cbPlayers[1], 3, "CB", 1);
  addValue(cbPlayers[2], 2, "CB", 2);
  addValue(cbPlayers[3], 1.5, "CB", 3);

  const sPlayers = teamPlayersList.filter(player => player.position === "S");
  addValue(sPlayers[0], 2, "S", 0);
  addValue(sPlayers[1], 2, "S", 1);
  addValue(sPlayers[2], 1, "S", 2);

  const kPlayers = teamPlayersList.filter(player => player.position === "K");
  addValue(kPlayers[0], 2, "K", 0);

  const pPlayers = teamPlayersList.filter(player => player.position === "P");
  addValue(pPlayers[0], 2, "P", 0);

  return teamValue;
}

function fillPlayerForAPick() {
  if (!pauseDraftFlag) {
    var pickData = getCurrentPick();
    var currentPick = pickData.currentPick;

    if (!currentPick) {
      disableResumeDraftBtn();
      disableShowOffersBtn();
      hideUserSelectionIcon();
      showDraftedAndSignedPlayersPopup();
      return;
    }

    var tradeProposalBtn = $(".simulation-management-buttons-container .user-proposal");
    if (tradeProposalBtn && !tradeProposalBtn.disabled) {
      checkPicksForUserSelectedTeams(currentPick.number - 1, tradeProposalBtn);
    }

    updateNextPick(currentPick.number);
    updateMDSTeamNeeds(currentPick.number);

    var nextUp = picksList[currentPick.number];

    var pickContainer = $(".pick-number-" + currentPick.number);
    if (pickContainer) {
      if (currentPick.number <= ultimateSimData.mds_constants.pickstart) {
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
              disablePauseDraftBtn();
              toggleSimView("pool", true);
            }
          } else {
            calculateTrades(pickContainer);
          }
        } else {
          hideResumeDraftBtn();
          showPauseDraftBtn();
          disablePauseDraftBtn();
          toggleSimView("pool", true);
        }
        return;
      } else {
        var trades;
        picksList.forEach(function (pick) {
          if (!pick.tradeUpPick) {
            pick.currentTeam.targetPlayer = "";
          }
        });

        if (!currentPick.tradeUpPick) {
          if (currentPick.number === 1 || currentPick.number === 2) {
            trades = fetchPossibleTrades(ultimateSimData.mds_constants.tradeinittoppick[0], ultimateSimData.mds_constants.tradeinittoppick[1], ultimateSimData.mds_constants.tradeinittoppick[2]);
          } else if (currentPick.number <= ultimateSimData.mds_constants.roundends[0]) {
            trades = fetchPossibleTrades(ultimateSimData.mds_constants.tradeinittopten[0], ultimateSimData.mds_constants.tradeinittopten[1], ultimateSimData.mds_constants.tradeinittopten[2]);
          } else if (currentPick.number <= ultimateSimData.mds_constants.roundends[1]) {
            trades = fetchPossibleTrades(ultimateSimData.mds_constants.tradeinitfirst[0], ultimateSimData.mds_constants.tradeinitfirst[1], ultimateSimData.mds_constants.tradeinitfirst[2]);
          } else {
            trades = fetchPossibleTrades(ultimateSimData.mds_constants.tradeinitallelse[0], ultimateSimData.mds_constants.tradeinitallelse[1], ultimateSimData.mds_constants.tradeinitallelse[2]);
          }
        }

        if (trades) {
          var tradeIndex = tradesData.length;
          updateTradedPicks(trades.tradeUpPicks, tradeIndex);
          updateTradedPicks(trades.tradeBackPicks, tradeIndex);
          setTradesData(trades.tradeUpPicks, trades.tradeBackPicks);

          if (currentPick.tradeUpPick && currentPick.currentTeam.targetPlayer) {
            currentPick.playerSelection = currentPick.currentTeam.targetPlayer;
            currentPick.currentTeam.draftedPlayers.push(currentPick.currentTeam.targetPlayer);
            currentPick.currentTeam.targetPlayer.draftedBy = currentPick.currentTeam;
            currentPick.currentTeam.doNotDraft.push(
              currentPick.currentTeam.targetPlayer.position
            );
            if (currentPick.currentTeam.teamNeed1 === currentPick.currentTeam.targetPlayer.position) {
              currentPick.currentTeam.teamNeed1 = "";
            }
            if (currentPick.currentTeam.teamNeed2 === currentPick.currentTeam.targetPlayer.position) {
              currentPick.currentTeam.teamNeed2 = "";
            }
            if (currentPick.currentTeam.teamNeed3 === currentPick.currentTeam.targetPlayer.position) {
              currentPick.currentTeam.teamNeed3 = "";
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
          }

        } else {
          var playersData;
          var pickSlice = 1;
          if (currentPick.number <= ultimateSimData.mds_constants.roundends[0]) {
            pickSlice = ultimateSimData.mds_constants.poolslice[0];
          } else if (currentPick.number <= ultimateSimData.mds_constants.roundends[1]) {
            pickSlice = ultimateSimData.mds_constants.poolslice[1];
          } else if (currentPick.number <= ultimateSimData.mds_constants.roundends[3]) {
            pickSlice = ultimateSimData.mds_constants.poolslice[2];
          } else {
            pickSlice = ultimateSimData.mds_constants.poolslice[3];
          }
          if (currentPick.number >= ultimateSimData.mds_constants.roundends[3]) {
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
              currentPick.number > ultimateSimData.mds_constants.roundends[3] ?
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
            if (currentPick.number <= ultimateSimData.mds_constants.roundends[0]) {
              player.score = ultimateSimData.mds_constants.highpickvalues[i];
            } else if (currentPick.number <= ultimateSimData.mds_constants.roundends[1]) {
              player.score = ultimateSimData.mds_constants.midpickvalues[i];
            } else {
              player.score = ultimateSimData.mds_constants.lowpickvalues[i];
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
      }
      if (pick.currentTeam.teamNeed2 === playersCollection[i].position) {
        pick.currentTeam.teamNeed2 = "";
      }
      if (pick.currentTeam.teamNeed3 === playersCollection[i].position) {
        pick.currentTeam.teamNeed3 = "";
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
            logoHolder.src = STATIC_URL + teamLogoPath + tradedPicks[i].currentTeam.teamLogo + logoCacheBuster;
            logoHolder.dataset.teamlogo = tradedPicks[i].currentTeam.teamLogo;
          }
          var tradeIconHolder = picksHolder[j].querySelector(".pick-trade-info-btn");
          if (tradeIconHolder) {
            removeClass(tradeIconHolder, "hidden");
            tradeIconHolder.dataset.tradeindex = tradeIndex;
          }
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
      if (currentPick.number < ultimateSimData.mds_constants.roundends[6]) {
        adjustedMinValue = parseFloat(minValue + (maxValue - minValue) * Math.random());
      } else {
        adjustedMinValue = currentPick.value - 0.1;
      }

      var adjustedMaxValue;
      if (currentPick.number < ultimateSimData.mds_constants.roundends[6]) {
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
      if (currentPick.number < ultimateSimData.mds_constants.roundends[3]) {
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
          .length < ultimateSimData.mds_constants.maxPicksInPackage)) {
          if (possibleFutureTradePicks.length > possibleTrades.draftPicks.length) {
            for (var i = possibleFutureTradePicks.length - 1; i >= x; i--) {
              if (((currentPick.number < ultimateSimData.mds_constants.roundends[6]) && (possibleTrades.value + possibleFutureTradePicks[i].value >
                currentPick.value * adjustedMinValue)) || ((currentPick.number >= ultimateSimData.mds_constants.roundends[6]) && (possibleTrades
                  .value +
                  possibleFutureTradePicks[i].value > adjustedMinValue))) {
                if (((currentPick.number < ultimateSimData.mds_constants.roundends[6]) && (possibleTrades.value + possibleFutureTradePicks[i]
                  .value <
                  currentPick.value * adjustedMaxValue)) || ((currentPick.number >= ultimateSimData.mds_constants.roundends[6]) && (possibleTrades
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
  var pickNumber = parseInt(pickContainer.dataset.number);
  var pickIndex = picksList.findIndex((item) => item.number === pickNumber);
  picksList[pickIndex].playerSelection = player;
  var playerHolder = pickContainer.querySelector(".traded-player-name-position-container");
  playerHolder.style.cursor = "pointer";
  playerHolder.dataset.name = playerContainer.dataset.name;
  playerHolder.addEventListener("click", showPlayerInfo);
  pickContainer.querySelector(".player-name").innerHTML = playerContainer.dataset.name;
  pickContainer.querySelector(".player-position").innerHTML = playerContainer.dataset.position + " " + playerContainer
    .dataset
    .draftfrom;

  const scrollContainer = pickContainer.closest(".rounds-pics-container");
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

  playerContainer.remove();

  return;
}

function fillRoundPics() {
  var picsHolder = $(".rounds-pics-holder");

  if (!picsHolder) {
    return;
  }

  picsHolder.innerHTML = "";

  var roundNumber = 0;
  if (picsHolder) {
    var limit = ultimateSimData.mds_constants.roundends[rounds];
    for (var i = 0; i < limit; i++) {
      if (i == 0 || i == ultimateSimData.mds_constants.roundends[1] || i == ultimateSimData.mds_constants.roundends[2] || i == ultimateSimData.mds_constants.roundends[3] || i == ultimateSimData.mds_constants.roundends[4] || i ==
        ultimateSimData.mds_constants.roundends[5] || i == ultimateSimData.mds_constants.roundends[6]) {
        roundNumber += 1;
        var roundNumberHolder = document.createElement("div");
        addClass(roundNumberHolder, "round-number");
        roundNumberHolder.textContent = "Round " + roundNumber;
        roundNumberHolder.dataset.round = roundNumber;
        picsHolder.appendChild(roundNumberHolder);
      }
      var roundClone = document.getElementById("single-round").content.cloneNode(true);
      roundClone.querySelector(".team-logo").setAttribute("data-teamlogo", picksList[i].teamLogo);
      roundClone.querySelector(".team-logo").setAttribute("crossorigin", "anonymous");
      roundClone.querySelector(".team-logo").setAttribute("alt", picksList[i].shortName);
      roundClone.querySelector(".team-logo").src = STATIC_URL + teamLogoPath + picksList[i]
        .teamLogo + logoCacheBuster;
      roundClone.querySelector(".pic-number").textContent = picksList[i].number + ".";
      roundClone.querySelector(".team-logo-container").dataset.teamname = picksList[i].shortName;
      var pickContainer = roundClone.querySelector(".pic-container");
      pickContainer.classList.add("pick-number-" + picksList[i].number);
      pickContainer.dataset.number = picksList[i].number;
      pickContainer.dataset.shortname = picksList[i].shortName;
      pickContainer.dataset.roundnumber = roundNumber;
      pickContainer.dataset.playerselection = picksList[i].playerSelection;
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
  var teamPicksInfoPopupTemplate = document.getElementById("team-picks-info").content.cloneNode(true);
  var teamPicksInfoPopup = teamPicksInfoPopupTemplate.querySelector(".team-picks-info-popup");
  var closeBtn = teamPicksInfoPopup.querySelector(".close-team-picks-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeTeamPicksInfoPopup);
  }

  var teamNameHolder = teamPicksInfoPopup.querySelector(".team-name");
  if (teamNameHolder) {
    for (var i = 0; i < mdsTeamsList.length; i++) {
      if (mdsTeamsList[i].shortName == teamName) {
        teamNameHolder.innerHTML = mdsTeamsList[i].name;
      }
    }
  }

  var teamPicksHolder = teamPicksInfoPopup.querySelector(".team-picks-list-container .team-picks-list-holder");
  if (teamPicksHolder) {
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
            tradeInfoBtn.addEventListener("click", showTradeData);
          }
        }

        let originalPlayerInfoBtn = allPickContainers[i].querySelector(".traded-player-name-position-container");
        if (originalPlayerInfoBtn) {
          let playerInfoBtn = clone.querySelector(".traded-player-name-position-container");
          playerInfoBtn.dataset.name = originalPlayerInfoBtn.dataset.name;
          if (playerInfoBtn) {
            playerInfoBtn.addEventListener("click", showPlayerInfo);
          }

          let draftedInfoContainer = clone.querySelector(".drafting-info-container");
          if (draftedInfoContainer) {
            playerInfoBtn.style.maxWidth = "250px";
          }
        }

        teamPicksHolder.appendChild(clone);
      }
    }
  }

  var overlay = $(".mds-overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  } else {
    var overlay = document.createElement("div");
    addClass(overlay, "mds-overlay");
    document.body.appendChild(overlay);
  }

  addClass(teamPicksInfoPopup, "popup");
  document.body.appendChild(teamPicksInfoPopup);
}

function closeTeamPicksInfoPopup(event) {
  var teamPicksInfoPopup = $(".team-picks-info-popup");
  var overlay = $(".mds-overlay");
  if (!teamPicksInfoPopup) return;
  if (typeof teamPicksInfoPopup != "object") return;
  if (!teamPicksInfoPopup.classList.contains("hidden") && (!event.target.closest(
    ".team-picks-info-popup") || event.target.closest(".close-team-picks-btn")) &&
    !event.target.closest(".team-logo-container") && !event.target.closest(".player-info-popup") &&
    !event.target.closest(".trade-data-container")) {
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
      currentSection = "result";
      addClass(draftBtn, "selected");
      removeClass(poolBtn, "selected");
      removeClass(myPicksBtn, "selected");

      contentSlider.className = "sim-content-slider show-rounds-pics-container";
    } else if (view == "pool") {
      currentSection = "pool";
      removeClass(draftBtn, "selected");
      addClass(poolBtn, "selected");
      removeClass(myPicksBtn, "selected");

      contentSlider.className = "sim-content-slider show-players-container";
    } else if (view == "mypicks") {
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
    for (var i = 0; i < mdsTeamsList.length; i++) {
      if (userSelectedTeams.includes(mdsTeamsList[i].shortName)) {
        var logoContainer = document.createElement("div");
        logoContainer.dataset.team = mdsTeamsList[i].shortName;
        addClass(logoContainer, "team-logo-btn-container");
        if (i == 0) {
          addClass(logoContainer, "selected");
        }
        var logoHolder = document.createElement("button");
        logoHolder.dataset.team = mdsTeamsList[i].shortName;
        logoHolder.addEventListener("click", showSelectedTeamPicks);
        addClass(logoHolder, "team-logo-btn");
        var teamLogo = document.createElement("img");
        addClass(teamLogo, "team-logo");
        teamLogo.setAttribute("src", STATIC_URL + teamLogoPath + mdsTeamsList[i].teamLogo + logoCacheBuster);
        teamLogo.setAttribute("width", 30);
        teamLogo.setAttribute("alt", mdsTeamsList[i].shortName);
        logoHolder.appendChild(teamLogo);
        logoContainer.appendChild(logoHolder);
        if (userSelectedTeams[0] === mdsTeamsList[i].shortName) {
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
  picksContainer.innerHTML = "";
  if (e) {
    var teamName = e.target.parentElement.dataset.team;
    var previousSelectedTeam = $(".team-logo-btn-container.selected");
    removeClass(previousSelectedTeam, "selected");
    for (var i = 0; i < myTeamsHolder.children.length; i++) {
      if (myTeamsHolder.children[i].dataset.team === teamName) {
        addClass(myTeamsHolder.children[i], "selected");
      }
    }
  } else {
    if (myTeamsHolder) {
      teamName = myTeamsHolder.children[0].dataset.team;
      addClass(myTeamsHolder.children[0], "selected");
    }
  }
  var teamPicks;
  for (var i = 0; i < mdsTeamsList.length; i++) {
    if (teamName === mdsTeamsList[i].shortName) {
      teamPicks = mdsTeamsList[i].draftPicks;
      break;
    }
  }

  teamPicks.sort(function (x, y) {
    return x.number - y.number;
  });

  var teamFuturePicks = teamPicks.filter((pick) => !pick.number && pick.currentTeam.shortName !== pick.originalTeam
    .shortName);
  var teamCurrentPicks = teamPicks.filter((pick) => pick.number);

  for (var i = 0; i < teamCurrentPicks.length; i++) {
    if (teamCurrentPicks[i].number <= ultimateSimData.mds_constants.roundends[rounds]) {
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
        playerDetailsContainer.addEventListener("click", showPlayerInfo);

        var playerPositionDraftfromHolder = document.createElement("div");
        addClass(playerPositionDraftfromHolder, "player-position-draftfrom-holder");

        var playerPositionHolder = document.createElement("span");
        addClass(playerPositionHolder, "player-position");
        playerPositionHolder.innerHTML = teamCurrentPicks[i].playerSelection.position;

        var playerDraftFromHolder = document.createElement("span");
        addClass(playerDraftFromHolder, "player-draftfrom");
        playerDraftFromHolder.innerHTML = teamCurrentPicks[i].playerSelection.draftFrom;

        playerPositionDraftfromHolder.appendChild(playerPositionHolder);
        playerPositionDraftfromHolder.appendChild(playerDraftFromHolder);

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
        tradeIconHolder.addEventListener("click", showTradeData);
        var tradeIcon = document.createElement("img");
        addClass(tradeIcon, "trade-icon");
        tradeIcon.setAttribute("src", STATIC_URL + "/skm/assets/nfl-mockup/trade-details-icon-blue-new.png");

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
    pickNumberHolder.innerHTML = teamFuturePicks[i].futurePickYear + " " + teamFuturePicks[i].futureOriginalTeam +
      " " + teamFuturePicks[i].futureRound;
    pickHolder.appendChild(pickNumberHolder);

    picksContainer.appendChild(pickHolder);
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

function toggleMyPicks(target) {
  var draftResultBtn = $(".draft-result-btn");
  var myPicksBtn = $(".my-picks-btn");
  var nextPicksContainer = $(".next-pick-container");
  var roundPicksContainer = $(".rounds-pics-holder");
  var myPicksContainer = $(".mypicks-container");
  var redirectedFromSection = currentSection;

  if (redirectedFromSection == "mypicks" || target.classList.contains("draft-result-btn")) {
    currentSection = "result";
    removeClass(myPicksBtn, "selected");
    addClass(draftResultBtn, "selected");
    addClass(myPicksContainer, "hidden");
    removeClass(nextPicksContainer, "hidden");
    removeClass(roundPicksContainer, "hidden");
    var currentPickContainer = getCurrentPickContainer();
    if (currentPickContainer) {
      currentPickContainer.scrollIntoView({ behavior: "auto", block: "center" });
    }
  } else {
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
  var teamNeedsTemplate = document.getElementById("team-needs-template").content.cloneNode(true);
  var teamNeedsContainer = teamNeedsTemplate.querySelector(".team-needs-container");
  var closeBtn = teamNeedsTemplate.querySelector(".close-btn");
  closeBtn.addEventListener("click", closeTeamNeeds);
  var teamNeedsHolder = teamNeedsTemplate.querySelector(".team-needs-holder");
  addClass(teamNeedsHolder, "team-needs-grid-container");
  mdsTeamsList.forEach((team) => {
    var gridItem = document.createElement('div');
    addClass(gridItem, "team-needs-grid-item");
    var teamLogo = document.createElement("img");
    addClass(teamLogo, "team-logo");
    teamLogo.setAttribute("src", STATIC_URL + teamLogoPath + team.teamLogo + logoCacheBuster);
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

  var overlay = $(".mds-overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  } else {
    var overlay = document.createElement("div");
    addClass(overlay, "mds-overlay");
    document.body.appendChild(overlay);
  }

  addClass(teamNeedsContainer, "popup");
  document.body.appendChild(teamNeedsContainer);
}

function proposeTrade(currentTeam, offeringTeam, currentTeamPicks, offeringTeamPicks) {
  if (isPausingDraftRequired()) {
    pauseDraft();
  }
  var userTeamsContainer = document.getElementById("user-teams-for-trade").content.cloneNode(true);
  var teamsContainer = userTeamsContainer.querySelector(".trade-proposal-user-teams-conatiner");
  var navNextBtn = userTeamsContainer.querySelector(".nav-btn.next");
  navNextBtn.addEventListener("click", function () {
    showAllTeamsSelectionPopupForTradeProposal(offeringTeam, currentTeamPicks, offeringTeamPicks);
  });
  var closeBtn = userTeamsContainer.querySelector(".close-btn");
  closeBtn.addEventListener("click", closeProposalPopup);
  var teamsHolder = userTeamsContainer.querySelector(".user-teams-holder");
  if (teamsHolder) {
    var teams = [];
    mdsTeamsList.forEach(function (team) {
      if (userSelectedTeams.includes(team.shortName)) {
        teams.push(team);
      }
    });

    teams.forEach(function (team) {
      var teamHolder = document.createElement("button");
      addClass(teamHolder, "team-btn");
      teamHolder.addEventListener("click", selectTeamForUserTrade);
      teamHolder.dataset.teamname = team.shortName;
      teamHolder.dataset.teamlogo = team.teamLogo;
      var teamName = document.createElement("span");
      addClass(teamName, "team-name");
      teamName.innerHTML = team.shortName;
      teamHolder.appendChild(teamName);

      var teamLogo = document.createElement("img");
      addClass(teamLogo, "team-logo");
      teamLogo.setAttribute("src", STATIC_URL + teamLogoPath + team.teamLogo + logoCacheBuster);
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

  var overlay = $(".mds-overlay");
  if (overlay) {
    removeClass(overlay, "hidden");
  } else {
    var overlay = document.createElement("div");
    addClass(overlay, "mds-overlay");
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

    const overlay = $(".mds-overlay");
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
  }

  const overlay = $(".mds-overlay");
  if (overlay && !checkForAlreadyOpenPopup()) {
    addClass(overlay, "hidden");
  }
}

function showAllTeamsSelectionPopupForTradeProposal(offeringTeam, currentTeamPicks, offeringTeamPicks) {
  if (isPausingDraftRequired()) {
    pauseDraft();
  }
  var userTeamsSelectionContainer = $(".trade-proposal-user-teams-conatiner");
  var allTeamsContainer = document.getElementById("all-teams-for-trade").content.cloneNode(true);
  var teamsContainer = allTeamsContainer.querySelector(".trade-proposal-all-teams-conatiner");
  var navNextBtn = allTeamsContainer.querySelector(".nav-btn.next");
  navNextBtn.addEventListener("click", function () {
    showAvailablePicksForSelectedTeams(currentTeamPicks, offeringTeamPicks);
  });
  var closeBtn = allTeamsContainer.querySelector(".close-btn");
  closeBtn.addEventListener("click", closeProposalPopup);

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
    userTeamLogo.setAttribute("src", STATIC_URL + teamLogoPath + teamLogo + logoCacheBuster);

    var userTeamName = teamsContainer.querySelector(".competing-teams-container .user-team-container .team-name");
    userTeamName.innerHTML = teamName;
  }

  var allTeamsHolder = allTeamsContainer.querySelector(".all-teams-container .all-teams-holder");
  if (allTeamsHolder) {
    mdsTeamsList.forEach(function (team) {
      var teamHolder = document.createElement("button");
      addClass(teamHolder, "team-btn");
      teamHolder.addEventListener("click", selectOppositionTeamForTrade);
      teamHolder.dataset.teamname = team.shortName;
      teamHolder.dataset.teamlogo = team.teamLogo;
      var teamName = document.createElement("span");
      addClass(teamName, "team-name");
      teamName.innerHTML = team.shortName;
      teamHolder.appendChild(teamName);

      var teamLogo = document.createElement("img");
      addClass(teamLogo, "team-logo");
      teamLogo.setAttribute("src", STATIC_URL + teamLogoPath + team.teamLogo + logoCacheBuster);
      teamLogo.setAttribute("width", 25);
      teamLogo.setAttribute("alt", team.shortName);

      teamHolder.appendChild(teamLogo);
      var teamSelectedForTrade = $(".user-teams-container .user-teams-holder .team-btn.selected");
      if (team.shortName === teamSelectedForTrade.dataset.teamname) {
        teamHolder.style.opacity = 0.4;
        teamHolder.style.cursor = "not-allowed";
        teamHolder.disabled = true;
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
    opposingTeamContainer.querySelector(".team-name").innerHTML = target.dataset.teamname;
    opposingTeamContainer.querySelector(".team-logo").setAttribute("src", STATIC_URL +
      teamLogoPath + target.dataset.teamlogo + logoCacheBuster);
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

    var userTeamContainer = tradeProposalContainer.querySelector(".competing-teams-container .user-team-container");
    var userTeamName;
    if (userTeamContainer) {
      userTeamName = userTeamContainer.dataset.teamname;
    }

    var opposingTeamContainer = tradeProposalContainer.querySelector(
      ".competing-teams-container .opposing-team-container");
    var opposingTeamName;
    if (opposingTeamContainer) {
      opposingTeamName = opposingTeamContainer.dataset.teamname;
    }

    var userTeamPicks;
    var opposingTeamPicks;
    for (var i = 0; i < mdsTeamsList.length; i++) {
      if (!userTeamPicks || !opposingTeamPicks) {
        if (mdsTeamsList[i].shortName === userTeamName) {
          userTeamPicks = mdsTeamsList[i].draftPicks;
        } else if (mdsTeamsList[i].shortName === opposingTeamName) {
          opposingTeamPicks = mdsTeamsList[i].draftPicks;
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
      var currentYearUserPicksHolder = picksSelectionContainer.querySelector(
        ".user-picks .current-year-picks .picks-holder");
      var nextYearUserPicksHolder = picksSelectionContainer.querySelector(
        ".user-picks .next-year-picks .picks-holder");
      var currentYearOpposingTeamPicksHolder = picksSelectionContainer.querySelector(
        ".opposing-team-picks .current-year-picks .picks-holder");
      var nextYearOpposingTeamPicksHolder = picksSelectionContainer.querySelector(
        ".opposing-team-picks .next-year-picks .picks-holder");
      var futurePickYear;

      if (currentYearUserPicksHolder && nextYearUserPicksHolder && currentYearOpposingTeamPicksHolder &&
        nextYearOpposingTeamPicksHolder) {
        currentYearUserPicksHolder.innerHTML = "";
        nextYearUserPicksHolder.innerHTML = "";
        currentYearOpposingTeamPicksHolder.innerHTML = "";
        nextYearOpposingTeamPicksHolder.innerHTML = "";

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
            input.addEventListener("input", enableTradeProposalProposeTradeButton);
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
            input.addEventListener("input", enableTradeProposalProposeTradeButton);
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
      backBtn.addEventListener("click", showAllTeamsForUserSelection)
    }

    var proposeBtn = $(".nav-btn-container .nav-btn.propose");
    if (proposeBtn) {
      removeClass(proposeBtn, "hidden");
      let newProposeBtn = proposeBtn.cloneNode(true);
      proposeBtn.parentNode.replaceChild(newProposeBtn, proposeBtn);
      if (currentTeamPicks && offeringTeamPicks) {
        newProposeBtn.addEventListener("click", function () {
          showTradeConfirmationInfo(true);
        });
      } else {
        newProposeBtn.addEventListener("click", function () {
          showTradeConfirmationInfo(false);
        });
      }
    }

    if (currentTeamPicks && offeringTeamPicks && offeringTeamPicks.team == opposingTeamName) {
      var allCurrentTeamPicks = $all(".trade-proposal-all-teams-conatiner .user-picks .current-year-picks input");
      var allOfferingTeamPicks = $all(
        ".trade-proposal-all-teams-conatiner .opposing-team-picks .current-year-picks input");
      var allCurrentTeamFuturePicks = $all(".trade-proposal-all-teams-conatiner .user-picks .next-year-picks input");
      var allOfferingTeamFuturePicks = $all(
        ".trade-proposal-all-teams-conatiner .opposing-team-picks .next-year-picks input");

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
            if (futureArray[0] == teamPick.dataset.futureround && futureArray[1] == teamPick.dataset.futurepickyear &&
              futureArray[2] == teamPick.dataset.futureoriginalteam) {
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
            if (futureArray[0] == teamPick.dataset.futureround && futureArray[1] == teamPick.dataset.futurepickyear &&
              futureArray[2] == teamPick.dataset.futureoriginalteam) {
              teamPick.checked = true;
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
      var opposingTeamPicks = picksSelectionContainer.querySelector(".opposing-team-picks");
      var opposingTeamSelectedPicks = opposingTeamPicks.querySelectorAll('input[data-for="picks"]:checked');

      if (userSelectedPicks.length && opposingTeamSelectedPicks.length) {
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
              pickHolder.innerHTML = dataset.futurepickyear + " " + dataset.futureoriginalteam + " " + dataset
                .futureround;
            }

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
              pickHolder.innerHTML = dataset.futurepickyear + " " + dataset.futureoriginalteam + " " + dataset
                .futureround;
            }

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
          for (var i = 0; i < opposingTeamSelectedPicks.length; i++) {
            confirmOpposingPicksValue += parseInt(opposingTeamSelectedPicks[i].value) || 0;
          }

          var confirmTotalValue = confirmUserPicksValue + confirmOpposingPicksValue;
          var confirmUserPercent = confirmTotalValue > 0 ? (confirmUserPicksValue / confirmTotalValue * 100).toFixed(1) : "0.0";
          var confirmOpposingPercent = confirmTotalValue > 0 ? (confirmOpposingPicksValue / confirmTotalValue * 100).toFixed(1) : "0.0";

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
      confirmBtn.addEventListener("click", function () {
        checkUserTradePossibility(counterOffer);
      });
    }

    var backBtn = $(".nav-btn-container .nav-btn.back");
    if (backBtn) {
      backBtn.removeEventListener("click", showAllTeamsForUserSelection);
      backBtn.addEventListener("click", unhidePicksForUserSelection);
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
      backBtn.removeEventListener("click", unhidePicksForUserSelection);
      backBtn.addEventListener("click", showAllTeamsForUserSelection);
    }

    var proposeBtn = $(".nav-btn-container .nav-btn.propose");
    if (proposeBtn) {
      removeClass(proposeBtn, "hidden");
    }

    var confirmBtn = $(".nav-btn-container .nav-btn.confirm");
    if (confirmBtn) {
      addClass(confirmBtn, "hidden");
      confirmBtn.removeEventListener("click", checkUserTradePossibility);
    }
  }
}

function getCurrentPickContainer() {
  var currentPick = getCurrentPick().currentPick;
  let currentPickNumber = currentPick.number;

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
    var opposingTeamPicks = picksSelectionContainer.querySelector(".opposing-team-picks");
    var opposingTeamSelectedPicks = opposingTeamPicks.querySelectorAll('input[data-for="picks"]:checked');
    let currentPick = getCurrentPick().currentPick;
    let currentPickTeam = currentPick.currentTeam.shortName;
    let currentPickNumber = parseInt(currentPick.number);
    let currentPickIncludedInTrade = false;

    if (userSelectedPicks.length && opposingTeamSelectedPicks.length) {
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
            (oddsOfOfferingMore < 50 ?
              newPackageRatio < originalPackageRatio :
              oddsOfOfferingMore < 85 ?
                newPackageRatio < originalPackageRatio + 0.05 :
                newPackageRatio < originalPackageRatio + 0.15)
          ) {
            tradeAccepted = true;
          } else {
            tradeAccepted = false;
          }
        } else {
          tradeAccepted = false;
        }
      } else {
        if (parseInt(opposingTeamSelectedPicks[0].dataset.number) < parseInt(userSelectedPicks[0].dataset.number)) { //user trying to go up
          var highestValuePick = parseInt(opposingTeamSelectedPicks[0].dataset.number);
          if ((highestValuePick < 3 && userPicksValue >= opposingTeamPicksValue * 1) ||
            (highestValuePick >= 3 && highestValuePick < 11 && userPicksValue > opposingTeamPicksValue * 0.99) ||
            (highestValuePick >= 11 && highestValuePick < 33 && userPicksValue > opposingTeamPicksValue * 0.975) ||
            (highestValuePick >= 33 && userPicksValue > opposingTeamPicksValue * 0.95)) {
            tradeAccepted = true;
          }
        } else {
          var highestValuePick = parseInt(userSelectedPicks[0].dataset.number);
          if ((highestValuePick < 3 && userPicksValue > opposingTeamPicksValue * 1) ||
            (highestValuePick >= 3 && highestValuePick < 11 && userPicksValue > opposingTeamPicksValue * 0.99) ||
            (highestValuePick >= 11 && highestValuePick < 33 && userPicksValue > opposingTeamPicksValue * 0.975) ||
            (highestValuePick >= 33 && userPicksValue > opposingTeamPicksValue * 0.95)) {
            tradeAccepted = true;
          }
        }
      }

      let closeProposalContainerBtn = $(".trade-proposal-all-teams-conatiner .close-btn");
      if (closeProposalContainerBtn) {
        addClass(closeProposalContainerBtn, "hidden");
      }

      if (tradeAccepted) {
        tradesCompletedCount++;
        var givingTeam;
        var gettingTeam;
        for (var i = 0; i < mdsTeamsList.length; i++) {
          if (!givingTeam || !gettingTeam) {
            if (userSelectedPicks[0].dataset.teamname === mdsTeamsList[i].shortName) {
              givingTeam = mdsTeamsList[i];
            }

            if (opposingTeamSelectedPicks[0].dataset.teamname === mdsTeamsList[i].shortName) {
              gettingTeam = mdsTeamsList[i];
            }
          } else {
            break;
          }
        }
        var givingPicks = [];
        var gettingPicks = [];
        for (var i = 0; i < mdsTeamsList.length; i++) {
          if (userSelectedPicks[0].dataset.teamname === mdsTeamsList[i].shortName) {
            for (var j = 0; j < mdsTeamsList[i].draftPicks.length; j++) {
              for (var k = 0; k < userSelectedPicks.length; k++) {
                if ((!mdsTeamsList[i].draftPicks[j].number || mdsTeamsList[i].draftPicks[j].number === parseInt(
                  userSelectedPicks[k].dataset.number)) && mdsTeamsList[i].draftPicks[j].futureRound ===
                  userSelectedPicks[k].dataset.futureround && mdsTeamsList[i].draftPicks[j].futureOriginalTeam ===
                  userSelectedPicks[k].dataset.futureoriginalteam) {
                  givingPicks.push(mdsTeamsList[i].draftPicks[j]);
                  mdsTeamsList[i].draftPicks[j].currentTeam = gettingTeam;
                  mdsTeamsList[i].draftPicks.splice(j, 1);
                }
              }
            }
          }

          if (opposingTeamSelectedPicks[0].dataset.teamname === mdsTeamsList[i].shortName) {
            for (var j = 0; j < mdsTeamsList[i].draftPicks.length; j++) {
              for (var k = 0; k < opposingTeamSelectedPicks.length; k++) {
                if ((!mdsTeamsList[i].draftPicks[j].number || mdsTeamsList[i].draftPicks[j].number === parseInt(
                  opposingTeamSelectedPicks[k].dataset.number)) && mdsTeamsList[i].draftPicks[j].futureRound ===
                  opposingTeamSelectedPicks[k].dataset.futureround && mdsTeamsList[i].draftPicks[j]
                    .futureOriginalTeam === opposingTeamSelectedPicks[k].dataset.futureoriginalteam) {
                  gettingPicks.push(mdsTeamsList[i].draftPicks[j]);
                  mdsTeamsList[i].draftPicks[j].currentTeam = givingTeam;
                  mdsTeamsList[i].draftPicks.splice(j, 1);
                }
              }
            }
          }
        }

        for (var i = 0; i < givingPicks.length; i++) {
          givingPicks[i].tradedPick = true;
          gettingTeam.draftPicks.push(givingPicks[i]);
        }

        for (var i = 0; i < gettingPicks.length; i++) {
          gettingPicks[i].tradedPick = true;
          givingTeam.draftPicks.push(gettingPicks[i]);
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

        var tradeIndex = tradesData.length;
        updateTradedPicks(givingPicks, tradeIndex);
        updateTradedPicks(gettingPicks, tradeIndex);
        setTradesData(givingPicks, gettingPicks);
        disableShowOffersBtn();
        offersList = [];
        var currentPickContainer = getCurrentPickContainer();
        if (currentPickContainer) {
          removeClass(currentPickContainer, "currentPick");
        }

        removeClass($(".trade-accepted-container"), "hidden");
      } else {
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

        var overlay = $(".mds-overlay");
        if (overlay && !checkForAlreadyOpenPopup()) {
          addClass(overlay, "hidden");
        }

        if (IS_DESKTOP) {
          let myPicksBtn = $(".mypicks-btn-holder .my-picks-btn");
          if (myPicksBtn && myPicksBtn.classList.contains("selected")) {
            let selectedTeamBtn = $(
              ".selected-user-teams-container .team-logo-btn-container.selected button.team-logo-btn");
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

function enableTradeProposalProposeTradeButton() {
  var userInput = $('.user-picks input[data-for="picks"]:checked');
  var opposingTeamInput = $('.opposing-team-picks input[data-for="picks"]:checked');
  var proposeBtn = $(".nav-btn-container .nav-btn.propose");
  if (userInput && opposingTeamInput && proposeBtn) {
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

  if (!userSelectedPicks.length || !opposingTeamSelectedPicks.length) {
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

  var isCounterOffer = false;
  var likelyAccept = false;
  var likelyClose = false;
  var progressPercent = 0;

  var offerContainer = $(".offer-container");
  if (offerContainer && offerContainer.dataset.currentteamgivingpicks && offerContainer.dataset.currentteamgettingpicks) {
    isCounterOffer = true;
    var originalCurrentTeamPicks = JSON.parse(offerContainer.dataset.currentteamgivingpicks);
    var originalOfferingTeamPicks = JSON.parse(offerContainer.dataset.currentteamgettingpicks);
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

    var currentRatio = opposingTeamPicksValue > 0 ? userPicksValue / opposingTeamPicksValue : 0;
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
    progressFill.style.width = Math.min(progressPercent, 100) + "%";
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
      playerDetailsHolder.addEventListener("click", showPlayerInfo);

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
      playerInfoBtn.addEventListener("click", showPlayerInfo);
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
      playerDraftBtn.addEventListener("click", addPlayerToPick);
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

function groupConsecutivePicks(data) {
  // normalize numbers and sort defensively
  const arr = data
    .map(pick => ({ ...pick, number: Number(pick.number) }))
    .sort((a, b) => a.number - b.number); // ascending

  const groups = [];
  let current = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    if (current.length === 0) {
      current.push(item);
      continue;
    }

    const prev = current[current.length - 1];

    if (item.number === prev.number + 1) {
      // still consecutive, extend group
      current.push(item);
    } else {
      // break; flush current and start new
      groups.push(current);
      current = [item];
    }
  }

  if (current.length) groups.push(current);

  return groups;
}


function insertCompensatoryPicks(draftOrder, currentPicksList, compPicks) {
  const compPicksGroups = groupConsecutivePicks(compPicks);
  compPicksGroups.forEach(picks => {
    let teamShortNames = [];
    picks.forEach(pick => {
      teamShortNames.push(pick.shortName);
      pick.value = Number(pick.value);
      pick.futurePick = false;
      pick.tradeUpPick = false;
      pick.onTheClock = false;
    });
    const pickNumber = picks[0]["number"];
    draftOrder.splice(pickNumber - 1, 0, ...teamShortNames);
    currentPicksList.splice(pickNumber - 1, 0, ...picks);

    const newIndex = pickNumber - 1 + picks.length;
    for (let i = newIndex; i <= currentPicksList.length; i++) {
      if (!currentPicksList[i]["number"]) break;

      currentPicksList[i]["number"] = currentPicksList[i]["number"] + picks.length;
    }
  });

  return [draftOrder, currentPicksList, compPicksGroups];
}

function calculateNewRoundEnds(currentRoundEnds, compPicksGroups) {
  let totalPicksAdded = 0;
  compPicksGroups.forEach((group, groupIndex) => {
    const oldRoundEnd = group[0];
    const newRoundEnd = group[group.length - 1];

    const indexToInsert = currentRoundEnds.findIndex(number => number === (oldRoundEnd["number"] - totalPicksAdded));
    if (indexToInsert > -1) {
      currentRoundEnds[indexToInsert] = newRoundEnd["number"];
    }

    totalPicksAdded += group.length;
  });

  return currentRoundEnds;
}

async function initializeMockdraftSimulator() {
  if (!IS_DESKTOP) {
    const footerNav = $(".pfn-content-wrapper .pfn-footer");
    if (footerNav) {
      addClass(footerNav, "hidden");
    }
  }
  createMDSPicksList(sevenRoundDraftOrder);
  [sevenRoundDraftOrder, currentPicksList, compPicksGroups] = insertCompensatoryPicks(sevenRoundDraftOrder, picksList, ultimateSimData.compensatory_picks); // not needed as compensatory picks are directly added in sheet
  picksList = currentPicksList;

  for (let i = 0; i < picksList.length; i++) {
    const teamIndex = mdsTeamsList.findIndex((team) => team["shortName"] === picksList[i]["shortName"]);
    if (teamIndex > -1) {
      picksList[i].teamLogo = mdsTeamsList[teamIndex].teamLogo;
    }
  }

  await yieldToMain();
  startDraftHelper();
}

function createMDSPicksList(draftOrder) {
  // Build pick trades lookup from mds_pick_trades sheet data
  var pickTradesMap = {};
  var roundKeys = ["Round One", "Round Two", "Round Three", "Round Four", "Round Five", "Round Six", "Round Seven"];
  if (ultimateSimData.mds_pick_trades) {
    ultimateSimData.mds_pick_trades.forEach(function (entry) {
      var team = entry["Original"];
      if (team) {
        pickTradesMap[team] = {};
        for (var r = 0; r < roundKeys.length; r++) {
          pickTradesMap[team][r + 1] = entry[roundKeys[r]] || team;
        }
      }
    });
  }

  var PICKS_PER_ROUND = 32;
  draftOrder.forEach((teamShortName, index) => {
    var round = Math.floor(index / PICKS_PER_ROUND) + 1;
    var resolvedTeam = teamShortName;

    // If this team's pick for this round was traded, replace with the new team
    if (pickTradesMap[teamShortName] && round <= 7) {
      var tradedTo = pickTradesMap[teamShortName][round];
      if (tradedTo && tradedTo !== teamShortName) {
        resolvedTeam = tradedTo;
      }
    }

    let pick = {};
    pick["number"] = index + 1;
    pick["futureRound"] = "";
    pick["futurePickYear"] = "";
    pick["futureOriginalTeam"] = "";
    pick["futurePick"] = false;
    pick["value"] = Number(ultimateSimData.mds_picks[index].value);
    pick["shortName"] = resolvedTeam;
    pick["originalTeam"] = "";
    pick["pickingTeam"] = "";
    pick["playerSelection"] = ultimateSimData.mds_picks[index].playerSelection;
    pick["onTheClock"] = index === 0 ? true : false;
    pick["tradeUpPick"] = false;
    pick["positionDeterminant"] = "";

    picksList.push(pick);
  });

  Object.keys(mdsFuturePickValues).forEach(key => {
    nflTeamShortNames.forEach(teamShortName => {
      let pick = {};
      pick["number"] = "";
      pick["futureRound"] = key,
      pick["futurePickYear"] = upcomingYear,
      pick["futureOriginalTeam"] = teamShortName,
      pick["futurePick"] = true,
      pick["value"] = mdsFuturePickValues[key],
      pick["shortName"] = teamShortName;
      pick["originalTeam"] = "";
      pick["pickingTeam"] = "";
      pick["playerSelection"] = "";
      pick["onTheClock"] = false;
      pick["tradeUpPick"] = false;
      pick["positionDeterminant"] = "";

      picksList.push(pick);
    })
  });
}

function showFinalPredictionsSection() {
  if (!IS_DESKTOP) {
    const footerNav = $(".pfn-content-wrapper .pfn-footer");
    if (footerNav) {
      removeClass(footerNav, "hidden");
    }
  }
  trackGAEventForPage("navigate_to_next_year_playoff_predictor_screen", {
    team: userSelectedGMTeam,
  });

  if (!IS_DESKTOP) {
    const stepsBar = document.querySelector('.steps-wrap .steps-bar');
    stepsBar.scrollBy({
      left: 180,
      behavior: 'smooth'
    });
  }
  const previousStepNode = $(".step-node.six");
  if (previousStepNode) {
    removeClass(previousStepNode, "is-active-border");
  }
  const stepNode = $(".step-node.seven");
  if (stepNode) {
    addClass(stepNode, "is-active");
    addClass(stepNode, "is-active-border");
  }
  const stepNum = $(".step-node.six .step-num");
  if (stepNum) {
    addClass(stepNum, "hidden");
  }
  const stepCompleted = $(".step-node.six .step-completed");
  if (stepCompleted) {
    removeClass(stepCompleted, "hidden");
  }
  const arrow = $(".arrow.seven");
  if (arrow) {
    addClass(arrow, "blue");
    arrow.style.setProperty('--after-color', '#0857C3');
  }

  // Remove MDS document-level click listeners
  document.removeEventListener("click", hideOffers);
  document.removeEventListener("click", hideTradeDetails);
  document.removeEventListener("click", closePlayerInfoPopup);
  document.removeEventListener("click", closeTeamPicksInfoPopup);

  const rosterResult = $(".mds-roster-result-container");
  if (rosterResult) {
    rosterResult.remove();
  }

  const mockdraftSimulator = $("#mockdraft-simulator");
  if (mockdraftSimulator) {
    mockdraftSimulator.remove();
  }

  // Free MDS-only data after DOM removal
  picksList = [];
  tradesData = [];
  offersList = [];
  sevenRoundDraftOrder = null;
  draftOrderTeamsSequence = [];
  nflTeamsPlayersList = [];

  // Free ultimateSimData properties only needed up to MDS
  delete ultimateSimData.compensatory_picks;
  delete ultimateSimData.mds_picks_new;

  const playoffPredictor = $("#screen-predict-playoffs");
  if (playoffPredictor) {
    removeClass(playoffPredictor, "hidden");
  }

  weekMatchesData = [];
  defaultWeekMatchesData = [];
  teamsData = {};
  defaultTeamsData = {};
  teamsList = [];
  totalWeeks = 18;
  landingWeek = 1;
  firstFiveWeeksMatchesCompleted = false;
  currentWeek = landingWeek;
  pauseSimulatorFlag = false;
  leagueData = [];
  conferenceData = {};
  divisionData = {};
  playoffParticipants = {};
  playoffMatchesData = {};
  playerOffCompletedMatchesData = {};

  prepareWeekMatchesData(ultimateSimData["next_season_sim"]),
  prepareTeamsData(ultimateSimData["next_season_team_level_data"]),
  preparePlayoffsData(ultimateSimData["next_season_playoffs"]);
  showNextScreenLoadingPopup("The next year's games will be now simulated based on all roster changes...");
  reverseWinProbabilityGrid = false;
  initializePlayoffPredictorTool(false);
  const playoffsOverlay = $(".playoffs-overlay");
  if (playoffsOverlay) {
    removeClass(playoffsOverlay, "hidden");
  }
}

function showUltimateFinalResult() {
  trackGAEventForPage("navigate_to_ultimate_result_screen", {
    team: userSelectedGMTeam,
  });

  collectTeamsConferenceAndRecordsRank(conferenceData, "");
  collectTeamsDivisionRank(divisionData, "");
  collectPlayoffMatchesData(playoffMatchesData, "");
  if (!IS_DESKTOP) {
    const stepsBar = document.querySelector('.steps-wrap .steps-bar');
    stepsBar.scrollBy({
      left: 180,
      behavior: 'smooth'
    });
  }
  const previousStepNode = $(".step-node.seven");
  if (previousStepNode) {
    removeClass(previousStepNode, "is-active-border");
  }
  const stepNode = $(".step-node.eight");
  if (stepNode) {
    addClass(stepNode, "is-active");
    addClass(stepNode, "is-active-border");
  }
  const stepNum = $(".step-node.seven .step-num");
  if (stepNum) {
    addClass(stepNum, "hidden");
  }
  const stepCompleted = $(".step-node.seven .step-completed");
  if (stepCompleted) {
    removeClass(stepCompleted, "hidden");
  }
  const arrow = $(".arrow.eight");
  if (arrow) {
    addClass(arrow, "blue");
    arrow.style.setProperty('--after-color', '#0857C3');
  }

  const playoffScreen = $("#screen-predict-playoffs");
  if (playoffScreen) {
    // Clone elements needed by result screen tabs before destroying DOM
    var divStandings = playoffScreen.querySelector(".division-standings");
    if (divStandings) cachedDivisionStandings = divStandings.cloneNode(true);
    var confStandings = playoffScreen.querySelector(".conference-standings");
    if (confStandings) cachedConferenceStandings = confStandings.cloneNode(true);
    var playoffBracket = playoffScreen.querySelector(".predict-playoff-games-popup-content");
    if (playoffBracket) cachedPlayoffBracket = playoffBracket.cloneNode(true);
    var draftOrderEl = playoffScreen.querySelector(".draft-order-table");
    if (draftOrderEl) cachedDraftOrderTable = draftOrderEl.cloneNode(true);

    // Preserve style tags, destroy everything else
    var playoffStyles = playoffScreen.querySelectorAll("style");
    playoffScreen.innerHTML = "";
    playoffStyles.forEach(function (tag) { playoffScreen.appendChild(tag); });
    addClass(playoffScreen, "hidden");
  }

  // Free data not needed for result screen (weekMatchesData & playoffMatchesData kept for download canvas)
  defaultWeekMatchesData = [];
  teamsData = {};
  defaultTeamsData = {};
  winProbabilityGrid = [];
  leagueData = [];
  playoffParticipants = {};
  playerOffCompletedMatchesData = {};

  // Free next_season data from ultimateSimData
  delete ultimateSimData.next_season_sim;
  delete ultimateSimData.next_season_team_level_data;
  delete ultimateSimData.next_season_playoffs;

  const ultimateResultScreen = $("#ultimate-result-section");
  if (ultimateResultScreen) {
    removeClass(ultimateResultScreen, "hidden");
  }

  const bottomContainer = $(".info-text-continue-btn-container");
  if (bottomContainer) {
    bottomContainer.remove();
  }

  const resultOverviewBtn = $(".ultimate-result-screen .result-overview-btn");
  if (resultOverviewBtn) {
    resultOverviewBtn.addEventListener("click", showOverviewResultForTeams);
    resultOverviewBtn.click();
  }

  const rosterResultBtn = $(".ultimate-result-screen .rosters-result-btn");
  if (rosterResultBtn) {
    rosterResultBtn.addEventListener("click", showRosterResultsForTeams);
  }

  const standingsResultBtn = $(".ultimate-result-screen .standings-result-btn");
  if (standingsResultBtn) {
    standingsResultBtn.addEventListener("click", showStandingsResultsForTeams);
  }

  const draftOrderResultBtn = $(".ultimate-result-screen .draft-order-result-btn");
  if (draftOrderResultBtn) {
    draftOrderResultBtn.addEventListener("click", showDraftOrderResultsForTeams);
  }

  const downloadBtns = $all(".ultimate-result-screen .download-btn");
  if (downloadBtns.length > 0) {
    downloadBtns.forEach(btn => btn.addEventListener("click", downloadTeamUltimateResult));
  }

  const shareBtns = $all(".ultimate-result-screen .share-btn");
  if (shareBtns.length > 0) {
    if (!navigator || !navigator.share) {
      shareBtns.forEach(btn => addClass(btn, "hidden"));
    } else {
      shareBtns.forEach(btn => btn.addEventListener("click", shareTeamUltimateResult));
    }
  }
}

function showStandingsResultsForTeams() {
  const teamLogosContainer = $(".ultimate-result-header-container .result-header-team-logos-container");
  if (teamLogosContainer) {
    addClass(teamLogosContainer, "hidden");
  }

  const selectedBtn = $(".result-section-btns .selected");
  if (selectedBtn) {
    removeClass(selectedBtn, "selected");
  }

  const standingsResultBtn = $(".result-section-btns .standings-result-btn");
  if (standingsResultBtn) {
    addClass(standingsResultBtn, "selected");
  }

  const standingsCategoryBtnsContainer = $(".result-header-predicted-standings-btns-holder");
  if (standingsCategoryBtnsContainer) {
    removeClass(standingsCategoryBtnsContainer, "hidden");
    const divisionResultBtn = standingsCategoryBtnsContainer.querySelector(".division-result-btn");
    if (divisionResultBtn) {
      divisionResultBtn.addEventListener("click", showDivisionStandingsResultsForTeams);
    }

    const conferenceResultBtn = standingsCategoryBtnsContainer.querySelector(".conference-result-btn");
    if (conferenceResultBtn) {
      conferenceResultBtn.addEventListener("click", showConferenceStandingsResultsForTeams);
    }

    const playoffBracketResultBtn = standingsCategoryBtnsContainer.querySelector(".playoff-bracket-result-btn");
    if (playoffBracketResultBtn) {
      playoffBracketResultBtn.addEventListener("click", showFinalPlayoffBracketResult);
    }
  }

  showDivisionStandingsResultsForTeams();
}

function showDraftOrderResultsForTeams() {
  const teamLogosContainer = $(".ultimate-result-header-container .result-header-team-logos-container");
  if (teamLogosContainer) {
    addClass(teamLogosContainer, "hidden");
  }

  const selectedBtn = $(".result-section-btns .selected");
  if (selectedBtn) {
    removeClass(selectedBtn, "selected");
  }

  const draftOrderResultBtn = $(".result-section-btns .draft-order-result-btn");
  if (draftOrderResultBtn) {
    addClass(draftOrderResultBtn, "selected");
  }

  const standingsCategoryBtnsContainer = $(".result-header-predicted-standings-btns-holder");
  if (standingsCategoryBtnsContainer) {
    addClass(standingsCategoryBtnsContainer, "hidden");
  }

  showFinalDraftOrderResultsTable();
}

function showFinalDraftOrderResultsTable() {
  let draftOrderTable = cachedDraftOrderTable;
  if (!draftOrderTable) {
    if (IS_DESKTOP) {
      draftOrderTable = $(".draft-order-section .draft-order-table");
    } else {
      draftOrderTable = $(".standings-draft-order-wrapper .draft-order-table");
    }
  }

  if (draftOrderTable) {
    const draftOrderTableClone = draftOrderTable.cloneNode(true);
    const resultContainer = $(".ultimate-result-screen .result-data-container");
    if (resultContainer) {
      resultContainer.innerHTML = "";
      resultContainer.appendChild(draftOrderTableClone);
    }
  }
}

function showFinalPlayoffBracketResult() {
  const selectedBtn = $(".result-header-predicted-standings-btns-container .selected");
  if (selectedBtn) {
    removeClass(selectedBtn, "selected");
  }

  const playoffBracketBtn = $(".result-header-predicted-standings-btns-container .playoff-bracket-result-btn");
  if (playoffBracketBtn) {
    addClass(playoffBracketBtn, "selected");
  }

  var playoffBracket = cachedPlayoffBracket || $(".predict-playoff-games-popup-container .predict-playoff-games-popup-content");
  if (playoffBracket) {
    const playoffBracketClone = playoffBracket.cloneNode(true);
    const resultContainer = $(".ultimate-result-screen .result-data-container");
    if (resultContainer) {
      resultContainer.innerHTML = "";
      const footer = playoffBracketClone.querySelector(".playoff-predict-popup-footer");
      if (footer) {
        footer.remove();
      }
      const simulateBtns = playoffBracketClone.querySelector(".playoff-games-popup-footer");
      if (simulateBtns) {
        simulateBtns.remove();
      }

      resultContainer.appendChild(playoffBracketClone);
    }
  }
}

function showDivisionStandingsResultsForTeams() {
  const selectedBtn = $(".result-header-predicted-standings-btns-container .selected");
  if (selectedBtn) {
    removeClass(selectedBtn, "selected");
  }

  const divisionBtn = $(".result-header-predicted-standings-btns-container .division-result-btn");
  if (divisionBtn) {
    addClass(divisionBtn, "selected");
  }

  var divisionStandings = cachedDivisionStandings || $(".playoff-predictor-tool-wrapper .division-standings");
  if (divisionStandings) {
    let divisionStandingsClone = divisionStandings.cloneNode(true);

    const resultContainer = $(".ultimate-result-screen .result-data-container");
    if (resultContainer) {
      resultContainer.innerHTML = "";
      divisionStandingsClone = removeUnwantedColumnsFromResultTable(divisionStandingsClone);
      resultContainer.appendChild(divisionStandingsClone);
    }
  }
}

function showConferenceStandingsResultsForTeams() {
  const selectedBtn = $(".result-header-predicted-standings-btns-container .selected");
  if (selectedBtn) {
    removeClass(selectedBtn, "selected");
  }

  const conferenceBtn = $(".result-header-predicted-standings-btns-container .conference-result-btn");
  if (conferenceBtn) {
    addClass(conferenceBtn, "selected");
  }

  var conferenceStandings = cachedConferenceStandings || $(".playoff-predictor-tool-wrapper .conference-standings");
  if (conferenceStandings) {
    let conferenceStandingsClone = conferenceStandings.cloneNode(true);
    removeClass(conferenceStandingsClone, "hidden");

    const resultContainer = $(".ultimate-result-screen .result-data-container");
    if (resultContainer) {
      resultContainer.innerHTML = "";
      conferenceStandingsClone = removeUnwantedColumnsFromResultTable(conferenceStandingsClone);
      resultContainer.appendChild(conferenceStandingsClone);
    }
  }
}

function removeUnwantedColumnsFromResultTable(container) {
  container.querySelectorAll('table').forEach(table => {
    const thead = table.querySelector('thead');
    if (!thead) return;

    const ths = thead.querySelectorAll('th');
    let confIndex = -1;

    // find index of "CONF"
    ths.forEach((th, i) => {
      if (th.textContent.trim().toLowerCase() === 'conf') {
        confIndex = i;
      }
    });

    // if found, remove everything after CONF in both th and td
    if (confIndex !== -1) {
      // remove <th> after CONF
      ths.forEach((th, i) => {
        if (i > confIndex) th.remove();
      });

      // remove <td> after CONF for each row
      table.querySelectorAll('tr').forEach(tr => {
        const tds = tr.querySelectorAll('td');
        tds.forEach((td, i) => {
          if (i > confIndex) td.remove();
        });
      });
    }
  });

  return container;
}

function showOverviewResultForTeams() {
  const selectedBtn = $(".result-section-btns .selected");
  if (selectedBtn) {
    removeClass(selectedBtn, "selected");
  }

  const resultOverviewBtn = $(".result-section-btns .result-overview-btn");
  if (resultOverviewBtn) {
    addClass(resultOverviewBtn, "selected");
  }

  const standingsCategoryBtnsContainer = $(".result-header-predicted-standings-btns-holder");
  if (standingsCategoryBtnsContainer) {
    addClass(standingsCategoryBtnsContainer, "hidden");
  }

  const logosContainer = $(".ultimate-result-header-container .result-header-team-logos-container");
  if (logosContainer) {
    removeClass(logosContainer, "hidden");
    const resultHeaderLogosHolder = logosContainer.querySelector(".result-header-team-logos-holder");
    if (resultHeaderLogosHolder) {
      resultHeaderLogosHolder.innerHTML = "";
      nflTeamShortNames.forEach((shortName, index) => {
        const imgHolder = document.createElement("button");
        imgHolder.dataset.team = shortName;
        imgHolder.addEventListener("click", showTeamOverviewResult);
        addClass(imgHolder, "team-image-holder");
        const img = document.createElement("img");
        if (index === 0) {
          addClass(imgHolder, "selected");
        }
        img.src = STATIC_URL + teamLogoPath + shortName + ".png" + logoCacheBuster;
        img.setAttribute("width", "33px");
        img.setAttribute("height", "22px");
        img.setAttribute("alt", shortName);

        imgHolder.appendChild(img);
        resultHeaderLogosHolder.appendChild(imgHolder);
      });

      const firstTeam = $(".result-header-team-logos-holder .team-image-holder");
      if (firstTeam) {
        firstTeam.click();
        const selectedTeam = firstTeam.dataset.team;
        const resultScreenSection = $(".ultimate-result-screen");
        if (resultScreenSection) {
          resultScreenSection.dataset.team = selectedTeam;
          const teamNameHolder = resultScreenSection.querySelector(".mds-roster-result-header-text");
          if (teamNameHolder) {
            teamNameHolder.innerHTML = selectedTeam;
          }
        }
      }
    }
  }
}

function addOrdinalSuffix(num) {
  const j = num % 10,
    k = num % 100;

  if (k === 11 || k === 12 || k === 13) {
    return num + "th";
  }

  if (j === 1) return num + "st";
  if (j === 2) return num + "nd";
  if (j === 3) return num + "rd";

  return num + "th";
}

function getRoundShortNames(round) {
  const roundsNameMapping = {
    "Wildcard Round": "Wildcard",
    "Divisional Playoffs": "Divisional",
    "Conference Championships": "Conference",
    "Super Bowl": "Super Bowl",
    "Champion": "Champion"
  };

  return roundsNameMapping[round];
}

function showTeamOverviewResult(e) {
  const selectedTeamHolder = $(".result-header-team-logos-holder .team-image-holder.selected");
  if (selectedTeamHolder) {
    removeClass(selectedTeamHolder, "selected");
  }

  const targetBtn = e.target.closest(".team-image-holder");
  let targetTeam;
  if (targetBtn) {
    addClass(targetBtn, "selected");
    targetTeam = targetBtn.dataset.team;
    const resultScreenSection = $(".ultimate-result-screen");
    if (resultScreenSection) {
      resultScreenSection.dataset.team = targetTeam;
    }
  }

  const resultDataContainer = $(".ultimate-result-screen .result-data-container");
  if (resultDataContainer) {
    resultDataContainer.innerHTML = "";
  }

  const modifiedPlayers = collectTeamModifiedPlayers(targetTeam);
  const teamMatchesWinLoss = collectTeamFinalMatchesWinLoss(targetTeam);
  const teamRecord = teamsDownloadData[targetTeam];

  if (resultDataContainer) {
    var resultContainer = document.getElementById("overview-result-section").content.cloneNode(true);
    resultContainer = resultContainer.querySelector(".team-overview-result");

    const headerTeamLogo = resultContainer.querySelector(".overview-header img");
    if (headerTeamLogo) {
      headerTeamLogo.src = STATIC_URL + teamLogoPath + targetTeam + ".png" + logoCacheBuster;
    }

    const headerTeamNameHolder = resultContainer.querySelector(".overview-header .team-name");
    if (headerTeamNameHolder) {
      headerTeamNameHolder.innerHTML = targetTeam;
    }

    // Current Year Records
    const currentPerformanceYearText = resultContainer.querySelector(".performance-container .year-performance.current .season-text");
    if (currentPerformanceYearText) {
      currentPerformanceYearText.innerHTML = currentSeason + " Performance";
    }

    const currentYearRecord = resultContainer.querySelector(".performance-container .year-performance.current .record-rank-container .record-container .value");
    if (currentYearRecord) {
      currentYearRecord.innerHTML = teamRecord.runningYearRecord;
    }

    const currentYearConferenceRank = resultContainer.querySelector(".performance-container .year-performance.current .rank-container .value");
    if (currentYearConferenceRank) {
      currentYearConferenceRank.innerHTML = addOrdinalSuffix(teamRecord.runningYearConferenceRank);
    }

    const currentYearDivisionRank = resultContainer.querySelector(".performance-container .year-performance.current .rank-round-container .rank-container .value");
    if (currentYearDivisionRank) {
      currentYearDivisionRank.innerHTML = addOrdinalSuffix(teamRecord.runningYearDivisionRank);
    }

    const currentYearPlayoffRoundRank = resultContainer.querySelector(".performance-container .year-performance.current .rank-round-container .round-container .value");
    if (currentYearPlayoffRoundRank) {
      if (teamRecord.hasOwnProperty("runningYearPlayoffLevel")) {
        currentYearPlayoffRoundRank.innerHTML = getRoundShortNames(teamRecord.runningYearPlayoffLevel);
      } else {
        currentYearPlayoffRoundRank.innerHTML = "-";
      }
    }

    // Next Year Records
    const nextYearRecord = resultContainer.querySelector(".performance-container .year-performance.predicted .record-rank-container .record-container .value");
    if (nextYearRecord) {
      nextYearRecord.innerHTML = teamRecord.nextYearRecord;
    }

    const nextYearConferenceRank = resultContainer.querySelector(".performance-container .year-performance.predicted .rank-container .value");
    if (nextYearConferenceRank) {
      nextYearConferenceRank.innerHTML = addOrdinalSuffix(teamRecord.nextYearConferenceRank);
    }

    const nextYearDivisionRank = resultContainer.querySelector(".performance-container .year-performance.predicted .rank-round-container .rank-container .value");
    if (nextYearDivisionRank) {
      nextYearDivisionRank.innerHTML = addOrdinalSuffix(teamRecord.nextYearDivisionRank);
    }

    const nextYearPlayoffRoundRank = resultContainer.querySelector(".performance-container .year-performance.predicted .rank-round-container .round-container .value");
    if (nextYearPlayoffRoundRank) {
      if (teamRecord.hasOwnProperty("nextYearPlayoffLevel")) {
        nextYearPlayoffRoundRank.innerHTML = getRoundShortNames(teamRecord.nextYearPlayoffLevel);
      } else {
        nextYearPlayoffRoundRank.innerHTML = "-";
      }
    }

    let numTables;
    if (IS_DESKTOP) {
      numTables = 3;
    } else {
      numTables = 1;
    }

    const rosterTablesContainer = resultContainer.querySelector(".roster-tables-container");

    // Divide players evenly among tables
    let perTable = Math.ceil(modifiedPlayers.length / numTables);

    for (let i = 0; i < numTables; i++) {
      const tablePlayers = modifiedPlayers.slice(i * perTable, (i + 1) * perTable);

      const table = document.createElement("table");
      const thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
        "<th>Player</th>" +
        "<th>Status</th>" +
        "</tr>";
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      tablePlayers.forEach(player => {
        const row = document.createElement("tr");

        const playerCell = document.createElement("td");
        playerCell.innerHTML = player.name + "<br><span class='position'>" + player.position + "</span>";
        row.appendChild(playerCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = capitalizeFirstLetter(player.status);
        row.appendChild(statusCell);

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      rosterTablesContainer.appendChild(table);
    }

    const roundOrder = ["Wildcard", "Divisional", "Conference", "Super Bowl"];

    const sortedMatches = [...teamMatchesWinLoss].sort((a, b) => {
      if (a.Week && b.Week) return a.Week - b.Week; // sort by week number
      if (a.Week) return -1; // week games before rounds
      if (b.Week) return 1;
      return roundOrder.indexOf(a.round) - roundOrder.indexOf(b.round);
    });

    // Transform into displayable array
    const weeks = sortedMatches.map((match) => ({
      label: match.Week ? match.Week : getRoundShortNames(match.round),
      opp: (match["Away"] === targetTeam || match["teamA"] === targetTeam) ? (match["Home"] || match[
        "teamB"]) : (match["Away"] || match["teamA"]),
      result: (match.winner === targetTeam || match.Winner === targetTeam) ? "Win" : "Loss",
    }));

    const predictionsTablesContainer = resultContainer.querySelector(".match-predictions-tables-container");
    perTable = Math.ceil(weeks.length / numTables);

    for (let i = 0; i < numTables; i++) {
      const tableGames = weeks.slice(i * perTable, (i + 1) * perTable);

      const table = document.createElement("table");
      const thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
        "<th>Weeks</th>" +
        "<th class='opposition'>Opp</th>" +
        "<th class='result'>Result</th>" +
        "</tr>";
      table.appendChild(thead);

      const tbody = document.createElement("tbody");

      tableGames.forEach(function (game) {
        const row = document.createElement("tr");

        // Week cell
        const weekCell = document.createElement("td");
        weekCell.textContent = game.label;
        row.appendChild(weekCell);

        // Opponent with logo
        const oppCell = document.createElement("td");
        addClass(oppCell, "opposition");
        const img = document.createElement("img");
        img.src = STATIC_URL + teamLogoPath + game.opp + ".png" + logoCacheBuster; // adjust path as needed
        img.alt = game.opp;
        oppCell.appendChild(img);
        row.appendChild(oppCell);

        // Result cell
        const resultCell = document.createElement("td");
        addClass(resultCell, "result");
        resultCell.textContent = game.result;
        resultCell.className = "result";
        row.appendChild(resultCell);

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      predictionsTablesContainer.appendChild(table);
    }

    resultDataContainer.appendChild(resultContainer);
  }
}

function showRosterResultsForTeams() {
  const selectedBtn = $(".result-section-btns .selected");
  if (selectedBtn) {
    removeClass(selectedBtn, "selected");
  }

  const rosterResultBtn = $(".result-section-btns .rosters-result-btn");
  if (rosterResultBtn) {
    addClass(rosterResultBtn, "selected");
  }

  const standingsCategoryBtnsContainer = $(".result-header-predicted-standings-btns-holder");
  if (standingsCategoryBtnsContainer) {
    addClass(standingsCategoryBtnsContainer, "hidden");
  }

  const logosContainer = $(".ultimate-result-header-container .result-header-team-logos-container");
  if (logosContainer) {
    removeClass(logosContainer, "hidden");
    const resultHeaderLogosHolder = logosContainer.querySelector(".result-header-team-logos-holder");
    if (resultHeaderLogosHolder) {
      resultHeaderLogosHolder.innerHTML = "";
      nflTeamShortNames.forEach((shortName, index) => {
        const imgHolder = document.createElement("button");
        imgHolder.dataset.team = shortName;
        imgHolder.addEventListener("click", showTeamRostersResult);
        addClass(imgHolder, "team-image-holder");
        const img = document.createElement("img");
        if (index === 0) {
          addClass(imgHolder, "selected");
        }
        img.src = STATIC_URL + teamLogoPath + shortName + ".png" + logoCacheBuster;
        img.setAttribute("width", "33px");
        img.setAttribute("height", "22px");
        img.setAttribute("alt", shortName);

        imgHolder.appendChild(img);
        resultHeaderLogosHolder.appendChild(imgHolder);
      });

      const firstTeam = $(".result-header-team-logos-holder .team-image-holder");
      if (firstTeam) {
        firstTeam.click();
        const selectedTeam = firstTeam.dataset.team;
        const resultScreenSection = $(".ultimate-result-screen");
        if (resultScreenSection) {
          resultScreenSection.dataset.team = selectedTeam;
          const teamNameHolder = resultScreenSection.querySelector(".mds-roster-result-header-text");
          if (teamNameHolder) {
            teamNameHolder.innerHTML = selectedTeam;
          }
        }
      }
    }
  }
}

function showTeamRostersResult(e) {
  const selectedTeamHolder = $(".result-header-team-logos-holder .team-image-holder.selected");
  if (selectedTeamHolder) {
    removeClass(selectedTeamHolder, "selected");
  }

  const targetBtn = e.target.closest(".team-image-holder");
  let targetTeam;
  if (targetBtn) {
    addClass(targetBtn, "selected");
    targetTeam = targetBtn.dataset.team;
    const resultScreenSection = $(".ultimate-result-screen");
    if (resultScreenSection) {
      resultScreenSection.dataset.team = targetTeam;
    }
  }

  const resultDataContainer = $(".ultimate-result-screen .result-data-container");
  if (resultDataContainer) {
    resultDataContainer.innerHTML = "";
  }

  let mdsDraftedPlayers;
  const targetTeamIndex = mdsTeamsList.findIndex(team => team.shortName === targetTeam);
  if (targetTeamIndex > -1) {
    const userTeam = mdsTeamsList[targetTeamIndex];
    if (userTeam.shortName) {
      mdsDraftedPlayers = userTeam.draftedPlayers;
    }
  }

  const positionOrder = ["QB", "RB", "WR", "TE", "OT", "OG", "OC", "DT", "EDGE", "LB", "CB", "S", "LS", "FB", "K",
    "P"
  ];

  const statusesToFilter = ["franchise", "signed", "re-signed", "transition", "active", "restructured"];
  let targetTeamPlayers = players.filter(p => p.team === targetTeam && statusesToFilter.includes(p.status) && !p
    .freeAgent);

  const sortedPlayers = targetTeamPlayers.sort((a, b) => {
    const positionA = positionOrder.indexOf(a.position);
    const positionB = positionOrder.indexOf(b.position);

    if (positionA !== positionB) {
      return positionA - positionB; // Sort by position order
    }

    // If positions are the same, sort by getFinalValue
    return getFinalValue(b) - getFinalValue(a); // Descending order by value
  });

  mdsDraftedPlayers.forEach(mdsPlayer => {
    const playerIndex = sortedPlayers.findIndex(player => player.position === mdsPlayer.position);
    if (playerIndex > -1) {
      sortedPlayers.splice(playerIndex, 0, mdsPlayer);
    } else {
      sortedPlayers.push(mdsPlayer);
    }
  });

  let resultTemplateId;
  if (IS_DESKTOP) {
    resultTemplateId = "mds-roster-result-desktop";
  } else {
    resultTemplateId = "mds-roster-result-mobile";
  }

  var resultContainer = document.getElementById(resultTemplateId).content.cloneNode(true);
  resultContainer = resultContainer.querySelector(".mds-roster-result-container");

  const resultListMobile = resultContainer.querySelector("#resultListMobile");
  const resultListOdd = resultContainer.querySelector("#resultListOdd");
  const resultListEven = resultContainer.querySelector("#resultListEven");

  if (resultListMobile) {
    resultListMobile.innerHTML = "";
  } else if (resultListOdd && resultListEven) {
    resultListOdd.innerHTML = "";
    resultListEven.innerHTML = "";
  }

  sortedPlayers.forEach((player, index) => {
    let playerRowHTML;
    if (player.hasOwnProperty("id")) {
      playerRowHTML = renderPlayerRow(player, index + 1);
    } else {
      playerRowHTML = renderMDSDraftedPlayerRow(player, index + 1);
    }
    if (resultListMobile) {
      resultListMobile.innerHTML += playerRowHTML;
    } else if (resultListOdd && resultListEven) {
      if ((index + 1) % 2 === 0) {
        resultListEven.innerHTML += playerRowHTML;
      } else {
        resultListOdd.innerHTML += playerRowHTML;
      }
    }
  });

  resultDataContainer.appendChild(resultContainer);
}

function collectTeamsConferenceAndRecordsRank(conferenceData, session) {
  let rankPropertyToStore;
  let recordPropertyToStore;
  if (session === "previous") {
    rankPropertyToStore = "runningYearConferenceRank";
    recordPropertyToStore = "runningYearRecord";
  } else {
    rankPropertyToStore = "nextYearConferenceRank";
    recordPropertyToStore = "nextYearRecord";
  }

  conferenceData.AFC.forEach((team, index) => {
    teamsDownloadData[team.Team][rankPropertyToStore] = index + 1;
    teamsDownloadData[team.Team][recordPropertyToStore] = team.Wins + "-" + team.Losses + (team.Ties > 0 ? "-" + team.Ties : "");;
  });

  conferenceData.NFC.forEach((team, index) => {
    teamsDownloadData[team.Team][rankPropertyToStore] = index + 1;
    teamsDownloadData[team.Team][recordPropertyToStore] = team.Wins + "-" + team.Losses + (team.Ties > 0 ? "-" + team.Ties : "");;
  });
}

function collectTeamsDivisionRank(divisionData, session) {
  let propertyToStore;
  if (session === "previous") {
    propertyToStore = "runningYearDivisionRank";
  } else {
    propertyToStore = "nextYearDivisionRank";
  }

  divisionData["AFC E"].forEach((team, index) => teamsDownloadData[team.Team][propertyToStore] = index + 1);
  divisionData["AFC W"].forEach((team, index) => teamsDownloadData[team.Team][propertyToStore] = index + 1);
  divisionData["AFC N"].forEach((team, index) => teamsDownloadData[team.Team][propertyToStore] = index + 1);
  divisionData["AFC S"].forEach((team, index) => teamsDownloadData[team.Team][propertyToStore] = index + 1);
  divisionData["NFC E"].forEach((team, index) => teamsDownloadData[team.Team][propertyToStore] = index + 1);
  divisionData["NFC W"].forEach((team, index) => teamsDownloadData[team.Team][propertyToStore] = index + 1);
  divisionData["NFC N"].forEach((team, index) => teamsDownloadData[team.Team][propertyToStore] = index + 1);
  divisionData["NFC S"].forEach((team, index) => teamsDownloadData[team.Team][propertyToStore] = index + 1);
}

function collectPlayoffMatchesData(data, session) {
  let playoffLevel = session === "previous" ? "runningYearPlayoffLevel" : "nextYearPlayoffLevel";
  const levels = [
    "Wildcard Round",
    "Divisional Playoffs",
    "Conference Championships",
    "Super Bowl"
  ];

  // process both NFC & AFC
  for (const conference of ["NFC", "AFC"]) {
    for (const level of levels) {
      const games = data[conference]?.[level];
      if (!games) continue;

      for (const g of games) {
        const { teamA, teamB, winner } = g;
        const loser = teamA === winner ? teamB : teamA;

        // ensure team entries exist
        if (!teamsDownloadData[teamA]) teamsDownloadData[teamA] = {};
        if (!teamsDownloadData[teamB]) teamsDownloadData[teamB] = {};

        // update playoff level for both teams
        teamsDownloadData[teamA][playoffLevel] = level;
        teamsDownloadData[teamB][playoffLevel] = level;

        // mark loser’s final level
        teamsDownloadData[loser][playoffLevel] = level;
      }
    }
  }

  // handle Super Bowl separately
  if (data["Super Bowl"]) {
    const { teamA, teamB, winner } = data["Super Bowl"];
    const loser = teamA === winner ? teamB : teamA;

    if (!teamsDownloadData[teamA]) teamsDownloadData[teamA] = {};
    if (!teamsDownloadData[teamB]) teamsDownloadData[teamB] = {};

    teamsDownloadData[winner][playoffLevel] = "Champion";
    teamsDownloadData[loser][playoffLevel] = "Super Bowl";
  }
}

function collectTeamFinalMatchesWinLoss(teamName) {
  const winLossRecord = [];
  weekMatchesData.forEach(match => {
    if (match["Away"] === teamName || match["Home"] === teamName) {
      winLossRecord.push(match);
    }
  });

  // Loop through conferences (NFC, AFC)
  for (const conference of ["NFC", "AFC"]) {
    const rounds = playoffMatchesData[conference];
    if (!rounds) continue;

    for (const roundName in rounds) {
      const games = rounds[roundName];
      for (const match of games) {
        if (match.teamA === teamName || match.teamB === teamName) {
          winLossRecord.push({
            conference,
            round: roundName,
            ...match
          });
        }
      }
    }
  }

  // Handle Super Bowl separately
  if (playoffMatchesData["Super Bowl"]) {
    const sb = playoffMatchesData["Super Bowl"];
    if (sb.teamA === teamName || sb.teamB === teamName) {
      winLossRecord.push({
        conference: "Super Bowl",
        round: "Super Bowl",
        ...sb
      });
    }
  }

  return winLossRecord;
}

function capitalizeFirstLetter(status) {
  return String(status).charAt(0).toUpperCase() + String(status).slice(1);
}

function collectTeamModifiedPlayers(teamName) {
  let mdsDraftedPlayers;
  const userSelectedTeamIndex = mdsTeamsList.findIndex(team => team.shortName === teamName);
  if (userSelectedTeamIndex > -1) {
    const userTeam = mdsTeamsList[userSelectedTeamIndex];
    if (userTeam.shortName) {
      mdsDraftedPlayers = userTeam.draftedPlayers;
    }
  }

  const positionOrder = ["QB", "RB", "WR", "TE", "OT", "OG", "OC", "DT", "EDGE", "LB", "CB", "S", "LS", "FB", "K",
    "P"
  ];

  const statusesToFilter = ["franchise", "signed", "re-signed", "transition", "restructured"];
  let targetTeamPlayers = players.filter(p => p.team === teamName && statusesToFilter.includes(p.status));

  const sortedPlayers = targetTeamPlayers.sort((a, b) => {
    const positionA = positionOrder.indexOf(a.position);
    const positionB = positionOrder.indexOf(b.position);

    if (positionA !== positionB) {
      return positionA - positionB;
    }

    return getFinalValue(b) - getFinalValue(a);
  });

  mdsDraftedPlayers.forEach(player => player.status = "Drafted");

  mdsDraftedPlayers.forEach(mdsPlayer => {
    const playerIndex = sortedPlayers.findIndex(player => player.position === mdsPlayer.position);
    if (playerIndex > -1) {
      sortedPlayers.splice(playerIndex, 0, mdsPlayer);
    } else {
      sortedPlayers.push(mdsPlayer);
    }
  });

  return sortedPlayers
}

function downloadTeamUltimateResult() {
  const canvas = prepareTeamUltimateResultCanvas();
  var link = document.createElement('a');
  link.download = "PFN_ULTIMATE_SIM_" + Date.now();
  link.href = canvas.toDataURL();
  link.click();
  // Release canvas memory
  canvas.width = 0;
  canvas.height = 0;
}

function shareTeamUltimateResult() {
  const canvas = prepareTeamUltimateResultCanvas();
  canvas.toBlob(blob => {
    // Release canvas memory
    canvas.width = 0;
    canvas.height = 0;
    var file = new File([blob], "PFN_ULTIMATE_SIM_" + Date.now(), { type: blob.type });
    navigator.share({
      text: "",
      files: [file],
    });
  });
}

function prepareTeamUltimateResultCanvas() {
  let selectedTeamShortName;
  const resultScreenSection = $(".ultimate-result-screen");
  if (resultScreenSection) {
    selectedTeamShortName = resultScreenSection.dataset.team;
    const modifiedPlayers = collectTeamModifiedPlayers(selectedTeamShortName);
    const teamMatchesWinLoss = collectTeamFinalMatchesWinLoss(selectedTeamShortName);
    const teamRecord = teamsDownloadData[selectedTeamShortName];
    return drawCanvas(selectedTeamShortName, modifiedPlayers, teamMatchesWinLoss, teamRecord);
  }
}

(function () {
  initSelectScreen();
})();
