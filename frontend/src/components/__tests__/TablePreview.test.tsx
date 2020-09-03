import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TablePreview from "../TablePreview";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

library.add(faCaretUp, faCaretDown);

test("renders the title of the table preview component", async () => {
  const { getByText } = render(
    <TablePreview title="test title" headers={["test"]} />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
});
