class GravitySimulator {
    constructor(balls, G) {
        this.balls = balls;
        this.G = G || 1;
    }

    computeEnergy() {
        let totalKinetic = 0;
        let totalPotential = 0;

        for (let i = 0; i < this.balls.length; i++) {
            // --- 1. Kinetic Energy (Individual) ---
            // Formula: 1/2 * m * v^2
            const vSquared = this.balls[i].speed.magnitudeSquared();
            totalKinetic += 0.5 * this.balls[i].mass * vSquared;

            // --- 2. Potential Energy (Pairwise Interaction) ---
            // We look at every other ball ahead in the list (j > i)
            // to avoid double counting or checking a ball against itself.
            for (let j = i + 1; j < this.balls.length; j++) {
                
                // Calculate distance between Ball i and Ball j
                const delta = this.balls[i].position.subtract(this.balls[j].position);
                const distance = delta.magnitude();

                // Prevent dividing by zero if they are touching
                if (distance > 0) {
                    // Formula: - (G * m1 * m2) / r
                    // Note: We ADD the negative value to the total
                    const potential = - (this.G * this.balls[i].mass * this.balls[j].mass) / distance;
                    totalPotential += potential;
                }
            }
        }

        return {
            kinetic: totalKinetic,
            potential: totalPotential,
            total: totalKinetic + totalPotential
        };
    }
    computeForces() {
        let forces = this.balls.map(() => new Vector(0, 0));

        for (let i = 0; i < this.balls.length; i++) {
            for (let j = 0; j < this.balls.length; j++) {
                if (i !== j) {
                    let dr = this.balls[j].position.subtract(this.balls[i].position);
                    let distanceSquared = dr.magnitudeSquared();
                    let forceMagnitude = (this.G * this.balls[i].mass * this.balls[j].mass) / distanceSquared;
                    let forceDirection = dr.scale(1 / Math.sqrt(distanceSquared));
                    let force = forceDirection.scale(forceMagnitude);
                    forces[i] = forces[i].add(force);
                }
            }
        }
        return forces;
    }
    computeFieldAtPoint( point ) {
        let field = new Vector(0, 0);
        for (let ball of this.balls) {
            let dr = ball.position.subtract( point );
            let distanceSquared = dr.magnitudeSquared();
            if (distanceSquared > 0) {
                let fieldMagnitude = (this.G * ball.mass) / distanceSquared;
                let fieldDirection = dr.scale(1 / Math.sqrt(distanceSquared));
                let fieldContribution = fieldDirection.scale(fieldMagnitude);
                field = field.add(fieldContribution);
            }
        }
        return field;
    }
    step( dt ) {
        let forces = this.computeForces();
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].update(forces[i], dt);
        }
        // for (let i = 0; i < this.balls.length; i++) {
        //     let radius = this.balls[i].radius;
        //     if (this.balls[i].position.x < radius || this.balls[i].position.x > canvas.width - radius) {
        //         this.balls[i].speed.x *= -1;
        //         this.balls[i].position.x = Math.max(radius, Math.min(this.balls[i].position.x, canvas.width - radius));
        //     }
        //     if (this.balls[i].position.y < radius || this.balls[i].position.y > canvas.height - radius) {
        //         this.balls[i].speed.y *= -1;
        //         this.balls[i].position.y = Math.max(radius, Math.min(this.balls[i].position.y, canvas.height - radius));
        //     }
        // }
    }
}