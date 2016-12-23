import * as React from 'react';
import { browserHistory } from 'react-router'
import { run } from '../../main';

export interface GameProps { }

// 'GameProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class GameComponent extends React.Component<GameProps, undefined> {

    componentDidMount() {
        run();
    }

    changeZoom(zoom: number){
        console.log(`... Zoom changed to: ${zoom} ...`);
    }

    logout(){
        browserHistory.push('/');
    }

    reports(){
        console.log('... display reports ...');
    }

    messages(){
        console.log('... display messages ...');
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
                        <li>- <a href="#" onClick={() => this.messages()}>Messages</a></li>
                        <li>- <a href="#" onClick={() => this.reports()}>Reports</a></li>
                        <li>- <a href="#" onClick={() => this.logout()}>Logout</a></li>
                    </ul>
                </aside>

            </div>
        );
    }
}