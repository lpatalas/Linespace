import * as React from 'react';
import { browserHistory } from 'react-router'
import { run } from '../../main';


export class Resource { name: string; amount: number; volume: string }

export interface PopupProps { title: string, resources: Resource[] }

export class PopupComponent extends React.Component<PopupProps, undefined> {

    private generateTable() {
        return (
            <table>
                <thead>
                    <tr>
                        <td>Resource</td>
                        <td>Amount</td>
                        <td>Volume</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.resources.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                                <td>{item.volume}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }

    render() {
        let table = this.generateTable();

        return (
            <div className="popup-container">
                <div className="popup">
                    <div className="header">
                        <p className="display-inline-block">{this.props.title}</p>
                        <p className="display-inline-block float-right"><a id="close" href="#">X</a></p>
                    </div>
                    <div className="clearboth"></div>
                    <div className="content">

                        {table}

                    </div>
                </div>
            </div>
        );
    }
}