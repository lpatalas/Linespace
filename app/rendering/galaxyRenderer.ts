import { Galaxy } from './galaxy'
import * as GLUtils from './glUtils'
import { Vec2D } from '../common/vec2D'
import { Renderer, ViewParameters } from "./renderer";
declare var require: (name: string) => any;

const vertexShaderSource: string = require('./shaders/galaxy.vert');
const fragmentShaderSource: string = require('./shaders/galaxy.frag');

interface Attributes {
    starParams: number;
    color: number;
}

interface Uniforms {
    scale: WebGLUniformLocation,
    rotationSpeed: WebGLUniformLocation;
    time: WebGLUniformLocation;
    translation: WebGLUniformLocation;
    viewportSize: WebGLUniformLocation;
}

export class GalaxyRenderer implements Renderer {
	private gl: WebGLRenderingContext;
    private galaxy: Galaxy;
    private program: WebGLProgram;
    private vertexBuffer: WebGLBuffer;
    private vertexCount: number;
    private attributes: Attributes;
    private uniforms: Uniforms;

    constructor(gl: WebGLRenderingContext, galaxy: Galaxy) {
		this.gl = gl;
        this.galaxy = galaxy;

        this.program = GLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(this.program);

        this.attributes = {
            starParams: gl.getAttribLocation(this.program, "starParams"),
            color: gl.getAttribLocation(this.program, "color")
        };
        gl.enableVertexAttribArray(this.attributes.starParams);
        gl.enableVertexAttribArray(this.attributes.color);

        this.uniforms = {
            scale: gl.getUniformLocation(this.program, 'scale'),
            rotationSpeed: gl.getUniformLocation(this.program, 'rotationSpeed'),
            time: gl.getUniformLocation(this.program, 'time'),
            translation: gl.getUniformLocation(this.program, 'translation'),
            viewportSize: gl.getUniformLocation(this.program, 'viewportSize')
        };

        const stars = galaxy.getStars();
        const vertices = new Array(stars.length * 7);

        let index = 0;
        stars.forEach(star => {
            vertices[index++] = star.initialRotation;
            vertices[index++] = star.longerRadius;
            vertices[index++] = star.orbitRotation;
            vertices[index++] = star.shorterRadius;
            vertices[index++] = star.color.r;
            vertices[index++] = star.color.g;
            vertices[index++] = star.color.b;
        });

        this.vertexBuffer = GLUtils.createVertexBuffer(gl, vertices);
        this.vertexCount = stars.length;
    }

    render(time: number, view: ViewParameters) {
        this.gl.useProgram(this.program);
        this.gl.uniform1f(this.uniforms.scale, view.scale);
        this.gl.uniform1f(this.uniforms.rotationSpeed, this.galaxy.rotationSpeed);
        this.gl.uniform1f(this.uniforms.time, time);
        this.gl.uniform2f(this.uniforms.translation, view.translation.x, view.translation.y);
        this.gl.uniform2f(this.uniforms.viewportSize, view.viewportSize.x, view.viewportSize.y);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.attributes.starParams, 4, this.gl.FLOAT, false, 7 * 4, 0);
        this.gl.vertexAttribPointer(this.attributes.color, 3, this.gl.FLOAT, false, 7 * 4, 4 * 4);
        this.gl.drawArrays(this.gl.POINTS, 0, this.vertexCount);
    }

}
