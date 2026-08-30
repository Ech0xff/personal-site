import { ValueOf } from "es-toolkit/types";

import { Json } from "#types";

import { Locale } from "../i18n-new";
import { CONFIG_KEY, CONFIG_SCOPE } from "./config.const";

export type ConfigKey = ValueOf<typeof CONFIG_KEY>;
export type ConfigScope = ValueOf<typeof CONFIG_SCOPE>;

export type GlobalConfigDefinition<Override, Resolved> = {
  scope: typeof CONFIG_SCOPE.GLOBAL;
  defaults: () => Resolved;
  decode(input: Json): Override;
  resolve(defaults: Resolved, override: Override): Resolved;
};

export type LocaleConfigDefinition<Override, Resolved> = {
  scope: typeof CONFIG_SCOPE.LOCALE;
  defaults(context: { locale: Locale }): Resolved;
  decode(input: Json): Override;
  resolve(defaults: Resolved, override: Override): Resolved;
};

export type ConfigDefinition<Override, Resolved> =
  | GlobalConfigDefinition<Override, Resolved>
  | LocaleConfigDefinition<Override, Resolved>;
