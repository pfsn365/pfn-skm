if (!trackGAEventForPage) {
  trackGAEventForPage = function (eventName, eventParams) {
    eventParams = eventParams || {};
    trackGAEvent(eventName, Object.assign(eventParams, {
      "tool": "free_agency_simulator",
    }));
  };
}

trackGAEventForPage("page_view");

// Store original player states for undo functionality
const originalPlayerStates = new Map();

let players;
let teams;
let teamLogos = {};
let resultPlayers = [];

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

var overlay = document.createElement("div");
addClass(overlay, "loading-overlay");
var loadingText = document.createElement("span");
addClass(loadingText, "overlay-loading-text");
loadingText.innerHTML = "Loading...";
overlay.appendChild(loadingText);
document.body.appendChild(overlay);

let dataFetched = [];


getPlayersData()
  .then(processedData => {
    const encodedData = JSON.stringify(processedData);
    players = JSON.parse(encodedData);
    // Initialize original states
    players.forEach(player => {
      originalPlayerStates.set(player.id, { ...player });
    });
    dataFetched.push("players");
    if (dataFetched.length === 2) {
      overlay.remove();
    }
  })
  .catch(error => {
    console.error("Error processing players data:", error);
    alert("Something went wrong! Please reload the page and try again.");
  });

getTeamsData()
  .then(processedData => {
    const encodedData = JSON.stringify(processedData);
    teams = JSON.parse(encodedData);
    teamLogos = teams.reduce((acc, team) => {
      acc[team.id] = team.logo + "?" + logoCacheBuster;
      return acc;
    }, {});
    // Initialize original states
    renderTeamGrid();
    dataFetched.push("teams");
    if (dataFetched.length === 2) {
      overlay.remove();
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
function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
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
    continueBtn.removeAttribute("disabled");
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
function selectTeam() {
  const continueBtn = document.querySelector(".continue-btn");
  const buttonExistsAndNotDisabled = continueBtn && !continueBtn.disabled && !continueBtn.classList.contains("disabled");

  if (!(buttonExistsAndNotDisabled && selectedTeamID)) return;
  
  showScreen('screen2');
  findAndAssignSelectedTeamByID(selectedTeamID);
  trackGAEventForPage("team_selection_click", {
    team: selectedTeamID,
  });

  goToStep(2);
  renderTeamLogo(2);
  updateCapSummary();
  renderPlayerTable();
  window.scrollTo(0, 0);
}

function findAndAssignSelectedTeamByID(teamID) {
  teams.forEach(team => {
    if(team.id === teamID) {
      selectedTeam = team;
      return;
    }
  });
}

function navigateToMDS() {
  window.location.href = "https://www.profootballnetwork.com/mockdraft";
}

// Update restart function
function restartApp() {
  window.location.reload();
}

function cutPlayer(playerId) {
  const player = players.find(p => p.id === playerId);
  if (player) {
    if(player.status === 'cut') {
      // Player is being cut
      player.status = 'active';
      selectedTeam.activeCapHit += player.capHit;
      selectedTeam.deadMoney -= player.deadMoney;
      selectedTeam.capSpaceRemaining  -= player.capSavings;
      // Reduce team needs as this player is being un-cut
      selectedTeam.teamNeeds[player.position] -= 1;
      player.oldFreeAgentStatus = player.freeAgent;
      player.freeAgent = false;
    } else {
      // Player is being uncut
      player.status = 'cut';
      selectedTeam.activeCapHit -= player.capHit;
      selectedTeam.deadMoney += player.deadMoney;
      selectedTeam.capSpaceRemaining  += player.capSavings;
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
      team: selectedTeamID,
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
    return `
      <tr class="${isOwnTeam ? 'player-own' : ''}">
        <td class="name">${action.name}</td>
        <td class="center">${action.position}</td>
        <td class="center">
          <div class="team-data-container">
            <img 
              src="${teamLogos[action.team]}" 
              alt="${action.team}" 
              width="20"
              height="20"
            />
            ${action.team}
          </div>
        </td>
        <td class="center">${formatStatus(action.status)}</td>
        <td class="center">${formatMoney(getPlayerValue(action))}</td>
      </tr>
    `;
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
* @param {Array} teams - Array of team objects with cap information
* @param {Array} players - Array of player objects with cut/restructure probabilities
* @returns {Array} Array of processed players with updated statuses
*/
function processRosterChanges(teams, players, selectedTeamID) {
  const changedPlayers = [];
  
  teams.forEach(team => {
    if(team.id === selectedTeamID) {
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
  return moneyPerYear >= currentPlayer.perYearMinimum && years >= currentPlayer.minimumYears && ((percentGuaranteed * moneyPerYear) / 100) >= currentPlayer.guaranteedMinimum;
}

function makeReSigningOffer(e) {
  const player = currentPlayer;
  if(!player) {
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

  if(!isOfferWithinLimits(moneyPerYear, years)) {
    // Show error
    alert("This offer is in excess of your team's remaining cap space");
    return;
  }


  const isAccepted = isOfferAcceptable(moneyPerYear, years, percentGuaranteed);

  if (isAccepted) {
    trackGAEventForPage(event, {
      team: selectedTeamID,
      moneyPerYear,
      years,
      percentGuaranteed,
    });
    player.oldStatus = player.status; // Store old status for reference
    if(selectedTeamID !== player.team) {
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
  availableListRenderer.renderAvailableList(true); // applicable for the last screen, since we are calling the same function
}

function updateTeamNeeds() {
  const sortedKeys = Object.entries(selectedTeam.teamNeeds)
    .sort(([, valueA], [, valueB]) => valueB - valueA)
    .map(([key]) => key)
    .slice(0, 5);

  const teamNeedsHTML = sortedKeys.join(', ');
  document.querySelector("#teamNeeds").innerHTML = teamNeedsHTML;
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
  const grid = document.getElementById('teamGrid');
  grid.innerHTML = teams.map(team => `
    <div class="team-card" data-team="${team.id}" onclick="selectTeamIntent(event, '${team.id}')">
      <img src="${team.logo}?w=160&${logoCacheBuster}" alt="${team.name}" crossorigin="anonymous">
      <h3>${teamAbbreviations[team.name]}</h3>
    </div>
  `).join('');
}

function updateCapSummary() {
  const summaryHTML = `
    <div class="cap-item">
      <div class="cap-item-label">Salary Cap</div>
      <div class="cap-item-value">${formatMoney(selectedTeam.salaryCap)}</div>
    </div>
    <div class="cap-item">
      <div class="cap-item-label">Carryover</div>
      <div class="cap-item-value">${formatMoney(selectedTeam.carryOver)}</div>
    </div>
    <div class="cap-item">
      <div class="cap-item-label">${isDesktop ? "Reserved" : "Res."} for Draft Picks</div>
      <div class="cap-item-value">${formatMoney(selectedTeam.reservedForDraft)}</div>
    </div>
    <div class="cap-item">
      <div class="cap-item-label">Active Cap Hit</div>
      <div class="cap-item-value">${formatMoney(selectedTeam.activeCapHit)}</div>
    </div>
    <div class="cap-item">
      <div class="cap-item-label">Dead Money</div>
      <div class="cap-item-value">${formatMoney(selectedTeam.deadMoney)}</div>
    </div>
    <div class="cap-item">
      <div class="cap-item-label">Cap Space Rem.</div>
      <div class="cap-item-value">${formatMoney(selectedTeam.capSpaceRemaining)}</div>
    </div>
  `;

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
  const id = `#screen${screenNumber}`;
  const logo = selectedTeam.logo + "?" + logoCacheBuster;
  const imgEle = document.querySelector(`${id} .team-logo-container img`);
  const spanEle = document.querySelector(`${id} .team-logo-container span`);
  if (logo && imgEle && spanEle) {
    imgEle.src = logo;
    imgEle.alt = selectedTeam.id;
    spanEle.innerText = selectedTeam.teamCode;
  }
}

function renderPlayerTable() {
  // Only show players from the selected team for cut/restructure
  // TODO: Figure out sorting logic after a user has done cutting or resturcturing
  const teamPlayers = players
    .filter(p => p.team === selectedTeamID && (!p.freeAgent || p.status === "cut"))
    .sort((a, b) => {
      aCapHit = a.oldCapHit ? a.oldCapHit : a.capHit;
      bCapHit = b.oldCapHit ? b.oldCapHit : b.capHit;
      return bCapHit - aCapHit;
    });
  
  const table = document.getElementById('playerTable');
  table.innerHTML = teamPlayers.map(player => `
    <tr class="${player.status == 'cut' ? 'player-cut' : player.status == 'restructured' ? 'player-restructured' : '' }">
      <td class="name">${player.name}</td>
      <td class="position center">${player.position}</td>
      <td class="amount center">${player.status == 'cut' ? formatMoney(player.deadMoney) : player.status == 'restructured' ? formatMoney(player.capHit) : formatMoney(player.capHit)}</td>
      <td class="amount center">${formatMoney(player.deadMoney)}</td>
      <td class="amount center">${formatMoney(player.capSavings)}</td>
      <td class="amount restructure center">${formatMoney(player.restructureSavings)}</td>
      <td class="center sticky-cut">
        ${renderPlayerCutAction(player)}
      </td>
      <td class="center sticky-restructure">
        ${renderPlayerRestructureAction(player)}
      </td>
    </tr>
  `).join('');
}

function renderPlayerCutAction(player) {
  let buttonHTML = '';
  if (player.status === 'active') {
    buttonHTML = `
      <button class="button button-cut" onclick="cutPlayer(${player.id})">
        <img src="${crossIcon}" width="20" height="20" alt="cut icon" />
      </button>
    `;
    return buttonHTML;
  } else if (player.status === 'cut') {
    return `
      <button class="button button-undo" onclick="cutPlayer(${player.id})">
        <img src="${minusRedIcon}" width="20" height="20" alt="undo-cut icon" />
      </button>
    `;
  } else if (player.status === 'restructured') {
    return `
    `;
  }
}
function renderPlayerRestructureAction(player) {
  let buttonHTML = '';
  if (player.status === 'active') {
    if (player.restructurable) {
      buttonHTML = `
        <button class="button button-restructure" onclick="restructurePlayer(${player.id})">
          <img src="${plusIcon}" width="20" height="20" alt="restructure icon" />
        </button>
      `;
    }
    return buttonHTML;
  } else if (player.status === 'cut') {
    return `
        
    `;
  } else if (player.status === 'restructured') {
    return `
      <button class="button button-undo" onclick="restructurePlayer(${player.id})">
        <img src="${minusBlueIcon}" width="20" height="20" alt="undo-restructure icon" />
      </button>
    `;
  }
}
let currentOfferAcceptanceStatus = null;

function showResponseModal(accepted) {
  const responseModal = document.getElementById('responseModal');
  const responseIcon = document.getElementById('responseIcon');
  const responseMessage = document.getElementById('responseMessage');

  currentOfferAcceptanceStatus = accepted;

  responseIcon.src = accepted ? checkGreenOutlineIcon : crossRedOutlineIcon;
  responseIcon.className = `response-icon ${accepted ? 'accept' : 'reject'}`;
  
  responseMessage.textContent = accepted ? `Offer Accepted!` : `Offer Rejected`;
  responseMessage.className = `response-message ${accepted ? 'accept' : 'reject'}`;

  document.getElementById('restructureModal').style.display = 'none';
  responseModal.style.display = 'flex';

  setTimeout(() => {
    responseModal.style.display = 'none';
  }, 2000); // Close the modal after 2 seconds
}

function closeResponseModal() {
  document.getElementById('responseModal').style.display = 'none';

  if(!currentOfferAcceptanceStatus) {
    // Offer was rejected. Allow player to make another offer
    reSignPlayer(currentPlayer.id);
    return;
  }
    
  // Refresh the relevant table one more time to ensure it's up to date
  renderReSigningTable();
}

function formatStatus(status) {
  switch(status) {
    case 'restructured':
      return 'Restructured';  // For roster players who restructured
    case 'cut':
      return 'Cut';          // For roster players who were cut
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
  const playerStatusesToInclude = ["cut", "franchise", "signed", "re-signed"];
  const filteredPlayers = players.filter(p => (p.team === selectedTeamID && ((p.status !== "restructured" && p.freeAgent) || playerStatusesToInclude.includes(p.status))));
  
  document.getElementById('reSigningTable').innerHTML = filteredPlayers.map(player => `
    <tr>
      <td>${player.name}</td>
      <td>${player.position}</td>
      <td class="center">${formatMoney(player.transitionValue)}</td>
      <td class="center">${formatMoney(player.franchiseValue)}</td>
      ${renderReSigningActions(player)}
    </tr>
  `).join('');
}

let transitionOrFranchiseTagSelected = false;

function renderSigningActions(player) {
  return `
    <button class="sign-btn" onclick="reSignPlayer(${player.id})">Offer</button>
  `;
}

function renderReSigningActions(player) {
  // If player has been signed or tagged, show their status
  if (player.status === 'franchise') {
    return `
      <td class="center sticky-1"></td>
      <td class="center sticky-2"></td>
      <td class="center sticky-3">
        <button class="button button-undo" onclick="franchiseTagPlayer(${player.id})"><img src="${minusBlueIcon}" width="20" height="20" alt="minus icon" /></button>
      </td>
    `;
  }
  if (player.status === 'transition') {
    return `
      <td class="center sticky-1"></td>
      <td class="center sticky-2">
        <button class="button button-undo" onclick="transitionTagPlayer(${player.id})"><img src="${minusBlueIcon}" width="20" height="20" alt="minus icon" /></button>
      </td>
      <td class="sticky-3"></td>
    `;
  }
  if (player.status === 're-signed') {
    return `
      <td class="center sticky-1">
        <button class="button button-undo" onclick="reSignPlayer(${player.id})"><img src="${checkGreenIcon}" width="20" height="20" alt="check icon" /</button>
      </td>
      <td class="center sticky-2"></td>
      <td class="center sticky-3"></td>
    `;
  }
  if (['signed', 'transition', 'franchise'].includes(player.status)) {
    return formatStatus(player.status);
  }

  // Show action buttons for both available free agents and cut players
  return `
    <td class="center sticky-1"><button class="tag-button resign-button" onclick="reSignPlayer(${player.id}, 'resigning')"><img src="${plusIcon}" width="20" height="20" alt="plus icon" /></button></td>
    <td class="center sticky-2">${player.transitionTagEligible && !transitionOrFranchiseTagSelected ? `<button class="tag-button transition-button" onclick="transitionTagPlayer(${player.id})"><img src="${plusIcon}" width="20" height="20" alt="plus icon" /></button>` : ""}</td>
    <td class="center sticky-3">${player.franchiseTagEligible && !transitionOrFranchiseTagSelected ? `<button class="tag-button franchise-button" onclick="franchiseTagPlayer(${player.id})"><img src="${plusIcon}" width="20" height="20" alt="plus icon" /></button>` : ""}</td>
  `;
}

function reSignPlayer(playerId, source) {
  // if player is currently re-signed, this is an action to undo that.
  let player = players.find(p => p.id === playerId);
  if(!player) {
    return; // Invalid state
  }
  if(player.status === 're-signed') {
    // Player was re-signed and now the offer is being cancelled
    selectedTeam.activeCapHit -= player.newContract.capHit;
    selectedTeam.capSpaceRemaining += player.newContract.capHit;
    player.status = player.oldStatus;
    player.contractYears = null;
    player.oldFreeAgentStatus = player.freeAgent;
    player.freeAgent = true; // We're undoing the action of re-signing the player, so they'll revert back to a free agent
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

  if(player.status === 'transition') {
    // Undo transition
    transitionOrFranchiseTagSelected = false;
    player.status = player.oldStatus; // Preserve old status for the cases where user undoes the transitiontag
    selectedTeam.activeCapHit -= player.transitionValue;
    selectedTeam.capSpaceRemaining += player.transitionValue;
  } else {
    if(selectedTeam.capSpaceRemaining < player.transitionValue) {
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
      player.newContract = {
        moneyPerYear: parseInt(moneyPerYear),
        years: parseInt(years),
        percentGuaranteed: parseInt(percentGuaranteed)
      };
    }

    showResponseModal(isAccepted);
    availableListRenderer.renderAvailableList();
  }
}

function franchiseTagPlayer(playerId) {
  let player = players.find(p => p.id === playerId);

  if(player.status === 'franchise') {
    // Undo transition
    transitionOrFranchiseTagSelected = false;
    player.status = player.oldStatus; // Preserve old status for the cases where user undoes the transitiontag
    selectedTeam.activeCapHit -= player.franchiseValue;
    selectedTeam.capSpaceRemaining += player.franchiseValue;
    player.freeAgent = player.oldFreeAgentStatus; // If the player was a free agent earlier, it should be reversed accordingly
  } else {
    if(selectedTeam.capSpaceRemaining < player.franchiseValue) {
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
  if(selectedTeam.capSpaceRemaining < 0) {
    alert("You must have a positive cap space remaining before proceeding.");
    return;
  }
  showRosterManagementSummary();
  window.scrollTo(0, 0);
}

function manageTeamContracts() {
  // Process each team
  teams.forEach(team => {
    if(team.id === selectedTeamID) {
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

function showContractSummary() {
  goToStep(4);
  renderTeamLogo(4);
  manageTeamContracts();
  
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
      team: selectedTeamID,
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
    return `
      <tr ${isOwnTeam ? 'class="player-own"' : ''}>
        <td>${player.name}</td>
        <td class="center">${player.position}</td>
        <td class="center">
          <div class="team-data-container">
            <img 
              src="${teamLogos[player.team]}" 
              alt="${player.team}" 
            />
            ${player.team}
          </div>
        </td>
        <td class="center">${formatContractStatus(player.status)}</td>
        <td class="center">${formatMoney(getPlayerValue(player))}</td>
        <td class="center">${player.contractYears ? player.contractYears : 1}</td>
      </tr>
    `;
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
  switch(status) {
    case 'restructured': return 'Restructured';
    case 're-signed': return 'Re-signed';
    case 'transition': return 'Transition Tagged';
    case 'franchise': return 'Franchise Tagged';
    default: return status;
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
  return '-';  // For cut players or other statuses
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
  document.querySelectorAll(`#${section}Filters .position-filter`)
    .forEach(f => f.classList.remove('active'));
  // Add active class to clicked filter
  filterElement.classList.add('active');
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
    if (!(container && leftCtrl &&rightCtrl)) return;
    
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
  }

  handleScrollControls(rosterFiltersContainer, rosterFiltersLeftCtrl, rosterFiltersRightCtrl);
  handleScrollControls(availableFiltersContainer, availableFiltersLeftCtrl, availableFiltersRightCtrl);
}

function renderRosterList() {
  const playersForCurrentTeam = players.filter((p) => p.team === selectedTeamID && p.status !== 'cut');
  const activeFilter = document.querySelector('#rosterFilters .active').textContent;
  const rosterPlayers = playersForCurrentTeam.filter(p => !p.freeAgent);
  const filteredPlayers = filterPlayers(rosterPlayers, activeFilter);

  const positionOrder = ["QB", "RB", "WR", "TE", "OT", "OG", "OC", "DT", "EDGE", "LB", "CB", "S", "LS", "FB", "K", "P"];

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

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
    
  document.getElementById('rosterList').innerHTML = sortedPlayers.map(player => `
    <tr class="player-row">
      <td class="player">${player.name}</td>
      <td class="position pos">${player.position}</td>
      <td class="small-text center status">${player.status ? capitalizeFirstLetter(player.status) : '-'}</td>
      <td class="center cap">${formatMoney(player.status==='franchise'? player.franchiseValue: player.capHit)}</td>
    </tr>
  `).join('');
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

    tableContainer.innerHTML = `
      <div style="height: ${offsetY}px;"></div>
      ${visiblePlayers.map(player => `
        <tr class="player-row" style="height: ${rowHeight}px;">
          <td class="player">${player.name}</td>
          <td class="position pos">${player.position}</td>
          <td></td>
          <td class="center">
            ${renderSigningActions(player)}
          </td>
        </tr>
      `).join('')}
      <div style="height: ${(sortedPlayers.length - endIdx) * rowHeight}px;"></div>
    `;
  }

  return {
    renderAvailableList: function(alphabeticalSort) {
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
  
  const playersToDisplay = [... userPickedPlayers, ...botPickedPlayers];

  playersToDisplay.forEach(p => {
    freeAgencyHTML += `
      <tr ${p.team === selectedTeam.id ? 'class="player-own"' : ''}>
        <td>${p.name}</td>
        <td class="position">${p.position}</td>
        <td class="center team">
          <div class="team-data-container">
            <img 
              src="${teamLogos[p.team]}" 
              alt="${p.team}" 
            />
            ${p.team}
          </div>
        </td>
        <td class="center">${formatMoney(getPlayerValue(p))}</td>
        <td class="center">${p.newContract.years ? p.newContract.years : 1}</td>
      </tr>
    `;
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
  function findPositionRecommendations(team, prioritizedPlayers, otherPlayers, signingLimit, numRecommended = 0, need) {
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
    
    const prioritizedNeeds = team.teamNeeds && typeof team.teamNeeds === 'object'
      ? Object.entries(team.teamNeeds)
          .filter(([pos, need]) => need > 0 && !doNotSignPositions.includes(pos))
          .sort((a, b) => b[1] - a[1])
      : [];

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
      const playerShouldBeSigned = alwaysSignPositionsArr.includes(oneRecommendation.position) && !!alwaysSignPositions[oneRecommendation.position];
      // If the player should always be signed and the team can afford them, bypass the condition
      if (
        (!playerShouldBeSigned || cannotAffordPlayer) && // Apply conditions if the player is not a "must sign" or the team can't afford them
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

  const positionOrder = ["QB", "RB", "WR", "TE", "OT", "OG", "OC", "DT", "EDGE", "LB", "CB", "S", "LS", "FB", "K", "P"];

  const statusesToFilter = ["franchise", "signed", "re-signed", "transition", "active", "restructured"];
  let myTeamPlayers = players.filter(p => p.team === selectedTeamID && statusesToFilter.includes(p.status) && !p.freeAgent);

  // Combine both arrays
  const allModifiedPlayers = myTeamPlayers;

  const sortedPlayers = myTeamPlayers.sort((a, b) => {
    const positionA = positionOrder.indexOf(a.position);
    const positionB = positionOrder.indexOf(b.position);

    if (positionA !== positionB) {
      return positionA - positionB; // Sort by position order
    }

    // If positions are the same, sort by getFinalValue
    return getFinalValue(b) - getFinalValue(a); // Descending order by value
  });

  resultPlayers = sortedPlayers;
  
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
  return `
    <tr class="results-row">
      <td>${player.name}</td>
      <td>${player.position}</td>
      <td class="center">${formatFinalStatus(player.status)}</td>
      <td>${formatMoney(getFinalValue(player))}</td>
    </tr>
  `;
}

function formatFinalStatus(status) {
  switch(status) {
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
  switch(player.status) {
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
      circle.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>';
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

function generateResultsCanvas(baseX, baseY, canvasWidth, canvasHeight, scaleFactor = 0) {
  let headingHeight = 40;
  let rowHeight = 30;
  let tableHeadingHeight = 30;

  // Calculate total canvas height based on number of rows
  let totalRowsHeight = resultPlayers.length * rowHeight;
  canvasHeight = headingHeight + tableHeadingHeight + totalRowsHeight + 30;

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

  // Draw the blue background for the header section
  ctx.fillStyle = "#0957C3";
  ctx.fillRect(0, 0, canvasWidth, headingHeight);

  let pfnLogo = document.querySelector(".pfn-logo");

  if (brand == "pfn") {
    let imageWidth = 30;
    let imageHeight = 30;
    let padding = 6;
    let xPos = canvasWidth - imageWidth - padding;
    let yPos = 4;
    ctx.imageSmoothingEnabled = true;
    // Draw the brand logo
    ctx.drawImage(pfnLogo, xPos, yPos, imageWidth, imageHeight);
  }

  let teamLogo = document.querySelector(`.team-card[data-team="${selectedTeamID}"] img`);

  if (teamLogo) {
    let imageWidth = 27;
    let imageHeight = 18;
    let xPos = 12;
    let yPos = 11;
    // Draw the team logo
    ctx.drawImage(teamLogo, xPos, yPos, imageWidth, imageHeight);
  }

  // draw the team name
  let textString = selectedTeam.id;
  ctx.font = "600 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
  ctx.fillStyle = "#FFF";
  ctx.textAlign = "left";
  ctx.fillText(textString, 43, yPos + 10);

  // draw a border after the team name
  let lineX = 43 + ctx.measureText(textString).width + 13;
  let lineYStart = 11;
  let lineYEnd = 11 + 22;
  ctx.beginPath();
  ctx.moveTo(lineX, lineYStart);
  ctx.lineTo(lineX, lineYEnd);
  ctx.strokeStyle = "#3782E9";
  ctx.lineWidth = 1;
  ctx.stroke();

  // draw the title for the image
  let rosterTextX = lineX + 12;
  let rosterText = "My Roster";
  ctx.font = "500 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
  ctx.fillStyle = "#FFF";
  ctx.textAlign = "left";
  ctx.fillText(rosterText, rosterTextX, yPos + 10);

  // Draw the table headings
  let tableStartY = headingHeight + 18; // Position the headings below the blue section with some padding
  ctx.fillStyle = "#F5F5F5";
  ctx.fillRect(0, headingHeight, canvasWidth, tableHeadingHeight);
  ctx.font = "500 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
  ctx.fillStyle = "#999999";

  const tableRowRightPadding = 10;
  let tableXPosition = 10; // Starting x position
  
  // Column headings
  let columns = ["Player", "Pos", "Status", "Cap Hit"];
  let columnFractions = [0.43, 0.15, 0.15, 0.3]; // Fractions of total canvas width
  let columnWidths = columnFractions.map(fraction => fraction * canvasWidth); // calculate column widths
  
  columns.forEach((heading, index) => {
    let colX = tableXPosition + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
    if (index === 3) {
      colX -= 10;
    }
    // Set alignment: left for "Player" and "Pos", center for the rest
    if (index === 0 || index === 1) {
      ctx.textAlign = "left";
      ctx.fillText(heading, colX, tableStartY);
    } else {
      ctx.textAlign = "center";
      ctx.fillText(heading, colX + columnWidths[index] / 2, tableStartY);
    }
  });

  let tableRows = resultPlayers.map(player => {
    return {
      player: player.name,
      pos: player.position,
      status: formatFinalStatus(player.status),
      capHit: formatMoney(getFinalValue(player)),
    }
  });
  
  let rowStartY = tableStartY + 30;

  ctx.fillStyle = "#2D2D2D";

  tableRows.forEach((row, rowIndex) => {
    let rowY = rowStartY + rowIndex * rowHeight;
    columns.forEach((heading, index) => {
      let colX = tableXPosition + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      
      if (index === 3) {
        colX -= tableRowRightPadding;
      }
      
      ctx.textAlign = index === 0 || index === 1 ? "left" : "center";
      ctx.font =  index === 0 ? "600 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif" : "400 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
      let text =
        index === 0
          ? row.player
          : index === 1
          ? row.pos
          : index === 2
          ? row.status
          : row.capHit;

      // check if the text exceeds the allocated width for "Player" column
      if (index === 0) { 
        const maxWidth = columnWidths[index] - 10;
        if (ctx.measureText(text).width > maxWidth) {
          // truncate the text and add ellipses until it's lesser than the max width
          while (ctx.measureText(text + '...').width > maxWidth && text.length > 0) {
            text = text.slice(0, -1);
          }
          text += '...';
        }
      }

      if (index === 0 || index === 1) {
        ctx.fillText(text, colX, rowY);
      } else {
        ctx.fillText(text, colX + columnWidths[index] / 2, rowY);
      }
    });

    ctx.beginPath();
    // draw borders for each row
    ctx.moveTo(0, rowY + 8);
    ctx.lineTo(canvasWidth, rowY + 8);
    ctx.strokeStyle = "#E4E6EE";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // draw the link
  const linkText = "www.profootballnetwork.com/nfl-offseason-salary-cap-free-agency-manager";
  const linkY = rowStartY + totalRowsHeight;
  ctx.fillStyle = "#2D2D2D";
  ctx.font = "500 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(linkText, 200, linkY);

  return canvas;
}

function prepareResultsCanvas() {
  var cWidth = 400;
  var cHeight = 765;
  return generateResultsCanvas(0, 15, cWidth, cHeight);
}

function downloadResults() {
  const resultsCanvas = prepareResultsCanvas();
  const link = document.createElement('a');
  if (brand === "pfn") {
    link.download = "PFN_FREE_AGENCY_RESULTS_" + Date.now();
  } else {
    link.download = "SK_FREE_AGENCY_RESULTS_" + Date.now();
  }
  link.href = resultsCanvas.toDataURL()
  link.click();
}

function shareResults() {
  function shareImageByBlob(blob) {
    let shareText;
    if (brand === "pfn") {
      shareText = `Share your thoughts on my offseason moves for ${selectedTeam.id} from the @PFN365 Offseason Manager - and then see if you can do better: https://bit.ly/offseason-manager`;
    } else {
      shareText = `Share your thoughts on my offseason moves for ${selectedTeam.id} from the @PFN365 Offseason Manager - and then see if you can do better.`;
    }
    var file = new File([blob], "temp_image.png", { type: blob.type });
    navigator.share({
      text: shareText,
      files: [file],
    });
  }
  
  const resultsCanvas = prepareResultsCanvas();
  resultsCanvas.toBlob(blob => {
    shareImageByBlob(blob);
  });
}

function init() {
  goToStep(1);
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

  const downloadBtn = document.querySelector("#screen5 .download-button");
  const shareBtn = document.querySelector("#screen5 .share-button");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadResults);
  }
  if (shareBtn) {
    if (navigator && navigator.share) {
      shareBtn.addEventListener("click", shareResults);
    } else {
      addClass(shareBtn, "hidden");
    }
  }
}
init();
