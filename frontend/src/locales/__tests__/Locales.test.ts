import en from "../en/translation.json";
import es from "../en/translation.json";
import pt from "../en/translation.json";

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

describe("Locales", () => {
  const enDict = toDictionary(en);

  itIsRelease.each([es, pt])(
    "language should have the same keys",
    (translation) => {
      expect(Object.keys(toDictionary(translation))).toEqual(
        Object.keys(enDict)
      );
    }
  );

  it.each([en, es, pt])("entry should not be empty", (translation) => {
    const dict = toDictionary(translation);
    const emptyValues = Object.keys(dict).filter((key) => !dict[key]);
    expect(emptyValues).toEqual([]);
  });

  it.each([en, es, pt])("entry should not be empty", (translation) => {
    const dict = toDictionary(translation);
    const nonStringValues = Object.keys(dict).filter(
      (key) => typeof dict[key] !== "string"
    );
    expect(nonStringValues).toEqual([]);
  });
});
