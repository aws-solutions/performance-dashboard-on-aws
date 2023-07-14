/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import selectors from "../utils/selectors";
import AddUsersPage from "./AddUsers";
import ChangeUsersRolePage from "./ChangeUsersRole";

class UserListing {
    visit() {
        // Capture the http request
        cy.intercept({
            method: "GET",
            url: "/prod/user",
        }).as("listUsersRequest");

        // Direct to Manage users page
        cy.get(selectors.navBar).get("a").contains("Manage users").click();
        cy.wait(["@listUsersRequest"]);
    }

    goToAddUser(): AddUsersPage {
        // Direct to Add users page
        cy.get("button").contains("Add user(s)").click();
        return new AddUsersPage();
    }

    verifyUser(username: string, userEmail: string, role: string) {
        // Search for user in case is not visible due to pagination
        cy.findByRole("searchbox").type(username);
        cy.get("form[role='search']").submit();

        cy.contains("tr", userEmail)
            .contains("tr", username)
            .contains("tr", role)
            .contains("FORCE_CHANGE_PASSWORD");

        // Clear textbox
        cy.findByRole("searchbox").clear();
        cy.get("form[role='search']").submit();
    }

    goToChangeRole(username: string): ChangeUsersRolePage {
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
        cy.findByRole("menuitem", { name: "Change role" }).click();

        return new ChangeUsersRolePage();
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
