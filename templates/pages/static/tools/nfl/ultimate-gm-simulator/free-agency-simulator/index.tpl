{include file="./styles.tpl"}

<div class="all-screens-container">
  <div id="screen1" class="screen active">
    <div class="header">
      <h2>Select Your Team</h2>
    </div>
    <div class="team-grid" id="teamGrid"></div>
    <div class="footer">
      <span>Act as the GM of your favorite team and manage their offseason decisions in our Offseason Simulator</span>
      <button class="continue-btn disabled" onclick="selectTeam()">CONTINUE</button>
    </div>
  </div>

  <div id="screen2" class="screen">
    <div class="header">
      <h2>Cut Players / Restructure Contracts</h2>
      <div class="team-logo-container">
        <span></span>
        <img alt="team logo" width="20" height="20" />
      </div>
    </div>
    <div class="cap-summary" id="capSummary"></div>
    <div class="table-container">
      <div class="table-wrapper custom-scrollbar">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th class="center">Pos</th>
              <th class="center amount">Cap Hit</th>
              <th class="center">Dead Money</th>
              <th class="center">Cap Savings (Cut)</th>
              <th class="center">Restructure Savings</th>
              <th class="center sticky-cut">Cut</th>
              <th class="center sticky-restructure">
                {if $is_desktop}
                  Restructure
                {else}
                  Restr.
                {/if}
              </th>
            </tr>
          </thead>
          <tbody id="playerTable"></tbody>
        </table>
      </div>
    </div>
    <div class="footer">
      <ul>
        <li><span>Adjust your roster by cutting or restructuring eligible players</span></li>
        <li><span>Your actions for individual players will impact overall team cap space</span></li>
      </ul>
      <button class="continue-btn" onclick="nextScreen()">CONTINUE</button>
    </div>
  </div>

  <!-- Add Screen 3 -->
  <div id="screen3" class="screen">
    <div class="header">
      <h2>Re-sign & Tag Players</h2>
      <div class="team-logo-container">
        <span></span>
        <img alt="team logo" width="20" height="20" />
      </div>
    </div>
    <div class="cap-summary" id="screen3CapSummary"></div>
    <div class="table-container">
      <div class="table-wrapper custom-scrollbar">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Pos</th>
              <th class="center">Transition Value</th>
              <th class="center">Franchise Value</th>
              <th class="center sticky-1">Re-sign</th>
              <th class="center sticky-2">Transition Tag</th>
              <th class="center sticky-3">Franchise Tag</th>
            </tr>
          </thead>
          <tbody id="reSigningTable"></tbody>
        </table>
      </div>
    </div>
    <div class="footer">
      <ul>
        <li><span>Click on re-sign or respective tags to take action on eligible players</span></li>
        <li><span class="light">Transition Tag - Gives a team the right to match an offer sheet made to a player by
            another team</span></li>
        <li><span class="light">Franchise Tag - A one-year contract that every NFL team is able to issue once per
            offseason</span></li>
      </ul>
      <button class="continue-btn" onclick="showContractSummary()">CONTINUE</button>
    </div>
  </div>


  <!-- Add Screen 4 -->
  <div id="screen4" class="screen">
    <div class="header">
      <h2>Simulate Free Agency</h2>
      <div class="team-logo-container">
        <span></span>
        <img alt="team logo" width="20" height="20" />
      </div>
    </div>
    <div class="cap-summary">
      <div class="cap-info cap-item">
        <div class="cap-item-label">Cap Space Rem.</div>
        <div class="cap-item-value" id="capSpaceDisplay">$255,400,000</div>
      </div>
      <div class="team-needs cap-item">
        <div class="cap-item-label">Your Team's Needs</div>
        <div class="cap-item-value" id="teamNeeds">QB, WR, EDGE, CB, TE, LB, C G</div>
      </div>
      <button class="instructions-link">Instructions & Tips ›</button>
    </div>
    <div class="roster-tables-tabs">
      <div class="tab active">Your Roster</div>
      <div class="tab">Available Players</div>
    </div>

    <div class="roster-container">
      <!-- Your Roster Panel -->
      <div class="roster-panel">
        <div class="roster-title">YOUR ROSTER</div>
        <div class="position-filters no-scrollbar" id="rosterFilters">
          <button class="move-left-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" height="16" width="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div class="filters-container no-scrollbar">
            <div class="position-filter active">ALL<span></span></div>
            <div class="position-filter">QB<span></span></div>
            <div class="position-filter">RB<span></span></div>
            <div class="position-filter">WR<span></span></div>
            <div class="position-filter">TE<span></span></div>
            <div class="position-filter">OT<span></span></div>
            <div class="position-filter">OG<span></span></div>
            <div class="position-filter">OC<span></span></div>
            <div class="position-filter">DT<span></span></div>
            <div class="position-filter">EDGE<span></span></div>
            <div class="position-filter">LB<span></span></div>
            <div class="position-filter">CB<span></span></div>
            <div class="position-filter">S<span></span></div>
            <div class="position-filter">LS<span></span></div>
            <div class="position-filter">FB<span></span></div>
            <div class="position-filter">K<span></span></div>
            <div class="position-filter">P<span></span></div>
          </div>
          <button class="move-right-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" height="16" width="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div class="table-wrapper custom-scrollbar">
          <table>
            <thead>
              <th class="player">Player</th>
              <th class="pos">Pos</th>
              <th class="center">Status</th>
              <th class="center">Cap Hit</th>
            </thead>
            <tbody id="rosterList"></tbody>
          </table>
        </div>
      </div>

      <!-- Available Players Panel -->
      <div class="roster-panel m-hidden">
        <div class="roster-title">AVAILABLE PLAYERS</div>
        <div class="position-filters no-scrollbar" id="availableFilters">
          <button class="move-left-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" height="16" width="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <!-- Same filters as roster panel -->
          <div class="filters-container no-scrollbar">
            <div class="position-filter active">ALL<span></span></div>
            <div class="position-filter">QB<span></span></div>
            <div class="position-filter">RB<span></span></div>
            <div class="position-filter">WR<span></span></div>
            <div class="position-filter">TE<span></span></div>
            <div class="position-filter">OT<span></span></div>
            <div class="position-filter">OG<span></span></div>
            <div class="position-filter">OC<span></span></div>
            <div class="position-filter">DT<span></span></div>
            <div class="position-filter">EDGE<span></span></div>
            <div class="position-filter">LB<span></span></div>
            <div class="position-filter">CB<span></span></div>
            <div class="position-filter">S<span></span></div>
            <div class="position-filter">LS<span></span></div>
            <div class="position-filter">FB<span></span></div>
            <div class="position-filter">K<span></span></div>
            <div class="position-filter">P<span></span></div>
          </div>
          <button class="move-right-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" height="16" width="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div class="player-search-wrapper">
          <input type="text" id="availablePlayerSearch" class="player-search-input" placeholder="Search players..."
            oninput="availableListRenderer.renderAvailableList(true)">
        </div>
        <div class="table-wrapper custom-scrollbar">
          <table>
            <thead>
              <th class="player">Player</th>
              <th class="pos">Pos</th>
              <th><span class="hidden">Empty TH</span></th>
              <th class="center">Action</th>
            </thead>
            <tbody id="availableList"></tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="footer">
      <button class="continue-btn free-agency">COMPLETE FREE AGENCY</button>
    </div>
    <button class="instructions-link mobile">Instructions & Tips</button>
  </div>


  <!-- Add Screen 5 (Results) -->
  <div id="screen5" class="screen">
    <div class="header">
      <h2>Share Results</h2>
      <div class="team-logo-container">
        <span></span>
        <img alt="team logo" width="20" height="20" />
      </div>
    </div>
    <div class="cap-summary" id="finalCapSummary"></div>
    <div class="results-container">
      <div class="results-header">
        <div class="results-title">YOUR ROSTER</div>
      </div>
      {if $is_desktop}
      <div class="result-container custom-scrollbar">
        <div class="table-wrapper no-scrollbar">
          <table>
            <thead>
              <th>Player</th>
              <th>Pos</th>
              <th class="center">Status</th>
              <th class="center">Cap Hit</th>
            </thead>
            <tbody id="resultListOdd"></tbody>
          </table>
        </div>
        <div class="table-wrapper no-scrollbar">
          <table>
            <thead>
              <th>Player</th>
              <th>Pos</th>
              <th class="center">Status</th>
              <th class="center">Cap Hit</th>
            </thead>
            <tbody id="resultListEven"></tbody>
          </table>
        </div>
      </div>
      {/if}
      {if !$is_desktop}
      <div class="table-wrapper custom-scrollbar mobile">
        <table>
          <thead>
            <th>Player</th>
            <th>Pos</th>
            <th class="center">Status</th>
            <th class="center">Cap Hit</th>
          </thead>
          <tbody id="resultListMobile"></tbody>
        </table>
      </div>
      {/if}
    </div>

    <div class="footer-buttons">
      <button class="pfn-button" onclick="navigateToMDS()">GO TO PFSN MDS</a>
    </div>
  </div>


