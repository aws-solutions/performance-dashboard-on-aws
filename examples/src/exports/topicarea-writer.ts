import { v4 as uuidv4 } from "uuid";
const fs = require("fs-extra");

export const writeTopicArea = function (
  name: string,
  topicAreaId: string,
  topicAreaName: string
) {
  let content: string = fs.readFileSync(
    `${__dirname}/../examples/${name}/topicareas.ts`,
    "utf8"
  );

  content = content.replace(
    "// <GENERATED_CODE>",
    `// <GENERATED_CODE>
    topicAreas["${topicAreaId}"] = await new TopicAreaBuilder()
    .withId("${uuidv4()}")
    .withName(${"`"}${topicAreaName}${"`"})
    .withAuthor(config.author)
    .generateIdIf(!config.reuseTopicArea)
    .build();`
  );

  fs.writeFileSync(
    `${__dirname}/../examples/${name}/topicareas.ts`,
    content,
    "utf8"
  );
};
