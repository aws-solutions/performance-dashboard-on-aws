# End-to-end test suite

This package uses Cypress to run end-to-end tests against a deployed version of Performance Dashboard on AWS.

## Install dependencies

```bash
npm install
```

## Setup environment

Create a file `cypress.json` in the root of this directory with the following structure:

```json
{
  "baseUrl": "https://123.cloudfront.com",
  "env": {
    "username": "foo",
    "password": "bar"
  },
  "defaultCommandTimeout": 20000
}
```

Replace the values in the JSON file according to your specific installation of PDoA. This file is ignored by git because it contains sensitive information. The following table describes what each field in the JSON file is used for:

| JSON Field            | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| baseUrl               | The URL of the UI where PDoA is deployed. Likely the CloudFront URL |
| username              | Valid Cognito username used for tests                               |
| password              | Password for the Cognito test user                                  |
| defaultCommandTimeout | Default timeout in milliseconds for basic Cypress functions         |

## Run the tests

To run them on visual mode

```bash
npm run start
```

To run them on CLI mode

```bash
npm run test
```
