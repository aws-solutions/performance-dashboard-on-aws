import selectors from "../utils/selectors";
import AddUsersPage from "./AddUsers";

class UserListing {
  visit() {
    // Capture the http requests
    cy.intercept({
      method: "GET",
      url: "/prod/user",
    }).as("listUsersRequest");

    cy.intercept({
      method: "GET",
      url: "/public/logo",
    }).as("logoRequest");

    // Direct to Manage users page
    cy.get(selectors.navBar).get("a").contains("Manage users").click();
    cy.wait(["@listUsersRequest", "@logoRequest"]);
  }

  goToAddUser(): AddUsersPage {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/public/logo",
    }).as("logoRequest");

    // Direct to Add users page
    cy.get("button").contains("Add user(s)").click();
    cy.wait(["@logoRequest"]);

    return new AddUsersPage();
  }

  removeUser(username: string) {
    // Search for user in case is not visible due to pagination
    cy.findByRole("searchbox").type(username);
    cy.get("form[role='search']").submit();

    // Select it
    cy.get(`input[title="${username}"]`).click({
      force: true,
      multiple: true,
    });

    // Click dropdown menu and then remove users
    cy.get("button").contains("Actions").click();
    cy.findByRole("menuitem", { name: "Remove users" }).click();

    // Wait for the request to finish
    cy.intercept({
      method: "DELETE",
      url: "/prod/user",
    }).as("deleteUsersRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/user",
    }).as("listUsersRequest");

    // Accept in confirmation modal
    cy.get("button").contains("Delete").click();
    cy.wait(["@deleteUsersRequest", "@listUsersRequest"]);
  }
}

export default UserListing;
