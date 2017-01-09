import * as React from 'react';
import { browserHistory } from 'react-router'

export interface PopupProps { closePopup: any }
export interface PopupState { }

export class PopupComponent extends React.Component<PopupProps, PopupState> {
    private popupSlideInSClass = 'popup-container-sladein';

    constructor() {
        super();
        this.state = { isPopupVisible: true };
    }


    close = () => {
        console.log('... closing popup ...');
        this.props.closePopup();
        // this.props = Object.assign({}, this.props, { isPopupVisible: false });
    }

    render() {
        return (
            <div className={"popup-container " + this.popupSlideInSClass}>
                <div className="popup-container-box">
                    <div className="popup-container__header">
                        <a onClick={this.close} href="#">X</a>
                    </div>
                    <div className="popup-container__body">
                        {this.props.children}
                    </div>
                    <div className="popup-container__footer">

                    </div>
                </div>
            </div>
        );
    }

}