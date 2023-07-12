/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from "react";
import StorageService from "../services/StorageService";
import { useTranslation } from "react-i18next";

export type UseLogoHook = {
    loadingFile: boolean;
    logo: File | undefined;
    logoFileName: string | undefined;
};

export function useLogo(s3Key?: string): UseLogoHook {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [logo, setFile] = useState<File>();
    const [logoFileName, setFileName] = useState<string>();

    const fetchData = useCallback(async () => {
        if (s3Key) {
            try {
                setLoading(true);
                const data = await StorageService.downloadLogo(s3Key, t);
                setFile(data);
                setLoading(false);
                setFileName(data.name);
            } catch (err) {
                console.log("Can't retrieve logo from S3", err);
                setLoading(false);
            }
        }
    }, [s3Key, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        loadingFile: loading,
        logo,
        logoFileName,
    };
}
