import { Dashboard } from "performance-dashboard-backend/src/lib/models/dashboard";
import { v4 as uuidv4 } from "uuid";
const fs = require("fs-extra");

export const writeDashboard = function (name: string, dashboard: Dashboard) {
  let content: string = fs.readFileSync(
    `${__dirname}/../examples/${name}/example.ts`,
    "utf8"
  );
  dashboard.widgets?.reverse()?.forEach((widget) => {
    if (!widget.section) {
      content = content.replace(
        "// <GENERATED_CODE>",
        `// <GENERATED_CODE>
      dashboard.addWidget(widgetBuilders["${widget.id}"]);`
      );
    }
  });

  content = content.replace(
    "// <GENERATED_CODE>",
    `// <GENERATED_CODE>
    dashboard
      .withId("${uuidv4()}")
      .generateIdIf(!config.reuseDashboard)
      .withName("${dashboard.name}")
      .withAuthor(config.author)
      .withDescription(${"`"}${dashboard.description}${"`"})
      .withTopicAreaId("${dashboard.topicAreaId}")
      .withTopicAreaName(${"`"}${dashboard.topicAreaName}${"`"});`
  );

  fs.writeFileSync(
    `${__dirname}/../examples/${name}/example.ts`,
    content,
    "utf8"
  );
};
