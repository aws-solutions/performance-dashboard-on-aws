/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from "react";
import StorageService from "../services/StorageService";
import { useTranslation } from "react-i18next";

type UseImageHook = {
    loadingFile: boolean;
    file: File | undefined;
};

export function useImage(s3Key: string): UseImageHook {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File>();

    const fetchData = useCallback(async () => {
        if (s3Key) {
            setLoading(true);
            const data = await StorageService.downloadFile(s3Key, t);
            setFile(data);
            setLoading(false);
        }
    }, [s3Key, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        loadingFile: loading,
        file,
    };
}
