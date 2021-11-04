import prompts from "prompts";
import yargs from "yargs";
import { exportDashboard } from "./services/exporter-service";

prompts.override(yargs.argv);

(async () => {
  console.log("Welcome to Performance Dashboard on AWS Export Tool");

  const { templateName } = await prompts({
    type: "text",
    name: "templateName",
    message: "What is the template name?",
    validate: (value) => /^[a-zA-Z0-9\-]+$/.test(value),
  });

  const { dashboardId } = await prompts({
    type: "text",
    name: "dashboardId",
    message: "Please specify the dashboardId you want to export?",
    validate: (value) => /^[a-zA-Z0-9\-]+$/.test(value),
  });

  try {
    await exportDashboard(templateName, dashboardId);
  } catch (e) {
    console.error(e);
  }
})();
