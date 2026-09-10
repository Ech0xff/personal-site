"use client";

import { Check, CircleDashed, Clock, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

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
        locale={config.locale}
        onLocaleChange={config.setLocale}
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
  const {
    value,
    locale,
    setLocale,
    loading,
    hasStoredValue,
    deleteConfig,
    saveConfig,
  } = config;
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
      locale={locale}
      onLocaleChange={setLocale}
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
            <button
              type="button"
              onClick={addPlan}
              className="group flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-zinc-300 bg-zinc-100/40 text-zinc-500 transition hover:border-blue-400 hover:bg-blue-50/70 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-950/30 dark:text-zinc-400 dark:hover:border-blue-500/70 dark:hover:bg-blue-950/20 dark:hover:text-blue-300"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current/30 transition group-hover:scale-105">
                <Plus className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">Create first plan</span>
            </button>
          ) : (
            plans.map(({ id, plan }) => (
              <div
                key={id}
                className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
                    {statusOptions.map(({ value, label, icon: Icon }) => {
                      const active = plan.status === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            updatePlan(id, { ...plan, status: value })
                          }
                          aria-label={label}
                          title={label}
                          className={cn(
                            "rounded-full p-2 text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                            active &&
                              "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>

                  <input
                    value={plan.task}
                    onChange={(event) =>
                      updatePlan(id, {
                        ...plan,
                        task: event.target.value,
                      })
                    }
                    placeholder="What are you planning?"
                    className="min-w-0 flex-1 border-none bg-transparent px-1 py-0.5 text-base font-medium text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                  />

                  <button
                    type="button"
                    onClick={() => removePlan(id)}
                    aria-label="Remove plan"
                    className="rounded-full p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {plans.length > 0 && (
            <button
              type="button"
              onClick={addPlan}
              aria-label="Add plan"
              className="group flex w-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-3 text-zinc-400 transition hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-600 dark:border-zinc-700 dark:hover:border-blue-500/70 dark:hover:bg-blue-950/20 dark:hover:text-blue-300"
            >
              <Plus className="h-5 w-5 transition group-hover:scale-110" />
            </button>
          )}
        </div>
      </div>
    </EditorShell>
  );
}
