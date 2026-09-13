import type { CSSProperties, ReactNode } from "react";

import type { StyleInput } from "#design/style.type";

import type { MODAL_BOUNDARY } from "./modal.const";
export type ModalId = string;
export interface Options {
  boundary: (typeof MODAL_BOUNDARY)[keyof typeof MODAL_BOUNDARY];
  positionAnchor: CSSProperties["positionAnchor"];
  containerStyles?: StyleInput;
}
export interface ModalEntry {
  id: ModalId;
  content: ReactNode;
  options: Options;
  returnFocus: Element | null;
}
export interface ModalContextType {
  open: (content: ReactNode, options?: Partial<Options>) => ModalId;
  close: (id?: ModalId) => void;
  closeAll: () => void;
  setDefaultOptions: (options: Options) => void;
  isOpen: boolean;
}
