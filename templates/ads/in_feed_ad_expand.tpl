<script>
window.addEventListener('message',function(e) {
    {* We want the native article ad unit, being served in ad iframe as banner,
    to be expanded to full width of its parent container so that it looks just like other articles
    for better UX
    As per ethical practices, a "promoted by <sponsor name>" on it *}
    if(e.data && e.data.SKNative) {
        var expansionEligibleIframe = e.source.frameElement;
        expansionEligibleIframe.style.width = "100%";
    }
});
</script>
