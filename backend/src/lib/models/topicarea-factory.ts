import { v4 as uuidv4 } from "uuid";
import { CreateTopicAreaRequest, TopicArea, TopicAreaItem } from "./topicarea-models";

/**
 * Creates a new TopicArea
 */
function createNew(createRequest: CreateTopicAreaRequest): TopicArea {
  return {
    id: uuidv4(),
    name: createRequest.name,
    createdBy: createRequest.user.userId,
  };
}

/**
 * Converts a TopicArea to a DynamoDB item.
 */
function toItem(topicArea: TopicArea): TopicAreaItem {
  return {
    pk: "TopicArea-".concat(topicArea.id),
    sk: "TopicArea-".concat(topicArea.id),
    type: "TopicArea",
    name: topicArea.name,
    createdBy: topicArea.createdBy,
  };
}

/**
 * Converts a DynamoDB item into a TopicArea object
 */
function fromItem(item: TopicAreaItem): TopicArea {
  const id = item.pk.split("TopicArea-")[1];
  return {
    id,
    name: item.name,
    createdBy: item.createdBy,
  }
}

export default {
  toItem,
  createNew,
  fromItem,
};
