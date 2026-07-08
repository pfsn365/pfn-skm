{if !empty($templateData["groups"])}

	{function renderQuickLinksItems items=[] identifier=""}
		<div class="quick-links-items">
			{foreach from=$items key=title item=href}
				<a href="{$href}" class="quick-links-item-cta" data-identifier="{$identifier}">
					<span>{$title}</span>
				</a>
			{/foreach}
		</div>
	{/function}

	{function generateQuickLinksWidget items=[] identifier=""}
		{if !$included_global_components_widget__tax_quick_links__styles}
			{assign var=included_global_components_widget__tax_quick_links__styles value=TRUE scope="root"}

			{include file="./styles.tpl"}
		{/if}

		<div class="widget--taxonomy-quick-links" data-identifier="{$identifier}">
			<div class="quick-links-widget-container">
				<div class="quick-links-groups">
					{foreach $items as $group}
						<div class="quick-links-group">
							{if !empty($group["heading"])}
								<div class="quick-links-group-heading">{$group["heading"]}</div>
							{/if}
							{renderQuickLinksItems items=$group["links"] identifier=$identifier}
						</div>
					{/foreach}
				</div>
			</div>
		</div>

		{if !$included_global_components_widget__tax_quick_links__script}
			{assign var=included_global_components_widget__tax_quick_links__script value=TRUE scope="root"}

			{include file="./js.tpl"}
		{/if}

	{/function}

	{generateQuickLinksWidget items=$templateData["groups"] identifier=$templateData["identifier"]}
{/if}
