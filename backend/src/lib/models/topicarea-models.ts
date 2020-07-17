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