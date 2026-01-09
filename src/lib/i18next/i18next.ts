import { enCommon } from "@/lib/i18next/locales/en/common";
import { esCommon } from "@/lib/i18next/locales/es/common";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enAccounts } from "./locales/en/accounts";
import { enAnalytics } from "./locales/en/analytics";
import { enCategories } from "./locales/en/categories";
import { enCurrency } from "./locales/en/currency";
import { enTransactions } from "./locales/en/transactions";
import { esAccounts } from "./locales/es/accounts";
import { esCurrency } from "./locales/es/currency";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      common: enCommon,
      accounts: enAccounts,
      currency: enCurrency,
      analytics: enAnalytics,
      transactions: enTransactions,
      categories: enCategories,
    },
    es: {
      common: esCommon,
      accounts: esAccounts,
      currency: esCurrency,
    },
  },
});

export default i18n;
