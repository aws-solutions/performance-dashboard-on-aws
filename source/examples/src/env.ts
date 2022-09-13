import { cleanEnv, email, str } from "envalid";

export const env = cleanEnv(process.env, {
  MAIN_TABLE: str({
    desc: "Main DynamoDB table name",
  }),
  DATASETS_BUCKET: str({
    desc: "S3 bucket name for datasets",
  }),
  EXAMPLES_BUCKET: str({
    desc: "S3 bucket name for examples resources",
  }),
  LOG_LEVEL: str({
    desc: "Log level",
    default: "debug",
  }),
  USER_EMAIL: email({
    desc: "User email of the owner of the resources",
    default: "<system>",
  }),
  EXAMPLE: str({
    desc: "Example to use",
    default: "english",
  }),
});
