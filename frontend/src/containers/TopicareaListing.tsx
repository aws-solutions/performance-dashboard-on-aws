import React, { useState } from "react";
import { useTopicAreas } from "../hooks";
import AlertContainer from "./AlertContainer";
import Spinner from "../components/Spinner";
import Search from "../components/Search";
import { LocationState, TopicArea } from "../models";
import Button from "../components/Button";
import ScrollTop from "../components/ScrollTop";
import TopicareasTable from "../components/TopicareasTable";
import EnvConfig from "../services/EnvConfig";
import BackendService from "../services/BackendService";
import Modal from "../components/Modal";
import { useHistory } from "react-router-dom";
import Tooltip from "../components/Tooltip";

function TopicareaListing() {
  const history = useHistory<LocationState>();
  const { topicareas, loading, reloadTopicAreas } = useTopicAreas();

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<TopicArea | undefined>(undefined);

  const createTopicArea = () => {
    history.push("/admin/settings/topicarea/create");
  };

  const onEdit = () => {
    if (selected) {
      history.push(`/admin/settings/topicarea/${selected.id}/edit`);
    }
  };

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = (selectedTopicArea: Array<TopicArea>) => {
    if (selectedTopicArea.length > 0) {
      setSelected(selectedTopicArea[0]);
    }
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const onDeleteTopicArea = () => {
    setIsOpenDeleteModal(true);
  };

  const deleteTopicArea = async () => {
    closeDeleteModal();

    if (selected) {
      await BackendService.deleteTopicArea(selected.id);

      history.replace("/admin/settings/topicarea", {
        alert: {
          type: "success",
          message: `"${
            selected.name
          }" ${EnvConfig.topicAreaLabel.toLowerCase()} successfully deleted`,
        },
      });

      await reloadTopicAreas();
    }
  };

  const filterTopicAreas = (topicAreas: Array<TopicArea>): Array<TopicArea> => {
    return topicAreas.filter((topicarea) => {
      const name = topicarea.name.toLowerCase().trim();
      const dashboardCount = topicarea.dashboardCount.toString().trim();
      const createdBy = topicarea.createdBy.toLowerCase().trim();
      const query = filter.toLowerCase();
      return (
        name.includes(query) ||
        dashboardCount.includes(query) ||
        createdBy.includes(query)
      );
    });
  };

  const sortTopicareas = (topicAreas: Array<TopicArea>): Array<TopicArea> => {
    return [...topicAreas].sort((a, b) => {
      return a.name > b.name ? -1 : 1;
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpenDeleteModal}
        closeModal={closeDeleteModal}
        title={`Delete "${
          selected?.name
        }" ${EnvConfig.topicAreaLabel.toLowerCase()}?`}
        message={`Are you sure you want to delete this ${EnvConfig.topicAreaLabel.toLowerCase()}?`}
        buttonType="Delete"
        buttonAction={deleteTopicArea}
      />

      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <h3 id="section-heading-h3">{`${EnvConfig.topicAreasLabel} (${topicareas.length})`}</h3>
          <AlertContainer />
          <div className="grid-row margin-y-3">
            <div className="tablet:grid-col-4 padding-top-1px">
              <Search id="search" onSubmit={onSearch} size="small" />
            </div>
            <div className="tablet:grid-col-8 text-right">
              <span
                className="text-underline"
                data-for="delete"
                data-tip=""
                data-border={true}
              >
                <span>
                  <Button
                    variant="outline"
                    disabled={!selected || selected.dashboardCount > 0}
                    onClick={() => onDeleteTopicArea()}
                  >
                    Delete
                  </Button>
                </span>
              </span>
              {selected && selected.dashboardCount > 0 && (
                <Tooltip
                  id="delete"
                  place="bottom"
                  effect="solid"
                  offset={{ bottom: 8 }}
                  getContent={() => (
                    <div className="font-sans-sm">
                      <p className="margin-y-0">
                        {`You can only delete ${EnvConfig.topicAreasLabel.toLocaleLowerCase()} ` +
                          `that have zero dashboards`}
                      </p>
                    </div>
                  )}
                />
              )}
              <span>
                <Button variant="outline" disabled={!selected} onClick={onEdit}>
                  Edit
                </Button>
              </span>
              <span>
                <Button
                  onClick={createTopicArea}
                >{`Create ${EnvConfig.topicAreaLabel.toLowerCase()}`}</Button>
              </span>
            </div>
          </div>
          <TopicareasTable
            topicAreas={sortTopicareas(filterTopicAreas(topicareas))}
            onSelect={onSelect}
          />
          <div className="text-right">
            <ScrollTop />
          </div>
        </>
      )}
    </>
  );
}

export default TopicareaListing;
