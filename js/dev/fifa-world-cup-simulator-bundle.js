// ========================================
// 1. DATA MODULE DEFINITION (FIFAWorldCupData)
// ========================================

trackGAEventForPage("page_view");

const FIFAWorldCupData = (function () {
  'use strict';

  // Mapping of team names to codes and ISO flag codes
  const TEAM_META = {
    'Algeria': { code: 'ALG', flagCode: 'ALG' },
    'Argentina': { code: 'ARG', flagCode: 'ARG' },
    'Australia': { code: 'AUS', flagCode: 'AUS' },
    'Austria': { code: 'AUT', flagCode: 'AUT' },
    'Belgium': { code: 'BEL', flagCode: 'BEL' },
    'Brazil': { code: 'BRA', flagCode: 'BRA' },
    'Cabo Verde': { code: 'CPV', flagCode: 'CPV' },
    'Canada': { code: 'CAN', flagCode: 'CAN' },
    'Colombia': { code: 'COL', flagCode: 'COL' },
    'Congo DR': { code: 'COD', flagCode: 'COD' },
    'Côte d\'Ivoire': { code: 'CIV', flagCode: 'CIV' },
    'Croatia': { code: 'CRO', flagCode: 'CRO' },
    'Curaçao': { code: 'CUW', flagCode: 'CUW' },
    'Denmark': { code: 'DEN', flagCode: 'DEN' },
    'Ecuador': { code: 'ECU', flagCode: 'ECU' },
    'Egypt': { code: 'EGY', flagCode: 'EGY' },
    'England': { code: 'ENG', flagCode: 'ENG' },
    'France': { code: 'FRA', flagCode: 'FRA' },
    'Germany': { code: 'GER', flagCode: 'GER' },
    'Ghana': { code: 'GHA', flagCode: 'GHA' },
    'Haiti': { code: 'HAI', flagCode: 'HAI' },
    'IR Iran': { code: 'IRN', flagCode: 'IRN' },
    'Iran': { code: 'IRN', flagCode: 'IRN' },
    'Iraq': { code: 'IRQ', flagCode: 'IRQ' },
    'Italy': { code: 'ITA', flagCode: 'ITA' },
    'Japan': { code: 'JPN', flagCode: 'JPN' },
    'Jordan': { code: 'JOR', flagCode: 'JOR' },
    'Korea Republic': { code: 'KOR', flagCode: 'KOR' },
    'Mexico': { code: 'MEX', flagCode: 'MEX' },
    'Morocco': { code: 'MAR', flagCode: 'MAR' },
    'Netherlands': { code: 'NED', flagCode: 'NED' },
    'New Zealand': { code: 'NZL', flagCode: 'NZL' },
    'Norway': { code: 'NOR', flagCode: 'NOR' },
    'Panama': { code: 'PAN', flagCode: 'PAN' },
    'Paraguay': { code: 'PAR', flagCode: 'PAR' },
    'Poland': { code: 'POL', flagCode: 'POL' },
    'Portugal': { code: 'POR', flagCode: 'POR' },
    'Qatar': { code: 'QAT', flagCode: 'QAT' },
    'Saudi Arabia': { code: 'KSA', flagCode: 'KSA' },
    'Scotland': { code: 'SCO', flagCode: 'SCO' },
    'Senegal': { code: 'SEN', flagCode: 'SEN' },
    'Slovakia': { code: 'SVK', flagCode: 'SVK' },
    'South Africa': { code: 'RSA', flagCode: 'RSA' },
    'Spain': { code: 'ESP', flagCode: 'ESP' },
    'Switzerland': { code: 'SUI', flagCode: 'SUI' },
    'Tunisia': { code: 'TUN', flagCode: 'TUN' },
    'Uruguay': { code: 'URU', flagCode: 'URU' },
    'USA': { code: 'USA', flagCode: 'USA' },
    'Uzbekistan': { code: 'UZB', flagCode: 'UZB' },

    // Additional potential qualifiers
    'New Caledonia': { code: 'NCL', flagCode: 'NCL' },
    'Jamaica': { code: 'JAM', flagCode: 'JAM' },
    'Bolivia': { code: 'BOL', flagCode: 'BOL' },
    'Suriname': { code: 'SUR', flagCode: 'SUR' },
    'Wales': { code: 'WAL', flagCode: 'WAL' },
    'Bosnia & Herzegovina': { code: 'BIH', flagCode: 'BIH' },
    'Bosnia and Herzegovina': { code: 'BIH', flagCode: 'BIH' },
    'Northern Ireland': { code: 'NIR', flagCode: 'NIR' },
    'Ukraine': { code: 'UKR', flagCode: 'UKR' },
    'Sweden': { code: 'SWE', flagCode: 'SWE' },
    'Albania': { code: 'ALB', flagCode: 'ALB' },
    'Kosovo': { code: 'KOS', flagCode: 'KOS' },
    'Turkey': { code: 'TUR', flagCode: 'TUR' },
    'Romania': { code: 'ROU', flagCode: 'ROU' },
    'Czechia': { code: 'CZE', flagCode: 'CZE' },
    'Czech Republic': { code: 'CZE', flagCode: 'CZE' },
    'Republic of Ireland': { code: 'IRL', flagCode: 'IRL' },
    'Ireland': { code: 'IRL', flagCode: 'IRL' },
    'North Macedonia': { code: 'MKD', flagCode: 'MKD' },
    // Qualifier placeholders (no flag)
    'UEFA Qual. 1': { code: 'UQ1', flagCode: 'transparent-flag' },
    'UEFA Qual. 2': { code: 'UQ2', flagCode: 'transparent-flag' },
    'UEFA Qual. 3': { code: 'UQ3', flagCode: 'transparent-flag' },
    'UEFA Qual. 4': { code: 'UQ4', flagCode: 'transparent-flag' },
    'IC Qual. 1': { code: 'IC1', flagCode: 'transparent-flag' },
    'IC Qual. 2': { code: '2', flagCode: 'transparent-flag' }
  };

  // Flag image URL generator
  function getFlagUrl(flagCode) {
    if (!flagCode) return null;
    return STATIC_URL + '/skm/assets/pfn/tools/fifa-world-cup-simulator/team-logos/' +
      flagCode + '.png';
  }

  let TEAMS = {};
  let GROUPS = {};
  let SCHEDULE = {}; // Matches by group
  let BRACKET = null; // Knockout bracket structure
  let KNOCKOUT_RESULTS = {}; // Pre-filled knockout results
  let THIRD_PLACE_LOGIC = null; // Third-place team mapping lookup table
  let WIN_PROBABILITY = {};
  let dataLoaded = false;
  let loadPromise = null;

  /**
   * Load data from external JSON source
   */
  async function loadExternalData() {
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
      try {
        var fileName = STATIC_URL + "/" + DATA_SOURCE_PATH;
        var DATA_URL =
          fileName
            .replace("staticd.pr", "staticj.pr") + "soccerSimulatorData.json";
        const response = await fetch(DATA_URL);
        const data = await response.json();

        const timestampContainer = $(".updated-timestamp-container");
        if (timestampContainer) {
          timestampContainer.innerHTML = "UPDATED ON " + new Date(data[
            "updatedTime"]).changeTimezone("America/New_York").format(
              "mmm d, yyyy , hh:MM TT") + " EDT";
        }

        // Find team_level_data in collections array
        const teamCollection = data.collections?.find(c => c.sheetName ===
          'team_level_data');

        // First, build a team-to-group map from schedule (for teams with missing groups)
        const teamGroupFromSchedule = {};
        const scheduleCollection = data.collections?.find(c => c.sheetName ===
          'schedule');
        if (scheduleCollection && scheduleCollection.data) {
          const schedHeaders = scheduleCollection.data[0];
          const homeIdx = schedHeaders.indexOf('Home');
          const awayIdx = schedHeaders.indexOf('Away');
          const grpIdx = schedHeaders.indexOf('Group');

          for (let i = 1; i < scheduleCollection.data.length; i++) {
            const row = scheduleCollection.data[i];
            const group = row[grpIdx];
            if (group) {
              if (row[homeIdx]) teamGroupFromSchedule[row[homeIdx]] = group;
              if (row[awayIdx]) teamGroupFromSchedule[row[awayIdx]] = group;
            }
          }
        }

        if (teamCollection && teamCollection.data) {
          TEAMS = {};
          GROUPS = {};

          const rows = teamCollection.data;
          const headers = rows[0]; // First row is headers

          // Find column indices
          const teamIdx = headers.indexOf('Team');
          const groupIdx = headers.indexOf('Group');
          const rankingIdx = headers.indexOf('Ranking');

          // Process each team row (skip header row)
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            let teamName = row[teamIdx];
            let group = row[groupIdx];
            const ranking = parseInt(row[rankingIdx]) || 50;

            if (!teamName) continue;

            // If group is empty, try to get from schedule
            if (!group && teamGroupFromSchedule[teamName]) {
              group = teamGroupFromSchedule[teamName];
            }

            if (!group) continue;

            const meta = TEAM_META[teamName] || {
              code: teamName.substring(0, 3).toUpperCase(),
              flagCode: 'xx'
            };

            const code = meta.code;
            const flagCode = meta.flagCode;

            if (teamName === "Korea Republic") {
              teamName = "Korea Rep.";
            }
            if (teamName === "Bosnia & Herzegovina") {
              teamName = "Bosnia & Herz.";
            }
            TEAMS[code] = {
              name: teamName,
              code: code,
              flagCode: flagCode,
              flagUrl: getFlagUrl(flagCode),
              group: group,
              ranking: ranking
            };

            // Build groups
            if (!GROUPS[group]) {
              GROUPS[group] = [];
            }
            GROUPS[group].push(code);
          }
        }

        // Load schedule (reuse scheduleCollection from above)
        if (scheduleCollection && scheduleCollection.data) {
          SCHEDULE = {};
          const rows = scheduleCollection.data;
          const headers = rows[0];

          // Find column indices
          const dateIdx = headers.indexOf('Date');
          const homeIdx = headers.indexOf('Home');
          const awayIdx = headers.indexOf('Away');
          const groupIdx = headers.indexOf('Group');
          const homeScoreIdx = headers.indexOf('Home Score');
          const awayScoreIdx = headers.indexOf('Away Score');
          const winnerIdx = headers.indexOf('Winner');
          // Fair play columns
          const homeFairPlayIdx = headers.indexOf('Home Team Fair Play Score');
          const awayFairPlayIdx = headers.indexOf('Away Team Fair Play Score');

          // Process each match row (skip header row)
          let matchNum = 1;
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const homeName = row[homeIdx];
            const awayName = row[awayIdx];
            const group = row[groupIdx];
            const date = row[dateIdx];
            const homeScore = row[homeScoreIdx];
            const awayScore = row[awayScoreIdx];
            const winnerName = row[winnerIdx];
            // Fair play data (higher is better - 0 is good, negative from cards)
            const homeFairPlay = homeFairPlayIdx >= 0 ? parseInt(row[
              homeFairPlayIdx]) || 0 : 0;
            const awayFairPlay = awayFairPlayIdx >= 0 ? parseInt(row[
              awayFairPlayIdx]) || 0 : 0;

            if (!homeName || !awayName || !group) continue;

            // Get team codes
            const homeMeta = TEAM_META[homeName] || {
              code: homeName.substring(
                0, 3).toUpperCase()
            };
            const awayMeta = TEAM_META[awayName] || {
              code: awayName.substring(
                0, 3).toUpperCase()
            };

            // Determine winner code
            let winnerCode = null;
            if (winnerName && winnerName !== '') {
              if (winnerName === 'Draw') {
                winnerCode = 'draw';
              } else {
                const winnerMeta = TEAM_META[winnerName] ||
                  { code: winnerName.substring(0, 3).toUpperCase() };
                winnerCode = winnerMeta.code;
              }
            }

            if (!SCHEDULE[group]) {
              SCHEDULE[group] = [];
            }

            SCHEDULE[group].push({
              id: 'G' + group + '-M' + (SCHEDULE[group].length + 1),
              team1: homeMeta.code,
              team2: awayMeta.code,
              group: group,
              date: date,
              matchday: Math.ceil((SCHEDULE[group].length + 1) / 2),
              homeScore: homeScore !== '' ? parseInt(homeScore) :
                null,
              awayScore: awayScore !== '' ? parseInt(awayScore) :
                null,
              winner: winnerCode,
              homeFairPlay: homeFairPlay,
              awayFairPlay: awayFairPlay
            });
            matchNum++;
          }
          console.log('[FIFA Data] Loaded', matchNum - 1, 'scheduled matches');
        }

        // Load knockouts bracket structure
        const knockoutsCollection = data.collections?.find(c => c.sheetName ===
          'knockouts');
        if (knockoutsCollection && knockoutsCollection.data) {
          BRACKET = loadKnockoutsBracket(knockoutsCollection.data);
          console.log('[FIFA Data] Loaded knockout bracket from sheet');
        }

        // Load third-place logic table
        const thirdPlaceCollection = data.collections?.find(c => c.sheetName ===
          'third_placed_logic');
        if (thirdPlaceCollection && thirdPlaceCollection.data) {
          THIRD_PLACE_LOGIC = loadThirdPlaceLogic(thirdPlaceCollection.data);
          console.log('[FIFA Data] Loaded third-place logic table with', Object
            .keys(THIRD_PLACE_LOGIC).length, 'scenarios');
        }

        dataLoaded = true;
        console.log('[FIFA Data] Loaded', Object.keys(TEAMS).length,
          'teams from external source');
        console.log('[FIFA Data] Groups:', Object.keys(GROUPS).sort().join(', '));
        console.log('[FIFA Data] Teams per group:', Object.keys(GROUPS).map(g => g +
          ':' + GROUPS[g].length).join(', '));
        console.log('[FIFA Data] Schedule groups:', Object.keys(SCHEDULE).sort()
          .join(', '));

        const loadingOverlay = $(".loading-overlay");
        if (loadingOverlay) {
          loadingOverlay.remove();
        }
        return true;
      } catch (error) {
        console.error('[FIFA Data] Failed to load external data:', error);
        // Fall back to default data
        initializeDefaultData();
        return false;
      }
    })();

    return loadPromise;
  }

  /**
   * Initialize with default data as fallback
   */
  function initializeDefaultData() {
    // Default teams if external load fails
    TEAMS = {
      'USA': {
        name: 'USA',
        code: 'USA',
        flagCode: 'USA',
        flagUrl: getFlagUrl('USA'),
        group: 'A',
        ranking: 11
      },
      'MEX': {
        name: 'Mexico',
        code: 'MEX',
        flagCode: 'MEX',
        flagUrl: getFlagUrl('MEX'),
        group: 'A',
        ranking: 15
      },
      'CAN': {
        name: 'Canada',
        code: 'CAN',
        flagCode: 'CAN',
        flagUrl: getFlagUrl('CAN'),
        group: 'A',
        ranking: 41
      },
      'HAI': {
        name: 'Haiti',
        code: 'HAI',
        flagCode: 'HAI',
        flagUrl: getFlagUrl('HAI'),
        group: 'A',
        ranking: 62
      }
    };

    GROUPS = {
      'A': ['USA', 'MEX', 'CAN', 'HAI']
    };

    dataLoaded = true;
  }

  /**
   * Generate group stage matches for a group
   */
  function generateGroupMatches(groupLetter) {
    const teams = GROUPS[groupLetter];
    const matches = [];
    let matchNum = 1;

    // Round-robin: each team plays every other team once
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          id: 'G' + groupLetter + '-M' + matchNum,
          team1: teams[i],
          team2: teams[j],
          group: groupLetter,
          matchday: getMatchday(i, j)
        });
        matchNum++;
      }
    }

    return matches;
  }

  /**
   * Determine matchday based on team indices
   */
  function getMatchday(i, j) {
    // Matchday 1: 0v1, 2v3
    // Matchday 2: 0v2, 1v3
    // Matchday 3: 0v3, 1v2
    if ((i === 0 && j === 1) || (i === 2 && j === 3)) return 1;
    if ((i === 0 && j === 2) || (i === 1 && j === 3)) return 2;
    return 3;
  }

  /**
   * Generate all group matches
   */
  function getAllGroupMatches() {
    const allMatches = {};
    for (const group of Object.keys(GROUPS)) {
      // Use loaded schedule if available
      if (SCHEDULE[group] && SCHEDULE[group].length > 0) {
        allMatches[group] = SCHEDULE[group];
      } else {
        allMatches[group] = generateGroupMatches(group);
      }
    }
    return allMatches;
  }

  /**
   * Load knockout bracket structure from sheet data
   */
  function loadKnockoutsBracket(data) {
    const headers = data[0];
    const roundIdx = headers.indexOf('Round');
    const matchNumIdx = headers.indexOf('match#');
    const teamAPathIdx = headers.indexOf('teamAPath');
    const teamAIdx = headers.indexOf('teamA');
    const teamBPathIdx = headers.indexOf('teamBPath');
    const teamBIdx = headers.indexOf('teamB');
    const winnerIdx = headers.indexOf('winner');
    const pathwayIdx = headers.indexOf('pathway');

    // Reset knockout results
    KNOCKOUT_RESULTS = {};

    // Map round names from sheet to internal round codes
    const roundMap = {
      '32': 'R32',
      '16': 'R16',
      'Quarterfinal': 'QF',
      'Semi-Final': 'SF',
      '3rd Place': '3P',
      'Final': 'F'
    };

    // Map pathway to side
    const pathwayToSide = {
      '1': 'left',
      '2': 'right',
      'F': 'center'
    };

    const bracket = {
      'R32': {},
      'R16': {},
      'QF': {},
      'SF': {},
      '3P': {},
      'F': {}
    };

    // Track display order within each round/pathway
    const displayOrderCounters = {};

    // First pass: build all matches
    const allMatches = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const roundName = row[roundIdx];
      const matchNum = row[matchNumIdx];
      const teamAPath = row[teamAPathIdx];
      const teamAName = row[teamAIdx];
      const teamBPath = row[teamBPathIdx];
      const teamBName = row[teamBIdx];
      const winnerName = row[winnerIdx];
      const pathway = row[pathwayIdx];

      if (!roundName || !matchNum) continue;

      const roundCode = roundMap[roundName];
      if (!roundCode) continue;

      const side = pathwayToSide[pathway] || 'center';
      const matchId = roundCode + '-' + matchNum;

      // Format team paths for the teams array
      let teamA = formatTeamPathForBracket(teamAPath, roundCode);
      let teamB = formatTeamPathForBracket(teamBPath, roundCode);

      // Extract winner if present
      if (winnerName && winnerName.trim() !== '') {
        const winnerMeta = TEAM_META[winnerName] || {
          code: winnerName.substring(0, 3)
            .toUpperCase()
        };
        KNOCKOUT_RESULTS[matchId] = {
          winner: winnerMeta.code,
          locked: true
        };
        console.log('[FIFA Data] Knockout result: ' + matchId + ' winner = ' + winnerMeta.code);
      }

      allMatches.push({
        roundCode,
        matchNum,
        matchId,
        teamA,
        teamB,
        side,
        pathway,
        rowIndex: i
      });
    }

    // Second pass: determine "next" field by finding which later match references this one
    const matchNextMap = {};
    for (const match of allMatches) {
      // Look for matches that reference this match number in their team paths
      for (const laterMatch of allMatches) {
        if (laterMatch.teamA === match.matchId || laterMatch.teamB === match.matchId) {
          matchNextMap[match.matchId] = laterMatch.matchId;
          break;
        }
        // Also check for loser references (for 3rd place match)
        if (laterMatch.teamA === match.matchId + '-loser' || laterMatch.teamB === match.matchId +
          '-loser') {
          // This is handled via loserTo property
        }
      }
    }

    // Third pass: build the bracket structure
    for (const match of allMatches) {
      const { roundCode, matchNum, matchId, teamA, teamB, side, pathway } = match;

      // Calculate display order within pathway
      const orderKey = roundCode + '-' + pathway;
      if (!displayOrderCounters[orderKey]) {
        displayOrderCounters[orderKey] = 0;
      }
      displayOrderCounters[orderKey]++;

      const matchInfo = {
        teams: [teamA, teamB],
        next: matchNextMap[matchId] || null,
        side: side,
        label: 'Match ' + matchNum,
        matchNum: parseInt(matchNum),
        displayOrder: displayOrderCounters[orderKey]
      };

      // Add loserTo for semi-finals (losers go to 3rd place match)
      if (roundCode === 'SF') {
        // Find the 3rd place match
        const thirdPlaceMatch = allMatches.find(m => m.roundCode === '3P');
        if (thirdPlaceMatch) {
          matchInfo.loserTo = thirdPlaceMatch.matchId;
        }
      }

      bracket[roundCode][matchId] = matchInfo;
    }

    return bracket;
  }

  /**
   * Format team path from sheet format to internal format
   */
  function formatTeamPathForBracket(path, currentRound) {
    if (!path) return 'TBD';

    // Group positions (e.g., "1A", "2B", "3ABCDF") - keep as is
    if (new RegExp('^[123][A-L]$').test(path)) {
      return path;
    }

    // Loser reference (e.g., "L101" -> "SF-101-loser")
    if (path.startsWith('L')) {
      const matchNum = path.substring(1);
      // Determine round from match number
      const round = getRoundFromMatchNum(parseInt(matchNum));
      return round + '-' + matchNum + '-loser';
    }

    // Winner reference (e.g., "W101" -> "SF-101") - some sheets might use W prefix
    if (path.startsWith('W')) {
      const matchNum = path.substring(1);
      const round = getRoundFromMatchNum(parseInt(matchNum));
      return round + '-' + matchNum;
    }

    // Plain match number (e.g., "74" -> "R32-74")
    if (new RegExp('^\\d+$').test(path)) {
      const matchNum = parseInt(path);
      const round = getRoundFromMatchNum(matchNum);
      return round + '-' + matchNum;
    }

    return path;
  }

  /**
   * Determine round code from match number
   */
  function getRoundFromMatchNum(matchNum) {
    if (matchNum >= 73 && matchNum <= 88) return 'R32';
    if (matchNum >= 89 && matchNum <= 96) return 'R16';
    if (matchNum >= 97 && matchNum <= 100) return 'QF';
    if (matchNum >= 101 && matchNum <= 102) return 'SF';
    if (matchNum === 103) return '3P';
    if (matchNum === 104) return 'F';
    return 'R32'; // fallback
  }

  /**
   * Load third-place logic lookup table from sheet
   */
  function loadThirdPlaceLogic(data) {
    const header = data[0];
    // Match numbers are in columns 13-20 of header row
    const matchColumns = [];
    for (let i = 13; i <= 20; i++) {
      if (header[i]) {
        matchColumns.push({ index: i, matchNum: header[i] });
      }
    }

    // Build lookup table: key = sorted qualifying groups, value = match assignments
    const lookupTable = {};

    for (let rowIdx = 1; rowIdx < data.length; rowIdx++) {
      const row = data[rowIdx];

      // Extract qualifying groups from columns 1-12 (non-empty single letter cells A-L)
      const qualifyingGroups = [];
      for (let col = 1; col <= 12; col++) {
        const val = row[col];
        if (val && new RegExp('^[A-L]$').test(val.trim())) {
          qualifyingGroups.push(val.trim());
        }
      }

      if (qualifyingGroups.length !== 8) continue; // Must have exactly 8 groups

      // Create key from sorted groups
      const key = qualifyingGroups.sort().join('');

      // Map match numbers to third-place teams
      const matchAssignments = {};
      for (const mc of matchColumns) {
        const thirdPlaceTeam = row[mc.index]; // e.g., "3E", "3F"
        if (thirdPlaceTeam) {
          matchAssignments[mc.matchNum] = thirdPlaceTeam;
        }
      }

      lookupTable[key] = matchAssignments;
    }

    return lookupTable;
  }

  /**
   * Get the third-place team for a specific match based on which groups qualified
   */
  function getThirdPlaceTeamForMatch(matchNum, qualifyingGroups) {
    if (!THIRD_PLACE_LOGIC || !qualifyingGroups || qualifyingGroups.length !== 8) {
      return null;
    }

    const key = [...qualifyingGroups].sort().join('');
    const assignments = THIRD_PLACE_LOGIC[key];

    if (!assignments) {
      console.warn('[FIFA Data] No third-place logic found for groups:', key);
      return null;
    }

    const assignment = assignments[matchNum]; // e.g., "3E"
    if (assignment && assignment.startsWith('3')) {
      return assignment.substring(1); // Return just the group letter
    }

    return null;
  }

  // Full bracket for 32 teams advancing (Fallback)
  const BRACKET_STRUCTURE_SIMPLE = {
    // Round of 32 - 16 matches (73-88)
    'R32': {
      'R32-73': {
        teams: ['2A', '2B'],
        next: 'R16-90',
        side: 'left',
        label: 'Match 73',
        matchNum: 73,
        displayOrder: 3
      },
      'R32-74': {
        teams: ['1E', '3ABCDF'],
        next: 'R16-89',
        side: 'left',
        label: 'Match 74',
        matchNum: 74,
        displayOrder: 1
      },
      'R32-75': {
        teams: ['1F', '2C'],
        next: 'R16-90',
        side: 'left',
        label: 'Match 75',
        matchNum: 75,
        displayOrder: 4
      },
      'R32-76': {
        teams: ['1C', '2F'],
        next: 'R16-91',
        side: 'right',
        label: 'Match 76',
        matchNum: 76,
        displayOrder: 1
      },
      'R32-77': {
        teams: ['1I', '3CDFGH'],
        next: 'R16-89',
        side: 'left',
        label: 'Match 77',
        matchNum: 77,
        displayOrder: 2
      },
      'R32-78': {
        teams: ['2E', '2I'],
        next: 'R16-91',
        side: 'right',
        label: 'Match 78',
        matchNum: 78,
        displayOrder: 2
      },
      'R32-79': {
        teams: ['1A', '3CEFHI'],
        next: 'R16-92',
        side: 'right',
        label: 'Match 79',
        matchNum: 79,
        displayOrder: 3
      },
      'R32-80': {
        teams: ['1L', '3EHIJK'],
        next: 'R16-92',
        side: 'right',
        label: 'Match 80',
        matchNum: 80,
        displayOrder: 4
      },
      'R32-81': {
        teams: ['1D', '3BEFIJ'],
        next: 'R16-94',
        side: 'left',
        label: 'Match 81',
        matchNum: 81,
        displayOrder: 7
      },
      'R32-82': {
        teams: ['1G', '3AEHIJ'],
        next: 'R16-94',
        side: 'left',
        label: 'Match 82',
        matchNum: 82,
        displayOrder: 8
      },
      'R32-83': {
        teams: ['2K', '2L'],
        next: 'R16-93',
        side: 'left',
        label: 'Match 83',
        matchNum: 83,
        displayOrder: 5
      },
      'R32-84': {
        teams: ['1H', '2J'],
        next: 'R16-93',
        side: 'left',
        label: 'Match 84',
        matchNum: 84,
        displayOrder: 6
      },
      'R32-85': {
        teams: ['1B', '3EFGIJ'],
        next: 'R16-96',
        side: 'right',
        label: 'Match 85',
        matchNum: 85,
        displayOrder: 7
      },
      'R32-86': {
        teams: ['1J', '2H'],
        next: 'R16-95',
        side: 'right',
        label: 'Match 86',
        matchNum: 86,
        displayOrder: 5
      },
      'R32-87': {
        teams: ['1K', '3DEIJL'],
        next: 'R16-96',
        side: 'right',
        label: 'Match 87',
        matchNum: 87,
        displayOrder: 8
      },
      'R32-88': {
        teams: ['2D', '2G'],
        next: 'R16-95',
        side: 'right',
        label: 'Match 88',
        matchNum: 88,
        displayOrder: 6
      }
    },
    // Round of 16 - 8 matches (89-96)
    'R16': {
      'R16-89': {
        teams: ['R32-74', 'R32-77'],
        next: 'QF-97',
        side: 'left',
        label: 'Match 89',
        matchNum: 89,
        displayOrder: 1
      },
      'R16-90': {
        teams: ['R32-73', 'R32-75'],
        next: 'QF-97',
        side: 'left',
        label: 'Match 90',
        matchNum: 90,
        displayOrder: 2
      },
      'R16-91': {
        teams: ['R32-76', 'R32-78'],
        next: 'QF-99',
        side: 'right',
        label: 'Match 91',
        matchNum: 91,
        displayOrder: 1
      },
      'R16-92': {
        teams: ['R32-79', 'R32-80'],
        next: 'QF-99',
        side: 'right',
        label: 'Match 92',
        matchNum: 92,
        displayOrder: 2
      },
      'R16-93': {
        teams: ['R32-83', 'R32-84'],
        next: 'QF-98',
        side: 'left',
        label: 'Match 93',
        matchNum: 93,
        displayOrder: 3
      },
      'R16-94': {
        teams: ['R32-81', 'R32-82'],
        next: 'QF-98',
        side: 'left',
        label: 'Match 94',
        matchNum: 94,
        displayOrder: 4
      },
      'R16-95': {
        teams: ['R32-86', 'R32-88'],
        next: 'QF-100',
        side: 'right',
        label: 'Match 95',
        matchNum: 95,
        displayOrder: 3
      },
      'R16-96': {
        teams: ['R32-85', 'R32-87'],
        next: 'QF-100',
        side: 'right',
        label: 'Match 96',
        matchNum: 96,
        displayOrder: 4
      }
    },
    // Quarter Finals - 4 matches (97-100)
    'QF': {
      'QF-97': {
        teams: ['R16-89', 'R16-90'],
        next: 'SF-101',
        side: 'left',
        label: 'Match 97',
        matchNum: 97,
        displayOrder: 1
      },
      'QF-98': {
        teams: ['R16-93', 'R16-94'],
        next: 'SF-101',
        side: 'left',
        label: 'Match 98',
        matchNum: 98,
        displayOrder: 2
      },
      'QF-99': {
        teams: ['R16-91', 'R16-92'],
        next: 'SF-102',
        side: 'right',
        label: 'Match 99',
        matchNum: 99,
        displayOrder: 1
      },
      'QF-100': {
        teams: ['R16-95', 'R16-96'],
        next: 'SF-102',
        side: 'right',
        label: 'Match 100',
        matchNum: 100,
        displayOrder: 2
      }
    },
    // Semi Finals - 2 matches (101-102)
    'SF': {
      'SF-101': {
        teams: ['QF-97', 'QF-98'],
        next: 'F-104',
        side: 'left',
        label: 'Match 101',
        matchNum: 101,
        displayOrder: 1,
        loserTo: '3P-103'
      },
      'SF-102': {
        teams: ['QF-99', 'QF-100'],
        next: 'F-104',
        side: 'right',
        label: 'Match 102',
        matchNum: 102,
        displayOrder: 1,
        loserTo: '3P-103'
      }
    },
    // Third Place - Match 103
    '3P': {
      '3P-103': {
        teams: ['SF-101-loser', 'SF-102-loser'],
        next: null,
        side: 'center',
        label: 'Match 103',
        matchNum: 103,
        displayOrder: 1
      }
    },
    // Final - Match 104
    'F': {
      'F-104': {
        teams: ['SF-101', 'SF-102'],
        next: null,
        side: 'center',
        label: 'Match 104',
        matchNum: 104,
        displayOrder: 1
      }
    }
  };

  /**
   * Calculate team strength from ranking using exponential decay
   */
  function calculateStrength(ranking) {
    // Exponential decay: rank 1 = 100, rank 50 ≈ 5 (95% win rate for rank 1)
    // Minimum strength of 3 to prevent complete domination
    return Math.max(3, 100 * Math.pow(0.94, ranking - 1));
  }

  // Public API
  return {
    loadData: loadExternalData,
    isDataLoaded: () => dataLoaded,
    get TEAMS() { return TEAMS; },
    get GROUPS() { return GROUPS; },
    get BRACKET_STRUCTURE() { return BRACKET || BRACKET_STRUCTURE_SIMPLE; },
    get KNOCKOUT_RESULTS() { return KNOCKOUT_RESULTS; },
    getTeam: function (code) {
      return TEAMS[code] || null;
    },
    getGroupTeams: function (groupLetter) {
      return GROUPS[groupLetter] || [];
    },
    getAllGroups: function () {
      return { ...GROUPS };
    },
    getGroupMatches: function (groupLetter) {
      if (SCHEDULE[groupLetter] && SCHEDULE[groupLetter].length > 0) {
        return SCHEDULE[groupLetter];
      }
      return generateGroupMatches(groupLetter);
    },
    getAllGroupMatches: getAllGroupMatches,
    getTeamStrength: function (code) {
      const team = TEAMS[code];
      if (team && team.ranking) {
        return calculateStrength(team.ranking);
      }
      return 50;
    },
    getWinProbability: function (team1, team2) {
      if (WIN_PROBABILITY[team1] && WIN_PROBABILITY[team1][team2]) {
        return WIN_PROBABILITY[team1][team2];
      }
      const s1 = this.getTeamStrength(team1);
      const s2 = this.getTeamStrength(team2);
      return s1 / (s1 + s2);
    },
    getBracketMatch: function (matchId) {
      for (const round in this.BRACKET_STRUCTURE) {
        if (this.BRACKET_STRUCTURE[round][matchId]) {
          return { ...this.BRACKET_STRUCTURE[round][matchId], round };
        }
      }
      return null;
    },
    getRoundMatches: function (round) {
      return this.BRACKET_STRUCTURE[round] ? { ...this.BRACKET_STRUCTURE[round] } : {};
    },
    getMatchesBySide: function (round, side) {
      const matches = this.BRACKET_STRUCTURE[round] || {};
      return Object.keys(matches)
        .filter(id => matches[id].side === side)
        .sort((a, b) => (matches[a].displayOrder || 0) - (matches[b].displayOrder || 0));
    },
    getTotalGroupMatches: function () {
      return Object.keys(GROUPS).length * 6;
    },
    getThirdPlaceTeamForMatch: getThirdPlaceTeamForMatch,
    hasThirdPlaceLogic: function () {
      return THIRD_PLACE_LOGIC !== null;
    },
    getAllThirdPlaceScenarios: function () {
      if (!THIRD_PLACE_LOGIC) return [];
      return Object.entries(THIRD_PLACE_LOGIC).map(([key, assignments]) => ({
        groups: key,
        assignments: assignments
      })).sort((a, b) => a.groups.localeCompare(b.groups));
    },
    getKnockoutMatchForPosition: function (groupPosition) {
      if (!BRACKET || !BRACKET.R32) return null;
      for (const matchId of Object.keys(BRACKET.R32)) {
        const match = BRACKET.R32[matchId];
        if (match.teams && (match.teams[0] === groupPosition || match.teams[1] ===
          groupPosition)) {
          const pathway = match.side === 'left' ? '1' : match.side === 'right' ? '2' : 'F';
          return { matchNum: match.matchNum, pathway };
        }
      }
      return null;
    },
    getGroupKnockoutMatches: function (groupLetter) {
      const firstPos = '1' + groupLetter;
      const secondPos = '2' + groupLetter;
      return {
        first: this.getKnockoutMatchForPosition(firstPos),
        second: this.getKnockoutMatchForPosition(secondPos)
      };
    }
  };
})();

