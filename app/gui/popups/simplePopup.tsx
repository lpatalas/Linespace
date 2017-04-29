import { EventManager } from '../../shared/eventManager';
import * as React from 'react';
import { CSSProperties } from "react";

export interface SimplePopupProps { closePopup: any, header: string, body?: string, isDialog: boolean, x?: number, y?: number }
export interface SimplePopupState { popupPosition: any }

export class SimplePopupComponent extends React.Component<SimplePopupProps, SimplePopupState> {

    // private popupPosition = (this.props) ? { top: this.props.y, left: this.props.x, position: 'absolute' } : null;
    private _windowHeight: number;
    private _windowWidth: number;

    constructor() {
        super();

        this._windowHeight = 300;
        this._windowWidth = 300;

        this.state = { popupPosition: null };
    }

    componentDidMount() {
        if (!this.props.isDialog) {
            const eventHandle = EventManager.GetGameEventHandle();
            eventHandle.addEventListener('mousemove', (event: MouseEvent) => {
                let topX  = event.movementX;
                let topY = event.movementY;

                // if(topX + this._windowWidth > window.screen.availWidth){
                //     topX = window.screen.availWidth - this._windowWidth - 10;
                // }

                // if(topY + this._windowHeight > window.screen.availHeight){
                //     topX = window.screen.availHeight - this._windowHeight - 10;
                // }

                Object.assign({}, this.state, { popupPosition: { top: topY, left: topX, position: 'absolute' } })
            });
        }
    }

    close = () => {
        console.log('... closing popup ...');
        this.props.closePopup();
    }

    render() {

        let popupBody = this.props.body ? this.props.body : this.props.children;
        this.state = this.props.x && this.props.y ?
            Object.assign({}, this.state, { popupPosition: { top: this.props.y, left: this.props.x, position: 'absolute' } })
            : Object.assign({}, this.state, { popupPosition: null })

        return (
            <div style={this.state.popupPosition} className={this.props.isDialog ? "single-popup-container single-popup-container__dialog" : "single-popup-container"}>

                <div className="container__header appear-animation">
                    <div className="circle__box">
                        {/*<svg xmlns="http://www.w3.org/2000/svg" className="header-icon">
                            <circle className="circle rotate" cx="21" cy="21" r="20" strokeLinecap="round" strokeDasharray="5,5" fill="none" />
                        </svg>*/}
                    </div>
                    <div className="horizontal-line__block extend-horizontal">
                        <p className="horizontal-line__block__caption" title={this.props.header}>{this.props.header}</p>
                        <span className="horizontal-line"></span>
                        {this.props.isDialog ?
                            <a onClick={this.close}><span className="close-button fa fa-times fa-lg"></span></a>
                            :
                            null
                        }

                    </div>
                </div>

                <div className="container__body extend">
                    <div className="container__body-blurred"></div>
                    <div className="container__body__content">
                        <div className="container__body__content__inner-content">

                            {popupBody}
                            {/*<table>
                                <thead>
                                    <tr>
                                        <td>Name</td>
                                        <td>Amount</td>
                                        <td>volume</td>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Iron</td>
                                        <td>1 000 000</td>
                                        <td>m^3</td>
                                    </tr>
                                    <tr>
                                        <td>Coal</td>
                                        <td>13 000 000</td>
                                        <td>m^3</td>
                                    </tr>
                                </tbody>
                            </table>*/}
                        </div>
                    </div>

                </div>

            </div>

        );
    }
}