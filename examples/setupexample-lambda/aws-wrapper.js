const aws = require('aws-sdk');
const s3 = new aws.S3();
const dynamodb = new aws.DynamoDB();

const dynamoSave = function (tableName, object) {
    return new Promise((resolve, reject) => {
        console.log("dynamodb.putItem call")
        dynamodb.putItem({
            TableName: tableName,
            Item: object,
        }, function (err, data) {
            console.log("dynamodb.putItem return")
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};


const getJsonOfKey = function (bucket, file) {

    return new Promise((resolve, reject) => {

        console.log("s3.getObject call")
        const x = s3.getObject({
            Bucket: bucket,
            Key: file
        }, function (err, data) {
            console.log("s3.getObject return")
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                let obj = JSON.parse(data.Body.toString("utf8"));
                resolve(obj);
            }
        });
    });
}

const getPageOfS3 = function (params) {

    return new Promise((resolve, reject) => {

        console.log("s3.listObjectsV2 call")
        s3.listObjectsV2(params, function (err, data) {
            console.log("s3.listObjectsV2 return")
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
const getBucketContents = async function (bucketName, prefix) {

    var params = {
        Bucket: bucketName,
        MaxKeys: 100,
        Prefix:prefix
    };

    let hasNextPage = true;
    let returnList = [];
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
};

const copyContent = function (sourceBucket, sourceFile, destinationBucket, destinationFile) {
    
    return new Promise((resolve, reject) => {

        console.log("s3.copyContent call")
        s3.copyObject({
            Bucket: destinationBucket,
            Key: destinationFile,
            CopySource: `${sourceBucket}/${sourceFile}`
        }, function (err, data) {
            console.log("s3.copyObject return")
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });

}

module.exports = {
    getBucketContents: getBucketContents,
    getJsonOfKey: getJsonOfKey,
    dynamoSave: dynamoSave,
    copyContent: copyContent,
};