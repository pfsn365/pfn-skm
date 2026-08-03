<style>
  :root {
    --color-primary: #0050A0;
    --color-primary-dark: #0d2818;
    --color-secondary: #8b0000;
    --color-accent: #ffd500;
    --color-accent-dark: #b8860b;
    --color-success: #37c77a;
    --color-success-light: rgba(55, 199, 122, 0.15);
    --color-draw: #6b7280;
    --color-draw-light: rgba(107, 114, 128, 0.15);

    --color-bg-primary: #f6f7ff;
    --color-bg-secondary: #ffffff;
    --color-bg-dark: #080a3c;
    --color-bg-card: #ffffff;

    --color-text-primary: #1a1a2e;
    --color-text-secondary: #4a4a68;
    --color-text-muted: #8888a0;
    --color-text-inverse: #ffffff;

    --color-border: #e9e9e9;
    --color-border-focus: #37c77a;

    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;

    /* Typography */
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-xs: 0.7rem;
    --font-size-sm: 0.8rem;
    --font-size-md: 0.9rem;
    --font-size-lg: 1rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 2rem;

    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

    /* Transitions */
    --transition-fast: 150ms ease;

    /* Z-Index */
    --z-sticky: 200;
    --z-modal: 300;
    --z-toast: 400;

    /* Layout */
    --header-height: 93px;
    --container-max-width: 1100px;
  }

  /* Reset */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: var(--font-family);
    font-size: var(--font-size-md);
    line-height: 1.5;
    color: var(--color-text-primary);
    background: var(--color-bg-primary);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* Skip Link */
  .skip-link {
    position: absolute;
    top: -100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-bg-dark);
    color: var(--color-text-inverse);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    z-index: var(--z-modal);
    text-decoration: none;
  }

  .skip-link:focus {
    top: var(--space-md);
  }

  /* Hidden */
  .hidden {
    display: none !important;
  }

  /* ========================================
   Header
   ======================================== */

  .adv-container {
    background-color: #ededed;
    height: 105px;
    top: 93px;
    width: 100%;
    z-index: 10000;
    overflow: hidden;
    left: 0;
  }

  .header {
    position: sticky;
    top: 0;
    height: var(--header-height);
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    z-index: var(--z-sticky);
    box-shadow: var(--shadow-sm);
  }

  .header-container {
    max-width: var(--container-max-width);
    height: 100%;
    margin: 0 auto;
    padding: 0 var(--space-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .logo-icon {
    color: var(--color-accent);
  }

  .logo-text {
    font-size: var(--font-size-lg);
    font-weight: 500;
  }

  .nav-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-sm);
  }

  .nav-toggle-bar {
    width: 24px;
    height: 2px;
    background: var(--color-text-inverse);
    transition: transform var(--transition-fast);
  }

  .nav-menu {
    display: flex;
    list-style: none;
    gap: var(--space-lg);
  }

  .nav-link {
    color: var(--color-text-inverse);
    font-weight: 500;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: background var(--transition-fast);
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-accent);
  }

  /* ========================================
   Hero
   ======================================== */
  .hero {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    padding: var(--space-xl) var(--space-lg);
    text-align: center;
  }

  .hero-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-sm);
  }

  .hero-subtitle {
    font-size: var(--font-size-lg);
    opacity: 0.9;
    margin-bottom: var(--space-lg);
  }

  .hero-actions {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    flex-wrap: wrap;
  }

  /* ========================================
   Buttons
   ======================================== */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-lg);
    font-size: var(--font-size-md);
    font-weight: 600;
    border-radius: var(--radius-md);
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform var(--transition-fast), background var(--transition-fast);
    min-height: 44px;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .btn-primary {
    background: var(--color-accent);
    color: var(--color-bg-dark);
    border-color: var(--color-accent);
  }

  .btn-primary:hover {
    background: var(--color-accent-dark);
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-text-inverse);
    border-color: var(--color-text-inverse);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .btn-outline-light {
    background: transparent;
    color: var(--color-text-inverse);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .btn-outline-light:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .btn-outline {
    background: transparent;
    color: var(--color-primary);
    border-color: var(--color-primary);
  }

  .btn-outline:hover {
    background: var(--color-primary);
    color: var(--color-text-inverse);
  }

  /* Button Group / Split Button */
  .btn-group {
    position: relative;
    display: inline-flex;
  }

  .btn-group .btn:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .btn-group .btn-dropdown-toggle {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 1px solid rgba(0, 0, 0, 0.15);
    padding: var(--space-sm) var(--space-sm);
    min-width: auto;
  }

  .btn-group .btn-dropdown-toggle .dropdown-arrow {
    font-size: 10px;
  }

  .btn-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-bg-card);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: var(--space-xs);
    margin-top: 4px;
    display: none;
    z-index: 100;
  }

  .btn-dropdown-menu.open {
    display: block;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    border: none;
    background: transparent;
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    text-align: left;
    cursor: pointer;
    border-radius: var(--radius-sm);
    white-space: nowrap;
  }

  .dropdown-item:hover {
    background: var(--color-bg-secondary);
  }

  .groups-brackets-container {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
  }

  /* ========================================
   Tab Navigation
   ======================================== */
  .tab-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    background: #f6f7ff;
    position: sticky;
    top: calc(var(--header-height) + 120px);
    max-width: 78px;
    z-index: calc(var(--z-sticky) - 1);
  }

  .tab-nav-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);
    position: sticky;
    top: calc(var(--header-height) + 10px);
  }

  .tab-nav-divider {
    display: none;
  }

  .tab-nav-stats {
    display: flex;
    gap: var(--space-sm);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    justify-content: center;
    margin-bottom: 10px;
  }

  .stat-item {
    display: flex;
    gap: var(--space-xs);
  }

  .stat-divider {
    color: var(--color-border);
  }

  .tab-nav-divider {
    width: 1px;
    height: 24px;
    background: var(--color-border);
    margin: 0 var(--space-xs);
  }

  /* Responsive button text */
  .btn-text-short {
    display: none;
  }

  .btn-action.btn-action-reset .btn-action-text {
    margin-top: -2px;
  }

  .tab-btn {
    padding: 10px;
    font-size: var(--font-size-sm);
    font-weight: 500;
    background: transparent;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--color-text-secondary);
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tab-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .tab-btn.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  /* Small buttons */
  .btn-sm {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-xs);
  }

  .btn-group-sm .btn-dropdown-toggle {
    padding: var(--space-xs) 6px;
  }

  /* Action buttons (Reset/Simulate) */
  .btn-action-wrapper {
    position: relative;
  }

  .btn-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 16px;
    border-radius: var(--radius-md);
    border: 2px solid;
    cursor: pointer;
    font-weight: 500;
    font-size: 11px;
    min-width: 70px;
    height: 48px;
    transition: all var(--transition-fast);
  }

  .btn-action-icon {
    font-size: 16px;
    line-height: 1;
    margin-bottom: 2px;
  }

  .btn-action-text {
    font-size: 11px;
  }

  .btn-action-reset {
    background: #B91C1C1A;
    border-color: #B91C1C;
    color: #B91C1C;
    padding: 10px;
  }

  .btn-action-reset:hover {
    background: #ffcdd2;
  }

  .btn-action-reset .btn-action-icon {
    font-size: 18px;
    font-weight: 300;
  }

  .btn-action-simulate {
    background: #FFD166;
    border-color: #FFD166;
    color: #000;
    padding: 10px;
  }

  /* .btn-action-simulate:hover {
    background: #1565c0;
    border-color: #1565c0;
  } */

  .btn-action-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-bg-card);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: var(--space-xs);
    margin-top: 4px;
    display: none;
    z-index: 100;
    min-width: 120px;
  }

  .btn-action-dropdown.open {
    display: block;
  }

  /* ========================================
   Section Headers
   ======================================== */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-lg);
  }

  .section-title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-xs);
    color: var(--color-text-primary);
  }

  .section-subtitle {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  /* ========================================
   Groups Section
   ======================================== */
  .groups-section {
    max-width: var(--container-max-width);
  }

  /* Groups Layout - 3 column with sticky sidebar */
  .groups-layout {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }

  .groups-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
    min-width: 692px;
  }

  .third-place-sidebar-container {
    position: sticky;
    top: -56px;
    max-width: 320px;
  }

  .third-place-sidebar {
    max-height: calc(100vh - var(--header-height) - 110px);
    overflow-y: auto;
  }

  .third-place-table-container {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }

  .third-place-header {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    padding: var(--space-sm) var(--space-md);
    font-weight: 500;
    font-size: var(--font-size-sm);
    text-align: center;
  }

  .third-place-header .qualify-info {
    display: block;
    font-size: var(--font-size-xs);
    font-weight: 400;
    opacity: 0.9;
    margin-top: 2px;
  }

  .third-place-standings {
    padding: var(--space-sm);
  }

  .third-place-standings .standings-header,
  .third-place-standings .standings-row {
    display: grid;
    grid-template-columns: 18px 22px 1fr repeat(4, 22px);
    gap: 2px;
    align-items: center;
    padding: 4px 6px;
    font-size: var(--font-size-xs);
  }

  .third-place-standings .standings-header {
    color: var(--color-text-muted);
    font-weight: 600;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--space-xs);
    margin-bottom: var(--space-xs);
  }

  .third-place-standings .standings-row {
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast);
  }

  .third-place-standings .standings-row:nth-child(odd) {
    background: var(--color-bg-primary);
  }

  .third-place-standings .standings-row.will-qualify {
    background: var(--color-success-light);
    border-left: 3px solid var(--color-success);
  }

  .third-place-standings .standings-row.wont-qualify {
    opacity: 0.5;
  }

  .third-place-standings .standings-group {
    font-weight: 500;
    color: var(--color-primary);
    text-align: center;
    font-size: var(--font-size-xs);
  }

  .third-place-standings .standings-team {
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
  }

  .third-place-standings .team-flag {
    width: 20px;
    height: 15px;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: 2px;
  }

  .third-place-standings .team-name {
    font-weight: 500;
    font-size: var(--font-size-xs);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .third-place-standings .standings-stat {
    text-align: center;
  }

  /* Playoff Outcomes */
  .playoff-outcomes {
    border-top: 1px solid var(--color-border);
    margin-top: var(--space-sm);
  }

  .playoff-outcomes-header {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    padding: var(--space-xs) var(--space-md);
    font-weight: 600;
    font-size: var(--font-size-xs);
    text-align: center;
  }

  .playoff-matchups {
    padding: var(--space-sm);
  }

  .playoff-matchup-row {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: 4px 6px;
    font-size: var(--font-size-xs);
    border-radius: var(--radius-sm);
  }

  .playoff-matchup-row:nth-child(odd) {
    background: var(--color-bg-primary);
  }

  .playoff-match {
    font-weight: 600;
    color: var(--color-primary);
    min-width: 60px;
  }

  .playoff-arrow {
    color: var(--color-text-muted);
  }

  .playoff-team {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
  }

  .team-flag-small {
    width: 16px;
    height: 12px;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: 2px;
  }

  .team-name-short {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .team-group {
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
  }

  /* Third Place Reference Table */
  .third-place-reference {
    margin-top: var(--space-xl);
    margin-left: auto;
    margin-right: auto;
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    display: table;
  }

  .reference-header {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    padding: var(--space-xs) var(--space-sm);
    text-align: center;
  }

  .reference-header h3 {
    margin: 0 0 2px;
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  .reference-header p {
    margin: 0;
    font-size: 10px;
    opacity: 0.9;
  }

  .reference-table-container {
    max-height: 500px;
    overflow-y: auto;
    padding: 0 4px 4px 4px;
  }

  .reference-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }

  .reference-table thead {
    position: sticky;
    top: 0;
    background: var(--color-bg-card);
    z-index: 1;
  }

  .reference-table th {
    padding: 4px 4px;
    text-align: center;
    font-weight: 600;
    color: var(--color-text-muted);
    border-bottom: 2px solid var(--color-border);
    white-space: nowrap;
  }

  .reference-table td {
    padding: 3px 4px;
    text-align: center;
    border-bottom: 1px solid var(--color-border);
  }

  .reference-table tbody tr:nth-child(odd) {
    background: var(--color-bg-primary);
  }

  .reference-table tbody tr:hover {
    background: var(--color-primary-light);
  }

  .ref-row-num {
    color: var(--color-text-muted);
    font-weight: 500;
    width: 30px;
  }

  .ref-groups {
    font-family: monospace;
    font-weight: 600;
    color: var(--color-primary);
    letter-spacing: 1px;
    text-align: left !important;
    white-space: nowrap;
  }

  .ref-match {
    min-width: 32px;
    font-weight: 600;
  }

  .ref-match-cell {
    font-weight: 500;
    color: var(--color-text-primary);
  }

  /* Group Filter */
  .group-filter {
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
  }

  .filter-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--color-text-muted);
    margin-bottom: 4px;
  }

  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-bottom: 4px;
  }

  .filter-btn {
    width: 24px;
    height: 24px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-bg-card);
    color: var(--color-text-primary);
    font-weight: 500;
    font-size: 10px;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .filter-btn:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .filter-btn.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  .filter-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-xs);
  }

  .filter-count {
    font-size: 10px;
    color: var(--color-text-muted);
  }

  .filter-clear {
    padding: 2px 6px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text-muted);
    font-size: 10px;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .filter-clear:hover {
    border-color: var(--color-error);
    color: var(--color-error);
  }

  /* Highlight styles for filtered results */
  .highlight-group {
    color: var(--color-primary);
    font-weight: 500;
    background: var(--color-primary-light);
    padding: 0 2px;
    border-radius: 2px;
  }

  .highlight-cell {
    background: var(--color-primary-light) !important;
    color: var(--color-primary);
    font-weight: 500;
  }

  .no-results {
    padding: var(--space-lg) !important;
    text-align: center;
    color: var(--color-text-muted);
    font-style: italic;
  }

  /* Group Card */
  .group-card {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    min-height: 420px;
    min-width: 338px;
  }

  .group-card.skeleton {
    background: var(--color-bg-secondary);
  }

  .group-skeleton-content {
    height: 100%;
    min-height: 420px;
    background: linear-gradient(90deg, var(--color-bg-secondary) 25%, var(--color-bg-card) 50%, var(--color-bg-secondary) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }

    100% {
      background-position: -200% 0;
    }
  }

  .group-card:not(.skeleton) .group-skeleton-content {
    display: none;
  }

  .group-header {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    padding: var(--space-sm) var(--space-md);
    font-weight: 500;
    font-size: var(--font-size-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .knockout-info {
    font-size: var(--font-size-xs);
    font-weight: 500;
    opacity: 0.85;
  }

  /* Standings Table */
  .standings-table {
    padding: var(--space-sm);
    border-bottom: 1px solid var(--color-border);
  }

  .standings-header,
  .standings-row {
    display: grid;
    grid-template-columns: 20px 1fr repeat(8, 22px);
    gap: 2px;
    align-items: center;
    padding: 4px 0;
    font-size: var(--font-size-xs);
  }

  .standings-header {
    color: var(--color-text-muted);
    font-weight: 600;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--space-xs);
    margin-bottom: var(--space-xs);
  }

  .standings-row.qualified {
    background: var(--color-success-light);
    border-radius: var(--radius-sm);
  }

  .standings-row.third-place {
    background: rgba(255, 215, 0, 0.2);
    border-radius: var(--radius-sm);
  }

  .standings-pos {
    text-align: center;
    font-weight: 600;
  }

  .standings-team {
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
  }

  .standings-team .team-flag {
    width: 20px;
    height: 15px;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: 2px;
  }

  .standings-team .team-name {
    font-weight: 500;
    font-size: var(--font-size-xs);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .standings-stat {
    text-align: center;
    color: var(--color-text-secondary);
  }

  .standings-pts {
    font-weight: 500;
    color: var(--color-text-primary);
  }

  /* Group Matches */
  .group-matches {
    padding: var(--space-sm);
  }

  .matchday {
    margin-bottom: var(--space-sm);
  }

  .matchday:last-child {
    margin-bottom: 0;
  }

  .matchday-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    font-weight: 600;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  /* Group Match Card */
  .group-match {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0px;
    background: var(--color-bg-primary);
    border-radius: var(--radius-sm);
    margin-bottom: 4px;
    min-height: 36px;
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .group-match:hover {
    background: var(--color-border);
  }

  .group-match:last-child {
    margin-bottom: 0;
  }

  .group-match .match-team {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    padding: 4px 6px;
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast);
    cursor: pointer;
  }

  .group-match .match-team:first-child {
    justify-content: flex-start;
  }

  .group-match .match-team:last-child {
    justify-content: flex-end;
  }

  .group-match .match-team:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .group-match .match-team.winner {
    background: var(--color-success-light);
  }

  .group-match .team-flag {
    width: 24px;
    height: 18px;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: 2px;
  }

  .group-match .team-name {
    font-weight: 500;
    font-size: var(--font-size-xs);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .group-match .match-score-inputs {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 70px;
    justify-content: center;
  }

  .group-match .score-input {
    width: 32px;
    height: 28px;
    text-align: center;
    font-weight: 500;
    font-size: var(--font-size-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-bg);
    color: var(--color-text-primary);
    padding: 0;
    -moz-appearance: textfield;
  }

  .group-match .score-input::-webkit-outer-spin-button,
  .group-match .score-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .group-match .score-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  }

  .group-match .score-input::placeholder {
    color: var(--color-text-muted);
    font-weight: 400;
  }

  .group-match.is-draw .match-score-inputs {
    background: var(--color-draw-light);
    border-radius: var(--radius-sm);
  }

  .group-match .score-divider {
    color: var(--color-text-muted);
    font-weight: 500;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast), color var(--transition-fast);
  }

  .group-match .score-divider:hover {
    background: var(--color-draw-light);
    color: var(--color-draw);
  }

  .group-match .score-divider:active {
    background: var(--color-draw);
    color: white;
  }

  /* Locked matches (from API data) */
  .group-match.locked {
    cursor: default;
    background: var(--color-bg-secondary);
    border-left: 3px solid var(--color-primary);
  }

  .group-match.locked:hover {
    background: var(--color-bg-secondary);
  }

  .group-match.locked .match-team {
    cursor: default;
  }

  .group-match.locked .match-team:hover {
    background: transparent;
  }

  .group-match.locked .score-input {
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    cursor: default;
  }

  .group-match.locked .score-divider {
    cursor: default;
  }

  .group-match.locked .score-divider:hover {
    background: transparent;
    color: var(--color-text-muted);
  }

  /* ========================================
   Bracket Section
   ======================================== */
  .bracket-section {
    max-width: var(--container-max-width);
    display: flex;
    margin-left: 60px;
  }

  /* Pathway Tabs */
  .pathway-tabs {
    display: flex;
    justify-content: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .pathway-tab {
    padding: var(--space-sm) var(--space-xl);
    font-size: var(--font-size-md);
    font-weight: 500;
    background: var(--color-bg-card);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--color-text-secondary);
  }

  .pathway-tab:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .pathway-tab.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  /* Bracket Pathway */
  .bracket-pathway {
    overflow-x: auto;
  }

  .bracket-container {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
    min-width: 800px;
    padding: var(--space-md) 0;
  }

  .bracket-side {
    display: flex;
    gap: var(--space-sm);
    flex: 1;
  }

  .bracket-left,
  .bracket-right {
    flex-direction: row;
  }

  /* Finals Section */
  .bracket-finals {
    margin: var(--space-md) 0;
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
  }

  .final-gold {
    background: transparent;
  }

  .third-place-bronze {
    background: transparent;
    margin-top: var(--space-md);
  }

  .final-title {
    text-align: center;
    color: var(--color-text-primary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }

  .finals-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xl);
    flex-wrap: wrap;
  }

  .finals-row .round-title {
    color: var(--color-text-inverse);
  }

  .final-team-slot {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    min-width: 180px;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 2px solid var(--color-border);
  }

  .final-team-slot:hover {
    background: var(--color-bg-card);
    transform: scale(1.02);
  }

  .final-team-slot.winner {
    background: var(--color-bg-card);
    border-color: var(--color-success);
    box-shadow: var(--shadow-md);
  }

  .final-team-slot .team-flag {
    width: 20px;
    height: 15px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    margin-bottom: var(--space-xs);
  }

  .final-team-slot .team-name {
    font-weight: 500;
    font-size: var(--font-size-md);
    color: var(--color-text-primary);
  }

  .final-team-slot .team-placeholder {
    color: var(--color-text-secondary);
    font-weight: 600;
  }

  .final-team-slot .team-score {
    font-size: var(--font-size-xl);
    font-weight: 500;
    color: var(--color-text-primary);
    margin-top: var(--space-xs);
  }

  .third-place-bronze {
    display: flex;
    justify-content: center;
  }

  .third-place-bronze .third-place-round {
    align-items: center;
  }

  .third-place-bronze .round-title {
    color: var(--color-text-primary);
    font-size: var(--font-size-md);
  }

  .third-place-bronze .match-card {
    background: var(--color-bg-card);
    border-color: var(--color-border);
  }

  .bracket-round {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    min-width: 160px;
  }

  .round-title {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    text-align: center;
    margin-bottom: var(--space-xs);
  }

  .matches {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    justify-content: space-around;
    height: 100%;
  }

  /* Bracket spacing adjustments */
  .r32-round .matches {
    gap: var(--space-sm);
  }

  .r16-round .matches {
    gap: var(--space-xl);
    padding-top: 20px;
  }

  .qf-round .matches {
    gap: calc(var(--space-xl) * 2);
    padding-top: 60px;
  }

  .sf-round .matches {
    padding-top: 140px;
  }

  /* Match Card */
  .match-card {
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    min-width: 180px;
    min-height: 80px;
    transition: box-shadow var(--transition-fast);
  }

  .match-card:hover {
    box-shadow: var(--shadow-md);
  }

  .match-card.completed {
    border-color: var(--color-success);
  }

  .match-card.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .match-header {
    background: var(--color-bg-primary);
    padding: 4px var(--space-sm);
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    text-align: center;
    border-bottom: 1px solid var(--color-border);
  }

  .match-teams {
    display: flex;
    flex-direction: column;
  }

  .team-slot {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    min-height: 36px;
    cursor: pointer;
    transition: background var(--transition-fast);
    border-left: 3px solid transparent;
  }

  .team-slot:first-child {
    border-bottom: 1px solid var(--color-border);
  }

  .team-slot:hover {
    background: var(--color-bg-primary);
  }

  .team-slot.winner {
    background: var(--color-success-light);
    border-left-color: var(--color-success);
  }

  .team-slot.empty {
    cursor: default;
  }

  .team-slot.empty:hover {
    background: transparent;
  }

  .team-slot .team-flag {
    width: 28px;
    height: 21px;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: 2px;
  }

  .team-slot .team-name {
    flex: 1;
    font-weight: 500;
    font-size: var(--font-size-sm);
  }

  .team-slot .team-score {
    font-weight: 500;
    color: var(--color-text-muted);
    min-width: 18px;
    text-align: center;
  }

  .team-slot.winner .team-score {
    color: var(--color-success);
  }

  .team-placeholder {
    color: var(--color-text-muted);
    font-style: italic;
    font-size: var(--font-size-sm);
  }

  /* Champion Display */
  .champion-display {
    background: rgba(255, 255, 255, 0.95);
    border-radius: var(--radius-lg);
    padding: var(--space-lg) var(--space-xl);
    text-align: center;
    min-width: 200px;
    min-height: 160px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border: 3px solid #D4AF37;
  }

  .trophy-icon {
    font-size: 4rem;
    margin-bottom: var(--space-xs);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .champion-title {
    font-size: var(--font-size-md);
    color: #5C4813;
    margin-bottom: var(--space-sm);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .champion-team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
  }

  .champion-flag {
    width: 24px;
    height: 18px;
    object-fit: cover;
    border-radius: 2px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }

  .champion-name {
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: #3D2F0A;
  }

  /* Third Place */
  .third-place-round .match-card {
    border-color: var(--color-accent-dark);
  }

  /* ========================================
   Stats Section
   ======================================== */
  .stats-section {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--space-xl) var(--space-md);
    text-align: center;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-md);
    margin-top: var(--space-lg);
  }

  .stat-card {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    box-shadow: var(--shadow-md);
    min-height: 90px;
  }

  .stat-value {
    font-size: var(--font-size-2xl);
    font-weight: 500;
    color: var(--color-primary);
  }

  .stat-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    margin-top: 2px;
  }

  /* ========================================
   Share Section
   ======================================== */
  .share-section {
    display: none;
  }

  .btn-action-share {
    background: #E8F5E9;
    border-color: #4CAF50;
    color: #2E7D32;
    padding: 10px;
  }

  .btn-action-share:hover {
    background: #C8E6C9;
  }

  .btn-action-share .btn-action-icon svg {
    display: block;
  }

  .btn-action-download {
    background: #E3F2FD;
    border-color: #1976D2;
    color: #1565C0;
    padding: 10px;
  }

  .btn-action-download:hover {
    background: #BBDEFB;
  }

  .btn-action-download .btn-action-icon svg {
    display: block;
  }


  /* ========================================
   Download Modal
   ======================================== */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .modal-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .modal {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    max-width: 900px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  }

  .modal-small {
    max-width: 400px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    border-bottom: 1px solid var(--color-border);
  }

  .modal-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text-secondary);
  }

  .modal-close:hover {
    color: var(--color-text-primary);
  }

  .modal-content {
    padding: var(--space-md);
  }

  .download-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .download-option-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    background: var(--color-bg-primary);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .download-option-btn:hover {
    border-color: var(--color-primary);
    background: rgba(0, 80, 160, 0.05);
  }

  .download-option-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .download-option-desc {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin-top: 0.25rem;
  }

  /* ========================================
   Footer
   ======================================== */
  .footer {
    background: var(--color-bg-dark);
    color: var(--color-text-inverse);
    padding: var(--space-lg);
    text-align: center;
    margin-top: var(--space-xl);
  }

  .footer-disclaimer {
    font-size: var(--font-size-xs);
    opacity: 0.7;
    margin-top: var(--space-xs);
  }

  /* ========================================
   Loading Overlay
   ======================================== */
  .simulating-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(8, 10, 60, 0.9);
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: var(--space-md);
    z-index: var(--z-modal);
  }

  .simulating-overlay.active {
    display: flex;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    color: var(--color-text-inverse);
    font-size: var(--font-size-md);
  }

  /* ========================================
   Toast Notifications
   ======================================== */
  .toast-container {
    position: fixed;
    bottom: 120px;
    right: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    z-index: var(--z-toast);
  }

  .toast {
    background: var(--color-bg-dark);
    color: var(--color-text-inverse);
    padding: var(--space-sm) var(--space-lg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    animation: toast-in 0.3s ease forwards;
    max-width: 280px;
    font-size: var(--font-size-sm);
  }

  .toast.success {
    background: var(--color-success);
  }

  .toast.error {
    background: var(--color-secondary);
  }

  .loading-overlay,
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.8;
    z-index: 9999;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px
  }

  .loading-overlay-text,
  .loading-overlay-text {
    color: #fff;
    font-weight: 500;
    font-size: 44px;
  }

  .loader,
  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #555;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
    z-index: 10000;
  }

  .header-wrapper .desktop-tools-top-adv-container,
  .content .desktop-pages-top-adv-container {
    min-height: 120px;
    overflow: hidden;
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(100%);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes toast-out {
    from {
      opacity: 1;
      transform: translateX(0);
    }

    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  /* ========================================
   Responsive - Tablet
   ======================================== */
  @media (max-width: 1024px) {
    .groups-layout {
      grid-template-columns: 1fr 240px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .bracket-container {
      min-width: 500px;
    }

    .finals-row {
      gap: var(--space-md);
    }

    .pathway-tab {
      flex: 1;
      min-width: 100px;
    }
  }

  /* ========================================
   Responsive - Mobile
   ======================================== */
  @media (max-width: 768px) {
    :root {
      --header-height: 69px;
    }

    .pfn-content-wrapper,
    .pfn-content-container {
      margin-top: 75px;
    }

    .logo-text {
      font-size: var(--font-size-md);
    }

    .nav-toggle {
      display: flex;
    }

    .nav-menu {
      position: absolute;
      top: var(--header-height);
      left: 0;
      right: 0;
      background: var(--color-bg-dark);
      flex-direction: column;
      padding: var(--space-md);
      gap: var(--space-xs);
      display: none;
      box-shadow: var(--shadow-lg);
    }

    .nav-menu.open {
      display: flex;
    }

    .tab-nav-mobile .tab-nav-row {
      flex-direction: row;
      justify-content: center;
    }

    .tab-nav-mobile .tab-nav-row {
      width: 100%;
    }

    .tab-nav-mobile .tab-nav-row > button {
      flex: 1 1 0;
      min-width: 0;
    }

    .tab-nav-mobile .tab-nav-actions {
      display: flex;
      flex-direction: row;
      gap: var(--space-sm);
      width: 100%;
    }

    .tab-nav-mobile .tab-nav-actions > button {
      flex: 1 1 0;
      min-width: 0;
    }

    .nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(2) {
      opacity: 0;
    }

    .nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    .hero-title {
      font-size: var(--font-size-2xl);
    }

    .hero-subtitle {
      font-size: var(--font-size-md);
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    .hero-actions .btn {
      width: 100%;
      max-width: 250px;
    }

    .tab-nav {
      top: var(--header-height);
      flex-wrap: wrap;
      align-items: stretch;
      gap: var(--space-xs);
      max-width: unset;
      width: 100%;
      padding-top: 8px;
    }

    .btn-text-full {
      display: none;
    }

    .btn-text-short {
      display: inline;
    }

    .tab-btn {
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--font-size-xs);
      height: 40px;
    }

    .btn-action {
      height: 40px;
      min-width: 60px;
      padding: 4px 12px;
    }

    .btn-action-icon {
      font-size: 14px;
    }

    .btn-action-text {
      font-size: 10px;
    }

    .groups-layout {
      grid-template-columns: 1fr;
      flex-direction: column;
    }

    .groups-grid {
      grid-template-columns: 1fr;
      min-width: 100%;
    }

    .third-place-sidebar {
      position: relative;
      top: 0;
      max-height: none;
      margin-top: var(--space-md);
    }

    .third-place-standings .standings-header,
    .third-place-standings .standings-row {
      grid-template-columns: 22px 26px 1fr repeat(4, 26px);
    }

    .bracket-section {
      padding: var(--space-md) var(--space-sm);
      margin-left: unset;
    }

    .pathway-tabs {
      flex-wrap: wrap;
    }

    .pathway-tab {
      padding: var(--space-sm) var(--space-md);
      font-size: var(--font-size-sm);
    }

    .third-place-sidebar-container {
      max-width: unset;
      width: 100%;
    }

    .bracket-container {
      flex-direction: column;
      align-items: stretch;
      min-width: auto;
    }

    .bracket-side {
      flex-direction: column;
      width: 100%;
    }

    .bracket-left,
    .bracket-right {
      flex-direction: column;
    }

    .bracket-round {
      width: 100%;
      min-width: auto;
    }

    .matches {
      gap: var(--space-sm);
    }

    .r16-round .matches,
    .qf-round .matches,
    .sf-round .matches {
      padding-top: 0;
      gap: var(--space-sm);
    }

    .match-card {
      min-width: 100%;
    }

    .bracket-finals {
      padding: var(--space-md);
    }

    .finals-row {
      flex-direction: column;
      gap: var(--space-md);
    }

    .final-team-slot {
      min-width: 150px;
      min-height: 80px;
      padding: var(--space-sm);
    }

    .final-team-slot .team-flag {
      width: 48px;
      height: 36px;
    }

    .champion-display {
      min-width: 160px;
      min-height: 120px;
      padding: var(--space-md);
    }

    .trophy-icon {
      font-size: 3rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-sm);
    }

    .stat-card {
      padding: var(--space-md);
    }

    .stat-value {
      font-size: var(--font-size-xl);
    }

    .toast-container {
      left: var(--space-md);
      right: var(--space-md);
      bottom: 100px;
    }

    .toast {
      max-width: 100%;
    }

    /* Third Place Reference Table - Mobile */
    .reference-header h3 {
      white-space: normal;
      line-height: 1.3;
    }

    .ref-row-num {
      display: none;
    }

    .reference-table th.ref-row-num,
    .reference-table td.ref-row-num {
      display: none;
    }

    .group-card {
      min-width: 100%;
    }

    .groups-brackets-holder {
      width: 100%;
    }
  }

  /* ========================================
   Reduced Motion
   ======================================== */
  @media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }

    html {
      scroll-behavior: auto;
    }
  }

  /* ========================================
   Print Styles
   ======================================== */
  @media print {

    .header,
    .hero-actions,
    .tab-nav,
    .simulating-overlay,
    .toast-container,
    .modal-overlay {
      display: none !important;
    }

    .hidden {
      display: block !important;
    }

    body {
      background: white;
    }

    .group-card,
    .match-card,
    .stat-card {
      break-inside: avoid;
      box-shadow: none;
      border: 1px solid #ccc;
    }
  }
</style>
