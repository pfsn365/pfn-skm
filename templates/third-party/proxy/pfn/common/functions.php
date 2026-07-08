<?php

include_once __DIR__ . '/../../../../../helpers.php';
include_once __DIR__ . '/../../../../../config.php';

function fetch_pfn_top_menu_data()
{
  $urls = [
    "main_menu_data_page_1" => PFN_SITE_URL . "/" . PFN_MAIN_MENU_ID,
    "main_menu_data_page_2" => PFN_SITE_URL . "/" . PFN_MAIN_MENU_ID . "&page=2",
  ];

  $response_data = fetch_data_with_curl_multi($urls, PFN_WP_AUTH_KEY);

  if ($response_data === false) {
    return json_encode("Error fetching the data.");
  }

  // Merge the main menu data from page 1 and page 2
  $main_menu_data_page_1 = $response_data['main_menu_data_page_1'];
  $main_menu_data_page_2 = $response_data['main_menu_data_page_2'];

  $merged_main_menu_data = array_merge($main_menu_data_page_1, $main_menu_data_page_2);

  // Update the response data with the merged main menu data
  $response_data['main_menu_data'] = $merged_main_menu_data;
  unset($response_data['main_menu_data_page_1'], $response_data['main_menu_data_page_2']);

  return $response_data;
}
