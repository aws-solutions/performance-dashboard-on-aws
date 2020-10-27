import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";
import CardGroup from "../components/CardGroup";

const { Card, CardFooter, CardBody } = CardGroup;

function AdminHome() {
  const history = useHistory();

  const onCreateDashboard = () => {
    history.push("/admin/dashboard/create");
  };

  const onViewDashboards = () => {
    history.push("/admin/dashboards");
  };

  const onViewPublicWebsite = () => {
    history.push("/");
  };

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8">
          <h1 className="font-sans-3xl">
            Welcome to the Performance Dashboard
          </h1>
          <p className="font-sans-lg usa-prose">
            This is where you will manage your performance dashboard.
          </p>
        </div>
      </div>
      <div className="grid-row">
        <CardGroup>
          <Card title="Create a new dashboard" col={7}>
            <CardBody>
              <p>
                Build draft dashboards by adding charts, tables and text as
                content. Publish dashboards to share results, track progress, or
                tell stories about a project, program, service, etc.
                <br />
                <br />
              </p>
            </CardBody>
            <CardFooter>
              <Button type="button" variant="base" onClick={onCreateDashboard}>
                Create dashboard
              </Button>
            </CardFooter>
          </Card>
          <Card title="View existing dashboards" col={5}>
            <CardBody>
              <p>See the dashboards that others have created.</p>
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
      </div>
      <hr />
      <div className="grid-row text-center">
        <div className="grid-col">
          <p className="font-sans-md">
            This site is where you manage the performance dashboard. <br /> Do
            you want to see what your viewers see?
          </p>
          <Button type="button" variant="outline" onClick={onViewPublicWebsite}>
            View the published site{" "}
            <FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
