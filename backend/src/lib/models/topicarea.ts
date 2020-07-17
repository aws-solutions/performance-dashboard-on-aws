import { v4 as uuidv4 } from 'uuid';

export type TopicArea = {
    id: string,
    name: string,
}

export interface TopicAreaItem {
    pk: string,
    sk: string,
    type: string,
    name: string,
};

export type CreateTopicAreaRequest = {
    name: string,
};

export class TopicAreaFactory {

    /**
     * Creates a new TopicArea
     */
    createNew(createRequest: CreateTopicAreaRequest): TopicArea {
        return {
            id: uuidv4(),
            name: createRequest.name,
        }
    }

    /**
     * Converts a TopicArea to a DynamoDB item.
     */
    toItem(topicArea: TopicArea) : TopicAreaItem {
        return {
            pk: 'TopicArea-'.concat(topicArea.id),
            sk: 'TopicArea-'.concat(topicArea.id),
            type: 'TopicArea',
            name: topicArea.name,
        };
    }
}

export default TopicAreaFactory;