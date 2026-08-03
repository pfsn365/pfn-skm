{include file="./styles.tpl"}

<!-- Main Content -->
<main id="main-content" class="main" role="main">
  <!-- Tab Navigation -->
  {if $is_desktop}
    <div class="tab-nav-stats">
      <span class="stat-item">
        <span class="stat-label">Groups:</span>
        <span id="stat-groups-predicted">0</span>/<span id="stat-groups-total">72</span> predicted
      </span>
      <span class="stat-divider">|</span>
      <span class="stat-item">
        <span class="stat-label">Knockout:</span>
        <span id="stat-knockout-predicted">0</span>/<span id="stat-knockout-total">32</span> predicted
      </span>
    </div>
  {/if}
  {if !$is_desktop}
    <div class="tab-nav tab-nav-mobile">
      <div class="tab-nav-row">
        <button id="tab-groups-mobile" class="tab-btn active">
          <span class="btn-text-full">Group Stage</span>
          <span class="btn-text-short">Group</span>
        </button>
        <button id="tab-bracket-mobile" class="tab-btn">
          <span class="btn-text-full">Knockout Bracket</span>
          <span class="btn-text-short">Knockout</span>
        </button>
      </div>
      <div class="tab-nav-actions">
        <button id="btn-simulate-toggle-mobile" class="btn-action btn-action-simulate">
          <span class="btn-action-icon">&#9654;</span>
          <span class="btn-action-text">Simulate</span>
        </button>
        <button id="btn-reset-mobile" class="btn-action btn-action-reset">
          <span class="btn-action-icon">&times;</span>
          <span class="btn-action-text">Reset</span>
        </button>
        <button id="btn-share-mobile" class="btn-action btn-action-share">
          <span class="btn-action-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </span>
          <span class="btn-action-text">Share</span>
        </button>
        <button id="btn-download-mobile" class="btn-action btn-action-download">
          <span class="btn-action-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </span>
          <span class="btn-action-text">Download</span>
        </button>
      </div>
      <div class="btn-action-dropdown" id="simulate-dropdown-menu-mobile">
        <button id="btn-simulate-all-mobile" class="dropdown-item">Simulate All</button>
        <button id="btn-simulate-groups-mobile" class="dropdown-item">Groups Only</button>
      </div>
      <div class="tab-nav-stats">
        <span class="stat-item">
          <span class="stat-label">Groups:</span>
          <span id="stat-groups-predicted">0</span>/<span id="stat-groups-total">72</span> predicted
        </span>
        <span class="stat-divider">|</span>
        <span class="stat-item">
          <span class="stat-label">Knockout:</span>
          <span id="stat-knockout-predicted">0</span>/<span id="stat-knockout-total">32</span> predicted
        </span>
      </div>
    </div>
    <div class="section-header">
      <h2 id="groups-title-mobile" class="section-title">Group Stage</h2>
      <p class="section-subtitle">Enter scores for each match, or click a team to quick-select them as winner.
        The
        M
        number in the Group header tells you which match the first and second team in the group goes to, while
        the
        P
        number is the pathway that match falls in.</p>
    </div>
  {/if}

  <div class="groups-brackets-container">
    {if $is_desktop}
      <div class="tab-nav">
        <div class="tab-nav-row">
          <button id="tab-groups" class="tab-groups tab-btn active">
            <span class="btn-text-full">Group Stage</span>
            <span class="btn-text-short">Group</span>
          </button>
          <button id="tab-bracket" class="tab-bracket tab-btn">
            <span class="btn-text-full">Knockout Bracket</span>
            <span class="btn-text-short">Knockout</span>
          </button>
          <div class="btn-action-wrapper">
            <button id="btn-simulate-toggle" class="btn-simulate-toggle btn-action btn-action-simulate">
              <span class="btn-action-icon">&#9654;</span>
              <span class="btn-action-text">Simulate</span>
            </button>
            <div class="btn-action-dropdown" id="simulate-dropdown-menu">
              <button id="btn-simulate-all" class="btn-simulate-all dropdown-item">Simulate All</button>
              <button id="btn-simulate-groups" class="btn-simulate-groups dropdown-item">Groups Only</button>
            </div>
          </div>
          <button id="btn-reset" class="btn-reset btn-action btn-action-reset">
            <span class="btn-action-icon">&times;</span>
            <span class="btn-action-text">Reset</span>
          </button>
          <button id="btn-share" class="btn-share btn-action btn-action-share">
            <span class="btn-action-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </span>
            <span class="btn-action-text">Share</span>
          </button>
          <button id="btn-download" class="btn-download btn-action btn-action-download">
            <span class="btn-action-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>
            <span class="btn-action-text">Download</span>
          </button>
        </div>
      </div>
    {/if}
    <div class="groups-brackets-holder">
      <!-- Groups Section -->
      <section id="groups-section" class="groups-section" aria-labelledby="groups-title">

        <div class="groups-layout">
          <div class="groups-grid" id="groups-grid">
            <!-- Placeholder boxes for all 12 groups to prevent CLS -->
            <div class="group-card skeleton" id="group-A">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-B">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-C">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-D">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-E">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-F">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-G">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-H">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-I">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-J">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-K">
              <div class="group-skeleton-content"></div>
            </div>
            <div class="group-card skeleton" id="group-L">
              <div class="group-skeleton-content"></div>
            </div>
          </div>
          <div class="third-place-sidebar-container">
            {if $is_desktop}
              <div class="section-header">
                <h2 id="groups-title" class="section-title">Group Stage</h2>
                <p class="section-subtitle">Enter scores for each match, or click a team to quick-select them as winner.
                  The
                  M
                  number in the Group header tells you which match the first and second team in the group goes to, while
                  the
                  P
                  number is the pathway that match falls in.</p>
              </div>
            {/if}
            <div class="third-place-sidebar" id="third-place-sidebar">
            </div>
          </div>
        </div>

        <!-- Third Place Reference Table -->
        <div class="third-place-reference" id="third-place-reference">
          <div class="reference-header">
            <h3>Third-Place Team Bracket Placement Reference</h3>
            <p>All 495 possible combinations showing which third-place teams go to which Round of 32 match</p>
          </div>
          <div class="reference-table-container" id="reference-table-container">
            <!-- Reference table dynamically inserted -->
          </div>
        </div>
      </section>

      <!-- Bracket Section -->
      <section id="bracket" class="bracket-section hidden" aria-labelledby="bracket-title">
        <div class="bracket-holder">
          <div class="section-header">
            <h2 id="bracket-title" class="section-title">Knockout Stage</h2>
            <p class="section-subtitle">Complete all group matches to reveal the bracket. Click teams to select winners.
            </p>
          </div>

          <!-- Pathway Tabs -->
          <div class="pathway-tabs">
            <button id="tab-pathway1" class="pathway-tab active">Pathway 1</button>
            <button id="tab-pathway2" class="pathway-tab">Pathway 2</button>
            <button id="tab-finals" class="pathway-tab">Finals</button>
          </div>

          <!-- Pathway 1 -->
          <div class="bracket-pathway" id="pathway1">
            <div class="bracket-container">
              <div class="bracket-side bracket-left">
                <div class="bracket-round r32-round">
                  <h3 class="round-title">Round of 32</h3>
                  <div class="matches" id="r32-left"></div>
                </div>
                <div class="bracket-round r16-round">
                  <h3 class="round-title">Round of 16</h3>
                  <div class="matches" id="r16-left"></div>
                </div>
                <div class="bracket-round qf-round">
                  <h3 class="round-title">Quarter Finals</h3>
                  <div class="matches" id="qf-left"></div>
                </div>
                <div class="bracket-round sf-round">
                  <h3 class="round-title">Semi Finals</h3>
                  <div class="matches" id="sf-left"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pathway 2 -->
          <div class="bracket-pathway hidden" id="pathway2">
            <div class="bracket-container">
              <div class="bracket-side bracket-right">
                <div class="bracket-round r32-round">
                  <h3 class="round-title">Round of 32</h3>
                  <div class="matches" id="r32-right"></div>
                </div>
                <div class="bracket-round r16-round">
                  <h3 class="round-title">Round of 16</h3>
                  <div class="matches" id="r16-right"></div>
                </div>
                <div class="bracket-round qf-round">
                  <h3 class="round-title">Quarter Finals</h3>
                  <div class="matches" id="qf-right"></div>
                </div>
                <div class="bracket-round sf-round">
                  <h3 class="round-title">Semi Finals</h3>
                  <div class="matches" id="sf-right"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Finals Section -->
          <div class="bracket-pathway hidden" id="finals-pathway">
            <!-- Final Match with Gold Background -->
            <div class="bracket-finals final-gold">
              <h3 class="round-title final-title">Final</h3>
              <div class="finals-row">
                <div class="final-team-slot" id="final-team-1"></div>

                <div class="champion-display" id="champion-display">
                  <h3 class="champion-title">World Champion</h3>
                  <div class="champion-team" id="champion-team"></div>
                </div>

                <div class="final-team-slot" id="final-team-2"></div>
              </div>
              <div class="matches hidden" id="final"></div>
            </div>

            <!-- Third Place Match with Bronze Background -->
            <div class="bracket-finals third-place-bronze">
              <div class="bracket-round third-place-round">
                <h3 class="round-title">Third Place</h3>
                <div class="matches" id="third-place"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Stats Section -->
  <section class="stats-section" id="stats">
    <h2 class="section-title">Tournament Statistics</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value" id="stat-matches-played">0</div>
        <div class="stat-label">Matches Predicted</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="stat-teams-remaining">48</div>
        <div class="stat-label">Teams Remaining</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="stat-goals-scored">0</div>
        <div class="stat-label">Total Goals</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="stat-completion">0%</div>
        <div class="stat-label">Completion</div>
      </div>
    </div>
  </section>

