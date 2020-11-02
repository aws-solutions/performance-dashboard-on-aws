import React from "react";
import ReactMarkdown from "react-markdown";

const MarkdownSyntax = () => {
  return (
    <>
      <h1>Markdown Syntax</h1>
      <p className="font-sans-lg">
        Supported Markdown is limited to bold, single-level heading, hyperlinks
        and single-level unordered lists. All other text and markdown will be
        rendered as plain text.
      </p>

      <h3 className="margin-top-5">Bold</h3>
      <p>
        To bold text, add two asterisks or underscores before and after a word
        or phrase. To bold the middle of a word for emphasis, add two asterisks
        without spaces around the letters.
      </p>
      <table className="usa-table usa-table--borderless" width="100%">
        <thead>
          <tr>
            <th style={{ width: "50%" }}>Markdown</th>
            <th style={{ width: "50%" }}>Rendered output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>I love **bold** text</td>
            <td>
              <ReactMarkdown
                allowedTypes={[
                  "heading",
                  "link",
                  "list",
                  "listItem",
                  "paragraph",
                  "root",
                  "strong",
                  "text",
                ]}
                source="I love **bold** text"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="margin-top-7">Header</h3>
      <p>
        To create a heading, add a number sign (#) and space in front of a word
        or phrase. This platform only supports one level of headings. Any
        additional number signs will be render as text.
      </p>
      <table className="usa-table usa-table--borderless" width="100%">
        <thead>
          <tr>
            <th style={{ width: "50%" }}>Markdown</th>
            <th style={{ width: "50%" }}>Rendered output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td># Section Title</td>
            <td>
              <ReactMarkdown
                allowedTypes={[
                  "heading",
                  "link",
                  "list",
                  "listItem",
                  "paragraph",
                  "root",
                  "strong",
                  "text",
                ]}
                source="# Section Title"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="margin-top-7">Hyperlink</h3>
      <p>
        To create a link, enclose the link text in brackets (e.g., [AWS]) and
        then follow it immediately with the URL in parentheses (e.g.,
        (https://aws.amazon.com)).
      </p>
      <table className="usa-table usa-table--borderless" width="100%">
        <thead>
          <tr>
            <th style={{ width: "50%" }}>Markdown</th>
            <th style={{ width: "50%" }}>Rendered output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>I love [AWS](https://aws.amazon.com)</td>
            <td>
              <ReactMarkdown
                allowedTypes={[
                  "heading",
                  "link",
                  "list",
                  "listItem",
                  "paragraph",
                  "root",
                  "strong",
                  "text",
                ]}
                source="I love [AWS](https://aws.amazon.com)"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="margin-top-7">Unordered list</h3>
      <p>
        To create an unordered list, add dashes (-), asterisks (*), or plus
        signs (+) and space in front of line items.
      </p>
      <table className="usa-table usa-table--borderless" width="100%">
        <thead>
          <tr>
            <th style={{ width: "50%" }}>Markdown</th>
            <th style={{ width: "50%" }}>Rendered output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>+ First item</div>
              <div>* Second item</div>
              <div>- Third item</div>
              <div>+ Fourth item</div>
            </td>
            <td>
              <ReactMarkdown
                allowedTypes={[
                  "heading",
                  "link",
                  "list",
                  "listItem",
                  "paragraph",
                  "root",
                  "strong",
                  "text",
                ]}
                source="+ First item
* Second item
- Third item
+ Fourth item"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default MarkdownSyntax;
