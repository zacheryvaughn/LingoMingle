const sideSwitch = document.getElementById("side-switch");
const themeSwitch = document.getElementById("theme-switch");

const roomButton = document.getElementById("room-button");
const roomDropdown = document.getElementById("room-dropdown");
const roomIdInput = document.getElementById("room-id-input");
const createButton = document.getElementById("create-room");
const joinButton = document.getElementById("join-room");

const regionButton = document.getElementById("region-button");
const regionDropdown = document.getElementById("region-dropdown");
const globalCheckbox = document.getElementById('global-checkbox');
const regionCheckboxes = document.querySelectorAll('.region-checkbox:not(#global-checkbox)');

const incomingCamFeed = document.getElementById('incoming-feed');
const outgoingCamFeed = document.getElementById('outgoing-feed');

const onlineUsers = document.getElementById('online-user-count-span');
const connectionStatus = document.getElementById('connection-status-span');

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button')
const messageFeed = document.getElementById('message-feed-container');

const pairButton = document.getElementById('pair-button');
const pairButtonText = pairButton.querySelector('h4');
const playIcon = pairButton.querySelector('.fa-play');
const pauseIcon = pairButton.querySelector('.fa-pause');
const skipButton = document.getElementById('skip-button');

const messagingButton = document.getElementById('messaging-button');


// Assign State Variables
let isWaiting = false;
let isPaired = false;
let inPrivateRoom = false;
// Me and you
let myId = null;
let partnerId = null;

// ONLINE : "https://lingomingle-service-mrslpylp7a-uw.a.run.app"
// OFFLINE : "http://localhost:3000"
let socket = io("https://lingomingle-service-mrslpylp7a-uw.a.run.app");
socket.on('yourId', (id) => {
    myId = id;
});

socket.on("heartbeat", (message) => {
    console.log("Heartbeat message received:", message);
    if (message === "PING") {
        socket.emit("heartbeat", "PONG");
    }
});

socket.on("connect", () => {
    console.log("Connected to server.");
});

socket.on("disconnect", () => {
    console.log("Disconnected from server.");
});

// Useful Responses from Server
socket.on('unpaired', () => {
    // Reassign Variables
    isWaiting = false;
    isPaired = false;
    inPrivateRoom = false;
    connectionStatus.textContent = `Unpaired`;
    connectionStatus.style.color = `#ff3045`;
    // Style pairButton
    pairButtonText.textContent = 'Start';
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    pairButton.style.width = '50%';
    // Show the skipButton
    skipButton.style.display = 'flex';
    // Clear messageFeed
    messageFeed.innerHTML = '';
    // Log to Console
    console.log('Unpaired.');
    endCall();
});

socket.on('waiting', () => {
    // Reassign Variables
    isWaiting = true;
    isPaired = false;
    inPrivateRoom = false;
    connectionStatus.textContent = `Waiting`;
    connectionStatus.style.color = `#fff830`;
    // Style pairButton
    pairButtonText.textContent = 'Stop';
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    // Clear messageFeed
    messageFeed.innerHTML = '';
    // Log to Console
    console.log('Waiting...');
    endCall(); // Ensured that after a user has been skipped, the call ends on their side.
});

socket.on('paired', (data) => {
    partnerId = (myId === data.user1Id) ? data.user2Id : data.user1Id;
    // Reassign Variables
    isPaired = true;
    isWaiting = false;
    inPrivateRoom = false;
    connectionStatus.textContent = `Paired`;
    connectionStatus.style.color = `#30ff60`;
    // Style pairButton
    pairButtonText.textContent = 'Stop';
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    // Log to Console
    console.log('Paired.');
    console.log('Your ID:', myId);
    console.log('Partner ID:', partnerId);
});

