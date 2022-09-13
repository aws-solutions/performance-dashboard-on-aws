import React, { useState, useCallback } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { useHistory, useParams } from "react-router-dom";
import { LocationState } from "../models";
import { useDashboard, useDateTimeFormatter, useDatasets } from "../hooks";
import Table from "../components/Table";
import Button from "../components/Button";
import Search from "../components/Search";
import StorageService from "../services/StorageService";
import { Dataset } from "../models";
import { useTranslation } from "react-i18next";

interface PathParams {
  dashboardId: string;
}

function ChooseStaticDataset() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const { state } = history.location;

  const dateFormatter = useDateTimeFormatter();

  const { dashboardId } = useParams<PathParams>();
  const { dashboard } = useDashboard(dashboardId);
  const { staticDatasets } = useDatasets();

  const [filter, setFilter] = useState("");
  const [json, setJson] = useState<Array<any>>([]);
  const [staticDataset, setStaticDataset] = useState<Dataset | undefined>(
    undefined
  );

  const crumbs = [
    {
      label: t("Dashboards"),
      url: "/admin/dashboards",
    },
    {
      label: dashboard?.name,
      url: `/admin/dashboard/${dashboardId}`,
    },
    {
      label: state?.crumbLabel,
      url: state?.redirectUrl,
    },
    {
      label: t("ChooseStaticDataset"),
      url: "",
    },
  ];

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onCancel = () => {
    history.goBack();
  };

  const onSelect = useCallback(
    (selectedDataset: Array<Dataset>) => {
      selectStaticDataset(selectedDataset);
    },
    [staticDatasets]
  );

  const selectStaticDataset = async (selectedDataset: Array<Dataset>) => {
    if (selectedDataset[0] && selectedDataset[0].s3Key) {
      const jsonFile = selectedDataset[0].s3Key.json;

      const downloadedJson = await StorageService.downloadJson(jsonFile);
      setJson(downloadedJson);
      setStaticDataset(staticDatasets.find((d) => d.s3Key.json === jsonFile));
    } else {
      setJson([]);
      setStaticDataset(undefined);
    }
  };

  const onSubmit = () => {
    history.replace({
      pathname: state.redirectUrl,
      state: {
        json: json,
        staticDataset: staticDataset,
      },
    });
  };

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="margin-top-0">{t("ChooseStaticDataset")}</h1>

      <div className="grid-row">
        <div className="grid-col-9">
          <p>{t("ChooseStaticDatasetDescription")}</p>
        </div>
      </div>

      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-4 padding-top-1px">
          <Search id="search" onSubmit={onSearch} size="small" />
        </div>
      </div>

      <Table
        selection="single"
        initialSortByField="updatedAt"
        filterQuery={filter}
        rows={React.useMemo(() => staticDatasets, [staticDatasets])}
        screenReaderField="name"
        onSelection={onSelect}
        width="100%"
        pageSize={5}
        columns={React.useMemo(
          () => [
            {
              Header: t("NameUpperCase"),
              accessor: "fileName",
            },
            {
              Header: t("UploadedBy"),
              accessor: "createdBy",
            },
            {
              Header: t("UploadedAt"),
              accessor: "updatedAt",
              Cell: (props: any) => dateFormatter(props.value),
            },
          ],
          [dateFormatter, t]
        )}
      />

      <br />
      <br />
      <hr />
      <Button
        onClick={onSubmit}
        type="submit"
        disabled={json === undefined || json.length === 0}
      >
        {t("SelectAndContinue")}
      </Button>
      <Button
        variant="unstyled"
        className="text-base-dark hover:text-base-darker active:text-base-darkest"
        type="button"
        onClick={onCancel}
      >
        {t("Cancel")}
      </Button>
    </>
  );
}

export default ChooseStaticDataset;
