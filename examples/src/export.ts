import { exportExample } from "./exports/exporter";
import prompts from "prompt";

prompts.start();
prompts.get(
  [
    {
      name: "exampleName",
      pattern: /^[a-zA-Z0-9\-]+$/,
      message: "Name must be only letters, spaces, or dashes",
      required: true,
    },
    {
      name: "dashboardId",
      pattern: /^[a-zA-Z0-9\-]+$/,
      message: "Name must be only letters, spaces, or dashes",
      required: true,
    },
  ],
  async function (err, result: any) {
    if (err) {
      console.error(err);
      throw err;
    }

    try {
      await exportExample(result.exampleName, result.dashboardId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
