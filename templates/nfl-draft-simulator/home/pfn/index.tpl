{if $is_desktop}
  {include file="./desktop.tpl"}
{else}
  {include file="./mobile.tpl"}
{/if}

{assign var="teams" value=[
"49ers","Bears","Bengals","Bills","Broncos","Browns","Buccaneers","Cardinals",
"Chargers","Chiefs","Colts","Cowboys","Dolphins","Eagles","Falcons","Giants",
"Jaguars","Jets","Lions","Packers","Panthers","Patriots","Raiders","Rams",
"Ravens","Saints","Seahawks","Steelers","Texans","Titans","Vikings","Washington"
]}

{foreach $teams as $team}
  <img class="team-logo hidden" src="{$smarty.const.STATIC_URL}{$team_logo_path}{$team}.png?w=80&tag={$logo_cache_buster}"
    width="36" height="36" alt="{$team}" data-teamlogo="{$team}.png" crossorigin="anonymous">
{/foreach}
