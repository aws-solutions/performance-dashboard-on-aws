import { exportDashboard } from "./services/exporter-service";
import { importDashboard } from "./services/importer-service";
import { Configuration } from "./common";
import { env } from "./env";

var prompts = require("prompt"),
  optimist = require("optimist");

prompts.override = optimist.argv;
prompts.start();
prompts.get(
  [
    {
      name: "operation",
      enum: ["export", "import"],
      message: "Operation is required",
      default: "import",
      required: true,
    },
    {
      name: "exampleName",
      pattern: /^[a-zA-Z0-9\-]+$/,
      message: "Name must be only letters, spaces, or dashes",
      default: env.EXAMPLE,
      required: true,
    },
  ],
  async function (_err: any, initial: any) {
    if (initial.operation === "export") {
      prompts.get(
        [
          {
            name: "dashboardId",
            pattern: /^[a-zA-Z0-9\-]+$/,
            message: "Name must be only letters, spaces, or dashes",
            required: true,
          },
        ],
        async function (_err: any, result: any) {
          try {
            await exportDashboard(initial.exampleName, result.dashboardId);
          } catch (e) {
            console.error(e);
          }
        }
      );
    } else {
      try {
        await importDashboard({
          example: initial.exampleName,
          author: env.USER_EMAIL,
          reuseTopicArea: true,
          reuseDashboard: false,
          reuseDataset: false,
        } as Configuration);
      } catch (e) {
        console.error(e);
      }
    }
  }
);
