// src/components/ui/modal.tsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
  ariaLabel?: string;
}

const sizeClass = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-3xl",
  full: "w-full h-full",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
  footer,
  ariaLabel,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previously focused element
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Prevent background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus modal container
    setTimeout(() => modalRef.current?.focus(), 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "Tab") {
        // focus trap
        const el = modalRef.current;
        if (!el) return;
        const focusable = Array.from(
          el.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((f) => !f.hasAttribute("disabled"));
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey, true);

    return () => {
      document.removeEventListener("keydown", handleKey, true);
      document.body.style.overflow = prevOverflow;
      // restore focus
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label={
        typeof ariaLabel === "string"
          ? ariaLabel
          : typeof title === "string"
          ? title
          : "Modal dialog"
      }
      onMouseDown={(e) => {
        // overlay click to close
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative z-10 mx-4 ${sizeClass[size]} w-full transform transition-transform duration-150`}
        // stop overlay clicks (we handled overlay above)
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden focus:outline-none">
          <div className="flex items-start justify-between p-4 border-b">
            <div className="text-lg font-semibold">{title}</div>
            <button
              aria-label="Close modal"
              onClick={onClose}
              className="rounded-md p-1 hover:bg-gray-100 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">{children}</div>

          {footer && <div className="p-4 border-t bg-gray-50">{footer}</div>}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
