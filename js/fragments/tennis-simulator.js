// Tennis Tournament Simulator App - 128 Players, 8 Sections
(function () {
  'use strict';

  if (!trackGAEventForPage) {
    trackGAEventForPage = function (eventName, eventParams) {
      eventParams = eventParams || {};
      trackGAEvent(eventName, Object.assign(eventParams, {
        "tool": "tennis_simulator",
        "device": isDesktop ? "Desktop" : "Mobile",
      }));
    };
  }
  
  if (sendPageViewEvent) {
    trackGAEventForPage("page_view");
  }

  // tournament Data Configuration
  const TournamentData = {
    // Tournament configuration
    config: {
      totalPlayers: 128,
      sectionsCount: 8,
      playersPerSection: 16,
      roundsPerSection: 4,
      finalRounds: 3
    },

    dataUrl: (STATIC_URL + "/" + DATA_SOURCE_PATH).replace("staticd.pr", "staticj.pr") + "tennisSimulatorData.json",

    // Flag URL base
    flagBaseUrl: FLAG_BASE_URL,

    // Section names
    sectionNames: [
      'Section 1', 'Section 2', 'Section 3', 'Section 4',
      'Section 5', 'Section 6', 'Section 7', 'Section 8'
    ],

    // Round names within each section
    sectionRoundNames: ['Round 1', 'Round 2', 'Round 3', 'Round 4'],

    // Final rounds
    finalRoundNames: ['Quarterfinals', 'Semifinals', 'Final'],

    // Players array - will be populated from remote data
    players: [],

    // Women's players - will be populated from remote data
    womenPlayers: [],

    // Tournament name (e.g., "Australian Open")
    tournamentName: "",

    // Gender category names from data
    mensName: "Mens",
    womensName: "Womens",

    // Player counts (128, 96, or 56)
    mensPlayerCount: 128,
    womensPlayerCount: 128,

    // Data loaded flag
    dataLoaded: false,

    // Parse sheet data from collections format
    parseSheetData: function (sheetData) {
      if (!sheetData || !Array.isArray(sheetData) || sheetData.length < 3) {
        return { name: null, players: [] };
      }

      // First row contains metadata: ["# of Players", "128", "Name", "Mens", "Tournament", "Australian Open"]
      const metaRow = sheetData[0];
      let categoryName = null;
      let tournamentName = null;
      let playerCount = 128; // Default

      const nameIndex = metaRow.indexOf('Name');
      if (nameIndex !== -1 && metaRow[nameIndex + 1]) {
        categoryName = metaRow[nameIndex + 1];
      }

      const tournamentIndex = metaRow.indexOf('Tournament');
      if (tournamentIndex !== -1 && metaRow[tournamentIndex + 1]) {
        tournamentName = metaRow[tournamentIndex + 1];
      }

      const playerCountIndex = metaRow.indexOf('# of Players');
      if (playerCountIndex !== -1 && metaRow[playerCountIndex + 1]) {
        playerCount = parseInt(metaRow[playerCountIndex + 1]) || 128;
      }

      // Second row is headers: ["Section", "Spot", "Player", "Seed", "Country", ...]
      const headers = sheetData[1];
      const spotIndex = headers.indexOf('Spot');
      const playerIndex = headers.indexOf('Player');
      const seedIndex = headers.indexOf('Seed');
      const countryIndex = headers.indexOf('Country');

      // Get indices for all round columns
      const roundColumns = {
        'Round 1': headers.indexOf('Round 1'),
        'Round 2': headers.indexOf('Round 2'),
        'Round 3': headers.indexOf('Round 3'),
        'Round 4': headers.indexOf('Round 4'),
        'Quarterfinals': headers.indexOf('Quarterfinals'),
        'Semifinals': headers.indexOf('Semifinals'),
        'Final': headers.indexOf('Final')
      };

      // Get elo column index
      const eloIndex = headers.indexOf('elo');

      // Remaining rows are player data
      const players = sheetData.slice(2).map((row, index) => {
        // Check each round for a "W" value
        const roundWins = {};
        for (const [roundName, colIndex] of Object.entries(roundColumns)) {
          if (colIndex !== -1) {
            const value = (row[colIndex] || '').toString().trim().toLowerCase();
            roundWins[roundName] = value === 'w';
          } else {
            roundWins[roundName] = false;
          }
        }

        // Parse elo rating
        const eloValue = eloIndex !== -1 ? parseFloat(row[eloIndex]) : null;

        return {
          id: index + 1,
          spot: spotIndex !== -1 && row[spotIndex] ? parseInt(row[spotIndex]) : index + 1,
          name: playerIndex !== -1 ? row[playerIndex] || `Player ${index + 1}` : `Player ${index + 1}`,
          seed: seedIndex !== -1 && row[seedIndex] ? parseInt(row[seedIndex]) : null,
          country: countryIndex !== -1 ? row[countryIndex] || null : null,
          elo: !isNaN(eloValue) ? eloValue : 1500, // Default Elo if not provided
          roundWins: roundWins
        };
      });

      return { name: categoryName, tournamentName, players, playerCount };
    },

    // Load data from remote JSON
    loadData: async function () {
      if (this.dataLoaded) return true;

      try {
        const response = await fetch(this.dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Update timestamp if available
        if (data.updatedTime) {
          updateTimestamp(data.updatedTime);
        }

        // Find sheets in collections array
        const collections = data.collections || [];
        const mensSheet = collections.find(c => c.sheetName === 'mens');
        const womensSheet = collections.find(c => c.sheetName === 'womens');

        // Parse mens data
        if (mensSheet && mensSheet.data) {
          const parsed = this.parseSheetData(mensSheet.data);
          this.players = parsed.players;
          this.mensPlayerCount = parsed.playerCount;
          if (parsed.name) {
            this.mensName = parsed.name;
          }
          if (parsed.tournamentName) {
            this.tournamentName = parsed.tournamentName;
          }
        }

        // Parse womens data
        if (womensSheet && womensSheet.data) {
          const parsed = this.parseSheetData(womensSheet.data);
          this.womenPlayers = parsed.players;
          this.womensPlayerCount = parsed.playerCount;
          if (parsed.name) {
            this.womensName = parsed.name;
          }
          // Use womens tournament name if mens didn't have one
          if (parsed.tournamentName && !this.tournamentName) {
            this.tournamentName = parsed.tournamentName;
          }
        } else {
          // Fallback to placeholder if no women's data
          this.womenPlayers = Array.from({ length: 128 }, (_, i) => ({
            id: i + 1,
            name: `Player ${i + 1}`,
            seed: i < 32 ? i + 1 : null,
            country: null
          }));
        }

        this.dataLoaded = true;
        console.log(`Loaded ${this.players.length} mens players (${this.mensName}) and ${this.womenPlayers.length} womens players (${this.womensName})`);
        return true;
      } catch (error) {
        console.error('Failed to load tournament data:', error);
        // Use fallback empty data
        this.players = Array.from({ length: 128 }, (_, i) => ({
          id: i + 1,
          name: `Player ${i + 1}`,
          seed: i < 32 ? i + 1 : null,
          country: null
        }));
        this.womenPlayers = Array.from({ length: 128 }, (_, i) => ({
          id: i + 1,
          name: `Player ${i + 1}`,
          seed: i < 32 ? i + 1 : null,
          country: null
        }));
        return false;
      }
    },

    // Get flag URL for a country code
    getFlagUrl: function (countryCode) {
      if (!countryCode) return null;
      return this.flagBaseUrl + countryCode + '.png';
    },

    // Get players for a specific section (0-7)
    getPlayersForSection: function (sectionIndex) {
      const start = sectionIndex * 16;
      const end = start + 16;
      return this.players.slice(start, end);
    }
  };

  // DOM Elements
  const elements = {
    bracketContainer: document.getElementById('bracket-container'),
    sectionTabs: document.getElementById('section-tabs'),
    btnSimulate: document.getElementById('btn-simulate'),
    btnReset: document.getElementById('btn-reset'),
    btnCopyLink: document.getElementById('btn-copy-link'),
    btnDownload: document.getElementById('btn-download'),
    loadingOverlay: document.getElementById('loading-overlay'),
    toastContainer: document.getElementById('toast-container'),
    statSectionMatches: document.getElementById('stat-section-matches'),
    statMatchesPlayed: document.getElementById('stat-matches-played'),
    statPlayersRemaining: document.getElementById('stat-players-remaining'),
    navToggle: document.querySelector('.nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    btnSeeds: document.getElementById('btn-seeds'),
    seedsModal: document.getElementById('seeds-modal'),
    modalClose: document.getElementById('modal-close'),
    seedsList: document.getElementById('seeds-list'),
    simulateMenu: document.getElementById('simulate-menu'),
    simulateMenuMobile: document.getElementById('simulate-menu-mobile'),
    downloadModal: document.getElementById('download-modal'),
    downloadModalClose: document.getElementById('download-modal-close')
  };

  // Round names for sections based on tournament size
  const SECTION_ROUNDS_128 = ['Round 1', 'Round 2', 'Round 3', 'Round 4'];
  const SECTION_ROUNDS_96 = ['Round 1', 'Round 2', 'Round 3', 'Round 4'];
  const SECTION_ROUNDS_56 = ['Round 1', 'Round 2', 'Round 3'];
  const FINALS_ROUNDS = ['Quarterfinals', 'Semifinals', 'Final'];

  // Get section round names based on tournament size
  function getSectionRoundNames() {
    if (state.playerCount === 56) return SECTION_ROUNDS_56;
    if (state.playerCount === 96) return SECTION_ROUNDS_96;
    return SECTION_ROUNDS_128;
  }

  // App State
  const state = {
    players: [],
    playerCount: 128, // 128, 96, or 56
    sectionCount: 8, // 8 for 128/96, 4 for 56
    playersPerSection: 16, // varies by tournament size
    sectionRounds: 4, // 4 for 128/96, 3 for 56
    sections: [], // sections with their matches
    finals: {
      quarterFinals: [],
      semiFinals: [],
      final: null
    },
    sectionWinners: [], // Winners from each section
    results: {}, // matchId -> winnerId
    champion: null,
    activeSection: 0,
    gender: 'men' // 'men' or 'women'
  };

  // Initialize App
  async function init() {
    showLoading(true);
    await loadData();
    updateGenderButtonLabels();
    setupEventListeners();
    renderAllSections();
    updateStats();
    showLoading(false);
  }

  // Update gender button labels from data
  function updateGenderButtonLabels() {
    document.querySelectorAll('.gender-btn').forEach(btn => {
      if (btn.dataset.gender === 'men') {
        btn.textContent = TournamentData.mensName;
      } else if (btn.dataset.gender === 'women') {
        btn.textContent = TournamentData.womensName;
      }
    });
  }

  // Update timestamp display
  function updateTimestamp(timestamp) {
    const desktop = window.innerWidth >= 768;
    const $ = document.querySelector.bind(document);
    const timestampContainer = desktop
      ? $(".header-wrapper .updated-timestamp-container")
      : $(".pfn-header-wrapper .updated-timestamp-container");

    if (timestampContainer && typeof convertTimestampToESTDateTime === 'function') {
      const updatedTime = convertTimestampToESTDateTime(timestamp);
      timestampContainer.innerHTML = "UPDATED ON " + updatedTime;
    }
  }

  // Load Tournament Data
  async function loadData() {
    // Wait for remote data to load
    await TournamentData.loadData();
    state.players = state.gender === 'men'
      ? TournamentData.players
      : TournamentData.womenPlayers;

    // Get player count and configure tournament structure
    state.playerCount = state.gender === 'men'
      ? TournamentData.mensPlayerCount
      : TournamentData.womensPlayerCount;

    // Configure sections based on player count
    if (state.playerCount === 56) {
      state.sectionCount = 4;
      state.playersPerSection = 14;
      state.sectionRounds = 3; // Round 1, Round 2, Quarterfinals
    } else if (state.playerCount === 96) {
      state.sectionCount = 4;
      state.playersPerSection = 24;
      state.sectionRounds = 4;
    } else {
      // Default to 128
      state.sectionCount = 8;
      state.playersPerSection = 16;
      state.sectionRounds = 4;
    }

    initializeBracket();
    applyPresetResults();
  }

  // Apply preset results (e.g., players with "W" in round columns)
  function applyPresetResults() {
    // Get round names for current tournament size
    const sectionRoundNames = getSectionRoundNames();

    // Go through each section and check all rounds
    state.sections.forEach((section, sectionIndex) => {
      section.rounds.forEach((round, roundIndex) => {
        const roundName = sectionRoundNames[roundIndex];
        round.forEach((match, matchIndex) => {
          if (!match.player1 || !match.player2) return;

          const p1Wins = match.player1.roundWins?.[roundName];
          const p2Wins = match.player2.roundWins?.[roundName];

          // Check if either player has a preset win for this round
          if (p1Wins && !p2Wins) {
            match.winner = match.player1;
            state.results[match.id] = match.player1.id;
            propagateWinner(sectionIndex, roundIndex, matchIndex, match.player1);
          } else if (p2Wins && !p1Wins) {
            match.winner = match.player2;
            state.results[match.id] = match.player2.id;
            propagateWinner(sectionIndex, roundIndex, matchIndex, match.player2);
          }
        });
      });

      // Update section winner(s) based on tournament size
      const lastRoundIndex = section.rounds.length - 1;
      if (state.playerCount === 56 || state.playerCount === 96) {
        // 56/96-player: section produces 2 winners, tracked via updateFinalsFromSections
        // No single section winner
      } else {
        // 128-player: final round produces 1 winner
        const finalMatch = section.rounds[lastRoundIndex]?.[0];
        if (finalMatch?.winner) {
          state.sectionWinners[sectionIndex] = finalMatch.winner;
        }
      }
    });

    // Update finals from section winners
    updateFinalsFromSections();

    // Apply preset results for finals rounds
    applyFinalsPresetResults();
  }

  // Apply preset results for finals (Quarterfinals, Semifinals, Final)
  function applyFinalsPresetResults() {
    // Quarterfinals
    state.finals.quarterFinals.forEach((match, index) => {
      if (!match.player1 || !match.player2) return;

      const p1Wins = match.player1.roundWins?.['Quarterfinals'];
      const p2Wins = match.player2.roundWins?.['Quarterfinals'];

      if (p1Wins && !p2Wins) {
        match.winner = match.player1;
        state.results[match.id] = match.player1.id;
        // Propagate to semifinals
        const sfIndex = Math.floor(index / 2);
        if (index % 2 === 0) {
          state.finals.semiFinals[sfIndex].player1 = match.player1;
        } else {
          state.finals.semiFinals[sfIndex].player2 = match.player1;
        }
      } else if (p2Wins && !p1Wins) {
        match.winner = match.player2;
        state.results[match.id] = match.player2.id;
        const sfIndex = Math.floor(index / 2);
        if (index % 2 === 0) {
          state.finals.semiFinals[sfIndex].player1 = match.player2;
        } else {
          state.finals.semiFinals[sfIndex].player2 = match.player2;
        }
      }
    });

    // Semifinals
    state.finals.semiFinals.forEach((match, index) => {
      if (!match.player1 || !match.player2) return;

      const p1Wins = match.player1.roundWins?.['Semifinals'];
      const p2Wins = match.player2.roundWins?.['Semifinals'];

      if (p1Wins && !p2Wins) {
        match.winner = match.player1;
        state.results[match.id] = match.player1.id;
        if (index === 0) {
          state.finals.final.player1 = match.player1;
        } else {
          state.finals.final.player2 = match.player1;
        }
      } else if (p2Wins && !p1Wins) {
        match.winner = match.player2;
        state.results[match.id] = match.player2.id;
        if (index === 0) {
          state.finals.final.player1 = match.player2;
        } else {
          state.finals.final.player2 = match.player2;
        }
      }
    });

    // Final
    const finalMatch = state.finals.final;
    if (finalMatch.player1 && finalMatch.player2) {
      const p1Wins = finalMatch.player1.roundWins?.['Final'];
      const p2Wins = finalMatch.player2.roundWins?.['Final'];

      if (p1Wins && !p2Wins) {
        finalMatch.winner = finalMatch.player1;
        state.results[finalMatch.id] = finalMatch.player1.id;
        state.champion = finalMatch.player1;
      } else if (p2Wins && !p1Wins) {
        finalMatch.winner = finalMatch.player2;
        state.results[finalMatch.id] = finalMatch.player2.id;
        state.champion = finalMatch.player2;
      }
    }
  }

  // Switch gender bracket
  async function switchGender(gender) {
    if (state.gender === gender) return;

    state.gender = gender;

    // Update toggle buttons
    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === gender);
    });

    // Reset and reload with new gender
    state.sections = [];
    state.finals = { quarterFinals: [], semiFinals: [], final: null };
    state.sectionWinners = [];
    state.results = {};
    state.champion = null;

    showLoading(true);
    await loadData();
    renderAllSections();
    updateStats();
    showLoading(false);
  }

  // Define bye spots for 96-player format (spot numbers that get byes, in order)
  const BYE_SPOTS_96 = {
    0: [1, 6, 7, 12, 13, 18, 19, 24],     // Section 1: spots 1-24
    1: [25, 30, 31, 36, 37, 42, 43, 48],  // Section 2: spots 25-48
    2: [49, 54, 55, 60, 61, 66, 67, 72],  // Section 3: spots 49-72
    3: [73, 78, 79, 84, 85, 90, 91, 96]   // Section 4: spots 73-96
  };

  // Define bye spots for 56-player format (spot numbers that get byes, in order)
  const BYE_SPOTS_56 = {
    0: [1, 14],   // Section 1: spots 1-14
    1: [15, 28],  // Section 2: spots 15-28
    2: [29, 42],  // Section 3: spots 29-42
    3: [43, 56]   // Section 4: spots 43-56
  };

  // Reorder players for 96-player section so bye players come first
  function reorder96SectionPlayers(sectionIndex, players) {
    const byeSpots = BYE_SPOTS_96[sectionIndex];
    if (!byeSpots) return players;

    const byePlayers = [];
    const nonByePlayers = [];

    // Sort players into bye and non-bye groups
    players.forEach(player => {
      if (byeSpots.includes(player.spot)) {
        byePlayers.push(player);
      } else {
        nonByePlayers.push(player);
      }
    });

    // Sort bye players to match the order in BYE_SPOTS_96
    byePlayers.sort((a, b) => byeSpots.indexOf(a.spot) - byeSpots.indexOf(b.spot));

    // Non-bye players keep their original order (by spot)
    nonByePlayers.sort((a, b) => a.spot - b.spot);

    return [...byePlayers, ...nonByePlayers];
  }

  // Reorder players for 56-player section so bye players come first
  function reorder56SectionPlayers(sectionIndex, players) {
    const byeSpots = BYE_SPOTS_56[sectionIndex];
    if (!byeSpots) return players;

    const byePlayers = [];
    const nonByePlayers = [];

    // Sort players into bye and non-bye groups
    players.forEach(player => {
      if (byeSpots.includes(player.spot)) {
        byePlayers.push(player);
      } else {
        nonByePlayers.push(player);
      }
    });

    // Sort bye players to match the order in BYE_SPOTS_56
    byePlayers.sort((a, b) => byeSpots.indexOf(a.spot) - byeSpots.indexOf(b.spot));

    // Non-bye players keep their original order (by spot)
    nonByePlayers.sort((a, b) => a.spot - b.spot);

    return [...byePlayers, ...nonByePlayers];
  }

  // Initialize bracket structure
  function initializeBracket() {
    // Create sections based on tournament size
    for (let s = 0; s < state.sectionCount; s++) {
      let sectionPlayers = state.players.slice(s * state.playersPerSection, (s + 1) * state.playersPerSection);

      // Reorder so bye players come first
      if (state.playerCount === 96) {
        sectionPlayers = reorder96SectionPlayers(s, sectionPlayers);
      } else if (state.playerCount === 56) {
        sectionPlayers = reorder56SectionPlayers(s, sectionPlayers);
      }

      const section = createSectionBracket(s, sectionPlayers);
      state.sections.push(section);
    }

    // Initialize finals structure based on tournament size
    if (state.playerCount === 96) {
      // 96 players: 4 sections, each produces 2 winners → 8 go to QF
      state.finals = {
        quarterFinals: Array(4).fill(null).map((_, i) => ({
          id: `qf-${i}`,
          player1: null,
          player2: null,
          winner: null
        })),
        semiFinals: Array(2).fill(null).map((_, i) => ({
          id: `sf-${i}`,
          player1: null,
          player2: null,
          winner: null
        })),
        final: {
          id: 'final',
          player1: null,
          player2: null,
          winner: null
        }
      };
    } else if (state.playerCount === 56) {
      // 56 players: 4 sections, each produces 2 winners → 8 go to QF
      state.finals = {
        quarterFinals: Array(4).fill(null).map((_, i) => ({
          id: `qf-${i}`,
          player1: null,
          player2: null,
          winner: null
        })),
        semiFinals: Array(2).fill(null).map((_, i) => ({
          id: `sf-${i}`,
          player1: null,
          player2: null,
          winner: null
        })),
        final: {
          id: 'final',
          player1: null,
          player2: null,
          winner: null
        }
      };
    } else {
      // 128 players: 8 sections, each produces 1 winner → 8 go to QF
      state.finals = {
        quarterFinals: Array(4).fill(null).map((_, i) => ({
          id: `qf-${i}`,
          player1: null,
          player2: null,
          winner: null
        })),
        semiFinals: Array(2).fill(null).map((_, i) => ({
          id: `sf-${i}`,
          player1: null,
          player2: null,
          winner: null
        })),
        final: {
          id: 'final',
          player1: null,
          player2: null,
          winner: null
        }
      };
    }
  }

  // Create section bracket based on tournament size
  function createSectionBracket(sectionIndex, players) {
    const section = {
      index: sectionIndex,
      rounds: []
    };

    if (state.playerCount === 128) {
      // 128 players: 16 per section, 4 rounds, no byes
      section.rounds = create128SectionBracket(sectionIndex, players);
    } else if (state.playerCount === 96) {
      // 96 players: 12 per section, 4 rounds, seeds 1-32 (4 per section) skip Round 1
      section.rounds = create96SectionBracket(sectionIndex, players);
    } else if (state.playerCount === 56) {
      // 56 players: 14 per section, 3 rounds, seeds 1-8 (2 per section) skip Round 1
      section.rounds = create56SectionBracket(sectionIndex, players);
    }

    return section;
  }

  // 128-player section: 16 players, 4 rounds, no byes
  function create128SectionBracket(sectionIndex, players) {
    const rounds = [];

    // Round 1: 8 matches (16 players)
    const round1 = [];
    for (let i = 0; i < 8; i++) {
      round1.push({
        id: `s${sectionIndex}-r1-m${i}`,
        round: 0,
        player1: players[i * 2],
        player2: players[i * 2 + 1],
        winner: null
      });
    }
    rounds.push(round1);

    // Round 2: 4 matches
    const round2 = [];
    for (let i = 0; i < 4; i++) {
      round2.push({
        id: `s${sectionIndex}-r2-m${i}`,
        round: 1,
        player1: null,
        player2: null,
        winner: null,
        feedsFrom: [round1[i * 2].id, round1[i * 2 + 1].id]
      });
    }
    rounds.push(round2);

    // Round 3: 2 matches
    const round3 = [];
    for (let i = 0; i < 2; i++) {
      round3.push({
        id: `s${sectionIndex}-r3-m${i}`,
        round: 2,
        player1: null,
        player2: null,
        winner: null,
        feedsFrom: [round2[i * 2].id, round2[i * 2 + 1].id]
      });
    }
    rounds.push(round3);

    // Round 4: 1 match (section winner)
    const round4 = [{
      id: `s${sectionIndex}-r4-m0`,
      round: 3,
      player1: null,
      player2: null,
      winner: null,
      feedsFrom: [round3[0].id, round3[1].id]
    }];
    rounds.push(round4);

    return rounds;
  }

  // 96-player section: 24 players, 4 rounds, 8 seeds skip Round 1
  // Each section has two halves of 12 players, producing 2 winners that go to QF
  function create96SectionBracket(sectionIndex, players) {
    const rounds = [];

    // Players are ordered: seed positions first, then others
    // In 96 format: 8 seeded players (indices 0-7) get byes
    // 16 non-seeded players (indices 8-23) play Round 1

    // Round 1: 8 matches (16 non-seeded players)
    const round1 = [];
    for (let i = 0; i < 8; i++) {
      round1.push({
        id: `s${sectionIndex}-r1-m${i}`,
        round: 0,
        player1: players[8 + i * 2],
        player2: players[8 + i * 2 + 1],
        winner: null
      });
    }
    rounds.push(round1);

    // Round 2: 8 matches (8 seeded + 8 R1 winners)
    // Seeded players enter here with byes
    const round2 = [];
    for (let i = 0; i < 8; i++) {
      round2.push({
        id: `s${sectionIndex}-r2-m${i}`,
        round: 1,
        player1: players[i], // Seeded player with bye
        player2: null, // Winner from Round 1
        winner: null,
        feedsFrom: [round1[i].id],
        hasBye: true
      });
    }
    rounds.push(round2);

    // Round 3: 4 matches
    const round3 = [];
    for (let i = 0; i < 4; i++) {
      round3.push({
        id: `s${sectionIndex}-r3-m${i}`,
        round: 2,
        player1: null,
        player2: null,
        winner: null,
        feedsFrom: [round2[i * 2].id, round2[i * 2 + 1].id]
      });
    }
    rounds.push(round3);

    // Round 4: 2 matches (one per half - each produces a section winner for QF)
    const round4 = [];
    for (let i = 0; i < 2; i++) {
      round4.push({
        id: `s${sectionIndex}-r4-m${i}`,
        round: 3,
        player1: null,
        player2: null,
        winner: null,
        feedsFrom: [round3[i * 2].id, round3[i * 2 + 1].id]
      });
    }
    rounds.push(round4);

    return rounds;
  }

  // 56-player section: 14 players, 3 rounds, 2 seeds skip Round 1
  function create56SectionBracket(sectionIndex, players) {
    const rounds = [];

    // 2 seeded players (indices 0,1) get byes
    // 12 non-seeded players (indices 2-13) play Round 1

    // Round 1: 6 matches (12 non-seeded players)
    const round1 = [];
    for (let i = 0; i < 6; i++) {
      round1.push({
        id: `s${sectionIndex}-r1-m${i}`,
        round: 0,
        player1: players[2 + i * 2],
        player2: players[2 + i * 2 + 1],
        winner: null
      });
    }
    rounds.push(round1);

    // Round 2: 4 matches (2 seeded + 6 R1 winners)
    // Match 1: Seed 1 vs R1 M1 winner
    // Match 2: R1 M2 winner vs R1 M3 winner
    // Match 3: R1 M4 winner vs R1 M5 winner
    // Match 4: Seed 2 vs R1 M6 winner
    const round2 = [];
    round2.push({
      id: `s${sectionIndex}-r2-m0`,
      round: 1,
      player1: players[0], // Seed with bye
      player2: null,
      winner: null,
      feedsFrom: [round1[0].id],
      hasBye: true
    });
    round2.push({
      id: `s${sectionIndex}-r2-m1`,
      round: 1,
      player1: null,
      player2: null,
      winner: null,
      feedsFrom: [round1[1].id, round1[2].id]
    });
    round2.push({
      id: `s${sectionIndex}-r2-m2`,
      round: 1,
      player1: null,
      player2: null,
      winner: null,
      feedsFrom: [round1[3].id, round1[4].id]
    });
    round2.push({
      id: `s${sectionIndex}-r2-m3`,
      round: 1,
      player1: players[1], // Seed with bye
      player2: null,
      winner: null,
      feedsFrom: [round1[5].id],
      hasBye: true
    });
    rounds.push(round2);

    // Quarterfinals (Section): 2 matches - produces 2 section winners
    const round3 = [];
    for (let i = 0; i < 2; i++) {
      round3.push({
        id: `s${sectionIndex}-r3-m${i}`,
        round: 2,
        player1: null,
        player2: null,
        winner: null,
        feedsFrom: [round2[i * 2].id, round2[i * 2 + 1].id]
      });
    }
    rounds.push(round3);

    return rounds;
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Section tab switching
    elements.sectionTabs?.addEventListener('click', (e) => {
      if (e.target.classList.contains('section-tab')) {
        const section = e.target.dataset.section;
        switchSection(section);
      }
    });

    elements.btnSimulate?.addEventListener('click', toggleSimulateMenu);
    elements.btnReset?.addEventListener('click', resetTournament);
    elements.btnCopyLink?.addEventListener('click', copyLink);
    elements.btnDownload?.addEventListener('click', showDownloadModal);
    elements.navToggle?.addEventListener('click', toggleNav);
    elements.btnSeeds?.addEventListener('click', showSeedsModal);
    document.getElementById('nav-seeds')?.addEventListener('click', (e) => {
      e.preventDefault();
      showSeedsModal();
    });
    elements.modalClose?.addEventListener('click', closeSeedsModal);
    elements.seedsModal?.addEventListener('click', (e) => {
      if (e.target === elements.seedsModal) closeSeedsModal();
    });

    // Download modal events
    elements.downloadModalClose?.addEventListener('click', closeDownloadModal);
    elements.downloadModal?.addEventListener('click', (e) => {
      if (e.target === elements.downloadModal) closeDownloadModal();
    });
    document.querySelectorAll('.download-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.download;
        closeDownloadModal();
        if (type === 'full') {
          downloadBracket('full');
        } else if (type === 'last16') {
          downloadBracket('last16');
        }
      });
    });

    // Simulate menu items
    elements.simulateMenu?.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        const type = item.dataset.simulate;
        closeSimulateMenu();
        handleSimulate(type);
      }
    });

    // Mobile simulate menu items
    elements.simulateMenuMobile?.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        const type = item.dataset.simulate;
        closeSimulateMenu();
        handleSimulate(type);
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-dropdown')) {
        closeSimulateMenu();
      }
    });

    // Mobile section dropdown
    document.getElementById('section-select')?.addEventListener('change', (e) => {
      switchSection(e.target.value);
    });

    // Mobile action buttons
    document.getElementById('btn-simulate-mobile')?.addEventListener('click', toggleSimulateMenuMobile);
    document.getElementById('btn-reset-mobile')?.addEventListener('click', resetTournament);
    document.getElementById('btn-seeds-mobile')?.addEventListener('click', showSeedsModal);

    // Gender toggle
    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchGender(btn.dataset.gender);
      });
    });
  }

  // Switch active section
  function switchSection(section) {
    // Update tabs
    document.querySelectorAll('.section-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.section === section);
    });

    // Update mobile dropdown
    const mobileSelect = document.getElementById('section-select');
    if (mobileSelect) {
      mobileSelect.value = section;
    }

    // Update section visibility
    document.querySelectorAll('.section-bracket').forEach(bracket => {
      bracket.classList.remove('active');
    });

    const targetSection = section === 'finals'
      ? document.getElementById('section-finals')
      : document.getElementById(`section-${section}`);

    if (targetSection) {
      targetSection.classList.add('active');
    }

    state.activeSection = section;
    updateStats();
  }

  // Render all sections
  function renderAllSections() {
    // Update section tabs visibility based on tournament size
    updateSectionTabs();

    // Render each section bracket
    for (let i = 0; i < state.sectionCount; i++) {
      renderSectionBracket(i);
    }

    // Render finals
    renderFinals();
  }

  // Update section tabs based on tournament size
  function updateSectionTabs() {
    const tabsContainer = elements.sectionTabs;
    if (!tabsContainer) return;

    // Hide/show tabs based on section count
    const tabs = tabsContainer.querySelectorAll('.section-tab[data-section]');
    tabs.forEach(tab => {
      const sectionNum = parseInt(tab.dataset.section);
      if (!isNaN(sectionNum)) {
        tab.style.display = sectionNum < state.sectionCount ? '' : 'none';
      }
    });
  }

  // Render a section bracket
  function renderSectionBracket(sectionIndex) {
    const container = document.getElementById(`section-${sectionIndex}`);
    if (!container || !state.sections[sectionIndex]) return;

    const section = state.sections[sectionIndex];
    const roundNames = getSectionRoundNames();

    let html = `<div class="bracket-rounds">`;

    // Render each round
    section.rounds.forEach((round, roundIndex) => {
      html += `
              <div class="bracket-round">
                  <div class="round-header">${roundNames[roundIndex]}</div>
                  <div class="round-matches">
          `;

      round.forEach(match => {
        html += renderMatch(match);
      });

      html += `
                  </div>
              </div>
          `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Add click handlers
    addMatchClickHandlers(container, sectionIndex);
  }

  // Format player name with seed in parenthesis
  function formatPlayerName(player) {
    if (!player) return 'TBD';
    let name = player.name;
    const seed = player.seed ? ` (${player.seed})` : '';

    // Surname particles to keep intact (lowercase)
    const surnameParticles = ['de', 'da', 'do', 'dos', 'del', 'van', 'von', 'der', 'den', 'la', 'le', 'di'];

    // Always abbreviate first name(s) to initials, but keep surname particles
    const parts = name.split(' ');
    if (parts.length > 1) {
      // Find where surname particles start (working backwards from second-to-last)
      let surnameStartIndex = parts.length - 1;
      for (let i = parts.length - 2; i >= 0; i--) {
        if (surnameParticles.includes(parts[i].toLowerCase())) {
          surnameStartIndex = i;
        } else {
          break;
        }
      }

      // Need at least one name part to abbreviate
      if (surnameStartIndex > 0) {
        const firstNames = parts.slice(0, surnameStartIndex);
        const surname = parts.slice(surnameStartIndex).join(' ');
        const initials = firstNames.map(n => n.charAt(0) + '.').join(' ');
        name = initials + ' ' + surname;
      }
    }

    return name + seed;
  }

  // Format champion name with first name, surname, and flag on separate lines
  function formatChampionName(player) {
    if (!player) return '<div class="champion-name">TBD</div>';

    const parts = player.name.split(' ');
    const lastName = parts[parts.length - 1];
    const firstNames = parts.slice(0, -1).join(' ');

    return `
          <div class="champion-firstname">${firstNames || lastName}</div>
          <div class="champion-surname">${firstNames ? lastName : ''}</div>
          <div class="champion-flag">${getFlagHtml(player)}</div>
      `;
  }

  // Get flag HTML for a player
  function getFlagHtml(player) {
    const transparentFlag = `${FLAG_BASE_URL}transparent-flag.png`;
    if (!player) return '';

    // Check for Russia and Belarus - use transparent flag per tournament regulations
    const countryUpper = (player.country || '').toUpperCase();
    const blockedCountries = ['RUS', 'RU', 'RUSSIA', 'BLR', 'BY', 'BELARUS'];

    if (!player.country || player.country === 'transparent-flag' || blockedCountries.includes(countryUpper)) {
      return `<img src="${transparentFlag}" alt="" class="player-flag">`;
    }
    const flagUrl = TournamentData.getFlagUrl(player.country);
    return `<img src="${flagUrl}" alt="${player.country}" class="player-flag" onerror="this.src='${transparentFlag}'">`;
  }

  // Render player with flag
  function renderPlayerContent(player, winPct = null) {
    if (!player) return '<span class="player-name">TBD</span>';
    const pctHtml = winPct !== null ? `<span class="win-pct">${winPct}%</span>` : '';
    return `${getFlagHtml(player)}<span class="player-name">${formatPlayerName(player)}</span>${pctHtml}`;
  }

  // Render a match card
  function renderMatch(match) {
    const isCompleted = match.winner !== null;
    const player1 = match.player1;
    const player2 = match.player2;

    // Calculate win percentages if both players exist and match not completed
    let p1Pct = null, p2Pct = null;
    if (player1 && player2 && !isCompleted) {
      const p1Prob = calculateWinProbability(player1, player2);
      p1Pct = Math.round(p1Prob * 100);
      p2Pct = 100 - p1Pct;
    }

    return `
          <div class="match-card ${isCompleted ? 'completed' : ''}" data-match-id="${match.id}">
              <div class="match-player ${match.winner?.id === player1?.id ? 'winner' : ''} ${!player1 ? 'empty' : ''}"
                   data-player-slot="1" data-player-id="${player1?.id || ''}">
                  ${renderPlayerContent(player1, p1Pct)}
              </div>
              <div class="match-player ${match.winner?.id === player2?.id ? 'winner' : ''} ${!player2 ? 'empty' : ''}"
                   data-player-slot="2" data-player-id="${player2?.id || ''}">
                  ${renderPlayerContent(player2, p2Pct)}
              </div>
          </div>
      `;
  }

  // Add click handlers for match selection
  function addMatchClickHandlers(container, sectionIndex) {
    container.querySelectorAll('.match-player:not(.empty)').forEach(playerEl => {
      playerEl.addEventListener('click', () => {
        const matchCard = playerEl.closest('.match-card');
        const matchId = matchCard.dataset.matchId;
        const playerSlot = parseInt(playerEl.dataset.playerSlot);

        selectWinner(sectionIndex, matchId, playerSlot);
      });
    });
  }

  // Select a winner for a match
  function selectWinner(sectionIndex, matchId, playerSlot) {
    const section = state.sections[sectionIndex];
    if (!section) return;

    // Find the match
    let match = null;
    let roundIndex = -1;
    let matchIndex = -1;

    for (let r = 0; r < section.rounds.length; r++) {
      const idx = section.rounds[r].findIndex(m => m.id === matchId);
      if (idx !== -1) {
        match = section.rounds[r][idx];
        roundIndex = r;
        matchIndex = idx;
        break;
      }
    }

    if (!match) return;

    // Get the selected player
    const selectedPlayer = playerSlot === 1 ? match.player1 : match.player2;
    if (!selectedPlayer) return;

    // If clicking the current winner, unselect it
    if (match.winner && match.winner.id === selectedPlayer.id) {
      match.winner = null;
      delete state.results[matchId];

      // Clear downstream matches
      propagateClear(sectionIndex, roundIndex, matchIndex);

      // Clear section winner if this was the final round
      const lastRoundIndex = state.sections[sectionIndex].rounds.length - 1;
      if (roundIndex === lastRoundIndex) {
        if (state.playerCount !== 56 && state.playerCount !== 96) {
          state.sectionWinners[sectionIndex] = null;
        }
        updateFinalsFromSections();
        renderFinals();
      }

      renderSectionBracket(sectionIndex);
      updateStats();
      return;
    }

    // Set the winner
    match.winner = selectedPlayer;
    state.results[matchId] = selectedPlayer.id;

    // Propagate to next round
    propagateWinner(sectionIndex, roundIndex, matchIndex, selectedPlayer);

    // Re-render the section
    renderSectionBracket(sectionIndex);

    // Update section winner if final round
    const lastRoundIndex = state.sections[sectionIndex].rounds.length - 1;
    if (roundIndex === lastRoundIndex) {
      if (state.playerCount !== 56 && state.playerCount !== 96) {
        state.sectionWinners[sectionIndex] = selectedPlayer;
      }
      updateFinalsFromSections();
      renderFinals();
    }

    updateStats();
  }

  // 56-player R1→R2 mapping: [R1 match index] → { nextMatch, slot }
  const R1_TO_R2_MAP_56 = {
    0: { nextMatch: 0, slot: 'player2' },  // R1 M1 → R2 M1 (bye)
    1: { nextMatch: 1, slot: 'player1' },  // R1 M2 → R2 M2
    2: { nextMatch: 1, slot: 'player2' },  // R1 M3 → R2 M2
    3: { nextMatch: 2, slot: 'player1' },  // R1 M4 → R2 M3
    4: { nextMatch: 2, slot: 'player2' },  // R1 M5 → R2 M3
    5: { nextMatch: 3, slot: 'player2' }   // R1 M6 → R2 M4 (bye)
  };

  // Propagate winner to next round
  function propagateWinner(sectionIndex, roundIndex, matchIndex, winner) {
    const section = state.sections[sectionIndex];
    if (roundIndex >= section.rounds.length - 1) return;

    const nextRound = section.rounds[roundIndex + 1];
    let nextMatchIndex, slot;

    // Special handling for 56-player R1→R2
    if (state.playerCount === 56 && roundIndex === 0) {
      const mapping = R1_TO_R2_MAP_56[matchIndex];
      if (mapping) {
        nextMatchIndex = mapping.nextMatch;
        slot = mapping.slot;
      } else {
        return;
      }
    }
    // For 96-player R1→R2: 1:1 mapping (each R1 match feeds directly to corresponding R2 match)
    else if (state.playerCount === 96 && roundIndex === 0 && nextRound[matchIndex]?.hasBye) {
      nextMatchIndex = matchIndex;
      slot = 'player2'; // Bye matches always use player2
    }
    // Standard 2:1 mapping for other rounds
    else {
      nextMatchIndex = Math.floor(matchIndex / 2);
      slot = (matchIndex % 2 === 0) ? 'player1' : 'player2';
    }

    const nextMatch = nextRound[nextMatchIndex];
    if (!nextMatch) return;

    // Set the winner in the appropriate slot
    nextMatch[slot] = winner;

    // Clear downstream results if winner changed
    if (nextMatch.winner) {
      nextMatch.winner = null;
      delete state.results[nextMatch.id];
      propagateClear(sectionIndex, roundIndex + 1, nextMatchIndex);
    }
  }

  // Clear downstream matches when a result changes
  function propagateClear(sectionIndex, roundIndex, matchIndex) {
    const section = state.sections[sectionIndex];
    if (roundIndex >= section.rounds.length - 1) return;

    const nextRound = section.rounds[roundIndex + 1];
    let nextMatchIndex, slot;

    // Special handling for 56-player R1→R2
    if (state.playerCount === 56 && roundIndex === 0) {
      const mapping = R1_TO_R2_MAP_56[matchIndex];
      if (mapping) {
        nextMatchIndex = mapping.nextMatch;
        slot = mapping.slot;
      } else {
        return;
      }
    }
    // For 96-player R1→R2: 1:1 mapping
    else if (state.playerCount === 96 && roundIndex === 0 && nextRound[matchIndex]?.hasBye) {
      nextMatchIndex = matchIndex;
      slot = 'player2';
    }
    // Standard 2:1 mapping for other rounds
    else {
      nextMatchIndex = Math.floor(matchIndex / 2);
      slot = (matchIndex % 2 === 0) ? 'player1' : 'player2';
    }

    const nextMatch = nextRound[nextMatchIndex];
    if (!nextMatch) return;

    // Clear the appropriate slot
    nextMatch[slot] = null;

    nextMatch.winner = null;
    delete state.results[nextMatch.id];

    propagateClear(sectionIndex, roundIndex + 1, nextMatchIndex);
  }

  // Update finals bracket from section winners
  function updateFinalsFromSections() {
    if (state.playerCount === 96) {
      // 96 players: 4 sections, each produces 2 winners (from two halves)
      // The "fold" happens in QF - two halves of same section meet
      // QF0: Section 0 half-0 vs Section 0 half-1
      // QF1: Section 1 half-0 vs Section 1 half-1
      // QF2: Section 2 half-0 vs Section 2 half-1
      // QF3: Section 3 half-0 vs Section 3 half-1
      for (let i = 0; i < 4; i++) {
        const section = state.sections[i];
        const lastRoundIndex = section?.rounds.length - 1;
        state.finals.quarterFinals[i].player1 = section?.rounds[lastRoundIndex]?.[0]?.winner || null;
        state.finals.quarterFinals[i].player2 = section?.rounds[lastRoundIndex]?.[1]?.winner || null;
      }
    } else if (state.playerCount === 56) {
      // 56 players: 4 sections, each produces 2 winners from R3
      // QF0: Section 0 R3[0] winner vs Section 0 R3[1] winner
      // QF1: Section 1 R3[0] winner vs Section 1 R3[1] winner
      // QF2: Section 2 R3[0] winner vs Section 2 R3[1] winner
      // QF3: Section 3 R3[0] winner vs Section 3 R3[1] winner
      for (let i = 0; i < 4; i++) {
        const section = state.sections[i];
        const lastRoundIndex = section?.rounds.length - 1;
        state.finals.quarterFinals[i].player1 = section?.rounds[lastRoundIndex]?.[0]?.winner || null;
        state.finals.quarterFinals[i].player2 = section?.rounds[lastRoundIndex]?.[1]?.winner || null;
      }
    } else {
      // 128 players: 8 sections, each produces 1 winner
      // QF0: Section 0 vs Section 1
      // QF1: Section 2 vs Section 3
      // QF2: Section 4 vs Section 5
      // QF3: Section 6 vs Section 7
      for (let i = 0; i < 4; i++) {
        state.finals.quarterFinals[i].player1 = state.sectionWinners[i * 2] || null;
        state.finals.quarterFinals[i].player2 = state.sectionWinners[i * 2 + 1] || null;
      }
    }
  }

  // Render finals bracket
  function renderFinals() {
    const container = document.getElementById('section-finals');
    if (!container) return;

    let html = `<div class="bracket-rounds">`;

    // Quarterfinals
    html += `
          <div class="bracket-round">
              <div class="round-header">Quarterfinals</div>
              <div class="round-matches">
      `;
    state.finals.quarterFinals.forEach(match => {
      html += renderFinalsMatch(match, 'qf');
    });
    html += `</div></div>`;

    // Semifinals
    html += `
          <div class="bracket-round">
              <div class="round-header">Semifinals</div>
              <div class="round-matches">
      `;
    state.finals.semiFinals.forEach(match => {
      html += renderFinalsMatch(match, 'sf');
    });
    html += `</div></div>`;

    // Final
    html += `
          <div class="bracket-round">
              <div class="round-header">Final</div>
              <div class="round-matches">
                  ${renderFinalsMatch(state.finals.final, 'final')}
              </div>
          </div>
      `;

    // Champion display
    html += `
          <div class="bracket-round">
              <div class="round-header">Champion</div>
              <div class="round-matches">
                  <div class="finals-champion">
                      <div class="champion-title">Tournament Champion</div>
                      ${formatChampionName(state.champion)}
                  </div>
              </div>
          </div>
      `;

    html += `</div>`;
    container.innerHTML = html;

    // Add finals click handlers
    addFinalsClickHandlers(container);
  }

  // Render finals match
  function renderFinalsMatch(match, stage) {
    const isCompleted = match.winner !== null;
    const player1 = match.player1;
    const player2 = match.player2;

    // Calculate win percentages if both players exist and match not completed
    let p1Pct = null, p2Pct = null;
    if (player1 && player2 && !isCompleted) {
      const p1Prob = calculateWinProbability(player1, player2);
      p1Pct = Math.round(p1Prob * 100);
      p2Pct = 100 - p1Pct;
    }

    return `
          <div class="match-card ${isCompleted ? 'completed' : ''}" data-match-id="${match.id}" data-stage="${stage}">
              <div class="match-player ${match.winner?.id === player1?.id ? 'winner' : ''} ${!player1 ? 'empty' : ''}"
                   data-player-slot="1" data-player-id="${player1?.id || ''}">
                  ${renderPlayerContent(player1, p1Pct)}
              </div>
              <div class="match-player ${match.winner?.id === player2?.id ? 'winner' : ''} ${!player2 ? 'empty' : ''}"
                   data-player-slot="2" data-player-id="${player2?.id || ''}">
                  ${renderPlayerContent(player2, p2Pct)}
              </div>
          </div>
      `;
  }

  // Add click handlers for finals
  function addFinalsClickHandlers(container) {
    container.querySelectorAll('.match-player:not(.empty)').forEach(playerEl => {
      playerEl.addEventListener('click', () => {
        const matchCard = playerEl.closest('.match-card');
        const matchId = matchCard.dataset.matchId;
        const stage = matchCard.dataset.stage;
        const playerSlot = parseInt(playerEl.dataset.playerSlot);

        selectFinalsWinner(stage, matchId, playerSlot);
      });
    });
  }

  // Select winner in finals
  function selectFinalsWinner(stage, matchId, playerSlot) {
    let match, matchIndex;

    if (stage === 'qf') {
      matchIndex = state.finals.quarterFinals.findIndex(m => m.id === matchId);
      match = state.finals.quarterFinals[matchIndex];
    } else if (stage === 'sf') {
      matchIndex = state.finals.semiFinals.findIndex(m => m.id === matchId);
      match = state.finals.semiFinals[matchIndex];
    } else if (stage === 'final') {
      match = state.finals.final;
      matchIndex = 0;
    }

    if (!match) return;

    const selectedPlayer = playerSlot === 1 ? match.player1 : match.player2;
    if (!selectedPlayer) return;

    // If clicking the current winner, unselect it
    if (match.winner && match.winner.id === selectedPlayer.id) {
      match.winner = null;
      delete state.results[matchId];

      // Clear downstream
      if (stage === 'qf') {
        const sfIndex = Math.floor(matchIndex / 2);
        if (matchIndex % 2 === 0) {
          state.finals.semiFinals[sfIndex].player1 = null;
        } else {
          state.finals.semiFinals[sfIndex].player2 = null;
        }
        state.finals.semiFinals[sfIndex].winner = null;
        delete state.results[state.finals.semiFinals[sfIndex].id];
        // Clear final
        state.finals.final.player1 = null;
        state.finals.final.player2 = null;
        state.finals.final.winner = null;
        delete state.results[state.finals.final.id];
        state.champion = null;
      } else if (stage === 'sf') {
        if (matchIndex === 0) {
          state.finals.final.player1 = null;
        } else {
          state.finals.final.player2 = null;
        }
        state.finals.final.winner = null;
        delete state.results[state.finals.final.id];
        state.champion = null;
      } else if (stage === 'final') {
        state.champion = null;
      }

      renderFinals();
      updateStats();
      return;
    }

    match.winner = selectedPlayer;
    state.results[matchId] = selectedPlayer.id;

    // Propagate to next stage
    if (stage === 'qf') {
      const sfIndex = Math.floor(matchIndex / 2);
      if (matchIndex % 2 === 0) {
        state.finals.semiFinals[sfIndex].player1 = selectedPlayer;
      } else {
        state.finals.semiFinals[sfIndex].player2 = selectedPlayer;
      }
      // Clear downstream
      state.finals.semiFinals[sfIndex].winner = null;
      delete state.results[state.finals.semiFinals[sfIndex].id];
    } else if (stage === 'sf') {
      if (matchIndex === 0) {
        state.finals.final.player1 = selectedPlayer;
      } else {
        state.finals.final.player2 = selectedPlayer;
      }
      // Clear downstream
      state.finals.final.winner = null;
      delete state.results[state.finals.final.id];
      state.champion = null;
    } else if (stage === 'final') {
      state.champion = selectedPlayer;
    }

    renderFinals();
    updateStats();
  }

  // Toggle Simulate Menu
  function toggleSimulateMenu(e) {
    e.stopPropagation();
    elements.simulateMenu?.classList.toggle('active');
  }

  // Toggle Mobile Simulate Menu
  function toggleSimulateMenuMobile(e) {
    e.stopPropagation();
    elements.simulateMenuMobile?.classList.toggle('active');
  }

  // Close Simulate Menu
  function closeSimulateMenu() {
    elements.simulateMenu?.classList.remove('active');
    elements.simulateMenuMobile?.classList.remove('active');
  }

  // Handle Simulate based on type
  function handleSimulate(type) {
    showLoading(true);

    setTimeout(() => {
      if (type === 'section') {
        // Simulate only current section
        if (state.activeSection !== 'finals') {
          simulateSection(parseInt(state.activeSection));
          updateFinalsFromSections();
          renderSectionBracket(parseInt(state.activeSection));
          renderFinals();
          showToast('Section simulated!');
        } else {
          // Simulate finals only
          simulateFinalsRound('qf');
          simulateFinalsRound('sf');
          simulateFinalsRound('final');
          renderFinals();
          showToast('Finals simulated!');
        }
      } else if (type === 'all-sections') {
        // Simulate all sections but not finals
        for (let s = 0; s < state.sectionCount; s++) {
          simulateSection(s);
        }
        updateFinalsFromSections();
        renderAllSections();
        showToast('All sections simulated!');
      } else if (type === 'everything') {
        // Simulate everything
        for (let s = 0; s < state.sectionCount; s++) {
          simulateSection(s);
        }
        updateFinalsFromSections();
        simulateFinalsRound('qf');
        simulateFinalsRound('sf');
        simulateFinalsRound('final');
        renderAllSections();
        showToast('Tournament simulated!');
      }

      showLoading(false);
      updateStats();
    }, 500);
  }

  // Simulate Tournament (legacy - kept for compatibility)
  function simulateTournament() {
    handleSimulate('everything');
  }

  // Calculate win probability using Elo ratings
  // Formula: P(win) = 1 / (1 + 10^((opponentElo - playerElo) / 400))
  // 100 pts diff = 64%, 200 pts = 76%, 300 pts = 85%, 400 pts = 91%, 500 pts = 95%
  function calculateWinProbability(player1, player2) {
    const elo1 = player1.elo || 1500;
    const elo2 = player2.elo || 1500;
    return 1 / (1 + Math.pow(10, (elo2 - elo1) / 400));
  }

  // Simulate a section
  function simulateSection(sectionIndex) {
    const section = state.sections[sectionIndex];

    section.rounds.forEach((round, roundIndex) => {
      round.forEach((match, matchIndex) => {
        if (match.player1 && match.player2 && !match.winner) {
          // Calculate win probability using Elo ratings
          const p1Chance = calculateWinProbability(match.player1, match.player2);

          match.winner = Math.random() < p1Chance ? match.player1 : match.player2;
          state.results[match.id] = match.winner.id;

          // Propagate
          propagateWinner(sectionIndex, roundIndex, matchIndex, match.winner);
        }
      });
    });

    // Set section winner (for 128 format only - 56/96 use updateFinalsFromSections)
    if (state.playerCount !== 56 && state.playerCount !== 96) {
      const lastRoundIndex = section.rounds.length - 1;
      const finalMatch = section.rounds[lastRoundIndex]?.[0];
      if (finalMatch?.winner) {
        state.sectionWinners[sectionIndex] = finalMatch.winner;
      }
    }
  }

  // Simulate finals round
  function simulateFinalsRound(stage) {
    let matches;
    if (stage === 'qf') matches = state.finals.quarterFinals;
    else if (stage === 'sf') matches = state.finals.semiFinals;
    else if (stage === 'final') matches = [state.finals.final];

    matches.forEach((match, index) => {
      if (match.player1 && match.player2 && !match.winner) {
        // Calculate win probability using Elo ratings
        const p1Chance = calculateWinProbability(match.player1, match.player2);

        match.winner = Math.random() < p1Chance ? match.player1 : match.player2;
        state.results[match.id] = match.winner.id;

        // Propagate
        if (stage === 'qf') {
          const sfIndex = Math.floor(index / 2);
          if (index % 2 === 0) {
            state.finals.semiFinals[sfIndex].player1 = match.winner;
          } else {
            state.finals.semiFinals[sfIndex].player2 = match.winner;
          }
        } else if (stage === 'sf') {
          if (index === 0) {
            state.finals.final.player1 = match.winner;
          } else {
            state.finals.final.player2 = match.winner;
          }
        } else if (stage === 'final') {
          state.champion = match.winner;
        }
      }
    });
  }

  // Reset Tournament
  function resetTournament() {
    state.sections = [];
    state.finals = { quarterFinals: [], semiFinals: [], final: null };
    state.sectionWinners = [];
    state.results = {};
    state.champion = null;

    initializeBracket();
    renderAllSections();
    updateStats();
    showToast('Tournament reset');
  }

  // Update Statistics
  function updateStats() {
    // Calculate total matches based on tournament size
    let totalMatches, sectionMatchCount;
    if (state.playerCount === 56) {
      sectionMatchCount = 12; // 6 + 4 + 2
      totalMatches = (4 * sectionMatchCount) + 7; // 4 sections + finals
    } else if (state.playerCount === 96) {
      sectionMatchCount = 22; // 8 + 8 + 4 + 2
      totalMatches = (4 * sectionMatchCount) + 7; // 4 sections + finals
    } else {
      sectionMatchCount = 15; // 8 + 4 + 2 + 1
      totalMatches = (8 * sectionMatchCount) + 7; // 8 sections + finals
    }

    const matchesPlayed = Object.keys(state.results).length;

    // Count remaining players (those who haven't lost)
    const losers = new Set(Object.values(state.results));
    const remaining = state.champion ? 1 : (state.playerCount - losers.size);

    // Count section matches for active section
    let sectionMatches = 0;
    let sectionTotal = sectionMatchCount;

    if (state.activeSection !== 'finals' && state.sections[state.activeSection]) {
      const section = state.sections[state.activeSection];
      section.rounds.forEach(round => {
        round.forEach(match => {
          if (match.winner) sectionMatches++;
        });
      });
      // Calculate actual section total from rounds
      sectionTotal = section.rounds.reduce((sum, round) => sum + round.length, 0);
    } else if (state.activeSection === 'finals') {
      // Count finals matches
      sectionTotal = 7; // 4 QF + 2 SF + 1 Final
      state.finals.quarterFinals.forEach(m => { if (m.winner) sectionMatches++; });
      state.finals.semiFinals.forEach(m => { if (m.winner) sectionMatches++; });
      if (state.finals.final?.winner) sectionMatches++;
    }

    if (elements.statSectionMatches) elements.statSectionMatches.textContent = `${sectionMatches} / ${sectionTotal}`;
    if (elements.statMatchesPlayed) elements.statMatchesPlayed.textContent = `${matchesPlayed} / ${totalMatches}`;
    if (elements.statPlayersRemaining) elements.statPlayersRemaining.textContent = remaining;
  }

  // Copy Link
  function copyLink() {
    const url = "https://pfsn.app/tennis-sim";
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy link');
    });
  }

  // Preload flag images for all players
  async function preloadFlags() {
    const flagCache = {};
    const countryCodes = new Set();

    // Collect all country codes from players
    state.players.forEach(player => {
      if (player.country) countryCodes.add(player.country);
    });

    // Load all flags
    const loadPromises = Array.from(countryCodes).map(code => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          flagCache[code] = img;
          resolve();
        };
        img.onerror = () => resolve(); // Skip failed flags
        img.src = TournamentData.getFlagUrl(code);
      });
    });

    await Promise.all(loadPromises);
    return flagCache;
  }

  // Preload logo image
  async function preloadLogo() {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = `${STATIC_URL}/skm/assets/pfn/pfsn-logo-white-ver-2.png?w=40&h=40`;
    });
  }

  // Download Bracket
  async function downloadBracket(type = 'full') {
    showLoading(true);

    try {
      // Preload all flag images and logo
      const flagCache = await preloadFlags();
      const logo = await preloadLogo();

      const canvas = type === 'last16'
        ? generateLast16Canvas(flagCache, logo)
        : generateBracketCanvas(flagCache, logo);

      // Create download link
      const link = document.createElement('a');
      const suffix = type === 'last16' ? 'last16' : 'full';
      link.download = `tennis-bracket-${state.gender}-${suffix}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('Bracket downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to generate bracket image');
    }
    showLoading(false);
  }

  // Generate canvas with bracket layout
  function generateBracketCanvas(flagCache = {}, logo = null) {
    // Use different layout for 96 and 56 player brackets (4 sections)
    if (state.playerCount === 96 || state.playerCount === 56) {
      return generateBracketCanvas4Sections(flagCache, logo);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Canvas dimensions - must match drawSectionToCanvas values
    const dpr = 2; // High DPI for crisp images
    const matchBoxWidth = 135; // Reduced by 25% from 180
    const matchBoxHeight = 44;
    const roundGap = 25;
    const matchGap = 8;

    // Calculate dimensions based on tournament size
    const halfSections = state.sectionCount / 2;
    const roundsPerSection = state.sections[0]?.rounds.length || 4;

    // Width: left sections + finals column + right sections
    // Round 3 overlaps Round 2, Round 4 overlaps Round 3 (each by 35%)
    const overlap = matchBoxWidth * 0.35;
    const overlapOffset = matchBoxWidth - overlap;
    // Section width: R1 + gap + R2 + overlap + R3 + overlap + R4 (partial, QF overlaps into it)
    const sectionWidth = (matchBoxWidth + roundGap) + overlapOffset * 2 + matchBoxWidth;
    const finalsColWidth = matchBoxWidth + 60; // Single column for QF/SF/F
    const totalWidth = sectionWidth * 2 + finalsColWidth + 60;

    // Height: actual section height based on Round 1 matches
    const maxMatchesR1 = state.sections[0]?.rounds[0]?.length || 8;
    const sectionHeight = maxMatchesR1 * (matchBoxHeight + matchGap);
    const totalHeight = sectionHeight * halfSections + 140; // Header + footer

    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Header bar
    ctx.fillStyle = '#0050A0';
    ctx.fillRect(0, 0, totalWidth, 60);

    // Title - Tournament name + gender category (centered)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Roboto, sans-serif';
    const tournamentName = TournamentData.tournamentName || '';
    const genderName = state.gender === 'men' ? TournamentData.mensName : TournamentData.womensName;
    const title = tournamentName ? `${tournamentName} - ${genderName}` : `${genderName} Draw`;
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (totalWidth - titleWidth) / 2, 40);

    // Draw logo in top left corner
    if (logo) {
      ctx.drawImage(logo, 10, 10, 40, 40);
    }

    const yOffset = 70;

    // Section layout depends on tournament size
    let leftSections, rightSections;
    if (state.sectionCount === 8) {
      // 128 players: 8 sections
      leftSections = [0, 1, 4, 5];
      rightSections = [2, 3, 6, 7];
    } else {
      // 96 players: 4 sections - sections 1 & 3 on left, sections 2 & 4 on right
      leftSections = [0, 2];  // Sections 1 and 3
      rightSections = [1, 3]; // Sections 2 and 4
    }

    // Draw left side sections
    leftSections.forEach((sectionIdx, position) => {
      drawSectionToCanvas(ctx, 20, yOffset + position * sectionHeight, state.sections[sectionIdx], sectionIdx, 'left', flagCache);
    });

    // Draw right side sections - mirrored
    const rightX = totalWidth - sectionWidth - 20;
    rightSections.forEach((sectionIdx, position) => {
      drawSectionToCanvas(ctx, rightX, yOffset + position * sectionHeight, state.sections[sectionIdx], sectionIdx, 'right', flagCache);
    });

    // Draw finals - QFs overlap into Round 4
    const finalsX = sectionWidth + 20 - overlap; // Start earlier to overlap into R4
    drawFinalsToCanvas(ctx, finalsX, yOffset, finalsColWidth, sectionHeight, matchBoxWidth, matchBoxHeight, overlap, flagCache);

    // Footer
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, totalHeight - 40, totalWidth, 40);
    ctx.fillStyle = '#666666';
    ctx.font = '12px Roboto, sans-serif';
    ctx.fillText('https://www.profootballnetwork.com/tennis-simulator/', totalWidth / 2 - 130, totalHeight - 15);

    return canvas;
  }

  // Generate canvas for 96/56 player brackets (4 sections)
  function generateBracketCanvas4Sections(flagCache = {}, logo = null) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const dpr = 2;
    const matchBoxWidth = 135;
    const matchBoxHeight = 44;
    const roundGap = 25;
    const matchGap = 8;

    // Calculate dimensions for 4 sections (2 left, 2 right)
    const roundsPerSection = state.sections[0]?.rounds.length || 4;
    const overlap = matchBoxWidth * 0.35;
    const overlapOffset = matchBoxWidth - overlap;

    // Section width based on number of rounds
    // For 96-player: no R2/R3 overlap, only R3/R4 overlap
    // For 56-player: no overlap, all rounds with gaps
    let sectionWidth;
    if (state.playerCount === 96) {
      // R1, R2, R3 with gaps + R4 overlapping R3
      sectionWidth = (matchBoxWidth + roundGap) * 2 + overlapOffset + matchBoxWidth;
    } else if (state.playerCount === 56) {
      // 56-player: R1, R2, R3 with gaps (no overlap)
      sectionWidth = (matchBoxWidth + roundGap) * 2 + matchBoxWidth;
    } else {
      sectionWidth = (matchBoxWidth + roundGap) + overlapOffset * (roundsPerSection - 2) + matchBoxWidth;
    }
    // Center area: QF + gap + SF/Final + gap + QF
    const qfGap = 15;
    const centerGap = 30;
    const finalsColWidth = matchBoxWidth * 3 + qfGap * 2 + centerGap * 2;
    const totalWidth = sectionWidth * 2 + finalsColWidth + 40;

    // Height: 2 sections per side
    const maxMatchesR1 = state.sections[0]?.rounds[0]?.length || 8;
    const sectionHeight = maxMatchesR1 * (matchBoxHeight + matchGap);
    const totalHeight = sectionHeight * 2 + 140; // 2 sections per side + header/footer

    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Header bar
    ctx.fillStyle = '#0050A0';
    ctx.fillRect(0, 0, totalWidth, 60);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Roboto, sans-serif';
    const tournamentName = TournamentData.tournamentName || '';
    const genderName = state.gender === 'men' ? TournamentData.mensName : TournamentData.womensName;
    const title = tournamentName ? `${tournamentName} - ${genderName}` : `${genderName} Draw`;
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (totalWidth - titleWidth) / 2, 40);

    // Draw logo in top left corner
    if (logo) {
      ctx.drawImage(logo, 10, 10, 40, 40);
    }

    const yOffset = 70;

    // Section arrangement for 4-section brackets
    let leftSections, rightSections;
    if (state.playerCount === 56) {
      // 56 players: Section 1 top left, Section 2 top right, Section 3 bottom left, Section 4 bottom right
      leftSections = [0, 2];  // Sections 1 and 3 on left
      rightSections = [1, 3]; // Sections 2 and 4 on right
    } else {
      // 96 players: Sections 1 and 3 on left, Sections 2 and 4 on right
      leftSections = [0, 2];
      rightSections = [1, 3];
    }

    // Choose the right drawing function based on player count
    let drawFn;
    if (state.playerCount === 96) {
      drawFn = draw96SectionToCanvas;
    } else if (state.playerCount === 56) {
      drawFn = draw56SectionToCanvas;
    } else {
      drawFn = drawSectionToCanvas;
    }

    // Draw left side sections
    leftSections.forEach((sectionIdx, position) => {
      drawFn(ctx, 20, yOffset + position * sectionHeight, state.sections[sectionIdx], sectionIdx, 'left', flagCache);
    });

    // Draw right side sections - mirrored
    const rightX = totalWidth - sectionWidth - 20;
    rightSections.forEach((sectionIdx, position) => {
      drawFn(ctx, rightX, yOffset + position * sectionHeight, state.sections[sectionIdx], sectionIdx, 'right', flagCache);
    });

    // Draw finals with QFs positioned next to their sections
    const leftSectionEnd = 20 + sectionWidth;
    const rightSectionStart = totalWidth - sectionWidth - 20;
    drawFinalsToCanvas4Sections(ctx, yOffset, sectionHeight, matchBoxWidth, matchBoxHeight, leftSectionEnd, rightSectionStart, totalWidth, flagCache);

    // Footer
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, totalHeight - 40, totalWidth, 40);
    ctx.fillStyle = '#666666';
    ctx.font = '12px Roboto, sans-serif';
    ctx.fillText('https://www.profootballnetwork.com/tennis-simulator/', totalWidth / 2 - 130, totalHeight - 15);

    return canvas;
  }

  // Draw finals for 4-section brackets (96/56 players)
  // QFs are positioned between each section's last round matches
  function drawFinalsToCanvas4Sections(ctx, yOffset, sectionHeight, matchBoxWidth, matchBoxHeight, leftSectionEnd, rightSectionStart, totalWidth, flagCache) {
    const qfGap = 15; // Gap between section last round and QF
    const centerX = totalWidth / 2;

    // QF X positions: left QFs after left sections, right QFs before right sections
    const leftQfX = leftSectionEnd + qfGap;
    const rightQfX = rightSectionStart - matchBoxWidth - qfGap;

    // QF Y positions: centered in each section (between the two last-round matches)
    // Section 1 (index 0): top left
    // Section 2 (index 1): top right
    // Section 3 (index 2): bottom left
    // Section 4 (index 3): bottom right
    const qf1Y = yOffset + sectionHeight * 0.5 - matchBoxHeight / 2;  // Section 1 center
    const qf2Y = yOffset + sectionHeight * 0.5 - matchBoxHeight / 2;  // Section 2 center
    const qf3Y = yOffset + sectionHeight * 1.5 - matchBoxHeight / 2;  // Section 3 center
    const qf4Y = yOffset + sectionHeight * 1.5 - matchBoxHeight / 2;  // Section 4 center

    // Calculate last round match Y positions for connector lines
    const matchGap = 8;
    const baseSpacing = matchBoxHeight + matchGap;

    let lastRoundM0CenterOffset, lastRoundM1CenterOffset;

    if (state.playerCount === 56) {
      // 56-player: R3 is the last round (2 matches)
      // Calculate R3 centers based on draw56SectionToCanvas logic
      // R1: 6 matches with even spacing
      const r1Centers = [];
      for (let i = 0; i < 6; i++) {
        r1Centers[i] = i * baseSpacing + baseSpacing / 2;
      }
      // R2: 4 matches aligned with R1
      const r2Centers = [
        r1Centers[0],                           // R2 M0 = R1 M0
        (r1Centers[1] + r1Centers[2]) / 2,      // R2 M1 = midpoint of R1 M1 & M2
        (r1Centers[3] + r1Centers[4]) / 2,      // R2 M2 = midpoint of R1 M3 & M4
        r1Centers[5]                            // R2 M3 = R1 M5
      ];
      // R3: 2 matches centered between R2 matches
      const r3Centers = [
        (r2Centers[0] + r2Centers[1]) / 2,      // R3 M0
        (r2Centers[2] + r2Centers[3]) / 2       // R3 M1
      ];
      lastRoundM0CenterOffset = r3Centers[0];
      lastRoundM1CenterOffset = r3Centers[1];
    } else {
      // 96-player: R4 is the last round (2 matches)
      const r4Spacing = baseSpacing * 4; // 208 for 96-player
      lastRoundM0CenterOffset = (r4Spacing - matchBoxHeight) / 2 + matchBoxHeight / 2;
      lastRoundM1CenterOffset = r4Spacing + (r4Spacing - matchBoxHeight) / 2 + matchBoxHeight / 2;
    }

    // Draw connector lines from last round to QFs
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    // Left sections (1 and 3) - last round connects from right edge
    // Section 1 last round → QF1
    const s1M0Y = yOffset + lastRoundM0CenterOffset;
    const s1M1Y = yOffset + lastRoundM1CenterOffset;
    const midX1 = leftSectionEnd + qfGap / 2;
    ctx.beginPath();
    // Horizontal from last round M0 to midpoint
    ctx.moveTo(leftSectionEnd, s1M0Y);
    ctx.lineTo(midX1, s1M0Y);
    // Vertical line connecting both last round matches at midpoint
    ctx.moveTo(midX1, s1M0Y);
    ctx.lineTo(midX1, s1M1Y);
    // Horizontal from last round M1 to midpoint
    ctx.moveTo(leftSectionEnd, s1M1Y);
    ctx.lineTo(midX1, s1M1Y);
    // Horizontal from midpoint to QF
    ctx.moveTo(midX1, qf1Y + matchBoxHeight / 2);
    ctx.lineTo(leftQfX, qf1Y + matchBoxHeight / 2);
    ctx.stroke();

    // Section 3 last round → QF3
    const s3M0Y = yOffset + sectionHeight + lastRoundM0CenterOffset;
    const s3M1Y = yOffset + sectionHeight + lastRoundM1CenterOffset;
    ctx.beginPath();
    ctx.moveTo(leftSectionEnd, s3M0Y);
    ctx.lineTo(midX1, s3M0Y);
    ctx.moveTo(midX1, s3M0Y);
    ctx.lineTo(midX1, s3M1Y);
    ctx.moveTo(leftSectionEnd, s3M1Y);
    ctx.lineTo(midX1, s3M1Y);
    ctx.moveTo(midX1, qf3Y + matchBoxHeight / 2);
    ctx.lineTo(leftQfX, qf3Y + matchBoxHeight / 2);
    ctx.stroke();

    // Right sections (2 and 4) - last round connects from left edge
    // Section 2 last round → QF2
    const s2M0Y = yOffset + lastRoundM0CenterOffset;
    const s2M1Y = yOffset + lastRoundM1CenterOffset;
    const midX2 = rightSectionStart - qfGap / 2;
    ctx.beginPath();
    ctx.moveTo(rightSectionStart, s2M0Y);
    ctx.lineTo(midX2, s2M0Y);
    ctx.moveTo(midX2, s2M0Y);
    ctx.lineTo(midX2, s2M1Y);
    ctx.moveTo(rightSectionStart, s2M1Y);
    ctx.lineTo(midX2, s2M1Y);
    ctx.moveTo(midX2, qf2Y + matchBoxHeight / 2);
    ctx.lineTo(rightQfX + matchBoxWidth, qf2Y + matchBoxHeight / 2);
    ctx.stroke();

    // Section 4 last round → QF4
    const s4M0Y = yOffset + sectionHeight + lastRoundM0CenterOffset;
    const s4M1Y = yOffset + sectionHeight + lastRoundM1CenterOffset;
    ctx.beginPath();
    ctx.moveTo(rightSectionStart, s4M0Y);
    ctx.lineTo(midX2, s4M0Y);
    ctx.moveTo(midX2, s4M0Y);
    ctx.lineTo(midX2, s4M1Y);
    ctx.moveTo(rightSectionStart, s4M1Y);
    ctx.lineTo(midX2, s4M1Y);
    ctx.moveTo(midX2, qf4Y + matchBoxHeight / 2);
    ctx.lineTo(rightQfX + matchBoxWidth, qf4Y + matchBoxHeight / 2);
    ctx.stroke();

    // Draw QF matches
    // QF1: Section 1 (left, top)
    drawMatchToCanvas(ctx, leftQfX, qf1Y, state.finals.quarterFinals[0], matchBoxWidth, matchBoxHeight, flagCache);
    // QF2: Section 2 (right, top)
    drawMatchToCanvas(ctx, rightQfX, qf2Y, state.finals.quarterFinals[1], matchBoxWidth, matchBoxHeight, flagCache);
    // QF3: Section 3 (left, bottom)
    drawMatchToCanvas(ctx, leftQfX, qf3Y, state.finals.quarterFinals[2], matchBoxWidth, matchBoxHeight, flagCache);
    // QF4: Section 4 (right, bottom)
    drawMatchToCanvas(ctx, rightQfX, qf4Y, state.finals.quarterFinals[3], matchBoxWidth, matchBoxHeight, flagCache);

    // SF positions: between QF pairs horizontally, centered between top/bottom vertically
    const sfX = centerX - matchBoxWidth / 2;
    const sfY1 = yOffset + sectionHeight * 0.5 - matchBoxHeight / 2;  // Top SF
    const sfY2 = yOffset + sectionHeight * 1.5 - matchBoxHeight / 2;  // Bottom SF

    // Reset stroke style after drawing matches
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    // Connector lines from left QFs to SFs
    ctx.beginPath();
    ctx.moveTo(leftQfX + matchBoxWidth, qf1Y + matchBoxHeight / 2);
    ctx.lineTo(sfX, sfY1 + matchBoxHeight / 2);
    ctx.moveTo(leftQfX + matchBoxWidth, qf3Y + matchBoxHeight / 2);
    ctx.lineTo(sfX, sfY2 + matchBoxHeight / 2);
    ctx.stroke();

    // Connector lines from right QFs to SFs
    ctx.beginPath();
    ctx.moveTo(rightQfX, qf2Y + matchBoxHeight / 2);
    ctx.lineTo(sfX + matchBoxWidth, sfY1 + matchBoxHeight / 2);
    ctx.moveTo(rightQfX, qf4Y + matchBoxHeight / 2);
    ctx.lineTo(sfX + matchBoxWidth, sfY2 + matchBoxHeight / 2);
    ctx.stroke();

    // Draw SF matches
    drawMatchToCanvas(ctx, sfX, sfY1, state.finals.semiFinals[0], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, sfX, sfY2, state.finals.semiFinals[1], matchBoxWidth, matchBoxHeight, flagCache);

    // Final position - centered between SFs
    const finalY = (sfY1 + sfY2) / 2;

    // Reset stroke style after drawing matches
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    // Final and Champion box are 50% bigger
    const largeBoxWidth = matchBoxWidth * 1.5;
    const largeBoxHeight = matchBoxHeight * 1.5;
    const largeFinalX = centerX - largeBoxWidth / 2;

    // Connector lines from SFs to Final
    ctx.beginPath();
    ctx.moveTo(sfX + matchBoxWidth / 2, sfY1 + matchBoxHeight);
    ctx.lineTo(sfX + matchBoxWidth / 2, finalY);
    ctx.moveTo(sfX + matchBoxWidth / 2, sfY2);
    ctx.lineTo(sfX + matchBoxWidth / 2, finalY + largeBoxHeight);
    ctx.stroke();

    // Draw Final match with centered text
    drawCenteredMatchToCanvas(ctx, largeFinalX, finalY, state.finals.final, largeBoxWidth, largeBoxHeight, flagCache);

    // Champion box - centered between blue header (y=60) and top SF
    if (state.champion) {
      const headerBottom = 60;
      const availableSpace = sfY1 - headerBottom;
      const champY = headerBottom + (availableSpace - largeBoxHeight) / 2;
      const champX = centerX - largeBoxWidth / 2;

      ctx.fillStyle = '#ffd700';
      ctx.fillRect(champX, champY, largeBoxWidth, largeBoxHeight);
      ctx.strokeStyle = '#daa520';
      ctx.lineWidth = 2;
      ctx.strokeRect(champX, champY, largeBoxWidth, largeBoxHeight);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 12px Roboto, sans-serif';
      ctx.fillText('CHAMPION', champX + largeBoxWidth / 2, champY + 18);

      ctx.font = 'bold 14px Roboto, sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(state.champion.name, champX + largeBoxWidth / 2, champY + 38);

      // Draw champion's flag centered below name
      if (state.champion.country && flagCache[state.champion.country]) {
        const flagImg = flagCache[state.champion.country];
        const flagWidth = 24;
        const flagHeight = 17;
        const flagX = champX + (largeBoxWidth - flagWidth) / 2;
        const flagY = champY + 44;
        ctx.drawImage(flagImg, flagX, flagY, flagWidth, flagHeight);
      }
      ctx.textAlign = 'left';
    }
  }

  // Draw a match box with centered text (for Final)
  function drawCenteredMatchToCanvas(ctx, x, y, match, width, height, flagCache = {}) {
    const playerHeight = height / 2;

    // Match box background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);

    // Border
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Middle divider
    ctx.beginPath();
    ctx.moveTo(x, y + playerHeight);
    ctx.lineTo(x + width, y + playerHeight);
    ctx.stroke();

    // Player 1 - centered
    drawCenteredPlayerToCanvas(ctx, x, y, width, playerHeight, match.player1, match.winner?.id === match.player1?.id, flagCache);

    // Player 2 - centered
    drawCenteredPlayerToCanvas(ctx, x, y + playerHeight, width, playerHeight, match.player2, match.winner?.id === match.player2?.id, flagCache);
  }

  // Draw a player row with centered text
  function drawCenteredPlayerToCanvas(ctx, x, y, width, height, player, isWinner, flagCache = {}) {
    if (isWinner) {
      ctx.fillStyle = 'rgba(0, 80, 160, 0.1)';
      ctx.fillRect(x, y, width, height);
    }

    // Draw flag if available
    const flagWidth = 20;
    const flagHeight = 14;
    const name = player ? formatPlayerName(player) : 'TBD';

    ctx.fillStyle = isWinner ? '#0050A0' : '#333333';
    ctx.font = isWinner ? 'bold 12px Roboto, sans-serif' : '12px Roboto, sans-serif';

    // Calculate total width of flag + gap + text
    const textWidth = ctx.measureText(name).width;
    const gap = 6;
    let totalWidth = textWidth;
    if (player?.country && flagCache[player.country]) {
      totalWidth = flagWidth + gap + textWidth;
    }

    const startX = x + (width - totalWidth) / 2;

    if (player?.country && flagCache[player.country]) {
      const flagImg = flagCache[player.country];
      const flagY = y + (height - flagHeight) / 2;
      ctx.drawImage(flagImg, startX, flagY, flagWidth, flagHeight);
      ctx.fillText(name, startX + flagWidth + gap, y + height / 2 + 4);
    } else {
      ctx.textAlign = 'center';
      ctx.fillText(name, x + width / 2, y + height / 2 + 4);
      ctx.textAlign = 'left';
    }
  }

  // Generate Last 16 canvas (Round 4 + Finals)
  function generateLast16Canvas(flagCache = {}, logo = null) {
    // Use different layout for 96/56 player brackets
    if (state.playerCount === 96 || state.playerCount === 56) {
      return generateLast16Canvas4Sections(flagCache, logo);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const dpr = 2;
    const matchBoxWidth = 160;
    const matchBoxHeight = 50;
    const matchGap = 15;
    const roundGap = 40;

    // Layout: Left R4 (4 matches) | QF | SF | Final/Champ | SF | QF | Right R4 (4 matches)
    const r4ColumnWidth = matchBoxWidth + roundGap;
    const qfColumnWidth = matchBoxWidth + roundGap;
    const sfColumnWidth = matchBoxWidth + roundGap;
    const centerColumnWidth = matchBoxWidth * 1.5 + 40;

    const totalWidth = r4ColumnWidth * 2 + qfColumnWidth * 2 + sfColumnWidth * 2 + centerColumnWidth + 60;
    const totalHeight = 4 * (matchBoxHeight + matchGap) * 2 + 160; // 4 R4 matches per side + header/footer

    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Header bar
    ctx.fillStyle = '#0050A0';
    ctx.fillRect(0, 0, totalWidth, 60);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Roboto, sans-serif';
    const tournamentName = TournamentData.tournamentName || '';
    const genderName = state.gender === 'men' ? TournamentData.mensName : TournamentData.womensName;
    const title = tournamentName ? `${tournamentName} - ${genderName} (Last 16)` : `${genderName} (Last 16)`;
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (totalWidth - titleWidth) / 2, 40);

    // Draw logo in top left corner
    if (logo) {
      ctx.drawImage(logo, 10, 10, 40, 40);
    }

    const yOffset = 80;
    const centerX = totalWidth / 2;

    // Calculate column X positions
    const leftR4X = 20;
    const leftQfX = leftR4X + r4ColumnWidth;
    const leftSfX = leftQfX + qfColumnWidth;
    const centerColX = centerX - (matchBoxWidth * 1.5) / 2;
    const rightSfX = centerX + centerColumnWidth / 2;
    const rightQfX = rightSfX + sfColumnWidth;
    const rightR4X = rightQfX + qfColumnWidth;

    // Draw Round 4 matches - Left side (Sections 1, 2, 3, 4)
    const leftSections = [0, 1, 2, 3];
    leftSections.forEach((sectionIdx, i) => {
      const section = state.sections[sectionIdx];
      const r4Match = section?.rounds[3]?.[0]; // Round 4 is index 3
      const y = yOffset + i * (matchBoxHeight + matchGap) * 2;
      if (r4Match) {
        drawMatchToCanvas(ctx, leftR4X, y, r4Match, matchBoxWidth, matchBoxHeight, flagCache);
      }
    });

    // Draw Round 4 matches - Right side (Sections 5, 6, 7, 8)
    const rightSections = [4, 5, 6, 7];
    rightSections.forEach((sectionIdx, i) => {
      const section = state.sections[sectionIdx];
      const r4Match = section?.rounds[3]?.[0];
      const y = yOffset + i * (matchBoxHeight + matchGap) * 2;
      if (r4Match) {
        drawMatchToCanvas(ctx, rightR4X, y, r4Match, matchBoxWidth, matchBoxHeight, flagCache);
      }
    });

    // Draw Quarterfinals - Left side (QF1, QF2)
    // QF1 centered between sections 1&2 (positions 0&1), QF2 centered between sections 3&4 (positions 2&3)
    const spacing = (matchBoxHeight + matchGap) * 2;
    const qfLeftY1 = yOffset + spacing / 2; // Centered between positions 0 and 1
    const qfLeftY2 = yOffset + spacing * 2.5; // Centered between positions 2 and 3
    drawMatchToCanvas(ctx, leftQfX, qfLeftY1, state.finals.quarterFinals[0], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, leftQfX, qfLeftY2, state.finals.quarterFinals[1], matchBoxWidth, matchBoxHeight, flagCache);

    // Draw Quarterfinals - Right side (QF3, QF4)
    // QF3 centered between sections 5&6, QF4 centered between sections 7&8
    drawMatchToCanvas(ctx, rightQfX, qfLeftY1, state.finals.quarterFinals[2], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, rightQfX, qfLeftY2, state.finals.quarterFinals[3], matchBoxWidth, matchBoxHeight, flagCache);

    // Draw Semifinals - SF1 on left, SF2 on right, centered between the two QFs
    const sfCenterY = (qfLeftY1 + matchBoxHeight / 2 + qfLeftY2 + matchBoxHeight / 2) / 2;
    const sfY = sfCenterY - matchBoxHeight / 2;
    drawMatchToCanvas(ctx, leftSfX, sfY, state.finals.semiFinals[0], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, rightSfX, sfY, state.finals.semiFinals[1], matchBoxWidth, matchBoxHeight, flagCache);

    // Draw Final (larger, centered) - center aligned with SF center
    const largeBoxWidth = matchBoxWidth * 1.5;
    const largeBoxHeight = matchBoxHeight * 1.5;
    const finalY = sfCenterY - largeBoxHeight / 2;
    drawCenteredMatchBox(ctx, centerColX, finalY, largeBoxWidth, largeBoxHeight, state.finals.final, flagCache, true);

    // Draw Champion box
    const champY = finalY + largeBoxHeight + 20;
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(centerColX, champY, largeBoxWidth, largeBoxHeight);
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerColX, champY, largeBoxWidth, largeBoxHeight);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px Roboto, sans-serif';
    ctx.fillText('CHAMPION', centerColX + largeBoxWidth / 2, champY + 18);

    const champName = state.champion ? state.champion.name : 'TBD';
    ctx.font = 'bold 18px Roboto, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(champName, centerColX + largeBoxWidth / 2, champY + 42);

    // Draw champion's flag centered below name
    if (state.champion?.country && flagCache[state.champion.country]) {
      const flagImg = flagCache[state.champion.country];
      const flagWidth = 28;
      const flagHeight = 20;
      const flagX = centerColX + (largeBoxWidth - flagWidth) / 2;
      const flagY = champY + 50;
      ctx.drawImage(flagImg, flagX, flagY, flagWidth, flagHeight);
    }
    ctx.textAlign = 'left';

    // Draw connector lines
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    // R4 to QF connectors (left side - QF1 and QF2)
    for (let i = 0; i < 4; i += 2) {
      const r4Y1 = yOffset + i * spacing + matchBoxHeight / 2;
      const r4Y2 = yOffset + (i + 1) * spacing + matchBoxHeight / 2;
      const qfY = i === 0 ? qfLeftY1 + matchBoxHeight / 2 : qfLeftY2 + matchBoxHeight / 2;
      const midX = leftR4X + matchBoxWidth + roundGap / 2;

      ctx.beginPath();
      ctx.moveTo(leftR4X + matchBoxWidth, r4Y1);
      ctx.lineTo(midX, r4Y1);
      ctx.lineTo(midX, r4Y2);
      ctx.lineTo(leftR4X + matchBoxWidth, r4Y2);
      ctx.moveTo(midX, qfY);
      ctx.lineTo(leftQfX, qfY);
      ctx.stroke();
    }

    // R4 to QF connectors (right side - QF3 and QF4)
    for (let i = 0; i < 4; i += 2) {
      const r4Y1 = yOffset + i * spacing + matchBoxHeight / 2;
      const r4Y2 = yOffset + (i + 1) * spacing + matchBoxHeight / 2;
      const qfY = i === 0 ? qfLeftY1 + matchBoxHeight / 2 : qfLeftY2 + matchBoxHeight / 2;
      const midX = rightR4X - roundGap / 2;

      ctx.beginPath();
      ctx.moveTo(rightR4X, r4Y1);
      ctx.lineTo(midX, r4Y1);
      ctx.lineTo(midX, r4Y2);
      ctx.lineTo(rightR4X, r4Y2);
      ctx.moveTo(midX, qfY);
      ctx.lineTo(rightQfX + matchBoxWidth, qfY);
      ctx.stroke();
    }

    // QF to SF connectors (left side - QF1 & QF2 to SF1)
    const qfY1Center = qfLeftY1 + matchBoxHeight / 2;
    const qfY2Center = qfLeftY2 + matchBoxHeight / 2;
    const qfSfMidX = leftQfX + matchBoxWidth + roundGap / 2;

    ctx.beginPath();
    ctx.moveTo(leftQfX + matchBoxWidth, qfY1Center);
    ctx.lineTo(qfSfMidX, qfY1Center);
    ctx.lineTo(qfSfMidX, sfCenterY);
    ctx.lineTo(leftSfX, sfCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftQfX + matchBoxWidth, qfY2Center);
    ctx.lineTo(qfSfMidX, qfY2Center);
    ctx.lineTo(qfSfMidX, sfCenterY);
    ctx.stroke();

    // QF to SF connectors (right side - QF3 & QF4 to SF2)
    const qfSfMidXRight = rightQfX - roundGap / 2;

    ctx.beginPath();
    ctx.moveTo(rightQfX, qfY1Center);
    ctx.lineTo(qfSfMidXRight, qfY1Center);
    ctx.lineTo(qfSfMidXRight, sfCenterY);
    ctx.lineTo(rightSfX + matchBoxWidth, sfCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightQfX, qfY2Center);
    ctx.lineTo(qfSfMidXRight, qfY2Center);
    ctx.lineTo(qfSfMidXRight, sfCenterY);
    ctx.stroke();

    // SF to Final connectors
    ctx.beginPath();
    ctx.moveTo(leftSfX + matchBoxWidth, sfCenterY);
    ctx.lineTo(centerColX, sfCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightSfX, sfCenterY);
    ctx.lineTo(centerColX + largeBoxWidth, sfCenterY);
    ctx.stroke();

    // Footer
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, totalHeight - 40, totalWidth, 40);
    ctx.fillStyle = '#666666';
    ctx.font = '12px Roboto, sans-serif';
    ctx.fillText('https://www.profootballnetwork.com/tennis-simulator/', totalWidth / 2 - 130, totalHeight - 15);

    return canvas;
  }

  // Generate Last 16 canvas for 96/56 player brackets (4 sections)
  function generateLast16Canvas4Sections(flagCache = {}, logo = null) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const dpr = 2;
    const matchBoxWidth = 160;
    const matchBoxHeight = 50;
    const matchGap = 15;
    const roundGap = 40;

    // For 96/56: Last section round (2 matches × 4 sections) + QF + SF + Final
    // Layout: Left last round (4 matches) | QF | SF | Final/Champ | SF | QF | Right last round (4 matches)
    const lastRoundColWidth = matchBoxWidth + roundGap;
    const qfColumnWidth = matchBoxWidth + roundGap;
    const sfColumnWidth = matchBoxWidth + roundGap;
    const centerColumnWidth = matchBoxWidth * 1.5 + 40;

    const totalWidth = lastRoundColWidth * 2 + qfColumnWidth * 2 + sfColumnWidth * 2 + centerColumnWidth + 60;
    const totalHeight = 4 * (matchBoxHeight + matchGap) * 2 + 160;

    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Header bar
    ctx.fillStyle = '#0050A0';
    ctx.fillRect(0, 0, totalWidth, 60);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Roboto, sans-serif';
    const tournamentName = TournamentData.tournamentName || '';
    const genderName = state.gender === 'men' ? TournamentData.mensName : TournamentData.womensName;
    const title = tournamentName ? `${tournamentName} - ${genderName} (Last 16)` : `${genderName} (Last 16)`;
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (totalWidth - titleWidth) / 2, 40);

    // Draw logo in top left corner
    if (logo) {
      ctx.drawImage(logo, 10, 10, 40, 40);
    }

    const yOffset = 80;
    const centerX = totalWidth / 2;

    // Calculate column X positions
    const leftLastRoundX = 20;
    const leftQfX = leftLastRoundX + lastRoundColWidth;
    const leftSfX = leftQfX + qfColumnWidth;
    const centerColX = centerX - (matchBoxWidth * 1.5) / 2;
    const rightSfX = centerX + centerColumnWidth / 2;
    const rightQfX = rightSfX + sfColumnWidth;
    const rightLastRoundX = rightQfX + qfColumnWidth;

    // Get last round index
    const lastRoundIndex = state.sections[0]?.rounds.length - 1 || 3;

    // Draw last section round matches - Left side (Sections 1 and 3 = indices 0, 2)
    // Section 0 has 2 matches, Section 2 has 2 matches
    const spacing = (matchBoxHeight + matchGap) * 2;
    let matchPosition = 0;
    [0, 2].forEach(sectionIdx => {
      const section = state.sections[sectionIdx];
      const lastRound = section?.rounds[lastRoundIndex] || [];
      lastRound.forEach((match, matchIdx) => {
        const y = yOffset + matchPosition * spacing;
        drawMatchToCanvas(ctx, leftLastRoundX, y, match, matchBoxWidth, matchBoxHeight, flagCache);
        matchPosition++;
      });
    });

    // Draw last section round matches - Right side (Sections 2 and 4 = indices 1, 3)
    matchPosition = 0;
    [1, 3].forEach(sectionIdx => {
      const section = state.sections[sectionIdx];
      const lastRound = section?.rounds[lastRoundIndex] || [];
      lastRound.forEach((match, matchIdx) => {
        const y = yOffset + matchPosition * spacing;
        drawMatchToCanvas(ctx, rightLastRoundX, y, match, matchBoxWidth, matchBoxHeight, flagCache);
        matchPosition++;
      });
    });

    // Draw Quarterfinals - 4 matches (the "fold" - one per section)
    // QF0 & QF1 on left, QF2 & QF3 on right
    const qfY1 = yOffset + spacing / 2;
    const qfY2 = yOffset + spacing * 2.5;
    drawMatchToCanvas(ctx, leftQfX, qfY1, state.finals.quarterFinals[0], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, leftQfX, qfY2, state.finals.quarterFinals[1], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, rightQfX, qfY1, state.finals.quarterFinals[2], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, rightQfX, qfY2, state.finals.quarterFinals[3], matchBoxWidth, matchBoxHeight, flagCache);

    // Draw Semifinals
    const sfCenterY = (qfY1 + matchBoxHeight / 2 + qfY2 + matchBoxHeight / 2) / 2;
    const sfY = sfCenterY - matchBoxHeight / 2;
    drawMatchToCanvas(ctx, leftSfX, sfY, state.finals.semiFinals[0], matchBoxWidth, matchBoxHeight, flagCache);
    drawMatchToCanvas(ctx, rightSfX, sfY, state.finals.semiFinals[1], matchBoxWidth, matchBoxHeight, flagCache);

    // Draw Final (larger, centered)
    const largeBoxWidth = matchBoxWidth * 1.5;
    const largeBoxHeight = matchBoxHeight * 1.5;
    const finalY = sfCenterY - largeBoxHeight / 2;
    drawCenteredMatchBox(ctx, centerColX, finalY, largeBoxWidth, largeBoxHeight, state.finals.final, flagCache, true);

    // Draw Champion box
    const champY = finalY + largeBoxHeight + 20;
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(centerColX, champY, largeBoxWidth, largeBoxHeight);
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerColX, champY, largeBoxWidth, largeBoxHeight);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px Roboto, sans-serif';
    ctx.fillText('CHAMPION', centerColX + largeBoxWidth / 2, champY + 18);

    const champName2 = state.champion ? state.champion.name : 'TBD';
    ctx.font = 'bold 18px Roboto, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(champName2, centerColX + largeBoxWidth / 2, champY + 42);

    // Draw champion's flag centered below name
    if (state.champion?.country && flagCache[state.champion.country]) {
      const flagImg = flagCache[state.champion.country];
      const flagWidth = 28;
      const flagHeight = 20;
      const flagX = centerColX + (largeBoxWidth - flagWidth) / 2;
      const flagY = champY + 50;
      ctx.drawImage(flagImg, flagX, flagY, flagWidth, flagHeight);
    }
    ctx.textAlign = 'left';

    // Draw connector lines
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    // Last round to QF connectors (left side)
    for (let i = 0; i < 4; i += 2) {
      const r4Y1 = yOffset + i * spacing + matchBoxHeight / 2;
      const r4Y2 = yOffset + (i + 1) * spacing + matchBoxHeight / 2;
      const qfY = i === 0 ? qfY1 + matchBoxHeight / 2 : qfY2 + matchBoxHeight / 2;
      const midX = leftLastRoundX + matchBoxWidth + roundGap / 2;

      ctx.beginPath();
      ctx.moveTo(leftLastRoundX + matchBoxWidth, r4Y1);
      ctx.lineTo(midX, r4Y1);
      ctx.lineTo(midX, r4Y2);
      ctx.lineTo(leftLastRoundX + matchBoxWidth, r4Y2);
      ctx.moveTo(midX, qfY);
      ctx.lineTo(leftQfX, qfY);
      ctx.stroke();
    }

    // Last round to QF connectors (right side)
    for (let i = 0; i < 4; i += 2) {
      const r4Y1 = yOffset + i * spacing + matchBoxHeight / 2;
      const r4Y2 = yOffset + (i + 1) * spacing + matchBoxHeight / 2;
      const qfY = i === 0 ? qfY1 + matchBoxHeight / 2 : qfY2 + matchBoxHeight / 2;
      const midX = rightLastRoundX - roundGap / 2;

      ctx.beginPath();
      ctx.moveTo(rightLastRoundX, r4Y1);
      ctx.lineTo(midX, r4Y1);
      ctx.lineTo(midX, r4Y2);
      ctx.lineTo(rightLastRoundX, r4Y2);
      ctx.moveTo(midX, qfY);
      ctx.lineTo(rightQfX + matchBoxWidth, qfY);
      ctx.stroke();
    }

    // QF to SF connectors
    const qfY1Center = qfY1 + matchBoxHeight / 2;
    const qfY2Center = qfY2 + matchBoxHeight / 2;
    const qfSfMidX = leftQfX + matchBoxWidth + roundGap / 2;

    ctx.beginPath();
    ctx.moveTo(leftQfX + matchBoxWidth, qfY1Center);
    ctx.lineTo(qfSfMidX, qfY1Center);
    ctx.lineTo(qfSfMidX, sfCenterY);
    ctx.lineTo(leftSfX, sfCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftQfX + matchBoxWidth, qfY2Center);
    ctx.lineTo(qfSfMidX, qfY2Center);
    ctx.lineTo(qfSfMidX, sfCenterY);
    ctx.stroke();

    const qfSfMidXRight = rightQfX - roundGap / 2;

    ctx.beginPath();
    ctx.moveTo(rightQfX, qfY1Center);
    ctx.lineTo(qfSfMidXRight, qfY1Center);
    ctx.lineTo(qfSfMidXRight, sfCenterY);
    ctx.lineTo(rightSfX + matchBoxWidth, sfCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightQfX, qfY2Center);
    ctx.lineTo(qfSfMidXRight, qfY2Center);
    ctx.lineTo(qfSfMidXRight, sfCenterY);
    ctx.stroke();

    // SF to Final connectors
    ctx.beginPath();
    ctx.moveTo(leftSfX + matchBoxWidth, sfCenterY);
    ctx.lineTo(centerColX, sfCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightSfX, sfCenterY);
    ctx.lineTo(centerColX + largeBoxWidth, sfCenterY);
    ctx.stroke();

    // Footer
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, totalHeight - 40, totalWidth, 40);
    ctx.fillStyle = '#666666';
    ctx.font = '12px Roboto, sans-serif';
    ctx.fillText('https://www.profootballnetwork.com/tennis-simulator/', totalWidth / 2 - 130, totalHeight - 15);

    return canvas;
  }

  // Draw a 96-player section bracket to canvas (handles 1:1 R1→R2 mapping)
  function draw96SectionToCanvas(ctx, startX, startY, section, sectionIndex, side, flagCache = {}) {
    if (!section) return;

    const matchBoxWidth = 135;
    const matchBoxHeight = 44;
    const roundGap = 25;
    const matchGap = 8;
    const numRounds = section.rounds.length; // Should be 4

    // Calculate positions for each round with overlap
    const overlap = matchBoxWidth * 0.35;
    const overlapOffset = matchBoxWidth - overlap;

    // For 96-player: R1 has 8 matches, R2 has 8 matches, R3 has 4, R4 has 2
    // Spacing multipliers: R1=1, R2=1, R3=2, R4=4
    const spacingMultipliers = [1, 1, 2, 4];

    // Pre-calculate X positions for all rounds (no R2/R3 overlap, only R3/R4 overlap)
    const roundXPositions = [];
    for (let roundIndex = 0; roundIndex < numRounds; roundIndex++) {
      let xPos;
      if (side === 'right') {
        // Right side: R4 at startX, then R3 overlaps R4, R2 no overlap, R1 no overlap
        if (roundIndex === 3) xPos = startX;
        else if (roundIndex === 2) xPos = startX + overlapOffset;
        else if (roundIndex === 1) xPos = startX + overlapOffset + matchBoxWidth + roundGap;
        else xPos = startX + overlapOffset + (matchBoxWidth + roundGap) * 2;
      } else {
        // Left side: R1 at startX, R2 no overlap, R3 no overlap, R4 overlaps R3
        if (roundIndex === 0) xPos = startX;
        else if (roundIndex === 1) xPos = startX + matchBoxWidth + roundGap;
        else if (roundIndex === 2) xPos = startX + (matchBoxWidth + roundGap) * 2;
        else xPos = startX + (matchBoxWidth + roundGap) * 2 + overlapOffset;
      }
      roundXPositions[roundIndex] = xPos;
    }

    // Draw connector lines first (so they appear behind match boxes)
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    const baseSpacing = matchBoxHeight + matchGap;

    // R1 → R2 connectors (1:1 mapping - each R1 match connects to corresponding R2 match)
    {
      const prevX = roundXPositions[0];
      const currX = roundXPositions[1];
      const prevSpacing = baseSpacing * spacingMultipliers[0];
      const currSpacing = baseSpacing * spacingMultipliers[1];

      for (let matchIndex = 0; matchIndex < 8; matchIndex++) {
        const srcY = startY + matchIndex * prevSpacing + (prevSpacing - matchBoxHeight) / 2 + matchBoxHeight / 2;
        const destY = startY + matchIndex * currSpacing + (currSpacing - matchBoxHeight) / 2 + matchBoxHeight / 2;

        if (side === 'right') {
          const srcEdge = prevX;
          const destEdge = currX + matchBoxWidth;
          ctx.beginPath();
          ctx.moveTo(srcEdge, srcY);
          ctx.lineTo(destEdge, destY);
          ctx.stroke();
        } else {
          const srcEdge = prevX + matchBoxWidth;
          const destEdge = currX;
          ctx.beginPath();
          ctx.moveTo(srcEdge, srcY);
          ctx.lineTo(destEdge, destY);
          ctx.stroke();
        }
      }
    }

    // R2 → R3 and R3 → R4 connectors (2:1 mapping)
    for (let roundIndex = 2; roundIndex < numRounds; roundIndex++) {
      const prevRoundIndex = roundIndex - 1;
      const prevSpacing = baseSpacing * spacingMultipliers[prevRoundIndex];
      const currSpacing = baseSpacing * spacingMultipliers[roundIndex];

      const prevX = roundXPositions[prevRoundIndex];
      const currX = roundXPositions[roundIndex];

      const numMatchesInRound = section.rounds[roundIndex].length;

      for (let matchIndex = 0; matchIndex < numMatchesInRound; matchIndex++) {
        // Two source matches feed into one destination match
        const srcMatch1Index = matchIndex * 2;
        const srcMatch2Index = matchIndex * 2 + 1;

        const srcY1 = startY + srcMatch1Index * prevSpacing + (prevSpacing - matchBoxHeight) / 2 + matchBoxHeight / 2;
        const srcY2 = startY + srcMatch2Index * prevSpacing + (prevSpacing - matchBoxHeight) / 2 + matchBoxHeight / 2;
        const destY = startY + matchIndex * currSpacing + (currSpacing - matchBoxHeight) / 2 + matchBoxHeight / 2;

        if (side === 'right') {
          const srcEdge = prevX;
          const destEdge = currX + matchBoxWidth;
          const midX = (srcEdge + destEdge) / 2;

          ctx.beginPath();
          ctx.moveTo(srcEdge, srcY1);
          ctx.lineTo(midX, srcY1);
          ctx.lineTo(midX, srcY2);
          ctx.moveTo(srcEdge, srcY2);
          ctx.lineTo(midX, srcY2);
          ctx.moveTo(midX, destY);
          ctx.lineTo(destEdge, destY);
          ctx.moveTo(midX, srcY1);
          ctx.lineTo(midX, srcY2);
          ctx.stroke();
        } else {
          const srcEdge = prevX + matchBoxWidth;
          const destEdge = currX;
          const midX = (srcEdge + destEdge) / 2;

          ctx.beginPath();
          ctx.moveTo(srcEdge, srcY1);
          ctx.lineTo(midX, srcY1);
          ctx.moveTo(srcEdge, srcY2);
          ctx.lineTo(midX, srcY2);
          ctx.moveTo(midX, srcY1);
          ctx.lineTo(midX, srcY2);
          ctx.moveTo(midX, destY);
          ctx.lineTo(destEdge, destY);
          ctx.stroke();
        }
      }
    }

    // Draw match boxes on top of connector lines
    section.rounds.forEach((round, roundIndex) => {
      const xPos = roundXPositions[roundIndex];
      const spacing = baseSpacing * spacingMultipliers[roundIndex];

      round.forEach((match, matchIndex) => {
        const yPos = startY + matchIndex * spacing + (spacing - matchBoxHeight) / 2;
        drawMatchToCanvas(ctx, xPos, yPos, match, matchBoxWidth, matchBoxHeight, flagCache);
      });
    });
  }

  // Draw a 56-player section bracket to canvas
  // R1 M0 → R2 M0 (bye), R1 M1/M2 → R2 M1, R1 M3/M4 → R2 M2, R1 M5 → R2 M3 (bye)
  function draw56SectionToCanvas(ctx, startX, startY, section, sectionIndex, side, flagCache = {}) {
    if (!section) return;

    const matchBoxWidth = 135;
    const matchBoxHeight = 44;
    const roundGap = 25;
    const matchGap = 8;
    const numRounds = section.rounds.length; // Should be 3

    // For 56-player: R1 has 6 matches, R2 has 4 matches, R3 has 2 matches
    const baseSpacing = matchBoxHeight + matchGap;

    // Pre-calculate X positions for all rounds (no overlap)
    const roundXPositions = [];
    for (let roundIndex = 0; roundIndex < numRounds; roundIndex++) {
      let xPos;
      if (side === 'right') {
        // Right side: R3 at startX, R2 with gap, R1 with gap
        if (roundIndex === 2) xPos = startX;
        else if (roundIndex === 1) xPos = startX + matchBoxWidth + roundGap;
        else xPos = startX + (matchBoxWidth + roundGap) * 2;
      } else {
        // Left side: R1 at startX, R2 with gap, R3 with gap
        if (roundIndex === 0) xPos = startX;
        else if (roundIndex === 1) xPos = startX + matchBoxWidth + roundGap;
        else xPos = startX + (matchBoxWidth + roundGap) * 2;
      }
      roundXPositions[roundIndex] = xPos;
    }

    // Calculate Y center positions for each match
    // R1: 6 matches with even spacing
    const r1Spacing = baseSpacing;
    const r1Centers = [];
    for (let i = 0; i < 6; i++) {
      r1Centers[i] = startY + i * r1Spacing + r1Spacing / 2;
    }

    // R2: 4 matches, positioned to align with feeding R1 matches
    // R2 M0 aligns with R1 M0 (bye)
    // R2 M1 centered between R1 M1 and R1 M2
    // R2 M2 centered between R1 M3 and R1 M4
    // R2 M3 aligns with R1 M5 (bye)
    const r2Centers = [
      r1Centers[0],                           // R2 M0 = R1 M0
      (r1Centers[1] + r1Centers[2]) / 2,      // R2 M1 = midpoint of R1 M1 & M2
      (r1Centers[3] + r1Centers[4]) / 2,      // R2 M2 = midpoint of R1 M3 & M4
      r1Centers[5]                            // R2 M3 = R1 M5
    ];

    // R3: 2 matches, centered between feeding R2 matches
    const r3Centers = [
      (r2Centers[0] + r2Centers[1]) / 2,      // R3 M0 = midpoint of R2 M0 & M1
      (r2Centers[2] + r2Centers[3]) / 2       // R3 M1 = midpoint of R2 M2 & M3
    ];

    // Draw connector lines first
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    const r1X = roundXPositions[0];
    const r2X = roundXPositions[1];
    const r3X = roundXPositions[2];

    // R1 M0 → R2 M0 (1:1 bye)
    {
      const srcEdge = side === 'right' ? r1X : r1X + matchBoxWidth;
      const destEdge = side === 'right' ? r2X + matchBoxWidth : r2X;
      ctx.beginPath();
      ctx.moveTo(srcEdge, r1Centers[0]);
      ctx.lineTo(destEdge, r2Centers[0]);
      ctx.stroke();
    }

    // R1 M1 + R1 M2 → R2 M1 (2:1)
    {
      const srcEdge = side === 'right' ? r1X : r1X + matchBoxWidth;
      const destEdge = side === 'right' ? r2X + matchBoxWidth : r2X;
      const midX = (srcEdge + destEdge) / 2;

      ctx.beginPath();
      ctx.moveTo(srcEdge, r1Centers[1]);
      ctx.lineTo(midX, r1Centers[1]);
      ctx.moveTo(srcEdge, r1Centers[2]);
      ctx.lineTo(midX, r1Centers[2]);
      ctx.moveTo(midX, r1Centers[1]);
      ctx.lineTo(midX, r1Centers[2]);
      ctx.moveTo(midX, r2Centers[1]);
      ctx.lineTo(destEdge, r2Centers[1]);
      ctx.stroke();
    }

    // R1 M3 + R1 M4 → R2 M2 (2:1)
    {
      const srcEdge = side === 'right' ? r1X : r1X + matchBoxWidth;
      const destEdge = side === 'right' ? r2X + matchBoxWidth : r2X;
      const midX = (srcEdge + destEdge) / 2;

      ctx.beginPath();
      ctx.moveTo(srcEdge, r1Centers[3]);
      ctx.lineTo(midX, r1Centers[3]);
      ctx.moveTo(srcEdge, r1Centers[4]);
      ctx.lineTo(midX, r1Centers[4]);
      ctx.moveTo(midX, r1Centers[3]);
      ctx.lineTo(midX, r1Centers[4]);
      ctx.moveTo(midX, r2Centers[2]);
      ctx.lineTo(destEdge, r2Centers[2]);
      ctx.stroke();
    }

    // R1 M5 → R2 M3 (1:1 bye)
    {
      const srcEdge = side === 'right' ? r1X : r1X + matchBoxWidth;
      const destEdge = side === 'right' ? r2X + matchBoxWidth : r2X;
      ctx.beginPath();
      ctx.moveTo(srcEdge, r1Centers[5]);
      ctx.lineTo(destEdge, r2Centers[3]);
      ctx.stroke();
    }

    // R2 → R3 connectors (2:1)
    for (let i = 0; i < 2; i++) {
      const srcY1 = r2Centers[i * 2];
      const srcY2 = r2Centers[i * 2 + 1];
      const destY = r3Centers[i];

      const srcEdge = side === 'right' ? r2X : r2X + matchBoxWidth;
      const destEdge = side === 'right' ? r3X + matchBoxWidth : r3X;
      const midX = (srcEdge + destEdge) / 2;

      ctx.beginPath();
      ctx.moveTo(srcEdge, srcY1);
      ctx.lineTo(midX, srcY1);
      ctx.moveTo(srcEdge, srcY2);
      ctx.lineTo(midX, srcY2);
      ctx.moveTo(midX, srcY1);
      ctx.lineTo(midX, srcY2);
      ctx.moveTo(midX, destY);
      ctx.lineTo(destEdge, destY);
      ctx.stroke();
    }

    // Draw match boxes
    // R1: 6 matches
    const r1Round = section.rounds[0] || [];
    r1Round.forEach((match, i) => {
      const yPos = r1Centers[i] - matchBoxHeight / 2;
      drawMatchToCanvas(ctx, r1X, yPos, match, matchBoxWidth, matchBoxHeight, flagCache);
    });

    // R2: 4 matches
    const r2Round = section.rounds[1] || [];
    r2Round.forEach((match, i) => {
      const yPos = r2Centers[i] - matchBoxHeight / 2;
      drawMatchToCanvas(ctx, r2X, yPos, match, matchBoxWidth, matchBoxHeight, flagCache);
    });

    // R3: 2 matches
    const r3Round = section.rounds[2] || [];
    r3Round.forEach((match, i) => {
      const yPos = r3Centers[i] - matchBoxHeight / 2;
      drawMatchToCanvas(ctx, r3X, yPos, match, matchBoxWidth, matchBoxHeight, flagCache);
    });
  }

  // Draw a section bracket to canvas
  function drawSectionToCanvas(ctx, startX, startY, section, sectionIndex, side, flagCache = {}) {
    if (!section) return;

    const matchBoxWidth = 135; // Reduced by 25% from 180
    const matchBoxHeight = 44;
    const roundGap = 25;
    const matchGap = 8;
    const numRounds = section.rounds.length;

    // Calculate positions for each round (Round 3 overlaps Round 2, Round 4 overlaps Round 3)
    const overlap = matchBoxWidth * 0.35;
    const overlapOffset = matchBoxWidth - overlap; // Distance when overlapping

    // Pre-calculate X positions for all rounds
    const roundXPositions = [];
    for (let roundIndex = 0; roundIndex < numRounds; roundIndex++) {
      let xPos;
      if (side === 'right') {
        if (roundIndex === 3) xPos = startX;
        else if (roundIndex === 2) xPos = startX + overlapOffset;
        else if (roundIndex === 1) xPos = startX + overlapOffset * 2;
        else xPos = startX + overlapOffset * 2 + matchBoxWidth + roundGap;
      } else {
        if (roundIndex === 0) xPos = startX;
        else if (roundIndex === 1) xPos = startX + matchBoxWidth + roundGap;
        else if (roundIndex === 2) xPos = startX + matchBoxWidth + roundGap + overlapOffset;
        else xPos = startX + matchBoxWidth + roundGap + overlapOffset * 2;
      }
      roundXPositions[roundIndex] = xPos;
    }

    // Draw connector lines first (so they appear behind match boxes)
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    for (let roundIndex = 1; roundIndex < numRounds; roundIndex++) {
      const prevRoundIndex = roundIndex - 1;
      const prevSpacing = Math.pow(2, prevRoundIndex) * (matchBoxHeight + matchGap);
      const currSpacing = Math.pow(2, roundIndex) * (matchBoxHeight + matchGap);

      const prevX = roundXPositions[prevRoundIndex];
      const currX = roundXPositions[roundIndex];

      const numMatchesInRound = section.rounds[roundIndex].length;

      for (let matchIndex = 0; matchIndex < numMatchesInRound; matchIndex++) {
        // Two source matches feed into one destination match
        const srcMatch1Index = matchIndex * 2;
        const srcMatch2Index = matchIndex * 2 + 1;

        const srcY1 = startY + srcMatch1Index * prevSpacing + (prevSpacing - matchBoxHeight) / 2 + matchBoxHeight / 2;
        const srcY2 = startY + srcMatch2Index * prevSpacing + (prevSpacing - matchBoxHeight) / 2 + matchBoxHeight / 2;
        const destY = startY + matchIndex * currSpacing + (currSpacing - matchBoxHeight) / 2 + matchBoxHeight / 2;

        if (side === 'right') {
          // Right side: lines go from right edge of current round to left edge of previous round
          const srcX = prevX; // Left edge of source (which is visually to the right)
          const destX = currX + matchBoxWidth; // Right edge of destination
          const midX = (srcX + destX) / 2;

          ctx.beginPath();
          // Line from source match 1 to midpoint
          ctx.moveTo(srcX, srcY1);
          ctx.lineTo(midX, srcY1);
          // Vertical line connecting both sources
          ctx.lineTo(midX, srcY2);
          // Line from source match 2 to midpoint
          ctx.moveTo(srcX, srcY2);
          ctx.lineTo(midX, srcY2);
          // Line from midpoint to destination
          ctx.moveTo(midX, destY);
          ctx.lineTo(destX, destY);
          // Vertical connector at midpoint
          ctx.moveTo(midX, srcY1);
          ctx.lineTo(midX, srcY2);
          ctx.stroke();
        } else {
          // Left side: lines go from right edge of previous round to left edge of current round
          const srcX = prevX + matchBoxWidth; // Right edge of source
          const destX = currX; // Left edge of destination
          const midX = (srcX + destX) / 2;

          ctx.beginPath();
          // Line from source match 1 to midpoint
          ctx.moveTo(srcX, srcY1);
          ctx.lineTo(midX, srcY1);
          // Line from source match 2 to midpoint
          ctx.moveTo(srcX, srcY2);
          ctx.lineTo(midX, srcY2);
          // Vertical line at midpoint
          ctx.moveTo(midX, srcY1);
          ctx.lineTo(midX, srcY2);
          // Line from midpoint to destination
          ctx.moveTo(midX, destY);
          ctx.lineTo(destX, destY);
          ctx.stroke();
        }
      }
    }

    // Draw match boxes on top of connector lines
    section.rounds.forEach((round, roundIndex) => {
      const xPos = roundXPositions[roundIndex];
      const spacing = Math.pow(2, roundIndex) * (matchBoxHeight + matchGap);

      round.forEach((match, matchIndex) => {
        const yPos = startY + matchIndex * spacing + (spacing - matchBoxHeight) / 2;
        drawMatchToCanvas(ctx, xPos, yPos, match, matchBoxWidth, matchBoxHeight, flagCache);
      });
    });
  }

  // Draw a single match box to canvas
  function drawMatchToCanvas(ctx, x, y, match, width, height, flagCache = {}) {
    const playerHeight = height / 2;

    // Match box background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);

    // Border
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Middle divider
    ctx.beginPath();
    ctx.moveTo(x, y + playerHeight);
    ctx.lineTo(x + width, y + playerHeight);
    ctx.stroke();

    // Player 1
    drawPlayerToCanvas(ctx, x, y, width, playerHeight, match.player1, match.winner?.id === match.player1?.id, flagCache);

    // Player 2
    drawPlayerToCanvas(ctx, x, y + playerHeight, width, playerHeight, match.player2, match.winner?.id === match.player2?.id, flagCache);
  }

  // Draw a player row to canvas
  function drawPlayerToCanvas(ctx, x, y, width, height, player, isWinner, flagCache = {}) {
    if (isWinner) {
      ctx.fillStyle = 'rgba(0, 80, 160, 0.1)';
      ctx.fillRect(x, y, width, height);
    }

    // Draw flag if available
    const flagWidth = 20;
    const flagHeight = 14;
    let textOffset = 5;

    if (player?.country && flagCache[player.country]) {
      const flagImg = flagCache[player.country];
      const flagX = x + 3;
      const flagY = y + (height - flagHeight) / 2;
      ctx.drawImage(flagImg, flagX, flagY, flagWidth, flagHeight);
      textOffset = flagWidth + 6;
    }

    ctx.fillStyle = isWinner ? '#0050A0' : '#333333';
    ctx.font = isWinner ? 'bold 11px Roboto, sans-serif' : '11px Roboto, sans-serif';

    const name = player ? formatPlayerName(player) : 'TBD';
    ctx.fillText(name, x + textOffset, y + height / 2 + 4, width - textOffset - 5);
  }

  // Draw finals bracket to canvas
  function drawFinalsToCanvas(ctx, startX, startY, width, sectionHeight, matchBoxWidth, matchBoxHeight, overlap, flagCache = {}) {
    // QF overlap: both sides 35%
    const qfOverlap = matchBoxWidth * 0.35;

    // QF X positions
    const qfLeftX = startX - (qfOverlap - overlap); // Left QFs overlap 35% into left sections' R4
    const qfRightX = startX + width - matchBoxWidth + qfOverlap + overlap; // Right QFs overlap 35% into right sections' R4

    // Center X position for SF and Final - centered between left and right QFs
    const trueCenterX = (qfLeftX + qfRightX + matchBoxWidth) / 2;
    const centerX = trueCenterX - matchBoxWidth / 2; // Left edge of SF boxes

    // QF Y positions - depends on tournament size
    let topQfY, bottomQfY;
    if (state.sectionCount === 8) {
      // 128 players: QFs between section pairs (positions 0&1, 2&3)
      topQfY = startY + sectionHeight * 1 - matchBoxHeight / 2;    // Between positions 0 & 1
      bottomQfY = startY + sectionHeight * 3 - matchBoxHeight / 2; // Between positions 2 & 3
    } else {
      // 96 players: QFs centered on each section (2 per side)
      // QF0 & QF1 on left (sections 0 & 1), QF2 & QF3 on right (sections 2 & 3)
      topQfY = startY + sectionHeight * 0.5 - matchBoxHeight / 2;  // Centered on position 0
      bottomQfY = startY + sectionHeight * 1.5 - matchBoxHeight / 2; // Centered on position 1
    }

    // Draw quarterfinals - QF0 & QF2 on left, QF1 & QF3 on right (same for 128 and 96)
    drawMatchToCanvas(ctx, qfLeftX, topQfY, state.finals.quarterFinals[0], matchBoxWidth, matchBoxHeight, flagCache);    // QF1 - left top
    drawMatchToCanvas(ctx, qfRightX, topQfY, state.finals.quarterFinals[1], matchBoxWidth, matchBoxHeight, flagCache);   // QF2 - right top
    drawMatchToCanvas(ctx, qfLeftX, bottomQfY, state.finals.quarterFinals[2], matchBoxWidth, matchBoxHeight, flagCache); // QF3 - left bottom
    drawMatchToCanvas(ctx, qfRightX, bottomQfY, state.finals.quarterFinals[3], matchBoxWidth, matchBoxHeight, flagCache); // QF4 - right bottom

    // SF, Final, Champion positions - vertically stacked in center
    const centerY = (topQfY + bottomQfY) / 2; // Center point between top and bottom QFs

    // Larger boxes for Final and Champion (50% bigger)
    const largeBoxWidth = matchBoxWidth * 1.5;
    const largeBoxHeight = matchBoxHeight * 1.5;

    const boxSpacing = largeBoxHeight + 15; // Spacing between boxes

    const sf1Y = centerY - boxSpacing * 1.5;    // SF1 at top
    const finalY = centerY - boxSpacing * 0.5;  // Final below SF1
    const champY = centerY + boxSpacing * 0.5;  // Champion below Final
    const sf2Y = centerY + boxSpacing * 1.5;    // SF2 at bottom

    // Adjust X positions for larger boxes to keep centered
    const largeBoxX = centerX - (largeBoxWidth - matchBoxWidth) / 2;

    // Draw connector lines for finals
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;

    const qfTopCenterY = topQfY + matchBoxHeight / 2;
    const qfBottomCenterY = bottomQfY + matchBoxHeight / 2;
    const sf1CenterY = sf1Y + matchBoxHeight / 2;
    const sf2CenterY = sf2Y + matchBoxHeight / 2;

    // Center X for meeting point
    const meetingX = centerX + matchBoxWidth / 2;

    // Top QFs (left & right) → SF1, Bottom QFs (left & right) → SF2 (same for 128 and 96)
    // QF1 (left top) to center
    ctx.beginPath();
    ctx.moveTo(qfLeftX + matchBoxWidth, qfTopCenterY);
    ctx.lineTo(meetingX, qfTopCenterY);
    ctx.stroke();

    // QF2 (right top) to center
    ctx.beginPath();
    ctx.moveTo(qfRightX, qfTopCenterY);
    ctx.lineTo(meetingX, qfTopCenterY);
    ctx.stroke();

    // Vertical line from QF1/QF2 meeting point up to SF1
    ctx.beginPath();
    ctx.moveTo(meetingX, qfTopCenterY);
    ctx.lineTo(meetingX, sf1Y + matchBoxHeight);
    ctx.stroke();

    // QF3 (left bottom) to center
    ctx.beginPath();
    ctx.moveTo(qfLeftX + matchBoxWidth, qfBottomCenterY);
    ctx.lineTo(meetingX, qfBottomCenterY);
    ctx.stroke();

    // QF4 (right bottom) to center
    ctx.beginPath();
    ctx.moveTo(qfRightX, qfBottomCenterY);
    ctx.lineTo(meetingX, qfBottomCenterY);
    ctx.stroke();

    // Vertical line from QF3/QF4 meeting point down to SF2
    ctx.beginPath();
    ctx.moveTo(meetingX, qfBottomCenterY);
    ctx.lineTo(meetingX, sf2Y);
    ctx.stroke();

    // Round 4 to QF connector lines
    // Lines go straight up/down from 75% along the R4 box (toward center)

    // R4 box positions (based on QF overlap)
    const leftR4StartX = qfLeftX + qfOverlap - matchBoxWidth; // Left edge of left R4
    const rightR4StartX = qfRightX + matchBoxWidth - qfOverlap; // Left edge of right R4

    // Vertical line X positions 20% inside the R4 box (from edge closest to center)
    const leftLineX = leftR4StartX + matchBoxWidth * 0.80; // 80% across left R4
    const rightLineX = rightR4StartX + matchBoxWidth * 0.20; // 20% across right R4

    // R4 box Y positions (top and bottom edges)
    // R4 box is vertically centered within each section
    const r4BoxOffset = (sectionHeight - matchBoxHeight) / 2;

    // Section 1 (position 0) - R4 bottom edge (line goes down to QF1 top)
    const r4Section1Bottom = startY + 0 * sectionHeight + r4BoxOffset + matchBoxHeight;
    // Section 2 (position 1) - R4 top edge (line goes up to QF1 bottom)
    const r4Section2Top = startY + 1 * sectionHeight + r4BoxOffset;
    // Section 5 (position 2) - R4 bottom edge (line goes down to QF3 top)
    const r4Section5Bottom = startY + 2 * sectionHeight + r4BoxOffset + matchBoxHeight;
    // Section 6 (position 3) - R4 top edge (line goes up to QF3 bottom)
    const r4Section6Top = startY + 3 * sectionHeight + r4BoxOffset;

    // Right side uses same positions
    const r4Section3Bottom = r4Section1Bottom;
    const r4Section4Top = r4Section2Top;
    const r4Section7Bottom = r4Section5Bottom;
    const r4Section8Top = r4Section6Top;

    // Left side R4 to QF1 (top) - vertical lines from R4 edges
    ctx.beginPath();
    ctx.moveTo(leftLineX, r4Section1Bottom);
    ctx.lineTo(leftLineX, topQfY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftLineX, r4Section2Top);
    ctx.lineTo(leftLineX, topQfY + matchBoxHeight);
    ctx.stroke();

    // Right side R4 to QF2 (top) - vertical lines from R4 edges
    ctx.beginPath();
    ctx.moveTo(rightLineX, r4Section3Bottom);
    ctx.lineTo(rightLineX, topQfY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightLineX, r4Section4Top);
    ctx.lineTo(rightLineX, topQfY + matchBoxHeight);
    ctx.stroke();

    // Left side R4 to QF3 (bottom) - vertical lines from R4 edges
    ctx.beginPath();
    ctx.moveTo(leftLineX, r4Section5Bottom);
    ctx.lineTo(leftLineX, bottomQfY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftLineX, r4Section6Top);
    ctx.lineTo(leftLineX, bottomQfY + matchBoxHeight);
    ctx.stroke();

    // Right side R4 to QF4 (bottom) - vertical lines from R4 edges
    ctx.beginPath();
    ctx.moveTo(rightLineX, r4Section7Bottom);
    ctx.lineTo(rightLineX, bottomQfY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightLineX, r4Section8Top);
    ctx.lineTo(rightLineX, bottomQfY + matchBoxHeight);
    ctx.stroke();

    // Draw SF1 with centered text
    drawCenteredMatchBox(ctx, centerX, sf1Y, matchBoxWidth, matchBoxHeight, state.finals.semiFinals[0], flagCache);

    // Draw Final with centered text (50% larger, with bigger font)
    drawCenteredMatchBox(ctx, largeBoxX, finalY, largeBoxWidth, largeBoxHeight, state.finals.final, flagCache, true);

    // Draw SF2 with centered text
    drawCenteredMatchBox(ctx, centerX, sf2Y, matchBoxWidth, matchBoxHeight, state.finals.semiFinals[1], flagCache);

    // Connector lines from SFs to Final
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    const finalCenterX = largeBoxX + largeBoxWidth / 2;

    // SF1 to Final (from bottom of SF1 to top of Final)
    ctx.beginPath();
    ctx.moveTo(centerX + matchBoxWidth / 2, sf1Y + matchBoxHeight);
    ctx.lineTo(finalCenterX, finalY);
    ctx.stroke();

    // SF2 to Final (from top of SF2 to bottom of Final)
    ctx.beginPath();
    ctx.moveTo(centerX + matchBoxWidth / 2, sf2Y);
    ctx.lineTo(finalCenterX, finalY + largeBoxHeight);
    ctx.stroke();

    // Champion box - positioned below blue header bar, slightly taller
    const champBoxHeight = largeBoxHeight * 1.2; // 20% taller to fit flag
    const headerBottom = 60;
    const champBoxY = headerBottom + 10; // Just below header

    ctx.fillStyle = '#ffd700';
    ctx.fillRect(largeBoxX, champBoxY, largeBoxWidth, champBoxHeight);
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;
    ctx.strokeRect(largeBoxX, champBoxY, largeBoxWidth, champBoxHeight);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px Roboto, sans-serif';
    ctx.fillText('CHAMPION', largeBoxX + largeBoxWidth / 2, champBoxY + 18);

    // Draw champion name
    const champName3 = state.champion ? state.champion.name : 'TBD';
    ctx.font = 'bold 18px Roboto, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(champName3, largeBoxX + largeBoxWidth / 2, champBoxY + 42);

    // Draw champion's flag centered below name
    if (state.champion?.country && flagCache[state.champion.country]) {
      const flagImg = flagCache[state.champion.country];
      const flagWidth = 28;
      const flagHeight = 20;
      const flagX = largeBoxX + (largeBoxWidth - flagWidth) / 2;
      const flagY = champBoxY + 50;
      ctx.drawImage(flagImg, flagX, flagY, flagWidth, flagHeight);
    }
    ctx.textAlign = 'left'; // Reset
  }

  // Draw a match box with centered text and flags
  function drawCenteredMatchBox(ctx, x, y, width, height, match, flagCache = {}, largeFont = false) {
    const playerHeight = height / 2;
    const flagWidth = largeFont ? 26 : 20;
    const flagHeight = largeFont ? 18 : 14;
    const flagGap = 4;
    const fontSize = largeFont ? 14 : 11;

    // Match box background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);

    // Border
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Middle divider
    ctx.beginPath();
    ctx.moveTo(x, y + playerHeight);
    ctx.lineTo(x + width, y + playerHeight);
    ctx.stroke();

    // Player 1 (centered with flag)
    const p1Winner = match?.winner?.id === match?.player1?.id;
    if (p1Winner) {
      ctx.fillStyle = 'rgba(0, 80, 160, 0.1)';
      ctx.fillRect(x, y, width, playerHeight);
    }
    ctx.fillStyle = p1Winner ? '#0050A0' : '#333333';
    ctx.font = p1Winner ? `bold ${fontSize}px Roboto, sans-serif` : `${fontSize}px Roboto, sans-serif`;
    const p1Name = match?.player1 ? formatPlayerName(match.player1) : 'TBD';
    const p1HasFlag = match?.player1?.country && flagCache[match.player1.country];
    const p1TextWidth = ctx.measureText(p1Name).width;
    const p1TotalWidth = p1HasFlag ? flagWidth + flagGap + p1TextWidth : p1TextWidth;
    const p1StartX = x + (width - p1TotalWidth) / 2;

    if (p1HasFlag) {
      ctx.drawImage(flagCache[match.player1.country], p1StartX, y + (playerHeight - flagHeight) / 2, flagWidth, flagHeight);
      ctx.textAlign = 'left';
      ctx.fillText(p1Name, p1StartX + flagWidth + flagGap, y + playerHeight / 2 + 4);
    } else {
      ctx.textAlign = 'center';
      ctx.fillText(p1Name, x + width / 2, y + playerHeight / 2 + 4);
    }

    // Player 2 (centered with flag)
    const p2Winner = match?.winner?.id === match?.player2?.id;
    if (p2Winner) {
      ctx.fillStyle = 'rgba(0, 80, 160, 0.1)';
      ctx.fillRect(x, y + playerHeight, width, playerHeight);
    }
    ctx.fillStyle = p2Winner ? '#0050A0' : '#333333';
    ctx.font = p2Winner ? `bold ${fontSize}px Roboto, sans-serif` : `${fontSize}px Roboto, sans-serif`;
    const p2Name = match?.player2 ? formatPlayerName(match.player2) : 'TBD';
    const p2HasFlag = match?.player2?.country && flagCache[match.player2.country];
    const p2TextWidth = ctx.measureText(p2Name).width;
    const p2TotalWidth = p2HasFlag ? flagWidth + flagGap + p2TextWidth : p2TextWidth;
    const p2StartX = x + (width - p2TotalWidth) / 2;

    if (p2HasFlag) {
      ctx.drawImage(flagCache[match.player2.country], p2StartX, y + playerHeight + (playerHeight - flagHeight) / 2, flagWidth, flagHeight);
      ctx.textAlign = 'left';
      ctx.fillText(p2Name, p2StartX + flagWidth + flagGap, y + playerHeight + playerHeight / 2 + 4);
    } else {
      ctx.textAlign = 'center';
      ctx.fillText(p2Name, x + width / 2, y + playerHeight + playerHeight / 2 + 4);
    }

    ctx.textAlign = 'left'; // Reset
  }

  // Toggle Navigation
  function toggleNav() {
    const isExpanded = elements.navToggle?.getAttribute('aria-expanded') === 'true';
    elements.navToggle?.setAttribute('aria-expanded', !isExpanded);
    elements.navMenu?.classList.toggle('active');
  }

  // Show Seeds Modal
  function showSeedsModal() {
    // Get all seeded players and sort by seed
    const seededPlayers = state.players
      .filter(p => p.seed !== null)
      .sort((a, b) => a.seed - b.seed);

    // Build the seeds list HTML
    let html = '<div class="seeds-grid">';
    seededPlayers.forEach(player => {
      const flagUrl = TournamentData.getFlagUrl(player.country);
      const flagHtml = player.country ?
        `<img src="${flagUrl}" alt="${player.country}" class="seed-flag" onerror="this.style.display='none'">` : '';
      // Calculate section (1-8) based on player id
      const section = Math.ceil(player.id / 16);
      html += `
              <div class="seed-item">
                  <span class="seed-number">${player.seed}</span>
                  ${flagHtml}
                  <span class="seed-name">${player.name}</span>
                  <span class="seed-section">Section ${section}</span>
              </div>
          `;
    });
    html += '</div>';

    elements.seedsList.innerHTML = html;
    elements.seedsModal.classList.add('active');
    elements.seedsModal.setAttribute('aria-hidden', 'false');
  }

  // Close Seeds Modal
  function closeSeedsModal() {
    elements.seedsModal.classList.remove('active');
    elements.seedsModal.setAttribute('aria-hidden', 'true');
  }

  // Show Download Modal
  function showDownloadModal() {
    elements.downloadModal.classList.add('active');
    elements.downloadModal.setAttribute('aria-hidden', 'false');
  }

  // Close Download Modal
  function closeDownloadModal() {
    elements.downloadModal.classList.remove('active');
    elements.downloadModal.setAttribute('aria-hidden', 'true');
  }

  // Show/Hide Loading
  function showLoading(show) {
    if (elements.loadingOverlay) {
      elements.loadingOverlay.classList.toggle('active', show);
      elements.loadingOverlay.setAttribute('aria-hidden', !show);
    }
  }

  // Show Toast
  function showToast(message, duration = 3000) {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
          background: var(--color-text);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: var(--border-radius);
          margin-top: 0.5rem;
          animation: slideIn 0.3s ease;
      `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
