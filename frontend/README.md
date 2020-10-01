This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Frontend

This is a React application that serves as the frontend for the Performance Dasboard on AWS.

### Run locally

To run the frontend locally against your deployed instance on AWS, create a file called `.env.local` in the root of this folder and add the following content to it. Enter the corresponding values for each environment variable. You can get these values from the Outputs of the CloudFormation stacks that got created when you deployed the Performance Dashboard.

```
ENVIRONMENT=your_environment_name
REACT_APP_AWS_REGION=enter_region_where_you_deployed
REACT_APP_BADGER_API=enter_your_backend_api_gateway_endpoint
REACT_APP_USER_POOL_ID=enter_your_user_pool_id
REACT_APP_APP_CLIENT_ID=enter_your_app_client
REACT_APP_DATASETS_BUCKET=enter_your_dataset_bucket
REACT_APP_IDENTITY_POOL_ID=enter_your_identity_pool_id
```

Then run the following command:

```bash
yarn start
```

It will run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

### Run unit tests

```bash
yarn test
```
