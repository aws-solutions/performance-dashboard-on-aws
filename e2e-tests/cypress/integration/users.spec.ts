/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import UserListingPage from "../pages/UserListing";
import LoginPage from "../pages/Login";
import * as Chance from "chance";

const random = new Chance();

describe("Admin user", () => {
    beforeEach(() => {
        const loginPage = new LoginPage();
        loginPage.visit();
        loginPage.loginAsAdmin();
    });

    it("can create a new user, change its role, and remove it", () => {
        const userListingPage = new UserListingPage();
        userListingPage.visit();

        const addUsersPage = userListingPage.goToAddUser();

        // Enter user details
        const username = random.word();
        const userEmail = username.concat("@example.com");

        addUsersPage.fillEmailAddress(userEmail);
        addUsersPage.selectAdminRole();
        addUsersPage.submit();

        // Verify admin user is in the table
        userListingPage.verifyUser(username, userEmail, "Admin");

        // Change user's role from admin to editor
        const changeUsersRolePage = userListingPage.goToChangeRole(username);
        changeUsersRolePage.verifyEmailAddress(userEmail);
        changeUsersRolePage.selectEditorRole();
        changeUsersRolePage.submit();

        // Verify editor user is in the table
        userListingPage.verifyUser(username, userEmail, "Editor");

        // Delete the user
        userListingPage.removeUser(username);
        cy.contains("Successfully removed 1 user.");
    });
});
