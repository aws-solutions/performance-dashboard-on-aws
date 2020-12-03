import EnvConfig from "../EnvConfig";

test("default environment config values", () => {
  expect(EnvConfig.topicAreaLabel).toEqual("Topic area");
  expect(EnvConfig.topicAreasLabel).toEqual("Topic areas");
  expect(EnvConfig.contactEmail).toEqual("support@example.com");
  expect(EnvConfig.brandName).toEqual("Performance Dashboard");
});

test("non default environment config values", () => {
  // global is equivalent to the window object
  (global as any).EnvironmentConfig = {
    topicAreaLabel: "Category",
    topicAreasLabel: "Categories",
    contactEmail: "hello@hello.com",
    brandName: "Amazon Web Services",
  };

  // reload environment config
  jest.resetModules();
  const EnvConfig = require("../EnvConfig").default;

  expect(EnvConfig.topicAreaLabel).toEqual("Category");
  expect(EnvConfig.topicAreasLabel).toEqual("Categories");
  expect(EnvConfig.contactEmail).toEqual("hello@hello.com");
  expect(EnvConfig.brandName).toEqual("Amazon Web Services");
});
