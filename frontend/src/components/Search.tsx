import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import styles from "./Search.module.scss";

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

  let searchBarClasses = ["usa-input"];
  let buttonClasses = ["usa-button", "usa-button--base"];
  if (props.size === "small") {
    buttonClasses.push(styles.small);
    searchBarClasses.push(styles.small);
    if (props.wide) {
      searchBarClasses.push(styles.wide);
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
          {props.label || t("SearchButton")}
        </label>
        <input
          className={searchBarClasses.join(" ")}
          id={props.id}
          type="search"
          ref={register}
          name="query"
          placeholder={props.placeholder}
          value={lastQuery}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setLastQuery(event.target.value)
          }
        />
        <button className={buttonClasses.join(" ")} type="submit">
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
        <div className="text-base-dark text-italic margin-top-3">
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
