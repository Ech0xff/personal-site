"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface ModalRenderProps {
  close: () => void;
}

type ModalId = string;

export interface Options {
  positionAnchor: CSSProperties["positionAnchor"];
}

interface ModalEntry {
  id: ModalId;
  content: ReactNode;
  options: Options;
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
    positionAnchor: "--body",
  });
  const previousPathname = useRef(pathname);

  const [modals, setModals] = useState<ModalEntry[]>([]);

  const open = useCallback((content: ReactNode, options?: Partial<Options>) => {
    const id = crypto.randomUUID();

    setModals((currentModals) => [
      ...currentModals,
      {
        id,
        content,
        options: { ...defaultOptionsRef.current, ...options },
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

  useEffect(() => {
    if (modals.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, modals.length]);

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

          return (
            <motion.div
              key={modal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{
                pointerEvents: isTop ? "auto" : "none",
                positionAnchor: modal.options.positionAnchor,
                zIndex: 100 + index * 2,
              }}
              aria-hidden={!isTop}
              className="fixed inset-[anchor(top)_anchor(right)_anchor(bottom)_anchor(left)] bg-zinc-950/40 backdrop-blur-sm"
            >
              <motion.div
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    if (isTop) close();
                    return;
                  }
                  event.stopPropagation();
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex h-full min-h-0 w-full items-center justify-center"
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
