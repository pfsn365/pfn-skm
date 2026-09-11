{include file="./styles.tpl"}

{* DIVERGENCE FROM PARENT skm (2026-09-11, owner-approved, perf): inlines the
   playoff-predictor data feed the route already fetched server-side (see
   routes/tools.php) so playoff-predictor.js does not have to re-fetch the same
   ~29KB JSON before it can render. $playoff_predictor_inline_data is a single
   JSON object `{"fetchedAt": "<ISO-8601>", "payload": {...the feed...}}`,
   emitted only when the server-side fetch/decode/size-cap check succeeded
   (see routes/tools.php -- the 512KB cap applies to this whole envelope, not
   just the feed payload); when it's empty, this block emits nothing and the
   bundle falls back to its original fetch().

   `fetchedAt` exists to defeat HTML-cache staleness (security review,
   2026-09-11): this route is served `Cache-Control: max-age=600, s-maxage=600,
   stale-while-revalidate=14400` (measured against the live response headers),
   so a reload served from that cache could otherwise silently render feed
   data up to 4 hours stale with a matching, equally stale "UPDATED ON" text --
   undermining this page's real differentiator, near-real-time data.
   playoff-predictor.js's readInlinePlayoffData() only trusts this payload
   when `fetchedAt` is within 5 minutes of the client's clock (comfortably
   inside the 600s cache-freshness window), and treats a missing,
   unparseable, or future-dated stamp as stale rather than risk clock skew
   reading as "fresh". See that function's comment for the full reasoning.

   Emitted as `type="application/json"` DATA, not as a `var X = {...}` JS object
   literal (security review, 2026-09-11): a JS object-literal assignment and
   JSON.parse() disagree on a `__proto__` key in untrusted feed data -- one sets
   the object's prototype, the other makes it an own property -- and the bundle
   reads this element with JSON.parse() (readInlinePlayoffData() in
   playoff-predictor.js) specifically so both the inline and fallback-fetch
   paths always go through the same deserialiser and can never silently
   disagree. `application/json` also means the browser never treats this
   block's content as executable script, regardless of what it contains.

   The value is pre-serialised PHP-side with JSON_HEX_TAG | JSON_HEX_AMP |
   JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES -- NOT Smarty's
   |escape:'javascript', which maps `'` to `\'`, an illegal JSON escape that
   would silently produce invalid JSON -- so it is safe to print with
   `nofilter` here. JSON_HEX_TAG specifically rewrites the literal characters
   `<` and `>` to the escapes `\u003C` and `\u003E`, which guarantees no raw
   `</script` sequence can ever appear inside this block even though the
   payload is remote, feed-derived, untrusted data (Rule 4). See
   EXTRACTION-MAP.md. *}
{if $playoff_predictor_inline_data}
<script type="application/json" id="pp-inline-data">{$playoff_predictor_inline_data nofilter}</script>
{/if}

{include file="./common/templates/index.tpl"}

<div class="playoff-predictor-tool-wrapper">
    <div class="pp-desktop-view {if !$is_desktop}hidden{/if}">
        {include file="./desktop/index.tpl"}
    </div>
    <div class="pp-tablet-mobile-view {if $is_desktop}hidden{/if}">
        {include file="./mobile/index.tpl"}
    </div>
</div>

{if !$is_desktop && $show_bottom_stick_ad}
    <div class="playoff-predictor-bottom-sticky-ad-container">
        {include file="common/ads/sticky/mobile.tpl" slotId = "Mob_32050_Sticky_2019"}
    </div>
{/if}

<div class="overlay hidden"></div>

<div class="loading-overlay">
    <div class="loader"></div>
    <div class="loading-overlay-text">Loading...</div>
</div>

<div class="nfl-feedback-container hidden">
    {include file="templates/third-party/proxy/pfn/common/feedback-cta/index.tpl"}
    {call get_feedback_cta_2024 source_page="playoff-predictor" source_tab=$feedback_source_tab large_content_text="Would you recommend our Playoff Predictor to others?" cta_text="Help us improve the game!" popup_brand_logo=$feedback_popup_logo popup_header_text="" popup_content_text="How can we improve?"}
</div>

{include file="./js.tpl"}
