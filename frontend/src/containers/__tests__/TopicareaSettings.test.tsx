import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopicareaSettings from "../TopicareaSettings";

jest.mock("../../hooks");

test("renders the title", async () => {
  const { getByRole } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Topic areas" })).toBeInTheDocument();
});

test("renders the description", async () => {
  const { getByText } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText(
      "Dashboards are organized by topic areas. A dashboard must have a topic area and can have only on topic area."
    )
  ).toBeInTheDocument();
});

test("renders a button to delete", async () => {
  const { getByRole } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  const button = getByRole("button", { name: "Delete" });
  expect(button).toBeInTheDocument();
});

test("renders a button to create topic area", async () => {
  const { getByRole } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  const button = getByRole("button", { name: "Create topic area" });
  expect(button).toBeInTheDocument();
});

test("renders a topic area table", async () => {
  const { getByLabelText } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });

  const topicarea = getByLabelText("Topic Area Bananas");
  expect(topicarea).toBeInTheDocument();
});

test("filters topic areas based on name search input", async () => {
  const { getByLabelText, getByRole } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });

  let topicarea = getByLabelText("Topic Area Bananas");

  // Make sure the topic area show up in the table
  expect(topicarea).toBeInTheDocument();

  // Use search input to filter
  const search = getByLabelText("Search");
  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "grapes",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  // Topic area one should dissapear
  expect(topicarea).not.toBeInTheDocument();

  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "bananas",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  topicarea = getByLabelText("Topic Area Bananas");

  // Topic area one should appear
  expect(topicarea).toBeInTheDocument();
});

test("filters topic areas based on createdBy search input", async () => {
  const { getByLabelText, getByRole, getByText } = render(
    <TopicareaSettings />,
    {
      wrapper: MemoryRouter,
    }
  );

  let topicarea = getByText("test user 1");

  // Make sure the topicarea show up in the table
  expect(topicarea).toBeInTheDocument();

  // Use search input to filter
  const search = getByLabelText("Search");
  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "another test user",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  // Topic area one should dissapear
  expect(topicarea).not.toBeInTheDocument();

  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "test user 1",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  topicarea = getByText("test user 1");

  // Topic area one should appear
  expect(topicarea).toBeInTheDocument();
});
