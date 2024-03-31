// TEXT AREA
const textarea = document.getElementById('message-input');

textarea.addEventListener('input', function() {
    // Reset the textarea's height to auto to allow it to grow vertically
    this.style.height = 'auto';
    
    // Set the textarea's height to match its scroll height, ensuring that all content is visible
    this.style.height = (this.scrollHeight) + 'px';
});

// Call the input event once on page load to set the initial height based on existing content
textarea.dispatchEvent(new Event('input'));


// SUBMIT MESSAGE
document.addEventListener("DOMContentLoaded", function() {
    // Get references to the text area and send button
    var messageInput = document.getElementById("message-input");
    var sendButton = document.getElementById("send-button");
    var messageFeedContainer = document.getElementById("message-feed-container");

    // Add event listener to the text area for Enter key press
    messageInput.addEventListener("keypress", function(event) {
        // Check if Enter key is pressed and Shift key is not pressed
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevent the default Enter key behavior (new line)
            sendMessage(); // Call the function to send the message
        }
    });

    // Add event listener to the send button for click
    sendButton.addEventListener("click", function() {
        sendMessage(); // Call the function to send the message
    });

    // Function to send the message
    // Function to send the message
    function sendMessage() {
        var outgoingMessage = messageInput.value; // Get the value of the text area without trimming
        if (outgoingMessage.trim() !== "") {
            // Create a new message element
            var messageElement = document.createElement("div");
            messageElement.classList.add("message");
            // Set the message content as HTML to preserve line breaks and spaces
            messageElement.innerHTML = outgoingMessage.replace(/\n/g, '<br>'); // Replace newline characters with <br> tags
            // Append the message element to the message feed container
            messageFeedContainer.appendChild(messageElement);

            // Scroll to the bottom of the message feed container
            messageFeedContainer.scrollTop = messageFeedContainer.scrollHeight;

            // Clear the text area after sending the message
            messageInput.value = "";

            // Reset the text area's height to its default value
            messageInput.style.height = ""; // Reset height to default (auto)
        }
    }

});

// check for safari to modify message margins
function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
// Check if the browser is Safari and add a class to the body if it is
if (isSafari()) {
    document.body.classList.add('safari');
}