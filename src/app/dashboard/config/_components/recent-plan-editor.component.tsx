"use client";
import { Check, CircleDashed, Clock, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import Button from "#components/ui/button.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import { CONFIG_KEY, type RecentPlan } from "#lib/shared/config";
import { cn } from "#lib/shared/utils";

import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";

const title = "Recent Plans";

const statusOptions: Array<{
  value: RecentPlan["status"];
  label: string;
  icon: typeof Clock;
}> = [
  { value: "waiting", label: "Waiting", icon: Clock },
  { value: "pending", label: "In progress", icon: CircleDashed },
  { value: "completed", label: "Completed", icon: Check },
  { value: "failed", label: "Failed", icon: X },
];

export default function RecentPlanEditor() {
  const config = useConfig({ key: CONFIG_KEY.RECENT_PLAN });
  if (config.loading) {
    return (
      <EditorShell
        className="h-[80%] w-[80%] max-w-5xl"
        title={title}
        loading
      />
    );
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
    value.map((plan, position) => ({ id: `stored-${position}`, plan })),
  );

  const updatePlan = (id: string, nextPlan: RecentPlan) => {
    setPlans((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, plan: nextPlan } : entry,
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
      className="h-[80%] w-[80%] max-w-5xl"
      title={title}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={handleSave}
      loading={loading}
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-4",
          loading && "opacity-0",
        )}
      >
        <div className="min-h-0 flex-1 space-y-3 overflow-auto pr-1">
          {plans.length === 0 ? (
            <Button
              variant="ghost"
              onClick={addPlan}
              className="group flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border-strong bg-surface-muted/40 text-text-muted transition-colors hover:border-info-border hover:bg-info-bg/70 hover:text-info-text"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current/30 transition-transform group-hover:scale-105">
                <Plus className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">Create first plan</span>
            </Button>
          ) : (
            plans.map(({ id, plan }) => (
              <div
                key={id}
                className="rounded-2xl border border-border-default bg-surface-panel/80 p-3 shadow-sm transition-colors hover:border-border-strong"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-surface-muted p-1">
                    {statusOptions.map(({ value, label, icon: Icon }) => {
                      const active = plan.status === value;
                      return (
                        <Button
                          variant="ghost"
                          key={value}
                          onClick={() =>
                            updatePlan(id, { ...plan, status: value })
                          }
                          aria-label={label}
                          title={label}
                          className={cn(
                            "h-8 w-8 rounded-full border-0 p-2 text-text-muted transition-colors hover:text-text-primary",
                            active &&
                              "bg-surface-selected text-text-primary shadow-sm",
                          )}
                        >
                          <Icon className="h-4 w-4" />
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
                    className="flex-1 border-none bg-transparent px-1 py-0.5 text-base font-medium"
                  />
                  <IconButton
                    onClick={() => removePlan(id)}
                    aria-label="Remove plan"
                    className="rounded-full text-text-muted hover:bg-danger-bg hover:text-danger-text"
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))
          )}
          {plans.length > 0 && (
            <IconButton
              onClick={addPlan}
              aria-label="Add plan"
              className="group flex w-full items-center justify-center rounded-2xl border border-dashed border-border-strong py-3 text-text-muted transition-colors hover:border-info-border hover:bg-info-bg/60 hover:text-info-text"
            >
              <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
            </IconButton>
          )}
        </div>
      </div>
    </EditorShell>
  );
}
