/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import LoginPage from "../pages/Login";
import SettingsPage from "../pages/Settings";
import * as Chance from "chance";

const random = new Chance();
let settingsPage: SettingsPage;

describe("Admin user", () => {
  beforeEach(() => {
    const loginPage = new LoginPage();
    loginPage.visit();
    loginPage.loginAsAdmin();

    // Visit Settings landing page
    settingsPage = new SettingsPage();
    settingsPage.visit();
  });

  it("can customize topic area label and change it back", () => {
    let topicAreaListingPage = settingsPage.goToTopicAreas();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    cy.get("div.Markdown.undefined")
      .first()
      .invoke("text")
      .then((name) => {
        cy.wrap(name).as("oldName");
      });

    cy.get("div.Markdown.undefined")
      .last()
      .invoke("text")
      .then((name) => {
        cy.wrap(name).as("oldNames");
      });

    // Change topic area label to Category and Categories
    let editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

    const newName = "Category";
    const newNames = "Categories";
    editTopicAreaLabelPage.renameTopicAreaLabel(newName);
    editTopicAreaLabelPage.renameTopicAreasLabel(newNames);

    topicAreaListingPage = editTopicAreaLabelPage.submit();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    topicAreaListingPage.verifyTopicAreaLabel(newName, newNames);

    cy.reload();

    // Customize topic area label to old name
    cy.get("@oldName").then((oldName) => {
      cy.get("@oldNames").then((oldNames) => {
        const oldNameString = <string>(<unknown>oldName);
        const oldNamesString = <string>(<unknown>oldNames);
        editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

        editTopicAreaLabelPage.renameTopicAreaLabel(oldNameString);
        editTopicAreaLabelPage.renameTopicAreasLabel(oldNamesString);

        topicAreaListingPage = editTopicAreaLabelPage.submit();
        topicAreaListingPage.waitUntilTopicAreasTableLoads();

        topicAreaListingPage.verifyTopicAreaLabel(
          oldNameString,
          oldNamesString
        );
      });
    });
  });

  it("can create, edit, and delete topic area", () => {
    let topicAreaListingPage = settingsPage.goToTopicAreas();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    // Create a new topic area
    let createTopicAreaPage = topicAreaListingPage.goToCreateTopicArea();

    const topicAreaName = random.word();
    createTopicAreaPage.createTopicArea(topicAreaName);
    topicAreaListingPage = createTopicAreaPage.submit();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    cy.reload();

    cy.contains(`"${topicAreaName}" topic area successfully created`);
    topicAreaListingPage.verifyTopicArea(topicAreaName);

    // Edit the created topic area
    let editTopicAreaPage =
      topicAreaListingPage.goToEditTopicArea(topicAreaName);

    const newTopicAreaName = random.word();
    editTopicAreaPage.editTopicArea(newTopicAreaName);

    topicAreaListingPage = editTopicAreaPage.submit();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    cy.reload();

    cy.contains(`${newTopicAreaName} was successfully edited.`);
    topicAreaListingPage.verifyTopicArea(newTopicAreaName);

    // Delete the edited topic area
    topicAreaListingPage.deleteTopicArea(newTopicAreaName);
    topicAreaListingPage.waitUntilTopicAreasTableLoads();
    cy.contains(`"${newTopicAreaName}" topic area successfully deleted`);
  });

  it("can customize publishing guidance and change it back", () => {
    let publishingGuidancePage = settingsPage.goToPublishingGuidance();
    cy.get("h1").contains("Publishing guidance");

    cy.get("div.Markdown.undefined")
      .invoke("text")
      .then((acknowledgment) => {
        cy.wrap(acknowledgment).as("oldAcknowledgment");
      });

    // Change to the new acknowledgment
    const newAcknowledgment = random.sentence();
    publishingGuidancePage.start();
    publishingGuidancePage.updateAcknowledgment(newAcknowledgment);
    publishingGuidancePage.submit();

    // Verify the new acknowledgment is present
    cy.contains("Publishing guidance successfully edited.");
    cy.contains(newAcknowledgment);

    cy.get("@oldAcknowledgment").then((oldAcknowledgment) => {
      // Change the acknowledgment back
      publishingGuidancePage.start();
      publishingGuidancePage.updateAcknowledgment(
        <string>(<unknown>oldAcknowledgment)
      );
      publishingGuidancePage.submit();

      // Verify the old acknowledgment is present
      cy.contains("Publishing guidance successfully edited.");
      cy.contains(<string>(<unknown>oldAcknowledgment));
    });
  });

  it("can customize published site navigation bar and change it back", () => {
    let publishedSitePage = settingsPage.goToPublishedSite();
    cy.get("h1").contains("Published site");

    cy.get("div.Markdown.undefined")
      .eq(0)
      .invoke("text")
      .then((title) => {
        cy.wrap(title).as("oldTitle");
      });

    cy.get("div.Markdown.undefined")
      .eq(1)
      .invoke("text")
      .then((email) => {
        cy.wrap(email).as("oldEmail");
      });

    // Change to new title and email in navigation bar
    const newTitle = random.word();
    const newEmail = random.word() + "@example.com";
    publishedSitePage.startEditNavBar();
    cy.get("h1").contains("Edit navigation bar");
    publishedSitePage.updateNavBarTitle(newTitle);
    publishedSitePage.updateNavBarEmail(newEmail);
    publishedSitePage.submitNavBar();

    // Verify the new title and email are present
    publishedSitePage.verifyTitleEmail(newTitle, newEmail);
    cy.contains("Navigation bar successfully edited.");

    // Change to old title and email in navigation bar and verify
    cy.get("@oldTitle").then((oldTitle) => {
      cy.get("@oldEmail").then((oldEmail) => {
        const oldTitleString = <string>(<unknown>oldTitle);
        const oldEmailString = <string>(<unknown>oldEmail);

        publishedSitePage.startEditNavBar();
        cy.get("h1").contains("Edit navigation bar");
        publishedSitePage.updateNavBarTitle(oldTitleString);
        publishedSitePage.updateNavBarEmail(oldEmailString);
        publishedSitePage.submitNavBar();

        publishedSitePage.verifyTitleEmail(oldTitleString, oldEmailString);
        cy.contains("Navigation bar successfully edited.");
      });
    });
  });

  it("can customize published site homepage content and change it back", () => {
    let publishedSitePage = settingsPage.goToPublishedSite();
    cy.get("h1").contains("Published site");

    cy.get("div.Markdown.undefined")
      .eq(2)
      .invoke("text")
      .then((headline) => {
        cy.wrap(headline).as("oldHeadline");
      });

    cy.get("div.Markdown.undefined")
      .eq(3)
      .invoke("text")
      .then((description) => {
        cy.wrap(description).as("oldDescription");
      });

    // Change to new headline and description in homepage content
    const newHeadline = random.word();
    const newDescription = random.sentence();
    publishedSitePage.startEditHomepage();
    cy.get("h1").contains("Edit homepage content");
    publishedSitePage.updateHomepageHeadline(newHeadline);
    publishedSitePage.updateHomepageDescription(newDescription);
    publishedSitePage.submitHomepage();

    // Verify the new headline and description are present
    cy.contains("Homepage content successfully edited.");
    publishedSitePage.verifyHeadlineAndDescription(newHeadline, newDescription);

    // Change to the old homepage content and verify
    cy.get("@oldHeadline").then((oldHeadline) => {
      cy.get("@oldDescription").then((oldDescription) => {
        const oldHeadlineString = <string>(<unknown>oldHeadline);
        const oldDescriptionString = <string>(<unknown>oldDescription);

        publishedSitePage.startEditHomepage();
        cy.get("h1").contains("Edit homepage content");
        publishedSitePage.updateHomepageHeadline(oldHeadlineString);
        publishedSitePage.updateHomepageDescription(oldDescriptionString);
        publishedSitePage.submitHomepage();

        cy.contains("Homepage content successfully edited.");
        publishedSitePage.verifyHeadlineAndDescription(
          oldHeadlineString,
          oldDescriptionString
        );
      });
    });
  });

  it("can customize date and time format and change them back", () => {
    let dateTimeFormatPage = settingsPage.goToDateTimeFormat();
    cy.get("h1").contains("Date and time format");

    cy.get("div.font-sans-lg")
      .first()
      .invoke("text")
      .then((date) => {
        const dateFormat = date.substring(
          date.indexOf("(") + 1,
          date.indexOf(")")
        );
        cy.wrap(dateFormat).as("oldDateFormat");
      });

    cy.get("div.font-sans-lg")
      .last()
      .invoke("text")
      .then((time) => {
        const timeFormat = time.substring(
          time.indexOf("(") + 1,
          time.indexOf(")")
        );
        cy.wrap(timeFormat).as("oldTimeFormat");
      });

    // Change to new date and time format
    const newDateFormat = "DD/MM/YYYY";
    const newTimeFormat = "h:mm A";
    dateTimeFormatPage.startEditDateTime();
    cy.get("h1").contains("Edit date and time format");
    dateTimeFormatPage.updateFormat(newDateFormat, newTimeFormat);
    dateTimeFormatPage.submit();

    // Verify date and time are in UK format
    cy.contains("Date and time format successfully edited.");
    dateTimeFormatPage.verifyFormat(newDateFormat, newTimeFormat);

    cy.reload();

    // Change to US date and time format and verify
    cy.get("@oldDateFormat").then((oldDateFormat) => {
      cy.get("@oldTimeFormat").then((oldTimeFormat) => {
        const oldDateFormatString = <string>(<unknown>oldDateFormat);
        const oldTimeFormatString = <string>(<unknown>oldTimeFormat);

        dateTimeFormatPage.startEditDateTime();
        cy.get("h1").contains("Edit date and time format");
        dateTimeFormatPage.updateFormat(
          oldDateFormatString,
          oldTimeFormatString
        );
        dateTimeFormatPage.submit();

        cy.contains("Date and time format successfully edited.");
        dateTimeFormatPage.verifyFormat(
          oldDateFormatString,
          oldTimeFormatString
        );
      });
    });
  });
});
