"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Copy, Trash2 } from "lucide-react";

interface ActionMenuProps {
  postId: string;
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function ActionMenu({
  postId,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action?: () => void) => {
    setIsOpen(false);
    if (action) {
      action();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="More actions"
        aria-expanded={isOpen}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border/60 bg-background shadow-lg animate-in fade-in slide-in-from-top-1 duration-200 md:z-auto"
          >
            <div className="py-1">
              {onView && (
                <button
                  onClick={() => handleAction(onView)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
              )}

              {onEdit && (
                <Link
                  href={`/admin/posts/edit/${postId}`}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
              )}

              {onDuplicate && (
                <button
                  onClick={() => handleAction(onDuplicate)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
              )}

              <div className="my-1 border-t border-border/60" />

              {onDelete && (
                <button
                  onClick={() => handleAction(onDelete)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
