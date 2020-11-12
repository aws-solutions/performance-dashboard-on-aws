import React from "react";
import ReactTooltip, {
  Place,
  Type,
  Effect,
  Offset,
  GetContent,
} from "react-tooltip";
import "./Tooltip.css";

interface Props {
  id: string;
  uuid?: string;
  place?: Place;
  type?: Type;
  effect?: Effect;
  offset?: Offset;
  getContent?: GetContent;
}

function Tooltip(props: Props) {
  return (
    <ReactTooltip
      id={props.id}
      uuid={props.uuid}
      place={props.place}
      type={props.type}
      effect={props.effect}
      offset={props.offset}
      getContent={props.getContent}
      clickable
      globalEventOff="click"
      className="padding-x-2 cursor-default"
    />
  );
}

export default Tooltip;
