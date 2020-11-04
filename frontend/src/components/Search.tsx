import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";

interface Props {
  id: string;
  onSubmit?: Function;
  addClear?: boolean;
  size: "big" | "small";
}

interface FormValues {
  query: string;
}

function Search(props: Props) {
  const { register, handleSubmit, watch, reset } = useForm<FormValues>();
  const watchInput = watch(`${props.id}`);
  console.log(watchInput);
  const onSubmit = (values: FormValues) => {
    if (props.onSubmit) {
      props.onSubmit(values.query);
    }
  };

  const style: React.CSSProperties = {};
  if (props.size === "small") {
    style.height = "37px";
  }

  return (
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
      <button className="usa-button" type="submit" style={style}>
        <span
          className={
            props.size === "small" ? "usa-sr-only" : "usa-search__submit-text"
          }
        >
          Search
        </span>
      </button>
      {props.addClear && watchInput && (
        <div className="text-base text-italic margin-bottom-3">
          {`${0} results for "${watchInput}"`}
          <Button
            variant="unstyled"
            type="button"
            className="margin-left-2"
            onClick={reset}
          >
            Clear search items
          </Button>
        </div>
      )}
    </form>
  );
}

export default Search;
