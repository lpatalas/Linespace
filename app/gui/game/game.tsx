import { EventManager } from '../../shared/eventManager';
import { SimplePopupComponent } from '../popups/simplePopup';
import { RegisterComponent } from './register';
import { PopupComponent } from '../popups/popup';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory } from 'react-router'
import { SideMenuComponent } from '../menu/sideMenu';
import { Game } from "../../game";
import { vec, Vec2D } from "../../common/vec2D";
import { Galaxy } from "../../rendering/galaxy";
import { createRandomSolarSystem } from "../../rendering/solarSystem";

export interface GameProps {
}

export interface GameState {
    isPopupVisible: boolean;
    isMenuDialogVisible: boolean;
    isSideMenuCollapsed: boolean;
}

function getCanvas(id: string) {
    return document.getElementById(id) as HTMLCanvasElement;
}

// 'GameProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class GameComponent extends React.Component<GameProps, GameState> {

    private canvas2d: HTMLCanvasElement;
    private canvas3d: HTMLCanvasElement;
    private popupId: number;
    private popupX: number;
    private popupY: number;
	private game: Game;
	private galaxy: Galaxy;

    constructor() {
        super();

        this.state = { isPopupVisible: false, isSideMenuCollapsed: false, isMenuDialogVisible: false };
    }

    componentDidMount() {
		this.game = new Game(this.canvas2d, this.canvas3d, window);
		this.game.run();

		if (window.location.search.indexOf('mode=ss') >= 0) {
			this.showSolarSystem();
		}
		else {
			this.showGalaxy();
		}

        let eventHandle = EventManager.GetGameEventHandle();
		const body = document.getElementsByTagName('body')[0];
		let initialMousePos: Vec2D = null;
		let mousePressed = false;
		let initialPosition: Vec2D;

		this.canvas3d.addEventListener('mousedown', (event: MouseEvent) => {
			if (event.button == 0) {
				mousePressed = true;
			}
		});

		this.canvas3d.addEventListener('mouseup', (event: MouseEvent) => {
			if (event.button == 0) {
				mousePressed = false;
			}
		});

		eventHandle.addEventListener('mousemove', (event: MouseEvent) => {
			// const markerElem = document.getElementById('selectionMarker');
			const clickPos = this.game.canvasToWorld(vec(event.offsetX, event.offsetY));
			const nearestStarPos = this.galaxy.getNearestStarPosition(clickPos, this.game.getGameTime(), 10);
			//console.log(`nearestStarPos = ${JSON.stringify(nearestStarPos)}`)

			if (nearestStarPos) {
				const celestialBodyId = nearestStarPos.x ^ nearestStarPos.y;
				const markerPos = this.game.worldToCanvas(nearestStarPos);
				//console.log(`markerPos = ${JSON.stringify(markerPos)}`);
				// markerElem.style.left = `${markerPos.x}px`;
				// markerElem.style.top = `${markerPos.y}px`;
				// markerElem.style.display = 'block';

				let ce: CustomEvent = new CustomEvent('celestialBodyEvent');
				ce.initCustomEvent('celestialBodyEvent', true, true, { event: event, id: celestialBodyId });

				eventHandle.dispatchEvent(ce);
			}
			else {
				// markerElem.style.display = 'none';

				let ce: CustomEvent = new CustomEvent('celestialBodyLeaveEvent');
				ce.initCustomEvent('celestialBodyLeaveEvent', true, true, { event: event, id: -1 });
				eventHandle.dispatchEvent(ce);
			}
		});

		this.canvas3d.addEventListener('click', (event: MouseEvent) => {
			//console.log(`x: ${event.x} y: ${event.y}`);
			if (event.button == 0 && event.altKey) {
				// Gui.popup(event);
			}
		});

        eventHandle.addEventListener('celestialBodyEvent', (event: CustomEvent) => {

            if (!event.detail)
                return;

            this.popupX = event.detail.event.x + 10;
            this.popupY = event.detail.event.y + 20;

            if (event.detail.id == this.popupId)
                return;

            if (event.detail.id <= 0) {
                this.popupId = event.detail.id;
            }

            this.closePopup();
            this.openPopup();

            this.popupId = event.detail.id;
        });

        eventHandle.addEventListener('celestialBodyLeaveEvent', (event: Event) => {
            this.closePopup();
        });

    }

    render() {
        return (
            <div>

                <div id="game-event-handle"></div>

                <div className="game-ui">

                    <div className="canvas-container">
                        <canvas className="game-canvas" ref={elem => this.canvas3d = elem}></canvas>
                        <canvas className="game-canvas" ref={elem => this.canvas2d = elem}></canvas>
                    </div>

                    <div id="selectionMarker"></div>

                    <div className="galactic-zoom">
                        <div>
                            <h2>Galactic zoom</h2>
                        </div>
                        <div className="zoom-body">
                            <a onClick={this.showGalaxy}>Galaxy</a>
                            <a onClick={this.showSolarSystem}>Solar System</a>
                        </div>
                    </div>

                    <div className="main-menu">
                        <div className="menu-item">
                            <a></a>
                        </div>
                    </div>

                    <SideMenuComponent executeAction={this.openDialog} />

                    {
                        (this.state.isPopupVisible && !this.state.isMenuDialogVisible) && <SimplePopupComponent header={"celestial body id: " + this.popupId} body="popup body" closePopup={this.closePopup} isDialog={false} x={this.popupX} y={this.popupY} />
                    }

                    {
                        this.state.isMenuDialogVisible && <SimplePopupComponent header="menu" children={this.props.children} closePopup={this.closeDialog} isDialog={true} />
                    }
                </div>
            </div>
        );
    }

	private showGalaxy = () => {
		this.galaxy = new Galaxy({
			center: vec(0, 0),
			rotationSpeed: 0.03,
			size: 400,
			sizeRatio: 0.875,
			starCount: 10000
		});
		this.game.showGalaxy(this.galaxy);
	}

	private showSolarSystem = () => {
		this.galaxy = null;
		const solarSystem = createRandomSolarSystem();
		this.game.showSolarSystem(solarSystem);
	}

    private toggleSideMenu = () => {
        const newState = Object.assign({}, this.state, { isSideMenuCollapsed: !this.state.isSideMenuCollapsed });
        this.setState(newState);
    }

    private openDialog = () => {
        const newState = Object.assign({}, this.state, { isMenuDialogVisible: true });
        this.setState(newState);
    }

    private closeDialog = () => {
        const newState = Object.assign({}, this.state, { isMenuDialogVisible: false });
        this.setState(newState);
    }

    private openPopup = () => {
        const newState = Object.assign({}, this.state, { isPopupVisible: true });
        this.setState(newState);
    }

    private closePopup = () => {
        const newState = Object.assign({}, this.state, { isPopupVisible: false });
        this.setState(newState);
    }
}
