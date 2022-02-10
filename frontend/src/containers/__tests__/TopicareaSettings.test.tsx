import React from "react";
import { render, fireEvent, act, getByText } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopicareaSettings from "../TopicareaSettings";

jest.mock("../../hooks");

test("renders the title", async () => {
  const { getByRole } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Topic areas" })).toBeInTheDocument();
});

test("renders the title with set value of topic areas", async () => {
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
      "Dashboards are organized by topic areas. A dashboard must have a topic area " +
        "and can have only one topic area."
    )
  ).toBeInTheDocument();
});

test("render topic area label header", async () => {
  const { getByRole } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Topic area name" })).toBeInTheDocument();
});

test("renders the topic area label edit description", async () => {
  const { getByText } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText(
      "You can customize the name 'topic area' and it will be replaced throughout the interface. " +
        "For example, 'topic area' can be renamed to 'department', 'ministry', 'program', 'agency', etc."
    )
  ).toBeInTheDocument();
});

test("render single topic area name header", async () => {
  const { getByText } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Single topic area name")).toBeInTheDocument();
});

test("renders two edit buttons, one for the topci area label, another for the topic areas", async () => {
  const { getAllByRole } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  const button = getAllByRole("button", { name: "Edit" });
  expect(button[0]).toBeInTheDocument();
  expect(button[1]).toBeInTheDocument();
});

test("render multiple topic areas name header", async () => {
  const { getByText } = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Multiple topic areas name")).toBeInTheDocument();
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
  const button = getByRole("button", { name: "Create new topic area" });
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

test("topic area settings should match snapshot", async () => {
  const wrapper = render(<TopicareaSettings />, {
    wrapper: MemoryRouter,
  });
  expect(wrapper.container).toMatchSnapshot();
});
