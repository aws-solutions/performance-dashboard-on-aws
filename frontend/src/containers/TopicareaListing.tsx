import React, { useState } from "react";
import Search from "../components/Search";
import { LocationState, TopicArea } from "../models";
import Button from "../components/Button";
import TopicareasTable from "../components/TopicareasTable";
import BackendService from "../services/BackendService";
import Modal from "../components/Modal";
import { useHistory } from "react-router-dom";
import Tooltip from "../components/Tooltip";
import { useSettings } from "../hooks";
import { useTranslation } from "react-i18next";

interface Props {
  topicareas: Array<TopicArea>;
  reloadTopicAreas: Function;
}

function TopicareaListing(props: Props) {
  const history = useHistory<LocationState>();

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<TopicArea | undefined>(undefined);

  const { settings } = useSettings();

  const { t } = useTranslation();

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
          message: t("SettingsTopicAreaNameSuccessfullyDeleted", {
            name: `${selected.name}`,
          }),
        },
      });

      await props.reloadTopicAreas();
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
        title={t("DeleteTopicArea", { name: selected?.name })}
        message={t("ConfirmDeleteTopicArea")}
        buttonType="Delete"
        buttonAction={deleteTopicArea}
      />

      <h2 id="section-heading-h3">{`${t("TopicArea", {
        count: props.topicareas.length,
      })} (${props.topicareas.length})`}</h2>
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
                {t("Delete")}
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
                    {t("OnlyEmptyTopicAreasCanBeDeleted")}
                  </p>
                </div>
              )}
            />
          )}
          <span>
            <Button variant="outline" disabled={!selected} onClick={onEdit}>
              {t("Edit")}
            </Button>
          </span>
          <span>
            <Button testid={"createtopicarea"} onClick={createTopicArea}>
              {t("CreateNewTopicArea")}
            </Button>
          </span>
        </div>
      </div>
      <TopicareasTable
        topicAreas={sortTopicareas(filterTopicAreas(props.topicareas))}
        onSelect={onSelect}
      />
    </>
  );
}

export default TopicareaListing;
