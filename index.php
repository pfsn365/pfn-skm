<?php
/**
 * Standalone bootstrap for the 4 extracted PFN tools.
 *
 * Mirrors the relevant parts of the parent skm/index.php: Slim 2 + Smarty view,
 * the same Smarty parser/compile/cache directories, the same two template roots,
 * and the critical `include_once` Smarty plugin registered on slim.before.dispatch
 * (many templates depend on it).
 *
 * Routes are guarded by restrictAccess(), so reach the tools with
 * ?debug__proxy_tools=true (or a PFNOriginHeader), exactly as in the parent app.
 */

// PHP 8 compatibility shim: Slim 2 calls get_magic_quotes_gpc(), which was
// removed in PHP 8.0. The parent app runs on PHP 7 where it still exists; this
// polyfill lets the same Slim 2 stack boot on PHP 8+. (Magic quotes have been
// off by default since PHP 5.4, so returning 0 matches real behavior.)
if (!function_exists('get_magic_quotes_gpc')) {
    function get_magic_quotes_gpc() { return 0; }
}

// This repo hosts PFN tools only. Force the PFN origin header so config.php
// resolves to production PFN values (correct CDN host) and restrictAccess()
// passes — reproducing how these routes run behind the profootballnetwork.com
// proxy today. (Set before Slim captures the request environment below.)
$_SERVER['HTTP_PFNORIGINHEADER'] = 'pfn';

require 'vendor/autoload.php';
require 'helpers.php';
mb_internal_encoding('UTF-8');

date_default_timezone_set("Asia/Kolkata");

$app = new \Slim\Slim(array(
    'view' => new \Slim\Views\SmartyPlugin()
));
$app->is_mobile = FALSE;
$app->is_desktop = TRUE;

$app->add(new \Slim\Middleware\SlimGoesSlimmer());

$explodedPath = explode("/", $app->request->getPath());
$lastPath = end($explodedPath);
if (is_numeric($lastPath)) {
    define('ARTICLE_CURRENT_PAGE', $lastPath);
} else {
    define('ARTICLE_CURRENT_PAGE', "1");
}

require 'config.php';

error_reporting(1);

// static asset base (matches parent app default)
$app->assets_location = '/';

$view = $app->view();
$view->parserDirectory = dirname(__FILE__) . '/vendor/smarty/smarty/libs';
$view->parserCompileDirectory = dirname(__FILE__) . '/templates/_compiled';
$view->parserCacheDirectory = dirname(__FILE__) . '/templates/_cache';
$view->setTemplatesDirectory(array('one' => dirname(__FILE__) . '/templates', 'two' => dirname(__FILE__)));

$response = $app->response();
$response['Content-type'] = 'text/html; charset=utf-8';

$app->hook('slim.before.dispatch', function () use ($app) {
    $app->view()->appendData(array(
        'asset_location' => $app->assets_location,
    ));

    // Register include_once plugin for smarty: a file included once is cached for the request.
    $view = $app->view();
    $smarty = $view->getInstance();

    $smarty->registerPlugin('function', 'include_once', function ($params, $smarty) {
        static $included = [];
        $template = $params['file'];
        if (isset($included[$template])) {
            return '';
        }
        $included[$template] = true;

        return $smarty->fetch($template, $params);
    });
});

$app->get('/health-check', function () use ($app) {
    $response = $app->response;
    return $response->status(204);
});

// restrictAccess() redirects unauthorized requests here.
$app->get('/error/404', function () use ($app) {
    $app->response->setStatus(404);
    echo "404 - Not Found.";
});

$app->notFound(function () use ($app) {
    $app->response->setStatus(404);
    echo "404 - Not Found.";
});

$app->error(function (\Exception $e) use ($app) {
    error_log(var_export($e, TRUE));
    echo "<pre>Application error: " . htmlspecialchars($e->getMessage()) . "</pre>";
});

include_once 'routes/tools.php';

$app->run();
