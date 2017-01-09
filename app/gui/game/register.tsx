import { PopupComponent } from '../popups/popup';
import * as React from 'react';
import * as ReactDOM from "react-dom";
import { browserHistory } from 'react-router'

export interface RegisterProps {  }
export interface RegisterState { isPopupVisible: boolean }

// 'RegisterProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class RegisterComponent extends React.Component<RegisterProps, RegisterState> {

    constructor() {
        super();
    }

    onRegister = () => {
        console.log('... register ...')
    }

    private closePopup = () =>  {
        ReactDOM.unmountComponentAtNode(document.getElementById('popup-placeholder'));
    }

    // render() {
    //     return (

    //         <PopupComponent closePopup={this.closePopup} children={this.props.children}  />

    //     );
    // }

    render() {

        return (
            <div className="register-container">
                <div>
                    <div className="register-container__header">
                    </div>
                    <div className="register-container__body">
                        <form>
                            <input type="email" placeholder="email" />
                            <input type="password" placeholder="password" />
                            <input type="password" placeholder="confirm password" />
                            <button type="submit">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}