</main>

<!-- Share Modal -->
<div class="modal-overlay" id="share-modal" aria-hidden="true">
  <div class="modal modal-small">
    <div class="modal-header">
      <h3 class="modal-title">Share Your Prediction</h3>
      <button class="modal-close" id="share-modal-close">&times;</button>
    </div>
    <div class="modal-content download-options">
      <button class="download-option-btn" data-share-image="groups">
        <span class="download-option-title">Group Stage</span>
        <span class="download-option-desc">All 12 groups with standings &amp; match results</span>
      </button>
      <button class="download-option-btn" data-share-image="bracket">
        <span class="download-option-title">Knockout Stage</span>
        <span class="download-option-desc">Round of 32 through to the Final</span>
      </button>
      <button class="download-option-btn" data-share-image="full">
        <span class="download-option-title">Full Tournament</span>
        <span class="download-option-desc">Groups, standings &amp; knockout bracket combined</span>
      </button>
    </div>
  </div>
</div>

<!-- Download Modal -->
<div class="modal-overlay" id="download-modal" aria-hidden="true">
  <div class="modal modal-small">
    <div class="modal-header">
      <h3 class="modal-title">Download Bracket</h3>
      <button class="modal-close" id="download-modal-close">&times;</button>
    </div>
    <div class="modal-content download-options">
      <button class="download-option-btn" data-download="groups">
        <span class="download-option-title">Group Stage</span>
        <span class="download-option-desc">All 12 groups with standings &amp; match results</span>
      </button>
      <button class="download-option-btn" data-download="bracket">
        <span class="download-option-title">Knockout Stage</span>
        <span class="download-option-desc">Round of 32 through to the Final</span>
      </button>
      <button class="download-option-btn" data-download="full">
        <span class="download-option-title">Full Tournament</span>
        <span class="download-option-desc">Groups, standings &amp; knockout bracket combined</span>
      </button>
    </div>
  </div>
</div>


<!-- Simulating Overlay -->
<div class="simulating-overlay" id="simulating-overlay" aria-hidden="true">
  <div class="loading-spinner"></div>
  <p class="loading-text">Simulating...</p>
</div>

<!-- Toast Container -->
<div class="toast-container" id="toast-container" aria-live="polite"></div>

<div class="loading-overlay">
  <div class="loader"></div>
  <div class="loading-overlay-text">Loading...</div>
</div>

<!-- JavaScript -->
{include file="./js.tpl"}
