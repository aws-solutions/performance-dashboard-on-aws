import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";

export function useFullPreview() {
  const [fullPreview, setFullPreview] = useState(false);

  const fullPreviewToggle = () => {
    setFullPreview(!fullPreview);
  };

  const fullPreviewButton = fullPreview ? (
    <Button onClick={fullPreviewToggle} variant="outline" type="button">
      <FontAwesomeIcon icon={faMinusSquare} className={"margin-right-1"} />
      Close preview
    </Button>
  ) : (
    <Button onClick={fullPreviewToggle} variant="outline" type="button">
      <FontAwesomeIcon icon={faPlusSquare} className={"margin-right-1"} />
      Expand preview
    </Button>
  );

  return { fullPreviewToggle, fullPreviewButton, fullPreview };
}