socket.on('pairedInPrivateRoom', (data) => {
    partnerId = (myId === data.user1Id) ? data.user2Id : data.user1Id;
    // Reassign Variables
    inPrivateRoom = true;
    isWaiting = false;
    isPaired = false;
    connectionStatus.textContent = `Private`;
    connectionStatus.style.color = `#30c4ff`;
    // Style pairButton
    pairButtonText.textContent = 'Leave';
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    pairButton.style.width = 'calc(100%)';

    toggleDropdown('room-button', 'room-dropdown')
    // Hide the skipButton
    skipButton.style.display = 'none';
    // Clear messageFeed
    messageFeed.innerHTML = '';
    // Log to Console
    console.log('Paired in private room.');
    console.log('Your ID:', myId);
    console.log('Partner ID:', partnerId);
});

socket.on('privateRoomCreated', () => {
    inPrivateRoom = true;
    isWaiting = false;
    isPaired = false;
    connectionStatus.textContent = `Private`;
    connectionStatus.style.color = `#30c4ff`;
    // Style pairButton
    pairButtonText.textContent = 'Leave';
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    pairButton.style.width = 'calc(100%)';

    toggleDropdown('room-button', 'room-dropdown')
    // Hide the skipButton
    skipButton.style.display = 'none';
    // Clear messageFeed
    messageFeed.innerHTML = '';
    // Log to Console
    console.log('Created private room.');
});

// Handling Client Click Emit Events
pairButton.addEventListener('click', () => {
    if (isWaiting) {
        socket.emit('unwaitRequest');
    } else if (isPaired) {
        socket.emit('unpairRequest');
        endCall();
    } else if (inPrivateRoom) {
        socket.emit('leavePrivateRoom');
        endCall();
    } else {
        socket.emit('pairRequest');
    };
});

skipButton.addEventListener('click', () => {
    if (isPaired) {
        socket.emit('skipRequest');
        endCall();
    } else {
        console.log('Pair before skipping.');
    };
});

// Function to handle private room emit conditions.
function handleRoomTransition(actionType, roomId) {
    // First, clear any existing state.
    if (isWaiting) {
        socket.emit('unwaitRequest');
    } else if (isPaired) {
        socket.emit('unpairRequest');
        endCall();
    } else if (inPrivateRoom) {
        socket.emit('leavePrivateRoom');
        endCall();
    };

    // Then, after a short delay to allow the server to process the state clearing, perform the requested action.
    setTimeout(() => {
        if (actionType === 'create') {
            socket.emit('createPrivateRoom', roomId);
        } else if (actionType === 'join') {
            socket.emit('joinPrivateRoom', roomId);
        }
    }, 500); // Adjust delay as needed based on server response times.
};

// Function to update placeholder text and style
function updatePlaceholder(text, showError) {
    roomIdInput.placeholder = text;
    if (showError) {
        roomIdInput.value = ''; // Clear the input field to show the placeholder as a warning
        roomIdInput.classList.add('error-placeholder');
    } else {
        roomIdInput.classList.remove('error-placeholder');
    }
}

createButton.addEventListener('click', () => {
    const roomId = roomIdInput.value.trim();
    if (roomId.length >= 6) {
        handleRoomTransition('create', roomId);
    } else {
        updatePlaceholder("At least 6 characters...", true);
    }
});

joinButton.addEventListener('click', () => {
    const roomId = roomIdInput.value.trim();
    if (roomId.length >= 6) {
        handleRoomTransition('join', roomId);
        // Set a timeout to check room status after 3 seconds
        setTimeout(() => {
            // Check if still not in a private room after 3 seconds
            if (!inPrivateRoom) {
                updatePlaceholder("Room does not exist...", true);
            }
        }, 2000);
    } else {
        updatePlaceholder("At least 6 characters...", true);
    }
});

roomIdInput.addEventListener('input', () => {
    // Reset placeholder when user starts typing again
    if (roomIdInput.classList.contains('error-placeholder')) {
        updatePlaceholder("Enter room ID...", false);
    }
});

//Status Bar
socket.on('onlineUsers', (count) => {
    onlineUsers.textContent = `${count}`;
});
connectionStatus.textContent = `Unpaired`;
connectionStatus.style.color = `#ff3045`;

