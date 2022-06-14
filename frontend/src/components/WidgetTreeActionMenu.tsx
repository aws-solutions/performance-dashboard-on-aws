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

interface WidgetTreeActionMenuProps {
  widget: Widget;
  onDelete: (widget: Widget) => void;
  onDuplicate: (widget: Widget) => void;
}

function WidgetTreeActionMenu({
  widget,
  onDelete,
  onDuplicate,
}: WidgetTreeActionMenuProps) {
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
          onClick={() => onDuplicate(widget)}
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
          onClick={() => onDelete(widget)}
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
