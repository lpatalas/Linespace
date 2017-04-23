import { Galaxy } from './rendering/galaxy'
import { GalaxyRenderer } from './rendering/galaxyRenderer'
import { vec, Vec2D } from './common/vec2D'

const getWebGLContext = function (canvas: HTMLCanvasElement): WebGLRenderingContext {
    const context = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return context;
};

export class Game {
	private canvas: HTMLCanvasElement;
	private galaxyRenderer: GalaxyRenderer;
	private gl: WebGLRenderingContext;
	private window: Window;
	private gameTime: number = 0;
	private lastTime: number;

	constructor(canvas: HTMLCanvasElement, window: Window) {
		this.canvas = canvas;
    	this.gl = getWebGLContext(canvas);
		this.window = window;
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
	};

	update() {
		this.fitCanvasToWindow();
		this.clearCanvas();

		const currentTime = new Date().getTime() / 1000;
		if (this.lastTime) {
			const deltaTime = currentTime - this.lastTime;
			this.gameTime += deltaTime;

			const view = {
				scale: 1,
				translation: vec(0, 0),
				viewportSize: vec(this.canvas.width, this.canvas.height)
			};

			if (this.galaxyRenderer) {
				this.galaxyRenderer.render(this.gl, this.gameTime, view);
			}
		}

		this.lastTime = currentTime;
	}

	showGalaxy(galaxy: Galaxy) {
		this.galaxyRenderer = new GalaxyRenderer(this.gl, galaxy);
	}

	canvasToWorld(canvasPos: Vec2D): Vec2D {
        const halfWidth = this.canvas.width / 2;
        const halfHeight = this.canvas.height / 2;

        return vec(canvasPos.x - halfWidth, -canvasPos.y + halfHeight);
    }

    worldToCanvas(worldPos: Vec2D): Vec2D {
        const halfWidth = this.canvas.width / 2;
        const halfHeight = this.canvas.height / 2;

        return vec(worldPos.x + halfWidth, -worldPos.y + halfHeight);
    }

	private getCenter(): Vec2D {
		return { x: this.canvas.width / 2, y: this.canvas.height / 2 };
	};

	private clearCanvas() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	};

	private setupViewport() {
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	};

	private fitCanvasToWindow() {
		let sizeChanged = false;

		if (this.canvas.width != this.window.innerHeight) {
			this.canvas.width = this.window.innerWidth;
			sizeChanged = true;
		}
		if (this.canvas.height != this.window.innerHeight) {
			this.canvas.height = this.window.innerHeight;
			sizeChanged = true;
		}

		if (sizeChanged) {
			this.setupViewport();
		}
	};
}
