import { RegisterComponent } from './register';
import { PopupComponent } from '../popups/popup';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory } from 'react-router'
import { run } from '../../main';

export interface GameProps { }
export interface GameState { }

// 'GameProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class GameComponent extends React.Component<GameProps, GameState> {

    constructor() {
        super();
    }

    componentDidMount() {
        run();
    }

    changeZoom(zoom: number) {
        console.log(`... Zoom changed to: ${zoom} ...`);
    }

    logout = () => {
        console.log('... logout ...');
        browserHistory.push('/');
    }

    login = () => {
        console.log('... login ...');
        browserHistory.push('/login');
    }

    reports = () => {
        console.log('... display reports ...');
        this.openPopup();        
    }

    messages = () => {
        this.openPopup();
        console.log('... display messages ...');
    }

    register = () => {
        console.log('... register ...');
        browserHistory.push('/register');
        this.openPopup();
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

                <aside className="aside-menu">
                    <ul>
                        <li><a href="#" onClick={this.messages} title="Messages"><i className="fa fa-envelope fa-2x" aria-hidden="true"></i></a></li>
                        <li><a href="#" onClick={this.reports} title="Reports"><i className="fa fa-book fa-2x" aria-hidden="true"></i></a></li>
                        <li><a href="#" onClick={this.login} title="Login"><i className="fa fa-sign-in fa-2x" aria-hidden="true"></i></a></li>
                        <li><a href="#" onClick={this.logout} title="Logout"><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></a></li>
                        <li><a href="#" onClick={this.register} title="Register for FREE."><i className="fa fa-user-plus fa-2x" aria-hidden="true"></i></a></li>
                    </ul>
                </aside>

                <div id="popup-placeholder"></div>
            </div>
        );
    }

    

    private openPopup(){
        ReactDOM.render((<PopupComponent children={this.props.children} closePopup={this.closePopup} />), document.getElementById('popup-placeholder'));
    }

    private closePopup(){
        ReactDOM.unmountComponentAtNode(document.getElementById('popup-placeholder'));
    }
}