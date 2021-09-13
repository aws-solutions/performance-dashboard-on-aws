const awsWrapper = require('./aws-wrapper');
const crypto = require('crypto');

const databaseIdPrefixes = {
    dataset : "Dataset",
    dashboard : "Dashboard",
    widget : "Widget",
    topicArea : "TopicArea",
};

const uuidv4 = function () {
    return crypto.randomUUID();
}

const generateDBId = function (prefix, id) {
    
    id = id !== undefined ? id : uuidv4();
    return `${prefix}#${id}`;
}

const saveTopicArea = async function(deploymentContext, topicAreaBucketKey){

    if(deploymentContext===undefined) throw new Error("deploymentContext is undefined");
    if(topicAreaBucketKey===undefined) throw new Error("topicAreaBucketKey is undefined");

    let topicAreaEntity = await awsWrapper.getJsonOfKey(deploymentContext.examplesBucket, topicAreaBucketKey);

    topicAreaEntity.pk.S = generateDBId(databaseIdPrefixes.topicArea);
    topicAreaEntity.sk.S = topicAreaEntity.pk.S;

    topicAreaEntity.createdBy.S = deploymentContext.createdBy;

    await awsWrapper.dynamoSave(deploymentContext.tableName, topicAreaEntity);
    
    return topicAreaEntity.pk.S;
};

const saveDashboard = async function(deploymentContext, topicAreaId, dashboardBucketKey){

    if(deploymentContext===undefined) throw new Error("deploymentContext is undefined");
    if(topicAreaId===undefined) throw new Error("topicAreaId is undefined");
    if(dashboardBucketKey===undefined) throw new Error("dashboardBucketKey is undefined");

    let dashboardEntity = await awsWrapper.getJsonOfKey(deploymentContext.examplesBucket, dashboardBucketKey);

    dashboardEntity.pk.S = generateDBId(databaseIdPrefixes.dashboard);
    dashboardEntity.sk.S = dashboardEntity.pk.S;
    dashboardEntity.parentDashboardId.S = dashboardEntity.pk.S;

    dashboardEntity.publishedBy.S = deploymentContext.createdBy;
    dashboardEntity.submittedBy.S = deploymentContext.createdBy;
    dashboardEntity.createdBy.S = deploymentContext.createdBy;
    dashboardEntity.updatedBy.S = deploymentContext.createdBy;

    dashboardEntity.topicAreaId.S = topicAreaId;

    await awsWrapper.dynamoSave(deploymentContext.tableName, dashboardEntity);
    
    return dashboardEntity.pk.S;
};

const saveChart = async function (deploymentContext, dashboardId, datasetUUID, dataFileUUID, widgetKey){

    if(deploymentContext===undefined) throw new Error("deploymentContext is undefined");
    if(dashboardId===undefined) throw new Error("dashboardId is undefined");
    if(datasetUUID===undefined) throw new Error("datasetUUID is undefined");
    if(dataFileUUID===undefined) throw new Error("datafileUUID is undefined");
    if(widgetKey===undefined) throw new Error("widgetKey is undefined");

    let widgetEntity = await awsWrapper.getJsonOfKey(deploymentContext.examplesBucket, widgetKey);

    widgetEntity.pk.S = dashboardId;
    widgetEntity.sk.S = generateDBId(databaseIdPrefixes.widget);

    widgetEntity.content.M.datasetId.S = datasetUUID;
    widgetEntity.content.M.s3Key.M.raw.S = `${dataFileUUID}.csv`;
    widgetEntity.content.M.s3Key.M.json.S = `${dataFileUUID}.json`;

    await awsWrapper.dynamoSave(deploymentContext.tableName, widgetEntity);
};

const saveDataset = async function (deploymentContext, datasetUUID, dataFileUUID, datasetKey){

    if(deploymentContext===undefined) throw new Error("deploymentContext is undefined");
    if(datasetUUID===undefined) throw new Error("datasetUUID is undefined");
    if(dataFileUUID===undefined) throw new Error("dataFileUUID is undefined");
    if(datasetKey===undefined) throw new Error("datasetKey is undefined");

    let datasetEntity = await awsWrapper.getJsonOfKey(deploymentContext.examplesBucket, datasetKey);

    datasetEntity.pk.S = generateDBId(databaseIdPrefixes.dataset, datasetUUID);
    datasetEntity.sk.S = datasetEntity.pk.S;
    
    datasetEntity.createdBy.S = deploymentContext.createdBy;

    datasetEntity.s3Key.M.raw.S = `${dataFileUUID}.csv`;
    datasetEntity.s3Key.M.json.S = `${dataFileUUID}.json`;

    await awsWrapper.dynamoSave(deploymentContext.tableName, datasetEntity);
};

const saveText = async function (deploymentContext, dashboardId, widgetKey){

    if(deploymentContext===undefined) throw new Error("deploymentContext is undefined");
    if(dashboardId===undefined) throw new Error("dashboardId is undefined");
    if(widgetKey===undefined) throw new Error("widgetKey is undefined");

    let widgetEntity = await awsWrapper.getJsonOfKey(deploymentContext.examplesBucket, widgetKey);

    widgetEntity.pk.S = dashboardId;
    widgetEntity.sk.S = generateDBId(databaseIdPrefixes.widget);

    await awsWrapper.dynamoSave(deploymentContext.tableName, widgetEntity);
};

module.exports = {
    saveChart: saveChart,
    saveDataset: saveDataset,
    saveText: saveText,
    saveDashboard: saveDashboard,
    saveTopicArea: saveTopicArea,
    uuidv4: uuidv4,
    generateDBId: generateDBId,
};