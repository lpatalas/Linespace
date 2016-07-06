///<reference path="Scripts/typings/seedrandom/seedrandom.d.ts" />

interface CanvasRenderingContext2D {
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
}

interface Math {
    seedrandom: prng;
}

interface WebGLDebugUtils {
    makeDebugContext(context: WebGLRenderingContext): WebGLRenderingContext;
}

declare var WebGLDebugUtils: WebGLDebugUtils;