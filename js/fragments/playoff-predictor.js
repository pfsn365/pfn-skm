var predictor = (function () {
	// Query a selector in both view containers, return array of elements
	function queryEachView(selector) {
		var results = [];
		['.pp-desktop-view', '.pp-tablet-mobile-view'].forEach(function(view) {
			var container = $(view);
			if (container) {
				var el = container.querySelector(selector);
				if (el) results.push(el);
			}
		});
		return results;
	}

	function queryAllViews(selector) {
		var results = [];
		['.pp-desktop-view', '.pp-tablet-mobile-view'].forEach(function(view) {
			var container = $(view);
			if (container) {
				container.querySelectorAll(selector).forEach(function(el) { results.push(el); });
			}
		});
		return results;
	}

	var fileName = STATIC_URL + "/" + DATA_SOURCE_PATH;
	var playoffPredictorDataURL =
		fileName
			.replace("staticd.pr", "staticj.pr") + "playoffPredictorData.json";

	var predictionSubmissionUrl = PLAYOFF_PREDICTIONS_SUBMISSION_URL;

	var weekMatchesData = [];
	var defaultWeekMatchesData = [];
	var teamsData = {};
	var defaultTeamsData = {};
	var teamsList = [];
	var winProbabilityGrid = [];
	var totalWeeks = 18;
	var landingWeek = 1;
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

	var chaosLevel = 50;
	var activeScenario = "default";
	var originalWinProbabilityGrid = [];

	var hasCustomPowerRankings = false;
	var hasCustomSettings = false;
	var customPowerRankOrder = null;

	var simulationCount = 100000;

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

	var teamSlugMap = {
		"ARI": "arizona-cardinals", "ATL": "atlanta-falcons", "BAL": "baltimore-ravens",
		"BUF": "buffalo-bills", "CAR": "carolina-panthers", "CHI": "chicago-bears",
		"CIN": "cincinnati-bengals", "CLE": "cleveland-browns", "DAL": "dallas-cowboys",
		"DEN": "denver-broncos", "DET": "detroit-lions", "GB": "green-bay-packers",
		"HOU": "houston-texans", "IND": "indianapolis-colts", "JAX": "jacksonville-jaguars",
		"KC": "kansas-city-chiefs", "LAC": "los-angeles-chargers", "LAR": "los-angeles-rams",
		"LV": "las-vegas-raiders", "MIA": "miami-dolphins", "MIN": "minnesota-vikings",
		"NE": "new-england-patriots", "NO": "new-orleans-saints", "NYG": "new-york-giants",
		"NYJ": "new-york-jets", "PHI": "philadelphia-eagles", "PIT": "pittsburgh-steelers",
		"SEA": "seattle-seahawks", "SF": "san-francisco-49ers", "TB": "tampa-bay-buccaneers",
		"TEN": "tennessee-titans", "WAS": "washington-commanders", "WSH": "washington-commanders"
	};
	var teamInfoBaseURL = "https://www.profootballnetwork.com/nfl-hq/teams/";

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
					matchData[headers[j]] = isNaN(rawData[i][j])
						? rawData[i][j]
						: Number(rawData[i][j]);
					if (headers[j] == "Winner") {
						matchData["completed"] = false;
						if (rawData[i][j]) {
							matchData["completed"] = true;
						} else {
							matchData["Away Score"] = 0;
							matchData["Home Score"] = 0;
							if (!landingWeekUpdated) {
								landingWeek = matchData["Week"];
								landingWeekUpdated = true;
							}
						}
					}
				}
			}
			weekMatchesData.push(matchData);
		}
		if (!landingWeekUpdated) {
			landingWeek = totalWeeks;
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
					teamData[headers[j]] = isNaN(rawData[i][j])
						? rawData[i][j]
						: Number(rawData[i][j]);
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
		winProbabilityGrid = data.map(function(row) {
			return row.map(function(val) { return parseFloat(val); });
		});
		originalWinProbabilityGrid = winProbabilityGrid.map(function(row) { return row.slice(); });
	}

	async function fetchData(url) {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	}

	function prepareToolData(data) {
		Object.keys(data["collections"]).forEach(index => {
			if (data["collections"][index]["sheetName"] === "schedule") {
				prepareWeekMatchesData(data["collections"][index]["data"]);
			}
			if (data["collections"][index]["sheetName"] === "team_level_data") {
				prepareTeamsData(data["collections"][index]["data"]);
			}
			if (data["collections"][index]["sheetName"] === "playoffs") {
				preparePlayoffsData(data["collections"][index]["data"]);
			}
			if (data["collections"][index]["sheetName"] === "winning_probability") {
				prepareWinningProbabilityData(data["collections"][index]["data"]);
			}
		});

		const timestampContainers = document.querySelectorAll(".updated-timestamp-container");
		timestampContainers.forEach(function(container) {
			container.innerHTML = "UPDATED ON " + new Date(data[
				"updatedTime"]).changeTimezone("America/New_York").format(
					"mmm d, yyyy , hh:MM TT") + " EDT";
		});
	}

	(async () => {
		try {
			await fetchData(playoffPredictorDataURL)
				.then(prepareToolData)
				.then(initializeTool);
		} catch (error) {
			console.error(error);
		}
	})();

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
		var overlay = $(".overlay");
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
		queryEachView(".week-matches-container").forEach(function(weekContainer) {
			var matchContainer = weekContainer.querySelector(".match-" + matchNumber);
			if (matchContainer &&
				matchContainer.offsetTop + matchContainer.offsetHeight >
				weekContainer.offsetHeight + weekContainer.offsetTop
			) {
				weekContainer.scrollTop =
					matchContainer.offsetTop -
					weekContainer.offsetTop -
					weekContainer.offsetHeight + matchContainer.offsetHeight;
			}
		});
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

				let predictPlayoffPopup = $('.predict-playoff-games-popup-container');
				if (predictPlayoffPopup) {
					predictPlayoffPopup.remove();
				}

				switchToParticipantsTab();

				trackGAEventForPage("Delete_Confirm", {
					option: selectedOption,
				});
			} else {
				trackGAEventForPage("Delete_Confirm", {
					option: "close",
				});
			}
		}
		closeDeletePopUp();
	}

	function predictWinner(team1, team2) {
		var team1Pos = teamsList.indexOf(team1);
		var team2Pos = teamsList.indexOf(team2);

		var winningProbability = winProbabilityGrid[team2Pos][team1Pos];

		// Apply scenario overrides
		if (activeScenario === "upsets") {
			winningProbability = 1 - winningProbability;
		}

		// Apply chaos adjustment
		if (chaosLevel !== 50) {
			var normalizedChaos = (chaosLevel - 50) / 50; // -1 to 1
			if (normalizedChaos > 0) {
				// Toward chaotic: blend toward 0.5
				winningProbability = winningProbability * (1 - normalizedChaos) + 0.5 * normalizedChaos;
			} else {
				// Toward deterministic: blend toward 0 or 1
				var target = winningProbability > 0.5 ? 1.0 : 0.0;
				winningProbability = winningProbability * (1 + normalizedChaos) + target * (-normalizedChaos);
			}
		}

		var randomNumber = Math.random().toFixed(2);

		if (randomNumber < winningProbability) {
			return team1;
		} else {
			return team2;
		}
	}

	function resumeSimulationFunction(matchNumber, simulateFunction, week) {
		return function (event) {
			pauseSimulatorFlag = false;
			simulateFunction(matchNumber, week);
			queryEachView(".simulation-ctas-container").forEach(function(simulateButtonsContainer) {
				var pauseButton = simulateButtonsContainer.querySelector(".pause-button");
				var resumeButton = simulateButtonsContainer.querySelector(".resume-button");
				if (resumeButton) {
					simulateButtonsContainer.removeChild(resumeButton);
				}
				if (hasClass(pauseButton, "hidden")) {
					removeClass(pauseButton, "hidden");
				}
			});

			showSimulationOverLays();
		};
	}

	function addResumeButton(matchNumber, simulateFunction, week) {
		queryEachView(".simulation-ctas-container").forEach(function(simulateButtonsContainer) {
			var pauseButton = simulateButtonsContainer.querySelector(".pause-button");
			var existingResume = simulateButtonsContainer.querySelector(".resume-button");
			if (existingResume) {
				simulateButtonsContainer.removeChild(existingResume);
			}

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

			var pauseNext = pauseButton.nextElementSibling;
			simulateButtonsContainer.insertBefore(resumeButton, pauseNext);
		});
	}

	function showSimulationOverLays() {
		queryEachView(".playoff-predictor-tool-wrapper .playoff-participants-container").forEach(function(el) {
			addClass(el, "simulation-overlay");
		});

		queryEachView(".playoff-predictor-tool-wrapper .playoff-participants-standings-container").forEach(function(el) {
			addClass(el, "simulation-overlay");
		});

		queryEachView(".standings-section .conference-standings").forEach(function(el) {
			addClass(el, "simulation-overlay");
		});

		queryEachView(".playoff-predictor-tool-wrapper .division-standings").forEach(function(el) {
			addClass(el, "simulation-overlay");
		});

		queryEachView(".draft-order-section-wrapper .draft-order-table").forEach(function(el) {
			addClass(el, "simulation-overlay");
		});

		queryAllViews(".utility-container").forEach(function(container) {
			addClass(container, "hidden");
		});
	}

	function removeSimulationOverLays() {
		queryEachView(".playoff-predictor-tool-wrapper .playoff-participants-container").forEach(function(el) {
			removeClass(el, "simulation-overlay");
		});

		queryEachView(".playoff-predictor-tool-wrapper .playoff-participants-standings-container").forEach(function(el) {
			removeClass(el, "simulation-overlay");
		});

		queryEachView(".standings-section .conference-standings").forEach(function(el) {
			removeClass(el, "simulation-overlay");
		});

		queryEachView(".playoff-predictor-tool-wrapper .division-standings").forEach(function(el) {
			removeClass(el, "simulation-overlay");
		});

		queryEachView(".draft-order-section-wrapper .draft-order-table").forEach(function(el) {
			removeClass(el, "simulation-overlay");
		});

		queryAllViews(".utility-container").forEach(function(container) {
			removeClass(container, "hidden");
		});
	}

	function calculateSimulationResults() {
		showConferenceStandingsData();
		showDivisionStandingsData();
		setPlayoffParticipants();
		setPlayoffParticipantsStandings();
		updateDraftOrder();

		removeSimulationOverLays();
	}

	function simulateMatchesWithCurrentWeek(matchNumber = 0, week) {
		var matchData = weekMatchesData[matchNumber];
		if (matchNumber >= weekMatchesData.length || matchData["Week"] > week) {
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
		if (autoPopupPlayoffPredictorFlag && checkAllWeekMatchesCompleted()) {
			setTimeout(() => {
				trackGAEventForPage("Predict_Playoff_CTA", {
					"Popup": "Playoff Predictor"
				});
				showPredictPlayoffGamesPopup();
				switchToBracketTab();
			}, 100);
		}
	}

	function simulateMatchesFromCurrentWeek(matchNumber = 0, week) {
		if (matchNumber >= weekMatchesData.length) {
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

	function scheduleMatchResultUpdate(matchNumber) {
		var matchData = weekMatchesData[matchNumber];
		var matchWinner = predictWinner(matchData["Home"], matchData["Away"]);
		var matchWeek = matchData["Week"];
		if (matchWeek != currentWeek) changeWeek("", matchData["Week"]);
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
		queryEachView(".simulation-ctas-container").forEach(function(simulateButtonsContainer) {
			var deleteButton = simulateButtonsContainer.querySelector(".delete-button");
			var pauseButton = simulateButtonsContainer.querySelector(".pause-button");
			var simulateButton = simulateButtonsContainer.querySelector(".simulate-button");
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

			var resumeButton = simulateButtonsContainer.querySelector(".resume-button");
			if (resumeButton) {
				simulateButtonsContainer.removeChild(resumeButton);
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
		});
	}

	function pauseSimulation() {
		pauseSimulatorFlag = true;

		calculateSimulationResults();
	}

	function scrollToTop() {
		window.scrollTo(0, 0);
	}

	function startSimulation() {
		var container = $(".simulate-popup-container");
		let keepOverlay = false;
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
					keepOverlay = true;
				}

				showSimulationOverLays();

				trackGAEventForPage("Simulate_Confirm", {
					option: selectedOption
				});
			} else {
				trackGAEventForPage("Simulate_Confirm", {
					option: "close"
				});
			}
		}
		closeSimulatePopUp();
		if (keepOverlay) showOverlay(true);
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
			trackGAEventForPage("Score_Entered", {
				score: scoreValue,
			});
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
			trackGAEventForPage("System_Score_edits");
		}


		var homeScore = matchData["Home Score"];
		var awayScore = matchData["Away Score"];

		let awayTeamSelector = `.away-team-container.` + matchData["Away"] + `-team-container-` + matchNumber;
		let homeTeamSelector = `.home-team-container.` + matchData["Home"] + `-team-container-` + matchNumber;
		let awayTeamContainer = $(awayTeamSelector);
		let homeTeamContainer = $(homeTeamSelector);
		if (homeScore > awayScore) {
			if (!hasClass(homeTeamContainer, "selected-team")) {
				trackGAEventForPage("Match_Predictions");
			}
			updateMatchContainer(matchData["Home"], matchNumber);
		} else if (homeScore < awayScore) {
			if (!hasClass(awayTeamContainer, "selected-team")) {
				trackGAEventForPage("Match_Predictions");
			}
			updateMatchContainer(matchData["Away"], matchNumber);
		} else {
			if (!hasClass(awayTeamContainer, "selected-team") && !hasClass(homeTeamContainer, "selected-team")) {
				trackGAEventForPage("Match_Predictions");
			}
			updateMatchContainer("TIE", matchNumber);
		}

		updateStandingsData();
		updateSimulationButtonDisableStatus();
	}

	function updateMatchWinner(winnerTeamName, matchNumber, autoSim, event) {
		if (event) {
			trackGAEventForPage("Team_Clicks", {
				match: matchNumber,
				winner: winnerTeamName,
			});

			trackGAEventForPage("Match_Predictions");

			if (winnerTeamName == "TIE") {
				trackGAEventForPage("Score_Tied");
			}
		}
		weekMatchesData[matchNumber]["systemGeneratedScore"] = true;
		if (weekMatchesData[matchNumber]["Winner"] == winnerTeamName) return;

		updateMatchContainer(winnerTeamName, matchNumber);

		requestAnimationFrame(() => {
			deleteScoreStats(matchNumber);
			updateScoreInputWithRandom(winnerTeamName, matchNumber);
			updateScoreStats(matchNumber);
			setTimeout(function () {
				updateStandingsData(autoSim);
				updateSimulationButtonDisableStatus();
				disableDraftOrderSection(!canShowDraftOrder());
			}, 50);
		});
	}

	function updateMatchContainer(winnerTeamName, matchNumber) {
		var homeTeam = weekMatchesData[matchNumber]["Home"];
		var awayTeam = weekMatchesData[matchNumber]["Away"];
		var previousMatchWinner = weekMatchesData[matchNumber]["Winner"];
		var winnerOptions = [homeTeam, awayTeam, "TIE"];

		if (previousMatchWinner == winnerTeamName) return;

		winnerOptions.forEach(function (option) {
			queryAllViews("." + option + "-team-container-" + matchNumber).forEach(function(optionContainer) {
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
		queryAllViews(".away-score-match-" + matchNumber).forEach(function(el) {
			el.value = weekMatchesData[matchNumber]["Away Score"];
		});
		queryAllViews(".home-score-match-" + matchNumber).forEach(function(el) {
			el.value = weekMatchesData[matchNumber]["Home Score"];
		});
	}

	function updateWinLoseTieText() {
		var awayTeamTextElement = queryAllViews(".away-team-win-lose-holder");
		var homeTeamTextElement = queryAllViews(".home-team-win-lose-holder");

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
		queryEachView(".week-matches-container").forEach(function(weekMatchesContainer) {
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

			for (var i = 0; i < weekMatchesData.length; i++) {
				if (weekMatchesData[i]["Week"] == weekNumber) {
					currentWeekMatchesContainer.appendChild(createMatchElement(i));
				}
			}

			weekMatchesContainer.appendChild(currentWeekMatchesContainer);

			weekMatchesContainer.scrollTop = 0;
		});

		showTeamsOnBye(weekNumber);
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

		queryEachView(".bye-teams-container").forEach(function(byeTeamsContainer) {
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
		});
	}

	function changeWeek(e, week = "") {
		var weekNumber = week;
		if (!weekNumber) {
			weekNumber = e.target.getAttribute("data-week-number");

			trackGAEventForPage("Week_Clicks", {
				week: weekNumber,
			});
		}
		currentWeek = weekNumber;

		queryAllViews(".selected-week").forEach(function(el) {
			removeClass(el, "selected-week");
		});

		var weekClassName = ".week" + weekNumber + "-holder";
		queryEachView(weekClassName).forEach(function(selectedWeek) {
			addClass(selectedWeek, "selected-week");

			var viewContainer = selectedWeek.closest('.pp-desktop-view') || selectedWeek.closest('.pp-tablet-mobile-view');
			if (viewContainer) {
				var weekScrollableContainer = viewContainer.querySelector(".week-carousel");
				if (weekScrollableContainer && selectedWeek.offsetLeft - weekScrollableContainer.offsetLeft > 0) {
					weekScrollableContainer.scrollLeft =
						selectedWeek.offsetLeft -
						weekScrollableContainer.offsetLeft -
						2 * selectedWeek.offsetWidth;
				}
			}
		});

		showWeekData(weekNumber);
	}

	function setWeekCarousel() {
		queryEachView(".week-carousel").forEach(function(weekCarouselContainer) {
			for (var i = 1; i <= totalWeeks; i++) {
				var weekHolder = document.createElement("div");
				addClass(weekHolder, "week-holder");
				addClass(weekHolder, "week" + i + "-holder");
				weekHolder.setAttribute("data-week-number", i);
				if (i == landingWeek) {
					addClass(weekHolder, "selected-week");
				}
				var weekNumber = document.createElement("span");
				addClass(weekNumber, "week-number");
				weekNumber.innerHTML = "Week " + i;
				weekNumber.setAttribute("data-week-number", i);
				weekHolder.appendChild(weekNumber);
				weekHolder.addEventListener("click", changeWeek);
				weekCarouselContainer.appendChild(weekHolder);
			}

			// Find scroll buttons relative to this carousel's parent container
			var viewContainer = weekCarouselContainer.closest('.pp-desktop-view') || weekCarouselContainer.closest('.pp-tablet-mobile-view');
			if (viewContainer) {
				var leftScrollButton = viewContainer.querySelector(".week-carousel-control-btn.left-scroll-button");
				var rightScrollButton = viewContainer.querySelector(".week-carousel-control-btn.right-scroll-button");
				var isDesktopView = viewContainer.classList.contains('pp-desktop-view');

				if (isDesktopView && leftScrollButton && rightScrollButton) {
					initListScroll(
						weekCarouselContainer,
						leftScrollButton,
						rightScrollButton
					);
				}
			}
		});
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
		queryEachView(".delete-button").forEach(function(deleteButton) {
			if (!checkAnyAllWeekMatchesCompleted()) {
				if (!hasClass(deleteButton, "default-disabled-button")) {
					addClass(deleteButton, "default-disabled-button");
				}
			} else {
				if (hasClass(deleteButton, "default-disabled-button")) {
					removeClass(deleteButton, "default-disabled-button");
				}
			}
		});

		queryEachView(".simulate-button").forEach(function(simulateButton) {
			if (checkAllWeekMatchesCompleted()) {
				if (!canSimulatePlayoffs()) {
					if (!hasClass(simulateButton, "default-disabled-button")) {
						addClass(simulateButton, "default-disabled-button");
					}
				}
			} else {
				if (hasClass(simulateButton, "default-disabled-button")) {
					removeClass(simulateButton, "default-disabled-button");
				}
			}
		});
	}

	function showDeletePopUp() {
		showOverlay(true);

		trackGAEventForPage("Delete_Clicks");

		var deletePopUp = document
			.getElementById("delete-popup")
			.content.cloneNode(true);

		if (!checkAnyCurrentWeekMatchesCompleted(currentWeek)) {
			var optionContainer = deletePopUp.querySelector(".option1");
			if (optionContainer && !hasClass(optionContainer, "hidden")) {
				addClass(optionContainer, "hidden");
			}

			var seperator = deletePopUp.querySelector(".option1-seperator");
			if (seperator && !hasClass(seperator, "hidden")) {
				addClass(seperator, "hidden");
			}
		}

		if (!checkAnyAfterCurrentWeekMatchesCompleted(currentWeek)) {
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
			var matchIndex = 0;
			matchIndex < weekMatchesData.length;
			matchIndex++
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

	function checkAfterCurrentWeekMatchesCompleted(week) {
		for (
			var matchIndex = 0;
			matchIndex < weekMatchesData.length;
			matchIndex++
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
			var matchIndex = 0;
			matchIndex < weekMatchesData.length;
			matchIndex++
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
			var matchIndex = 0;
			matchIndex < weekMatchesData.length;
			matchIndex++
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
			var matchIndex = 0;
			matchIndex < weekMatchesData.length;
			matchIndex++
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
			var matchIndex = 0;
			matchIndex < weekMatchesData.length;
			matchIndex++
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
			var matchIndex = 0;
			matchIndex < weekMatchesData.length;
			matchIndex++
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
			var matchIndex = 0;
			matchIndex < weekMatchesData.length;
			matchIndex++
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

		trackGAEventForPage("Simulate_Clicks");

		var simulatePopUp = document
			.getElementById("simulate-popup")
			.content.cloneNode(true);
		if (checkCurrentWeekMatchesCompleted(currentWeek)) {
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
		var currentWeekElements = simulatePopUp.querySelectorAll(".current-week");
		currentWeekElements.forEach(function (currentWeekText) {
			currentWeekText.innerHTML = currentWeek;
		});

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

		if (e) {
			trackGAEventForPage("Popup_Close", {
				section: "Simulate",
			});
		}

		showOverlay(false);
	}

	function closeDeletePopUp(e) {
		var container = $(".delete-popup-container");

		if (container) {
			container.remove();
		}

		if (e) {
			trackGAEventForPage("Popup_Close", {
				section: "Delete",
			});
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

					if (completedMatchData['teamA'] == matchData['teamA'] && completedMatchData['teamB'] == matchData['teamB']) {
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
			playoffMatchesData[conference]["Divisional Playoffs"][0]["teamA"] = playoffMatchesData[conference]["wildcard-winners"][0]["winner"];
			playoffMatchesData[conference]["Divisional Playoffs"][0]["teamARank"] = playoffMatchesData[conference]["wildcard-winners"][0]["rank"];

			playoffMatchesData[conference]["Divisional Playoffs"][1]["teamA"] = playoffMatchesData[conference]["wildcard-winners"][1]["winner"];
			playoffMatchesData[conference]["Divisional Playoffs"][1]["teamARank"] = playoffMatchesData[conference]["wildcard-winners"][1]["rank"];

			playoffMatchesData[conference]["Divisional Playoffs"][1]["teamB"] = playoffMatchesData[conference]["wildcard-winners"][2]["winner"];
			playoffMatchesData[conference]["Divisional Playoffs"][1]["teamBRank"] = playoffMatchesData[conference]["wildcard-winners"][2]["rank"];

			for (var j = 0; j < playerOffCompletedMatchesData[conference]["Divisional Playoffs"].length; j++) {
				let completedMatchData = playerOffCompletedMatchesData[conference]["Divisional Playoffs"][j];
				let matchData = playoffMatchesData[conference]["Divisional Playoffs"][0];

				if (completedMatchData['teamA'] == matchData['teamA'] && completedMatchData['teamB'] == matchData['teamB']) {
					playoffMatchesData[conference]["Divisional Playoffs"][0]['winner'] = completedMatchData['winner'];
				} matchData = playoffMatchesData[conference]["Divisional Playoffs"][1];

				if (completedMatchData['teamA'] == matchData['teamA'] && completedMatchData['teamB'] == matchData['teamB']) {
					playoffMatchesData[conference]["Divisional Playoffs"][1]['winner'] = completedMatchData['winner'];
				}
			}

			if (!playoffMatchesData[conference]["Divisional Playoffs"][0]['winner']) {
				let matchData = playoffMatchesData[conference]["Divisional Playoffs"][0];
				playoffMatchesData[conference]["Divisional Playoffs"][0]['winner'] = predictWinner(matchData['teamA'], matchData['teamB']);
			}

			if (!playoffMatchesData[conference]["Divisional Playoffs"][1]['winner']) {
				let matchData = playoffMatchesData[conference]["Divisional Playoffs"][1];
				playoffMatchesData[conference]["Divisional Playoffs"][1]['winner'] = predictWinner(matchData['teamA'], matchData['teamB']);
			}

			playoffMatchesData[conference]["divisional-winners"].push(playoffMatchesData[conference]["Divisional Playoffs"][0]['winner']);
			playoffMatchesData[conference]["divisional-winners"].push(playoffMatchesData[conference]["Divisional Playoffs"][1]['winner']);

			playoffMatchesData[conference]["conference-winner"] = [];

			if (playerOffCompletedMatchesData[conference]["Conference Championships"][0]['winner']) {
				playoffMatchesData[conference]["conference-winner"].push(playerOffCompletedMatchesData[conference]["Conference Championships"][0]['winner']);
			} else {
				var divisionalWinners = playoffMatchesData[conference]["divisional-winners"];
				playoffMatchesData[conference]["conference-winner"].push(predictWinner(divisionalWinners[0], divisionalWinners[1]));
			}
		});

		playoffMatchesData["superbowl-winner"] = [];

		if (playerOffCompletedMatchesData['SuperBowl']['winner']) {
			playoffMatchesData["superbowl-winner"].push(playerOffCompletedMatchesData['SuperBowl']['winner']);
		} else {
			var predictedSuperBowlWinner = predictWinner(playoffMatchesData["AFC"]["conference-winner"][0], playoffMatchesData["NFC"]["conference-winner"][0]);
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
				var teamIndex = 0;
				teamIndex < playoffParticipants[conference].length;
				teamIndex++
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

	function buildDraftOrderTable(draftOrderTeamsData, lockedInOrderTeams, startIndex, endIndex) {
		var draftOrderTableContainerWrapper = document.createElement("div");
		var draftOrderTableContainer = document.createElement("div");
		addClass(draftOrderTableContainer, "draft-order-table-container");

		var draftOrderTable = document.createElement("table");

		var draftOrdertableHeader = ["PICK", "TEAM", "REC", "WIN %", "SOS"];

		var thead = document.createElement("thead");
		var tableRow = document.createElement("tr");

		for (
			var tableHeaderIndex = 0;
			tableHeaderIndex < draftOrdertableHeader.length;
			tableHeaderIndex++
		) {
			var tableHeaderEl = document.createElement("th");
			tableHeaderEl.innerHTML = draftOrdertableHeader[tableHeaderIndex];
			tableRow.appendChild(tableHeaderEl);
		}

		thead.appendChild(tableRow);
		draftOrderTable.appendChild(thead);

		var tbody = document.createElement("tbody");

		for (var teamIndex = startIndex; teamIndex < endIndex; teamIndex++) {
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

		return draftOrderTableContainerWrapper;
	}

	function setDraftOrderContainer(draftOrderTeamsData, lockedInOrderTeams) {
		queryEachView(".draft-order-table").forEach(function(draftOrderContainer) {
			removeAllChild(draftOrderContainer);

			var isDesktopView = draftOrderContainer.closest('.pp-desktop-view') !== null;

			// Both views: split into two 16-row tables
			draftOrderContainer.appendChild(buildDraftOrderTable(draftOrderTeamsData, lockedInOrderTeams, 0, 16));
			draftOrderContainer.appendChild(buildDraftOrderTable(draftOrderTeamsData, lockedInOrderTeams, 16, draftOrderTeamsData.length));
		});
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

		standingsTeamContainer.style.cursor = "pointer";
		standingsTeamContainer.addEventListener("click", (function(name) {
			return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
		})(teamName));

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
		queryEachView(".draft-order-table").forEach(function(draftOrderContainer) {
		var isDesktopView = draftOrderContainer.closest('.pp-desktop-view') !== null;
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
			var tableHeaderIndex = 0;
			tableHeaderIndex < draftOrdertableHeader.length;
			tableHeaderIndex++
		) {
			var tableHeaderEl = document.createElement("th");
			tableHeaderEl.innerHTML = draftOrdertableHeader[tableHeaderIndex];
			tableRow.appendChild(tableHeaderEl);
		}

		thead.appendChild(tableRow);
		draftOrderTable.appendChild(thead);

		var tbody = document.createElement("tbody");

		for (
			var teamIndex = 0;
			teamIndex < draftOrderTeamsData["teamsNotInPlayoff"].length;
			teamIndex++
		) {
			var teamName =
				draftOrderTeamsData["teamsNotInPlayoff"][teamIndex]["Team"];

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

		if (!isDesktopView) {
			tbody.appendChild(generateDraftOrderCategory("WildCard Losers"));

			for (
				var teamIndex = 0;
				teamIndex < draftOrderTeamsData["wildCardLosers"].length;
				teamIndex++
			) {
				var teamName = draftOrderTeamsData["wildCardLosers"][teamIndex]["Team"];

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
				var teamIndex = 0;
				teamIndex < draftOrderTeamsData["divisionalLosers"].length;
				teamIndex++
			) {
				var teamName =
					draftOrderTeamsData["divisionalLosers"][teamIndex]["Team"];

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
				var teamIndex = 0;
				teamIndex < draftOrderTeamsData["conferenceLosers"].length;
				teamIndex++
			) {
				var teamName =
					draftOrderTeamsData["conferenceLosers"][teamIndex]["Team"];

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

			let superBownWinnerIndex = draftOrderTeamsData["superBowlTeams"].findIndex(teamData => teamData.Team === superBowlWinner);
			if (superBownWinnerIndex > -1) {
				let winnerTeam = draftOrderTeamsData["superBowlTeams"].splice(superBownWinnerIndex, 1);
				if (winnerTeam) {
					draftOrderTeamsData["superBowlTeams"].push(winnerTeam[0]);
				}
			}

			for (
				var teamIndex = 0;
				teamIndex < draftOrderTeamsData["superBowlTeams"].length;
				teamIndex++
			) {
				var teamName = draftOrderTeamsData["superBowlTeams"][teamIndex]["Team"];

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

		if (isDesktopView) {
			var draftOrderTableContainerWrapper = document.createElement("div");
			var draftOrderTableContainer = document.createElement("div");
			addClass(draftOrderTableContainer, "draft-order-table-container");

			var draftOrderTable = document.createElement("table");

			var draftOrdertableHeader = ["PICK", "TEAM", "REC", "WIN %", "SOS"];

			var thead = document.createElement("thead");
			var tableRow = document.createElement("tr");

			for (
				var tableHeaderIndex = 0;
				tableHeaderIndex < draftOrdertableHeader.length;
				tableHeaderIndex++
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
				var teamIndex = 0;
				teamIndex < draftOrderTeamsData["wildCardLosers"].length;
				teamIndex++
			) {
				var teamName = draftOrderTeamsData["wildCardLosers"][teamIndex]["Team"];

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
				var teamIndex = 0;
				teamIndex < draftOrderTeamsData["divisionalLosers"].length;
				teamIndex++
			) {
				var teamName =
					draftOrderTeamsData["divisionalLosers"][teamIndex]["Team"];

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
				var teamIndex = 0;
				teamIndex < draftOrderTeamsData["conferenceLosers"].length;
				teamIndex++
			) {
				var teamName =
					draftOrderTeamsData["conferenceLosers"][teamIndex]["Team"];

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

			let superBownWinnerIndex = draftOrderTeamsData["superBowlTeams"].findIndex(teamData => teamData.Team === superBowlWinner);
			if (superBownWinnerIndex > -1) {
				let winnerTeam = draftOrderTeamsData["superBowlTeams"].splice(superBownWinnerIndex, 1);
				if (winnerTeam) {
					draftOrderTeamsData["superBowlTeams"].push(winnerTeam[0]);
				}
			}

			for (
				var teamIndex = 0;
				teamIndex < draftOrderTeamsData["superBowlTeams"].length;
				teamIndex++
			) {
				var teamName = draftOrderTeamsData["superBowlTeams"][teamIndex]["Team"];

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
		}); // end $both forEach
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

		// if (opponentsWonForSos > 0 || opponentsPlayedForSos > 0) {
		team["opponentsPlayedForDraftOrderSos"] = opponentsPlayedForSos;
		team["opponentsWonForDraftOrderSos"] = opponentsWonForSos;

		// if (team["opponentsPlayedForDraftOrderSos"]) {
		team["DraftOrderSOS"] = team["opponentsWonForDraftOrderSos"] / team["opponentsPlayedForDraftOrderSos"];
		team["DraftOrderSOS"] = Number(team["DraftOrderSOS"].toFixed(3));
		// }
		// }
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
			var teamListIndex = 0;
			teamListIndex < teamList.length;
			teamListIndex++
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
					var teamIndexRankMap = 1;
					teamIndexRankMap < divisionMap[divisionKey].length - 1;
					teamIndexRankMap++
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
					var teamIndexRankMap = 1;
					teamIndexRankMap < conferenceMap[conferenceKey].length - 1;
					teamIndexRankMap++
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
						return teamAData["PD"] == teamBData["PD"]
							? teamAData["PA"] - teamBData["PA"]
							: teamAData["PD"] - teamBData["PD"];
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
				var teamIndex = 0;
				teamIndex < playoffParticipants[conference].length;
				teamIndex++
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
		trackGAEventForPage("Scroll_To_Standings_Page");

		var activeView = getVisibleView();
		var standingsSectionWrapper = activeView.querySelector(".standings-draft-order-wrapper");

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
				playoffMatchesData[conference]["Divisional Playoffs"] = [
					{
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
				playoffMatchesData[conference]["Conference Championships"] = [
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
				var teamIndex = 1;
				teamIndex < playoffParticipants[conference].length / 2;
				teamIndex++
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

	function showPlayoffsWinnerAnimation(playoffWinnerTeam) {
		var existingOverlay = $(".playoff-winner-animation-overlay");
		if (existingOverlay) {
			existingOverlay.remove();
		}

		var templateElement = document.getElementById("playoff-winner-animation");
		if (!templateElement) return;

		var animationOverlayConatiner = templateElement.content.cloneNode(true);
		var overlayContainer = animationOverlayConatiner.querySelector(
			".playoff-winner-animation-overlay"
		);

		var teamLogoContainer = animationOverlayConatiner.querySelector(
			".playoff-winner-animation-team-logo"
		);
		if (teamLogoContainer) {
			teamLogoContainer.setAttribute("src", teamsData[playoffWinnerTeam]["logo"]);
		}

		var closeWinnerBtn = animationOverlayConatiner.querySelector(".close-winner-btn");
		if (closeWinnerBtn) {
			closeWinnerBtn.addEventListener("click", function (e) {
				e.stopPropagation();
				var overlayContainerToRemove = $(".playoff-winner-animation-overlay");
				if (overlayContainerToRemove) {
					overlayContainerToRemove.remove();
				}
			});
		}

		if (overlayContainer) {
			overlayContainer.addEventListener("click", function (e) {
				if (e.target === overlayContainer) {
					overlayContainer.remove();
				}
			});
		}

		document.body.appendChild(animationOverlayConatiner);
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
				var teamDetailsHolderContainerIndex = 0;
				teamDetailsHolderContainerIndex < teamDetailsHolderContainers.length;
				teamDetailsHolderContainerIndex++
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

			var playoffResetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
			if (playoffResetBtn) {
				playoffResetBtn.removeAttribute("disabled");
			}

			var playoffSimulateBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
			if (playoffSimulateBtn) {
				playoffSimulateBtn.setAttribute("disabled", "");
			}

			trackGAEventForPage("Playoff_Progress", {
				"section": "SuperBowl",
			});
			setAfterPlayoffDraft(playoffMatchesData);
			showPlayoffsWinnerAnimation(selectedWinnerTeamName);
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
				var matchIndex = 0;
				matchIndex < wildcardMatches.length;
				matchIndex++
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
					var matchIndex = 0;
					matchIndex < divisionMatches.length;
					matchIndex++
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
				var teamDetailsHolderContainerIndex = 0;
				teamDetailsHolderContainerIndex < teamDetailsHolderContainers.length;
				teamDetailsHolderContainerIndex++
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
				trackGAEventForPage("Playoff_Progress", {
					"section": "Divisional",
				});
			}

			var playoffResetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
			if (playoffResetBtn) {
				playoffResetBtn.removeAttribute("disabled");
			}

			updateConferencePlayoffsData(selectedTeamConferenceName);
			setDefaultSuperbowlRound(selectedTeamConferenceName);
			updateSuperbowlPlayoffsData(selectedTeamConferenceName);

			updateDraftOrder();
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
				var teamDetailsHolderContainerIndex = 0;
				teamDetailsHolderContainerIndex < teamDetailsHolderContainers.length;
				teamDetailsHolderContainerIndex++
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
				trackGAEventForPage("Playoff_Progress", {
					"section": "Wildcard",
				});
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
				var teamDetailsHolderContainerIndex = 0;
				teamDetailsHolderContainerIndex < teamDetailsHolderContainers.length;
				teamDetailsHolderContainerIndex++
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

			var playoffResetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");
			if (playoffResetBtn) {
				playoffResetBtn.removeAttribute("disabled");
			}

			updateSuperbowlPlayoffsData(selectedTeamConferenceName);

			updateDraftOrder();
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
			trackGAEventForPage("Playoff_Progress", {
				"section": "Conference",
			});

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
					var matchIndex = 0;
					matchIndex < conferenceMatches.length;
					matchIndex++
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
			if (teamsData[teamsList[i]].Wins !== 0 || teamsData[teamsList[i]].Losses !== 0 || teamsData[teamsList[i]].Ties !== 0) return false;
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

		var afcTeamsData = playoffParticipants["AFC"];
		var nfcTeamsData = playoffParticipants["NFC"];

		var viewContainers = [
			document.querySelector('.pp-desktop-view'),
			document.querySelector('.pp-tablet-mobile-view')
		].filter(Boolean);

		viewContainers.forEach(function(viewContainer) {

		var afcRank1Container = viewContainer.querySelector(".afc-rank-1-team-container");

		afcRank1Container.innerHTML = "";

		var teamLogo = document.createElement("img");
		addClass(teamLogo, "rank-1-team-logo");
		if (initailDataFlag) {
			addClass(teamLogo, "question-mark");
			teamLogo.setAttribute("src", STATIC_URL + "/skm/assets/playoff-predictor/question-icon.png");
			teamLogo.setAttribute("width", "7px");
			teamLogo.setAttribute("height", "11px");
		} else {
			teamLogo.setAttribute("src", teamsData[afcTeamsData[0]]["logo"]);
			teamLogo.setAttribute("width", "36px");
			teamLogo.setAttribute("height", "24px");
		}

		teamLogo.setAttribute("alt", afcTeamsData[0]);

		var rankText = document.createElement("span");
		addClass(rankText, "rank-1-team-text");
		rankText.innerHTML = "#1";

		afcRank1Container.appendChild(teamLogo);
		afcRank1Container.appendChild(rankText);

		if (!initailDataFlag) {
			afcRank1Container.style.cursor = "pointer";
			afcRank1Container.addEventListener("click", (function(name) {
				return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
			})(afcTeamsData[0]));
		}

		var playoffGamesContainer = viewContainer.querySelector(".afc-playoff-games-container");
		playoffGamesContainer.innerHTML = "";

		for (var teamIndex = 1; teamIndex <= 3; teamIndex++) {
			var oppTeamIndex = playoffParticipants["AFC"].length - teamIndex;
			var playoffGameDetailsHolder = document.createElement("div");
			addClass(playoffGameDetailsHolder, "playoff-game-details-holder");

			var playoffTeamDetailsHolder = document.createElement("div");
			addClass(playoffTeamDetailsHolder, "playoff-team-details-holder");

			var rankTextHolder = document.createElement("span");
			addClass(rankTextHolder, "playoff-team-rank");
			rankTextHolder.innerHTML = "#" + (oppTeamIndex + 1);
			playoffTeamDetailsHolder.appendChild(rankTextHolder);

			var teamLogo = document.createElement("img");
			addClass(teamLogo, "playoff-team-logo");
			if (initailDataFlag) {
				addClass(teamLogo, "question-mark");
				teamLogo.setAttribute("src", STATIC_URL + "/skm/assets/playoff-predictor/question-icon.png");
				teamLogo.setAttribute("width", "7px");
				teamLogo.setAttribute("height", "11px");
			} else {
				teamLogo.setAttribute("src", teamsData[afcTeamsData[oppTeamIndex]]["logo"]);
				teamLogo.setAttribute("width", "33px");
				teamLogo.setAttribute("height", "22px");
			}

			teamLogo.setAttribute("alt", afcTeamsData[oppTeamIndex]);
			playoffTeamDetailsHolder.appendChild(teamLogo);

			var teamWinLoseText = document.createElement("span");
			addClass(teamWinLoseText, "playoff-team-win-lose-text");
			teamWinLoseText.innerHTML = generateWinLoseTieTextForStandings(
				afcTeamsData[oppTeamIndex]
			);
			playoffTeamDetailsHolder.appendChild(teamWinLoseText);

			if (!initailDataFlag) {
				playoffTeamDetailsHolder.style.cursor = "pointer";
				playoffTeamDetailsHolder.addEventListener("click", (function(name) {
					return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
				})(afcTeamsData[oppTeamIndex]));
			}

			playoffGameDetailsHolder.appendChild(playoffTeamDetailsHolder);

			var versesContainer = document.createElement("div");
			addClass(versesContainer, "verses-container");

			var versesText = document.createElement("span");
			addClass(versesText, "verses-text");
			versesText.innerHTML = "@";

			versesContainer.appendChild(versesText);
			playoffGameDetailsHolder.appendChild(versesContainer);

			var playoffTeamDetailsHolder = document.createElement("div");
			addClass(playoffTeamDetailsHolder, "playoff-team-details-holder");
			addClass(playoffTeamDetailsHolder, "reverse-content");

			var teamWinLoseText = document.createElement("span");
			addClass(teamWinLoseText, "playoff-team-win-lose-text");
			teamWinLoseText.innerHTML = generateWinLoseTieTextForStandings(
				afcTeamsData[teamIndex]
			);
			playoffTeamDetailsHolder.appendChild(teamWinLoseText);

			var teamLogo = document.createElement("img");
			addClass(teamLogo, "playoff-team-logo");
			if (initailDataFlag) {
				addClass(teamLogo, "question-mark");
				teamLogo.setAttribute("src", STATIC_URL + "/skm/assets/playoff-predictor/question-icon.png");
				teamLogo.setAttribute("width", "7px");
				teamLogo.setAttribute("height", "11px");
			} else {
				teamLogo.setAttribute("src", teamsData[afcTeamsData[teamIndex]]["logo"]);
				teamLogo.setAttribute("width", "33px");
				teamLogo.setAttribute("height", "22px");
			}

			teamLogo.setAttribute("alt", afcTeamsData[teamIndex]);
			playoffTeamDetailsHolder.appendChild(teamLogo);

			var rankTextHolder = document.createElement("span");
			addClass(rankTextHolder, "playoff-team-rank");
			rankTextHolder.innerHTML = "#" + (teamIndex + 1);
			playoffTeamDetailsHolder.appendChild(rankTextHolder);

			if (!initailDataFlag) {
				playoffTeamDetailsHolder.style.cursor = "pointer";
				playoffTeamDetailsHolder.addEventListener("click", (function(name) {
					return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
				})(afcTeamsData[teamIndex]));
			}

			playoffGameDetailsHolder.appendChild(playoffTeamDetailsHolder);

			playoffGamesContainer.appendChild(playoffGameDetailsHolder);
		}

		var nfcRank1Container = viewContainer.querySelector(".nfc-rank-1-team-container");

		nfcRank1Container.innerHTML = "";

		var teamLogo = document.createElement("img");
		addClass(teamLogo, "rank-1-team-logo");
		if (initailDataFlag) {
			addClass(teamLogo, "question-mark");
			teamLogo.setAttribute("src", STATIC_URL + "/skm/assets/playoff-predictor/question-icon.png");
			teamLogo.setAttribute("width", "7px");
			teamLogo.setAttribute("height", "11px");
		} else {
			teamLogo.setAttribute("src", teamsData[nfcTeamsData[0]]["logo"]);
			teamLogo.setAttribute("width", "36px");
			teamLogo.setAttribute("height", "24px");
		}

		teamLogo.setAttribute("alt", nfcTeamsData[0]);

		var rankText = document.createElement("span");
		addClass(rankText, "rank-1-team-text");
		rankText.innerHTML = "#1";

		nfcRank1Container.appendChild(rankText);
		nfcRank1Container.appendChild(teamLogo);

		if (!initailDataFlag) {
			nfcRank1Container.style.cursor = "pointer";
			nfcRank1Container.addEventListener("click", (function(name) {
				return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
			})(nfcTeamsData[0]));
		}

		var playoffGamesContainer = viewContainer.querySelector(".nfc-playoff-games-container");
		playoffGamesContainer.innerHTML = "";

		for (var teamIndex = 1; teamIndex <= 3; teamIndex++) {
			var oppTeamIndex = playoffParticipants["NFC"].length - teamIndex;
			var playoffGameDetailsHolder = document.createElement("div");
			addClass(playoffGameDetailsHolder, "playoff-game-details-holder");

			var playoffTeamDetailsHolder = document.createElement("div");
			addClass(playoffTeamDetailsHolder, "playoff-team-details-holder");

			var rankTextHolder = document.createElement("span");
			addClass(rankTextHolder, "playoff-team-rank");
			rankTextHolder.innerHTML = "#" + (oppTeamIndex + 1);
			playoffTeamDetailsHolder.appendChild(rankTextHolder);

			var teamLogo = document.createElement("img");
			addClass(teamLogo, "playoff-team-logo");
			if (initailDataFlag) {
				addClass(teamLogo, "question-mark");
				teamLogo.setAttribute("src", STATIC_URL + "/skm/assets/playoff-predictor/question-icon.png");
				teamLogo.setAttribute("width", "7px");
				teamLogo.setAttribute("height", "11px");
			} else {
				teamLogo.setAttribute("src", teamsData[nfcTeamsData[oppTeamIndex]]["logo"]);
				teamLogo.setAttribute("width", "33px");
				teamLogo.setAttribute("height", "22px");
			}

			teamLogo.setAttribute("alt", nfcTeamsData[oppTeamIndex]);
			playoffTeamDetailsHolder.appendChild(teamLogo);

			var teamWinLoseText = document.createElement("span");
			addClass(teamWinLoseText, "playoff-team-win-lose-text");
			teamWinLoseText.innerHTML = generateWinLoseTieTextForStandings(
				nfcTeamsData[oppTeamIndex]
			);
			playoffTeamDetailsHolder.appendChild(teamWinLoseText);

			if (!initailDataFlag) {
				playoffTeamDetailsHolder.style.cursor = "pointer";
				playoffTeamDetailsHolder.addEventListener("click", (function(name) {
					return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
				})(nfcTeamsData[oppTeamIndex]));
			}

			playoffGameDetailsHolder.appendChild(playoffTeamDetailsHolder);

			var versesContainer = document.createElement("div");
			addClass(versesContainer, "verses-container");

			var versesText = document.createElement("span");
			addClass(versesText, "verses-text");
			versesText.innerHTML = "@";

			versesContainer.appendChild(versesText);
			playoffGameDetailsHolder.appendChild(versesContainer);

			var playoffTeamDetailsHolder = document.createElement("div");
			addClass(playoffTeamDetailsHolder, "playoff-team-details-holder");
			addClass(playoffTeamDetailsHolder, "reverse-content");

			var teamWinLoseText = document.createElement("span");
			addClass(teamWinLoseText, "playoff-team-win-lose-text");
			teamWinLoseText.innerHTML = generateWinLoseTieTextForStandings(
				nfcTeamsData[teamIndex]
			);
			playoffTeamDetailsHolder.appendChild(teamWinLoseText);

			var teamLogo = document.createElement("img");
			addClass(teamLogo, "playoff-team-logo");
			if (initailDataFlag) {
				addClass(teamLogo, "question-mark");
				teamLogo.setAttribute("src", STATIC_URL + "/skm/assets/playoff-predictor/question-icon.png");
				teamLogo.setAttribute("width", "7px");
				teamLogo.setAttribute("height", "11px");
			} else {
				teamLogo.setAttribute("src", teamsData[nfcTeamsData[teamIndex]]["logo"]);
				teamLogo.setAttribute("width", "33px");
				teamLogo.setAttribute("height", "22px");
			}

			teamLogo.setAttribute("alt", nfcTeamsData[teamIndex]);
			playoffTeamDetailsHolder.appendChild(teamLogo);

			var rankTextHolder = document.createElement("span");
			addClass(rankTextHolder, "playoff-team-rank");
			rankTextHolder.innerHTML = "#" + (teamIndex + 1);
			playoffTeamDetailsHolder.appendChild(rankTextHolder);

			if (!initailDataFlag) {
				playoffTeamDetailsHolder.style.cursor = "pointer";
				playoffTeamDetailsHolder.addEventListener("click", (function(name) {
					return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
				})(nfcTeamsData[teamIndex]));
			}

			playoffGameDetailsHolder.appendChild(playoffTeamDetailsHolder);

			playoffGamesContainer.appendChild(playoffGameDetailsHolder);
		}

		}); // end viewContainers.forEach
	}

	function setPlayoffParticipantsStandings() {
		for (var division in divisionData) {
			var divisionName = division.split(" ").join("-").toLowerCase();
			var currDivisionData = divisionData[division];
			queryEachView(".playoff-participants-standings-container ." + divisionName).forEach(function(divisionContainer) {
				divisionContainer.innerHTML = "";
				for (var teamIndex in currDivisionData) {
					var teamData = currDivisionData[teamIndex];
					var teamDataContainer = document.createElement("div");
					addClass(teamDataContainer, "division-team-container");

					var teamLogo = document.createElement("img");
					addClass(teamLogo, "division-team-logo");
					teamLogo.setAttribute("src", teamData["logo"]);
					teamLogo.setAttribute("alt", teamData["Team"]);
					teamLogo.setAttribute("width", "30px");
					teamLogo.setAttribute("height", "20px");

					var teamWinLoseText = document.createElement("span");
					addClass(teamWinLoseText, "division-team-win-lose-text");
					teamWinLoseText.innerHTML = generateWinLoseTieText(teamData["Team"]);

					teamDataContainer.appendChild(teamLogo);
					teamDataContainer.appendChild(teamWinLoseText);

					teamDataContainer.style.cursor = "pointer";
					teamDataContainer.addEventListener("click", (function(name) {
						return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
					})(teamData["Team"]));

					divisionContainer.appendChild(teamDataContainer);
				}
			});
		}
	}

	function showConferenceStandingsData() {
		queryEachView(".conference-standings").forEach(function(standingContainer) {
		removeAllChild(standingContainer);

		var conferenceDataSequence = ["AFC", "NFC"];

		for (
			var sequenceIndex = 0;
			sequenceIndex < conferenceDataSequence.length;
			sequenceIndex++
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
				var tableHeaderIndex = 0;
				tableHeaderIndex < tableHeader.length - 2;
				tableHeaderIndex++
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

				standingsTeamContainer.style.cursor = "pointer";
				standingsTeamContainer.addEventListener("click", (function(name) {
					return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
				})(confData[teamIndex]["Team"]));

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
		}); // end $both forEach
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
		queryEachView(".division-standings").forEach(function(standingContainer) {
			removeAllChild(standingContainer);

			var isDesktopView = standingContainer.closest('.pp-desktop-view') !== null;

			var divisionDataSequence;
			if (isDesktopView) {
				divisionDataSequence = [
					"AFC E", "NFC E",
					"AFC N", "NFC N",
					"AFC S", "NFC S",
					"AFC W", "NFC W",
				];
			} else {
				divisionDataSequence = [
					"AFC E", "AFC N", "AFC S", "AFC W",
					"NFC E", "NFC N", "NFC S", "NFC W",
				];
			}

			for (
				var sequenceIndex = 0;
				sequenceIndex < divisionDataSequence.length;
				sequenceIndex++
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
					var tableHeaderIndex = 0;
					tableHeaderIndex < tableHeader.length - 2;
					tableHeaderIndex++
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

					standingsTeamContainer.style.cursor = "pointer";
					standingsTeamContainer.addEventListener("click", (function(name) {
						return function(e) { e.stopPropagation(); showTeamInfoPopUp(name); };
					})(divData[teamIndex]["Team"]));

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
		}); // end $both forEach
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
				return teamAData["SOV"] == teamBData["SOV"]
					? teamAData["SOS"] == teamBData["SOS"]
						? teamAData["CombinedConferenceRank"] ==
							teamBData["CombinedConferenceRank"]
							? teamAData["CombinedLeagueRank"] -
							teamBData["CombinedLeagueRank"]
							: teamAData["CombinedConferenceRank"] -
							teamBData["CombinedConferenceRank"]
						: teamBData["SOS"] - teamAData["SOS"]
					: teamBData["SOV"] - teamAData["SOV"];
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
					return teamAData["SOV"] == teamBData["SOV"]
						? teamAData["SOS"] == teamBData["SOS"]
							? teamAData["CombinedConferenceRank"] ==
								teamBData["CombinedConferenceRank"]
								? teamAData["CombinedLeagueRank"] -
								teamBData["CombinedLeagueRank"]
								: teamAData["CombinedConferenceRank"] -
								teamBData["CombinedConferenceRank"]
							: teamBData["SOS"] - teamAData["SOS"]
						: teamBData["SOV"] - teamAData["SOV"];
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
					var teamIndexRankMap = 1;
					teamIndexRankMap < rankMap[divisionKey].length - 1;
					teamIndexRankMap++
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
						var headBreakedListIndex = 0;
						headBreakedListIndex < breakedHeadToHeadData[headListIndex].length;
						headBreakedListIndex++
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
				var finalSortedDataIndex = 0;
				finalSortedDataIndex < finalSortedData.length;
				finalSortedDataIndex++
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
					var topTeamsIndex = 0;
					topTeamsIndex < topFourTeamsOfConference.length;
					topTeamsIndex++
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
						var divisionBreakedlistIndex = 0;
						divisionBreakedlistIndex < updatedConferenceList[listIndex].length;
						divisionBreakedlistIndex++
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
						var headBreakedListIndex = 0;
						headBreakedListIndex < breakedHeadToHeadData[headListIndex].length;
						headBreakedListIndex++
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
				var finalSortedDataIndex = 0;
				finalSortedDataIndex < finalSortedData.length;
				finalSortedDataIndex++
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
			var teamListIndex = 0;
			teamListIndex < teamList.length;
			teamListIndex++
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
			var headTeamListIndex = 0;
			headTeamListIndex < teamListInHead.length;
			headTeamListIndex++
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
			var headTeamListIndex = 0;
			headTeamListIndex < teamListInHead.length;
			headTeamListIndex++
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
		if (e) {
			trackGAEventForPage("Standings_Toggle", {
				page: "Standings",
			});
		}

		queryEachView(".standings-section-toggle-btn").forEach(function(el) {
			if (!hasClass(el, "selected")) addClass(el, "selected");
		});
		queryEachView(".draft-order-section-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
		queryEachView(".standings-section-wrapper").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});
		queryEachView(".draft-order-section-wrapper").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
	}

	function showDraftOrderSection() {
		var draftOrderToggleButton = $(".draft-order-section-toggle-btn");
		if (draftOrderToggleButton && hasClass(draftOrderToggleButton, "disabled")) return;

		trackGAEventForPage("Draft_Order_Toggle", {
			page: "Draft Order",
		});

		queryEachView(".standings-section-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
		queryEachView(".draft-order-section-toggle-btn").forEach(function(el) {
			if (!hasClass(el, "selected")) addClass(el, "selected");
		});
		queryEachView(".standings-section-wrapper").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
		queryEachView(".draft-order-section-wrapper").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});
	}

	function disableDraftOrderSection(shouldDisable = true) {
		queryEachView(".draft-order-section-toggle-btn").forEach(function(el) {
			if (shouldDisable) {
				addClass(el, "disabled");
			} else {
				removeClass(el, "disabled");
			}
		});
		if (shouldDisable) {
			showStandingsSection();
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
		if (standingsToggleButton && hasClass(standingsToggleButton, "selected")) return;

		updateStickyAdContainerClasses("standings-page");

		trackGAEventForPage("Predictor_Toggle", {
			page: "Standings",
		});

		queryEachView(".sticky-bottom-cta-wrapper").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});

		if (playoffMatchesData["Super Bowl"]["winner"] === "") {
			prevSimulationPausedState = pauseSimulatorFlag;
			pauseSimulation();
		}

		queryEachView(".glossary-mweb-container").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});

		queryEachView(".standings-page-toggle-btn").forEach(function(el) {
			if (!hasClass(el, "selected")) addClass(el, "selected");
		});
		queryEachView(".simulator-page-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
		queryEachView(".draft-order-page-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
		queryEachView(".standings-page").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});
		queryEachView(".simulator-page").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
		queryEachView(".draft-order-page").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
	}

	function showDraftOrderPage() {
		var draftOrderToggleButton = $(".draft-order-page-toggle-btn");
		if (draftOrderToggleButton && hasClass(draftOrderToggleButton, "selected")) return;

		updateStickyAdContainerClasses("draft-order-page");

		trackGAEventForPage("Predictor_Toggle", {
			page: "Draft Order",
		});

		queryEachView(".sticky-bottom-cta-wrapper").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});

		if (playoffMatchesData["Super Bowl"]["winner"] === "") {
			prevSimulationPausedState = pauseSimulatorFlag;
			pauseSimulation();
		}

		queryEachView(".glossary-mweb-container").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});

		queryEachView(".draft-order-page-toggle-btn").forEach(function(el) {
			if (!hasClass(el, "selected")) addClass(el, "selected");
		});
		queryEachView(".standings-page-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
		queryEachView(".simulator-page-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
		queryEachView(".draft-order-page").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});
		queryEachView(".simulator-page").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
		queryEachView(".standings-page").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
	}

	function showSimulatorPage() {
		var simulateToggleButton = $(".simulator-page-toggle-btn");
		if (simulateToggleButton && hasClass(simulateToggleButton, "selected")) return;

		updateStickyAdContainerClasses("simulator-page");

		trackGAEventForPage("Predictor_Toggle", {
			page: "Playoff Predictor",
		});

		queryEachView(".sticky-bottom-cta-wrapper").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});

		var resumeButton = $(".resume-button");
		if (resumeButton) {
			setTimeout(() => {
				resumeButton.click();
			}, 500);
		}

		queryEachView(".glossary-mweb-container").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});

		queryEachView(".standings-page-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
		queryEachView(".draft-order-page-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
		queryEachView(".simulator-page-toggle-btn").forEach(function(el) {
			if (!hasClass(el, "selected")) addClass(el, "selected");
		});
		queryEachView(".simulator-page").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});
		queryEachView(".standings-page").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
		queryEachView(".draft-order-page").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
	}

	function showConferenceStandingsPage() {
		trackGAEventForPage("Points_Table_Toggle", {
			section: "Conference",
		});

		queryEachView(".conference-standings").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});
		queryEachView(".division-standings").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
		queryEachView(".conference-toggle-btn").forEach(function(el) {
			if (!hasClass(el, "selected")) addClass(el, "selected");
		});
		queryEachView(".division-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
	}

	function showDivisionStandingsPage() {
		trackGAEventForPage("Points_Table_Toggle", {
			section: "Division",
		});

		queryEachView(".conference-standings").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
		queryEachView(".division-standings").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});
		queryEachView(".conference-toggle-btn").forEach(function(el) {
			if (hasClass(el, "selected")) removeClass(el, "selected");
		});
		queryEachView(".division-toggle-btn").forEach(function(el) {
			if (!hasClass(el, "selected")) addClass(el, "selected");
		});
	}

	function checkAllMatchCompletion() {
		for (
			var matchIndex = 0;
			matchIndex < weekMatchesData.length;
			matchIndex++
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

		if (e) {
			trackGAEventForPage("Popup_Close", {
				section: "Predict Simulate",
			});
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
				disabledSimulateCTA(true);
				if (selectedOption == "option1") {
					simulateMatchesWithAllWeek(0, landingWeek);
				} else if (selectedOption == "option2") {
					simulateMatchesWithCurrentWeek(0, currentWeek);
				} else if (selectedOption == "option3") {
					simulateMatchesFromCurrentWeek(0, currentWeek);
				}

				showSimulationOverLays();

				trackGAEventForPage("Predict_Playoff_Confirm", {
					section: selectedOption,
				});
			} else {
				trackGAEventForPage("Predict_Playoff_Confirm", {
					section: "close",
				});
			}
		}
		closePredictSimulatePopUp();
	}

	function closePredictPlayoffGamesPopUp(e) {
		if (e) {
			trackGAEventForPage("Popup_Close", {
				section: "Playoff Predictor",
			});

			var userVisitCount = getLocalStorageData("playoff_predictor_user_visit_count");

			if (!userVisitCount) {
				userVisitCount = 1;
			}
			else userVisitCount++;
			setLocalStorageData("playoff_predictor_user_visit_count", userVisitCount);
		}

		clearTimeout(playoffSimulationTimeoutId);
		removeSimulationOverLays();
		updateSimulationButtonDisableStatus();
		disabledSimulateCTA(false);
	}

	function moveBracketToActiveView() {
		var bracketContainers = queryEachView(".playoff-bracket-tab-content");
		if (bracketContainers.length < 2) return;

		var popup = null;
		var sourceContainer = null;
		for (var i = 0; i < bracketContainers.length; i++) {
			var found = bracketContainers[i].querySelector('.predict-playoff-games-popup-container');
			if (found) {
				popup = found;
				sourceContainer = bracketContainers[i];
				break;
			}
		}
		if (!popup) return;

		var activeView = window.innerWidth > 900 ? '.pp-desktop-view' : '.pp-tablet-mobile-view';
		var targetContainer = document.querySelector(activeView + ' .playoff-bracket-tab-content');
		if (targetContainer && targetContainer !== sourceContainer) {
			targetContainer.appendChild(popup);
		}
	}

	function showPredictPlayoffGamesPopup() {
		var bracketContainer = document.querySelector(".playoff-bracket-tab-content");
		if (!bracketContainer) return;

		// Check all bracket containers for existing popup (it may have been moved between views)
		var existingContainer = document.querySelector('.playoff-bracket-tab-content .predict-playoff-games-popup-container');
		if (!existingContainer) {
			var predictPlayoffPopup = document
				.getElementById("predict-playoff-games-popup")
				.content.cloneNode(true);

			bracketContainer.appendChild(predictPlayoffPopup);
		}

		moveBracketToActiveView();
		var bracketContainer = document.querySelector(".playoff-bracket-tab-content .predict-playoff-games-popup-container").parentElement;

		const superbowlMatch = playoffMatchesData["Super Bowl"];
		const superbowlWinner = superbowlMatch["winner"];

		const predictionsExist = hasPlayoffPredictions();

		if (!predictionsExist) {
			setPlayoffMatchesData();
			setPlayoffPredictorConatainer();
			addPopUpEventListeners();
			setCompletedPlayoffMatchesData();
		}

		var shareBtn = $(".predict-playoff-games-popup-container .share-btn-mds");
		var downloadBtn = $(".predict-playoff-games-popup-container .download-btn-mds");
		var simBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
		var pauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
		var resetBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-reset-btn");

		if (downloadBtn) {
			downloadBtn.addEventListener("click", downloadPlayoff);
		}

		if (simBtn) {
			if (!superbowlWinner) {
				simBtn.removeAttribute("disabled");
			} else {
				simBtn.setAttribute("disabled", "");
			}
			simBtn.classList.remove("hidden");
			simBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				simulatePlayoffMatches(false);
				pauseBtn.classList.remove("hidden");
				simBtn.classList.add("hidden");
			});
		}

		if (pauseBtn) {
			pauseBtn.classList.add("hidden");
			pauseBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				clearTimeout(playoffSimulationTimeoutId);
				playoffSimulationTimeoutId = null;
				simBtn.classList.remove("hidden");
				pauseBtn.classList.add("hidden");
			})
		}

		if (resetBtn) {
			if (superbowlWinner) {
				resetBtn.removeAttribute("disabled");
			} else {
				resetBtn.setAttribute("disabled", "");
			}
			resetBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				clearTimeout(playoffSimulationTimeoutId);
				playoffSimulationTimeoutId = null;
				resetPlayoffPredictions();
				simBtn.classList.remove("hidden");
				pauseBtn.classList.add("hidden");
				simBtn.removeAttribute("disabled");
				resetBtn.setAttribute("disabled", "");
			});
		}

		if (shareBtn) {
			shareBtn.addEventListener("click", sharePlayoff);
			if (navigator && navigator.share) {
				removeClass(shareBtn, "hidden");
			}
		}
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

	// ---- Power Rank Popup ----

	function getTeamPowerRankings() {
		var rankings = [];
		for (var i = 0; i < teamsList.length; i++) {
			var teamName = teamsList[i];
			var totalProb = 0;
			// winProbabilityGrid[row][col] = probability that team at col beats team at row
			// So sum column i to get team i's total win probability against all opponents
			for (var j = 0; j < winProbabilityGrid.length; j++) {
				if (j !== i) {
					totalProb += winProbabilityGrid[j][i];
				}
			}
			rankings.push({ team: teamName, score: totalProb, index: i });
		}
		rankings.sort(function(a, b) { return b.score - a.score; });
		return rankings;
	}

	function showPowerRankPopUp() {
		showOverlay(true);

		var popup = document
			.getElementById("power-rank-popup")
			.content.cloneNode(true);

		var list = popup.querySelector(".power-rank-list");
		var rankings;
		if (customPowerRankOrder) {
			// Use saved explicit order
			rankings = customPowerRankOrder.map(function(team, idx) {
				return { team: team, score: customPowerRankOrder.length - idx, index: teamsList.indexOf(team) };
			});
		} else {
			rankings = getTeamPowerRankings();
		}

		renderPowerRankList(list, rankings);

		var closeIcon = popup.querySelector(".close-icon");
		closeIcon.addEventListener("click", closePowerRankPopUp);

		var resetBtn = popup.querySelector(".power-rank-reset-btn");
		resetBtn.addEventListener("click", function() {
			winProbabilityGrid = originalWinProbabilityGrid.map(function(row) { return row.slice(); });
			hasCustomPowerRankings = false;
			customPowerRankOrder = null;
			updateCustomSettingsBanner();
			var container = $(".power-rank-popup-container");
			if (container) {
				var listEl = container.querySelector(".power-rank-list");
				var newRankings = getTeamPowerRankings();
				listEl.innerHTML = "";
				renderPowerRankList(listEl, newRankings);
			}
		});

		var applyBtn = popup.querySelector(".power-rank-apply-btn");
		applyBtn.addEventListener("click", function() {
			applyPowerRankings();
		});

		document.body.appendChild(popup);
	}

	function getDragAfterElement(container, y) {
		var elements = Array.prototype.slice.call(
			container.querySelectorAll(".power-rank-team-row:not(.dragging)")
		);
		var closest = null;
		var closestOffset = Number.NEGATIVE_INFINITY;
		for (var i = 0; i < elements.length; i++) {
			var box = elements[i].getBoundingClientRect();
			var offset = y - box.top - box.height / 2;
			if (offset < 0 && offset > closestOffset) {
				closestOffset = offset;
				closest = elements[i];
			}
		}
		return closest;
	}

	function renderPowerRankList(listEl, rankings) {
		var draggedRow = null;
		var dragScrollInterval = null;

		listEl.addEventListener("dragover", function(e) {
			e.preventDefault();
			var afterElement = getDragAfterElement(listEl, e.clientY);
			if (draggedRow) {
				if (afterElement == null) {
					listEl.appendChild(draggedRow);
				} else {
					listEl.insertBefore(draggedRow, afterElement);
				}
			}

			var listRect = listEl.getBoundingClientRect();
			var scrollZone = 40;
			var scrollSpeed = 8;

			if (dragScrollInterval) {
				clearInterval(dragScrollInterval);
				dragScrollInterval = null;
			}

			if (e.clientY < listRect.top + scrollZone) {
				dragScrollInterval = setInterval(function() {
					listEl.scrollTop -= scrollSpeed;
				}, 16);
			} else if (e.clientY > listRect.bottom - scrollZone) {
				dragScrollInterval = setInterval(function() {
					listEl.scrollTop += scrollSpeed;
				}, 16);
			}
		});

		listEl.addEventListener("dragleave", function() {
			if (dragScrollInterval) {
				clearInterval(dragScrollInterval);
				dragScrollInterval = null;
			}
		});

		listEl.addEventListener("drop", function(e) {
			e.preventDefault();
			if (dragScrollInterval) {
				clearInterval(dragScrollInterval);
				dragScrollInterval = null;
			}
			var updatedRows = listEl.querySelectorAll(".power-rank-team-row");
			for (var j = 0; j < updatedRows.length; j++) {
				updatedRows[j].querySelector(".power-rank-number").textContent = (j + 1);
			}
		});

		for (var i = 0; i < rankings.length; i++) {
			var teamName = rankings[i].team;
			var row = document.createElement("div");
			row.className = "power-rank-team-row";
			row.setAttribute("data-team", teamName);
			row.setAttribute("draggable", "true");

			row.addEventListener("dragstart", function(e) {
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData("text/plain", "");
				draggedRow = this;
				this.classList.add("dragging");
			});

			row.addEventListener("dragend", function(e) {
				this.classList.remove("dragging");
				draggedRow = null;
				if (dragScrollInterval) {
					clearInterval(dragScrollInterval);
					dragScrollInterval = null;
				}
				var updatedRows = listEl.querySelectorAll(".power-rank-team-row");
				for (var j = 0; j < updatedRows.length; j++) {
					updatedRows[j].querySelector(".power-rank-number").textContent = (j + 1);
				}
			});

			var rankSpan = document.createElement("span");
			rankSpan.className = "power-rank-number";
			rankSpan.textContent = (i + 1);

			var logo = document.createElement("img");
			logo.className = "power-rank-team-logo";
			logo.setAttribute("width", "28");
			logo.setAttribute("height", "18");
			if (teamsData[teamName]) {
				logo.setAttribute("src", teamsData[teamName]["logo"]);
			}
			logo.setAttribute("alt", teamName);
			logo.setAttribute("draggable", "false");

			var nameSpan = document.createElement("span");
			nameSpan.className = "power-rank-team-name";
			nameSpan.textContent = teamName;

			var arrows = document.createElement("div");
			arrows.className = "power-rank-arrows";

			var upBtn = document.createElement("button");
			upBtn.className = "power-rank-up";
			upBtn.textContent = "\u25B2";
			upBtn.addEventListener("click", (function(teamKey) {
				return function() { moveTeamRank(teamKey, -1); };
			})(teamName));

			var downBtn = document.createElement("button");
			downBtn.className = "power-rank-down";
			downBtn.textContent = "\u25BC";
			downBtn.addEventListener("click", (function(teamKey) {
				return function() { moveTeamRank(teamKey, 1); };
			})(teamName));

			arrows.appendChild(upBtn);
			arrows.appendChild(downBtn);

			row.appendChild(rankSpan);
			row.appendChild(logo);
			row.appendChild(nameSpan);
			row.appendChild(arrows);

			listEl.appendChild(row);
		}
	}

	function moveTeamRank(teamName, direction) {
		var container = $(".power-rank-popup-container");
		if (!container) return;

		var list = container.querySelector(".power-rank-list");
		var rows = list.querySelectorAll(".power-rank-team-row");
		var currentIndex = -1;

		for (var i = 0; i < rows.length; i++) {
			if (rows[i].getAttribute("data-team") === teamName) {
				currentIndex = i;
				break;
			}
		}

		if (currentIndex === -1) return;

		var newIndex = currentIndex + direction;
		if (newIndex < 0 || newIndex >= rows.length) return;

		var currentRow = rows[currentIndex];
		var targetRow = rows[newIndex];

		if (direction === -1) {
			list.insertBefore(currentRow, targetRow);
		} else {
			list.insertBefore(targetRow, currentRow);
		}

		// Update rank numbers
		var updatedRows = list.querySelectorAll(".power-rank-team-row");
		for (var j = 0; j < updatedRows.length; j++) {
			updatedRows[j].querySelector(".power-rank-number").textContent = (j + 1);
		}
	}

	function updateCustomSettingsBanner() {
		var banner = document.querySelector(".custom-settings-banner");
		if (!banner) return;

		if (!hasCustomPowerRankings && !hasCustomSettings) {
			banner.innerHTML = "&nbsp;";
			banner.classList.remove("active");
			return;
		}

		var text = "";
		if (hasCustomPowerRankings && hasCustomSettings) {
			text = "Custom power rankings & settings applied";
		} else if (hasCustomPowerRankings) {
			text = "Custom power rankings applied";
		} else {
			text = "Custom settings applied";
		}

		banner.textContent = text;
		banner.classList.add("active");
	}

	function applyPowerRankings() {
		var container = $(".power-rank-popup-container");
		if (!container) return;

		var rows = container.querySelectorAll(".power-rank-team-row");
		var defaultRankings = getTeamPowerRankings();

		// Build map of old rank positions
		var oldRankMap = {};
		for (var i = 0; i < defaultRankings.length; i++) {
			oldRankMap[defaultRankings[i].team] = i;
		}

		// Build new rank positions from the popup list
		var newRankMap = {};
		for (var j = 0; j < rows.length; j++) {
			var team = rows[j].getAttribute("data-team");
			newRankMap[team] = j;
		}

		// Adjust winProbabilityGrid based on rank changes
		var grid = originalWinProbabilityGrid.map(function(row) { return row.slice(); });
		for (var ti = 0; ti < teamsList.length; ti++) {
			var teamA = teamsList[ti];
			var rankChangeA = (oldRankMap[teamA] !== undefined && newRankMap[teamA] !== undefined)
				? oldRankMap[teamA] - newRankMap[teamA] : 0;

			for (var tj = 0; tj < teamsList.length; tj++) {
				if (ti === tj) continue;
				var teamB = teamsList[tj];
				var rankChangeB = (oldRankMap[teamB] !== undefined && newRankMap[teamB] !== undefined)
					? oldRankMap[teamB] - newRankMap[teamB] : 0;

				var netChange = rankChangeB - rankChangeA;
				var scaleFactor = 1 + (netChange * 0.02);
				var adjusted = grid[ti][tj] * scaleFactor;
				grid[ti][tj] = Math.max(0.05, Math.min(0.95, adjusted));
			}
		}

		winProbabilityGrid = grid;
		hasCustomPowerRankings = true;

		// Save the user's explicit rank order
		customPowerRankOrder = [];
		for (var k = 0; k < rows.length; k++) {
			customPowerRankOrder.push(rows[k].getAttribute("data-team"));
		}

		updateCustomSettingsBanner();
		closePowerRankPopUp();
	}

	function closePowerRankPopUp(e) {
		var container = $(".power-rank-popup-container");
		if (container) {
			container.remove();
		}
		showOverlay(false);
	}

	// ---- Settings Popup ----

	function showSettingsPopUp() {
		showOverlay(true);

		var popup = document
			.getElementById("settings-popup")
			.content.cloneNode(true);

		var slider = popup.querySelector(".chaos-slider");
		var valueText = popup.querySelector(".chaos-value-text");
		slider.value = chaosLevel;
		valueText.textContent = chaosLevel + "%";

		slider.addEventListener("input", function() {
			valueText.textContent = slider.value + "%";
		});

		// Highlight active scenario
		var presetBtns = popup.querySelectorAll(".scenario-preset-btn");
		presetBtns.forEach(function(btn) {
			if (activeScenario !== "default" && btn.getAttribute("data-scenario") === activeScenario) {
				btn.classList.add("active");
				slider.disabled = true;
			}
			btn.addEventListener("click", function() {
				var container = $(".settings-popup-container");
				var sl = container.querySelector(".chaos-slider");
				var vt = container.querySelector(".chaos-value-text");
				var isAlreadyActive = btn.classList.contains("active");

				presetBtns.forEach(function(b) { b.classList.remove("active"); });

				if (isAlreadyActive) {
					// Toggling off — re-enable slider
					sl.disabled = false;
					return;
				}

				btn.classList.add("active");
				sl.disabled = true;

				var scenario = btn.getAttribute("data-scenario");

				if (scenario === "favorites") {
					sl.value = 0;
					vt.textContent = "0%";
				} else if (scenario === "upsets") {
					sl.value = 50;
					vt.textContent = "50%";
				} else if (scenario === "coin-flip") {
					sl.value = 100;
					vt.textContent = "100%";
				} else if (scenario === "default") {
					sl.value = 50;
					vt.textContent = "50%";
				}
			});
		});

		var closeIcon = popup.querySelector(".close-icon");
		closeIcon.addEventListener("click", closeSettingsPopUp);

		var applyBtn = popup.querySelector(".settings-apply-btn");
		applyBtn.addEventListener("click", function() {
			applySettings();
		});

		document.body.appendChild(popup);
	}

	function applySettings() {
		var container = $(".settings-popup-container");
		if (!container) return;

		var slider = container.querySelector(".chaos-slider");
		chaosLevel = parseInt(slider.value, 10);

		var activeBtn = container.querySelector(".scenario-preset-btn.active");
		if (activeBtn) {
			activeScenario = activeBtn.getAttribute("data-scenario");
		} else {
			activeScenario = "default";
		}

		// "All Upsets" uses deterministic mode (chaos 0) regardless of slider display
		if (activeScenario === "upsets") {
			chaosLevel = 0;
		}

		hasCustomSettings = (chaosLevel !== 50 || activeScenario !== "default");
		updateCustomSettingsBanner();
		closeSettingsPopUp();
	}

	function closeSettingsPopUp(e) {
		var container = $(".settings-popup-container");
		if (container) {
			container.remove();
		}
		showOverlay(false);
	}

	function showTeamInfoPopUp(teamName) {
		closeAllPopUps();
		showOverlay(true);

		var popup = document
			.getElementById("team-info-popup")
			.content.cloneNode(true);

		var popupHeader = popup.querySelector(".popup-header");
		if (popupHeader) popupHeader.remove();

		var iframe = popup.querySelector(".team-info-iframe");
		var loader = popup.querySelector(".team-info-iframe-loader");

		var slug = teamSlugMap[teamName];
		if (slug) {
			iframe.src = teamInfoBaseURL + slug + "?mds-popup";
		}

		iframe.addEventListener("load", function () {
			loader.style.display = "none";
			iframe.style.display = "block";
		});

		document.body.appendChild(popup);
	}

	function closeTeamInfoPopUp() {
		var container = $(".team-info-popup-container");
		if (container) {
			var iframe = container.querySelector(".team-info-iframe");
			if (iframe) {
				iframe.src = "about:blank";
				iframe.remove();
			}
			container.remove();
		}
		showOverlay(false);
	}

	function closeAllPopUps() {
		closeDeletePopUp();
		closePredictPlayoffGamesPopUp();
		closePredictSimulatePopUp();
		closeSimulatePopUp();
		closePowerRankPopUp();
		closeSettingsPopUp();
		closeTeamInfoPopUp();
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
			trackGAEventForPage("Predict_Playoff_CTA", {
				"Popup": "Playoff Predictor"
			});
			showPredictPlayoffGamesPopup();
			switchToBracketTab();
		} else {
			trackGAEventForPage("Predict_Playoff_CTA", {
				"Popup": "Simulate"
			});
			showPredictSimulationPopup();
		}
	}

	function showAFCStandings() {
		queryAllViews(".afc-tab-btn").forEach(function(el) { addClass(el, "selected"); });
		queryAllViews(".nfc-tab-btn").forEach(function(el) { removeClass(el, "selected"); });
		queryAllViews(".playoff-participants-standings-container .afc-standings-container").forEach(function(el) {
			removeClass(el, "hidden");
		});
		queryAllViews(".playoff-participants-standings-container .nfc-standings-container").forEach(function(el) {
			addClass(el, "hidden");
		});
		queryAllViews(".afc-conference-bar").forEach(function(el) { removeClass(el, "hidden"); });
		queryAllViews(".nfc-conference-bar").forEach(function(el) { addClass(el, "hidden"); });
	}

	function showNFCStandings() {
		queryAllViews(".nfc-tab-btn").forEach(function(el) { addClass(el, "selected"); });
		queryAllViews(".afc-tab-btn").forEach(function(el) { removeClass(el, "selected"); });
		queryAllViews(".playoff-participants-standings-container .nfc-standings-container").forEach(function(el) {
			removeClass(el, "hidden");
		});
		queryAllViews(".playoff-participants-standings-container .afc-standings-container").forEach(function(el) {
			addClass(el, "hidden");
		});
		queryAllViews(".nfc-conference-bar").forEach(function(el) { removeClass(el, "hidden"); });
		queryAllViews(".afc-conference-bar").forEach(function(el) { addClass(el, "hidden"); });
	}

	function switchToParticipantsTab() {
		queryAllViews(".participants-tab-btn").forEach(function(el) {
			addClass(el, "selected");
		});
		queryAllViews(".bracket-tab-btn").forEach(function(el) {
			removeClass(el, "selected");
		});
		queryAllViews(".playoff-section-content, .playoff-participants-tab-content").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});
		queryAllViews(".playoff-bracket-tab-content").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
	}

	function switchToBracketTab() {
		moveBracketToActiveView();
		queryAllViews(".bracket-tab-btn").forEach(function(el) {
			addClass(el, "selected");
		});
		queryAllViews(".participants-tab-btn").forEach(function(el) {
			removeClass(el, "selected");
		});
		queryAllViews(".playoff-section-content, .playoff-participants-tab-content").forEach(function(el) {
			if (!hasClass(el, "hidden")) addClass(el, "hidden");
		});
		queryAllViews(".playoff-bracket-tab-content").forEach(function(el) {
			if (hasClass(el, "hidden")) removeClass(el, "hidden");
		});
	}

	function initializeTool() {
		if (RUN_AUTO_SIMULATION) {
			calculatePlayoffProbability();
		}

		trackGAEventForPage("tool_initialized");
		changeWeek("", landingWeek);
		calculateStatsData();
		updateStandingsData();
		updateSimulationButtonDisableStatus();
		showAFCStandings();

		var loadingOverlayContainer = $(".loading-overlay");

		if (
			loadingOverlayContainer &&
			!hasClass(loadingOverlayContainer, "hidden")
		) {
			addClass(loadingOverlayContainer, "hidden");
		}

		firstFiveWeeksMatchesCompleted = canShowDraftOrder();
		disableDraftOrderSection(!firstFiveWeeksMatchesCompleted);

		if (checkAllWeekMatchesCompleted()) {
			trackGAEventForPage("Predict_Playoff_CTA", {
				"Popup": "Playoff Predictor"
			});
			showPredictPlayoffGamesPopup();
			switchToBracketTab();
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

	function calculateSimulatedPercentageData(simulationTeamCount) {
		Object.keys(simulationTeamCount).forEach(teamName => {
			Object.keys(simulationTeamCount[teamName]).forEach(roundName => {
				simulationTeamCount[teamName][roundName] = String(parseFloat(((simulationTeamCount[teamName][roundName] / simulationCount) * 100).toFixed(2)));
			});
		});
	}

	function calculatePlayoffProbability() {
		var simulationTeamCount = {};
		teamsList.forEach(teamName => {
			simulationTeamCount[teamName] = {
				"playoff": 0,
				"wildcard": 0,
				"divisional": 0,
				"conference": 0,
				"superbowl": 0,
				"conferenceTop": 0,
				"divisionTop": 0,
			};
		});
		for (let index = 0; index < simulationCount; index++) {
			console.log(index, " started at ->", (Date.now() - startTime) / 1000)
			simulateMatchesWithAllWeekForQual(0, landingWeek);
			updateSimulatedStats();
			checkForSimulatedTeamCount(simulationTeamCount);
			setDeafultWeekMatchesData();
			setDeafultTeamsData();
		}

		calculateSimulatedPercentageData(simulationTeamCount);

		formatAndUploadData(simulationTeamCount);
	}

	function formatAndUploadData(data) {
		var results = [];
		for (var teamName in data) {
			var predictionObject = {
				teamName: teamName,
				predictions: data[teamName]
			}
			results.push(predictionObject);
		}

		fetch(predictionSubmissionUrl, {
			method: "PUT",
			body: JSON.stringify(results),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}
				return res.json();
			})
			.then(() => submissionSuccessCallback())
			.catch((error) => {
				console.error('Error:', error);
				submissionErrorCallback();
			});
	}

	function submissionSuccessCallback() {
		console.log("Successfly updated prediction data!");
	}

	function submissionErrorCallback() {
		alert("Something went wrong please try again later");
	}

	var processedImages = {};

	function drawBracket(ctx, x, y, teamLogo, teamNumber, isWinner, isRight, isFinalWinner = false) {
		ctx.beginPath();
		ctx.lineWidth = "1";
		if (!teamLogo) {
			ctx.globalAlpha = 0.5;
			ctx.font = "12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
			ctx.textAlign = "center"
			ctx.fillStyle = "#474747";
			if (isRight) {
				ctx.fillText("?", x + 20, y + 22);
			} else {
				ctx.fillText("?", x + 40, y + 22);
			}
		} else {
			ctx.globalAlpha = 1;
		}
		if (isWinner) {
			ctx.strokeStyle = "#37C77A";
			ctx.fillStyle = "#BAF8D7";
		} else {
			ctx.strokeStyle = "#E9E9E9";
			ctx.fillStyle = "#fff";
		}
		ctx.rect(x, y, 60, 36);
		ctx.fillRect(x, y, 60, 36);
		ctx.stroke();
		var textString = teamNumber;
		ctx.font = "12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.textAlign = "center"
		ctx.fillStyle = "#474747";
		if (isRight) {
			ctx.fillText(textString, x + 47, y + 22);
		} else {
			ctx.fillText(textString, x + 12, y + 22);
		}
		if (teamLogo && !isRight) {
			ctx.drawImage(teamLogo, x + 27, y + 8, 30, 20);
		}
		if (teamLogo && isRight) {
			ctx.drawImage(teamLogo, x + 5, y + 8, 30, 20);
		}
	}

	function generateVsCard(ctx, xStart, yStart, vsContainer) {

		var teamDetails = vsContainer.querySelectorAll(".playoff-match-team-details-holder");

		var team1Logo = teamDetails[0].querySelector(".playoff-match-team-logo");
		var team1Number = teamDetails[0].querySelector(".playoff-match-team-rank-holder").innerText;
		var team1isWinner = teamDetails[0].classList.contains("selected");

		var team2Logo = teamDetails[1].querySelector(".playoff-match-team-logo");
		var team2Number = teamDetails[1].querySelector(".playoff-match-team-rank-holder").innerText;
		var team2isWinner = teamDetails[1].classList.contains("selected");


		drawBracket(ctx, xStart, yStart, team1Logo, team1Number, team1isWinner, false);

		xStart += 60 // length of rectangle

		var textString = "@";
		ctx.font = "400 14x Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#666666";
		ctx.textAlign = "center";
		ctx.fillText(textString, xStart + 10, yStart + 20);

		xStart += 20; // gap between rectangles

		drawBracket(ctx, xStart, yStart, team2Logo, team2Number, team2isWinner, true);
	}

	function getCustomSettingsBannerText() {
		if (hasCustomPowerRankings && hasCustomSettings) {
			return "Custom power rankings & settings applied";
		} else if (hasCustomPowerRankings) {
			return "Custom power rankings applied";
		} else if (hasCustomSettings) {
			return "Custom settings applied";
		}
		return "";
	}

	function drawCustomSettingsCanvasBanner(ctx, yPos, canvasWidth) {
		if (!hasCustomPowerRankings && !hasCustomSettings) return yPos;

		var bannerHeight = 18;
		ctx.fillStyle = "#FFF3CD";
		ctx.fillRect(0, yPos, canvasWidth, bannerHeight);

		ctx.strokeStyle = "#FFECB5";
		ctx.beginPath();
		ctx.moveTo(0, yPos);
		ctx.lineTo(canvasWidth, yPos);
		ctx.moveTo(0, yPos + bannerHeight);
		ctx.lineTo(canvasWidth, yPos + bannerHeight);
		ctx.stroke();

		ctx.font = "400 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#856404";
		ctx.textAlign = "center";
		ctx.fillText(getCustomSettingsBannerText(), canvasWidth / 2, yPos + 13);

		return yPos + bannerHeight;
	}

	function getCustomSettingsCanvasExtraHeight() {
		return (hasCustomPowerRankings || hasCustomSettings) ? 18 : 0;
	}

	function preparePlayOffCanvas() {
		var cWidth = 360;
		var cHeight = 560 + getCustomSettingsCanvasExtraHeight();
		var canvas = generatePlayOffCanvas(0, 15, cWidth, cHeight, 2);

		return canvas;
	}

	function persistPaintedCanvas(canvas, key) {
		return new Promise((resolve) => {
			canvas.toBlob(resolve, "image/png", 1);
		}).then((blob) => {
			processedImages[key] = {
				blob,
			};
		});
	};

	function generatePlayOffCanvas(baseX, baseY, canvasWidth, canvasHeight, scaleFactor) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");

		var width = canvasWidth;
		var height = canvasHeight;

		var dpr = scaleFactor || window.devicePixelRatio;

		canvas.width = width * dpr;
		canvas.height = height * dpr;

		ctx.scale(dpr, dpr);

		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var yPos = baseY;
		var headerHeight = baseY + 30;

		ctx.fillStyle = "rgb(0, 80, 160)";
		ctx.fillRect(0, 0, canvasWidth, headerHeight);

		var pfnLogo = document.querySelector(".table-pfn-logo");
		var skLogo = document.querySelector(".sk-logo");

		if (brand == "pfn") {
			ctx.drawImage(pfnLogo, 16, 11, 25, 25);
		} else {
			ctx.drawImage(skLogo, 16, 15, 135, 16);
		}

		var textString = "NFL Playoff Predictor";
		ctx.font = "600 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#fff";
		ctx.textAlign = "right";
		ctx.fillText(textString, canvasWidth - 20, yPos + 7);

		var textString = "My Predictions";
		ctx.font = "400 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#fff";
		ctx.textAlign = "right";
		ctx.fillText(textString, canvasWidth - 20, yPos + 18);

		yPos += 30;
		yPos = drawCustomSettingsCanvasBanner(ctx, yPos, canvasWidth);

		var afcLogoHeight = 30;
		ctx.fillStyle = "#CE1127";
		ctx.fillRect(0, yPos, canvasWidth / 2, afcLogoHeight);
		ctx.fillStyle = "#003369";
		ctx.fillRect(canvasWidth / 2, yPos, canvasWidth / 2, afcLogoHeight);

		var afcImage = document.querySelector(".afc-playoff-popup-header-logo");
		var logoW = 28;
		var logoH = 28;
		var afcCenterX = (canvasWidth / 2 - logoW) / 2;
		var logoCenterY = yPos + (afcLogoHeight - logoH) / 2;
		ctx.drawImage(afcImage, afcCenterX, logoCenterY, logoW, logoH);

		var nfcImage = document.querySelector(".nfc-playoff-popup-header-logo");
		var nfcCenterX = canvasWidth / 2 + (canvasWidth / 2 - logoW) / 2;
		ctx.drawImage(nfcImage, nfcCenterX, logoCenterY, logoW, logoH);

		yPos += 50;

		var afcWildCardContainer = document.querySelector(".afc-playoff-wildcard-round-container");
		var afcVsContainer = afcWildCardContainer.querySelectorAll(".playoff-match-details-holder");

		var nfcWildCardContainer = document.querySelector(".nfc-playoff-wildcard-round-container");
		var nfcVsContainer = nfcWildCardContainer.querySelectorAll(".playoff-match-details-holder");

		textString = "Wild Card Round";
		ctx.font = "italic 12px black Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(textString, canvasWidth / 2, yPos);
		yPos += 10;
		var lineY = yPos; // y coordinate of vertical line

		var xPos = 23;

		for (let i = 0; i < 3; i++) { // 6 brackets for wildcard
			generateVsCard(ctx, xPos, yPos, afcVsContainer[i]);
			xPos += 150 + 20; // length of match bracket + gap
			generateVsCard(ctx, xPos, yPos, nfcVsContainer[i]);
			xPos = 23;
			yPos += 50;
		}

		ctx.beginPath(); // drawing vertical line
		ctx.moveTo(canvasWidth / 2 - 1, lineY);
		ctx.lineTo(canvasWidth / 2 - 1, lineY + 136);
		ctx.strokeStyle = "black"
		ctx.stroke(); // Render the path

		yPos += 10; // Gap after wildcard

		var afcDivisionalCardContainer = document.querySelector(".afc-playoff-divisional-round-container");
		var afcDivisionalVsContainer = afcDivisionalCardContainer.querySelectorAll(".playoff-match-details-holder");

		var nfcDivisionalCardContainer = document.querySelector(".nfc-playoff-divisional-round-container");
		var nfcDivisionalVsContainer = nfcDivisionalCardContainer.querySelectorAll(".playoff-match-details-holder");

		textString = "Divisional Playoffs";
		ctx.font = "italic 12px black Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(textString, canvasWidth / 2, yPos);

		yPos += 15;
		lineY = yPos;

		for (let i = 0; i < 2; i++) { // 4 brackets for divisional playoffs
			generateVsCard(ctx, xPos, yPos, afcDivisionalVsContainer[i]);
			xPos += 150 + 20; // length of match bracket + gap
			generateVsCard(ctx, xPos, yPos, nfcDivisionalVsContainer[i]);
			xPos = 23;
			yPos += 50;
		}

		ctx.beginPath(); // drawing vertical line
		ctx.moveTo(canvasWidth / 2 - 1, lineY);
		ctx.lineTo(canvasWidth / 2 - 1, lineY + 86);
		ctx.strokeStyle = "black"
		ctx.stroke(); // Render the path

		yPos += 10; // Gap after Divisional

		var afcConferenceCardContainer = document.querySelector(".afc-playoff-conference-round-container");
		var afcConferenceVsContainer = afcConferenceCardContainer.querySelector(".playoff-match-details-holder");

		var nfcConferenceCardContainer = document.querySelector(".nfc-playoff-conference-round-container");
		var nfcConferenceVsContainer = nfcConferenceCardContainer.querySelector(".playoff-match-details-holder");


		textString = "Conference Championship";
		ctx.font = "italic 12px black Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(textString, canvasWidth / 2, yPos);

		yPos += 15;
		lineY = yPos;

		generateVsCard(ctx, xPos, yPos, afcConferenceVsContainer);
		xPos += 150 + 20; // length of match bracket + gap
		generateVsCard(ctx, xPos, yPos, nfcConferenceVsContainer);

		ctx.beginPath(); // drawing vertical line
		ctx.moveTo(canvasWidth / 2 - 1, lineY);
		ctx.lineTo(canvasWidth / 2 - 1, lineY + 36);
		ctx.strokeStyle = "black"
		ctx.stroke(); // Render the path

		yPos += 50 + 10;

		var afcSuperBowlContainer = document.querySelector(".afc-playoff-super-bowl-round-container");
		var afcSuperBowlTeamDetails = afcSuperBowlContainer.querySelector(".playoff-match-team-details-holder");
		var afcSuperBowlTeamIsWinner = afcSuperBowlTeamDetails.classList.contains("selected");
		var afcSuperBowlTeamLogo = afcSuperBowlContainer.querySelector(".playoff-match-team-logo");
		var afcSuperBowlTeamNumber = afcSuperBowlContainer.querySelector(".playoff-match-team-rank-holder").innerText;

		var nfcSuperBowlContainer = document.querySelector(".nfc-playoff-super-bowl-round-container");
		var nfcSuperBowlTeamDetails = nfcSuperBowlContainer.querySelector(".playoff-match-team-details-holder");
		var nfcSuperBowlTeamIsWinner = nfcSuperBowlTeamDetails.classList.contains("selected");
		var nfcSuperBowlTeamLogo = nfcSuperBowlContainer.querySelector(".playoff-match-team-logo");
		var nfcSuperBowlTeamNumber = nfcSuperBowlContainer.querySelector(".playoff-match-team-rank-holder").innerText;


		textString = "Super Bowl";
		ctx.font = "italic 12px black Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(textString, canvasWidth / 2, yPos);

		yPos += 15;
		lineY = yPos;
		xPos = 23 + 80;

		drawBracket(ctx, xPos, yPos, afcSuperBowlTeamLogo, afcSuperBowlTeamNumber, afcSuperBowlTeamIsWinner, false, afcSuperBowlTeamIsWinner);
		xPos += 90;
		drawBracket(ctx, xPos, yPos, nfcSuperBowlTeamLogo, nfcSuperBowlTeamNumber, nfcSuperBowlTeamIsWinner, true, nfcSuperBowlTeamIsWinner);

		ctx.beginPath(); // drawing vertical line
		ctx.moveTo(canvasWidth / 2 - 1, lineY);
		ctx.lineTo(canvasWidth / 2 - 1, lineY + 36);
		ctx.strokeStyle = "black"
		ctx.stroke(); // Render the path

		yPos += 65;
		ctx.globalAlpha = 1;

		textString = downloadImageUrl;

		ctx.font = "10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#666666";
		ctx.textAlign = "center";
		ctx.fillText(textString, canvasWidth / 2, yPos);

		return canvas;
	}

	function downloadImageByBlob(blob) {
		var objectURL = window.URL.createObjectURL(blob);

		var link = document.createElement("a");

		link.setAttribute("href", objectURL);
		if (brand == "pfn") {
			link.setAttribute("download", "PFN_PLAYOFF_" + Date.now());
		} else {
			link.setAttribute("download", "SK_PLAYOFF_" + Date.now());
		}

		document.body.appendChild(link);

		link.click();
		link.remove();
	};

	function shareImageByBlob(blob, section) {
		if (brand == "pfn") {
			let shareText;
			if (section) {
				shareText = "Share your thoughts on my predicted " + section + " for this season from the @‌PFN365 Playoff Predictor — then make yours with the #PFNPredictor: https://bit.ly/pfnpredictor";
			} else {
				shareText = "Share your thoughts on my predictions for this season from the @‌PFN365 Playoff Predictor — then make yours with the #PFNPredictor: https://bit.ly/pfnpredictor";
			}
			var file = new File([blob], "temp_image.png", { type: blob.type });
			navigator.share({
				text: shareText,
				files: [file],
			});
		} else {
			let shareText;
			if (section) {
				shareText = "Here's my predicted " + section + " from @‌Sportskeeda NFL Playoff Predictor. Give yourself a try with the #SKPredictor: https://bit.ly/sknflpredictor";
			} else {
				shareText = "Here's my predicted playoff picture from @‌Sportskeeda NFL Playoff Predictor. Give yourself a try with the #SKPredictor: https://bit.ly/sknflpredictor";
			}
			var file = new File([blob], "temp_image.png", { type: blob.type });
			navigator.share({
				text: shareText,
				files: [file],
			});
		}
	};

	function downloadPlayoff() {
		trackGAEventForPage("download_playoff");
		var downloadBtn = $(".predict-playoff-games-popup-container .download-btn-mds");
		if (downloadBtn) {
			addClass(downloadBtn, "btn-blinker");
		}

		var playoffContainer = $(".predict-playoff-games-popup-container");

		if (playoffContainer) {
			var playoffCanvas = preparePlayOffCanvas();
			var link = document.createElement('a');
			if (brand == "pfn") {
				link.download = "PFN_PLAYOFF_" + Date.now();
			} else {
				link.download = "SK_PLAYOFF_" + Date.now();
			}
			link.href = playoffCanvas.toDataURL()
			link.click();
		}

		if (downloadBtn) {
			removeClass(downloadBtn, "btn-blinker");
		}

	}

	function sharePlayoff() {
		trackGAEventForPage("share_playoff");
		var shareBtn = $(".predict-playoff-games-popup-container .share-btn-mds");
		if (shareBtn) {
			addClass(shareBtn, "btn-blinker");
		}
		var playoffContainer = $(".predict-playoff-games-popup-container");

		if (playoffContainer) {
			var canvas = preparePlayOffCanvas();
			canvas.toBlob(blob => {
				shareImageByBlob(blob);
			});
		}

		if (shareBtn) {
			removeClass(shareBtn, "btn-blinker");
		}

	}

	function prepareDivisionStandingsCanvas() {
		var cWidth = 400;
		var cHeight = 765 + getCustomSettingsCanvasExtraHeight();
		var canvas = generateStandingsCanvas(0, 15, cWidth, cHeight, 2, divisionData, "division");

		return canvas;
	}

	function prepareConferenceStandingsCanvas() {
		var cWidth = 400;
		var cHeight = 600 + getCustomSettingsCanvasExtraHeight();
		var canvas = generateStandingsCanvas(0, 15, cWidth, cHeight, 2, conferenceData, "conference");

		return canvas;
	}

	function prepareDraftOrderCanvas() {
		var cWidth = 400;
		var cHeight = 530 + getCustomSettingsCanvasExtraHeight();
		var canvas = generateDraftOrderCanvas(0, 15, cWidth, cHeight, 2);

		return canvas;
	}

	function drawDraftBlock(ctx, x, y, position, teamContainer) {
		if (position % 2 == 0) {
			ctx.fillStyle = "#F5F5F5"
		} else {
			ctx.fillStyle = "#FFFFFF"
		}
		ctx.globalAlpha = 1;
		ctx.fillRect(x, y, 200, 28);

		textString = position;
		if (brand == "pfn") {
			ctx.font = "400 12px Roboto,Open Sans,Helvetica,sans-serif"
		} else {
			ctx.font = "400 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif"
		}
		ctx.fillStyle = "#42526E";
		ctx.textAlign = "left";
		ctx.fillText(textString, x + 10, y + 18);

		var tradeIcon = teamContainer.querySelector(".trade-icon");

		if (tradeIcon) {
			ctx.globalAlpha = 0.5;
		}

		var teamLogo = teamContainer.querySelector(".standings-team-logo");
		if (teamLogo) {
			ctx.drawImage(teamLogo, x + 30, y + 4, 30, 20);
		}

		var teamName = teamContainer.querySelector(".standings-team-name");
		if (teamName) {
			textString = teamName.innerText;
			if (brand == "pfn") {
				ctx.font = "400 12px Roboto,Open Sans,Helvetica,sans-serif"
			} else {
				ctx.font = "400 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif"
			}
			ctx.fillStyle = "#42526E";
			ctx.textAlign = "left";
			ctx.fillText(textString, x + 70, y + 18);
		}

		if (tradeIcon) {
			ctx.globalAlpha = 1;
			ctx.drawImage(tradeIcon, x + 103, y + 4, 20, 20);
			var teamLogos = teamContainer.querySelectorAll(".standings-team-logo");
			var teamNames = teamContainer.querySelectorAll(".standings-team-name");
			var team2Logo = teamLogos[1];
			var team2Name = teamNames[1];
			if (team2Name) {
				textString = team2Name.innerText;
				if (brand == "pfn") {
					ctx.font = "400 12px Roboto,Open Sans,Helvetica,sans-serif"
				} else {
					ctx.font = "400 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif"
				}
				ctx.fillStyle = "#42526E";
				ctx.textAlign = "left";
				ctx.fillText(textString, x + 130, y + 18);
			}
			if (team2Logo) {
				ctx.drawImage(team2Logo, x + 160, y + 4, 30, 20);
			}

		}

	}

	function generateDraftOrderCanvas(baseX, baseY, canvasWidth, canvasHeight, scaleFactor) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");

		var width = canvasWidth;
		var height = canvasHeight;

		var dpr = scaleFactor || window.devicePixelRatio;

		canvas.width = width * dpr;
		canvas.height = height * dpr;

		ctx.scale(dpr, dpr);

		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var yPos = baseY;
		var headerHeight = baseY + 30;

		ctx.fillStyle = "rgb(0, 80, 160)";
		ctx.fillRect(0, 0, canvasWidth, headerHeight);

		var pfnLogo = document.querySelector(".table-pfn-logo");
		var skLogo = document.querySelector(".sk-logo");

		if (brand == "pfn") {
			ctx.drawImage(pfnLogo, 16, 11, 25, 25);
		} else {
			ctx.drawImage(skLogo, 16, 15, 135, 16);
		}

		var textString = "NFL Playoff Predictor";
		ctx.font = "600 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#fff";
		ctx.textAlign = "right";
		ctx.fillText(textString, canvasWidth - 20, yPos + 7);

		textString = "My Draft Order 2027";
		ctx.font = "400 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#fff";
		ctx.textAlign = "right";
		ctx.fillText(textString, canvasWidth - 20, yPos + 22);
		yPos += 30;
		yPos = drawCustomSettingsCanvasBanner(ctx, yPos, canvasWidth);
		ctx.beginPath(); // drawing vertical line
		ctx.moveTo(0, yPos);
		ctx.lineTo(canvasWidth, yPos);
		ctx.strokeStyle = "black"
		ctx.stroke(); // Render the path

		var standingTeamsContainer = document.querySelectorAll(".draft-order-table-container .standings-team-container-td");

		for (let i = 0; i < 16; i++) {
			drawDraftBlock(ctx, 0, yPos, i + 1, standingTeamsContainer[i]);
			yPos += 28;
		}

		yPos = baseY + 30 + getCustomSettingsCanvasExtraHeight();

		for (i = 16; i < 32; i++) {
			drawDraftBlock(ctx, 200, yPos, i + 1, standingTeamsContainer[i]);
			yPos += 28;
		}

		textString = downloadImageUrl;
		yPos += 20;
		ctx.font = "10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#666666";
		ctx.textAlign = "center";
		ctx.fillText(textString, 200, yPos);

		return canvas
	}

	function downloadDraftOrder() {
		trackGAEventForPage("download_draftOrder");
		var tableContainer = $(".draft-order-table-container");

		if (tableContainer) {
			var conferenceStandingsCanvas = prepareDraftOrderCanvas();
			var link = document.createElement('a');
			if (brand == "pfn") {
				link.download = "PFN_DRAFT_ORDER_" + Date.now();
			} else {
				link.download = "SK_DRAFT_ORDER_" + Date.now();
			}
			link.href = conferenceStandingsCanvas.toDataURL()
			link.click();
		}

	}

	function drawStandingsTeamRec(team) {
		let ctx = team.ctx;
		let textString = team.sequence;
		ctx.font = "400 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#42526E";
		ctx.textAlign = "center";
		ctx.fillText(textString, team.xPos + 14, team.yPos);

		let teamLogo = team.logo;
		ctx.drawImage(teamLogo, team.xPos + 34, team.yPos - 12, 30, 20);

		textString = team.shortName;
		ctx.fillStyle = "#42526E";
		ctx.textAlign = "left";
		ctx.fillText(textString, team.xPos + 74, team.yPos);

		textString = team.wins + " - " + team.losses;
		ctx.fillStyle = "#42526E";
		ctx.textAlign = "center";
		ctx.fillText(textString, team.xPos + 145, team.yPos);

		if (team.status) {
			textString = team.status;
			ctx.font = "400 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
			ctx.fillStyle = "#42526E";
			ctx.textAlign = "left";
			let leftDiff = team.xPos + 100;
			if (team.shortName.length === 2) {
				leftDiff = team.xPos + 90;
			}
			ctx.fillText(textString, leftDiff, team.yPos - 6);
		}
	}

	function drawStandingsCanvas(ctx, xPos, yPos, standingsData, headerText) {
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#E9E9E9";
		let boxHeight = 160;
		if (headerText === "AFC" || headerText === "NFC") {
			boxHeight = 515;
		}

		ctx.rect(xPos, yPos, 180, boxHeight);
		ctx.stroke();

		ctx.textAlign = "center";
		if (headerText.includes("AFC")) {
			ctx.fillStyle = "#CE1127";
		} else {
			ctx.fillStyle = "#003B74";
		}

		ctx.fillRect(xPos, yPos, 180, 18);

		let textString = headerText;
		ctx.font = "600 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#fff";
		ctx.fillText(textString, xPos + 93, yPos + 13);

		yPos += 17;

		ctx.fillStyle = "#f5f5f5";
		ctx.fillRect(xPos, yPos, 180, 18);

		textString = "#";
		ctx.font = "600 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#2d2d2d";
		ctx.fillText(textString, xPos + 14, yPos + 12);

		textString = "TEAM";
		ctx.font = "600 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#2d2d2d";
		ctx.fillText(textString, xPos + 68, yPos + 12);

		textString = "REC";
		ctx.font = "600 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#2d2d2d";
		ctx.fillText(textString, xPos + 145, yPos + 12);

		yPos += 35;
		for (let i = 0; i < standingsData.length; i++) {
			let selector = ".standings-team-logo." + standingsData[i].Team;
			let teamLogo = document.querySelector(selector);
			let team = {
				ctx,
				sequence: i + 1,
				logo: teamLogo,
				shortName: standingsData[i].Team,
				status: standingsData[i]["Playoff Status"],
				wins: standingsData[i].Wins,
				losses: standingsData[i].Losses,
				xPos,
				yPos,
			}

			drawStandingsTeamRec(team);
			yPos += 30;
		}
	}

	function generateStandingsCanvas(baseX, baseY, canvasWidth, canvasHeight, scaleFactor, standingsData, standingsType) {
		let canvas = document.createElement("canvas");
		let ctx = canvas.getContext("2d");

		let width = canvasWidth;
		let height = canvasHeight;

		let dpr = scaleFactor || window.devicePixelRatio;

		canvas.width = width * dpr;
		canvas.height = height * dpr;

		ctx.scale(dpr, dpr);

		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		let yPos = baseY;
		let headerHeight = baseY + 30;

		ctx.fillStyle = "rgb(0, 80, 160)";
		ctx.fillRect(0, 0, canvasWidth, headerHeight);

		let pfnLogo = document.querySelector(".table-pfn-logo");
		let skLogo = document.querySelector(".sk-logo");

		if (brand == "pfn") {
			ctx.drawImage(pfnLogo, 16, 9, 30, 30);
		} else {
			ctx.drawImage(skLogo, 16, 15, 135, 16);
		}

		let textString = "NFL Playoff Predictor";
		ctx.font = "600 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#fff";
		ctx.textAlign = "right";
		ctx.fillText(textString, canvasWidth - 20, yPos + 7);

		textString = "My Predicted Standings 2026";
		ctx.font = "400 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#fff";
		ctx.textAlign = "right";
		ctx.fillText(textString, canvasWidth - 20, yPos + 22);

		yPos += 30;
		yPos = drawCustomSettingsCanvasBanner(ctx, yPos, canvasWidth);
		ctx.beginPath();
		ctx.moveTo(0, yPos);
		ctx.lineTo(canvasWidth, yPos);
		ctx.strokeStyle = "#E2E2E2"
		ctx.stroke();

		yPos += 10;

		if (standingsType == "division") {
			drawStandingsCanvas(ctx, 14, yPos, standingsData["AFC E"], "AFC EAST");
			drawStandingsCanvas(ctx, 210, yPos, standingsData["NFC E"], "NFC EAST");
			yPos += 170;
			drawStandingsCanvas(ctx, 14, yPos, standingsData["AFC N"], "AFC NORTH");
			drawStandingsCanvas(ctx, 210, yPos, standingsData["NFC N"], "NFC NORTH");
			yPos += 170;
			drawStandingsCanvas(ctx, 14, yPos, standingsData["AFC S"], "AFC SOUTH");
			drawStandingsCanvas(ctx, 210, yPos, standingsData["NFC S"], "NFC SOUTH");
			yPos += 170;
			drawStandingsCanvas(ctx, 14, yPos, standingsData["AFC W"], "AFC WEST");
			drawStandingsCanvas(ctx, 210, yPos, standingsData["NFC W"], "NFC WEST");

			yPos += 160;
		} else if (standingsType == "conference") {
			drawStandingsCanvas(ctx, 14, yPos, standingsData["AFC"], "AFC");
			drawStandingsCanvas(ctx, 210, yPos, standingsData["NFC"], "NFC");

			yPos += 515;
		}

		textString = downloadImageUrl;
		yPos += 20;
		ctx.font = "10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
		ctx.fillStyle = "#666666";
		ctx.textAlign = "center";
		ctx.fillText(textString, 200, yPos);

		return canvas
	}

	function getVisibleView() {
		var desktop = document.querySelector('.pp-desktop-view');
		if (desktop && !hasClass(desktop, 'hidden')) return desktop;
		var mobile = document.querySelector('.pp-tablet-mobile-view');
		if (mobile && !hasClass(mobile, 'hidden')) return mobile;
		return document;
	}

	function downloadStandings() {
		trackGAEventForPage("download_standings");
		var activeView = getVisibleView();
		var divisionStandings = activeView.querySelector(".division-standings");
		var conferenceStandings = activeView.querySelector(".conference-standings");

		if (divisionStandings && !hasClass(divisionStandings, "hidden")) {
			var divisionStandingsCanvas = prepareDivisionStandingsCanvas();
			var link = document.createElement('a');
			if (brand == "pfn") {
				link.download = "PFN_DIVISION_STANDINGS_" + Date.now();
			} else {
				link.download = "SK_DIVISION_STANDINGS_" + Date.now();
			}
			link.href = divisionStandingsCanvas.toDataURL()
			link.click();
		}

		if (conferenceStandings && !hasClass(conferenceStandings, "hidden")) {
			var conferenceStandingsCanvas = prepareConferenceStandingsCanvas();
			var link = document.createElement('a');
			if (brand == "pfn") {
				link.download = "PFN_CONFERENCE_STANDINGS_" + Date.now();
			} else {
				link.download = "SK_CONFERENCE_STANDINGS_" + Date.now();
			}
			link.href = conferenceStandingsCanvas.toDataURL()
			link.click();
		}
	}

	function shareStandings() {
		trackGAEventForPage("share_standings");
		var activeView = getVisibleView();
		var divisionStandings = activeView.querySelector(".division-standings");
		var conferenceStandings = activeView.querySelector(".conference-standings");
		var shareBtn = $(".standings-section-header-text-container .share-btn");
		if (shareBtn) {
			addClass(shareBtn, "btn-blinker");
		}

		if (divisionStandings && !hasClass(divisionStandings, "hidden")) {
			var canvas = prepareDivisionStandingsCanvas();
			canvas.toBlob(blob => {
				shareImageByBlob(blob, "standings");
			});
		}

		if (conferenceStandings && !hasClass(conferenceStandings, "hidden")) {
			var canvas = prepareConferenceStandingsCanvas();
			canvas.toBlob(blob => {
				shareImageByBlob(blob, "standings");
			});
		}

		if (shareBtn) {
			removeClass(shareBtn, "btn-blinker");
		}

	}

	function shareDraftOrder() {
		trackGAEventForPage("share_draftOrder");
		var shareBtn = $(".draft-order-section-wrapper .share-btn-mds");
		if (shareBtn) {
			addClass(shareBtn, "btn-blinker");
		}
		var tableContainer = $(".draft-order-table-container");

		if (tableContainer) {
			var canvas = prepareDraftOrderCanvas();
			canvas.toBlob(blob => {
				shareImageByBlob(blob, "draft order");
			});
		}

		if (shareBtn) {
			removeClass(shareBtn, "btn-blinker");
		}
	}

	function showTooltip() {
		const accessedNum = localStorage.getItem("playoff-predictor__accessed-num");
		const setLocalStorage = (prevValue) => {
			const num = prevValue ? parseInt(prevValue) + 1 : 2;
			localStorage.setItem("playoff-predictor__accessed-num", num);
		}
		if (!accessedNum || parseInt(accessedNum) <= 2) {
			queryEachView(".simulation-ctas-container .tooltip").forEach(function(el) {
				el.classList.remove("hidden");
			});
			setTimeout(() => {
				queryEachView(".simulation-ctas-container .tooltip").forEach(function(el) {
					el.classList.add("hidden");
				});
			}, 7000);
		}
		setLocalStorage(accessedNum);
	}

	function closeTooltip(event) {
		if (!event.target.closest(".tooltip")) {
			queryEachView(".simulation-ctas-container .tooltip").forEach(function(el) {
				el.classList.add("hidden");
			});
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
						showPlayoffsWinnerAnimation(playoffMatchesData["Super Bowl"]["winner"]);
						removeSimulationOverLays();
						disabledSimulateCTA(false);
						var playoffSimBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-sim-btn");
						var playoffPauseBtn = document.querySelector(".predict-playoff-games-popup-container .playoff-games-popup-footer .playoff-games-pause-btn");
						if (playoffSimBtn && playoffPauseBtn) {
							playoffSimBtn.classList.remove("hidden");
							playoffSimBtn.setAttribute("disabled", "");
							playoffPauseBtn.classList.add("hidden");
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

		var conferenceNames = ["AFC", "NFC"];
		if (showPopup) showPredictPlayoffGamesPopup();

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

		// Re-evaluate main CTA button states (e.g. enable Reset if regular season has predictions)
		updateSimulationButtonDisableStatus();
	}

	function init() {
		showTooltip();
		setWeekCarousel();
		document.addEventListener("click", closeTooltip);

		// Shared bindings — attach to both views
		queryEachView(".simulation-ctas-container .simulate-button").forEach(function(el) {
			el.addEventListener("click", showSimulatePopUp);
		});
		queryEachView(".simulation-ctas-container .delete-button").forEach(function(el) {
			el.addEventListener("click", showDeletePopUp);
		});
		queryEachView(".simulation-ctas-container .pause-button").forEach(function(el) {
			el.addEventListener("click", pauseSimulation);
		});
		queryEachView(".simulation-ctas-container .power-rank-button").forEach(function(el) {
			el.addEventListener("click", showPowerRankPopUp);
		});
		queryEachView(".simulation-ctas-container .settings-button").forEach(function(el) {
			el.addEventListener("click", showSettingsPopUp);
		});

		// Mobile-only toggle buttons (with null guards)
		queryEachView(".simulator-standings-page-toggle-wrapper .standings-page-toggle-btn").forEach(function(el) {
			el.addEventListener("click", showStandingsPage);
		});
		queryEachView(".simulator-standings-page-toggle-wrapper .simulator-page-toggle-btn").forEach(function(el) {
			el.addEventListener("click", showSimulatorPage);
		});
		queryEachView(".simulator-standings-page-toggle-wrapper .draft-order-page-toggle-btn").forEach(function(el) {
			el.addEventListener("click", showDraftOrderPage);
		});

		queryEachView(".standings-page-toggle-wrapper .conference-toggle-btn").forEach(function(el) {
			el.addEventListener("click", showConferenceStandingsPage);
		});
		queryEachView(".standings-page-toggle-wrapper .division-toggle-btn").forEach(function(el) {
			el.addEventListener("click", showDivisionStandingsPage);
		});

		queryAllViews(".participants-tab-btn").forEach(function(el) {
			el.addEventListener("click", switchToParticipantsTab);
		});
		queryAllViews(".bracket-tab-btn").forEach(function(el) {
			el.addEventListener("click", function() {
				predictPlayoffGames();
			});
		});

		queryAllViews(".afc-tab-btn").forEach(function(el) {
			el.addEventListener("click", showAFCStandings);
		});
		queryAllViews(".nfc-tab-btn").forEach(function(el) {
			el.addEventListener("click", showNFCStandings);
		});

		$(".overlay").addEventListener("click", closeAllPopUps);

		// Desktop-only bindings (with null guards)
		queryEachView(".playoff-section-header-scroll-to-standings-text").forEach(function(el) {
			el.addEventListener("click", scrollStandingPageInView);
		});

		queryEachView(".standings-section-toggle-btn").forEach(function(el) {
			el.addEventListener("click", showStandingsSection);
		});

		queryEachView(".draft-order-section-toggle-btn").forEach(function(el) {
			el.addEventListener("click", showDraftOrderSection);
		});

		queryEachView(".draft-order-download").forEach(function(el) {
			el.addEventListener("click", downloadDraftOrder);
		});

		queryEachView(".draft-order-share").forEach(function(el) {
			el.addEventListener("click", shareDraftOrder);
			if (navigator && navigator.share) {
				removeClass(el, "hidden");
			}
		});

		queryEachView(".standings-download").forEach(function(el) {
			el.addEventListener("click", downloadStandings);
		});

		queryEachView(".standings-share").forEach(function(el) {
			el.addEventListener("click", shareStandings);
			if (navigator && navigator.share) {
				removeClass(el, "hidden");
			}
		});

		var brandLogo = document.createElement("img");
		addClass(brandLogo, "hidden");
		if (brand == "pfn") {
			addClass(brandLogo, "pfn-logo");
			brandLogo.setAttribute("src", STATIC_URL + "/skm/assets/playoff-predictor/pfn-logo.svg");
		} else {
			addClass(brandLogo, "sk-logo");
			brandLogo.setAttribute("src", STATIC_URL + "/skm/assets/playoff-predictor/sk-logo.svg");
		}

		brandLogo.setAttribute("width", "63px");
		brandLogo.setAttribute("height", "20px");
		brandLogo.setAttribute("alt", "Brand Logo");
		brandLogo.setAttribute("crossorigin", "anonymous");
		document.body.appendChild(brandLogo);
		trackReturningUsers('Playoff Predictor', (userAdoptionTypes) => {
			trackGAEventForPage("user_adoption", userAdoptionTypes);
		});

		if (typeof generateRSSFeedForPFN !== 'undefined' && generateRSSFeedForPFN) {
			generateRSSFeedForPFN(FEED_SOURCE_PATH, IS_DESKTOP, "Latest NFL News & Analysis").then(feedsContainer => {
				if (feedsContainer) {
					const glossarySection = document.querySelector('.nfl-standings-glossary-section');
					if (glossarySection) {
						glossarySection.insertAdjacentElement('afterend', feedsContainer);
					}
				}
			}).catch(err => {
				console.error('Error generating RSS feed:', err);
			});
		}
	}

	init();
})();
