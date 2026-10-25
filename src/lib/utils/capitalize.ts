export function capitalize(
  text: string,
  locale?: Intl.LocalesArgument
): string {
  if (!text) return text;

  const first = String.fromCodePoint(text.codePointAt(0)!);

  return first.toLocaleUpperCase(locale) + text.slice(first.length);
}
