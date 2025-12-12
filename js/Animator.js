
class Animator {
    constructor(simulator, dt, ctx) {
        this.simulator = simulator;
        this.ctx = ctx;
        this.lastTime = 0;
        this.dt = dt || 0.1;
        this.speedMultiplier = 1;
        this.accumulatedTime = 0;
    }

    update() {
        this.simulator.step(this.dt);
    }
    drawAll() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let ball of this.simulator.balls) {
            ball.draw(this.ctx);
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