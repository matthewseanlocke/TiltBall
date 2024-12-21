// Select DOM Elements
const ball = document.getElementById('ball');
const permissionButton = document.getElementById('permissionButton');
const container = document.getElementById('container');
const tiltDataDisplay = document.getElementById('tiltData');

// On-screen Control Buttons
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Orientation Overlay
const orientationOverlay = document.getElementById('orientationOverlay');

// Ball Position and Boundaries
let ballPos = { x: container.clientWidth / 2, y: container.clientHeight / 2 };
const ballRadius = ball.offsetWidth / 2;

// Initialize Max and Min Positions
let maxX = container.clientWidth - ballRadius;
let maxY = container.clientHeight - ballRadius;
let minX = ballRadius;
let minY = ballRadius;

// Sensitivity Factors
const tiltSensitivity = 2;    // For device tilt
const controlSensitivity = 2; // For desktop controls

/**
 * Updates the ball's position on the screen.
 * @param {number} deltaX - Change in X position.
 * @param {number} deltaY - Change in Y position.
 */
function updateBallPosition(deltaX, deltaY) {
  // Update Position
  ballPos.x += deltaX * tiltSensitivity;
  ballPos.y += deltaY * tiltSensitivity;

  // Constrain Within Boundaries
  if (ballPos.x > maxX) ballPos.x = maxX;
  if (ballPos.x < minX) ballPos.x = minX;
  if (ballPos.y > maxY) ballPos.y = maxY;
  if (ballPos.y < minY) ballPos.y = minY;

  // Apply New Position
  ball.style.left = `${ballPos.x}px`;
  ball.style.top = `${ballPos.y}px`;
}

/**
 * Handles device orientation events.
 * @param {DeviceOrientationEvent} event
 */
function handleOrientation(event) {
  const gamma = event.gamma || 0; // Left to right tilt [-90,90]
  const beta = event.beta || 0;   // Front to back tilt [-180,180]

  // Log Tilt Data
  console.log(`Device Tilt - γ (gamma): ${gamma.toFixed(2)}°, β (beta): ${beta.toFixed(2)}°`);

  // Update Tilt Data Display
  tiltDataDisplay.textContent = `Tilt: γ=${gamma.toFixed(1)}°, β=${beta.toFixed(1)}°`;

  // Calculate Delta Positions Based on Tilt
  const deltaX = gamma / 5; // Adjust divisor for sensitivity
  const deltaY = beta / 5;

  updateBallPosition(deltaX, deltaY);
}

/**
 * Handles keyboard arrow key presses for desktop controls.
 * @param {KeyboardEvent} event
 */
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

  // Prevent Default Behavior (like Scrolling)
  event.preventDefault();

  // Log Control Data
  console.log(`Keyboard Control - Δx: ${deltaX}, Δy: ${deltaY}`);

  // Update Ball Position
  updateBallPosition(deltaX, deltaY);
}

/**
 * Handles on-screen button presses for desktop controls.
 * @param {number} deltaX - Change in X position.
 * @param {number} deltaY - Change in Y position.
 */
function handleButtonPress(deltaX, deltaY) {
  // Log Control Data
  console.log(`Button Control - Δx: ${deltaX}, Δy: ${deltaY}`);

  // Update Ball Position
  updateBallPosition(deltaX, deltaY);
}

/**
 * Requests permission to access device orientation on iOS 13+ devices.
 */
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
    // Non iOS 13+ Devices
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

/**
 * Initializes desktop controls (keyboard and on-screen buttons).
 */
function initControls() {
  // Keyboard Controls
  window.addEventListener('keydown', handleKeyDown);

  // On-screen Button Controls
  upBtn.addEventListener('click', () => handleButtonPress(0, -1));
  downBtn.addEventListener('click', () => handleButtonPress(0, 1));
  leftBtn.addEventListener('click', () => handleButtonPress(-1, 0));
  rightBtn.addEventListener('click', () => handleButtonPress(1, 0));
}

/**
 * Checks the device's current orientation and toggles the overlay accordingly.
 */
function checkOrientation() {
  if (window.innerHeight > window.innerWidth) {
    // Portrait Mode
    orientationOverlay.classList.remove('visible');
  } else {
    // Landscape Mode
    orientationOverlay.classList.add('visible');
  }
}

/**
 * Handles updating boundary values and resetting ball position on window resize.
 */
function handleResize() {
  // Update Max and Min Positions Based on New Size
  maxX = container.clientWidth - ballRadius;
  maxY = container.clientHeight - ballRadius;
  minX = ballRadius;
  minY = ballRadius;

  // Optionally, Reset Ball to Center
  ballPos.x = container.clientWidth / 2;
  ballPos.y = container.clientHeight / 2;
  ball.style.left = `${ballPos.x}px`;
  ball.style.top = `${ballPos.y}px`;
}

// Event Listeners

// Show Permission Button on iOS Devices
if (
  typeof DeviceMotionEvent.requestPermission === 'function' ||
  typeof DeviceOrientationEvent.requestPermission === 'function'
) {
  permissionButton.style.display = 'block';
  permissionButton.addEventListener('click', requestPermission);
} else {
  // Non iOS 13+ Devices
  window.addEventListener('deviceorientation', handleOrientation);
}

// Initialize Desktop Controls
initControls();

// Initial Orientation Check
checkOrientation();

// Listen for Orientation Changes
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// Listen for Window Resize to Adjust Boundaries
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);
