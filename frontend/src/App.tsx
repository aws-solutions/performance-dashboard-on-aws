import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { withAuthenticator } from '@aws-amplify/ui-react';

import Home from './containers/Home';
import Dashboard from './containers/Dashboard';
import AdminHome from './containers/AdminHome';
import DashboardListing from './containers/DashboardListing';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/dashboard/:dashboardId">
            <Dashboard />
          </Route>
          <Route path="/admin/dashboards">
            <DashboardListing />
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
