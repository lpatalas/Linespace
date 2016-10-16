declare module Ext {
    export class EventTargetExt extends EventTarget {
        id: any;
    }

}

interface CanvasRenderingContext2D {
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
}

interface WebGLDebugUtils {
    makeDebugContext(context: WebGLRenderingContext): WebGLRenderingContext;
}

declare var WebGLDebugUtils: WebGLDebugUtils;