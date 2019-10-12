"use strict";
const clamp = function (x, min, max) {
    return Math.min(max, Math.max(x, min));
};
function rgb(r, g, b) {
    r = clamp(Math.floor(r), 0, 255);
    g = clamp(Math.floor(g), 0, 255);
    b = clamp(Math.floor(b), 0, 255);
    return `rgb(${r}, ${g}, ${b})`;
}
;
function rgbf(r, g, b) {
    return rgb(r * 255, g * 255, b * 255);
}
;
function rgbToHex(input) {
    return rgbf(input.r, input.g, input.b);
}
;
///<reference path="../../lib/seedrandom.d.ts" />
class RandomNumberGenerator {
    constructor(seed) {
        if (seed != null) {
            this.rng = new Math.seedrandom(JSON.stringify(seed));
        }
        else {
            this.rng = new Math.seedrandom();
        }
    }
    float() {
        return this.rng.quick();
    }
    floatRange(min, max) {
        return min + this.float() * (max - min);
    }
    intRange(min, max) {
        return min + Math.abs(this.rng.int32() % (max - min));
    }
}
function vec(x, y) {
    return { x, y };
}
function vcopy(v) {
    return { x: v.x, y: v.y };
}
function vadd(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}
function vsub(a, b) {
    return vec(a.x - b.x, a.y - b.y);
}
function vmul(a, b) {
    return { x: a.x * b.x, y: a.y * b.y };
}
function vsqrt(v) {
    return { x: Math.sqrt(v.x), y: Math.sqrt(v.y) };
}
function vdist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}
///<reference path="../common/color.ts" />
///<reference path="../common/randomNumberGenerator.ts" />
///<reference path="../common/vec2D.ts" />
const lerp = function (a, b, t) {
    return a + (b - a) * t;
};
const calculateStarColor = function (rng, distance) {
    const x = Math.pow(rng.float(), 5);
    const y = Math.pow(rng.float(), 8);
    const df = Math.pow(1 - distance, 1.1);
    const r = 0.7 + 0.3 * lerp(x, 1, df);
    const g = 0.7 + 0.3 * Math.min(lerp(y, 1, df), r);
    const b = lerp(1 - x, 0.7, df);
    return { r, g, b };
};
const generateStars = function (params) {
    const rng = new RandomNumberGenerator(JSON.stringify(params));
    const TWO_PI = Math.PI * 2;
    const angleDelta = TWO_PI / params.starCount;
    const SIZE_MIN = 1;
    const sizeDelta = (params.size - SIZE_MIN) / params.starCount;
    let size = SIZE_MIN;
    const result = [];
    for (let a = 0; a < TWO_PI; a += angleDelta) {
        const w = Math.max(1, Math.pow(size, rng.floatRange(0.95, 1.05)));
        const h = size * params.sizeRatio;
        const t = rng.floatRange(0, TWO_PI);
        result.push({
            initialRotation: t,
            longerRadius: w,
            shorterRadius: h,
            orbitRotation: a,
            color: calculateStarColor(rng, size / params.size)
        });
        size += sizeDelta;
    }
    return result;
};
class Galaxy {
    constructor(parameters) {
        this.params = parameters;
        this.rngSeed = JSON.stringify(this.params);
        this.stars = generateStars(parameters);
    }
    get rotationSpeed() {
        return this.params.rotationSpeed;
    }
    getStars() {
        return this.stars;
    }
    getStarPositions() {
        return this.stars.map(star => this.calculateStarPosition(star, 0));
    }
    getNearestStarPosition(position, time, maxDistance) {
        const starsInRange = this.stars
            .map(star => this.calculateStarPosition(star, time))
            .filter(starPos => vdist(position, starPos) <= maxDistance);
        starsInRange.sort((a, b) => {
            const aDist = vdist(position, a);
            const bDist = vdist(position, b);
            return aDist - bDist;
        });
        //console.log(`${starsInRange.length} in range; first = ${JSON.stringify(starsInRange[0])}`);
        return starsInRange[0];
    }
    calculateStarPosition(star, time) {
        const r = star.initialRotation + time * this.params.rotationSpeed;
        const x = Math.sin(r) * star.longerRadius;
        const y = Math.cos(r) * star.shorterRadius;
        const or = star.orbitRotation;
        const xx = this.params.center.x + x * Math.cos(or) - y * Math.sin(or);
        const yy = this.params.center.y + x * Math.sin(or) + y * Math.cos(or);
        return vec(xx, yy);
    }
}
;
class GLUtils {
    static createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = GLUtils.createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = GLUtils.createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        const program = gl.createProgram();
        if (!program) {
            throw new Error("Can't create shader program");
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw "Can't create program";
        }
        return program;
    }
    static createVertexBuffer(gl, vertexData) {
        const bufferData = new Float32Array(vertexData);
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error("Can't create vertex buffer");
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
        return buffer;
    }
}
GLUtils.createShader = function (gl, source, shaderType) {
    const shader = gl.createShader(shaderType);
    if (!shader) {
        throw new Error("Can't create shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const infoLog = gl.getShaderInfoLog(shader);
        throw `Can't compile shader: ${infoLog}`;
    }
    return shader;
};
///<reference path="../common/vec2D.ts" />
///<reference path="./galaxy.ts" />
///<reference path="./glUtils.ts" />
///<reference path="../common/vec2D.ts" />
///<reference path="./renderer.ts" />
const vertexShaderSource = `
precision mediump float;

uniform float scale;
uniform float rotationSpeed;
uniform float time;
uniform vec2 translation;
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

    vec2 vpos = vec2(xx, yy) + translation;
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
class GalaxyRenderer {
    constructor(gl, galaxy) {
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
    render(time, view) {
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
///<reference path="./rendering/galaxy.ts" />
///<reference path="./rendering/galaxyRenderer.ts" />
///<reference path="./common/vec2D.ts" />
///<reference path="./rendering/renderer.ts" />
const getWebGLContext = function (canvas) {
    const webglContext = canvas.getContext('webgl');
    if (webglContext) {
        return webglContext;
    }
    const experimentalWebglContext = canvas.getContext('experimental-webgl');
    if (experimentalWebglContext) {
        return experimentalWebglContext;
    }
    throw new Error("Can't get WebGL context from canvas");
};
class Game {
    constructor(canvas, window, galaxy) {
        this.gameTime = 0;
        this.lastTime = 0;
        this.canvas3d = canvas;
        this.gl = getWebGLContext(canvas);
        this.activeRenderer = new GalaxyRenderer(this.gl, galaxy);
        this.window = window;
    }
    run() {
        this.setup();
        const mainLoopStep = () => {
            this.update();
            requestAnimationFrame(mainLoopStep);
        };
        mainLoopStep();
    }
    getGameTime() {
        return this.gameTime;
    }
    setup() {
        this.gl.clearColor(0.0, 0.0, 0, 0);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.setupViewport();
    }
    ;
    update() {
        this.fitCanvasToWindow();
        this.clearCanvas();
        const currentTime = new Date().getTime() / 1000;
        if (this.lastTime) {
            const deltaTime = currentTime - this.lastTime;
            this.gameTime += deltaTime;
            if (this.activeRenderer) {
                const view = {
                    scale: 1,
                    translation: vec(0, 0),
                    viewportSize: vec(this.canvas3d.width, this.canvas3d.height)
                };
                this.activeRenderer.render(this.gameTime, view);
            }
        }
        this.lastTime = currentTime;
    }
    canvasToWorld(canvasPos) {
        const halfWidth = this.canvas3d.width / 2;
        const halfHeight = this.canvas3d.height / 2;
        return vec(canvasPos.x - halfWidth, -canvasPos.y + halfHeight);
    }
    worldToCanvas(worldPos) {
        const halfWidth = this.canvas3d.width / 2;
        const halfHeight = this.canvas3d.height / 2;
        return vec(worldPos.x + halfWidth, -worldPos.y + halfHeight);
    }
    clearCanvas() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    ;
    setupViewport() {
        this.gl.viewport(0, 0, this.canvas3d.width, this.canvas3d.height);
    }
    ;
    fitCanvasToWindow() {
        let sizeChanged = false;
        if (this.canvas3d.width != this.window.innerHeight) {
            this.canvas3d.width = this.window.innerWidth;
            sizeChanged = true;
        }
        if (this.canvas3d.height != this.window.innerHeight) {
            this.canvas3d.height = this.window.innerHeight;
            sizeChanged = true;
        }
        if (sizeChanged) {
            this.setupViewport();
        }
    }
    ;
}
///<reference path="./game.ts" />
const galaxy = new Galaxy({
    center: vec(0, 0),
    rotationSpeed: 0.05,
    size: 400,
    sizeRatio: 0.875,
    starCount: 10000
});
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas, window, galaxy);
game.run();
