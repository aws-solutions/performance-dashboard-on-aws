import { cleanEnv, email, str } from "envalid";
import { Language, Languages } from "./common";

export const env = cleanEnv(process.env, {
  MAIN_TABLE: str({
    desc: "Main DynamoDB table name",
  }),
  //   AUDIT_TRAIL_TABLE: str({
  //     desc: "Audit trail DynamoDB table name",
  //     devDefault: "PerformanceDash-dev-Backend-AuditTrailFF0F2BB5-1MTR2W72XG0",
  //   }),
  DATASETS_BUCKET: str({
    desc: "S3 bucket name for datasets",
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
  }),
  LANGUAGE: str<Language>({
    desc: "Language to use",
    default: Languages.English,
  }),
});
