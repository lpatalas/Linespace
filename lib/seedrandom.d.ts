interface prng {
	int32(): number;
	quick(): number;
}

interface Math {
	seedrandom: new (seed?: string) => prng;
}
