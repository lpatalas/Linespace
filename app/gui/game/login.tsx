import * as React from 'react';
import { browserHistory } from 'react-router'

import { PopupComponent, Resource } from '../popups/gui';

export interface LoginProps { login: string; password: string }
export interface LoginState { isPopupVisible: boolean }

// 'WelcomeProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class LoginComponent extends React.Component<LoginProps, LoginState> {

    constructor() {
        super();
        this.state = { isPopupVisible: false };
    }

    onLogin() {
        // if we are logged in redirect to the game
        browserHistory.push('/game');
    }

    onRegister() {
        alert('contact us in case of new account!');
    }

    onPopup() {
        this.setState({ isPopupVisible: !this.state.isPopupVisible });
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
                <ul>
                    <li><input type="text" /></li>
                    <li><input type="password" /></li>
                    <li>
                        <button type="submit" onClick={() => this.onLogin()}>Login</button>
                        or <a href="#" onClick={() => this.onRegister()}>Register for free!</a>
                    </li>
                    <li><a href="#" onClick={() => this.onPopup()}>show popup</a></li>
                </ul>
                {
                    this.state.isPopupVisible ? <PopupComponent title="test" resources={resources} /> : null
                }

            </div>
        );
    }
}