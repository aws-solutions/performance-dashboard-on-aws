/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18n } from "@aws-amplify/core";
import { Translations } from "@aws-amplify/ui-components";

import english from "./locales/en/translation.json";
import spanish from "./locales/es/translation.json";
import portuguese from "./locales/pt/translation.json";

export default function init(defaultLanguage?: string) {
    i18n.use(initReactI18next)
        // For all configuration options read:
        // https://www.i18next.com/overview/configuration-options
        .init({
            lng: defaultLanguage || window.navigator.language,
            fallbackLng: "en",
            debug: false,
            resources: {
                en: { translation: english },
                es: { translation: spanish },
                pt: { translation: portuguese },
            },
        });

    // Error messages returned by AWS Cognito.
    const cognitoDict = {
        INVALID_USERNAME_PASSWORD:
            "2 validation errors detected: Value at 'userAlias' failed to satisfy constraint: Member must satisfy regular expression pattern: [\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+; Value at 'userName' failed to satisfy constraint: Member must satisfy regular expression pattern: [\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+",
        PASSWORD_REQUIREMENTS:
            "1 validation error detected: Value at 'password' failed to satisfy constraint: Member must satisfy regular expression pattern: ^[\\S]+.*[\\S]+$",
    };
    const dict: any = {};
    ["en", "es", "pt"].forEach((locale) => {
        let jsonFile = require(`./amplify-locales/${locale}/translation.json`);
        let translations: any = {
            [cognitoDict.INVALID_USERNAME_PASSWORD]: [jsonFile.INVALID_USERNAME_PASSWORD],
            [cognitoDict.PASSWORD_REQUIREMENTS]: [jsonFile.PASSWORD_REQUIREMENTS],
        };
        Object.entries(jsonFile).forEach(([key, value]) => {
            key = Translations[key as keyof typeof Translations];
            if (key) {
                translations[key] = value;
            }
        });
        dict[locale] = translations;
    });

    I18n.putVocabularies(dict);
    I18n.setLanguage(defaultLanguage || window.navigator.language);
}
