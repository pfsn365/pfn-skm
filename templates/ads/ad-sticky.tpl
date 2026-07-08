{if !isset($shouldNotLoadAds)}
    {assign var="shouldNotLoadAds" value=FALSE}
{/if}
{if !$shouldNotLoadAds}
    <!-- /{$smarty.const.AD_CODE}/{$slotId} -->
    <div id='{$ad_units.$slotId.div}' style='min-height:{$min_height}px;width: 100%; position: fixed; z-index: 1001; text-align: center;'  {if !empty($refreshConfig)} data-refresh-config='{$refreshConfig}'{/if}>
        <script>
            if(typeof displayAdSlot !== 'undefined') {
                displayAdSlot('{$ad_units.$slotId.div}');
            }
        </script>
    </div>
    <style>
    .cookie-consent {
        top: calc(100% - 79px) !important;
        left: calc(100% - 130px) !important;
    }
    </style>
{/if}
