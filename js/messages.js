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
    function sendMessage() {
        var message = messageInput.value.trim(); // Get the trimmed value of the text area
        if (message !== "") {
            // Create a new message element
            var messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.textContent = message;
            
            // Append the message element to the message feed container
            messageFeedContainer.appendChild(messageElement);

            // Scroll to the bottom of the message feed container
            messageFeedContainer.scrollTop = messageFeedContainer.scrollHeight;

            // Clear the text area after sending the message
            messageInput.value = "";
        }
    }

});

