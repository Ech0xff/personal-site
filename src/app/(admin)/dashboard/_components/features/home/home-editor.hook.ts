import { isEqual } from "es-toolkit";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateDeskConfiguration } from "#lib/server/desk/desk-configuration.actions";
import {
  deskConfigurationSchema,
  type DeskConfiguration,
  type DeskItem,
} from "#lib/shared/desk/desk-configuration.schema";

import { useDashboardNavigation } from "../../layout/dashboard-navigation.component";

export function useHomepageEditor(initial: DeskConfiguration) {
  const [snapshot, setSnapshot] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Readonly<Record<string, string>>>({});
  const [unauthorized, setUnauthorized] = useState(false);
  const [audioBusy, setAudioBusy] = useState(false);
  const [pending, startTransition] = useTransition();
  const [revision, setRevision] = useState(0);
  const { registerGuard } = useDashboardNavigation();
  const acceptedNavigation = useRef(false);
  const dirty = !isEqual(draft, snapshot);
  const busy = pending || audioBusy;

  useEffect(
    () =>
      registerGuard(() => {
        if (busy) return false;
        const allowed =
          !dirty || window.confirm("Discard unsaved homepage changes?");
        acceptedNavigation.current = allowed;
        return allowed;
      }),
    [busy, dirty, registerGuard],
  );
  useEffect(() => {
    if (!dirty && !busy) return;
    const prevent = (event: BeforeUnloadEvent) => {
      if (acceptedNavigation.current) {
        acceptedNavigation.current = false;
        return;
      }
      event.preventDefault();
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [busy, dirty]);

  const update = (item: DeskItem) => {
    if (pending) return;
    acceptedNavigation.current = false;
    setDraft((previous) => ({
      items: previous.items.map((current) =>
        current.id === item.id ? item : current,
      ),
    }));
    setError("");
    setUnauthorized(false);
    setErrors({});
  };
  const discard = () => {
    if (busy || !dirty || !window.confirm("Discard unsaved homepage changes?"))
      return;
    setDraft(snapshot);
    setError("");
    setErrors({});
    setUnauthorized(false);
    setRevision((previous) => previous + 1);
  };
  const save = () => {
    if (busy || !dirty) return;
    const parsed = deskConfigurationSchema.safeParse(draft);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            issue.path.join("."),
            issue.message,
          ]),
        ),
      );
      setError("Check the highlighted fields before saving.");
      return;
    }
    setError("");
    setErrors({});
    setUnauthorized(false);
    startTransition(async () => {
      try {
        const result = await updateDeskConfiguration(parsed.data);
        if (!result.ok) {
          setError(result.error);
          setUnauthorized(Boolean(result.unauthorized));
          return;
        }
        setSnapshot(result.data);
        setDraft(result.data);
        toast.success("Homepage saved.");
      } catch {
        setError(
          "Could not save. Your changes are still here; please try again.",
        );
      }
    });
  };
  return {
    draft,
    dirty,
    busy,
    pending,
    audioBusy,
    setAudioBusy,
    revision,
    error,
    errors,
    unauthorized,
    update,
    discard,
    save,
  };
}
