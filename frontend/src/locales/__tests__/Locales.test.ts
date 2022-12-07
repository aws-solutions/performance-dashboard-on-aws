/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import en from "../en/translation.json";
import es from "../es/translation.json";
import pt from "../pt/translation.json";

const itif = (condition: boolean) => (condition ? it : it.skip);
const itIsRelease = itif(!!process.env.RELEASE);

function toDictionary(o: any, path = ""): { [key: string]: any } {
    if (!o || typeof o !== "object") {
        const result: { [key: string]: any } = {};
        result[path] = o;
        return result;
    }

    const aggregate: { [key: string]: any } = {};
    for (const key in o) {
        const sub = toDictionary(o[key], path ? [path, key].join(".") : key);
        Object.assign(aggregate, sub);
    }
    return aggregate;
}

function extractVariables(dict: { [key: string]: any }): {
    [key: string]: string[];
} {
    const varRegex = /{{(.+?)}}/gm;
    const vars: { [key: string]: string[] } = {};

    for (const key in dict) {
        const value = dict[key];
        const matches = [...value.matchAll(varRegex)];
        if (matches.length) {
            const names = matches.map((m) => m[1]);
            names.sort();
            vars[key] = names;
        }
    }
    return vars;
}

describe("Locales", () => {
    const enDict = toDictionary(en);
    const enVars = extractVariables(enDict);

    itIsRelease.each([es, pt])("language should have the same keys", (translation) => {
        expect(Object.keys(toDictionary(translation))).toEqual(Object.keys(enDict));
    });

    itIsRelease.each([es, pt])("language should use same variables", (translation) => {
        expect(extractVariables(toDictionary(translation))).toEqual(enVars);
    });

    it.each([en, es, pt])("entry value should be defined", (translation) => {
        const dict = toDictionary(translation);
        const invalidValues = Object.keys(dict).filter(
            (key) => dict[key] === null || dict[key] === undefined || dict[key] === "",
        );
        expect(invalidValues).toEqual([]);
    });

    it.each([en, es, pt])("entry value should be of type string", (translation) => {
        const dict = toDictionary(translation);
        const nonStringValues = Object.keys(dict).filter((key) => typeof dict[key] !== "string");
        expect(nonStringValues).toEqual([]);
    });
});
