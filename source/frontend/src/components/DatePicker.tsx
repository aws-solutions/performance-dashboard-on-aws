import React, { useEffect, useState } from "react";
import DatePicker1, { registerLocale } from "react-datepicker";
import { format, isMatch, isBefore, isAfter, isEqual, add } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import TextField from "../components/TextField";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.scss";
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

export interface Props {
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
  minDate?: Date | null;
  maxDate?: Date | null;
  setDate: Function;
  dateFormat: string;
}

function DatePicker(props: Props) {
  const [errors, setErrors] = useState<string>();
  const [focused, setFocused] = useState<boolean>(false);
  const { t } = useTranslation();
  const [localeRegistered, setLocaleRegistered] = useState(false);
  const timeOffset = new Date().getTimezoneOffset() + 60;
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

  let formGroupClassName = "usa-form-group grid-row";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  const className = `usa-input${props.className ? " " + props.className : ""}`;

  const checkDate = (date: Date) => {
    setErrors("");

    if (props.maxDate) {
      if (!isBefore(date, props.maxDate) && !isEqual(date, props.maxDate)) {
        setErrors(
          t("DatePicker.DateBefore", {
            date: format(props.maxDate, props.dateFormat),
          })
        );
        return false;
      }
    }
    if (props.minDate) {
      if (!isAfter(date, props.minDate) && !isEqual(date, props.minDate)) {
        setErrors(
          t("DatePicker.DateAfter", {
            date: format(props.minDate, props.dateFormat),
          })
        );
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (props.date) {
      checkDate(props.date);
    }
  }, [props.date, props.minDate, props.maxDate]);

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputDate = (event.target as HTMLInputElement).value;

    setErrors("");

    if (!isMatch(inputDate, props.dateFormat)) {
      setErrors(t("DatePicker.IncorrectDateFormat"));
      return false;
    }

    const formattedDate = add(new Date(inputDate), { minutes: timeOffset });

    if (!checkDate(formattedDate)) {
      return false;
    }

    props.setDate(formattedDate);
    return true;
  };

  const handleFocus = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFocused(true);
  };

  const handleBlur = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFocused(false);
  };

  return (
    <div className={formGroupClassName} role="contentinfo">
      <div className="tablet:grid-col-6">
        <TextField
          className={"usa-input " + className}
          id={props.id}
          name={props.name}
          label={props.label}
          hint={props.hint}
          defaultValue={props.date ? format(props.date, props.dateFormat) : ""}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          error={focused ? "" : errors}
        />
      </div>
      <div className="tablet:grid-col-2 margin-top-8 margin-left-1">
        <DatePicker1
          id={props.id}
          selected={props.date}
          dateFormat={props.dateFormat}
          onChange={(date) => {
            props.setDate(date);
          }}
          className={className}
          locale={localeRegistered ? window.navigator.language : ""}
          minDate={props.minDate}
          maxDate={props.maxDate}
          customInput={
            <span style={{ border: "none" }}>
              <FontAwesomeIcon icon={faCalendar} size="2x" />
            </span>
          }
          tabIndex={0}
        />
      </div>
    </div>
  );
}

export default DatePicker;
