const setupDashboards = require('./insert-example-dashboard');

exports.handler = async (event, context) => {
    
  try{
      await setupDashboards(event.datasets, event.examples, event.tableName);
  }catch (e){
      console.log(e)
  }

  return context?.logStreamName
  
};