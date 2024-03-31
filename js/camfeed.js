//camfeed.js

// SETUP CAMERA
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const incomingFeed = document.getElementById('incoming-feed');
        incomingFeed.srcObject = stream;

        const outgoingFeed = document.getElementById('outgoing-feed');
        outgoingFeed.srcObject = stream.clone();
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}
window.onload = setupCamera;