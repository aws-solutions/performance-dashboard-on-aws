/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Homepage, HomepageItem } from "../models/homepage";
import { ItemNotFound } from "../errors";

function getDefaultHomepage(): Homepage {
    return {
        title: "Performance Dashboard",
        description:
            "The Performance Dashboard makes data open " +
            "and accessible to provide transparency and helps drive the " +
            "ongoing improvement of digital services.",
        updatedAt: new Date(),
    };
}

function fromItem(item: HomepageItem): Homepage {
    if (!item) {
        throw new ItemNotFound();
    }
    return {
        title: item.title,
        description: item.description,
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    };
}

export default {
    getDefaultHomepage,
    fromItem,
};
