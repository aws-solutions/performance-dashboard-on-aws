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

interface BadgerRoute {
  path: string;
  component: React.FunctionComponent<any>;
  public?: boolean;
}

const routes: Array<BadgerRoute> = [
  {
    path: "/",
    component: Home,
    public: true,
  },
  {
    path: "/admin",
    component: DashboardListing,
  },
  {
    path: "/admin/dashboards",
    component: DashboardListing,
  },
  {
    path: "/admin/dashboard/create",
    component: CreateDashboard,
  },
  {
    path: "/admin/dashboard/edit/:dashboardId",
    component: EditDashboard,
  },
  {
    path: "/admin/dashboard/edit/:dashboardId/details",
    component: EditDetails,
  },
  {
    path: "/admin/dashboard/:dashboardId/edit-table/:widgetId",
    component: EditTable,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-table",
    component: AddTable,
  },
  {
    path: "/admin/dashboard/:dashboardId/edit-chart/:widgetId",
    component: EditChart,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-chart",
    component: AddChart,
  },
  {
    path: "/admin/dashboard/:dashboardId/edit-text/:widgetId",
    component: EditText,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-text",
    component: AddText,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-content",
    component: AddContent,
  },
  {
    path: "/admin/dashboard/:dashboardId/preview",
    component: DashboardPreview,
  },
];

function App() {
  return (
    <Router>
      <Switch>
<<<<<<< HEAD
        {routes.map((route) => {
          const component = route.public
            ? route.component
            : withAuthenticator(route.component);
          return (
            <Route
              exact
              key={route.path}
              component={component}
              path={route.path}
            />
          );
        })}
=======
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
>>>>>>> 1936ca05d2d9c6d570e6d11624fed47705e1fc2e
      </Switch>
    </Router>
  );
}

export default App;
