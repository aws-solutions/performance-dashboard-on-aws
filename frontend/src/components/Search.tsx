import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";

interface Props {
  id: string;
  onSubmit?: Function;
  onClear?: Function;
  query?: string;
  results?: number;
  size: "big" | "small";
}

interface FormValues {
  query: string;
}

function Search(props: Props) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

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

  const style: React.CSSProperties = {};
  if (props.size === "small") {
    style.height = "37px";
  }

  return (
    <>
      <form
        className={`usa-search usa-search--${props.size}`}
        role="search"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="usa-sr-only" htmlFor={props.id}>
          Search
        </label>
        <input
          className="usa-input"
          id={props.id}
          type="search"
          ref={register}
          name="query"
          style={style}
        />
        <button
          className="usa-button usa-button--base"
          type="submit"
          style={style}
        >
          <span
            className={
              props.size === "small" ? "usa-sr-only" : "usa-search__submit-text"
            }
          >
            Search
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
            Clear search items
          </Button>
        </div>
      )}
    </>
  );
}

export default Search;
