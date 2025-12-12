class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    scale(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    magnitudeSquared() {
        return this.x * this.x + this.y * this.y;
    }
}