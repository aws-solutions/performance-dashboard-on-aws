const awsWrapper = require('./aws-wrapper');
const crypto = require('crypto');

const TOPIC_AREA_FILE = "topicarea.json";
const DASHBOARD_FILE = "dashboard.json";

const databaseIdPrefixes = {
    dataset : "Dataset",
    dashboard : "Dashboard",
    widget : "Widget",
    topicArea : "TopicArea",
};

class DashboardContext {
    constructor(topicAreaId, dashboardId, exampleBucketKeys) {
      this.topicAreaId = topicAreaId;
      this.dashboardId = dashboardId;
      this.exampleBucketKeys = exampleBucketKeys;
    }
};
class ExampleConfig {
    constructor(example) {
      this.example = example;
      this.topicArea = null;
      this.dashboard = null;
      this.widgets = [];
      this.datasets = [];
      this.datafiles = [];
    }
};
class WidgetConfig {
    constructor(key, name, dataset, datafiles) {
      this.key = key;
      this.name = name;
      this.datasetKey = dataset;
      this.datafiles = datafiles;
    }
};
class DeploymentContext {
    constructor(s3datasetbucket, s3examplesbucket, tableName, createdBy) {
      this.datasetBucket = s3datasetbucket;
      this.examplesBucket = s3examplesbucket;
      this.tableName = tableName;
      this.createdBy = createdBy;
    }
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
}

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
}

const setupDashboardTopicAreaEntities = async function(deploymentContext, exampleBucketKeys){
    
    console.log("Saving TopicArea...");
    const topicAreaId = await saveTopicArea(deploymentContext, exampleBucketKeys.topicArea);

    console.log("Saving Dashboard...");
    const dashboardId = await saveDashboard(deploymentContext, topicAreaId, exampleBucketKeys.dashboard);

    return new DashboardContext(topicAreaId, dashboardId, exampleBucketKeys);
};

