/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { LocationState, TopicArea } from "../models";
import Button from "../components/Button";
import BackendService from "../services/BackendService";
import Modal from "../components/Modal";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DropdownMenu from "../components/DropdownMenu";
import Table from "../components/Table";

const MenuItem = DropdownMenu.MenuItem;
interface Props {
    topicareas: Array<TopicArea>;
    reloadTopicAreas: Function;
}

function TopicareaListing(props: Props) {
    const history = useHistory<LocationState>();

    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const [selected, setSelected] = useState<TopicArea | undefined>(undefined);

    const { t } = useTranslation();

    const createTopicArea = () => {
        history.push("/admin/settings/topicarea/create");
    };

    const onEdit = () => {
        if (selected) {
            history.push(`/admin/settings/topicarea/${selected.id}/edit`);
        }
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
            <div className="font-sans-sm">
                <p className="margin-y-0">{t("TopicAreaListingDescription")}</p>
            </div>
            <div className="grid-row margin-y-3">
                <div className="tablet:grid-col-12 text-right">
                    <span>
                        <DropdownMenu
                            buttonText={t("Actions")}
                            variant="outline"
                            ariaLabel={t("ARIA.TopicAreaListingActions")}
                        >
                            <MenuItem
                                onSelect={() => onDeleteTopicArea()}
                                disabled={!selected || selected.dashboardCount > 0}
                                aria-label={t("ARIA.TopicAreaListingDelete")}
                            >
                                {t("Delete")}
                            </MenuItem>

                            <MenuItem
                                onSelect={onEdit}
                                disabled={!selected}
                                title={t("Edit")}
                                aria-label={t("ARIA.TopicAreaListingEdit")}
                            >
                                {t("Edit")}
                            </MenuItem>
                        </DropdownMenu>
                    </span>
                    <span>
                        <Button testid={"createtopicarea"} onClick={createTopicArea}>
                            {t("CreateNewTopicArea")}
                        </Button>
                    </span>
                </div>
            </div>
            <Table
                id="topicAreas"
                selection="single"
                screenReaderField="name"
                initialSortByField="dashboardCount"
                onSelection={onSelect}
                initialSortAscending={false}
                width="100%"
                pageSize={10}
                columns={useMemo(
                    () => [
                        {
                            Header: t("TopicArea"),
                            accessor: "name",
                            Cell: (props: any) => {
                                const topicArea = props.row.original as TopicArea;
                                return (
                                    <span className="text-bold text-base-darker">
                                        {topicArea.name}
                                    </span>
                                );
                            },
                        },
                        {
                            Header: t("Dashboards"),
                            accessor: "dashboardCount",
                            Cell: (props: any) => {
                                const topicArea = props.row.original as TopicArea;
                                return `${
                                    topicArea.dashboardCount ? topicArea.dashboardCount : "-"
                                }`;
                            },
                        },
                        {
                            Header: t("CreatedBy"),
                            accessor: "createdBy",
                        },
                    ],
                    [t],
                )}
                rows={props.topicareas}
            />
        </>
    );
}

export default TopicareaListing;
