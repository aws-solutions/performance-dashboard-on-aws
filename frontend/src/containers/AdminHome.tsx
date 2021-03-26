import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { useCurrentAuthenticatedUser } from "../hooks";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";
import CardGroup from "../components/CardGroup";

const { Card, CardFooter, CardBody } = CardGroup;

function AdminHome() {
  const history = useHistory();
  const currentAuthenticatedUser = useCurrentAuthenticatedUser();

  const onCreateDashboard = () => {
    history.push("/admin/dashboard/create");
  };

  const onViewDashboards = () => {
    history.push("/admin/dashboards");
  };

  const onManageUsers = () => {
    history.push("/admin/users");
  };

  const onViewSettings = () => {
    history.push("/admin/settings");
  };

  const onViewPublicWebsite = () => {
    const win = window.open("/", "_blank");
    if (!!win) {
      win.focus();
    }
  };

  if (
    !currentAuthenticatedUser ||
    (!currentAuthenticatedUser.isEditor && !currentAuthenticatedUser.isAdmin)
  ) {
    return null;
  }

  return (
    <div className="usa-prose">
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8">
          <h1 className="font-sans-3xl">
            Welcome to the Performance Dashboard
          </h1>
          <p className="font-sans-lg usa-prose">
            {`${
              currentAuthenticatedUser.isAdmin
                ? "You role is admin. Below are some the things you can do as an admin to get you started."
                : "This is where you will manage your performance dashboard."
            }`}
          </p>
        </div>
      </div>
      <div className="grid-row">
        {currentAuthenticatedUser.isEditor ? (
          <CardGroup>
            <Card title="Create a new dashboard" col={7}>
              <CardBody>
                <p>
                  Build draft dashboards by adding charts, tables, text, and
                  more as content. Publish dashboards to share results, track
                  progress, or provide insights about a project, program,
                  service, etc.
                  <br />
                  <br />
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  variant="base"
                  onClick={onCreateDashboard}
                >
                  Create dashboard
                </Button>
              </CardFooter>
            </Card>
            <Card title="View existing dashboards" col={5}>
              <CardBody>
                <p>
                  See the dashboards that other editors in your organization
                  have created.
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onViewDashboards}
                >
                  View dashboards
                </Button>
              </CardFooter>
            </Card>
          </CardGroup>
        ) : (
          ""
        )}
        {currentAuthenticatedUser.isAdmin ? (
          <CardGroup>
            <Card title="Create a new dashboard" col={4}>
              <CardBody>
                <p>
                  Build draft dashboards by adding charts, tables, text, and
                  more as content. Publish dashboards to share results, track
                  progress, or provide insights about a project, program,
                  service, etc.
                  <br />
                  <br />
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  variant="base"
                  onClick={onCreateDashboard}
                >
                  Create dashboard
                </Button>
              </CardFooter>
            </Card>
            <Card title="Add other users" col={4}>
              <CardBody>
                <p>
                  Allow other users in your organization to create, edit, and
                  publish dashboards. Manage their access to dashboards and set
                  their roles. You may also add other admins.
                </p>
              </CardBody>
              <CardFooter>
                <Button type="button" variant="outline" onClick={onManageUsers}>
                  Manage users
                </Button>
              </CardFooter>
            </Card>
            <Card title="Customize settings" col={4}>
              <CardBody>
                <p>
                  Personalize the dashboard homepage, configure how users get
                  approval to publish dashboards, and access other settings.
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onViewSettings}
                >
                  View settings
                </Button>
              </CardFooter>
            </Card>
          </CardGroup>
        ) : (
          ""
        )}
      </div>
      <hr />
      <div className="grid-row text-center">
        <div className="grid-col">
          <p className="font-sans-md">
            This site is where you manage the performance dashboard. <br /> Do
            you want to see what your audience sees?
          </p>
          <Button type="button" variant="outline" onClick={onViewPublicWebsite}>
            View the published site{" "}
            <FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
