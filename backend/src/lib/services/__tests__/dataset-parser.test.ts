import { InvalidDatasetContent } from "../../errors";
import DatasetParser from "../dataset-parser";

test("should return the parsed data with a valid JSON array", () => {
  const data = [{ year: 2012, amount: 100 }];
  const dataset = DatasetParser.parse(data);
  expect(dataset).toEqual(data);
});

test("should throw an error when data is an array of strings", () => {
  expect(() => {
    DatasetParser.parse(["an array", "of strings", "is not valid"]);
  }).toThrow(InvalidDatasetContent);
});

test("should throw an error when data is an array of numbers", () => {
  expect(() => {
    DatasetParser.parse([1, 2, 3]);
  }).toThrow(InvalidDatasetContent);
});

test("should throw an error when input is a boolean", () => {
  expect(() => {
    DatasetParser.parse(true);
  }).toThrow(InvalidDatasetContent);
});

test("should throw an error when input is a number", () => {
  expect(() => {
    DatasetParser.parse(100);
  }).toThrow(InvalidDatasetContent);
});

test("should throw an error when input is an object", () => {
  expect(() => {
    DatasetParser.parse({ foo: "bar" });
  }).toThrow(InvalidDatasetContent);
});
