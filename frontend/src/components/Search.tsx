import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "./Button";

interface Props {
  id: string;
  onSubmit?: Function;
  onClear?: Function;
  query?: string;
  results?: number;
  size: "big" | "small";
  lastQuery?: string;
  placeholder?: string;
  label?: string;
  wide?: boolean;
}

interface FormValues {
  query: string;
}

function Search(props: Props) {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [lastQuery, setLastQuery] = useState<string>(props.lastQuery || "");
  const { t } = useTranslation();

  const onSubmit = (values: FormValues) => {
    if (props.onSubmit) {
      props.onSubmit(values.query);
    }
  };

  const onClear = () => {
    if (props.onClear) {
      reset();
      props.onClear();
    }
  };

  const buttonStyle: React.CSSProperties = {};
  const searchBarStyle: React.CSSProperties = {};
  if (props.size === "small") {
    buttonStyle.height = "37px";
    searchBarStyle.height = "37px";
    if (props.wide) {
      searchBarStyle.width = "260px";
    }
  }

  return (
    <>
      <form
        className={`usa-search usa-search--${props.size}`}
        role="search"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="usa-sr-only" htmlFor={props.id}>
          {props.label ? props.label : `${t("SearchButton")}`}
        </label>
        <input
          className="usa-input"
          id={props.id}
          type="search"
          ref={register}
          name="query"
          style={searchBarStyle}
          placeholder={props.placeholder}
          value={lastQuery}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setLastQuery(event.target.value)
          }
        />
        <button
          className="usa-button usa-button--base"
          type="submit"
          style={buttonStyle}
        >
          <span
            className={
              props.size === "small" ? "usa-sr-only" : "usa-search__submit-text"
            }
          >
            {t("SearchButton")}
          </span>
        </button>
      </form>
      {props.onClear && props.query && (
        <div className="text-base text-italic margin-top-3">
          {`${props.results} results for "${props.query}"`}
          <Button
            variant="unstyled"
            type="button"
            className="margin-left-2 text-base-dark hover:text-base-darker active:text-base-darkest"
            onClick={onClear}
          >
            {t("ClearSearchText")}
          </Button>
        </div>
      )}
    </>
  );
}

export default Search;
