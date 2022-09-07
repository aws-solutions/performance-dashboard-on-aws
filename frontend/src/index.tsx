import React from "react";
import ReactDOM from "react-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Amplify } from "@aws-amplify/core";
import * as serviceWorker from "./serviceWorker";
import { amplifyConfig } from "./amplify-config";
import App from "./App";
import ReactModal from "react-modal";
import i18n from "./i18n";
import "dayjs/locale/en";
import "dayjs/locale/en-gb";
import "dayjs/locale/en-au";
import "dayjs/locale/en-ca";
import "dayjs/locale/en-in";
import "dayjs/locale/en-nz";
import "dayjs/locale/es";
import "dayjs/locale/es-us";
import "dayjs/locale/pt";
import "dayjs/locale/pt-br";

import "./index.scss";
import "@uswds/uswds";
import { Auth } from "@aws-amplify/auth";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    label?: string;
  }
}

ReactModal.setAppElement("#root"); //this is important for accessibility

dayjs.extend(relativeTime);
Amplify.configure(amplifyConfig());
Auth.configure(amplifyConfig());
i18n();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
