import React from "react";
import { useForm } from "react-hook-form";

interface Props {
  id: string;
  onSubmit?: Function;
  size: "big" | "small";
}

interface FormValues {
  query: string;
}

function Search(props: Props) {
  const { register, handleSubmit } = useForm<FormValues>();

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
    </form>
  );
}

export default Search;
