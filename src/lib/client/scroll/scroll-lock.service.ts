type ScrollContainer = { style: { overflow: string } };
const locks = new WeakMap<
  ScrollContainer,
  { count: number; overflow: string }
>();

/** Restore scrolling only after every overlapping overlay has released its lock. */
export function lockScrolling(element: ScrollContainer): () => void {
  const state = locks.get(element) ?? {
    count: 0,
    overflow: element.style.overflow,
  };
  state.count++;
  locks.set(element, state);
  element.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count--;
    if (state.count === 0) {
      element.style.overflow = state.overflow;
      locks.delete(element);
    }
  };
}
