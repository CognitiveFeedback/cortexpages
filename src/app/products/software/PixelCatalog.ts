import { PixelItem } from './PixelItem';

export class PixelCatalog {
    guid: string;
    pixelItems: PixelItem[];

    get minDelta(): number {
        return this.pixelItems[this.pixelItems.length - 1].toPoint.x - this.pixelItems[this.pixelItems.length - 1].toPoint.y;
    }
}