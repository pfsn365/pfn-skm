{include file="./styles.tpl"}

{if $add_header_navigation}
	{if isset($show_sidebar_nav) && $show_sidebar_nav}
		{if !$is_desktop}
			{include file="./common/header-navigation/index.tpl"}
		{/if}
	{else}
		{include file="./common/header-navigation/index.tpl"}
	{/if}
{/if}

{foreach $extraToolHeaders as $toolHeader}
	{if !empty($toolHeader)}
		{include file="{$toolHeader}"}
	{/if}
{/foreach}

{if isset($show_sidebar_nav) && $show_sidebar_nav}
	{include file="third-party/proxy/pfn/common/sidebar-nav/index.tpl"}
{/if}

<section class="hero-section">
	{include file="common/hero/index.tpl"}
</section>

{foreach $fluidFragments as $fragment}
	{if !empty($fragment)}
		{include file="{$fragment}"}
	{/if}
{/foreach}

{if isset($show_sidebar_nav) && $show_sidebar_nav}
	<div class="pfn-content-wrapper has-sidebar-nav">
		{if isset($header_text)}
			<div class="header-wrapper pfn-hero-banner">
				<div class="header-container">
					<h1 class="header-text">
						{$header_text}
					</h1>
				</div>
				{if $updated_timestamp}
				<span class="updated-timestamp-container">{if isset($initially_hide_updated_timestamp)}{else}UPDATED ON {$updated_timestamp}{/if}</span>
				{/if}
			</div>
		{/if}
		<div class="pfn-promo-bar">
			<div class="pfn-promo-link" onclick="window.open('https://www.profootballnetwork.com/mockdraft', '_blank')" role="link" tabindex="0">
				<span class="pfn-promo-inner">
					<span class="pfn-promo-eyebrow">PFSN Mock Draft Simulator</span>
					<span class="pfn-promo-cta">Mock Now <span class="pfn-promo-arrow">→</span></span>
				</span>
			</div>
			<div class="pfn-promo-nav-links">
				<a href="https://www.profootballnetwork.com/mockdraft">Mock Draft Simulator</a>
				<a href="https://www.profootballnetwork.com/nfl-hq/">HQ</a>
				<a href="https://www.profootballnetwork.com/nfl-ultimate-gm-simulator/">Ultimate GM</a>
				<a class="pfn-promo-nav-desktop" href="https://www.profootballnetwork.com/cfb-playoff-predictor/">CFB Playoff Predictor</a>
			</div>
		</div>
		{if $is_desktop && $show_desktop_tools_top_adv_container}
			<div class="desktop-tools-top-adv-container {if isset($raptive_header_90_class)}{$raptive_header_90_class}{/if}"></div>
		{/if}
		<div class="pfn-content-container">
			<div class="content {if $is_desktop}{$content_width}{/if}">
				{if $is_desktop && $show_desktop_pages_top_adv_container}
					<div class="desktop-pages-top-adv-container"></div>
				{/if}

				{if !$is_desktop && !$hide_mobile_top_adv_container}
					<div class="mobile-top-adv-container raptive-pfn-header"></div>
				{/if}

				{foreach $fragments as $one_fragment}
					{include file=$one_fragment}
				{/foreach}

				{if $adv_in_content == true}
					<div class="ad-content"></div>
				{/if}

				{if isset($below_tool_widgets) && !empty($below_tool_widgets)}
					{include file="templates/pages/static/tools/nfl/widgets/index.tpl"}
					{call generateToolWidgets tool_widgets=$below_tool_widgets}
				{/if}

				{if isset($abovePageContentWidgets) && count($abovePageContentWidgets) > 0}
					{include file="common/widgets/index.tpl"}
					{foreach $abovePageContentWidgets as $widget}
						{call generateWidgetSection widget=$widget}
					{/foreach}
				{/if}

				{if !empty($page_text_content)}
					<div class="pfn-text-content-container">
						{$page_text_content}
					</div>
				{/if}
			</div>

			{if $include_right_sidebar}
				<div class="right-sidebar-container">
					{if isset($tool_widgets) && !empty($tool_widgets)}
						{include file="templates/pages/static/tools/nfl/widgets/index.tpl"}
						{call generateToolWidgets tool_widgets=$tool_widgets}
					{/if}
				<div class="right-sidebar {if isset($right_sidebar_new_identifier)}{$right_sidebar_new_identifier}{/if}"></div>
				</div>
			{/if}

			<div class="sticky-ad-container">
			</div>
			<div id="video-player-container" class="hidden">
			</div>
		</div>

		{if isset($footer)}
			{include file="third-party/proxy/pfn/common/footer/index.tpl"}
		{/if}
	</div>
{/if}

