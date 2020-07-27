import BadgerService from "../BadgerService";

jest.mock("aws-amplify");
import { API, Auth } from "aws-amplify";

beforeAll(() => {
  const getJwtToken = jest.fn().mockReturnValue("eyJhbGciOiJIUzI1NiIsInR5c");
  const getIdToken = jest.fn().mockReturnValue({ getJwtToken });
  Auth.currentSession = jest.fn().mockReturnValue({ getIdToken });
});

test("createDashboard should make a POST request with payload", async () => {
  const name = "One Pretty Dashboard";
  const description = "Alexa, how is the weather?";
  const topicAreaId = "xyz";

  await BadgerService.createDashboard(name, description, topicAreaId);

  expect(API.post).toHaveBeenCalledWith("BadgerApi", "dashboard", expect.objectContaining({
    body: {
      name,
      description,
      topicAreaId,
    }
  }));
});