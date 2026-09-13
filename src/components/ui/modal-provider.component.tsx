"use client";

import * as stylex from "@stylexjs/stylex";
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Anchor-bound overlays must remain in the document layer; native dialog top-layer behavior would change the existing boundary contract. */
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MODAL_ANCHOR, MODAL_BOUNDARY } from "#components/ui/modal.const";
import type { StyleInput } from "#design/style.type";
import { color, layer } from "#design/tokens.stylex";
const styles = stylex.create({
  container: {
    position: "fixed",
    backgroundColor: color.overlay,
    backdropFilter: "blur(8px)",
    outlineStyle: "none",
  },
  container2: {
    top: "anchor(top)",
    right: "anchor(right)",
    bottom: "anchor(bottom)",
    left: "anchor(left)",
  },
  container3: {
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  },
  container4: {
    display: "flex",
    height: "100%",
    minHeight: "0px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
export interface ModalRenderProps {
  close: () => void;
}
type ModalId = string;
export interface Options {
  boundary: (typeof MODAL_BOUNDARY)[keyof typeof MODAL_BOUNDARY];
  positionAnchor: CSSProperties["positionAnchor"];
  containerStyles?: StyleInput;
}
interface ModalEntry {
  id: ModalId;
  content: ReactNode;
  options: Options;
  returnFocus: Element | null;
}
interface ModalContextType {
  open: (content: ReactNode, options?: Partial<Options>) => ModalId;
  close: (id?: ModalId) => void;
  closeAll: () => void;
  setDefaultOptions: (options: Options) => void;
  isOpen: boolean;
}
const ModalContext = createContext<ModalContextType | null>(null);
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
export default function ModalProvider({ children }: { children: ReactNode }) {
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
  return (
    <ModalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {modals.map((modal, index) => {
          const isTop = index === modals.length - 1;
          const { boundary, positionAnchor, containerStyles } = modal.options;
          return (
            <motion.div
              key={modal.id}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.18,
                ease: "easeOut",
              }}
              style={{
                pointerEvents: isTop ? "auto" : "none",
                positionAnchor:
                  boundary === MODAL_BOUNDARY.ANCHOR
                    ? positionAnchor
                    : undefined,
                zIndex: `calc(${layer.modal} + ${index * 2})`,
              }}
              data-modal-layer={modal.id}
              role="dialog"
              aria-modal={isTop}
              aria-label="Dialog"
              tabIndex={-1}
              aria-hidden={!isTop}
              {...stylex.props([
                styles.container,
                boundary === MODAL_BOUNDARY.ANCHOR
                  ? styles.container2
                  : styles.container3,
              ])}
            >
              <motion.div
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    if (isTop) close();
                    return;
                  }
                  event.stopPropagation();
                }}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                {...stylex.props([styles.container4, containerStyles])}
              >
                {modal.content}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
