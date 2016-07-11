namespace Linespace
{
    interface BatchedPixel {
        x: number;
        y: number;
        color: string;
    }

    export class PixelBatch {

        private buffer: BatchedPixel[];
        private _pixelSize: number = 1;

        get pixelSize() {
            return this._pixelSize;
        }

        set pixelSize(size: number) {
            this._pixelSize = size;
        }

        get count() {
            return this.buffer.length;
        }

        clear() {
            this.buffer = [];
        }

        add(x: number, y: number, color: string) {
            this.buffer.push({ x, y, color });
        }

        draw(context: CanvasRenderingContext2D) {
            let currentColor: string = null;
            const hs = this.pixelSize / 2;

            this.buffer.forEach(pixel => {
                context.fillStyle = pixel.color;
                context.fillRect(pixel.x - hs, pixel.y - hs, this.pixelSize, this.pixelSize);
            });
        }
    }
}