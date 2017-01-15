import * as React from "react";
import * as ReactDOM from "react-dom";
import { browserHistory, Router, Route, Link, withRouter, Redirect } from 'react-router';
import { WelcomeComponent } from "./gui/game/welcome";
import { LoginComponent } from "./gui/game/login";
import { GameComponent } from './gui/game/game'
import { RegisterComponent } from './gui/game/register';
import { MessagesMenuComponent } from './gui/menu/messagesMenu'

const About = () => (
    <div>
        <h2>About us</h2>
    </div>
)

ReactDOM.render((
    <Router history={browserHistory}>
        <Redirect from="/" to="/game" />
        <Route path="/" component={WelcomeComponent}>
        </Route>
        <Route path="/game" component={GameComponent} >
            <Route path="/login" component={LoginComponent} />
            <Route path="/about" component={About} />
            <Route path="/register" component={RegisterComponent} />
            <Route path="/messages" component={MessagesMenuComponent} />
        </Route>
    </Router>
), document.getElementById('main-container'))