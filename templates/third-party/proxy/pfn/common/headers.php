<?php

/**
 * PFN menu helpers.
 *
 * Drop-in replacement for:
 *   /var/www/html/templates/third-party/proxy/pfn/common/headers.php
 *
 * Public API is unchanged:
 *   getPFNMainHeaderList($data)
 *   getPFNNestedMenuItemInfo($data, $allMenuItems)
 *
 * Fixes:
 *  - "Cannot access offset of type string on string": WP returns `title` as
 *    either {"raw": "...", "rendered": "..."} or a bare string depending on
 *    context / plugins / cache layer. Both shapes are now handled.
 *  - The whole menu array was json_encode/json_decode'd again at every level of
 *    recursion (O(n^2), and worse on wide menus). Now normalised once and
 *    indexed by parent id, so tree building is O(n).
 *  - A menu item whose parent chain loops back on itself used to recurse until
 *    the memory limit; cycles are now detected and skipped.
 *  - Items missing `parent` / `id`, or a payload that isn't a list at all, are
 *    skipped instead of throwing.
 */

// Set to true (or define before including this file) to log malformed items.
if (!defined('PFN_MENU_DEBUG')) {
    define('PFN_MENU_DEBUG', false);
}

/**
 * Turn objects / stdClass / mixed payloads into plain nested arrays.
 *
 * @param  mixed $data
 * @return mixed
 */
function pfnNormalizeData($data)
{
    if (is_array($data)) {
        return $data;
    }

    $decoded = json_decode(json_encode($data), true);

    return (json_last_error() === JSON_ERROR_NONE) ? $decoded : null;
}

/**
 * Read a WP REST field that may be a string or a {raw, rendered} object.
 *
 * @param  mixed  $value
 * @param  string $default
 * @return string
 */
function pfnExtractField($value, $default = '')
{
    if (is_array($value)) {
        if (isset($value['rendered']) && is_scalar($value['rendered'])) {
            return (string) $value['rendered'];
        }
        if (isset($value['raw']) && is_scalar($value['raw'])) {
            return (string) $value['raw'];
        }
        return $default;
    }

    if (is_string($value) || is_numeric($value)) {
        return (string) $value;
    }

    return $default;
}

/**
 * Log a malformed item without ever interrupting the cron run.
 *
 * @param  string $message
 * @param  mixed  $item
 * @return void
 */
function pfnLogMenuAnomaly($message, $item = null)
{
    if (!PFN_MENU_DEBUG) {
        return;
    }

    $payload = ($item === null) ? '' : ' | ' . json_encode($item);
    error_log('[PFN menu] ' . $message . $payload);
}

/**
 * Group a flat list of menu items by their parent id.
 *
 * @param  array $items
 * @return array  map of parentId => list of items
 */
function pfnIndexMenuItemsByParent(array $items)
{
    $index = [];

    foreach ($items as $item) {
        if (!is_array($item)) {
            pfnLogMenuAnomaly('Menu entry is not an object, skipped.', $item);
            continue;
        }

        if (!array_key_exists('parent', $item)) {
            pfnLogMenuAnomaly('Menu entry has no "parent" key, skipped.', $item);
            continue;
        }

        $parentId = (int) $item['parent'];
        $index[$parentId][] = $item;
    }

    return $index;
}

/**
 * Recursively build one node of the menu tree.
 *
 * @param  array $item
 * @param  array $childrenByParent
 * @param  array $seen              ids already on the current branch
 * @return array|null               null when a cycle is detected
 */
function pfnBuildMenuNode(array $item, array $childrenByParent, array $seen = [])
{
    $itemId = isset($item['id']) ? (int) $item['id'] : null;

    if ($itemId !== null) {
        if (isset($seen[$itemId])) {
            pfnLogMenuAnomaly('Cycle detected at item id ' . $itemId . ', branch dropped.');
            return null;
        }
        $seen[$itemId] = true;
    } else {
        pfnLogMenuAnomaly('Menu entry has no "id"; children cannot be resolved.', $item);
    }

    $subItems = [];

    if ($itemId !== null && !empty($childrenByParent[$itemId])) {
        foreach ($childrenByParent[$itemId] as $child) {
            $node = pfnBuildMenuNode($child, $childrenByParent, $seen);
            if ($node !== null) {
                $subItems[] = $node;
            }
        }
    }

    return [
        'itemTitle' => pfnExtractField(isset($item['title']) ? $item['title'] : null),
        'itemUrl'   => pfnExtractField(isset($item['url']) ? $item['url'] : null),
        'subItems'  => $subItems,
    ];
}

/**
 * Build a single menu item (and everything beneath it).
 *
 * Kept for backward compatibility with existing call sites.
 *
 * @param  mixed $data          the item
 * @param  mixed $allMenuItems  the full flat list of menu items
 * @return array
 */
function getPFNNestedMenuItemInfo($data, $allMenuItems)
{
    $item = pfnNormalizeData($data);
    $all  = pfnNormalizeData($allMenuItems);

    if (!is_array($item)) {
        pfnLogMenuAnomaly('getPFNNestedMenuItemInfo received a non-object item.', $data);
        return ['itemTitle' => '', 'itemUrl' => '', 'subItems' => []];
    }

    $childrenByParent = is_array($all) ? pfnIndexMenuItemsByParent($all) : [];

    $node = pfnBuildMenuNode($item, $childrenByParent);

    return ($node === null)
        ? ['itemTitle' => '', 'itemUrl' => '', 'subItems' => []]
        : $node;
}

/**
 * Build the top-level menu tree from a flat WP menu-items payload.
 *
 * @param  mixed $data
 * @return array
 */
function getPFNMainHeaderList($data)
{
    $allMenuItems = pfnNormalizeData($data);

    if (!is_array($allMenuItems)) {
        pfnLogMenuAnomaly('Menu payload could not be decoded into an array.', $data);
        return [];
    }

    $childrenByParent = pfnIndexMenuItemsByParent($allMenuItems);

    if (empty($childrenByParent[0])) {
        pfnLogMenuAnomaly('No top-level (parent = 0) items found in payload.');
        return [];
    }

    $itemList = [];

    foreach ($childrenByParent[0] as $item) {
        $node = pfnBuildMenuNode($item, $childrenByParent);
        if ($node !== null) {
            $itemList[] = $node;
        }
    }

    return $itemList;
}
