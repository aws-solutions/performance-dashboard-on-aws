import { InvalidDatasetContent } from "../errors";
import { DatasetContent } from "../models/dataset";

function parse(dataset: any): DatasetContent {
  // Verify dataset is an Array
  if (Array.isArray(dataset)) {
    // Verify every element in the array is an Object
    const isValid = dataset.every((element) => typeof element === "object");

    if (!isValid) {
      throw new InvalidDatasetContent();
    }

    return dataset;
  }

  throw new InvalidDatasetContent();
}

export default {
  parse,
};