function sendMessage() {
    const message = messageInput.value.trim();
    if ((message !== '') && (isPaired || inPrivateRoom)) {
        socket.emit('messageFromClient', message);
        const messageElement = document.createElement('div');
        messageElement.classList.add('outgoing-message');
        messageElement.innerHTML = message.replace(/\n/g, '<br>');
        messageFeed.appendChild(messageElement);
        messageFeed.scrollTop = messageFeed.scrollHeight;
        messageInput.value = '';
        messageInput.style.height = 'auto';  // Reset to default height
        resizeTextarea();  // Resize based on new content (which should be empty now)
    } else if (!isPaired) {
        console.log("You must pair before sending a message.");
    } else {
        console.log("You cannot send an empty message.");
    };
};

socket.on('messageFromServer', (data) => {
    if ((data.sender !== myId) && (isPaired || inPrivateRoom)) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("incoming-message");
        messageElement.innerHTML = data.text.replace(/\n/g, '<br>');
        messageFeed.appendChild(messageElement);
        messageFeed.scrollTop = messageFeed.scrollHeight;
    };
});

function resizeTextarea() {
    messageInput.style.height = 'auto';  // Ensure it starts from the default height
    messageInput.style.height = messageInput.scrollHeight + 'px';
};

function handleSend(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    };
    resizeTextarea();
};

messageInput.addEventListener('input', resizeTextarea);
messageInput.addEventListener('keydown', handleSend);
sendButton.addEventListener('click', sendMessage);

function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};
function isFirefox() {
    return navigator.userAgent.indexOf("Firefox") > -1;
};
if (isSafari()) {
    document.body.classList.add('safari');
} else if (isFirefox()) {
    document.body.classList.add('firefox');
};

// Theme Setting
function setTheme() {
    const shouldUseLightTheme = localStorage.getItem('theme') === 'light' && window.innerWidth >= 680;
    document.body.classList.toggle('light-theme', shouldUseLightTheme);
};

themeSwitch.addEventListener('click', () => {
    const currentThemeIsLight = document.body.classList.contains('light-theme');
    const newTheme = currentThemeIsLight ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);

    setTheme();
});

window.addEventListener('DOMContentLoaded', setTheme);
window.addEventListener('resize', setTheme);


////////////////////////////////////////////////////////////////////////////////
// CAMERA FEED /////////////////////////////////////////////////////////////////

// Request both video and audio
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        outgoingCamFeed.srcObject = stream;  // This feeds the local video element
        outgoingCamFeed.play().catch(e => console.error('Playback failed.', e));
        localStream = stream; // Store the stream globally to be used later
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);  // Catch and log any errors with media access
    });

let peerConnection = null;
const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };

socket.on('initiateCall', () => {
    peerConnection = new RTCPeerConnection(configuration);

    // Check if the local stream is available and add each track to the peer connection
    if (localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    } else {
        console.error("Local stream not available.");
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate) {
            socket.emit('sendCandidate', { candidate, to: partnerId });
        }
    };

    // Set remote stream as the source for the incoming video element
    peerConnection.ontrack = event => {
        if (!incomingCamFeed.srcObject) {
            incomingCamFeed.srcObject = event.streams[0];
        }
        incomingCamFeed.play().catch(e => console.error('Error playing incoming stream.', e));
    };

    // Create and send an offer to the other peer
    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            socket.emit('sendOffer', { offer: peerConnection.localDescription, to: partnerId });
        });
});

socket.on('receiveOffer', (data) => {
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

    // Add local stream tracks to the peer connection
    if (localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate) {
            socket.emit('sendCandidate', { candidate, to: data.from });
        }
    };

    // Set remote stream as the source for the incoming video element
    peerConnection.ontrack = event => {
        if (!incomingCamFeed.srcObject) {
            incomingCamFeed.srcObject = event.streams[0];
        }
        incomingCamFeed.play().catch(e => console.error('Error playing incoming stream.', e));
    };

    // Create and send an answer back to the initiator
    peerConnection.createAnswer()
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => {
            socket.emit('sendAnswer', { answer: peerConnection.localDescription, to: data.from });
        });
});

socket.on('receiveAnswer', data => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
});

