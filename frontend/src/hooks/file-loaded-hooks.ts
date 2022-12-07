/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect } from "react";
import { PublicSettings, Settings } from "../models";

export function useFileLoaded(
    setToHide: React.Dispatch<React.SetStateAction<boolean>>,
    loadingFile: boolean,
    loadingSettings: boolean,
    settings: PublicSettings | Settings,
    logoOrFav: "logo" | "favicon",
) {
    // firstFileUpdate stops useEffect from executing after the first render
    // secondFileUpdate stops useEffect from executing when resource starts loading
    const firstFileUpdate = useRef(true);
    const secondFileUpdate = useRef(true);
    useEffect(() => {
        if (secondFileUpdate.current) {
            if (firstFileUpdate.current) {
                firstFileUpdate.current = false;
                return;
            }
            secondFileUpdate.current = false;
            return;
        }
        setToHide(false);
    }, [loadingFile, setToHide]);

    // firstSettingsUpdate stops useEffect from executing after the first render
    // secondSettingsFileUpdate stops useEffect from executing when resource starts loading
    const firstSettingsUpdate = useRef(true);
    const secondSettingsUpdate = useRef(true);
    useEffect(() => {
        if (secondSettingsUpdate.current) {
            if (firstSettingsUpdate.current) {
                firstSettingsUpdate.current = false;
                return;
            }
            secondSettingsUpdate.current = false;
            return;
        }

        if (logoOrFav === "logo" && settings.customLogoS3Key === undefined) {
            setToHide(false);
        }

        if (logoOrFav === "favicon" && settings.customFaviconS3Key === undefined) {
            setToHide(false);
        }
    }, [loadingSettings, logoOrFav, setToHide, settings]);
}
