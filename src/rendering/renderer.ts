///<reference path="../common/vec2D.ts" />

interface ViewParameters {
    scale: number,
    translation: Vec2D,
    viewportSize: Vec2D
}

interface Renderer {
	render(time: number, view: ViewParameters): void;
}
