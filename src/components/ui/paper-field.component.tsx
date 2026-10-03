import * as stylex from "@stylexjs/stylex";
import { useId, type HTMLInputTypeAttribute, type ReactNode } from "react";

import { paperFieldStyles as styles } from "./paper-field.style";

type Props = Readonly<{
  label: string;
  icon?: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  multiline?: boolean;
  type?: HTMLInputTypeAttribute;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  disabled?: boolean;
  title?: string;
  error?: string;
}>;

export function PaperField({
  label,
  icon,
  value,
  onValueChange,
  multiline = false,
  error,
  ...props
}: Props) {
  const id = useId();
  const hasIcon = Boolean(icon);
  const shared = {
    id,
    value,
    placeholder: " ",
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };
  return (
    <div {...stylex.props(styles.field)}>
      <label htmlFor={id} {...stylex.props(styles.label)}>
        {multiline ? (
          <textarea
            {...shared}
            disabled={props.disabled}
            maxLength={props.maxLength}
            rows={5}
            onChange={(event) => onValueChange(event.target.value)}
            {...stylex.props(styles.control, styles.multiline)}
          />
        ) : (
          <input
            {...props}
            {...shared}
            onChange={(event) => onValueChange(event.target.value)}
            {...stylex.props(styles.control, styles.single)}
          />
        )}
        <span
          {...stylex.props(
            styles.caption,
            hasIcon && styles.captionWithIcon,
            props.type === "number" && styles.raised,
          )}
        >
          {hasIcon && (
            <span aria-hidden="true" {...stylex.props(styles.captionIcon)}>
              {icon}
            </span>
          )}
          {label}
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" {...stylex.props(styles.error)}>
          {error}
        </p>
      )}
    </div>
  );
}
