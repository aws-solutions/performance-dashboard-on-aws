import { S3, DynamoDB } from "aws-sdk";

function dynamoSave(
  tableName: string,
  object: DynamoDB.PutItemInputAttributeMap
): Promise<DynamoDB.PutItemOutput> {
  const dynamoDbClient = new DynamoDB();
  return new Promise((resolve, reject) => {
    console.log("dynamodb.putItem call: {} > {}", tableName, object);
    dynamoDbClient.putItem(
      {
        TableName: tableName,
        Item: object,
      },
      function (err, data) {
        console.log("dynamodb.putItem completed");
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

function getJsonOfKey<T>(bucket: string, file: string): Promise<T> {
  const s3Client = new S3();
  return new Promise((resolve, reject) => {
    console.log("s3.getObject call: {} > {}", bucket, file);
    const x = s3Client.getObject(
      {
        Bucket: bucket,
        Key: file,
      },
      function (err, data) {
        console.log("s3.getObject completed");
        if (err) {
          console.log(err);
          reject(err);
        } else {
          let obj: T = JSON.parse(data?.Body?.toString("utf8") || "{}");
          resolve(obj);
        }
      }
    );
  });
}

function getPageOfS3(
  params: S3.Types.ListObjectsV2Request
): Promise<S3.ListObjectsV2Output> {
  const s3Client = new S3();
  return new Promise((resolve, reject) => {
    console.log("s3.listObjectsV2 call: {}", params);
    s3Client.listObjectsV2(params, function (err, data) {
      console.log("s3.listObjectsV2 completed");
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
async function getBucketContents(
  bucketName: string,
  prefix: string
): Promise<S3.Object[]> {
  var params: S3.Types.ListObjectsV2Request = {
    Bucket: bucketName,
    MaxKeys: 100,
    Prefix: prefix,
  };

  let hasNextPage = true;
  let returnList: S3.Object[] = [];
  while (hasNextPage) {
    let response = await getPageOfS3(params);

    if (response.Contents === undefined || response.Contents.length === 0) {
      hasNextPage = false;
      continue;
    }

    for (let i = 0, length = response.Contents.length; i < length; i++) {
      let item = response.Contents[i];
      returnList.push(item);
    }

    hasNextPage = true;
    params.StartAfter = response.Contents[response.Contents.length - 1].Key;
  }

  return returnList;
}

function copyContent(
  sourceBucket: string,
  sourceFile: string,
  destinationBucket: string,
  destinationFile: string
): Promise<S3.CopyObjectOutput> {
  const s3Client = new S3();
  return new Promise((resolve, reject) => {
    console.log(
      "s3.copyContent call: {}/{} -> {}/{}",
      sourceBucket,
      sourceFile,
      destinationBucket,
      destinationFile
    );
    s3Client.copyObject(
      {
        Bucket: destinationBucket,
        Key: destinationFile,
        CopySource: `${sourceBucket}/${sourceFile}`,
      },
      function (err, data) {
        console.log("s3.copyObject completed");
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

export default {
  getBucketContents,
  getJsonOfKey,
  dynamoSave,
  copyContent,
};
