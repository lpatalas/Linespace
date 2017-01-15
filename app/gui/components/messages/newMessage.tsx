import * as React from 'react';

export interface NewMessageProps { close: any }
export class NewMessageComponent extends React.Component<NewMessageProps, undefined> {

    render() {
        return (
            <div className="new-message-container">
                <h2>new message</h2>
                <button onClick={() => this.props.close()}>close</button>
                <form>
                    <input type="text" placeholder="subject" />
                    <textarea placeholder="message"></textarea>

                    <button>Cancel</button>
                    <button>Send</button>
                </form>
            </div>
        );
    }
}