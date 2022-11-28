/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Pagination from "../Pagination";

test("renders a small number of pages at first page", async () => {
  const gotoPage = jest.fn();
  const setCurrentPage = jest.fn();
  render(
    <Pagination
      numPages={3}
      currentPage={1}
      numPageLinksShown={7}
      gotoPage={gotoPage}
      setCurrentPage={setCurrentPage}
    />
  );
  expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  expect(screen.getByText("Next")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("2")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.queryByText("...")).not.toBeInTheDocument();
});

test("renders a small number of pages at last page", async () => {
  const gotoPage = jest.fn();
  const setCurrentPage = jest.fn();
  render(
    <Pagination
      numPages={3}
      currentPage={3}
      numPageLinksShown={7}
      gotoPage={gotoPage}
      setCurrentPage={setCurrentPage}
    />
  );
  expect(screen.getByText("Previous")).toBeInTheDocument();
  expect(screen.queryByText("Next")).not.toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("2")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.queryByText("...")).not.toBeInTheDocument();
});

test("renders a large number of pages", async () => {
  const gotoPage = jest.fn();
  const setCurrentPage = jest.fn();
  render(
    <Pagination
      numPages={20}
      currentPage={10}
      numPageLinksShown={7}
      gotoPage={gotoPage}
      setCurrentPage={setCurrentPage}
    />
  );
  expect(screen.getByText("Previous")).toBeInTheDocument();
  expect(screen.getByText("Next")).toBeInTheDocument();
  expect(screen.queryByText("2")).not.toBeInTheDocument();
  expect(screen.getByText("9")).toBeInTheDocument();
  expect(screen.getByText("10")).toBeInTheDocument();
  expect(screen.getByText("11")).toBeInTheDocument();
  expect(screen.queryByText("12")).not.toBeInTheDocument();
  expect(screen.getAllByText("…")).toHaveLength(2);
});
