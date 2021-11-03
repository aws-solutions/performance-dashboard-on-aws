import { DashboardSnapshot } from "../common";

const fs = require("fs-extra");

export const writeSnapshot = function (
  name: string,
  snapshot: DashboardSnapshot
) {
  fs.writeFileSync(
    `${__dirname}/../../resources/${name}.json`,
    JSON.stringify(snapshot),
    "utf8"
  );
};
