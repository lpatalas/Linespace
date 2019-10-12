///<reference path="./galaxy.ts" />
///<reference path="./glUtils.ts" />
///<reference path="../common/vec2D.ts" />
///<reference path="./renderer.ts" />

const vertexShaderSource = `
precision mediump float;

uniform float scale;
uniform float rotationSpeed;
uniform float time;
uniform vec2 viewportSize;

attribute vec4 starParams;
attribute vec3 color;

varying vec3 vColor;

void main() {
    float initialRotation = starParams.x;
    float longerRadius = starParams.y;
    float orbitRotation = starParams.z;
    float shorterRadius = starParams.w;

    float r = initialRotation + time * rotationSpeed;
    float x = sin(r) * longerRadius * scale;
    float y = cos(r) * shorterRadius * scale;

    float xx = x * cos(orbitRotation) - y * sin(orbitRotation);
    float yy = x * sin(orbitRotation) + y * cos(orbitRotation);

    vec2 vpos = vec2(xx, yy);
    vec2 screenPos = vpos / (viewportSize * 0.5);

    gl_Position = vec4(screenPos.x, screenPos.y, 0, 1);
    gl_PointSize = 3.0;

    vColor = color;
}
`;

const fragmentShaderSource = `
precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1);
}
`;

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

class GalaxyRenderer implements Renderer {
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
            scale: gl.getUniformLocation(this.program, 'scale')!,
            rotationSpeed: gl.getUniformLocation(this.program, 'rotationSpeed')!,
            time: gl.getUniformLocation(this.program, 'time')!,
            viewportSize: gl.getUniformLocation(this.program, 'viewportSize')!
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
        this.gl.uniform2f(this.uniforms.viewportSize, view.viewportSize.x, view.viewportSize.y);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.attributes.starParams, 4, this.gl.FLOAT, false, 7 * 4, 0);
        this.gl.vertexAttribPointer(this.attributes.color, 3, this.gl.FLOAT, false, 7 * 4, 4 * 4);
        this.gl.drawArrays(this.gl.POINTS, 0, this.vertexCount);
    }

}
