let balls = [];

width = canvas.width;
height = canvas.height;

balls.push(new Ball("Sun", new Vector(width / 2, height / 2), new Vector(0, 0), 30, 10000, false, '#FFFF00'));
balls.push(new Ball("Earth", new Vector(width / 2 + 150, height / 2), new Vector(0, 200), 10, 300, true, '#0000FF'));
balls.push(new Ball("Mars", new Vector(width / 2 + 450, height / 2), new Vector(0, 130), 8, 5, true, '#FF0000'));


const gravitySlider = document.getElementById('gravitySlider');
const gravityDisplay = document.getElementById('gravityValue');

gravitySimulator = new GravitySimulator(balls, parseFloat(gravitySlider.value));


gravitySlider.addEventListener('input', function() {
    const newG = parseFloat(gravitySlider.value);
    gravitySimulator.G = newG;
    gravityDisplay.textContent = newG.toFixed(2);
});


let animator = new Animator(gravitySimulator, 0.001, ctx);
animator.start();

const speedSlider = document.getElementById('simulationSpeedSlider');

function updateSpeedDisplay() {
    const speedValue = parseFloat(speedSlider.value);
    const speedDisplay = document.getElementById('simulationSpeedValue');
    animator.speedMultiplier = Math.exp( speedValue / 10 );
    speedDisplay.textContent = animator.speedMultiplier.toFixed(2);
}

speedSlider.addEventListener('input', updateSpeedDisplay);

window.toggleBallState = function(index) {
    const ball = balls[index];
    if (ball) {
        // 1. Flip the boolean
        ball.movable = !ball.movable;
        
        // 2. Optional: Stop the ball if you lock it so it doesn't drift
        if (!ball.movable) {
            ball.speed = new Vector(0, 0); 
        }
    }
};

window.updateBallMass = function(index, value) {
    // Parse the value
    const newMass = parseFloat(value);
    
    // Only update if it's a valid number
    // We allow it to be updated immediately so 'click away' never loses data
    if (!isNaN(newMass) && newMass > 0) {
        balls[index].mass = newMass;
    }
};

window.handleInputKey = function(event, inputElement) {
    // If the key pressed is "Enter" (Key Code 13)
    if (event.key === 'Enter') {
        inputElement.blur(); // Remove focus, which resumes the UI updates
    }
};

window.deleteBall = function(index) {
    // Remove 1 element at the specified index
    balls.splice(index, 1);
    
    // Note: Since the updateStatistics loop runs continuously, 
    // the UI will automatically refresh and re-index the remaining balls.
};

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

window.addPlanet = function() {
    // 1. Generate Random Color (HSL is better for bright colors than Hex)
    const hue = Math.floor(Math.random() * 360);
    const randomColor = getRandomColor();

    // 2. Position: Center of screen with slight random offset so they don't stack perfectly
    const startX = 400;
    const startY = 400;

    // 3. Create the Ball
    // Params: x, y, radius, mass, movable, color
    const newBall = new Ball(
        "Planet",
        new Vector( startX, startY ), // Position
        new Vector( startY / 10, -startX / 10 ), // Initial Speed
        10 + Math.random() * 10, // Radius between 10 and 20
        1, // Mass between 50 and 250
        false,
        randomColor,
    );
    
    // Give it a name for the UI
    newBall.name = balls.length + 1;

    // 4. Add to the array
    balls.push(newBall);
};

window.updateBallName = function(index, value) {
    // Update the name immediately as you type
    balls[index].name = value;
};

window.updateBallRadius = function(index, value) {
    const newRadius = parseFloat(value);
    
    // Ensure radius is positive to prevent visual glitches
    if (!isNaN(newRadius) && newRadius > 0) {
        balls[index].radius = newRadius;
    }
};

window.toggleField = function() {
    const button = document.getElementById('showFieldButton');
    
    console.log( button.textContent );
    if (button.textContent === 'OFF' ) {
        button.textContent = 'ON';
        button.style.backgroundColor = 'rgba(76, 175, 80, 1)'; // Green
    } else {
        button.textContent = 'OFF';
        button.style.backgroundColor = 'rgba(244, 67, 54, 1)'; // Red
    }
    console.log( button.textContent );
    animator.toggleFieldDisplay();
};

window.toggleSettings = function() {
    const menu = document.getElementById('settingsMenu');
    const btn = document.getElementById('toggleSettingsBtn');
    
    // Toggle the class
    menu.classList.toggle('collapsed');
    
    // Check if it is now collapsed to update the text
    if (menu.classList.contains('collapsed')) {
        btn.textContent = "⚙️ Settings"; // Text when closed
    } else {
        btn.textContent = "▼ Hide Controls"; // Text when open
    }
};

window.addEventListener('pointerdown', function(event) {
    // ⭐ THE FIX: Check if the thing we clicked is the CANVAS
    if (event.target === canvas) {
        
        // Only prevent default (stop scrolling/highlighting) on the canvas
        event.preventDefault(); 
        
        // Run your physics logic
        handleMouseDown(event);
    }
    
    // If we clicked a button, the 'if' is skipped, 
    // and the button works normally.
}, { passive: false });