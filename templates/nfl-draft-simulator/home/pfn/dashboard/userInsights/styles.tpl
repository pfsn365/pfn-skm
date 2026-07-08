<style>
  .user-insights-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #FFFFFF 0%, #FFF8ED 100%);
    border: 1px solid #DFDFDF;
    padding: 14px 10px;
    border-radius: 12px;
  }

  .user-insights-container .user-info-section {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .user-insights-container .user-info-section .user-image {
    border-radius: 50%;
    border: 1px solid #000000;
    width: 60px;
    height: 60px;
  }

  .user-info-section .username-grade-holder {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 4px;
  }

  .username-grade-holder .user-grade-holder {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .user-info-section .user-grade {
    color: #666666;
    font-size: 13px;
    font-weight: 400;
    line-height: 15px;
  }

  .user-info-section .user-grade-info-container {
    position: relative;
    display: flex;
  }

  .user-grade-info-container .info-icon {
    width: 16px;
    height: 16px;
  }

  .user-grade-info-container .grade-info {
    position: absolute;
    visibility: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #FFFFFF 0%, #FFF8ED 100%);
    border: 1px solid #DFDFDF;
    padding: 10px 5px;
    border-radius: 13px;
    top: 20px;
    width: 150px;
  }

  .user-grade-info-container .info-icon:hover+.grade-info {
    visibility: visible;
  }

  .user-grade-info-container .grade-info .grade-data {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    width: 100%;
  }

  .user-grade-info-container .grade-info .grade-data .grade-name {
    color: #666666;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
  }

  .user-grade-info-container .grade-info .grade-data .grade-percentage {
    color: #666666;
    font-size: 12px;
    font-style: italic;
    font-weight: 600;
    line-height: 14px;
    width: 41px;
    display: inline-block;
    text-align: center;
  }

  .user-grade-info-container .grade-info .grade-data .grade-name.header,
  .user-grade-info-container .grade-info .grade-data .grade-percentage.header {
    color: #202224;
  }

  .user-grade-info-container .grade-info .grade-data .grade-percentage.header {
    text-align: right;
  }

  .user-insights-container .drafted-data-section {
    width: 100%;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding-bottom: 10px;
  }

  .username-grade-holder .username {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
  }

  .drafted-data-section .drafted-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 10px;
    width: 100%;
    min-height: 30px;
  }

  .drafted-data-section .drafted-info:last-child {
    padding-bottom: unset;
    border-bottom: unset;
  }

  .drafted-info .drafted-info-title {
    color: #666666;
    font-size: 13px;
    font-weight: 500;
    line-height: 15px;
  }

  .drafted-info .drafted-info-value {
    color: #2d2d2d;
    font-size: 13px;
    font-weight: 500;
    line-height: 19px;
    max-width: 135px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-insights-container .user-insights-section {
    margin-top: 18px;
    width: 100%;
  }

  .user-insights-section .insights-header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    color: #202224;
    font-size: 18px;
    font-weight: 600;
    line-height: 21px;
  }

  .user-insights-container .insight-data-container {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .insight-data-container .insight-data {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 8px;
    width: 100%;
  }

  .insight-data-container .insight-data:last-child {
    border-bottom: unset;
    padding-bottom: unset;
  }

  .insight-data .info-icon {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    .drafted-info .drafted-info-value {
      max-width: 150px;
    }
  }
</style>
