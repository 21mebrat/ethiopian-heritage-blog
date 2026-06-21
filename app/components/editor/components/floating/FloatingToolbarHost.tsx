"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import type { Editor } from "@tiptap/react";
import { getSelectedMedia, getMediaDomRect } from "../../lib/media-selection";
import { setupDismissMediaSelection } from "../../lib/dismiss-media-selection";
import FloatingMediaToolbar from "./FloatingMediaToolbar";

interface FloatingToolbarHostProps {
  editor: Editor | null;
}

export default function FloatingToolbarHost({ editor }: FloatingToolbarHostProps) {
  const [selected, setSelected] = useState<ReturnType<typeof getSelectedMedia>>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!editor) return;
    return setupDismissMediaSelection(editor);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const media = getSelectedMedia(editor);
      setSelected(media);
      if (media) {
        const rect = getMediaDomRect(editor, media.pos);
        if (rect) {
          setPosition({
            top: Math.max(72, rect.top - 12),
            left: rect.left + rect.width / 2,
          });
        }
      } else {
        setPosition(null);
      }
    };

    update();
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [editor]);

  if (!mounted || !editor || !selected || !position) return null;

  return createPortal(
    <div
      className="cms-float-toolbar-portal"
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -100%)",
        zIndex: 9999,
      }}
    >
      <AnimatePresence>
        <FloatingMediaToolbar
          key={selected.attrs.id as string}
          editor={editor}
          selected={selected}
          onClose={() => setSelected(null)}
        />
      </AnimatePresence>
    </div>,
    document.body
  );
}
