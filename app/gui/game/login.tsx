import * as React from 'react';
import { browserHistory } from 'react-router'

import { PopupComponent } from '../popups/gui';

export interface LoginProps { login: string; password: string }
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

    onRegister = () => {
        alert('contact us in case of new account!');
    }

    onPopup = () => {
        this.setState({ isPopupVisible: !this.state.isPopupVisible });
    }

    render() {
        return (
            <div>
                <ul>
                    <li><input type="text" /></li>
                    <li><input type="password" /></li>
                    <li>
                        <button type="submit" onClick={this.onLogin}>Login</button>
                        or <a href="#" onClick={this.onRegister}>Register for free!</a>
                    </li>
                    <li><a href="#" onClick={this.onPopup}>show popup</a></li>
                </ul>
                {
                    this.state.isPopupVisible && <PopupComponent title="test" />
                }

            </div>
        );
    }
}