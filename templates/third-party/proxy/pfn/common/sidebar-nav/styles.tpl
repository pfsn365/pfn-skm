<style>
    :root {
        --sidebar-width: 256px;
        --sidebar-bg: #000000;
        --sidebar-border: #1F2937;
        --sidebar-text: #FFFFFF;
        --sidebar-muted: #9CA3AF;
        --sidebar-section-label: #F3F4F6;
        --sidebar-hover-bg: rgba(31, 41, 55, 0.5);
        --sidebar-active-bg: #0050A0;
        --sidebar-accent: #0050A0;
    }

    .pfn-sidebar-wrapper {
        position: fixed; top: 0; left: 0; bottom: 95px;
        width: var(--sidebar-width);
        background: var(--sidebar-bg);
        border-right: 1px solid var(--sidebar-border);
        box-shadow: 0 1px 3px rgba(10, 10, 46, 0.04);
        display: flex; flex-direction: column;
        z-index: 2010; overflow-y: auto;
    }
    .pfn-sidebar-wrapper::-webkit-scrollbar { width: 4px; }
    .pfn-sidebar-wrapper::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }

    .pfn-sidebar-logo {
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
        border-bottom: 1px solid var(--sidebar-border);
        text-decoration: none;
    }
    .pfn-sidebar-logo img {
        height: 58px; width: 58px;
        object-fit: contain;
        transition: opacity 0.3s;
    }
    .pfn-sidebar-logo:hover img { opacity: 0.8; }

    .pfn-sidebar-section-label {
        display: flex; align-items: center; justify-content: space-between;
        padding: 32px 16px 8px;
    }
    .pfn-sidebar-section-label > span {
        font-size: 12px; font-weight: 700;
        letter-spacing: 0.05em; text-transform: uppercase;
        color: var(--sidebar-section-label);
        flex-shrink: 0;
    }
    .pfn-sidebar-section-label > .label-line {
        flex: 1; margin-left: 12px;
        height: 1px;
        background: linear-gradient(to right, #4B5563, transparent);
    }

    .pfn-sidebar-featured {
        padding: 16px 0 8px;
        border-bottom: 1px solid var(--sidebar-border);
    }
    .pfn-sidebar-featured ul { list-style: none; padding: 0; margin: 0; }
    .pfn-sidebar-featured li + li { margin-top: 2px; }

    .pfn-sidebar-nav { display: flex; flex-direction: column; padding: 0; }
    .pfn-sidebar-nav ul { list-style: none; padding: 0; margin: 0; }
    .pfn-sidebar-nav li + li { margin-top: 2px; }

    .pfn-sidebar-item {
        display: flex; align-items: center; gap: 8px;
        padding: 8px 12px;
        margin: 0 4px;
        border-radius: 6px;
        color: var(--sidebar-muted);
        font-size: 13px; font-weight: 500;
        text-decoration: none; cursor: pointer;
        transition: background-color 0.2s, color 0.2s;
    }
    .pfn-sidebar-featured .pfn-sidebar-item {
        padding: 8px 12px;
        color: #F3F4F6;
    }
    .pfn-sidebar-item:hover {
        background: var(--sidebar-hover-bg);
        color: #FFFFFF;
    }
    .pfn-sidebar-item.active {
        background: var(--sidebar-active-bg);
        color: #FFFFFF;
    }
    .pfn-sidebar-item .icon {
        width: 16px; height: 16px;
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
    }
    .pfn-sidebar-item .label { flex: 1; }
    .pfn-sidebar-item .external-icon {
        width: 12px; height: 12px;
        opacity: 0.5; flex-shrink: 0;
    }
    .pfn-sidebar-item .chevron {
        width: 16px; height: 16px;
        transition: transform 0.2s;
        flex-shrink: 0;
    }

    .pfn-sidebar-group { display: flex; flex-direction: column; }
    .pfn-sidebar-toggle { display: none; }
    .pfn-sidebar-sublist {
        max-height: 0; overflow: hidden;
        transition: max-height 0.25s ease;
    }
    .pfn-sidebar-sublist a {
        display: block; padding: 6px 12px 6px 36px;
        margin: 0 4px;
        border-radius: 6px;
        font-size: 12px; font-weight: 400;
        color: var(--sidebar-muted);
        text-decoration: none;
    }
    .pfn-sidebar-sublist a:hover { background: var(--sidebar-hover-bg); color: #FFFFFF; }
    .pfn-sidebar-toggle:checked + label.pfn-sidebar-item .chevron { transform: rotate(180deg); }
    .pfn-sidebar-toggle:checked + label.pfn-sidebar-item + .pfn-sidebar-sublist { max-height: 400px; }

    .pfn-sidebar-bottom-spacer {
        height: 92px;
        background: #000;
        border-top: 1px solid var(--sidebar-border);
    }

    .pfn-mobile-topbar {
        display: none;
        position: fixed; top: 0; left: 0;
        width: 100%; height: 36px;
        background: #000;
        align-items: center; justify-content: space-between;
        padding: 0; z-index: 2010;
    }
    .pfn-mobile-topbar .menu-btn {
        background: transparent; border: none; cursor: pointer;
        color: #FFF; padding: 8px;
        display: inline-flex; align-items: center; justify-content: center;
    }
    .pfn-mobile-topbar .mobile-logo {
        position: absolute; left: 50%; transform: translateX(-50%);
    }
    .pfn-mobile-topbar .mobile-logo img {
        height: 25px; width: 25px; object-fit: contain;
    }
    .pfn-mobile-topbar .right-spacer { width: 36px; }

    .pfn-sidebar-close-tab {
        display: none;
        position: fixed;
        top: 70px;
        left: 0;
        width: 28px; height: 56px;
        background: #000; color: #FFF;
        align-items: center; justify-content: center;
        cursor: pointer;
        border-radius: 0 8px 8px 0;
        border: 1px solid var(--sidebar-border);
        border-left: none;
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.15);
        z-index: 2011;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
    }
    .pfn-sidebar-close-tab:hover { background: #1a1a1a; }

    /* Blue hero banner */
    .pfn-hero-banner {
        background: linear-gradient(180deg, #0050A0 0%, #003A75 100%);
        box-shadow: inset 0 -30px 40px -30px rgba(0,0,0,0.15),
                    0 4px 6px -1px rgba(0,0,0,0.1);
        color: #fff;
        padding: 0;
        margin-bottom: 0;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .pfn-hero-banner .header-container {
        width: 100%;
        max-width: 1250px;
        padding: 0 24px;
        justify-content: flex-start;
    }
    .pfn-hero-banner .header-text {
        margin: 0;
        font-weight: 800;
        font-size: 36px;
        line-height: 1.15;
        letter-spacing: -0.01em;
        color: #FFFFFF;
        text-align: left;
    }
    .pfn-hero-banner .updated-timestamp-container {
        display: block;
        width: 100%;
        max-width: 1250px;
        padding: 4px 24px 0;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.04em;
        color: rgba(255, 255, 255, 0.85);
        text-transform: uppercase;
        text-align: left;
    }
    @media (max-width: 949px) {
        .pfn-hero-banner { height: 80px; }
        .pfn-hero-banner .header-container { padding: 0 16px; justify-content: center; }
        .pfn-hero-banner .header-text { font-size: 18px; font-weight: 500; text-align: center; }
        .pfn-hero-banner .updated-timestamp-container { font-size: 12px; padding: 4px 16px 0; text-align: center; }
    }

    /* Sidebar shifts main content on desktop */
    .pfn-content-wrapper.has-sidebar-nav {
        width: calc(100% - var(--sidebar-width)) !important;
        margin-left: var(--sidebar-width);
        margin-top: 0 !important;
    }

    @media (max-width: 1199px) {
        .pfn-sidebar-wrapper {
            transform: translateX(-100%);
            transition: transform 0.25s ease;
        }
        #sidebar-mobile-toggle:checked ~ .pfn-sidebar-wrapper { transform: translateX(0); }
        .pfn-mobile-topbar { display: flex; }
        .pfn-sidebar-close-tab { display: flex; }
        #sidebar-mobile-toggle:checked ~ .pfn-sidebar-close-tab {
            transform: translateX(var(--sidebar-width));
        }

        .pfn-content-wrapper.has-sidebar-nav {
            width: 100% !important;
            margin-left: 0;
            margin-top: 35px !important;
        }

        .has-sidebar-nav .pfn-content-container {
            margin-top: 0 !important;
        }

        .has-sidebar-nav .content .mobile-top-adv-container {
            position: sticky;
            top: 36px;
            z-index: 1999;
        }

        .pfn-header-container .header-h1-container {
            display: none !important;
        }

        .pfn-header-wrapper .pfn-header-container .header-logo-container {
            left: 50%;
            right: unset;
            transform: translateX(-50%);
        }

        .pfn-secondary-wrapper { display: none !important; }
    }

    @media (min-width: 769px) and (max-width: 1199px) {
        .pfn-header-wrapper {
            background: transparent !important;
        }
        .pfn-header-wrapper .pfn-header-container {
            display: none !important;
        }
    }

    /* Yellow promo bar */
    .pfn-promo-bar {
        background: #FFD166;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        height: 55px;
        display: flex;
        align-items: center;
    }
    .pfn-promo-bar .pfn-promo-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        transition: filter 0.2s;
        width: 100%;
        height: 100%;
    }
    .pfn-promo-bar .pfn-promo-link:hover { filter: brightness(1.03); }
    .pfn-promo-inner {
        max-width: 1250px; margin: 0 auto;
        padding: 0 16px;
        display: flex; align-items: center; gap: 40px;
        width: 100%;
    }
    .pfn-promo-eyebrow {
        flex-shrink: 0;
        padding-right: 12px;
        border-right: 1px solid rgba(0, 0, 0, 0.15);
        font-size: 14px; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase;
        color: #111111;
    }
    .pfn-promo-message {
        flex: 1; min-width: 0;
        text-align: center;
        font-size: 16px; font-weight: 500; color: #111111;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .pfn-promo-cta {
        flex-shrink: 0;
        display: inline-flex; align-items: center; gap: 4px;
        padding: 8px 16px;
        background: #0050A0; color: #FFFFFF;
        font-size: 14px; font-weight: 700;
        letter-spacing: 0.04em; text-transform: uppercase;
        border-radius: 999px; white-space: nowrap;
        transition: background 0.2s;
    }
    .pfn-promo-bar a:hover .pfn-promo-cta { background: #003A75; }
    .pfn-promo-arrow { display: inline-block; transition: transform 0.2s; }
    .pfn-promo-bar a:hover .pfn-promo-arrow { transform: translateX(2px); }

    /* Nav links hidden by default, shown below 1200px */
    .pfn-promo-nav-links {
        display: none;
        justify-content: center;
        align-items: center;
        gap: 24px;
        padding: 10px 16px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .pfn-promo-nav-links::-webkit-scrollbar { display: none; }
    .pfn-promo-nav-links a {
        font-size: 14px; font-weight: 600;
        color: #111111; text-decoration: none;
        white-space: nowrap;
        transition: color 0.2s;
    }
    .pfn-promo-nav-links a:hover { color: #0050A0; }

    @media (max-width: 1199px) {
        .pfn-promo-bar .pfn-promo-link { display: none; }
        .pfn-promo-bar { justify-content: center; }
        .pfn-promo-nav-links { display: flex; }
    }

    @media (max-width: 950px) {
        .pfn-promo-nav-links { justify-content: flex-start; }
        .pfn-promo-nav-desktop { display: none; }
    }

    @media (max-width: 640px) {
        .pfn-promo-eyebrow { display: none; }
        .pfn-promo-message { text-align: left; font-size: 14px; }
        .pfn-promo-cta { font-size: 11px; padding: 6px 10px; }
    }

    /* Constrain content width when sidebar is present */
    .has-sidebar-nav .pfn-content-container {
        max-width: 100%;
    }
    .has-sidebar-nav .pfn-content-container .content,
    .has-sidebar-nav .pfn-content-container .content.full-width {
        width: 100% !important;
        max-width: 100%;
        min-width: 0;
    }

</style>
