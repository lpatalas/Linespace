import * as React from 'react';

export interface ReadMessageProps { close: any }
export class ReadMessageComponent extends React.Component<ReadMessageProps, undefined> {

    render() {
        return (
            <div className="read-message-container">
                <h2>read messages</h2>
                <button onClick={() => this.props.close()}>close</button>

                <section>
                    <span>from:</span>
                    <p>Ricardo</p>

                    <span>send date:</span>
                    <p>01.01.2016</p>

                    <span>title:</span>
                    <p>What's up there</p>

                    <span>message:</span>
                    <p>here goes message</p>

                    <a href="#">Reply</a>
                </section>
            </div>
        );
    }
}