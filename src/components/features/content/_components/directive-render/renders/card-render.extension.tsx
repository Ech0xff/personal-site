import { cn } from "#lib/shared/utils";

import { cardAttributesSchema } from "../directive.schema";
import type { RenderProps } from "../directive.type";

function toneClassName(
  tone: ReturnType<typeof cardAttributesSchema.parse>["tone"],
) {
  switch (tone) {
    case "tip":
    case "success":
      return "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/35 dark:text-emerald-100";
    case "warn":
      return "border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-100";
    case "danger":
      return "border-rose-200 bg-rose-50/80 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/35 dark:text-rose-100";
    case "info":
      return "border-sky-200 bg-sky-50/80 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/35 dark:text-sky-100";
    case undefined:
      return "border-zinc-200 bg-zinc-50/80 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100";
  }
}

function render({ attributes, children }: RenderProps) {
  const cardAttributes = cardAttributesSchema.parse(attributes);

  return (
    <section
      className={cn(
        "my-4 rounded-2xl border p-4 shadow-sm",
        toneClassName(cardAttributes.tone),
      )}
    >
      <h1 className="font-semibold">{cardAttributes.title}</h1>
      {children}
    </section>
  );
}

const cardDirectiveConfig = {
  directive: "card",
  directiveType: "containerDirective" as const,
  render,
};

export default cardDirectiveConfig;
