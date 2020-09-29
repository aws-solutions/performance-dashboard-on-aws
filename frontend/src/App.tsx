import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";

import Home from "./containers/Home";
import DashboardListing from "./containers/DashboardListing";
import CreateDashboard from "./containers/CreateDashboard";
import EditDetails from "./containers/EditDetails";
import AddContent from "./containers/AddContent";
import EditDashboard from "./containers/EditDashboard";
import DashboardPreview from "./containers/DashboardPreview";
import AddChart from "./containers/AddChart";
import EditChart from "./containers/EditChart";
import AddTable from "./containers/AddTable";
import EditTable from "./containers/EditTable";
import AddText from "./containers/AddText";
import EditText from "./containers/EditText";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGripLinesVertical,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

library.add(faGripLinesVertical, faCaretUp, faCaretDown);

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin/dashboard/:dashboardId/preview">
          <DashboardPreview />
        </Route>
        <Route path="/admin/dashboard/:dashboardId/add-content">
          <AddContent />
        </Route>
        <Route path="/admin/dashboard/:dashboardId/add-text">
          <AddText />
        </Route>
        <Route path="/admin/dashboard/:dashboardId/edit-text/:widgetId">
          <EditText />
        </Route>
        <Route path="/admin/dashboard/:dashboardId/add-chart">
          <AddChart />
        </Route>
        <Route path="/admin/dashboard/:dashboardId/edit-chart/:widgetId">
          <EditChart />
        </Route>
        <Route path="/admin/dashboard/:dashboardId/add-table">
          <AddTable />
        </Route>
        <Route path="/admin/dashboard/:dashboardId/edit-table/:widgetId">
          <EditTable />
        </Route>
        <Route path="/admin/dashboard/edit/:dashboardId/details">
          <EditDetails />
        </Route>
        <Route path="/admin/dashboard/edit/:dashboardId">
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
