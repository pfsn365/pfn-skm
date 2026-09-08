<style>
  /* ============================================
   NASCAR Season Simulator - Styles (SKM Port)
   ============================================ */

  /* CSS Custom Properties - scoped to container */
  .nascar-predictor-container {
    /* Colors - Light Theme */
    --nascar-primary-color: #ffffff;
    --nascar-secondary-color: #f5f5f5;
    --nascar-header-color: #0050A0;
    --nascar-accent-color: #0050A0;
    --nascar-accent-hover: #003d7a;
    --nascar-success-color: #28a745;
    --nascar-warning-color: #f59e0b;
    --nascar-danger-color: #dc3545;
    --nascar-text-primary: #333333;
    --nascar-text-secondary: #666666;
    --nascar-text-dark: #333333;
    --nascar-text-light: #ffffff;
    --nascar-border-color: #dddddd;
    --nascar-card-bg: #ffffff;
    --nascar-modal-bg: #ffffff;
    --nascar-overlay-bg: rgba(0, 0, 0, 0.5);

    /* Shadows */
    --nascar-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --nascar-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
    --nascar-shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);

    /* Transitions */
    --nascar-transition-fast: 150ms ease;
    --nascar-transition-normal: 250ms ease;

    /* Spacing */
    --nascar-spacing-xs: 4px;
    --nascar-spacing-sm: 8px;
    --nascar-spacing-md: 16px;
    --nascar-spacing-lg: 24px;
    --nascar-spacing-xl: 32px;

    /* Border Radius */
    --nascar-radius-sm: 4px;
    --nascar-radius-md: 8px;
    --nascar-radius-lg: 12px;
  }

  .pfn-content-container .content.full-width {
    max-width: 1200px;
    width: 100%;
  }

  /* App Container */
  .nascar-predictor-container .app-container {
    padding: var(--nascar-spacing-md);
    padding-bottom: 116px;
    min-height: 100vh;
  }

  /* ============================================
   Header
   ============================================ */
  .nascar-predictor-container .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--nascar-spacing-lg) 0 var(--nascar-spacing-md) 0;
    margin-bottom: var(--nascar-spacing-md);
  }

  .nascar-predictor-container .title-banner {
    display: flex;
    align-items: center;
    gap: var(--nascar-spacing-lg);
    margin-bottom: var(--nascar-spacing-xs);
  }

  .nascar-predictor-container .title-banner h1 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--nascar-header-color);
    white-space: nowrap;
  }

  .nascar-predictor-container .decorative-line {
    height: 3px;
    width: 80px;
    background: var(--nascar-header-color);
  }

  .nascar-predictor-container .updated-timestamp {
    font-size: 0.75rem;
    color: var(--nascar-header-color);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }

  .nascar-predictor-container .header-actions {
    display: flex;
    gap: var(--nascar-spacing-md);
  }

  /* Small Buttons */
  .nascar-predictor-container .btn-sm {
    font-size: 0.8rem;
    padding: var(--nascar-spacing-xs) var(--nascar-spacing-md);
  }

  /* Left Column */
  .nascar-predictor-container .left-column {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
  }

  .nascar-predictor-container .left-column .races-panel {
    flex: 1;
    max-height: none;
  }

  .nascar-predictor-container .button-row {
    display: flex;
    gap: var(--nascar-spacing-sm);
    margin-bottom: var(--nascar-spacing-sm);
  }

  .nascar-predictor-container .button-row .btn {
    flex: 1;
  }

  /* ============================================
   Buttons
   ============================================ */
  .nascar-predictor-container .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-lg);
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: var(--nascar-radius-md);
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .nascar-predictor-container .btn-primary {
    background: #0050A0;
    color: #ffffff;
  }

  .nascar-predictor-container .btn-primary:hover {
    background: #003d7a;
    transform: translateY(-2px);
    box-shadow: var(--nascar-shadow-md);
  }

  .nascar-predictor-container .btn-secondary {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ef9a9a;
  }

  .nascar-predictor-container .btn-secondary:hover {
    background: #ffcdd2;
    transform: translateY(-2px);
  }

  .nascar-predictor-container .btn-simulate {
    background: var(--nascar-accent-color);
    color: #ffffff;
  }

  .nascar-predictor-container .btn-simulate:hover {
    background: var(--nascar-accent-hover);
    transform: translateY(-2px);
    box-shadow: var(--nascar-shadow-md);
  }

  .nascar-predictor-container .btn-save {
    background: #FFD166;
    color: var(--nascar-text-dark);
  }

  .nascar-predictor-container .btn-save:hover {
    background: #ffdc85;
    transform: translateY(-2px);
    box-shadow: var(--nascar-shadow-md);
  }

  .nascar-predictor-container .btn-download {
    background: #6c757d;
    color: #ffffff;
  }

  .nascar-predictor-container .btn-download:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: var(--nascar-shadow-md);
  }

  .nascar-predictor-container .btn-share {
    background: #17a2b8;
    color: #ffffff;
  }

  .nascar-predictor-container .btn-share:hover {
    background: #138496;
    transform: translateY(-2px);
    box-shadow: var(--nascar-shadow-md);
  }

  .nascar-predictor-container .mobile-only {
    display: none !important;
  }

  @media (max-width: 1024px) {
    .nascar-predictor-container .mobile-only {
      display: inline-flex !important;
    }
  }

  .nascar-predictor-container .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: var(--nascar-radius-sm);
    color: var(--nascar-text-light);
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
    flex-shrink: 0;
    margin-left: var(--nascar-spacing-md);
  }

  .nascar-predictor-container .btn-icon:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* ============================================
   Main Content Layout
   ============================================ */
  .nascar-predictor-container .main-content {
    display: grid;
    grid-template-columns: 368px 1fr;
    gap: var(--nascar-spacing-lg);
    min-height: calc(100vh - 200px);
  }

  /* ============================================
   Panels
   ============================================ */
  .nascar-predictor-container .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--nascar-spacing-md);
    background: var(--nascar-header-color);
    color: var(--nascar-text-light);
    border-radius: var(--nascar-radius-lg) var(--nascar-radius-lg) 0 0;
  }

  .nascar-predictor-container .panel-header h2 {
    font-size: 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--nascar-text-light);
  }

  .nascar-predictor-container .race-counts {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .nascar-predictor-container .race-count {
    font-size: 0.75rem;
    color: var(--nascar-text-light);
    font-weight: 500;
  }

  /* Standings Tabs */
  .nascar-predictor-container .standings-tabs {
    display: flex;
    gap: var(--nascar-spacing-sm);
    width: 100%;
  }

  .nascar-predictor-container .standings-tab {
    flex: 1;
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-md);
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid transparent;
    border-radius: var(--nascar-radius-md);
    color: var(--nascar-text-light);
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
  }

  .nascar-predictor-container .standings-tab:hover:not(.disabled) {
    background: rgba(255, 255, 255, 0.3);
    color: var(--nascar-text-light);
  }

  .nascar-predictor-container .standings-tab.active {
    background: #FFD166;
    color: var(--nascar-text-dark);
    border-color: transparent;
  }

  .nascar-predictor-container .standings-tab.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .nascar-predictor-container .standings-tab.chase-unlocked {
    background: rgba(255, 255, 255, 0.2);
    color: var(--nascar-text-light);
    border-color: transparent;
    opacity: 1;
    cursor: pointer;
  }

  .nascar-predictor-container .standings-tab.chase-unlocked:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .nascar-predictor-container .standings-tab.chase-unlocked.active {
    background: #FFD166;
    color: var(--nascar-text-dark);
  }

  /* ============================================
   Races Panel
   ============================================ */
  .nascar-predictor-container .races-panel {
    background: var(--nascar-card-bg);
    border-radius: var(--nascar-radius-lg);
    box-shadow: var(--nascar-shadow-lg);
    border: 1px solid var(--nascar-border-color);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 200px);
  }

  .nascar-predictor-container .races-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--nascar-spacing-sm);
  }

  .nascar-predictor-container .race-item {
    display: flex;
    align-items: center;
    padding: var(--nascar-spacing-md);
    padding-left: 4px;
    margin-bottom: var(--nascar-spacing-sm);
    background: #e8e8e8;
    border-radius: var(--nascar-radius-md);
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
    border-left: 4px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .nascar-predictor-container .race-item:hover {
    background: var(--nascar-border-color);
    transform: translateX(4px);
  }

  .nascar-predictor-container .race-item.completed {
    border-left-color: var(--nascar-success-color);
  }

  .nascar-predictor-container .race-item.completed::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 36px;
    height: 36px;
    background:
      linear-gradient(45deg, #000 25%, transparent 25%),
      linear-gradient(-45deg, #000 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #000 75%),
      linear-gradient(-45deg, transparent 75%, #000 75%);
    background-size: 8px 8px;
    background-color: #fff;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    border-radius: 0 var(--nascar-radius-md) 0 0;
  }

  .nascar-predictor-container .race-item.active {
    border-left-color: var(--nascar-accent-color);
    background: var(--nascar-border-color);
  }

  .nascar-predictor-container .race-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--nascar-primary-color);
    border-radius: 50%;
    font-weight: 700;
    font-size: 0.875rem;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .nascar-predictor-container .race-item.completed .race-number {
    background: var(--nascar-success-color);
  }

  .nascar-predictor-container .race-info {
    flex: 1;
    min-width: 0;
  }

  .nascar-predictor-container .race-name {
    font-weight: 600;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nascar-predictor-container .race-official-indicator {
    display: inline-block;
    background: var(--nascar-success-color);
    color: white;
    font-size: 0.6em;
    font-weight: 700;
    padding: 2px 5px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    vertical-align: middle;
    margin-left: 6px;
  }

  .nascar-predictor-container .race-official-indicator.partial {
    background: var(--nascar-warning-color);
  }

  .nascar-predictor-container .race-item.official {
    border-left: 3px solid var(--nascar-success-color);
  }

  .nascar-predictor-container .race-track {
    font-size: 0.8rem;
    color: var(--nascar-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nascar-predictor-container .race-status {
    font-size: 0.75rem;
    padding: var(--nascar-spacing-xs) var(--nascar-spacing-sm);
    border-radius: var(--nascar-radius-sm);
    font-weight: 600;
    text-transform: uppercase;
    margin-left: var(--nascar-spacing-sm);
  }

  .nascar-predictor-container .race-status.pending {
    background: var(--nascar-border-color);
    color: var(--nascar-text-secondary);
  }

  .nascar-predictor-container .race-status.completed {
    background: var(--nascar-success-color);
    color: var(--nascar-text-primary);
  }

  /* Race Section Headers */
  .nascar-predictor-container .race-section-header {
    padding: var(--nascar-spacing-md);
    margin-bottom: var(--nascar-spacing-sm);
    background: linear-gradient(90deg, #FFD166, transparent);
    border-radius: var(--nascar-radius-md);
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--nascar-text-dark);
  }

  .nascar-predictor-container .race-section-header.chase {
    background: linear-gradient(90deg, #FFD166, transparent);
    color: var(--nascar-text-dark);
    margin-top: var(--nascar-spacing-md);
  }

  /* Empty State */
  .nascar-predictor-container .empty-state {
    padding: var(--nascar-spacing-lg);
    text-align: center;
    color: var(--nascar-text-secondary);
    font-style: italic;
  }

  /* ============================================
   Standings Panel
   ============================================ */
  .nascar-predictor-container .standings-panel {
    background: var(--nascar-card-bg);
    border-radius: var(--nascar-radius-lg);
    box-shadow: var(--nascar-shadow-lg);
    border: 1px solid var(--nascar-border-color);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
  }

  .nascar-predictor-container .standings-table-container {
    flex: 1;
    overflow-y: auto;
  }

  .nascar-predictor-container .standings-table {
    width: 100%;
    border-collapse: collapse;
  }

  .nascar-predictor-container .standings-table th,
  .nascar-predictor-container .standings-table td {
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-md);
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid var(--nascar-border-color);
  }

  .nascar-predictor-container .standings-table .col-points,
  .nascar-predictor-container .standings-table .col-behind,
  .nascar-predictor-container .standings-table .col-chase-gap,
  .nascar-predictor-container .standings-table .col-wins,
  .nascar-predictor-container .standings-table .col-top5,
  .nascar-predictor-container .standings-table .col-top10 {
    text-align: center;
  }

  .nascar-predictor-container .standings-table th {
    background: var(--nascar-secondary-color);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  /* Sortable header styles */
  .nascar-predictor-container .sortable-header {
    cursor: pointer;
    user-select: none;
    transition: background var(--nascar-transition-fast);
  }

  .nascar-predictor-container .sortable-header:hover {
    background: #e8e8e8;
  }

  .nascar-predictor-container .sort-indicator {
    font-size: 0.65rem;
    margin-left: 4px;
    opacity: 0.3;
    transition: opacity var(--nascar-transition-fast);
  }

  .nascar-predictor-container .sort-indicator.active {
    opacity: 1;
    color: var(--nascar-accent-color);
  }

  .nascar-predictor-container .sortable-header:hover .sort-indicator {
    opacity: 0.7;
  }

  .nascar-predictor-container .standings-table tbody tr {
    transition: background var(--nascar-transition-fast);
  }

  .nascar-predictor-container .standings-table tbody tr:hover {
    background: var(--nascar-secondary-color);
  }

  .nascar-predictor-container .col-pos {
    width: 35px;
    text-align: center;
    font-weight: 700;
  }

  .nascar-predictor-container .col-driver {
    min-width: 150px;
  }

  .nascar-predictor-container .col-number {
    width: 60px;
    text-align: center;
  }

  .nascar-predictor-container .col-points {
    width: 80px;
    text-align: center;
    font-weight: 700;
    color: var(--nascar-accent-color);
  }

  .nascar-predictor-container .col-behind {
    width: 70px;
    text-align: center;
    color: var(--nascar-text-secondary);
  }

  .nascar-predictor-container .col-chase-gap {
    width: 70px;
    text-align: center;
  }

  /* Hide chase gap column in chase standings view */
  .nascar-predictor-container .standings-table.chase-view .col-chase-gap {
    display: none;
  }

  .nascar-predictor-container .chase-ahead {
    color: var(--nascar-success-color);
    font-weight: 600;
  }

  .nascar-predictor-container .chase-behind {
    color: var(--nascar-danger-color);
    font-weight: 600;
  }

  .nascar-predictor-container .chase-line {
    color: var(--nascar-text-secondary);
    font-weight: 600;
  }

  .nascar-predictor-container .col-wins,
  .nascar-predictor-container .col-top5,
  .nascar-predictor-container .col-top10 {
    width: 70px;
    text-align: center;
  }

  .nascar-predictor-container .driver-cell {
    display: flex;
    align-items: center;
    gap: var(--nascar-spacing-sm);
  }

  .nascar-predictor-container .driver-number {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--nascar-accent-color);
    color: #ffffff;
    border-radius: var(--nascar-radius-sm);
    font-weight: 700;
    font-size: 0.8rem;
  }

  .nascar-predictor-container .driver-logo {
    width: 28px;
    height: 28px;
    object-fit: contain;
    border-radius: var(--nascar-radius-sm);
  }

  /* Chase Qualifier Badge */
  .nascar-predictor-container .chase-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: var(--nascar-success-color);
    color: var(--nascar-text-primary);
    border-radius: 50%;
    font-size: 0.65rem;
    font-weight: 700;
    margin-left: var(--nascar-spacing-xs);
  }

  .nascar-predictor-container .standings-table tbody tr.chase-qualifier {
    background: rgba(40, 167, 69, 0.1);
  }

  .nascar-predictor-container .standings-table tbody tr.chase-qualifier:hover {
    background: rgba(40, 167, 69, 0.2);
  }

  /* ============================================
   Modal
   ============================================ */
  .nascar-predictor-container .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--nascar-overlay-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    opacity: 0;
    visibility: hidden;
    transition: all var(--nascar-transition-normal);
  }

  .nascar-predictor-container .modal-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .nascar-predictor-container .modal {
    background: var(--nascar-modal-bg);
    border-radius: var(--nascar-radius-lg);
    box-shadow: var(--nascar-shadow-lg);
    max-width: 1100px;
    width: 95%;
    max-height: calc(60vh - 25px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    transform: scale(0.9);
    transition: transform var(--nascar-transition-normal);
  }

  .nascar-predictor-container .race-modal {
    max-height: calc(80vh - 25px);
  }

  .nascar-predictor-container .modal-overlay.active .modal {
    transform: scale(1);
  }

  .nascar-predictor-container .modal-header {
    padding: var(--nascar-spacing-md) var(--nascar-spacing-lg);
    background: var(--nascar-secondary-color);
    border-bottom: 2px solid var(--nascar-accent-color);
    border-radius: var(--nascar-radius-lg) var(--nascar-radius-lg) 0 0;
    position: relative;
  }

  .nascar-predictor-container .modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    padding-right: 40px;
  }

  .nascar-predictor-container .modal-title .modal-track {
    font-size: 0.6em;
    font-weight: 500;
    color: var(--nascar-text-secondary);
  }

  .nascar-predictor-container .official-badge {
    display: inline-block;
    background: var(--nascar-success-color);
    color: white;
    font-size: 0.5em;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    vertical-align: middle;
    margin-left: 8px;
  }

  .nascar-predictor-container .official-badge.partial {
    background: var(--nascar-warning-color);
  }

  .nascar-predictor-container .modal-overlay.official-results .modal-footer .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .nascar-predictor-container .tab-btn.tab-official::after {
    content: '\2713';
    margin-left: 4px;
    font-size: 10px;
    opacity: 0.7;
  }

  .nascar-predictor-container .tab-btn.tab-official {
    opacity: 0.7;
    cursor: default;
  }

  .nascar-predictor-container .modal-close {
    position: absolute;
    top: var(--nascar-spacing-md);
    right: var(--nascar-spacing-md);
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--nascar-card-bg);
    border: none;
    border-radius: 50%;
    color: var(--nascar-text-primary);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
  }

  .nascar-predictor-container .modal-close:hover {
    background: var(--nascar-danger-color);
    transform: rotate(90deg);
  }

  /* Race Info Button */
  .nascar-predictor-container .btn-race-info {
    position: absolute;
    top: var(--nascar-spacing-md);
    right: 60px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--nascar-accent-color);
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
  }

  .nascar-predictor-container .btn-race-info:hover {
    background: var(--nascar-accent-hover);
    transform: scale(1.1);
  }

  /* Scoring Info Button */
  .nascar-predictor-container .btn-scoring-info {
    background: transparent;
    border: none;
    color: var(--nascar-text-secondary);
    cursor: pointer;
    padding: 2px;
    margin-left: 4px;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all var(--nascar-transition-fast);
  }

  .nascar-predictor-container .btn-scoring-info:hover {
    color: var(--nascar-accent-color);
    background: rgba(0, 80, 160, 0.1);
  }

  .nascar-predictor-container .btn-scoring-info svg {
    display: block;
  }

  /* Race Info Popup */
  .nascar-predictor-container .race-info-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    padding: var(--nascar-spacing-md);
  }

  .nascar-predictor-container .race-info-popup {
    background: #fff;
    border-radius: var(--nascar-radius-lg);
    max-width: 600px;
    width: 100%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .nascar-predictor-container .race-info-header {
    background: var(--nascar-accent-color);
    color: #fff;
    padding: var(--nascar-spacing-md) var(--nascar-spacing-lg);
  }

  .nascar-predictor-container .race-info-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .nascar-predictor-container .race-info-content {
    padding: var(--nascar-spacing-lg);
  }

  .nascar-predictor-container .race-info-row {
    display: flex;
    justify-content: space-between;
    padding: var(--nascar-spacing-sm) 0;
    border-bottom: 1px solid var(--nascar-border-color);
  }

  .nascar-predictor-container .race-info-row:last-child {
    border-bottom: none;
  }

  .nascar-predictor-container .race-info-label {
    color: var(--nascar-text-secondary);
    font-weight: 500;
  }

  .nascar-predictor-container .race-info-value {
    color: var(--nascar-text-primary);
    font-weight: 600;
    text-align: right;
  }

  .nascar-predictor-container .race-info-footer {
    padding: var(--nascar-spacing-md) var(--nascar-spacing-lg);
    background: var(--nascar-secondary-color);
    text-align: center;
  }

  .nascar-predictor-container .race-info-close {
    background: var(--nascar-accent-color);
    color: #fff;
    border: none;
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-xl);
    border-radius: var(--nascar-radius-md);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }

  .nascar-predictor-container .race-info-close:hover {
    background: var(--nascar-accent-hover);
  }

  /* Driver Modal */
  .nascar-predictor-container .driver-row {
    cursor: pointer;
    transition: background var(--nascar-transition-fast);
  }

  .nascar-predictor-container .driver-row:hover {
    background: rgba(0, 80, 160, 0.05);
  }

  .nascar-predictor-container .driver-modal-popup {
    background: #fff;
    border-radius: 12px;
    max-width: 600px;
    width: 95%;
    max-height: calc(85vh - 100px);
    margin-bottom: 100px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .nascar-predictor-container .driver-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 20px;
    background: var(--nascar-accent-color);
    color: #fff;
  }

  .nascar-predictor-container .driver-modal-identity {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nascar-predictor-container .driver-modal-logo {
    width: 50px;
    height: 50px;
    object-fit: contain;
    background: #fff;
    border-radius: 8px;
    padding: 4px;
  }

  .nascar-predictor-container .driver-modal-name {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .nascar-predictor-container .driver-modal-details {
    display: flex;
    gap: 12px;
    font-size: 0.85rem;
    opacity: 0.9;
    margin-top: 4px;
  }

  .nascar-predictor-container .driver-modal-number {
    font-weight: 600;
  }

  .nascar-predictor-container .driver-modal-close {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 8px;
    line-height: 1;
    opacity: 0.8;
    transition: opacity var(--nascar-transition-fast);
  }

  .nascar-predictor-container .driver-modal-close:hover {
    opacity: 1;
  }

  .nascar-predictor-container .driver-modal-stats {
    display: flex;
    justify-content: space-around;
    padding: 16px;
    background: var(--nascar-secondary-color);
    border-bottom: 1px solid var(--nascar-border-color);
  }

  .nascar-predictor-container .driver-stat {
    text-align: center;
  }

  .nascar-predictor-container .driver-stat .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--nascar-accent-color);
  }

  .nascar-predictor-container .driver-stat .stat-label {
    font-size: 0.75rem;
    color: var(--nascar-text-secondary);
    text-transform: uppercase;
  }

  .nascar-predictor-container .driver-modal-results {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .nascar-predictor-container .driver-results-title {
    margin: 0 0 12px 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--nascar-text-dark);
    border-bottom: 2px solid var(--nascar-accent-color);
    padding-bottom: 8px;
  }

  .nascar-predictor-container .driver-results-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nascar-predictor-container .driver-result-row {
    display: grid;
    grid-template-columns: 30px 1fr 60px 70px;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    align-items: center;
  }

  .nascar-predictor-container .driver-result-row.header-row {
    background: #f5f5f5;
    font-weight: 600;
    color: var(--nascar-text-secondary);
    font-size: 0.75rem;
    text-transform: uppercase;
    position: sticky;
    top: -16px;
    z-index: 10;
    margin: -8px 0 4px 0;
    border-radius: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .nascar-predictor-container .driver-result-row.header-row .result-position,
  .nascar-predictor-container .driver-result-row.header-row .result-points {
    text-align: center;
    font-size: inherit;
  }

  .nascar-predictor-container .driver-result-row.chase-race {
    border-left: 3px solid var(--nascar-accent-color);
  }

  .nascar-predictor-container .driver-result-row.no-result {
    background: #f8f8f8;
    color: var(--nascar-text-secondary);
  }

  .nascar-predictor-container .driver-result-row.not-available {
    background: #f0f0f0;
    color: #999;
  }

  .nascar-predictor-container .driver-result-row.finished {
    background: #f5f5f5;
  }

  .nascar-predictor-container .driver-result-row.top10 {
    background: #e8f4fc;
  }

  .nascar-predictor-container .driver-result-row.top5 {
    background: #d4edda;
  }

  .nascar-predictor-container .driver-result-row.win {
    background: #fff3cd;
    font-weight: 600;
  }

  .nascar-predictor-container .result-race-num {
    font-weight: 600;
    color: var(--nascar-text-secondary);
  }

  .nascar-predictor-container .result-race-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nascar-predictor-container .result-position {
    font-weight: 600;
    text-align: center;
  }

  .nascar-predictor-container .result-points {
    text-align: center;
    color: var(--nascar-text-secondary);
    font-size: 0.8rem;
  }

  .nascar-predictor-container .driver-modal-close-btn {
    display: block;
    margin: 16px auto;
    background: var(--nascar-accent-color);
    color: #fff;
    border: none;
    padding: 10px 28px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
  }

  .nascar-predictor-container .driver-modal-close-btn:hover {
    background: var(--nascar-accent-hover);
  }

  .nascar-predictor-container .driver-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
  }

  /* Modal Tabs */
  .nascar-predictor-container .modal-tabs {
    display: flex;
    background: var(--nascar-secondary-color);
    border-bottom: 1px solid var(--nascar-border-color);
  }

  .nascar-predictor-container .tab-btn {
    flex: 1;
    padding: var(--nascar-spacing-md);
    background: none;
    border: none;
    color: var(--nascar-text-secondary);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
    position: relative;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .nascar-predictor-container .tab-btn:hover {
    color: var(--nascar-text-primary);
    background: var(--nascar-card-bg);
  }

  .nascar-predictor-container .tab-btn.active {
    color: var(--nascar-accent-color);
    background: var(--nascar-modal-bg);
  }

  .nascar-predictor-container .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--nascar-accent-color);
  }

  /* Modal Content */
  .nascar-predictor-container .modal-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--nascar-spacing-lg);
  }

  .nascar-predictor-container .tab-content {
    display: none;
  }

  .nascar-predictor-container .tab-content.active {
    display: block;
  }

  .nascar-predictor-container .stage-info {
    margin-bottom: var(--nascar-spacing-sm);
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-md);
    background: var(--nascar-secondary-color);
    border-radius: var(--nascar-radius-md);
    border-left: 4px solid var(--nascar-accent-color);
  }

  .nascar-predictor-container .stage-info p {
    color: var(--nascar-text-secondary);
    font-size: 0.95rem;
  }

  /* Tab Info Button */
  .nascar-predictor-container .tab-info-btn {
    display: none;
    width: 16px;
    height: 16px;
    margin-left: 6px;
    border-radius: 50%;
    background: var(--nascar-accent-color);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    font-style: italic;
    line-height: 16px;
    text-align: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .nascar-predictor-container .tab-info-btn:hover {
    background: var(--nascar-primary-color);
  }

  /* Info Message Popup */
  .nascar-predictor-container .info-message-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: var(--nascar-spacing-md);
  }

  .nascar-predictor-container .info-message {
    background: #fff;
    border-radius: var(--nascar-radius-lg);
    padding: var(--nascar-spacing-lg);
    max-width: 300px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .nascar-predictor-container .info-message-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto var(--nascar-spacing-sm);
    border-radius: 50%;
    background: var(--nascar-accent-color);
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    font-style: italic;
    line-height: 40px;
  }

  .nascar-predictor-container .info-message-title {
    color: var(--nascar-primary-color);
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 var(--nascar-spacing-sm) 0;
  }

  .nascar-predictor-container .info-message-text {
    color: var(--nascar-text-primary);
    font-size: 1rem;
    margin-bottom: var(--nascar-spacing-lg);
    line-height: 1.5;
  }

  .nascar-predictor-container .info-message-close {
    background: var(--nascar-primary-color);
    color: #fff;
    border: none;
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-xl);
    border-radius: var(--nascar-radius-md);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }

  .nascar-predictor-container .info-message-close:hover {
    background: var(--nascar-accent-hover);
  }

  /* Position List - 4 Column Drag & Drop */
  .nascar-predictor-container .position-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--nascar-spacing-md);
  }

  .nascar-predictor-container .position-column {
    display: flex;
    flex-direction: column;
    gap: var(--nascar-spacing-xs);
  }

  .nascar-predictor-container .position-column-header {
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--nascar-text-secondary);
    text-align: center;
    padding: var(--nascar-spacing-sm);
    border-bottom: 2px solid var(--nascar-border-color);
    margin-bottom: var(--nascar-spacing-xs);
  }

  .nascar-predictor-container .position-slot {
    display: flex;
    align-items: center;
    gap: var(--nascar-spacing-sm);
    padding: var(--nascar-spacing-xs) var(--nascar-spacing-sm);
    background: var(--nascar-secondary-color);
    border-radius: var(--nascar-radius-sm);
    min-height: 36px;
    border: 2px solid transparent;
    transition: all var(--nascar-transition-fast);
  }

  .nascar-predictor-container .position-slot.drag-over {
    border-color: var(--nascar-accent-color);
    background: rgba(255, 193, 7, 0.2);
  }

  .nascar-predictor-container .position-slot.top-10 {
    background: rgba(255, 193, 7, 0.15);
  }

  .nascar-predictor-container .position-label {
    width: 24px;
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--nascar-accent-color);
    text-align: center;
    flex-shrink: 0;
  }

  .nascar-predictor-container .driver-chip {
    display: flex;
    align-items: center;
    gap: var(--nascar-spacing-xs);
    padding: 4px 8px;
    background: var(--nascar-card-bg);
    border-radius: var(--nascar-radius-sm);
    cursor: grab;
    flex: 1;
    min-width: 0;
    border: 1px solid var(--nascar-border-color);
    transition: all var(--nascar-transition-fast);
  }

  .nascar-predictor-container .driver-chip:hover {
    border-color: var(--nascar-accent-color);
    background: var(--nascar-border-color);
  }

  .nascar-predictor-container .driver-chip:active {
    cursor: grabbing;
  }

  .nascar-predictor-container .driver-chip.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  /* Touch drag clone styling */
  .nascar-predictor-container .touch-drag-clone {
    background: var(--nascar-card-bg);
    border: 2px solid var(--nascar-accent-color);
    border-radius: var(--nascar-radius-sm);
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: var(--nascar-spacing-xs);
  }

  .nascar-predictor-container .driver-chip .chip-number {
    font-weight: 700;
    font-size: 0.75rem;
    color: var(--nascar-accent-color);
    min-width: 20px;
  }

  .nascar-predictor-container .driver-chip .chip-logo {
    width: 20px;
    height: 20px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .nascar-predictor-container .driver-chip .chip-name {
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nascar-predictor-container .position-slot.empty {
    cursor: pointer;
  }

  .nascar-predictor-container .position-slot.empty:hover {
    background: var(--nascar-border-color);
  }

  .nascar-predictor-container .position-slot.empty .driver-chip {
    background: transparent;
    border: 1px dashed var(--nascar-border-color);
    color: var(--nascar-text-secondary);
    cursor: pointer;
  }

  .nascar-predictor-container .position-slot.empty:hover .driver-chip {
    border-color: var(--nascar-accent-color);
    color: var(--nascar-accent-color);
  }

  /* Driver Picker Dropdown */
  .nascar-predictor-container .driver-picker {
    position: absolute;
    z-index: 100;
    background: var(--nascar-card-bg);
    border: 1px solid var(--nascar-border-color);
    border-radius: var(--nascar-radius-md);
    box-shadow: var(--nascar-shadow-lg);
    min-width: 200px;
    max-width: 280px;
    max-height: 300px;
    display: flex;
    flex-direction: column;
  }

  .nascar-predictor-container .driver-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-md);
    background: var(--nascar-secondary-color);
    border-bottom: 1px solid var(--nascar-border-color);
    border-radius: var(--nascar-radius-md) var(--nascar-radius-md) 0 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--nascar-accent-color);
  }

  .nascar-predictor-container .driver-picker-search {
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-md);
    border-bottom: 1px solid var(--nascar-border-color);
  }

  .nascar-predictor-container .picker-search-input {
    width: 100%;
    padding: var(--nascar-spacing-sm);
    border: 1px solid var(--nascar-border-color);
    border-radius: var(--nascar-radius-sm);
    font-size: 16px;
    outline: none;
  }

  .nascar-predictor-container .picker-search-input:focus {
    border-color: var(--nascar-accent-color);
  }

  .nascar-predictor-container .picker-close {
    background: none;
    border: none;
    color: var(--nascar-text-secondary);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .nascar-predictor-container .picker-close:hover {
    color: var(--nascar-danger-color);
  }

  .nascar-predictor-container .driver-picker-list {
    overflow-y: auto;
    flex: 1;
  }

  .nascar-predictor-container .picker-item {
    display: flex;
    align-items: center;
    gap: var(--nascar-spacing-sm);
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-md);
    cursor: pointer;
    transition: background var(--nascar-transition-fast);
    border-bottom: 1px solid var(--nascar-border-color);
  }

  .nascar-predictor-container .picker-item:last-child {
    border-bottom: none;
  }

  .nascar-predictor-container .picker-item:hover {
    background: var(--nascar-secondary-color);
  }

  .nascar-predictor-container .picker-number {
    font-weight: 700;
    font-size: 0.8rem;
    color: var(--nascar-accent-color);
    min-width: 30px;
  }

  .nascar-predictor-container .picker-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .nascar-predictor-container .picker-name {
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nascar-predictor-container .picker-no-results {
    display: none;
    padding: var(--nascar-spacing-md);
    text-align: center;
    color: var(--nascar-text-secondary);
    font-style: italic;
    font-size: 0.85rem;
  }

  /* Fastest Lap Selector */
  .nascar-predictor-container .fastest-lap-selector {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--nascar-spacing-sm);
  }

  .nascar-predictor-container .driver-option {
    display: flex;
    align-items: center;
    gap: var(--nascar-spacing-sm);
    padding: var(--nascar-spacing-md);
    background: var(--nascar-secondary-color);
    border: 2px solid transparent;
    border-radius: var(--nascar-radius-md);
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
  }

  .nascar-predictor-container .driver-option:hover {
    background: var(--nascar-border-color);
    border-color: var(--nascar-border-color);
  }

  .nascar-predictor-container .driver-option.selected {
    background: rgba(255, 193, 7, 0.2);
    border-color: var(--nascar-accent-color);
  }

  .nascar-predictor-container .driver-option .driver-num {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--nascar-accent-color);
    color: var(--nascar-text-dark);
    border-radius: var(--nascar-radius-sm);
    font-weight: 700;
    font-size: 0.85rem;
  }

  .nascar-predictor-container .driver-option .driver-logo-option {
    width: 32px;
    height: 32px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .nascar-predictor-container .driver-option .driver-name {
    flex: 1;
    font-weight: 500;
  }

  /* Modal Footer */
  .nascar-predictor-container .modal-footer {
    padding: var(--nascar-spacing-lg);
    background: var(--nascar-secondary-color);
    border-top: 1px solid var(--nascar-border-color);
    border-radius: 0 0 var(--nascar-radius-lg) var(--nascar-radius-lg);
    display: flex;
    justify-content: flex-end;
    gap: var(--nascar-spacing-md);
  }

  /* Simulate Modal */
  .nascar-predictor-container .simulate-modal {
    max-width: 400px;
    margin-bottom: 0;
  }

  .nascar-predictor-container .simulate-options {
    padding: var(--nascar-spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--nascar-spacing-md);
  }

  .nascar-predictor-container .simulate-option {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--nascar-spacing-lg);
    background: var(--nascar-secondary-color);
    border: 2px solid var(--nascar-border-color);
    border-radius: var(--nascar-radius-md);
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
    text-align: left;
  }

  .nascar-predictor-container .simulate-option:hover {
    border-color: var(--nascar-accent-color);
    background: var(--nascar-card-bg);
    transform: translateX(4px);
  }

  .nascar-predictor-container .simulate-option .option-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--nascar-text-primary);
    margin-bottom: var(--nascar-spacing-xs);
  }

  .nascar-predictor-container .simulate-option .option-desc {
    font-size: 0.85rem;
    color: var(--nascar-text-secondary);
  }

  .nascar-predictor-container .simulate-option:hover .option-title {
    color: var(--nascar-accent-color);
  }

  /* Simulate to Race option */
  .nascar-predictor-container .sim-to-race-option {
    cursor: default;
  }

  .nascar-predictor-container .sim-to-race-option:hover {
    transform: none;
  }

  .nascar-predictor-container .sim-to-race-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: var(--nascar-spacing-sm);
  }

  .nascar-predictor-container .sim-to-race-select {
    width: 100%;
    padding: var(--nascar-spacing-sm);
    border: 2px solid var(--nascar-border-color);
    border-radius: var(--nascar-radius-sm);
    font-size: 0.9rem;
    background: var(--nascar-card-bg);
    cursor: pointer;
    margin-top: var(--nascar-spacing-xs);
  }

  .nascar-predictor-container .sim-to-race-select:focus {
    outline: none;
    border-color: var(--nascar-accent-color);
  }

  .nascar-predictor-container .sim-to-race-btn {
    margin-top: var(--nascar-spacing-sm);
    align-self: flex-end;
  }

  /* ============================================
   Loading Overlay
   ============================================ */
  .nascar-predictor-container .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--nascar-overlay-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: all var(--nascar-transition-normal);
  }

  .nascar-predictor-container .loading-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .nascar-predictor-container .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--nascar-border-color);
    border-top-color: var(--nascar-accent-color);
    border-radius: 50%;
    animation: nascar-spin 1s linear infinite;
    margin-bottom: var(--nascar-spacing-md);
  }

  @keyframes nascar-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ============================================
   Toast Notifications
   ============================================ */
  .nascar-predictor-container .toast-container {
    position: fixed;
    bottom: 124px;
    right: var(--nascar-spacing-lg);
    z-index: 100001;
    display: flex;
    flex-direction: column;
    gap: var(--nascar-spacing-sm);
  }

  .nascar-predictor-container .toast {
    padding: var(--nascar-spacing-md) var(--nascar-spacing-lg);
    background: var(--nascar-card-bg);
    border-radius: var(--nascar-radius-md);
    box-shadow: var(--nascar-shadow-lg);
    animation: nascar-slideIn 0.3s ease;
    border-left: 4px solid var(--nascar-accent-color);
  }

  .nascar-predictor-container .toast.success {
    border-left-color: var(--nascar-success-color);
  }

  .nascar-predictor-container .toast.error {
    border-left-color: var(--nascar-danger-color);
  }

  @keyframes nascar-slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Footer Ad Container */
  .nascar-predictor-container .footer-ad-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100px;
    background: var(--nascar-secondary-color);
    border-top: 1px solid var(--nascar-border-color);
    z-index: 10000;
  }

  /* ============================================
   Responsive Design
   ============================================ */
  /* Mobile Controls */
  .nascar-predictor-container .mobile-controls {
    display: none;
  }

  .nascar-predictor-container .mobile-tabs {
    display: flex;
    gap: var(--nascar-spacing-sm);
    margin-top: var(--nascar-spacing-sm);
  }

  .nascar-predictor-container .mobile-tab {
    flex: 1;
    padding: var(--nascar-spacing-sm) var(--nascar-spacing-md);
    background: var(--nascar-secondary-color);
    border: 2px solid var(--nascar-border-color);
    border-radius: var(--nascar-radius-md);
    color: var(--nascar-text-primary);
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all var(--nascar-transition-fast);
  }

  .nascar-predictor-container .mobile-tab:hover {
    background: var(--nascar-border-color);
  }

  .nascar-predictor-container .mobile-tab.active {
    background: #FFD166;
    color: var(--nascar-text-dark);
    border-color: #FFD166;
  }

  /* Button text toggle for mobile */
  .nascar-predictor-container .btn-text-short {
    display: none;
  }

  .nascar-predictor-container .btn-text-full {
    display: inline;
  }

  /* Header text toggle for mobile */
  .nascar-predictor-container .header-short {
    display: none;
  }

  .nascar-predictor-container .header-full {
    display: inline;
  }

  @media (max-width: 1024px) {
    .nascar-predictor-container .mobile-controls {
      display: block;
      grid-column: 1 / -1;
    }

    .nascar-predictor-container .desktop-only {
      display: none !important;
    }

    .nascar-predictor-container .main-content {
      grid-template-columns: 1fr;
      min-height: auto;
    }

    .nascar-predictor-container .left-column {
      display: none;
      height: auto;
      width: 100%;
      min-width: 0;
      background: transparent;
    }

    .nascar-predictor-container .left-column.mobile-visible {
      display: block;
    }

    .nascar-predictor-container .standings-panel {
      display: none;
      height: calc(100vh - 250px);
      max-height: calc(100vh - 250px);
      width: 100%;
      min-width: 0;
    }

    .nascar-predictor-container .standings-panel.mobile-visible {
      display: flex;
      flex-direction: column;
    }

    .nascar-predictor-container .races-panel {
      height: calc(100vh - 250px);
      max-height: calc(100vh - 250px);
      width: 100%;
      border-radius: var(--nascar-radius-lg);
      box-shadow: var(--nascar-shadow-lg);
      border: 1px solid var(--nascar-border-color);
      display: flex;
      flex-direction: column;
    }

    .nascar-predictor-container .races-panel .races-list {
      flex: 1;
      overflow-y: auto;
    }

    .nascar-predictor-container .race-item {
      width: 100%;
    }

    .nascar-predictor-container .btn-text-short {
      display: inline;
    }

    .nascar-predictor-container .btn-text-full {
      display: none;
    }

    .nascar-predictor-container .modal-footer {
      justify-content: center;
    }

    .nascar-predictor-container .modal-footer .btn {
      font-size: 0.75rem;
      padding: var(--nascar-spacing-sm) var(--nascar-spacing-sm);
    }
  }

  @media (max-width: 900px) {
    .nascar-predictor-container .position-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {

    .pfn-content-wrapper,
    .pfn-content-container {
      margin-top: 70px;
    }

    .nascar-predictor-container .app-container {
      padding-bottom: 76px;
    }

    .nascar-predictor-container .title-banner h1 {
      font-size: 1.5rem;
    }

    .nascar-predictor-container .decorative-line {
      width: 50px;
    }

    .nascar-predictor-container .header-actions {
      flex-wrap: wrap;
      justify-content: center;
    }

    .nascar-predictor-container .modal {
      max-width: 100%;
      max-height: calc(85vh - 60px);
      margin-bottom: 60px;
      border-radius: 0;
    }

    .nascar-predictor-container .race-modal {
      max-height: calc(90vh - 60px);
    }

    .nascar-predictor-container .modal-tabs {
      flex-wrap: wrap;
    }

    .nascar-predictor-container .tab-btn {
      flex: 1 1 50%;
      font-size: 0.8rem;
      padding: var(--nascar-spacing-sm);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nascar-predictor-container .tab-info-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .nascar-predictor-container .stage-info {
      display: none;
    }

    .nascar-predictor-container .footer-ad-container {
      height: 60px;
    }

    .nascar-predictor-container .driver-modal-popup {
      max-height: calc(85vh - 60px);
      margin-bottom: 60px;
    }

    .nascar-predictor-container .toast-container {
      bottom: 84px;
    }

    .nascar-predictor-container .fastest-lap-selector {
      grid-template-columns: 1fr;
    }

    .nascar-predictor-container .standings-table th,
    .nascar-predictor-container .standings-table td {
      padding: var(--nascar-spacing-xs) var(--nascar-spacing-sm);
      font-size: 0.85rem;
    }

    .nascar-predictor-container .standings-table th.col-pos {
      font-size: 0;
    }

    .nascar-predictor-container .col-pos {
      width: 30px;
      padding-left: var(--nascar-spacing-xs);
      padding-right: var(--nascar-spacing-xs);
    }

    .nascar-predictor-container .col-top5,
    .nascar-predictor-container .col-top10 {
      display: none;
    }

    .nascar-predictor-container .header-short {
      display: inline;
    }

    .nascar-predictor-container .header-full {
      display: none;
    }

    .nascar-predictor-container .position-list {
      grid-template-columns: 1fr;
    }

    .nascar-predictor-container .driver-chip .chip-name {
      font-size: 0.65rem;
    }

    .nascar-predictor-container .modal-track {
      display: block;
    }

    .nascar-predictor-container .modal-track .track-dash {
      display: none;
    }

    .nascar-predictor-container .position-column-header {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .nascar-predictor-container .app-container {
      padding: 0px;
      padding-bottom: 76px;
    }

    .nascar-predictor-container .title-banner {
      flex-direction: column;
      gap: var(--nascar-spacing-sm);
    }

    .nascar-predictor-container .decorative-line {
      display: none;
    }
  }

  /* ============================================
   Landscape Mobile - scrollable layout
   ============================================ */
  @media (max-height: 500px) and (orientation: landscape) {

    /* Let the page scroll instead of fixed-height panels */
    .nascar-predictor-container .app-container {
      min-height: auto;
      padding-bottom: 16px;
    }

    .nascar-predictor-container .main-content {
      min-height: auto;
    }

    .nascar-predictor-container .left-column {
      height: auto;
    }

    .nascar-predictor-container .races-panel {
      max-height: none;
      height: auto;
    }

    .nascar-predictor-container .races-panel .races-list {
      max-height: 60vh;
      overflow-y: auto;
    }

    .nascar-predictor-container .standings-panel {
      height: auto;
      max-height: none;
    }

    .nascar-predictor-container .standings-table-container {
      max-height: 60vh;
      overflow-y: auto;
    }

    /* Modals: near-fullscreen */
    .nascar-predictor-container .modal {
      max-height: calc(100vh - 10px);
      margin-bottom: 0;
      border-radius: 0;
      width: 100%;
      max-width: 100%;
    }

    .nascar-predictor-container .race-modal {
      max-height: calc(100vh - 10px);
    }

    .nascar-predictor-container .driver-modal-popup {
      max-height: calc(100vh - 10px);
      margin-bottom: 0;
    }

    /* Hide the footer ad in landscape to reclaim space */
    .nascar-predictor-container .footer-ad-container {
      display: none;
    }

    .nascar-predictor-container .toast-container {
      bottom: 16px;
    }
  }
</style>
