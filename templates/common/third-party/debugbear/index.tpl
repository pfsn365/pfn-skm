{if !$smarty.const.IS_DESKTOP && $smarty.const.ENVIRONMENT === "production"}
  {if !$included_debugbear__script}
    {assign var=included_debugbear__script value=TRUE scope="root"}
    {include file="utils/script.tpl"}
    <script>
      //Code is executed only on 8% of the pages
      var samplingPercentage = 4;

      if (typeof SPORT_SLUG !== "undefined" && ["golf"].includes(SPORT_SLUG)) {
        samplingPercentage = 100;
      }

      if (Math.floor(Math.random() * 100) <= samplingPercentage) {
        window.dbbRum = window.dbbRum || [];
        window.dbbRum.push(["tag1", "{$smarty.const.RELEASE}"]);
        window.dbbRum.push(["tag2", "{$pagetype}"]);
        asyncScriptLoader({
          src: "https://cdn.debugbear.com/AY9ulBflsI9k.js",
          loadWithAsync: true
        });
      }
    </script>
  {/if}
{/if}
