{function generateToolWidgets tool_widgets=[]}
	{foreach $tool_widgets as $tool_widget}
		{if !empty($tool_widget["widget_fragment"])}
			<div class="tool-widget-container">
				{include file="{$tool_widget["widget_fragment"]}"}
			</div>
		{/if}
	{/foreach}
{/function}
