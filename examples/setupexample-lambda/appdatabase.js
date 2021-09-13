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

    let topicAreaEntity = await awsWrapper.getJsonOfKey(deploymentContext.examplesBucket, topicAreaBucketKey);

    topicAreaEntity.pk.S = generateDBId(databaseIdPrefixes.topicArea);
    topicAreaEntity.sk.S = topicAreaEntity.pk.S;

    topicAreaEntity.createdBy.S = deploymentContext.createdBy;

    await awsWrapper.dynamoSave(deploymentContext.tableName, topicAreaEntity);
    
    return topicAreaEntity.pk.S;
};

const saveDashboard = async function(deploymentContext, topicAreaId, dashboardBucketKey){

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

const saveChart = async function (deploymentContext, dashboardId, datasetUUID, datafileUUID, widgetKey){

    let widgetEntity = await awsWrapper.getJsonOfKey(deploymentContext.examplesBucket, widgetKey);

    widgetEntity.pk.S = dashboardId;
    widgetEntity.sk.S = generateDBId(databaseIdPrefixes.widget);

    widgetEntity.content.M.datasetId.S = datasetUUID;
    widgetEntity.content.M.s3Key.M.raw.S = `${datafileUUID}.csv`;
    widgetEntity.content.M.s3Key.M.json.S = `${datafileUUID}.json`;

    await awsWrapper.dynamoSave(deploymentContext.tableName, widgetEntity);
};

const saveDataset = async function (deploymentContext, datasetUUID, dataFileUUID, datasetKey){

    let datasetEntity = await awsWrapper.getJsonOfKey(deploymentContext.examplesBucket, datasetKey);

    datasetEntity.pk.S = generateDBId(databaseIdPrefixes.dataset, datasetUUID);
    datasetEntity.sk.S = datasetEntity.pk.S;
    
    datasetEntity.createdBy.S = deploymentContext.createdBy;

    datasetEntity.s3Key.M.raw.S = `${dataFileUUID}.csv`;
    datasetEntity.s3Key.M.json.S = `${dataFileUUID}.json`;

    await awsWrapper.dynamoSave(deploymentContext.tableName, datasetEntity);
};

const saveText = async function (deploymentContext, dashboardId, widgetKey){

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