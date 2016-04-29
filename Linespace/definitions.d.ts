///<reference path="Scripts/typings/seedrandom/seedrandom.d.ts" />

interface CanvasRenderingContext2D {
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean);
}

interface Math {
    seedrandom: prng;
}