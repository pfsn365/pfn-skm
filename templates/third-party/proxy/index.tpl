<!DOCTYPE html>
<html {if isset($setHtmlLangAttribute) && $setHtmlLangAttribute}lang="en-us" {/if}>
	{if $brand == "pfn"}
		{assign var=favicon_ico_href value="{$smarty.const.STATIC_URL}/skm/assets/{$brand}/favicon-icon-ver-2.ico" scope="root"}
		{assign var=favicon_png_href value="{$smarty.const.STATIC_URL}/skm/assets/{$brand}/favicon-icon-ver-2.png" scope="root"}
	{else}
		{assign var=favicon_ico_href value="{$smarty.const.STATIC_URL}/skm/assets/{$brand}/favicon.ico" scope="root"}
		{assign var=favicon_png_href value="{$smarty.const.STATIC_URL}/skm/assets/{$brand}/favicon.png" scope="root"}
	{/if}

	<head>
		<meta charset="utf-8" />
		<meta name="viewport"
			content="width=device-width, initial-scale=1.0{if !isset($allow_site_scaling)}, maximum-scale=1.0, user-scalable=no{/if}" />
		<link rel="icon" href={$favicon_png_href} type="image/png" />
		<link rel="icon" sizes="192x192" href={$favicon_png_href} />
		<link rel="shortcut" href={$favicon_ico_href} type="image/x-icon" />
		<link rel="shortcut icon" href={$favicon_ico_href} type="image/x-icon" />
		<link rel="apple-touch-icon-precomposed" href={$favicon_png_href} sizes="196x196" />
		{if !empty($include_font_awesome)}
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		{/if}
		{if isset($meta_keywords) && !empty($meta_keywords)}
			<meta name="keywords" content="{$meta_keywords|trim|escape:'htmlall'}" />
		{/if}
		{if !empty($meta_description)}
			<meta name="description" content="{$meta_description}" />
		{/if}
		{if !empty($canonical_url)}
			<link rel="canonical" href="{$canonical_url}" />
		{/if}
		{if !empty($seo_robots_tag)}
			<meta name="robots" content="{$seo_robots_tag}" />
		{/if}
		{if !empty($meta_article_section)}
			<meta property="article:section" content="{$meta_article_section}" />
		{/if}
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		{if isset($seo_title)}
			<title>{$seo_title}</title>
		{elseif isset($title)}
			<title>{$title}</title>
		{/if}
		{if !empty($published_date_iso)}
			<meta property="article:published_time" content="{$published_date_iso}" />
		{/if}
		{if !empty($modified_date_iso)}
			<meta property="article:modified_time" content="{$modified_date_iso}" />
		{/if}
		{if !empty($og_title)}
			<meta property="og:title" content="{$og_title}">
		{/if}
		{if !empty($og_description)}
			<meta property="og:description" content="{$og_description}">
		{/if}

		{include file="./styles.tpl"}

		{include file="./js.tpl"}

		{foreach $head_fragments as $fragment}
			{if !empty($fragment)}
				{include file="{$fragment}"}
			{/if}
		{/foreach}

		{if isset($schemas) && !empty($schemas)}
			{foreach $schemas as $schemaFile}
				{include file=$schemaFile}
			{/foreach}
		{/if}

		{if $include_react_unpackager}
			<script src="{$smarty.const.STATIC_URL}/skm/assets/{$brand}/tools/nba-mockdraft/react.production.min.js"></script>
			<script src="{$smarty.const.STATIC_URL}/skm/assets/{$brand}/tools/nba-mockdraft/react-dom.production.min.js">
			</script>
		{/if}
	</head>

	<body class="{$tool} {$bodyClasses}">
		<main class="sk-proxied-page">
			{if !empty($layout_fragment)}
				{include file=$layout_fragment}
			{/if}
		</main>

		{foreach $body_fragments as $fragment}
			{if !empty($fragment)}
				{include file="{$fragment}"}
			{/if}
		{/foreach}

		{include file="pages/common/js.tpl"}
	</body>

</html>
