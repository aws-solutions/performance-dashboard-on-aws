/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

function RenderLegendText(value: string, entry: any) {
    return (
        <span className="recharts-legend-item-text">
            <button
                style={{
                    backgroundColor: "transparent",
                    color: entry.color,
                    borderWidth: 0,
                }}
                aria-label={`Hide/unhide data for ${value}`}
            >
                {value}
            </button>
        </span>
    );
}

export default RenderLegendText;
