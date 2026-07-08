<script type="application/ld+json">
{
    "@context": "http://schema.org",
    "@type": "FAQPage",
    "headline": "{$title|strip_tags:true|strip|trim|escape:'htmlall'|replace:'\\':'\\\\'}",
    "mainEntity": [
        {foreach $faq as $index => $one_faq}
        {if $index > 0},{/if}{
                "@type": "Question",
                "name": "{$one_faq.question|strip_tags:true|strip|trim|escape:'htmlall'|replace:'\\':'\\\\'}",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "{$one_faq.answer|strip_tags:true|strip|trim|escape:'htmlall'|replace:'\\':'\\\\'}"
                }
            }
        {/foreach}
    ]
}
</script>
