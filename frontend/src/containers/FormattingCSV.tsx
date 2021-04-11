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

const LINE_CHART_CSV = "Example-CSV-Line.csv";
const TABLE_CSV = "Example-CSV-Table.csv";
const COLUMN_CHART_CSV = "Example-CSV-Column.csv";
const PART_TO_WHOLE_CSV = "Example-CSV-Part-to-whole.csv";

function FormattingCSV() {
  const lineChart = useSampleDataset(LINE_CHART_CSV);
  const table = useSampleDataset(TABLE_CSV);
  const column = useSampleDataset(COLUMN_CHART_CSV);
  const partToWhole = useSampleDataset(PART_TO_WHOLE_CSV);
  const { t } = useTranslation();

  const onDownload = (sampleCsv: string) => {
    window.open(`${process.env.PUBLIC_URL}/samplecsv/${sampleCsv}`);
  };

  return (
    <>
      <h1 className="font-sans-2xl">{t("FormatCSVScreen.FormattingCSVFiles")}</h1>
      <div className="font-sans-lg usa-prose">
        <p>
          {t("FormatCSVScreen.FormattingCSVDescription")}
        </p>
        <h3>{t("FormatCSVScreen.MacOS")}</h3>
        <p>
          {t("FormatCSVScreen.MacOSDescription")}
        </p>
      </div>

      <h2>{t("FormatCSVScreen.LineChart")}</h2>
      <div className="usa-prose">
        <p>
          {t("FormatCSVScreen.LineChartDescription")}
        </p>
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
          title=""
          summary=""
          lines={lineChart.dataset.headers}
          data={lineChart.dataset.data}
          summaryBelow={false}
        />
      </div>

      <h2>{t("FormatCSVScreen.ColumnChart")}</h2>
      <div className="usa-prose">
        <p>
          {t("FormatCSVScreen.ColumnChartDescription")}
        </p>
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
          title=""
          summary=""
          columns={column.dataset.headers}
          data={column.dataset.data}
          summaryBelow={false}
        />
      </div>

      <h2>{t("FormatCSVScreen.PartToWholeChart")}</h2>
      <div className="usa-prose">
        <p>
          {t("FormatCSVScreen.PartToWholeChartDescription")}
        </p>
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
          title=""
          summary=""
          parts={partToWhole.dataset.headers}
          data={partToWhole.dataset.data}
          summaryBelow={false}
        />
      </div>

      <h2>{t("Table")}</h2>
      <div className="usa-prose">
        <p>
          {t("FormatCSVScreen.TableDescription")}
        </p>
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
