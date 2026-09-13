"use client";

import * as stylex from "@stylexjs/stylex";
import { Check, CircleDashed, Clock, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import Button from "#components/ui/button.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import { group } from "#design/interaction.stylex";
import {
  color,
  font,
  space,
  shape,
  shadow,
  motionToken,
} from "#design/tokens.stylex";
import { CONFIG_KEY, type RecentPlan } from "#lib/shared/config";

import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";
const styles = stylex.create({
  container3: {
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    overflow: "auto",
    paddingRight: space.xxs,
  },
  icon: {
    height: "80%",
    width: "80%",
    maxWidth: "1024px",
  },
  container: {
    display: "flex",
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "column",
    gap: space.md,
  },
  container2: {
    opacity: 0,
  },
  button: {
    display: "flex",
    minHeight: "144px",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    borderTopLeftRadius: shape.large,
    borderTopRightRadius: shape.large,
    borderBottomRightRadius: shape.large,
    borderBottomLeftRadius: shape.large,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "dashed",
    borderRightStyle: "dashed",
    borderBottomStyle: "dashed",
    borderLeftStyle: "dashed",
    borderTopColor: {
      default: color.borderStrong,
      ":hover": color.infoBorder,
    },
    borderRightColor: {
      default: color.borderStrong,
      ":hover": color.infoBorder,
    },
    borderBottomColor: {
      default: color.borderStrong,
      ":hover": color.infoBorder,
    },
    borderLeftColor: {
      default: color.borderStrong,
      ":hover": color.infoBorder,
    },
    backgroundColor: {
      default: `color-mix(in srgb, ${color.surfaceMuted} 40%, transparent)`,
      ":hover": `color-mix(in srgb, ${color.infoSurface} 70%, transparent)`,
    },
    color: {
      default: color.muted,
      ":hover": color.infoText,
    },
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  label: {
    display: "flex",
    height: "40px",
    width: "40px",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: `color-mix(in srgb, currentColor 30%, transparent)`,
    borderRightColor: `color-mix(in srgb, currentColor 30%, transparent)`,
    borderBottomColor: `color-mix(in srgb, currentColor 30%, transparent)`,
    borderLeftColor: `color-mix(in srgb, currentColor 30%, transparent)`,
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    scale: {
      default: null,
      [stylex.when.ancestor(":hover", group)]: 1.05,
    },
  },
  plus: {
    height: "20px",
    width: "20px",
  },
  label2: {
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
  },
  container4: {
    borderTopLeftRadius: shape.panel,
    borderTopRightRadius: shape.panel,
    borderBottomRightRadius: shape.panel,
    borderBottomLeftRadius: shape.panel,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: {
      default: color.line,
      ":hover": color.borderStrong,
    },
    borderRightColor: {
      default: color.line,
      ":hover": color.borderStrong,
    },
    borderBottomColor: {
      default: color.line,
      ":hover": color.borderStrong,
    },
    borderLeftColor: {
      default: color.line,
      ":hover": color.borderStrong,
    },
    backgroundColor: `color-mix(in srgb, ${color.surface} 80%, transparent)`,
    paddingTop: space.sm,
    paddingRight: space.sm,
    paddingBottom: space.sm,
    paddingLeft: space.sm,
    boxShadow: shadow.subtle,
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  container5: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
  },
  container6: {
    display: "flex",
    alignItems: "center",
    gap: space.xxs,
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    backgroundColor: color.surfaceMuted,
    paddingTop: space.xxs,
    paddingRight: space.xxs,
    paddingBottom: space.xxs,
    paddingLeft: space.xxs,
  },
  button2: {
    height: space.xl,
    width: space.xl,
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    paddingTop: space.xs,
    paddingRight: space.xs,
    paddingBottom: space.xs,
    paddingLeft: space.xs,
    color: {
      default: color.muted,
      ":hover": color.text,
    },
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  button3: {
    backgroundColor: color.surfaceSelected,
    color: color.text,
    boxShadow: shadow.subtle,
  },
  icon2: {
    height: space.md,
    width: space.md,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderBottomStyle: "none",
    borderLeftStyle: "none",
    backgroundColor: "transparent",
    paddingLeft: space.xxs,
    paddingRight: space.xxs,
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: font.bodySize,
    lineHeight: 1.5,
    fontWeight: font.medium,
  },
  icon3: {
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    color: {
      default: color.muted,
      ":hover": color.dangerText,
    },
    backgroundColor: {
      default: null,
      ":hover": color.dangerSurface,
    },
  },
  icon4: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: shape.panel,
    borderTopRightRadius: shape.panel,
    borderBottomRightRadius: shape.panel,
    borderBottomLeftRadius: shape.panel,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "dashed",
    borderRightStyle: "dashed",
    borderBottomStyle: "dashed",
    borderLeftStyle: "dashed",
    borderTopColor: {
      default: color.borderStrong,
      ":hover": color.infoBorder,
    },
    borderRightColor: {
      default: color.borderStrong,
      ":hover": color.infoBorder,
    },
    borderBottomColor: {
      default: color.borderStrong,
      ":hover": color.infoBorder,
    },
    borderLeftColor: {
      default: color.borderStrong,
      ":hover": color.infoBorder,
    },
    paddingTop: space.sm,
    paddingBottom: space.sm,
    color: {
      default: color.muted,
      ":hover": color.infoText,
    },
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    backgroundColor: {
      default: null,
      ":hover": `color-mix(in srgb, ${color.infoSurface} 60%, transparent)`,
    },
  },
  plus2: {
    height: "20px",
    width: "20px",
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    scale: {
      default: null,
      [stylex.when.ancestor(":hover", group)]: 1.1,
    },
  },
});
const title = "Recent Plans";
const statusOptions: Array<{
  value: RecentPlan["status"];
  label: string;
  icon: typeof Clock;
}> = [
  {
    value: "waiting",
    label: "Waiting",
    icon: Clock,
  },
  {
    value: "pending",
    label: "In progress",
    icon: CircleDashed,
  },
  {
    value: "completed",
    label: "Completed",
    icon: Check,
  },
  {
    value: "failed",
    label: "Failed",
    icon: X,
  },
];
export default function RecentPlanEditor() {
  const config = useConfig({
    key: CONFIG_KEY.RECENT_PLAN,
  });
  if (config.loading) {
    return <EditorShell xstyle={styles.icon} title={title} loading />;
  }
  return <RecentPlanForm config={config} />;
}
function RecentPlanForm({
  config,
}: {
  config: ReturnType<typeof useConfig<typeof CONFIG_KEY.RECENT_PLAN>>;
}) {
  const { value, loading, hasStoredValue, deleteConfig, saveConfig } = config;
  const [plans, setPlans] = useState(() =>
    value.map((plan, position) => ({
      id: `stored-${position}`,
      plan,
    })),
  );
  const updatePlan = (id: string, nextPlan: RecentPlan) => {
    setPlans((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              plan: nextPlan,
            }
          : entry,
      ),
    );
  };
  const addPlan = () => {
    const id = crypto.randomUUID();
    setPlans((current) => [
      ...current,
      {
        id,
        plan: {
          task: "",
          status: "waiting",
          createdAt: new Date().toString(),
        },
      },
    ]);
  };
  const removePlan = (id: string) => {
    setPlans((current) => current.filter((entry) => entry.id !== id));
  };
  const handleSave = () => {
    return saveConfig(plans.map(({ plan }) => plan));
  };
  return (
    <EditorShell
      xstyle={styles.icon}
      title={title}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={handleSave}
      loading={loading}
    >
      <div {...stylex.props([styles.container, loading && styles.container2])}>
        <div {...stylex.props(styles.container3)}>
          {plans.length === 0 ? (
            <Button
              variant="ghost"
              onClick={addPlan}
              xstyle={[styles.button, group]}
            >
              <span {...stylex.props(styles.label)}>
                <Plus {...stylex.props(styles.plus)} />
              </span>
              <span {...stylex.props(styles.label2)}>Create first plan</span>
            </Button>
          ) : (
            plans.map(({ id, plan }) => (
              <div key={id} {...stylex.props(styles.container4)}>
                <div {...stylex.props(styles.container5)}>
                  <div {...stylex.props(styles.container6)}>
                    {statusOptions.map(({ value, label, icon: Icon }) => {
                      const active = plan.status === value;
                      return (
                        <Button
                          variant="ghost"
                          key={value}
                          onClick={() =>
                            updatePlan(id, {
                              ...plan,
                              status: value,
                            })
                          }
                          aria-label={label}
                          title={label}
                          xstyle={[styles.button2, active && styles.button3]}
                        >
                          <Icon {...stylex.props(styles.icon2)} />
                        </Button>
                      );
                    })}
                  </div>
                  <Input
                    value={plan.task}
                    onChange={(event) =>
                      updatePlan(id, {
                        ...plan,
                        task: event.target.value,
                      })
                    }
                    placeholder="What are you planning?"
                    xstyle={styles.input}
                  />
                  <IconButton
                    onClick={() => removePlan(id)}
                    aria-label="Remove plan"
                    xstyle={styles.icon3}
                  >
                    <Trash2 {...stylex.props(styles.icon2)} />
                  </IconButton>
                </div>
              </div>
            ))
          )}
          {plans.length > 0 && (
            <IconButton
              onClick={addPlan}
              aria-label="Add plan"
              xstyle={[styles.icon4, group]}
            >
              <Plus {...stylex.props(styles.plus2)} />
            </IconButton>
          )}
        </div>
      </div>
    </EditorShell>
  );
}
