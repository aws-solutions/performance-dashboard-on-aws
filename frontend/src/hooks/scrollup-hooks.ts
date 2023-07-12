/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";

export function useScrollUp(
    oldStep: number,
    step: number,
    setOldStep: React.Dispatch<React.SetStateAction<number>>,
): any {
    useEffect(() => {
        if (oldStep !== step) {
            window.scrollTo(0, 0);
            setOldStep(step);
        }
    }, [oldStep, setOldStep, step]);
}
