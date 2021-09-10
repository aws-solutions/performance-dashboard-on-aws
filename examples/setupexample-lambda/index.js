const setupDashboards = require('./insert-example-dashboard');

exports.handler = async (event, context) => {


  try {

    let tableName = event.tableName === undefined ? process.env.EXAMPLE_TABLENAME : event.tableName;
    let examples = event.examples === undefined ? process.env.EXAMPLE_EXAMPLESBUCKET : event.examples;
    let datasets = event.datasets === undefined ? process.env.EXAMPLE_DATASETBUCKET : event.datasets;
    let useremail = event.useremail === undefined ? process.env.EXAMPLE_USEREMAIL : event.useremail;

    await setupDashboards(datasets, examples, tableName, useremail);

  } catch (e) {
    console.log(e)
  }

  return context?.logStreamName

};