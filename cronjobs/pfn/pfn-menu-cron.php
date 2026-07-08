<?php

include __DIR__ . "/../../templates/third-party/proxy/pfn/common/functions.php";
include __DIR__ . "/../../templates/third-party/proxy/pfn/common/headers.php";
require_once(__DIR__ . '/../../helpers.php');

function pfn_menu_data_cron()
{
  cron_info_log_message("Starting the process to PFN Menu data");

  $headers_data = fetch_pfn_top_menu_data();
  $main_menu_data = getPFNMainHeaderList($headers_data["main_menu_data"]);

  if (count($main_menu_data) > 0) {
    store_menu_data("main-menu", $main_menu_data);
  }

  cron_info_log_message("Finished the process to PFN Menu data");
}

function store_menu_data($fileName, $menuData) {
  $base_dir = __DIR__ . "/../../data/pfn";
  $file_temp = "$base_dir/$fileName-data-temp.json";
  $file = "$base_dir/$fileName-data.json";

  $menuDataJson = json_encode($menuData, JSON_PRETTY_PRINT);
  if ($menuDataJson === false) {
    cron_log_message("Error: Failed to encode $fileName menu data to JSON. Error: " . json_last_error_msg());
    return;
  }

  if (file_exists($file) && md5($menuDataJson) == md5(file_get_contents($file))) {
    cron_info_log_message("There was no changes in $fileName menu data");
    return;
  }

  if (file_put_contents($file_temp, $menuDataJson) === false) {
    cron_log_message("Error: Failed to write $fileName data to temp file");
    return;
  }

  if (empty(json_decode(file_get_contents($file_temp), true))) {
    cron_log_message("Error: $fileName Data saved in temp file was not proper JSON string");
    return;
  }

  if (file_put_contents($file, $menuDataJson) !== false) {
    cron_info_log_message("$fileName menu data page info is updated successfully for event_slug");
    unlink($file_temp);
  } else {
    cron_log_message("Error: $fileName Data could not be written in main file");
  }
}

pfn_menu_data_cron();
