{include file="./styles.tpl"}
{if !isset($mds_widget_distinction)}
  {include file="./js.tpl"}
{/if}

<div class="final-trades-container hidden">
  <div class="rounds-utilities-container">
    <div class="teams-result-container">
      <div class="selected-teams-container"></div>
      {if isset($mds_widget_distinction) && $mds_widget_distinction}
        <div class="tools-btn-utility-container">
          <div class="tools-btn-utility-holder">
            <button class="load-pfn-tools-btn hidden" onclick="toggleFeaturedPFNTools()">More PFN Tools</button>
            <div class="utility-container">
              <button class="download-btn-mds" onclick="downloadTradeResult(this)">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/download-button-icon-white.svg" width="16"
                  height="16" alt="download icon">
              </button>
              <button class="share-btn-mds" onclick="shareFinalResult(this)">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/share-button-icon-white.svg" width="16" height="16"
                  alt="share icon">
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
    <div class="rounds-container hidden">
      <div class="rounds-holder hidden"></div>
      {if isset($mds_widget_distinction) && $mds_widget_distinction}
        <div class="tools-btn-utility-container">
          <div class="tools-btn-utility-holder">
            <button class="load-pfn-tools-btn hidden" onclick="toggleFeaturedPFNTools()">More PFN Tools</button>
            <div class="utility-container">
              <button class="download-btn-mds" onclick="downloadTradeResult(this)">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/download-button-icon-white.svg" width="16"
                  height="16" alt="download icon">
              </button>
              <button class="share-btn-mds" onclick="shareFinalResult(this)">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/share-button-icon-white.svg" width="16" height="16"
                  alt="share icon">
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
    {if !$brand}
      <div class="utility-container">
        <button class="download-btn-mds" onclick="downloadTradeResult(this)">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/downloadicon-dark.svg" width="18" height="18"
            alt="download icon">
        </button>
        <button class="share-btn-mds" onclick="shareFinalResult(this)">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/shareicon-dark.svg" width="17" height="18"
            alt="share icon">
        </button>
      </div>
    {/if}
  </div>
  <div class="final-result-container">
    <div class="result-header">
      {if isset($mds_widget_distinction) && $mds_widget_distinction && isset($third_party_logo_path) && $third_party_logo_path}
        <img class="third-party-logo" src="{$smarty.const.STATIC_URL}{$third_party_logo_path}" width={$third_party_logo_width} height={$third_party_logo_height} alt="Fansided Logo">
      {/if}
      <div class="team-container"></div>
      <div class="full-result-header-text-container hidden">
        {if (isset($mds_widget_distinction) && isset($third_party_logo_path) && !$third_party_logo_path) || !isset($mds_widget_distinction)}
          <span class="full-draft-result-text">FULL MOCK DRAFT RESULTS</span>
        {/if}
      </div>
      {if $brand === "pfn"}
        <img class="pfn-logo-draft-simulator" data-logo="pfn-mock-simulator" crossorigin="anonymous"
          src="{$smarty.const.STATIC_URL}/{$result_header_logo}" width="25" height="25" alt="pfn-logo">
      {elseif $brand === "cfn"}
        <img class="cfn-logo-draft-simulator" data-logo="cfn-mock-simulator" crossorigin="anonymous"
          src="{$smarty.const.STATIC_URL}/{$result_header_logo}" width="80" height="24" alt="cfn logo">
      {else}
        <img class="sk-logo-draft-simulator" data-logo="sk-mock-simulator" crossorigin="anonymous"
          src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/sklogowithmocksimulatortext-mobile.svg" width="114"
          height="21" alt="sk-logo">
      {/if}
    </div>
    <div class="draft-picks-text hidden">My Draft Picks</div>
    <div class="final-trades-holder"></div>
    {if $show_playerslist_selection_dropdown}
      <div class="draft-rankings-provider-container hidden">
        <span class="draft-rankings-provider-text"></span>
      </div>
    {/if}
    {if $brand == "pfn"}
      {if isset($bottomWidgets) && count($bottomWidgets)}
        {include file="common/widgets/index.tpl"}
        {foreach $bottomWidgets as $widget}
          {call generateWidgetSection widget=$widget}
        {/foreach}
      {/if}
    {/if}
  </div>
  {if $show_dashboard_btn_final_result == true}
    <div class="result-screen-dashboard hidden">
      {include file="templates/nfl-draft-simulator/home/pfn/dashboard/index.tpl"}
      <div class="login-container-overlay">
        <div class="login-container">
          <span class="view-performance-text">Log in to track your MDS statistics</span>
          <button class="dashboard-login-btn" onclick="navigateToLoginScreen()">Login</button>
        </div>
      </div>
    </div>
  {/if}
  {if $brand}
    {if !isset($mds_widget_distinction)}
    <div class="tools-btn-utility-container">
      <div class="tools-btn-utility-holder">
        <button class="load-pfn-tools-btn hidden" onclick="toggleFeaturedPFNTools()">More PFN Tools</button>
        <div class="utility-container">
          <button class="download-btn-mds" onclick="downloadTradeResult(this)">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/download-button-icon-white.svg" width="16"
              height="16" alt="download icon">
          </button>
          <button class="share-btn-mds" onclick="shareFinalResult(this)">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/share-button-icon-white.svg" width="16" height="16"
              alt="share icon">
          </button>
        </div>
      </div>
    </div>
    {/if}
    {if $brand === "pfn"}
      {include file="templates/nfl-draft-simulator/common/pfn-more-tools/index.tpl"}
    {/if}
  {/if}
  <div class="nfl-feedback-container hidden">
    {if isset($include_pfn_feedback) && $include_pfn_feedback}
      {include file="templates/third-party/proxy/pfn/common/feedback-cta/index.tpl"}
    {else}
      {include file="templates/common/feedback-cta/index.tpl"}    
    {/if}
    {call get_feedback_cta_2024 source_page="nfl-mockdraft" source_tab=$feedback_source_tab cta_text="Help us improve the game!" popup_brand_logo=$feedback_popup_logo popup_header_text="" popup_content_text="How can we improve?"}
  </div>
</div>