const saveText = async function (deploymentContext, dashboardId, widgetKey){

    let widgetEntity = await awsWrapper.getJsonOfKey(deploymentContext.examplesBucket, widgetKey);

    widgetEntity.pk.S = dashboardId;
    widgetEntity.sk.S = generateDBId(databaseIdPrefixes.widget);

    await awsWrapper.dynamoSave(deploymentContext.tableName, widgetEntity);
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

const copyContentToBucket = async function(examplesbucket, exampleFile, datasetBucket, dataFileUUID, fileExtention){

    await awsWrapper.copyContent(examplesbucket, exampleFile, datasetBucket, `public/${dataFileUUID}.${fileExtention}`);
};

const setupExample = async function (deploymentContext, exampleBucketKeys) {

    const dashboardContext = await setupDashboardTopicAreaEntities(deploymentContext, exampleBucketKeys);

    for (
        let i = 0, widgetLength = dashboardContext.exampleBucketKeys.widgets.length, widget = null;
        i < widgetLength && (widget = dashboardContext.exampleBucketKeys.widgets[i]);
        i++
    ) {
        console.log(`Setting up Widget: ${widget.name}`);
        if(widget.name.startsWith("text")){
            console.log(`Saving text for Widget: ${widget.name}`);
            await saveText(deploymentContext, dashboardContext.dashboardId, widget.key);
        }else{
            let datasetUUID = uuidv4();
            let dataFileUUID = uuidv4();
            
            console.log(`Saving chart for Widget: ${widget.name}`);
            await saveChart(deploymentContext, dashboardContext.dashboardId, datasetUUID, dataFileUUID, widget.key);
            console.log(`Saving dataset for Widget: ${widget.name}`);
            await saveDataset(deploymentContext, datasetUUID, dataFileUUID, widget.datasetKey);
    
            let jsonDatasetKey = widget.datafiles[0].endsWith(".json") ? widget.datafiles[0] : widget.datafiles[1];
            let csvDatasetKey = widget.datafiles[0].endsWith(".csv") ? widget.datafiles[0] : widget.datafiles[1];
            
            console.log(`Copying datafiles for Widget: ${widget.name}`);
            await copyContentToBucket(deploymentContext.examplesBucket, jsonDatasetKey, deploymentContext.datasetBucket,dataFileUUID, "json");
            await copyContentToBucket(deploymentContext.examplesBucket, csvDatasetKey, deploymentContext.datasetBucket,dataFileUUID, "csv");
        }


    }
};

const getDataset = function(list, example, key, prefix){

    for (
        let i = 0, dataLength = list.length, item = null;
        i < dataLength && (item = list[i]);
        i++
    ) {
        if(item.startsWith(prefix) && item.indexOf(example)!==-1 && item.indexOf("/datasets/")!==-1  && item.endsWith(`${key}.json`)){
            return item;
        }
    }

    return undefined;
}

const getDatafiles = function(list, example, key, prefix){
    
    let returnList = [];

    for (
        let i = 0, dataLength = list.length, item = null;
        i < dataLength && (item = list[i]);
        i++
    ) {
        if(item.startsWith(prefix)&& item.indexOf(example)!==-1 && item.indexOf("/data/")!==-1  && (item.endsWith(`${key}.json`) ||item.endsWith(`${key}.csv`)  )){
            returnList.push(item);
        }
    }

    return returnList;
}

const buildExamplesFromContents = function(s3Contents, prefix){

    let datafileKeys = [];
    let datasetsKeys = [];

    for (
        let i = 0, dataLength = s3Contents.length, content = null;
        i < dataLength && (content = s3Contents[i]);
        i++
    ) {
        let key = content.Key;

        if(key.indexOf("/datasets/")!==-1){
            datasetsKeys.push(key);
        }

        if(key.indexOf("/data/")!==-1){
            datafileKeys.push(key);
        }
    }

    var exampleMap = new Map();

    for (
        let i = 0, dataLength = s3Contents.length, content = null;
        i < dataLength && (content = s3Contents[i]);
        i++
    ) {

        let s3path = content.Key;

        let tokens = s3path.replace(prefix,"").split("/");

        let example = tokens[0];
        let key = tokens[tokens.length-1].split(".")[0];

        let exampleConfig = exampleMap.get(tokens[0]);

        if(exampleConfig === undefined){
            exampleConfig = new ExampleConfig(example);
            
        }
        
        if(s3path.endsWith(TOPIC_AREA_FILE)){
            exampleConfig.topicArea = s3path;
        }
        else if(s3path.endsWith(DASHBOARD_FILE)){
            exampleConfig.dashboard = s3path;
        }
        else if(s3path.indexOf("/widgets/") !== -1){
            
            let dataset = getDataset(datasetsKeys, example, key, prefix);
            let datafiles = getDatafiles(datafileKeys, example, key, prefix);

            exampleConfig.widgets.push(new WidgetConfig(s3path, key, dataset, datafiles));
        }

        exampleMap.set(example, exampleConfig);
    }   
    
    return exampleMap;
};

const setupDashboards = async function (s3datasetbucket, s3examplesbucket, databasename , createdBy, language) {

    console.log(`${s3datasetbucket} ${s3examplesbucket} ${databasename} ${createdBy} ${language}`)
    const deploymentContext = new DeploymentContext(s3datasetbucket, s3examplesbucket, databasename, createdBy, language);

    const prefix = language+"/"
    console.log("Getting contents of examples bucket...")
    const examplesBucketContent = await awsWrapper.getBucketContents(deploymentContext.examplesBucket, prefix);

    console.log("Building examples to setup...")
    const exampleBucketKeys = buildExamplesFromContents(examplesBucketContent, prefix);

    
    for (const exampleBucketKey of exampleBucketKeys.entries()) {
        console.log(`Setting up ${exampleBucketKey[1].example}`)
        await setupExample(deploymentContext, exampleBucketKey[1]);
    }
}

module.exports = setupDashboards;

