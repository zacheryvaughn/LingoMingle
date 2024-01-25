document.addEventListener("DOMContentLoaded", function() {
    // VIDEO FEED
    var video = document.getElementById('outgoing-video');

    // Check if navigator.mediaDevices.getUserMedia is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request webcam access
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        }).catch(function(error) {
            console.log("Something went wrong!", error);
        });
    }
    
    // WHITEBOARD
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let drawingActions = []; // Store drawing actions

    let canvasWidth = canvas.offsetWidth;
    let canvasHeight = canvas.offsetHeight;

    // Adjust canvas size to match CSS size with delay
    function resizeCanvas() {
        // Delay the resize to allow for CSS transitions to complete
        setTimeout(function() {
            const rect = canvas.getBoundingClientRect();
            canvasWidth = rect.width;
            canvasHeight = rect.height;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            redrawCanvas(); // Redraw everything on resize
        }, 200); // Delay of 200 milliseconds (adjust as needed)
    }

    // Initial call to set up the canvas size and event listener for window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let isDrawing = false;
    let color = 'black';
    let lineWidth = 3; // default brush size
    let eraserSize = 30; // larger eraser size

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', stopDrawing);

    const colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('input', function() {
        lineWidth = 3;
        color = this.value; // Update the current drawing color
    });

    document.getElementById('pen-tool').addEventListener('click', function() {
        lineWidth = 3; // Reset to default pen size
        color = colorPicker.value; // Set color to the current value of the color picker
    });

    document.getElementById('eraser').addEventListener('click', function() {
        color = 'white';
        lineWidth = eraserSize; // set larger size for eraser
    });

    document.getElementById('clear').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawingActions = []; // Clear the drawing actions
    });

    function startDrawing(e) {
        isDrawing = true;
        ctx.beginPath(); // Begin a new path
        addDrawingAction(e, 'start');
        performDrawing(e);
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!isDrawing) return;
        addDrawingAction(e, 'draw');
        performDrawing(e);
    }

    function performDrawing(e) {
        const x = (e.clientX - canvas.offsetLeft + window.scrollX) / canvasWidth;
        const y = (e.clientY - canvas.offsetTop + window.scrollY) / canvasHeight;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;

        ctx.lineTo(x * canvasWidth, y * canvasHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x * canvasWidth, y * canvasHeight);
    }

    function addDrawingAction(e, type) {
        const x = (e.clientX - canvas.offsetLeft + window.scrollX) / canvasWidth;
        const y = (e.clientY - canvas.offsetTop + window.scrollY) /
        canvasHeight;
        drawingActions.push({ x, y, type, color, lineWidth });
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawingActions.forEach(action => {
            ctx.lineWidth = action.lineWidth;
            ctx.strokeStyle = action.color;
            ctx.lineCap = 'round';
    
            const x = action.x * canvasWidth;
            const y = action.y * canvasHeight;
    
            if (action.type === 'start') {
                ctx.beginPath();
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        });
    }

});