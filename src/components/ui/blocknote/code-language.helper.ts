import * as stylex from "@stylexjs/stylex";

import { codeLanguages } from "#lib/shared/content/code-highlight.service";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { codeStyles as styles } from "./code-block.style";

/** A searchable combobox outside the clipped code surface, without changing document content while typing. */
export function createCodeLanguageInput(
  language: string,
  change: (language: string) => void,
) {
  const current = codeLanguages.find(
    (entry) => entry.id === language || entry.aliases.includes(language),
  );
  const choices = current
    ? codeLanguages
    : [{ id: language, name: language, aliases: [] }, ...codeLanguages];
  const input = document.createElement("input");
  input.type = "text";
  input.value = current?.name ?? language;
  input.placeholder = copy.searchLanguage;
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-label", copy.language);
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  input.className =
    stylex.props(styles.language, styles.languageInput).className ?? "";
  const list = document.createElement("div");
  list.id = `code-languages-${crypto.randomUUID()}`;
  list.popover = "manual";
  list.setAttribute("role", "listbox");
  list.setAttribute("aria-label", copy.language);
  list.contentEditable = "false";
  list.className = stylex.props(styles.suggestions).className ?? "";
  input.setAttribute("aria-controls", list.id);
  let matches = choices;
  let index = 0;
  let open = false;
  const position = () => {
    if (!open) return;
    const rect = input.getBoundingClientRect();
    const availableBelow = window.innerHeight - rect.bottom - 12;
    const above = availableBelow < 180 && rect.top > availableBelow;
    list.style.left = `${Math.min(rect.left, window.innerWidth - 252)}px`;
    list.style.top = above ? "auto" : `${rect.bottom + 6}px`;
    list.style.bottom = above
      ? `${window.innerHeight - rect.top + 6}px`
      : "auto";
    list.style.maxHeight = `${Math.min(280, above ? rect.top - 18 : availableBelow)}px`;
  };
  const close = () => {
    open = false;
    if (list.matches(":popover-open")) list.hidePopover();
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    input.value = current?.name ?? language;
  };
  const select = (id: string) => {
    close();
    change(id);
  };
  const highlight = () => {
    const options = [...list.querySelectorAll<HTMLElement>("[role=option]")];
    options.forEach((option, i) => {
      option.setAttribute("aria-selected", String(i === index));
      option.className =
        stylex.props(styles.option, i === index && styles.optionSelected)
          .className ?? "";
    });
    const active = options.at(index);
    if (active) {
      input.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  };
  const search = (query: string) => {
    const needle = query.trim().toLowerCase();
    const rank = (entry: (typeof choices)[number]) => {
      const terms = [entry.id, entry.name.toLowerCase(), ...entry.aliases];
      return terms.some((term) => term === needle)
        ? 0
        : terms.some((term) => term.startsWith(needle))
          ? 1
          : 2;
    };
    matches = choices
      .filter((entry) =>
        [entry.id, entry.name, ...entry.aliases].some((term) =>
          term.toLowerCase().includes(needle),
        ),
      )
      .sort((a, b) => rank(a) - rank(b))
      .slice(0, 50);
    index = 0;
    list.replaceChildren();
    for (const entry of matches) {
      const option = document.createElement("div");
      option.setAttribute("role", "option");
      option.id = `${list.id}-${entry.id}`;
      option.textContent = entry.name;
      option.addEventListener("pointerdown", (event) => event.preventDefault());
      option.addEventListener("click", () => select(entry.id));
      list.append(option);
    }
    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = stylex.props(styles.empty).className ?? "";
      empty.textContent = copy.noLanguages;
      list.append(empty);
    }
    highlight();
    position();
  };
  const show = () => {
    if (open) return;
    document.body.append(list);
    list.showPopover();
    open = true;
    input.setAttribute("aria-expanded", "true");
  };
  input.addEventListener("focus", () => {
    show();
    input.select();
    search("");
  });
  input.addEventListener("input", () => {
    show();
    search(input.value);
  });
  input.addEventListener("blur", close);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (matches[index] && open) select(matches[index].id);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      if (!open) {
        show();
        search("");
        return;
      }
      if (!matches.length) return;
      index =
        (index + (event.key === "ArrowDown" ? 1 : -1) + matches.length) %
        matches.length;
      highlight();
    }
  });
  window.addEventListener("resize", position);
  window.addEventListener("scroll", position, true);
  return {
    input,
    destroy: () => {
      list.remove();
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    },
  };
}
const copy = defaultDictionary.editor.code;
