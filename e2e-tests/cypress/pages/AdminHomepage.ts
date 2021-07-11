class AdminHomepage {
  constructor() {
    cy.contains("Dashboards");
    cy.contains("Manage users");
    cy.contains("Settings");
  }
}

export default AdminHomepage;
