import React from "react";
import EnvConfig from "../services/EnvConfig";
import packagejson from "../../package.json";

function Footer() {
  return (
    <footer>
      <div className="grid-container margin-bottom-9 text-base font-sans-sm">
        <hr className="margin-top-9 border-base-lightest" />
        Having technical issues with the system?{" "}
        <a
          href={`mailto:${EnvConfig.contactEmail}?subject=Performance Dashboard Assistance`}
          className="text-base"
        >
          Contact support
        </a>
        <span className="float-right">v{packagejson.version}</span>
      </div>
    </footer>
  );
}

export default Footer;
