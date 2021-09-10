const setupDashboards = require('./insert-example-dashboard');

exports.handler = async (event, context) => {


  try {

    let tableName = event.tableName === undefined ? process.env.EXAMPLE_CLI_TABLENAME : event.tableName;
    let examples = event.examples === undefined ? process.env.EXAMPLE_CLI_EXAMPLESBUCKET : event.examples;
    let datasets = event.datasets === undefined ? process.env.EXAMPLE_CLI_DATASETBUCKET : event.datasets;

    await setupDashboards(datasets, examples, tableName);

  } catch (e) {
    console.log(e)
  }
  
  return context?.logStreamName

};