///<reference path="./rendering/galaxy.ts" />
///<reference path="./rendering/galaxyRenderer.ts" />
///<reference path="./common/vec2D.ts" />
///<reference path="./rendering/renderer.ts" />

const getWebGLContext = function (canvas: HTMLCanvasElement): WebGLRenderingContext {
	const webglContext = <WebGLRenderingContext>canvas.getContext('webgl');
	if (webglContext) {
		return webglContext;
	}

	const experimentalWebglContext = <WebGLRenderingContext>canvas.getContext('experimental-webgl');
	if (experimentalWebglContext) {
		return experimentalWebglContext;
	}

	throw new Error("Can't get WebGL context from canvas");
};

class Game {
	private canvas3d: HTMLCanvasElement;
	private activeRenderer: Renderer;
	private gl: WebGLRenderingContext;
	private window: Window;
	private gameTime: number = 0;
	private lastTime: number = 0;

	constructor(canvas2d: HTMLCanvasElement, canvas3d: HTMLCanvasElement, window: Window, galaxy: Galaxy) {
		this.canvas3d = canvas3d;
    	this.gl = getWebGLContext(canvas3d);
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
	};

	private setupViewport() {
		this.gl.viewport(0, 0, this.canvas3d.width, this.canvas3d.height);
	};

	private fitCanvasToWindow() {
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
	};
}
