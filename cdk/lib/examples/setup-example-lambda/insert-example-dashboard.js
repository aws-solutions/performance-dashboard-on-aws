const aws = require('aws-sdk');
const { fsync } = require('fs');
const s3 = new aws.S3();
const awsWrapper = require('./aws-wrapper');
const pdapp = require('./pdapp');

const TOPIC_AREA_FILE = "topicarea.json";

const databaseIdPrefixes = {
    dataset : "Dataset",
    dashboard : "Dashboard",
    widget : "Widget",
    topicArea : "TopicArea",
};

class ExampleContext {
    constructor(topicAreaId, dashboardId, example) {
      this.topicAreaId = topicAreaId;
      this.dashboardId = dashboardId;
      this.example = example;
    }
}
class DeploymentContext {
    constructor(s3datasetbucket, s3examplesbucket, databasename) {
      this.datasetBucket = s3datasetbucket;
      this.examplesBucket = s3examplesbucket;
      this.databaseName = databasename;
    }
}
  
/**
 * Best practice is to use the uuidv4 module which is maintained. This is done here 
 * to not have dependencies. Since this is used for examples and not for actual cryptographic
 * this should be fine.
 * @returns string
 */
const uuidv4 = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const generateDBId = function (prefix) {
    return `${prefix}#${uuidv4()}`
}



const setupTopic = async function(deploymentContext){

    const topicAreaEntity = await awsWrapper.getS3Content(example, TOPIC_AREA_FILE);

    const topicAreaId = await pdapp.saveTopicArea(deploymentContext.databaseName, topicAreaEntity);
    
    return topicAreaId;
}

const setupDashboard = async function(deploymentContext, topicAreaId){

    const dashboardEntity = await awsWrapper.getS3Content(example, DASHBOARD_FILE);

    const dashboardId = await pdapp.saveDashboard(deploymentContext.databaseName, dashboardEntity, topicAreaId);
    
    return dashboardId;
}

const generateExampleContext = async function(example, deployedContext){
    
    const exampleConfig = await awsWrapper.getBucketContents(example);

    const topicAreaId = await setupTopic(exampleConfig, deployedContext);

    const dashboardId = await setupTopic(exampleConfig, topicAreaId, deployedContext);

    return new ExampleContext(topicAreaId, dashboardId, exampleConfig);

};

const setupWidget = async function(exampleContext, widget, dataset, data){
    
    const widgetContent = await awsWrapper.getS3Content(exampleContext, WIDGETS_FOLDER);
};

const setupExample = async function (example, deployedContext) {

    const exampleContext = generateExampleContext(example, deployedContext);

    const widgetList = await awsWrapper.getS3Content(exampleContext, WIDGETS_FOLDER);

    const datasetList = await awsWrapper.getS3Content(exampleContext, DATASETS_FOLDER);

    const dataList = await awsWrapper.getS3Content(exampleContext, DATA_FOLDER);

    const datasetMap = new Map(datasetList.map(i => [i.name, i]));

    const dataListMap = new Map(dataList.map(i => [i.name, i]));

    for (
        let i = 0, widgetLength = widgetList.length, widget = null;
        i < widgetLength && (example = widgetList[i]);
        i++
    ) {

        let dataset = datasetMap.get(widget.name);
        let data = dataMap.get(widget.name);

        await setupWidget(widget, dataset, data);
    }
};

const getExampleSets = function (bucketname) {
    return awsWrapper.getBucketContents(bucketname);
};

const setupDashboards = async function (s3datasetbucket, s3examplesbucket, databasename) {

    const deployedContext = new DeploymentContext(s3datasetbucket, s3examplesbucket, databasename);

    const examples = await getExampleSets(deployedContext.examplesBucket);

    for (
        let i = 0, dataLength = examples.length, example = null;
        i < dataLength && (example = examples[i]);
        i++
    ) {

        await setupExample(example, deployedContext);
    }
};

module.exports = setupDashboards;

