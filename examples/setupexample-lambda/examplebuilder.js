const TOPIC_AREA_FILE = "topicarea.json";
const DASHBOARD_FILE = "dashboard.json";

class ExampleConfig {
    constructor(example) {
        this.example = example;
        this.topicAreaS3Key = null;
        this.dashboardS3Key = null;
        this.widgets = [];
    }
};

class WidgetConfig {
    constructor(key, name, dataset, datafiles) {
        this.s3Key = key;
        this.name = name;
        this.datasetS3Key = dataset;
        this.datafileS3Keys = datafiles;
    }
};

const splitFilesByPurpose = function (s3Contents) {

    const s3Keys = {
        datafiles: [],
        datasets: [],
        topicAreas: [],
        widgets: [],
        dashboards: []
    };

    for (
        let i = 0, dataLength = s3Contents.length, s3Content = null;
        i < dataLength && (s3Content = s3Contents[i]);
        i++
    ) {

        let s3path = s3Content.Key;

        if (s3path.indexOf("/datasets/") !== -1) {
            s3Keys.datasets.push(s3path);
        }

        if (s3path.indexOf("/data/") !== -1) {
            s3Keys.datafiles.push(s3path);
        }

        if (s3path.indexOf("/widgets/") !== -1) {
            s3Keys.widgets.push(s3path);
        }

        if (s3path.endsWith(TOPIC_AREA_FILE)) {
            s3Keys.topicAreas.push(s3path);
        }

        if (s3path.endsWith(DASHBOARD_FILE)) {
            s3Keys.dashboards.push(s3path);
        }
    }

    return s3Keys;
};

const inContext = function(prefix, example){
    return function(item){
        
        if(prefix===undefined || prefix===null) return item.indexOf(example)!==-1;

        return item.startsWith(prefix) && item.indexOf(example)!==-1;
    }
};

const getFile = function(list, example, fileName, prefix){

    const isInContext = inContext(prefix, example);

    for (
        let i = 0, dataLength = list.length, item = null;
        i < dataLength && (item = list[i]);
        i++
    ) {
        if(isInContext(item) && item.endsWith(fileName)){
            return item;
        }
    }

    return undefined;
};

const getWidgets = function(list, example, prefix){

    const isInContext = inContext(prefix, example);
    let returnList = [];
    for (
        let i = 0, dataLength = list.length, item = null;
        i < dataLength && (item = list[i]);
        i++
    ) {
        if(isInContext(item) && item.indexOf("/widgets/")!==-1  && item.endsWith(`.json`)){
            returnList.push(item);
        }
    }

    return returnList;
};

const getDataset = function(list, example, key, prefix){

    const isInContext = inContext(prefix, example);

    for (
        let i = 0, dataLength = list.length, item = null;
        i < dataLength && (item = list[i]);
        i++
    ) {
        if(isInContext(item) && item.indexOf("/datasets/")!==-1  && item.endsWith(`${key}.json`)){
            return item;
        }
    }

    return undefined;
};

const getDatafiles = function(list, example, key, prefix){
    
    let returnList = [];
    const isInContext = inContext(prefix, example);
    for (
        let i = 0, dataLength = list.length, item = null;
        i < dataLength && (item = list[i]);
        i++
    ) {
        if(isInContext(item) && item.indexOf("/data/")!==-1  && (item.endsWith(`${key}.json`) ||item.endsWith(`${key}.csv`)  )){
            returnList.push(item);
        }
    }

    return returnList;
};

const buildExamplesFromContents = function (s3Contents, prefix) {

    const s3Keys = splitFilesByPurpose(s3Contents);

    var exampleMap = new Map();

    for (
        let i = 0, dataLength = s3Keys.dashboards.length, s3Content = null;
        i < dataLength && (s3Content = s3Keys.dashboards[i]);
        i++
    ) {

        let s3path = s3Content;

        let tokens = s3path.replace(prefix, "").split("/");

        let example = tokens[0];

        let exampleConfig = new ExampleConfig(example);            

        let topicArea = getFile(s3Keys.topicAreas, example, TOPIC_AREA_FILE, prefix);
        exampleConfig.dashboardS3Key = s3path;
        exampleConfig.topicAreaS3Key = topicArea;

        let widgets = getWidgets(s3Keys.widgets, example, prefix);

        for (
            let i = 0, dataLength = widgets.length, widget = null;
            i < dataLength && (widget = widgets[i]);
            i++
        ) {
            let widgetTokens = widget.replace(prefix, "").split("/");
            let key = widgetTokens[widgetTokens.length - 1].split(".")[0];

            let dataset = getDataset(s3Keys.datasets, example, key, prefix);
            let datafiles = getDatafiles(s3Keys.datafiles, example, key, prefix);

            exampleConfig.widgets.push(new WidgetConfig(widget, key, dataset, datafiles));
        }
       
        exampleMap.set(example, exampleConfig);
    }

    return exampleMap;
};

module.exports = {
    buildExamplesFromContents,
    ExampleConfig,
    WidgetConfig,
};