import { Point2D } from './Point2D';
import { ComplexNumber } from './ComplexNumber';

export class MandelbrotPixels {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    escapeRadius: number = 2;
    maxIterations: number = 200;
    ops = new ComplexNumber();
    constructor(private imageData: ImageData) { }

    setup(from: Point2D, to: Point2D) {
        this.minX = from.x;
        this.maxX = to.x;
        this.minY = from.y;
        this.maxY = to.y;

        let delta = this.maxX - this.minX;
        this.maxIterations = this.setMaxIterations(delta);
    }

    render(from: Point2D, to: Point2D): ImageData {
        this.minX = from.x;
        this.maxX = to.x;
        this.minY = from.y;
        this.maxY = to.y;

        let delta = this.maxX - this.minX;
        this.maxIterations = this.setMaxIterations(delta);

        for (let i = 0; i < this.imageData.width; i++) {
            for (let j = 0; j < this.imageData.height; j++) {
                let pixel = new Point2D(i, j);
                let point = this.getPointFromPixel(pixel);
                let color = this.getColor(point);
                this.setPixel(pixel, color);
            }
        }
        return this.imageData;
    }

    private setMaxIterations(delta: number): number {
        if (delta < 1) {
            this.maxIterations = 500;
        }
        if (delta < .1) {
            this.maxIterations = 1000;
        }
        if (delta < .01) {
            this.maxIterations = 2500;
        }
        if (delta < .001) {
            this.maxIterations = 5000;
        }
        if (delta < .0001) {
            this.maxIterations = 10000;
        }
        if (delta < .00001) {
            this.maxIterations = 20000;
        }
        return this.maxIterations;
    }

    getColor(point: Point2D): Array<number> {
        let color = [255, 255, 255];
        let value = point;
        for (let i = 0; i < this.maxIterations; i++) {
            value = this.ops.add(this.ops.square(value), point);
            let rnd = this.ops.absoluteValue(value);
            if (rnd > this.escapeRadius) {
                color = this.generateColor(i, this.maxIterations);
                break;
            }
        }
        return color;
    }

    setPixel(pixel: Point2D, color: Array<number>): void {
        this.imageData.data[((pixel.y * (this.imageData.width * 4)) + (pixel.x * 4)) + 0] = color[0];
        this.imageData.data[((pixel.y * (this.imageData.width * 4)) + (pixel.x * 4)) + 1] = color[1];
        this.imageData.data[((pixel.y * (this.imageData.width * 4)) + (pixel.x * 4)) + 2] = color[2];
        this.imageData.data[((pixel.y * (this.imageData.width * 4)) + (pixel.x * 4)) + 3] = 255;
    }

    getPointFromPixel(pixel: Point2D): Point2D {
        let x2 = (this.maxX - this.minX) / this.imageData.width * pixel.x + this.minX;
        let y2 = (this.maxY - this.minY) / this.imageData.height * pixel.y + this.minY;
        let result = new Point2D(x2, y2);
        return result;
    }

    getPixelFromPoint(pixel: Point2D): Point2D {
        let x2 = (this.maxX - this.minX) / this.imageData.width * pixel.x + this.minX;
        let y2 = -(this.maxY - this.minY) / this.imageData.height * pixel.y - this.minY;
        let result = new Point2D(x2, y2);
        return result;
    }

    generateColor(i: number, maxScaled: number): Array<number> {
        let scaled = Math.floor(i * 255 / maxScaled);
        let result = [scaled, scaled, scaled];
        return result;
    }
}


