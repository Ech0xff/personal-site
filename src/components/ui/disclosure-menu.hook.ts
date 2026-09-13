import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

export function useDisclosureMenu(
  pathname: string,
  queryString = "(max-width: 600px)",
) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState(false);
  const focusFirst = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelClose = () => clearTimeout(timer.current);
  const close = () => {
    cancelClose();
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
  }, [queryString]);
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
    )
      setOpen(true);
  };
  const leave = () => {
    cancelClose();
    if (!root.current?.contains(document.activeElement))
      timer.current = setTimeout(() => setOpen(false), 160);
  };
  const blur = (event: FocusEvent<HTMLDivElement>) => {
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
    toggle: () => {
      cancelClose();
      setOpen((value) => !value);
    },
  };
}
