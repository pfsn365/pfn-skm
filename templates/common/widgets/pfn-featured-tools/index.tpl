{if !empty($templateData["tools"])}

	{if !$included_global_components_widget__pfn_featured_tools__styles}
		{assign var=included_global_components_widget__pfn_featured_tools__styles value=TRUE scope="root"}

		{include file="./styles.tpl"}
	{/if}

	<div class="widget--taxonomy-quick-links pfn-featured-tools" data-identifier="{$templateData['identifier']}">
		<div class="pfn-featured-tools-grid">
			{foreach $templateData["tools"] as $tool}
				<a class="quick-links-item-cta pfn-tool-card{if !empty($tool['featured'])} is-featured{/if}"
					href="{$tool['href']}" data-identifier="{$templateData['identifier']}" target="_blank"
					rel="nofollow noopener">
					<span class="pfn-tool-name">{$tool['label']}</span>
					<span class="pfn-tool-arrow"></span>
				</a>
			{/foreach}
		</div>
	</div>

	{if !$included_global_components_widget__tax_quick_links__script}
		{assign var=included_global_components_widget__tax_quick_links__script value=TRUE scope="root"}

		{include file="common/widgets/taxonomy/quick-links/js.tpl"}
	{/if}

{/if}
