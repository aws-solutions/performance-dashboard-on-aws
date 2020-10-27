import React from "react";
import { useJsonDataset } from "../hooks";
import { TableWidget } from "../models";
import TablePreview from "../components/TablePreview";

interface Props {
  widget: TableWidget;
}

function TableWidgetComponent(props: Props) {
  const { content } = props.widget;
  const { json } = useJsonDataset(content.s3Key.json);

  if (!json || json.length === 0) {
    return null;
  }

  const keys = Object.keys(json[0] as Array<string>);
  return (
    <TablePreview
      title={content.title}
      summary={content.summary}
      headers={keys}
      data={json}
    />
  );
}

export default TableWidgetComponent;
