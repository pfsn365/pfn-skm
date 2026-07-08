<div class="pfn-header-wrapper">
  <div class="pfn-header-container{if isset($header_text)} with-header{/if}">
    {if isset($header_text)}
      <div class="header-h1-container">
        <h1>{$header_text}</h1>
        {if $updated_timestamp}
        <span class="updated-timestamp-container">{if isset($initially_hide_updated_timestamp)}{else}UPDATED ON {$updated_timestamp}{/if}</span>
        {/if}
      </div>
    {/if}
    <a class="header-logo-container" href="https://www.profootballnetwork.com" data-item-url="https://www.profootballnetwork.com">
      <img class="header-logo" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-ver-2.png?w=25&h=25" width="25"
        height="25" alt="pfn-logo" />
    </a>
  </div>
</div>
<div class="pfn-secondary-wrapper">
  <div class="pfn-secondary-container">
    <div class="page-dropdown-container">
      <button class="page-category">
        <span class="category-text">{$category_label}</span>
        <img class="nav-down-icon" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-down-blue.png"
          width="10" height="6" alt="down arrow" />
        <img class="separator" src="{$smarty.const.STATIC_URL}/skm/assets/third-party/pfn-nav-mobile-highlight-white.png"
          width="71" height="35" alt="nav-highlight" />
      </button>
      <div class="page-dropdown hidden">
        <div class="close-container">
          <span>Menu</span>
          <button>
            <img class="header-logo" src="{$smarty.const.STATIC_URL}/skm/assets/third-party/cross-icon.png" width="26"
              height="26" alt="close-icon" />
          </button>
        </div>
        <div class="header-items-container">
          {if isset($header_menu_data)}
            {foreach from=$header_menu_data item=menuItem}
              {if $menuItem.subItems|count > 0}
                <div class="mobile-menu-item" data-item-url="{$menuItem.itemUrl}">
                {else}
                  <a class="mobile-menu-item" href="{$menuItem.itemUrl}" data-item-url="{$menuItem.itemUrl}">
                  {/if}
                  <p class="mobile-menu-item-text">
                    {$menuItem.itemTitle}
                    {if $menuItem.subItems|count > 0}
                      <span class="collapse-sign">
                        <img class="nav-right-icon"
                          src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-right-grey.png" width="8"
                          height="14" alt="right arrow" />
                        <img class="nav-down-icon hidden"
                          src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-down-grey.png" width="14"
                          height="8" alt="right arrow" />
                      </span>
                    {/if}
                  </p>
                  <div class="mobile-sub-menu-item-container hidden">
                    {foreach from=$menuItem.subItems item=subItem}
                      {if $subItem.subItems|count > 0}
                        <div class="mobile-menu-sub-item" data-item-url="{$subItem.itemUrl}">
                        {else}
                          <a class="mobile-menu-sub-item" href="{$subItem.itemUrl}" data-item-url="{$subItem.itemUrl}">
                          {/if}
                          <p class="mobile-menu-sub-item-text">
                            {$subItem.itemTitle}
                            {if $subItem.subItems|count > 0}
                              <span class="collapse-sign">
                                <img class="nav-right-icon"
                                  src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-right-grey.png"
                                  width="8" height="14" alt="right arrow" />
                                <img class="nav-down-icon hidden"
                                  src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-down-grey.png"
                                  width="14" height="8" alt="right arrow" />
                              </span>
                            {/if}
                          </p>
                          <div class="mobile-sub-sub-menu-item-container hidden">
                            {foreach from=$subItem.subItems item=subSubItem}
                              {if $subSubItem.subItems|count > 0}
                                <div class="mobile-menu-sub-sub-item" data-item-url="{$subSubItem.itemUrl}">
                                {else}
                                  <a class="mobile-menu-sub-sub-item" href="{$subSubItem.itemUrl}"
                                    data-item-url="{$subSubItem.itemUrl}">
                                  {/if}
                                  <p class="mobile-menu-sub-sub-item-text">
                                    {$subSubItem.itemTitle}
                                    {if $subSubItem.subItems|count > 0}
                                      <span class="collapse-sign">
                                        <img class="nav-right-icon"
                                          src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-right-grey.png"
                                          width="8" height="14" alt="right arrow" />
                                        <img class="nav-down-icon hidden"
                                          src="{$smarty.const.STATIC_URL}/skm/assets/pfn/header-navigation/nav-down-grey.png"
                                          width="14" height="8" alt="right arrow" />
                                      </span>
                                    {/if}
                                  </p>
                                  <div class="mobile-sub-sub-sub-menu-item-container hidden">
                                    {foreach from=$subSubItem.subItems item=subSubSubItem}
                                      <a class="mobile-menu-sub-sub-sub-item" data-item-url="{$subSubSubItem.itemUrl}"
                                        data-item-url="{$subSubSubItem.itemUrl}">
                                        <p class="mobile-menu-sub-sub-sub-item-text">{$subSubSubItem.itemTitle}</p>
                                      </a>
                                    {/foreach}
                                  </div>
                                  {if $subSubItem.subItems|count > 0}
                                </div>
                              {else}
                            </a>
                          {/if}
                        {/foreach}
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
  {if isset($category_links)}
    <div class="category-links-container">
      {foreach from=$category_links item=categoryLink}
        <a class="category-link menu-navigation-btn{if $categoryLink.label == $active_category} selected{/if}"
          href="{$categoryLink.url}" data-item-url="{$categoryLink.url}" data-nav-type="secondary">
          <span>{$categoryLink.label}</span>
        </a>
      {/foreach}
    </div>
  {/if}
</div>
</div>
