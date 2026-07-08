{if $is_desktop}
	<!-- /{$smarty.const.AD_CODE}/{$slotId} -->
	<div class="native-in-feed-ad hidden" id="{$ad_units.$slotId.div}"
		style="clear:both;overflow:hidden;height:150px;width:100%;box-shadow:0 2px 4px 0 rgba(0, 0, 0, 0.07);border:1px solid #E9E9E9;">
	</div>
{else}
	<div class="ad-declare-explicit"></div>
	<!-- /{$smarty.const.AD_CODE}/{$slotId} -->
	<div class="native-in-feed-ad hidden" id="{$ad_units.$slotId.div}"
		style="clear:both;overflow:hidden;height:auto;width:auto;text-align:center;background:transparent;">
	</div>
{/if}
