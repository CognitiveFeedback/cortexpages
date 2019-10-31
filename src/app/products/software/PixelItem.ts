import { Point2D } from './Point2D';

export class PixelItem {
    constructor(public fromPoint: Point2D,
        public toPoint: Point2D,
        public dragFromPixel: Point2D,
        public dragToPixel: Point2D,
        public bitmap: ImageData) { }

    public sequenceGuid: string;
    public sequence: number;
    public createdDate: string;
    public png64: string;

    get image() {
        if (this.png64 === undefined) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = this.bitmap.width;
            canvas.height = this.bitmap.height;
            ctx.putImageData(this.bitmap, 0, 0);
            var image = new Image();
            image.src = canvas.toDataURL();
            return image;
        }
        else {
            var image = new Image();
            image.src = this.png64;
            return image;
        }
    }

    get minDelta(): number {
        return this.toPoint.x - this.fromPoint.x
    }

    toString(): string {
        return `${this.fromPoint},${this.toPoint},${this.dragFromPixel},${this.dragToPixel}`
    }
}