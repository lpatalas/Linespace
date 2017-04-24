import { Vec2D } from "../common/vec2D";

export interface ViewParameters {
    scale: number,
    translation: Vec2D,
    viewportSize: Vec2D
}

export interface Renderer {
	render(time: number, view: ViewParameters);
}
