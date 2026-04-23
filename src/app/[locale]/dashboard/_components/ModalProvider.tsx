"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ModalRenderProps {
  close: () => void;
}

export interface OpenModalOptions {
  onClose?: () => void;
}

interface ModalContextType {
  open: (content: ReactNode, options?: OpenModalOptions) => void;
  close: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextType | null>(null);

type ActiveModal = OpenModalOptions & {
  content: ReactNode;
};

function createModal(content: ReactNode, options?: OpenModalOptions) {
  return {
    ...options,
    content,
  };
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ActiveModal>();

  const open = useCallback((content: ReactNode, options?: OpenModalOptions) => {
    setActiveModal(createModal(content, options));
  }, []);

  const close = useCallback(() => {
    setActiveModal((currentModal) => {
      currentModal?.onClose?.();
      return undefined;
    });
  }, []);

  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal, close]);

  const value = useMemo(
    () => ({
      open,
      close,
      isOpen: activeModal !== undefined,
    }),
    [activeModal, close, open],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {activeModal ? (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-[anchor(top)_anchor(right)_anchor(bottom)_anchor(left)] z-100 bg-zinc-950/40 p-4 backdrop-blur-sm [position-anchor:--dashboard]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex h-full min-h-0 w-full items-center justify-center"
            >
              {activeModal.content}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
