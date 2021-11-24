import { DashboardSnapshot } from "../common";
import { Readable } from "stream";
import fs from "fs-extra";

export const writeSnapshot = function (
  name: string,
  snapshot: DashboardSnapshot
) {
  fs.writeFileSync(
    `${__dirname}/../../resources/${name}/snapshot.json`,
    JSON.stringify(snapshot),
    "utf8"
  );
};

export const readResource = function (name: string, file: string) {
  return fs.readFileSync(
    `${__dirname}/../../resources/${name}/files/${file}`,
    "utf8"
  );
};

export const writeResource = async function (
  name: string,
  file: string,
  readStream: Readable
) {
  const folder = `${__dirname}/../../resources/${name}/files`;
  fs.ensureDirSync(folder);

  let writeStream = fs.createWriteStream(`${folder}/${file}`);
  return new Promise((resolve, reject) =>
    readStream
      .pipe(writeStream)
      .on("finish", resolve)
      .on("error", reject)
      .on("close", () => {
        console.log(`Downloaded ${file}`);
      })
  );
};

export const readSnapshot = function (name: string) {
  const file = `${__dirname}/../../resources/${name}/snapshot.json`;
  const text = fs.readFileSync(file, "utf8");
  return JSON.parse(text) as DashboardSnapshot;
};

export const availableResources = function () {
  const folders = fs.readdirSync(`${__dirname}/../../resources`);
  return folders.filter((folder) =>
    fs.statSync(`${__dirname}/../../resources/${folder}`).isDirectory()
  );
};
