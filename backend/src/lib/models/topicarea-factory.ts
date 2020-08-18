import { v4 as uuidv4 } from "uuid";
import { TopicArea, TopicAreaItem } from "./topicarea";
import { User } from "./user";

const TOPICAREA: string = 'TopicArea';

function create(id: string, name: string, user: User): TopicArea {
  return {
    id,
    name,
    createdBy: user.userId,
  };
}

function createNew(name: string, user: User): TopicArea {
  return {
    id: uuidv4(),
    name,
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
    type: TOPICAREA,
    name: topicArea.name,
    createdBy: topicArea.createdBy,
  };
}

/**
 * Converts a DynamoDB item into a TopicArea object
 */
function fromItem(item: TopicAreaItem): TopicArea {
  const id = item.pk.substring(10);
  return {
    id,
    name: item.name,
    createdBy: item.createdBy,
  }
}

function itemId(id: string): string { return `${TOPICAREA}#${id}` }

export default {
  create,
  createNew,
  toItem,
  fromItem,
  itemId,
};