{if !isset($show_sidebar_nav) || !$show_sidebar_nav}
	<div class="pfn-content-wrapper">
		{if $is_desktop && isset($header_text)}
			<div class="header-wrapper">
				{if $is_desktop && $show_desktop_tools_top_adv_container}
					<div class="desktop-tools-top-adv-container {if isset($raptive_header_90_class)}{$raptive_header_90_class}{/if}"></div>
				{/if}
				<div class="header-container">
					<div class="left-header-border"></div>
					<h1 class="header-text">
						{$header_text}
					</h1>
					<div class="right-header-border"></div>
				</div>
				{if $updated_timestamp}
				<span class="updated-timestamp-container">{if isset($initially_hide_updated_timestamp)}{else}UPDATED ON {$updated_timestamp}{/if}</span>
				{/if}
			</div>
		{/if}
		<div class="pfn-content-container">
			<div class="content {if $is_desktop}{$content_width}{/if}">
				{if $is_desktop && $show_desktop_pages_top_adv_container}
					<div class="desktop-pages-top-adv-container"></div>
				{/if}

				{if !$is_desktop && !$hide_mobile_top_adv_container}
					<div class="mobile-top-adv-container raptive-pfn-header"></div>
				{/if}

				{foreach $fragments as $one_fragment}
					{include file=$one_fragment}
				{/foreach}

				{if $adv_in_content == true}
					<div class="ad-content"></div>
				{/if}

				{if isset($below_tool_widgets) && !empty($below_tool_widgets)}
					{include file="templates/pages/static/tools/nfl/widgets/index.tpl"}
					{call generateToolWidgets tool_widgets=$below_tool_widgets}
				{/if}

				{if isset($abovePageContentWidgets) && count($abovePageContentWidgets) > 0}
					{include file="common/widgets/index.tpl"}
					{foreach $abovePageContentWidgets as $widget}
						{call generateWidgetSection widget=$widget}
					{/foreach}
				{/if}

				{if !empty($page_text_content)}
					<div class="pfn-text-content-container">
						{$page_text_content}
					</div>
				{/if}
			</div>

			{if $include_right_sidebar}
				<div class="right-sidebar-container">
					{if isset($tool_widgets) && !empty($tool_widgets)}
						{include file="templates/pages/static/tools/nfl/widgets/index.tpl"}
						{call generateToolWidgets tool_widgets=$tool_widgets}
					{/if}
				<div class="right-sidebar {if isset($right_sidebar_new_identifier)}{$right_sidebar_new_identifier}{/if}"></div>
				</div>
			{/if}

			<div class="sticky-ad-container">
			</div>
			<div id="video-player-container" class="hidden">
			</div>
		</div>

		{if isset($footer)}
			{include file="third-party/proxy/pfn/common/footer/index.tpl"}
		{/if}
	</div>
{/if}

{include file="./js.tpl"}

{if isset($smarty.const.VISIBL_SCRIPT_URL__PFN) && !empty($smarty.const.VISIBL_SCRIPT_URL__PFN)}
	<script>
		window.VISIBL = window.VISIBL || {};
		window.VISIBL.CONTENT_CONTAINER_SELECTORS = [
			".pfn-content-container"
		];
	</script>
	<script async src="{$smarty.const.VISIBL_SCRIPT_URL__PFN}"></script>
{/if}

{include file="common/third-party/debugbear/index.tpl"}
{include file="common/third-party/comscore/index.tpl"}
{include file="third-party/proxy/pfn/common/speculation-rules.tpl"}
