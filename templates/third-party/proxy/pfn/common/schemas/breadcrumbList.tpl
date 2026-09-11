{* DIVERGENCE FROM PARENT skm: this template does not exist in the parent codebase.
   Added 2026-09-11 for the /sk-proxy/:brand/playoff-predictor route only, to emit
   BreadcrumbList JSON-LD. $breadcrumb_items is set inline in that route handler as
   [{name,url}, ...] with only Home and this page's own canonical_url, deliberately:
   neither preparePFNMenuData's "Tools" category nor preparePFNSecondaryNav's
   "Football" category resolves to a real hub URL anywhere in this codebase (the
   "Tools" list in secondary-nav-data.json is a flyout of sibling tool links, not a
   landing page; "Football" is a grey-bar grouping label from a remote sheet with no
   URL of its own). Rather than guess a URL, the crumb trail was kept to the two
   nodes that are actually verifiable. See EXTRACTION-MAP.md for the full note.

   Security review (2026-09-11): do not add `|escape:'javascript'` to
   {$crumb.name} or {$crumb.url} below. This is JSON-LD, not JS source --
   |escape:'javascript' maps `'` to `\'`, which is not a legal JSON escape, and
   would invalidate this whole block the moment any crumb name or URL contains
   an apostrophe. This exact suggestion has been raised and rejected multiple
   times across this repo's inline-JSON/JSON-LD blocks (see routes/tools.php's
   $ppInlinePayloadJson comment for the general form of this mistake) --
   `$breadcrumb_items` is presently a compile-time PHP array literal in
   routes/tools.php, not request/feed-derived, which is why this remains
   unescaped rather than an active vulnerability today; see EXTRACTION-MAP.md
   for what must be revisited if that ever changes. *}
{if !empty($breadcrumb_items)}
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {foreach $breadcrumb_items as $index => $crumb}
        {if $index > 0},{/if}{
          "@type": "ListItem",
          "position": {$index+1},
          "name": "{$crumb.name}",
          "item": "{$crumb.url}"
        }
      {/foreach}
    ]
  }
</script>
{/if}
