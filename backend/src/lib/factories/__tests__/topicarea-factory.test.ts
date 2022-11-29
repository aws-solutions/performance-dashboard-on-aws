/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import factory from "../topicarea-factory";
import { TopicArea } from "../../models/topicarea";
import { User } from "../../models/user";

const user: User = {
  userId: "johndoe",
};

describe("TopicAreaFactory.createNew", () => {
  it("should create a new topic area with unique id", () => {
    const topicarea1 = factory.createNew("Banana", user);
    const topicarea2 = factory.createNew("Strawberry", user);
    expect(topicarea1.id).not.toEqual(topicarea2.id);
  });

  it("should create a new topic area with name", () => {
    const topicarea = factory.createNew("AWS", user);
    expect(topicarea.name).toEqual("AWS");
  });

  it("should create a new topic area with createdBy", () => {
    const topicarea = factory.createNew("AWS", user);
    expect(topicarea.createdBy).toEqual(user.userId);
  });
});

describe("TopicAreaFactory.toItem", () => {
  const topicarea: TopicArea = {
    id: "123",
    name: "Banana",
    createdBy: user.userId,
  };

  it("should have a pk that starts with TopicArea", () => {
    const item = factory.toItem(topicarea);
    expect(item.pk).toEqual("TopicArea#123");
  });

  it("should have an sk equal to pk", () => {
    const item = factory.toItem(topicarea);
    expect(item.sk).toEqual(item.pk);
  });

  it("should have a type attribute", () => {
    const item = factory.toItem(topicarea);
    expect(item.type).toEqual("TopicArea");
  });

  it("should include all other attributes of topic area", () => {
    const item = factory.toItem(topicarea);
    expect(item.name).toEqual("Banana");
    expect(item.createdBy).toEqual(user.userId);
  });
});
