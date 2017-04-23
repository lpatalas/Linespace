import { Galaxy } from './rendering/galaxy';
import { GalaxyRenderer } from './rendering/galaxyRenderer';
import { Vec2D, vec, vcopy, vsub } from './common/vec2D';

const getWebGLContext = function (canvas: HTMLCanvasElement): WebGLRenderingContext {
    const context = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return context;
};

const parseStarCountParam = function () {
    const regex = /starCount=([0-9]+)/;
    const matches = window.location.search.match(regex);
    if (matches && matches.length > 1) {
        return parseInt(matches[1], 10);
    }
    else {
        return 10000;
    }
};

const starCountParam = parseStarCountParam();

function runGame(canvas: HTMLCanvasElement) {
    const gl = getWebGLContext(canvas);

    const getCenter = function (): Vec2D {
        return { x: canvas.width / 2, y: canvas.height / 2 };
    };

    const canvasToWorld = function (canvasPos: Vec2D): Vec2D {
        const halfWidth = canvas.width / 2;
        const halfHeight = canvas.height / 2;

        return vec(canvasPos.x - halfWidth, -canvasPos.y + halfHeight);
    }

    const worldToCanvas = function (worldPos: Vec2D): Vec2D {
        const halfWidth = canvas.width / 2;
        const halfHeight = canvas.height / 2;

        return vec(worldPos.x + halfWidth, -worldPos.y + halfHeight);
    }

    const galaxy = new Galaxy({
        center: vec(0, 0),
        rotationSpeed: 0.0,
        size: 400,
        sizeRatio: 0.875,
        starCount: starCountParam
    });

    let galaxyRenderer: GalaxyRenderer;

    const setupWebGL = function () {
        gl.clearColor(0.0, 0.0, 0, 0);
        gl.disable(gl.DEPTH_TEST);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);

        galaxyRenderer = new GalaxyRenderer(gl, galaxy);
    };

    const clearCanvas = function () {
        gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const setupViewport = function () {
        gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const fitCanvasToWindow = function () {
        let sizeChanged = false;

        if (canvas.width != window.innerHeight) {
            canvas.width = window.innerWidth;
            sizeChanged = true;
        }
        if (canvas.height != window.innerHeight) {
            canvas.height = window.innerHeight;
            sizeChanged = true;
        }

        if (sizeChanged) {
            setupViewport();
        }
    };

    let worldPosition: Vec2D;
    let worldScale = 1;
    let worldTranslation = vec(0, 0);

    //const getScreenTopLeftPosition = function(scale?: number) {
    //    scale = scale || worldScale;
    //    return vec(worldPosition.x * scale - (canvas.width / 2), worldPosition.y * scale - canvas.height / 2);
    //};

    let currentTime = 0;

    const drawObjects = function (time: number) {
        worldPosition = worldPosition || getCenter();

        galaxyRenderer.render(gl, time, {
            scale: worldScale,
            translation: worldTranslation,
            viewportSize: vec(canvas.width, canvas.height)
        });
        //const topLeft = getScreenTopLeftPosition();
        //context.setTransform(worldScale, 0, 0, worldScale, -topLeft.x, -topLeft.y);
        //galaxy.draw(context, time);
    };

    const processFrame = function (dt: number, time: number) {
        currentTime = time;

        fitCanvasToWindow();
        clearCanvas();
        drawObjects(time);
    };

    const hookMouseEvents = function () {
        const body = document.getElementsByTagName('body')[0];
        let initialMousePos: Vec2D = null;
        let mousePressed = false;
        let initialPosition: Vec2D;

        canvas.addEventListener('mousedown', (event: MouseEvent) => {
            if (event.button == 0) {
                mousePressed = true;
            }
        });

        canvas.addEventListener('mouseup', (event: MouseEvent) => {
            if (event.button == 0) {
                mousePressed = false;
            }
        });

        canvas.addEventListener('mousemove', (event: MouseEvent) => {
            // const markerElem = document.getElementById('selectionMarker');
            const clickPos = canvasToWorld(vec(event.offsetX, event.offsetY));
            const nearestStarPos = galaxy.getNearestStarPosition(clickPos, currentTime, 10);
            console.log(`nearestStarPos = ${JSON.stringify(nearestStarPos)}`)

            if (nearestStarPos) {
                const celestialBodyId = nearestStarPos.x ^ nearestStarPos.y;
                const markerPos = worldToCanvas(nearestStarPos);
                console.log(`markerPos = ${JSON.stringify(markerPos)}`);
                // markerElem.style.left = `${markerPos.x}px`;
                // markerElem.style.top = `${markerPos.y}px`;
                // markerElem.style.display = 'block';

                let ce: CustomEvent = new CustomEvent('celestialBodyEvent');
                ce.initCustomEvent('celestialBodyEvent', true, true, { event: event, id: celestialBodyId });
                canvas.dispatchEvent(ce);
            }
            else {
                // markerElem.style.display = 'none';

                let ce: CustomEvent = new CustomEvent('celestialBodyLeaveEvent');
                ce.initCustomEvent('celestialBodyLeaveEvent', true, true, { event: event, id: -1 });
                canvas.dispatchEvent(ce);
            }
        });

        // canvas.addEventListener('wheel', (event: WheelEvent) => {
        //     worldScale -= event.deltaY * 0.001;
        //     if (worldScale < 0.0001) {
        //         worldScale = 0.0001;
        //     }
        // });

        canvas.addEventListener('click', (event: MouseEvent) => {
            console.log(`x: ${event.x} y: ${event.y}`);
            if (event.button == 0 && event.altKey) {
                // Gui.popup(event);
            }
        });

    };

    const runMainLoop = function () {
        const getCurrentTime = () => new Date().getTime() / 1000;
        let lastTime = getCurrentTime();
        let elapsedTime = 0;

        setupWebGL();
        setupViewport();

        const mainLoopStep = function () {
            const currentTime = getCurrentTime();
            const deltaTime = currentTime - lastTime;

            elapsedTime += deltaTime;

            processFrame(deltaTime, elapsedTime);
            lastTime = currentTime;
            requestAnimationFrame(mainLoopStep);
        };

        mainLoopStep();
    };

    hookMouseEvents();
    runMainLoop();
}

export function run(): void {
    const canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
    runGame(canvas);
}
