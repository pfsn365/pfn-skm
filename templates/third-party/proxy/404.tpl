{if !(isset($skip_nav_menu) && $skip_nav_menu)}
  {include file="third-party/proxy/{$brand}/common/header-navigation/index.tpl"}
{/if}

<style>
  .error-404 {
    position: fixed;
    top: 100px;
    width: 100%;
  }

  .error-404 img {
    width: 100%;
    height: auto;
  }
</style>

<div class="error-404">
  <img src='https://static.sportskeeda.com/skm/assets/images/404.png' width="360"
    height="100" alt="404 image">
</div>
