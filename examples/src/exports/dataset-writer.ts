import { Dataset } from "performance-dashboard-backend/src/lib/models/dataset";
import { v4 as uuidv4 } from "uuid";
import { downloadResource } from "./resource-downloader";
import { writeResource } from "./resource-writer";
const fs = require("fs-extra");

export const writeDataset = async function (name: string, dataset: Dataset) {
  writeResource(name, dataset);

  await downloadResource(name, dataset.s3Key.json);
  if (dataset.s3Key.json !== dataset.s3Key.raw) {
    await downloadResource(name, dataset.s3Key.raw);
  }

  let content: string = fs.readFileSync(
    `${__dirname}/../examples/${name}/datasets.ts`,
    "utf8"
  );

  content = content.replace(
    "// <GENERATED_CODE>",
    `// <GENERATED_CODE>
    datasets["${dataset.id}"] = await new DatasetBuilder()
    .withId("${uuidv4()}")
    .generateIdIf(!config.reuseDataset)
    .withAuthor(config.author)
    .withDatasetResource(resources["${dataset.id}"])
    .build();`
  );

  fs.writeFileSync(
    `${__dirname}/../examples/${name}/datasets.ts`,
    content,
    "utf8"
  );
};
