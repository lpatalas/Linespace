import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NewMessageComponent } from '../components/messages/newMessage';
import { ReadMessageComponent } from '../components/messages/readMessage';

export interface MessagesMenuState { isNewMessageOpen: boolean, isReadMessageOpen: boolean }

export class MessagesMenuComponent extends React.Component<undefined, MessagesMenuState> {

    constructor() {
        super();
        this.state = { isNewMessageOpen: false, isReadMessageOpen: false };
    }

    private toggleNewMessage() {
        var newState = Object.assign({}, this.state, { isNewMessageOpen: !this.state.isNewMessageOpen });
        this.setState(newState);
    }

    private toggleReadMessage() {
        var newState = Object.assign({}, this.state, { isReadMessageOpen: !this.state.isReadMessageOpen });
        this.setState(newState);
    }

    render() {
        return (
            <div className="messages-menu-container">

                <div>
                    <h1>Message box</h1>
                    <a href="#" className="button" onClick={() => this.toggleNewMessage()}>Write new</a>
                </div>

                {
                    this.state.isNewMessageOpen ? <NewMessageComponent close={() => this.toggleNewMessage()} /> : null
                }


                {
                    this.state.isReadMessageOpen ? <ReadMessageComponent close={() => this.toggleReadMessage()} /> : null
                }

                {
                    !(this.state.isNewMessageOpen || this.state.isReadMessageOpen) ?

                        <table>
                            <thead>
                                <tr>
                                    <td>Date</td>
                                    <td>From</td>
                                    <td>Title</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr onClick={() => this.toggleReadMessage()}>
                                    <td>01/02/2017</td>
                                    <td>Somebody</td>
                                    <td>Hi, there what's up in da game?</td>
                                </tr>
                                <tr onClick={() => this.toggleReadMessage()}>
                                    <td>01/02/2017</td>
                                    <td>Somebody</td>
                                    <td>Hi, there what's up in da game?</td>
                                </tr>
                                <tr onClick={() => this.toggleReadMessage()}>
                                    <td>01/02/2017</td>
                                    <td>Somebody</td>
                                    <td>Hi, there what's up in da game?</td>
                                </tr>
                                <tr onClick={() => this.toggleReadMessage()}>
                                    <td>01/02/2017</td>
                                    <td>Somebody</td>
                                    <td>Hi, there what's up in da game?</td>
                                </tr>
                                <tr onClick={() => this.toggleReadMessage()}>
                                    <td>01/02/2017</td>
                                    <td>Somebody</td>
                                    <td>Hi, there what's up in da game?</td>
                                </tr>
                                <tr onClick={() => this.toggleReadMessage()}>
                                    <td>01/02/2017</td>
                                    <td>Somebody</td>
                                    <td>Hi, there what's up in da game?</td>
                                </tr>
                                <tr onClick={() => this.toggleReadMessage()}>
                                    <td>01/02/2017</td>
                                    <td>Somebody</td>
                                    <td>Hi, there what's up in da game?</td>
                                </tr>
                                <tr onClick={() => this.toggleReadMessage()}>
                                    <td>01/02/2017</td>
                                    <td>Somebody</td>
                                    <td>Hi, there what's up in da game?</td>
                                </tr>
                                <tr onClick={() => this.toggleReadMessage()}>
                                    <td>01/02/2017</td>
                                    <td>Somebody</td>
                                    <td>Hi, there what's up in da game?</td>
                                </tr>
                            </tbody>
                        </table>
                        : null
                }
            </div>
        );
    }
}