type CharWidthMap = { [ch: string]: number };
type FontSizeWidthMap = { [fontSize: string]: CharWidthMap };
type FontWidthMap = { [font: string]: FontSizeWidthMap };

let ruler: HTMLElement | null = null;
function getRuler() {
  if (!ruler) {
    ruler = document.createElement("div");
    ruler.id = "ruler";
    document.body.appendChild(ruler);
    ruler.style.position = "absolute";
    ruler.style.visibility = "hidden";
    ruler.style.width = "auto";
    ruler.style.height = "auto";
    ruler.style.whiteSpace = "nowrap";
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
      if (font !== ruler.style.font) {
        ruler.style.font = font || "";
      }
      if (fontSize !== ruler.style.fontSize) {
        ruler.style.fontSize = fontSize || "";
      }
      ruler.innerText = str[i];
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
