/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnParameter, Stack } from "aws-cdk-lib";

export function adminEmailParameter(scope: Stack) {
    return new CfnParameter(scope, "adminEmail", {
        type: "String",
        description: "Email address for the admin user",
        minLength: 5,
    });
}

export function authenticationRequiredParameter(scope: Stack) {
    return new CfnParameter(scope, "authenticationRequired", {
        type: "String",
        description: "If public part of the app will ask credentials to users",
        allowedValues: ["yes", "no"],
        default: "no",
    });
}

export function exampleLanguageParameter(scope: Stack) {
    return new CfnParameter(scope, "exampleLanguage", {
        type: "String",
        description: "Language for example dashboards",
        allowedValues: ["english", "spanish", "portuguese"],
        default: "english",
    });
}

export function domainNameParameter(scope: Stack) {
    return new CfnParameter(scope, "domainName", {
        type: "String",
        description:
            "Domain name of the public url (www.example.com). The certificate for the given domain must exists. Value can be empty if no domain required.",
        default: "",
    });
}
