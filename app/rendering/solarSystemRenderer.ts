import { Planet, SolarSystem } from './solarSystem'
import * as GLUtils from './glUtils'
import { rgbToHex } from '../common/color'
import { Vec2D } from '../common/vec2D'
import { Renderer, ViewParameters } from "./renderer";

const TWO_PI = Math.PI * 2;

export class SolarSystemRenderer implements Renderer {
	private context: CanvasRenderingContext2D;
	private solarSystem: SolarSystem;

	constructor(context: CanvasRenderingContext2D, solarSystem: SolarSystem) {
		this.context = context;
		this.solarSystem = solarSystem;
	}

	render(time: number, view: ViewParameters) {
		this.solarSystem.planets.forEach(
			planet => this.drawOrbit(planet));
		this.solarSystem.planets.forEach(
			planet => this.drawPlanet(planet, time));
	}

	private drawPlanet(planet: Planet, time: number) {
		const p = planet.initialPosition + (time / planet.orbitalPeriod) * TWO_PI;
		const x = Math.sin(p) * planet.semiMajorAxis;
		const y = Math.cos(p) * planet.semiMinorAxis;
		const xx = x * Math.cos(planet.argumentOfPeriapsis) - y * Math.sin(planet.argumentOfPeriapsis);
		const yy = x * Math.sin(planet.argumentOfPeriapsis) + y * Math.cos(planet.argumentOfPeriapsis);

		this.context.fillStyle = rgbToHex(planet.color);
		this.context.beginPath();
      	this.context.arc(xx, yy, 10, 0, TWO_PI);
      	this.context.fill();
	}

	private drawOrbit(planet: Planet) {
		this.context.strokeStyle = 'rgb(64,64,64)';
		this.context.beginPath();
		this.context.ellipse(0, 0, planet.semiMajorAxis, planet.semiMinorAxis, planet.argumentOfPeriapsis, 0, TWO_PI);
		this.context.stroke();
	}
}
