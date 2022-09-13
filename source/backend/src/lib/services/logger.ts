import pino from "pino";

const logLevel = process.env.LOG_LEVEL || "info";
const logger = pino({
  level: logLevel.toLocaleLowerCase(),
  base: null,
});

export default logger;
