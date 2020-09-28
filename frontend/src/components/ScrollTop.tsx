import React from "react";
import Button from "./Button";

function ScrollTop() {
  return (
    <Button onClick={() => window.scrollTo(0, 0)} variant="unstyled">
      Return to top
    </Button>
  );
}

export default ScrollTop;
