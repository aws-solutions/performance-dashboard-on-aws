## Integration Test Suite

Backend integration tests are written for the [Postman Collection Runner](https://learning.postman.com/docs/running-collections/intro-to-collection-runs). They can either be run with the Postman application, or from the Command Line using the [Postman CLI Newman](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman). At the moment, you need to manually add a valid Bearer authentication token as a collection variable before running the test suite.

It is also recommended to configure the Collection Runner to add a _Delay_ of 500ms between each API request. This allows DynamoDB enough time to propagate the data across the Global Secondary Indexes as they are eventually consistent and querying immediately after an update may not return the latest data.

### Run from app

Open the `Integration Test Suite.postman_collection.json` file with the Postman App and follow the instructions here: https://learning.postman.com/docs/running-collections/intro-to-collection-runs/#starting-a-collection-run.

### Run from CLI

```sh
newman run IntegrationTestSuite.postman_collection.json --delay-request 500
```

More configuration options here: https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman.

### Test Scenario

The integration test suite runs a happy path scenario that simulates a user performing the following workflow:

1. Create a topic area
2. Create a dashboard within topic area
3. Edit dashboard name and description
4. Create a text widget in dashboard
5. Delete text widget
6. Delete dashboard
7. Delete topic area

It uses Postman test scripts to perform checks on each request. For example, after editing a dashboard description, it verifies that the description matches the updated one:

```js
pm.test("dashboard description matches", () => {
  const dashboard = pm.response.json();
  pm.expect(dashboard.description).to.equal("Updated markdown **here**");
});
```
