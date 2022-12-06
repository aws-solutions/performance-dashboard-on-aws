/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import ReactTooltip, { Place, Type, Effect, Offset, GetContent } from "react-tooltip";

interface Props {
    id: string;
    uuid?: string;
    place?: Place;
    type?: Type;
    effect?: Effect;
    offset?: Offset;
    getContent?: GetContent;
    clickable?: boolean;
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
            clickable={props.clickable}
            globalEventOff="click"
            className="padding-x-2-important cursor-default shadow-3"
            borderColor="#dfe1e2"
            role="tooltip"
        />
    );
}

export default Tooltip;
