/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  render,
  fireEvent,
  act,
  screen,
  getByText,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopicareaListing from "../TopicareaListing";
import userEvent from "@testing-library/user-event";
import BackendService from "../../services/BackendService";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

test("renders the dropdown menu", () => {
  render(<TopicareaListing topicareas={[]} reloadTopicAreas={() => {}} />, {
    wrapper: MemoryRouter,
  });
  expect(screen.getByText("Actions")).toBeInTheDocument();
});

test("dropdown menu expands when clicked", () => {
  render(<TopicareaListing topicareas={[]} reloadTopicAreas={() => {}} />, {
    wrapper: MemoryRouter,
  });
  userEvent.click(screen.getByText("Actions"));
  expect(screen.getByText("Delete")).toBeInTheDocument();
  expect(screen.getByText("Edit")).toBeInTheDocument();
});

test("dropdown menu options are disabled when there is no selection", () => {
  render(<TopicareaListing topicareas={[]} reloadTopicAreas={() => {}} />, {
    wrapper: MemoryRouter,
  });
  userEvent.click(screen.getByText("Actions"));
  expect(screen.getByText("Delete")).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByText("Edit")).toHaveAttribute("aria-disabled", "true");
});

test("renders a button to create topic area", async () => {
  const { getByRole } = render(
    <TopicareaListing topicareas={[]} reloadTopicAreas={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );
  const button = getByRole("button", { name: "Create new topic area" });
  expect(button).toBeInTheDocument();
});

test("renders a topic area table", async () => {
  const { getByText } = render(
    <TopicareaListing
      topicareas={[
        {
          id: "123456789",
          name: "Topic Area Bananas",
          createdBy: "test user 1",
          dashboardCount: 4,
        },
        {
          id: "987654321",
          name: "Topic Area Grapes",
          createdBy: "test user 2",
          dashboardCount: 10,
        },
      ]}
      reloadTopicAreas={() => {}}
    />,
    {
      wrapper: MemoryRouter,
    }
  );

  const topicarea1 = getByText("Topic Area Bananas");
  expect(topicarea1).toBeInTheDocument();

  const topicarea2 = getByText("Topic Area Grapes");
  expect(topicarea2).toBeInTheDocument();
});

test("dropdown menu delete option deletes a selected topic area without dashboards", async () => {
  render(
    <TopicareaListing
      topicareas={[
        {
          id: "123456789",
          name: "Topic Area Bananas",
          createdBy: "test user 1",
          dashboardCount: 0,
        },
      ]}
      reloadTopicAreas={() => {}}
    />,
    {
      wrapper: MemoryRouter,
    }
  );
  // First select user from the table
  const checkbox = screen.getByRole("radio", { name: "Topic Area Bananas" });
  fireEvent.click(checkbox);

  // Click remove users button
  userEvent.click(screen.getByText("Actions"));
  userEvent.click(screen.getByText("Delete"));

  // Wait for confirmation modal to show
  await screen.findByText("Are you sure you want to delete this topic area?");
  const deleteButton = screen.getByRole("button", { name: "Delete" });
  await act(async () => {
    fireEvent.click(deleteButton);
  });

  //  Verify backend service gets called
  expect(BackendService.deleteTopicArea).toBeCalledWith("123456789");
});

test("dropdown menu delete option is disabled when the selected topic area has at least one dashboard", async () => {
  render(
    <TopicareaListing
      topicareas={[
        {
          id: "123456789",
          name: "Topic Area Bananas",
          createdBy: "test user 1",
          dashboardCount: 1,
        },
      ]}
      reloadTopicAreas={() => {}}
    />,
    {
      wrapper: MemoryRouter,
    }
  );
  // First select user from the table
  const checkbox = screen.getByRole("radio", { name: "Topic Area Bananas" });
  fireEvent.click(checkbox);

  userEvent.click(screen.getByText("Actions"));
  expect(screen.getByText("Delete")).toHaveAttribute("aria-disabled", "true");

  //  Verify backend service gets called
  expect(BackendService.deleteTopicArea).toBeCalledTimes(0);
});
