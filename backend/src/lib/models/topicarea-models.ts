import { User } from './user-models';

export type TopicArea = {
    id: string,
    name: string,
    createdBy: string,
}

export interface TopicAreaItem {
    pk: string,
    sk: string,
    type: string,
    name: string,
    createdBy: string,
};

export type CreateTopicAreaRequest = {
    name: string,
    user: User,
};