</div>

<img class="pfn-logo hidden" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-white-ver-2.png?h=30" width="30"
  height="30" alt="pfn-logo" crossorigin="anonymous" />

<div id="rosterManagementModal" class="modal-overlay" style="display: none;">
  <div class="modal no-scrollbar">
    <div class="modal-header">
      <h2 class="modal-title">ROSTER MANAGEMENT SUMMARY</h2>
    </div>
    <div class="modal-content">
      <div class="summary-table-wrapper custom-scrollbar">
        <table class="summary-table">
          <thead>
            <tr>
              <th>Player</th>
              <th class="center">Pos</th>
              <th class="center">Team</th>
              <th class="center">Status</th>
              <th class="center">Value</th>
            </tr>
          </thead>
          <tbody id="rosterManagementBody"></tbody>
        </table>
      </div>
      <button class="continue-btn" onclick="goToScreen3()">CONTINUE</button>
    </div>
  </div>
</div>

<div id="contractRenewalModal" class="modal-overlay" style="display: none;">
  <div class="modal no-scrollbar">
    <div class="modal-header">
      <h2 class="modal-title">CONTRACT RENEWAL SUMMARY</h2>
    </div>
    <div class="modal-content">
      <div class="summary-table-wrapper custom-scrollbar">
        <table class="summary-table">
          <thead>
            <tr>
              <th>Player</th>
              <th class="center">Pos</th>
              <th class="center">Team</th>
              <th class="center">Status</th>
              <th class="center">Value</th>
              <th class="center">Years</th>
            </tr>
          </thead>
          <tbody id="contractRenewalBody"></tbody>
        </table>
      </div>
      <button class="continue-btn" onclick="proceedToNextPhase()">CONTINUE</button>
    </div>
  </div>
