<style>
  .filters-container {
    display: flex;
    flex-direction: column;
  }

  .filters-container .filters-header {
    padding: 10px 20px;
    border-radius: 12px 12px 0 0;
    background: #080A3C;
    text-align: left;
  }

  .filters-header .filters-header-text {
    color: #FFF;
    font-size: 16px;
    font-weight: 500;
  }

  .filters-container .filters-holder {
    padding: 10px 20px 16px 20px;
    background: #f5f5f5;
    border-radius: 0 0 6px 6px;
  }

  .filters-holder .websites-slates-container {
    display: flex;
    justify-content: flex-start;
    gap: 45px;
    align-items: center;
  }

  .websites-slates-container label {
    color: #2D2D2D;
    font-size: 14px;
    font-weight: 600;
  }

  .websites-slates-container select {
    color: #2D2D2D;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid #E9E9E9;
    background: #FFF;
    padding: 6px 4px;
    min-width: 85px;
  }

  .websites-slates-container .websites-filter,
  .websites-slates-container .slates-filter,
  .websites-slates-container .match-type-filter {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .filters-holder .matches-container {
    display: flex;
    position: relative;
    margin-top: 15px;
    overflow-x: hidden;
  }

  .matches-container .matches-holder {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  .matches-container .carousel-control-right-btn-holder {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
    right: -40px;
  }

  .matches-container .right-scroll-button {
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #dfdfdf;
    box-shadow: 3px 1px 10px rgba(0, 0, 0, 0.05);
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: unset;
  }

  .matches-container .right-scroll-button img {
    width: 12px;
    height: 18px;
    object-fit: cover;
    display: block;
    position: relative;
    left: -16px;
  }

  .matches-container .left-scroll-button img {
    width: 12px;
    height: 18px;
    object-fit: cover;
    display: block;
    position: relative;
    rotate: 180deg;
    right: -15px;
  }

  .matches-container .left-scroll-button {
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #dfdfdf;
    box-shadow: 3px 1px 10px rgba(0, 0, 0, 0.05);
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: unset;
  }

  .matches-container .carousel-control-left-btn-holder {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
    left: -40px;
  }

  .filters-container .exclude-match-info {
    color: #999;
    font-size: 12px;
    font-weight: 400;
    margin-top: 8px;
  }

  .filters-container .no-slate-uploaded-info {
    color: #999;
    font-size: 12px;
    font-weight: 400;
    position: relative;
    left: -30px;
  }

  .filters-container .count-build-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
  }

  .count-build-container .lineup-count-selection {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .count-build-container .lineup-count-selection-text {
    color: #2D2D2D;
    font-size: 14px;
    font-weight: 600;
  }

  .filters-container .lineup-count-text-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }

  .filters-container button.build-lineups {
    width: 318px;
    background: #37C77A;
    padding: 10px 0;
    border-radius: 6px;
    border: none;
    color: #FFF;
    font-size: 14px;
    font-weight: 500;
  }

  .filters-container button.decrease-count,
  .filters-container button.increase-count {
    border: none;
    border-radius: 25px;
    padding: 5px 9px;
    background: #e9e9e9;
  }

  .filters-container button.decrease-count {
    opacity: 0.4;
  }

  .filters-container button.decrease-count img {
    background: none;
    width: 8px;
    height: 10px;
  }

  .filters-container button.increase-count img {
    background: none;
    width: 12px;
    height: 12px;
  }

  .filters-container .lineup-count-input {
    width: 48px;
    height: 25px;
    border: 1px solid #37C77A;
    background: #FFF;
    text-align: center;
  }

  .filters-container .lineup-count-input:focus {
    outline: none !important;
    border: 1px solid #37C77A;
  }

  .matches-holder .match-holder {
    padding: 8px;
    background: #fff;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    width: 115px;
  }

  .matches-holder .match-time-holder {
    color: #999;
    font-size: 12px;
    font-weight: 400;
  }

  .matches-holder .team-holder {
    padding: 4px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 7px;
    border-radius: 2px;
    border: 1px solid #999;
    width: 83px;
  }

  .matches-holder .team-name-holder {
    color: #666;
    font-size: 14px;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    .lineup-optimizer-container .filters-wrapper {
      padding: 0 16px;
    }

    .filters-wrapper .filters-container {
      border: 1px solid #2d2d2d;
      padding: 6px;
      border-radius: 6px;
      background: #f5f5f5;
    }

    .count-build-container .lineup-count-selection {
      width: 100%;
      justify-content: space-between;
    }

    .filters-holder .websites-slates-container {
      flex-direction: column;
      gap: 18px;
      align-items: flex-start;
    }

    .filters-holder .matches-container {
      margin-top: 10px;
    }

    .filters-header .filters-header-text {
      font-size: 12px;
    }

    .filters-container .filters-header {
      padding: 5px 10px;
      border-radius: 6px 6px 0 0;
    }

    .filters-container .filters-holder {
      padding: 12px 6px;
    }

    .websites-slates-container label {
      font-size: 12px;
    }

    .websites-slates-container select {
      max-width: 120px;
      min-width: 90px;
    }

    .filters-container .no-slate-uploaded-info {
      left: unset;
    }
  }
</style>
