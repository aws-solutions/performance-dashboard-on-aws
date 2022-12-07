/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

class AdminHomepage {
    constructor() {
        cy.contains("Dashboards");
        cy.contains("Manage users");
        cy.contains("Settings");
    }
}

export default AdminHomepage;