</div>

<div id="restructureModal" class="modal-overlay" style="display: none;">
  <div class="modal no-scrollbar">
    <div class="modal-header">
      <h2 class="modal-title">OFFER NEW CONTRACT</h2>
      <button class="close-button" onclick="closeRestructureModal()">&times;</button>
    </div>
    <div class="modal-content">
      <div class="desired-contract-info" id="desiredContractInfo">
        <h3 class="desired-contract-title">DESIRED CONTRACT <span class="desired-contract-info-icon"
            onmouseenter="this.classList.add('show-tooltip')"
            onmouseleave="this.classList.remove('show-tooltip')">&#9432;<span class="desired-contract-tooltip">Players
              may accept less than the desired contract but will definitely accept the desired contract.</span></span>
        </h3>
        <div class="desired-contract-row">
          <div class="desired-contract-item">
            <span class="desired-contract-label">Per Year Minimum</span>
            <span class="desired-contract-value" id="desiredPerYear">-</span>
          </div>
          <div class="desired-contract-item">
            <span class="desired-contract-label">Guaranteed % Minimum</span>
            <span class="desired-contract-value" id="desiredGuaranteedPct">-</span>
          </div>
          <div class="desired-contract-item">
            <span class="desired-contract-label">Minimum Number of Years</span>
            <span class="desired-contract-value" id="desiredMinYears">-</span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="moneyPerYear">Money Per Year</label>
        <input type="text" id="moneyPerYear" placeholder="1,000,000" onchange="formatMoneyInput(this)">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="years">Years</label>
          <select id="years">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3" selected>3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div class="form-group">
          <label for="percentGuaranteed">Percent Guaranteed</label>
          <select id="percentGuaranteed">
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="10" selected>10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
            <option value="25">25%</option>
            <option value="30">30%</option>
            <option value="35">35%</option>
            <option value="40">40%</option>
            <option value="45">45%</option>
            <option value="50">50%</option>
            <option value="55">55%</option>
            <option value="60">60%</option>
            <option value="65">65%</option>
            <option value="70">70%</option>
            <option value="75">75%</option>
            <option value="80">80%</option>
            <option value="85">85%</option>
            <option value="90">90%</option>
            <option value="95">95%</option>
            <option value="100">100%</option>
          </select>
        </div>
      </div>
      <button class="continue-btn" onclick="makeReSigningOffer(event)">OFFER</button>
    </div>
  </div>
