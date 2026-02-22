"use client";

import { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";

type Props = {
  heading: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function ModalWrapper({ heading, children, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none"; // prevents mobile overscroll

    if (document.activeElement instanceof HTMLElement) {
      previouslyFocusedElementRef.current = document.activeElement;
    }

    const focusableSelectors =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
        ).filter(
          (el) =>
            !el.hasAttribute("disabled") &&
            el.getAttribute("aria-hidden") !== "true",
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Move focus into the dialog when it opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else if (dialogRef.current) {
      dialogRef.current.focus();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;

      document.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]"
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        className="mx-4 w-full max-w-350 rounded-xl border border-zinc-300 bg-white p-4 shadow-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
        tabIndex={-1}
      >
        {/* Header Content Area :) */}
        <div className="mb-4 flex items-center justify-between">
          <h3
            id="modal-heading"
            className="font-kanit text-2xl font-medium text-[var(--secondary)]"
          >
            {heading}
          </h3>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 transition duration-200 hover:bg-zinc-75 hover:text-zinc-500"
            aria-label="Close dialog"
          >
            <IconX aria-hidden="true" focusable="false" size={18} />
          </button>
        </div>

        {/* Main Content Area :) */}
        <div>{children}</div>
      </div>
    </div>
  );
}
