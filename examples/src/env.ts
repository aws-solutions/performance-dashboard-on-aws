import { cleanEnv, email, str } from "envalid";
import { Language, Languages } from "./common";

export const env = cleanEnv(process.env, {
  AWS_REGION: str({
    desc: "AWS region to use",
    default: "us-east-1",
  }),
  MAIN_TABLE: str({
    desc: "Main DynamoDB table name",
    devDefault: "PerformanceDash-dev-Backend-MainTable74195DAB-1BDQ3ZCEZKIPT",
  }),
  //   AUDIT_TRAIL_TABLE: str({
  //     desc: "Audit trail DynamoDB table name",
  //     devDefault: "PerformanceDash-dev-Backend-AuditTrailFF0F2BB5-1MTR2W72XG0",
  //   }),
  DATASETS_BUCKET: str({
    desc: "S3 bucket name for datasets",
    devDefault: "performancedash-dev-558378773035-us-east-1-datasets",
  }),
  EXAMPLES_BUCKET: str({
    desc: "S3 bucket name for examples resources",
    devDefault: "",
  }),
  LOG_LEVEL: str({
    desc: "Log level",
    default: "debug",
  }),
  //   USER_POOL_ID: str({
  //     desc: "User pool ID",
  //     devDefault: "us-east-1_3vVMvROS8",
  //   }),
  USER_EMAIL: email({
    desc: "User email of the owner of the resources",
    devDefault: "miabreu@amazon.com",
  }),
  LANGUAGE: str<Language>({
    desc: "Language to use",
    default: Languages.English,
  }),
});
