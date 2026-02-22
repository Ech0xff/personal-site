import { cloneElement, isValidElement, ReactNode } from "react";
import enUSMessages from "./messages/en-US.json";
import zhCNMessages from "./messages/zh-CN.json";
import { routing } from "./routing";

type Primitive = string | number | boolean | null;
interface Dictionary {
  [key: string]: Primitive | Dictionary;
}
type DictionaryValue = Primitive | Dictionary | undefined;
type TValues = Record<string, string | number>;
type TRichValues = Record<
  string,
  string | number | ((chunks: ReactNode) => ReactNode)
>;

type TFunction = ((key: string, values?: TValues) => string) & {
  rich: (key: string, values?: TRichValues) => ReactNode;
};

const messages: Record<string, Dictionary> = {
  "en-US": enUSMessages as Dictionary,
  "zh-CN": zhCNMessages as Dictionary,
};

export const getNormalizedLocale = (locale?: string) => {
  if (!locale) return routing.defaultLocale;
  return routing.locales.includes(locale) ? locale : routing.defaultLocale;
};

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
  values?: TValues,
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

const richTokenRegex = /<([a-zA-Z][\w-]*)>(.*?)<\/\1>/g;

const formatRichMessage = (
  template: string,
  values?: TRichValues,
): ReactNode => {
  if (!values) return template;

  const plainValues: TValues = Object.fromEntries(
    Object.entries(values)
      .filter(([, value]) => typeof value !== "function")
      .map(([key, value]) => [key, value as string | number]),
  );

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = richTokenRegex.exec(template)) !== null) {
    const [full, tag, inner] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(formatMessage(template.slice(lastIndex, start), plainValues));
    }

    const renderer = values[tag];
    const formattedInner = formatMessage(inner, plainValues);

    if (typeof renderer === "function") {
      nodes.push(renderer(formattedInner));
    } else {
      nodes.push(formattedInner);
    }

    lastIndex = start + full.length;
  }

  if (lastIndex < template.length) {
    nodes.push(formatMessage(template.slice(lastIndex), plainValues));
  }

  if (nodes.length === 0) {
    return formatMessage(template, plainValues);
  }

  return nodes.map((node, index) => {
    if (isValidElement(node) && node.key == null) {
      return cloneElement(node, { key: `rich-${index}` });
    }
    return node;
  });
};

export const getT = (
  namespace?: string,
  locale?: string,
): TFunction => {
  const normalizedLocale = getNormalizedLocale(locale);
  const localeDictionary =
    messages[normalizedLocale] || messages[routing.defaultLocale] || {};
  const localeNamespace = namespace
    ? getByPath(localeDictionary, namespace)
    : localeDictionary;
  const dictionary = isDictionary(localeNamespace)
    ? localeNamespace
    : undefined;

  const t = (key: string, values?: TValues) => {
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

  t.rich = (key: string, values?: TRichValues) => {
    if (!dictionary) return namespace ? namespace + "." + key : key;

    const translated = getByPath(dictionary, key);

    if (typeof translated === "string") {
      return formatRichMessage(translated, values);
    }

    if (
      translated === null ||
      typeof translated === "number" ||
      typeof translated === "boolean"
    ) {
      return String(translated);
    }

    return namespace ? namespace + "." + key : key;
  };

  return t;
};

export const getI18n = async (namespace: string, locale?: string) => {
  return getT(namespace, locale);
};
