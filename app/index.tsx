import * as React from "react";
import * as ReactDOM from "react-dom";
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import { WelcomeComponent } from "./gui/game/welcome";
import { LoginComponent } from "./gui/game/login";
import { GameComponent } from './gui/game/game'

const About = () => (
    <div>
        <h2>About us</h2>
    </div>
)

const RegistrationComponent = () => (
    <div>
        <h2>Here will be registration form. May be ... :)</h2>
    </div>
)

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={WelcomeComponent}>
            <Route path="/login" component={LoginComponent} />
            <Route path="/about" component={About} />
            <Route path="/register" component={RegistrationComponent} />
        </Route>
        <Route path="/game" component={GameComponent} />
    </Router>
), document.getElementById('main-container'))