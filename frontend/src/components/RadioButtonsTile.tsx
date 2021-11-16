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
      <div className="usa-radio" key={index}>
        <div className="grid-col flex-5">
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
            <p className="usa-prose usa-checkbox__label-description">
              {option.description}
            </p>
          </label>
        </div>
      </div>
    );
  };

  return (
    <>
      {props.options.map((option: Option, index: number) => {
        const usaRatio = getUsaRatio(option, index);

        return props.isHorizontally ? (
          <div className="grid-col-4 padding-right-2 padding-top-2" key={index}>
            {usaRatio}
          </div>
        ) : (
          usaRatio
        );
      })}
    </>
  );
}

export default RadioButtonsTile;
