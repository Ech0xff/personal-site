import {
  CalendarDays,
  ExternalLink,
  File,
  FileText,
  MessageCircleMore,
} from "lucide-react";

import { cn } from "#lib/shared/utils";

import { refAttributesSchema } from "../directive.schema";
import type { RenderProps } from "../directive.type";

type RefType = ReturnType<typeof refAttributesSchema.parse>["type"];

const resolveRefHref = (type: RefType, id: string) => {
  switch (type) {
    case "post":
      return `/posts/${id}`;
    case "thought":
      return `/thoughts#${id}`;
    case "event":
      return `/events#${id}`;
    case "external":
      return id;
    case "file":
      return id;
  }
};

function RefIcon({ type }: { type: RefType }) {
  switch (type) {
    case "post":
      return <FileText className="inline-block h-3.5 w-3.5 align-[-0.125em]" />;
    case "thought":
      return (
        <MessageCircleMore className="inline-block h-3.5 w-3.5 align-[-0.125em]" />
      );
    case "event":
      return (
        <CalendarDays className="inline-block h-3.5 w-3.5 align-[-0.125em]" />
      );
    case "external":
      return (
        <ExternalLink className="inline-block h-3.5 w-3.5 align-[-0.125em]" />
      );
    case "file":
      return <File className="inline-block h-3.5 w-3.5 align-[-0.125em]" />;
  }
}

function render({ attributes, children }: RenderProps) {
  const { id, title, type } = refAttributesSchema.parse(attributes);
  const href = resolveRefHref(type, id);
  return (
    <a
      className={cn(
        "inline rounded-md align-baseline font-medium whitespace-nowrap no-underline transition-colors",
        "text-sky-700 decoration-sky-500/60 underline-offset-4 hover:text-sky-800 hover:underline",
        "focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:outline-none",
        "dark:text-sky-300 dark:decoration-sky-300/60 dark:hover:text-sky-200",
      )}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <span className="mr-1 inline-block">
        <RefIcon type={type} />
      </span>
      {title ? <span>{title}</span> : children}
    </a>
  );
}

const refDirectiveConfig = {
  directive: "ref",
  directiveType: "textDirective" as const,
  render,
};

export default refDirectiveConfig;
