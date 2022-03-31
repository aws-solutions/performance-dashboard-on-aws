import React from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
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
import Page from "./components/Page";
import { useTranslation } from "react-i18next";
import { useSettings } from "./hooks";

interface AppRoute {
  path: string;
  component: React.FunctionComponent<any>;
  title: string;
  public?: boolean;
}

function App() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const routes: Array<AppRoute> = [
    {
      path: "/admin",
      title: t("PageTitle.AdminHome"),
      component: AdminHome,
    },
    {
      path: "/admin/settings",
      title: t("PageTitle.Settings"),
      component: TopicareaSettings,
    },
    {
      path: "/admin/settings/topicarea",
      title: t("PageTitle.TopicAreaSettings"),
      component: TopicareaSettings,
    },
    {
      path: "/admin/settings/brandingandstyling",
      title: t("PageTitle.BrandingAndStylingSettings"),
      component: BrandingAndStylingSettings,
    },
    {
      path: "/admin/settings/brandingandstyling/editlogo",
      title: t("PageTitle.EditLogo"),
      component: EditLogo,
    },
    {
      path: "/admin/settings/brandingandstyling/editfavicon",
      title: t("PageTitle.EditFavicon"),
      component: EditFavicon,
    },
    {
      path: "/admin/settings/publishingguidance",
      title: t("PageTitle.PublishingGuidanceSettings"),
      component: PublishingGuidanceSettings,
    },
    {
      path: "/admin/settings/publishingguidance/edit",
      title: t("PageTitle.EditPublishingGuidance"),
      component: EditPublishingGuidance,
    },
    {
      path: "/admin/settings/publishedsite",
      title: t("PageTitle.PublishedSiteSettings"),
      component: PublishedSiteSettings,
    },
    {
      path: "/admin/settings/publishedsite/contentedit",
      title: t("PageTitle.EditHomepageContent"),
      component: EditHomepageContent,
    },
    {
      path: "/admin/settings/publishedsite/navbaredit",
      title: t("PageTitle.EditNavbar"),
      component: EditNavbar,
    },
    {
      path: "/admin/settings/topicarea/create",
      title: t("PageTitle.CreateTopicArea", {
        topicArea: settings.topicAreaLabels.singular,
      }),
      component: CreateTopicArea,
    },
    {
      path: "/admin/settings/dateformat",
      title: t("PageTitle.DateFormatSettings"),
      component: DateFormatSettings,
    },
    {
      path: "/admin/settings/dateformat/edit",
      title: t("PageTitle.EditDateFormat"),
      component: EditDateFormat,
    },
    {
      path: "/admin/settings/adminsite",
      title: t("PageTitle.AdminSiteSettings"),
      component: AdminSiteSettings,
    },
    {
      path: "/admin/settings/supportcontact/edit",
      title: t("PageTitle.EditSupportContactEmail"),
      component: EditSupportContactEmail,
    },
    {
      path: "/admin/settings/topicarea/:topicAreaId/edit",
      title: t("PageTitle.EditTopicArea", {
        topicArea: settings.topicAreaLabels.singular,
      }),
      component: EditTopicArea,
    },
    {
      path: "/admin/settings/topicarea/editlabel",
      title: t("PageTitle.EditTopicAreaLabels"),
      component: EditTopicAreaLabel,
    },
    {
      path: "/admin/settings/brandingandstyling/editcolors",
      title: t("PageTitle.EditColors"),
      component: EditColors,
    },
    {
      path: "/admin/dashboards",
      title: t("PageTitle.AdminDashboards"),
      component: DashboardListing,
    },
    {
      path: "/admin/dashboard/create",
      title: t("PageTitle.CreateDashboard"),
      component: CreateDashboard,
    },
    {
      path: "/admin/dashboard/:dashboardId",
      title: t("PageTitle.PreviewDashboard"),
      component: ViewDashboardAdmin,
    },
    {
      path: "/admin/dashboard/edit/:dashboardId",
      title: t("PageTitle.EditDashboard"),
      component: EditDashboard,
    },
    {
      path: "/admin/dashboard/edit/:dashboardId/header",
      title: t("PageTitle.EditDashboardHeader"),
      component: EditDetails,
    },
    {
      path: "/admin/dashboard/edit/:dashboardId/tableofcontents",
      title: t("PageTitle.EditTableOfContents"),
      component: EditTableOfContents,
    },
    {
      path: "/admin/dashboard/:dashboardId/edit-table/:widgetId",
      title: t("PageTitle.EditTable"),
      component: EditTable,
    },
    {
      path: "/admin/dashboard/:dashboardId/add-table",
      title: t("PageTitle.AddTable"),
      component: AddTable,
    },
    {
      path: "/admin/dashboard/:dashboardId/edit-chart/:widgetId",
      title: t("PageTitle.EditChart"),
      component: EditChart,
    },
    {
      path: "/admin/dashboard/:dashboardId/add-chart",
      title: t("PageTitle.AddChart"),
      component: AddChart,
    },
    {
      path: "/admin/dashboard/:dashboardId/choose-static-dataset",
      title: t("PageTitle.ChooseStaticDataset"),
      component: ChooseStaticDataset,
    },
    {
      path: "/admin/dashboard/:dashboardId/add-image",
      title: t("PageTitle.AddImage"),
      component: AddImage,
    },
    {
      path: "/admin/dashboard/:dashboardId/edit-image/:widgetId",
      title: t("PageTitle.EditImage"),
      component: EditImage,
    },
    {
      path: "/admin/dashboard/:dashboardId/edit-text/:widgetId",
      title: t("PageTitle.EditText"),
      component: EditText,
    },
    {
      path: "/admin/dashboard/:dashboardId/edit-section/:widgetId",
      title: t("PageTitle.EditSection"),
      component: EditSection,
    },
    {
      path: "/admin/dashboard/:dashboardId/add-text",
      title: t("PageTitle.AddText"),
      component: AddText,
    },
    {
      path: "/admin/dashboard/:dashboardId/add-section",
      title: t("PageTitle.AddSection"),
      component: AddSection,
    },
    {
      path: "/admin/dashboard/:dashboardId/edit-metrics/:widgetId",
      title: t("PageTitle.EditMetrics"),
      component: EditMetrics,
    },
    {
      path: "/admin/dashboard/:dashboardId/add-metrics",
      title: t("PageTitle.AddMetrics"),
      component: AddMetrics,
    },
    {
      path: "/admin/dashboard/:dashboardId/add-metric",
      title: t("PageTitle.AddMetric"),
      component: AddMetric,
    },
    {
      path: "/admin/dashboard/:dashboardId/edit-metric",
      title: t("PageTitle.EditMetric"),
      component: EditMetric,
    },
    {
      path: "/admin/dashboard/:dashboardId/add-content",
      title: t("PageTitle.AddContent"),
      component: AddContent,
    },
    {
      path: "/admin/dashboard/:dashboardId/history",
      title: t("PageTitle.DashboardHistory"),
      component: DashboardHistory,
    },
    {
      path: "/admin/dashboard/:dashboardId/publish",
      title: t("PageTitle.PublishDashboard"),
      component: PublishDashboard,
    },
    {
      path: "/admin/markdown",
      title: t("PageTitle.MarkdownGuide"),
      component: MarkdownSyntax,
    },
    {
      path: "/admin/userstatus",
      title: t("PageTitle.UserStatus"),
      component: UserStatus,
    },
    {
      path: "/admin/formatting",
      title: t("PageTitle.FormattingGuide"),
      component: FormattingCSV,
    },
    {
      path: "/admin/apihelp",
      title: t("PageTitle.APIHelp"),
      component: APIHelpPage,
    },
    {
      path: "/admin/colorshelp",
      title: t("PageTitle.ColorsHelp"),
      component: ColorsHelpPage,
    },
    {
      path: "/admin/users",
      title: t("PageTitle.AdminUsers"),
      component: UserListing,
    },
    {
      path: "/admin/users/add",
      title: t("PageTitle.AddUser"),
      component: AddUsers,
    },
    {
      path: "/admin/users/changerole",
      title: t("PageTitle.ChangeUserRole"),
      component: ChangeRole,
    },
    {
      path: "/public/search",
      title: t("PageTitle.Search"),
      component: HomeWithSearch,
      public: true,
    },
    {
      path: "/403/access-denied",
      title: t("PageTitle.AccessDenied"),
      component: AccessDenied,
    },
    {
      path: "/:friendlyURL",
      title: t("PageTitle.ViewDashboard"),
      component: ViewDashboard,
      public: true,
    },
    {
      path: "/404/page-not-found",
      title: t("PageTitle.PageNotFound"),
      component: FourZeroFour,
      public: true,
    },
    {
      path: "/",
      title: t("PageTitle.Home"),
      component: Home,
      public: true,
    },
  ];

  return (
    <SettingsProvider>
      <Router>
        <Switch>
          {routes.map((route) => {
            const component = route.public
              ? withPublicLayout(route.component)
              : withSAMLAuthenticator(withAdminLayout(route.component));
            return (
              <Page
                title={route.title}
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
