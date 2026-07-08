<div class="pfn-header-wrapper">
  <div class="pfn-header-container">
    <a class="header-logo-container" href="https://www.profootballnetwork.com" data-item-url="https://www.profootballnetwork.com">
      <img rel="preload" class="header-logo" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-ver-2.png?w=40&h=40" width="40"
        height="40" alt="pfn-logo" />
    </a>
    <div class="header-items-container">
      {if isset($header_menu_data)}
        {foreach from=$header_menu_data item=menuItem}
          {if $menuItem.subItems|count > 0}
            <div class="header-menu-items menu-navigation-btn" data-item-url="{$menuItem.itemUrl}">
          {else}
            <a class="header-menu-items menu-navigation-btn" href="{$menuItem.itemUrl}" data-item-url="{$menuItem.itemUrl}">
          {/if}
            <p class="header-menu-items-text">{$menuItem.itemTitle} {if $menuItem.subItems|count > 0}<span
                class="downward-sign">
              <img class="nav-down-icon" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-down-icon.png" width="7"
                height="4" alt="down arrow" />
              </span>{/if}</p>
            <div class="sub-menu-item-container">
              {foreach from=$menuItem.subItems item=subItem}
                {if $subItem.subItems|count > 0}
                  <div class="header-menu-sub-items menu-navigation-btn-2" data-item-url="{$subItem.itemUrl}">
                {else}
                  <a class="header-menu-sub-items menu-navigation-btn-2" href="{$subItem.itemUrl}" data-item-url="{$subItem.itemUrl}">
                {/if}
                  <p class="header-menu-sub-items-text">{$subItem.itemTitle} {if $subItem.subItems|count > 0}
                  <img class="nav-right-icon" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-right-icon.svg" width="7"
                    height="4" alt="right arrow" />
                  {/if}</p>
                  <div class="sub-sub-menu-item-container">
                    {if $subItem.subItems|count > 0}
                      {foreach from=$subItem.subItems item=subSubItem}
                        {if $subSubItem.subItems|count > 0}
                          <div class="header-menu-sub-sub-items menu-navigation-btn-3" data-item-url="{$subSubItem.itemUrl}">
                        {else}
                          <a class="header-menu-sub-sub-items menu-navigation-btn-3" href="{$subSubItem.itemUrl}" data-item-url="{$subSubItem.itemUrl}">
                        {/if}
                          <p class="header-menu-sub-sub-items-text">{$subSubItem.itemTitle} {if $subSubItem.subItems|count > 0}
                          <img class="nav-right-icon" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-right-icon.svg" width="7"
                            height="4" alt="right arrow" />
                          {/if}</p>
                          <div class="sub-sub-sub-menu-item-container">
                            {foreach from=$subSubItem.subItems item=subSubSubItem}
                              <a class="header-menu-sub-sub-sub-items menu-navigation-btn-4" href="{$subSubSubItem.itemUrl}" data-item-url="{$subSubSubItem.itemUrl}">
                                <p class="header-menu-sub-sub-sub-items-text">{$subSubSubItem.itemTitle}</p>
                              </a>
                            {/foreach}
                          </div>
                        {if $subSubItem.subItems|count > 0}
                          </div>
                        {else}
                          </a>
                        {/if}
                      {/foreach}
                    {/if}
                  </div>
                {if $subItem.subItems|count > 0}
                  </div>
                {else}
                  </a>
                {/if}
              {/foreach}
            </div>
          {if $menuItem.subItems|count > 0}
            </div>
          {else}
            </a>
          {/if}
        {/foreach}
      {/if}
    </div>
  </div>
</div>
<div class="pfn-secondary-wrapper">
  <div class="pfn-secondary-container">
    <div class="page-category">
      <span class="category-text">{$category_label}</span>
      <img class="separator" src="{$smarty.const.STATIC_URL}/skm/assets/third-party/pfn-nav-separator-white.png" width="10.5" height="42" alt="nav border" />
    </div>
    {if isset($category_links)}
      <div class="carousel-control-left-btn-holder">
        <button class="carousel-control-btn left-scroll-button">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/header-navigation/arrow-left-nav-white.png" height="10" width="7" alt="scroll button icon" loading="lazy">
        </button>
      </div>
      <div class="category-links-container">
        {foreach from=$category_links item=categoryLink}
          <a class="category-link menu-navigation-btn{if $categoryLink.label == $active_category} selected{/if}" href="{$categoryLink.url}" data-item-url="{$categoryLink.url}" data-nav-type="secondary">
            <span>{$categoryLink.label}</span>
          </a>
        {/foreach}
      </div>
      <div class="carousel-control-right-btn-holder">
        <button class="carousel-control-btn right-scroll-button">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/header-navigation/arrow-right-nav-white.png" height="10" width="7"
            alt="scroll button icon" loading="lazy">
        </button>
      </div>
    {/if}
  </div>
</div>
