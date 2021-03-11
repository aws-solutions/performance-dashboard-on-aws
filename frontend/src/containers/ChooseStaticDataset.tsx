import React, { useState, useCallback } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { useHistory, useParams } from "react-router-dom";
import { LocationState } from "../models";
import {
  useDashboard,
  useDateTimeFormatter,
  useSettings,
  useDatasets,
} from "../hooks";
import Table from "../components/Table";
import Button from "../components/Button";
import Search from "../components/Search";
import ScrollTop from "../components/ScrollTop";
import { Dataset } from "../models";

interface PathParams {
  dashboardId: string;
}

function ChooseStaticDataset() {
  const history = useHistory<LocationState>();
  const { state } = history.location;

  const dateFormatter = useDateTimeFormatter();

  const { dashboardId } = useParams<PathParams>();
  const { dashboard } = useDashboard(dashboardId);
  const { staticDatasets } = useDatasets();
  const { settings } = useSettings();

  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Array<Dataset>>([]);

  const crumbs = [
    {
      label: "Dashboards",
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
      label: "Choose static dataset",
      url: "",
    },
  ];

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onCancel = () => {
    history.goBack();
  };

  const onSelect = useCallback((selectedDataset: Array<Dataset>) => {
    setSelected(selectedDataset);
  }, []);

  const onSubmit = () => {
    history.replace({
      pathname: state.redirectUrl,
      state: {
        json: selected[0].s3Key.json,
      },
    });
  };

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Choose static dataset</h1>

      <div className="grid-row">
        <div className="grid-col-9">
          <p>
            These are all of the static datasets that have been uploaded. Find
            and select a dataset to use in your visualization.
          </p>
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
              Header: "Name",
              accessor: "fileName",
            },
            {
              Header: "Uploaded by",
              accessor: "createdBy",
            },
            {
              Header: "Uploaded at",
              accessor: "updatedAt",
            },
          ],
          [dateFormatter, settings]
        )}
      />
      <div className="text-right">
        <ScrollTop />
      </div>

      <br />
      <br />
      <hr />
      <Button
        onClick={onSubmit}
        type="submit"
        disabled={selected === undefined || selected.length == 0}
      >
        Select and continue
      </Button>
      <Button
        variant="unstyled"
        className="text-base-dark hover:text-base-darker active:text-base-darkest"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </>
  );
}

export default ChooseStaticDataset;
