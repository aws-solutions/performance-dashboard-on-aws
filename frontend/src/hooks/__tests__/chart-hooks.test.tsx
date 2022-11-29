/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { render, act, within } from "@testing-library/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  // @ts-ignore
  CategoricalChartWrapper,
} from "recharts";

import {
  useYAxisMetadata,
  useXAxisMetadata,
  useWindowSize,
} from "../chart-hooks";

interface Props {
  significantDigitLabels: boolean;
  data: any[];
}
const data = [
  {
    chapter: "Algorithms",
    pages: 100,
  },
  {
    chapter: "Data Structure",
    pages: 300,
  },
];

describe("useYAxisMetadata", () => {
  const YBarChart = (props: Props) => {
    const { data, significantDigitLabels } = props;
    const chartRef = useRef(null);
    const [chartLoaded, setChartLoaded] = useState(false);
    const { yAxisLargestValue } = useYAxisMetadata(
      chartRef,
      chartLoaded,
      significantDigitLabels
    );
    return (
      <>
        <span data-testid="yAxisLargestValue">{yAxisLargestValue}</span>
        <BarChart
          width={600}
          height={300}
          data={data}
          ref={(el: CategoricalChartWrapper) => {
            chartRef.current = el;
            setChartLoaded(!!el);
          }}
        >
          <XAxis dataKey="chapter" />
          <YAxis />
          <Bar dataKey="pages" />
        </BarChart>
      </>
    );
  };

  test("should use YAxis metadata", async () => {
    const { getByTestId } = render(
      <YBarChart data={data} significantDigitLabels={true} />
    );
    expect(
      within(getByTestId("yAxisLargestValue")).getByText("300")
    ).toBeInTheDocument();
  });
});

describe("useXAxisMetadata", () => {
  const XBarChart = (props: Props) => {
    const { data, significantDigitLabels } = props;
    const chartRef = useRef(null);
    const [chartLoaded, setChartLoaded] = useState(false);
    const { xAxisLargestValue } = useXAxisMetadata(
      chartRef,
      chartLoaded,
      significantDigitLabels
    );
    return (
      <>
        <span data-testid="xAxisLargestValue">{xAxisLargestValue}</span>
        <BarChart
          width={600}
          height={300}
          data={data}
          ref={(el: CategoricalChartWrapper) => {
            chartRef.current = el;
            setChartLoaded(!!el);
          }}
        >
          <XAxis type="number" />
          <YAxis dataKey="chapter" />
          <Bar dataKey="pages" />
        </BarChart>
      </>
    );
  };

  test("should use XAxis metadata", async () => {
    const { getByTestId } = render(
      <XBarChart data={data} significantDigitLabels={true} />
    );
    expect(
      within(getByTestId("xAxisLargestValue")).getByText("1")
    ).toBeInTheDocument();
  });
});

describe("useWindowSize", () => {
  const ResizableComponent = () => {
    const windowSize = useWindowSize();
    return (
      <>
        <span>{windowSize.height}</span>
        <span>{windowSize.width}</span>
      </>
    );
  };
  test("should handle window resize", async () => {
    const currentWidth = window.innerWidth;
    const currenHeight = window.innerHeight;

    const { getByText } = render(<ResizableComponent />);

    expect(getByText(`${currentWidth}`)).toBeInTheDocument();
    expect(getByText(`${currenHeight}`)).toBeInTheDocument();

    const resizedWidth = currentWidth + 800;
    const resizedHeight = currenHeight + 600;
    const resizeWindow = (width: number, height: number) => {
      window.innerWidth = width;
      window.innerHeight = height;
      window.dispatchEvent(new Event("resize"));
    };

    await act(async () => {
      resizeWindow(resizedWidth, resizedHeight);
    });

    expect(getByText(`${resizedWidth}`)).toBeInTheDocument();
    expect(getByText(`${resizedHeight}`)).toBeInTheDocument();
  });
});
