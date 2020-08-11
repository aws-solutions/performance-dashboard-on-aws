import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./Markdown.css";

type MarkdownProps = {
  title: string;
  subtitle: string;
};

const Markdown = (props: MarkdownProps) => {
  const [disabled, toggle] = useState(true);
  const [boxHeight, setBoxHeight] = useState(142);
  const [text, setText] = useState("");

  useEffect(() => {
    const height = document.querySelector("textarea")?.clientHeight || 142;
    setBoxHeight(height + 2);
  }, []);

  const textChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div className="markdown">
      <label htmlFor="markdownarea" className="usa-label">
        {props.title}
      </label>
      <span className="usa-hint">{`${props.subtitle} This text area supports limited Markdown.`}</span>
      <div className="usa-checkbox margin-top-2">
        <input
          id="toggle"
          checked={!disabled}
          value="preview"
          name="toggle"
          type="checkbox"
          onChange={() => toggle(!disabled)}
          className="usa-checkbox__input"
        />
        <label htmlFor="toggle" className="usa-checkbox__label">
          Preview live text
        </label>
      </div>
      {disabled ? (
        <textarea
          id="markdownarea"
          value={text}
          onChange={textChange}
          placeholder="Enter overview text here"
          rows={6}
          className="usa-textarea"
        />
      ) : (
        <div className="markdown-box" style={{ height: boxHeight }}>
          <ReactMarkdown source={text} />
        </div>
      )}
    </div>
  );
};

export default Markdown;
