﻿import { GuiBootstrapper } from './gui/gui-bootstrapper';
import { Galaxy } from './rendering/galaxy';
import { GalaxyRenderer } from './rendering/galaxyRenderer';
import { Vec2D, vec, vcopy, vsub } from './common/vec2D';
import {Gui} from './gui/popups/gui';

const getWebGLContext = function(canvas: HTMLCanvasElement): WebGLRenderingContext {
    const context = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return context;    
};

const parseStarCountParam = function() {
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
const guiBootstrapper = new GuiBootstrapper();

function runGame(canvas: HTMLCanvasElement) {
    const gl = getWebGLContext(canvas);
    
    const getCenter = function(): Vec2D {
        return { x: canvas.width / 2, y: canvas.height / 2 };
    };

    const galaxy = new Galaxy({
        center: vec(0, 0),
        rotationSpeed: 0.05,
        size: 400,
        sizeRatio: 0.875,
        starCount: starCountParam
    });

    let galaxyRenderer: GalaxyRenderer;

    const setupWebGL = function() {
        gl.clearColor(0.0, 0.0, 0, 0);
        gl.disable(gl.DEPTH_TEST);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);

        galaxyRenderer = new GalaxyRenderer(gl, galaxy);
    };

    const clearCanvas = function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const setupViewport = function() {
        gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const fitCanvasToWindow = function() {
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

    //const getScreenTopLeftPosition = function(scale?: number) {
    //    scale = scale || worldScale;
    //    return vec(worldPosition.x * scale - (canvas.width / 2), worldPosition.y * scale - canvas.height / 2);
    //};

    const drawObjects = function(time: number) {
        worldPosition = worldPosition || getCenter();

        galaxyRenderer.render(gl, time, {
            scale: worldScale,
            viewportSize: vec(canvas.width, canvas.height)
        });
        //const topLeft = getScreenTopLeftPosition();
        //context.setTransform(worldScale, 0, 0, worldScale, -topLeft.x, -topLeft.y);
        //galaxy.draw(context, time);
    };

    const processFrame = function(dt: number, time: number) {
        fitCanvasToWindow();
        clearCanvas();
        drawObjects(time);
    };

    const hookMouseEvents = function() {
        const body = document.getElementsByTagName('body')[0];
        let initialMousePos: Vec2D = null;
        let mousePressed = false;
        let initialPosition: Vec2D;

        body.addEventListener('mousedown', (event: MouseEvent) => {
            if (event.button == 0) {
                mousePressed = true;
                initialMousePos = vec(event.pageX, event.pageY);
                initialPosition = vcopy(worldPosition);
            }
        });

        body.addEventListener('mouseup', (event: MouseEvent) => {
            if (event.button == 0) {
                mousePressed = false;
            }
        });

        body.addEventListener('mousemove', (event: MouseEvent) => {
            if (mousePressed) {
                const currentMousePos = vec(event.pageX, event.pageY);
                const offset = vsub(currentMousePos, initialMousePos);
                offset.x /= worldScale;
                offset.y /= worldScale;
                worldPosition = vsub(initialPosition, offset);
            }
        });

        body.addEventListener('wheel', (event: WheelEvent) => {
            worldScale -= event.deltaY * 0.001;
            if (worldScale < 0.0001) {
                worldScale = 0.0001;
            }
        });



        body.addEventListener('click', (event: MouseEvent) => {
            if (event.button == 0 && event.altKey) {
                Gui.popup(event);
            }
        });
    };

    const runMainLoop = function() {
        const getCurrentTime = () => new Date().getTime() / 1000;
        let lastTime = getCurrentTime();
        let elapsedTime = 0;

        setupWebGL();
        setupViewport();

        const mainLoopStep = function() {
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
    guiBootstrapper.init();
}

const canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
runGame(canvas);

// export function run() : void{
//     const canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
//     runGame(canvas);
// }