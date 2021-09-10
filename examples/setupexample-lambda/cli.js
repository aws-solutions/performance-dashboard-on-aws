const exampleGo = require('./insert-example-dashboard');

exampleGo.handler({
    "tableName": process.env.EXAMPLE_TABLENAME,
    "examples": process.env.EXAMPLE_EXAMPLESBUCKET,
    "datasets": process.env.EXAMPLE_DATASETBUCKET,
    "useremail": process.env.EXAMPLE_USEREMAIL,
  });