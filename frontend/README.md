This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Frontend

This is a React application that serves as the frontend for the Performance Dasboard on AWS.

### Run locally

To run the frontend locally against your deployed instance on AWS, create the file `public/env.js` and add the following content to it. Replace the values for each variable with your corresponding values for your environment. You can get these values from the Outputs of the CloudFormation stacks that got created when you deployed the Performance Dashboard.

```js
const env = {
  region: "us-west-2",
  backendApi: "https://123.execute-api.us-west-2.amazonaws.com/prod/",
  //backendApi: "http://localhost:8080/", (In case you want to run the Frontend against your local Backend, uncomment this and comment the other backendApi)
  userPoolId: "us-west-2_abcd",
  appClientId: "123456789",
  datasetsBucket: "performancedash-fdingler-000000000000-us-east-1-datasets",
  identityPoolId: "us-west-2:123456-123-1234-123456-1234566789",
  contactEmail: "support@example.com",
  brandName: "Performance Dashboard",
  topicAreaLabel: "Topic Area",
};

window.EnvironmentConfig = env;
```

Then run the following command:

```bash
npm start
```

It will run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

### Run unit tests

```bash
npm test
```
