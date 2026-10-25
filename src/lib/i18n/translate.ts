import { m } from "@/paraglide/messages";

type Messages = typeof m;

function normalizeKey(key: string): string {
  if (key.startsWith("categories.")) {
    return `category_${key.slice("categories.".length)}`;
  }

  return key;
}

function isMessageKey(key: string): key is keyof Messages {
  return key in m && typeof m[key as keyof Messages] === "function";
}

export function translate(key: string): string {
  const normalized = normalizeKey(key);

  if (!isMessageKey(normalized)) return key;

  const message = m[normalized];
  if (message.length > 0) return key;

  return (message as () => string)();
}
