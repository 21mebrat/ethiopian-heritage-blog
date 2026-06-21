"use client";

import { GripVertical } from "lucide-react";
import { useEditorMode } from "../../context/EditorModeContext";

interface MediaBlockShellProps {
  selected?: boolean;
  mediaId: string;
  mediaType: "image" | "video";
  children: React.ReactNode;
}

/** Minimal wrapper — no outer box border; grip only on hover */
export default function MediaBlockShell({
  selected,
  mediaId,
  mediaType,
  children,
}: MediaBlockShellProps) {
  const isEdit = useEditorMode() === "edit";

  return (
    <div
      className={`cms-media-block-shell ${selected ? "is-selected" : ""}`}
      data-media-id={mediaId}
      data-media-type={mediaType}
    >
      {isEdit && (
        <div className="cms-media-gutter" contentEditable={false}>
          <button
            type="button"
            className="cms-media-grip"
            contentEditable={false}
            draggable
            data-drag-handle
            title="Drag to move"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="cms-media-block-inner">{children}</div>
    </div>
  );
}
