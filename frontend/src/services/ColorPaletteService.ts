const defaultColors = [
  "#2491ff",
  "#54278f",
  "#c05600",
  "#002d3f",
  "#00a398",
  "#c2850c",
  "#fd4496",
  "#3e4ded",
  "#008817",
  "#5c1111",
  "#e52207",
  "#ab2165",
  "#0f6460",
];

const getColors = (
  numberOfColors: number,
  primaryColor: string,
  secondaryColor: string
): Array<string> => {
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

const getSecondaryOptions = (primaryColor?: string) => {
  return defaultColors
    .filter((d) => d !== primaryColor)
    .map((c) => {
      return { value: c, content: c };
    });
};

function rgbHexColorIsValid(color: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color);
}

const ColorPaletteService = {
  getColors,
  getSecondaryOptions,
  rgbHexColorIsValid,
};

export default ColorPaletteService;
