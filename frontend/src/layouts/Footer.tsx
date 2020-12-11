import React, { ReactNode } from "react";
import EnvConfig from "../services/EnvConfig";

interface LayoutProps {
  children?: ReactNode;
}

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
      </div>
    </footer>
  );
}

export default Footer;
