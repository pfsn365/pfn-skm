{include file="common/elements/glossary/index.tpl"}


{capture nocache=true name="glossaryItemsRenderer" assign="glossaryItems"}
  <div class="nfl-standings-glossary-list">
    <div>
      <span>REC</span>
      <span>Overall Record</span>
    </div>
    <div>
      <span>DIV</span>
      <span>Division Record</span>
    </div>
    <div>
      <span>CONF</span>
      <span>Conference Record</span>
    </div>
    <div>
      <span>SOS</span>
      <span>Strength of Schedule</span>
    </div>
    <div>
      <span>SOV</span>
      <span>Strength of Victory</span>
    </div>
    <div>
      <span>PF</span>
      <span>Points For</span>
    </div>
    <div>
      <span>PA</span>
      <span>Points Against</span>
    </div>
    <div>
      <span>PD</span>
      <span>Points Differential</span>
    </div>
    <div>
      <span>WIN %</span>
      <span>Overall Win Percentage</span>
    </div>
    <div>
      <span>PICK</span>
      <span>Draft Position</span>
    </div>
    <div>
      <span>X</span>
      <span>Clinched Playoff Berth</span>
    </div>
    <div>
      <span>Y</span>
      <span>Clinched Division</span>
    </div>
    <div>
      <span>Z</span>
      <span>Clinched First-Round Bye</span>
    </div>
    <div>
      <span>E</span>
      <span>Eliminated</span>
    </div>
  </div>
{/capture}

<div class="nfl-standings-glossary-section">
  {call generateGlossaryElement elementInput=["identifier" => "nfl-standings",  "items" => $glossaryItems, "collapsed" => false]}
</div>
