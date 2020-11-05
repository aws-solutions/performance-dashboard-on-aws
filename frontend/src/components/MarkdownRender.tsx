import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownRenderProps = {
  source: string | undefined;
  className?: string;
};

const MarkdownRender = (props: MarkdownRenderProps) => {
  return (
    <ReactMarkdown
      allowedTypes={[
        "link",
        "list",
        "listItem",
        "paragraph",
        "root",
        "strong",
        "text",
      ]}
      linkTarget="_blank"
      className={props.className}
      source={props.source}
    />
  );
};

export default MarkdownRender;
