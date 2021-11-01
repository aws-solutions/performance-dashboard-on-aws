import { Dataset } from "performance-dashboard-backend/src/lib/models/dataset";
const fs = require("fs-extra");

export const writeResource = function (name: string, dataset: Dataset) {
  let content: string = fs.readFileSync(
    `${__dirname}/../examples/${name}/resources.ts`,
    "utf8"
  );

  content = content.replace(
    "// <GENERATED_CODE>",
    `// <GENERATED_CODE>
    resources["${dataset.id}"] = {
        fileName: ${"`"}${dataset.fileName}${"`"},
        schema: DatasetSchema.${dataset.schema},
        key: {
          raw: "${dataset.s3Key.raw}",
          json: "${dataset.s3Key.json}",
        },
      };`
  );

  fs.writeFileSync(
    `${__dirname}/../examples/${name}/resources.ts`,
    content,
    "utf8"
  );
};
