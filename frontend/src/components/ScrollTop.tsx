import React from "react";
import Button from "./Button";

function ScrollTop() {
  return (
    <Button
      onClick={() => window.scrollTo(0, 0)}
      variant="unstyled"
      className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-2"
    >
      Return to top
    </Button>
  );
}

export default ScrollTop;
