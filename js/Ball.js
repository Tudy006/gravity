
class Ball {
    constructor(name, position, initialSpeed, radius, mass, movable, color) {
        this.name = name;
        this.position = position;
        this.speed = initialSpeed || new Vector(0, 0);
        this.mass = mass;
        this.movable = movable;
        this.radius = radius;
        this.color = color || '#0095DD';
        this.path = [position];
    }
    drawBall(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    drawPath(ctx) {
        const r = parseInt(this.color.slice(1, 3), 16);
        const g = parseInt(this.color.slice(3, 5), 16);
        const b = parseInt(this.color.slice(5, 7), 16);
        for (let i = 1; i < this.path.length; i++) {
            ctx.beginPath();
            const alpha = i / this.path.length;

            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.moveTo(this.path[i - 1].x, this.path[i - 1].y);
            ctx.lineTo(this.path[i].x, this.path[i].y);
            ctx.stroke();
        }
    }
    draw(ctx) {
        this.drawBall(ctx);
        this.drawPath(ctx);
    }
    update(force, dt) {
        if (this.movable) {
            let acceleration = force.scale(1 / this.mass);

            this.speed = this.speed.add(acceleration.scale(dt));

            this.position = this.position.add(this.speed.scale(dt));
        }
        this.path.push(new Vector(this.position.x, this.position.y));
        if (this.path.length > 4000) {
            this.path.shift();
        }   
    }
}
