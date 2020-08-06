import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { withAuthenticator } from '@aws-amplify/ui-react';

import Home from './containers/Home';
import Dashboard from './containers/Dashboard';
import DashboardListing from './containers/DashboardListing';
import CreateDashboard from './containers/CreateDashboard';
import EditDashboard from './containers/EditDashboard';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/dashboard/:topicAreaId/:dashboardId">
            <Dashboard />
          </Route>
          <Route path="/admin/dashboard/edit/:topicAreaId/:dashboardId">
            <EditDashboard />
          </Route>
          <Route path="/admin/dashboards">
            <DashboardListing />
          </Route>
          <Route path="/admin/dashboard/create">
            <CreateDashboard />
          </Route>
          <Route path="/admin">
            <DashboardListing />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
}

export default withAuthenticator(App);
