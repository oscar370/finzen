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
import { enSettings } from "./locales/en/settings";
import { enTransactions } from "./locales/en/transactions";
import esArias from "./locales/es/arias.json";

const resources = {
  en: {
    arias: enArias,
    common: enCommon,
    accounts: enAccounts,
    currency: enCurrency,
    analytics: enAnalytics,
    transactions: enTransactions,
    categories: enCategories,
    settings: enSettings,
    budgets: enBudgets,
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
    supportedLngs: ["en", "es"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
