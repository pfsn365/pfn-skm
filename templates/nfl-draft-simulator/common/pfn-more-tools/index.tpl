{include file="./styles.tpl"}

<div class="more-pfn-tools-container">
  <div class="more-tools-header">
    <p class="more-tools-text">More PFN Tools</p>
    {if !$is_desktop}
      <button class="close-icon-btn" onclick="toggleFeaturedPFNTools()">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/close-icon-dark.png" width="20" height="20"
          alt="close icon">
      </button>
    {/if}
  </div>
  <div class="more-tools-holder">
    <a class="tool-holder" target="_blank" href="https://www.profootballnetwork.com/fantasy-football-trade-analyzer">
      <span class="tool-image-icon-holder">
        <span class="tool-icon-holder">
          <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/trade-analyzer-icon.png"
            width="20" height="20" alt="tool-logo">
        </span>
        <span class="tool-name">Fantasy Football Trade Analyzer</span>
      </span>
      <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/blue-arrow.png" width="7" height="10"
        alt="arrow">
    </a>
    <div class="separator"></div>
    <a class="tool-holder" target="_blank" href="https://www.profootballnetwork.com/who-should-i-start-fantasy-optimizer">
      <span class="tool-image-icon-holder">
        <span class="tool-icon-holder">
          <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/start-sit-icon.png" width="20"
            height="20" alt="tool-logo">
        </span>
        <span class="tool-name">NFL Start/Sit Optimizer</span>
      </span>
      <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/blue-arrow.png" width="7" height="10"
        alt="arrow">
    </a>
    <div class="separator"></div>
    <a class="tool-holder" target="_blank" href="https://www.profootballnetwork.com/nfl-betting/betting-odds-calculator">
      <span class="tool-image-icon-holder">
        <span class="tool-icon-holder">
          <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/odds-calculator-icon.png"
            width="20" height="20" alt="tool-logo">
        </span>
        <span class="tool-name">Odds Calculator</span>
      </span>
      <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/blue-arrow.png" width="7" height="10"
        alt="arrow">
    </a>
    <div class="separator"></div>
    <a class="tool-holder" target="_blank" href="https://www.profootballnetwork.com/nfl-betting/parlays-calculator">
      <span class="tool-image-icon-holder">
        <span class="tool-icon-holder">
          <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/parlay-calculator-icon.png"
            width="20" height="20" alt="tool-logo">
        </span>
        <span class="tool-name">Parlay Calculator</span>
      </span>
      <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/blue-arrow.png" width="7" height="10"
        alt="arrow">
    </a>
    <div class="separator"></div>
    <a class="tool-holder" target="_blank" href="https://www.profootballnetwork.com/nfl-playoff-predictor">
      <span class="tool-image-icon-holder">
        <span class="tool-icon-holder">
          <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/playoff-predictor-icon.png"
            width="20" height="20" alt="tool-logo">
        </span>
        <span class="tool-name">NFL Playoff Predictor</span>
      </span>
      <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/blue-arrow.png" width="7" height="10"
        alt="arrow">
    </a>
    <div class="separator"></div>
    <a class="tool-holder" target="_blank" href="https://www.profootballnetwork.com/nfl-dfs-optimizer-lineup-generator">
      <span class="tool-image-icon-holder">
        <span class="tool-icon-holder">
          <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/dfs-lineup-optimizer-icon.png"
            width="20" height="20" alt="tool-logo">
        </span>
        <span class="tool-name">DFS LineupOptimizer</span>
      </span>
      <img class="tool-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/blue-arrow.png" width="7" height="10"
        alt="arrow">
    </a>
  </div>
</div>