// ========================================
// 2. APPLICATION MODULE DEFINITION (FIFAWorldCupSimulator)
// ========================================

const FIFAWorldCupSimulator = (function () {
  'use strict';

  let state = {
    groupMatchResults: {}, // { matchId: { winner: teamCode|'draw', score1: num, score2: num } }
    groupStandings: {}, // { groupLetter: [{ team, pts, gd, gf, ga, w, d, l }] }
    bracketResults: {}, // { matchId: winnerTeamCode }
    matchScores: {}, // { matchId: { team1: score1, team2: score2 } }
    semiLosers: {},
    isSimulating: false,
    initialized: false,
    activeTab: 'groups' // 'groups' or 'bracket'
  };

  let elements = {};

  // ========================================
  // Initialization
  // ========================================

  async function init() {
    if (state.initialized) return;

    // Load external data first
    try {
      await FIFAWorldCupData.loadData();
    } catch (error) {
      console.warn('[FIFA World Cup Simulator] Using fallback data:', error);
    }

    cacheElements();
    // loadState();
    initializeStandings();
    renderGroups();
    renderBracket();
    updateStats();
    bindEvents();

    state.initialized = true;
    console.log('[FIFA World Cup Simulator] v2.0 Initialized - 48 Teams');
  }

  function cacheElements() {
    elements = {
      groupsGrid: document.getElementById('groups-grid'),
      thirdPlaceSidebar: document.getElementById('third-place-sidebar'),
      r32Left: document.getElementById('r32-left'),
      r32Right: document.getElementById('r32-right'),
      r16Left: document.getElementById('r16-left'),
      r16Right: document.getElementById('r16-right'),
      qfLeft: document.getElementById('qf-left'),
      qfRight: document.getElementById('qf-right'),
      sfLeft: document.getElementById('sf-left'),
      sfRight: document.getElementById('sf-right'),
      final: document.getElementById('final'),
      thirdPlace: document.getElementById('third-place'),
      championDisplay: document.getElementById('champion-display'),
      championTeam: document.getElementById('champion-team'),
      btnSimulateAll: document.getElementById('btn-simulate-all') || document.getElementById('btn-simulate-all-mobile'),
      btnSimulateGroups: document.getElementById('btn-simulate-groups') || document.getElementById('btn-simulate-groups-mobile'),
      btnSimulateToggle: document.getElementById('btn-simulate-toggle') || document.getElementById('btn-simulate-toggle-mobile'),
      simulateDropdownMenu: document.getElementById('simulate-dropdown-menu') || document.getElementById('simulate-dropdown-menu-mobile'),
      btnReset: document.getElementById('btn-reset') || document.getElementById('btn-reset-mobile'),
      btnShare: document.getElementById('btn-share') || document.getElementById('btn-share-mobile'),
      shareModal: document.getElementById('share-modal'),
      shareModalClose: document.getElementById('share-modal-close'),
      btnDownload: document.getElementById('btn-download') || document.getElementById('btn-download-mobile'),
      downloadModal: document.getElementById('download-modal'),
      downloadModalClose: document.getElementById('download-modal-close'),
      loadingOverlay: document.getElementById('simulating-overlay'),
      toastContainer: document.getElementById('toast-container'),
      navToggle: document.querySelector('.nav-toggle'),
      navMenu: document.getElementById('nav-menu'),
      statMatchesPlayed: document.getElementById('stat-matches-played'),
      statTeamsRemaining: document.getElementById('stat-teams-remaining'),
      statGoalsScored: document.getElementById('stat-goals-scored'),
      statCompletion: document.getElementById('stat-completion'),
      tabGroups: document.getElementById('tab-groups') || document.getElementById('tab-groups-mobile'),
      tabBracket: document.getElementById('tab-bracket') || document.getElementById('tab-bracket-mobile'),
      groupsSection: document.getElementById('groups-section'),
      bracketSection: document.getElementById('bracket'),
      tabPathway1: document.getElementById('tab-pathway1'),
      tabPathway2: document.getElementById('tab-pathway2'),
      tabFinals: document.getElementById('tab-finals'),
      pathway1: document.getElementById('pathway1'),
      pathway2: document.getElementById('pathway2'),
      finalsPathway: document.getElementById('finals-pathway'),
      statGroupsPredicted: document.getElementById('stat-groups-predicted'),
      statKnockoutPredicted: document.getElementById('stat-knockout-predicted'),
      finalTeam1: document.getElementById('final-team-1'),
      finalTeam2: document.getElementById('final-team-2')
    };
  }

  function bindEvents() {
    // Group match clicks (event delegation)
    if (elements.groupsGrid) {
      elements.groupsGrid.addEventListener('click', handleGroupMatchClick);
      // Listen for score input changes
      elements.groupsGrid.addEventListener('input', handleScoreInput);
    }

    // Bracket match selection
    document.querySelectorAll('.bracket-section').forEach(section => {
      section.addEventListener('click', handleBracketClick);
    });

    // Buttons - Simulate toggle opens dropdown
    if (elements.btnSimulateToggle && elements.simulateDropdownMenu) {
      elements.btnSimulateToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.simulateDropdownMenu.classList.toggle('open');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!elements.simulateDropdownMenu.contains(e.target) &&
          !elements.btnSimulateToggle.contains(e.target)) {
          closeSimulateDropdown();
        }
      });
    }

    if (elements.btnSimulateAll) {
      elements.btnSimulateAll.addEventListener('click', () => {
        simulateAll();
        closeSimulateDropdown();
      });
    }

    if (elements.btnSimulateGroups) {
      elements.btnSimulateGroups.addEventListener('click', () => {
        simulateGroups();
        closeSimulateDropdown();
      });
    }

    if (elements.btnReset) {
      elements.btnReset.addEventListener('click', resetSimulator);
    }

    // Share button opens modal
    if (elements.btnShare) {
      elements.btnShare.addEventListener('click', showShareModal);
    }

    // Share modal close
    if (elements.shareModalClose) {
      elements.shareModalClose.addEventListener('click', hideShareModal);
    }

    // Share modal overlay click to close + image option clicks
    if (elements.shareModal) {
      elements.shareModal.addEventListener('click', function (e) {
        if (e.target === elements.shareModal) {
          hideShareModal();
        }
      });

      // Image type selection triggers share directly
      elements.shareModal.querySelectorAll('[data-share-image]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var imageType = btn.getAttribute('data-share-image');
          hideShareModal();
          handleShare(imageType);
        });
      });
    }

    // Download button opens modal
    if (elements.btnDownload) {
      elements.btnDownload.addEventListener('click', showDownloadModal);
    }

    // Download modal close
    if (elements.downloadModalClose) {
      elements.downloadModalClose.addEventListener('click', hideDownloadModal);
    }

    // Download modal overlay click to close
    if (elements.downloadModal) {
      elements.downloadModal.addEventListener('click', function (e) {
        if (e.target === elements.downloadModal) {
          hideDownloadModal();
        }
      });

      // Download option clicks
      elements.downloadModal.querySelectorAll('.download-option-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var downloadType = btn.getAttribute('data-download');
          hideDownloadModal();
          if (downloadType === 'groups') {
            downloadGroups();
          } else if (downloadType === 'bracket') {
            downloadBracket();
          } else if (downloadType === 'full') {
            downloadFullTournament();
          }
        });
      });
    }

    // Tab switching
    if (elements.tabGroups) {
      elements.tabGroups.addEventListener('click', () => switchTab('groups'));
    }
    if (elements.tabBracket) {
      elements.tabBracket.addEventListener('click', () => switchTab('bracket'));
    }

    // Pathway tab switching
    if (elements.tabPathway1) {
      elements.tabPathway1.addEventListener('click', () => switchPathway('pathway1'));
    }
    if (elements.tabPathway2) {
      elements.tabPathway2.addEventListener('click', () => switchPathway('pathway2'));
    }
    if (elements.tabFinals) {
      elements.tabFinals.addEventListener('click', () => switchPathway('finals'));
    }

    // Mobile nav
    if (elements.navToggle) {
      elements.navToggle.addEventListener('click', toggleNavMenu);
    }

    if (elements.navMenu) {
      elements.navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
          elements.navMenu.classList.remove('open');
          elements.navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('beforeunload', saveState);
  }

  // ========================================
  // Tab Switching
  // ========================================

  function switchTab(tab) {
    state.activeTab = tab;

    if (elements.tabGroups && elements.tabBracket) {
      elements.tabGroups.classList.toggle('active', tab === 'groups');
      elements.tabBracket.classList.toggle('active', tab === 'bracket');
    }

    if (elements.groupsSection && elements.bracketSection) {
      elements.groupsSection.classList.toggle('hidden', tab !== 'groups');
      elements.bracketSection.classList.toggle('hidden', tab !== 'bracket');
    }
  }

  function switchPathway(pathway) {
    // Update tab buttons
    if (elements.tabPathway1) {
      elements.tabPathway1.classList.toggle('active', pathway === 'pathway1');
    }
    if (elements.tabPathway2) {
      elements.tabPathway2.classList.toggle('active', pathway === 'pathway2');
    }
    if (elements.tabFinals) {
      elements.tabFinals.classList.toggle('active', pathway === 'finals');
    }

    // Show/hide pathways
    if (elements.pathway1) {
      elements.pathway1.classList.toggle('hidden', pathway !== 'pathway1');
    }
    if (elements.pathway2) {
      elements.pathway2.classList.toggle('hidden', pathway !== 'pathway2');
    }
    if (elements.finalsPathway) {
      elements.finalsPathway.classList.toggle('hidden', pathway !== 'finals');
    }
  }

  function closeSimulateDropdown() {
    if (elements.simulateDropdownMenu) {
      elements.simulateDropdownMenu.classList.remove('open');
    }
  }

  // ========================================
  // Group Stage Rendering
  // ========================================

  function initializeStandings() {
    const groups = FIFAWorldCupData.getAllGroups();

    // First, clear any previously-locked results (they came from sheet, need to refresh)
    for (const matchId of Object.keys(state.groupMatchResults)) {
      if (state.groupMatchResults[matchId]?.locked) {
        delete state.groupMatchResults[matchId];
      }
    }

    // Pre-populate match results from schedule data (if scores exist)
    // These matches are locked and cannot be edited by the user
    for (const groupLetter of Object.keys(groups).sort()) {
      const matches = FIFAWorldCupData.getGroupMatches(groupLetter);
      for (const match of matches) {
        // Set from sheet data (overrides any user selection for this match)
        if (match.winner) {
          state.groupMatchResults[match.id] = {
            winner: match.winner,
            score1: match.homeScore,
            score2: match.awayScore,
            locked: true // Mark as locked - came from API data
          };
        }
      }
    }

    for (const [groupLetter, teamCodes] of Object.entries(groups)) {
      if (!state.groupStandings[groupLetter]) {
        state.groupStandings[groupLetter] = teamCodes.map(code => ({
          team: code,
          pts: 0,
          gd: 0,
          gf: 0,
          ga: 0,
          w: 0,
          d: 0,
          l: 0,
          played: 0
        }));
      }
    }

    // Pre-populate knockout bracket results from sheet data
    const knockoutResults = FIFAWorldCupData.KNOCKOUT_RESULTS;

    // Always clear bracket results - sheet is the source of truth
    // User selections in brackets don't persist (they can re-enter)
    state.bracketResults = {};
    state.semiLosers = {};
    state.matchScores = {};

    for (const [matchId, result] of Object.entries(knockoutResults)) {
      state.bracketResults[matchId] = result.winner;
      console.log('[FIFA App] Pre-filled knockout: ' + matchId + ' = ' + result.winner);

      // Track semi-final losers for 3rd place match
      if (matchId.startsWith('SF-')) {
        const matchInfo = FIFAWorldCupData.getBracketMatch(matchId);
        if (matchInfo) {
          const teams = getMatchTeams(matchId, matchInfo);
          if (teams.team1 && teams.team2) {
            const loser = teams.team1 === result.winner ? teams.team2 : teams.team1;
            state.semiLosers[matchId] = loser;
          }
        }
      }
    }
  }

  function renderGroups() {
    if (!elements.groupsGrid) return;

    const groups = FIFAWorldCupData.getAllGroups();

    // Update each group placeholder with content
    for (const groupLetter of Object.keys(groups).sort()) {
      const groupElement = document.getElementById('group-' + groupLetter);
      if (groupElement) {
        groupElement.innerHTML = createGroupCardContent(groupLetter);
        groupElement.classList.remove('skeleton');
        groupElement.dataset.group = groupLetter;
      }
    }

    // Render third place table in sidebar
    if (elements.thirdPlaceSidebar) {
      elements.thirdPlaceSidebar.innerHTML = createThirdPlaceTable();
    }

    // Render third place reference table
    renderThirdPlaceReference();
  }

  function createThirdPlaceTable() {
    const groups = FIFAWorldCupData.getAllGroups();
    const thirdPlaceTeams = [];

    // Collect all third place teams
    for (const groupLetter of Object.keys(groups)) {
      const standings = state.groupStandings[groupLetter];
      if (standings && standings.length >= 3) {
        const thirdTeam = standings[2];
        thirdPlaceTeams.push({
          ...thirdTeam,
          group: groupLetter
        });
      }
    }

    // Sort by: Points > GD > GF > Fair Play
    thirdPlaceTeams.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      // Fair play score (higher is better - 0 is good, negative from cards)
      if ((a.fairPlay || 0) !== (b.fairPlay || 0)) return (b.fairPlay || 0) - (a.fairPlay || 0);
      return a.group.localeCompare(b.group);
    });

    // Top 8 third place teams qualify
    const qualifyCount = 8;

    let rowsHtml = thirdPlaceTeams.map((team, idx) => {
      const teamData = FIFAWorldCupData.getTeam(team.team);
      if (!teamData) return '';

      const willQualify = idx < qualifyCount && team.played > 0;
      const wontQualify = idx >= qualifyCount && team.played > 0;
      let rowClass = '';
      if (willQualify) rowClass = 'will-qualify';
      else if (wontQualify) rowClass = 'wont-qualify';

      return '<div class="standings-row ' + rowClass + '">' +
        '<span class="standings-pos">' + (idx + 1) + '</span>' +
        '<span class="standings-group">' + team.group + '</span>' +
        '<span class="standings-team">' +
        (teamData.flagUrl ? '<img class="team-flag" src="' + teamData.flagUrl + '" alt="' +
          teamData.name + ' flag" loading="lazy">' : '') +
        '<span class="team-name">' + teamData.name + '</span>' +
        '</span>' +
        '<span class="standings-stat">' + team.played + '</span>' +
        '<span class="standings-stat">' + team.pts + '</span>' +
        '<span class="standings-stat">' + (team.gd > 0 ? '+' : '') + team.gd + '</span>' +
        '<span class="standings-stat">' + team.gf + '</span>' +
        '</div>';
    }).join('');

    // Generate playoff matchups section
    const qualifyingGroups = thirdPlaceTeams
      .filter((t, idx) => idx < qualifyCount && t.played > 0)
      .map(t => t.group);

    let playoffMatchupsHtml = '';
    if (qualifyingGroups.length === 8) {
      // R32 matches that include third-place teams
      const thirdPlaceMatches = [74, 77, 79, 80, 81, 82, 85, 87];

      playoffMatchupsHtml = thirdPlaceMatches.map(matchNum => {
        const groupLetter = FIFAWorldCupData.getThirdPlaceTeamForMatch(matchNum,
          qualifyingGroups);
        if (!groupLetter) return '';

        const team = thirdPlaceTeams.find(t => t.group === groupLetter);
        if (!team) return '';

        const teamData = FIFAWorldCupData.getTeam(team.team);
        if (!teamData) return '';

        return '<div class="playoff-matchup-row">' +
          '<span class="playoff-match">Match ' + matchNum + '</span>' +
          '<span class="playoff-arrow">→</span>' +
          '<span class="playoff-team">' +
          (teamData.flagUrl ? '<img class="team-flag-small" src="' + teamData.flagUrl +
            '" alt="' + teamData.name + ' flag" loading="lazy">' : '') +
          '<span class="team-name-short">' + teamData.name + '</span>' +
          '<span class="team-group">(' + groupLetter + ')</span>' +
          '</span>' +
          '</div>';
      }).join('');
    }

    return '<div class="third-place-table-container">' +
      '<div class="third-place-header">' +
      '<span>3rd Place Rankings</span>' +
      '<span class="qualify-info">Top 8 advance</span>' +
      '</div>' +
      '<div class="third-place-standings">' +
      '<div class="standings-header">' +
      '<span class="standings-pos">#</span>' +
      '<span class="standings-group">Grp</span>' +
      '<span class="standings-team">Team</span>' +
      '<span class="standings-stat">P</span>' +
      '<span class="standings-stat">Pts</span>' +
      '<span class="standings-stat">GD</span>' +
      '<span class="standings-stat">GF</span>' +
      '</div>' +
      rowsHtml +
      '</div>' +
      (playoffMatchupsHtml ?
        '<div class="playoff-outcomes">' +
        '<div class="playoff-outcomes-header">' +
        '<span>Playoff Match Assignments</span>' +
        '</div>' +
        '<div class="playoff-matchups">' +
        playoffMatchupsHtml +
        '</div>' +
        '</div>' :
        '') +
      '</div>';
  }

  // Store all scenarios for filtering
  let allThirdPlaceScenarios = [];
  let selectedFilterGroups = new Set();

  function renderThirdPlaceReference() {
    const container = document.getElementById('reference-table-container');
    const referenceSection = document.getElementById('third-place-reference');
    if (!container || !referenceSection) return;

    allThirdPlaceScenarios = FIFAWorldCupData.getAllThirdPlaceScenarios();
    if (!allThirdPlaceScenarios || allThirdPlaceScenarios.length === 0) {
      container.innerHTML = '<p class="loading-text">Loading reference data...</p>';
      return;
    }

    // Add filter UI if not already present
    if (!document.getElementById('group-filter')) {
      const filterHtml = '<div class="group-filter" id="group-filter">' +
        '<div class="filter-label">Filter by qualifying groups:</div>' +
        '<div class="filter-buttons">' + ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
          'L'
        ].map(g =>
          '<button class="filter-btn" data-group="' + g + '">' + g + '</button>'
        ).join('') +
        '</div>' +
        '<div class="filter-info">' +
        '<span class="filter-count" id="filter-count">Showing all 495 scenarios</span>' +
        '<button class="filter-clear" id="filter-clear">Clear Filter</button>' +
        '</div>' +
        '</div>';
      referenceSection.querySelector('.reference-header').insertAdjacentHTML('afterend', filterHtml);

      // Attach event listeners
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const group = btn.dataset.group;
          if (selectedFilterGroups.has(group)) {
            selectedFilterGroups.delete(group);
            btn.classList.remove('active');
          } else {
            selectedFilterGroups.add(group);
            btn.classList.add('active');
          }
          updateThirdPlaceTable();
        });
      });

      document.getElementById('filter-clear').addEventListener('click', () => {
        selectedFilterGroups.clear();
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove(
          'active'));
        updateThirdPlaceTable();
      });
    }

    updateThirdPlaceTable();
  }

  function updateThirdPlaceTable() {
    const container = document.getElementById('reference-table-container');
    if (!container) return;

    // Filter scenarios based on selected groups
    let filteredScenarios = allThirdPlaceScenarios;
    if (selectedFilterGroups.size > 0) {
      filteredScenarios = allThirdPlaceScenarios.filter(scenario => {
        // Check if all selected groups are in this scenario
        for (const group of selectedFilterGroups) {
          if (!scenario.groups.includes(group)) {
            return false;
          }
        }
        return true;
      });
    }

    // Update count
    const countEl = document.getElementById('filter-count');
    if (countEl) {
      if (selectedFilterGroups.size === 0) {
        countEl.textContent = 'Showing all 495 scenarios';
      } else if (selectedFilterGroups.size === 8) {
        countEl.textContent = 'Showing ' + filteredScenarios.length + ' scenario (exact match)';
      } else {
        const groupsStr = [...selectedFilterGroups].sort().join(', ');
        countEl.textContent = 'Showing ' + filteredScenarios.length + ' scenarios with groups: ' +
          groupsStr;
      }
    }

    // Match order for columns
    const matchOrder = [74, 77, 79, 80, 81, 82, 85, 87];

    // Build table
    let html = '<table class="reference-table">' +
      '<thead>' +
      '<tr>' +
      '<th class="ref-row-num">#</th>' +
      '<th class="ref-groups">Qualifying Groups</th>' +
      matchOrder.map(m => '<th class="ref-match">M' + m + '</th>').join('') +
      '</tr>' +
      '</thead>' +
      '<tbody>';

    if (filteredScenarios.length === 0) {
      html += '<tr>' +
        '<td colspan="10" class="no-results">No scenarios match the selected groups. Select exactly 8 groups for valid combinations.</td>' +
        '</tr>';
    } else {
      filteredScenarios.forEach((scenario, idx) => {
        const groupsDisplay = scenario.groups.split('').map(g =>
          selectedFilterGroups.has(g) ? '<span class="highlight-group">' + g +
            '</span>' : g
        ).join(' ');

        html += '<tr>' +
          '<td class="ref-row-num">' + (idx + 1) + '</td>' +
          '<td class="ref-groups">' + groupsDisplay + '</td>' +
          matchOrder.map(matchNum => {
            const assignment = scenario.assignments[matchNum] || '-';
            const groupLetter = assignment.startsWith('3') ? assignment.substring(
              1) : assignment;
            const isHighlighted = selectedFilterGroups.has(groupLetter);
            return '<td class="ref-match-cell ' + (isHighlighted ?
              'highlight-cell' : '') + '">' + groupLetter + '</td>';
          }).join('') +
          '</tr>';
      });
    }

    html += '</tbody>' +
      '</table>';

    container.innerHTML = html;
  }

  function createGroupCardContent(groupLetter) {
    const matches = FIFAWorldCupData.getGroupMatches(groupLetter);
    const standings = calculateGroupStandings(groupLetter);

    // Standings table
    let standingsHtml = '<div class="standings-table">' +
      '<div class="standings-header">' +
      '<span class="standings-pos">#</span>' +
      '<span class="standings-team">Team</span>' +
      '<span class="standings-stat">P</span>' +
      '<span class="standings-stat">W</span>' +
      '<span class="standings-stat">D</span>' +
      '<span class="standings-stat">L</span>' +
      '<span class="standings-stat">GF</span>' +
      '<span class="standings-stat">GA</span>' +
      '<span class="standings-stat">GD</span>' +
      '<span class="standings-stat standings-pts">Pts</span>' +
      '</div>' +
      standings.map((team, idx) => {
        const teamData = FIFAWorldCupData.getTeam(team.team);
        let rowClass = '';
        if (idx < 2) rowClass = 'qualified';
        else if (idx === 2) rowClass = 'third-place';

        return '<div class="standings-row ' + rowClass + '">' +
          '<span class="standings-pos">' + (idx + 1) + '</span>' +
          '<span class="standings-team">' +
          (teamData.flagUrl ? '<img class="team-flag" src="' + teamData.flagUrl + '" alt="' +
            teamData.name + ' flag" loading="lazy">' : '') +
          '<span class="team-name">' + teamData.name + '</span>' +
          '</span>' +
          '<span class="standings-stat">' + team.played + '</span>' +
          '<span class="standings-stat">' + team.w + '</span>' +
          '<span class="standings-stat">' + team.d + '</span>' +
          '<span class="standings-stat">' + team.l + '</span>' +
          '<span class="standings-stat">' + team.gf + '</span>' +
          '<span class="standings-stat">' + team.ga + '</span>' +
          '<span class="standings-stat">' + (team.gd > 0 ? '+' : '') + team.gd + '</span>' +
          '<span class="standings-stat standings-pts">' + team.pts + '</span>' +
          '</div>';
      }).join('') +
      '</div>';

    // Matches by matchday
    let matchesHtml = '<div class="group-matches">';

    for (let matchday = 1; matchday <= 3; matchday++) {
      const daymatchs = matches.filter(m => m.matchday === matchday);
      matchesHtml += '<div class="matchday"><div class="matchday-label">Matchday ' + matchday +
        '</div>';

      daymatchs.forEach(match => {
        matchesHtml += createGroupMatchCard(match);
      });

      matchesHtml += '</div>';
    }

    matchesHtml += '</div>';

    // Get knockout match destinations
    const knockoutMatches = FIFAWorldCupData.getGroupKnockoutMatches(groupLetter);
    const knockoutInfo = knockoutMatches.first && knockoutMatches.second ?
      '<span class="knockout-info">1st → M' + knockoutMatches.first.matchNum + ' (P' + knockoutMatches
        .first.pathway + ') | 2nd → M' + knockoutMatches.second.matchNum + ' (P' + knockoutMatches
          .second.pathway + ')</span>' :
      '';

    // Return only inner content (without wrapping div since placeholder already exists)
    return '<div class="group-header">' +
      '<span class="group-label">Group ' + groupLetter + '</span>' +
      knockoutInfo +
      '</div>' +
      standingsHtml +
      matchesHtml;
  }

  function createGroupMatchCard(match) {
    const team1 = FIFAWorldCupData.getTeam(match.team1);
    const team2 = FIFAWorldCupData.getTeam(match.team2);
    const result = state.groupMatchResults[match.id];

    // Show scores if they exist (even partial)
    const score1 = result && result.score1 !== null && result.score1 !== undefined ? result.score1 : '';
    const score2 = result && result.score2 !== null && result.score2 !== undefined ? result.score2 : '';

    const hasResult = result && result.winner !== undefined;
    const team1Winner = hasResult && result.winner === match.team1;
    const team2Winner = hasResult && result.winner === match.team2;
    const isDraw = hasResult && result.winner === 'draw';
    const isLocked = result && result.locked === true;

    const lockedAttr = isLocked ? 'readonly tabindex="-1"' : '';
    const lockedClass = isLocked ? 'locked' : '';

    const cardClasses = 'group-match ' + (hasResult ? 'has-result' : '') + ' ' + (isDraw ? 'is-draw' :
      '') + ' ' + lockedClass;
    return '<div class="' + cardClasses + '" data-match="' + match.id + '" data-team1="' + match.team1 +
      '" data-team2="' + match.team2 + '">' +
      '<div class="match-team ' + (team1Winner ? 'winner' : '') + '"' +
      ' data-team="' + match.team1 + '" data-match="' + match.id + '" data-side="1">' +
      (team1.flagUrl ? '<img class="team-flag" src="' + team1.flagUrl + '" alt="' + team1.name +
        ' flag" loading="lazy">' : '') +
      '<span class="team-name">' + team1.name + '</span>' +
      '</div>' +
      '<div class="match-score-inputs">' +
      '<input type="number" class="score-input" data-match="' + match.id + '" data-side="1"' +
      ' value="' + score1 + '" min="0" max="20" placeholder="-" aria-label="' + team1.name +
      ' score" ' + lockedAttr + '>' +
      '<span class="score-divider ' + lockedClass + '">-</span>' +
      '<input type="number" class="score-input" data-match="' + match.id + '" data-side="2"' +
      ' value="' + score2 + '" min="0" max="20" placeholder="-" aria-label="' + team2.name +
      ' score" ' + lockedAttr + '>' +
      '</div>' +
      '<div class="match-team ' + (team2Winner ? 'winner' : '') + '"' +
      ' data-team="' + match.team2 + '" data-match="' + match.id + '" data-side="2">' +
      '<span class="team-name">' + team2.name + '</span>' +
      (team2.flagUrl ? '<img class="team-flag" src="' + team2.flagUrl + '" alt="' + team2.name +
        ' flag" loading="lazy">' : '') +
      '</div>' +
      '</div>';
  }

  // ========================================
  // Group Match Handling
  // ========================================

  function handleGroupMatchClick(e) {
    // Ignore clicks on score inputs
    if (e.target.classList.contains('score-input')) return;

    const matchEl = e.target.closest('.group-match');
    if (!matchEl) return;

    // Check if match is locked (from API data)
    if (matchEl.classList.contains('locked')) return;

    // Check if clicking on score divider to force a draw
    if (e.target.classList.contains('score-divider')) {
      const matchId = matchEl.dataset.match;
      quickSelectDraw(matchId);
      return;
    }

    // Check if clicking on team to quick-select winner
    const matchTeam = e.target.closest('.match-team');
    if (!matchTeam) return;

    const matchId = matchTeam.dataset.match;
    const teamCode = matchTeam.dataset.team;
    const team1 = matchEl.dataset.team1;
    const team2 = matchEl.dataset.team2;

    quickSelectWinner(matchId, teamCode, team1, team2);
  }

  function quickSelectDraw(matchId) {
    const currentResult = state.groupMatchResults[matchId];

    // Don't modify locked matches
    if (currentResult && currentResult.locked) return;

    // If already a draw, clear the result
    if (currentResult && currentResult.winner === 'draw') {
      delete state.groupMatchResults[matchId];
    } else {
      // Set as draw with random equal score
      const drawScore = Math.floor(Math.random() * 3);
      state.groupMatchResults[matchId] = {
        winner: 'draw',
        score1: drawScore,
        score2: drawScore
      };
    }

    requestAnimationFrame(() => {
      // Recalculate standings and re-render everything
      const matchEl = document.querySelector('.group-match[data-match="' + matchId + '"]');
      if (matchEl) {
        const groupLetter = matchEl.closest('.group-card').dataset.group;
        calculateGroupStandings(groupLetter);
        updateGroupStandingsOnly();
      } else {
        // Fallback if match not visible
        updateGroupStandingsOnly();
      }
      renderBracket();
      updateStats();
      saveState();
    });
  }

  function handleScoreInput(e) {
    if (!e.target.classList.contains('score-input')) return;

    const matchId = e.target.dataset.match;
    const matchEl = e.target.closest('.group-match');
    if (!matchEl) return;

    // Don't modify locked matches
    const currentResult = state.groupMatchResults[matchId];
    if (currentResult && currentResult.locked) return;

    const team1 = matchEl.dataset.team1;
    const team2 = matchEl.dataset.team2;

    // Get both score inputs for this match
    const inputs = matchEl.querySelectorAll('.score-input');
    const score1Input = inputs[0];
    const score2Input = inputs[1];

    const score1 = score1Input.value !== '' ? parseInt(score1Input.value) : null;
    const score2 = score2Input.value !== '' ? parseInt(score2Input.value) : null;

    // Clear result if both scores are empty
    if ((score1 === null || isNaN(score1)) && (score2 === null || isNaN(score2))) {
      delete state.groupMatchResults[matchId];
    } else {
      // Store scores (even partial) and determine winner if both entered
      let winner = undefined;
      const s1 = score1 !== null ? score1 : 0;
      const s2 = score2 !== null ? score2 : 0;

      if (score1 !== null && score2 !== null && !isNaN(score1) && !isNaN(score2)) {
        if (s1 > s2) {
          winner = team1;
        } else if (s2 > s1) {
          winner = team2;
        } else {
          winner = 'draw';
        }
      }

      state.groupMatchResults[matchId] = {
        winner: winner,
        score1: score1,
        score2: score2
      };
    }

    // Debounce the re-render to avoid excessive updates while typing
    clearTimeout(handleScoreInput.timeout);
    handleScoreInput.timeout = setTimeout(() => {
      updateGroupStandingsOnly();
      renderBracket();
      updateStats();
      saveState();
    }, 500);
  }

  // Update standings without re-rendering match inputs
  function updateGroupStandingsOnly() {
    const groups = FIFAWorldCupData.getAllGroups();

    // Recalculate all standings
    for (const groupLetter of Object.keys(groups)) {
      calculateGroupStandings(groupLetter);
    }

    // Update standings tables in DOM
    document.querySelectorAll('.group-card').forEach(card => {
      const groupLetter = card.dataset.group;
      const standings = state.groupStandings[groupLetter];
      if (!standings) return;

      const rows = card.querySelectorAll('.standings-table .standings-row');
      rows.forEach((row, idx) => {
        if (!standings[idx]) return;
        const team = standings[idx];
        const teamData = FIFAWorldCupData.getTeam(team.team);

        // Update row content
        row.querySelector('.standings-pos').textContent = idx + 1;
        const flagEl = row.querySelector('.team-flag');
        if (flagEl) {
          if (teamData.flagUrl) {
            flagEl.src = teamData.flagUrl;
            flagEl.style.display = '';
          } else {
            flagEl.style.display = 'none';
          }
        }
        row.querySelector('.team-name').textContent = teamData.name;

        const stats = row.querySelectorAll('.standings-stat');
        if (stats.length === 8) { // Ensure all 8 stats exist
          stats[0].textContent = team.played; // P
          stats[1].textContent = team.w; // W
          stats[2].textContent = team.d; // D
          stats[3].textContent = team.l; // L
          stats[4].textContent = team.gf; // GF
          stats[5].textContent = team.ga; // GA
          stats[6].textContent = (team.gd > 0 ? '+' : '') + team.gd; // GD
          stats[7].textContent = team.pts; // Pts
        }

        // Update row classes
        row.classList.remove('qualified', 'third-place');
        if (idx < 2) row.classList.add('qualified');
        else if (idx === 2) row.classList.add('third-place');
      });

      // Update match result classes
      const matches = card.querySelectorAll('.group-match');
      matches.forEach(matchEl => {
        const matchId = matchEl.dataset.match;
        const result = state.groupMatchResults[matchId];
        const hasResult = !!(result && result.winner !== undefined);
        const isDraw = hasResult && result.winner === 'draw';

        matchEl.classList.toggle('has-result', hasResult);
        matchEl.classList.toggle('is-draw', isDraw);

        // Update input values
        const inputs = matchEl.querySelectorAll('.score-input');
        if (inputs.length === 2) {
          inputs[0].value = result && result.score1 !== null ? result.score1 : '';
          inputs[1].value = result && result.score2 !== null ? result.score2 : '';
        }

        // Update winner highlighting
        const team1El = matchEl.querySelector('.match-team[data-side="1"]');
        const team2El = matchEl.querySelector('.match-team[data-side="2"]');

        const team1Wins = hasResult && result.winner === matchEl.dataset.team1;
        const team2Wins = hasResult && result.winner === matchEl.dataset.team2;

        team1El.classList.toggle('winner', !!team1Wins);
        team2El.classList.toggle('winner', !!team2Wins);
      });
    });

    // Update third place sidebar
    if (elements.thirdPlaceSidebar) {
      elements.thirdPlaceSidebar.innerHTML = createThirdPlaceTable();
    }
  }

  function quickSelectWinner(matchId, teamCode, team1, team2) {
    const currentResult = state.groupMatchResults[matchId];

    // Don't modify locked matches
    if (currentResult && currentResult.locked) return;

    // If clicking on already winning team, clear the result
    if (currentResult && currentResult.winner === teamCode) {
      delete state.groupMatchResults[matchId];
    } else {
      // Set the clicked team as winner with generated scores
      const scores = generateGroupScore();
      state.groupMatchResults[matchId] = {
        winner: teamCode,
        score1: teamCode === team1 ? scores.winner : scores.loser,
        score2: teamCode === team2 ? scores.winner : scores.loser
      };
    }

    requestAnimationFrame(() => {
      // Recalculate standings and re-render everything
      const matchEl = document.querySelector('.group-match[data-match="' + matchId + '"]');
      if (matchEl) {
        const groupLetter = matchEl.closest('.group-card').dataset.group;
        calculateGroupStandings(groupLetter);
        updateGroupStandingsOnly();
      } else {
        // Fallback if match not visible
        updateGroupStandingsOnly();
      }
      renderBracket();
      updateStats();
      saveState();
    });
  }

  function generateGroupScore() {
    const winnerScore = Math.floor(Math.random() * 4) + 1;
    const loserScore = Math.floor(Math.random() * winnerScore);
    return { winner: winnerScore, loser: loserScore };
  }

  // ========================================
  // Standings Calculation
  // ========================================

  /**
   * Calculate head-to-head stats for a subset of teams
   */
  function calculateHeadToHead(teamCodes, matches) {
    const h2h = {};
    teamCodes.forEach(code => {
      h2h[code] = { pts: 0, gd: 0, gf: 0 };
    });

    matches.forEach(match => {
      const result = state.groupMatchResults[match.id];
      if (!result || result.winner === undefined) return;

      // Only consider matches between the tied teams
      if (!teamCodes.includes(match.team1) || !teamCodes.includes(match.team2)) return;

      const team1 = match.team1;
      const team2 = match.team2;
      const score1 = result.score1 ?? 0;
      const score2 = result.score2 ?? 0;

      h2h[team1].gf += score1;
      h2h[team1].gd += (score1 - score2);
      h2h[team2].gf += score2;
      h2h[team2].gd += (score2 - score1);

      if (result.winner === team1) {
        h2h[team1].pts += 3;
      } else if (result.winner === team2) {
        h2h[team2].pts += 3;
      } else {
        h2h[team1].pts += 1;
        h2h[team2].pts += 1;
      }
    });

    return h2h;
  }

  /**
   * Sort teams using FIFA tiebreaker rules
   */
  function sortWithTiebreakers(teamsArray, matches) {
    // First, sort by points only
    teamsArray.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      return 0; // Tied on points
    });

    // Find groups of teams tied on points and apply head-to-head first
    let i = 0;
    while (i < teamsArray.length) {
      // Find all teams tied on points with team at position i
      const tiedStart = i;
      while (i < teamsArray.length - 1 &&
        teamsArray[i].pts === teamsArray[i + 1].pts) {
        i++;
      }
      const tiedEnd = i;

      // If there are tied teams, apply tiebreakers
      if (tiedEnd > tiedStart) {
        const tiedTeams = teamsArray.slice(tiedStart, tiedEnd + 1);
        const tiedCodes = tiedTeams.map(t => t.team);
        const h2h = calculateHeadToHead(tiedCodes, matches);

        // Sort the tied teams: H2H pts > H2H GD > H2H GF > Overall GD > Overall GF > Fair Play > Alphabetical
        tiedTeams.sort((a, b) => {
          const h2hA = h2h[a.team];
          const h2hB = h2h[b.team];
          // Head-to-head points
          if (h2hB.pts !== h2hA.pts) return h2hB.pts - h2hA.pts;
          // Head-to-head goal difference
          if (h2hB.gd !== h2hA.gd) return h2hB.gd - h2hA.gd;
          // Head-to-head goals scored
          if (h2hB.gf !== h2hA.gf) return h2hB.gf - h2hA.gf;
          // Overall goal difference
          if (b.gd !== a.gd) return b.gd - a.gd;
          // Overall goals scored
          if (b.gf !== a.gf) return b.gf - a.gf;
          // Fair play score (higher is better - 0 is good, negative from cards)
          if (a.fairPlay !== b.fairPlay) return b.fairPlay - a.fairPlay;
          // Alphabetical as final fallback (placeholder for drawing of lots)
          return a.team.localeCompare(b.team);
        });

        // Replace tied teams in original array
        for (let j = 0; j < tiedTeams.length; j++) {
          teamsArray[tiedStart + j] = tiedTeams[j];
        }
      }
      i++;
    }

    return teamsArray;
  }

  function calculateGroupStandings(groupLetter) {
    const teamCodes = FIFAWorldCupData.getGroupTeams(groupLetter);
    const matches = FIFAWorldCupData.getGroupMatches(groupLetter);

    // Initialize standings
    const standings = {};
    teamCodes.forEach(code => {
      standings[code] = {
        team: code,
        pts: 0,
        gd: 0,
        gf: 0,
        ga: 0,
        w: 0,
        d: 0,
        l: 0,
        played: 0,
        fairPlay: 0
      };
    });

    // Process each match result
    matches.forEach(match => {
      const result = state.groupMatchResults[match.id];
      if (!result || result.winner === undefined) return;

      const team1 = match.team1;
      const team2 = match.team2;
      const score1 = result.score1 ?? 0;
      const score2 = result.score2 ?? 0;

      standings[team1].played++;
      standings[team2].played++;
      standings[team1].gf += score1;
      standings[team1].ga += score2;
      standings[team2].gf += score2;
      standings[team2].ga += score1;
      standings[team1].gd = standings[team1].gf - standings[team1].ga;
      standings[team2].gd = standings[team2].gf - standings[team2].ga;

      if (result.winner === team1) {
        standings[team1].pts += 3;
        standings[team1].w++;
        standings[team2].l++;
      } else if (result.winner === team2) {
        standings[team2].pts += 3;
        standings[team2].w++;
        standings[team1].l++;
      } else {
        standings[team1].pts += 1;
        standings[team2].pts += 1;
        standings[team1].d++;
        standings[team2].d++;
      }

      // Add fair play scores from match data (higher is better - 0 is good, negative from cards)
      if (match.homeFairPlay !== undefined) {
        standings[team1].fairPlay += match.homeFairPlay;
      }
      if (match.awayFairPlay !== undefined) {
        standings[team2].fairPlay += match.awayFairPlay;
      }
    });

    // Sort with FIFA tiebreaker rules including head-to-head
    const sorted = sortWithTiebreakers(Object.values(standings), matches);

    state.groupStandings[groupLetter] = sorted;
    return sorted;
  }

  function getGroupPosition(groupLetter, position) {
    const standings = state.groupStandings[groupLetter];
    if (!standings || standings.length < position) return null;

    // Check if group is complete (all 6 matches played)
    const matches = FIFAWorldCupData.getGroupMatches(groupLetter);
    const playedMatches = matches.filter(m => state.groupMatchResults[m.id]?.winner !== undefined);

    if (playedMatches.length < 6) return null;

    return standings[position - 1]?.team || null;
  }

  // ========================================
  // Bracket Rendering
  // ========================================

  function renderBracket() {
    renderRound32();
    renderRound16();
    renderQuarterFinals();
    renderSemiFinals();
    renderFinal();
    renderThirdPlace();
    updateChampionDisplay();
  }

  function renderRound32() {
    const matches = FIFAWorldCupData.getRoundMatches('R32');
    const leftMatches = FIFAWorldCupData.getMatchesBySide('R32', 'left');
    const rightMatches = FIFAWorldCupData.getMatchesBySide('R32', 'right');

    if (elements.r32Left) {
      elements.r32Left.innerHTML = leftMatches.map(id => createMatchCard(id, matches[id])).join('');
    }

    if (elements.r32Right) {
      elements.r32Right.innerHTML = rightMatches.map(id => createMatchCard(id, matches[id])).join('');
    }
  }

  function renderRound16() {
    const matches = FIFAWorldCupData.getRoundMatches('R16');
    const leftMatches = FIFAWorldCupData.getMatchesBySide('R16', 'left');
    const rightMatches = FIFAWorldCupData.getMatchesBySide('R16', 'right');

    if (elements.r16Left) {
      elements.r16Left.innerHTML = leftMatches.map(id => createMatchCard(id, matches[id])).join('');
    }

    if (elements.r16Right) {
      elements.r16Right.innerHTML = rightMatches.map(id => createMatchCard(id, matches[id])).join('');
    }
  }

  function renderQuarterFinals() {
    const matches = FIFAWorldCupData.getRoundMatches('QF');
    const leftMatches = FIFAWorldCupData.getMatchesBySide('QF', 'left');
    const rightMatches = FIFAWorldCupData.getMatchesBySide('QF', 'right');

    if (elements.qfLeft) {
      elements.qfLeft.innerHTML = leftMatches.map(id => createMatchCard(id, matches[id])).join('');
    }

    if (elements.qfRight) {
      elements.qfRight.innerHTML = rightMatches.map(id => createMatchCard(id, matches[id])).join('');
    }
  }

  function renderSemiFinals() {
    const matches = FIFAWorldCupData.getRoundMatches('SF');

    if (elements.sfLeft) {
      elements.sfLeft.innerHTML = createMatchCard('SF-101', matches['SF-101']);
    }

    if (elements.sfRight) {
      elements.sfRight.innerHTML = createMatchCard('SF-102', matches['SF-102']);
    }
  }

  function renderFinal() {
    const matches = FIFAWorldCupData.getRoundMatches('F');
    const matchInfo = matches['F-104'];
    const teams = getMatchTeams('F-104', matchInfo);
    const winner = state.bracketResults['F-104'];
    const scores = state.matchScores['F-104'] || {};
    const teamPaths = matchInfo?.teams || ['TBD', 'TBD'];

    // Render team 1 slot
    if (elements.finalTeam1) {
      elements.finalTeam1.innerHTML = createFinalTeamSlot(teams.team1, 'F-104', winner, scores.team1,
        1, teamPaths[0]);
      elements.finalTeam1.className = 'final-team-slot' + (teams.team1 ? '' : ' empty') + (winner ===
        teams.team1 ? ' winner' : '');
      elements.finalTeam1.dataset.match = 'F-104';
      elements.finalTeam1.dataset.position = '1';
      if (teams.team1) elements.finalTeam1.dataset.team = teams.team1;
      else delete elements.finalTeam1.dataset.team;
    }

    // Render team 2 slot
    if (elements.finalTeam2) {
      elements.finalTeam2.innerHTML = createFinalTeamSlot(teams.team2, 'F-104', winner, scores.team2,
        2, teamPaths[1]);
      elements.finalTeam2.className = 'final-team-slot' + (teams.team2 ? '' : ' empty') + (winner ===
        teams.team2 ? ' winner' : '');
      elements.finalTeam2.dataset.match = 'F-104';
      elements.finalTeam2.dataset.position = '2';
      if (teams.team2) elements.finalTeam2.dataset.team = teams.team2;
      else delete elements.finalTeam2.dataset.team;
    }

    // Keep hidden match card for data purposes
    if (elements.final) {
      elements.final.innerHTML = createMatchCard('F-104', matchInfo);
    }
  }

  function createFinalTeamSlot(teamCode, matchId, winner, score, position, teamPath) {
    if (!teamCode) {
      const displayPath = formatTeamPath(teamPath);
      return '<span class="team-placeholder">' + displayPath + '</span>';
    }

    const team = FIFAWorldCupData.getTeam(teamCode);
    if (!team) return '<span class="team-placeholder">?</span>';

    return (team.flagUrl ? '<img class="team-flag" src="' + team.flagUrl + '" alt="' + team.name +
      ' flag">' : '') +
      '<span class="team-name">' + team.name + '</span>' +
      (score !== undefined ? '<span class="team-score">' + score + '</span>' : '');
  }

  function renderThirdPlace() {
    const matches = FIFAWorldCupData.getRoundMatches('3P');

    if (elements.thirdPlace) {
      elements.thirdPlace.innerHTML = createMatchCard('3P-103', matches['3P-103']);
    }
  }

  function createMatchCard(matchId, matchInfo) {
    const teams = getMatchTeams(matchId, matchInfo);
    const winner = state.bracketResults[matchId];
    const scores = state.matchScores[matchId] || {};
    const isComplete = !!winner;
    const isDisabled = !teams.team1 || !teams.team2;

    // Get the team paths for display when team not yet determined
    const teamPaths = matchInfo?.teams || ['TBD', 'TBD'];

    let cardClasses = 'match-card';
    if (isComplete) cardClasses += ' completed';
    if (isDisabled) cardClasses += ' disabled';

    return '<div class="' + cardClasses + '" data-match="' + matchId + '">' +
      '<div class="match-header">' + matchInfo.label + '</div>' +
      '<div class="match-teams">' +
      createTeamSlot(teams.team1, matchId, winner, scores.team1, 1, teamPaths[0]) +
      createTeamSlot(teams.team2, matchId, winner, scores.team2, 2, teamPaths[1]) +
      '</div>' +
      '</div>';
  }

  /**
   * Format team path for display
   * e.g., "R32-73" -> "W73", "1A" -> "1A", "3ABCDF" -> "3rd ABCDF"
   */
  function formatTeamPath(path) {
    if (!path) return 'TBD';

    // Semi-final loser for 3rd place match (check BEFORE winner to avoid false match)
    if (path.includes('-loser')) {
      const matchRef = path.replace('-loser', '');
      const matchNum = matchRef.split('-')[1];
      return 'L' + matchNum;
    }

    // Previous match winner (e.g., "R32-73" -> "W73")
    if (path.startsWith('R32-') || path.startsWith('R16-') ||
      path.startsWith('QF-') || path.startsWith('SF-')) {
      const matchNum = path.split('-')[1];
      return 'W' + matchNum;
    }

    // Third place with group options (e.g., "3ABCDF")
    // { literal }
    if (new RegExp('^3[A-L]{{2,}}$').test(path)) {
      return '3rd ' + path.substring(1);
    }
    // {/literal }

    // Simple group position (e.g., "1A", "2B", "3C")
    return path;
  }

  function createTeamSlot(teamCode, matchId, winner, score, position, teamPath) {
    if (!teamCode) {
      const displayPath = formatTeamPath(teamPath);
      return '<div class="team-slot empty">' +
        '<span class="team-placeholder">' + displayPath + '</span>' +
        '</div>';
    }

    const team = FIFAWorldCupData.getTeam(teamCode);
    if (!team) return '<div class="team-slot empty">' +
      '<span class="team-placeholder">?</span>' +
      '</div>';

    const isWinner = winner === teamCode;
    let classes = 'team-slot';
    if (isWinner) classes += ' winner';

    return '<div class="' + classes + '" data-team="' + teamCode + '" data-match="' + matchId +
      '" data-position="' + position + '" role="button" tabindex="0">' +
      (team.flagUrl ? '<img class="team-flag" src="' + team.flagUrl + '" alt="' + team.name +
        ' flag" loading="lazy">' : '') +
      '<span class="team-name">' + team.name + '</span>' +
      (score !== undefined ? '<span class="team-score">' + score + '</span>' : '') +
      '</div>';
  }

  /**
   * Get the 8 best third-place teams that qualify for knockouts
   */
  function getQualifyingThirdPlaceGroups() {
    const groups = Object.keys(FIFAWorldCupData.getAllGroups());
    const thirdPlaceTeams = [];

    for (const group of groups) {
      const standings = state.groupStandings[group];
      if (!standings || standings.length < 3) continue;

      // Check if group is complete
      const matches = FIFAWorldCupData.getGroupMatches(group);
      const playedMatches = matches.filter(m => state.groupMatchResults[m.id]?.winner !== undefined);
      if (playedMatches.length < 6) continue;

      const thirdPlace = standings[2]; // Index 2 = 3rd place
      if (thirdPlace) {
        thirdPlaceTeams.push({
          group: group,
          team: thirdPlace.team,
          pts: thirdPlace.pts,
          gd: thirdPlace.gd,
          gf: thirdPlace.gf
        });
      }
    }

    // Sort by: points desc, goal difference desc, goals for desc
    thirdPlaceTeams.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

    // Return top 8 groups (alphabetically sorted for lookup key)
    return thirdPlaceTeams.slice(0, 8).map(t => t.group);
  }

  function getMatchTeams(matchId, matchInfo) {
    const teams = { team1: null, team2: null };

    if (!matchInfo || !matchInfo.teams) return teams;

    // Get match number from matchId (e.g., "R32-79" -> "79")
    const matchNum = matchId.split('-')[1];

    matchInfo.teams.forEach((source, index) => {
      const teamKey = index === 0 ? 'team1' : 'team2';

      // Group position (e.g., '1A', '2B')

      if (new RegExp('^[12][A-L]$').test(source)) {
        const position = parseInt(source[0]);
        const group = source[1];
        teams[teamKey] = getGroupPosition(group, position);
      }
      // Third place with group options (e.g., '3ABCDF', '3CDFGH')
      // { literal }
      else if (new RegExp('^3[A-L]' + '{2,}' + '$').test(source)) {
        const qualifyingGroups = getQualifyingThirdPlaceGroups();
        // console.log('[3rd Place] Match', matchNum, 'source:', source, 'qualifying groups:', qualifyingGroups.join(','));
        if (qualifyingGroups.length === 8) {
          const groupLetter = FIFAWorldCupData.getThirdPlaceTeamForMatch(matchNum,
            qualifyingGroups);
          // console.log('[3rd Place] Lookup returned group:', groupLetter);
          if (groupLetter) {
            teams[teamKey] = getGroupPosition(groupLetter, 3);
            // console.log('[3rd Place] Team resolved to:', teams[teamKey]);
          }
        }
      }
      // Simple third place (e.g., '3A' - 3rd place from group A)
      else if (new RegExp('^3[A-L]$').test(source)) {
        const group = source[1];
        teams[teamKey] = getGroupPosition(group, 3);
      }
      // {/literal }
      // Previous match loser (for 3rd place match)
      else if (source.includes('-loser')) {
        const matchRef = source.replace('-loser', '');
        teams[teamKey] = state.semiLosers[matchRef] || null;
      }
      // Previous match winner (e.g., 'R32-73', 'R16-89')
      else if (state.bracketResults[source]) {
        teams[teamKey] = state.bracketResults[source];
      }
    });

    return teams;
  }

  function updateChampionDisplay() {
    const champion = state.bracketResults['F-104'];

    if (champion) {
      const team = FIFAWorldCupData.getTeam(champion);
      if (elements.championTeam) {
        elements.championTeam.innerHTML =
          (team.flagUrl ? '<img class="champion-flag" src="' + team.flagUrl + '" alt="' + team.name +
            ' flag">' : '') +
          '<span class="champion-name">' + team.name + '</span>';
      }
      if (elements.championDisplay) {
        elements.championDisplay.classList.add('has-champion');
      }
    } else {
      if (elements.championTeam) {
        elements.championTeam.innerHTML = '';
      }
      if (elements.championDisplay) {
        elements.championDisplay.classList.remove('has-champion');
      }
    }
  }

  // ========================================
  // Bracket Event Handling
  // ========================================

  function handleBracketClick(e) {
    // Handle both regular team slots and final team slots
    const teamSlot = e.target.closest('.team-slot') || e.target.closest('.final-team-slot');
    if (!teamSlot || teamSlot.classList.contains('empty')) return;

    const matchId = teamSlot.dataset.match;
    const teamCode = teamSlot.dataset.team;

    if (!teamCode) return; // No team assigned yet

    selectMatchWinner(matchId, teamCode);
  }

  function selectMatchWinner(matchId, teamCode) {
    const previousWinner = state.bracketResults[matchId];

    if (previousWinner === teamCode) {
      delete state.bracketResults[matchId];
      delete state.matchScores[matchId];
      clearDependentBracketMatches(matchId);
    } else {
      const matchInfo = FIFAWorldCupData.getBracketMatch(matchId);
      const teams = getMatchTeams(matchId, matchInfo);

      if (!teams.team1 || !teams.team2) {
        console.error("Cannot select winner, missing team assignment:", matchId);
        return;
      }

      const scores = generateMatchScore(teams.team1, teams.team2, teamCode);

      state.bracketResults[matchId] = teamCode;
      state.matchScores[matchId] = scores;

      if (matchId.startsWith('SF-')) {
        const loser = teams.team1 === teamCode ? teams.team2 : teams.team1;
        state.semiLosers[matchId] = loser;
      }

      if (previousWinner && previousWinner !== teamCode) {
        clearDependentBracketMatches(matchId);
      }
    }

    requestAnimationFrame(() => {
      renderBracket();
      updateStats();
      saveState();
    });
  }

  function clearDependentBracketMatches(matchId) {
    const rounds = ['R16', 'QF', 'SF', 'F', '3P'];

    for (const round of rounds) {
      const matches = FIFAWorldCupData.getRoundMatches(round);
      for (const [id, info] of Object.entries(matches)) {
        if (info.teams && (info.teams.includes(matchId) || info.teams.includes(matchId + '-loser'))) {
          delete state.bracketResults[id];
          delete state.matchScores[id];
          if (id.startsWith('SF-')) {
            delete state.semiLosers[id];
          }
          clearDependentBracketMatches(id);
        }
      }
    }
  }

  function generateMatchScore(team1, team2, winner) {
    const winnerScore = Math.floor(Math.random() * 3) + 1;
    let loserScore = Math.floor(Math.random() * winnerScore);

    return {
      team1: team1 === winner ? winnerScore : loserScore,
      team2: team2 === winner ? winnerScore : loserScore
    };
  }

  // ========================================
  // Simulation
  // ========================================

  async function simulateAll() {
    if (state.isSimulating) return;

    state.isSimulating = true;
    showLoading(true);

    try {
      await simulateGroups();
      await delay(300);
      await simulateKnockout();
      showToast('Tournament simulation complete!', 'success');
    } catch (error) {
      console.error('Simulation error:', error);
      showToast('Error during simulation', 'error');
    } finally {
      state.isSimulating = false;
      showLoading(false);
      saveState();
    }
  }

  async function simulateGroups() {
    const groups = FIFAWorldCupData.getAllGroups();

    for (const groupLetter of Object.keys(groups)) {
      const matches = FIFAWorldCupData.getGroupMatches(groupLetter);

      for (const match of matches) {
        const existingResult = state.groupMatchResults[match.id];
        // Skip locked matches or matches that already have a result
        if (existingResult && (existingResult.locked || existingResult.winner !== undefined)) {
          continue;
        }

        const winnerCode = simulateMatch(match.team1, match.team2);
        const isDraw = winnerCode === 'draw';

        if (isDraw) {
          const drawScore = Math.floor(Math.random() * 3);
          state.groupMatchResults[match.id] = {
            winner: 'draw',
            score1: drawScore,
            score2: drawScore
          };
        } else {
          const scores = generateGroupScore();
          state.groupMatchResults[match.id] = {
            winner: winnerCode,
            score1: winnerCode === match.team1 ? scores.winner : scores.loser,
            score2: winnerCode === match.team2 ? scores.winner : scores.loser
          };
        }
      }

      await delay(50);
      requestAnimationFrame(() => {
        updateGroupStandingsOnly();
        renderBracket();
        updateStats();
      });
    }

    // Final bracket render after all groups complete
    requestAnimationFrame(() => {
      renderBracket();
    });
  }

  async function simulateKnockout() {
    const rounds = ['R32', 'R16', 'QF', 'SF', 'F', '3P'];

    for (const round of rounds) {
      const matches = FIFAWorldCupData.getRoundMatches(round);
      const matchKeys = FIFAWorldCupData.getMatchesBySide(round, 'left')
        .concat(FIFAWorldCupData.getMatchesBySide(round, 'right'))
        .concat(FIFAWorldCupData.getMatchesBySide(round, 'center'))
        .filter(id => matches[id]); // Filter out undefined matches

      for (const matchId of matchKeys) {
        const matchInfo = matches[matchId];

        // Skip if already decided (from pre-filled sheet data)
        if (state.bracketResults[matchId]) {
          continue;
        }

        const teams = getMatchTeams(matchId, matchInfo);

        if (teams.team1 && teams.team2) {
          const winner = simulateMatch(teams.team1, teams.team2, true); // No draw in knockouts
          const scores = generateMatchScore(teams.team1, teams.team2, winner);

          state.bracketResults[matchId] = winner;
          state.matchScores[matchId] = scores;

          if (matchId.startsWith('SF-')) {
            const loser = teams.team1 === winner ? teams.team2 : teams.team1;
            state.semiLosers[matchId] = loser;
          }

          await delay(150);
          requestAnimationFrame(() => {
            renderBracket();
            updateStats();
          });
        }
      }
    }
  }

  function simulateMatch(team1, team2, isKnockout = false) {
    const strength1 = FIFAWorldCupData.getTeamStrength(team1);
    const strength2 = FIFAWorldCupData.getTeamStrength(team2);
    const total = strength1 + strength2;
    const prob1 = strength1 / total;

    const isDrawPossible = !isKnockout;
    const drawChance = 0.25; // 25% chance of draw in group stage

    if (isDrawPossible && Math.random() < drawChance) {
      return 'draw';
    }

    return Math.random() < prob1 ? team1 : team2;
  }

  // ========================================
  // Statistics
  // ========================================

  function updateStats() {
    // Count group matches played
    const groupMatchesPlayed = Object.values(state.groupMatchResults)
      .filter(r => r && r.winner !== undefined).length;
    const totalGroupMatches = FIFAWorldCupData.getTotalGroupMatches();

    // Count bracket matches
    const totalBracketMatches = 16 + 8 + 4 + 2 + 1 + 1; // R32 + R16 + QF + SF + F + 3P = 32 matches
    const bracketMatchesPlayed = Object.keys(state.bracketResults).length;


    const totalMatches = groupMatchesPlayed + bracketMatchesPlayed;

    // Teams remaining
    let teamsRemaining = 48;
    if (groupMatchesPlayed === totalGroupMatches) {
      teamsRemaining = 32 - bracketMatchesPlayed;
      if (teamsRemaining < 1) teamsRemaining = 1;
    }

    // Goals
    let totalGoals = 0;
    for (const result of Object.values(state.groupMatchResults)) {
      if (result && result.score1 !== undefined && result.score2 !== undefined) {
        totalGoals += (result.score1 ?? 0) + (result.score2 ?? 0);
      }
    }
    for (const scores of Object.values(state.matchScores)) {
      totalGoals += (scores.team1 || 0) + (scores.team2 || 0);
    }

    // Completion
    const completion = Math.round(
      ((groupMatchesPlayed / totalGroupMatches) * 70) +
      ((bracketMatchesPlayed / totalBracketMatches) * 30)
    );

    if (elements.statMatchesPlayed) elements.statMatchesPlayed.textContent = totalMatches;
    if (elements.statTeamsRemaining) elements.statTeamsRemaining.textContent = teamsRemaining;
    if (elements.statGoalsScored) elements.statGoalsScored.textContent = totalGoals;
    if (elements.statCompletion) elements.statCompletion.textContent = completion + '%';

    // Update sticky bar stats
    if (elements.statGroupsPredicted) elements.statGroupsPredicted.textContent = groupMatchesPlayed;
    if (elements.statKnockoutPredicted) elements.statKnockoutPredicted.textContent = bracketMatchesPlayed;
  }

  // ========================================
  // State Management
  // ========================================

  function saveState() {
    try {
      const stateToSave = {
        groupMatchResults: state.groupMatchResults,
        bracketResults: state.bracketResults,
        matchScores: state.matchScores,
        semiLosers: state.semiLosers
      };
    } catch (error) {
      console.warn('Failed to save state:', error);
    }
  }

  function resetSimulator() {
    state.groupMatchResults = {};
    state.groupStandings = {};
    state.bracketResults = {};
    state.matchScores = {};
    state.semiLosers = {};

    initializeStandings();

    requestAnimationFrame(() => {
      renderGroups();
      renderBracket();
      updateStats();
    });

    showToast('Simulator reset successfully', 'success');
  }

  // ========================================
  // Utilities
  // ========================================

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const focused = document.activeElement;
      if (focused.classList.contains('team-slot')) {
        e.preventDefault();
        handleBracketClick({ target: focused });
      }
    }
  }

  function toggleNavMenu() {
    const isOpen = elements.navMenu.classList.toggle('open');
    elements.navToggle.setAttribute('aria-expanded', isOpen);
  }

  function showLoading(show) {
    if (elements.loadingOverlay) {
      elements.loadingOverlay.classList.toggle('active', show);
    }
  }

  function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toast-out 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ========================================
  // Share Link (encode/decode state in URL)
  // ========================================

  var SHARE_URL = 'https://pfsn.app/fifaworldcup';
  var SHARE_TEXT = 'Here are my FIFA World Cup 2026 predictions. Head over to @PFSN365 to make yours';

  function encodeStateToURL() {
    var data = {
      g: state.groupMatchResults,
      b: state.bracketResults,
      s: state.matchScores,
      l: state.semiLosers
    };
    var json = JSON.stringify(data);
    var encoded = btoa(unescape(encodeURIComponent(json)));
    return encoded;
  }

  function decodeStateFromURL(encoded) {
    try {
      var json = decodeURIComponent(escape(atob(encoded)));
      var data = JSON.parse(json);
      return {
        groupMatchResults: data.g || {},
        bracketResults: data.b || {},
        matchScores: data.s || {},
        semiLosers: data.l || {}
      };
    } catch (error) {
      console.warn('Failed to decode share link:', error);
      return null;
    }
  }

  function loadStateFromURL() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return false;

    var encoded = hash.substring(1);
    var decoded = decodeStateFromURL(encoded);
    if (!decoded) return false;

    state.groupMatchResults = decoded.groupMatchResults;
    state.bracketResults = decoded.bracketResults;
    state.matchScores = decoded.matchScores;
    state.semiLosers = decoded.semiLosers;

    history.replaceState(null, '', window.location.pathname + window.location.search);
    return true;
  }

  async function generateShareImage(imageType) {
    var flagCache = await preloadFlags();
    var canvas;
    if (imageType === 'groups') {
      canvas = generateGroupsCanvas(flagCache);
    } else if (imageType === 'bracket') {
      canvas = generateBracketCanvas(flagCache);
    } else {
      canvas = generateFullTournamentCanvas(flagCache);
    }
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) { resolve(blob); }, 'image/png');
    });
  }

  async function handleShare(imageType) {
    imageType = imageType || 'full';
    showLoading(true);
    try {
      var imageBlob = await generateShareImage(imageType);
      var imageFile = new File([imageBlob], 'world-cup-predictions.png', { type: 'image/png' });

      // Try Web Share API with image
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        try {
          await navigator.share({
            text: SHARE_TEXT,
            url: SHARE_URL,
            files: [imageFile]
          });
          showLoading(false);
          return;
        } catch (e) {
          if (e.name === 'AbortError') {
            showLoading(false);
            return;
          }
        }
      }

      // Fallback: download the image and copy the link
      var link = document.createElement('a');
      link.download = 'world-cup-predictions.png';
      link.href = URL.createObjectURL(imageBlob);
      link.click();
      URL.revokeObjectURL(link.href);

      await navigator.clipboard.writeText(SHARE_URL).catch(function () {});
      showToast('Image downloaded & link copied!', 'success');
    } catch (error) {
      console.error('Share error:', error);
      showToast('Failed to generate share image', 'error');
    }
    showLoading(false);
  }

  // ========================================
  // Share Modal
  // ========================================

  function showShareModal() {
    if (elements.shareModal) {
      elements.shareModal.classList.add('active');
      elements.shareModal.setAttribute('aria-hidden', 'false');
    }
  }

  function hideShareModal() {
    if (elements.shareModal) {
      elements.shareModal.classList.remove('active');
      elements.shareModal.setAttribute('aria-hidden', 'true');
    }
  }

  // ========================================
  // Download Modal
  // ========================================

  function showDownloadModal() {
    if (elements.downloadModal) {
      elements.downloadModal.classList.add('active');
      elements.downloadModal.setAttribute('aria-hidden', 'false');
    }
  }

  function hideDownloadModal() {
    if (elements.downloadModal) {
      elements.downloadModal.classList.remove('active');
      elements.downloadModal.setAttribute('aria-hidden', 'true');
    }
  }

  // ========================================
  // Canvas Download Infrastructure
  // ========================================

  async function preloadFlags() {
    var flagCache = {};
    var teams = FIFAWorldCupData.TEAMS;

    var loadPromises = Object.values(teams).map(function (team) {
      if (!team.flagCode || !team.flagUrl) return Promise.resolve();
      return new Promise(function (resolve) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          flagCache[team.flagCode] = img;
          resolve();
        };
        img.onerror = function () { resolve(); };
        img.src = team.flagUrl;
      });
    });

    await Promise.all(loadPromises);
    return flagCache;
  }

  async function downloadBracket() {
    showLoading(true);
    try {
      var flagCache = await preloadFlags();
      var canvas = generateBracketCanvas(flagCache);

      var link = document.createElement('a');
      link.download = 'world-cup-bracket-' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('Bracket downloaded!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to generate bracket image', 'error');
    }
    showLoading(false);
  }

  async function downloadGroups() {
    showLoading(true);
    try {
      var flagCache = await preloadFlags();
      var canvas = generateGroupsCanvas(flagCache);

      var link = document.createElement('a');
      link.download = 'world-cup-groups-' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('Groups downloaded!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to generate groups image', 'error');
    }
    showLoading(false);
  }

  async function downloadFullTournament() {
    showLoading(true);
    try {
      var flagCache = await preloadFlags();
      var canvas = generateFullTournamentCanvas(flagCache);

      var link = document.createElement('a');
      link.download = 'world-cup-full-' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('Full tournament downloaded!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to generate tournament image', 'error');
    }
    showLoading(false);
  }

  // ========================================
  // Canvas Generation Functions
  // ========================================

  function generateFullTournamentCanvas(flagCache) {
    flagCache = flagCache || {};
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var dpr = 2;
    var headerHeight = 60;
    var sectionGap = 30;
    var footerHeight = 40;

    // Groups dimensions
    var groupCardWidth = 360;
    var groupCardHeight = 290;
    var cardPadding = 15;
    var groupCols = 4;
    var groupRows = 3;
    var thirdPlaceWidth = 300;
    var groupsAreaWidth = groupCols * groupCardWidth + (groupCols + 1) * cardPadding;
    var groupsSectionWidth = groupsAreaWidth + cardPadding + thirdPlaceWidth + cardPadding;
    var groupsAreaHeight = groupRows * groupCardHeight + (groupRows + 1) * cardPadding;

    // Bracket dimensions
    var matchBoxWidth = 160;
    var matchBoxHeight = 50;
    var roundGap = 40;
    var matchGap = 12;
    var columnWidth = matchBoxWidth + roundGap;
    var centerColumnWidth = matchBoxWidth * 1.5 + 60;
    var bracketSectionWidth = columnWidth * 8 + centerColumnWidth + 60;
    var spacing = matchBoxHeight + matchGap;
    var bracketContentHeight = spacing * 8 + 120;

    // Combined canvas
    var totalWidth = Math.max(groupsSectionWidth, bracketSectionWidth);
    var totalHeight = headerHeight + groupsAreaHeight + sectionGap + 40 + bracketContentHeight + footerHeight;

    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Header bar
    ctx.fillStyle = '#0050A0';
    ctx.fillRect(0, 0, totalWidth, headerHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Roboto, sans-serif';
    var title = 'FIFA World Cup 2026';
    var titleW = ctx.measureText(title).width;
    ctx.fillText(title, (totalWidth - titleW) / 2, 40);

    // GROUPS SECTION
    var groupsOffsetX = (totalWidth - groupsSectionWidth) / 2;
    var groups = FIFAWorldCupData.getAllGroups();
    var groupLetters = Object.keys(groups).sort();

    groupLetters.forEach(function (letter, idx) {
      var col = idx % groupCols;
      var row = Math.floor(idx / groupCols);
      var gx = groupsOffsetX + cardPadding + col * (groupCardWidth + cardPadding);
      var gy = headerHeight + cardPadding + row * (groupCardHeight + cardPadding);
      drawGroupCard(ctx, gx, gy, groupCardWidth, groupCardHeight, letter, flagCache);
    });

    // Third place table
    var tpX = groupsOffsetX + groupsAreaWidth + cardPadding;
    var tpY = headerHeight + cardPadding;
    var tpH = groupsAreaHeight - cardPadding;
    drawThirdPlaceTable(ctx, tpX, tpY, thirdPlaceWidth, tpH, flagCache);

    // KNOCKOUT SECTION
    var bracketTopY = headerHeight + groupsAreaHeight + sectionGap;

    ctx.fillStyle = '#0050A0';
    ctx.fillRect(0, bracketTopY, totalWidth, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Roboto, sans-serif';
    var bracketTitle = 'Knockout Stage';
    var btW = ctx.measureText(bracketTitle).width;
    ctx.fillText(bracketTitle, (totalWidth - btW) / 2, bracketTopY + 28);

    var bracketOffsetX = (totalWidth - bracketSectionWidth) / 2;
    var yOffset = bracketTopY + 60;
    var centerX = bracketOffsetX + bracketSectionWidth / 2;

    var leftR32X = bracketOffsetX + 20;
    var leftR16X = leftR32X + columnWidth;
    var leftQfX = leftR16X + columnWidth;
    var leftSfX = leftQfX + columnWidth;
    var centerColX = centerX - (matchBoxWidth * 1.5) / 2;
    var rightSfX = centerX + centerColumnWidth / 2;
    var rightQfX = rightSfX + columnWidth;
    var rightR16X = rightQfX + columnWidth;
    var rightR32X = rightR16X + columnWidth;

    var r32Matches = getR32Matches();
    r32Matches.slice(0, 8).forEach(function (match, i) {
      drawMatchToCanvas(ctx, leftR32X, yOffset + i * spacing, match, matchBoxWidth, matchBoxHeight, flagCache);
    });
    r32Matches.slice(8, 16).forEach(function (match, i) {
      drawMatchToCanvas(ctx, rightR32X, yOffset + i * spacing, match, matchBoxWidth, matchBoxHeight, flagCache);
    });

    var r16Matches = getR16Matches();
    r16Matches.slice(0, 4).forEach(function (match, i) {
      drawMatchToCanvas(ctx, leftR16X, yOffset + i * spacing * 2 + spacing / 2, match, matchBoxWidth, matchBoxHeight, flagCache);
    });
    r16Matches.slice(4, 8).forEach(function (match, i) {
      drawMatchToCanvas(ctx, rightR16X, yOffset + i * spacing * 2 + spacing / 2, match, matchBoxWidth, matchBoxHeight, flagCache);
    });

    var qfMatches = getQFMatches();
    qfMatches.slice(0, 2).forEach(function (match, i) {
      drawMatchToCanvas(ctx, leftQfX, yOffset + i * spacing * 4 + spacing * 1.5, match, matchBoxWidth, matchBoxHeight, flagCache);
    });
    qfMatches.slice(2, 4).forEach(function (match, i) {
      drawMatchToCanvas(ctx, rightQfX, yOffset + i * spacing * 4 + spacing * 1.5, match, matchBoxWidth, matchBoxHeight, flagCache);
    });

    var sfMatches = getSFMatches();
    var sfY = yOffset + spacing * 3.5;
    drawMatchToCanvas(ctx, leftSfX, sfY, sfMatches[0], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, rightSfX, sfY, sfMatches[1], matchBoxWidth, matchBoxHeight, flagCache);

    var largeBoxWidth = matchBoxWidth * 1.5;
    var largeBoxHeight = matchBoxHeight * 1.5;
    var finalMatch = getFinalMatch();
    drawCenteredMatchToCanvas(ctx, centerColX, sfY, finalMatch, largeBoxWidth, largeBoxHeight, flagCache);

    var champY = sfY + largeBoxHeight + 20;
    drawChampionBox(ctx, centerColX, champY, largeBoxWidth, largeBoxHeight, flagCache);

    var thirdMatch = getThirdPlaceMatch();
    if (thirdMatch) {
      var thirdY = champY + largeBoxHeight + 20;
      ctx.fillStyle = '#666666';
      ctx.font = 'bold 12px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('3RD PLACE', centerColX + largeBoxWidth / 2, thirdY - 5);
      ctx.textAlign = 'left';
      drawCenteredMatchToCanvas(ctx, centerColX, thirdY, thirdMatch, largeBoxWidth, largeBoxHeight, flagCache);
    }

    drawConnectorLines(ctx, {
      leftR32X: leftR32X, leftR16X: leftR16X, leftQfX: leftQfX, leftSfX: leftSfX,
      rightR32X: rightR32X, rightR16X: rightR16X, rightQfX: rightQfX, rightSfX: rightSfX,
      centerColX: centerColX, yOffset: yOffset, spacing: spacing, roundGap: roundGap,
      matchBoxWidth: matchBoxWidth, matchBoxHeight: matchBoxHeight, largeBoxWidth: largeBoxWidth, largeBoxHeight: largeBoxHeight, sfY: sfY
    });

    // Footer
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, totalHeight - footerHeight, totalWidth, footerHeight);
    ctx.fillStyle = '#666666';
    ctx.font = '12px Roboto, sans-serif';
    var footerText = 'https://pfsn.app/fifaworldcup';
    var fW = ctx.measureText(footerText).width;
    ctx.fillText(footerText, (totalWidth - fW) / 2, totalHeight - 15);

    return canvas;
  }

  function generateGroupsCanvas(flagCache) {
    flagCache = flagCache || {};
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var dpr = 2;
    var groupCardWidth = 360;
    var groupCardHeight = 290;
    var cardPadding = 15;
    var cols = 4;
    var rows = 3;
    var thirdPlaceWidth = 300;
    var groupsAreaWidth = cols * groupCardWidth + (cols + 1) * cardPadding;
    var totalWidth = groupsAreaWidth + cardPadding + thirdPlaceWidth + cardPadding;
    var headerHeight = 60;
    var footerHeight = 40;
    var groupsAreaHeight = rows * groupCardHeight + (rows + 1) * cardPadding;
    var totalHeight = headerHeight + groupsAreaHeight + footerHeight;

    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    ctx.fillStyle = '#0050A0';
    ctx.fillRect(0, 0, totalWidth, headerHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Roboto, sans-serif';
    var title = 'FIFA World Cup 2026 - Group Stage';
    var titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (totalWidth - titleWidth) / 2, 40);

    var groups = FIFAWorldCupData.getAllGroups();
    var groupLetters = Object.keys(groups).sort();

    groupLetters.forEach(function (letter, idx) {
      var col = idx % cols;
      var row = Math.floor(idx / cols);
      var x = cardPadding + col * (groupCardWidth + cardPadding);
      var y = headerHeight + cardPadding + row * (groupCardHeight + cardPadding);
      drawGroupCard(ctx, x, y, groupCardWidth, groupCardHeight, letter, flagCache);
    });

    var thirdPlaceX = groupsAreaWidth + cardPadding;
    var thirdPlaceY = headerHeight + cardPadding;
    var thirdPlaceHeight = groupsAreaHeight - cardPadding;
    drawThirdPlaceTable(ctx, thirdPlaceX, thirdPlaceY, thirdPlaceWidth, thirdPlaceHeight, flagCache);

    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, totalHeight - footerHeight, totalWidth, footerHeight);
    ctx.fillStyle = '#666666';
    ctx.font = '12px Roboto, sans-serif';
    var footerText = 'https://pfsn.app/fifaworldcup';
    var footerWidth = ctx.measureText(footerText).width;
    ctx.fillText(footerText, (totalWidth - footerWidth) / 2, totalHeight - 15);

    return canvas;
  }

  function generateBracketCanvas(flagCache) {
    flagCache = flagCache || {};
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var dpr = 2;
    var matchBoxWidth = 160;
    var matchBoxHeight = 50;
    var roundGap = 40;
    var matchGap = 12;

    var columnWidth = matchBoxWidth + roundGap;
    var centerColumnWidth = matchBoxWidth * 1.5 + 60;
    var totalWidth = columnWidth * 8 + centerColumnWidth + 60;
    var spacing = matchBoxHeight + matchGap;
    var totalHeight = spacing * 8 + 200;

    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    ctx.fillStyle = '#0050A0';
    ctx.fillRect(0, 0, totalWidth, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Roboto, sans-serif';
    var title = 'FIFA World Cup 2026 - Knockout Stage';
    var titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (totalWidth - titleWidth) / 2, 40);

    var yOffset = 80;
    var centerX = totalWidth / 2;

    var leftR32X = 20;
    var leftR16X = leftR32X + columnWidth;
    var leftQfX = leftR16X + columnWidth;
    var leftSfX = leftQfX + columnWidth;
    var centerColX = centerX - (matchBoxWidth * 1.5) / 2;
    var rightSfX = centerX + centerColumnWidth / 2;
    var rightQfX = rightSfX + columnWidth;
    var rightR16X = rightQfX + columnWidth;
    var rightR32X = rightR16X + columnWidth;

    var r32Matches = getR32Matches();
    r32Matches.slice(0, 8).forEach(function (match, i) {
      drawMatchToCanvas(ctx, leftR32X, yOffset + i * spacing, match, matchBoxWidth, matchBoxHeight, flagCache);
    });
    r32Matches.slice(8, 16).forEach(function (match, i) {
      drawMatchToCanvas(ctx, rightR32X, yOffset + i * spacing, match, matchBoxWidth, matchBoxHeight, flagCache);
    });

    var r16Matches = getR16Matches();
    r16Matches.slice(0, 4).forEach(function (match, i) {
      drawMatchToCanvas(ctx, leftR16X, yOffset + i * spacing * 2 + spacing / 2, match, matchBoxWidth, matchBoxHeight, flagCache);
    });
    r16Matches.slice(4, 8).forEach(function (match, i) {
      drawMatchToCanvas(ctx, rightR16X, yOffset + i * spacing * 2 + spacing / 2, match, matchBoxWidth, matchBoxHeight, flagCache);
    });

    var qfMatches = getQFMatches();
    qfMatches.slice(0, 2).forEach(function (match, i) {
      drawMatchToCanvas(ctx, leftQfX, yOffset + i * spacing * 4 + spacing * 1.5, match, matchBoxWidth, matchBoxHeight, flagCache);
    });
    qfMatches.slice(2, 4).forEach(function (match, i) {
      drawMatchToCanvas(ctx, rightQfX, yOffset + i * spacing * 4 + spacing * 1.5, match, matchBoxWidth, matchBoxHeight, flagCache);
    });

    var sfMatches = getSFMatches();
    var sfY = yOffset + spacing * 3.5;
    drawMatchToCanvas(ctx, leftSfX, sfY, sfMatches[0], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, rightSfX, sfY, sfMatches[1], matchBoxWidth, matchBoxHeight, flagCache);

    var largeBoxWidth = matchBoxWidth * 1.5;
    var largeBoxHeight = matchBoxHeight * 1.5;
    var finalMatch = getFinalMatch();
    drawCenteredMatchToCanvas(ctx, centerColX, sfY, finalMatch, largeBoxWidth, largeBoxHeight, flagCache);

    var champY = sfY + largeBoxHeight + 20;
    drawChampionBox(ctx, centerColX, champY, largeBoxWidth, largeBoxHeight, flagCache);

    var thirdMatch = getThirdPlaceMatch();
    if (thirdMatch) {
      var thirdY = champY + largeBoxHeight + 20;
      ctx.fillStyle = '#666666';
      ctx.font = 'bold 12px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('3RD PLACE', centerColX + largeBoxWidth / 2, thirdY - 5);
      ctx.textAlign = 'left';
      drawCenteredMatchToCanvas(ctx, centerColX, thirdY, thirdMatch, largeBoxWidth, largeBoxHeight, flagCache);
    }

    drawConnectorLines(ctx, {
      leftR32X: leftR32X, leftR16X: leftR16X, leftQfX: leftQfX, leftSfX: leftSfX,
      rightR32X: rightR32X, rightR16X: rightR16X, rightQfX: rightQfX, rightSfX: rightSfX,
      centerColX: centerColX, yOffset: yOffset, spacing: spacing, roundGap: roundGap,
      matchBoxWidth: matchBoxWidth, matchBoxHeight: matchBoxHeight, largeBoxWidth: largeBoxWidth, largeBoxHeight: largeBoxHeight, sfY: sfY
    });

    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, totalHeight - 40, totalWidth, 40);
    ctx.fillStyle = '#666666';
    ctx.font = '12px Roboto, sans-serif';
    var footerText = 'https://pfsn.app/fifaworldcup';
    var footerW = ctx.measureText(footerText).width;
    ctx.fillText(footerText, (totalWidth - footerW) / 2, totalHeight - 15);

    return canvas;
  }

  // ========================================
  // Canvas Drawing Helpers
  // ========================================

  function drawGroupCard(ctx, x, y, width, height, groupLetter, flagCache) {
    flagCache = flagCache || {};
    var standings = calculateGroupStandings(groupLetter);
    var matches = FIFAWorldCupData.getGroupMatches(groupLetter);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = '#0050A0';
    ctx.fillRect(x, y, width, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Roboto, sans-serif';
    ctx.fillText('Group ' + groupLetter, x + 10, y + 22);

    var tableY = y + 38;
    var rowHeight = 22;
    var flagWidth = 20;
    var flagHeight = 14;

    var colX = {
      pos: x + 8,
      flag: x + 22,
      name: x + 46,
      p: x + width - 168,
      w: x + width - 144,
      d: x + width - 120,
      l: x + width - 96,
      gd: x + width - 68,
      pts: x + width - 30
    };

    ctx.fillStyle = '#999999';
    ctx.font = 'bold 10px Roboto, sans-serif';
    ctx.fillText('#', colX.pos, tableY + 12);
    ctx.fillText('Team', colX.name, tableY + 12);
    ctx.fillText('P', colX.p, tableY + 12);
    ctx.fillText('W', colX.w, tableY + 12);
    ctx.fillText('D', colX.d, tableY + 12);
    ctx.fillText('L', colX.l, tableY + 12);
    ctx.fillText('GD', colX.gd, tableY + 12);
    ctx.fillText('Pts', colX.pts, tableY + 12);

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 5, tableY + 18);
    ctx.lineTo(x + width - 5, tableY + 18);
    ctx.stroke();

    standings.forEach(function (team, idx) {
      var teamData = FIFAWorldCupData.getTeam(team.team);
      if (!teamData) return;

      var rowY = tableY + 20 + idx * rowHeight;

      if (idx < 2 && team.played > 0) {
        ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
        ctx.fillRect(x + 2, rowY - 2, width - 4, rowHeight);
      } else if (idx === 2 && team.played > 0) {
        ctx.fillStyle = 'rgba(255, 193, 7, 0.1)';
        ctx.fillRect(x + 2, rowY - 2, width - 4, rowHeight);
      }

      ctx.fillStyle = '#333333';
      ctx.font = 'bold 11px Roboto, sans-serif';
      ctx.fillText('' + (idx + 1), colX.pos, rowY + 13);

      if (teamData.flagCode && flagCache[teamData.flagCode]) {
        ctx.drawImage(flagCache[teamData.flagCode], colX.flag, rowY + 2, flagWidth, flagHeight);
      }

      ctx.fillStyle = '#333333';
      ctx.font = '11px Roboto, sans-serif';
      ctx.fillText(teamData.name, colX.name, rowY + 13, width - 200);

      ctx.font = '11px Roboto, sans-serif';
      ctx.fillStyle = '#555555';
      ctx.fillText('' + team.played, colX.p, rowY + 13);
      ctx.fillText('' + team.w, colX.w, rowY + 13);
      ctx.fillText('' + team.d, colX.d, rowY + 13);
      ctx.fillText('' + team.l, colX.l, rowY + 13);
      var gdStr = team.gd > 0 ? '+' + team.gd : '' + team.gd;
      ctx.fillText(gdStr, colX.gd, rowY + 13);

      ctx.font = 'bold 11px Roboto, sans-serif';
      ctx.fillStyle = '#0050A0';
      ctx.fillText('' + team.pts, colX.pts, rowY + 13);
    });

    var matchesY = tableY + 20 + standings.length * rowHeight + 10;

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 5, matchesY);
    ctx.lineTo(x + width - 5, matchesY);
    ctx.stroke();

    var matchRowHeight = 20;
    var scoreColX = x + width / 2;

    matches.forEach(function (match, idx) {
      var result = state.groupMatchResults[match.id];
      var team1 = FIFAWorldCupData.getTeam(match.team1);
      var team2 = FIFAWorldCupData.getTeam(match.team2);
      if (!team1 || !team2) return;

      var my = matchesY + 8 + idx * matchRowHeight;

      if (result && result.winner !== undefined) {
        var score1 = result.score1 != null ? result.score1 : 0;
        var score2 = result.score2 != null ? result.score2 : 0;
        var scoreStr = score1 + ' - ' + score2;
        var isDraw = result.winner === 'draw';

        ctx.font = (!isDraw && result.winner === match.team1) ? 'bold 10px Roboto, sans-serif' : '10px Roboto, sans-serif';
        ctx.fillStyle = (!isDraw && result.winner === match.team1) ? '#0050A0' : '#555555';
        ctx.textAlign = 'right';
        ctx.fillText(team1.name, scoreColX - 22, my + 13);

        ctx.font = 'bold 10px Roboto, sans-serif';
        ctx.fillStyle = '#333333';
        ctx.textAlign = 'center';
        ctx.fillText(scoreStr, scoreColX, my + 13);

        ctx.font = (!isDraw && result.winner === match.team2) ? 'bold 10px Roboto, sans-serif' : '10px Roboto, sans-serif';
        ctx.fillStyle = (!isDraw && result.winner === match.team2) ? '#0050A0' : '#555555';
        ctx.textAlign = 'left';
        ctx.fillText(team2.name, scoreColX + 22, my + 13);
      } else {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#aaaaaa';
        ctx.font = '10px Roboto, sans-serif';
        ctx.fillText(team1.name, scoreColX - 16, my + 13);

        ctx.textAlign = 'center';
        ctx.fillText('vs', scoreColX, my + 13);

        ctx.textAlign = 'left';
        ctx.fillText(team2.name, scoreColX + 16, my + 13);
      }
      ctx.textAlign = 'left';
    });
  }

  function drawThirdPlaceTable(ctx, x, y, width, height, flagCache) {
    flagCache = flagCache || {};
    var groups = FIFAWorldCupData.getAllGroups();
    var thirdPlaceTeams = [];

    for (var groupLetter in groups) {
      if (!groups.hasOwnProperty(groupLetter)) continue;
      var standings = calculateGroupStandings(groupLetter);
      if (standings && standings.length >= 3) {
        var thirdTeam = standings[2];
        var teamCopy = {};
        for (var k in thirdTeam) { teamCopy[k] = thirdTeam[k]; }
        teamCopy.group = groupLetter;
        thirdPlaceTeams.push(teamCopy);
      }
    }

    thirdPlaceTeams.sort(function (a, b) {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.group.localeCompare(b.group);
    });

    var qualifyCount = 8;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = '#0050A0';
    ctx.fillRect(x, y, width, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Roboto, sans-serif';
    ctx.fillText('Best 3rd Place Teams', x + 10, y + 22);

    ctx.fillStyle = '#888888';
    ctx.font = '10px Roboto, sans-serif';
    ctx.fillText('Top 8 advance to knockout stage', x + 10, y + 46);

    var tableY = y + 55;
    var rowHeight = 24;
    var flagWidth = 20;
    var flagHeight = 14;

    var colX = {
      pos: x + 8,
      grp: x + 24,
      flag: x + 42,
      name: x + 66,
      p: x + width - 130,
      w: x + width - 108,
      d: x + width - 86,
      l: x + width - 64,
      gd: x + width - 42,
      pts: x + width - 16
    };

    ctx.fillStyle = '#999999';
    ctx.font = 'bold 10px Roboto, sans-serif';
    ctx.fillText('#', colX.pos, tableY + 12);
    ctx.fillText('Grp', colX.grp, tableY + 12);
    ctx.fillText('Team', colX.name, tableY + 12);
    ctx.fillText('P', colX.p, tableY + 12);
    ctx.fillText('W', colX.w, tableY + 12);
    ctx.fillText('D', colX.d, tableY + 12);
    ctx.fillText('L', colX.l, tableY + 12);
    ctx.fillText('GD', colX.gd, tableY + 12);
    ctx.textAlign = 'center';
    ctx.fillText('Pts', colX.pts, tableY + 12);
    ctx.textAlign = 'left';

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 5, tableY + 18);
    ctx.lineTo(x + width - 5, tableY + 18);
    ctx.stroke();

    thirdPlaceTeams.forEach(function (team, idx) {
      var teamData = FIFAWorldCupData.getTeam(team.team);
      if (!teamData) return;

      var rowY = tableY + 22 + idx * rowHeight;

      if (idx < qualifyCount && team.played > 0) {
        ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
        ctx.fillRect(x + 2, rowY - 2, width - 4, rowHeight);
      } else if (idx >= qualifyCount && team.played > 0) {
        ctx.fillStyle = 'rgba(244, 67, 54, 0.06)';
        ctx.fillRect(x + 2, rowY - 2, width - 4, rowHeight);
      }

      if (idx === qualifyCount) {
        ctx.strokeStyle = '#e0e0e0';
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(x + 5, rowY - 4);
        ctx.lineTo(x + width - 5, rowY - 4);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = '#333333';
      ctx.font = 'bold 11px Roboto, sans-serif';
      ctx.fillText('' + (idx + 1), colX.pos, rowY + 14);

      ctx.fillStyle = '#0050A0';
      ctx.font = 'bold 11px Roboto, sans-serif';
      ctx.fillText(team.group, colX.grp + 4, rowY + 14);

      if (teamData.flagCode && flagCache[teamData.flagCode]) {
        ctx.drawImage(flagCache[teamData.flagCode], colX.flag, rowY + 3, flagWidth, flagHeight);
      }

      ctx.fillStyle = '#333333';
      ctx.font = '11px Roboto, sans-serif';
      ctx.fillText(teamData.name, colX.name, rowY + 14, width - 180);

      ctx.font = '11px Roboto, sans-serif';
      ctx.fillStyle = '#555555';
      ctx.fillText('' + team.played, colX.p, rowY + 14);
      ctx.fillText('' + team.w, colX.w, rowY + 14);
      ctx.fillText('' + team.d, colX.d, rowY + 14);
      ctx.fillText('' + team.l, colX.l, rowY + 14);
      var gdStr = team.gd > 0 ? '+' + team.gd : '' + team.gd;
      ctx.fillText(gdStr, colX.gd, rowY + 14);

      ctx.font = 'bold 11px Roboto, sans-serif';
      ctx.fillStyle = '#0050A0';
      ctx.textAlign = 'center';
      ctx.fillText('' + team.pts, colX.pts, rowY + 14);
      ctx.textAlign = 'left';
    });

    var legendY = tableY + 22 + thirdPlaceTeams.length * rowHeight + 15;

    ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    ctx.beginPath();
    ctx.arc(x + 14, legendY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#666666';
    ctx.font = '10px Roboto, sans-serif';
    ctx.fillText('Qualifies', x + 24, legendY + 4);

    ctx.fillStyle = 'rgba(244, 67, 54, 0.3)';
    ctx.beginPath();
    ctx.arc(x + 90, legendY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#666666';
    ctx.fillText('Eliminated', x + 100, legendY + 4);

    // Round of 32 Matches
    var r32Y = legendY + 25;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 5, r32Y);
    ctx.lineTo(x + width - 5, r32Y);
    ctx.stroke();

    ctx.fillStyle = '#0050A0';
    ctx.fillRect(x, r32Y + 8, width, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Roboto, sans-serif';
    ctx.fillText('Round of 32', x + 10, r32Y + 27);

    var r32Matches = FIFAWorldCupData.getRoundMatches('R32');
    var r32Ids = Object.keys(r32Matches).sort(function (a, b) {
      return (r32Matches[a].matchNum || 0) - (r32Matches[b].matchNum || 0);
    });

    var r32RowHeight = 22;
    var r32TableY = r32Y + 42;
    var flagW = 18;
    var flagH = 13;

    r32Ids.forEach(function (matchId, idx) {
      var matchInfo = r32Matches[matchId];
      var teams = getMatchTeams(matchId, matchInfo);
      var winnerCode = state.bracketResults[matchId];
      var team1 = teams.team1 ? FIFAWorldCupData.getTeam(teams.team1) : null;
      var team2 = teams.team2 ? FIFAWorldCupData.getTeam(teams.team2) : null;
      var matchRowY = r32TableY + idx * r32RowHeight;

      if (idx % 2 === 0) {
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(x + 2, matchRowY, width - 4, r32RowHeight);
      }

      var flag1X = x + 5;
      var flag2X = x + width - flagW - 5;
      var centerXR32 = (flag1X + flagW + flag2X) / 2;

      if (team1) {
        var isWinner1 = winnerCode === teams.team1;
        if (team1.flagCode && flagCache[team1.flagCode]) {
          ctx.drawImage(flagCache[team1.flagCode], flag1X, matchRowY + 4, flagW, flagH);
        }
        ctx.font = isWinner1 ? 'bold 10px Roboto, sans-serif' : '10px Roboto, sans-serif';
        ctx.fillStyle = isWinner1 ? '#0050A0' : '#333333';
        ctx.textAlign = 'right';
        ctx.fillText(team1.name, centerXR32 - 14, matchRowY + 14);
      } else {
        ctx.font = '10px Roboto, sans-serif';
        ctx.fillStyle = '#aaaaaa';
        ctx.textAlign = 'right';
        ctx.fillText('TBD', centerXR32 - 14, matchRowY + 14);
      }

      ctx.textAlign = 'center';
      ctx.font = 'bold 10px Roboto, sans-serif';
      ctx.fillStyle = '#999999';
      var scores = state.matchScores[matchId];
      if (winnerCode && scores) {
        ctx.fillStyle = '#333333';
        ctx.fillText((scores.team1 != null ? scores.team1 : 0) + '-' + (scores.team2 != null ? scores.team2 : 0), centerXR32, matchRowY + 14);
      } else {
        ctx.fillText('vs', centerXR32, matchRowY + 14);
      }

      ctx.textAlign = 'left';
      var t2NameX = centerXR32 + 14;
      if (team2) {
        var isWinner2 = winnerCode === teams.team2;
        ctx.font = isWinner2 ? 'bold 10px Roboto, sans-serif' : '10px Roboto, sans-serif';
        ctx.fillStyle = isWinner2 ? '#0050A0' : '#333333';
        ctx.fillText(team2.name, t2NameX, matchRowY + 14);
        if (team2.flagCode && flagCache[team2.flagCode]) {
          ctx.drawImage(flagCache[team2.flagCode], flag2X, matchRowY + 4, flagW, flagH);
        }
      } else {
        ctx.font = '10px Roboto, sans-serif';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText('TBD', t2NameX, matchRowY + 14);
      }

      ctx.textAlign = 'left';
    });
  }

  function drawMatchToCanvas(ctx, x, y, match, width, height, flagCache) {
    flagCache = flagCache || {};
    var playerHeight = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.beginPath();
    ctx.moveTo(x, y + playerHeight);
    ctx.lineTo(x + width, y + playerHeight);
    ctx.stroke();

    drawTeamToCanvas(ctx, x, y, width, playerHeight, match ? match.team1 : null, match && match.winner === (match.team1 ? match.team1.code : null), flagCache);
    drawTeamToCanvas(ctx, x, y + playerHeight, width, playerHeight, match ? match.team2 : null, match && match.winner === (match.team2 ? match.team2.code : null), flagCache);
  }

  function drawTeamToCanvas(ctx, x, y, width, height, team, isWinner, flagCache) {
    flagCache = flagCache || {};
    if (isWinner) {
      ctx.fillStyle = 'rgba(86, 4, 44, 0.1)';
      ctx.fillRect(x, y, width, height);
    }

    var flagWidth = 24;
    var flagHeight = 16;
    var textOffset = 5;

    if (team && team.flagCode && flagCache[team.flagCode]) {
      var flagImg = flagCache[team.flagCode];
      var flagX = x + 5;
      var flagY = y + (height - flagHeight) / 2;
      ctx.drawImage(flagImg, flagX, flagY, flagWidth, flagHeight);
      textOffset = flagWidth + 10;
    }

    ctx.fillStyle = isWinner ? '#0050A0' : '#333333';
    ctx.font = isWinner ? 'bold 12px Roboto, sans-serif' : '12px Roboto, sans-serif';

    var name = team ? team.name : 'TBD';
    ctx.fillText(name, x + textOffset, y + height / 2 + 4, width - textOffset - 5);
  }

  function drawCenteredMatchToCanvas(ctx, x, y, match, width, height, flagCache) {
    flagCache = flagCache || {};
    var playerHeight = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.beginPath();
    ctx.moveTo(x, y + playerHeight);
    ctx.lineTo(x + width, y + playerHeight);
    ctx.stroke();

    drawCenteredTeamToCanvas(ctx, x, y, width, playerHeight, match ? match.team1 : null, match && match.winner === (match.team1 ? match.team1.code : null), flagCache);
    drawCenteredTeamToCanvas(ctx, x, y + playerHeight, width, playerHeight, match ? match.team2 : null, match && match.winner === (match.team2 ? match.team2.code : null), flagCache);
  }

  function drawCenteredTeamToCanvas(ctx, x, y, width, height, team, isWinner, flagCache) {
    flagCache = flagCache || {};
    if (isWinner) {
      ctx.fillStyle = 'rgba(86, 4, 44, 0.1)';
      ctx.fillRect(x, y, width, height);
    }

    var flagWidth = 24;
    var flagHeight = 16;
    var name = team ? team.name : 'TBD';

    ctx.fillStyle = isWinner ? '#0050A0' : '#333333';
    ctx.font = isWinner ? 'bold 14px Roboto, sans-serif' : '14px Roboto, sans-serif';

    var textWidth = ctx.measureText(name).width;
    var gap = 6;
    var totalW = textWidth;
    if (team && team.flagCode && flagCache[team.flagCode]) {
      totalW = flagWidth + gap + textWidth;
    }

    var startX = x + (width - totalW) / 2;

    if (team && team.flagCode && flagCache[team.flagCode]) {
      var flagImg = flagCache[team.flagCode];
      var flagY = y + (height - flagHeight) / 2;
      ctx.drawImage(flagImg, startX, flagY, flagWidth, flagHeight);
      ctx.fillText(name, startX + flagWidth + gap, y + height / 2 + 4);
    } else {
      ctx.textAlign = 'center';
      ctx.fillText(name, x + width / 2, y + height / 2 + 4);
      ctx.textAlign = 'left';
    }
  }

  function drawChampionBox(ctx, x, y, width, height, flagCache) {
    flagCache = flagCache || {};
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px Roboto, sans-serif';
    ctx.fillText('CHAMPION', x + width / 2, y + 18);

    var champion = getChampion();
    var champName = champion ? champion.name : 'TBD';
    ctx.font = 'bold 18px Roboto, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(champName, x + width / 2, y + 42);

    if (champion && champion.flagCode && flagCache[champion.flagCode]) {
      var flagImg = flagCache[champion.flagCode];
      var fW = 28;
      var fH = 20;
      ctx.drawImage(flagImg, x + (width - fW) / 2, y + 50, fW, fH);
    }
    ctx.textAlign = 'left';
  }

  function drawConnectorLines(ctx, dims) {
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    var leftR32X = dims.leftR32X;
    var leftR16X = dims.leftR16X;
    var leftQfX = dims.leftQfX;
    var leftSfX = dims.leftSfX;
    var rightR32X = dims.rightR32X;
    var rightR16X = dims.rightR16X;
    var rightQfX = dims.rightQfX;
    var rightSfX = dims.rightSfX;
    var centerColX = dims.centerColX;
    var yOffset = dims.yOffset;
    var spacing = dims.spacing;
    var roundGap = dims.roundGap;
    var matchBoxWidth = dims.matchBoxWidth;
    var matchBoxHeight = dims.matchBoxHeight;
    var largeBoxWidth = dims.largeBoxWidth;
    var sfY = dims.sfY;

    // R32 to R16 (left)
    for (var i = 0; i < 8; i += 2) {
      var y1 = yOffset + i * spacing + matchBoxHeight / 2;
      var y2 = yOffset + (i + 1) * spacing + matchBoxHeight / 2;
      var targetY = yOffset + (i / 2) * spacing * 2 + spacing / 2 + matchBoxHeight / 2;
      var midX = leftR32X + matchBoxWidth + roundGap / 2;

      ctx.beginPath();
      ctx.moveTo(leftR32X + matchBoxWidth, y1);
      ctx.lineTo(midX, y1);
      ctx.lineTo(midX, y2);
      ctx.lineTo(leftR32X + matchBoxWidth, y2);
      ctx.moveTo(midX, targetY);
      ctx.lineTo(leftR16X, targetY);
      ctx.stroke();
    }

    // R32 to R16 (right)
    for (var i2 = 0; i2 < 8; i2 += 2) {
      var ry1 = yOffset + i2 * spacing + matchBoxHeight / 2;
      var ry2 = yOffset + (i2 + 1) * spacing + matchBoxHeight / 2;
      var rTargetY = yOffset + (i2 / 2) * spacing * 2 + spacing / 2 + matchBoxHeight / 2;
      var rMidX = rightR32X - roundGap / 2;

      ctx.beginPath();
      ctx.moveTo(rightR32X, ry1);
      ctx.lineTo(rMidX, ry1);
      ctx.lineTo(rMidX, ry2);
      ctx.lineTo(rightR32X, ry2);
      ctx.moveTo(rMidX, rTargetY);
      ctx.lineTo(rightR16X + matchBoxWidth, rTargetY);
      ctx.stroke();
    }

    // R16 to QF (left)
    for (var j = 0; j < 4; j += 2) {
      var ly1 = yOffset + j * spacing * 2 + spacing / 2 + matchBoxHeight / 2;
      var ly2 = yOffset + (j + 1) * spacing * 2 + spacing / 2 + matchBoxHeight / 2;
      var lTargetY = yOffset + (j / 2) * spacing * 4 + spacing * 1.5 + matchBoxHeight / 2;
      var lMidX = leftR16X + matchBoxWidth + roundGap / 2;

      ctx.beginPath();
      ctx.moveTo(leftR16X + matchBoxWidth, ly1);
      ctx.lineTo(lMidX, ly1);
      ctx.lineTo(lMidX, ly2);
      ctx.lineTo(leftR16X + matchBoxWidth, ly2);
      ctx.moveTo(lMidX, lTargetY);
      ctx.lineTo(leftQfX, lTargetY);
      ctx.stroke();
    }

    // R16 to QF (right)
    for (var j2 = 0; j2 < 4; j2 += 2) {
      var rly1 = yOffset + j2 * spacing * 2 + spacing / 2 + matchBoxHeight / 2;
      var rly2 = yOffset + (j2 + 1) * spacing * 2 + spacing / 2 + matchBoxHeight / 2;
      var rlTargetY = yOffset + (j2 / 2) * spacing * 4 + spacing * 1.5 + matchBoxHeight / 2;
      var rlMidX = rightR16X - roundGap / 2;

      ctx.beginPath();
      ctx.moveTo(rightR16X, rly1);
      ctx.lineTo(rlMidX, rly1);
      ctx.lineTo(rlMidX, rly2);
      ctx.lineTo(rightR16X, rly2);
      ctx.moveTo(rlMidX, rlTargetY);
      ctx.lineTo(rightQfX + matchBoxWidth, rlTargetY);
      ctx.stroke();
    }

    // QF to SF (left)
    var qfY1 = yOffset + spacing * 1.5 + matchBoxHeight / 2;
    var qfY2 = yOffset + spacing * 5.5 + matchBoxHeight / 2;
    var sfCenterY = sfY + matchBoxHeight / 2;
    var qfSfMidX = leftQfX + matchBoxWidth + roundGap / 2;

    ctx.beginPath();
    ctx.moveTo(leftQfX + matchBoxWidth, qfY1);
    ctx.lineTo(qfSfMidX, qfY1);
    ctx.lineTo(qfSfMidX, sfCenterY);
    ctx.lineTo(leftSfX, sfCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftQfX + matchBoxWidth, qfY2);
    ctx.lineTo(qfSfMidX, qfY2);
    ctx.lineTo(qfSfMidX, sfCenterY);
    ctx.stroke();

    // QF to SF (right)
    var qfSfMidXRight = rightQfX - roundGap / 2;

    ctx.beginPath();
    ctx.moveTo(rightQfX, qfY1);
    ctx.lineTo(qfSfMidXRight, qfY1);
    ctx.lineTo(qfSfMidXRight, sfCenterY);
    ctx.lineTo(rightSfX + matchBoxWidth, sfCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightQfX, qfY2);
    ctx.lineTo(qfSfMidXRight, qfY2);
    ctx.lineTo(qfSfMidXRight, sfCenterY);
    ctx.stroke();

    // SF to Final
    ctx.beginPath();
    ctx.moveTo(leftSfX + matchBoxWidth, sfCenterY);
    ctx.lineTo(centerColX, sfCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightSfX, sfCenterY);
    ctx.lineTo(centerColX + largeBoxWidth, sfCenterY);
    ctx.stroke();
  }

  // ========================================
  // Canvas Data Getters
  // ========================================

  function resolveCanvasMatch(matchId) {
    var matchInfo = FIFAWorldCupData.getBracketMatch(matchId);
    if (!matchInfo) return { team1: null, team2: null, winner: null };

    var teams = getMatchTeams(matchId, matchInfo);
    var winnerCode = state.bracketResults[matchId];

    return {
      team1: teams.team1 ? FIFAWorldCupData.getTeam(teams.team1) : null,
      team2: teams.team2 ? FIFAWorldCupData.getTeam(teams.team2) : null,
      winner: winnerCode || null
    };
  }

  function getCanvasMatchesForRound(roundPrefix, side) {
    var matchIds = FIFAWorldCupData.getMatchesBySide(roundPrefix, side);
    return matchIds.map(function (id) { return resolveCanvasMatch(id); });
  }

  function getR32Matches() {
    var left = getCanvasMatchesForRound('R32', 'left');
    var right = getCanvasMatchesForRound('R32', 'right');
    return left.concat(right);
  }

  function getR16Matches() {
    var left = getCanvasMatchesForRound('R16', 'left');
    var right = getCanvasMatchesForRound('R16', 'right');
    return left.concat(right);
  }

  function getQFMatches() {
    var left = getCanvasMatchesForRound('QF', 'left');
    var right = getCanvasMatchesForRound('QF', 'right');
    return left.concat(right);
  }

  function getSFMatches() {
    var left = getCanvasMatchesForRound('SF', 'left');
    var right = getCanvasMatchesForRound('SF', 'right');
    return left.concat(right);
  }

  function getFinalMatch() {
    var finalMatches = FIFAWorldCupData.getRoundMatches('F');
    var finalId = Object.keys(finalMatches)[0];
    return finalId ? resolveCanvasMatch(finalId) : { team1: null, team2: null, winner: null };
  }

  function getThirdPlaceMatch() {
    var thirdMatches = FIFAWorldCupData.getRoundMatches('3P');
    var thirdId = Object.keys(thirdMatches)[0];
    return thirdId ? resolveCanvasMatch(thirdId) : null;
  }

  function getChampion() {
    var finalMatches = FIFAWorldCupData.getRoundMatches('F');
    var finalId = Object.keys(finalMatches)[0];
    if (!finalId) return null;
    var winnerCode = state.bracketResults[finalId];
    if (!winnerCode) return null;
    return FIFAWorldCupData.getTeam(winnerCode);
  }

  return {
    init,
    reset: resetSimulator,
    simulate: simulateAll,
    simulateGroups,
    getState: () => ({ ...state })
  };
})();

// Execution: Wait for the DOM to be fully loaded before initializing the app.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', FIFAWorldCupSimulator.init);
} else {
  FIFAWorldCupSimulator.init();
}
