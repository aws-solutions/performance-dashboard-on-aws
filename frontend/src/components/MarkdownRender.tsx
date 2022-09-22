import React from "react";
import ReactMarkdown from "react-markdown";
import "./MarkdownRender.scss";

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
        "strong",
        "text",
        "heading",
      ]}
      linkTarget="_blank"
      className={`Markdown ${props.className}`}
      source={props.source || ""}
    />
  );
};

export default MarkdownRender;
