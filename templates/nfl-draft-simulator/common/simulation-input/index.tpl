{include file="./styles.tpl"}

<div class="filters-container">
  <div class="text-filter">
    <span>Draft Settings</span>
    {if isset($mds_widget_distinction) && isset($third_party_logo_path) && $third_party_logo_path}
      <img data-logo="fansided" src="{$smarty.const.STATIC_URL}{$third_party_logo_path}" width={$third_party_logo_width} height={$third_party_logo_height}
          alt="Fansided Logo" crossorigin="anonymous">
    {/if}
  </div>

  <div class="inputs-container">
    <div class="rounds-input-container">
      <span class="rounds-selection-text">Select Number of Rounds</span>
      {if isset($mds_widget_distinction) && $mds_widget_distinction}
        <select name="rounds" id="rounds-dropdown" aria-label="number-of-rounds">
          <option value="1" selected>1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
      {else}
        <div class="number-of-rounds">
          <div class="radio-input">
            <input type="radio" id="one" name="rounds" value=1 checked>
            <label for="one">1</label><br>
          </div>
          <div class="radio-input">
            <input type="radio" id="two" name="rounds" value=2>
            <label for="two">2</label><br>
          </div>
          <div class="radio-input">
            <input type="radio" id="three" name="rounds" value=3>
            <label for="three">3</label><br>
          </div>
          <div class="radio-input">
            <input type="radio" id="four" name="rounds" value=4>
            <label for="four">4</label><br>
          </div>
          <div class="radio-input">
            <input type="radio" id="five" name="rounds" value=5>
            <label for="five">5</label><br>
          </div>
          <div class="radio-input">
            <input type="radio" id="six" name="rounds" value=6>
            <label for="six">6</label><br>
          </div>
          <div class="radio-input">
            <input type="radio" id="seven" name="rounds" value=7>
            <label for="seven">7</label><br>
          </div>
        </div>
      {/if}
    </div>

    <div class="speed-input-container">
      <span class="speed-selection-text">Select Draft Speed</span>
      <div class="draft-speed">
        <div class="radio-input">
          <input type="radio" id="slow" name="speed" value="slow">
          <label for="slow">Slow</label><br>
        </div>
        <div class="radio-input">
          <input type="radio" id="normal" name="speed" value="normal" checked>
          <label for="normal">Normal</label><br>
        </div>
        <div class="radio-input">
          <input type="radio" id="fast" name="speed" value="fast">
          <label for="fast">Fast</label><br>
        </div>
      </div>
    </div>

    {if $show_playerslist_selection_dropdown}
      <div class="players-list-selection-container">
        <div class="players-list-selection-container-holder">
          <span class="list-selection-text">Select Big Board:</span>
          <select name="list-selector" id="players-lists" onchange="selectMDSPlayersList(event)" aria-label="players-list">
            <option value="pfsn">PFSN</option>
            {* <option value="consensus">Consensus</option>
            {if !isset($mds_widget_distinction)}
              <option value="espn">ESPN</option>
              <option value="pff">PFF</option>
              <option value="the_athletic">The Athletic</option>
              <option value="user_adp">User ADP</option>
              <option value="jacob_infante">Jacob Infante</option>
              <option value="ian_cummings">Ian Cummings</option>
              <option value="wide_left_consensus">Wide Left</option>
            {/if} *}
          </select>
        </div>
        {if isset($mds_widget_distinction) && $mds_widget_distinction}
          <img class="widget-pfsn-logo" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-black-ver-2.png?w=40&h=40" width="26" height="26"
            alt="PFSN Logo">
        {/if}
      </div>
    {/if}

    <div class="year-list-selection-container hidden">
      <div class="year-list-selection-container-holder">
        <span class="list-selection-text">Select Year:</span>
        <select name="list-selector" id="years-lists" onchange="selectMDSYear()" aria-label="years-list">
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
      </div>
    </div>

    {if $is_desktop}
      <button class="start-draft-btn" onclick="startDraft(this)">{$start_draft_btn_text}</button>
    {/if}
  </div>
</div>
