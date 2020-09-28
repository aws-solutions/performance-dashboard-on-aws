import React from "react";
import { useForm } from "react-hook-form";

interface Props {
  id: string;
  onSubmit?: Function;
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

  return (
    <form
      className="usa-search usa-search--small"
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
        style={{ height: "37px" }}
      />
      <button className="usa-button" type="submit" style={{ height: "37px" }}>
        <span className="usa-sr-only">Search</span>
      </button>
    </form>
  );
}

export default Search;
