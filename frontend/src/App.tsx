import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SettingsProvider from "./context/SettingsProvider";
import withSAMLAuthenticator from "./layouts/SAMLAuthenticator";

import withPublicLayout from "./layouts/Public";
import withAdminLayout from "./layouts/Admin";

import Home from "./containers/Home";
import HomeWithSearch from "./containers/HomeWithSearch";
import DashboardListing from "./containers/DashboardListing";
import CreateDashboard from "./containers/CreateDashboard";
import EditDetails from "./containers/EditDetails";
import EditTableOfContents from "./containers/EditTableOfContents";
import AddContent from "./containers/AddContent";
import EditDashboard from "./containers/EditDashboard";
import DashboardHistory from "./containers/DashboardHistory";
import ViewDashboard from "./containers/ViewDashboard";
import ViewDashboardAdmin from "./containers/ViewDashboardAdmin";
import PublishDashboard from "./containers/PublishDashboard";
import AddChart from "./containers/AddChart";
import AddImage from "./containers/AddImage";
import EditImage from "./containers/EditImage";
import EditChart from "./containers/EditChart";
import AddTable from "./containers/AddTable";
import EditTable from "./containers/EditTable";
import AddText from "./containers/AddText";
import AddSection from "./containers/AddSection";
import EditMetrics from "./containers/EditMetrics";
import AddMetrics from "./containers/AddMetrics";
import AddMetric from "./containers/AddMetric";
import EditMetric from "./containers/EditMetric";
import EditText from "./containers/EditText";
import EditSection from "./containers/EditSection";
import AdminHome from "./containers/AdminHome";
import TopicareaSettings from "./containers/TopicareaSettings";
import PublishingGuidanceSettings from "./containers/PublishingGuidanceSettings";
import PublishedSiteSettings from "./containers/PublishedSiteSettings";
import EditPublishingGuidance from "./containers/EditPublishingGuidance";
import EditHomepageContent from "./containers/EditHomepageContent";
import CreateTopicArea from "./containers/CreateTopicArea";
import EditTopicArea from "./containers/EditTopicArea";
import EditTopicAreaLabel from "./containers/EditTopicAreaLabel";
import EditColors from "./containers/EditColors";
import FourZeroFour from "./containers/FourZeroFour";
import MarkdownSyntax from "./containers/MarkdownSyntax";
import FormattingCSV from "./containers/FormattingCSV";
import DateFormatSettings from "./containers/DateFormatSettings";
import AdminSiteSettings from "./containers/AdminSiteSettings";
import EditDateFormat from "./containers/EditDateFormat";
import EditSupportContactEmail from "./containers/EditSupportContactEmail";
import APIHelpPage from "./containers/APIHelpPage";
import ColorsHelpPage from "./containers/ColorsHelpPage";
import EditNavbar from "./containers/EditNavbar";
import UserListing from "./containers/UserListing";
import AddUsers from "./containers/AddUsers";
import ChangeRole from "./containers/ChangeRole";
import BrandingAndStylingSettings from "./containers/BrandingAndStylingSettings";
import EditLogo from "./containers/EditLogo";
import EditFavicon from "./containers/EditFavicon";
import UserStatus from "./containers/UserStatus";
import ChooseStaticDataset from "./containers/ChooseStaticDataset";
import AccessDenied from "./containers/AccessDenied";

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
    path: "/admin/settings",
    component: TopicareaSettings,
  },
  {
    path: "/admin/settings/topicarea",
    component: TopicareaSettings,
  },
  {
    path: "/admin/settings/brandingandstyling",
    component: BrandingAndStylingSettings,
  },
  {
    path: "/admin/settings/brandingandstyling/editlogo",
    component: EditLogo,
  },
  {
    path: "/admin/settings/brandingandstyling/editfavicon",
    component: EditFavicon,
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
    path: "/admin/settings/publishedsite/contentedit",
    component: EditHomepageContent,
  },
  {
    path: "/admin/settings/publishedsite/navbaredit",
    component: EditNavbar,
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
    path: "/admin/settings/adminsite",
    component: AdminSiteSettings,
  },
  {
    path: "/admin/settings/supportcontact/edit",
    component: EditSupportContactEmail,
  },
  {
    path: "/admin/settings/topicarea/:topicAreaId/edit",
    component: EditTopicArea,
  },
  {
    path: "/admin/settings/topicarea/editlabel",
    component: EditTopicAreaLabel,
  },
  {
    path: "/admin/settings/brandingandstyling/editcolors",
    component: EditColors,
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
    path: "/admin/dashboard/edit/:dashboardId/header",
    component: EditDetails,
  },
  {
    path: "/admin/dashboard/edit/:dashboardId/tableofcontents",
    component: EditTableOfContents,
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
    path: "/admin/dashboard/:dashboardId/choose-static-dataset",
    component: ChooseStaticDataset,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-image",
    component: AddImage,
  },
  {
    path: "/admin/dashboard/:dashboardId/edit-image/:widgetId",
    component: EditImage,
  },
  {
    path: "/admin/dashboard/:dashboardId/edit-text/:widgetId",
    component: EditText,
  },
  {
    path: "/admin/dashboard/:dashboardId/edit-section/:widgetId",
    component: EditSection,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-text",
    component: AddText,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-section",
    component: AddSection,
  },
  {
    path: "/admin/dashboard/:dashboardId/edit-metrics/:widgetId",
    component: EditMetrics,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-metrics",
    component: AddMetrics,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-metric",
    component: AddMetric,
  },
  {
    path: "/admin/dashboard/:dashboardId/edit-metric",
    component: EditMetric,
  },
  {
    path: "/admin/dashboard/:dashboardId/add-content",
    component: AddContent,
  },
  {
    path: "/admin/dashboard/:dashboardId/history",
    component: DashboardHistory,
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
    path: "/admin/userstatus",
    component: UserStatus,
  },
  {
    path: "/admin/formatting",
    component: FormattingCSV,
  },
  {
    path: "/admin/apihelp",
    component: APIHelpPage,
  },
  {
    path: "/admin/colorshelp",
    component: ColorsHelpPage,
  },
  {
    path: "/admin/users",
    component: UserListing,
  },
  {
    path: "/admin/users/add",
    component: AddUsers,
  },
  {
    path: "/admin/users/changerole",
    component: ChangeRole,
  },
  {
    path: "/403/access-denied",
    component: AccessDenied,
  },
  {
    path: "/:friendlyURL",
    component: ViewDashboard,
    public: true,
  },
  {
    path: "/404/page-not-found",
    component: FourZeroFour,
    public: true,
  },
  {
    path: "/",
    component: Home,
    public: true,
  },
  {
    path: "/search/:query",
    component: HomeWithSearch,
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
              ? withPublicLayout(route.component)
              : withSAMLAuthenticator(withAdminLayout(route.component));
            return (
              <Route
                exact
                key={route.path}
                component={component}
                path={route.path}
              />
            );
          })}
          <Redirect from="*" to="/404/page-not-found" />
        </Switch>
      </Router>
    </SettingsProvider>
  );
}

export default App;
