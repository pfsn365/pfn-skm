{include file="./styles.tpl"}

<div class="tennis-sim-container">
  <!-- Main Content -->
  <div id="main-content" class="main">
    <!-- Bracket Section -->
    <section id="bracket" class="bracket-section" aria-labelledby="bracket-title">
      <!-- Bracket Wrapper -->
      <div class="bracket-wrapper">
        <!-- Bracket Header -->
        <header class="bracket-header">
          <!-- Gender Toggle -->
          <div class="gender-toggle">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-white-ver-2.png?w=40&h=40"
              alt="Logo" class="header-logo">
            <button class="gender-btn active" data-gender="men">Men's</button>
            <button class="gender-btn" data-gender="women">Women's</button>
          </div>
          <!-- Section Tabs (Desktop) -->
          <div class="section-tabs section-tabs-desktop" id="section-tabs">
            <button class="section-tab active" data-section="0">Section 1</button>
            <button class="section-tab" data-section="1">Section 2</button>
            <button class="section-tab" data-section="2">Section 3</button>
            <button class="section-tab" data-section="3">Section 4</button>
            <button class="section-tab" data-section="4">Section 5</button>
            <button class="section-tab" data-section="5">Section 6</button>
            <button class="section-tab" data-section="6">Section 7</button>
            <button class="section-tab" data-section="7">Section 8</button>
            <button class="section-tab section-tab-finals" data-section="finals">Finals</button>
          </div>
          <!-- Section Dropdown (Mobile) -->
          <div class="section-dropdown-mobile">
            <select id="section-select" class="section-select" aria-label="Select tournament section">
              <option value="0">Section 1</option>
              <option value="1">Section 2</option>
              <option value="2">Section 3</option>
              <option value="3">Section 4</option>
              <option value="4">Section 5</option>
              <option value="5">Section 6</option>
              <option value="6">Section 7</option>
              <option value="7">Section 8</option>
              <option value="finals">Finals</option>
            </select>
          </div>
        </header>

        <!-- Mobile Action Buttons -->
        <div class="action-buttons-mobile">
          <div class="btn-dropdown">
            <button id="btn-simulate-mobile" class="btn-action btn-action-simulate">
              <span class="btn-action-icon">&#9654;</span>
              <span class="btn-action-text">Simulate</span>
            </button>
            <div class="dropdown-menu" id="simulate-menu-mobile">
              <button class="dropdown-item" data-simulate="section">This Section</button>
              <button class="dropdown-item" data-simulate="all-sections">All Sections</button>
              <button class="dropdown-item" data-simulate="everything">Full Tournament</button>
            </div>
          </div>
          <button id="btn-reset-mobile" class="btn-action btn-action-reset">
            <span class="btn-action-icon">&times;</span>
            <span class="btn-action-text">Reset</span>
          </button>
          <button id="btn-seeds-mobile" class="btn-action btn-action-seeds">
            <span class="btn-action-icon">&#9733;</span>
            <span class="btn-action-text">Seeds</span>
          </button>
        </div>

        <!-- Stats and Share Row -->
        <div class="stats-share-row">
          <div class="stats-inline" id="stats">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value" id="stat-section-matches">0 / 15</div>
                <div class="stat-label">Section Matches</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="stat-matches-played">0 / 127</div>
                <div class="stat-label">Total Matches</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="stat-players-remaining">0</div>
                <div class="stat-label">Players Remaining</div>
              </div>
            </div>
          </div>
          <div class="share-bar">
            <button id="btn-download" class="btn-share">
              <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/download-icon-blue.png"
                alt="" class="btn-share-icon-img">
              Download
            </button>
            <button id="btn-copy-link" class="btn-share">
              <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/share-icon-blue.png" alt=""
                class="btn-share-icon-img">
              Share
            </button>
          </div>
        </div>

        <!-- Bracket Area with Action Buttons -->
        <div class="bracket-area">
          <!-- Action Buttons -->
          <div class="action-buttons">
            <div class="btn-dropdown">
              <button id="btn-simulate" class="btn-action btn-action-simulate">
                <span class="btn-action-icon">&#9654;</span>
                <span class="btn-action-text">Simulate</span>
              </button>
              <div class="dropdown-menu" id="simulate-menu">
                <button class="dropdown-item" data-simulate="section">This Section</button>
                <button class="dropdown-item" data-simulate="all-sections">All Sections</button>
                <button class="dropdown-item" data-simulate="everything">Full Tournament</button>
              </div>
            </div>
            <button id="btn-reset" class="btn-action btn-action-reset">
              <span class="btn-action-icon">&times;</span>
              <span class="btn-action-text">Reset</span>
            </button>
            <button id="btn-seeds" class="btn-action btn-action-seeds">
              <span class="btn-action-icon">&#9733;</span>
              <span class="btn-action-text">Seeds</span>
            </button>
          </div>

          <!-- Section Brackets Container -->
          <div class="bracket-container" id="bracket-container">
            <!-- Section brackets will be dynamically generated -->
            <div class="section-bracket active" id="section-0"></div>
            <div class="section-bracket" id="section-1"></div>
            <div class="section-bracket" id="section-2"></div>
            <div class="section-bracket" id="section-3"></div>
            <div class="section-bracket" id="section-4"></div>
            <div class="section-bracket" id="section-5"></div>
            <div class="section-bracket" id="section-6"></div>
            <div class="section-bracket" id="section-7"></div>
            <div class="section-bracket section-finals" id="section-finals"></div>
          </div>
        </div>
      </div>
    </section>

  </div>

  <!-- Seeds Modal -->
  <div class="modal-overlay" id="seeds-modal" aria-hidden="true">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Seeded Players</h3>
        <button class="modal-close" id="modal-close">&times;</button>
      </div>
      <div class="modal-content" id="seeds-list">
        <!-- Seeds will be populated by JavaScript -->
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
        <button class="download-option-btn" data-download="full">
          <span class="download-option-title">Full Tournament</span>
          <span class="download-option-desc">All players and rounds</span>
        </button>
        <button class="download-option-btn" data-download="last16">
          <span class="download-option-title">Last 16</span>
          <span class="download-option-desc">Last 16, Quarterfinals, Semifinals & Final</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Loading Overlay -->
  <div class="loading-overlay" id="loading-overlay" aria-hidden="true">
    <div class="loading-spinner"></div>
    <p class="loading-text">Simulating...</p>
  </div>

  <!-- Toast Container -->
  <div class="toast-container" id="toast-container" aria-live="polite"></div>
</div>

{include file="./js.tpl"}
