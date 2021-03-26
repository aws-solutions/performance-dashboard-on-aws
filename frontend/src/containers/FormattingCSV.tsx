import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useSampleDataset } from "../hooks";
import LineChartWidget from "../components/LineChartWidget";
import TableWidget from "../components/TableWidget";
import ColumnChartWidget from "../components/ColumnChartWidget";
import PartWholeChartWidget from "../components/PartWholeChartWidget";
import Button from "../components/Button";

const LINE_CHART_CSV = "Example-CSV-Line.csv";
const TABLE_CSV = "Example-CSV-Table.csv";
const COLUMN_CHART_CSV = "Example-CSV-Column.csv";
const PART_TO_WHOLE_CSV = "Example-CSV-Part-to-whole.csv";

function FormattingCSV() {
  const lineChart = useSampleDataset(LINE_CHART_CSV);
  const table = useSampleDataset(TABLE_CSV);
  const column = useSampleDataset(COLUMN_CHART_CSV);
  const partToWhole = useSampleDataset(PART_TO_WHOLE_CSV);

  const onDownload = (sampleCsv: string) => {
    window.open(`${process.env.PUBLIC_URL}/samplecsv/${sampleCsv}`);
  };

  return (
    <>
      <h1 className="font-sans-2xl">Formatting CSV files</h1>
      <div className="font-sans-lg usa-prose">
        <p>
          Currently we only support .CSV files for table and chart content
          items. Below are examples of content types with formatted CSV files
          for your reference.
        </p>
        <h3>Mac Operating Systems</h3>
        <p>
          CSV files created in excel will have issues displaying special
          characters on the website. The workaround is to save the file in excel
          as a CSV UTF-8 file.
        </p>
      </div>

      <h2>Line chart</h2>
      <div className="usa-prose">
        <p>
          A line chart or line graph is a type of chart which displays
          information as a series of data points called ‘markers’ connected by
          straight line segments. Line charts can include multiple lines. Line
          charts are most often used to show trends over time or distribution.
        </p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>Line Chart Example</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(LINE_CHART_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              Download line chart example CSV
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <LineChartWidget
          title=""
          summary=""
          lines={lineChart.dataset.headers}
          data={lineChart.dataset.data}
          summaryBelow={false}
        />
      </div>

      <h2>Column chart</h2>
      <div className="usa-prose">
        <p>
          Column charts provide a visual presentation of categorical data.
          Categorical data is a grouping of data into discrete groups, such as
          months of the year, age group, shoe sizes, and animals. These
          categories are usually qualitative. Bars on the chart may be arranged
          in any order. Column charts can also be used to show trend over time.
        </p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>Column Example</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(COLUMN_CHART_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              Download column chart example CSV
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <ColumnChartWidget
          title=""
          summary=""
          columns={column.dataset.headers}
          data={column.dataset.data}
          summaryBelow={false}
        />
      </div>

      <h2>Part-to-whole chart</h2>
      <div className="usa-prose">
        <p>
          A part-to-whole chart is divided into blocks, illustrating numerical
          proportion. In a part-to-whole chart, the length of each block (and
          consequently its area), is proportional to the quantity it represents.
          Part-to-whole charts are used to show relative comparison between
          blocks as part of a total value.
        </p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>Part-to-whole Example</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(PART_TO_WHOLE_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              Download part-to-whole chart example CSV
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <PartWholeChartWidget
          title=""
          summary=""
          parts={partToWhole.dataset.headers}
          data={partToWhole.dataset.data}
          summaryBelow={false}
        />
      </div>

      <h2>Table</h2>
      <div className="usa-prose">
        <p>
          A table is a means of arranging data in rows and columns. Tables are
          used to show comparison when the granularity of data is desired.
        </p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>Table Example</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(TABLE_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              Download table example CSV
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <TableWidget
          title=""
          summary=""
          data={table.dataset.data}
          summaryBelow={false}
          columnsMetadata={[]}
        />
      </div>
    </>
  );
}

export default FormattingCSV;
