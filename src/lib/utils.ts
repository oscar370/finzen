import { m } from "#/paraglide/messages";

export const formatCurrency = (
  value: number,
  currencyCode: string,
  locale?: string | string[],
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
};

type MessagesModule = typeof m;

function isTranslationKey(key: string): key is keyof MessagesModule {
  if (!(key in m)) return false;
  return typeof m[key as keyof MessagesModule] === "function";
}

export function translate(key: string) {
  if (isTranslationKey(key)) {
    const translationFn = m[key];

    if (translationFn.length === 0) {
      return (translationFn as () => string)();
    }
  }

  return key;
}

export function formatDateValue(input: Date | undefined) {
  if (!input || Number.isNaN(input.getTime())) return "";

  const year = input.getFullYear();
  const month = String(input.getMonth() + 1).padStart(2, "0");
  const day = String(input.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
