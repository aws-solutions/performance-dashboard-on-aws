import React from "react";
import Link from "../components/Link";
import Footer from "../layouts/Footer";

function FourZeroFour() {
  return (
    <>
      <div className="text-center">
        <p className="font-sans-3xl text-heavy margin-top-9 margin-bottom-1">
          404 / Page not found
        </p>
        <hr className="width-tablet border-base-light" />
        <p className="font-sans-md">
          You may want to double-check your link and try again, or return to the{" "}
          <Link to="/">homepage</Link>.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default FourZeroFour;
