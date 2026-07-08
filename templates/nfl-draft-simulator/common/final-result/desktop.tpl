{include file="./styles.tpl"}
{include file="./js.tpl"}

<div class="final-result-container hidden">
  <div class="final-result-holder">
    <div class="final-result-header">
      <div class="result-btns-holder">
        <button class="my-draft-btn selected" onclick="showSelectedTeamsResult()">MY DRAFT</button>
        <button class="full-results-btn" onclick="showAllRoundsResult()">FULL RESULTS</button>
        {if $show_dashboard_btn_final_result == true}
          <button class="dashboard-btn" onclick="showResultScreenDashboard()">
          <span>DASHBOARD</span>
          <span class="new-text">New</span>
          </button>
        {/if}
      </div>
      <div class="utility-container">
        {if $brand}
        <button class="grade-toggle active" id="gradeToggle" onclick="toggleGrades()">
          <div class="toggle-track"><div class="toggle-knob"></div></div>
          <span>Grades<span>
        </button>
        {/if}
        <button class="download-btn-mds" onclick="downloadTradeResult(this)">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/symbol-download.png" width="16" height="16"
            alt="download icon">
        </button>
        <button class="share-btn-mds" onclick="shareFinalResult(this)">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/symbol-share.png" width="16" height="16"
            alt="share icon">
        </button>
        <button class="back-to-room-btn hidden" onclick="backToRoom()">Back To Room</button>
        <button class="restart-sim-btn" onclick="startNewSimulation()">RESTART</button>
      </div>
    </div>

    <div class="teams-result-holder">
      <div class="user-teams-holder">
        <div class="user-selected-teams"></div>
      </div>
      <div class="team-selections-holder">
        <div class="team-selections-header">
          <div class="team-result-logo-container"></div>
          {if $brand === "pfn"}
            <img class="pfn-logo-draft-simulator" data-logo="pfn-mock-simulator" crossorigin="anonymous"
              src="{$smarty.const.STATIC_URL}/{$result_header_logo}" width="40" height="40" alt="pfn-logo">
          {elseif $brand === "cfn"}
            <img class="cfn-logo-draft-simulator" data-logo="cfn-mock-simulator" crossorigin="anonymous"
              src="{$smarty.const.STATIC_URL}/{$result_header_logo}" width="146" height="45" alt="cfn logo">
          {else}
            <img class="sk-logo-draft-simulator" data-logo="sk-mock-simulator" crossorigin="anonymous"
              src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/sklogowithsimulatortext-desktop.svg" width="163"
              height="30" alt="sk-logo">
          {/if}
        </div>
        <div class="team-selection-body"></div>
      </div>
    </div>

    <div class="all-rounds-trades-container hidden">
      <div class="all-rounds-container"></div>

      <div class="round-trades-container">
        <div class="rounds-trades-header">
          <div class="full-result-text-container">FULL MOCK DRAFT RESULTS</div>
          {if $brand === "pfn"}
            <img class="pfn-logo-draft-simulator" crossorigin="anonymous"
              src="{$smarty.const.STATIC_URL}/{$result_header_logo}" width="40" height="40" alt="pfn-logo">
          {elseif $brand === "cfn"}
            <img class="cfn-logo-draft-simulator" crossorigin="anonymous"
              src="{$smarty.const.STATIC_URL}/{$result_header_logo}" width="146" height="45" alt="cfn logo">
          {else}
            <img class="sk-logo-draft-simulator" crossorigin="anonymous"
              src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/sklogowithsimulatortext-desktop.svg" width="163"
              height="30" alt="sk-logo">
          {/if}
        </div>
        <div class="round-selection-body"></div>
      </div>
    </div>

    {if $show_playerslist_selection_dropdown}
      <div class="draft-rankings-provider-container hidden">
        <span class="draft-rankings-provider-text"></span>
      </div>
    {/if}

    {if $show_dashboard_btn_final_result == true}
      <div class="result-screen-dashboard hidden">
        {include file="templates/nfl-draft-simulator/home/pfn/dashboard/index.tpl"}
      </div>
    {/if}
  </div>
  {if $brand === "pfn"}
    {include file="templates/nfl-draft-simulator/common/pfn-more-tools/index.tpl"}
    {if isset($bottomWidgets) && count($bottomWidgets) > 0}
      {include file="common/widgets/index.tpl"}
      {foreach $bottomWidgets as $widget}
        {call generateWidgetSection widget=$widget}
      {/foreach}
    {/if}
  {/if}
  <div class="nfl-feedback-container hidden">
    {if isset($include_pfn_feedback) && $include_pfn_feedback}
      {include file="templates/third-party/proxy/pfn/common/feedback-cta/index.tpl"}
    {else}
      {include file="templates/common/feedback-cta/index.tpl"}    
    {/if}
    {call get_feedback_cta_2024 source_page="nfl-mockdraft" source_tab=$feedback_source_tab large_content_text="Did you enjoy our new Multi-user Mock Draft experience?" cta_text="Help us improve the game!" popup_brand_logo=$feedback_popup_logo popup_header_text="" popup_content_text="How can we improve?"}
  </div>
</div>
