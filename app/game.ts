import { Galaxy } from './rendering/galaxy'
import { GalaxyRenderer } from './rendering/galaxyRenderer'
import { vec, Vec2D } from './common/vec2D'
import { SolarSystem } from "./rendering/solarSystem";
import { Renderer } from "./rendering/renderer";
import { SolarSystemRenderer } from "./rendering/solarSystemRenderer";

const getWebGLContext = function (canvas: HTMLCanvasElement): WebGLRenderingContext {
    const context = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	//return WebGLDebugUtils.makeDebugContext(context);
    return context;
};

export class Game {
	private canvas2d: HTMLCanvasElement;
	private canvas3d: HTMLCanvasElement;
	private activeRenderer: Renderer;
	private gl: WebGLRenderingContext;
	private context2d: CanvasRenderingContext2D;
	private window: Window;
	private gameTime: number = 0;
	private lastTime: number;

	constructor(canvas2d: HTMLCanvasElement, canvas3d: HTMLCanvasElement, window: Window) {
		this.canvas2d = canvas2d;
		this.canvas3d = canvas3d;
    	this.gl = getWebGLContext(canvas3d);
		this.context2d = this.canvas2d.getContext('2d');
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

	private getGameTime() {
		return this.gameTime;
	}

	private setup() {
		this.gl.clearColor(0.0, 0.0, 0, 0);
		this.gl.disable(this.gl.DEPTH_TEST);

		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.ONE, this.gl.ONE);

		this.setupViewport();
	};

	private update() {
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

	showGalaxy(galaxy: Galaxy) {
		this.activeRenderer = new GalaxyRenderer(this.gl, galaxy);
	}

	showSolarSystem(solarSystem: SolarSystem) {
		this.activeRenderer = new SolarSystemRenderer(this.context2d, solarSystem);
	}

	canvasToWorld(canvasPos: Vec2D): Vec2D {
        const halfWidth = this.canvas3d.width / 2;
        const halfHeight = this.canvas3d.height / 2;

        return vec(canvasPos.x - halfWidth, -canvasPos.y + halfHeight);
    }

    worldToCanvas(worldPos: Vec2D): Vec2D {
        const halfWidth = this.canvas3d.width / 2;
        const halfHeight = this.canvas3d.height / 2;

        return vec(worldPos.x + halfWidth, -worldPos.y + halfHeight);
    }

	private getCenter(): Vec2D {
		return { x: this.canvas3d.width / 2, y: this.canvas3d.height / 2 };
	};

	private clearCanvas() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		const { width, height } = this.context2d.canvas;
		this.context2d.fillStyle = 'rgba(0,0,0,0)';
		this.context2d.clearRect(0, 0, width, height);
	};

	private setupViewport() {
		this.gl.viewport(0, 0, this.canvas3d.width, this.canvas3d.height);

		const { x, y } = this.getCenter();
		this.context2d.setTransform(1, 0, 0, 1, x, y);
	};

	private fitCanvasToWindow() {
		let sizeChanged = false;

		if (this.canvas3d.width != this.window.innerHeight) {
			this.canvas2d.width = this.window.innerWidth;
			this.canvas3d.width = this.window.innerWidth;
			sizeChanged = true;
		}
		if (this.canvas3d.height != this.window.innerHeight) {
			this.canvas2d.height = this.window.innerHeight;
			this.canvas3d.height = this.window.innerHeight;
			sizeChanged = true;
		}

		if (sizeChanged) {
			this.setupViewport();
		}
	};
}
