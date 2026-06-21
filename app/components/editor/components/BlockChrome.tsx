"use client";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Trash2,
} from "lucide-react";
import { useEditorMode } from "../context/EditorModeContext";

interface BlockChromeProps {
  label: string;
  selected?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
}

export default function BlockChrome({
  label,
  selected,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  dragHandleProps,
  children,
  toolbar,
}: BlockChromeProps) {
  const mode = useEditorMode();
  const isEdit = mode === "edit";

  if (!isEdit) {
    return <>{children}</>;
  }

  return (
    <div
      className={`cms-block ${selected ? "cms-block-selected" : ""} cms-block-edit`}
      data-block-label={label}
    >
      <div className="cms-block-chrome">
          <button
            type="button"
            className="cms-drag-handle"
            title="Drag to reorder"
            draggable
            data-drag-handle
            {...dragHandleProps}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="cms-block-label">{label}</span>
          <div className="cms-block-actions">
            <button type="button" className="cms-btn-icon" onClick={onMoveUp} title="Move up">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button type="button" className="cms-btn-icon" onClick={onMoveDown} title="Move down">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button type="button" className="cms-btn-icon" onClick={onDuplicate} title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>
            <button type="button" className="cms-btn-icon cms-btn-danger" onClick={onDelete} title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      {selected && toolbar && <div className="cms-block-toolbar">{toolbar}</div>}

      <div className="cms-block-body">{children}</div>
    </div>
  );
}
