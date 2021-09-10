const exampleGo = require('./insert-example-dashboard');

exampleGo.handler({
    "tableName": process.env.EXAMPLE_CLI_TABLENAME,
    "examples": process.env.EXAMPLE_CLI_EXAMPLESBUCKET,
    "datasets": process.env.EXAMPLE_CLI_DATASETBUCKET
  });