import React from "react";
import LineChartPreview from "../components/LineChartPreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import TablePreview from "../components/TablePreview";

const lineChartDataset = {
  headers: ["Month", "Covid cases", "Covid deaths"],
  data: [
    {
      Month: "Mar.",
      "Covid cases": 6000,
      "Covid deaths": 1000,
    },
    {
      Month: "Apr.",
      "Covid cases": 21000,
      "Covid deaths": 4900,
    },
    {
      Month: "May",
      "Covid cases": 34000,
      "Covid deaths": 7000,
    },
    {
      Month: "Jun.",
      "Covid cases": 70000,
      "Covid deaths": 12500,
    },
    {
      Month: "Jul.",
      "Covid cases": 93000,
      "Covid deaths": 18900,
    },
    {
      Month: "Aug.",
      "Covid cases": 102000,
      "Covid deaths": 25000,
    },
    {
      Month: "Sep.",
      "Covid cases": 95000,
      "Covid deaths": 26000,
    },
    {
      Month: "Oct.",
      "Covid cases": 75000,
      "Covid deaths": 26000,
    },
    {
      Month: "Nov.",
      "Covid cases": 68000,
      "Covid deaths": 24000,
    },
  ],
};

const tableDataset = {
  headers: ["Region", "Confirmed cases", "Deaths", "Increase (%)"],
  data: [
    {
      Region: "Northeast",
      "Confirmed cases": "150,000",
      Deaths: "23,000",
      "Increase (%)": 5,
    },
    {
      Region: "Mid-Atlantic",
      "Confirmed cases": "132,000",
      Deaths: "17,000",
      "Increase (%)": 6,
    },
    {
      Region: "Southeast",
      "Confirmed cases": 150000,
      Deaths: 23000,
      "Increase (%)": 5,
    },
    {
      Region: "Gulf Coast",
      "Confirmed cases": 150000,
      Deaths: 23000,
      "Increase (%)": 5,
    },
    {
      Region: "Midwest",
      "Confirmed cases": 150000,
      Deaths: 23000,
      "Increase (%)": 5,
    },
    {
      Region: "Southwest",
      "Confirmed cases": 150000,
      Deaths: 23000,
      "Increase (%)": 5,
    },
    {
      Region: "Northeast",
      "Confirmed cases": 150000,
      Deaths: 23000,
      "Increase (%)": 5,
    },
  ],
};

function FormattingCSV() {
  return (
    <>
      <h1 className="font-sans-2xl">Formatting CSV files</h1>
      <div className="font-sans-lg usa-prose">
        <p>
          Currently we only support .CSV files for table and chart content
          items. Below are examples of content types with formatted CSV files
          for your reference.
        </p>
      </div>

      <h2>Line Chart</h2>
      <div className="usa-prose">
        <p>
          A line chart or line graph is a type of chart which displays
          information as a series of data points called 'markers' connected by
          straight line segments. Line charts can include multiple lines and
          they are most often used to show trends over time or distribution.
        </p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>Line Chart Example</b>
          </div>
          <div className="grid-col text-right">
            <a href="/home">
              <FontAwesomeIcon icon={faDownload} />
              Download line chart example CSV
            </a>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <LineChartPreview
          title=""
          summary=""
          lines={lineChartDataset.headers}
          data={lineChartDataset.data}
        />
      </div>

      <h2>Table</h2>
      <div className="usa-prose">
        <p>
          A table is a means of arranging data in rows and columns. Tables are
          used to show comparisson with granularity.
        </p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>Table Example</b>
          </div>
          <div className="grid-col text-right">
            <a href="">
              <FontAwesomeIcon icon={faDownload} />
              Download table example CSV
            </a>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <TablePreview
          title=""
          summary=""
          headers={tableDataset.headers}
          data={tableDataset.data}
        />
      </div>
    </>
  );
}

export default FormattingCSV;
