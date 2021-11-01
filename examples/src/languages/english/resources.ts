import { DatasetSchema } from "performance-dashboard-backend/src/lib/models/dataset";
import { DatasetCollection } from "../../common";

export const resources: DatasetCollection = {
  programParticipation: {
    fileName: "Program participation for adult members.csv",
    schema: DatasetSchema.None,
    key: {
      raw: "88dafb4e-9d08-4daf-b8bf-b9ee82bad75c.csv",
      json: "88dafb4e-9d08-4daf-b8bf-b9ee82bad75c.json",
    },
  },
  digitalTransformationProgress: {
    fileName: "Metrics: Digital transformation progress",
    schema: DatasetSchema.Metrics,
    key: {
      raw: "5824d4b0-a64b-4e0d-be3e-126476e9ca7f.json",
      json: "5824d4b0-a64b-4e0d-be3e-126476e9ca7f.json",
    },
  },
  userSatisfaction: {
    fileName: "User satisfaction.csv",
    schema: DatasetSchema.None,
    key: {
      raw: "3a57b8ac-f108-494d-bcc0-fb948b79b3b0.csv",
      json: "3a57b8ac-f108-494d-bcc0-fb948b79b3b0.json",
    },
  },
  averageClassSize: {
    fileName: "Average class size.csv",
    schema: DatasetSchema.None,
    key: {
      raw: "83c62f00-2eb8-411a-ace5-a6692a9dafaf.csv",
      json: "83c62f00-2eb8-411a-ace5-a6692a9dafaf.json",
    },
  },
  renewableEnergy: {
    fileName: "Renewable energy.csv",
    schema: DatasetSchema.None,
    key: {
      raw: "a2b0c70e-951a-40a9-8a24-ba05abc05ff1.csv",
      json: "a2b0c70e-951a-40a9-8a24-ba05abc05ff1.json",
    },
  },
  devicesUsed: {
    fileName: "Devices used to access service.csv",
    schema: DatasetSchema.None,
    key: {
      raw: "8765a857-9d1a-4a61-8633-e342181bff60.csv",
      json: "8765a857-9d1a-4a61-8633-e342181bff60.json",
    },
  },
  frequentIncidents: {
    fileName: "Frequent incidents.csv",
    schema: DatasetSchema.None,
    key: {
      raw: "b629b374-9ffe-49fe-85a4-2363e2c21532.csv",
      json: "b629b374-9ffe-49fe-85a4-2363e2c21532.json",
    },
  },
};
