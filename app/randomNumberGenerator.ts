
declare module global {
    export interface Math {
        seedrandom: prng;
    }
}

export class RandomNumberGenerator {
    private rng: prng;

    constructor(seed?: any) {
        if (seed != null) {
            this.rng = new Math.seedrandom(JSON.stringify(seed));
        }
        else {
            this.rng = new Math.seedrandom();
        }
    }

    float(): number {
        return this.rng.quick();
    }

    floatRange(min: number, max: number): number {
        return min + this.float() * (max - min);
    }

    intRange(min: number, max: number): number {
        return min + (this.rng.int32() % (max - min));
    }
}