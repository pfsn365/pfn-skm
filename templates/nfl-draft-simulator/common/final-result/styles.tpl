{if !$is_desktop}
  {function getMDSFinalResultMobileCSS}
    <style>
      .final-trades-container {
        display: flex;
        flex-direction: column;
        height: unset;
        padding: unset;
        margin-bottom: 30px;
        gap: 6px;
      }

      .teams-result-container {
        width: 100%;
        flex-direction: row;
        gap: 0px;
      }

      .selected-teams-container {
        overflow-x: auto;
        flex-direction: row;
        margin: 5px 0px;
        padding-bottom: 10px;
      }

      .selected-teams-container button {
        padding: 6px;
        border-radius: 30px;
        width: 40px;
      }

      .selected-teams-container button.selected {
        border: 2px solid #D32F2F;
      }

      .result-header {
        padding: 5px 12px;
        background: linear-gradient(90deg, #080A3C 0%, #000572 101.25%);
        color: #FFFFFF;
        border-radius: 8px 8px 0 0;
        width: 100%;
      }

      .full-result-header-text-container .full-draft-result-text {
        font-size: 14px;
        line-height: 21px;
      }

      .result-header .team-container {
        font-weight: 500;
        font-size: 14px;
        line-height: 21px;
        gap: 2px;
      }

      .result-header .team-container img {
        width: 33px;
        height: 22px;
        background: none;
      }

      .result-header .sk-logo-draft-simulator {
        width: 125px;
        height: 28px;
      }

      .final-trades-container .final-trades-holder {
        padding: unset;
        height: 102vh;
        gap: 6px;
        width: 100%;
        padding: 8px 22px;
        /* max-height: 890px !important; */
      }

      .final-trades-holder {
        height: unset !important;
      }

      .traded-player-name-position-container .player-name {
        font-size: 12px;
        line-height: 12px;
      }


      .rounds-pics-holder .traded-player-name-position-container .player-name {
        font-size: 15px;
        line-height: 18px;
      }

      .final-trades-holder .pic-container .pic-number {
        font-size: 12px;
      }

      .rounds-pics-holder .traded-player-name-position-container .player-position {
        font-size: 13px;
      }

      .mypicks-container .traded-player-name-position-container .player-position,
      .mypicks-container .player-position-draftfrom-holder .player-draftfrom {
        font-size: 13px;
        line-height: 18px;
      }

      .traded-player-name-position-container .player-position {
        font-size: 11px;
        line-height: 18px;
      }

      .final-trades-holder .pic-container {
        margin: unset;
        padding-bottom: unset;
        width: 51%;
        border-bottom: unset;
        height: 34px;
      }

      .final-trades-holder .pic-container img {
        width: 27px;
        height: 18px;
      }

      .rounds-holder {
        display: flex;
        gap: 8px;
      }

      .url-holder {
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        border-radius: unset;
      }

      .final-result-container {
        background: #FFFFFF;
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      .draft-picks-text {
        font-size: 12px;
        line-height: 15px;
        padding: 2px 16px;
      }

      .rounds-utilities-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 16px;
        min-height: 60px;
      }

      .rounds-container {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: none;
        overflow: -moz-scrollbars-none;
        -ms-overflow-style: -ms-autohiding-scrollbar;
      }

      .rounds-container::-webkit-scrollbar {
        display: none;
      }

      .utility-container {
        display: flex;
        align-items: center;
        gap: 16px;
        justify-content: center;
        border: 1px solid white;
        width: 30%;
        border-radius: 28px;
        align-self: center;
      }

      @keyframes blinker {
        50% {
          opacity: 0;
        }
      }

      .btn-blinker {
        animation: blinker 1.5s linear infinite;
      }

      .final-trades-holder .pic-container .pick-trade-info-btn {
        top: 18px;
        left: 47px;
      }

      .final-trades-container .tools-btn-utility-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 84%;
        width: 100%;
        left: 0;
      }

      .final-trades-container .tools-btn-utility-container .tools-btn-utility-holder {
        border-radius: 25px;
        display: flex;
        justify-content: center;
      }

      .final-trades-container .load-pfn-tools-btn {
        background: #0b56bf;
        border: 1px solid #e3dddd;
        border-radius: 25px;
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        margin-right: -35px;
        padding: 13px 40px 13px 14px;
        cursor: pointer;
      }

      .tools-btn-utility-container .utility-container {
        align-items: center;
        background: #222;
        border: 1px solid #e3dddd;
        border-radius: 25px;
        display: flex;
        gap: 32px;
        justify-content: center;
        min-width: 65px;
        padding: 12px 45px;
      }

      .utility-container .download-btn,
      .utility-container .share-btn-mds {
        background: none;
        border: initial;
        padding: initial;
        border-radius: 12px;
      }

      .round-selector {
        border-radius: unset;
      }

      .round-selector.selected {
        background: #222;
        color: #fff;
      }

      .result-screen-dashboard .login-container-overlay {
        position: fixed;
      }

      .result-screen-dashboard .login-container-overlay .login-container {
        position: fixed;
        top: 312px;
        z-index: 100000;
        flex-direction: column;
        width: 100%;
        background: #f5f5f5;
        gap: 10px;
        padding: 10px 0;
      }

      .result-screen-dashboard .dashboard-holder .dashboard-section-data {
        margin-bottom: 100px;
      }

      .result-screen-dashboard .dashboard-holder .dashboard-header {
        border-bottom: unset;
      }

      .result-screen-dashboard .login-container {
        height: unset;
      }

      .mockdraft-simulator .trade-grades-section {
        padding: 16px 0 0 0;
      }

      .mockdraft-simulator .trade-card {
        padding: 16px 10px;
      }

      .mockdraft-simulator .mobile-grade-toggle {
        width: 22%;
      }

      .single-column-picks .upper-picks-holder .pic-container,
      .single-column-picks .team-selection-body .pic-container,
      .single-column-picks .final-trades-holder .pic-container {
        position: relative !important;
        width: 100% !important;
      }

      .single-column-picks .upper-picks-holder .pic-container .traded-player-name-position-container,
      .single-column-picks .team-selection-body .pic-container .traded-player-name-position-container,
      .single-column-picks .final-trades-holder .pic-container .traded-player-name-position-container {
        overflow: visible !important;
        flex: unset !important;
      }

      .single-column-picks .upper-picks-holder .pic-container .traded-player-name-position-container .player-name,
      .single-column-picks .team-selection-body .pic-container .traded-player-name-position-container .player-name,
      .single-column-picks .final-trades-holder .pic-container .traded-player-name-position-container .player-name {
        white-space: nowrap !important;
        text-overflow: unset !important;
        overflow: visible !important;
      }

      .single-column-picks .upper-picks-holder .pic-container .pick-grade,
      .single-column-picks .team-selection-body .pic-container .pick-grade,
      .single-column-picks .final-trades-holder .pic-container .pick-grade {
        position: absolute !important;
        right: 4px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
      }

      .mockdraft-simulator .trade-details {
        flex-direction: column;
        gap: 12px;
      }

      .mockdraft-simulator .trade-arrow {
        transform: rotate(90deg);
        padding: 0;
        align-self: center;
      }
    </style>
  {/function}
{/if}
<style>
  .final-trades-container {
    width: 100%;
    border: 1px solid #E9E9E9;
    padding: 17px 23px;
    display: flex;
    gap: 20px;
    height: 77vh;
    justify-content: flex-start;
  }

  .teams-result-container {
    width: 17%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .teams-result-container button.selected {
    border-color: #D32F2F;
  }

  .selected-teams-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 550px;
    justify-content: flex-start;
  }

  .final-trades-container .teams-result-container .selected-teams-holder {
    overflow-y: auto
  }

  .selected-teams-holder button {
    width: 100%;
  }

  .selected-teams-container img {
    background: transparent !important;
  }

  .result-btn {
    padding: 28px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    border: 1px solid #E9E9E9;
    color: #474747;
  }

  .rounds-utility-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    min-height: 37px;
  }

  .utility-container {
    display: flex;
    gap: 25px;
  }

  .utility-container img {
    background: transparent !important;
  }

  .teams-result-container .restart-simulation {
    border-radius: 30px;
    width: 100%;
    padding: 10px;
    border: none;
    background-color: #37C77A;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: white;
  }

  .selected-teams-container span {
    color: #474747;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }

  .selected-teams-container button {
    border: 1px solid #E9E9E9;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25px;
    gap: 18px;
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 15px;
    top: 0;
    width: 100%;
    background: linear-gradient(90deg, #080A3C -0.79%, #010573 100%);
    border: 1px solid #080A3C;
    border-radius: 8px 8px 0 0;
    min-height: 56px;
  }

  .full-result-header-text-container .full-draft-result-text {
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
    color: #FFFFFF;
  }

  .result-header img {
    background: none !important;
    margin: unset;
  }

  .result-header .team-container {
    display: flex;
    gap: 8px;
  }

  .result-header .team-container span {
    color: #fff;
  }

  .utility-container button {
    border: none;
    padding: none;
  }

  .final-trades-container .final-trades-holder {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 20px;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  .final-trades-container .final-trades-holder::-webkit-scrollbar {
    display: none;
  }

  .final-result-container .team-container img {
    width: 47px;
  }

  .team-container button {
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .final-result-container .pic-container {
    margin-left: 20px;
    width: 30%;
    border-bottom: none;
    height: 38px;
  }

  .url-holder {
    border-radius: 0 0 8px 8px;
    padding: 4px 0px;
    text-align: center;
    bottom: 0;
    width: 100%;
    background: #F5F5F5;
    color: #2D2D2D;
  }

  .draft-picks-text {
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    color: #2D2D2D;
    background: #F5F5F5;
    padding: 4px 19px;
    display: flex;
    justify-content: flex-start;
  }

  .results-container .rounds-holder {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
  }

  .results-container {
    width: 85%;
    display: flex;
    flex-direction: column;
  }

  .round-selector {
    color: #474747;
    font-weight: 500;
    font-size: 12px;
    line-height: 17px;
    border-radius: 30px;
    padding: 10px 12px;
    border: none;
    background: #E9E9E9;
  }

  .round-selector.selected {
    color: #fff;
    background: #D32F2F;
  }

  .final-result-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  section.quick-links-widget {
    display: none;
    margin-bottom: 20px;
  }

  .final-result-container .final-result-holder {
    display: flex;
    flex-direction: column;
    border: 1px solid #E9E9E9;
    padding: 14px 22px;
    gap: 20px;
  }

  .final-result-container .final-result-holder .final-result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .final-result-container .final-result-holder .final-result-header .result-btns-holder {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .final-result-header .result-btns-holder button {
    background: #f5f5f5;
    padding: 9px 25px;
    border: unset;
    font-size: 15px;
    color: #999;
    font-weight: 600;
  }

  .final-result-header .result-btns-holder button.selected {
    background: #080A3C;
    color: #fff;
  }

  .final-result-holder .utility-container {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
  }

  .final-result-holder .utility-container .download-btn-mds,
  .final-result-holder .utility-container .share-btn-mds {
    background: #f5f5f5;
    border: 1px solid #e9e9e9;
    border-radius: 12px;
    padding: 11px 12px;
    cursor: pointer;
    display: flex;
  }

  .utility-container .download-btn img {
    width: 16px;
    height: 16px;
  }

  .utility-container .-mds img {
    width: 16px;
    height: 16px;
  }

  .utility-container .restart-sim-btn,
  .utility-container .back-to-room-btn {
    font-size: 15px;
    background: #37C77A;
    padding: 11px 20px;
    border-radius: 4px;
    color: #fff;
    font-weight: 600;
    border: unset;
  }

  .final-result-container .teams-result-holder {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .teams-result-holder .user-teams-holder {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: scroll;
  }

  .teams-result-holder .user-teams-holder .user-selected-teams {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }

  .teams-result-holder .team-selections-holder {
    display: flex;
    flex-direction: column;
    border: 1px solid #080a3c;
    border-radius: 8px;
  }

  .teams-result-holder .team-selections-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #080A3C -0.79%, #010573 100%);
    border-radius: 7px 7px 0 0;
    padding: 6px 15px;
  }

  .teams-result-holder .team-result-logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .user-teams-holder .user-selected-teams button {
    border: unset;
    opacity: 0.4;
  }

  .user-teams-holder .user-selected-teams button.selected {
    opacity: 1;
  }

  .user-teams-holder .user-selected-teams img,
  .teams-result-holder .result-header-team-logo {
    width: 50px;
    height: 33px;
    background: unset;
  }

  .teams-result-holder .team-selection-body,
  .all-rounds-trades-container .round-selection-body {
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    max-height: 600px;
    flex-wrap: wrap;
    width: 100%;
  }

  .all-rounds-trades-container .round-selection-body {
    max-height: 722px;
  }

  .teams-result-holder .result-header-team-name {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
  }

  .final-result-holder .all-rounds-trades-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    align-items: flex-start;
  }

  .final-result-holder .all-rounds-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
  }

  .all-rounds-trades-container .round-trades-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: 1px solid #080a3c;
    width: 100%;
  }

  .round-trades-container .rounds-trades-header .sk-logo-draft-simulator {
    margin: unset;
    background: unset;
  }

  .round-trades-container .rounds-trades-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #080A3C -0.79%, #010573 100%);
    border-radius: 7px 7px 0 0;
    padding: 6px 15px;
    width: 100%;
  }

  .rounds-trades-header .full-result-text-container {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
  }

  .all-rounds-container .round-trades-selector {
    background: #f5f5f5;
    border: 1px solid #e9e9e9;
    border-radius: 2px;
    box-shadow: 1px 1px 7px 0 rgba(0, 0, 0, .07);
    color: #474747;
    padding: 8px 12px;
  }

  .all-rounds-container .round-trades-selector.selected {
    background: #080A3C;
    color: #fff;
  }

  .final-result-container .pic-container .pick-trade-info-btn {
    position: absolute;
    top: 23px;
    left: 63px;
  }

  .final-result-container .pic-container .pick-trade-info-btn .trade-icon {
    width: 13px;
    height: 13px;
  }

  .final-result-container .result-screen-dashboard {
    position: relative;
  }

  .result-screen-dashboard .login-container-overlay {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 51px;
    background: rgba(223, 223, 223, 0.1);
    backdrop-filter: blur(2px);
  }

  .result-screen-dashboard .login-container-overlay .view-performance-text {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: #2d2d2d;
  }

  .result-screen-dashboard .login-container-overlay .dashboard-login-btn {
    border: unset;
    border-radius: 6px;
    padding: 12px 0;
    background: linear-gradient(91.11deg, #00AD51 -0.4%, #37C77A 49.94%, #00AD51 100.28%);
    box-shadow: 0px 2.95px 0px 0px #026831;
    color: #fff;
    width: 175px;
    font-size: 16px;
    font-weight: 800;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
  }

  .result-screen-dashboard .login-container-overlay .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .result-screen-dashboard .login-container {
    background: #f5f5f5;
    width: 100%;
    height: 62px;
  }

  .final-result-container .dashboard-loading-overlay,
  .final-trades-container .dashboard-loading-overlay {
    display: none;
  }

  .final-result-container .header-text-container {
    display: none;
  }

  .final-result-container .dashboard-btn {
    position: relative;
  }

  .final-result-container .dashboard-btn .new-text {
    position: absolute;
    top: -15px;
    right: 0;
    background: #d32f2f;
    color: #fff;
    padding: 1px 5px;
    font-size: 12px;
    line-height: 14px;
    font-weight: 600;
    border-radius: 3px;
  }

  /* === GRADING SYSTEM STYLES === */

  /* Grade Toggle Button */
  .mockdraft-simulator .grade-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .mockdraft-simulator .grade-toggle:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  .mockdraft-simulator .grade-toggle.active {
    background: #dbeafe;
    border-color: #2563eb;
    color: #1d4ed8;
  }

  .mockdraft-simulator .toggle-track {
    width: 34px;
    height: 18px;
    background: #d1d5db;
    border-radius: 9px;
    position: relative;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .mockdraft-simulator .grade-toggle.active .toggle-track {
    background: #2563eb;
  }

  .mockdraft-simulator .toggle-knob {
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: left 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }

  .mockdraft-simulator .grade-toggle.active .toggle-knob {
    left: 18px;
  }

  /* Grades Hidden State */
  .mockdraft-simulator .grades-hidden .pick-grade,
  .mockdraft-simulator .grades-hidden .overall-grade-row,
  .mockdraft-simulator .grades-hidden .mobile-overall-grade,
  .mockdraft-simulator .grades-hidden .trade-grade-badge {
    display: none;
  }

  /* Overall Draft Grade Banner */
  .mockdraft-simulator .overall-grade-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 8px 24px;
    background: #FFD166;
  }

  .mockdraft-simulator .overall-grade-label {
    font-size: 24px;
    font-weight: 500;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .mockdraft-simulator .header-grade {
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 1px;
    color: #000;
  }

  .mockdraft-simulator .mobile-overall-grade {
    padding: 6px 12px;
    background: #FFD166;
    border-radius: 0;
    margin-bottom: 4px;
    width: 100%;
    box-sizing: border-box;
  }

  .mockdraft-simulator .mobile-overall-grade .overall-grade-label {
    font-size: 13px;
    letter-spacing: 0.5px;
  }

  .mockdraft-simulator .mobile-overall-grade .header-grade {
    font-size: 18px;
  }

  /* Pick Grade (vertical bar + text) */
  .mockdraft-simulator .pick-grade {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 800;
    flex-shrink: 0;
    width: 40px;
    color: #374151;
    margin-left: auto;
  }

  .mockdraft-simulator .pick-grade::before {
    content: '';
    width: 3px;
    height: 18px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .mockdraft-simulator .pick-grade.grade-a-plus::before { background: #F5C518; }
  .mockdraft-simulator .pick-grade.grade-a::before { background: #2e7d32; }
  .mockdraft-simulator .pick-grade.grade-a-minus::before { background: #388e3c; }
  .mockdraft-simulator .pick-grade.grade-b-plus::before { background: #43a047; }
  .mockdraft-simulator .pick-grade.grade-b::before { background: #66bb6a; }
  .mockdraft-simulator .pick-grade.grade-b-minus::before { background: #9ccc65; }
  .mockdraft-simulator .pick-grade.grade-c-plus::before { background: #cddc39; }
  .mockdraft-simulator .pick-grade.grade-c::before { background: #ef6c00; }
  .mockdraft-simulator .pick-grade.grade-c-minus::before { background: #f57c00; }
  .mockdraft-simulator .pick-grade.grade-d-plus::before { background: #fb8c00; }
  .mockdraft-simulator .pick-grade.grade-d::before { background: #e53935; }
  .mockdraft-simulator .pick-grade.grade-d-minus::before { background: #c62828; }
  .mockdraft-simulator .pick-grade.grade-f::before { background: #7f0000; }

  /* Trade Grades Section */
  .mockdraft-simulator .traded-away-container {
    padding-bottom: 16px;
  }
  .mockdraft-simulator .trade-grades-section {
    border-top: 2px solid #e5e7eb;
    padding: 16px 24px;
  }

  .mockdraft-simulator .trade-grades-section .trade-grades-label {
    font-size: 13px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 14px;
  }

  .mockdraft-simulator .trade-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 12px;
  }

  .mockdraft-simulator .trade-card:last-child {
    margin-bottom: 0;
  }

  .mockdraft-simulator .trade-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .mockdraft-simulator .trade-card-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .mockdraft-simulator .trade-card-round {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
  }

  .mockdraft-simulator .trade-grade-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 800;
    color: #374151;
  }

  .mockdraft-simulator .trade-grade-badge::before {
    content: '';
    width: 3px;
    height: 18px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .mockdraft-simulator .trade-grade-badge.grade-a-plus::before { background: #F5C518; }
  .mockdraft-simulator .trade-grade-badge.grade-a::before { background: #2e7d32; }
  .mockdraft-simulator .trade-grade-badge.grade-a-minus::before { background: #388e3c; }
  .mockdraft-simulator .trade-grade-badge.grade-b-plus::before { background: #43a047; }
  .mockdraft-simulator .trade-grade-badge.grade-b::before { background: #66bb6a; }
  .mockdraft-simulator .trade-grade-badge.grade-b-minus::before { background: #9ccc65; }
  .mockdraft-simulator .trade-grade-badge.grade-c-plus::before { background: #cddc39; }
  .mockdraft-simulator .trade-grade-badge.grade-c::before { background: #ef6c00; }
  .mockdraft-simulator .trade-grade-badge.grade-c-minus::before { background: #f57c00; }
  .mockdraft-simulator .trade-grade-badge.grade-d-plus::before { background: #fb8c00; }
  .mockdraft-simulator .trade-grade-badge.grade-d::before { background: #e53935; }
  .mockdraft-simulator .trade-grade-badge.grade-d-minus::before { background: #c62828; }
  .mockdraft-simulator .trade-grade-badge.grade-f::before { background: #7f0000; }

  .mockdraft-simulator .trade-details {
    display: flex;
    gap: 20px;
    align-items: stretch;
  }

  .mockdraft-simulator .trade-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mockdraft-simulator .trade-side-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #9ca3af;
    margin-bottom: 2px;
  }

  .mockdraft-simulator .trade-asset {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
  }

  .mockdraft-simulator .trade-asset-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    flex-shrink: 0;
    object-fit: contain;
  }

  .mockdraft-simulator div.trade-asset-icon.sent {
    background: #fee2e2;
    color: #b91c1c;
  }

  .mockdraft-simulator div.trade-asset-icon.received {
    background: #dcfce7;
    color: #15803d;
  }

  .mockdraft-simulator img.trade-asset-icon {
    border-radius: 50%;
    background: #f3f4f6;
    padding: 2px;
  }

  .mockdraft-simulator .trade-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #d1d5db;
    padding: 0 4px;
  }

  .mockdraft-simulator .trade-asset-value {
    margin-left: auto;
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
    white-space: nowrap;
  }

  .mockdraft-simulator .trade-side-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px dashed #d1d5db;
    font-size: 12px;
    font-weight: 700;
    color: #374151;
  }

  .mockdraft-simulator .trade-net-value {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
    font-size: 13px;
    font-weight: 700;
    color: #374151;
    gap: 6px;
  }

  .mockdraft-simulator .trade-value-source {
    font-size: 10px;
    color: #9ca3af;
    font-weight: 500;
    font-style: italic;
    text-align: right;
    margin-top: 6px;
  }

  .mockdraft-simulator .team-result-logo-container {
    flex-wrap: wrap;
  }

  /* Mobile grade toggle in team selection row */
  .mockdraft-simulator .teams-result-container {
    display: flex;
    align-items: center;
  }

  .mockdraft-simulator .teams-result-container .selected-teams-container {
    width: 78%;
    flex-shrink: 0;
  }

  .mockdraft-simulator .mobile-grade-toggle {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    white-space: nowrap;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .mockdraft-simulator .mobile-grade-toggle.active {
    background: #dbeafe;
    border-color: #2563eb;
    color: #1d4ed8;
  }

  .mockdraft-simulator .mobile-grade-toggle .toggle-track {
    width: 28px;
    height: 15px;
    background: #d1d5db;
    border-radius: 8px;
    position: relative;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .mockdraft-simulator .mobile-grade-toggle.active .toggle-track {
    background: #2563eb;
  }

  .mockdraft-simulator .mobile-grade-toggle .toggle-knob {
    width: 11px;
    height: 11px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: left 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }

  .mockdraft-simulator .mobile-grade-toggle.active .toggle-knob {
    left: 15px;
  }

  /* === END GRADING SYSTEM STYLES === */
</style>

{if !$is_desktop}
  {call getMDSFinalResultMobileCSS}
{/if}
