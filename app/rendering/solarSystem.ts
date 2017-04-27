import { Rgb, rgbf } from '../common/color'
import { RandomNumberGenerator } from '../common/randomNumberGenerator'
import { Vec2D, vec, vdist } from '../common/vec2D'

type Radians = number;
type Seconds = number;

export interface Planet {
	argumentOfPeriapsis: Radians;
	color: Rgb;
	initialPosition: Radians;
	orbitalPeriod: Seconds;
	semiMajorAxis: number;
	semiMinorAxis: number;
}

export interface SolarSystem {
	planets: Planet[];
}

export function createTestSolarSystem(): SolarSystem {
	return {
		planets: [
			{
				argumentOfPeriapsis: 0,
				color: { r: 0, g: 0.8, b: 0.2 },
				initialPosition: 0,
				orbitalPeriod: 16,
				semiMajorAxis: 40,
				semiMinorAxis: 35
			},
			{
				argumentOfPeriapsis: Math.PI * 0.1,
				color: { r: 0.3, g: 1, b: 1 },
				initialPosition: 10,
				orbitalPeriod: 18,
				semiMinorAxis: 97,
				semiMajorAxis: 110
			},
			{
				argumentOfPeriapsis: Math.PI * 0.2,
				color: { r: 0.11, g: 0.5, b: 1 },
				initialPosition: 0,
				orbitalPeriod: 20,
				semiMinorAxis: 230,
				semiMajorAxis: 240
			}
		]
	}
}
