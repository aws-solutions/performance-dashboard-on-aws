import { InvalidDatasetContent } from "../../errors";
import DatasetService from "../dataset-service";

test("should return the parsed data with a valid JSON array", () => {
  const data = [{ year: 2012, amount: 100 }];
  const dataset = DatasetService.parse(data);
  expect(dataset).toEqual(data);
});

test("should throw an error when data is an array of strings", () => {
  expect(() => {
    DatasetService.parse(["an array", "of strings", "is not valid"]);
  }).toThrow(InvalidDatasetContent);
});

test("should throw an error when data is an array of numbers", () => {
  expect(() => {
    DatasetService.parse([1, 2, 3]);
  }).toThrow(InvalidDatasetContent);
});

test("should throw an error when input is a boolean", () => {
  expect(() => {
    DatasetService.parse(true);
  }).toThrow(InvalidDatasetContent);
});

test("should throw an error when input is a number", () => {
  expect(() => {
    DatasetService.parse(100);
  }).toThrow(InvalidDatasetContent);
});

test("should throw an error when input is an object", () => {
  expect(() => {
    DatasetService.parse({ foo: "bar" });
  }).toThrow(InvalidDatasetContent);
});
