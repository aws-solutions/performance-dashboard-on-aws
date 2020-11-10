# Customizing the Frontend

The frontend application loads a set of environment variables from a file `env.js` that is created by a Custom Resource (Lambda function) that runs at deployment time in CloudFormation. This file can be found in the S3 bucket where the frontend code (HTML, JS, CSS) is deployed and it is loaded by CloudFront when a user visits the Performance Dashboard.

## Things that you can customize

- Topic area label
- Brand name
- Contact email address

## How to

The appropriate way to modify the values of the `env.js` file, is to change the environment variables of the Lambda Function (Custom Resource) that generates it. Follow these steps to do so:

1. Go to the Lambda console: https://console.aws.amazon.com/lambda/home in your AWS account. Make sure you are on the same AWS region where the Performance Dashboard is deployed. You should see several Lambda functions that start with the prefix `PerformanceDash-`.

2. Select the Lambda function that has a name like `PerformanceDash-{stage}-Frontend-EnvConfig`. You may see another Lambda function with a similar name like `EnvConfigProviderframework`, that's not what we are looking for. Make sure you click on the one that doesn't have the word _Provider_.

3. Once you are inside the Lambda function, find the section where the Environment variables are defined and click Edit. Modify the values as needed and save your changes.

4. Invoke the Lambda function by clicking the Test button in the console. You will be asked to provide a Test Event, enter the following JSON input:

```json
{
  "RequestType": "Update"
}
```

5. Click the Test button to execute the Lambda function and you should get back a successful response. This means that a new `env.js` file was generated with the new values and uploaded to the S3 bucket.

6. Now, you need to invalidate the CloudFront distribution so that the old `env.js` file is removed from the CloudFront cache. Open the CloudFront console: https://console.aws.amazon.com/cloudfront.

7. Find the CloudFront distribution that has an Origin that starts with `performancedash-` and click on it.

8. Go to the Invalidations tab and click on the Create Invalidation button. In the `object-paths` input field, enter the following text, then click Invalidate.

```txt
/env.js
```

9. Wait a few minutes and your new custom values should be reflected in the Performance Dashboard frontend.
