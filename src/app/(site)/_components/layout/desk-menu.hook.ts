import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

const queryString = "(max-width: 600px)";

export function useDeskMenu(pathname: string) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState(false);
  const focusFirst = useRef(false);
  const openedByHover = useRef(false);
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelClose = () => clearTimeout(timer.current);
  const close = () => {
    cancelClose();
    openedByHover.current = false;
    setOpen(false);
  };

  useEffect(() => {
    setOpen(false);
    clearTimeout(timer.current);
  }, [pathname]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const query = matchMedia(queryString);
    const update = () => {
      setPhone(query.matches);
      if (!query.matches) setOpen(false);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!open || !focusFirst.current) return;
    focusFirst.current = false;
    const frame = requestAnimationFrame(() =>
      root.current?.querySelector<HTMLAnchorElement>("nav a")?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const enter = (event: PointerEvent<HTMLDivElement>) => {
    cancelClose();
    if (
      event.pointerType === "mouse" &&
      matchMedia(`${queryString} and (hover: hover)`).matches
    ) {
      openedByHover.current = !open;
      setOpen(true);
    }
  };
  const leave = () => {
    cancelClose();
    if (!root.current?.contains(document.activeElement))
      timer.current = setTimeout(() => setOpen(false), 160);
  };
  const blur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  };
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    if (open) root.current?.querySelector<HTMLAnchorElement>("nav a")?.focus();
    else {
      focusFirst.current = true;
      setOpen(true);
    }
  };
  return {
    open,
    hidden: phone && !open,
    root,
    trigger,
    enter,
    leave,
    blur,
    keyDown,
    close,
    cancelClose,
    toggle: (event: MouseEvent<HTMLButtonElement>) => {
      cancelClose();
      // The first mouse click follows pointer-enter; keep that newly opened menu visible.
      if (event.detail > 0 && openedByHover.current) setOpen(true);
      else setOpen((value) => !value);
      openedByHover.current = false;
    },
  };
}
