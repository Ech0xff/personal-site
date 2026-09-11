import { cn } from "#lib/shared/utils";

import { cardAttributesSchema } from "../directive.schema";
import type { RenderProps } from "../directive.type";

function toneClassName(
  tone: ReturnType<typeof cardAttributesSchema.parse>["tone"],
) {
  switch (tone) {
    case "tip":
    case "success":
      return "border-success-border bg-success-bg/80 text-success-text   ";
    case "warn":
      return "border-warning-border bg-warning-bg/80 text-warning-text   ";
    case "danger":
      return "border-danger-border bg-danger-bg/80 text-danger-text   ";
    case "info":
      return "border-info-border bg-info-bg/80 text-info-text   ";
    case undefined:
      return "border-border-default bg-surface-muted/80 text-text-primary   ";
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
