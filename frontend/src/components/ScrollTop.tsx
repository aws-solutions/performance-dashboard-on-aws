import React from "react";
import Button from "./Button";
import { useTranslation } from "react-i18next";

function ScrollTop() {
  const { t } = useTranslation();
  return (
    <Button
      onClick={() => window.scrollTo(0, 0)}
      variant="unstyled"
      className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-2"
      type="button"
    >
      {t("ReturnToTop")}
    </Button>
  );
}

export default ScrollTop;
