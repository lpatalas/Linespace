import { RegisterComponent } from './register';
import { PopupComponent } from '../popups/popup';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory } from 'react-router'
import { run } from '../../main';
import { SideMenuComponent } from '../menu/sideMenu';

export interface GameProps {
}

export interface GameState {
    isPopupVisible: boolean;
    isSideMenuCollapsed: boolean;
}

// 'GameProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class GameComponent extends React.Component<GameProps, GameState> {

    constructor() {
        super();

        this.state = { isPopupVisible: false, isSideMenuCollapsed: false };
    }

    componentDidMount() {
        run();
    }

    changeZoom(zoom: number) {
        console.log(`... Zoom changed to: ${zoom} ...`);
    }

    render() {
        return (
            <div className="game-ui">

                <canvas id="gameCanvas"></canvas>

                <div className="galactic-zoom">
                    <div>
                        <h2>Galactic zoom</h2>
                    </div>
                    <div className="zoom-body">
                        <a onClick={() => this.changeZoom(1)}>- 1 -</a>
                        <a onClick={() => this.changeZoom(2)}>- 2 -</a>
                        <a onClick={() => this.changeZoom(3)}>- 3 -</a>
                    </div>
                </div>

                <div className="main-menu">
                    <div className="menu-item">
                        <a></a>
                    </div>
                </div>

                <SideMenuComponent executeAction={this.openPopup} />

                {
                    this.state.isPopupVisible && <PopupComponent children={this.props.children} closePopup={this.closePopup} />
                }
            </div>
        );
    }

    private toggleSideMenu = () => {
        const newState = Object.assign({}, this.state, { isSideMenuCollapsed: !this.state.isSideMenuCollapsed });
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