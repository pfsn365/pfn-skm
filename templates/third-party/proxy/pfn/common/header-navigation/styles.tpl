<style>
  .pfn-header-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2001;
    height: 50px;
  }

  .pfn-header-wrapper .pfn-header-container {
    display: flex;
    width: 100%;
    justify-content: center;
    position: relative;
    height: 100%;
  }

  .pfn-header-wrapper .pfn-header-container .spacer {
    width: 10px;
    height: 40px;
  }

  .pfn-header-wrapper .pfn-header-container .header-logo-container {
    text-decoration: none;
    color: #2d2d2d;
    display: flex;
    position: absolute;
    left: 18%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .pfn-header-wrapper .pfn-header-container .header-logo-container .header-logo {
    width: 40px;
    height: 40px;
  }

  .pfn-header-wrapper .pfn-header-container .header-items-container {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-items,
  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-sub-items,
  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-sub-sub-items,
  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-sub-sub-sub-items {
    cursor: pointer;
    flex-shrink: 0;
  }

  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-items.menu-navigation-btn {
    text-decoration: none;
  }

  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-sub-sub-sub-items {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-items-text {
    font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.4px;
    color: #FFFFFF;
    margin: unset;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-items-text::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    width: 0;
    height: 3px;
    background-color: #0857C3;
    transition: width 0.2s ease-in-out, left 0.2s ease-in-out;
    transform: translateX(-50%);
  }

  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-items-text.fade-in::after {
    width: 100%;
    animation: fadeIn 0.2s ease-in-out forwards;
  }

  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-items-text.fade-out::after {
    animation: fadeOut 0.2s ease-in-out forwards;
  }

  @keyframes fadeIn {
    from {
      width: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    to {
      width: 100%;
      left: 0;
      transform: translateX(0);
    }
  }

  @keyframes fadeOut {
    from {
      width: 100%;
      left: 0;
      transform: translateX(0);
    }

    to {
      width: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .pfn-header-wrapper .pfn-header-container .header-items-container .header-menu-items:hover .sub-menu-item-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    transition-delay: 5s;
    z-index: 100;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container:hover {
    display: flex;
    flex-direction: column;
    position: absolute;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container {
    display: none;
    background-color: #000;
    color: #fff;
    padding: 15px 0px;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container .header-menu-sub-items {
    background-color: #000;
    border: unset;
    color: #fff;
    text-align: left;
    padding: 4px 30px;
    font-family: "Roboto";
    font-size: 16px;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container .header-menu-sub-items:hover .sub-sub-menu-item-container {
    display: block;
    min-width: 300px;
    position: absolute;
    left: 0;
    transform: translateX(-100%);
    background-color: #000;
    color: #fff;
  }

  .pfn-header-wrapper .pfn-header-container .sub-sub-sub-menu-item-container {
    display: none;
    background-color: #000;
    color: #fff;
    position: absolute;
    min-width: 300px;
    right: 0px;
    transform: translate(100%, -32px);
  }

  .pfn-header-wrapper .pfn-header-container .sub-sub-menu-item-container .header-menu-sub-sub-items .sub-sub-sub-menu-item-container:has(> *) {
    padding: 15px 0px;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container .header-menu-sub-items:hover .sub-sub-menu-item-container .header-menu-sub-sub-items:hover .sub-sub-sub-menu-item-container {
    display: block;
  }

  .pfn-header-wrapper .pfn-header-container .sub-sub-sub-menu-item-container .header-menu-sub-sub-sub-items {
    padding: 4px 30px;
    text-align: left;
    font-family: "Roboto";
    font-size: 16px;
    color: #fff;
    cursor: pointer;
  }

  .pfn-header-wrapper .pfn-header-container .sub-sub-sub-menu-item-container .header-menu-sub-sub-sub-items-text {
    padding: 4px;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container .header-menu-sub-items .sub-sub-menu-item-container .header-menu-sub-sub-items {
    padding: 4px 30px;
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container .header-menu-sub-items .sub-sub-menu-item-container .header-menu-sub-sub-items-text {
    padding: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container .header-menu-sub-items .sub-sub-menu-item-container {
    display: none;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container .header-menu-sub-items .sub-sub-menu-item-container:has(> *) {
    padding: 15px 0px;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container .header-menu-sub-items {
    display: flex;
    min-width: 300px;
  }

  .pfn-header-wrapper .pfn-header-container .sub-menu-item-container .header-menu-sub-items .header-menu-sub-items-text {
    color: #fff;
    text-align: left;
    padding: 4px;
    font-family: "Roboto";
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    cursor: pointer;
  }

  .pfn-header-wrapper .pfn-header-container .downward-sign {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .downward-sign .nav-down-icon {
    width: 9px;
    height: 6px;
    background: none;
  }

  .header-menu-items.menu-navigation-btn .nav-right-icon {
    width: 12px;
    height: 11px;
    background: none;
  }

  .pfn-secondary-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px 0px #0000000D;
    position: fixed;
    top: 50px;
    left: 0;
    width: 100%;
    background: #0050A0;
    z-index: 2000;
    height: 42px;
  }

  .pfn-secondary-wrapper .pfn-secondary-container {
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 55%;
    max-width: 100%;
  }

  .pfn-secondary-wrapper .pfn-secondary-container .page-category {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
    flex-shrink: 0;
  }

  .pfn-secondary-wrapper .pfn-secondary-container .page-category .category-text {
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: #EBEBEB;
  }

  .pfn-secondary-wrapper .pfn-secondary-container .page-category .separator {
    align-self: stretch;
    width: 10px;
    height: 42px;
  }

  .pfn-secondary-wrapper .pfn-secondary-container .category-links-container {
    display: flex;
    align-items: center;
    gap: 27px;
    flex-grow: 1;
    overflow-x: scroll;
    scrollbar-width: none;
    padding: 0 12px;
  }

  .pfn-secondary-wrapper .pfn-secondary-container .category-links-container::-webkit-scrollbar {
    display: none;
  }

  .pfn-secondary-wrapper .pfn-secondary-container .category-links-container .category-link {
    flex-shrink: 0;
    text-decoration: none;
    color: #EBEBEB;
    font-size: 14px;
    line-height: 17px;
    font-weight: 500;
    display: flex;
    align-self: stretch;
    align-items: center;
    cursor: pointer;
  }

  .pfn-secondary-wrapper .pfn-secondary-container .category-links-container .category-link span {
    color: #EBEBEB;
  }

  .pfn-secondary-wrapper .pfn-secondary-container .category-links-container a.category-link.selected {
    color: #FFFFFF;
    border-bottom: 4px solid #FFFFFF;
  }

  .pfn-secondary-wrapper .pfn-secondary-container .category-links-container a.category-link.selected span {
    position: relative;
    top: 2px;
  }

  .pfn-secondary-container .carousel-control-left-btn-holder,
  .pfn-secondary-container .carousel-control-right-btn-holder {
    display: flex;
  }

  .pfn-secondary-container .carousel-control-left-btn-holder button {
    border-radius: 0 25px 25px 0;
    border: unset;
    border-right: 1px solid #dfdfdf;
    background: unset;
    padding: 8px;
  }

  .pfn-secondary-container .carousel-control-right-btn-holder button {
    border-radius: 25px 0 0 25px;
    border: unset;
    border-left: 1px solid #dfdfdf;
    background: unset;
    padding: 8px;
  }

  .pfn-secondary-container .carousel-control-left-btn-holder button img,
  .pfn-secondary-container .carousel-control-right-btn-holder button img {
    width: 7px;
    height: 10px;
    background: unset;
  }

  .widget-container {
    position: absolute;
    right: 4%;
    height: 100%;
  }

  @media (max-width: 768px) {
    .pfn-header-wrapper .pfn-header-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .pfn-header-wrapper .pfn-header-container.with-header {
      justify-content: space-between;
      padding: 0 12px;
    }

    .pfn-header-wrapper .pfn-header-container .header-logo-container .header-logo {
      width: 25px;
      height: 25px;
    }

    .pfn-header-wrapper .pfn-header-container.with-header h1 {
      font-size: 13px;
      color: #FFFFFF;
      line-height: 16px;
      font-weight: 600;
    }

    .pfn-header-container .header-h1-container h1:has(+ .updated-timestamp-container) {
      font-size: 12px;
      line-height: 12px;
    }

    .pfn-header-container .header-h1-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      gap: 1px;
    }

    .pfn-header-container .header-h1-container .updated-timestamp-container {
      font-size: 10px;
      line-height: 16px;
      min-height: 16px;
      font-weight: 400;
      color: #fff;
    }

    .pfn-header-wrapper {
      height: 34.5px;
    }

    .pfn-secondary-wrapper {
      top: 34.5px;
      height: 35px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container {
      display: flex;
      width: 100%;
      justify-content: space-between;
      padding-left: 0;
      left: 0;
    }

    .pfn-header-wrapper .pfn-header-container .header-logo-container {
      left: unset;
      right: 4%;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .category-links-container {
      display: flex;
      align-items: center;
      gap: 27px;
      flex-grow: 1;
      overflow-x: scroll;
      scrollbar-width: none;
      margin-left: 0px;
      padding: 0 12px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container {
      position: relative;
      flex-shrink: 0;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown {
      position: absolute;
      width: 97vw;
      background: #FFFF;
      border: 1px solid #E9E9E9;
      border-radius: 6px;
      margin-left: 8px;
      z-index: 10;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .close-container {
      width: 100%;
      padding: 8px;
      border-bottom: 1px solid #E9E9E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .close-container span {
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      color: #474747;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .close-container button {
      outline: none;
      border: unset;
      background: unset;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container {
      width: 100%;
      height: 274px;
      overflow-y: scroll;
      scrollbar-width: none;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container::-webkit-scrollbar {
      display: none;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item,
    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item,
    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container,
    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container .mobile-menu-sub-sub-sub-item {
      text-decoration: none;
      color: inherit;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-menu-item-text,
    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-menu-sub-item-text,
    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item-text,
    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container .mobile-menu-sub-sub-sub-item .mobile-menu-sub-sub-sub-item-text {
      font-weight: 500;
      font-size: 15px;
      line-height: 19px;
      color: #474747;
      display: flex;
      padding: 10px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-menu-sub-item-text {
      font-weight: 400;
      font-size: 14px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item-text {
      font-weight: 400;
      font-size: 13px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container .mobile-menu-sub-sub-sub-item .mobile-menu-sub-sub-sub-item-text {
      font-weight: 400;
      font-size: 12px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-menu-item-text .collapse-sign,
    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-menu-sub-item-text .collapse-sign,
    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-menu-sub-sub-item-text .collapse-sign {
      margin-left: auto;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-menu-item-text .collapse-sign i,
    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-menu-sub-item-text .collapse-sign i {
      transform: scale(1.4);
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container {
      padding-left: 8px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container {
      display: block;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container {
      padding-left: 8px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item {
      display: block;
      text-decoration: none;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container {
      display: block;
      padding-left: 8px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-dropdown-container .page-dropdown .header-items-container .mobile-menu-item .mobile-sub-menu-item-container .mobile-menu-sub-item .mobile-sub-sub-menu-item-container .mobile-menu-sub-sub-item .mobile-sub-sub-sub-menu-item-container .mobile-menu-sub-sub-sub-item {
      display: block;
      text-decoration: none;
      padding-left: 8px;
      color: #474747;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-category {
      display: flex;
      flex-direction: row;
      gap: 6px;
      align-items: center;
      border: none;
      background: none;
      outline: none;
      position: relative;
      height: 35px;
      min-width: 64px;
      padding: 0 12px;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-category .category-text {
      z-index: 2;
      color: #000000;
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-category i {
      z-index: 2;
      color: #FFFF;
      transform: scale(1.2);
    }

    .pfn-secondary-wrapper .pfn-secondary-container .page-category .separator {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .pfn-secondary-wrapper .page-category .nav-down-icon {
      width: 10px;
      height: 6px;
      z-index: 100;
    }

    .header-items-container .nav-right-icon {
      width: 8px;
      height: 14px;
      z-index: 100;
    }

    .header-items-container .nav-down-icon {
      width: 14px;
      height: 8px;
      z-index: 100;
    }

    .header-items-container .mobile-menu-sub-sub-item .nav-right-icon {
      width: 4px;
      height: 7px;
      z-index: 100;
    }

    .header-items-container .mobile-menu-sub-sub-item .nav-down-icon {
      width: 7px;
      height: 4px;
      z-index: 100;
    }
  }
</style>
