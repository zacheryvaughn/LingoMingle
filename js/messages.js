//messages.js

// TEXT AREA
const textarea = document.getElementById('message-input');

textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});
textarea.dispatchEvent(new Event('input'));


// SUBMIT MESSAGE
document.addEventListener("DOMContentLoaded", function() {
    var messageInput = document.getElementById("message-input");
    var sendButton = document.getElementById("send-button");
    var messageFeedContainer = document.getElementById("message-feed-container");

    messageInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener("click", function() {
        sendMessage();
    });

    function sendMessage() {
        var outgoingMessage = messageInput.value;
        if (outgoingMessage.trim() !== "") {
            var messageElement = document.createElement("div");
            messageElement.classList.add("outgoing-message");
            messageElement.innerHTML = outgoingMessage.replace(/\n/g, '<br>');
            messageFeedContainer.appendChild(messageElement);

            messageFeedContainer.scrollTop = messageFeedContainer.scrollHeight;

            messageInput.value = "";

            messageInput.style.height = "";
        }
    }

});

// CHECK IF SAFARI
function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
if (isSafari()) {
    document.body.classList.add('safari');
}