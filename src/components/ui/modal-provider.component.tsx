"use client";

import * as stylex from "@stylexjs/stylex";
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Anchor-bound overlays must remain in the document layer; native dialog top-layer behavior would change the existing boundary contract. */
import { AnimatePresence, motion } from "framer-motion";
import { createContext, type ReactNode, useContext } from "react";

import { MODAL_BOUNDARY } from "#components/ui/modal.const";
import { color, layer } from "#design/tokens.stylex";
const styles = stylex.create({
  overlay: {
    position: "fixed",
    backgroundColor: color.overlay,
    backdropFilter: "blur(8px)",
    outlineStyle: "none",
  },
  anchored: {
    top: "anchor(top)",
    right: "anchor(right)",
    bottom: "anchor(bottom)",
    left: "anchor(left)",
  },
  viewport: {
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  },
  surface: {
    display: "flex",
    height: "100%",
    minHeight: "0px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
import { useModalStack } from "./modal.hook";
import type { ModalContextType } from "./modal.type";
const ModalContext = createContext<ModalContextType | null>(null);
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
export default function ModalProvider({ children }: { children: ReactNode }) {
  const { modals, close, value } = useModalStack();
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
                styles.overlay,
                boundary === MODAL_BOUNDARY.ANCHOR
                  ? styles.anchored
                  : styles.viewport,
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
                {...stylex.props([styles.surface, containerStyles])}
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
