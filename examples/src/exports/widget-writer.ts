import { v4 as uuidv4 } from "uuid";
import {
  Widget,
  WidgetType,
} from "performance-dashboard-backend/src/lib/models/widget";
import {
  writeTextContent,
  writeChartContent,
  writeMetricsContent,
  writeTableContent,
  writeSectionContent,
} from "./widget-content-writer";
const fs = require("fs-extra");

export const writeWidget = function (name: string, widget: Widget) {
  let content: string = fs.readFileSync(
    `${__dirname}/../examples/${name}/widgets.ts`,
    "utf8"
  );

  const map = new Map<WidgetType, (content: any) => string>();
  map.set(WidgetType.Text, writeTextContent);
  map.set(WidgetType.Chart, writeChartContent);
  map.set(WidgetType.Metrics, writeMetricsContent);
  map.set(WidgetType.Table, writeTableContent);
  map.set(WidgetType.Section, writeSectionContent);

  const contentWriter = map.get(widget.widgetType);
  if (!contentWriter) {
    throw new Error(`Unsupported widget type: ${widget.widgetType}`);
  }

  content = content.replace(
    "// <GENERATED_CODE>",
    `// <GENERATED_CODE>
    widgets["${widget.id}"] = new WidgetBuilder()
    .withId("${uuidv4()}")
    .generateIdIf(!config.reuseDashboard)
    .withName(${"`"}${widget.name}${"`"})
    .withContent(
      ${contentWriter(widget.content)}
    );`
  );

  fs.writeFileSync(
    `${__dirname}/../examples/${name}/widgets.ts`,
    content,
    "utf8"
  );
};
