"use client";

import { useEffect, useState } from "react";

const TOAST_EVENT = "app:toast";
const DURATION_MS = 2500;

/** Show a transient toast notification from anywhere on the client. */
export function toast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}

interface ToastItem {
  id: number;
  message: string;
}

let nextId = 0;

/**
 * Minimal toast host. Listens for `toast()` events and renders a small stack of
 * monochrome notifications, bottom-centre, each auto-dismissing. Mount once in
 * the root layout. Decoupled via a window event so any client component can
 * trigger it without prop/context wiring.
 */
export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(event: Event) {
      const message = (event as CustomEvent<string>).detail;
      const id = ++nextId;
      setItems((prev) => [...prev, { id, message }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, DURATION_MS);
    }

    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto border border-ink bg-ink px-4 py-2 text-sm text-paper shadow-sm"
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
