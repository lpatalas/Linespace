///<reference path="../../lib/seedrandom.d.ts" />

class RandomNumberGenerator {
    private rng: prng;

    constructor(seed?: any) {
        if (seed != null) {
            this.rng = seedrandom(JSON.stringify(seed));
        }
        else {
            this.rng = seedrandom();
        }
    }

    float(): number {
        return this.rng.quick();
    }

    floatRange(min: number, max: number): number {
        return min + this.float() * (max - min);
    }

    intRange(min: number, max: number): number {
        return min + Math.abs(this.rng.int32() % (max - min));
    }
}
