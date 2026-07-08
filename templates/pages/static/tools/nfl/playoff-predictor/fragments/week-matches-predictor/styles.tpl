<style>
  .week-matches-wrapper {
    color: #666666;
  }

  .week-matches-wrapper .week-carousel {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 10px 0px;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .week-matches-wrapper .week-carousel .week-holder {
    width: 100%;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 18px;
    background-color: #f5f5f5;
    border: 1px solid #E9E9E9;
    box-shadow: 1px 1px 4px 0px #00000012;
    cursor: pointer;
  }

  .week-matches-wrapper .week-carousel .selected-week {
    background-color: #222222;
    color: #E9E9E9;
    transition: 400ms;
  }

  .week-matches-wrapper .week-matches-container {
    overflow-y: auto;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }

  .week-matches-wrapper .current-week-matches-container {
    background: #fff;
    padding: 0 10px 10px 10px;
    display: flex;
    flex-direction: column;
  }

  .week-matches-wrapper .week-matches-container .match-container {
    display: flex;
    background-color: #fff;
    padding: 4px;
    border-radius: 4px;
    align-items: center;
    gap: 8px;
  }

  .week-matches-wrapper .score-input-container {
    display: flex;
    justify-content: space-between;
    width: 40%;
    align-items: center;
  }

  .week-matches-wrapper .week-matches-container .away-team-logo,
  .week-matches-wrapper .week-matches-container .home-team-logo {
    height: 28px;
    width: 42px;
    margin: unset;
  }

  .week-matches-wrapper .week-matches-container .tie-container {
    border: 1px solid #E9E9E9;
    width: 36px;
    height: 30px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .week-matches-wrapper .week-matches-container .tie-container span {
    padding: unset;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0em;
  }


  .week-matches-wrapper .week-matches-container .away-team-name-holder,
  .week-matches-wrapper .week-matches-container .home-team-name-holder {
    padding: unset;
    font-size: 16px;
    font-weight: 500;
  }

  .week-matches-wrapper .week-matches-container .away-team-win-lose-holder,
  .week-matches-wrapper .week-matches-container .home-team-win-lose-holder {
    padding: unset;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0em;
    text-align: center;
    white-space: nowrap;
  }

  .week-matches-wrapper .week-matches-container .away-team-details-holder,
  .week-matches-wrapper .week-matches-container .home-team-details-holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }


  .week-matches-wrapper .away-team-container,
  .week-matches-wrapper .home-team-container {
    display: flex;
    border: 1px solid #9999996e;
    width: 30%;
    border-radius: 4px;
    justify-content: space-between;
    cursor: pointer;
    align-items: center;
  }

  .week-matches-wrapper .week-matches-container .selected-team {
    border: 1px solid #37C77A;
    background-color: #C6F8BA;
  }

  .week-matches-wrapper .score-input-container .selected-team {
    border: 1px solid #FFD601;
    background-color: #FFF8D6;
  }

  .week-matches-wrapper .week-matches-container .away-team-score-input,
  .week-matches-wrapper .week-matches-container .home-team-score-input {
    width: 30px;
    height: 30px;
    text-align: center;
    border: 1px solid #666666
  }

  .week-matches-wrapper .bye-teams-container .teams-on-bye-text {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0em;
    text-align: left;
    padding: 2px;

  }

  .week-matches-wrapper .bye-teams-container {
    padding: 8px 6px;
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
  }

  .week-matches-wrapper .bye-teams-container .teams-on-bye-logo {
    width: 21px;
    height: 14px;
  }

  .week-matches-wrapper .week-matches-container .disabled-input {
    border: unset;
    background-color: #F5F5F5;
  }

  .week-matches-wrapper .week-matches-container input::-webkit-outer-spin-button,
  .week-matches-wrapper .week-matches-container input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .week-matches-wrapper input[type=number] {
    -moz-appearance: textfield;
  }

  .week-matches-wrapper .week-matches-container .away-home-text-container {
    top: 0;
    display: flex;
    width: 100%;
    justify-content: space-around;
    display: flex;
    width: 100%;
    position: sticky;
    z-index: 1;
  }

  .week-matches-wrapper .week-matches-container .away-container-header,
  .week-matches-wrapper .week-matches-container .home-container-header {
    width: 50%;
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  .week-matches-container .away-container-header span,
  .week-matches-container .home-container-header span {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0em;
    text-align: center;
    padding: 6px;

  }

  .week-matches-wrapper .week-carousel-container {
    display: flex;
    flex-direction: row;
  }

  .week-matches-wrapper .week-carousel-control-right-btn-holder {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .week-matches-wrapper .week-carousel-control-left-btn-holder {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }


  .week-carousel-container .right-scroll-button {
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #dfdfdf;
    box-shadow: 3px 1px 10px rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: unset;
    top: 50%;
    left: 50%;
    height: 40px;
    width: 20px;
    border-radius: 50px 0px 0px 50px;
    padding-left: 10px;
  }

  .week-carousel-container .right-scroll-button img {
    width: 10px;
    height: 15px;
    object-fit: cover;
    display: block;
    position: relative;
  }

  .week-carousel-container .left-scroll-button {
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #dfdfdf;
    box-shadow: 3px 1px 10px rgba(0, 0, 0, 0.05);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: unset;
    height: 40px;
    width: 20px;
    border-radius: 0px 50px 50px 0px;
    padding-right: 10px;
  }

  .week-carousel-container .left-scroll-button img {
    width: 10px;
    height: 15px;
    object-fit: cover;
    display: block;
    position: relative;
    rotate: 180deg;
  }
</style>

