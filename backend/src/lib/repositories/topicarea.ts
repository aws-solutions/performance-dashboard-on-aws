import TopicAreaFactory, { TopicArea } from "../models/topicarea";
import DynamoDbService from '../services/dynamodb';

class TopicAreaRepository {

    async create(topicArea: TopicArea) {
        const factory = new TopicAreaFactory();
        const dynamodb = new DynamoDbService();

        const item = factory.toItem(topicArea);
        await dynamodb.putItem(item);
    }

}

export default TopicAreaRepository;