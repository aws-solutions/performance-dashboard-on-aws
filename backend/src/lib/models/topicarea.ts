export type TopicArea = {
    id: string,
    name: string,
    createdBy: string,
};

export type TopicAreaList = Array<TopicArea>;

export interface TopicAreaItem {
    pk: string,
    sk: string,
    type: string,
    name: string,
    createdBy: string,
};