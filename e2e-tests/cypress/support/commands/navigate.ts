type Screens = "DashboardList" | "Settings" | "Manage users";

const selectors = {
  navBar: "nav[aria-label='Primary navigation']",
};

function navigateTo(screen: Screens) {
  switch (screen) {
    case "DashboardList":
      goToDashboardList();
  }
}

function goToDashboardList() {
  // Clicks on the `Dashboards` link in the navbar menu
  cy.get(selectors.navBar).get("a").contains("Dashboards").click();
}

export default navigateTo;
