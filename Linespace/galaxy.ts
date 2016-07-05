namespace Linespace {

    const TWO_PI = Math.PI * 2;

    export interface GalaxyParameters {
        center: Vec2D;
        rotationSpeed: number;
        size: number;
        sizeRatio: number;
        starCount: number;
    }

    interface StarDefinition {
        longerRadius: number;
        shorterRadius: number;
        initialRotation: number;
        orbitRotation: number;
    }

    const generateStars = function(params: GalaxyParameters): StarDefinition[] {
        const rng = new RandomNumberGenerator(JSON.stringify(params));

        const angleDelta = TWO_PI / params.starCount;
        const SIZE_MIN = 1;
        const sizeDelta = (params.size - SIZE_MIN) / params.starCount;

        let size = SIZE_MIN;
        const result: StarDefinition[] = [];

        for (let a = 0; a < TWO_PI; a += angleDelta) {
            const w = size;
            const h = size * params.sizeRatio;
            const t = rng.floatRange(0, TWO_PI);

            result.push({
                initialRotation: t,
                longerRadius: w,
                shorterRadius: h,
                orbitRotation: a
            });

            size += sizeDelta;
        }

        return result;
    };

    export class Galaxy {

        private stars: StarDefinition[];
        private params: GalaxyParameters;
        private pixelBatch = new PixelBatch();
        private rngSeed: string;

        constructor(parameters: GalaxyParameters) {
            this.params = parameters;
            this.rngSeed = JSON.stringify(this.params);
            this.stars = generateStars(parameters);
        }

        draw(context: CanvasRenderingContext2D, time: number) {
            const rng = new RandomNumberGenerator(this.rngSeed);

            this.pixelBatch.clear();

            this.stars.forEach(star => {
                const pos = this.calculateStarPosition(star, time);
                this.pixelBatch.add(pos.x, pos.y, rgbf(1, 1, 1));
            });

            this.pixelBatch.draw(context);
        }

        private calculateStarPosition(star: StarDefinition, time: number): Vec2D {
            const r = star.initialRotation + time * this.params.rotationSpeed;
            const x = Math.sin(r) * star.longerRadius;
            const y = Math.cos(r) * star.shorterRadius;
            const or = star.orbitRotation;

            const xx = this.params.center.x + x * Math.cos(or) - y * Math.sin(or);
            const yy = this.params.center.y + x * Math.sin(or) + y * Math.cos(or);

            return vec(xx, yy);
        }
    };
}