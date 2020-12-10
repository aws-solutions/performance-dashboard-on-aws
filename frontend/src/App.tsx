import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import SettingsProvider from "./context/SettingsProvider";

import withMainLayout from "./layouts/Main";
import withAdminLayout from "./layouts/Admin";
import { withFooterLayout } from "./layouts/Footer";

import Home from "./containers/Home";
import DashboardListing from "./containers/DashboardListing";
import CreateDashboard from "./containers/CreateDashboard";
import EditDetails from "./containers/EditDetails";
import AddContent from "./containers/AddContent";
import EditDashboard from "./containers/EditDashboard";
import DashboardPreview from "./containers/DashboardPreview";
import ViewDashboard from "./containers/ViewDashboard";
import ViewDashboardAdmin from "./containers/ViewDashboardAdmin";
import PublishDashboard from "./containers/PublishDashboard";
import ArchivedDashboard from "./containers/ArchivedDashboard";
import AddChart from "./containers/AddChart";
import EditChart from "./containers/EditChart";
import AddTable from "./containers/AddTable";
import EditTable from "./containers/EditTable";
import AddText from "./containers/AddText";
import EditText from "./containers/EditText";
import AdminHome from "./containers/AdminHome";
import TopicareaSettings from "./containers/TopicareaSettings";
import PublishingGuidanceSettings from "./containers/PublishingGuidanceSettings";
import PublishedSiteSettings from "./containers/PublishedSiteSettings";
import EditPublishingGuidance from "./containers/EditPublishingGuidance";
import EditHomepageContent from "./containers/EditHomepageContent";
import CreateTopicArea from "./containers/CreateTopicArea";
import EditTopicArea from "./containers/EditTopicArea";
import FourZeroFour from "./containers/FourZeroFour";
import MarkdownSyntax from "./containers/MarkdownSyntax";
import FormattingCSV from "./containers/FormattingCSV";
import DateFormatSettings from "./containers/DateFormatSettings";
import EditDateFormat from "./containers/EditDateFormat";

interface AppRoute {
  path: string;
  component: React.FunctionComponent<any>;
  public?: boolean;
}

const routes: Array<AppRoute> = [
  {
    path: "/admin",
    component: AdminHome,
  },
  {
    path: "/admin/settings/topicarea",
    component: TopicareaSettings,
  },
  {
    path: "/admin/settings/publishingguidance",
    component: PublishingGuidanceSettings,
  },
  {
    path: "/admin/settings/publishedsite",
    component: PublishedSiteSettings,
  },
  {
    path: "/admin/settings/publishingguidance/edit",
    component: EditPublishingGuidance,
  },
  {
    path: "/admin/settings/publishedsite/edit",
    component: EditHomepageContent,
  },
  {
    path: "/admin/settings/topicarea/create",
    component: CreateTopicArea,
  },
  {
    path: "/admin/settings/dateformat",
    component: DateFormatSettings,
  },
  {
    path: "/admin/settings/dateformat/edit",
    component: EditDateFormat,
  },
  {
    path: "/admin/settings/topicarea/:topicAreaId/edit",
    component: EditTopicArea,
  },
  {
    path: "/admin/settings",
    component: EditTopicArea,
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
    path: "/admin/dashboard/:dashboardId",
    component: ViewDashboardAdmin,
  },
  {
    path: "/admin/dashboard/edit/:dashboardId",
    component: EditDashboard,
  },
  {
    path: "/admin/dashboard/archived/:dashboardId",
    component: ArchivedDashboard,
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
  {
    path: "/admin/dashboard/:dashboardId/publish",
    component: PublishDashboard,
  },
  {
    path: "/admin/markdown",
    component: MarkdownSyntax,
  },
  {
    path: "/admin/formattingcsv",
    component: FormattingCSV,
  },
  {
    path: "/:dashboardId",
    component: ViewDashboard,
    public: true,
  },
  {
    path: "/",
    component: Home,
    public: true,
  },
];

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Switch>
          {routes.map((route) => {
            const component = route.public
              ? withMainLayout(route.component)
              : withAuthenticator(
                  withFooterLayout(withAdminLayout(route.component))
                );
            return (
              <Route
                exact
                key={route.path}
                component={component}
                path={route.path}
              />
            );
          })}
          <Route
            key={"/admin/"}
            component={withFooterLayout(withAdminLayout(FourZeroFour))}
            path={"/admin/"}
          />
        </Switch>
      </Router>
    </SettingsProvider>
  );
}

export default App;
