{if $is_desktop}
  {include file="templates/utils/carousal.tpl"}
{/if}
<script>
  var trackGAEventForPage = function(eventName, eventParams) {
    eventParams = eventParams || {};
    trackGAEvent(eventName, {
      ...eventParams,
      "tool": "lineup_optimizer"
    });
  };

  var lineup = (function() {
    const dfsDataUrl = "{$smarty.const.STATIC_URL}/{$data_source_path}".replace("staticd.pr", "staticj.pr");

    const lineupUrl = "https://lineup-optimizer.sportskeeda.com/";
    const desktop = "{$is_desktop}";
    const tool = "{$tool}";

    if ("{$send_page_view_event}" == true) {
    (function() {
      trackGAEventForPage("page_view");
    })();
  }

  trackReturningUsers('DFS Lineup Optimizer', (userAdoptionTypes) => {
    trackGAEventForPage("user_adoption", userAdoptionTypes);
  });

  const teamLogoPath = "{$team_logo_path}";
  const logoCacheBuster = "{$logo_cache_buster}";
  var playerPositions = ["QB", "RB", "WR", "TE", "DST"];
  var playersList = [];
  var showdownPlayersList = {
    DK: [],
    FD: []
  };

  var DKSalary = 50000;
  var FDSalary = 60000;
  const slatesProviders = ["DK", "FD"];
  var state = {
    buildCount: 0,
    lineupCount: 1,
    currentProvider: "DK",
    currentSlate: "DK Thu-Mon Classic",
    currentMatchType: "classic",
    excludedTeams: [],
    currentTeams: [],
    oppositionTeams: {},
    lockedPlayers: [],
    removedPlayers: [],
    captainPlayer: null,
    captainPlayerId: null, // CPT ID for DK Showdown (different from FLEX ID)
    lineups: [],
    fetchCount: 0,
    lastLineupCount: 0,
    refreshIndex: "",
    lockedPositionConstraint: {},
    homeTeams: [],
    roadTeams: [],
    autoSubstitutePlayers: [],
    selectionsChanged: false,
    substitutedPlayer: "",
  }

  var slatesList = {
    DK: {},
    FD: {},
  };

  var showdownSlatesList = [];

  function createSlatesList(headers) {
    for (let i = 9; i < headers.length; i++) {
      slatesProviders.forEach(provider => {
        if (headers[i].includes(provider)) {
          slatesList[provider][headers[i]] = [];
        }
      })
    }
  }

  function segregateSlatesData(slates) {
    var headers = slates[0];
    createSlatesList(headers);
    for (var i = 1; i < slates.length; i++) {
      for (let j = 9; j < headers.length; j++) {
        if (slates[i][j] === "1") {
          slatesProviders.forEach(provider => {
            if (headers[j].includes(provider)) {
              let slate = {};
              for (let k = 0; k < headers.length; k++) {
                slate[headers[k]] = slates[i][k];
              }
              slatesList[provider][headers[j]].push(slate);
            }
          });
        }
      }
    }

    populateSlatesDropdown("DK");
  }

  function segregateSlatesData(slatesData) {
    if (!slatesData || slatesData.length < 3) return;

    showdownSlatesList = [];

    var headers = slatesData[0];
    var subHeaders = slatesData[1];
    var dataStartRow = 2;

    var showdownColumns = {
      DK: [],
      FD: []
    };

    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      if (header && typeof header === 'string') {
        var trimmedHeader = header.trim();
        if (trimmedHeader.indexOf('DK Showdown') === 0) {
          var matchLabel = subHeaders[i] || '';
          showdownColumns.DK.push({ index: i, name: trimmedHeader, matchLabel: matchLabel });
        } else if (trimmedHeader.indexOf('FD Showdown') === 0) {
          var matchLabel = subHeaders[i] || '';
          showdownColumns.FD.push({ index: i, name: trimmedHeader, matchLabel: matchLabel });
        }
      }
    }

    function findAllRowsWithOne(colIndex, data) {
      var results = [];
      for (var i = dataStartRow; i < data.length; i++) {
        var row = data[i];
        if (!row || row.length <= colIndex) continue;
        var val = row[colIndex];
        if (val === 1 || val === '1') {
          results.push({
            home: row[3] || '',
            road: row[4] || '',
            date: row[1] || '',
            time: row[2] || ''
          });
        }
      }
      return results;
    }

    function parseMatchFromLabel(label) {
      if (!label || label.indexOf('@') === -1) return null;
      var cleanLabel = label.replace(' Showdown', '').replace(' Sho', '').trim();
      var parts = cleanLabel.split('@');
      if (parts.length === 2) {
        return {
          road: parts[0].trim(),
          home: parts[1].trim()
        };
      }
      return null;
    }

    showdownColumns.DK.forEach(function(col) {
      var rowsWithOne = findAllRowsWithOne(col.index, slatesData);
      if (rowsWithOne.length === 0) return;

      var matchInfo = parseMatchFromLabel(col.matchLabel);
      if (!matchInfo) return;

      var matchName = matchInfo.road + ' @ ' + matchInfo.home;

      var matches = rowsWithOne.map(function(rowData) {
        return {
          home: matchInfo.home,
          road: matchInfo.road,
          date: rowData.date,
          time: rowData.time,
          matchName: matchName
        };
      });

      showdownSlatesList.push({
        name: col.name,
        match: matchName,
        provider: 'DK',
        matches: matches
      });
    });

    showdownColumns.FD.forEach(function(col) {
      var rowsWithOne = findAllRowsWithOne(col.index, slatesData);
      if (rowsWithOne.length === 0) return;

      var matchInfo = parseMatchFromLabel(col.matchLabel);
      if (!matchInfo) return;

      var matchName = matchInfo.road + ' @ ' + matchInfo.home;

      var matches = rowsWithOne.map(function(rowData) {
        return {
          home: matchInfo.home,
          road: matchInfo.road,
          date: rowData.date,
          time: rowData.time,
          matchName: matchName
        };
      });

      showdownSlatesList.push({
        name: col.name,
        match: matchName,
        provider: 'FD',
        matches: matches
      });
    });

    console.log('Final showdownSlatesList:', showdownSlatesList);
  }

  function disableBuildOptions(check) {
    var selectMatchText = $('.filters-holder .exclude-match-info');
    var noSlateText = $('.filters-holder .no-slate-uploaded-info');

    var filterContainerBuildBtn = $(".filters-container .build-lineups");
    var lineupsContainerBuildBtn = $(".lineups-container .build-lineups-bottom");
    var stickyBottomBuildBtn = $(".lineup-optimizer-container .build-lineups");

    if (check) {
      if (selectMatchText && !hasClass(selectMatchText, "hidden")) {
        addClass(selectMatchText, "hidden");
      }

      if (noSlateText && hasClass(noSlateText, "hidden")) {
        removeClass(noSlateText, "hidden");
      }

      if (filterContainerBuildBtn && !hasClass(filterContainerBuildBtn, "disabled-build-btn")) {
        addClass(filterContainerBuildBtn, "disabled-build-btn");
      }

      if (lineupsContainerBuildBtn && !hasClass(lineupsContainerBuildBtn, "disabled-build-btn")) {
        addClass(lineupsContainerBuildBtn, "disabled-build-btn");
      }

      if (stickyBottomBuildBtn && !hasClass(stickyBottomBuildBtn, "disabled-build-btn")) {
        addClass(stickyBottomBuildBtn, "disabled-build-btn");
      }
    } else {
      if (selectMatchText && hasClass(selectMatchText, "hidden")) {
        removeClass(selectMatchText, "hidden");
      }

      if (noSlateText && !hasClass(noSlateText, "hidden")) {
        addClass(noSlateText, "hidden");
      }

      if (filterContainerBuildBtn && hasClass(filterContainerBuildBtn, "disabled-build-btn")) {
        removeClass(filterContainerBuildBtn, "disabled-build-btn");
      }

      if (lineupsContainerBuildBtn && hasClass(lineupsContainerBuildBtn, "disabled-build-btn")) {
        removeClass(lineupsContainerBuildBtn, "disabled-build-btn");
      }

      if (stickyBottomBuildBtn && hasClass(stickyBottomBuildBtn, "disabled-build-btn")) {
        removeClass(stickyBottomBuildBtn, "disabled-build-btn");
      }
    }
  }

  function populateSlatesDropdown(provider) {
    if (slatesList && slatesList[provider]) {
      var dkDropdown = $(".slates-filter .DK-slates-selection");
      var fdDropdown = $(".slates-filter .FD-slates-selection");
      var slateSelect;
      if (provider == "DK") {
        addClass(fdDropdown, "hidden");
        removeClass(dkDropdown, "hidden");
        slateSelect = dkDropdown;
      } else if (provider == "FD") {
        removeClass(fdDropdown, "hidden");
        addClass(dkDropdown, "hidden");
        slateSelect = fdDropdown;
      }

      slateSelect.innerHTML = "";
      var firstSlate;
      for (var property in slatesList[provider]) {
        var slateData = slatesList[provider][property];
        var matches = slateData ? slateData.length : 0;
        if (matches > 0) {
          if (!firstSlate) {
            firstSlate = property;
          }
          var option = document.createElement("option");
          option.setAttribute("value", property);
          option.innerHTML = property.replace(state.currentProvider, "") + " (" + matches + " matches)";
          slateSelect.appendChild(option);
        }
      }

      if (!firstSlate) {
        disableBuildOptions(true);
      } else {
        disableBuildOptions(false);
      }

      state.currentSlate = firstSlate;

      if (provider == "DK") {
        if (slatesList["DK"] && slatesList["DK"]["DK Sat-Sun"] && slatesList["DK"]["DK Sat-Sun"].length > 0) {
          state.currentSlate = "DK Sat-Sun";
          var slate = $('#dk-slates option[value="DK Sat-Sun"]');
          if (slate) {
            document.getElementById("dk-slates").value = "DK Sat-Sun";
          }
        }
      } else if (provider == "FD") {
        if (slatesList["FD"] && slatesList["FD"]["FD Sat-Sun"] && slatesList["FD"]["FD Sat-Sun"].length > 0) {
          state.currentSlate = "FD Sat-Sun";
          var slate = $('#fd-slates option[value="FD Sat-Sun"]');
          if (slate) {
            document.getElementById("fd-slates").value = "FD Sat-Sun";
          }
        }
      }

      var slatesMatchContainer = $(".matches-container .matches-holder");
      if (slatesMatchContainer && slatesMatchContainer.children.length == 0) {
        fillAllSlatesData();
        fillShowdownMatchesData();
      }

      showSlateMatches();
    }
  }

  function fillAllSlatesData() {
    var matchesListHolder = $(".matches-container .matches-holder");
    for (var provider in slatesList) {
      for (var slate in slatesList[provider]) {
        slatesData = slatesList[provider][slate];
        for (var i = 0; i < slatesData.length; i++) {
          var matchHolder = document.createElement("div");
          matchHolder.dataset.slatename = slate;
          matchHolder.dataset.provider = slate.slice(0, 2);
          matchHolder.dataset.home = slatesData[i].Home;
          matchHolder.dataset.road = slatesData[i].Road;
          addClass(matchHolder, "match-holder");
          addClass(matchHolder, "hidden");

          var matchTimeHolder = document.createElement("span");
          addClass(matchTimeHolder, "match-time-holder");
          var time = slatesData[i]["Time (UTC)"];
          if (time[0] == "0" || time[1] == ":") {
            time = "0" + time;
          }
          var dateTime = slatesData[i]["Date"] + "T" + time + "Z";
          dateTime = new Date(dateTime);
          var day = getShortDayNames()[dateTime.getDay()];
          var hours = dateTime.getHours();
          var minutes = dateTime.getMinutes();
          var formattedMinutes = String(minutes).padStart(2, '0');
          if (hours > 12) {
            hours = hours - 12;
            if (minutes > 0) {
              hours = hours + ":" + formattedMinutes + " PM";
            } else {
              hours = hours + " PM";
            }
          } else if (hours == 12) {
            if (minutes > 0) {
              hours = hours + ":" + formattedMinutes + " PM";
            } else {
              hours = hours + " PM";
            }
          } else if (hours == 0) {
            hours = 12;
            if (minutes > 0) {
              hours = hours + ":" + formattedMinutes + " AM";
            } else {
              hours = hours + " PM";
            }
          } else {
            if (minutes > 0) {
              hours = hours + ":" + formattedMinutes + " AM";
            } else {
              hours = hours + " PM";
            }
          }

          matchTimeHolder.innerHTML = day + ", " + hours;
          matchHolder.appendChild(matchTimeHolder);

          var homeTeamHolder = document.createElement("div");
          homeTeamHolder.dataset.team = slatesData[i]["Home"];
          homeTeamHolder.addEventListener("click", addHideTeamToRemovedList);
          addClass(homeTeamHolder, "team-holder");
          var homeTeamNameHolder = document.createElement("span");
          addClass(homeTeamNameHolder, "team-name-holder");
          homeTeamNameHolder.innerHTML = slatesData[i]["Home"];
          homeTeamHolder.appendChild(homeTeamNameHolder);

          homeTeamLogoHolder = document.createElement("img");
          homeTeamLogoHolder.setAttribute("src", "{$smarty.const.STATIC_URL}" + teamLogoPath + slatesData[i]["Home"] + ".png" + logoCacheBuster);
          homeTeamLogoHolder.setAttribute("alt", slatesData[i]["Home"]);
          homeTeamLogoHolder.setAttribute("width", 33);
          homeTeamLogoHolder.setAttribute("height", 22);
          homeTeamHolder.appendChild(homeTeamLogoHolder);
          matchHolder.appendChild(homeTeamHolder);

          var roadTeamHolder = document.createElement("div");
          roadTeamHolder.dataset.team = slatesData[i]["Road"];
          roadTeamHolder.addEventListener("click", addHideTeamToRemovedList);
          addClass(roadTeamHolder, "team-holder");
          var roadTeamNameHolder = document.createElement("span");
          addClass(roadTeamNameHolder, "team-name-holder");
          roadTeamNameHolder.innerHTML = slatesData[i]["Road"];
          roadTeamHolder.appendChild(roadTeamNameHolder);

          roadTeamLogoHolder = document.createElement("img");
          roadTeamLogoHolder.setAttribute("src", "{$smarty.const.STATIC_URL}" + teamLogoPath + slatesData[i]["Road"] + ".png" + logoCacheBuster);
          roadTeamLogoHolder.setAttribute("alt", slatesData[i]["Road"]);
          roadTeamLogoHolder.setAttribute("width", 33);
          roadTeamLogoHolder.setAttribute("height", 22);
          roadTeamHolder.appendChild(roadTeamLogoHolder);
          matchHolder.appendChild(roadTeamHolder);

          matchesListHolder.appendChild(matchHolder);
        }
      }
    }
  }

  function fillShowdownMatchesData() {
    var matchesListHolder = $(".matches-container .matches-holder");
    if (!matchesListHolder) return;

    // Add showdown match cards
    showdownSlatesList.forEach(function(slate) {
      if (slate.matches && slate.matches.length > 0) {
        slate.matches.forEach(function(matchData) {
          var matchHolder = document.createElement("div");
          matchHolder.dataset.slatename = slate.name;
          matchHolder.dataset.provider = slate.provider;
          matchHolder.dataset.home = matchData.home;
          matchHolder.dataset.road = matchData.road;
          matchHolder.dataset.matchtype = "showdown";
          addClass(matchHolder, "match-holder");
          addClass(matchHolder, "showdown-match");
          addClass(matchHolder, "hidden");

          var matchTimeHolder = document.createElement("span");
          addClass(matchTimeHolder, "match-time-holder");
          var time = matchData.time || "00:00:00";
          if (time[0] == "0" || time[1] == ":") {
            time = "0" + time;
          }
          var dateTime = matchData.date + "T" + time + "Z";
          dateTime = new Date(dateTime);
          var day = getShortDayNames()[dateTime.getDay()];
          var hours = dateTime.getHours();
          var minutes = dateTime.getMinutes();
          var formattedMinutes = String(minutes).padStart(2, '0');
          if (hours > 12) {
            hours = hours - 12;
            if (minutes > 0) {
              hours = hours + ":" + formattedMinutes + " PM";
            } else {
              hours = hours + " PM";
            }
          } else if (hours == 12) {
            if (minutes > 0) {
              hours = hours + ":" + formattedMinutes + " PM";
            } else {
              hours = hours + " PM";
            }
          } else if (hours == 0) {
            hours = 12;
            if (minutes > 0) {
              hours = hours + ":" + formattedMinutes + " AM";
            } else {
              hours = hours + " PM";
            }
          } else {
            if (minutes > 0) {
              hours = hours + ":" + formattedMinutes + " AM";
            } else {
              hours = hours + " PM";
            }
          }

          matchTimeHolder.innerHTML = day + ", " + hours;
          matchHolder.appendChild(matchTimeHolder);

          var homeTeamHolder = document.createElement("div");
          homeTeamHolder.dataset.team = matchData.home;
          addClass(homeTeamHolder, "team-holder");
          addClass(homeTeamHolder, "showdown-team");
          var homeTeamNameHolder = document.createElement("span");
          addClass(homeTeamNameHolder, "team-name-holder");
          homeTeamNameHolder.innerHTML = matchData.home;
          homeTeamHolder.appendChild(homeTeamNameHolder);

          var homeTeamLogoHolder = document.createElement("img");
          homeTeamLogoHolder.setAttribute("src", "{$smarty.const.STATIC_URL}" + teamLogoPath + matchData.home + ".png" + logoCacheBuster);
          homeTeamLogoHolder.setAttribute("alt", matchData.home);
          homeTeamLogoHolder.setAttribute("width", 33);
          homeTeamLogoHolder.setAttribute("height", 22);
          homeTeamHolder.appendChild(homeTeamLogoHolder);
          matchHolder.appendChild(homeTeamHolder);

          var roadTeamHolder = document.createElement("div");
          roadTeamHolder.dataset.team = matchData.road;
          addClass(roadTeamHolder, "team-holder");
          addClass(roadTeamHolder, "showdown-team");
          var roadTeamNameHolder = document.createElement("span");
          addClass(roadTeamNameHolder, "team-name-holder");
          roadTeamNameHolder.innerHTML = matchData.road;
          roadTeamHolder.appendChild(roadTeamNameHolder);

          var roadTeamLogoHolder = document.createElement("img");
          roadTeamLogoHolder.setAttribute("src", "{$smarty.const.STATIC_URL}" + teamLogoPath + matchData.road + ".png" + logoCacheBuster);
          roadTeamLogoHolder.setAttribute("alt", matchData.road);
          roadTeamLogoHolder.setAttribute("width", 33);
          roadTeamLogoHolder.setAttribute("height", 22);
          roadTeamHolder.appendChild(roadTeamLogoHolder);
          matchHolder.appendChild(roadTeamHolder);

          matchesListHolder.appendChild(matchHolder);
        });
      }
    });
  }

  function showShowdownMatches(slateName, provider) {
    var matchesListHolder = $(".matches-container .matches-holder");
    if (!matchesListHolder) return;

    // Hide all matches first
    var allMatches = matchesListHolder.children;
    for (var i = 0; i < allMatches.length; i++) {
      addClass(allMatches[i], "hidden");
    }

    // Show only matches for the selected showdown slate and set opposition teams
    for (var i = 0; i < allMatches.length; i++) {
      var match = allMatches[i];
      if (match.dataset.slatename === slateName &&
          match.dataset.provider === provider &&
          match.dataset.matchtype === "showdown") {
        removeClass(match, "hidden");

        // Set opposition teams for showdown
        var homeTeam = match.dataset.home;
        var roadTeam = match.dataset.road;
        state.oppositionTeams[homeTeam] = roadTeam;
        state.oppositionTeams[roadTeam] = homeTeam;
        state.homeTeams = [homeTeam];
        state.roadTeams = [roadTeam];
      }
    }

    matchesListHolder.scrollTo({
      behavior: "smooth",
      top: 0,
      left: 0
    });
  }

  function addHideTeamToRemovedList(e) {
    var teamHolder = e.target.closest(".team-holder");
    if (teamHolder) {
      var userTeam = teamHolder.dataset.team;
      if (teamHolder.dataset.disabled !== "true") {
        trackGAEventForPage("team_deselected", {
          "item_name": userTeam,
          "build_count": state.buildCount,
        });

        teamHolder.dataset.disabled = "true";
        state.excludedTeams.push(userTeam);
        teamHolder.style.opacity = "0.4"
        teamHolder.disabled = true;

        var index = state.currentTeams.findIndex(function(team) {
          return team === userTeam;
        })

        state.currentTeams.splice(index, 1);
      } else {
        trackGAEventForPage("team_selected", {
          "item_name": userTeam,
          "build_count": state.buildCount,
        });

        teamHolder.dataset.disabled = "false";
        state.currentTeams.push(userTeam);
        var index = state.excludedTeams.findIndex(function(team) {
          return team === userTeam;
        });

        state.excludedTeams.splice(index, 1);
        teamHolder.style.opacity = "1"
        teamHolder.disabled = false;
      }

      if (state.currentTeams.length < 2) {
        var buildBtn = $(".build-lineups");
        var buildBottomBtn = $(".build-lineups-bottom");
        if (buildBottomBtn) {
          buildBottomBtn.disabled = true;
          buildBottomBtn.style.opacity = "0.4";
        }
        if (buildBtn) {
          buildBtn.disabled = true;
          buildBtn.style.opacity = "0.4";
        }
      }

      hideUtilityContainer();
      setTimeout(function() {
        fillPlayersTableData(state.currentProvider);
      }, 1);
    }
  }

  function showSlateMatches(e) {
    // If in showdown mode, use showShowdownMatches instead
    if (state.currentMatchType === "showdown") {
      showShowdownMatches(state.currentSlate, state.currentProvider);
      return;
    }

    state.excludedTeams = [];
    state.currentTeams = [];
    state.homeTeams = [];
    state.roadTeams = [];
    var allSlatesTeams = $all(".matches-holder .team-holder");
    if (allSlatesTeams) {
      Array.from(allSlatesTeams).forEach(function(team) {
        team.dataset.disabled = false;
        team.disabled = false;
        team.style.opacity = 1;
      });
    }

    var provider = state.currentProvider;
    var slate;
    if (!e) {
      slate = state.currentSlate;
    } else {
      state.currentSlate = e.target.value;
      slate = e.target.value;
      trackGAEventForPage("slate_dropdown", {
        "item_name": slate,
        "build_count": state.buildCount,
      });
    }

    var slatesData = slatesList[provider][slate];

    var matchesListHolder = $(".matches-container .matches-holder");

    if (matchesListHolder) {
      var matches = matchesListHolder.children;
      for (var i = 0; i < matches.length; i++) {
        // Only show classic matches (not showdown) that match the slate and provider
        var isShowdownMatch = matches[i].dataset.matchtype === "showdown";
        if (!isShowdownMatch && matches[i].dataset.slatename === slate && matches[i].dataset.provider === state.currentProvider) {
          removeClass(matches[i], "hidden");
          var dataset = matches[i].dataset;
          state.currentTeams.push(dataset.home);
          state.homeTeams.push(dataset.home);
          state.currentTeams.push(dataset.road);
          state.roadTeams.push(dataset.road);

          state.oppositionTeams[dataset.home] = dataset.road;
          state.oppositionTeams[dataset.road] = dataset.home;
        } else {
          addClass(matches[i], "hidden");
        }
      }
    }

    matchesListHolder.scrollTo({
      behavior: "smooth",
      top: 0,
      left: 0
    });
    state.currentTeams = removeDuplicatesTeams(state.currentTeams);

    var container = $(".matches-container .matches-holder");
    var leftScrollButton = $(".matches-container .left-scroll-button");
    var rightScrollButton = $(".matches-container .right-scroll-button");
    if (container && leftScrollButton && rightScrollButton) {
      var leftScrollEvent = function() {
        trackGAEventForPage("team_scroll", {
          "scroll": "left",
        });
      }

      var rightScrollEvent = function() {
        trackGAEventForPage("team_scroll", {
          "scroll": "right",
        });
      }

      initListScroll(container, leftScrollButton, rightScrollButton, leftScrollEvent, rightScrollEvent);
    }

    if (e) {
      fillPlayersTableData(provider);
    }
  }

  function removeDuplicatesTeams(arr) {
    return arr.filter(function(item, index) {
      return arr.indexOf(item) === index
    });
  }

  function segregatePlayersData(playersData) {
    var headers = playersData[0];
    var playerPositions = ["QB", "RB", "WR", "TE", "DST"];
    for (var i = 1; i < playersData.length; i++) {
      var position = playersData[i][1];
      if (!playerPositions.includes(position)) continue;
      var player = {};
      for (var j = 0; j < headers.length; j++) {
        player[headers[j]] = playersData[i][j];
      }
      playersList.push(player);
    }
  }

  function segregateShowdownPlayersData(playersData, provider) {
    showdownPlayersList[provider] = [];

    if (!playersData || playersData.length < 3) return;

    // Data structure:
    // Row 0: Slate names (e.g., "FD Showdown 1", "", "LAR @ CAR", ...) - multiple slates side by side
    // Row 1: Headers (ID, Position, Name, Salary, MVP Salary, Team, ...)
    // Row 2+: Player data
    //
    // DK Showdown: Each player appears twice (CPT row + FLEX row) with single FPTS/Salary columns
    // FD Showdown: Each player appears once with STD FPts, MVP FPts, Salary, MVP Salary columns

    var slateInfoRow = playersData[0];
    var headersRow = playersData[1];

    // Find all slate sections by looking for slate names in row 0
    var slateSections = [];

    for (var col = 0; col < slateInfoRow.length; col++) {
      var cellValue = slateInfoRow[col];
      if (cellValue && typeof cellValue === 'string' && cellValue.includes('Showdown')) {
        // Find the match info (usually a few columns after, like "LAR @ CAR")
        var matchInfo = "";
        for (var m = col + 1; m < Math.min(col + 5, slateInfoRow.length); m++) {
          if (slateInfoRow[m] && typeof slateInfoRow[m] === 'string' && slateInfoRow[m].includes('@')) {
            matchInfo = slateInfoRow[m];
            break;
          }
        }
        slateSections.push({
          name: cellValue,
          match: matchInfo,
          startCol: col
        });
      }
    }

    // If no slate sections found, try using first cell as slate name
    if (slateSections.length === 0 && slateInfoRow[0]) {
      slateSections.push({
        name: slateInfoRow[0] || (provider + " Showdown"),
        match: "",
        startCol: 0
      });
    }

    // Get the base headers from row 1 (first section)
    var baseHeaders = [];
    for (var h = 0; h < headersRow.length; h++) {
      var headerVal = headersRow[h];
      if (headerVal && headerVal !== "") {
        baseHeaders.push(headerVal);
      } else {
        // Stop at first empty header (end of first section)
        if (baseHeaders.length > 0) break;
      }
    }

    var colsPerSlate = baseHeaders.length;

    // Calculate end column for each slate section
    for (var s = 0; s < slateSections.length; s++) {
      if (s < slateSections.length - 1) {
        slateSections[s].endCol = slateSections[s + 1].startCol - 1;
      } else {
        slateSections[s].endCol = slateInfoRow.length - 1;
      }
    }

    // For DK, we need to collect all rows first, then merge CPT and FLEX rows
    var allPlayersRaw = [];

    // Process each slate section
    for (var s = 0; s < slateSections.length; s++) {
      var slate = slateSections[s];
      var startCol = slate.startCol;

      // Note: Slate list is now populated from slates sheet via segregateSlatesData

      // Process player rows (starting from row 2)
      for (var row = 2; row < playersData.length; row++) {
        var playerRow = playersData[row];
        var player = {
          Slate: slate.name,
          Match: slate.match
        };

        var hasData = false;
        for (var hIdx = 0; hIdx < baseHeaders.length; hIdx++) {
          var colIdx = startCol + hIdx;
          if (colIdx < playerRow.length) {
            var value = playerRow[colIdx];
            player[baseHeaders[hIdx]] = value;
            if (value && value !== "" && value !== 0) {
              hasData = true;
            }
          }
        }

        // Only add player if they have actual data (ID or Name exists)
        var playerId = player["ID"] || player["id"] || "";
        var playerName = player["Name"] || player["Player"] || "";
        if (hasData && (playerId || playerName)) {
          allPlayersRaw.push(player);
        }
      }
    }

    // For DK Showdown: Merge CPT and FLEX rows for each player
    // DK has players listed twice: once with "Roster Position" = "CPT" and once with "FLEX"
    if (provider === "DK") {
      var playerMap = {}; // Key: "Name|Team|Slate" -> { flex: playerObj, cpt: playerObj }

      for (var i = 0; i < allPlayersRaw.length; i++) {
        var p = allPlayersRaw[i];
        var pName = p["Name"] || p["Player"] || "";
        var pTeam = p["Team"] || "";
        var pSlate = p["Slate"] || "";
        var rosterPos = p["Roster Position"] || "";
        var key = pName + "|" + pTeam + "|" + pSlate;

        if (!playerMap[key]) {
          playerMap[key] = { flex: null, cpt: null };
        }

        if (rosterPos === "CPT") {
          playerMap[key].cpt = p;
        } else {
          playerMap[key].flex = p;
        }
      }

      // Now merge: use FLEX row as base, add CPT salary/points as MVP fields
      for (var key in playerMap) {
        if (playerMap.hasOwnProperty(key)) {
          var entry = playerMap[key];
          var basePlayer = entry.flex || entry.cpt; // Prefer FLEX, fallback to CPT if no FLEX
          if (basePlayer) {
            // Add MVP/CPT salary and points from CPT row
            if (entry.cpt) {
              basePlayer["CPT Salary"] = entry.cpt["Salary"] || basePlayer["Salary"];
              basePlayer["CPT FPts"] = entry.cpt["FPTS"] || basePlayer["FPTS"];
              basePlayer["CPT ID"] = entry.cpt["ID"] || entry.cpt["id"] || "";
            } else {
              // No CPT row found, use same values
              basePlayer["CPT Salary"] = basePlayer["Salary"];
              basePlayer["CPT FPts"] = basePlayer["FPTS"];
              basePlayer["CPT ID"] = basePlayer["ID"] || basePlayer["id"] || "";
            }
            showdownPlayersList[provider].push(basePlayer);
          }
        }
      }
    } else {
      // For FD and other providers, use players as-is (they already have MVP columns)
      showdownPlayersList[provider] = allPlayersRaw;
    }
  }

  function showHidePointsTooltip(e) {
    var popup = $(".players-table-container .points-tooltip-container");
    var popupPointer = $(".players-table-container .up-pointer");
    if (popup && popupPointer) {
      if (e.type === "mouseover") {
        removeClass(popup, "hidden");
        removeClass(popupPointer, "hidden");
      } else if (e.type === "mouseout") {
        addClass(popup, "hidden");
        addClass(popupPointer, "hidden");
      }
    }
  }

  function showHideSalaryTooltip(e) {
    var popup = $(".players-table-container .salary-tooltip-container");
    var popupPointer = $(".players-table-container .up-pointer");
    if (popup && popupPointer) {
      if (e.type === "mouseover") {
        removeClass(popup, "hidden");
        removeClass(popupPointer, "hidden");
      } else if (e.type === "mouseout") {
        addClass(popup, "hidden");
        addClass(popupPointer, "hidden");
      }
    }
  }

  function showHideValueTooltip(e) {
    var popup = $(".players-table-container .value-tooltip-container");
    var popupPointer = $(".players-table-container .up-pointer");
    if (popup && popupPointer) {
      if (e.type === "mouseover") {
        removeClass(popup, "hidden");
        removeClass(popupPointer, "hidden");
      } else if (e.type === "mouseout") {
        addClass(popup, "hidden");
        addClass(popupPointer, "hidden");
      }
    }
  }

  function showHideActionTooltip(e) {
    var popup = $(".players-table-container .action-tooltip-container");
    var popupPointer = $(".players-table-container .up-pointer");
    if (popup && popupPointer) {
      if (e.type === "mouseover") {
        removeClass(popup, "hidden");
        removeClass(popupPointer, "hidden");
      } else if (e.type === "mouseout") {
        addClass(popup, "hidden");
        addClass(popupPointer, "hidden");
      }
    }
  }

  function fillPlayersTableData(provider) {
    if (!provider) {
      provider = "DK";
    }

    // Check if we're in showdown mode
    var isShowdown = state.currentMatchType === "showdown";

    // Get the appropriate player list
    var currentPlayersList;
    if (isShowdown) {
      currentPlayersList = showdownPlayersList[provider] || [];
      // Filter by current slate
      currentPlayersList = currentPlayersList.filter(function(player) {
        return player.Slate === state.currentSlate || player["Slate"] === state.currentSlate;
      });
    } else {
      currentPlayersList = playersList;
    }

    var playersListTable = $(".players-list-table");
    if (playersListTable) {
      playersListTable.innerHTML = "";
      var tableHeaderContainer = document.createElement("thead");
      var playersInfoContainer = document.createElement("tr");
      addClass(playersInfoContainer, "players-info-container-header");

      if (desktop) {
        var playerPositionHeader = document.createElement("th");
        addClass(playerPositionHeader, "first-header");
        playerPositionHeader.innerHTML = "Pos";
        playersInfoContainer.appendChild(playerPositionHeader);
      }

      var playerNameHeader = document.createElement("th");
      addClass(playerNameHeader, "player-name-header");
      playerNameHeader.innerHTML = "Player";
      playersInfoContainer.appendChild(playerNameHeader);

      if (desktop) {
        var playerTeamHeader = document.createElement("th");
        playerTeamHeader.innerHTML = "Team";
        playersInfoContainer.appendChild(playerTeamHeader);

        var oppositionTeamHeader = document.createElement("th");
        oppositionTeamHeader.innerHTML = "Opp";
        playersInfoContainer.appendChild(oppositionTeamHeader);
      }

      var playerSalaryHeader = document.createElement("th");
      var playerSalaryHolder = document.createElement("div");
      addClass(playerSalaryHolder, "player-salary-header");

      var salaryTextHeaderDsc = document.createElement("span");
      salaryTextHeaderDsc.innerHTML = "Sal";
      var salarySortDescendingButton = document.createElement("button");
      salarySortDescendingButton.dataset.sort = "descending";
      salarySortDescendingButton.addEventListener("click", sortPlayersSalary);
      if (desktop) {
        salarySortDescendingButton.addEventListener("mouseover", showHideSalaryTooltip);
        salarySortDescendingButton.addEventListener("mouseout", showHideSalaryTooltip);
      }
      addClass(salarySortDescendingButton, "salary-sort-descending-btn");
      var salarySortIcon = document.createElement("img");
      addClass(salarySortIcon, "sort-ascending-icon");
      salarySortIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/sort-ascending-icon.png");
      salarySortIcon.setAttribute("width", "7");
      salarySortIcon.setAttribute("height", "7");
      salarySortIcon.setAttribute("alt", "salary sort icon");
      salarySortDescendingButton.appendChild(salaryTextHeaderDsc);
      salarySortDescendingButton.appendChild(salarySortIcon);

      var salaryTextHeaderAsc = document.createElement("span");
      salaryTextHeaderAsc.innerHTML = "Sal";
      var salarySortAscendingButton = document.createElement("button");
      salarySortAscendingButton.dataset.sort = "ascending";
      salarySortAscendingButton.addEventListener("click", sortPlayersSalary);
      if (desktop) {
        salarySortAscendingButton.addEventListener("mouseover", showHideSalaryTooltip);
        salarySortAscendingButton.addEventListener("mouseout", showHideSalaryTooltip);
      }
      addClass(salarySortAscendingButton, "hidden");
      addClass(salarySortAscendingButton, "salary-sort-ascending-btn");
      var salarySortIcon = document.createElement("img");
      addClass(salarySortIcon, "sort-descending-icon");
      salarySortIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/down-arrow.png");
      salarySortIcon.setAttribute("width", "7");
      salarySortIcon.setAttribute("height", "7");
      salarySortIcon.setAttribute("alt", "sort ascending icon");
      salarySortAscendingButton.appendChild(salaryTextHeaderAsc);
      salarySortAscendingButton.appendChild(salarySortIcon);

      playerSalaryHolder.appendChild(salarySortDescendingButton);
      playerSalaryHolder.appendChild(salarySortAscendingButton);
      playerSalaryHeader.appendChild(playerSalaryHolder);
      playersInfoContainer.appendChild(playerSalaryHeader);

      if (desktop) {
        var playerPointsHeader = document.createElement("th");
        var pointsTextHeaderDsc = document.createElement("span");
        pointsTextHeaderDsc.innerHTML = "FPTS";
        var pointsSortDescendingButton = document.createElement("button");
        pointsSortDescendingButton.dataset.sort = "descending";
        pointsSortDescendingButton.addEventListener("click", sortPlayersPoints);
        pointsSortDescendingButton.addEventListener("mouseover", showHidePointsTooltip);
        pointsSortDescendingButton.addEventListener("mouseout", showHidePointsTooltip);
        addClass(pointsSortDescendingButton, "points-sort-descending-btn");
        var pointsSortIcon = document.createElement("img");
        addClass(pointsSortIcon, "sort-ascending-icon");
        pointsSortIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/sort-ascending-icon.png");
        pointsSortIcon.setAttribute("width", "7");
        pointsSortIcon.setAttribute("height", "7");
        pointsSortIcon.setAttribute("alt", "sort descending icon");
        pointsSortDescendingButton.appendChild(pointsTextHeaderDsc);
        pointsSortDescendingButton.appendChild(pointsSortIcon);

        var pointsTextHeaderAsc = document.createElement("span");
        pointsTextHeaderAsc.innerHTML = "FPTS";
        var pointsSortAscendingButton = document.createElement("button");
        pointsSortAscendingButton.dataset.sort = "ascending";
        pointsSortAscendingButton.addEventListener("click", sortPlayersPoints);
        pointsSortAscendingButton.addEventListener("mouseover", showHidePointsTooltip);
        pointsSortAscendingButton.addEventListener("mouseout", showHidePointsTooltip);
        addClass(pointsSortAscendingButton, "hidden");
        addClass(pointsSortAscendingButton, "points-sort-ascending-btn");
        var pointsSortIcon = document.createElement("img");
        addClass(pointsSortIcon, "sort-descending-icon");
        pointsSortIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/down-arrow.png");
        pointsSortIcon.setAttribute("width", "7");
        pointsSortIcon.setAttribute("height", "7");
        pointsSortIcon.setAttribute("alt", "sort ascending icon");
        pointsSortAscendingButton.appendChild(pointsTextHeaderAsc);
        pointsSortAscendingButton.appendChild(pointsSortIcon);

        playerPointsHeader.appendChild(pointsSortDescendingButton);
        playerPointsHeader.appendChild(pointsSortAscendingButton);
        playersInfoContainer.appendChild(playerPointsHeader);

        var playerValueHeader = document.createElement("th");
        var valueTextHeaderDsc = document.createElement("span");
        valueTextHeaderDsc.innerHTML = "Val";
        var valueSortDescendingButton = document.createElement("button");
        valueSortDescendingButton.dataset.sort = "descending";
        valueSortDescendingButton.addEventListener("click", sortPlayersValue);
        valueSortDescendingButton.addEventListener("mouseover", showHideValueTooltip);
        valueSortDescendingButton.addEventListener("mouseout", showHideValueTooltip);
        addClass(valueSortDescendingButton, "value-sort-descending-btn");
        var valueSortIcon = document.createElement("img");
        addClass(valueSortIcon, "sort-ascending-icon");
        valueSortIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/sort-ascending-icon.png");
        valueSortIcon.setAttribute("width", "7");
        valueSortIcon.setAttribute("height", "7");
        valueSortIcon.setAttribute("alt", "points sort icon");
        valueSortDescendingButton.appendChild(valueTextHeaderDsc);
        valueSortDescendingButton.appendChild(valueSortIcon);

        var valueTextHeaderAsc = document.createElement("span");
        valueTextHeaderAsc.innerHTML = "Val";
        var valueSortAscendingButton = document.createElement("button");
        valueSortAscendingButton.dataset.sort = "ascending";
        valueSortAscendingButton.addEventListener("click", sortPlayersValue);
        valueSortAscendingButton.addEventListener("mouseover", showHideValueTooltip);
        valueSortAscendingButton.addEventListener("mouseout", showHideValueTooltip);
        addClass(valueSortAscendingButton, "hidden");
        addClass(valueSortAscendingButton, "value-sort-ascending-btn");
        var valueSortIcon = document.createElement("img");
        addClass(valueSortIcon, "sort-descending-icon");
        valueSortIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/down-arrow.png");
        valueSortIcon.setAttribute("width", "7");
        valueSortIcon.setAttribute("height", "7");
        valueSortIcon.setAttribute("alt", "sort ascending icon");
        valueSortAscendingButton.appendChild(valueTextHeaderAsc);
        valueSortAscendingButton.appendChild(valueSortIcon);

        playerValueHeader.appendChild(valueSortDescendingButton);
        playerValueHeader.appendChild(valueSortAscendingButton);
        playersInfoContainer.appendChild(playerValueHeader);
      } else {
        var playerPointsValueHeader = document.createElement("th");
        var pointsValueHolder = document.createElement("div");
        addClass(pointsValueHolder, "player-points-value-select-container");

        var select = document.createElement("select");
        select.addEventListener("input", changePointsValueColumn);
        addClass(select, "player-points-value-select");
        select.setAttribute("name", "player-points");
        select.setAttribute("id", "player-points");

        var pointsOption = document.createElement("option");
        pointsOption.setAttribute("value", "FPTS");
        pointsOption.innerHTML = "FPTS";
        select.appendChild(pointsOption);

        var valueOption = document.createElement("option");
        valueOption.setAttribute("value", "Val");
        valueOption.innerHTML = "Val";
        select.appendChild(valueOption);

        pointsValueHolder.appendChild(select);

        var valueSortDescendingButton = document.createElement("button");
        valueSortDescendingButton.dataset.sort = "descending";
        valueSortDescendingButton.addEventListener("click", sortPointsValue);
        addClass(valueSortDescendingButton, "points-value-sort-descending-btn");
        var valueSortIcon = document.createElement("img");
        valueSortIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/sort-ascending-icon.png");
        valueSortIcon.setAttribute("width", "7");
        valueSortIcon.setAttribute("height", "7");
        valueSortIcon.setAttribute("alt", "points sort icon");
        valueSortDescendingButton.appendChild(valueSortIcon);
        pointsValueHolder.appendChild(valueSortDescendingButton);

        var valueSortAscendingButton = document.createElement("button");
        valueSortAscendingButton.dataset.sort = "ascending";
        valueSortAscendingButton.addEventListener("click", sortPointsValue);
        addClass(valueSortAscendingButton, "hidden");
        addClass(valueSortAscendingButton, "points-value-sort-ascending-btn");
        var valueSortIcon = document.createElement("img");
        valueSortIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/down-arrow.png");
        valueSortIcon.setAttribute("width", "7");
        valueSortIcon.setAttribute("height", "7");
        valueSortIcon.setAttribute("alt", "sort ascending icon");
        valueSortAscendingButton.appendChild(valueSortIcon);
        pointsValueHolder.appendChild(valueSortAscendingButton);

        playerPointsValueHeader.appendChild(pointsValueHolder);
        playersInfoContainer.appendChild(playerPointsValueHeader);
      }

      // Add Captain column header for showdown mode
      if (isShowdown) {
        var captainHeader = document.createElement("th");
        addClass(captainHeader, "captain-header");
        captainHeader.innerHTML = "CPT";
        playersInfoContainer.appendChild(captainHeader);
      }

      var actionHeader = document.createElement("th");
      if (desktop) {
        actionHeader.addEventListener("mouseover", showHideActionTooltip);
        actionHeader.addEventListener("mouseout", showHideActionTooltip);
      }
      actionHeader.innerHTML = "Action";
      playersInfoContainer.appendChild(actionHeader);

      tableHeaderContainer.appendChild(playersInfoContainer);

      playersListTable.appendChild(tableHeaderContainer);

      var playersListContainer = document.createElement("tbody");
      for (var i = 0; i < currentPlayersList.length; i++) {
        // For classic mode, filter by team. For showdown mode, show all players in the slate
        if (!isShowdown && !state.currentTeams.includes(currentPlayersList[i].Team)) continue;

        var singlePlayerRow = document.createElement("tr");
        var slateName = state.currentSlate;
        var playerCodeText;
        var salaryText;
        var valueText;
        var playerPosition;
        var playerName;
        var playerTeam;
        var playerSalary;
        var playerValue;
        var playerPoints;
        var playerOpponent;

        if (isShowdown) {
          // Showdown data structure
          playerCodeText = currentPlayersList[i]["ID"] || currentPlayersList[i]["id"] || "";
          playerPosition = currentPlayersList[i]["Position"] || currentPlayersList[i]["Roster Position"] || "";
          playerName = currentPlayersList[i]["Name"] || currentPlayersList[i]["Player"] || "";
          playerTeam = currentPlayersList[i]["Team"] || "";
          playerSalary = currentPlayersList[i]["Salary"] || 0;
          playerValue = currentPlayersList[i]["Value"] || 0;
          playerPoints = currentPlayersList[i]["FPTS"] || currentPlayersList[i]["STD FPts"] || 0;
          playerOpponent = currentPlayersList[i]["Opposition"] || "";

          singlePlayerRow.dataset.playercode = playerCodeText;
          singlePlayerRow.dataset.playername = playerName;
          singlePlayerRow.dataset.playerposition = playerPosition;
          singlePlayerRow.dataset.salary = isNaN(playerSalary) ? 0 : playerSalary;
          singlePlayerRow.dataset.value = isNaN(playerValue) ? 0 : playerValue;
          singlePlayerRow.dataset.points = isNaN(playerPoints) ? 0 : playerPoints;
          // Store MVP salary for captain mode
          singlePlayerRow.dataset.mvpsalary = currentPlayersList[i]["MVP Salary"] || currentPlayersList[i]["CPT Salary"] || playerSalary;
          singlePlayerRow.dataset.mvppoints = currentPlayersList[i]["MVP FPts"] || currentPlayersList[i]["CPT FPts"] || playerPoints;
          // Store CPT ID for captain locking (DK Showdown uses different IDs for CPT and FLEX)
          singlePlayerRow.dataset.cptid = currentPlayersList[i]["CPT ID"] || playerCodeText;
        } else {
          // Classic data structure
          if (slateName.includes("Classic")) {
            playerCodeText = slateName.replace("Classic", "") + "Code";
            salaryText = slateName.replace("Classic", "") + "Salary";
            valueText = slateName.replace("Classic", "") + "Value";
          } else {
            playerCodeText = slateName + " Code";
            salaryText = slateName + " Salary";
            valueText = slateName + " Value";
          }
          singlePlayerRow.dataset.playercode = currentPlayersList[i][playerCodeText];
          singlePlayerRow.dataset.playername = currentPlayersList[i].Player;
          singlePlayerRow.dataset.playerposition = currentPlayersList[i].Position;
          singlePlayerRow.dataset.salary = (isNaN(currentPlayersList[i][salaryText]) || currentPlayersList[i][salaryText] ===
            "") ? 0 : currentPlayersList[i][salaryText];
          singlePlayerRow.dataset.value = (isNaN(currentPlayersList[i][valueText]) || currentPlayersList[i][valueText] === "") ?
            0 : currentPlayersList[i][valueText];
          var scoringText = state.currentProvider + " Scoring";
          singlePlayerRow.dataset.points = (isNaN(currentPlayersList[i][scoringText]) || currentPlayersList[i][scoringText] ===
            "") ? 0 : currentPlayersList[i][scoringText];

          playerPosition = currentPlayersList[i].Position;
          playerName = currentPlayersList[i].Player;
          playerTeam = currentPlayersList[i].Team;
          playerSalary = currentPlayersList[i][salaryText];
          playerValue = currentPlayersList[i][valueText];
          playerPoints = currentPlayersList[i][scoringText];
          playerOpponent = currentPlayersList[i].Opponent || "";
        }

        addClass(singlePlayerRow, "single-player-row");

        if (desktop) {
          var playerPositionTd = document.createElement("td");
          addClass(playerPositionTd, "player-position");
          playerPositionTd.innerHTML = playerPosition;
          singlePlayerRow.appendChild(playerPositionTd);

          var playerNameTd = document.createElement("td");
          addClass(playerNameTd, "player-name");
          playerNameTd.innerHTML = playerName;
          singlePlayerRow.appendChild(playerNameTd);

          var playerTeamTd = document.createElement("td");
          addClass(playerTeamTd, "team-name");
          playerTeamTd.innerHTML = playerTeam;
          singlePlayerRow.appendChild(playerTeamTd);

          var oppositionTeamTd = document.createElement("td");
          addClass(oppositionTeamTd, "team-name");
          // Use playerOpponent directly from data (e.g., "at NE" or "vs. NE")
          // Show "-" if empty or just "at"
          var oppValue = playerOpponent ? playerOpponent.trim() : "";
          if (!oppValue || oppValue === "at" || oppValue === "vs" || oppValue === "vs.") {
            oppositionTeamTd.innerHTML = "-";
          } else {
            // Replace "at " with "@ " and "vs." with "vs" for cleaner display
            oppValue = oppValue.replace(/^at\s+/i, "@ ").replace(/^vs\.\s*/i, "vs ");
            oppositionTeamTd.innerHTML = oppValue;
          }
          singlePlayerRow.appendChild(oppositionTeamTd);
        } else {
          var playerPositionNameTeams = document.createElement("td");
          var playerDetailsContainer = document.createElement("div");
          addClass(playerDetailsContainer, "single-row-player-details-container");

          var playerNameSpan = document.createElement("span");
          addClass(playerNameSpan, "player-name");
          playerNameSpan.innerHTML = playerName;
          playerDetailsContainer.appendChild(playerNameSpan);

          var playerDetailsHolder = document.createElement("div");
          addClass(playerDetailsHolder, "single-row-player-details-holder");
          var playerPositionSpan = document.createElement("span");
          addClass(playerPositionSpan, "player-position");
          playerPositionSpan.innerHTML = playerPosition;
          playerDetailsHolder.appendChild(playerPositionSpan);

          var separator = document.createElement("span");
          addClass(separator, "player-details-separator");
          separator.innerHTML = "&bull;";
          playerDetailsHolder.appendChild(separator);

          var playerTeamSpan = document.createElement("span");
          addClass(playerTeamSpan, "team-name");
          playerTeamSpan.innerHTML = playerTeam;
          playerDetailsHolder.appendChild(playerTeamSpan);

          // Show opponent from data (e.g., "at NE" or "vs. NE")
          var oppValueMobile = playerOpponent ? playerOpponent.trim() : "";
          if (oppValueMobile && oppValueMobile !== "at" && oppValueMobile !== "vs" && oppValueMobile !== "vs.") {
            // Replace "at " with "@ " and "vs." with "vs" for cleaner display
            oppValueMobile = oppValueMobile.replace(/^at\s+/i, "@ ").replace(/^vs\.\s*/i, "vs ");
            var oppositionTeamSpan = document.createElement("span");
            addClass(oppositionTeamSpan, "team-name");
            oppositionTeamSpan.innerHTML = oppValueMobile;
            playerDetailsHolder.appendChild(oppositionTeamSpan);
          }

          playerDetailsContainer.appendChild(playerDetailsHolder);
          playerPositionNameTeams.appendChild(playerDetailsContainer);
          singlePlayerRow.appendChild(playerPositionNameTeams);
        }

        var playerSalaryTd = document.createElement("td");
        addClass(playerSalaryTd, "player-records");
        addClass(playerSalaryTd, "player-salary");
        playerSalaryTd.innerHTML = "$" + playerSalary;
        singlePlayerRow.appendChild(playerSalaryTd);

        if (desktop) {
          var playerPointsTd = document.createElement("td");
          addClass(playerPointsTd, "player-records");
          addClass(playerPointsTd, "player-points");
          playerPointsTd.innerHTML = playerPoints;
          singlePlayerRow.appendChild(playerPointsTd);

          var playerValueTd = document.createElement("td");
          addClass(playerValueTd, "player-records");
          addClass(playerValueTd, "player-value");
          if (playerValue === "#DIV/0!") {
            playerValueTd.innerHTML = 0.00;
          } else {
            playerValueTd.innerHTML = playerValue;
          }
          singlePlayerRow.appendChild(playerValueTd);
        } else {
          var playerPointsValueTd = document.createElement("td");
          addClass(playerPointsValueTd, "player-records");
          addClass(playerPointsValueTd, "points-value");
          var playerPointsValueHolder = document.createElement("div");
          addClass(playerPointsValueHolder, "player-points-value-holder");
          var playerPointsSpan = document.createElement("span");
          addClass(playerPointsSpan, "player-points");
          playerPointsSpan.innerHTML = playerPoints;
          playerPointsValueHolder.appendChild(playerPointsSpan);

          var playerValueSpan = document.createElement("span");
          addClass(playerValueSpan, "player-value");
          addClass(playerValueSpan, "hidden");
          if (playerValue === "#DIV/0!") {
            playerValueSpan.innerHTML = 0.00;
          } else {
            playerValueSpan.innerHTML = playerValue;
          }
          playerPointsValueHolder.appendChild(playerValueSpan);
          playerPointsValueTd.appendChild(playerPointsValueHolder);
          singlePlayerRow.appendChild(playerPointsValueTd);
        }

        // Add Captain column for showdown mode
        if (isShowdown) {
          var captainHolder = document.createElement("td");
          addClass(captainHolder, "captain-holder");
          var captainContainer = document.createElement("div");
          addClass(captainContainer, "captain-container");

          var lockCaptainBtn = document.createElement("button");
          lockCaptainBtn.addEventListener("click", lockCaptainPlayer);
          addClass(lockCaptainBtn, "lock-captain-btn");
          var captainUnlockedIcon = document.createElement("img");
          addClass(captainUnlockedIcon, "captain-unlocked-icon");
          captainUnlockedIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/unlocked-icon.png");
          captainUnlockedIcon.setAttribute("width", "16");
          captainUnlockedIcon.setAttribute("height", "13");
          captainUnlockedIcon.setAttribute("alt", "lock captain icon");
          lockCaptainBtn.appendChild(captainUnlockedIcon);
          captainContainer.appendChild(lockCaptainBtn);

          var unlockCaptainBtn = document.createElement("button");
          unlockCaptainBtn.addEventListener("click", unlockCaptainPlayer);
          addClass(unlockCaptainBtn, "unlock-captain-btn");
          addClass(unlockCaptainBtn, "hidden");
          var captainLockedIcon = document.createElement("img");
          addClass(captainLockedIcon, "captain-locked-icon");
          captainLockedIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/locked-icon.png");
          captainLockedIcon.setAttribute("width", "16");
          captainLockedIcon.setAttribute("height", "13");
          captainLockedIcon.setAttribute("alt", "unlock captain icon");
          unlockCaptainBtn.appendChild(captainLockedIcon);
          captainContainer.appendChild(unlockCaptainBtn);

          captainHolder.appendChild(captainContainer);
          singlePlayerRow.appendChild(captainHolder);
        }

        var actionsHolder = document.createElement("td");
        addClass(actionsHolder, "actions-holder");
        var actionsContainer = document.createElement("div");
        addClass(actionsContainer, "actions-container");
        var lockPlayerButton = document.createElement("button");
        lockPlayerButton.addEventListener("click", lockPlayer);
        addClass(lockPlayerButton, "lock-player-btn");
        var unlockedPlayerIcon = document.createElement("img");
        addClass(unlockedPlayerIcon, "unlocked-icon");
        unlockedPlayerIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/unlocked-icon.png");
        unlockedPlayerIcon.setAttribute("width", "16");
        unlockedPlayerIcon.setAttribute("height", "13");
        unlockedPlayerIcon.setAttribute("alt", "unlocked icon");
        lockPlayerButton.appendChild(unlockedPlayerIcon);
        actionsContainer.appendChild(lockPlayerButton);

        var unlockPlayerButton = document.createElement("button");
        unlockPlayerButton.addEventListener("click", unlockPlayer);
        addClass(unlockPlayerButton, "unlock-player-btn");
        addClass(unlockPlayerButton, "hidden");
        var lockedPlayerIcon = document.createElement("img");
        addClass(lockedPlayerIcon, "locked-icon");
        lockedPlayerIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/locked-icon.png");
        lockedPlayerIcon.setAttribute("width", "16");
        lockedPlayerIcon.setAttribute("height", "13");
        lockedPlayerIcon.setAttribute("alt", "locked icon");
        unlockPlayerButton.appendChild(lockedPlayerIcon);
        actionsContainer.appendChild(unlockPlayerButton);

        var removePlayerButton = document.createElement("button");
        removePlayerButton.addEventListener("click", removePlayer);
        addClass(removePlayerButton, "remove-player-btn");
        var removeIcon = document.createElement("img");
        removeIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/remove-icon.png");
        removeIcon.setAttribute("width", "16");
        removeIcon.setAttribute("height", "16");
        removeIcon.setAttribute("alt", "remove player icon");
        removePlayerButton.appendChild(removeIcon);
        actionsContainer.appendChild(removePlayerButton);
        actionsHolder.appendChild(actionsContainer);

        var addPlayerButton = document.createElement("button");
        addPlayerButton.addEventListener("click", addPlayer);
        addClass(addPlayerButton, "add-player-button");
        addClass(addPlayerButton, "hidden");
        var addText = document.createElement("span");
        addClass(addText, "add-text");
        addText.innerHTML = "Add";
        addPlayerButton.appendChild(addText);

        var addIcon = document.createElement("img");
        addIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/plus-icon.png");
        addIcon.setAttribute("width", "12");
        addIcon.setAttribute("height", "12");
        addIcon.setAttribute("alt", "add player icon");
        addPlayerButton.appendChild(addIcon);
        actionsHolder.appendChild(addPlayerButton);

        singlePlayerRow.appendChild(actionsHolder);

        playersListContainer.appendChild(singlePlayerRow);
      }

      playersListTable.appendChild(playersListContainer);

      var sortSalaryDscBtn = $(".players-list-table .salary-sort-descending-btn");
      if (sortSalaryDscBtn) {
        sortSalaryDscBtn.dataset.triggerevent = "false";
        sortSalaryDscBtn.click();
      }
    }
  }

  function hideSortIconsFromPlayersTable(e) {
    var sortAscIcons = $all(".sort-ascending-icon");
    if (sortAscIcons.length > 0) {
      for (var i = 0; i < sortAscIcons.length; i++) {
        addClass(sortAscIcons[i], "hidden");
      }
    }

    var sortDscIcons = $all(".sort-descending-icon");
    if (sortDscIcons.length > 0) {
      for (var i = 0; i < sortDscIcons.length; i++) {
        addClass(sortDscIcons[i], "hidden");
      }
    }

    var targetBtn = e.target.closest("button");
    var sibling = targetBtn.previousElementSibling;
    if (!sibling) {
      sibling = targetBtn.nextElementSibling;
    }
    if (sibling) {
      var targetIcon = sibling.querySelector("img");

      if (targetIcon) {
        removeClass(targetIcon, "hidden");
      }
    }
  }

  function sortPlayersSalary(e) {
    var sortBtn = e.target.closest(".salary-sort-ascending-btn");
    var sortOrder;
    if (!sortBtn) {
      sortBtn = e.target.closest(".salary-sort-descending-btn");
      sortOrder = "descending";
    } else {
      sortOrder = "ascending";
    }

    if (sortBtn && sortBtn.dataset.triggerevent && sortBtn.dataset.triggerevent === "false") {
      sortBtn.dataset.triggerevent = "true";
    } else {
      trackGAEventForPage("sort_by", {
        "order": sortOrder,
        "header": "salary",
        "tab": getSelectedPlayerTab(),
        "build_count": state.buildCount,
      });
    }

    if (desktop) {
      hideSortIconsFromPlayersTable(e);
    }

    var sort = sortBtn.dataset.sort;
    var playersListContainer = e.target.closest(".players-list-table");
    if (!playersListContainer) {
      playersListContainer = e.target.closest(".lineups-table");
    }

    var descendingSortBtn = playersListContainer.querySelector(".salary-sort-descending-btn");
    var ascendingSortBtn = playersListContainer.querySelector(".salary-sort-ascending-btn");
    playersListContainer = playersListContainer.querySelector("tbody");
    var players;

    var playersContainers = playersListContainer.children;
    if (playersContainers) {
      if (sort === "descending") {
        players = Array.from(playersContainers).sort(function(x, y) {
          return parseInt(y.dataset.salary) - parseInt(x.dataset.salary);
        });

        if (descendingSortBtn && ascendingSortBtn) {
          addClass(descendingSortBtn, "hidden");
          removeClass(ascendingSortBtn, "hidden");
        }
      } else if (sort === "ascending") {
        players = Array.from(playersContainers).sort(function(x, y) {
          return parseInt(x.dataset.salary) - parseInt(y.dataset.salary);
        });

        if (descendingSortBtn && ascendingSortBtn) {
          removeClass(descendingSortBtn, "hidden");
          addClass(ascendingSortBtn, "hidden");
        }
      }

      if (playersListContainer) {
        playersListContainer.innerHTML = "";
        players.forEach(function(player) {
          playersListContainer.appendChild(player);
        });
      }

      var playersSalaryHolders = $all(".players-list-table .player-records.player-salary");
      if (playersSalaryHolders) {
        for (var i = 0; i < playersSalaryHolders.length; i++) {
          addClass(playersSalaryHolders[i], "sorted-column");
        }
      }

      var playersPointsHolders = $all(".players-list-table .player-records.player-points");
      if (playersPointsHolders) {
        for (var i = 0; i < playersPointsHolders.length; i++) {
          removeClass(playersPointsHolders[i], "sorted-column");
        }
      }

      var playersValueHolders = $all(".players-list-table .player-records.player-value");
      if (playersValueHolders) {
        for (var i = 0; i < playersValueHolders.length; i++) {
          removeClass(playersValueHolders[i], "sorted-column");
        }
      }

      var playersPointsValueHolders = $all(".players-list-table .player-records.points-value");
      if (playersPointsValueHolders) {
        for (var i = 0; i < playersPointsValueHolders.length; i++) {
          removeClass(playersPointsValueHolders[i], "sorted-column");
        }
      }
    }
  }

  function sortPlayersPoints(e) {
    var sortBtn = e.target.closest(".points-sort-ascending-btn");
    var sortOrder;
    if (!sortBtn) {
      sortBtn = e.target.closest(".points-sort-descending-btn");
      sortOrder = "descending";
    } else {
      sortOrder = "ascending";
    }

    trackGAEventForPage("sort_by", {
      "order": sortOrder,
      "header": "FPTS",
      "tab": getSelectedPlayerTab(),
      "build_count": state.buildCount,
    });

    if (desktop) {
      hideSortIconsFromPlayersTable(e);
    }

    var sort = sortBtn.dataset.sort;
    var playersListContainer = $(".players-list-table tbody");
    var descendingSortBtn = $(".points-sort-descending-btn");
    var ascendingSortBtn = $(".points-sort-ascending-btn");
    var players;

    var playersContainers = $(".players-list-table tbody").children;
    if (!sort) {
      sort = "descending";
    }
    if (playersContainers) {
      if (sort === "descending") {
        players = Array.from(playersContainers).sort(function(x, y) {
          return parseFloat(y.dataset.points) - parseFloat(x.dataset.points);
        });

        if (descendingSortBtn && ascendingSortBtn) {
          addClass(descendingSortBtn, "hidden");
          removeClass(ascendingSortBtn, "hidden");
        }
      } else if (sort === "ascending") {
        players = Array.from(playersContainers).sort(function(x, y) {
          return parseFloat(x.dataset.points) - parseFloat(y.dataset.points);
        });

        if (descendingSortBtn && ascendingSortBtn) {
          removeClass(descendingSortBtn, "hidden");
          addClass(ascendingSortBtn, "hidden");
        }
      }

      if (playersListContainer) {
        playersListContainer.innerHTML = "";
        players.forEach(function(player) {
          playersListContainer.appendChild(player);
        });
      }

      var playersSalaryHolders = $all(".players-list-table .player-records.player-salary");
      if (playersSalaryHolders) {
        for (var i = 0; i < playersSalaryHolders.length; i++) {
          removeClass(playersSalaryHolders[i], "sorted-column");
        }
      }

      var playersPointsHolders = $all(".players-list-table .player-records.player-points");
      if (playersPointsHolders) {
        for (var i = 0; i < playersPointsHolders.length; i++) {
          addClass(playersPointsHolders[i], "sorted-column");
        }
      }

      var playersValueHolders = $all(".players-list-table .player-records.player-value");
      if (playersValueHolders) {
        for (var i = 0; i < playersValueHolders.length; i++) {
          removeClass(playersValueHolders[i], "sorted-column");
        }
      }
    }
  }

  function sortPlayersValue(e) {
    var sortBtn = e.target.closest(".value-sort-ascending-btn");
    var sortOrder;
    if (!sortBtn) {
      sortBtn = e.target.closest(".value-sort-descending-btn");
      sortOrder = "descending";
    } else {
      sortOrder = "ascending";
    }

    trackGAEventForPage("sort_by", {
      "order": sortOrder,
      "header": "Val",
      "tab": getSelectedPlayerTab(),
      "build_count": state.buildCount,
    });

    if (desktop) {
      hideSortIconsFromPlayersTable(e);
    }

    var sort = sortBtn.dataset.sort;
    var playersListContainer = $(".players-list-table tbody");
    var descendingSortBtn = $(".value-sort-descending-btn");
    var ascendingSortBtn = $(".value-sort-ascending-btn");
    var players;

    var playersContainers = $(".players-list-table tbody").children;
    if (playersContainers) {
      if (sort === "descending") {
        players = Array.from(playersContainers).sort(function(x, y) {
          return parseFloat(y.dataset.value) - parseFloat(x.dataset.value);
        });

        if (descendingSortBtn && ascendingSortBtn) {
          addClass(descendingSortBtn, "hidden");
          removeClass(ascendingSortBtn, "hidden");
        }
      } else if (sort === "ascending") {
        players = Array.from(playersContainers).sort(function(x, y) {
          return parseFloat(x.dataset.value) - parseFloat(y.dataset.value);
        });

        if (descendingSortBtn && ascendingSortBtn) {
          removeClass(descendingSortBtn, "hidden");
          addClass(ascendingSortBtn, "hidden");
        }
      }

      if (playersListContainer) {
        playersListContainer.innerHTML = "";
        players.forEach(function(player) {
          playersListContainer.appendChild(player);
        });
      }

      var playersSalaryHolders = $all(".players-list-table .player-records.player-salary");
      if (playersSalaryHolders) {
        for (var i = 0; i < playersSalaryHolders.length; i++) {
          removeClass(playersSalaryHolders[i], "sorted-column");
        }
      }

      var playersPointsHolders = $all(".players-list-table .player-records.player-points");
      if (playersPointsHolders) {
        for (var i = 0; i < playersPointsHolders.length; i++) {
          removeClass(playersPointsHolders[i], "sorted-column");
        }
      }

      var playersValueHolders = $all(".players-list-table .player-records.player-value");
      if (playersValueHolders) {
        for (var i = 0; i < playersValueHolders.length; i++) {
          addClass(playersValueHolders[i], "sorted-column");
        }
      }
    }
  }

  function checkPositionConstraint(position) {
    if (position === "QB") {
      if (state.lockedPositionConstraint.QB) {
        return {
          lockPlayer: false,
          quotaFull: false,
        };
      } else {
        state.lockedPositionConstraint.QB = 1;
        return {
          lockPlayer: true,
          quotaFull: true,
        };
      }
    }

    if (position === "RB") {
      if (state.lockedPositionConstraint.RB && state.lockedPositionConstraint.RB == 2) {
        return {
          lockPlayer: false,
          quotaFull: true,
        };
      } else if (!state.lockedPositionConstraint.RB) {
        state.lockedPositionConstraint.RB = 1;
        return {
          lockPlayer: true,
          quotaFull: false,
        };
      } else {
        state.lockedPositionConstraint.RB += 1;
        return {
          lockPlayer: true,
          quotaFull: true,
        };
      }
    }

    if (position === "WR") {
      if (state.lockedPositionConstraint.WR && state.lockedPositionConstraint.WR == 3) {
        return {
          lockPlayer: false,
          quotaFull: true,
        };
      } else if (!state.lockedPositionConstraint.WR) {
        state.lockedPositionConstraint.WR = 1;
        return {
          lockPlayer: true,
          quotaFull: false,
        };
      } else {
        state.lockedPositionConstraint.WR += 1;
        if (state.lockedPositionConstraint.WR == 2) {
          return {
            lockPlayer: true,
            quotaFull: false,
          };
        } else if (state.lockedPositionConstraint.WR == 3) {
          return {
            lockPlayer: true,
            quotaFull: true,
          };
        }
      }
    }

    if (position === "TE") {
      if (state.lockedPositionConstraint.TE) {
        return {
          lockPlayer: false,
          quotaFull: true,
        };
      } else {
        state.lockedPositionConstraint.TE = 1;
        return {
          lockPlayer: true,
          quotaFull: true,
        };
      }
    }

    if (position === "DST") {
      if (state.lockedPositionConstraint.DST) {
        return {
          lockPlayer: false,
          quotaFull: true,
        };
      } else {
        state.lockedPositionConstraint.DST = 1;
        return {
          lockPlayer: true,
          quotaFull: true,
        };
      }
    }
  }

  function setSelectionChangedFlag() {
    if (state.lineups.length > 0 && !desktop) {
      state.selectionsChanged = true;
    }

    return;
  }

  function unsetSelectionChangedFlag() {
    if (!desktop) {
      state.selectionsChanged = false;
    }

    return;
  }

  function hideUnhideRebuildButtonOnPlayerSelectionChange() {
    var buildBtnLineup = $(".build-lineups-bottom");
    if (buildBtnLineup) {
      removeClass(buildBtnLineup, "hidden");
    }

    var utilityContainer = $(".refresh-lineup-download-csv-container");
    if (utilityContainer) {
      var refreshBtn = utilityContainer.querySelector(".refresh-lineup-btn");
      if (refreshBtn) {
        refreshBtn.innerHTML = "Refresh Lineup";
      }
      addClass(utilityContainer, "hidden");
    }
  }

  function getSelectedPlayerTab() {
    var selectedPlayersTab = $(".players-category-buttons-container .players-category.selected");
    var selectedTab;
    if (selectedPlayersTab) {
      selectedTab = selectedPlayersTab.dataset.players;
    }

    return selectedTab;
  }

  function lockPlayer(e) {
    if (state.lineups.length > 0 && desktop) {
      hideUnhideRebuildButtonOnPlayerSelectionChange();
    } else if (state.lineups.length > 0 && !desktop) {
      setSelectionChangedFlag();
    }

    // For showdown, check total locked count including captain
    var isShowdown = state.currentMatchType === "showdown";
    var currentLockedCount = isShowdown ? getShowdownLockedCount() : state.lockedPlayers.length;
    if (currentLockedCount >= getMaxLockedPlayers()) return;

    var player = e.target.closest(".single-player-row");
    var dataset = player.dataset;

    // For showdown, a player locked as captain cannot be locked as normal player
    if (isShowdown && state.captainPlayer === dataset.playercode) return;

    // For showdown, check max 5 players from a single team
    if (isShowdown) {
      var playerTeam = dataset.playername ? getPlayerTeamFromRow(player) : "";
      if (playerTeam && getLockedPlayersCountByTeam(playerTeam) >= 5) return;
    }
    var position = dataset.playerposition;

    // For showdown, skip position constraint check - any player can be locked
    var constraint = isShowdown
      ? { lockPlayer: true, quotaFull: false }
      : checkPositionConstraint(position);

    trackGAEventForPage("lock_player", {
      "selected_tab": getSelectedPlayerTab(),
      "position": position,
      "build_count": state.buildCount,
    });

    if (constraint && constraint.lockPlayer) {
      var salary = parseInt(dataset.salary);
      if (player) {
        player.style.background = "#F8FFFD";
        state.lockedPlayers.push(dataset.playercode);
        var lockPlayerBtn = player.querySelector(".lock-player-btn");
        if (lockPlayerBtn) {
          addClass(lockPlayerBtn, "hidden");
        }

        var unlockPlayerBtn = player.querySelector(".unlock-player-btn");
        if (unlockPlayerBtn) {
          removeClass(unlockPlayerBtn, "hidden");
        }

        // For showdown, disable captain lock button when player is locked as normal player
        if (isShowdown) {
          var lockCaptainBtn = player.querySelector(".lock-captain-btn");
          if (lockCaptainBtn) {
            lockCaptainBtn.disabled = true;
          }
        }

        var removePlayerBtn = player.querySelector(".actions-container .remove-player-btn");
        if (removePlayerBtn) {
          removePlayerBtn.disabled = true;
          removePlayerBtn.style.opacity = "0.4";
        }

        updateLockedPlayersCount();

        var remianingSalaryHolder = $(".remaining-salary-container .remaining-salary");
        if (remianingSalaryHolder) {
          if (state.currentProvider === "DK") {
            DKSalary -= salary;
            remianingSalaryHolder.innerHTML = "$" + DKSalary;
          } else {
            FDSalary -= salary;
            remianingSalaryHolder.innerHTML = "$" + FDSalary;
          }
        }

        if (constraint.quotaFull) {
          var playersListContainers = $(".players-list-table tbody");
          if (playersListContainers) {
            playersListContainers = playersListContainers.children;
            for (var i = 0; i < playersListContainers.length; i++) {
              var playerDataset = playersListContainers[i].dataset;
              var unlockPlayerBtn = playersListContainers[i].querySelector(
                ".actions-container .unlock-player-btn.hidden");
              if (playerDataset.playercode !== dataset.playercode && playerDataset.playerposition === position &&
                unlockPlayerBtn) {
                playersListContainers[i].style.opacity = "0.4";
              }
            }
          }
        }
      }
    }
  }

  function unlockPlayer(e) {
    if (state.lineups.length > 0 && desktop) {
      hideUnhideRebuildButtonOnPlayerSelectionChange();
    } else if (state.lineups.length > 0 && !desktop) {
      setSelectionChangedFlag();
    }

    var player = e.target.closest(".single-player-row");
    if (player) {
      var dataset = player.dataset;
      var salary = parseInt(dataset.salary);
      var position = dataset.playerposition;
      player.style.background = "#fff";
      var index = state.lockedPlayers.findIndex(function(item) {
        return item === dataset.playercode;
      });

      trackGAEventForPage("unlock_player", {
        "selected_tab": getSelectedPlayerTab(),
        "position": position,
        "build_count": state.buildCount,
      });

      state.lockedPlayers.splice(index, 1);
      var lockPlayerBtn = player.querySelector(".lock-player-btn");
      if (lockPlayerBtn) {
        removeClass(lockPlayerBtn, "hidden");
      }

      var unlockPlayerBtn = player.querySelector(".unlock-player-btn");
      if (unlockPlayerBtn) {
        addClass(unlockPlayerBtn, "hidden");
      }

      var removePlayerBtn = player.querySelector(".actions-container .remove-player-btn");
      if (removePlayerBtn) {
        removePlayerBtn.disabled = false;
        removePlayerBtn.style.opacity = "1";
      }

      // For showdown, re-enable captain lock button when player is unlocked (if no captain is locked)
      var isShowdown = state.currentMatchType === "showdown";
      if (isShowdown && !state.captainPlayer) {
        var lockCaptainBtn = player.querySelector(".lock-captain-btn");
        if (lockCaptainBtn) {
          lockCaptainBtn.disabled = false;
        }
      }

      updateLockedPlayersCount();

      var remianingSalaryHolder = $(".remaining-salary-container .remaining-salary");
      if (remianingSalaryHolder) {
        if (state.currentProvider === "DK") {
          DKSalary += salary;
          remianingSalaryHolder.innerHTML = "$" + DKSalary;
        } else {
          FDSalary += salary;
          remianingSalaryHolder.innerHTML = "$" + FDSalary;
        }
      }

      // For classic mode only: update position constraints and opacity
      if (!isShowdown) {
        var playersListContainers = $(".players-list-table tbody");
        if (state.lockedPositionConstraint[position]) {
          state.lockedPositionConstraint[position] -= 1;
        }
        if (playersListContainers) {
          playersListContainers = playersListContainers.children;
          for (var i = 0; i < playersListContainers.length; i++) {
            var playerDataset = playersListContainers[i].dataset;
            if (playerDataset.playercode !== dataset.playercode && playerDataset.playerposition === position) {
              playersListContainers[i].style.opacity = "1";
            }
          }
        }
      }
    }
  }

  function lockCaptainPlayer(e) {
    if (state.lineups.length > 0 && desktop) {
      hideUnhideRebuildButtonOnPlayerSelectionChange();
    } else if (state.lineups.length > 0 && !desktop) {
      setSelectionChangedFlag();
    }

    var player = e.target.closest(".single-player-row");
    if (player) {
      var dataset = player.dataset;

      // A player locked as normal player cannot be locked as captain
      if (state.lockedPlayers.includes(dataset.playercode)) return;

      // Check max locked players limit (only if no captain currently set)
      if (!state.captainPlayer && getShowdownLockedCount() >= getMaxLockedPlayers()) return;

      // Check team constraint (max 5 from a team)
      var playerTeam = getPlayerTeamFromRow(player);
      var teamCount = getLockedPlayersCountByTeam(playerTeam);
      // If switching captains, check if new captain's team would exceed limit
      if (state.captainPlayer) {
        var prevCaptainRow = $(".players-list-table tbody tr[data-playercode='" + state.captainPlayer + "']");
        var prevCaptainTeam = prevCaptainRow ? getPlayerTeamFromRow(prevCaptainRow) : "";
        // If same team, count stays same; if different team, new team count increases
        if (prevCaptainTeam !== playerTeam && teamCount >= 5) return;
      } else {
        // No previous captain, just check the team count
        if (teamCount >= 5) return;
      }

      // If there's already a locked captain, unset the previous one first
      if (state.captainPlayer) {
        var prevCaptainRow = $(".players-list-table tbody tr[data-playercode='" + state.captainPlayer + "']");
        if (prevCaptainRow) {
          var prevLockBtn = prevCaptainRow.querySelector(".lock-captain-btn");
          var prevUnlockBtn = prevCaptainRow.querySelector(".unlock-captain-btn");
          if (prevLockBtn) removeClass(prevLockBtn, "hidden");
          if (prevUnlockBtn) addClass(prevUnlockBtn, "hidden");
          prevCaptainRow.classList.remove("captain-selected");
          // Re-enable previous captain's normal lock button
          var prevLockPlayerBtn = prevCaptainRow.querySelector(".lock-player-btn");
          if (prevLockPlayerBtn && !prevLockPlayerBtn.classList.contains("hidden")) {
            prevLockPlayerBtn.disabled = false;
          }
          // Re-enable previous captain's remove button
          var prevRemoveBtn = prevCaptainRow.querySelector(".actions-container .remove-player-btn");
          if (prevRemoveBtn) {
            prevRemoveBtn.disabled = false;
            prevRemoveBtn.style.opacity = "1";
          }
          // Add back previous captain's salary
          var prevCaptainSalary = parseInt(prevCaptainRow.dataset.mvpsalary) || 0;
          if (state.currentProvider === "DK") {
            DKSalary += prevCaptainSalary;
          } else {
            FDSalary += prevCaptainSalary;
          }
        }
      }

      state.captainPlayer = dataset.playercode;
      // For DK Showdown, use the CPT ID (which is different from FLEX ID)
      state.captainPlayerId = dataset.cptid || dataset.playercode;
      player.classList.add("captain-selected");

      // Deduct captain salary
      var captainSalary = parseInt(dataset.mvpsalary) || 0;
      var remainingSalaryHolder = $(".remaining-salary-container .remaining-salary");
      if (remainingSalaryHolder) {
        if (state.currentProvider === "DK") {
          DKSalary -= captainSalary;
          remainingSalaryHolder.innerHTML = "$" + DKSalary;
        } else {
          FDSalary -= captainSalary;
          remainingSalaryHolder.innerHTML = "$" + FDSalary;
        }
      }

      var lockCaptainBtn = player.querySelector(".lock-captain-btn");
      if (lockCaptainBtn) {
        addClass(lockCaptainBtn, "hidden");
      }

      var unlockCaptainBtn = player.querySelector(".unlock-captain-btn");
      if (unlockCaptainBtn) {
        removeClass(unlockCaptainBtn, "hidden");
      }

      // Disable normal lock button for captain
      var lockPlayerBtn = player.querySelector(".lock-player-btn");
      if (lockPlayerBtn) {
        lockPlayerBtn.disabled = true;
      }

      // Disable remove button for captain
      var removePlayerBtn = player.querySelector(".actions-container .remove-player-btn");
      if (removePlayerBtn) {
        removePlayerBtn.disabled = true;
        removePlayerBtn.style.opacity = "0.4";
      }

      // Disable all other captain lock buttons
      var allLockCaptainBtns = $all(".players-list-table tbody .lock-captain-btn");
      for (var i = 0; i < allLockCaptainBtns.length; i++) {
        var btn = allLockCaptainBtns[i];
        var row = btn.closest(".single-player-row");
        if (row && row.dataset.playercode !== dataset.playercode) {
          btn.disabled = true;
        }
      }

      updateLockedPlayersCount();

      trackGAEventForPage("lock_captain", {
        "selected_tab": getSelectedPlayerTab(),
        "position": dataset.playerposition,
        "build_count": state.buildCount,
      });
    }
  }

  function unlockCaptainPlayer(e) {
    if (state.lineups.length > 0 && desktop) {
      hideUnhideRebuildButtonOnPlayerSelectionChange();
    } else if (state.lineups.length > 0 && !desktop) {
      setSelectionChangedFlag();
    }

    var player = e.target.closest(".single-player-row");
    if (player) {
      var dataset = player.dataset;
      state.captainPlayer = null;
      state.captainPlayerId = null;
      player.classList.remove("captain-selected");

      var lockCaptainBtn = player.querySelector(".lock-captain-btn");
      if (lockCaptainBtn) {
        removeClass(lockCaptainBtn, "hidden");
      }

      var unlockCaptainBtn = player.querySelector(".unlock-captain-btn");
      if (unlockCaptainBtn) {
        addClass(unlockCaptainBtn, "hidden");
      }

      // Re-enable normal lock button for the unlocked captain
      var lockPlayerBtn = player.querySelector(".lock-player-btn");
      if (lockPlayerBtn) {
        lockPlayerBtn.disabled = false;
      }

      // Re-enable remove button for the unlocked captain
      var removePlayerBtn = player.querySelector(".actions-container .remove-player-btn");
      if (removePlayerBtn) {
        removePlayerBtn.disabled = false;
        removePlayerBtn.style.opacity = "1";
      }

      // Add back captain salary
      var captainSalary = parseInt(dataset.mvpsalary) || 0;
      var remainingSalaryHolder = $(".remaining-salary-container .remaining-salary");
      if (remainingSalaryHolder) {
        if (state.currentProvider === "DK") {
          DKSalary += captainSalary;
          remainingSalaryHolder.innerHTML = "$" + DKSalary;
        } else {
          FDSalary += captainSalary;
          remainingSalaryHolder.innerHTML = "$" + FDSalary;
        }
      }

      // Re-enable captain lock buttons (except for players who are locked as normal players)
      var allLockCaptainBtns = $all(".players-list-table tbody .lock-captain-btn");
      for (var i = 0; i < allLockCaptainBtns.length; i++) {
        var btn = allLockCaptainBtns[i];
        var row = btn.closest(".single-player-row");
        // Only enable if player is not locked as normal player
        if (row && !state.lockedPlayers.includes(row.dataset.playercode)) {
          btn.disabled = false;
        }
      }

      updateLockedPlayersCount();

      trackGAEventForPage("unlock_captain", {
        "selected_tab": getSelectedPlayerTab(),
        "position": dataset.playerposition,
        "build_count": state.buildCount,
      });
    }
  }

  function resetCaptainLockButtons() {
    // Re-enable all captain lock buttons and reset their state
    var allLockCaptainBtns = $all(".players-list-table tbody .lock-captain-btn");
    for (var i = 0; i < allLockCaptainBtns.length; i++) {
      allLockCaptainBtns[i].disabled = false;
      removeClass(allLockCaptainBtns[i], "hidden");
    }
    var allUnlockCaptainBtns = $all(".players-list-table tbody .unlock-captain-btn");
    for (var i = 0; i < allUnlockCaptainBtns.length; i++) {
      addClass(allUnlockCaptainBtns[i], "hidden");
    }
    // Remove captain-selected class from all rows
    var allCaptainSelectedRows = $all(".players-list-table tbody .captain-selected");
    for (var i = 0; i < allCaptainSelectedRows.length; i++) {
      allCaptainSelectedRows[i].classList.remove("captain-selected");
    }
    // Re-enable normal lock buttons
    var allLockPlayerBtns = $all(".players-list-table tbody .lock-player-btn");
    for (var i = 0; i < allLockPlayerBtns.length; i++) {
      allLockPlayerBtns[i].disabled = false;
    }
  }

  function resetAllLockButtons() {
    // Re-enable all lock buttons (captain and normal)
    var allLockCaptainBtns = $all(".players-list-table tbody .lock-captain-btn");
    for (var i = 0; i < allLockCaptainBtns.length; i++) {
      allLockCaptainBtns[i].disabled = false;
      removeClass(allLockCaptainBtns[i], "hidden");
    }

    var allUnlockCaptainBtns = $all(".players-list-table tbody .unlock-captain-btn");
    for (var i = 0; i < allUnlockCaptainBtns.length; i++) {
      addClass(allUnlockCaptainBtns[i], "hidden");
    }

    var allLockPlayerBtns = $all(".players-list-table tbody .lock-player-btn");
    for (var i = 0; i < allLockPlayerBtns.length; i++) {
      allLockPlayerBtns[i].disabled = false;
      removeClass(allLockPlayerBtns[i], "hidden");
    }

    var allUnlockPlayerBtns = $all(".players-list-table tbody .unlock-player-btn");
    for (var i = 0; i < allUnlockPlayerBtns.length; i++) {
      addClass(allUnlockPlayerBtns[i], "hidden");
    }

    var allRemovePlayerBtns = $all(".players-list-table tbody .remove-player-btn");
    for (var i = 0; i < allRemovePlayerBtns.length; i++) {
      allRemovePlayerBtns[i].disabled = false;
      allRemovePlayerBtns[i].style.opacity = "1";
    }

    // Remove captain-selected class from all rows
    var allCaptainSelectedRows = $all(".players-list-table tbody .captain-selected");
    for (var i = 0; i < allCaptainSelectedRows.length; i++) {
      allCaptainSelectedRows[i].classList.remove("captain-selected");
    }

    // Reset player row backgrounds
    var allPlayerRows = $all(".players-list-table tbody .single-player-row");
    for (var i = 0; i < allPlayerRows.length; i++) {
      allPlayerRows[i].style.background = "";
    }
  }

  function removePlayer(e) {
    var player = e.target.closest(".single-player-row");
    if (!player) return;

    var playerCode = player.dataset.playercode;

    // Prevent removing locked players (normal locked or captain)
    if (state.lockedPlayers.includes(playerCode) || state.captainPlayer === playerCode) {
      return;
    }

    if (state.lineups.length > 0 && desktop) {
      hideUnhideRebuildButtonOnPlayerSelectionChange();
    } else if (state.lineups.length > 0 && !desktop) {
      setSelectionChangedFlag();
    }

    if (player) {
      trackGAEventForPage("exclude_player", {
        "selected_tab": getSelectedPlayerTab(),
        "position": player.dataset.playerposition,
        "build_count": state.buildCount,
      });

      player.style.background = "#FFF6F6";
      state.removedPlayers.push(player.dataset.playercode);
      var actionsContainer = player.querySelector(".actions-container");
      if (actionsContainer) {
        addClass(actionsContainer, "hidden");
      }

      var addPlayerBtn = player.querySelector(".add-player-button");
      if (addPlayerBtn) {
        removeClass(addPlayerBtn, "hidden");
      }

      var excludedBtn = $(".players-category.excluded-players");
      if (excludedBtn) {
        excludedBtn.innerHTML = "Excluded(" + state.removedPlayers.length + ")";
      }
    }
  }

  function addPlayer(e) {
    if (state.lineups.length > 0 && desktop) {
      hideUnhideRebuildButtonOnPlayerSelectionChange();
    } else if (state.lineups.length > 0 && !desktop) {
      setSelectionChangedFlag();
    }

    var player = e.target.closest(".single-player-row");
    if (player) {
      trackGAEventForPage("include_player", {
        "selected_tab": getSelectedPlayerTab(),
        "position": player.dataset.playerposition,
        "build_count": state.buildCount,
      });

      player.style.background = "#fff";
      var index = state.removedPlayers.findIndex(function(item) {
        return item === player.dataset.playercode;
      });

      state.removedPlayers.splice(index, 1);
      var actionsContainer = player.querySelector(".actions-container");
      if (actionsContainer) {
        removeClass(actionsContainer, "hidden");
      }

      var addPlayerBtn = player.querySelector(".add-player-button");
      if (addPlayerBtn) {
        addClass(addPlayerBtn, "hidden");
      }

      var excludedBtn = $(".players-category.excluded-players");
      if (excludedBtn) {
        excludedBtn.innerHTML = "Excluded(" + state.removedPlayers.length + ")";
      }
    }
  }

  function hideUtilityContainer() {
    var utilityContainer = $(".refresh-lineup-download-csv-container");
    if (utilityContainer) {
      addClass(utilityContainer, "hidden");
    }

    var buildBottomBtn = $(".build-lineups-bottom");
    if (buildBottomBtn) {
      removeClass(buildBottomBtn, "hidden");
    }

    if (!desktop) {
      var buildBtn = $(".build-lineups");
      if (buildBtn) {
        removeClass(buildBtn, "hidden");
      }

      state.selectionsChanged = true;
    }
  }

  function decreaseLineupCount(e) {
    var countInput = $(".lineup-count-text-container .lineup-count-input");
    var decreaseCountBtn = e.target.closest(".lineup-count-text-container .decrease-count");
    if (countInput) {
      var countValue = parseInt(countInput.value);
      if (countValue >= 2) {
        state.lineupCount = countValue - 1;
        countInput.value = countValue - 1;
        if (decreaseCountBtn && countValue > 2) {
          decreaseCountBtn.disabled = false;
          decreaseCountBtn.style.opacity = "1";
        } else if (decreaseCountBtn && countValue == 2) {
          decreaseCountBtn.disabled = true;
          decreaseCountBtn.style.opacity = "0.4";
        }
      }

      trackGAEventForPage("decrease_no_of_lineups", {
        "count": countInput.value,
        "build_count": state.buildCount,
      });

      hideUtilityContainer();
    }
  }

  function increaseLineupCount(e) {
    var countInput = $(".lineup-count-text-container .lineup-count-input");
    var decreaseCountBtn = $(".lineup-count-text-container .decrease-count");
    var increaseCountBtn = $(".lineup-count-text-container .increase-count");
    if (countInput) {
      var countValue = parseInt(countInput.value);
      if (countValue >= 1 && countValue <= 150) {
        state.lineupCount = countValue + 1;
        countInput.value = countValue + 1;
        if (decreaseCountBtn) {
          decreaseCountBtn.disabled = false;
          decreaseCountBtn.style.opacity = "1";
        }

        if (increaseCountBtn) {
          increaseCountBtn.disabled = false;
        }
      } else if (countValue == 150) {
        countInput.value = 150;
        if (increaseCountBtn) {
          increaseCountBtn.disabled = true;
        }
      }

      trackGAEventForPage("increase_no_of_lineups", {
        "count": countInput.value,
        "build_count": state.buildCount,
      });

      hideUtilityContainer();
    }
  }

  function setLineupCount(e) {
    var decreaseCountBtn = $(".lineup-count-text-container .decrease-count");
    var increaseCountBtn = $(".lineup-count-text-container .increase-count");
    var countValue = parseInt(e.target.value);
    if (isNaN(countValue)) {
      e.target.value = "";
      return;
    }

    if (countValue <= 1) {
      decreaseCountBtn.disabled = true;
      decreaseCountBtn.style.opacity = "0.4";
      e.target.value = 1;
    }

    if (countValue > 150) {
      increaseCountBtn.disabled = true;
      increaseCountBtn.style.opacity = "0.4";
      e.target.value = 150;
    }

    if (countValue > 1 && countValue < 150) {
      decreaseCountBtn.disabled = false;
      decreaseCountBtn.style.opacity = "1";
      increaseCountBtn.disabled = false;
      increaseCountBtn.style.opacity = "1";
    }

    hideUtilityContainer();
  }

  function getMaxLockedPlayers() {
    // For showdown: max 4 locked players including captain
    // For classic: max 7 locked players
    return state.currentMatchType === "showdown" ? 4 : 7;
  }

  function getShowdownLockedCount() {
    // Count locked players including captain for showdown
    var count = state.lockedPlayers.length;
    if (state.captainPlayer) {
      count += 1;
    }
    return count;
  }

  function getPlayerTeamFromRow(playerRow) {
    // Get team from player row's team-name cell
    var teamCell = playerRow.querySelector(".team-name");
    return teamCell ? teamCell.textContent.trim() : "";
  }

  function getLockedPlayersCountByTeam(team) {
    // Count how many locked players are from a specific team (including captain)
    var count = 0;
    var playersTable = $(".players-list-table tbody");
    if (!playersTable) return count;

    // Check locked players
    for (var i = 0; i < state.lockedPlayers.length; i++) {
      var playerRow = playersTable.querySelector("tr[data-playercode='" + state.lockedPlayers[i] + "']");
      if (playerRow) {
        var playerTeam = getPlayerTeamFromRow(playerRow);
        if (playerTeam === team) count++;
      }
    }

    // Check captain
    if (state.captainPlayer) {
      var captainRow = playersTable.querySelector("tr[data-playercode='" + state.captainPlayer + "']");
      if (captainRow) {
        var captainTeam = getPlayerTeamFromRow(captainRow);
        if (captainTeam === team) count++;
      }
    }

    return count;
  }

  function updateLockedPlayersCount() {
    var maxLocked = getMaxLockedPlayers();
    var isShowdown = state.currentMatchType === "showdown";
    var currentCount = isShowdown ? getShowdownLockedCount() : state.lockedPlayers.length;
    var lockedPlayersCount = $(".remaining-salary-container .locked-players");
    if (lockedPlayersCount) {
      lockedPlayersCount.innerHTML = currentCount + "/" + maxLocked;
    }

    var lockedBtn = $(".players-category.locked-players");
    if (lockedBtn) {
      lockedBtn.innerHTML = "Locked(" + currentCount + ")";
    }

    // For showdown, update lock buttons opacity when max is reached
    if (isShowdown) {
      updateShowdownLockButtonsOpacity();
    }
  }

  function updateShowdownLockButtonsOpacity() {
    var currentCount = getShowdownLockedCount();
    var maxLocked = getMaxLockedPlayers();
    var isMaxReached = currentCount >= maxLocked;

    // Update all captain lock buttons
    var allLockCaptainBtns = $all(".players-list-table tbody .lock-captain-btn");
    for (var i = 0; i < allLockCaptainBtns.length; i++) {
      var btn = allLockCaptainBtns[i];
      var row = btn.closest(".single-player-row");
      var playerCode = row ? row.dataset.playercode : "";

      if (isMaxReached) {
        btn.disabled = true;
      } else {
        // Re-enable only if player is not locked as normal player and no captain is set
        var isLockedAsNormalPlayer = state.lockedPlayers.includes(playerCode);
        if (!isLockedAsNormalPlayer && !state.captainPlayer) {
          btn.disabled = false;
        }
      }
    }

    // Update all normal lock buttons
    var allLockPlayerBtns = $all(".players-list-table tbody .lock-player-btn");
    for (var i = 0; i < allLockPlayerBtns.length; i++) {
      var btn = allLockPlayerBtns[i];
      var row = btn.closest(".single-player-row");
      var playerCode = row ? row.dataset.playercode : "";

      if (isMaxReached) {
        btn.disabled = true;
      } else {
        // Re-enable only if player is not locked as captain
        var isLockedAsCaptain = state.captainPlayer === playerCode;
        var isAlreadyLocked = state.lockedPlayers.includes(playerCode);
        if (!isLockedAsCaptain && !isAlreadyLocked) {
          btn.disabled = false;
        }
      }
    }
  }

  function resetState(provider, keepMatchType) {
    state.currentProvider = provider;
    state.excludedTeams = [];
    state.removedPlayers = [];
    state.currentTeams = [];
    state.oppositionTeams = [];
    state.lockedPlayers = [];
    state.removedPlayers = [];
    state.captainPlayer = null;
    state.captainPlayerId = null;
    state.lineups = [];
    state.homeTeams = [];
    state.roadTeams = [];
    state.lockedPositionConstraint = {};
    if (!keepMatchType) {
      state.currentMatchType = "classic";
    }
  }

  function changeMatchType(e) {
    var matchType = e.target.value;
    state.currentMatchType = matchType;
    trackGAEventForPage("match_type_dropdown", {
      "item_name": matchType,
      "build_count": state.buildCount,
    });

    var dkSlates = $(".slates-filter .DK-slates-selection");
    var fdSlates = $(".slates-filter .FD-slates-selection");
    var showdownSlates = $(".slates-filter .showdown-slates-selection");
    var matchesContainer = $(".matches-container");

    if (matchType === "showdown") {
      // Hide classic slates, show showdown slates
      addClass(dkSlates, "hidden");
      addClass(fdSlates, "hidden");
      removeClass(showdownSlates, "hidden");
      removeClass(matchesContainer, "hidden");
      populateShowdownSlatesDropdown(state.currentProvider);
      // Show showdown matches for the current slate
      if (state.currentSlate) {
        showShowdownMatches(state.currentSlate, state.currentProvider);

        // Set currentTeams to only the two teams from the selected showdown match
        state.currentTeams = [];
        state.excludedTeams = [];
        var matchesListHolder = $(".matches-container .matches-holder");
        if (matchesListHolder) {
          var matches = matchesListHolder.children;
          for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            if (match.dataset.slatename === state.currentSlate &&
                match.dataset.provider === state.currentProvider &&
                match.dataset.matchtype === "showdown") {
              state.currentTeams.push(match.dataset.home);
              state.currentTeams.push(match.dataset.road);
              break;
            }
          }
        }
      }
    } else {
      // Show classic slates, hide showdown slates
      addClass(showdownSlates, "hidden");
      removeClass(matchesContainer, "hidden");
      populateSlatesDropdown(state.currentProvider);
    }

    // Reset state but keep match type
    state.lockedPlayers = [];
    state.removedPlayers = [];
    state.captainPlayer = null;
    state.captainPlayerId = null;
    state.lineups = [];
    state.lockedPositionConstraint = {};

    // Update excluded players count display
    var excludedBtn = $(".players-category.excluded-players");
    if (excludedBtn) {
      excludedBtn.innerHTML = "Excluded(0)";
    }

    // Reset remaining salary
    var remainingSalaryHolder = $(".remaining-salary-container .remaining-salary");
    if (remainingSalaryHolder) {
      if (state.currentProvider === "DK") {
        DKSalary = 50000;
        remainingSalaryHolder.innerHTML = "$" + DKSalary;
      } else {
        FDSalary = 60000;
        remainingSalaryHolder.innerHTML = "$" + FDSalary;
      }
    }

    // Update locked players count display
    updateLockedPlayersCount();
    clearLineupTable();
    hideUtilityContainer();
    fillPlayersTableData(state.currentProvider);

    // Reset all lock buttons after table is recreated
    resetAllLockButtons();
  }

  function populateShowdownSlatesDropdown(provider) {
    var showdownSlates = $(".slates-filter .showdown-slates-selection");
    if (showdownSlates) {
      showdownSlates.innerHTML = "";
      var firstSlate = null;

      // Filter showdown slates for current provider
      var filteredSlates = showdownSlatesList.filter(function(slate) {
        return slate.provider === provider;
      });

      // Create options with match names
      filteredSlates.forEach(function(slate) {
        // Use the match name as the display text
        var displayName = slate.match || slate.name;
        // Remove "Showdown" suffix if present for cleaner display
        displayName = displayName.replace(' Showdown', '').replace(' Sho', '').trim();

        if (!firstSlate) {
          firstSlate = slate.name;
        }
        var option = document.createElement("option");
        option.setAttribute("value", slate.name);
        option.innerHTML = displayName;
        showdownSlates.appendChild(option);
      });

      if (firstSlate) {
        state.currentSlate = firstSlate;
        disableBuildOptions(false);
      } else {
        disableBuildOptions(true);
      }
    }
  }

  function showShowdownSlateMatches(e) {
    var selectedSlate = e.target.value;
    state.currentSlate = selectedSlate;
    trackGAEventForPage("showdown_slate_dropdown", {
      "item_name": selectedSlate,
      "build_count": state.buildCount,
    });

    // Reset locked/removed players when slate changes
    state.lockedPlayers = [];
    state.removedPlayers = [];
    state.captainPlayer = null;
    state.captainPlayerId = null;

    // Update excluded players count display
    var excludedBtn = $(".players-category.excluded-players");
    if (excludedBtn) {
      excludedBtn.innerHTML = "Excluded(0)";
    }

    // Reset remaining salary
    var remainingSalaryHolder = $(".remaining-salary-container .remaining-salary");
    if (remainingSalaryHolder) {
      if (state.currentProvider === "DK") {
        DKSalary = 50000;
        remainingSalaryHolder.innerHTML = "$" + DKSalary;
      } else {
        FDSalary = 60000;
        remainingSalaryHolder.innerHTML = "$" + FDSalary;
      }
    }

    // Show the match for selected showdown slate
    showShowdownMatches(selectedSlate, state.currentProvider);

    // Set currentTeams to only the two teams from the selected showdown match
    state.currentTeams = [];
    state.excludedTeams = [];
    var matchesListHolder = $(".matches-container .matches-holder");
    if (matchesListHolder) {
      var matches = matchesListHolder.children;
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        if (match.dataset.slatename === selectedSlate &&
            match.dataset.provider === state.currentProvider &&
            match.dataset.matchtype === "showdown") {
          state.currentTeams.push(match.dataset.home);
          state.currentTeams.push(match.dataset.road);
          break;
        }
      }
    }

    updateLockedPlayersCount();
    clearLineupTable();
    hideUtilityContainer();
    fillPlayersTableData(state.currentProvider);
    resetAllLockButtons();
  }

  function changeSlatesProvider(e) {
    var provider = e.target.value;
    trackGAEventForPage("website_dropdown", {
      "item_name": provider,
      "build_count": state.buildCount,
    });
    resetState(provider);

    // Check if the provider has classic slates
    var hasClassicSlates = false;
    if (slatesList && slatesList[provider]) {
      for (var slate in slatesList[provider]) {
        if (slatesList[provider][slate] && slatesList[provider][slate].length > 0) {
          hasClassicSlates = true;
          break;
        }
      }
    }

    // Check if the provider has showdown slates
    var providerShowdownSlates = showdownSlatesList.filter(function(slate) {
      return slate.provider === provider;
    });
    var hasShowdownSlates = providerShowdownSlates.length > 0;

    var matchTypeDropdown = $(".filters-holder #match-type");
    var dkSlates = $(".slates-filter .DK-slates-selection");
    var fdSlates = $(".slates-filter .FD-slates-selection");
    var showdownSlates = $(".slates-filter .showdown-slates-selection");
    var matchesContainer = $(".matches-container");

    // If no classic slates but showdown slates exist, switch to showdown mode
    if (!hasClassicSlates && hasShowdownSlates) {
      state.currentMatchType = "showdown";
      if (matchTypeDropdown) {
        matchTypeDropdown.value = "showdown";
      }
      // Set current slate to first showdown slate for this provider
      if (providerShowdownSlates[0]) {
        state.currentSlate = providerShowdownSlates[0].name;
      }
      // Hide classic slates, show showdown slates
      addClass(dkSlates, "hidden");
      addClass(fdSlates, "hidden");
      removeClass(showdownSlates, "hidden");
      removeClass(matchesContainer, "hidden");
      populateShowdownSlatesDropdown(provider);
      if (state.currentSlate) {
        showShowdownMatches(state.currentSlate, provider);

        // Set currentTeams from the showdown match
        state.currentTeams = [];
        state.excludedTeams = [];
        var matchesListHolder = $(".matches-container .matches-holder");
        if (matchesListHolder) {
          var matches = matchesListHolder.children;
          for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            if (match.dataset.slatename === state.currentSlate &&
                match.dataset.provider === provider &&
                match.dataset.matchtype === "showdown") {
              state.currentTeams.push(match.dataset.home);
              state.currentTeams.push(match.dataset.road);
              break;
            }
          }
        }
      }
    } else {
      // Default to classic mode
      state.currentMatchType = "classic";
      if (matchTypeDropdown) {
        matchTypeDropdown.value = "classic";
      }
      addClass(showdownSlates, "hidden");
      removeClass(matchesContainer, "hidden");
      populateSlatesDropdown(provider);
    }

    fillPlayersTableData(provider);
    DKSalary = 50000;
    FDSalary = 60000;
    var remainingSalaryHolder = $(".remaining-salary-container .remaining-salary");
    var draftkingsIcon = $(".website-icon.draftkings");
    var fanduelIcon = $(".website-icon.fanduel");
    if (remainingSalaryHolder) {
      if (provider == "DK") {
        remainingSalaryHolder.innerHTML = "$" + DKSalary;
        if (draftkingsIcon) {
          removeClass(draftkingsIcon, "hidden");
        }
        if (fanduelIcon) {
          addClass(fanduelIcon, "hidden");
        }
      } else if (provider == "FD") {
        remainingSalaryHolder.innerHTML = "$" + FDSalary;
        if (draftkingsIcon) {
          addClass(draftkingsIcon, "hidden");
        }
        if (fanduelIcon) {
          removeClass(fanduelIcon, "hidden");
        }
      }
    }

    updateLockedPlayersCount();
    clearLineupTable();
    hideUtilityContainer();
  }

  function applyPlayerPositionFilter(e) {
    var playerFilterPosition = e.target.dataset.position;
    trackGAEventForPage("pos_filter", {
      "item_name": playerFilterPosition,
      "build_count": state.buildCount,
    });

    var searchInputContainer = $(".player-search-container .player-search-input");
    if (searchInputContainer) {
      var searchInput = searchInputContainer.value.toLowerCase();
    }
    $all(".players-positions-filters-container .position-filter").forEach(function(filterBtn) {
      removeClass(filterBtn, "selected");
    });

    addClass(e.target, "selected");
    var playersContainers = $(".players-list-table tbody").children;
    if (playerFilterPosition == "All") {
      Array.from(playersContainers).forEach(function(player) {
        var playerName = player.dataset.playername.toLowerCase();
        if (playerName.includes(searchInput) || searchInput === "") {
          removeClass(player, "hidden");
        } else {
          addClass(player, "hidden");
        }
      });
    } else {
      Array.from(playersContainers).forEach(function(player) {
        var playerName = player.dataset.playername.toLowerCase();
        if (playerFilterPosition === "FLEX") {
          if (player.dataset.playerposition === "WR" || player.dataset.playerposition === "RB" || player
            .dataset.playerposition === "TE") {
            if (playerName.includes(searchInput) || searchInput === "") {
              removeClass(player, "hidden");
            } else {
              addClass(player, "hidden");
            }
          } else {
            addClass(player, "hidden");
          }
        } else {
          if (player.dataset.playerposition === playerFilterPosition) {
            if (playerName.includes(searchInput) || searchInput === "") {
              removeClass(player, "hidden");
            } else {
              addClass(player, "hidden");
            }
          } else {
            addClass(player, "hidden");
          }
        }
      });
    }
  }

  function searchPlayer(e) {
    var searchInput = e.target.value.toLowerCase();
    if (searchInput.length === 1) {
      trackGAEventForPage("search_player", {
        "build_count": state.buildCount,
      });
    }
    var selectedFilterPosition = $(".position-filter.selected").dataset.position;
    var playersContainers = $(".players-list-table tbody").children;

    Array.from(playersContainers).forEach(function(player) {
      var playerPosition = player.dataset.playerposition;
      var playerName = player.dataset.playername.toLowerCase();

      if ((playerPosition === selectedFilterPosition || selectedFilterPosition === "FLEX") &&
        searchInput === "") {
        removeClass(player, "hidden");
      } else if ((playerPosition === selectedFilterPosition || selectedFilterPosition ===
          "FLEX" || selectedFilterPosition === "All") && searchInput !== "") {
        if (selectedFilterPosition === "FLEX") {
          if (playerPosition === "WR" || playerPosition === "RB" || player
            .dataset.playerposition === "TE") {
            if (playerName.includes(searchInput)) {
              removeClass(player, "hidden");
            } else {
              addClass(player, "hidden");
            }
          }
        } else if (playerPosition === selectedFilterPosition || selectedFilterPosition === "All") {
          if (playerName.includes(searchInput)) {
            removeClass(player, "hidden");
          } else {
            addClass(player, "hidden");
          }
        }
      }
    });
  }

  function applyPlayerCategoryFilter(e) {
    var category = e.target.dataset.players;
    var filtersBar = $(".player-positions-filters-search-container");
    var playersContainers = $(".players-list-table tbody").children;

    $all(".players-category-buttons-container .players-category").forEach(function(playersCategory) {
      removeClass(playersCategory, "selected");
    });

    addClass(e.target, "selected");

    if (category === "All" && e.target.dataset.triggerevent === "false") {
      e.target.dataset.triggerevent = "true";
    } else {
      trackGAEventForPage("pool_player_tab", {
        "item_name": category,
        "build_count": state.buildCount,
      });
    }

    if (category === "Locked") {
      if (!desktop) {
        var playersTable = $(".players-list-table");
        if (playersTable) {
          removeClass(playersTable, "hidden");
        }

        var lineupTable = $(".lineups-table");
        if (lineupTable) {
          addClass(lineupTable, "hidden");
        }

        var utilityContainer = $(".refresh-lineup-download-csv-container");
        if (utilityContainer) {
          addClass(utilityContainer, "hidden");
        }

        var buildBtn = $(".build-lineups");
        if (buildBtn) {
          removeClass(buildBtn, "hidden");
        }

        var remainingSalaryContainer = $(
          ".players-category-remaining-salary-container .remaining-salary-container");
        if (remainingSalaryContainer) {
          addClass(remainingSalaryContainer, "hidden");
        }

        var lineupsPointsSalaryContainer = $(".points-salary-container");
        if (lineupsPointsSalaryContainer) {
          addClass(lineupsPointsSalaryContainer, "hidden");
        }
      }

      if (filtersBar) {
        addClass(filtersBar, "hidden");
      }
      e.target.innerHTML = "Locked(" + state.lockedPlayers.length + ")";

      Array.from(playersContainers).forEach(function(player) {
        var hiddenLockPlayerBtn = player.querySelector(".lock-player-btn.hidden");
        if (hiddenLockPlayerBtn) {
          removeClass(player, "hidden");
        } else {
          addClass(player, "hidden");
        }
      });
    }

    if (category === "Excluded") {
      if (!desktop) {
        var playersTable = $(".players-list-table");
        if (playersTable) {
          removeClass(playersTable, "hidden");
        }

        var lineupTable = $(".lineups-table");
        if (lineupTable) {
          addClass(lineupTable, "hidden");
        }

        var utilityContainer = $(".refresh-lineup-download-csv-container");
        if (utilityContainer) {
          addClass(utilityContainer, "hidden");
        }

        var buildBtn = $(".build-lineups");
        if (buildBtn) {
          removeClass(buildBtn, "hidden");
        }

        var remainingSalaryContainer = $(
          ".players-category-remaining-salary-container .remaining-salary-container");
        if (remainingSalaryContainer) {
          addClass(remainingSalaryContainer, "hidden");
        }

        var lineupsPointsSalaryContainer = $(".points-salary-container");
        if (lineupsPointsSalaryContainer) {
          addClass(lineupsPointsSalaryContainer, "hidden");
        }
      }

      if (filtersBar) {
        addClass(filtersBar, "hidden");
      }
      e.target.innerHTML = "Excluded(" + state.removedPlayers.length + ")";

      Array.from(playersContainers).forEach(function(player) {
        var hiddenActionsContainer = player.querySelector(".actions-container.hidden");
        if (hiddenActionsContainer) {
          removeClass(player, "hidden");
        } else {
          addClass(player, "hidden");
        }
      });
    }

    if (category === "All") {
      if (!desktop) {
        var playersTable = $(".players-list-table");
        if (playersTable) {
          removeClass(playersTable, "hidden");
        }

        var lineupTable = $(".lineups-table");
        if (lineupTable) {
          addClass(lineupTable, "hidden");
        }

        var positionFilters = $(".players-positions-filters-container");
        if (positionFilters) {
          removeClass(positionFilters, "hidden");
        }

        var lineupFilters = $(".lineups-buttons-container");
        if (lineupFilters) {
          addClass(lineupFilters, "hidden");
        }
      }

      if (filtersBar) {
        removeClass(filtersBar, "hidden");
      }

      var positionFilters = $(".players-positions-filters-container").children;
      if (positionFilters) {
        Array.from(positionFilters).forEach(function(filterBtn) {
          removeClass(filterBtn, "selected");
        });

        addClass(positionFilters[0], "selected");
      }

      var searchInput = $(".player-search-container .player-search-input");
      if (searchInput) {
        searchInput.innerHTML = "";
      }

      Array.from(playersContainers).forEach(function(player) {
        removeClass(player, "hidden");
      });

      if (!desktop) {
        var lineupsFilters = $(".lineups-list-container .lineups-buttons-container");
        if (lineupsFilters) {
          addClass(lineupsFilters, "hidden");
        }

        var positionFilters = $(".players-positions-filters-container");
        if (positionFilters) {
          removeClass(positionFilters, "hidden");
        }

        var utilityContainer = $(".refresh-lineup-download-csv-container");
        if (utilityContainer) {
          addClass(utilityContainer, "hidden");
        }

        var buildBtn = $(".build-lineups");
        if (buildBtn) {
          removeClass(buildBtn, "hidden");
        }

        var remainingSalaryContainer = $(
          ".players-category-remaining-salary-container .remaining-salary-container");
        if (remainingSalaryContainer) {
          removeClass(remainingSalaryContainer, "hidden");
        }

        var lineupsPointsSalaryContainer = $(".points-salary-container");
        if (lineupsPointsSalaryContainer) {
          addClass(lineupsPointsSalaryContainer, "hidden");
        }
      }
    }

    if (category === "Lineups") {
      var playersTable = $(".players-list-table");
      if (playersTable) {
        addClass(playersTable, "hidden");
      }

      var lineupTable = $(".lineups-table");
      if (lineupTable) {
        removeClass(lineupTable, "hidden");
      }

      var positionFilters = $(".players-positions-filters-container");
      if (positionFilters) {
        addClass(positionFilters, "hidden");
      }

      var lineupFilters = $(".lineups-buttons-container");
      if (lineupFilters) {
        removeClass(lineupFilters, "hidden");
      }

      if (filtersBar) {
        removeClass(filtersBar, "hidden");
      }

      var positionFilters = $(".players-positions-filters-container").children;
      if (positionFilters) {
        Array.from(positionFilters).forEach(function(filterBtn) {
          removeClass(filterBtn, "selected");
        });

        addClass(positionFilters[3], "selected");
      }

      var searchInput = $(".player-search-container .player-search-input");
      if (searchInput) {
        searchInput.innerHTML = "";
      }

      Array.from(playersContainers).forEach(function(player) {
        removeClass(player, "hidden");
      });

      var lineupsFilters = $(".lineups-list-container .lineups-buttons-container");
      if (lineupsFilters) {
        removeClass(lineupsFilters, "hidden");
      }

      var positionFilters = $(".players-positions-filters-container");
      if (positionFilters) {
        addClass(positionFilters, "hidden");
      }

      var utilityContainer = $(".refresh-lineup-download-csv-container");
      var buildBtn = $(".build-lineups");
      if (utilityContainer) {
        if (!state.selectionsChanged) {
          removeClass(utilityContainer, "hidden");
          if (buildBtn) {
            addClass(buildBtn, "hidden");
          }
        }
      }

      var remainingSalaryContainer = $(
        ".players-category-remaining-salary-container .remaining-salary-container");
      if (remainingSalaryContainer) {
        addClass(remainingSalaryContainer, "hidden");
      }

      var lineupsPointsSalaryContainer = $(".points-salary-container");
      if (lineupsPointsSalaryContainer) {
        removeClass(lineupsPointsSalaryContainer, "hidden");
      }
    }
  }

  function createLineupSelectionButtons(lineups) {
    var buttonsContainer = $(".players-lineups-container .lineups-buttons-container");
    var buttonsHolder;
    if (buttonsContainer) {
      removeClass(buttonsContainer, "hidden");
      buttonsHolder = buttonsContainer.querySelector(".lineups-buttons-holder");
      if (buttonsHolder) {
        if (!desktop) {
          var playerFiltersContainer = $(".players-positions-filters-container");
          if (playerFiltersContainer) {
            addClass(playerFiltersContainer, "hidden");
          }
        }
        var existingButtonsCount = buttonsHolder.children.length;
        lineups.forEach(function(lineup) {
          var selectionButton = document.createElement("button");
          selectionButton.addEventListener("click", showLineupData)
          selectionButton.dataset.index = existingButtonsCount;
          addClass(selectionButton, "lineup-selection-btn");
          if (existingButtonsCount === 0) {
            addClass(selectionButton, "selected");
          }
          existingButtonsCount += 1;
          selectionButton.dataset.lineup = existingButtonsCount;
          selectionButton.innerHTML = existingButtonsCount;
          buttonsHolder.appendChild(selectionButton);
        });
      }
    }
  }

  function showLineupData(e) {
    var index;
    state.autoSubstitutePlayers = [];
    var lineupButtonsContainer = $(".lineups-buttons-container");
    if (lineupButtonsContainer) {
      removeClass(lineupButtonsContainer, "hidden");
    }
    if (e) {
      index = e.target.dataset.index;
      if (lineupButtonsContainer) {
        var lineupButtonsHolder = lineupButtonsContainer.querySelector(".lineups-buttons-holder");
        lineupButtonsHolder = lineupButtonsHolder.children
        for (var i = 0; i < lineupButtonsHolder.length; i++) {
          removeClass(lineupButtonsHolder[i], "selected");
        }

        addClass(e.target, "selected");
      }

      trackGAEventForPage("lineups_nav", {
        "item_nnumber": index + 1,
        "build_count": state.buildCount,
      });

    }

    if (state.refreshIndex) {
      index = state.refreshIndex;
      state.refreshIndex = "";
    } else if (!index) {
      index = 0;
    }

    var listBody = $(".lineups-table tbody");
    if (!desktop) {
      var lineupTable = $(".lineups-table");
      if (lineupTable) {
        removeClass(lineupTable, "hidden");
      }
      var playersTable = $(".players-list-table");
      if (playersTable) {
        addClass(playersTable, "hidden");
      }
    }

    if (listBody) {
      listBody.innerHTML = "";
    }
    var data = state.lineups[parseInt(index)];
    var slateText;
    var playerCode;
    var isShowdown = state.currentMatchType === "showdown";
    if (state.currentSlate.includes("Classic")) {
      slateText = state.currentSlate.replace("Classic", "");
      playerCode = slateText + "Code";
    } else {
      slateText = state.currentSlate + " ";
      playerCode = state.currentSlate + " Code";
    }
    var totalSalary = 0;
    var totalPoints = data[data.length - 1][1]; // Last element is always the total

    // Use showdownPlayersList for showdown mode, playersList for classic
    var currentPlayerSource = isShowdown ? (showdownPlayersList[state.currentProvider] || []) : playersList;

    var playersData = [];
    if (isShowdown) {
      // For showdown: first player is CPT/MVP, rest are FLEX
      // DK uses separate CPT ID, FD uses _MVP suffix
      for (var i = 0; i < data.length - 1; i++) {
        var responseId = data[i][0];
        var isCaptainSlot = (i === 0);

        // For FD, MVP IDs have _MVP suffix - strip it to get base ID
        var isFdMvp = responseId.endsWith("_MVP");
        var baseResponseId = isFdMvp ? responseId.replace("_MVP", "") : responseId;

        for (var j = 0; j < currentPlayerSource.length; j++) {
          var playerId = currentPlayerSource[j]["ID"] || currentPlayerSource[j]["id"] || "";
          var cptId = currentPlayerSource[j]["CPT ID"] || playerId;

          var matched = false;
          if (state.currentProvider === "DK") {
            // DK: match CPT slot by CPT ID, FLEX by regular ID
            var matchId = isCaptainSlot ? cptId : playerId;
            matched = (matchId === responseId);
          } else {
            // FD: MVP has _MVP suffix, match by base ID
            matched = (playerId === baseResponseId);
          }

          if (matched) {
            var playerCopy = Object.assign({}, currentPlayerSource[j]);
            playerCopy.Points = data[i][1];
            playerCopy._isCaptain = isCaptainSlot;
            playersData.push(playerCopy);
            break;
          }
        }
      }
    } else {
      // Classic mode: match by slate-specific player code
      for (var i = 0; i < data.length - 1; i++) {
        for (var j = 0; j < currentPlayerSource.length; j++) {
          if (currentPlayerSource[j][playerCode] === data[i][0]) {
            currentPlayerSource[j].Points = data[i][1];
            playersData.push(currentPlayerSource[j]);
            break;
          }
        }
      }
    }

    var playersDataSorted = [];
    if (isShowdown) {
      // For showdown, players are already in correct order (CPT first, then FLEX)
      playersDataSorted = playersData;
    } else {
      // Classic mode: sort by position
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < playersData.length; j++) {
          if (i == 0 && playersData[j].Position == "QB") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 1 && playersData[j].Position == "RB") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 2 && playersData[j].Position == "RB") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 3 && playersData[j].Position == "WR") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 4 && playersData[j].Position == "WR") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 5 && playersData[j].Position == "WR") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 6 && playersData[j].Position == "TE") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 7 && (playersData[j].Position == "RB" || playersData[j].Position == "WR" || playersData[j]
              .Position == "TE")) {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 8 && playersData[j].Position == "DST") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
        }
      }
    }

    for (var i = 0; i < playersDataSorted.length; i++) {
      var salaryText;
      var pointsText;
      var playerSalary;
      var playerNameValue;
      var playerCodeValue;
      var displayPosition;

      if (isShowdown) {
        // Showdown: use CPT Salary for captain, regular Salary for FLEX
        playerSalary = playersDataSorted[i]._isCaptain
          ? (playersDataSorted[i]["CPT Salary"] || playersDataSorted[i]["MVP Salary"] || playersDataSorted[i]["Salary"])
          : playersDataSorted[i]["Salary"];
        playerNameValue = playersDataSorted[i]["Name"] || playersDataSorted[i]["Player"] || "";
        playerCodeValue = playersDataSorted[i]._isCaptain
          ? (playersDataSorted[i]["CPT ID"] || playersDataSorted[i]["ID"] || playersDataSorted[i]["id"])
          : (playersDataSorted[i]["ID"] || playersDataSorted[i]["id"]);
        displayPosition = playersDataSorted[i]._isCaptain ? "CPT" : "FLEX";
      } else {
        salaryText = slateText + "Salary";
        pointsText = state.currentProvider + " Scoring";
        playerSalary = playersDataSorted[i][salaryText];
        playerNameValue = playersDataSorted[i].Player;
        playerCodeValue = playersDataSorted[i][playerCode];
        displayPosition = (i == 7) ? "FLEX" : playersDataSorted[i].Position;
      }

      totalSalary += parseInt(playerSalary) || 0;
      var singlePlayerRow = document.createElement("tr");
      if (!isShowdown && i == 7) {
        singlePlayerRow.dataset.flex = true;
      }
      singlePlayerRow.dataset.playercode = playerCodeValue;
      addClass(singlePlayerRow, "lineup-single-player-row");

      if (desktop) {
        var positionHolder = document.createElement("td");
        addClass(positionHolder, "lineup-player-position");
        positionHolder.innerHTML = displayPosition;
        singlePlayerRow.dataset.position = displayPosition;
        singlePlayerRow.appendChild(positionHolder);
      }

      var playerDetailsHolder = document.createElement("td");
      addClass(playerDetailsHolder, "lineup-player-details-holder");
      var playerDetailsContainer = document.createElement("div");
      addClass(playerDetailsContainer, "lineup-player-details-container");

      var playerName = document.createElement("span");
      addClass(playerName, "lineup-player-name");
      playerName.innerHTML = playerNameValue;
      playerDetailsContainer.appendChild(playerName);
      singlePlayerRow.dataset.playername = playerNameValue;

      var playerTeamsContainer = document.createElement("div");
      addClass(playerTeamsContainer, "lineup-teams-container");
      if (!desktop) {
        var positionHolder = document.createElement("span");
        addClass(positionHolder, "lineup-player-position");
        positionHolder.innerHTML = displayPosition;
        singlePlayerRow.dataset.position = displayPosition;
        playerTeamsContainer.appendChild(positionHolder);

        var separator = document.createElement("span");
        addClass(separator, "player-details-separator");
        separator.innerHTML = "&bull;";
        playerTeamsContainer.appendChild(separator);
      }
      var playerTeam = document.createElement("span");
      addClass(playerTeam, "lineup-team");
      addClass(playerTeam, "home");
      playerTeam.innerHTML = playersDataSorted[i].Team;
      playerTeamsContainer.appendChild(playerTeam);
      var oppTeam = document.createElement("span");
      addClass(oppTeam, "lineup-team");
      addClass(oppTeam, "road");
      if (state.homeTeams.includes(state.oppositionTeams[playersDataSorted[i].Team])) {
        sign = "@ ";
      } else {
        sign = "vs ";
      }
      oppTeam.innerHTML = sign + state.oppositionTeams[playersDataSorted[i].Team];
      playerTeamsContainer.appendChild(oppTeam);

      playerDetailsContainer.appendChild(playerTeamsContainer);
      playerDetailsHolder.appendChild(playerDetailsContainer);
      singlePlayerRow.appendChild(playerDetailsHolder);

      var playerSalaryHolder = document.createElement("td");
      addClass(playerSalaryHolder, "lineup-player-salary");
      playerSalaryHolder.innerHTML = "$" + playerSalary;
      singlePlayerRow.appendChild(playerSalaryHolder);
      singlePlayerRow.dataset.salary = playerSalary;

      var playerPointsValueHolder = document.createElement("td");
      addClass(playerPointsValueHolder, "lineup-player-points-value")
      var playerPointsValueContainer = document.createElement("div");
      addClass(playerPointsValueContainer, "player-points-value-container");

      var playerPoints = document.createElement("span");
      addClass(playerPoints, "lineup-player-points");
      playerPoints.innerHTML = playersDataSorted[i].Points.toFixed(2);
      playerPointsValueContainer.appendChild(playerPoints);
      singlePlayerRow.dataset.points = playersDataSorted[i].Points.toFixed(2);

      var playerValue = document.createElement("span");
      addClass(playerValue, "lineup-player-value");
      addClass(playerValue, "hidden");
      var playerValueData;
      if (isShowdown) {
        playerValueData = playersDataSorted[i]["Value"] || 0;
      } else {
        var valueText = slateText + "Value";
        playerValueData = playersDataSorted[i][valueText];
      }
      if (playerValueData === "#DIV/0!") {
        playerValue.innerHTML = 0;
      } else {
        playerValue.innerHTML = playerValueData;
      }
      playerPointsValueContainer.appendChild(playerValue);
      singlePlayerRow.dataset.value = playerValueData;

      playerPointsValueHolder.appendChild(playerPointsValueContainer);
      singlePlayerRow.appendChild(playerPointsValueHolder);

      var actionsHolder = document.createElement("td");
      var actionsContainer = document.createElement("div");
      addClass(actionsContainer, "actions-container");

      // Check if player is locked (either as normal locked player or as captain)
      var isPlayerLocked = state.lockedPlayers.includes(playerCodeValue);
      var isCaptainLocked = isShowdown && playersDataSorted[i]._isCaptain && state.captainPlayer;

      if (isPlayerLocked || isCaptainLocked) {
        singlePlayerRow.style.background = "#F8FFFD";
        var lockedPlayerIcon = document.createElement("img");
        addClass(lockedPlayerIcon, "lineup-locked-icon");
        lockedPlayerIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/locked-icon.png");
        lockedPlayerIcon.setAttribute("width", "16");
        lockedPlayerIcon.setAttribute("height", "13");
        lockedPlayerIcon.setAttribute("alt", "locked icon");

        actionsContainer.appendChild(lockedPlayerIcon);
      } else {
        var removePlayerButton = document.createElement("button");
        removePlayerButton.addEventListener("click", showSubstitutionPlayerSelectionPopup);
        addClass(removePlayerButton, "lineup-remove-player-btn");
        var removeIcon = document.createElement("img");
        addClass(removeIcon, "lineup-remove-icon");
        removeIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/remove-icon.png");
        removeIcon.setAttribute("width", "16");
        removeIcon.setAttribute("height", "16");
        removeIcon.setAttribute("alt", "remove player icon");
        removePlayerButton.appendChild(removeIcon);

        actionsContainer.appendChild(removePlayerButton);

        var addSubstitutePlayerButton = document.createElement("button");
        addSubstitutePlayerButton.addEventListener("click", addSubstitutedLineupPlayer);
        addClass(addSubstitutePlayerButton, "lineup-add-substituted-player-btn");
        addClass(addSubstitutePlayerButton, "hidden");
        var substitutePlayerIcon = document.createElement("img");
        addClass(substitutePlayerIcon, "lineup-substitute-player-icon");
        substitutePlayerIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/substitute-player.png");
        substitutePlayerIcon.setAttribute("width", "16");
        substitutePlayerIcon.setAttribute("height", "10");
        substitutePlayerIcon.setAttribute("alt", "substitute icon");
        addSubstitutePlayerButton.appendChild(substitutePlayerIcon);

        actionsContainer.appendChild(addSubstitutePlayerButton);
      }

      actionsHolder.appendChild(actionsContainer);
      singlePlayerRow.appendChild(actionsHolder);
      listBody.appendChild(singlePlayerRow);

      var remainingSalaryHolder = $(".remaining-salary-holder .remaining-salary-amount");
      var pointsHolder = $(".remaining-points-container .remaining-points-count");
      if (pointsHolder) {
        pointsHolder.innerHTML = totalPoints.toFixed(2) + " FP";
        pointsHolder.dataset.totalpoints = totalPoints.toFixed(2);
      }
      if (remainingSalaryHolder) {
        if (state.currentProvider === "DK") {
          remainingSalaryHolder.innerHTML = "$" + (50000 - totalSalary);
          remainingSalaryHolder.dataset.remainingsalary = 50000 - totalSalary;
        } else if (state.currentProvider === "FD") {
          remainingSalaryHolder.innerHTML = "$" + (60000 - totalSalary);
          remainingSalaryHolder.dataset.remainingsalary = 60000 - totalSalary;
        }
      }
    }

    var pointsValueSelect = $(".lineups-table .player-points-value-select");
    if (pointsValueSelect) {
      pointsValueSelect.value = "FPTS";
    }
  }

  function substitutePlayerAndReplaceDuplicateLineups(e) {
    var substitute = e.target.closest(".substitute-players-list tr");
    var dataset;
    if (substitute) {
      dataset = substitute.dataset;
    }

    trackGAEventForPage("manual_substitute", {
      "item_number": dataset.index,
      "build_count": state.buildCount,
    });

    removePlayerSubstitutionContainer();
    var whiteOverlay = $(".white-overlay");
    if (whiteOverlay) {
      removeClass(whiteOverlay, "hidden");
    } else {
      whiteOverlay = document.createElement("div");
      addClass(whiteOverlay, "white-overlay");
      var overlayText = document.createElement("span");
      overlayText.innerHTML = "Removing duplicate...";
      addClass(overlayText, "overlayText");
      whiteOverlay.appendChild(overlayText);
      document.body.appendChild(whiteOverlay);
    }

    var remainingSalaryHolder = $(".remaining-salary-holder .remaining-salary-amount");
    if (remainingSalaryHolder) {
      var remSalary = (parseInt(state.substitutedPlayer.salary) + parseInt(remainingSalaryHolder.dataset
        .remainingsalary)) - parseInt(dataset.salary);
      remainingSalaryHolder.innerHTML = "$" + remSalary;
      remainingSalaryHolder.dataset.remainingsalary = remSalary;
    }

    var pointsHolder = $(".remaining-points-container .remaining-points-count");
    if (pointsHolder) {
      var totalpoints = (parseFloat(pointsHolder.dataset.totalpoints) - parseFloat(state.substitutedPlayer
        .points)) + parseFloat(dataset.points);
      pointsHolder.innerHTML = "$" + totalpoints.toFixed(2);
      pointsHolder.dataset.totalpoints = totalpoints.toFixed(2);
    }

    var lineupPlayers = $all(".lineups-table tr.lineup-single-player-row");
    var lineupDataset;
    if (lineupPlayers) {
      for (var i = 0; i < lineupPlayers.length; i++) {
        lineupDataset = lineupPlayers[i].dataset;
        if (lineupDataset.playercode === state.substitutedPlayer.playercode) {
          var playerPosition = lineupPlayers[i].querySelector(".lineup-player-position");
          if (playerPosition) {
            if (i == 7) {
              playerPosition.innerHTML = "FLEX";
              lineupPlayers[i].dataset.position = "FLEX";
            } else {
              playerPosition.innerHTML = dataset.position;
              lineupPlayers[i].dataset.position = dataset.position;
            }
          }

          var playerName = lineupPlayers[i].querySelector(".lineup-player-name");
          if (playerName) {
            playerName.innerHTML = dataset.playername;
            lineupPlayers[i].dataset.playername = dataset.playername;
            lineupPlayers[i].dataset.playercode = state.substitutedPlayer.playercode;
          }

          var playerHomeTeam = lineupPlayers[i].querySelector(".lineup-team.home");
          if (playerHomeTeam) {
            playerHomeTeam.innerHTML = dataset.team;
          }

          var playerOppTeam = lineupPlayers[i].querySelector(".lineup-team.road");
          if (playerOppTeam) {
            if (state.homeTeams.includes(state.oppositionTeams[playerOppTeam])) {
              sign = "@ ";
            } else {
              sign = "vs ";
            }
            playerOppTeam.innerHTML = sign + " " + state.oppositionTeams[dataset.team];
          }

          var playerSalary = lineupPlayers[i].querySelector(".lineup-player-salary");
          if (playerSalary) {
            playerSalary.innerHTML = "$" + dataset.salary;
            lineupPlayers[i].dataset.salary = dataset.salary;
          }

          var playerPoints = lineupPlayers[i].querySelector(".lineup-player-points");
          if (playerPoints) {
            playerPoints.innerHTML = dataset.points;
            lineupPlayers[i].dataset.points = dataset.points;
          }

          var playerValue = lineupPlayers[i].querySelector(".lineup-player-value");
          if (playerValue) {
            playerValue.innerHTML = dataset.value;
            lineupPlayers[i].dataset.value = dataset.value;
          }
          break;
        }
      }

      var selectedLineupBtn = $(".lineup-selection-btn.selected");
      var lineupIndex;
      if (selectedLineupBtn) {
        lineupIndex = selectedLineupBtn.dataset.index;
      }

      var lineup = state.lineups[lineupIndex];
      for (var i = 0; i < (lineup.length - 1); i++) {
        if (lineup[i][0] == state.substitutedPlayer.playercode) {
          lineup[i][0] = dataset.playercode;
          break;
        }
      }

      calculateDuplicateLineups();
    }
  }

  function calculateDuplicateLineups() {
    var selectedLineupBtn = $(".lineup-selection-btn.selected");
    var lineupIndex;
    if (selectedLineupBtn) {
      lineupIndex = selectedLineupBtn.dataset.index;
    }

    var currentLineup = state.lineups[lineupIndex];

    for (var i = 0; i < state.lineups.length; i++) {
      if (i === lineupIndex) continue;
      var currentLineupMatchCount;
      for (var j = 0; j < state.lineups[i].length - 1; j++) {
        currentLineupMatchCount = 0;
        for (var k = 0; k < currentLineup.length - 1; k++) {
          if (currentLineup[k][0] === state.lineups[i][j][0]) {
            currentLineupMatchCount += 1;
            break;
          }
        }
      }

      if (currentLineupMatchCount === 9) {
        state.refreshIndex = i;
        refreshLineup(true);
        break;
      }
    }

    var whiteOverlay = $(".white-overlay");
    if (whiteOverlay) {
      addClass(whiteOverlay, "hidden");
    }
  }

  function autoSubstitutePlayer(playerCode) {
    trackGAEventForPage("auto_substitute", {
      "build_count": state.buildCount,
    });

    var substitutionBtn = $(".player-substitution-container .auto-substitute-player-btn");
    if (substitutionBtn) {
      substitutionBtn.innerHTML = "Fetching Substitute...";
      addClass(substitutionBtn, "blinker");
    }

    var playersContainers = $all(".lineups-table tbody tr");
    var lockedPlayers = [];
    var excludedPlayers = [];
    var selectedLineupBtn = $(".lineup-selection-btn.selected");
    if (selectedLineupBtn) {
      state.refreshIndex = selectedLineupBtn.dataset.index;
    }

    if (playersContainers) {
      for (var i = 0; i < playersContainers.length; i++) {
        var dataset = playersContainers[i].dataset;
        if (!(dataset.playercode === playerCode)) {
          lockedPlayers.push(dataset.playercode);
        } else {
          excludedPlayers.push(dataset.playercode);
        }
      }
    }

    for (var i = 0; i < state.removedPlayers.length; i++) {
      excludedPlayers.push(state.removedPlayers[i]);
    }

    for (var i = 0; i < state.lockedPlayers.length; i++) {
      // Don't include the player being substituted or duplicates in the include array
      if (state.lockedPlayers[i] !== playerCode && !lockedPlayers.includes(state.lockedPlayers[i])) {
        lockedPlayers.push(state.lockedPlayers[i]);
      }
    }

    var teams = [];

    for (var i = 0; i < state.currentTeams.length; i++) {
      var flag = true;
      for (j = 0; j < state.excludedTeams.length; j++) {
        if (state.excludedTeams[j] === state.currentTeams[i]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        teams.push(state.currentTeams[i]);
      }
    }

    var slate = state.currentSlate.replace(" Classic", "");
    var data = {
      "website": state.currentProvider,
      "slate": slate,
      "no_of_lineups": 1,
      "exclude": excludedPlayers,
      "include": lockedPlayers,
      "lineups": state.lineups,
      "teams": teams,
      "match_type": state.currentMatchType,
    }

    // Add showdown-specific data
    if (state.currentMatchType === "showdown") {
      data["captain"] = state.captainPlayerId;
      data["max_players"] = 6;
    }

    fetchLineups(data, true);
  }

  function showSubstitutionPlayerSelectionPopup(e) {
    console.log(e.target.closest(".lineups-table tr").dataset);
    var playerRow = e.target.closest(".lineups-table tr");
    var playerCode;
    var playerPosition;
    var dataset;
    if (playerRow) {
      dataset = playerRow.dataset;
      playerCode = dataset.playercode;
      playerPosition = dataset.position;
      state.substitutedPlayer = dataset;

      trackGAEventForPage("substitute_player", {
        "position": playerPosition,
        "build_count": state.buildCount,
      });
    }
    var playersPopup = document.getElementById("player-substitution-popup").content.cloneNode(true);
    var playersPopup = playersPopup.querySelector(".player-substitution-container");
    var closePopupBtn = playersPopup.querySelector(".close-btn");
    if (closePopupBtn) {
      closePopupBtn.addEventListener("click", removePlayerSubstitutionContainer);
    }

    var autoSubstituteBtn = playersPopup.querySelector(".auto-substitute-player-btn");
    if (autoSubstituteBtn) {
      autoSubstituteBtn.addEventListener("click", function() {
        autoSubstitutePlayer(playerCode);
      });
    }

    var playerNameHolder = playersPopup.querySelector(".substituted-player-name");
    if (playerNameHolder) {
      playerNameHolder.innerHTML = dataset.playername;
    }

    var remainingSalaryHolder = $(".remaining-salary-holder .remaining-salary-amount");
    var remainingsalary = 0;
    if (remainingSalaryHolder) {
      remainingsalary = parseInt(remainingSalaryHolder.dataset.remainingsalary);
    }

    var playersListContainer = playersPopup.querySelector(".substitute-players-list tbody");
    var slateName = state.currentSlate;
    var isShowdown = state.currentMatchType === "showdown";
    var playerCodeText;
    var salaryText;
    var valueText;
    var scoringText;
    var currentPlayerSource;

    if (isShowdown) {
      // Showdown mode uses showdownPlayersList with different property names
      currentPlayerSource = showdownPlayersList[state.currentProvider] || [];
    } else {
      // Classic mode
      currentPlayerSource = playersList;
      if (slateName.includes("Classic")) {
        playerCodeText = slateName.replace("Classic", "") + "Code";
        salaryText = slateName.replace("Classic", "") + "Salary";
        valueText = slateName.replace("Classic", "") + "Value";
      } else {
        playerCodeText = slateName + " Code";
        salaryText = slateName + " Salary";
        valueText = slateName + " Value";
      }
      scoringText = state.currentProvider + " Scoring";
    }

    currentPlayerSource.sort(function(a, b) {
      if (isShowdown) {
        return (b["Salary"] || 0) - (a["Salary"] || 0);
      }
      return b[salaryText] - a[salaryText];
    })

    var playerIndex = 0;
    for (var i = 0; i < currentPlayerSource.length; i++) {
      if (!state.currentTeams.includes(currentPlayerSource[i].Team)) continue;

      // For showdown, allow any position for FLEX (CPT position is handled separately)
      if (isShowdown) {
        // In showdown, FLEX can be any position, skip position filtering
      } else if (playerPosition == "FLEX") {
        if (currentPlayerSource[i].Position !== "RB" && currentPlayerSource[i].Position !== "WR" && currentPlayerSource[i].Position !==
          "TE") continue;
      } else {
        if (currentPlayerSource[i].Position !== playerPosition) continue;
      }

      // Get player code based on mode
      var currentPlayerCode = isShowdown
        ? (currentPlayerSource[i]["ID"] || currentPlayerSource[i]["id"] || "")
        : currentPlayerSource[i][playerCodeText];
      var currentPlayerSalary = isShowdown
        ? (currentPlayerSource[i]["Salary"] || 0)
        : currentPlayerSource[i][salaryText];
      var currentPlayerName = isShowdown
        ? (currentPlayerSource[i]["Name"] || currentPlayerSource[i]["Player"] || "")
        : currentPlayerSource[i].Player;

      if (state.lockedPlayers.includes(currentPlayerCode)) continue;
      if (state.removedPlayers.includes(currentPlayerCode)) continue;
      if (parseFloat(currentPlayerSalary) > (parseFloat(dataset.salary) + remainingsalary)) continue;
      if (currentPlayerName === dataset.playername) continue;
      playerIndex += 1;
      var singlePlayerRow = document.createElement("tr");
      singlePlayerRow.addEventListener("click", substitutePlayerAndReplaceDuplicateLineups);

      var playerDetailsHolder = document.createElement("td");
      addClass(playerDetailsHolder, "substitute-player-details-holder");
      var playerDetailsContainer = document.createElement("div");
      addClass(playerDetailsContainer, "substitute-player-details-container");

      var playerName = document.createElement("span");
      addClass(playerName, "substitute-player-name");
      playerName.innerHTML = currentPlayerName;
      playerDetailsContainer.appendChild(playerName);
      singlePlayerRow.dataset.index = playerIndex;
      singlePlayerRow.dataset.playername = currentPlayerName;
      singlePlayerRow.dataset.playercode = currentPlayerCode;
      var currentPlayerValue = isShowdown
        ? (currentPlayerSource[i]["Value"] || 0)
        : currentPlayerSource[i][valueText];
      singlePlayerRow.dataset.value = currentPlayerValue;

      var playerTeamsContainer = document.createElement("div");
      addClass(playerTeamsContainer, "substitute-team-position-container");
      var positionHolder = document.createElement("span");
      addClass(positionHolder, "substitute-player-position");
      positionHolder.innerHTML = currentPlayerSource[i].Position;
      playerTeamsContainer.appendChild(positionHolder);
      singlePlayerRow.dataset.position = currentPlayerSource[i].Position;

      var separator = document.createElement("span");
      addClass(separator, "player-details-separator");
      separator.innerHTML = "&bull;";
      playerTeamsContainer.appendChild(separator);
      var playerTeam = document.createElement("span");
      addClass(playerTeam, "substitute-team");
      playerTeam.innerHTML = currentPlayerSource[i].Team;
      singlePlayerRow.dataset.team = currentPlayerSource[i].Team;
      playerTeamsContainer.appendChild(playerTeam);
      playerDetailsContainer.appendChild(playerTeamsContainer);
      playerDetailsHolder.appendChild(playerDetailsContainer);
      singlePlayerRow.appendChild(playerDetailsHolder);

      var playerSalaryHolder = document.createElement("td");
      addClass(playerSalaryHolder, "substitute-player-salary");
      playerSalaryHolder.innerHTML = "$" + currentPlayerSalary;
      singlePlayerRow.appendChild(playerSalaryHolder);
      singlePlayerRow.dataset.salary = currentPlayerSalary;

      var playerPointsHolder = document.createElement("td");
      addClass(playerPointsHolder, "substitute-player-points")
      var playerPointsContainer = document.createElement("div");
      addClass(playerPointsContainer, "player-points-container");

      var currentPlayerPoints = isShowdown
        ? (currentPlayerSource[i]["FPTS"] || currentPlayerSource[i]["STD FPts"] || 0)
        : currentPlayerSource[i][scoringText];
      var playerPoints = document.createElement("span");
      addClass(playerPoints, "substitute-player-points");
      playerPoints.innerHTML = currentPlayerPoints;
      playerPointsContainer.appendChild(playerPoints);

      var rightArrow = document.createElement("img");
      addClass(rightArrow, "right-arrow-icon");
      rightArrow.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/right-arrow.png");
      rightArrow.setAttribute("width", 16);
      rightArrow.setAttribute("height", 16);
      rightArrow.setAttribute("alt", "right arrow");
      playerPointsContainer.appendChild(rightArrow);

      playerPointsHolder.appendChild(playerPointsContainer);
      singlePlayerRow.appendChild(playerPointsHolder);
      singlePlayerRow.dataset.points = currentPlayerPoints;

      playersListContainer.appendChild(singlePlayerRow);
    }

    var overlay = $(".overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      addClass(overlay, "overlay");
      document.body.appendChild(overlay);
    } else {
      removeClass(overlay, "hidden");
    }

    document.body.appendChild(playersPopup);
  }

  function removePlayerSubstitutionContainer() {
    var substitutionPopup = $(".player-substitution-container");
    if (substitutionPopup) {
      substitutionPopup.remove();

      var overlay = $(".overlay");
      if (overlay) {
        addClass(overlay, "hidden");
      }
    }
  }

  function addSubstitutedLineupPlayer(e) {
    var playerRow = e.target.closest(".lineup-single-player-row");
    if (playerRow) {
      var playerCode = playerRow.dataset.playercode;
      var index = state.autoSubstitutePlayers.findIndex(function(player) {
        return player === playerCode;
      });
      state.autoSubstitutePlayers.splice(index, 1);

      playerRow.style.background = "#fff";
      var removeBtn = playerRow.querySelector(".lineup-remove-player-btn");
      removeClass(removeBtn, "hidden");

      var substituteBtn = playerRow.querySelector(".lineup-add-substituted-player-btn");
      addClass(substituteBtn, "hidden");

      playerRow.dataset.substitute = "false";

      var refreshLineupBtn = $(".refresh-lineup-download-csv-container .refresh-lineup-btn");
      if (refreshLineupBtn) {
        refreshLineupBtn.innerHTML = "Rebuild";
      }
    }
  }

  function storeLineups(data) {
    if (data.lineups.length > 1) {
      data.lineups.sort(function(x, y) {
        return y[y.length - 1][1] - x[x.length - 1][1];
      });
    }

    createLineupSelectionButtons(data.lineups);
    if (state.lineups.length === 0) {
      data.lineups.forEach(function(lineup) {
        state.lineups.push(lineup);
      });

      showLineupData();
    } else {
      data.lineups.forEach(function(lineup) {
        state.lineups.push(lineup);
      });
    }
  }

  function changeLineupPoints(e) {
    var value = e.target.value;
    trackGAEventForPage("pts_dropdown", {
      "item_name": value,
      "tab_name": "lineups",
      "build_count": state.buildCount,
    });
    var pointsContainers = $all(".player-points-value-container .lineup-player-points");
    var valuesContainers = $all(".player-points-value-container .lineup-player-value");
    if (value === "FPTS") {
      for (var i = 0; i < pointsContainers.length; i++) {
        removeClass(pointsContainers[i], "hidden");
      }
      for (var i = 0; i < valuesContainers.length; i++) {
        addClass(valuesContainers[i], "hidden");
      }
    } else if (value === "Val") {
      for (var i = 0; i < pointsContainers.length; i++) {
        addClass(pointsContainers[i], "hidden");
      }
      for (var i = 0; i < valuesContainers.length; i++) {
        removeClass(valuesContainers[i], "hidden");
      }
    }
  }

  function changePointsValueColumn(e) {
    var value = e.target.value;
    trackGAEventForPage("pts_dropdown", {
      "item_name": value,
      "tab_name": getSelectedPlayerTab(),
      "build_count": state.buildCount,
    });

    var pointsContainers = $all(".player-points-value-container .lineup-player-points");
    if (pointsContainers.length == 0) {
      pointsContainers = $all(".player-points-value-holder .player-points");
    }
    var valuesContainers = $all(".player-points-value-container .lineup-player-value");
    if (valuesContainers.length == 0) {
      valuesContainers = $all(".player-points-value-holder .player-value");
    }
    if (value === "FPTS") {
      for (var i = 0; i < pointsContainers.length; i++) {
        removeClass(pointsContainers[i], "hidden");
      }
      for (var i = 0; i < valuesContainers.length; i++) {
        addClass(valuesContainers[i], "hidden");
      }
    } else if (value === "Val") {
      for (var i = 0; i < pointsContainers.length; i++) {
        addClass(pointsContainers[i], "hidden");
      }
      for (var i = 0; i < valuesContainers.length; i++) {
        removeClass(valuesContainers[i], "hidden");
      }
    }
  }

  function sortPointsValue(e) {
    var targetTable = e.target.closest(".players-list-table");
    if (!targetTable) {
      targetTable = e.target.closest(".lineups-table");
    }
    var selectedFilter = targetTable.querySelector(".player-points-value-select");
    var selectedFilterValue;
    if (selectedFilter) {
      selectedFilterValue = selectedFilter.value;
    }

    var sortBtn = e.target.closest(".points-value-sort-ascending-btn");
    var selectedTab = getSelectedPlayerTab();
    var header;
    var sortOrder;
    if (selectedTab !== "Lineups") {
      header = selectedFilterValue;
    } else {
      header = "lineups_" + selectedFilterValue;
    }
    if (!sortBtn) {
      sortBtn = e.target.closest(".points-value-sort-descending-btn");
      sortOrder = "descending";
    } else {
      sortOrder = "ascending";
    }

    trackGAEventForPage("sort_by", {
      "order": sortOrder,
      "header": header,
      "tab": selectedTab,
      "build_count": state.buildCount,
    });

    var sort = sortBtn.dataset.sort;
    var playersListContainer = targetTable.querySelector("tbody");
    var descendingSortBtn = targetTable.querySelector(".points-value-sort-descending-btn");
    var ascendingSortBtn = targetTable.querySelector(".points-value-sort-ascending-btn");
    var players;

    var playersContainers = playersListContainer.children;
    if (playersContainers) {
      if (sort === "descending") {
        if (selectedFilterValue === "FPTS") {
          players = Array.from(playersContainers).sort(function(x, y) {
            return parseFloat(y.dataset.points) - parseFloat(x.dataset.points);
          });
        } else if (selectedFilterValue === "Val") {
          players = Array.from(playersContainers).sort(function(x, y) {
            return parseFloat(y.dataset.value) - parseFloat(x.dataset.value);
          });
        }

        if (descendingSortBtn && ascendingSortBtn) {
          addClass(descendingSortBtn, "hidden");
          removeClass(ascendingSortBtn, "hidden");
        }
      } else if (sort === "ascending") {
        if (selectedFilterValue === "FPTS") {
          players = Array.from(playersContainers).sort(function(x, y) {
            return parseFloat(x.dataset.points) - parseFloat(y.dataset.points);
          });
        } else if (selectedFilterValue === "Val") {
          players = Array.from(playersContainers).sort(function(x, y) {
            return parseFloat(x.dataset.value) - parseFloat(y.dataset.value);
          });
        }

        if (descendingSortBtn && ascendingSortBtn) {
          removeClass(descendingSortBtn, "hidden");
          addClass(ascendingSortBtn, "hidden");
        }
      }

      if (playersListContainer) {
        playersListContainer.innerHTML = "";
        players.forEach(function(player) {
          playersListContainer.appendChild(player);
        });
      }

      var playersSalaryHolders = $all(".players-list-table .player-records.player-salary");
      if (playersSalaryHolders) {
        for (var i = 0; i < playersSalaryHolders.length; i++) {
          removeClass(playersSalaryHolders[i], "sorted-column");
        }
      }

      var playersPointsValueHolders = $all(".players-list-table .player-records.points-value");
      if (playersPointsValueHolders) {
        for (var i = 0; i < playersPointsValueHolders.length; i++) {
          addClass(playersPointsValueHolders[i], "sorted-column");
        }
      }

      if (!desktop) {
        var playersSalaryHolders = $all(".lineups-table .lineup-player-salary");
        if (playersSalaryHolders) {
          for (var i = 0; i < playersSalaryHolders.length; i++) {
            removeClass(playersSalaryHolders[i], "sorted-column");
          }
        }

        var playersPointsValueHolders = $all(".lineups-table .lineup-player-points-value");
        if (playersPointsValueHolders) {
          for (var i = 0; i < playersPointsValueHolders.length; i++) {
            addClass(playersPointsValueHolders[i], "sorted-column");
          }
        }
      }
    }
  }

  function sortLineupPointsValue(e) {
    var selectedFilter = $(".player-points-value-select");
    var selectedFilterValue;
    if (selectedFilter) {
      selectedFilterValue = selectedFilter.value;
    }

    var sortBtn = e.target.closest(".lineup-points-value-sort-ascending-btn");
    var selectedTab = getSelectedPlayerTab();
    var header = "lineups_" + selectedFilterValue;
    var sortOrder;
    if (!sortBtn) {
      sortBtn = e.target.closest(".lineup-points-value-sort-descending-btn");
      sortOrder = "descending";
    } else {
      sortOrder = "ascending";
    }

    trackGAEventForPage("sort_by", {
      "order": sortOrder,
      "header": header,
      "tab": getSelectedPlayerTab(),
      "build_count": state.buildCount,
    });

    var sort = sortBtn.dataset.sort;
    var playersListContainer = $(".lineups-table tbody");
    var descendingSortBtn = $(".lineup-points-value-sort-descending-btn");
    var ascendingSortBtn = $(".lineup-points-value-sort-ascending-btn");
    var players;

    var playersContainers = $(".lineups-table tbody").children;
    if (playersContainers) {
      if (sort === "descending") {
        if (selectedFilterValue === "FPTS") {
          players = Array.from(playersContainers).sort(function(x, y) {
            return parseFloat(y.dataset.points) - parseFloat(x.dataset.points);
          });
        } else if (selectedFilterValue === "Val") {
          players = Array.from(playersContainers).sort(function(x, y) {
            return parseFloat(y.dataset.value) - parseFloat(x.dataset.value);
          });
        }

        if (descendingSortBtn && ascendingSortBtn) {
          addClass(descendingSortBtn, "hidden");
          removeClass(ascendingSortBtn, "hidden");
        }
      } else if (sort === "ascending") {
        if (selectedFilterValue === "FPTS") {
          players = Array.from(playersContainers).sort(function(x, y) {
            return parseFloat(x.dataset.points) - parseFloat(y.dataset.points);
          });
        } else if (selectedFilterValue === "Val") {
          players = Array.from(playersContainers).sort(function(x, y) {
            return parseFloat(x.dataset.value) - parseFloat(y.dataset.value);
          });
        }

        if (descendingSortBtn && ascendingSortBtn) {
          removeClass(descendingSortBtn, "hidden");
          addClass(ascendingSortBtn, "hidden");
        }
      }

      if (playersListContainer) {
        playersListContainer.innerHTML = "";
        players.forEach(function(player) {
          playersListContainer.appendChild(player);
        });
      }

      var playersPointsValueHolders = $all(".lineups-table .lineup-player-points-value");
      if (playersPointsValueHolders) {
        for (var i = 0; i < playersPointsValueHolders.length; i++) {
          addClass(playersPointsValueHolders[i], "sorted-column");
        }
      }

      var lineupPlayersSalaryHolders = $all(".lineups-table .lineup-player-salary");
      if (lineupPlayersSalaryHolders) {
        for (var i = 0; i < lineupPlayersSalaryHolders.length; i++) {
          removeClass(lineupPlayersSalaryHolders[i], "sorted-column");
        }
      }
    }
  }

  function sortLineupSalary(e) {
    var sortBtn = e.target.closest(".lineup-salary-sort-descending-btn");
    var sortOrder;
    if (!sortBtn) {
      sortBtn = e.target.closest(".lineup-salary-sort-ascending-btn");
      sortOrder = "ascending";
    } else {
      sortOrder = "descending";
    }

    trackGAEventForPage(sortOrder, {
      "order": "ascending",
      "header": "lineup_salary",
      "tab": getSelectedPlayerTab(),
      "build_count": state.buildCount,
    });

    var sort = sortBtn.dataset.sort;
    var playersListContainer = $(".lineups-table tbody");
    var descendingSortBtn = $(".lineup-salary-sort-descending-btn");
    var ascendingSortBtn = $(".lineup-salary-sort-ascending-btn");
    var players;

    var playersContainers = $(".lineups-table tbody").children;
    if (playersContainers) {
      if (sort === "descending") {
        players = Array.from(playersContainers).sort(function(x, y) {
          return parseInt(y.dataset.salary) - parseInt(x.dataset.salary);
        });

        if (descendingSortBtn && ascendingSortBtn) {
          addClass(descendingSortBtn, "hidden");
          removeClass(ascendingSortBtn, "hidden");
        }
      } else if (sort === "ascending") {
        players = Array.from(playersContainers).sort(function(x, y) {
          return parseInt(x.dataset.salary) - parseInt(y.dataset.salary);
        });

        if (descendingSortBtn && ascendingSortBtn) {
          removeClass(descendingSortBtn, "hidden");
          addClass(ascendingSortBtn, "hidden");
        }
      }

      if (playersListContainer) {
        playersListContainer.innerHTML = "";
        players.forEach(function(player) {
          playersListContainer.appendChild(player);
        });
      }

      var playersPointsValueHolders = $all(".lineups-table .lineup-player-points-value");
      if (playersPointsValueHolders) {
        for (var i = 0; i < playersPointsValueHolders.length; i++) {
          removeClass(playersPointsValueHolders[i], "sorted-column");
        }
      }

      var lineupPlayersSalaryHolders = $all(".lineups-table .lineup-player-salary");
      if (lineupPlayersSalaryHolders) {
        for (var i = 0; i < lineupPlayersSalaryHolders.length; i++) {
          addClass(lineupPlayersSalaryHolders[i], "sorted-column");
        }
      }
    }
  }

  function shrinkPageTopTextContent() {
    var topTextContainer = $(".pfn-content-container .top-text-content-container");
    if (topTextContainer) {
      topTextContainer.style.height = "116px";
      var readMoreBtn = topTextContainer.querySelector(".read-more-content-btn");
      if (readMoreBtn) {
        removeClass(readMoreBtn, "hidden");
      }

      var readLessBtn = topTextContainer.querySelector(".read-less-content-btn");
      if (readLessBtn) {
        addClass(readLessBtn, "hidden");
      }
    }
  }

  function enableRetryBuild() {
    trackGAEventForPage("rebuild_mobile", {
      "build_count": state.buildCount,
    });

    if (!desktop && tool) {
      shrinkPageTopTextContent();
    }

    var allPlayersTab = $(".players-category.all-players");
    if (allPlayersTab) {
      allPlayersTab.dataset.triggerevent = "false";
      allPlayersTab.click();
    }
  }

  function refreshLineup(duplicateRemoval) {
    var playersContainers = $all(".lineups-table tbody tr");
    var lockedPlayers = [];
    var excludedPlayers = [];
    var selectedLineupBtn = $(".lineup-selection-btn.selected");
    if (selectedLineupBtn) {
      if (!duplicateRemoval) {
        state.refreshIndex = selectedLineupBtn.dataset.index;
      }
    }

    if (playersContainers) {
      for (var i = 0; i < playersContainers.length; i++) {
        var dataset = playersContainers[i].dataset;
        if (!dataset.substitute || dataset.substitute == "false") {
          lockedPlayers.push(dataset.playercode);
        } else {
          excludedPlayers.push(dataset.playercode);
        }
      }

      if (excludedPlayers.length == 0) {
        lockedPlayers = [];
      }

      for (var i = 0; i < state.removedPlayers.length; i++) {
        excludedPlayers.push(state.removedPlayers[i]);
      }
      for (var i = 0; i < state.lockedPlayers.length; i++) {
        lockedPlayers.push(state.lockedPlayers[i]);
      }

      var teams = [];

      for (var i = 0; i < state.currentTeams.length; i++) {
        var flag = true;
        for (j = 0; j < state.excludedTeams.length; j++) {
          if (state.excludedTeams[j] === state.currentTeams[i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          teams.push(state.currentTeams[i]);
        }
      }

      var slate = state.currentSlate.replace(" Classic", "");
      var data = {
        "website": state.currentProvider,
        "slate": slate,
        "no_of_lineups": 1,
        "exclude": excludedPlayers,
        "include": lockedPlayers,
        "lineups": state.lineups,
        "teams": teams,
        "match_type": state.currentMatchType,
      }

      // Add showdown-specific data
      if (state.currentMatchType === "showdown") {
        data["captain"] = state.captainPlayerId;
      }

      fetchLineups(data, true);
    }
  }

  function closeResetConfirmationPopup() {
    trackGAEventForPage("reset_cancel", {
      "build_count": state.buildCount,
    });

    var confirmationPopup = $(".reset-confirmation-popup");
    if (confirmationPopup) {
      confirmationPopup.remove();
    }

    var overlay = $(".overlay");
    if (overlay) {
      addClass(overlay, "hidden");
    }
  }

  function openConfirmationPopup() {
    trackGAEventForPage("resest_cta", {
      "build_count": state.buildCount,
    });

    var confirmationPopup = document.getElementById("reset-popup").content.cloneNode(true);
    var confirmationPopup = confirmationPopup.querySelector(".reset-confirmation-popup");
    if (confirmationPopup) {
      var closePopupBtn = confirmationPopup.querySelector(".close-btn");
      if (closePopupBtn) {
        closePopupBtn.addEventListener("click", closeResetConfirmationPopup);
      }

      var cancelResetBtn = confirmationPopup.querySelector(".cancel-reset");
      if (cancelResetBtn) {
        cancelResetBtn.addEventListener("click", closeResetConfirmationPopup);
      }

      var confirmResetBtn = confirmationPopup.querySelector(".confirm-reset");
      if (confirmResetBtn) {
        confirmResetBtn.addEventListener("click", resetLineups);
      }

      var overlay = $(".overlay");
      if (overlay) {
        removeClass(overlay, "hidden");
      } else {
        overlay = document.createElement("div");
        addClass(overlay, "overlay");
        document.body.appendChild(overlay);
      }

      document.body.appendChild(confirmationPopup);
    }
  }

  function resetLineups() {
    trackGAEventForPage("reset_yes", {
      "build_count": state.buildCount,
    });

    var confirmationPopup = $(".reset-confirmation-popup");
    if (confirmationPopup) {
      closeResetConfirmationPopup();
    }

    if (!desktop && tool) {
      shrinkPageTopTextContent();
    }

    var positionFiltersContainer = $(".players-positions-filters-container");
    if (positionFiltersContainer) {
      var selectedFilter = positionFiltersContainer.querySelector(".selected");
      if (selectedFilter) {
        removeClass(selectedFilter, "selected");
      }

      var allFilter = positionFiltersContainer.children[0];
      if (allFilter) {
        addClass(allFilter, "selected");
      }
    }

    var lockedPlayersBtnText = $(".players-category.locked-players");
    if (lockedPlayersBtnText) {
      lockedPlayersBtnText.innerHTML = "Locked()";
    }

    var excludedPlayersBtnText = $(".players-category.excluded-players");
    if (excludedPlayersBtnText) {
      excludedPlayersBtnText.innerHTML = "Excluded()";
    }

    var remainingSalaryContainer = $(".remaining-salary-container .remaining-salary");
    if (remainingSalaryContainer) {
      if (state.currentProvider == "DK") {
        remainingSalaryContainer.innerHTML = "50,000";
      } else if (state.currentProvider == "FD") {
        remainingSalaryContainer.innerHTML = "60,000";
      }
    }

    var lockedPlayersIndicator = $(".remaining-salary-container .locked-players");
    if (lockedPlayersIndicator) {
      lockedPlayersIndicator.innerHTML = "0/7";
    }

    if (desktop) {
      var buildBtn = $(".filters-container .build-lineups");
      if (buildBtn) {
        buildBtn.innerHTML = "Build";
      }

      var buildBtnBottom = $(".lineups-container .build-lineups-bottom");
      if (buildBtnBottom) {
        buildBtnBottom.innerHTML = "Build";
      }

      var lineupTable = $(".lineups-list-container .lineups-table");
      if (lineupTable) {
        addClass(lineupTable, "hidden");
      }

      var utilityContainer = $(".refresh-lineup-download-csv-container");
      if (utilityContainer) {
        addClass(utilityContainer, "hidden");
      }

      var buildBtnBottom = $(".build-lineups-bottom.hidden");
      if (buildBtnBottom) {
        removeClass(buildBtnBottom, "hidden");
      }

      var leftScrollButton = $(".lineups-buttons-container .left-scroll-button");
      var rightScrollButton = $(".lineups-buttons-container .right-scroll-button");
      if (leftScrollButton && rightScrollButton) {
        addClass(leftScrollButton, "hidden");
        addClass(rightScrollButton, "hidden");
      }
    } else {
      var allPlayersTab = $(".players-category.all-players");
      if (allPlayersTab) {
        allPlayersTab.click();
      }

      var lineupsTab = $(".players-category.lineups");
      if (lineupsTab) {
        lineupsTab.innerHTML = "Lineups(0)";
        lineupsTab.disabled = true;
        lineupsTab.style.opacity = "0.4";
      }

      state.lineupCount = 1;
      var lineupsInput = $(".lineup-count-input");
      if (lineupsInput) {
        lineupsInput.value = 1;
      }
    }

    if (!desktop) {
      window.scrollTo(0, 130);
    } else {
      if (tool) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 270);
      }
    }

    state.lineups = [];
    state.lockedPlayers = [];
    state.removedPlayers = [];
    state.autoSubstitutePlayers = [];
    clearLineupTable();
    showSlateMatches();
    fillPlayersTableData(state.currentProvider);
  }

  function showUtilityContainer() {
    var buildBtnLineupContainer = $(".build-lineups-bottom");
    if (buildBtnLineupContainer) {
      removeClass(buildBtnLineupContainer, "blink");
      buildBtnLineupContainer.innerHTML = "Rebuild";
      addClass(buildBtnLineupContainer, "hidden");
    }

    var utilityContainer = $(".refresh-lineup-download-csv-container");
    if (utilityContainer) {
      removeClass(utilityContainer, "hidden");
    }

    var buildBtn = $(".build-lineups");
    if (buildBtn) {
      removeClass(buildBtn, "blink");
      if (desktop) {
        buildBtn.innerHTML = "Rebuild";
      } else {
        buildBtn.innerHTML = "Build";
      }
    }

    var rebuildBtn = $(".refresh-lineup-btn");
    if (rebuildBtn) {
      rebuildBtn.innerHTML = "Rebuild";
      removeClass(rebuildBtn, "blink");
    }

    if (!desktop) {
      if (buildBtn) {
        addClass(buildBtn, "hidden");
      }

      var listFiltersContainer = $(".players-category-buttons-container");
      if (listFiltersContainer) {
        var selectedFilter = listFiltersContainer.querySelector(".selected");
        if (selectedFilter) {
          removeClass(selectedFilter, "selected");
        }

        var lineupsFilter = listFiltersContainer.querySelector(".players-category.lineups");
        if (lineupsFilter) {
          addClass(lineupsFilter, "selected");
          lineupsFilter.style.opacity = "1";
          lineupsFilter.disabled = false;
          lineupsFilter.innerHTML = "Lineups(" + state.lineups.length + ")";
        }
      }

      var remainingSalaryContainer = $(
        ".players-category-remaining-salary-container .remaining-salary-container");
      if (remainingSalaryContainer) {
        addClass(remainingSalaryContainer, "hidden");
      }

      var lineupsPointsSalaryContainer = $(".points-salary-container");
      if (lineupsPointsSalaryContainer) {
        removeClass(lineupsPointsSalaryContainer, "hidden");
      }

      var select = $(".player-points-value-select");
      if (select) {
        select.value = "FPTS";
      }
    } else {
      var container = $(".lineups-buttons-container .lineups-buttons-holder");
      var leftScrollButton = $(".lineups-buttons-container .left-scroll-button");
      var rightScrollButton = $(".lineups-buttons-container .right-scroll-button");
      if (container && leftScrollButton && rightScrollButton) {
        removeClass(leftScrollButton, "hidden");
        removeClass(rightScrollButton, "hidden");

        var leftScrollEvent = function() {
          trackGAEventForPage("lineups_scroll", {
            "scroll": "left",
          });
        }

        var rightScrollEvent = function() {
          trackGAEventForPage("lineups_scroll", {
            "scroll": "right",
          });
        }

        initListScroll(container, leftScrollButton, rightScrollButton, leftScrollEvent, rightScrollEvent);
      }
    }
  }

  function populateLineupData(data, refresh) {
    var refreshBtn = $(".refresh-lineup-download-csv-container .refresh-lineup-btn");
    if (refreshBtn) {
      refreshBtn.innerHTML = "Rebuild";
    }
    state.autoSubstitutePlayers = [];

    if (!refresh) {
      storeLineups(data);
      if (desktop) {
        var lineupTable = $(".lineups-list-container .lineups-table");
        if (lineupTable) {
          removeClass(lineupTable, "hidden");
        }
      }
    } else {
      removePlayerSubstitutionContainer();
      // Check if data.lineups exists and has at least one lineup
      if (data.lineups && data.lineups.length > 0) {
        state.lineups.splice(state.refreshIndex, 1, data.lineups[0]);
        var selectedLineupBtn = $(".lineup-selection-btn.selected");
        var currentIndex;
        if (selectedLineupBtn) {
          currentIndex = selectedLineupBtn.dataset.index;
        }
        if (currentIndex === state.refreshIndex) {
          showLineupData();
        } else {
          state.refreshIndex = "";
          state.substitutedPlayer = "";
        }
      } else {
        console.error("No lineup data returned from API");
        state.refreshIndex = "";
        state.substitutedPlayer = "";
      }
    }
  }

  function fetchLineups(data, refresh) {
    fetch(lineupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(res => res.json())
      .then(function(data) {
        populateLineupData(data, refresh);
      })
      .then(function() {
        if (state.fetchCount > 0) {
          prepareLineupFetchData();
        } else {
          showUtilityContainer();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function clearLineupTable() {
    state.lineups = [];
    var lineupBtnsHolder = $(".lineups-buttons-container .lineups-buttons-holder");
    if (lineupBtnsHolder) {
      lineupBtnsHolder.innerHTML = "";
    }

    var lineupsTable = $(".lineups-table");
    if (lineupsTable) {
      addClass(lineupsTable, "hidden");
      var lineupsBody = lineupsTable.querySelector("tbody");
      if (lineupsBody) {
        lineupsBody.innerHTML = "";
      }
    }

    var remSalaryHolder = $(".remaining-salary-holder .remaining-salary-amount");
    if (remSalaryHolder) {
      remSalaryHolder.innerHTML = 0;
      remSalaryHolder.dataset.remainingsalary = 0;
    }

    var remPointsCountHolder = $(".remaining-points-container .remaining-points-count");
    if (remPointsCountHolder) {
      remPointsCountHolder.innerHTML = "0 FP";
      remPointsCountHolder.dataset.totalpoints = 0;
    }
  }

  function addAutosubstitutePlayersToExcludedList() {
    var playersList = $all(".players-list-table tbody tr");
    if (playersList) {
      for (var i = 0; i < playersList.length; i++) {
        var dataset = playersList[i].dataset;
        if (state.autoSubstitutePlayers.includes(dataset.playercode)) {
          var lockBtn = playersList[i].querySelector(".actions-container .remove-player-btn");
          if (lockBtn) {
            lockBtn.click();
          }
        }
      }
    }
  }

  function prepareLineupFetchData(e) {
    if (!desktop && tool) {
      shrinkPageTopTextContent();
    }

    if (e) {
      var buildBtnTop = e.target.closest(".build-lineups");
      var buildBtnBottom = e.target.closest(".build-lineups-bottom");
      var refreshLineupBtn = e.target.closest(".refresh-lineup-btn");
      var eventName;
      if (buildBtnTop || buildBtnBottom || refreshLineupBtn) {
        clearLineupTable();
        if (refreshLineupBtn) {
          eventName = "rebuild_desktop";
        }
      }

      if (desktop) {
        if (tool) {
          window.scrollTo(0, 330);
        } else {
          window.scrollTo(0, 600);
        }

        if (buildBtnTop) {
          eventName = "build_top";
        } else if (buildBtnBottom) {
          eventName = "build_bottom";
        }
      } else {
        window.scrollTo(0, 550);
        eventName = "build_mobile";
      }

      trackGAEventForPage(eventName, {
        "no_of_lineups": state.lineupCount,
        "no_of_locked_players": state.lockedPlayers.length,
        "no_of_excluded_layers": state.removedPlayers.length,
        "build_count": state.buildCount,
      });
    }

    unsetSelectionChangedFlag();

    var slate = state.currentSlate.replace(" Classic", "");
    var lineupCountInput = $(".lineup-count-input");
    var lineupCount;
    if (lineupCountInput) {
      lineupCount = lineupCountInput.value;
      if (lineupCount === "") {
        lineupCount = 1;
      }
    }

    if (state.fetchCount === 0) {
      state.lastLineupCount = lineupCount % 10;
      state.fetchCount = Math.ceil(lineupCount / 10);
    } else {
      state.fetchCount -= 1;
    }
    var teams = [];

    for (var i = 0; i < state.currentTeams.length; i++) {
      var flag = true;
      for (j = 0; j < state.excludedTeams.length; j++) {
        if (state.excludedTeams[j] === state.currentTeams[i]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        teams.push(state.currentTeams[i]);
      }
    }

    var removedPlayers = [];
    for (var i = 0; i < state.autoSubstitutePlayers.length; i++) {
      removedPlayers.push(state.autoSubstitutePlayers[i]);
    }

    for (var i = 0; i < state.removedPlayers.length; i++) {
      removedPlayers.push(state.removedPlayers[i]);
    }

    state.autoSubstitutePlayers = [];


    var data = {
      "website": state.currentProvider,
      "slate": slate,
      "no_of_lineups": 10,
      "exclude": removedPlayers,
      "include": state.lockedPlayers,
      "lineups": state.lineups,
      "teams": teams,
      "match_type": state.currentMatchType,
    }

    // Add showdown-specific data
    if (state.currentMatchType === "showdown") {
      data["captain"] = state.captainPlayerId;
      data["max_players"] = 6;
    }

    var buildBottomBtn = $(".build-lineups-bottom");
    if (buildBottomBtn) {
      buildBottomBtn.innerHTML = "Loading...";
      addClass(buildBottomBtn, "blink");
    }
    var buildBtn = $(".build-lineups");
    if (buildBtn) {
      buildBtn.innerHTML = "Loading...";
      addClass(buildBtn, "blink");
    }

    var rebuildBtn = $(".refresh-lineup-btn");
    if (rebuildBtn) {
      rebuildBtn.innerHTML = "Loading...";
      addClass(rebuildBtn, "blink");
    }

    if (state.fetchCount === 1) {
      if (state.lastLineupCount != 0) {
        data["no_of_lineups"] = state.lastLineupCount;
      }

      state.fetchCount = 0;
      state.lastLineupCount = 0;
      state.buildCount += 1;
    }

    fetchLineups(data);
  }

  function prepareCSVData() {
    var csvRows = [];
    var firstRow;

    // Handle showdown vs classic mode differently
    if (state.currentMatchType === "showdown") {
      // Showdown has 6 positions: CPT + 5 FLEX
      firstRow = "CPT,FLEX,FLEX,FLEX,FLEX,FLEX";
      csvRows.push(firstRow);

      // For showdown, we just return the lineup codes directly
      for (var i = 0; i < state.lineups.length; i++) {
        var lineup = state.lineups[i];
        var players = [];
        for (var j = 0; j < lineup.length - 1; j++) {
          players.push(lineup[j][0]);
        }
        csvRows.push(players);
      }

      csvRows = csvRows.join('\n');
      return csvRows;
    }

    // Classic mode
    if (state.currentProvider == "DK") {
      firstRow = "QB,RB,RB,WR,WR,WR,TE,FLEX,DST";
    } else if (state.currentProvider == "FD") {
      firstRow = "QB,RB,RB,WR,WR,WR,TE,FLEX,DEF";
    }

    csvRows.push(firstRow);

    var downloadData = [];
    var playersDataSorted = [];
    var playersData = [];
    var slateText;
    var playerCode;
    if (state.currentSlate.includes("Classic")) {
      slateText = state.currentSlate.replace("Classic", "");
      playerCode = slateText + "Code";
    } else {
      slateText = state.currentSlate;
      playerCode = state.currentSlate + " Code";
    }

    for (var x = 0; x < state.lineups.length; x++) {
      for (var i = 0; i < state.lineups[x].length - 1; i++) {
        for (var j = 0; j < playersList.length; j++) {
          if (playersList[j][playerCode] === state.lineups[x][i][0]) {
            playersList[j].Points = state.lineups[x][i][1];
            playersData.push(playersList[j]);
            break;
          }
        }
      }

      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < playersData.length; j++) {
          if (i == 0 && playersData[j].Position == "QB") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 1 && playersData[j].Position == "RB") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 2 && playersData[j].Position == "RB") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 3 && playersData[j].Position == "WR") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 4 && playersData[j].Position == "WR") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 5 && playersData[j].Position == "WR") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 6 && playersData[j].Position == "TE") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 7 && (playersData[j].Position == "RB" || playersData[j].Position == "WR" || playersData[j]
              .Position == "TE")) {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
          if (i == 8 && playersData[j].Position == "DST") {
            playersDataSorted.push(playersData[j]);
            playersData.splice(j, 1);
            break;
          }
        }
      }

      downloadData.push(playersDataSorted);
      playersDataSorted = [];
    }

    for (var i = 0; i < downloadData.length; i++) {
      var lineup = downloadData[i];
      var players = []
      for (var j = 0; j < lineup.length; j++) {
        players.push(lineup[j][playerCode]);
      }
      csvRows.push(players);
    }

    csvRows = csvRows.join('\n');
    return csvRows;
  }

  function downloadCSV() {
    trackGAEventForPage("download_csv", {
      "build_count": state.buildCount,
    });

    var data = prepareCSVData();

    var blob = new Blob([data], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'lineups.csv');
    a.click()
  }

  function processCollectionsData(data) {
    var collections = data.collections || [];
    collections.forEach(function(collection) {
      var sheetName = collection.sheetName ? collection.sheetName.toLowerCase() : "";
      if (sheetName === "slates") {
        segregateSlatesData(collection.data);
      } else if (sheetName === "dfs") {
        segregatePlayersData(collection.data);
      } else if (sheetName === "dk_showdown") {
        segregateShowdownPlayersData(collection.data, "DK");
      } else if (sheetName === "fd_showdown") {
        segregateShowdownPlayersData(collection.data, "FD");
      }
    });

    // Update last updated timestamp
    var timestampContainer = $(".updated-timestamp-container");
    if (timestampContainer && data["updatedTime"]) {
      timestampContainer.innerHTML = "UPDATED ON " + new Date(data["updatedTime"]).changeTimezone("America/New_York").format("mmm d, yyyy , hh:MM TT") + " EDT";
    }

    // Check if there are any classic slates
    var hasClassicSlates = false;
    for (var provider in slatesList) {
      for (var slate in slatesList[provider]) {
        if (slatesList[provider][slate].length > 0) {
          hasClassicSlates = true;
          break;
        }
      }
      if (hasClassicSlates) break;
    }

    // If no classic slates but showdown slates exist, switch to showdown mode
    if (!hasClassicSlates && showdownSlatesList.length > 0) {
      state.currentMatchType = "showdown";
      var matchTypeDropdown = $(".filters-holder #match-type");
      if (matchTypeDropdown) {
        matchTypeDropdown.value = "showdown";
      }
      // Set current slate to first showdown slate
      if (showdownSlatesList[0]) {
        state.currentSlate = showdownSlatesList[0].name;
        state.currentProvider = showdownSlatesList[0].provider;
      }
      // Hide classic slates, show showdown slates
      var dkSlates = $(".slates-filter .DK-slates-selection");
      var fdSlates = $(".slates-filter .FD-slates-selection");
      var showdownSlatesDropdown = $(".slates-filter .showdown-slates-selection");
      if (dkSlates) addClass(dkSlates, "hidden");
      if (fdSlates) addClass(fdSlates, "hidden");
      if (showdownSlatesDropdown) removeClass(showdownSlatesDropdown, "hidden");

      // Fill showdown matches data first (creates DOM elements)
      fillShowdownMatchesData();

      // Populate showdown slates dropdown and show matches
      populateShowdownSlatesDropdown(state.currentProvider);
      if (state.currentSlate) {
        showShowdownMatches(state.currentSlate, state.currentProvider);

        // Set currentTeams from the showdown match
        state.currentTeams = [];
        state.excludedTeams = [];
        var matchesListHolder = $(".matches-container .matches-holder");
        if (matchesListHolder) {
          var matches = matchesListHolder.children;
          for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            if (match.dataset.slatename === state.currentSlate &&
                match.dataset.provider === state.currentProvider &&
                match.dataset.matchtype === "showdown") {
              state.currentTeams.push(match.dataset.home);
              state.currentTeams.push(match.dataset.road);
              break;
            }
          }
        }
      }
    }

    fillPlayersTableData();

    // Hide loading overlay once data is loaded
    var loadingOverlay = $(".lineup-optimizer-loading-overlay");
    if (loadingOverlay) {
      addClass(loadingOverlay, "hidden");
    }
  }

  // Fetch data from unified URL
  fetch(dfsDataUrl)
  .then(res => res.json())
  .then(function(data) {
    processCollectionsData(data);
  })
  .catch((err) => {
    if (err.message == "Failed to fetch") {
      if (Rollbar && Rollbar.error) {
        Rollbar.error("Lineup Optimizer data file load failed");
      }
    }
    console.log("Error fetching data:", err);
  });

  function expandPageTopTextContent() {
    var topTextContainer = $(".pfn-content-container .top-text-content-container");
    if (topTextContainer) {
      topTextContainer.style.height = "unset";
      var readMoreBtn = topTextContainer.querySelector(".read-more-content-btn");
      if (readMoreBtn) {
        addClass(readMoreBtn, "hidden");
      }

      var readLessBtn = topTextContainer.querySelector(".read-less-content-btn");
      if (readLessBtn) {
        removeClass(readLessBtn, "hidden");
      }
    }
  }

  function shrinkPageTopTextContent() {
    var topTextContainer = $(".pfn-content-container .top-text-content-container");
    if (topTextContainer) {
      topTextContainer.style.height = "116px";
      var readMoreBtn = topTextContainer.querySelector(".read-more-content-btn");
      if (readMoreBtn) {
        removeClass(readMoreBtn, "hidden");
      }

      var readLessBtn = topTextContainer.querySelector(".read-less-content-btn");
      if (readLessBtn) {
        addClass(readLessBtn, "hidden");
      }
    }
  }

  function init() {
    $(".lineup-count-text-container .decrease-count").addEventListener("click", decreaseLineupCount);
    $(".lineup-count-text-container .increase-count").addEventListener("click", increaseLineupCount);
    $(".lineup-count-text-container .lineup-count-input").addEventListener("input", setLineupCount);
    $(".filters-holder #websites").addEventListener("change", changeSlatesProvider);
    $(".filters-holder #match-type").addEventListener("change", changeMatchType);
    $(".slates-filter .DK-slates-selection").addEventListener("change", showSlateMatches);
    $(".slates-filter .FD-slates-selection").addEventListener("change", showSlateMatches);
    $(".slates-filter .showdown-slates-selection").addEventListener("change", showShowdownSlateMatches);
    $all(".players-positions-filters-container .position-filter").forEach(function(filterBtn) {
      filterBtn.addEventListener("click", applyPlayerPositionFilter);
    });
    $(".player-search-container .player-search-input").addEventListener("input", searchPlayer);
    $all(".players-category-buttons-container .players-category").forEach(function(playersCategory) {
      playersCategory.addEventListener("click", applyPlayerCategoryFilter);
    });
    var buildBtnBottom = $(".build-lineups-bottom");
    if (buildBtnBottom) {
      buildBtnBottom.addEventListener("click", prepareLineupFetchData);
    }
    var buildBtn = $(".build-lineups");
    if (buildBtn) {
      buildBtn.addEventListener("click", prepareLineupFetchData);
    }
    var pointsValueSelect = $(".player-points-value-select");
    if (pointsValueSelect) {
      pointsValueSelect.addEventListener("change", changeLineupPoints);
    }
    var lineupSalaryDscBtn = $(".lineup-salary-sort-descending-btn");
    if (lineupSalaryDscBtn) {
      lineupSalaryDscBtn.addEventListener("click", sortLineupSalary);
    }
    var lineupSlaryAscBtn = $(".lineup-salary-sort-ascending-btn");
    if (lineupSlaryAscBtn) {
      lineupSlaryAscBtn.addEventListener("click", sortLineupSalary);
    }
    var salaryDscBtn = $(".salary-sort-descending-btn");
    if (salaryDscBtn) {
      salaryDscBtn.addEventListener("click", sortPlayersSalary);
    }
    var slaryAscBtn = $(".salary-sort-ascending-btn");
    if (slaryAscBtn) {
      slaryAscBtn.addEventListener("click", sortPlayersSalary);
    }
    var lineupPointsValueAscBtnDesktop = $(".lineup-points-value-sort-descending-btn");
    if (lineupPointsValueAscBtnDesktop) {
      lineupPointsValueAscBtnDesktop.addEventListener("click", sortLineupPointsValue);
    }
    var lineupPointsValueDescBtnDesktop = $(".lineup-points-value-sort-ascending-btn");
    if (lineupPointsValueDescBtnDesktop) {
      lineupPointsValueDescBtnDesktop.addEventListener("click", sortLineupPointsValue);
    }
    var pointsValueAscBtnDesktop = $(".lineups-table .points-value-sort-descending-btn");
    if (pointsValueAscBtnDesktop) {
      pointsValueAscBtnDesktop.addEventListener("click", sortPointsValue);
    }
    var pointsValueDescBtnDesktop = $(".lineups-table .points-value-sort-ascending-btn");
    if (pointsValueDescBtnDesktop) {
      pointsValueDescBtnDesktop.addEventListener("click", sortPointsValue);
    }
    $(".reset-lineup-btn").addEventListener("click", openConfirmationPopup);

    if (desktop) {
      $(".refresh-lineup-btn").addEventListener("click", prepareLineupFetchData);
    } else {
      $(".refresh-lineup-btn").addEventListener("click", enableRetryBuild);
      var topTextContainer = $(".pfn-content-container .top-text-content-container");
      if (topTextContainer) {
        var readMoreBtn = topTextContainer.querySelector(".read-more-content-btn");
        if (readMoreBtn) {
          readMoreBtn.addEventListener("click", expandPageTopTextContent);
        }

        var readLessBtn = topTextContainer.querySelector(".read-less-content-btn");
        if (readLessBtn) {
          readLessBtn.addEventListener("click", shrinkPageTopTextContent);
        }
      }
    }

    $(".download-csv-btn").addEventListener("click", downloadCSV);
  }

  function initListScroll(container, leftScrollButton, rightScrollButton, leftScrollEvent, rightScrollEvent) {
    leftScrollButton.onclick = function() {
      leftScrollEvent();
      container.scrollBy({
        behavior: "smooth",
        top: 0,
        left: -300
      });
    }

    rightScrollButton.onclick = function() {
      rightScrollEvent();
      container.scrollBy({
        behavior: "smooth",
        top: 0,
        left: 300
      });
    }

    new KeedaCarousalControlsHelper({
      target: container,
      whenFistItemInViewport: function(entry) {
        addClass(leftScrollButton, "hidden");
      },
      whenFistItemNotInViewport: function(entry) {
        if (container.children.length > 0) {
          removeClass(leftScrollButton, "hidden");
        }
      },
      whenLastItemInViewport: function(entry) {
        addClass(rightScrollButton, "hidden");
      },
      whenLastItemNotInViewport: function(entry) {
        if (container.children.length > 0) {
          removeClass(rightScrollButton, "hidden");
        }
      }
    }).observeTarget();
  }

  init();
  })();
</script>
