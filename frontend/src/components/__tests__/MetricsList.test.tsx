import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MetricsList from "../MetricsList";
import { Metric } from "../../models";

test("renders the component", async () => {
  const metrics = [{ title: "temperature", value: 90 }] as Metric[];
  const onClickMock = jest.fn();
  const wrapper = render(
    <MetricsList
      onClick={onClickMock}
      metrics={metrics}
      allowAddMetric={false}
    />
  );

  expect(wrapper.container).toMatchSnapshot();
});

test("renders the MetricsAdd button", async () => {
  const metrics = [{ title: "temperature", value: 90 }] as Metric[];
  const onClickMock = jest.fn();
  render(
    <MetricsList
      onClick={onClickMock}
      metrics={metrics}
      allowAddMetric={true}
    />
  );
  const addMetricsButton = screen.getByRole("button", {
    name: "+ Add metric",
  });
  fireEvent.click(addMetricsButton);

  expect(onClickMock).toBeCalled();
});

test("renders zero metrics with  MetricsAdd button", async () => {
  const metrics = [] as Metric[];
  const onClickMock = jest.fn();
  render(
    <MetricsList
      onClick={onClickMock}
      metrics={metrics}
      allowAddMetric={true}
    />
  );
  const addMetricsButton = screen.getByRole("button", {
    name: "+ Add metric",
  });
  fireEvent.click(addMetricsButton);

  expect(screen.getByText("No metrics added yet.")).toBeInTheDocument();
  expect(onClickMock).toBeCalled();
});

test("click on the metric name should trigger onEdit callback", async () => {
  const metrics = [{ title: "temperature", value: 90 }] as Metric[];
  const onEditMock = jest.fn();
  render(
    <MetricsList
      onClick={() => {}}
      onEdit={onEditMock}
      metrics={metrics}
      allowAddMetric={false}
    />
  );
  const actionsButton = screen.getByRole("button", {
    name: "Edit temperature",
  });
  fireEvent.click(actionsButton);

  expect(onEditMock).toBeCalled();
});

test("click on delete button should trigger onDelete callback", async () => {
  const metrics = [{ title: "temperature", value: 90 }] as Metric[];
  const onDeleteMock = jest.fn();
  render(
    <MetricsList
      onClick={() => {}}
      onDelete={onDeleteMock}
      metrics={metrics}
      allowAddMetric={false}
    />
  );
  const deleteButton = screen.getByText("Delete");
  fireEvent.click(deleteButton);

  expect(onDeleteMock).toBeCalled();
});

test("click on the up arrow should trigger onMoveUp callback", async () => {
  const metrics = [
    { title: "polution", value: 25 },
    { title: "temperature", value: 90 },
  ] as Metric[];
  const onMoveUpMock = jest.fn();
  render(
    <MetricsList
      onClick={() => {}}
      onMoveUp={onMoveUpMock}
      metrics={metrics}
      allowAddMetric={false}
    />
  );
  const onMoveUpButton = screen.getByRole("button", {
    name: "Move temperature up",
  });
  fireEvent.click(onMoveUpButton);

  expect(onMoveUpMock).toBeCalled();
});

test("click on the up arrow should trigger onMoveUp callback", async () => {
  const metrics = [
    { title: "polution", value: 25 },
    { title: "temperature", value: 90 },
  ] as Metric[];
  const onMoveDownMock = jest.fn();
  render(
    <MetricsList
      onClick={() => {}}
      onMoveDown={onMoveDownMock}
      metrics={metrics}
      allowAddMetric={false}
    />
  );
  const onMoveUpButton = screen.getByRole("button", {
    name: "Move polution down",
  });
  fireEvent.click(onMoveUpButton);

  expect(onMoveDownMock).toBeCalled();
});
