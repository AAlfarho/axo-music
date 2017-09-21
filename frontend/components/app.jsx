import React from 'react';
import {
  Route,
  Redirect,
  Switch,
  Link,
  HashRouter
} from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import SplashContainer from './splash/splash_container';
import SessionFormContainer from './session_form/session_form_container';
import MainCanvasContainer from './main_canvas/main_canvas_container';

const App = () =>(
  <div className="vbox viewport">
    <Switch>
      <ProtectedRoute exact path="/" component={MainCanvasContainer} />
      <AuthRoute path="/login" component={SessionFormContainer} />
      <AuthRoute path="/signup" component={SessionFormContainer} />
      <AuthRoute path="/splash" component={SplashContainer} />
    </Switch>
  </div>
);

export default App;
