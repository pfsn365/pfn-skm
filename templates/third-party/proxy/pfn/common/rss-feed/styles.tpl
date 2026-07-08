<style>
  .nfl-feeds-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #DFE1E6;
    padding: 23px;
    gap: 16px;
  }

  .nfl-feeds-container .header-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .nfl-feeds-container .header-container .header-bar {
    width: 4px;
    background: #172B4D;
    height: 21px;
  }

  .nfl-feeds-container .header-container .header-text {
    font-size: 16px;
    line-height: 21px;
    font-weight: 700;
    color: #172B4D;
  }

  .nfl-feeds-container .feeds-holder {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .nfl-feeds-container .feeds-holder .single-feed {
    width: calc(50% - 10px);
    display: flex;
    gap: 16px;
    text-decoration: none;
    justify-content: center;
    align-items: center;
  }

  .nfl-feeds-container .feeds-holder .single-feed img {
    border-radius: 12px;
    width: 100px;
    height: 80px;
  }

  .single-feed .feed-data-container {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    gap: 4px;
    justify-content: space-between;
    align-items: center;
  }

  .single-feed .feed-data-container .feed-title {
    font-size: 14px;
    line-height: 21px;
    font-weight: 500;
    color: #0A0A0A;
    max-height: 65px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .single-feed .feed-data-container .feed-time {
    font-size: 11px;
    line-height: 16px;
    font-weight: 400;
    color: #0A0A0A;
    align-self: flex-start;
  }

  .nfl-feeds-container button.load-more-feeds-btn {
    margin-top: 5px;
    width: 100%;
    padding: 8px 0;
    background: #172B4D;
    color: #fff;
    font-size: 16px;
    line-height: 18px;
    font-weight: 500;
    border: unset;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    .nfl-feeds-container {
      border: unset;
      padding: 16px;
      margin-bottom: 100px;
    }

    .nfl-feeds-container .header-container .header-text {
      font-size: 14px;
      line-height: 19px;
    }

    .nfl-feeds-container .header-container .header-bar {
      width: 2px;
      height: 18px;
    }

    .nfl-feeds-container .feeds-holder {
      gap: 14px;
      flex-direction: column;
    }

    .nfl-feeds-container .feeds-holder .single-feed {
      width: 100%;
    }

    .nfl-feeds-container .feeds-holder .single-feed img {
      width: 84px;
      height: 73px;
    }

    .single-feed .feed-data-container .feed-title {
      font-size: 14px;
      line-height: 18px;
      max-height: 55px;
    }

    .single-feed .feed-data-container .feed-time {
      font-size: 12px;
      line-height: 15px;
    }

    .nfl-feeds-container button.load-more-feeds-btn {
      font-size: 14px;
    }
  }
</style>
