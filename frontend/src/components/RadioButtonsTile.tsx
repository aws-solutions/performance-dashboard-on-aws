import React from "react";
import styles from "./RadioButtonsTile.module.scss";

interface Option {
  id: string;
  label: string;
  description: string;
  value: string;
  name: string;
  dataTestId: string;
  disabled?: boolean;
}

interface Props {
  options: Array<Option>;
  register: Function;
  isHorizontally: boolean;
}

function RadioButtonsTile(props: Props) {
  const getUsaRatio = (option: Option, index: number) => {
    return (
      <div className="usa-radio" role="radio" key={index}>
        <div className="tablet:grid-col">
          <input
            className={`usa-radio__input usa-radio__input--tile ${styles.radio}`}
            id={option.id}
            value={option.value}
            type="radio"
            name={option.name}
            data-testid={option.dataTestId}
            ref={props.register()}
            aria-describedby={`${option.id}-description`}
            disabled={option.disabled}
          />
          <label className="usa-radio__label" htmlFor={option.id}>
            {option.label}
            <span
              className="text-base usa-prose usa-checkbox__label-description"
              id={`${option.id}-description`}
            >
              {option.description}
            </span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div
      role="radiogroup"
      className={`padding-2px ${props.isHorizontally ? "grid-row" : ""}`}
    >
      {props.options.map((option: Option, index: number) => {
        const usaRatio = getUsaRatio(option, index);

        return props.isHorizontally ? (
          <div className="tablet:grid-col-4 padding-1" key={index}>
            {usaRatio}
          </div>
        ) : (
          usaRatio
        );
      })}
    </div>
  );
}

export default RadioButtonsTile;
