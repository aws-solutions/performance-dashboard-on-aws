import React from "react";

interface Option {
  id: string;
  label: string;
  description: string;
  value: string;
  name: string;
  dataTestId: string;
}

interface Props {
  options: Array<Option>;
  register: Function;
  isHorizontally: boolean;
}

function RadioButtonsTile(props: Props) {
  const getUsaRatio = (option: Option, index: number) => {
    return (
      <div className="usa-radio" role="contentinfo" key={index}>
        <div className="tablet:grid-col">
          <input
            className="usa-radio__input usa-radio__input--tile"
            id={option.id}
            value={option.value}
            type="radio"
            name={option.name}
            data-testid={option.dataTestId}
            ref={props.register()}
          />
          <label className="usa-radio__label" htmlFor={option.id}>
            {option.label}
            <p className="text-base usa-prose usa-checkbox__label-description">
              {option.description}
            </p>
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
