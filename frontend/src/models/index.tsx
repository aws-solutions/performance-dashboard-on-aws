/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

export type TopicArea = {
    id: string;
    name: string;
    createdBy: string;
    dashboardCount: number;
};

export const TopicAreaSortingCriteria = (a: TopicArea, b: TopicArea) => (a.name > b.name ? 1 : -1);

export type PublicTopicArea = {
    id: string;
    name: string;
    dashboards?: Array<Dashboard | PublicDashboard>;
};

export enum DashboardState {
    Draft = "Draft",
    Published = "Published",
    Archived = "Archived",
    PublishPending = "PublishPending",
    Inactive = "Inactive",
}

export enum SourceType {
    IngestApi = "IngestApi",
    FileUpload = "FileUpload",
}

export enum DatasetType {
    DynamicDataset = "DynamicDataset",
    StaticDataset = "StaticDataset",
    CsvFileUpload = "CsvFileUpload",
    CreateNew = "CreateNew",
}

export type Dashboard = {
    id: string;
    name: string;
    version: number;
    parentDashboardId: string;
    topicAreaId: string;
    topicAreaName: string;
    displayTableOfContents: boolean;
    /**
     * @type {any}
     * @deprecated no longer supported
     */
    tableOfContents?: any;
    description?: string;
    releaseNotes?: string;
    widgets: Array<Widget>;
    state: string;
    updatedAt: Date;
    createdBy: string;
    submittedBy?: string;
    publishedBy?: string;
    archivedBy?: string;
    friendlyURL?: string;
    queryMatches?: Array<string>;
};

export type PublicDashboard = {
    id: string;
    name: string;
    topicAreaId: string;
    topicAreaName: string;
    displayTableOfContents: boolean;
    /**
     * @type {any}
     * @deprecated no longer supported
     */
    tableOfContents?: any;
    description?: string;
    widgets: Array<Widget>;
    updatedAt: Date;
    friendlyURL?: string;
    queryMatches?: Array<string>;
};

export type DashboardVersion = {
    id: string;
    version: number;
    state: DashboardState;
    friendlyURL?: string;
};

export type DashboardAuditLog = {
    itemId: string;
    timestamp: Date;
    version: number;
    userId: string;
    event: "Create" | "Update" | "Delete";
    modifiedProperties?: Array<{
        property: string;
        oldValue: any;
        newValue: any;
    }>;
};

export enum WidgetType {
    Text = "Text",
    Chart = "Chart",
    Table = "Table",
    Image = "Image",
    Metrics = "Metrics",
    Section = "Section",
}

export enum ChartType {
    LineChart = "LineChart",
    ColumnChart = "ColumnChart",
    BarChart = "BarChart",
    PartWholeChart = "PartWholeChart",
    PieChart = "PieChart",
    DonutChart = "DonutChart",
}

export interface Widget {
    id: string;
    name: string;
    widgetType: string;
    order: number;
    updatedAt: Date;
    dashboardId: string;
    content: any;
    showTitle: boolean;
    section?: string;
}

export interface ChartWidget extends Widget {
    content: {
        title: string;
        chartType: ChartType;
        datasetId: string;
        summary: string;
        summaryBelow: boolean;
        datasetType?: DatasetType;
        s3Key: {
            raw: string;
            json: string;
        };
        columnsMetadata: ColumnMetadata[];
        sortByColumn?: string;
        sortByDesc?: boolean;
        horizontalScroll?: boolean;
        stackedChart?: boolean;
        significantDigitLabels: boolean;
        dataLabels: boolean;
        computePercentages: boolean;
        showTotal: boolean;
    };
}

export interface TableWidget extends Widget {
    content: {
        title: string;
        datasetId: string;
        summary: string;
        summaryBelow: boolean;
        datasetType?: DatasetType;
        s3Key: {
            raw: string;
            json: string;
        };
        columnsMetadata: ColumnMetadata[];
        sortByColumn?: string;
        sortByDesc?: boolean;
        significantDigitLabels: boolean;
        displayWithPages: boolean;
    };
}

export interface ImageWidget extends Widget {
    content: {
        title: string;
        imageAltText: string;
        summary?: string;
        summaryBelow: boolean;
        s3Key: {
            raw: string;
        };
        filename: string;
        scalePct?: string;
    };
}

