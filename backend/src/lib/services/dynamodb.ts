import AWS from 'aws-sdk';

class DynamoDbService {

    private client : AWS.DynamoDB.DocumentClient;
    private tableName : string;

    constructor() {
        if (!process.env.BADGER_TABLE) {
            throw new Error("Environment variable BADGER_TABLE missing");
        }
        
        this.client = new AWS.DynamoDB.DocumentClient();
        this.tableName = process.env.BADGER_TABLE;
    }

    async putItem(item: any) {
        const result = await this.client.put({
            TableName: this.tableName,
            Item: item,
        }).promise();
        
        console.log(result);
    }

}

export default DynamoDbService;