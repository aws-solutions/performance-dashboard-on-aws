/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

const defaultColors = [
    "#005ea2",
    "#54278f",
    "#8c471c",
    "#002d3f",
    "#286846",
    "#776017",
    "#ab2165",
    "#3e4ded",
    "#154C21",
    "#8b0a03",
    "#e52207",
    "#ab2165",
    "#00687d",
];

const getColors = (
    numberOfColors: number,
    primaryColor: string,
    secondaryColor: string,
): string[] => {
    const colors = new Array<string>();
    colors.push(primaryColor);
    const secondaryIndex = defaultColors.indexOf(secondaryColor);
    for (let i = secondaryIndex; i < numberOfColors + secondaryIndex; i++) {
        const color = defaultColors[i % defaultColors.length];
        if (color !== primaryColor) {
            colors.push(color);
        }
    }
    return colors;
};

const getSecondaryOptions = (primaryColor?: string): any => {
    return defaultColors
        .filter((d) => d !== primaryColor)
        .map((c) => {
            return { value: c, content: c };
        });
};

function rgbHexColorIsValid(color: string): boolean {
    return /^#(?:[0-9A-F]{3}){1,2}$/i.test(color);
}

const ColorPaletteService = {
    getColors,
    getSecondaryOptions,
    rgbHexColorIsValid,
};

export default ColorPaletteService;
