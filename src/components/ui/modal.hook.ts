import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { MODAL_ANCHOR, MODAL_BOUNDARY } from "./modal.const";
import type { Options, ModalId, ModalEntry } from "./modal.type";
export function useModalStack() {
  const pathname = usePathname();
  const defaultOptionsRef = useRef<Options>({
    boundary: MODAL_BOUNDARY.VIEWPORT,
    positionAnchor: MODAL_ANCHOR.BODY,
  });
  const previousPathname = useRef(pathname);
  const [modals, setModals] = useState<ModalEntry[]>([]);
  const open = useCallback((content: ReactNode, options?: Partial<Options>) => {
    const resolvedOptions = {
      ...defaultOptionsRef.current,
      ...options,
    };
    if (resolvedOptions.boundary === MODAL_BOUNDARY.VIEWPORT) {
      document
        .querySelectorAll<HTMLElement>(":popover-open")
        .forEach((popover) => popover.hidePopover());
    }
    const id = crypto.randomUUID();
    const returnFocus = document.activeElement;
    setModals((currentModals) => [
      ...currentModals,
      {
        id,
        content,
        options: resolvedOptions,
        returnFocus,
      },
    ]);
    return id;
  }, []);
  const close = useCallback((id?: ModalId) => {
    setModals((currentModals) => {
      if (id) {
        return currentModals.filter((modal) => modal.id !== id);
      }
      return currentModals.slice(0, -1);
    });
  }, []);
  const closeAll = useCallback(() => {
    setModals([]);
  }, []);
  const setDefaultOptions = useCallback((options: Options) => {
    defaultOptionsRef.current = options;
  }, []);
  const activeModal = modals.at(-1);
  useEffect(() => {
    if (!activeModal) return;
    const layer = document.querySelector<HTMLElement>(
      `[data-modal-layer="${activeModal.id}"]`,
    );
    if (!layer) return;
    const focusableSelector =
      'button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]';
    const controls = () =>
      Array.from(layer.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) =>
          element.tabIndex >= 0 &&
          !element.closest("[inert]") &&
          !element.matches(":disabled") &&
          element.getClientRects().length > 0,
      );
    if (!layer.contains(document.activeElement))
      (controls()[0] ?? layer).focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || document.querySelector("dialog:modal"))
        return;
      if (event.key === "Escape") {
        event.preventDefault();
        close(activeModal.id);
        return;
      }
      if (event.key !== "Tab") return;
      const elements = controls();
      const first = elements[0] ?? layer;
      const last = elements[elements.length - 1] ?? layer;
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !layer.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !layer.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (
        activeModal.returnFocus instanceof HTMLElement &&
        activeModal.returnFocus.isConnected
      )
        activeModal.returnFocus.focus();
    };
  }, [close, activeModal]);
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    closeAll();
  }, [closeAll, pathname]);
  const value = useMemo(
    () => ({
      open,
      close,
      closeAll,
      setDefaultOptions,
      isOpen: modals.length > 0,
    }),
    [close, closeAll, modals.length, open, setDefaultOptions],
  );
  return { modals, close, value };
}
