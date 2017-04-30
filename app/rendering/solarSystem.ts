import { Rgb, rgbf } from '../common/color'
import { RandomNumberGenerator } from '../common/randomNumberGenerator'
import { Vec2D, vec, vdist } from '../common/vec2D'

type Radians = number;
type Seconds = number;

export interface Planet {
	orbitRotation: Radians;
	color: Rgb;
	initialPosition: Radians;
	orbitalPeriod: Seconds;
	semiMajorAxis: number;
	semiMinorAxis: number;
}

export interface SolarSystem {
	planets: Planet[];
}

export function createRandomSolarSystem(): SolarSystem {
	const rng = new RandomNumberGenerator();
	const planetCount = rng.intRange(3, 20);
	const planets = [];
	let orbitRadius = rng.floatRange(30, 70);

	for (let i = 0; i < planetCount; i++) {
		const planet = createRandomPlanet(orbitRadius);
		planets.push(planet);
		orbitRadius += rng.floatRange(30, 70);
	}
	console.log({ planetCount, planets });
	return { planets };

	function createRandomPlanet(orbitRadius: number) {
		return {
			color: {
				r: rng.floatRange(0, 1),
				g: rng.floatRange(0, 1),
				b: rng.floatRange(0, 1)
			},
			initialPosition: rng.floatRange(0, Math.PI * 2),
			orbitalPeriod: rng.floatRange(10, 100),
			orbitRotation: rng.floatRange(0, Math.PI / 4),
			semiMajorAxis: orbitRadius + rng.floatRange(1, 10),
			semiMinorAxis: orbitRadius - rng.floatRange(1, 10)
		};
	}
}

export function createTestSolarSystem(): SolarSystem {
	return {
		planets: [
			{
				color: { r: 0, g: 0.8, b: 0.2 },
				initialPosition: 0,
				orbitalPeriod: 16,
				orbitRotation: 0,
				semiMajorAxis: 40,
				semiMinorAxis: 35
			},
			{
				color: { r: 0.3, g: 1, b: 1 },
				initialPosition: 10,
				orbitalPeriod: 18,
				orbitRotation: Math.PI * 0.1,
				semiMinorAxis: 97,
				semiMajorAxis: 110
			},
			{
				color: { r: 0.11, g: 0.5, b: 1 },
				initialPosition: 0,
				orbitalPeriod: 20,
				orbitRotation: Math.PI * 0.2,
				semiMinorAxis: 230,
				semiMajorAxis: 240
			}
		]
	}
}
