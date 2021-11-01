import { Configuration, ExampleBuilder } from "../../common";
import { DatasetBuilder } from "../../builders/dataset-builder";
import { resources } from "./resources";

export async function buildDatasets(config: Configuration) {
  return {
    programParticipation: await new DatasetBuilder()
      .withId("e6b57526-8e83-417d-8619-a8829a7db53c")
      .generateIdIf(!config.reuseDataset)
      .withAuthor(config.author)
      .withDatasetResource(resources.programParticipation)
      .build(),
    digitalTransformationProgress: await new DatasetBuilder()
      .withId("da20c7bf-999f-4e75-b76f-0faecfffb9d5")
      .generateIdIf(!config.reuseDataset)
      .withAuthor(config.author)
      .withDatasetResource(resources.programParticipation)
      .build(),
    userSatisfaction: await new DatasetBuilder()
      .withId("32b67933-0c22-43c0-ac4a-9ccb9f22ae5b")
      .generateIdIf(!config.reuseDataset)
      .withAuthor(config.author)
      .withDatasetResource(resources.userSatisfaction)
      .build(),
    averageClassSize: await new DatasetBuilder()
      .withId("63df6177-2f44-48b5-9aa8-a42d49b9e107")
      .generateIdIf(!config.reuseDataset)
      .withAuthor(config.author)
      .withDatasetResource(resources.averageClassSize)
      .build(),
    renewableEnergy: await new DatasetBuilder()
      .withId("7857a4d0-10af-4a2b-a36f-ef8c21b82f7c")
      .generateIdIf(!config.reuseDataset)
      .withAuthor(config.author)
      .withDatasetResource(resources.renewableEnergy)
      .build(),
    devicesUsed: await new DatasetBuilder()
      .withId("d4c81d9f-94bd-4a5e-acd1-502bc92d9ec7")
      .generateIdIf(!config.reuseDataset)
      .withAuthor(config.author)
      .withDatasetResource(resources.devicesUsed)
      .build(),
    frequentIncidents: await new DatasetBuilder()
      .withId("a8f0d8b2-5751-4f9b-a277-07c114646561")
      .generateIdIf(!config.reuseDataset)
      .withAuthor(config.author)
      .withDatasetResource(resources.frequentIncidents)
      .build(),
  };
}
