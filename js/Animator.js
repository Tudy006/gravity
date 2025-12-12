
class Animator {
    constructor(simulator, dt, ctx) {
        this.simulator = simulator;
        this.ctx = ctx;
        this.lastTime = 0;
        this.dt = dt || 0.1;
        this.speedMultiplier = 1;
        this.accumulatedTime = 0;
        this.showField = true;
    }

    update() {
        this.simulator.step(this.dt);
    }
    drawAll() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let ball of this.simulator.balls) {
            ball.draw(this.ctx);
        }
        this.drawField();
    }
    toggleFieldDisplay() {
        this.showField = !this.showField;
    }
    drawField() {
        if (!this.showField) return;
        const spacing = 40; // Distance between field lines
        for (let x = 0; x < canvas.width; x += spacing) {
            for (let y = 0; y < canvas.height; y += spacing) {
                const point = new Vector(x, y);
                const fieldDirection = this.simulator.computeFieldAtPoint(point);
                const fieldMagnitude = fieldDirection.magnitude();
                if (fieldMagnitude > 0) {
                    // create strokestyle transparancy based on magnitude
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.5, fieldMagnitude / 500)})`;
                    const normalized = fieldDirection.scale(1 / fieldMagnitude);
                    const lineLength = Math.min(10, fieldMagnitude);
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x + normalized.x * lineLength, y + normalized.y * lineLength);
                    this.ctx.stroke();
                    // Draw arrowhead
                    const arrowSize = 6;
                    const angle = Math.atan2(normalized.y, normalized.x);
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + normalized.x * lineLength, y + normalized.y * lineLength);
                    this.ctx.lineTo(
                        x + normalized.x * lineLength - arrowSize * Math.cos(angle - Math.PI / 6),
                        y + normalized.y * lineLength - arrowSize * Math.sin(angle - Math.PI / 6)
                    );
                    this.ctx.lineTo(
                        x + normalized.x * lineLength - arrowSize * Math.cos(angle + Math.PI / 6),
                        y + normalized.y * lineLength - arrowSize * Math.sin(angle + Math.PI / 6)
                    );
                    this.ctx.closePath();
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.5, fieldMagnitude / 100)})`;
                    this.ctx.fill();
                }

            }
        }
    }
    start() {
        requestAnimationFrame(this.animate.bind(this));
    }
    animate(currentTime) {
        requestAnimationFrame(this.animate.bind(this));
        updateStatistics();
        const deltaTime = (currentTime - this.lastTime);
        this.lastTime = currentTime;

        this.accumulatedTime += deltaTime;
        
        while (this.accumulatedTime >= (this.dt * 10000) / this.speedMultiplier) {
            this.update();
            this.accumulatedTime -= (this.dt * 10000) / this.speedMultiplier;
        }
        updateEnergyDisplay( this.simulator.computeEnergy() );
        this.drawAll();
    }
}