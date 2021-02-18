import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import english from "./locales/en/translation.json";
import spanish from "./locales/es/translation.json";

export default function init(defaultLanguage?: string) {
  i18n
    .use(initReactI18next)
    // For all configuration options read:
    // https://www.i18next.com/overview/configuration-options
    .init({
      lng: defaultLanguage || window.navigator.language,
      fallbackLng: "en",
      debug: false,
      resources: {
        en: { translation: english },
        es: { translation: spanish },
      },
    });
}
