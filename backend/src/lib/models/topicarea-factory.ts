import { v4 as uuidv4 } from "uuid";
import { CreateTopicAreaRequest, TopicArea, TopicAreaItem } from "./topicarea-models";

/**
 * Creates a new TopicArea
 */
function createNew(createRequest: CreateTopicAreaRequest): TopicArea {
  return {
    id: uuidv4(),
    name: createRequest.name,
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
  };
}

export default {
  toItem,
  createNew,
};
