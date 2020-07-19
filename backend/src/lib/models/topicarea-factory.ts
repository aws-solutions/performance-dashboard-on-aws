import { v4 as uuidv4 } from "uuid";
import { TopicArea, TopicAreaItem } from "./topicarea-models";
import { User } from "./user-models";

function createNew(name: string, user: User): TopicArea {
  return {
    id: uuidv4(),
    name: name,
    createdBy: user.userId,
  };
}

/**
 * Converts a TopicArea to a DynamoDB item.
 */
function toItem(topicArea: TopicArea): TopicAreaItem {
  return {
    pk: itemId(topicArea.id),
    sk: itemId(topicArea.id),
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

function itemId(id: string): string { return "TopicArea-".concat(id) }

export default {
  toItem,
  createNew,
  fromItem,
  itemId,
};
