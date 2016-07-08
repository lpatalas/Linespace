﻿namespace Linespace {

    const TWO_PI = Math.PI * 2;

    export interface GalaxyParameters {
        center: Vec2D;
        rotationSpeed: number;
        size: number;
        sizeRatio: number;
        starCount: number;
    }

    export interface StarDefinition {
        longerRadius: number;
        shorterRadius: number;
        initialRotation: number;
        orbitRotation: number;
        color: Rgb;
    }

    const lerp = function(a: number, b: number, t: number) {
        return a + (b - a) * t;
    };

    const calculateStarColor = function(rng: RandomNumberGenerator, distance: number): Rgb {
        const x = Math.pow(rng.float(), 5);
        const y = Math.pow(rng.float(), 8);
        const df = Math.pow(1 - distance, 1.1);

        const r = 0.7 + 0.3 * lerp(x, 1, df);
        const g = 0.7 + 0.3 * Math.min(lerp(y, 1, df), r);
        const b = lerp(1 - x, 0.7, df);

        return { r, g, b };
    };

    const generateStars = function(params: GalaxyParameters): StarDefinition[] {
        const rng = new RandomNumberGenerator(JSON.stringify(params));

        const angleDelta = TWO_PI / params.starCount;
        const SIZE_MIN = 1;
        const sizeDelta = (params.size - SIZE_MIN) / params.starCount;

        let size = SIZE_MIN;
        const result: StarDefinition[] = [];

        for (let a = 0; a < TWO_PI; a += angleDelta) {
            const w = Math.max(1, Math.pow(size, rng.floatRange(0.95, 1.05)));
            const h = size * params.sizeRatio;
            const t = rng.floatRange(0, TWO_PI);

            result.push({
                initialRotation: t,
                longerRadius: w,
                shorterRadius: h,
                orbitRotation: a,
                color: calculateStarColor(rng, size / params.size)
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

        get rotationSpeed(): number {
            return this.params.rotationSpeed;
        }

        constructor(parameters: GalaxyParameters) {
            this.params = parameters;
            this.rngSeed = JSON.stringify(this.params);
            this.stars = generateStars(parameters);
            this.pixelBatch.pixelSize = 2;
        }

        draw(context: CanvasRenderingContext2D, time: number) {
            const rng = new RandomNumberGenerator(this.rngSeed);

            this.pixelBatch.clear();

            this.stars.forEach(star => {
                const pos = this.calculateStarPosition(star, time);
                this.pixelBatch.add(pos.x, pos.y, rgbToHex(star.color));
            });

            this.pixelBatch.draw(context);
        }

        getStars(): StarDefinition[] {
            return this.stars;
        }

        getStarPositions() {
            return this.stars.map(star => this.calculateStarPosition(star, 0));
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