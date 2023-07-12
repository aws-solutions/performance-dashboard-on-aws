/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useMemo, MouseEvent } from "react";
import { ColumnDataType, CurrencyDataType, NumberDataType } from "../models";
import TickFormatter from "../services/TickFormatter";
import UtilsService from "../services/UtilsService";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Table from "./Table";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../hooks";

interface Props {
    hiddenColumns: Set<string>;
    setHiddenColumns: Function;
    backStep: (event: MouseEvent<HTMLButtonElement>) => void;
    advanceStep: (event: MouseEvent<HTMLButtonElement>) => void;
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
    data: Array<any>;
    dataTypes: Map<string, ColumnDataType>;
    setDataTypes: Function;
    numberTypes: Map<string, NumberDataType>;
    setNumberTypes: Function;
    currencyTypes: Map<string, CurrencyDataType>;
    setCurrencyTypes: Function;
    sortByColumn?: string;
    sortByDesc?: boolean;
    setSortByColumn?: Function;
    setSortByDesc?: Function;
    reset?: Function;
    widgetType: string;
}

function CheckData(props: Props) {
    const { t } = useTranslation();
    const windowSize = useWindowSize();
    const isMobile = windowSize.width <= 600;

    const handleHideFromVisualizationChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            const target = event.target as HTMLInputElement;
            const newHiddenColumns = new Set(props.hiddenColumns);
            if (target.checked) {
                newHiddenColumns.delete(target.name);
            } else {
                newHiddenColumns.add(target.name);
            }
            props.setHiddenColumns(newHiddenColumns);
        },
        [props.hiddenColumns],
    );

    const handleDataTypeChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            const target = event.target as HTMLInputElement;
            const newDataTypes = new Map(props.dataTypes);

            if (target.value === ColumnDataType.Text) {
                newDataTypes.set(target.id, ColumnDataType.Text);
            } else if (target.value === ColumnDataType.Number) {
                newDataTypes.set(target.id, ColumnDataType.Number);
            } else if (target.value === ColumnDataType.Date) {
                newDataTypes.set(target.id, ColumnDataType.Date);
            } else {
                newDataTypes.delete(target.id);
            }

            props.setDataTypes(newDataTypes);
        },
        [props.dataTypes],
    );

    const handleNumberTypeChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            const target = event.target as HTMLInputElement;
            const newNumberTypes = new Map(props.numberTypes);

            if (target.value === NumberDataType.Percentage) {
                newNumberTypes.set(target.id, NumberDataType.Percentage);
            } else if (target.value === NumberDataType.Currency) {
                newNumberTypes.set(target.id, NumberDataType.Currency);
            } else if (target.value === NumberDataType["With thousands separators"]) {
                newNumberTypes.set(target.id, NumberDataType["With thousands separators"]);
            } else {
                newNumberTypes.delete(target.id);
            }

            props.setNumberTypes(newNumberTypes);
        },
        [props.numberTypes],
    );

    const handleCurrencyTypeChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            const target = event.target as HTMLInputElement;
            const newCurrencyTypes = new Map(props.currencyTypes);

            if (target.value === CurrencyDataType["Dollar $"]) {
                newCurrencyTypes.set(target.id, CurrencyDataType["Dollar $"]);
            } else if (target.value === CurrencyDataType["Euro €"]) {
                newCurrencyTypes.set(target.id, CurrencyDataType["Euro €"]);
            } else if (target.value === CurrencyDataType["Pound £"]) {
                newCurrencyTypes.set(target.id, CurrencyDataType["Pound £"]);
            } else {
                newCurrencyTypes.delete(target.id);
            }

            props.setCurrencyTypes(newCurrencyTypes);
        },
        [props.currencyTypes],
    );

    const handleCell = (properties: any, header: any) => {
        const row = properties.row.original;
        const cellHeader = !UtilsService.isCellEmpty(row[header])
            ? row[header].toLocaleString()
            : "-";
        if (!props.dataTypes.has(header)) {
            return cellHeader;
        }
        if (props.dataTypes.get(header) === ColumnDataType.Number) {
            return typeof row[header] === "number" ? (
                TickFormatter.format(row[header], 0, false, "", "", {
                    columnName: header,
                    hidden: props.hiddenColumns.has(header),
                    dataType: ColumnDataType.Number,
                    numberType: props.numberTypes.get(header),
                    currencyType: props.currencyTypes.get(header),
                })
            ) : (
                <div className="text-secondary-vivid">{`! ${cellHeader}`}</div>
            );
        }
        if (props.dataTypes.get(header) === ColumnDataType.Date) {
            return !isNaN(Date.parse(row[header])) ? (
                row[header].toLocaleString()
            ) : (
                <div className="text-secondary-vivid">{`! ${cellHeader}`}</div>
            );
        }
        if (props.dataTypes.get(header) === ColumnDataType.Text) {
            return cellHeader;
        }
        return cellHeader;
    };

    const checkDataTableRows = useMemo(() => props.data || [], [props.data]);
    const dataColumns = props.data.length ? Object.keys(props.data[0]) : [];
    const checkDataTableColumns = useMemo(
        () =>
            dataColumns.map((header, i) => {
                return {
                    Header: () => (
                        <span className="text-center usa-checkbox margin-bottom-1">
                            <input
                                className="usa-checkbox__input"
                                id={`checkbox-header-${i}`}
                                type="checkbox"
                                aria-label={header + " " + t("CheckBox")}
                                name={header}
                                defaultChecked={!props.hiddenColumns.has(header)}
                                onChange={handleHideFromVisualizationChange}
                            />
                            <label
                                className="usa-checkbox__label"
                                htmlFor={`checkbox-header-${i}`}
                            ></label>
                        </span>
                    ),
                    id: `checkbox${header}`,
                    columns: [
                        {
                            Header: header,
                            id: header,
                            accessor: header,
                            minWidth: 150,
                            Cell: (properties: any) => {
                                return handleCell(properties, header);
                            },
                        },
                    ],
                };
            }),
        [props.data, props.dataTypes, props.numberTypes, props.currencyTypes],
    );

    return (
        <>
            <div className={`usa-hint ${isMobile ? "grid-col-12" : "grid-col-6"}`}>
                {t("CheckDataDescription", { widgetType: props.widgetType })}
            </div>

            <div className="grid-col-12 margin-top-3 font-sans-md text-bold">
                {t("IncludeInVisualization")}
            </div>

            <div className="check-data-table grid-col-12">
                <Table
                    id="items"
                    selection="none"
                    rows={checkDataTableRows}
                    initialSortAscending={props.sortByDesc !== undefined ? !props.sortByDesc : true}
                    initialSortByField={props.sortByColumn}
                    pageSize={50}
                    disablePagination={false}
                    disableBorderless={true}
                    columns={checkDataTableColumns}
                    hiddenColumns={props.hiddenColumns}
                    addNumbersColumn={true}
                    sortByColumn={props.sortByColumn}
                    sortByDesc={props.sortByDesc}
                    setSortByColumn={props.setSortByColumn}
                    setSortByDesc={props.setSortByDesc}
                    reset={props.reset}
                    keepBorderBottom
                    mobileNavigation
                    settingTable={true}
                />
            </div>
            <br />

            <div className="grid-col-12 margin-top-3 font-sans-md text-bold">
                {t("FormatColumns")}
            </div>

            <div className="grid-col-12 font-sans-md font-sans-md text-bold">
                {(props.data.length ? Object.keys(props.data[0]) : []).map((header: string) => {
                    return (
                        <div key={header} className="margin-top-4">
                            <span className="text-base">{t("CheckDataHeader", { header })}</span>

                            <div className={isMobile ? "grid-col-8" : "grid-col-4"}>
                                <Dropdown
                                    id={header}
                                    name="dataType"
                                    label={t("DataFormat")}
                                    options={[
                                        {
                                            value: "",
                                            label: t("SelectAnOption"),
                                        },
                                        {
                                            value: ColumnDataType.Text,
                                            label: t("Text"),
                                        },
                                        {
                                            value: ColumnDataType.Number,
                                            label: t("Number"),
                                        },
                                        {
                                            value: ColumnDataType.Date,
                                            label: t("Date"),
                                        },
                                    ]}
                                    value={props.dataTypes.get(header)}
                                    onChange={handleDataTypeChange}
                                    className="margin-top-2"
                                />
                            </div>

                            {props.dataTypes.get(header) === ColumnDataType.Number && (
                                <div className={isMobile ? "grid-col-8" : "grid-col-4"}>
                                    <Dropdown
                                        id={header}
                                        name="numberType"
                                        label={t("NumberFormat")}
                                        options={[
                                            {
                                                value: "",
                                                label: t("SelectAnOption"),
                                            },
                                            {
                                                value: NumberDataType.Percentage,
                                                label: t("Percentage"),
                                            },
                                            {
                                                value: NumberDataType.Currency,
                                                label: t("Currency"),
                                            },
                                            {
                                                value: NumberDataType["With thousands separators"],
                                                label: t("WithThousandsSeparators"),
                                            },
                                        ]}
                                        value={props.numberTypes.get(header)}
                                        onChange={handleNumberTypeChange}
                                        className="margin-top-3"
                                    />
                                </div>
                            )}

                            {props.dataTypes.get(header) === ColumnDataType.Number &&
                                props.numberTypes.get(header) === NumberDataType.Currency && (
                                    <div className={isMobile ? "grid-col-8" : "grid-col-4"}>
                                        <Dropdown
                                            id={header}
                                            name="currencyType"
                                            label={t("Currency")}
                                            options={[
                                                {
                                                    value: "",
                                                    label: t("SelectAnOption"),
                                                },
                                                {
                                                    value: CurrencyDataType["Dollar $"],
                                                    label: t("Dollar"),
                                                },
                                                {
                                                    value: CurrencyDataType["Euro €"],
                                                    label: t("Euro"),
                                                },
                                                {
                                                    value: CurrencyDataType["Pound £"],
                                                    label: t("Pound"),
                                                },
                                            ]}
                                            value={props.currencyTypes.get(header)}
                                            onChange={handleCurrencyTypeChange}
                                            className="margin-top-3"
                                        />
                                    </div>
                                )}
                            <br />
                            <hr />
                        </div>
                    );
                })}
            </div>

            <br />
            <Button
                variant="outline"
                type="button"
                onClick={props.backStep}
                className="margin-top-1"
            >
                {t("BackButton")}
            </Button>
            <Button
                type="button"
                onClick={props.advanceStep}
                disabled={!props.data.length}
                className="margin-top-1"
            >
                {t("ContinueButton")}
            </Button>
            <Button
                variant="unstyled"
                className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-1"
                type="button"
                onClick={props.onCancel}
            >
                {t("Cancel")}
            </Button>
        </>
    );
}

export default CheckData;
