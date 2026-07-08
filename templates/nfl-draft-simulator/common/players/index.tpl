{include file="./styles.tpl"}

<div class="players-container">
  <div class="players-positions">
    <button class="positions all selected" onclick="filterPlayers('all')">All</button>
    <button class="positions offense" onclick="filterPlayers('offense')">Offense</button>
    <button class="positions defense" onclick="filterPlayers('defense')">Defense</button>
    <button class="positions st" onclick="filterPlayers('st')">S/T</button>
  </div>
  <div class="positions-filters">
    <div class="positions offence hidden">
      <button data-position="QB" onclick="changePosition(this)">QB</button>
      <button data-position="RB" onclick="changePosition(this)">RB</button>
      <button data-position="WR" onclick="changePosition(this)">WR</button>
      <button data-position="TE" onclick="changePosition(this)">TE</button>
      <button data-position="OT" onclick="changePosition(this)">OT</button>
      <button data-position="OG" onclick="changePosition(this)">OG</button>
      <button data-position="OC" onclick="changePosition(this)">OC</button>
    </div>
    <div class="positions defence hidden">
      <button data-position="DT" onclick="changePosition(this)">DT</button>
      <button data-position="EDGE" onclick="changePosition(this)">EDGE</button>
      <button data-position="LB" onclick="changePosition(this)">LB</button>
      <button data-position="CB" onclick="changePosition(this)">CB</button>
      <button data-position="S" onclick="changePosition(this)">S</button>
    </div>
    <div class="positions st hidden">
      <button data-position="K" onclick="changePosition(this)">K</button>
      <button data-position="P" onclick="changePosition(this)">P</button>
    </div>
  </div>
  <div class="team-needs-picks-container">
    <div class="team-needs-strengths-container">
      <div class="team-needs-holder">
        <span class="team-needs-text">Team Needs:</span>
        <span class="team-needs"></span>
      </div>
      <div class="team-strength-holder">
        <span class="team-strengths-text">Low Priority:</span>
        <span class="team-strengths"></span>
      </div>
    </div>
    <div class="next-picks-container">
      <div class="separator"></div>
      <span class="next-picks-text">Next Picks:</span>
      <span class="next-picks"></span>
    </div>
  </div>
  <div class="player-search-container">
    <div class="search-icon-holder">
      <img class="search-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/search-icon.png" width="16"
        height="16" alt="search-icon">
    </div>
    <input type="text" id="player-input" placeholder="Search" class="search-player-input" name="player-input"
      oninput="filterInputPlayers(this)">
  </div>
  <div class="players-holder">
    <div class="players-list">
      {foreach $playersList as $index => $player}
        <div class="player {$player['position']} {$player['number']}" data-name="{$player['name']}"
          data-draftFrom="{$player['draftFrom']}" data-position={$player['position']} data-number={$player['number']}>
          <div class="player-details" onclick="showPlayerInfo(event)" data-name="{$player['name']}">
            <span class="player-number">{$player['number']}.</span>
            <div class="player-name-position-container">
              <span class="name">{$player["name"]}</span>
              <span class="position">{$player['position']} {$player['draftFrom']}</span>
            </div>
          </div>
          <div class="player-buttons-container">
            <button class="player-info-btn" onclick="showPlayerInfo(event)" data-name="{$player['name']}">
              <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/player-info-icon.png" width="24" height="24"
                alt="player-info-icon">
            </button>
            <button class="add-player hidden" onclick="addPlayerToPick(event)" data-name="{$player['name']}"
              data-draftFrom="{$player['draftFrom']}" data-position={$player['position']}>Draft</button>
          </div>
          <div class="separator"></div>
        </div>
      {/foreach}
    </div>
  </div>
</div>
