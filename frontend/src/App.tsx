import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { withAuthenticator } from '@aws-amplify/ui-react';
// import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './containers/Home';
import Dashboard from './containers/Dashboard';
import AdminHome from './containers/AdminHome';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/dashboard/:dashboardId">
            <Dashboard />
          </Route>
          <Route path="/admin">
            <AdminHome />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
}

export default withAuthenticator(App);
