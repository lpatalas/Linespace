namespace Linespace
{
    interface BatchedPixel {
        x: number;
        y: number;
        color: string;
    }

    export class PixelBatch {

        private buffer: BatchedPixel[];

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

            this.buffer.forEach(pixel => {
                context.fillStyle = pixel.color;
                context.fillRect(pixel.x, pixel.y, 1, 1);
            });
        }
    }
}