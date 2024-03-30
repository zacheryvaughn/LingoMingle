// JavaScript code to access the camera feeds

// Function to access the user's camera
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const incomingFeed = document.getElementById('incoming-feed');
        incomingFeed.srcObject = stream;

        const outgoingFeed = document.getElementById('outgoing-feed');
        outgoingFeed.srcObject = stream.clone(); // Clone the stream for outgoing feed
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

// Call the function to setup the camera when the page loads
window.onload = setupCamera;
