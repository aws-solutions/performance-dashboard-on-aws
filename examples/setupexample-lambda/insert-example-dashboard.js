const awsWrapper = require("./aws-wrapper");
const appdatabase = require("./appdatabase");
const examplebuilder = require("./examplebuilder");

class DashboardContext {
    constructor(topicAreaId, dashboardId, exampleBucketKeys) {
      this.topicAreaId = topicAreaId;
      this.dashboardId = dashboardId;
      this.exampleBucketKeys = exampleBucketKeys;
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

const setupDashboardTopicAreaEntities = async function(deploymentContext, exampleBucketKeys){
    
    console.log("Saving TopicArea...");
    const topicAreaId = await appdatabase.saveTopicArea(deploymentContext, exampleBucketKeys.topicAreaS3Key);

    console.log("Saving Dashboard...");
    const dashboardId = await appdatabase.saveDashboard(deploymentContext, topicAreaId, exampleBucketKeys.dashboardS3Key);

    return new DashboardContext(topicAreaId, dashboardId, exampleBucketKeys);
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
            await appdatabase.saveText(deploymentContext, dashboardContext.dashboardId, widget.s3Key);
        }else{
            let datasetUUID = appdatabase.uuidv4();
            let dataFileUUID = appdatabase.uuidv4();
            
            console.log(`Saving chart for Widget: ${widget.name}`);
            await appdatabase.saveChart(deploymentContext, dashboardContext.dashboardId, datasetUUID, dataFileUUID, widget.s3Key);
            console.log(`Saving dataset for Widget: ${widget.name}`);
            await appdatabase.saveDataset(deploymentContext, datasetUUID, dataFileUUID, widget.datasetS3Key);
    
            let jsonDatasetKey = widget.datafileS3Keys[0].endsWith(".json") ? widget.datafileS3Keys[0] : widget.datafileS3Keys[1];
            let csvDatasetKey = widget.datafileS3Keys[0].endsWith(".csv") ? widget.datafileS3Keys[0] : widget.datafileS3Keys[1];
            
            console.log(`Copying datafiles for Widget: ${widget.name}`);
            await copyContentToBucket(deploymentContext.examplesBucket, jsonDatasetKey, deploymentContext.datasetBucket,dataFileUUID, "json");
            await copyContentToBucket(deploymentContext.examplesBucket, csvDatasetKey, deploymentContext.datasetBucket,dataFileUUID, "csv");
        }


    }
};

const setupDashboards = async function (s3datasetbucket, s3examplesbucket, databasename , createdBy, language) {

    const deploymentContext = new DeploymentContext(s3datasetbucket, s3examplesbucket, databasename, createdBy, language);

    const prefix = language+"/"

    console.log("Getting contents of examples bucket...")
    const examplesBucketContent = await awsWrapper.getBucketContents(deploymentContext.examplesBucket, prefix);

    console.log("Building examples to setup...")
    const exampleBucketKeys = examplebuilder.buildExamplesFromContents(examplesBucketContent, prefix);

    
    for (const exampleBucketKey of exampleBucketKeys.entries()) {
        console.log(`Setting up ${exampleBucketKey[1].example}`)
        await setupExample(deploymentContext, exampleBucketKey[1]);
    }
}

module.exports = setupDashboards;

