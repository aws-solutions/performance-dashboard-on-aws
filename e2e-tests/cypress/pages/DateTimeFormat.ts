class DateTimeFormatPage {
  startEditDateTime() {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to edit date and time format page
    cy.get("button").contains("Edit").click();
    cy.wait(["@settingsRequest"]);
  }

  updateFormat(dateFormat: string, timeFormat: string) {
    cy.get("select#dateFormat").select(dateFormat);
    cy.get("select#timeFormat").select(timeFormat);
  }

  verifyFormat(dateFormat: string, timeFormat: string) {
    cy.get("div.font-sans-lg").first().contains(dateFormat);
    cy.get("div.font-sans-lg").last().contains(timeFormat);
  }

  submit() {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: "/prod/settings",
    }).as("updateSettingsRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to Date and time format page
    cy.get("form").submit();
    cy.wait(["@updateSettingsRequest", "@settingsRequest", "@settingsRequest"]);
  }
}

export default DateTimeFormatPage;