</div>

<div id="instructionsModal" class="modal-overlay" style="display: none;">
  <div class="modal no-scrollbar">
    <div class="modal-header">
      <h2 class="modal-title">INSTRUCTIONS & TIPS</h2>
      <button class="close-button" onclick="closeInstructionsModal()">&times;</button>
    </div>
    <div class="modal-content custom-scrollbar">
      <h3>INSTRUCTIONS</h3>
      <ul>
        <li>Click on the 'Offer' under 'Players Available' section to make an offer to a specific player</li>
        <li>Players are listed in alphabetical order</li>
        <li>You can submit any number of offers up to your Available Cap Space limit</li>
        <li>Players will accept or reject immediately, and you can offer a player as many contracts as you wish</li>
      </ul>
      <h3>NEGOTIATION TIPS</h3>
      <p>Here are some tips to help you manage the cap and understand what top players might be seeking in their
        contracts. While these guidelines won't guarantee a player will sign with you, they can give you a better idea
        of what a player is looking for and offer insight into players in lower tiers.</p>
      <ul>
        <li>Some players will sign for zero guaranteed money, but typically, that is only the very backend of the roster
          guys. Most will want at least 5 or 10% minimum guaranteed salary</li>
        <li>The better players will ask for more guaranteed salary, with some asking for in excess of 30% guaranteed
        </li>
        <li>For contract length, younger players tend to seek at least two-year deals, with top-tier players looking for
          3+ years. Older players, even the top-tier options will sometimes accept one or two-year deals</li>
      </ul>
    </div>
  </div>
</div>

<div id="responseModal" class="modal-overlay" style="display: none;">
  <div class="modal no-scrollbar">
    <div class="response-modal">
      <img id="responseIcon" class="response-icon" alt="response icon" width="56" height="56" />
      <div id="responseMessage" class="response-message"></div>
    </div>
  </div>
</div>

<div id="freeAgencyModal" class="modal-overlay" style="display: none;">
  <div class="modal no-scrollbar" style="max-width: 800px;">
    <div class="modal-header">
      <h2 class="modal-title">FREE AGENCY SUMMARY</h2>
    </div>
    <div class="modal-content">
      <div class="summary-table-wrapper custom-scrollbar">
        <table class="summary-table">
          <thead>
            <th>Player</th>
            <th>Pos</th>
            <th class="center">Team</th>
            <th class="center">Value</th>
            <th class="center">Years</th>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
    <button class="continue-btn" onclick="completeAndShowResults()">CONTINUE</button>
  </div>
</div>
