{include file="./styles.tpl"}

<div class="lineup-optimizer-container">
  {if !empty($header_info_text)}
    {$header_info_text}
  {/if}
  <div class="filters-wrapper">
    {include file="./common/filters/index.tpl"}
  </div>

  <div class="players-lineups-container">
    <div class="players-lineups-holder">
      <div class="players-pool">
        <div class="player-pool-text-container">
          <span class="player-pool-text">Pool Players</span>
        </div>
        <div class="players-category-remaining-salary-container">
          <div class="players-category-buttons-container">
            <button class="players-category all-players selected" data-players="All">All</button>
            <button class="players-category locked-players" data-players="Locked">Locked(0)</button>
            <button class="players-category excluded-players" data-players="Excluded">Excluded(0)</button>
          </div>
          <div class="remaining-salary-container">
            <span class="remaining-salary">$50,000</span>
            <span class="text">Rem.</span>
            <div class="separator"></div>
            <span class="locked-players">0/7</span>
            <span class="text">Locked</span>
          </div>
        </div>
        <div class="player-positions-filters-search-container">
          <div class="players-positions-filters-container">
            <button class="position-filter selected" data-position="All">All</button>
            <button class="position-filter" data-position="QB">QB</button>
            <button class="position-filter" data-position="RB">RB</button>
            <button class="position-filter" data-position="WR">WR</button>
            <button class="position-filter" data-position="TE">TE</button>
            <button class="position-filter" data-position="FLEX">FLEX</button>
            <button class="position-filter" data-position="DST">DST</button>
          </div>
          <div class="player-search-container">
            <div class="search-icon-holder">
              <img class="search-icon" src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/search-icon.png"
                width="16" height="16" alt="search-icon">
            </div>
            <input class="player-search-input" type="text" placeholder="Search Player" />
          </div>
        </div>

        <div class="players-table-container">
          <div class="salary-tooltip-container hidden">
            <div class="up-pointer"></div>
            <span class="tooltip-text">The cost required to add the player in a lineup.</span>
          </div>
          <div class="points-tooltip-container hidden">
            <div class="up-pointer"></div>
            <span class="tooltip-text">Project fantasy points of the player for the next match.</span>
          </div>
          <div class="value-tooltip-container hidden">
            <div class="up-pointer"></div>
            <span class="tooltip-text">Player’s projected points per $1000 Salary.</span>
          </div>
          <div class="action-tooltip-container hidden">
            <div class="up-pointer"></div>
            <span class="tooltip-text">Lock or exclude a player from all lineups.</span>
          </div>
          <table class="players-list-table">
          </table>
        </div>
      </div>
      <div class="lineups-container">
        <div class="lineups-header-container">
          <span class="header-text">Lineups</span>
          <div class="points-salary-container">
            <div class="remaining-salary-holder">
              <span class="remaining-salary-amount">0</span>
              <span class="remaining-salary-text">Rem.</span>
            </div>
            <div class="remaining-points-container">
              <span class="remaining-points-count">0 FP</span>
              <span class="projected-points-text">Proj</span>
            </div>
          </div>
        </div>
        <div class="lineups-list-container">
          <div class="lineups-buttons-container hidden">
            <div class="lineups-carousel-control-left-btn-holder">
              <button class="lineups-carousel-control-btn left-scroll-button hidden">
                <img height="8" width="12" alt="scroll button icon" loading="lazy"
                  src="{$smarty.const.STATIC_URL}/skm/assets/ic-cheveron-right--2d2d2d.svg">
              </button>
            </div>
            <div class="lineups-buttons-holder">
            </div>
            <div class="lineups-carousel-control-right-btn-holder">
              <button class="lineups-carousel-control-btn right-scroll-button hidden">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/ic-cheveron-right--2d2d2d.svg" height="8" width="12"
                  alt="scroll button icon" loading="lazy">
              </button>
            </div>
          </div>
          <table class="lineups-table hidden">
            <thead>
              <tr class="lineups-header-row">
                <th>Pos</th>
                <th class="player-details-header">Player</th>
                <th>
                  <div class="lineup-salary-container">
                    <button class="lineup-salary-sort-descending-btn" data-sort="descending">
                      <span class="salary-text">Sal</span>
                      <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/sort-ascending-icon.png"
                        width="7" height="7" alt="sort desc icon" />
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
                    <button class="lineup-points-value-sort-descending-btn" data-sort="descending">
                      <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/sort-ascending-icon.png"
                        width="7" height="7" alt="sort desc icon" />
                    </button>
                    <button class="lineup-points-value-sort-ascending-btn hidden" data-sort="ascending">
                      <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/down-arrow.png" width="7"
                        height="7" alt="sort desc icon" />
                    </button>
                  </div>
                </th>
                <th>
                  <span class="action-header">Action</span>
                </th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <button class="build-lineups-bottom">Build</button>

        <div class="refresh-lineup-download-csv-container hidden">
          <button class="refresh-lineup-btn">Refresh Lineup</button>
          <button class="reset-lineup-btn">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/reset-lineup-icon.png" width="16"
              height="16" alt="rest icon" />
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
    </div>
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
</div>

<div class="lineup-optimizer-loading-overlay">
  <div class="lineup-optimizer-loading-overlay-text">Loading...</div>
</div>

{include file="./js.tpl"}
