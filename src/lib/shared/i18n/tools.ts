import { routing } from "./routing";

type Primitive = string | number | boolean | null;
interface Dictionary {
  [key: string]: Primitive | Dictionary;
}
type DictionaryValue = Primitive | Dictionary | undefined;

const messageEntries = await Promise.all(
  routing.locales.map(async (locale) => {
    try {
      const localeMessages = await import(`./messages/${locale}.json`);
      return [locale, localeMessages.default as Dictionary] as const;
    } catch {
      return [locale, {} as Dictionary] as const;
    }
  }),
);

const messages: Record<string, Dictionary> = Object.fromEntries(messageEntries);

const getByPath = (
  dictionary: Dictionary,
  keyPath: string,
): DictionaryValue => {
  if (!keyPath) return undefined;

  return keyPath
    .split(".")
    .reduce<DictionaryValue | undefined>((accumulator, segment) => {
      if (
        !accumulator ||
        typeof accumulator !== "object" ||
        Array.isArray(accumulator)
      )
        return undefined;
      return accumulator[segment];
    }, dictionary);
};

const formatMessage = (
  template: string,
  values?: Record<string, string | number>,
): string => {
  if (!values) return template;

  return template.replace(/\{(.*?)\}/g, (_, key: string) => {
    const value = values[key.trim()];
    return value === undefined ? `{${key}}` : String(value);
  });
};

const isDictionary = (value: DictionaryValue): value is Dictionary => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

export const getT = (
  namespace?: string,
  locale: string = routing.defaultLocale,
) => {
  const localeDictionary = messages[locale];
  const localeNamespace = namespace
    ? getByPath(localeDictionary, namespace)
    : localeDictionary;
  const dictionary = isDictionary(localeNamespace)
    ? localeNamespace
    : undefined;

  return (key: string, values?: Record<string, string | number>) => {
    if (!dictionary) return namespace ? namespace + "." + key : key;

    const translated = getByPath(dictionary, key);

    if (typeof translated === "string")
      return formatMessage(translated, values);

    if (
      translated === null ||
      typeof translated === "number" ||
      typeof translated === "boolean"
    )
      return String(translated);

    return namespace ? namespace + "." + key : key;
  };
};
