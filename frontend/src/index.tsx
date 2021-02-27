import React from "react";
import ReactDOM from "react-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Amplify from "@aws-amplify/core";
import * as serviceWorker from "./serviceWorker";
import { amplifyConfig } from "./amplify-config";
import App from "./App";
import ReactModal from "react-modal";
import i18n from "./i18n";

import "uswds/dist/css/uswds.min.css";
import "uswds/dist/js/uswds.min.js";
import "./index.css";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    label?: string;
  }
}

ReactModal.setAppElement("#root"); //this is important for accessibility

dayjs.extend(relativeTime);
Amplify.configure(amplifyConfig());
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
