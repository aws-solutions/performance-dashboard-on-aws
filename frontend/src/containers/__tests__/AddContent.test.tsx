import React from "react";
import {
  render,
  fireEvent,
  act,
  screen,
  RenderResult,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import AddContent from "../AddContent";

describe("Add content screen", () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(<AddContent />, { wrapper: MemoryRouter });
  });

  test("renders Add content", async () => {
    expect(component).toMatchSnapshot();
  });

  test("renders header", async () => {
    const addContent = await screen.getByRole("heading", {
      name: "Add content item",
    });
    expect(addContent).toBeInTheDocument();
  });

  test("renders text option", async () => {
    const header = await screen.findByText("Text");
    const description = await screen.findByText(
      "Add a formatted block of text. Input supports Markdown including links, bullets, bolding, and headings."
    );
    expect(header).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test("renders metrics option", async () => {
    const header = await screen.findByText("Metrics");
    const description = await screen.findByText(
      "Add one or more metrics to show point-in-time numerical data and trends."
    );
    expect(header).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test("renders chart option", async () => {
    const header = await screen.findByText("Chart");
    const description = await screen.findByText(
      "Display data as a visualization, including line, bar, column and part-to-whole charts."
    );
    expect(header).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test("renders table option", async () => {
    const header = await screen.findByText("Table");
    const description = await screen.findByText(
      "Display data formatted in rows and columns."
    );
    expect(header).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test("renders image option", async () => {
    const header = await screen.findByText("Image");
    const description = await screen.findByText("Upload an image to display.");
    expect(header).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test("renders section option", async () => {
    const header = await screen.findByText("Section");
    const description = await screen.findByText(
      "Add a section to group similar content items in a list."
    );
    expect(header).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test("renders preview thumbnail for each content item", async () => {
    fireEvent.click(screen.getByTestId("textRadioButton"));
    let thumbnail = screen.getByAltText("Text Content Item Preview");
    expect(thumbnail).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("metricsRadioButton"));
    thumbnail = screen.getByAltText("Metrics Content Item Preview");
    expect(thumbnail).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("chartRadioButton"));
    thumbnail = screen.getByAltText("Chart Content Item Preview");
    expect(thumbnail).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("tableRadioButton"));
    thumbnail = screen.getByAltText("Table Content Item Preview");
    expect(thumbnail).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("imageRadioButton"));
    thumbnail = screen.getByAltText("Image Content Item Preview");
    expect(thumbnail).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("sectionRadioButton"));
    thumbnail = screen.getByAltText("Section Content Item Preview");
    expect(thumbnail).toBeInTheDocument();
  });
});

describe("'Continue' button navigation", () => {
  let history;
  beforeEach(() => {
    history = createMemoryHistory();
    jest.spyOn(history, "push");
    render(
      <Router history={history}>
        <AddContent />
      </Router>
    );
  });

  test("takes you to add-chart screen, when Chart option is selected", async () => {
    fireEvent.click(screen.getByTestId("chartRadioButton"));

    await act(async () => {
      const continueButton = await screen.findByRole("button", {
        name: "Continue",
      });
      fireEvent.click(continueButton);
    });

    expect(history.push).toHaveBeenCalledWith(
      "/admin/dashboard/undefined/add-chart"
    );
  });

  test("takes you to add-table screen, when Table option is selected", async () => {
    fireEvent.click(screen.getByTestId("tableRadioButton"));

    await act(async () => {
      const continueButton = await screen.findByRole("button", {
        name: "Continue",
      });
      fireEvent.click(continueButton);
    });

    expect(history.push).toHaveBeenCalledWith(
      "/admin/dashboard/undefined/add-table"
    );
  });

  test("takes you to add-text screen, when Text option is selected", async () => {
    fireEvent.click(screen.getByTestId("textRadioButton"));

    await act(async () => {
      const continueButton = await screen.findByRole("button", {
        name: "Continue",
      });
      fireEvent.click(continueButton);
    });

    expect(history.push).toHaveBeenCalledWith(
      "/admin/dashboard/undefined/add-text"
    );
  });

  test("takes you to add-image screen, when Image option is selected", async () => {
    fireEvent.click(screen.getByTestId("imageRadioButton"));

    await act(async () => {
      const continueButton = await screen.findByRole("button", {
        name: "Continue",
      });
      fireEvent.click(continueButton);
    });

    expect(history.push).toHaveBeenCalledWith(
      "/admin/dashboard/undefined/add-image"
    );
  });

  test("takes you to add-metrics screen, when Metrics option is selected", async () => {
    fireEvent.click(screen.getByTestId("metricsRadioButton"));

    await act(async () => {
      const continueButton = await screen.findByRole("button", {
        name: "Continue",
      });
      fireEvent.click(continueButton);
    });

    expect(history.push).toHaveBeenCalledWith(
      "/admin/dashboard/undefined/add-metrics"
    );
  });

  test("takes you to add-section screen, when Section option is selected", async () => {
    fireEvent.click(screen.getByTestId("sectionRadioButton"));

    await act(async () => {
      const continueButton = await screen.findByRole("button", {
        name: "Continue",
      });
      fireEvent.click(continueButton);
    });

    expect(history.push).toHaveBeenCalledWith(
      "/admin/dashboard/undefined/add-section"
    );
  });
});

test("cancel link takes you to Edit Dashboard screen", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

  const { findByRole } = render(
    <Router history={history}>
      <AddContent />
    </Router>
  );

  await act(async () => {
    const cancelButton = await findByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
  });

  expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/undefined");
});
