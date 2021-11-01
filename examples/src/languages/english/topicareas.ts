import { Configuration } from "../../common";
import { TopicAreaBuilder } from "../../builders/topicarea-builder";

export async function buildTopicAreas(config: Configuration) {
  return {
    acountability: await new TopicAreaBuilder()
      .withId("1b1879e9-ff96-4044-9b88-3e040383f60e")
      .withName("Accountability")
      .withAuthor(config.author)
      .generateIdIf(!config.reuseTopicArea)
      .build(),
  };
}
