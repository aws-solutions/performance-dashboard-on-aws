/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { v4 as uuidv4 } from "uuid";
import { TopicArea, TopicAreaItem } from "../models/topicarea";
import { User } from "../models/user";

const TOPICAREA: string = "TopicArea";

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
    };
}

function itemId(id: string): string {
    return `${TOPICAREA}#${id}`;
}

export default {
    createNew,
    toItem,
    fromItem,
    itemId,
};
