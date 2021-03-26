import { HomepageItem } from "../../models/homepage";
import HomepageFactory from "../homepage-factory";

describe("getDefaultHomepage", () => {
  it("returns default values", () => {
    expect(HomepageFactory.getDefaultHomepage()).toEqual({
      title: "Performance Dashboard",
      description:
        "The Performance Dashboard makes data open " +
        "and accessible to provide transparency and helps drive the " +
        "ongoing improvement of digital services.",
      updatedAt: expect.anything(),
    });
  });
});

describe("fromItem", () => {
  it("converts a dynamodb item to a Homepage object", () => {
    const item: HomepageItem = {
      pk: "Homepage",
      sk: "Homepage",
      type: "Homepage",
      title: "Kingdom of Wakanda",
      description: "Welcome to Wakanda",
    };

    const homepage = HomepageFactory.fromItem(item);
    expect(homepage.title).toEqual("Kingdom of Wakanda");
    expect(homepage.description).toEqual("Welcome to Wakanda");
  });
});
