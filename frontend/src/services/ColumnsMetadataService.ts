/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { ColumnDataType, CurrencyDataType, NumberDataType } from "../models";

function getColumnsMetadata(
    hiddenColumns: Set<string>,
    dataTypes: Map<string, ColumnDataType>,
    numberTypes: Map<string, NumberDataType>,
    currencyTypes: Map<string, CurrencyDataType>,
): Array<any> {
    const columnsMetadata = Array.from(hiddenColumns).map((header) => {
        return {
            columnName: header,
            hidden: true,
            dataType: dataTypes.has(header) ? dataTypes.get(header) : undefined,
            numberType:
                dataTypes.get(header) === ColumnDataType.Number && numberTypes.has(header)
                    ? numberTypes.get(header)
                    : undefined,
            currencyType:
                dataTypes.get(header) === ColumnDataType.Number &&
                numberTypes.get(header) === NumberDataType.Currency &&
                currencyTypes.has(header)
                    ? currencyTypes.get(header)
                    : undefined,
        };
    });

    dataTypes.forEach((dataType, columnName) => {
        if (!hiddenColumns.has(columnName)) {
            columnsMetadata.push({
                columnName,
                hidden: false,
                dataType,
                numberType:
                    dataTypes.get(columnName) === ColumnDataType.Number &&
                    numberTypes.has(columnName)
                        ? numberTypes.get(columnName)
                        : undefined,
                currencyType:
                    dataTypes.get(columnName) === ColumnDataType.Number &&
                    numberTypes.get(columnName) === NumberDataType.Currency &&
                    currencyTypes.has(columnName)
                        ? currencyTypes.get(columnName)
                        : undefined,
            });
        }
    });

    return columnsMetadata;
}

type ColumnMetadata = {
    hiddenColumns: Set<string>;
    dataTypes: Map<string, ColumnDataType>;
    numberTypes: Map<string, NumberDataType>;
    currencyTypes: Map<string, CurrencyDataType>;
};

function parseColumnsMetadata(columnsMetadata: Array<any>): ColumnMetadata {
    const hiddenColumns = new Set<string>();
    columnsMetadata
        .filter((column: any) => column.hidden)
        .forEach((column: any) => hiddenColumns.add(column.columnName));

    const dataTypes = new Map<string, ColumnDataType>();
    columnsMetadata
        .filter((column: any) => !!column.dataType)
        .forEach((column: any) => dataTypes.set(column.columnName, column.dataType));

    const numberTypes = new Map<string, NumberDataType>();
    columnsMetadata
        .filter((column: any) => !!column.numberType)
        .forEach((column: any) => numberTypes.set(column.columnName, column.numberType));

    const currencyTypes = new Map<string, CurrencyDataType>();
    columnsMetadata
        .filter((column: any) => !!column.currencyType)
        .forEach((column: any) => currencyTypes.set(column.columnName, column.currencyType));

    return { hiddenColumns, dataTypes, numberTypes, currencyTypes };
}

// 1000000
// Currency USD
// Enable significant digit labels

function formatNumber(
    value: number,
    numberType: NumberDataType | undefined,
    currencyType: CurrencyDataType | undefined,
): string {
    if (numberType === NumberDataType["With thousands separators"]) {
        return value.toLocaleString();
    } else if (numberType === NumberDataType.Percentage) {
        return `${value.toLocaleString()}%`;
    } else if (numberType === NumberDataType.Currency) {
        if (currencyType === CurrencyDataType["Dollar $"]) {
            return value.toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
            });
        } else if (currencyType === CurrencyDataType["Euro €"]) {
            return value.toLocaleString(undefined, {
                style: "currency",
                currency: "EUR",
            });
        } else if (currencyType === CurrencyDataType["Pound £"]) {
            return value.toLocaleString(undefined, {
                style: "currency",
                currency: "GBP",
            });
        } else {
            return value.toLocaleString();
        }
    } else {
        return value.toLocaleString();
    }
}

const ColumnsMetadataService = {
    getColumnsMetadata,
    parseColumnsMetadata,
    formatNumber,
};

export default ColumnsMetadataService;
