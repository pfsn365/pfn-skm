{include file="./styles.tpl"}

<footer class="pfn-footer">
  <div class="pfn-footer-container">
    <div class="pfn-footer-columns">
      {if isset($footer)}
        {assign var="inMiddleColumn" value=false}
        {assign var="isFirstInColumn" value=false}
        
        {foreach from=$footer key=categoryName item=links name=footerLoop}
          {if $categoryName == 'News & Analysis' || $categoryName == 'Fantasy Football Tools'}
            {if $inMiddleColumn}
              </div>
              {assign var="inMiddleColumn" value=false}
            {/if}
            
            <div class="pfn-footer-column">
              <h3 class="pfn-footer-column-title">
                {$categoryName|upper}
              </h3>
              <ul class="pfn-footer-links">
                {foreach from=$links item=link}
                  <li>
                    <a href="{$link.url}" target="_blank" rel="noopener noreferrer" class="pfn-footer-link">
                      {$link.label}
                    </a>
                  </li>
                {/foreach}
              </ul>
            </div>
          {else}
            {if !$inMiddleColumn}
              <div class="pfn-footer-column">
              {assign var="inMiddleColumn" value=true}
              {assign var="isFirstInColumn" value=true}
            {else}
              {assign var="isFirstInColumn" value=false}
            {/if}
            
            <h3 class="{if $isFirstInColumn}pfn-footer-column-title{else}pfn-footer-column-subtitle{/if}">
              {$categoryName|upper}
            </h3>
            <ul class="pfn-footer-links">
              {foreach from=$links item=link}
                <li>
                  <a href="{$link.url}" target="_blank" rel="noopener noreferrer" class="pfn-footer-link">
                    {$link.label}
                  </a>
                </li>
              {/foreach}
            </ul>
          {/if}
          {if $smarty.foreach.footerLoop.last && $inMiddleColumn}
            </div>
          {/if}
        {/foreach}
      {/if}
    </div>
    
    <div class="pfn-footer-bottom">
      <div class="pfn-footer-social">
        <a href="https://facebook.com/PFSN365" aria-label="Facebook" rel="noopener noreferrer" target="_blank" class="pfn-footer-social-link">
          <svg class="pfn-footer-social-icon" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <a href="mailto:contact@profootballnetwork.com" aria-label="Email" class="pfn-footer-social-link">
          <svg class="pfn-footer-social-icon" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h18c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm18 2L12 10 3 5v2l9 5 9-5V5z" />
          </svg>
        </a>
        <a href="/rss" aria-label="RSS Feed" class="pfn-footer-social-link">
          <svg class="pfn-footer-social-icon" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.429 5.1v2.857c4.971 0 9 4.029 9 9h2.857c0-6.561-5.325-11.857-11.857-11.857zM3.429 10.386v2.857c2.036 0 3.714 1.678 3.714 3.714H10c0-3.626-2.945-6.571-6.571-6.571zM4.857 14.243c-.791 0-1.428.637-1.428 1.428s.637 1.429 1.428 1.429 1.429-.638 1.429-1.429-.638-1.428-1.429-1.428z" />
          </svg>
        </a>
        <a href="https://x.com/PFSN365" aria-label="Twitter" rel="noopener noreferrer" target="_blank" class="pfn-footer-social-link">
          <svg class="pfn-footer-social-icon" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
      <div class="pfn-footer-copyright">
        <p>Copyright © 2019-2026. PFSN.</p>
        <p>All Rights Reserved.</p>
      </div>
    </div>
  </div>
</footer>
