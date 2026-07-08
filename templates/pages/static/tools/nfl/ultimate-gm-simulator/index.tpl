{include file="./styles.tpl"}
{include file="./templates.tpl"}

<div class="ultimate-simulator-container">
  {if !$is_desktop}
    <div class="mobile-top-adv-container raptive-pfn-header"></div>
  {/if}
  <div class="steps-wrap">
    {if $is_desktop}
      <div class="steps-aside">
        <div class="steps-aside-title">STEPS<br>TO<br>PLAY</div>
      </div>
    {/if}
    <div class="steps-bar" id="stepsBar">
      <div class="step-node one is-active is-active-border" data-step="1">
        <span class="step-num">01</span>
        <span class="step-completed hidden">
          <img class="completed-tick"
            src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/check-tick.png"
            alt="completed icon" width="16" height="12" loading="lazy" />
        </span>
        <span class="step-label">Select Team</span>
      </div>
      <div class="arrow two">
        <div class="arrow-shaft"></div>
        <div class="arrow-point"></div>
      </div>
      <div class="step-node two" data-step="2">
        <span class="step-num">02</span>
        <span class="step-completed hidden">
          <img class="completed-tick"
            src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/check-tick.png"
            alt="completed icon" width="16" height="12" loading="lazy" />
        </span>
        <span class="step-label">{$current_season} Results</span>
      </div>
      <div class="arrow three">
        <div class="arrow-shaft"></div>
        <div class="arrow-point"></div>
      </div>
      <div class="step-node three" data-step="3">
        <span class="step-num">03</span>
        <span class="step-completed hidden">
          <img class="completed-tick"
            src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/check-tick.png"
            alt="completed icon" width="16" height="12" loading="lazy" />
        </span>
        <span class="step-label">Manage Roster</span>
      </div>
      <div class="arrow four">
        <div class="arrow-shaft"></div>
        <div class="arrow-point"></div>
      </div>
      <div class="step-node four" data-step="5">
        <span class="step-num">04</span>
        <span class="step-completed hidden">
          <img class="completed-tick"
            src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/check-tick.png"
            alt="completed icon" width="16" height="12" loading="lazy" />
        </span>
        <span class="step-label">Re-sign & Tag Players</span>
      </div>
      <div class="arrow five">
        <div class="arrow-shaft"></div>
        <div class="arrow-point"></div>
      </div>
      <div class="step-node five" data-step="6">
        <span class="step-num">05</span>
        <span class="step-completed hidden">
          <img class="completed-tick"
            src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/check-tick.png"
            alt="completed icon" width="16" height="12" loading="lazy" />
        </span>
        <span class="step-label">Sign Free Agents</span>
      </div>
      <div class="arrow six">
        <div class="arrow-shaft"></div>
        <div class="arrow-point"></div>
      </div>
      <div class="step-node six" data-step="7">
        <span class="step-num">06</span>
        <span class="step-completed hidden">
          <img class="completed-tick"
            src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/check-tick.png"
            alt="completed icon" width="16" height="12" loading="lazy" />
        </span>
        <span class="step-label">NFL Draft</span>
      </div>
      <div class="arrow seven">
        <div class="arrow-shaft"></div>
        <div class="arrow-point"></div>
      </div>
      <div class="step-node seven" data-step="8">
        <span class="step-num">07</span>
        <span class="step-completed hidden">
          <img class="completed-tick"
            src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/check-tick.png"
            alt="completed icon" width="16" height="12" loading="lazy" />
        </span>
        <span class="step-label">{$upcoming_season} Predictions</span>
      </div>
      <div class="arrow eight">
        <div class="arrow-shaft"></div>
        <div class="arrow-point"></div>
      </div>
      <div class="step-node eight" data-step="9">
        <span class="step-num">08</span>
        <span class="step-completed hidden">
          <img class="completed-tick"
            src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/check-tick.png"
            alt="completed icon" width="16" height="12" loading="lazy" />
        </span>
        <span class="step-label">Result Screen</span>
      </div>
    </div>
  </div>

  <section id="screen-select" class="">
    <div class="select-team-text-container">
      <span class="select-team-text">{if !$is_desktop}SELECT YOUR TEAM{else}Select Team{/if}</span>
    </div>

    <div class="select-teams">
      <div class="conf-row">
        <div class="conf-card conf-afc">
          <div class="conf-header">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/AFC.png" alt="AFC logo"
              width="36" height="25" loading="lazy">
            {if !$is_desktop}
              <span>AFC</span>
            {/if}
          </div>
          <div class="teams-grid" id="afcTeams">
            {foreach from=$afcTeams item=abbr}
              <button class="team-tile" type="button" data-team="{$abbr}">
                <img class="{$abbr}" src="{$smarty.const.STATIC_URL}{$team_logo_path}{$abbr}.png{$logo_cache_buster}"
                  alt="{$abbr} logo" width="36" height="25" loading="lazy" crossorigin="anonymous">
                <span class="team-name">{$abbr}</span>
              </button>
            {/foreach}
          </div>
        </div>

        <div class="conf-card conf-nfc">
          <div class="conf-header">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/NFC.png" alt="NFC logo"
              width="36" height="25" loading="lazy">
            {if !$is_desktop}
              <span>NFC</span>
            {/if}
          </div>
          <div class="teams-grid" id="nfcTeams">
            {foreach from=$nfcTeams item=abbr}
              <button class="team-tile" type="button" data-team="{$abbr}">
                <img class="{$abbr}" src="{$smarty.const.STATIC_URL}{$team_logo_path}{$abbr}.png{$logo_cache_buster}"
                  alt="{$abbr} logo" width="36" height="25" loading="lazy" crossorigin="anonymous">
                <span class="team-name">{$abbr}</span>
              </button>
            {/foreach}
          </div>
        </div>
      </div>

    </div>
  </section>

  <section id="screen-predict-playoffs" class="hidden">
    <div class="playoff-predictor-tool-mapping">
      <div class="current-year-container">
        <span class="current-year-text">{$current_season} Results</span>
      </div>
      {include file="./playoff-predictor/index.tpl"}
    </div>
  </section>

  <section id="screen-offseason-manager" class="hidden">
    <div class="offseason-manager-tool-mapping">
      {include file="./free-agency-simulator/index.tpl"}
    </div>
  </section>

  <section id="mockdraft-simulator" class="hidden">
    <div class="mockdraft-simulator-tool-mapping">
      {include file="./nfl-draft-simulator/home/index.tpl"}
    </div>
  </section>

  <section id="ultimate-result-section" class="hidden">
    <div class="ultimate-result-screen">
      <div class="ultimate-result-header-container">
        <span class="result-header-text">Result Screen</span>
        <div class="result-header-btns-container">
          <div class="result-section-btns">
            <button class="result-overview-btn selected">OVERVIEW</button>
            <button class="rosters-result-btn">ROSTERS</button>
            <button class="standings-result-btn">PREDICTED STANDINGS</button>
            <button class="draft-order-result-btn">PREDICTED DRAFT ORDER</button>
          </div>
          {if $is_desktop}
            <div class="utility-section-btns">
              <button class="download-btn">
                <img class="download-icon"
                  src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/download-icon.png"
                  alt="completed icon" width="15" height="15" loading="lazy" />
                <span>Download</span>
              </button>
              <button class="share-btn">
                <img class="share-icon"
                  src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/share-icon.png"
                  alt="completed icon" width="12" height="13" loading="lazy" />
                <span>Share</span>
              </button>
            </div>
          {/if}
        </div>
        <div class="result-header-team-logos-container">
          <div class="result-header-team-logos-holder"></div>
          {if !$is_desktop}
            <div class="utility-section-btns">
              <button class="download-btn">
                <img class="download-icon"
                  src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/download-icon.png"
                  alt="completed icon" width="15" height="15" loading="lazy" />
                <span>Download</span>
              </button>
              <button class="share-btn">
                <img class="share-icon"
                  src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/share-icon.png"
                  alt="completed icon" width="12" height="13" loading="lazy" />
                <span>Share</span>
              </button>
            </div>
          {/if}
        </div>
        <div class="result-header-predicted-standings-btns-holder hidden">
          <div class="result-header-predicted-standings-btns-container">
            <button class="division-result-btn selected">Division</button>
            <button class="conference-result-btn">Conference</button>
            <button class="playoff-bracket-result-btn">Playoff Bracket</button>
          </div>
          {if !$is_desktop}
            <div class="utility-section-btns">
              <button class="download-btn">
                <img class="download-icon"
                  src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/download-icon.png"
                  alt="completed icon" width="15" height="15" loading="lazy" />
                <span>Download</span>
              </button>
              <button class="share-btn">
                <img class="share-icon"
                  src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/share-icon.png"
                  alt="completed icon" width="12" height="13" loading="lazy" />
                <span>Share</span>
              </button>
            </div>
          {/if}
        </div>
      </div>
      <div class="result-data-holder">
        {if !$is_desktop}
          <div class="utility-section-btns hidden">
            <button class="download-btn">
              <img class="download-icon"
                src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/download-icon.png"
                alt="completed icon" width="15" height="15" loading="lazy" />
              <span>Download</span>
            </button>
            <button class="share-btn">
              <img class="share-icon"
                src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/share-icon.png"
                alt="completed icon" width="12" height="13" loading="lazy" />
              <span>Share</span>
            </button>
          </div>
        {/if}
        <div class="result-data-container">
        </div>
      </div>
    </div>
  </section>

  <div class="info-text-continue-btn-container">
    <p class="info-text">
      Act as the GM of your favorite team, manage their entire offseason, and see how your moves impact next season.
    </p>
    <button class="continue-btn" id="continueBtn" disabled>CONTINUE</button>
  </div>
</div>

<div class="mds-overlay hidden"></div>
<div class="loading-overlay">
  <div class="loading-overlay-text">Loading...</div>
</div>

<img class="pfn-white-logo-full-download" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-white-ver-2.png"
alt="pfsn-logo" width="145" height="36" loading="lazy" crossorigin="anonymous">

{include file="./js.tpl"}
