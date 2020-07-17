import {
    TopicArea,
    TopicAreaFactory,
    CreateTopicAreaRequest
} from '../models/topicarea';
import TopicAreaRepository from '../repositories/topicarea';

async function createTopicArea(createRequest: CreateTopicAreaRequest) : Promise<TopicArea> {

    const factory = new TopicAreaFactory();
    const topicArea = factory.createNew(createRequest);
    
    const repository = new TopicAreaRepository();
    repository.create(topicArea);

    return topicArea;
}

export default {
    createTopicArea,
}