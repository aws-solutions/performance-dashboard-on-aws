import factory from '../models/topicarea-factory';
import repo from '../repositories/topicarea-repo';
import { TopicArea, CreateTopicAreaRequest } from '../models/topicarea-models';

async function createTopicArea(createRequest: CreateTopicAreaRequest) : Promise<TopicArea> {
    const topicArea = factory.createNew(createRequest);
    await repo.create(topicArea);
    return topicArea;
}

export default {
    createTopicArea,
}