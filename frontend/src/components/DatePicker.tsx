import React, { useEffect, useState } from "react";
import DatePicker1, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  enUS,
  enGB,
  enAU,
  enCA,
  enIN,
  enNZ,
  enZA,
  es,
  pt,
  ptBR,
} from "date-fns/locale";

interface Props {
  name: string;
  id: string;
  label: string;
  hint?: string | React.ReactNode;
  validate?: Function;
  disabled?: boolean;
  defaultValue?: string;
  error?: string;
  className?: string;
  date: Date | null;
  setDate: Function;
  dateFormat: string;
}

function DatePicker(props: Props) {
  const [localeRegistered, setLocaleRegistered] = useState(false);
  useEffect(() => {
    registerLocale("en-US", enUS);
    registerLocale("en-GB", enGB);
    registerLocale("en-AU", enAU);
    registerLocale("en-CA", enCA);
    registerLocale("en-IN", enIN);
    registerLocale("en-NZ", enNZ);
    registerLocale("en-ZA", enZA);
    registerLocale("es", es);
    registerLocale("es-US", es);
    registerLocale("es-AR", es);
    registerLocale("es-CL", es);
    registerLocale("es-CO", es);
    registerLocale("es-CR", es);
    registerLocale("es-HN", es);
    registerLocale("es-MX", es);
    registerLocale("es-PE", es);
    registerLocale("es-ES", es);
    registerLocale("es-UY", es);
    registerLocale("es-VE", es);
    registerLocale("es-419", es);
    registerLocale("pt", pt);
    registerLocale("pt-PT", pt);
    registerLocale("pt-BR", ptBR);
    setLocaleRegistered(true);
  }, []);

  let formGroupClassName = "usa-form-group";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  const className = `usa-input${props.className ? " " + props.className : ""}`;

  return (
    <div className={formGroupClassName}>
      <label htmlFor={props.id} className="usa-label text-bold">
        {props.label}
      </label>
      <div className="usa-hint">{props.hint}</div>
      {props.error && (
        <span
          className="usa-error-message"
          id="input-error-message"
          role="alert"
        >
          {props.error}
        </span>
      )}

      <div>
        <DatePicker1
          selected={props.date}
          dateFormat={props.dateFormat}
          onChange={(date) => {
            props.setDate(date);
          }}
          className={className}
          locale={localeRegistered ? window.navigator.language : ""}
        />
      </div>
    </div>
  );
}

export default DatePicker;
