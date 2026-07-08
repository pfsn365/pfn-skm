<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {if !empty($seo_robots_tag)}
        <meta name="robots" content="{$seo_robots_tag}" />
    {/if}
    {foreach $head_fragments as $fragment}
        {if !empty($fragment)}
            {include file="{$fragment}"}
        {/if}
    {/foreach}
    {include file="./styles.tpl"}
    {include file="./js.tpl"}
</head>

<body>
    <div id="external-widget">
        {foreach $body_fragments as $fragment}
            {if !empty($fragment)}
                {include file="{$fragment}"}
            {/if}
        {/foreach}
    </div>
</body>

</html>

