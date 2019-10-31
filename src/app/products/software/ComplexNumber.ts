import { Point2D } from './Point2D';

export class ComplexNumber {
    square(p: Point2D): Point2D {
        let result = this.multiply(p, p);
        return result;
    }

    multiply(p: Point2D, q: Point2D): Point2D {
        let x = p.x * q.x - p.y * q.y;
        let y = p.x * q.y + p.y * q.x;
        let result = new Point2D(x, y);
        return result;
    }

    add(p: Point2D, q: Point2D): Point2D {
        let result = new Point2D(p.x + q.x, p.y + q.y);
        return result;
    }

    absoluteValue(p: Point2D): number {
        let result = 0;
        result = Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
        return result;
    }
}