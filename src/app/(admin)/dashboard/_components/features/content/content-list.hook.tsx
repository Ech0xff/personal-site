import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import Loading from "#components/ui/loading.component";
import { useModal } from "#components/ui/modal-provider.component";
import {
  deleteContent,
  setContentStatus,
} from "#lib/server/content/content.actions";
import type {
  ContentKind,
  ContentSummary,
} from "#lib/shared/content/content.schema";

import { contentLabels } from "./content.const";
const ContentEditor = dynamic(() => import("./content-editor.component"), {
  ssr: false,
  loading: () => <Loading />,
});
export function useContentList(kind: ContentKind) {
  const { open, close } = useModal();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const subject = contentLabels[kind].singular;
  const edit = (id?: string) => {
    open(
      <ContentEditor
        kind={kind}
        id={id}
        onClose={() => close()}
        onSaved={() => {
          close();
          router.refresh();
        }}
      />,
    );
  };
  const mutate = (item: ContentSummary, remove: boolean) => {
    if (
      remove &&
      !confirm(
        `Delete this ${subject.toLowerCase()}? Uploaded files will remain in Files.`,
      )
    )
      return;
    startTransition(async () => {
      try {
        const result = remove
          ? await deleteContent({ kind, id: item.id })
          : await setContentStatus({
              kind,
              id: item.id,
              status: item.status === "show" ? "hide" : "show",
            });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(remove ? "Content deleted." : "Visibility updated.");
        router.refresh();
      } catch {
        toast.error("The operation failed. Please try again.");
      }
    });
  };
  return { pending, edit, mutate };
}
