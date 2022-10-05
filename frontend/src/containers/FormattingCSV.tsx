import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useSampleDataset } from "../hooks";
import LineChartWidget from "../components/LineChartWidget";
import TableWidget from "../components/TableWidget";
import ColumnChartWidget from "../components/ColumnChartWidget";
import PartWholeChartWidget from "../components/PartWholeChartWidget";
import Button from "../components/Button";
import { useTranslation } from "react-i18next";
import BarChartWidget from "../components/BarChartWidget";
import PieChartWidget from "../components/PieChartWidget";
import DonutChartWidget from "../components/DonutChartWidget";
import AlertContainer from "./AlertContainer";

const LINE_CHART_CSV = "Example-CSV-Line.csv";
const BAR_CHART_CSV = "Example-CSV-Bar.csv";
const COLUMN_CHART_CSV = "Example-CSV-Column.csv";
const PART_TO_WHOLE_CSV = "Example-CSV-Part-to-whole.csv";
const PIE_CHART_CSV = "Example-CSV-Pie.csv";
const DONUT_CHART_CSV = "Example-CSV-Donut.csv";
const TABLE_CSV = "Example-CSV-Table.csv";

function FormattingCSV() {
  const lineChart = useSampleDataset(LINE_CHART_CSV);
  const table = useSampleDataset(TABLE_CSV);
  const column = useSampleDataset(COLUMN_CHART_CSV);
  const bar = useSampleDataset(BAR_CHART_CSV);
  const partToWhole = useSampleDataset(PART_TO_WHOLE_CSV);
  const pie = useSampleDataset(PIE_CHART_CSV);
  const donut = useSampleDataset(DONUT_CHART_CSV);
  const { t } = useTranslation();

  const onDownload = (sampleCsv: string) => {
    window.open(`${process.env.PUBLIC_URL}/samplecsv/${sampleCsv}`);
  };

  return (
    <>
      <AlertContainer />

      <h1 className="font-sans-2xl">
        {t("FormatCSVScreen.FormattingCSVFiles")}
      </h1>
      <div className="font-sans-lg usa-prose">
        <p>{t("FormatCSVScreen.FormattingCSVDescription")}</p>
        <h2>{t("FormatCSVScreen.MacOS")}</h2>
        <p>{t("FormatCSVScreen.MacOSDescription")}</p>
      </div>

      <h2>{t("FormatCSVScreen.LineChart")}</h2>
      <div className="usa-prose">
        <p>{t("FormatCSVScreen.LineChartDescription")}</p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>{t("FormatCSVScreen.LineChartExample")}</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(LINE_CHART_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              {t("FormatCSVScreen.LineChartExampleDownload")}
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <LineChartWidget
          id="sample-line-chart"
          title=""
          downloadTitle="Line chart sample"
          summary=""
          lines={lineChart.dataset.headers}
          data={lineChart.dataset.data}
          summaryBelow={false}
          columnsMetadata={[]}
          significantDigitLabels={false}
        />
      </div>

      <h2>{t("FormatCSVScreen.BarChart")}</h2>
      <div className="usa-prose">
        <p>{t("FormatCSVScreen.BarChartDescription")}</p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>{t("FormatCSVScreen.BarChartExample")}</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(BAR_CHART_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              {t("FormatCSVScreen.BarChartExampleDownload")}
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <BarChartWidget
          id="sample-bar-chart"
          title=""
          downloadTitle="Bar chart sample"
          summary=""
          bars={bar.dataset.headers}
          data={bar.dataset.data}
          summaryBelow={false}
          columnsMetadata={[]}
          significantDigitLabels={false}
        />
      </div>

      <h2>{t("FormatCSVScreen.ColumnChart")}</h2>
      <div className="usa-prose">
        <p>{t("FormatCSVScreen.ColumnChartDescription")}</p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>{t("FormatCSVScreen.ColumnChartExample")}</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(COLUMN_CHART_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              {t("FormatCSVScreen.ColumnChartExampleDownload")}
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <ColumnChartWidget
          id="sample-column-chart"
          title=""
          downloadTitle="Column chart sample"
          summary=""
          columns={column.dataset.headers}
          data={column.dataset.data}
          summaryBelow={false}
          columnsMetadata={[]}
          significantDigitLabels={false}
        />
      </div>

      <h2>{t("FormatCSVScreen.PartToWholeChart")}</h2>
      <div className="usa-prose">
        <p>{t("FormatCSVScreen.PartToWholeChartDescription")}</p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>{t("FormatCSVScreen.PartToWholeChartExample")}</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(PART_TO_WHOLE_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              {t("FormatCSVScreen.PartToWholeChartExampleDownload")}
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <PartWholeChartWidget
          id="sample-part-whole-chart"
          title=""
          downloadTitle="Part-to-whole chart sample"
          summary=""
          parts={partToWhole.dataset.headers}
          data={partToWhole.dataset.data}
          summaryBelow={false}
          significantDigitLabels={false}
          columnsMetadata={[]}
        />
      </div>

      <h2>{t("FormatCSVScreen.PieChart")}</h2>
      <div className="usa-prose">
        <p>{t("FormatCSVScreen.PieChartDescription")}</p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>{t("FormatCSVScreen.PieChartExample")}</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(PIE_CHART_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              {t("FormatCSVScreen.PieChartExampleDownload")}
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <PieChartWidget
          id="sample-pie-chart"
          title=""
          downloadTitle="Pie chart sample"
          summary=""
          parts={pie.dataset.headers}
          data={pie.dataset.data}
          summaryBelow={false}
          significantDigitLabels={false}
          columnsMetadata={[]}
        />
      </div>

      <h2>{t("FormatCSVScreen.DonutChart")}</h2>
      <div className="usa-prose">
        <p>{t("FormatCSVScreen.DonutChartDescription")}</p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>{t("FormatCSVScreen.DonutChartExample")}</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(DONUT_CHART_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              {t("FormatCSVScreen.DonutChartExampleDownload")}
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <DonutChartWidget
          id="sample-donut-chart"
          title=""
          downloadTitle="Donut chart sample"
          summary=""
          parts={donut.dataset.headers}
          data={donut.dataset.data}
          summaryBelow={false}
          significantDigitLabels={false}
          columnsMetadata={[]}
        />
      </div>

      <h2>{t("Table")}</h2>
      <div className="usa-prose">
        <p>{t("FormatCSVScreen.TableDescription")}</p>
        <div className="grid-row">
          <div className="grid-col text-left">
            <b>{t("FormatCSVScreen.TableExample")}</b>
          </div>
          <div className="grid-col text-right">
            <Button
              onClick={() => onDownload(TABLE_CSV)}
              type="button"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faDownload} className="margin-right-1" />
              {t("FormatCSVScreen.TableExampleDownload")}
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <TableWidget
          id="sample-table"
          title="Table sample"
          summary=""
          data={table.dataset.data}
          summaryBelow={false}
          columnsMetadata={[]}
          displayWithPages={false}
          significantDigitLabels={false}
        />
      </div>
    </>
  );
}

export default FormattingCSV;
