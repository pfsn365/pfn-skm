<style>
  /* CSS Variables */
  :root {
    --color-primary: #0050A0;
    --color-primary-dark: #003d7a;
    --color-secondary: #fdd835;
    --color-background: #f5f5f5;
    --color-surface: #ffffff;
    --color-text: #212121;
    --color-text-secondary: #757575;
    --color-border: #e0e0e0;
    --color-success: #4caf50;
    --color-error: #f44336;
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
    --border-radius: 8px;
    --transition: 0.3s ease;
  }

  /* Skip Link */
  .tennis-sim-container .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-primary);
    color: white;
    padding: 8px 16px;
    z-index: 100;
    transition: top var(--transition);
  }

  .tennis-sim-container .skip-link:focus {
    top: 0;
  }

  /* Title Banner */
  .tennis-sim-container .title-banner {
    padding: 1.5rem 2rem;
    background: var(--color-background);
  }

  .tennis-sim-container .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    max-width: 1240px;
    margin: 0 auto;
  }

  .tennis-sim-container .title-line {
    width: 100px;
    height: 6px;
    background: linear-gradient(90deg, transparent 0%, #172B4D 100%);
    border-radius: 3px;
  }

  .tennis-sim-container .title-line:last-child {
    background: linear-gradient(90deg, #172B4D 0%, transparent 100%);
  }

  .tennis-sim-container .title-text {
    font-size: 1.75rem;
    font-weight: 700;
    color: #172B4D;
    letter-spacing: 0.5px;
    text-align: center;
    margin: 0;
  }

  /* Hero Section */
  .tennis-sim-container .hero {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
  }

  .tennis-sim-container .hero-title {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .tennis-sim-container .hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
  }

  /* Tab Navigation */
  .tennis-sim-container .tab-nav {
    background: var(--color-surface);
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--color-border);
  }

  .tennis-sim-container .tab-nav-row {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .tennis-sim-container .tab-btn {
    background: none;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: var(--border-radius);
    transition: all var(--transition);
  }

  .tennis-sim-container .tab-btn.active {
    background: var(--color-primary);
    color: white;
  }

  .tennis-sim-container .tab-nav-divider {
    width: 1px;
    height: 24px;
    background: var(--color-border);
  }

  .tennis-sim-container .btn-action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
  }

  .tennis-sim-container .btn-action-simulate {
    background: rgba(0, 80, 160, 0.1);
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
  }

  .tennis-sim-container .btn-action-simulate:hover {
    background: rgba(0, 80, 160, 0.2);
  }

  .tennis-sim-container .btn-action-reset {
    background: rgba(185, 28, 28, 0.1);
    border: 2px solid #B91C1C;
    color: #B91C1C;
  }

  .tennis-sim-container .btn-action-reset:hover {
    background: rgba(185, 28, 28, 0.2);
  }

  .tennis-sim-container .btn-action-seeds {
    background: rgba(255, 209, 102, 0.15);
    border: 2px solid #FFD166;
    color: #333;
  }

  .tennis-sim-container .btn-action-seeds:hover {
    background: rgba(255, 209, 102, 0.3);
  }

  /* Dropdown */
  .tennis-sim-container .btn-dropdown {
    position: relative;
  }

  .tennis-sim-container .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    min-width: 120px;
    z-index: 10;
    display: none;
  }

  .tennis-sim-container .dropdown-menu.active {
    display: block;
  }

  .tennis-sim-container .dropdown-item {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    background: none;
    text-align: left;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background var(--transition);
  }

  .tennis-sim-container .dropdown-item:hover {
    background: var(--color-background);
  }

  .tennis-sim-container .dropdown-item:first-child {
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }

  .tennis-sim-container .dropdown-item:last-child {
    border-radius: 0 0 var(--border-radius) var(--border-radius);
  }

  /* Modal */
  .tennis-sim-container .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition);
  }

  .tennis-sim-container .modal-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .tennis-sim-container #seeds-modal .modal {
    max-height: unset;
  }

  .tennis-sim-container #seeds-modal .modal .modal-content {
    max-height: 50vh;
  }

  .tennis-sim-container .modal {
    background: var(--color-surface);
    border-radius: var(--border-radius);
    max-width: 900px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  .tennis-sim-container .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .tennis-sim-container .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .tennis-sim-container .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text-secondary);
  }

  .tennis-sim-container .modal-close:hover {
    color: var(--color-text);
  }

  .tennis-sim-container .modal-content {
    padding: 1rem;
    overflow-y: auto;
    max-height: 80vh;
  }

  .tennis-sim-container .seeds-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  @media (max-width: 600px) {
    .tennis-sim-container .seeds-grid {
      grid-template-columns: 1fr;
    }
  }

  .tennis-sim-container .seed-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.6rem;
    background: var(--color-background);
    border-radius: 4px;
    font-size: 0.85rem;
  }

  /* Download Modal */
  .tennis-sim-container .modal-small {
    max-width: 400px;
  }

  .tennis-sim-container .download-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .tennis-sim-container .download-option-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    background: var(--color-background);
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all var(--transition);
    text-align: left;
  }

  .tennis-sim-container .download-option-btn:hover {
    border-color: var(--color-primary);
    background: rgba(0, 80, 160, 0.05);
  }

  .tennis-sim-container .download-option-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .tennis-sim-container .download-option-desc {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin-top: 0.25rem;
  }

  .tennis-sim-container .seed-number {
    font-weight: 600;
    color: var(--color-primary);
    min-width: 1.5rem;
  }

  .tennis-sim-container .seed-flag {
    width: 20px;
    height: 14px;
    object-fit: cover;
    border-radius: 2px;
  }

  .tennis-sim-container .seed-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tennis-sim-container .seed-section {
    font-size: 0.75rem;
    font-weight: 500;
    color: #fff;
    background: var(--color-primary);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    margin-left: 0.25rem;
  }

  .tennis-sim-container .btn-text-short {
    display: none;
  }

  /* Main Content */
  .tennis-sim-container .main {
    min-height: 100vh;
    padding-bottom: 100px;
  }

  /* Section Styles */
  .tennis-sim-container .section-header {
    text-align: center;
    padding: 2rem;
  }

  .tennis-sim-container .section-title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .tennis-sim-container .section-subtitle {
    color: var(--color-text-secondary);
  }

  /* Bracket Area */
  .tennis-sim-container .bracket-area {
    display: flex;
    gap: 1rem;
  }

  /* Action Buttons */
  .tennis-sim-container .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 3.5rem;
  }

  .tennis-sim-container .btn-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    width: 80px;
  }

  .tennis-sim-container .btn-action-icon {
    font-size: 1.2rem;
  }

  .tennis-sim-container .btn-action-text {
    font-size: 0.7rem;
  }

  /* Bracket Section */
  .tennis-sim-container .bracket-section {
    padding-top: 0;
  }

  .tennis-sim-container .bracket-wrapper {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 1rem;
    box-shadow: var(--shadow-sm);
    width: 100%;
    margin: 0 auto;
  }

  .tennis-sim-container .bracket-header {
    background: var(--color-primary);
    padding: 1rem;
    margin: -1rem -1rem 0 -1rem;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }

  .tennis-sim-container .main .header-logo {
    display: block;
    width: 40px;
    height: 40px;
    object-fit: contain;
    position: absolute;
    left: 0;
    top: 0;
  }

  /* Gender Toggle */
  .tennis-sim-container .gender-toggle {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tennis-sim-container .gender-btn {
    padding: 0.5rem 1.5rem;
    border: 2px solid #fff;
    background: #fff;
    color: var(--color-primary);
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
    min-width: 100px;
    text-align: center;
  }

  .tennis-sim-container .gender-btn:hover {
    background: #FFD166;
    border-color: #FFD166;
    color: #333;
  }

  .tennis-sim-container .gender-btn.active {
    background: #FFD166;
    border-color: #FFD166;
    color: #333;
  }

  .tennis-sim-container .stats-share-row {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    position: relative;
  }

  .tennis-sim-container .stats-share-row .stats-inline {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .tennis-sim-container .stats-share-row .share-bar {
    margin-left: auto;
  }

  .tennis-sim-container .share-bar {
    display: flex;
    gap: 0.5rem;
  }

  .tennis-sim-container .btn-share {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: 500;
    border: 2px solid var(--color-primary);
    background: transparent;
    color: var(--color-primary);
    border-radius: 50px;
    cursor: pointer;
    transition: all var(--transition);
  }

  .tennis-sim-container .btn-share:hover {
    background: var(--color-primary);
    color: white;
  }

  .tennis-sim-container .btn-share-icon {
    font-size: 1rem;
  }

  .tennis-sim-container .btn-share-icon-img {
    width: 16px;
    height: 16px;
  }

  .tennis-sim-container .bracket-container {
    overflow-x: auto;
    display: flex;
    justify-content: center;
    flex: 1;
  }

  /* Section Tabs */
  .tennis-sim-container .section-tabs {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0 1rem;
  }

  .tennis-sim-container .section-tab {
    padding: 0.5rem 1.2rem;
    border: 2px solid #fff;
    background: #fff;
    color: var(--color-primary);
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
  }

  .tennis-sim-container .section-tab:hover {
    background: #FFD166;
    border-color: #FFD166;
    color: #333;
  }

  .tennis-sim-container .section-tab.active {
    background: #FFD166;
    border-color: #FFD166;
    color: #333;
  }

  .tennis-sim-container .section-tab-finals {
    min-width: 95px;
    text-align: center;
  }

  /* Section Bracket */
  .tennis-sim-container .section-bracket {
    display: none;
    width: 100%;
  }

  .tennis-sim-container .section-bracket.active {
    display: flex;
    justify-content: center;
  }

  /* Bracket Layout */
  .tennis-sim-container .bracket-rounds {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  .tennis-sim-container .bracket-round {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 225px;
  }

  .tennis-sim-container .round-header {
    text-align: center;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--color-primary);
    margin-bottom: 0.5rem;
  }

  .tennis-sim-container .round-matches {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
    gap: 0.5rem;
  }

  /* Match Card */
  .tennis-sim-container .match-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: all var(--transition);
  }

  .tennis-sim-container .match-card:hover {
    box-shadow: var(--shadow-sm);
  }

  .tennis-sim-container .match-card.completed {
    box-shadow: var(--shadow-sm);
  }

  .tennis-sim-container .match-player {
    display: flex;
    align-items: center;
    padding: 0.25rem 0.25rem 0.25rem 0.25rem;
    cursor: pointer;
    transition: all var(--transition);
    border-bottom: 1px solid var(--color-border);
    gap: 0.5rem;
    width: 225px;
  }

  .tennis-sim-container .match-player:last-child {
    border-bottom: none;
  }

  .tennis-sim-container .match-player:hover {
    background: rgba(0, 80, 160, 0.1);
  }

  .tennis-sim-container .match-player.winner {
    background: rgba(0, 80, 160, 0.15);
  }

  .tennis-sim-container .match-player.winner .player-name {
    font-weight: 300;
    color: var(--color-primary);
  }

  .tennis-sim-container .player-seed {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    background: var(--color-background);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    min-width: 1.5rem;
    text-align: center;
  }

  .tennis-sim-container .player-flag {
    width: 20px;
    height: 14px;
    object-fit: cover;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .tennis-sim-container .player-name {
    flex: 1;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tennis-sim-container .win-pct {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    background: var(--color-background);
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
    margin-left: auto;
    min-width: 32px;
    text-align: center;
  }

  .tennis-sim-container .match-player.winner .win-pct {
    display: none;
  }

  .tennis-sim-container .player-score {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    min-width: 1.5rem;
    text-align: center;
  }

  /* Match Number */
  .tennis-sim-container .match-number {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    text-align: center;
    padding: 0.25rem;
    background: var(--color-background);
  }

  /* Empty Slot */
  .tennis-sim-container .match-player.empty {
    color: #2D5A4A;
    font-style: italic;
    font-weight: 300;
    cursor: default;
    background: #fff;
  }

  .tennis-sim-container .match-player.empty:hover {
    background: #fff;
  }

  /* Finals Bracket */
  .tennis-sim-container .section-finals .bracket-rounds {
    justify-content: center;
  }

  .tennis-sim-container .finals-champion {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
    border-radius: var(--border-radius);
    margin-top: 2rem;
  }

  .tennis-sim-container .champion-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .tennis-sim-container .champion-name {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .tennis-sim-container .champion-firstname {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .tennis-sim-container .champion-surname {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .tennis-sim-container .champion-flag {
    margin-top: 0.5rem;
  }

  .tennis-sim-container .champion-flag .player-flag {
    width: 20px;
    height: 14px;
  }

  .tennis-sim-container .champion-name .player-flag {
    width: 32px;
    height: 22px;
  }

  /* Stats Section */
  .tennis-sim-container .stats-section {
    padding: 3rem 2rem;
    background: var(--color-surface);
  }

  .tennis-sim-container .stats-inline {
    padding: 0;
    display: flex;
  }

  .tennis-sim-container .stats-inline .stats-grid {
    gap: 0.5rem;
    display: flex;
    flex-direction: row;
    margin: 0.25rem 0 0 0;
  }

  .tennis-sim-container .stats-inline .stat-card {
    padding: 0.2rem 0.4rem;
    background: transparent;
  }

  .tennis-sim-container .stats-inline .stat-value {
    font-size: 12px;
  }

  .tennis-sim-container .stats-inline .stat-label {
    font-size: 12px;
    margin-top: 0.1rem;
  }

  .tennis-sim-container .stats-grid {
    max-width: 1000px;
    margin: 2rem auto 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .tennis-sim-container .stat-card {
    background: var(--color-background);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    text-align: center;
  }

  .tennis-sim-container .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .tennis-sim-container .stat-label {
    color: var(--color-text-secondary);
    margin-top: 0.5rem;
  }

  /* Share Section */
  .tennis-sim-container .share-section {
    padding: 3rem 2rem;
    text-align: center;
  }

  .tennis-sim-container .share-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .tennis-sim-container .btn {
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
  }

  .tennis-sim-container .btn-outline {
    background: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
  }

  .tennis-sim-container .btn-outline:hover {
    background: var(--color-primary);
    color: white;
  }

  /* Footer */
  .tennis-sim-container .footer {
    background: var(--color-text);
    color: white;
    padding: 2rem;
    text-align: center;
  }

  .tennis-sim-container .footer-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Loading Overlay */
  .tennis-sim-container .loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition);
  }

  .tennis-sim-container .loading-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .tennis-sim-container .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .tennis-sim-container .loading-text {
    color: white;
    margin-top: 1rem;
  }

  /* Toast Container */
  .tennis-sim-container .toast-container {
    position: fixed;
    bottom: 8rem;
    right: 2rem;
    z-index: 100;
  }

  /* Utility */
  .tennis-sim-container .hidden {
    display: none !important;
  }

  /* Mobile Elements - Hidden by default */
  .tennis-sim-container .section-dropdown-mobile {
    display: none;
  }

  .tennis-sim-container .action-buttons-mobile {
    display: none;
  }

  /* Mobile Dropdown Styling */
  .tennis-sim-container .section-dropdown-mobile {
    text-align: center;
  }

  .tennis-sim-container .section-select {
    width: 50%;
    padding: 0.75rem 1rem;
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    background: #fff;
    color: #333;
    border-radius: var(--border-radius);
    cursor: pointer;
    text-align: center;
  }

  .tennis-sim-container .section-select option {
    background: #fff;
    color: #333;
    text-align: left;
  }

  /* Responsive */
  @media (max-width: 900px) {

    /* Hide desktop elements */
    .tennis-sim-container .section-tabs-desktop {
      display: none;
    }

    .tennis-sim-container .action-buttons {
      display: none;
    }

    /* Show mobile elements */
    .tennis-sim-container .section-dropdown-mobile {
      display: block;
    }

    .tennis-sim-container .action-buttons-mobile {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: var(--color-background);
      margin: 0 -16px;
      z-index: 50;
    }

    .tennis-sim-container .action-buttons-mobile .btn-action {
      flex-direction: row;
      padding: 0.5rem 0.75rem;
      width: auto;
    }

    .tennis-sim-container .action-buttons-mobile .btn-action-text {
      font-size: 0.8rem;
    }

    /* Wrapper adjustments */
    .tennis-sim-container .bracket-wrapper {
      width: 100%;
      border-radius: 0;
      border-left: none;
      border-right: none;
    }

    .tennis-sim-container .bracket-section {
      padding: 0;
    }

    /* Bracket area - remove sidebar */
    .tennis-sim-container .bracket-area {
      flex-direction: column;
    }

    /* Bracket rounds flow vertically */
    .tennis-sim-container .bracket-rounds {
      flex-direction: column;
      width: 100%;
      gap: 1.5rem;
      padding: 0.5rem;
    }

    .tennis-sim-container .bracket-round {
      width: 100%;
    }

    .tennis-sim-container .match-player {
      width: 100%;
    }

    .tennis-sim-container .section-bracket.active {
      flex-direction: column;
    }

    /* Stats and share row */
    .tennis-sim-container .stats-share-row {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .tennis-sim-container .stats-share-row .stats-inline {
      position: static;
      transform: none;
    }

    .tennis-sim-container .stats-share-row .share-bar {
      margin-left: 0;
    }

    /* Title banner */
    .tennis-sim-container .title-banner {
      padding: 1rem;
    }

    .tennis-sim-container .title-text {
      font-size: 1.25rem;
    }

    .tennis-sim-container .title-line {
      width: 50px;
    }
  }
</style>
