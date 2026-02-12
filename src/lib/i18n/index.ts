import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { enAccounts } from "./locales/en/accounts";
import { enAnalytics } from "./locales/en/analytics";
import enArias from "./locales/en/arias.json";
import { enBudgets } from "./locales/en/budgets";
import { enCategories } from "./locales/en/categories";
import { enCommon } from "./locales/en/common";
import { enCurrency } from "./locales/en/currency";
import { enLanding } from "./locales/en/landing";
import { enLanguages } from "./locales/en/languages";
import { enSettings } from "./locales/en/settings";
import { enTransactions } from "./locales/en/transactions";
import { esAccounts } from "./locales/es/accounts";
import { esAnalytics } from "./locales/es/analytics";
import esArias from "./locales/es/arias.json";
import { esBudgets } from "./locales/es/budgets";
import { esCategories } from "./locales/es/categories";
import { esCommon } from "./locales/es/common";
import { esCurrency } from "./locales/es/currency";
import { esLanding } from "./locales/es/landing";
import { esLanguages } from "./locales/es/languages";
import { esSettings } from "./locales/es/settings";
import { esTransactions } from "./locales/es/transactions";

const resources = {
  en: {
    accounts: enAccounts,
    analytics: enAnalytics,
    arias: enArias,
    budgets: enBudgets,
    categories: enCategories,
    common: enCommon,
    currency: enCurrency,
    landing: enLanding,
    languages: enLanguages,
    settings: enSettings,
    transactions: enTransactions,
  },
  es: {
    accounts: esAccounts,
    analytics: esAnalytics,
    arias: esArias,
    budgets: esBudgets,
    categories: esCategories,
    common: esCommon,
    currency: esCurrency,
    landing: esLanding,
    languages: esLanguages,
    settings: esSettings,
    transactions: esTransactions,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    load: "languageOnly",
    supportedLngs: ["en", "es"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      convertDetectedLanguage: (lng) => {
        return lng.includes("-") ? lng.split("-")[0] : lng;
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
