<style>
  .lineup-optimizer-container {
    margin-bottom: unset;
  }

  .filters-container .filters-header {
    background: #222;
  }

  .filters-container button.build-lineups {
    background: #d32f2f;
    border-radius: 25px;
  }

  .players-category-buttons-container .players-category.selected {
    color: #D32F2F;
    border-bottom-color: #D32F2F;
  }

  button.position-filter.selected {
    background-color: #333;
  }

  button.position-filter {
    border-radius: 2px;
  }

  .build-lineups-bottom {
    border-radius: 74px;
    background: #D32F2F;
  }

  .refresh-lineup-download-csv-container .refresh-lineup-btn {
    border-radius: 74px;
    background: #D32F2F;
  }

  .player-search-container .search-icon-holder {
    padding: 7px 0 7px 10px;
  }

  .lineup-player-details-container {
    gap: unset;
  }

  .substitute-players-list .substitute-player-details-container {
    gap: unset;
  }

  .player-substitution-container .auto-substitute-player-btn,
  .confirmation-btns-container .confirm-reset {
    border-radius: 25px;
    background: #D32F2F;
  }

  .players-lineups-container .feedback-container {
    margin: -10px 0px;
  }

  @media (max-width: 768px) {
    .lineup-optimizer-container {
      margin-bottom: 110px;
    }

    button.build-lineups {
      background: #d32f2f;
      border-radius: 25px;
      position: fixed;
      bottom: 70px;
      margin-bottom: unset;
    }

    .refresh-lineup-download-csv-container {
      position: fixed;
      bottom: 64px;
    }

    .feedback-container .feedback-parent-container .feedback-cta-container .feedback-cta-button {
      border: 1px solid #e9e9e9;
      border-radius: 4px;
    }
  }
</style>

{if isset($include_feedback) && $include_feedback}
  {include file="third-party/proxy/$brand/common/feedback-cta-styles.tpl"}
{/if}
