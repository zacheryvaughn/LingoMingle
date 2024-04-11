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

const reportButton = document.getElementById('report-button');


// Assign State Variables
let isWaiting = false;
let isPaired = false;
let inPrivateRoom = false;
// Me and you
let myId = null;
let partnerId = null;

// ONLINE : "https://lingomingle-service-mrslpylp7a-uw.a.run.app"
// OFFLINE : "http://localhost:3000"
let socket = io("http://localhost:3000");
socket.on('yourId', (id) => {
    myId = id;
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
    pairButton.style.width = '40%';
    // Show the skipButton
    skipButton.style.display = 'flex';
    // Clear messageFeed
    messageFeed.innerHTML = '';
    // Log to Console
    console.log('Unpaired.');
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
    pairButton.style.width = 'calc(80% + 14px)';
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
    pairButton.style.width = 'calc(80% + 14px)';
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
    }

    // Then, after a short delay to allow the server to process the state clearing, perform the requested action.
    setTimeout(() => {
        if (actionType === 'create') {
            socket.emit('createPrivateRoom', roomId);
        } else if (actionType === 'join') {
            socket.emit('joinPrivateRoom', roomId);
        }
    }, 500); // Adjust delay as needed based on server response times.
}

createButton.addEventListener('click', () => {
    const roomId = roomIdInput.value.trim();
    if (roomId.length > 6) {
        handleRoomTransition('create', roomId);
    } else {
        console.log('Room ID must be longer than 6 characters.');
    }
});

joinButton.addEventListener('click', () => {
    const roomId = roomIdInput.value.trim();
    if (roomId.length > 6) {
        handleRoomTransition('join', roomId);
    } else {
        console.log('Room ID must be longer than 6 characters.');
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
        messageInput.style.height = '';
    } else if (!isPaired) {
        console.log("You must pair before sending a message.");
    } else {
        console.log("You cannot send an empty message.");
    }
};

socket.on('messageFromServer', (data) => {
    if ((data.sender !== myId) && (isPaired || inPrivateRoom)) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("incoming-message");
        messageElement.innerHTML = data.text.replace(/\n/g, '<br>');
        messageFeed.appendChild(messageElement);
        messageFeed.scrollTop = messageFeed.scrollHeight;
    }
});

function resizeTextarea() {
    messageInput.style.height = '';
    messageInput.style.height = messageInput.scrollHeight + 'px';
}

function handleSend(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
    resizeTextarea();
}

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
}

sideSwitch.addEventListener('click', function () {
    const mainLeft = document.getElementById('main-left');
    const mainRight = document.getElementById('main-right');

    if (!mainLeft.classList.contains('hide') && !mainRight.classList.contains('hide')) {
        mainRight.classList.add('hide');
        sideSwitch.classList.add('hide-right');
        localStorage.setItem('side', 'left'); // Save side setting as 'left'
    } else if (mainRight.classList.contains('hide')) {
        mainLeft.classList.add('hide');
        mainRight.classList.remove('hide');
        sideSwitch.classList.remove('hide-right');
        sideSwitch.classList.add('hide-left');
        localStorage.setItem('side', 'right'); // Save side setting as 'right'
    } else {
        mainLeft.classList.remove('hide');
        sideSwitch.classList.remove('hide-left');
        localStorage.setItem('side', 'both'); // Save side setting as 'both'
    }
});


themeSwitch.addEventListener('click', () => {
    const isLightTheme = document.body.classList.toggle('light-theme');
    if (isLightTheme) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }

    // Apply the saved side setting
    const savedSide = localStorage.getItem('side');
    const mainLeft = document.getElementById('main-left');
    const mainRight = document.getElementById('main-right');
    if (savedSide === 'left') {
        mainRight.classList.add('hide');
        sideSwitch.classList.add('hide-right');
    } else if (savedSide === 'right') {
        mainLeft.classList.add('hide');
        sideSwitch.classList.add('hide-left');
    } // No need to handle 'both' as it's the default state
});

////////////////////////////////////////////////////////////////////////////////
// CAMERA FEED /////////////////////////////////////////////////////////////////

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        outgoingCamFeed.srcObject = stream;
        outgoingCamFeed.play().catch(e => console.error('Playback failed.', e));
        localStream = stream; // Assign the stream to localStream for further use
    })
    .catch(error => {
        console.error('Error accessing the camera.', error);
    });

let peerConnection = null;
const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };

socket.on('initiateCall', () => {
    peerConnection = new RTCPeerConnection(configuration);

    // Check if localStream is available to add tracks
    if (localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    } else {
        console.error("Local stream not available.");
    }

    peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate) {
            socket.emit('sendCandidate', { candidate, to: partnerId });
        }
    };

    peerConnection.ontrack = event => {
        incomingCamFeed.srcObject = event.streams[0];
        incomingCamFeed.play().catch(e => console.error('Error playing incoming stream.', e));
    };

    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            socket.emit('sendOffer', { offer: peerConnection.localDescription, to: partnerId });
        });
});

socket.on('receiveOffer', (data) => {
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

    if (localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    }

    peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate) {
            socket.emit('sendCandidate', { candidate, to: data.from });
        }
    };

    peerConnection.ontrack = event => {
        incomingCamFeed.srcObject = event.streams[0];
        incomingCamFeed.play().catch(e => console.error('Error playing incoming stream.', e));
    };

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
