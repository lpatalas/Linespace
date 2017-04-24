import { Planet, SolarSystem } from './solarSystem'
import * as GLUtils from './glUtils'
import { Vec2D } from '../common/vec2D'
import { Renderer, ViewParameters } from "./renderer";
declare var require: (name: string) => any;

const vertexShaderSource: string = require('./shaders/planet.vert');
const fragmentShaderSource: string = require('./shaders/planet.frag');

interface Attributes {
    orbitParams: number;
    positionParams: number;
	color: number;
}

interface Uniforms {
    time: WebGLUniformLocation;
    translation: WebGLUniformLocation;
    viewportSize: WebGLUniformLocation;
}

export class SolarSystemRenderer implements Renderer {
	private gl: WebGLRenderingContext;
	private solarSystem: SolarSystem;
    private program: WebGLProgram;
    private vertexBuffer: WebGLBuffer;
    private vertexCount: number;
    private attributes: Attributes;
    private uniforms: Uniforms;

	constructor(gl: WebGLRenderingContext, solarSystem: SolarSystem) {
		this.gl = gl;
		this.solarSystem = solarSystem;

        this.program = GLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(this.program);

        this.attributes = {
            orbitParams: this.gl.getAttribLocation(this.program, "orbitParams"),
            positionParams: this.gl.getAttribLocation(this.program, "positionParams"),
			color: this.gl.getAttribLocation(this.program, "color")
        };
        gl.enableVertexAttribArray(this.attributes.orbitParams);
        gl.enableVertexAttribArray(this.attributes.positionParams);
        gl.enableVertexAttribArray(this.attributes.color);

        this.uniforms = {
            time: gl.getUniformLocation(this.program, 'time'),
            translation: gl.getUniformLocation(this.program, 'translation'),
            viewportSize: gl.getUniformLocation(this.program, 'viewportSize')
        };

        const vertices = new Array(solarSystem.planets.length * 8);

        let index = 0;
        solarSystem.planets.forEach(planet => {
            vertices[index++] = planet.argumentOfPeriapsis;
            vertices[index++] = planet.semiMinorAxis;
            vertices[index++] = planet.semiMajorAxis;
            vertices[index++] = planet.initialPosition;
			vertices[index++] = planet.orbitalPeriod;
            vertices[index++] = planet.color.r;
            vertices[index++] = planet.color.g;
            vertices[index++] = planet.color.b;
        });

        this.vertexBuffer = GLUtils.createVertexBuffer(gl, vertices);
        this.vertexCount = solarSystem.planets.length;
	}

	render(time: number, view: ViewParameters) {
        this.gl.useProgram(this.program);
        this.gl.uniform1f(this.uniforms.time, time);
        this.gl.uniform2f(this.uniforms.translation, view.translation.x, view.translation.y);
        this.gl.uniform2f(this.uniforms.viewportSize, view.viewportSize.x, view.viewportSize.y);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.attributes.orbitParams,    3, this.gl.FLOAT, false, 8 * 4,     0);
		this.gl.vertexAttribPointer(this.attributes.positionParams, 2, this.gl.FLOAT, false, 8 * 4, 3 * 4)
        this.gl.vertexAttribPointer(this.attributes.color,          3, this.gl.FLOAT, false, 8 * 4, 5 * 4);
        this.gl.drawArrays(this.gl.POINTS, 0, this.vertexCount);
	}
}
