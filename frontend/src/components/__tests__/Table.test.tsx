import React from "react";
import dayjs from "dayjs";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "../Table";

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Last Updated",
    accessor: "updatedAt",
    Cell: (props: any) => {
      return dayjs(props.value).format("YYYY-MM-DD");
    },
  },
];

const rows = [
  {
    id: "1",
    name: "Banana",
    updatedAt: "2021-11-11",
  },
  {
    id: "2",
    name: "Chocolate",
    updatedAt: "2020-11-11",
  },
  {
    id: "3",
    name: "Vanilla",
    updatedAt: "2019-11-11",
  },
];

test("renders a basic table", async () => {
  const { container } = render(
    <Table selection="none" columns={columns} rows={rows} />
  );
  expect(container).toMatchSnapshot();
});

test("renders a table with selection checkboxes", async () => {
  render(
    <Table
      selection="multiple"
      columns={columns}
      rows={rows}
      screenReaderField="name"
    />
  );
  expect(
    screen.getByRole("checkbox", {
      name: "Banana",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("checkbox", {
      name: "Chocolate",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("checkbox", {
      name: "Vanilla",
    })
  ).toBeInTheDocument();
});

test("calls onSelection function when user selects a row", async () => {
  const onSelection = jest.fn();
  render(
    <Table
      selection="multiple"
      columns={columns}
      rows={rows}
      screenReaderField="name"
      onSelection={onSelection}
    />
  );

  const checkbox = screen.getByRole("checkbox", { name: "Chocolate" });
  fireEvent.click(checkbox);

  expect(onSelection).toBeCalledWith([
    {
      id: "2",
      name: "Chocolate",
      updatedAt: "2020-11-11",
    },
  ]);
});

test("sorting buttons are clickable", async () => {
  const { container } = render(
    <Table
      selection="multiple"
      columns={columns}
      rows={rows}
      screenReaderField="name"
      initialSortByField="name"
    />
  );

  // Sort by ascending order
  fireEvent.click(
    screen.getByRole("button", {
      name: "Toggle SortBy Last Updated",
    })
  );

  // Vanilla should be first item
  expect(container).toMatchSnapshot();

  // Toggle to descending
  fireEvent.click(
    screen.getByRole("button", {
      name: "Toggle SortBy Last Updated",
    })
  );

  // Vanilla should be last
  expect(container).toMatchSnapshot();
});

test("filters out data when filterQuery is provided", async () => {
  render(
    <Table
      selection="none"
      columns={columns}
      rows={rows}
      screenReaderField="name"
      filterQuery="Chocolate"
    />
  );

  expect(screen.getByText("Chocolate")).toBeInTheDocument();
  expect(screen.queryByText("Vanilla")).not.toBeInTheDocument();
  expect(screen.queryByText("Banana")).not.toBeInTheDocument();
});
