import { Galaxy } from './rendering/galaxy';
import { GalaxyRenderer } from './rendering/galaxyRenderer';
import { Vec2D, vec, vcopy, vsub } from './common/vec2D';
import { Game } from './game'

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

    const hookMouseEvents = function (game: Game, galaxy: Galaxy) {
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
            const clickPos = game.canvasToWorld(vec(event.offsetX, event.offsetY));
            const nearestStarPos = galaxy.getNearestStarPosition(clickPos, game.getGameTime(), 10);
            console.log(`nearestStarPos = ${JSON.stringify(nearestStarPos)}`)

            if (nearestStarPos) {
                const celestialBodyId = nearestStarPos.x ^ nearestStarPos.y;
                const markerPos = game.worldToCanvas(nearestStarPos);
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

        canvas.addEventListener('click', (event: MouseEvent) => {
            console.log(`x: ${event.x} y: ${event.y}`);
            if (event.button == 0 && event.altKey) {
                // Gui.popup(event);
            }
        });

    };

	const game = new Game(canvas, window);

    const galaxy = new Galaxy({
        center: vec(0, 0),
        rotationSpeed: 0.01,
        size: 400,
        sizeRatio: 0.875,
        starCount: starCountParam
    });

    const runMainLoop = function () {
        game.setup();
		game.showGalaxy(galaxy);

        const mainLoopStep = function () {
			game.update();
            requestAnimationFrame(mainLoopStep);
        };

        mainLoopStep();
    };

    hookMouseEvents(game, galaxy);
    runMainLoop();
}

export function run(): void {
    const canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
    runGame(canvas);
}