export interface MetricsWidget extends Widget {
    content: {
        title: string;
        datasetId: string;
        oneMetricPerRow: boolean;
        datasetType?: DatasetType;
        significantDigitLabels: boolean;
        metricsCenterAlign: boolean;
        s3Key: {
            raw: string;
            json: string;
        };
    };
}

export interface SectionWidget extends Widget {
    content: {
        title: string;
        summary: string;
        widgetIds?: Array<string>;
        showWithTabs: boolean;
        horizontally?: boolean;
    };
}

export enum DatasetSchema {
    None = "None",
    Metrics = "Metrics",
}

export type Dataset = {
    id: string;
    fileName: string;
    s3Key: {
        raw: string;
        json: string;
    };
    createdBy?: string;
    updatedAt?: Date;
    sourceType?: SourceType;
    schema?: DatasetSchema;
};

export type PublicHomepage = {
    title: string;
    description: string;
    dashboards: Array<PublicDashboard>;
};

export type Homepage = {
    title: string;
    description: string;
    updatedAt: Date;
};

export type PublicSettings = {
    dateTimeFormat: {
        date: string;
        time: string;
    };
    navbarTitle?: string;
    colors: {
        primary: string;
        secondary: string;
    };
    topicAreaLabels?: {
        singular: string;
        plural: string;
    };
    customLogoS3Key?: string;
    customFaviconS3Key?: string;
    contactEmailAddress?: string;
    contactUsContent?: string;
    analyticsTrackingId?: string;
};

export type Settings = {
    publishingGuidance: string;
    dateTimeFormat: {
        date: string;
        time: string;
    };
    updatedAt?: Date;
    navbarTitle?: string;
    colors: {
        primary: string;
        secondary: string;
    };
    topicAreaLabels: {
        singular: string;
        plural: string;
    };
    customLogoS3Key?: string;
    customLogoAltText?: string;
    customFaviconS3Key?: string;
    contactEmailAddress?: string;
    adminContactEmailAddress?: string;
    contactUsContent?: string;
    analyticsTrackingId?: string;
};

export type Metric = {
    title: string;
    value: number;
    changeOverTime?: string;
    percentage?: string;
    currency?: string;
    startDate?: string;
    endDate?: string;
};

// Type for the History object in react-router. Defines the
// location state that is common across all routes.
// Usage in a component: useHistory<LocationState>();
export type LocationState = {
    alert?: {
        type: "success" | "warning" | "info" | "error";
        message: string;
        to?: string;
        linkLabel?: string;
    };
    emails?: string;
    usernames?: Array<string>;
    id?: string;
    metrics?: Array<Metric>;
    metric?: Metric;
    position?: number;
    showTitle?: boolean;
    oneMetricPerRow?: boolean;
    significantDigitLabels?: boolean;
    metricsCenterAlign?: boolean;
    metricTitle?: string;
    origin?: string;
    json?: Array<any>;
    staticDataset?: Dataset;
    redirectUrl?: string;
    crumbLabel?: string;
    datasetType?: DatasetType;
};

export enum UserRoles {
    Admin = "Admin",
    Editor = "Editor",
    /**
     * @type {string}
     * @deprecated no longer supported
     */
    Publisher = "Publisher",
    Public = "Public",
}

export type User = {
    userId: string;
    enabled: boolean;
    userStatus: string;
    sub: string;
    email: string;
    roles: Array<UserRoles>;
    createdAt: Date;
    updatedAt: Date;
};

export enum ColumnDataType {
    Number = "Number",
    Text = "Text",
    Date = "Date",
}

export enum NumberDataType {
    Percentage = "Percentage",
    Currency = "Currency",
    "With thousands separators" = "With thousands separators",
}

export enum CurrencyDataType {
    "Dollar $" = "Dollar $",
    "Euro €" = "Euro €",
    "Pound £" = "Pound £",
}

export interface ColumnMetadata {
    columnName: string;
    dataType?: ColumnDataType;
    numberType?: NumberDataType;
    currencyType?: CurrencyDataType;
    hidden: boolean;
}
