import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MandelbrotPixels } from './MandelbrotPixels';
import { Point2D } from './Point2D';
import { DataService } from 'src/app/services/data-service.service';
import { PixelCatalog } from './PixelCatalog';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {
  private fromPoint: Point2D;
  private toPoint: Point2D;
  private dragFromPixel: Point2D;
  private dragToPixel: Point2D;
  private bitmap: ImageData;
  private pixelItems: PixelItem[] = [];
  private offset: Point2D = new Point2D();
  private stretch: Point2D = new Point2D(1, 1);
  private isMouseDown: boolean = false;
  private animFrames: number = 48;
  private dragAnimHandle: number;
  private animationHandle: number;
  private sequenceGuid: string;
  private worker = new Worker('./software.worker', { type: 'module' });
  private imageData: ImageData;
  private pixels: MandelbrotPixels;
  private pixelCatalog: PixelCatalog[];
  private placeholder: string;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  constructor(private dataService: DataService) { }

  get offsetX() { return this.offset.x; }
  set offsetX(value: number) { this.offset.x = value; }
  get offsetY() { return this.offset.y; }
  set offsetY(value: number) { this.offset.y = value; }
  get stretchX() { return this.stretch.x; }
  set stretchX(value: number) { this.stretch.x = value; }
  get stretchY() { return this.stretch.y; }
  set stretchY(value: number) { this.stretch.y = value; }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.imageData = this.ctx.createImageData(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.pixels = new MandelbrotPixels(this.imageData);
    this.dataService.GetCatalog().subscribe((data: Array<string>) => {
      this.pixelCatalog = data.map(a => { let result = new PixelCatalog(); result.guid = a; return result; });
      for (let i = 0; i < this.pixelCatalog.length; i++) {
        this.dataService.loadByGuid(this.pixelCatalog[i].guid).subscribe((data: PixelItem[]) => {
          this.pixelCatalog[i].pixelItems = data;
        });
      }
    });
    this.worker.onmessage = ({ data: response }) => {
      this.imageData = response.data;
      switch (response.message) {
        case "reset":
          this.ctx.putImageData(this.imageData, 0, 0);
          this.pushPixelItem();
          this.placeholder = this.bitmapToImage(this.imageData).src;
          break;
        case "zoom":
          this.imageData = response.data;
          let zoomWait = window.setInterval(() => {
            if (this.animationHandle == 0) {
              this.ctx.putImageData(this.imageData, 0, 0);
              this.pushPixelItem();
              window.clearInterval(zoomWait);
            }
          }, 30);
          break;
        default:
          break;
      }
    };
    this.reset();
  }

  pushPixelItem() {
    this.bitmap = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    let item = new PixelItem(this.fromPoint, this.toPoint, new Point2D(), new Point2D(), this.bitmap);
    if (this.pixelItems.length > 0) {
      this.pixelItems[this.pixelItems.length - 1].dragFromPixel = this.dragFromPixel;
      this.pixelItems[this.pixelItems.length - 1].dragToPixel = this.dragToPixel;
    }
    this.pixelItems.push(item);
    item.sequenceGuid = this.sequenceGuid;
    item.sequence = this.pixelItems.length;
  }

  reset() {
    if (this.animationHandle) { window.clearInterval(this.animationHandle); }
    if (this.dragAnimHandle) { window.clearInterval(this.dragAnimHandle); }
    this.sequenceGuid = this.uuidv4();
    this.fromPoint = new Point2D(-2, -1);
    this.toPoint = new Point2D(.5, 1);
    this.dragFromPixel = new Point2D();
    this.dragToPixel = new Point2D(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.pixelItems = [];
    this.worker.postMessage({ fromPoint: this.fromPoint, toPoint: this.toPoint, imageData: this.imageData, pixels: this.pixels, message: "reset" });
  }

  render(i: number) {
    let image = this.bitmapToImage(this.pixelItems[i].bitmap);
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ctx.drawImage(image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  redraw(frame: PixelItem) {
    this.ctx.drawImage(frame.image, this.offsetX, this.offsetY, this.canvas.nativeElement.width * this.stretchX, this.canvas.nativeElement.height * this.stretchY);
  }

  onMouseDown(event: MouseEvent) {
    if (this.isMouseDown) {
      return;
    }
    this.isMouseDown = true;
    let fromX = Math.round(event.clientX - this.canvas.nativeElement.getBoundingClientRect().left);
    let fromY = Math.round(event.clientY - this.canvas.nativeElement.getBoundingClientRect().top);
    this.dragFromPixel = new Point2D(fromX, fromY);
    this.bitmap = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  onMouseUp(event: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }
    this.isMouseDown = false;
    this.pixels.setup(this.fromPoint, this.toPoint);
    this.fromPoint = this.pixels.getPointFromPixel(this.dragFromPixel);
    this.toPoint = this.pixels.getPointFromPixel(new Point2D(this.dragToPixel.x + this.dragFromPixel.x, this.dragToPixel.y + this.dragFromPixel.y));

    this.fromPoint.x = this.fromPoint.x < this.toPoint.x ? this.fromPoint.x : this.toPoint.x;
    this.toPoint.x = this.toPoint.x > this.fromPoint.x ? this.toPoint.x : this.fromPoint.x;
    this.fromPoint.y = this.fromPoint.y < this.toPoint.y ? this.fromPoint.y : this.toPoint.y;
    this.toPoint.y = this.toPoint.y > this.fromPoint.y ? this.toPoint.y : this.fromPoint.y;

    this.worker.postMessage({ fromPoint: this.fromPoint, toPoint: this.toPoint, imageData: this.imageData, message: "zoom" });

    let i = 0;
    this.dragAnimHandle = window.setInterval(() => {
      if (i == this.animFrames + 1) {
        window.clearInterval(this.dragAnimHandle);
        this.dragAnimHandle = 0;
        this.ctx.putImageData(this.imageData, 0, 0);
        this.pushPixelItem();
        return;
      }
      this.drawAnimationFrame(i, this.pixelItems[this.pixelItems.length - 1]);
      i++;
    }, 30);
  }

  mousemove(event) {
    if (!this.isMouseDown) {
      return;
    }

    this.ctx.putImageData(this.bitmap, 0, 0, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ctx.strokeStyle = 'red';
    this.ctx.fillStyle = 'rgb(128,0,0,.5)';
    let toX = Math.round(event.clientX - this.canvas.nativeElement.getBoundingClientRect().left - this.dragFromPixel.x);
    let toY = Math.round(event.clientY - this.canvas.nativeElement.getBoundingClientRect().top - this.dragFromPixel.y);
    this.dragToPixel = new Point2D(toX, toY);
    this.ctx.strokeRect(this.dragFromPixel.x, this.dragFromPixel.y, this.dragToPixel.x, this.dragToPixel.y);
    this.ctx.fillRect(this.dragFromPixel.x, this.dragFromPixel.y, this.dragToPixel.x, this.dragToPixel.y);
  }

  private drawAnimationFrame(i: number, pixelItem: PixelItem) {
    this.stretchX = 1 + (this.canvas.nativeElement.width / this.dragToPixel.x - 1) * i / this.animFrames;
    this.stretchY = 1 + (this.canvas.nativeElement.height / this.dragToPixel.y - 1) * i / this.animFrames;
    this.offsetX = -this.dragFromPixel.x * (this.stretchX - (1 * (this.animFrames - i) / this.animFrames));
    this.offsetY = -this.dragFromPixel.y * (this.stretchY - (1 * (this.animFrames - i) / this.animFrames));
    this.redraw(pixelItem);
  }

  animate() {
    let i = 0;
    let j = 0;
    let currentPixelFrame: PixelItem;
    this.resetTransform();
    if (this.animationHandle) {
      window.clearInterval(this.animationHandle);
      this.animationHandle = 0;
      this.resetTransform();
    }
    this.animationHandle = window.setInterval(() => {
      if (j == this.pixelItems.length) {
        window.clearInterval(this.animationHandle);
        this.animationHandle = 0;
        this.resetTransform();
        this.redraw(currentPixelFrame);
        return;
      }
      if (i % this.animFrames == 0) {
        currentPixelFrame = this.pixelItems[j];
        this.dragFromPixel = currentPixelFrame.dragFromPixel;
        this.dragToPixel = currentPixelFrame.dragToPixel;
        j++;
      }
      this.drawAnimationFrame(i % this.animFrames, currentPixelFrame);
      i++;
    }, 30);
  }

  private resetTransform() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.stretchX = 1;
    this.stretchY = 1;
  }

  bitmapToImage(imagedata: ImageData) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  }

  store() {
    if (this.pixelItems.length < 6) {
      return;
    }
    this.dataService.savePixelItem(this.pixelItems).subscribe();
    let item = new PixelCatalog();
    item.guid = this.sequenceGuid;
    item.pixelItems = this.pixelItems;
    this.pixelCatalog.push(item);
  }

  load(i: number) {
    this.resetTransform();
    this.pixelItems = this.pixelCatalog[i].pixelItems;
    this.animate();
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}


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
      this.png64 = canvas.toDataURL();
      image.src = this.png64;
      return image;
    }
    else {
      var image = new Image();
      image.src = this.png64;
      return image;
    }
  }

  get minDelta(): number {
    return this.toPoint.x - this.toPoint.y;
  }

  toString(): string {
    return `${this.fromPoint},${this.toPoint},${this.dragFromPixel},${this.dragToPixel}`
  }
}