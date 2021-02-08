import React, { useCallback, useState } from "react";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useColors } from "../hooks";

type Props = {
  title: string;
  summary: string;
  lines: Array<string>;
  data?: Array<any>;
  summaryBelow: boolean;
};

const LineChartPreview = (props: Props) => {
  const [linesHover, setLinesHover] = useState(null);
  const [hiddenLines, setHiddenLines] = useState<Array<string>>([]);
  const colors = useColors(props.lines.length);

  const getOpacity = useCallback(
    (dataKey) => {
      if (!linesHover) {
        return 1;
      }
      return linesHover === dataKey ? 1 : 0.2;
    },
    [linesHover]
  );

  const { data, lines } = props;
  const xAxisType = useCallback(() => {
    return data && data.every((row) => typeof row[lines[0]] === "number")
      ? "number"
      : "category";
  }, [data, lines]);

  const toggleLines = (e: any) => {
    if (hiddenLines.includes(e.dataKey)) {
      const hidden = hiddenLines.filter((line) => line !== e.dataKey);
      setHiddenLines(hidden);
    } else {
      setHiddenLines([...hiddenLines, e.dataKey]);
    }
  };

  return (
    <div>
      <h2 className="margin-left-1 margin-bottom-1">{props.title}</h2>
      {!props.summaryBelow && (
        <p className="margin-left-1 margin-top-0 margin-bottom-2">
          {props.summary}
        </p>
      )}
      {props.data && props.data.length && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={props.data} margin={{ right: 0, left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={props.lines.length ? props.lines[0] : ""}
              type={xAxisType()}
              padding={{ left: 20, right: 20 }}
              domain={[0, "dataMax"]}
            />
            <YAxis type="number" />
            <Tooltip cursor={{ fill: "#F0F0F0" }} />
            <Legend
              verticalAlign="top"
              onClick={toggleLines}
              onMouseLeave={(e) => setLinesHover(null)}
              onMouseEnter={(e) => setLinesHover(e.dataKey)}
            />
            {props.lines.length &&
              props.lines.slice(1).map((line, index) => {
                return (
                  <Line
                    dataKey={line}
                    type="monotone"
                    stroke={colors[index]}
                    key={index}
                    strokeWidth={3}
                    strokeOpacity={getOpacity(line)}
                    hide={hiddenLines.includes(line)}
                  />
                );
              })}
          </LineChart>
        </ResponsiveContainer>
      )}
      {props.summaryBelow && (
        <p className="margin-left-1 margin-top-3 margin-bottom-0">
          {props.summary}
        </p>
      )}
    </div>
  );
};

export default LineChartPreview;
