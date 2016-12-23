import * as React from 'react';
import { browserHistory } from 'react-router'
import { run } from '../../main';


export interface PopupProps { title: string }

export class PopupComponent extends React.Component<PopupProps, undefined> {
    render() {
        return (
            <div className="popup-container">
                <div className="popup">
                    <div className="header">
                        <p className="display-inline-block">{this.props.title}</p>
                        <p className="display-inline-block float-right"><a id="close" href="#">X</a></p>
                    </div>
                    <div className="clearboth"></div>
                    <div className="content">

                        <table>
                            <thead>
                                <tr>
                                    <td>Resource</td>
                                    <td>Amount</td>
                                    <td>Volume</td>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>Water</td>
                                    <td>2 145 280 000</td>
                                    <td>m^3</td>
                                </tr>
                                <tr>
                                    <td>Iron ore</td>
                                    <td>20 000</td>
                                    <td>m^3</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

