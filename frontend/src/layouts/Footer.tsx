import React, { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

function FooterLayout(props: LayoutProps) {
  return (
    <>
      {props.children}
      <footer>
        <div className="grid-container text-base font-sans-sm">
          <hr className="margin-top-9 border-base-lightest" />
          Having technical issues with the platform?{" "}
          <a
            href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}?subject=Performance Dashboard Assistance`}
            className="text-base"
          >
            Contact support
          </a>
        </div>
      </footer>
    </>
  );
}

export const withFooterLayout = (
  component: React.ComponentType
): React.FunctionComponent<{}> => {
  return function () {
    return <FooterLayout>{React.createElement(component)}</FooterLayout>;
  };
};

export default FooterLayout;
