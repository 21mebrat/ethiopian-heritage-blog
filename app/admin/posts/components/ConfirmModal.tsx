"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-4 rounded-xl border border-border/60 bg-background shadow-xl">
          {/* Header */}
          <div className="flex items-start gap-3 p-6">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                variant === "danger"
                  ? "bg-destructive/10"
                  : "bg-yellow-500/10"
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${
                  variant === "danger"
                    ? "text-destructive"
                    : "text-yellow-600 dark:text-yellow-400"
                }`}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-border/60 p-4">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                variant === "danger"
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
