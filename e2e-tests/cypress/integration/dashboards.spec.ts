import * as Chance from "chance";

const random = new Chance();

it("create a new dashboard and publish it", () => {
  cy.login();

  const name = random.company();
  const description = random.sentence();
  cy.createDashboard(name, description);

  // User is taken to the EditDashboard page
  // Expect to see success alert and the dashboard title
  cy.findByRole("heading", { name }).should("exist");
  cy.contains(`"${name}" draft dashboard successfully created`);

  /**
   *
   * Add Text content item
   *
   */

  // Click the button to add a content item
  cy.get("button").contains("Add content item").click();

  // User is taken to the Add content item screen.
  cy.contains("Select the type of content you want to add");
  cy.findByLabelText("Text").check({ force: true });
  cy.get("button").contains("Continue").click();
  cy.contains("Configure text content");

  // Enter title and content in the form
  const textTitle = random.word();
  const textContent = random.paragraph();
  cy.findByLabelText("Text title").type(textTitle);
  cy.findByLabelText("Text").type(textContent);

  // Make sure the Preview renders and then save
  cy.findByRole("heading", { name: textTitle }).should("exist");
  cy.findByText(textContent).should("exist");
  cy.get("button").contains("Add text").click();

  // Check success alert and content item show up
  cy.contains(`"${textTitle}" text has been successfully added`);
  cy.contains(textTitle);

  /**
   *
   * Add Metrics content item
   *
   */

  // Click the button to add a content item
  cy.get("button").contains("Add content item").click();

  // User is taken to the Add content item screen.
  cy.contains("Select the type of content you want to add");
  cy.findByLabelText("Metrics").check({ force: true });
  cy.get("button").contains("Continue").click();
  cy.contains("Add metrics");

  // User is prompted to create from scratch or
  // or use an existing dynamic dataset. Select create new.
  cy.findByLabelText("Create new").check({ force: true });
  cy.get("button").contains("Continue").click();

  // User is now in the Add metrics page. Lets enter a
  // title for the content item.
  const metricsTitle = random.word();
  cy.findByLabelText("Metrics title").type(metricsTitle);

  // Click add new metric which will take the user to new screen
  cy.get("button").contains("Add metric").click();
  cy.contains("Add metric");

  // Enter required values in the form for this metric and submit
  const metricTitle = random.string();
  const metricValue = random.integer({ min: 10, max: 1000 });
  cy.findByLabelText("Metric title").type(metricTitle);
  cy.findByLabelText("Metric value").type(metricValue.toString());
  cy.get("button").contains("Add metric").click();

  // Verify metric was added and submit
  cy.contains("Metric successfully added");
  cy.contains(metricTitle);
  cy.contains(metricValue);
  cy.get("button").contains("Add Metrics").click();

  // Verify content item was added
  cy.contains(`"${metricsTitle}" metrics have been successfully added`);
  cy.contains(metricsTitle);

  /**
   *
   * Add Chart content item
   *
   */
  // Click the button to add a content item
  cy.get("button").contains("Add content item").click();

  // User is taken to the Add content item screen.
  cy.contains("Select the type of content you want to add");
  cy.findByLabelText("Chart").check({ force: true });
  cy.get("button").contains("Continue").click();
  cy.contains("Add chart");

  // Select static dataset
  cy.findByLabelText("Static dataset").check({ force: true });
  // Upload dataset
  cy.contains("Drag file here or choose from folder");
  cy.findByLabelText("Static datasets").attachFile("linechart.csv");
  cy.get("button").contains("Continue").click();

  // User is taken to the Add chart screen
  // Verify chart renders data from the CSV fixture
  cy.contains("Series 1");
  cy.contains("Series 2");
  cy.contains("Series 3");
  cy.contains("Series 4");
  cy.contains("Series 5");
  cy.screenshot();

  // Enter chart details
  const chartTitle = random.word();
  const chartSummary = random.sentence();
  cy.findByLabelText("Chart title").type(chartTitle);
  cy.findByLabelText("Chart summary - optional").type(chartSummary);

  // Save and verify chart was added
  cy.get("button").contains("Add Chart").click();
  cy.contains(`"${chartTitle}" line chart has been successfully added`);
  cy.contains(chartTitle);
});
