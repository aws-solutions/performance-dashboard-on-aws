import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/Main";

function FourZeroFour() {
  return (
    <MainLayout>
      <div className="text-center">
        <p className="font-sans-3xl text-heavy margin-top-9 margin-bottom-1">
          404 / Page not found
        </p>
        <hr className="width-tablet border-base-light" />
        <p className="font-sans-md">
          You may want to double-check your link and try again, or return to the{" "}
          <Link to="/">homepage</Link>.
        </p>
        <hr className="margin-top-9 border-base-lightest" />
      </div>
      <div className="text-base font-sans-sm">
        Having technical issues with the platform?{" "}
        <Link to="/">Contact support</Link>.
      </div>
    </MainLayout>
  );
}

export default FourZeroFour;
