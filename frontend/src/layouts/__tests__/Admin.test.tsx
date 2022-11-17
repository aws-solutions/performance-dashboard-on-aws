import React from "react";
import { render } from "@testing-library/react";
import { Route, Router, MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import withAdminLayout from "../Admin";
import AdminHome from "../../containers/AdminHome";

const history = createMemoryHistory();

describe("AdminLayout", () => {
  test("renders the component", async () => {
    const wrapper = render(
      <Router history={history}>
        <Route component={withAdminLayout(AdminHome)} />
      </Router>,
      { wrapper: MemoryRouter }
    );
    expect(wrapper.container).toMatchSnapshot();
  });
});
