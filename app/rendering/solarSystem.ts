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
				orbitalPeriod: 6,
				semiMajorAxis: 40,
				semiMinorAxis: 30
			},
			{
				argumentOfPeriapsis: Math.PI * 0.25,
				color: { r: 0.3, g: 1, b: 1 },
				initialPosition: 0,
				orbitalPeriod: 8,
				semiMinorAxis: 90,
				semiMajorAxis: 110
			},
			{
				argumentOfPeriapsis: Math.PI * 0.7,
				color: { r: 0.11, g: 0.5, b: 1 },
				initialPosition: 0,
				orbitalPeriod: 10,
				semiMinorAxis: 230,
				semiMajorAxis: 240
			}
		]
	}
}
