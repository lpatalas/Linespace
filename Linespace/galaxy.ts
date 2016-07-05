namespace Linespace {

    const TWO_PI = Math.PI * 2;

    const pixelBatch = new PixelBatch();

    export function drawGalaxy(context: CanvasRenderingContext2D, center: Vec2D, maxRadius: number, time: number) {
        const rng = new RandomNumberGenerator({ center, maxRadius });

        pixelBatch.clear();

        const PIXEL_COUNT = 10000;
        const da = TWO_PI / PIXEL_COUNT;

        const ROTATION_SPEED = 0.1;

        const SIZE_X = 200;
        const SIZE_Y = 100;

        const SIZE_MIN = 1;
        const SIZE_MAX = 400;
        const SIZE_RATIO = 0.875;
        const SIZE_DELTA = (SIZE_MAX - SIZE_MIN) / PIXEL_COUNT;

        let size = SIZE_MIN;

        for (let a = 0; a < TWO_PI; a += da) {
            const w = size;
            const h = size * SIZE_RATIO;
            const t = rng.floatRange(0, TWO_PI) + time * ROTATION_SPEED;
            const x = Math.sin(t) * w;
            const y = Math.cos(t) * h;

            const xx = x * Math.cos(a) - y * Math.sin(a);
            const yy = x * Math.sin(a) + y * Math.cos(a);

            pixelBatch.add(xx, yy, rgbf(1, 1, 1));

            size += SIZE_DELTA;
        }

        pixelBatch.draw(context);
    };

}