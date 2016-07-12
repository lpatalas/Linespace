import { Galaxy } from './galaxy'
import * as GLUtils from './glUtils'
import { Vec2D } from './vec2D'

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
    viewportSize: WebGLUniformLocation;
}

export interface ViewParameters {
    scale: number,
    viewportSize: Vec2D
}

export class GalaxyRenderer {

    private galaxy: Galaxy;
    private program: WebGLProgram;
    private vertexBuffer: WebGLBuffer;
    private vertexCount: number;
    private attributes: Attributes;
    private uniforms: Uniforms;

    constructor(gl: WebGLRenderingContext, galaxy: Galaxy) {
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

    render(gl: WebGLRenderingContext, time: number, view: ViewParameters) {
        gl.useProgram(this.program);
        gl.uniform1f(this.uniforms.scale, view.scale);
        gl.uniform1f(this.uniforms.rotationSpeed, this.galaxy.rotationSpeed);
        gl.uniform1f(this.uniforms.time, time);
        gl.uniform2f(this.uniforms.viewportSize, view.viewportSize.x, view.viewportSize.y);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.attributes.starParams, 4, gl.FLOAT, false, 7 * 4, 0);
        gl.vertexAttribPointer(this.attributes.color, 3, gl.FLOAT, false, 7 * 4, 4 * 4);
        gl.drawArrays(gl.POINTS, 0, this.vertexCount);
    }

}