socket.on('receiveCandidate', data => {
    const candidate = new RTCIceCandidate(data.candidate);
    peerConnection.addIceCandidate(candidate);
});

function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (incomingCamFeed.srcObject) {
        incomingCamFeed.srcObject.getTracks().forEach(track => track.stop());
        incomingCamFeed.srcObject = null;
    }
}


////////////////////////////////////////////////////////////////////////////////
// ROOM AND REGION DROPDOWN AND SELECTION //////////////////////////////////////

let hoverTimer;

// Function to toggle active class and close others
const toggleDropdown = (triggerId, dropdownId) => {
    // Close other dropdowns first
    const allDropdowns = ['room-dropdown', 'region-dropdown'];
    const allTriggers = ['room-button', 'region-button'];

    allDropdowns.forEach(id => {
        if (id !== dropdownId) {
            document.getElementById(id).classList.remove('active');
        }
    });

    allTriggers.forEach(id => {
        if (id !== triggerId) {
            document.getElementById(id).classList.remove('active');
        }
    });

    // Toggle the current dropdown
    document.getElementById(triggerId).classList.toggle('active');
    document.getElementById(dropdownId).classList.toggle('active');
};

// Initial toggle event listeners
roomButton.addEventListener('click', () => toggleDropdown('room-button', 'room-dropdown'));
regionButton.addEventListener('click', () => toggleDropdown('region-button', 'region-dropdown'));

// Function to close dropdowns if click is outside
document.addEventListener('mousedown', (event) => {
    if (!event.target.closest('#room-button, #region-button, #room-dropdown, #region-dropdown')) {
        ['room-dropdown', 'region-dropdown'].forEach(dropdownId => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                roomButton.classList.remove('active');
                regionButton.classList.remove('active');
            }
        });
    }
});

// Hover functionality for both dropdowns
let hasEntered = { 'room-dropdown': false, 'region-dropdown': false };

function closeDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        roomButton.classList.remove('active');
        regionButton.classList.remove('active');
        const triggerId = dropdownId.split('-')[0];
        document.getElementById(triggerId + '-button').classList.remove('active');
    }
}

['room-dropdown', 'region-dropdown'].forEach(dropdownId => {
    const dropdown = document.getElementById(dropdownId);
    // Initialize the auto-close timer when the dropdown is activated
    document.getElementById(dropdownId.split('-')[0] + '-button').addEventListener('click', () => {
        clearTimeout(hoverTimer);
        hasEntered[dropdownId] = false; // Reset the flag
        hoverTimer = setTimeout(() => closeDropdown(dropdownId), 3000); // Auto-close after 2 seconds if not entered
    });
    dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer); // Clear auto-close timer if mouse enters
        hasEntered[dropdownId] = true; // Set the flag to true
    });
    dropdown.addEventListener('mouseleave', () => {
        if (hasEntered[dropdownId]) { // Only start the close timer if the mouse had entered the dropdown
            hoverTimer = setTimeout(() => closeDropdown(dropdownId), 2000); // Timeout after 1 second
        }
    });
});

function updateGlobalCheckbox() {
    // Check if any region checkbox is checked
    const isAnyRegionChecked = Array.from(regionCheckboxes).some(cb => cb.checked);
    // If no region checkbox is checked, check the Global checkbox
    globalCheckbox.checked = !isAnyRegionChecked;
}

globalCheckbox.addEventListener('change', function () {
    if (globalCheckbox.checked) {
        regionCheckboxes.forEach(cb => {
            cb.checked = false;
        });
    }
    updateGlobalCheckbox(); // Ensure consistency when Global is manually checked/unchecked
});

regionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            globalCheckbox.checked = false;
        }
        updateGlobalCheckbox(); // Call this function whenever any checkbox changes
    });
});

// Initial update in case there's a need to adjust the Global checkbox based on others
updateGlobalCheckbox();

//Messaging Button

messagingButton.addEventListener('click', () => {
    document.getElementById('message-feed-container').classList.toggle('hide');
    document.getElementById('message-input-container').classList.toggle('hide');
});