{include file="./styles.tpl"}

<div class="lineup-optimizer-container">
  {if !empty($header_info_text)}
    {$header_info_text}
  {/if}
  {if !empty($mobile_top_text_content)}
    <div class="top-text-content-container">
      <div class="pfn-text-content-container">
        {$mobile_top_text_content}
      </div>
      <button class="read-more-content-btn">More...</button>
      <button class="read-less-content-btn hidden">Less</button>
    </div>
  {/if}
  <div class="filters-wrapper">
    {include file="./common/filters/index.tpl"}
  </div>

  <div class="players-lineups-container">
    <div class="players-pool">
      <div class="player-pool-text-container">
        <span class="player-pool-text">Pool Players</span>
        {if isset($include_feedback) && $include_feedback}
          <div class="feedback-container">
            {if $brand}
              {include file="templates/third-party/proxy/pfn/common/feedback-cta/index.tpl"}
              {call get_feedback_cta_2023 source_page="lineup-optimizer" sheet_name="lineup-optimizer" source_tab="pfn" popup_header_text="" popup_brand_logo="logo/pfn-black-big.png" cta_text="Share your Feedback"}
            {else}
              {include file="templates/common/feedback-cta/index.tpl"}
              {call get_feedback_cta_2023 source_page="lineup-optimizer" source_tab="sk" cta_text="Write your Review"}
            {/if}
          </div>
        {/if}
      </div>
      <div class="players-category-remaining-salary-container">
        <div class="players-category-buttons-container">
          <button class="players-category all-players selected" data-players="All">All</button>
          <button class="players-category locked-players" data-players="Locked">Locked(0)</button>
          <button class="players-category excluded-players" data-players="Excluded">Excluded(0)</button>
          <button class="players-category lineups" data-players="Lineups" disabled>Lineups(0)</button>
        </div>
        <div class="remaining-salary-container">
          <div class="salary-holder">
            <span class="remaining-salary">$50,000</span>
            <span class="text">Rem.</span>
          </div>
          <div class="locked-count-holder">
            <span class="locked-players">0/7</span>
            <span class="text">Locked</span>
          </div>
          <div class="player-search-container">
            <div class="search-icon-holder">
              <img class="search-icon" src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/search-icon.png"
                width="16" height="16" alt="search-icon">
            </div>
            <input class="player-search-input" type="text" placeholder="Search Player" />
          </div>
        </div>
      </div>
      <div class="player-positions-filters-search-container">
        <div class="players-positions-filters-container">
          <div class="players-positions-filters-holder">
            <button class="position-filter selected" data-position="All">All</button>
            <button class="position-filter" data-position="QB">QB</button>
            <button class="position-filter" data-position="RB">RB</button>
            <button class="position-filter" data-position="WR">WR</button>
            <button class="position-filter" data-position="TE">TE</button>
            <button class="position-filter" data-position="FLEX">FLEX</button>
            <button class="position-filter" data-position="DST">DST</button>
          </div>
        </div>
        <div class="points-salary-container hidden">
          <div class="remaining-salary-holder">
            <span class="remaining-salary-amount">0</span>
            <span class="remaining-salary-text">Rem.</span>
          </div>
          <div class="remaining-points-container">
            <span class="remaining-points-count">0 FP</span>
            <span class="projected-points-text">Proj</span>
          </div>
        </div>
        <div class="lineups-buttons-container hidden">
          <div class="lineups-buttons-holder">
          </div>
        </div>
      </div>

      <div class="players-table-container">
        <table class="players-list-table">
        </table>
        <table class="lineups-table hidden">
          <thead>
            <tr class="players-info-container-header">
              <th class="player-name-header">Player</th>
              <th>
                <div class="lineup-salary-container">
                  <button class="lineup-salary-sort-descending-btn" data-sort="descending">
                    <span class="salary-text">Sal</span>
                    <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/sort-ascending-icon.png" width="7"
                      height="7" alt="sort desc icon" />
                  </button>
                  <button class="lineup-salary-sort-ascending-btn hidden" data-sort="ascending">
                    <span class="salary-text">Sal</span>
                    <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/down-arrow.png" width="7"
                      height="7" alt="sort desc icon" />
                  </button>
                </div>
              </th>
              <th>
                <div class="player-points-value-select-container">
                  <select class="player-points-value-select" name="players-points" id="players-points">
                    <option value="FPTS">FPTS</option>
                    <option value="Val">Val</option>
                  </select>
                  <button class="points-value-sort-descending-btn" data-sort="descending">
                    <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/sort-ascending-icon.png" width="7"
                      height="7" alt="sort desc icon" />
                  </button>
                  <button class="points-value-sort-ascending-btn hidden" data-sort="ascending">
                    <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/down-arrow.png" width="7"
                      height="7" alt="sort desc icon" />
                  </button>
                </div>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>

  </div>
  <button class="build-lineups">Build</button>

  <div class="refresh-lineup-download-csv-container hidden">
    <button class="refresh-lineup-btn">Rebuild</button>
    <button class="reset-lineup-btn">
      <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/reset-lineup-icon.png" width="16" height="16"
        alt="rest icon" />
      <span class="reset-lineup-text">Reset</span>
    </button>
    <button class="download-csv-btn">
      <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/download-csv.png" width="16" height="16"
        alt="download icon" />
      <span class="reset-lineup-text">CSV for </span>
      <img class="website-icon fanduel hidden"
        src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/fanduel-icon.png" width="18" height="18"
        alt="download icon" />
      <img class="website-icon draftkings"
        src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/draft-kings-icon.png" width="18" height="18"
        alt="download icon" />
    </button>
  </div>
</div>

<div class="lineup-optimizer-loading-overlay">
  <div class="lineup-optimizer-loading-overlay-text">Loading...</div>
</div>

{include file="./js.tpl"}
