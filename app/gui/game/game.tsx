import { EventManager } from '../../shared/eventManager';
import { SimplePopupComponent } from '../popups/simplePopup';
import { RegisterComponent } from './register';
import { PopupComponent } from '../popups/popup';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory } from 'react-router'
import { SideMenuComponent } from '../menu/sideMenu';
import { Game } from "../../game";
import { vec } from "../../common/vec2D";
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
		const galaxy = new Galaxy({
			center: vec(0, 0),
			rotationSpeed: 0.03,
			size: 400,
			sizeRatio: 0.875,
			starCount: 10000
		});
		this.game.showGalaxy(galaxy);
	}

	private showSolarSystem = () => {
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
