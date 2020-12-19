import React from "react";
import Link from "../components/Link";
import EnvConfig from "../services/EnvConfig";

const APIHelpPage = () => {
  return (
    <>
      <h1 className="font-sans-2xl">
        Use datasets to create data visualizations
      </h1>
      <div className="font-sans-lg usa-prose">
        <p>
          There are three methods to populate chart or table data
          visualizations:
        </p>
      </div>
      <h2>Select a dynamic dataset</h2>
      <div className="usa-prose">
        <p>
          These datasets update the data visualization automatically as new data
          is added to the source. Dynamic datasets are useful for visualizing
          streaming data that is updated frequently. Dynamic datasets are not
          configurable in the interface. If you have a dynamic dataset that
          needs to be configured,{" "}
          <a
            href={`mailto:${EnvConfig.contactEmail}?subject=Performance Dashboard Assistance`}
          >
            contact support
          </a>
          . If you want to learn more about how to set up dynamic datasets,{" "}
          <a href="https://github.com/awslabs/performance-dashboard-on-aws">
            read our documentation.
          </a>
        </p>
      </div>
      <h2>Select a static dataset </h2>
      <div className="usa-prose">
        <p>
          This is a fixed dataset that has to be manually updated to update the
          data visualization. To update this data, you must make changes to the
          data on your local device, then upload the new dataset as a CSV file.
        </p>
      </div>
      <h2>Creating a new dataset from a file</h2>
      <div className="usa-prose">
        <p>
          Upload a CSV file to create a new dataset. If you want to use a
          dataset that has already been uploaded, you can choose “select a
          static dataset” and browse existing datasets. If you need help
          formatting your CSV,{" "}
          <Link to="/admin/formattingcsv" target="_blank" external>
            read our documentation
          </Link>
        </p>
      </div>
    </>
  );
};

export default APIHelpPage;
