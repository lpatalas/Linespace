import * as React from 'react';
import { Link } from 'react-router';


// 'WelcomeProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class WelcomeComponent extends React.Component<undefined, undefined> {

    render() {
        return (
            // <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>
            <article className="welcome">
                <section className="game-header">
                    <h1>Linespace</h1>
                    <h2>Extend your horizon!</h2>

                    <h2><Link to="/about">About us</Link></h2>
                    <h3><Link to="login">Login to the game</Link></h3>
                    <h4><Link to="register">Register for free</Link></h4>
                </section>
                <section className="game-content">
                    {this.props.children}
                </section>
            </article>

        );
    }
}