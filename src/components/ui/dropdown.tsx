"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: ReactNode;
  /** Accessible name for the trigger button. */
  label: string;
  align?: "left" | "right";
  triggerClassName?: string;
  panelClassName?: string;
  children: ReactNode | ((close: () => void) => ReactNode);
}

/**
 * Small accessible popover. The panel is `position: fixed` and placed from the trigger's
 * bounding box, so it is never clipped by a scrolling table wrapper. It flips upward near
 * the bottom of the viewport and closes on outside click, Escape, scroll or resize.
 */
export function Dropdown({
  trigger,
  label,
  align = "left",
  triggerClassName,
  panelClassName,
  children,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<CSSProperties | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const btn = btnRef.current?.getBoundingClientRect();
    const panel = panelRef.current?.getBoundingClientRect();
    if (!btn || !panel) return;
    const rawLeft = align === "right" ? btn.right - panel.width : btn.left;
    const left = Math.max(8, Math.min(rawLeft, window.innerWidth - panel.width - 8));
    const below = btn.bottom + 4;
    const above = btn.top - 4 - panel.height;
    const top = below + panel.height > window.innerHeight - 8 && above > 8 ? above : below;
    setPos({ top, left });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        btnRef.current?.focus();
      }
    };
    const onScroll = (e: Event) => {
      if (!panelRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-block text-left">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-card px-3 text-sm font-medium hover:bg-muted",
          triggerClassName,
        )}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={panelRef}
          style={pos ?? { top: 0, left: 0, visibility: "hidden" }}
          className={cn(
            "fixed z-40 min-w-48 max-w-[calc(100vw-1rem)] rounded-md border bg-card p-1 shadow-lg",
            panelClassName,
          )}
        >
          {typeof children === "function" ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}

export function MenuItem({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-10 w-full items-center gap-2 rounded-sm px-3 text-left text-sm hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}
