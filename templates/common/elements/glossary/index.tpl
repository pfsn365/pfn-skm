{if !$included_common_elements__glossary}

	{assign var=included_common_elements__glossary value=TRUE scope="global"}

	{include file="./styles.tpl"}

	{function generateGlossaryElement elementInput=[] includeCheckbox=true}
		{$expanded = !!!$elementInput["collapsed"]}
		{$id = "glossary_for__{$elementInput['identifier']}"}
		{$headingText = (isset($glossary_heading_text) && !empty($glossary_heading_text)) ? $glossary_heading_text : 'Glossary'}

		<div class="glossary-wrapper">
			<div class="glossary-container">
				{if $includeCheckbox}
					<input type="checkbox" name="{$id}" id="{$id}" class="glossary-ref" {if $expanded}checked{/if} />
					<label for="{$id}" class="glossary-header">
						<div class="glossary-header--text">{$headingText}</div>
					</label>
				{else}
					<div class="glossary-header--text">{$headingText}</div>
				{/if}

				<div class="glossary-content">
					<div class="glossary-items">
						{$elementInput["items"]}
					</div>
				</div>
			</div>
		</div>
	{/function}

{/if}
