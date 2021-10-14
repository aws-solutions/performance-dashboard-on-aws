type CharWidthMap = { [ch: string]: number };
type FontSizeWidthMap = { [fontSize: string]: CharWidthMap };
type FontWidthMap = { [font: string]: FontSizeWidthMap };

let ruler: HTMLElement | null = null;
function getRuler() {
  if (!ruler) {
    ruler = document.getElementById("ruler");
    if (!ruler) {
      throw new Error("Unable to locate ruler");
    }
  }
  return ruler;
}

const widthCache: FontWidthMap = {};
function getCharWidthMap(font?: string, fontSize?: string) {
  if (!widthCache[font || ""]) {
    widthCache[font || ""] = {};
  }
  if (!widthCache[font || ""][fontSize || ""]) {
    widthCache[font || ""][fontSize || ""] = {};
  }
  return widthCache[font || ""][fontSize || ""];
}

function getVisualWidth(label: any, font?: string, fontSize?: string) {
  let str = label.toString();
  let count = 0;
  const ruler = getRuler();
  const map = getCharWidthMap(font, fontSize);
  for (let i = 0; i < str.length; i++) {
    if (map[str[i]] === undefined) {
      if (!!font && font !== ruler.style.font) {
        ruler.style.font = font;
      }
      if (!!fontSize && fontSize !== ruler.style.fontSize) {
        ruler.style.fontSize = fontSize;
      }
      ruler.innerHTML = str[i];
      map[str[i]] = ruler.clientWidth + 1;
    }
    count += map[str[i]];
  }
  return count;
}

function trimToWidth(
  label: any,
  width: number,
  font?: string,
  fontSize?: string
) {
  let str = label.toString();
  let len = getVisualWidth(label, font, fontSize);
  if (len <= width) {
    return str;
  }

  const map = getCharWidthMap(font, fontSize);
  len += 3 * getVisualWidth(".");

  let end = str.length - 1;
  while (end > 1 && len > width) {
    len -= map[str[end]];
    end--;
  }
  return str.substring(0, end) + "...";
}

const RulerService = {
  getVisualWidth,
  trimToWidth,
};

export default RulerService;
