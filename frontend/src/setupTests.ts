// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import "mutationobserver-shim";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

jest.mock("./hooks");

window.EnvironmentConfig = {
  region: "us-west-2",
  backendApi: "http://localhost:8080/",
  userPoolId: "000",
  appClientId: "000",
  datasetsBucket: "000",
  identityPoolId: "000",
  contactEmail: "support@example.com",
  brandName: "Performance Dashboard",
  topicAreaLabel: "Topic Area",
};

dayjs.extend(relativeTime);
