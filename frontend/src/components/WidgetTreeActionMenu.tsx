import React from "react";
import { Widget } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faEllipsisV,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import DropdownMenu from "./DropdownMenu";
import { MenuItem } from "@reach/menu-button";
import Button from "./Button";

function WidgetTreeActionMenu(widget: Widget) {
  const { t } = useTranslation();
  return (
    <DropdownMenu
      buttonText=""
      icon={faEllipsisV}
      variant="unstyled"
      ariaLabel={t("ActionsContent", {
        name: widget.name,
      })}
    >
      <MenuItem>
        <Button
          variant="unstyled"
          ariaLabel={t("DuplicateContent", {
            name: widget.name,
          })}
        >
          <FontAwesomeIcon size="xs" icon={faCopy} className="margin-right-1" />
          {t("Duplicate")}
        </Button>
      </MenuItem>
      <MenuItem>
        <Button
          variant="unstyled"
          className="usa-link"
          ariaLabel={t("DeleteContent", {
            name: widget.name,
          })}
        >
          <FontAwesomeIcon
            size="xs"
            icon={faTrash}
            className="margin-right-1"
          />
          {t("Delete")}
        </Button>
      </MenuItem>
    </DropdownMenu>
  );
}

export default WidgetTreeActionMenu;
