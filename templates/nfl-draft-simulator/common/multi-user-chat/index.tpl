{include file="./styles.tpl"}

<div class="multi-user-chat">
    <div class="multi-user-chat-header">
        <div class="chat-header-count-text-container">
            <span>DRAFT CENTRAL</span>
            <span class="unread-chat-count hidden" data-count="0"></span>
        </div>
        <button class="upside-down-button hidden">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/upside-down-icon.png" width="24" height="24"
                alt="down-icon">
        </button>
    </div>
    <div class="multi-user-chat-content">
        <div class="multi-user-chat-messages">

        </div>
    </div>
    <div class="multi-user-chat-input">
        <div class="user-msg-input-container">
            <input title="Enter your message" class="user-msg-input" placeholder="Type your Message">
        </div>
        <div class="user-msg-send-container">
            <button title="Send Button" class="user-msg-send-btn">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/send-msg-icon.png" height="16px" width="16px"
                    alt="Send icon" />
            </button>
        </div>
    </div>
</div>
