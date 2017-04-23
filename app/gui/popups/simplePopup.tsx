import * as React from 'react';

export interface SimplePopupProps { closePopup: any, header: string, body?: string, isDialog: boolean }

export class SimplePopupComponent extends React.Component<SimplePopupProps, undefined> {

    close = () => {
        console.log('... closing popup ...');
        this.props.closePopup();
    }

    render() {

        let popupBody = this.props.body ? this.props.body : this.props.children;

        return (
            <div className={this.props.isDialog ? "single-popup-container single-popup-container__dialog" : "single-popup-container" }>

                <div className="container__header appear-animation">
                    <div className="circle__box">
                        {/*<svg xmlns="http://www.w3.org/2000/svg" className="header-icon">
                            <circle className="circle rotate" cx="21" cy="21" r="20" strokeLinecap="round" strokeDasharray="5,5" fill="none" />
                        </svg>*/}
                    </div>
                    <div className="horizontal-line__block extend-horizontal">
                        <p className="horizontal-line__block__caption" title={this.props.header}>{this.props.header}</p>
                        <span className="horizontal-line"></span>
                        <a onClick={this.close}><span className="close-button fa fa-times fa-lg"></span></a>
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