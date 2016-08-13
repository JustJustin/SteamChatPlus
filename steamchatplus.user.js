// ==UserScript==
// @name        SteamChatPlus
// @namespace   JustJustin
// @description Adds new features to Steam Chat
// @include     https://steamcommunity.com/chat*
// @version     1.0.0
// @grant       none
// @downloadURL https://github.com/JustJustin/SteamChatPlus/raw/master/SteamChatPlus.user.js
// ==/UserScript==

function newChatMsgHandler($msg) {
    // handle updating scroll
    var $chat = $msg.closest(".chat_dialog");
    var $scroll = $chat.querySelector(".chat_dialog_scroll");
    if ($scroll.atBottom) {$scroll.scrollTop = $scroll.scrollTopMax;}
    
    // Remove steam link filter:
    var $links = $msg.querySelectorAll("a");
    for (var i = 0; i < $links.length; ++i) {
        var $link = $links[i];
        if ($link.href.contains("steamcommunity.com/linkfilter/")) {
            $link.href = $link.innerText;
        }
    }
}

function newChatHandler($chat) {
    // Scroll handler for new messages, default to assuming we want to scroll to the bottom.
    var $scroll = $chat.querySelector(".chat_dialog_scroll");
    $scroll.atBottom = true; 
    $scroll.addEventListener("scroll", function() {
        if (this.scrollTop == this.scrollTopMax) {
            this.atBottom = true;
        } else {
            this.atBottom = false;
        }
    });
    
    // Observer for handling new messages in chat.
    var $chatMsgHolder = $chat.querySelector(".chat_dialog_content_inner");
    var chatObserver = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; ++i) {
            var mutation = mutations[i];
            if (!mutation.addedNodes) {continue;}
            for (var j = 0; j < mutation.addedNodes.length; ++j) {
                var msg = mutation.addedNodes[j];
                console.log({msg:"NewChatMessage!", msg:msg});
                newChatMsgHandler(msg);
            }
        }
    });
    chatObserver.observe($chatMsgHolder, {childList: true});
}

var newChatObserver = new MutationObserver(function (mutations) {
    console.log({msg:"newChatObserver", mutations:mutations});
    for (var i = 0; i < mutations.length; ++i) {
        var mutation = mutations[i];
        if (!mutation.addedNodes) {continue;}
        for (var j = 0; j < mutation.addedNodes.length; ++j) {
            var node = mutation.addedNodes[j];
            console.log({msg:"newChat!", chat: node});
            newChatHandler(node);
        }
    }
});
var $chatHolder = document.querySelector("#chatlog");
newChatObserver.observe($chatHolder, {childList: true});
