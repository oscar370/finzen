import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enArias from "./locales/en/arias.json";
import esArias from "./locales/es/arias.json";

const resources = {
  en: {
    arias: enArias,
  },
  es: {
    arias: esArias,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
