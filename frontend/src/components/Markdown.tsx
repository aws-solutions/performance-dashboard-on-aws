import React, { useState, useEffect, useRef } from "react";
import MarkdownRender from "./MarkdownRender";
import Link from "./Link";
import "./Markdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

type MarkdownProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  register?: Function;
  required?: boolean;
  error?: string;
  hint?: string;
};

const Markdown = (props: MarkdownProps) => {
  const [disabled, toggle] = useState(true);
  const [boxHeight, setBoxHeight] = useState(142);
  const text = useRef<HTMLTextAreaElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const height = document.querySelector("textarea")?.clientHeight || 142;
    setBoxHeight(height + 2);
  }, []);

  let formGroupClassName = "usa-form-group";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  return (
    <div className={`markdown ${formGroupClassName}`}>
      <label htmlFor={props.id} className="usa-label text-bold">
        {props.label}
        {props.label && props.required && <span>&#42;</span>}
      </label>
      <span className="usa-hint">
        {props.hint} {t("MarkdownSupport")}{" "}
        <Link target="_blank" to={"/admin/markdown"}>
          {t("AddTextScreen.ViewMarkdownSyntax")}
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="margin-left-05"
            size="xs"
            aria-label={t("ARIA.OpenInNewTab")}
            aria-hidden={false}
          />
        </Link>
      </span>
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
          {t("PreviewLiveText")}
        </label>
      </div>
      {props.error && (
        <span
          className="usa-error-message margin-top-105"
          id="input-error-message"
          role="alert"
        >
          {props.error}
        </span>
      )}
      <div hidden={!disabled}>
        <textarea
          id={props.id}
          name={props.name}
          defaultValue={props.defaultValue}
          placeholder={t("EnterTextHere")}
          rows={6}
          ref={(e) => {
            if (props.register) {
              props.register(e, { required: props.required });
            }
            text.current = e;
          }}
          className="usa-textarea"
        />
      </div>
      <div
        hidden={disabled}
        className="markdown-box"
        style={{ height: boxHeight }}
      >
        <MarkdownRender source={text.current?.value} />
      </div>
    </div>
  );
};

export default Markdown;
