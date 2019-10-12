interface prng {
	int32(): number;
	quick(): number;
}

declare function seedrandom(): prng;
declare function seedrandom(seed: string): prng;
