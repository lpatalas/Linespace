import * as React from 'react';
import { browserHistory } from 'react-router'

import { PopupComponent, Resource } from '../popups/gui';

export interface LoginProps { }
export interface LoginState { isPopupVisible: boolean }

// 'WelcomeProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class LoginComponent extends React.Component<LoginProps, LoginState> {

    constructor() {
        super();
        this.state = { isPopupVisible: false };
    }

    onLogin = () => {
        // if we are logged in redirect to the game
        browserHistory.push('/game');
    }

    render() {
        let resources: Resource[] = [];

        let item1 = new Resource();
        item1.amount = 2145280000;
        item1.name = "Water";
        item1.volume = "m^3";
        resources.push(item1);

        let item2 = new Resource();
        item2.amount = 20000;
        item2.name = "Iron ore";
        item2.volume = "m^3";
        resources.push(item2);

        return (
            <div>
                <button type="submit" onClick={this.onLogin}>Login using Facebook</button>
            </div>
        );
    }
}