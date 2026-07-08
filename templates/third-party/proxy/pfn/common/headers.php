<?php

function getPFNNestedMenuItemInfo($data, $allMenuItems)
{
  $dataEncoded = json_encode($data);

  $dataEncoded = json_decode($dataEncoded, true);

  $itemTitle = $dataEncoded["title"]["rendered"];
  $itemUrl = $dataEncoded["url"];
  $itemId =  $dataEncoded["id"];

  $subItems = [];

  $allMenuItems = json_encode($allMenuItems);
  $allMenuItems = json_decode($allMenuItems, true);

  foreach ($allMenuItems as $item) {
    if ($item["parent"] == $itemId) {
      array_push($subItems, getPFNNestedMenuItemInfo($item, $allMenuItems));
    }
  }

  return [
    'itemTitle' => $itemTitle,
    'itemUrl' => $itemUrl,
    'subItems' => $subItems
  ];
}

function getPFNMainHeaderList($data)
{
  $dataEncoded = json_encode($data);

  $dataEncoded = json_decode($dataEncoded, true);

  $itemList = [];

  foreach ($dataEncoded as $item) {
    if ($item["parent"] == 0) {
      array_push($itemList, getPFNNestedMenuItemInfo($item, $dataEncoded));
    }
  }

  return $itemList;
}
