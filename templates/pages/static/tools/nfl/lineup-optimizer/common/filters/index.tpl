{include file="./styles.tpl"}

<div class="filters-container">
  <div class="filters-header">
    <span class="filters-header-text">Filters</span>
  </div>
  <div class="filters-holder">
    <div class="websites-slates-container">
      <div class="websites-filter">
        <label for="websites">Choose Website</label>
        <select name="websites" id="websites">
          <option value="DK">DraftKings</option>
          <option value="FD">FanDuel</option>
        </select>
      </div>
      <div class="match-type-filter">
        <label for="match-type">Match Type</label>
        <select name="match-type" id="match-type">
          <option value="classic">Classic</option>
          <option value="showdown">Showdown</option>
        </select>
      </div>
      <div class="slates-filter">
        <label for="slates">Choose a Slate</label>
        <select class="DK-slates-selection" name="dk-slates" id="dk-slates">
        </select>
        <select class="FD-slates-selection hidden" name="fd-slates" id="fd-slates">
        </select>
        <select class="showdown-slates-selection hidden" name="showdown-slates" id="showdown-slates">
        </select>
      </div>
      <span class="no-slate-uploaded-info hidden">No slates uploaded yet</span>
    </div>
    <div class="matches-container">
      {if $is_desktop}
        <div class="carousel-control-left-btn-holder">
          <button class="carousel-control-btn left-scroll-button hidden">
            <img height="8" width="12" alt="scroll button icon" loading="lazy"
              src="{$smarty.const.STATIC_URL}/skm/assets/ic-cheveron-right--2d2d2d.svg">
          </button>
        </div>
      {/if}
      <div class="matches-holder"></div>
      {if $is_desktop}
        <div class="carousel-control-right-btn-holder">
          <button class="carousel-control-btn right-scroll-button">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/ic-cheveron-right--2d2d2d.svg" height="8" width="12"
              alt="scroll button icon" loading="lazy">
          </button>
        </div>
      {/if}
    </div>
    <span class="exclude-match-info">Tap on team to exclude</span>
    <div class="count-build-container">
      <div class="lineup-count-selection">
        <span class="lineup-count-selection-text">Select No. of lineups</span>
        <div class="lineup-count-text-container">
          <button class="decrease-count" disabled>
            <img class="minus-icon" src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/minus-icon.png"
              height="8" width="10" alt="minus icon" />
          </button>
          <input class="lineup-count-input" type="text" value="1" id="lineup-count" name="lineup-count">
          <button class="increase-count">
            <img class="plus-icon" src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/plus-icon.png"
              height="12" width="12" alt="plus icon" />
          </button>
        </div>
      </div>
      {if $is_desktop}
        <button class="build-lineups">Build</button>
      {/if}
    </div>
  </div>
</div>
