// Get references to the canvas and controls
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pencilButton = document.getElementById('pencil');
const eraserButton = document.getElementById('eraser');
const colorPicker = document.getElementById('colorPicker');
const lineThickness = document.getElementById('lineThickness');
const saveBtn = document.getElementById('save');
const exportBtn = document.getElementById('export');
const voiceNoteBtn = document.getElementById('voiceNote');

// Set the canvas size
canvas.width = window.innerWidth - 40;
canvas.height = 400; // Fixed height for the canvas

// Default tool properties
let isDrawing = false;
let currentTool = 'pencil'; // Default tool is pencil
let currentColor = '#000000'; // Default color is black
let currentLineWidth = 5; // Default line thickness

// Set initial drawing properties
ctx.lineWidth = currentLineWidth;
ctx.lineCap = 'round';
ctx.strokeStyle = currentColor; // Default stroke color is black

// Function to handle the start of drawing (mouse or touch)
function startDrawing(e) {
    if (currentTool === 'pencil' || currentTool === 'eraser') {
        isDrawing = true;
        ctx.beginPath();
        // Handle both mouse and touch events (calculate correct position)
        const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const y = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
        ctx.moveTo(x - canvas.offsetLeft, y - canvas.offsetTop);
    }
}

// Function to handle drawing (mouse or touch)
function draw(e) {
    if (isDrawing && (currentTool === 'pencil' || currentTool === 'eraser')) {
        // Handle both mouse and touch events (calculate correct position)
        const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const y = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
        ctx.lineTo(x - canvas.offsetLeft, y - canvas.offsetTop);
        ctx.stroke();
    }
}

// Function to stop drawing (mouse or touch)
function stopDrawing() {
    isDrawing = false;
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Handle pencil tool click
pencilButton.addEventListener('click', () => {
    currentTool = 'pencil';
    canvas.style.cursor = 'url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/pencil-alt.svg), auto';
    ctx.strokeStyle = currentColor; // Ensure pencil uses selected color
    ctx.lineWidth = currentLineWidth; // Ensure pencil uses selected thickness
});

// Handle eraser tool click
eraserButton.addEventListener('click', () => {
    currentTool = 'eraser';
    canvas.style.cursor = 'crosshair'; // Set crosshair cursor for eraser
    ctx.strokeStyle = '#ffffff'; // Set eraser color to white
    ctx.lineWidth = 20; // Set the line width for eraser (larger for eraser)
});

// Handle color picker change
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    if (currentTool === 'pencil') {
        ctx.strokeStyle = currentColor; // Apply selected color to pencil
    } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff'; // Ensure eraser is white
    }
});

// Handle line thickness change
lineThickness.addEventListener('input', (e) => {
    currentLineWidth = e.target.value;
    if (currentTool === 'pencil') {
        ctx.lineWidth = currentLineWidth; // Apply selected thickness to pencil
    } else if (currentTool === 'eraser') {
        ctx.lineWidth = 80; // Set a larger size for the eraser (no effect on pencil)
    }
});

// Save drawing as image
saveBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'drawing.png';
    link.click();
});

// Export drawing as PDF
exportBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.addImage(canvas.toDataURL(), 'PNG', 10, 10, 180, 160);
    doc.save('drawing.pdf');
});

// Voice note functionality (unchanged)
const voiceNoteButton = document.getElementById('voiceNote');
const textArea = document.createElement('textarea');
document.body.appendChild(textArea);

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = true;

let isRecording = false;

function toggleVoiceRecognition() {
    if (isRecording) {
        recognition.stop();
        isRecording = false;
        voiceNoteButton.textContent = 'Start Voice Note';
    } else {
        recognition.start();
        isRecording = true;
        voiceNoteButton.textContent = 'Stop Voice Note';
    }
}

recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    if (event.results[event.results.length - 1].isFinal) {
        textArea.value += transcript + ' ';
    }
};

recognition.onend = () => {
    if (isRecording) {
        recognition.start();
    }
};

recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
};

voiceNoteButton.addEventListener('click', toggleVoiceRecognition);

// Adjust canvas size on window resize (including mobile devices)
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 40;  // Keep canvas width responsive
    canvas.height = 400; // Fixed height (or adjust as needed)
});
