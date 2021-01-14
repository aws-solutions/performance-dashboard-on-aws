import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopicareaListing from "../TopicareaListing";

jest.mock("../../hooks");

test("renders a button to delete", async () => {
  const { getByRole } = render(<TopicareaListing />, {
    wrapper: MemoryRouter,
  });
  const button = getByRole("button", { name: "Delete" });
  expect(button).toBeInTheDocument();
});

test("renders a button to create topic area", async () => {
  const { getByRole } = render(<TopicareaListing />, {
    wrapper: MemoryRouter,
  });
  const button = getByRole("button", { name: "Create new ministry" });
  expect(button).toBeInTheDocument();
});

test("renders a topic area table", async () => {
  const { getByLabelText } = render(<TopicareaListing />, {
    wrapper: MemoryRouter,
  });

  const topicarea1 = getByLabelText("Topic Area Bananas");
  expect(topicarea1).toBeInTheDocument();

  const topicarea2 = getByLabelText("Topic Area Grapes");
  expect(topicarea2).toBeInTheDocument();
});

test("filters topic areas based on search input", async () => {
  const { getByLabelText, getByRole } = render(<TopicareaListing />, {
    wrapper: MemoryRouter,
  });

  const topicarea1 = getByLabelText("Topic Area Bananas");
  const topicarea2 = getByLabelText("Topic Area Grapes");

  // Make sure both topic areas show up in the table
  expect(topicarea1).toBeInTheDocument();
  expect(topicarea2).toBeInTheDocument();

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

  // Topic Area Bananas should dissapear
  expect(topicarea1).not.toBeInTheDocument();
  expect(topicarea2).toBeInTheDocument();
});
