// Select elements
const ball = document.getElementById('ball');
const permissionButton = document.getElementById('permissionButton');
const container = document.getElementById('container');
const tiltDataDisplay = document.getElementById('tiltData');

// On-screen control buttons
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Ball properties
let ballPos = { x: container.clientWidth / 2, y: container.clientHeight / 2 };
const ballRadius = ball.offsetWidth / 2;

// Initialize max and min positions
let maxX = container.clientWidth - ballRadius;
let maxY = container.clientHeight - ballRadius;
let minX = ballRadius;
let minY = ballRadius;

// Sensitivity factor
const sensitivity = 2; // Increased for desktop controls

// Update ball position
function updateBallPosition(deltaX, deltaY) {
  // Update position
  ballPos.x += deltaX * sensitivity;
  ballPos.y += deltaY * sensitivity;

  // Constrain the ball within the container
  if (ballPos.x > maxX) ballPos.x = maxX;
  if (ballPos.x < minX) ballPos.x = minX;
  if (ballPos.y > maxY) ballPos.y = maxY;
  if (ballPos.y < minY) ballPos.y = minY;

  // Apply the new position
  ball.style.left = `${ballPos.x}px`;
  ball.style.top = `${ballPos.y}px`;
}

// Handle device orientation
function handleOrientation(event) {
  const gamma = event.gamma || 0; // Left to right tilt [-90,90]
  const beta = event.beta || 0;   // Front to back tilt [-180,180]

  // Log to console
  console.log(`Device Tilt - γ (gamma): ${gamma.toFixed(2)}°, β (beta): ${beta.toFixed(2)}°`);

  // Update tilt data display
  tiltDataDisplay.textContent = `Tilt: γ=${gamma.toFixed(1)}°, β=${beta.toFixed(1)}°`;

  // Update ball position based on tilt
  // Adjust the sensitivity for better control
  const deltaX = gamma / 5; // Dividing to reduce movement
  const deltaY = beta / 5;
  updateBallPosition(deltaX, deltaY);
}

// Keyboard controls for desktop
function handleKeyDown(event) {
  let deltaX = 0;
  let deltaY = 0;

  switch(event.key) {
    case 'ArrowUp':
      deltaY = -1;
      break;
    case 'ArrowDown':
      deltaY = 1;
      break;
    case 'ArrowLeft':
      deltaX = -1;
      break;
    case 'ArrowRight':
      deltaX = 1;
      break;
    default:
      return; // Ignore other keys
  }

  // Prevent default arrow key behavior (like scrolling)
  event.preventDefault();

  // Log to console
  console.log(`Keyboard Control - Δx: ${deltaX}, Δy: ${deltaY}`);

  // Update ball position
  updateBallPosition(deltaX, deltaY);
}

// On-screen button controls
function handleButtonPress(deltaX, deltaY) {
  // Log to console
  console.log(`Button Control - Δx: ${deltaX}, Δy: ${deltaY}`);

  // Update ball position
  updateBallPosition(deltaX, deltaY);
}

// Request permission for iOS 13+ devices
function requestPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          permissionButton.style.display = 'none';
        } else {
          alert('Permission denied to access device orientation.');
        }
      })
      .catch(console.error);
  } else {
    // Non iOS 13+ devices
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

// Initialize controls
function initControls() {
  // Keyboard controls
  window.addEventListener('keydown', handleKeyDown);

  // On-screen button controls
  upBtn.addEventListener('click', () => handleButtonPress(0, -1));
  downBtn.addEventListener('click', () => handleButtonPress(0, 1));
  leftBtn.addEventListener('click', () => handleButtonPress(-1, 0));
  rightBtn.addEventListener('click', () => handleButtonPress(1, 0));
}

// Check for iOS devices and show permission button if necessary
if (
  typeof DeviceMotionEvent.requestPermission === 'function' ||
  typeof DeviceOrientationEvent.requestPermission === 'function'
) {
  permissionButton.style.display = 'block';
  permissionButton.addEventListener('click', requestPermission);
} else {
  // Non iOS 13+ devices
  window.addEventListener('deviceorientation', handleOrientation);
}

// Initialize desktop controls
initControls();

// Update container dimensions on resize
window.addEventListener('resize', () => {
  // Update max and min positions based on new size
  maxX = container.clientWidth - ballRadius;
  maxY = container.clientHeight - ballRadius;
  minX = ballRadius;
  minY = ballRadius;

  // Optionally, reset the ball to center
  ballPos.x = container.clientWidth / 2;
  ballPos.y = container.clientHeight / 2;
  ball.style.left = `${ballPos.x}px`;
  ball.style.top = `${ballPos.y}px`;
});
