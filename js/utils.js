const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');


if (!canvas) {
    console.error("Canvas element not found!");
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas)

function handleMouseDown(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const mousePos = new Vector(clickX, clickY);

    for (let ball of balls) {
        if (ball.position.subtract(mousePos).magnitude() < ball.radius) {
            
            let wasMovable = ball.movable;
            ball.movable = false; // Disable physics while holding
            ball.speed = new Vector(0, 0); // Kill existing momentum

            // --- THROWING LOGIC VARIABLES ---
            let lastPos = new Vector(clickX, clickY);
            let lastTime = performance.now(); // High-precision timer
            let throwVelocity = new Vector(0, 0); // This accumulates the smooth speed

            function handleMouseMove(event) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const currentPos = new Vector(x, y);
                const currentTime = performance.now();

                // 1. Calculate time passed (in seconds)
                // We limit it to a minimum of 1ms to avoid dividing by zero
                const dt = Math.max((currentTime - lastTime) / 1000, 0.001);

                // 2. Calculate Raw Velocity (Distance / Time) = Pixels per Second
                // current - last
                const deltaMove = currentPos.subtract(lastPos);
                // raw velocity vector
                const rawVelocity = deltaMove.scale(1 / dt);

                // 3. Apply Low-Pass Filter (Weighted Average)
                // We blend 80% of the OLD velocity with 20% of the NEW velocity.
                // This creates "inertia" in the mouse movement.
                // Formula: smooth = (smooth * 0.8) + (raw * 0.2)
                throwVelocity = throwVelocity.scale(0.8).add(rawVelocity.scale(0.2));

                // 4. Update Ball Position
                ball.position = currentPos;

                // 5. Update history for next frame
                lastPos = currentPos;
                lastTime = currentTime;
            }

            function handleMouseUp(event) {
                ball.movable = wasMovable;

                if ( performance.now() - lastTime > 100 ) {
                    throwVelocity = new Vector(0, 0);
                }
                ball.speed = throwVelocity.scale(2);

                window.removeEventListener('pointermove', handleMouseMove);
                window.removeEventListener('pointerup', handleMouseUp);
            }

            window.addEventListener('pointermove', handleMouseMove);
            window.addEventListener('pointerup', handleMouseUp);
            return;
        }
    }
}
window.addEventListener('pointerdown', handleMouseDown);

function updateStatistics() {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        return; 
    }
    const ballStatsList = document.getElementById('ballsList');
    // 1. Clear the previous content
    if ( !ballStatsList ) return;

    ballStatsList.innerHTML = '';
    
    // 2. Iterate through every ball in your global 'balls' array
    balls.forEach((ball, index) => {
        // Calculate required statistics
        const currentSpeed = ball.speed.magnitude().toFixed(2); // Requires the magnitude() method from Vector

        const statHTML = `
            <div class="ball-card" style="border-left: 5px solid ${ball.color};">
                <div class="card-header">
                    <input 
                        type="text" 
                        class="name-input"
                        value="${ball.name}" 
                        oninput="updateBallName(${index}, this.value)"
                        onkeydown="handleInputKey(event, this)"
                    >
                    
                    <div class="card-actions">
                        <button 
                            onmousedown="toggleBallState(${index})" 
                            class="status-badge ${ball.movable ? 'free' : 'locked'}"
                        >
                            ${ball.movable ? 'Free' : 'Locked'}
                        </button>

                        <button 
                            onmousedown="deleteBall(${index})" 
                            class="btn-delete"
                            title="Delete Ball"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                
                <div class="stat-row">
                    <span class="label">Speed</span>
                    <span class="value">${currentSpeed}</span>
                </div>

                <div class="stat-row">
                    <span class="label">Mass</span>
                    <input 
                        type="number" 
                        class="mass-input"
                        value="${ball.mass}" 
                        step="10" 
                        oninput="updateBallMass(${index}, this.value)"
                        onkeydown="handleInputKey(event, this)"
                    >
                </div>

                <div class="stat-row">
                    <span class="label">Radius</span>
                    <input 
                        type="number" 
                        class="mass-input" 
                        value="${ball.radius}" 
                        step="1" 
                        min="1"
                        oninput="updateBallRadius(${index}, this.value)"
                        onkeydown="handleInputKey(event, this)"
                    >
                </div>

                <div class="stat-row">
                    <span class="label">Pos</span>
                    <span class="value">
                        ${ball.position.x.toFixed(0)}, ${ball.position.y.toFixed(0)}
                    </span>
                </div>
            </div>
        `;
        
        // Append the new HTML content
        ballStatsList.innerHTML += statHTML;
    });
}

const energyDisplay = document.getElementById('energyValue');

function updateEnergyDisplay(energyStats) {
    if (energyDisplay) {// Example for updateStatistics()
        energyDisplay.innerHTML = `
            <strong>TOTAL ENERGY</strong><br>
            K: ${energyStats.kinetic.toFixed(0)}<br>
            P: ${energyStats.potential.toFixed(0)}<br>
            <span style="color: #fff">E: ${energyStats.total.toFixed(0)}</span>
        `;
    }
}