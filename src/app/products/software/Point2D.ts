
export class Point2D {
    constructor(public x: number = 0,
        public y: number = 0) { }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

export class Rectangle {
    constructor(public topLeft: Point2D, public bottomRight: Point2D) { }

    toString(): string {
        return `(${this.topLeft}, ${this.bottomRight})`;
    }
}