export interface Config {
  tableName: string;
  examplesBucket: string;
  datasetsBucket: string;
  userEmail: string;
  language: string;
}

export const processConfig: Config = {
  tableName: process.env.EXAMPLE_TABLENAME || "",
  examplesBucket: process.env.EXAMPLE_EXAMPLESBUCKET || "",
  datasetsBucket: process.env.EXAMPLE_DATASETBUCKET || "",
  userEmail: process.env.EXAMPLE_USEREMAIL || "",
  language: process.env.EXAMPLE_LANGUAGE || "",
};
