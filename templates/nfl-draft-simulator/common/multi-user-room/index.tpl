{include file="./styles.tpl"}

<div class="multi-user-room">
    <div class="room-header">
        <div class="room-info">
            <div class="room-name-container">
                <span class="room-name-text">Room Name</span>
            </div>
            <div class="room-info-container">
                <div class="room-id-info-container">
                    <span class="room-id-info-label">Room ID:</span>
                    <span class="room-id-info-text"></span>
                    <div class="room-id-copy">
                        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/copy-btn-icon.png" height="12px"
                            width="12px" alt="Copy Icon">
                    </div>
                </div>
                <div class="room-password-info-container">
                    <span class="room-password-info-label">Password:</span>
                    <span class="room-password-info-text"></span>
                    <div class="room-password-copy">
                        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/copy-btn-icon.png" height="12px"
                            width="12px" alt="Copy Icon">
                    </div>
                </div>
            </div>
        </div>
        <div class="room-settings-container">
            <div class="share-btn-container">
                <button class="share-btn"> <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/forward-share-icon.png" height="16px" width="16px"
                alt="Copy Icon"> Invite</button>
            </div>
            <div class="room-controls">
                <div class="circle-container">
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>
                <span class="room-controls-options hidden">
                    <span class="room-controls-option leave-room-btn">Leave Room</span>
                </span>
            </div>
        </div>
    </div>
    <div class="room-content"></div>
    <div class="draft-start-counter main">
        <span class="draft-start-counter-text">THE DRAFT BEGINS IN <span class="countdown-timer main"></span></span>
    </div>
    <div class="room-footer">
        <div class="room-footer-text">
            <span><strong>Note: </strong>The users without a team at the end of the draft countdown will be automatically removed from the room</span>
        </div>
        <button class="draft-now-btn disabled">
            Draft Now
        </button>
    </div>
</div>
