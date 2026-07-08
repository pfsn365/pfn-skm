<script>
  const ultimateSimDataURL =
    "{$smarty.const.STATIC_URL}/{$ultimate_sim_data_source_path}".replace("staticd.pr", "staticj.pr");

  function getData(url, processingFunction) {
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        let processedData = processingFunction(data);
        return processedData;
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        throw error;
      });
  }

  function getUltimateSimData() {
    return getData(ultimateSimDataURL, processUltimateSimData);
  }

  function getPlayersData() {
    return processPlayerData(ultimateSimData["offseason_sim_player"]);
  }

  function getTeamsData() {
    return processTeamData(ultimateSimData["offseason_sim_team"]);
  }

  function processPlayerData(a) {
    let players = [];
    for (let i = 0; i < a.length; i += 1) {
      let cP = a[i]; // cP = currentPlayer
      if (!cP[1]) { // Player name not present
        continue;
      }
      players.push({
        id: cP[0] * 1,
        name: cP[1],
        position: normalizePosition(cP[2]),
        team: cP[29],
        capHit: currencyToInteger(cP[4]),
        deadMoney: currencyToInteger(cP[5]),
        capSavings: currencyToInteger(cP[6]),
        restructureSavings: currencyToInteger(cP[7]),
        status: 'active',
        freeAgent: cP[12].indexOf('Yes') >= 0,
        cutPercent: percentageToInteger(cP[10]),
        restructurePercent: percentageToInteger(cP[11]),
        restructureCapHit: currencyToInteger(cP[8]),
        restructurable: cP[9].indexOf('Yes') >= 0,
        transitionTagEligible: cP[15].indexOf('Y') >= 0,
        transitionValue: currencyToInteger(cP[18]),
        franchiseTagEligible: cP[14].indexOf('Y') >= 0,
        franchiseValue: currencyToInteger(cP[17]),
        perYearMinimum: currencyToInteger(cP[21]),
        perYearMaximum: currencyToInteger(cP[24]),
        guaranteedMinimum: currencyToInteger(cP[21]) * cP[23] / 100,
        reSigningPercent: percentageToInteger(cP[27]),
        freeAgentSigningPercent: percentageToInteger(cP[28]),
        minimumYears: parseInt(cP[25]),
        maximumYears: parseInt(cP[26]),
        franchiseTagFrequency: percentageToInteger(cP[19]),
        transitionTagFrequency: percentageToInteger(cP[20])
      });
    }
    return players;
  }

  function processTeamData(a) {
    let teams = [];
    for (let i = 4; i < a.length; i += 1) {
      let cT = a[i]; // cT = currentTeam
      let teamNeeds = {
        "QB": parseInt(cT[15]),
        "RB": parseInt(cT[16]),
        "WR": parseInt(cT[17]),
        "TE": parseInt(cT[18]),
        "OT": parseInt(cT[19]),
        "OG": parseInt(cT[20]),
        "OC": parseInt(cT[21]),
        "EDGE": parseInt(cT[22]),
        "DT": parseInt(cT[23]),
        "LB": parseInt(cT[24]),
        "CB": parseInt(cT[25]),
        "S": parseInt(cT[26])
      };
      teams.push({
        "name": cT[0],
        "teamCode": cT[1],
        "id": cT[1],
        "activeCapHit": currencyToInteger(cT[3]),
        "deadMoney": currencyToInteger(cT[4]),
        "reservedForDraft": currencyToInteger(cT[5]),
        "capLiabilities": currencyToInteger(cT[6]),
        "carryOver": currencyToInteger(cT[7]),
        "salaryCap": currencyToInteger(cT[8]),
        "capSpaceRemaining": currencyToInteger(cT[9]),
        "maxCapCutPercentage": percentageToInteger(cT[10]),
        "maxCapRestructurePercentage": percentageToInteger(cT[11]),
        "maxCapResigningPercentage": percentageToInteger(cT[12]),
        "doNotSign": cT[13],
        "alwaysSign": cT[14],
        "logo": STATIC_URL + teamLogoPath + cT[2] + ".png",
        "teamNeeds": teamNeeds

      })
    }
    return teams;
  }

  const normalizePosition = (position) => {
    const positionMap = {
      'RT': 'OT',
      'LT': 'OT',
      'RG': 'OG',
      'LG': 'OG',
      'DE': 'EDGE',
      'OLB': 'EDGE',
      'DL': 'DT',
      'MLB': 'LB',
      'ILB': 'LB',
      'SS': 'S',
      'FS': 'S'
    };
    return positionMap[position] || position;
  }

  function percentageToInteger(percentageStr) {
    if (!percentageStr) {
      return 0;
    }
    // Remove percentage symbol
    const cleanStr = percentageStr.replace('%', '');
    // Convert to float and divide by 100 to convert percentage to decimal
    // Then multiply by 100 to convert decimal to integer
    // Math.round handles any floating point precision issues
    const percentage = Math.round(parseFloat(cleanStr) / 100 * 100);
    return percentage;
  }

  function currencyToInteger(currencyStr) {
    if (!currencyStr) {
      return 0;
    }
    // Remove currency symbol, commas and whitespace
    const cleanStr = currencyStr.replace(/[$,\s]/g, '');

    // Convert to float first to handle decimal places
    // Then multiply by 100 to convert dollars to cents
    // Math.round handles any floating point precision issues
    const cents = Math.round(parseInt(cleanStr));

    return cents;
  }

  function mapHeadersAndData(data) {
    const mappedData = [];
    const headers = data[0];
    for (let i = 1; i < data.length; i++) {
      const singleMap = {};
      headers.forEach((header, index) => {
        singleMap[header] = data[i][index];
      });
      
      mappedData.push(singleMap);
    }
    return mappedData;
  }

  function processMdsConstantsData(data) {
    const singleNumberKeys = ['pickstart', 'maxPicksInPackage', 'blockTradeUpPick'];
    const processed = {};
    if (!data || !data.length) {
      return processed;
    }
    const row = data[0];
    Object.keys(row).forEach(key => {
      const value = row[key];
      if (singleNumberKeys.indexOf(key) >= 0) {
        processed[key] = parseFloat(value);
      } else {
        processed[key] = String(value).split(',').map(v => parseFloat(v.trim()));
      }
    });
    return processed;
  }

  function processUltimateSimData(data) {
    ultimateSimData = {};
    data.collections.forEach(list => {
      let mappedData;
      if (list.sheetName !== "offseason_sim_player" && list.sheetName !== "offseason_sim_team" && list.sheetName !== "next_season_playoffs" 
      && list.sheetName !== "next_season_team_level_data" && list.sheetName !== "next_season_sim" && list.sheetName !== "winning_probability" 
      && list.sheetName !== "current_season_simulation" && list.sheetName !== "team_level_data" && list.sheetName !== "playoffs") {
        mappedData = mapHeadersAndData(list.data);
      } else {
        mappedData = list.data;
      }

      if (list.sheetName === "mds_constants") {
        mappedData = processMdsConstantsData(mappedData);
      }

      ultimateSimData[list.sheetName] = mappedData;
    });

    const timestampContainer = $(".updated-timestamp-container");
		if (timestampContainer) {
			timestampContainer.innerHTML = "UPDATED ON " + new Date(data[
				"updatedTime"]).changeTimezone("America/New_York").format(
					"mmm d, yyyy , hh:MM TT") + " EDT";
		}
  }
</script>
