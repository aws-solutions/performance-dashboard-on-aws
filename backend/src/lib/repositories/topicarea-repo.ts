import { TopicArea } from "../models/topicarea-models";
import factory from "../models/topicarea-factory";
import DynamoDbService from '../services/dynamodb';

async function create(topicArea: TopicArea) {
    const dynamodb = new DynamoDbService();
    const item = factory.toItem(topicArea);
    await dynamodb.putItem(item);
}

export default {
    create,
};