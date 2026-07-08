{include file="./styles.tpl"}

<div class="team-selection-container">
  <div class="selection-header">
    <div class="selection-text">{$select_teams_text}</div>
    <div class="slider-container">
      <span class="text-all">All</span>
      <label class="switch">
        <input type="checkbox" onclick="selectAllTeams(this)" aria-label="select-all">
        <span class="slider round"></span>
      </label>
    </div>
  </div>
  <div class="teams-container">
    <div class="afc-teams-container">
      <div class="teams-header">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/afc-logo.png" width="46" height="21"
          alt="conference-logo">
      </div>
      <div class="teams-holder afc">
        {foreach $afcTeams as $team}
          <button class="team-holder" onclick="teamSelected(this)" data-shortname="{$team['shortName']}">
            <span class="team-name">{$team['shortName']}</span>
            <img class="team-logo" src="{$smarty.const.STATIC_URL}{$team_logo_path}{$team['teamLogo']}?w=80&tag={$logo_cache_buster}"
              width="40" height="27" alt="{$team['shortName']|escape:'htmlall'|replace:'\\':'\\\\'}">
          </button>
        {/foreach}
      </div>
    </div>
    <div class="nfc-teams-container">
      <div class="teams-header">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/nfc-logo.png" width="46" height="21"
          alt="conference-logo">
      </div>
      <div class="teams-holder nfc">
        {foreach $nfcTeams as $team}
          <button class="team-holder" onclick="teamSelected(this)" data-shortname="{$team['shortName']}">
            <span class="team-name">{$team['shortName']}</span>
            <img class="team-logo" src="{$smarty.const.STATIC_URL}{$team_logo_path}{$team['teamLogo']}?w=80&tag={$logo_cache_buster}"
              width="40" height="27" alt="{$team['shortName']|escape:'htmlall'|replace:'\\':'\\\\'}">
          </button>
        {/foreach}
      </div>
    </div>
  </div>
</div>

{include file="./js.tpl"}
