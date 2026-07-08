{if !$included_rollbar_script}
  {assign var=included_rollbar_script value=TRUE scope="root"}
  <script>
    {include file="third-party/proxy/pfn/common/rollbar/js.tpl"}
  </script>
{/if}
