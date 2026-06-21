"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Link2,
  Maximize2,
  Trash2,
  Type,
  ImageIcon,
} from "lucide-react";
import type {
  MediaAlignment,
  MediaPresentation,
  MediaStyle,
  StandaloneLayout,
} from "../types/media-schema";
import { widthPresetOptions } from "../lib/presentation";

const ALIGNMENTS: { value: MediaAlignment; icon: React.ReactNode; label: string }[] = [
  { value: "left", icon: <AlignLeft className="w-3.5 h-3.5" />, label: "Left" },
  { value: "center", icon: <AlignCenter className="w-3.5 h-3.5" />, label: "Center" },
  { value: "right", icon: <AlignRight className="w-3.5 h-3.5" />, label: "Right" },
  { value: "wide", icon: <Maximize2 className="w-3.5 h-3.5" />, label: "Wide" },
  { value: "full", icon: <Maximize2 className="w-3.5 h-3.5" />, label: "Full" },
];

const STYLES: { value: MediaStyle; label: string }[] = [
  { value: "none", label: "None" },
  { value: "rounded-lg", label: "Round" },
  { value: "rounded-xl", label: "Round XL" },
  { value: "rounded-full", label: "Circle" },
  { value: "shadow-md", label: "Shadow" },
  { value: "shadow-lg", label: "Shadow L" },
  { value: "border", label: "Border" },
  { value: "card", label: "Card" },
  { value: "glass", label: "Glass" },
];

const LAYOUTS: { value: StandaloneLayout; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "wide", label: "Wide" },
  { value: "full", label: "Full" },
  { value: "hero", label: "Hero" },
];

interface MediaToolbarProps {
  presentation: MediaPresentation;
  layout: StandaloneLayout;
  onUpdate: (patch: Partial<MediaPresentation & { layout?: StandaloneLayout }>) => void;
  onReplace: () => void;
  onDelete: () => void;
  onCopyUrl: () => void;
}

function ToolbarRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cms-toolbar-row">
      <span className="cms-toolbar-row-label">{label}</span>
      <div className="cms-toolbar-group">{children}</div>
    </div>
  );
}

export function MediaToolbar({
  presentation,
  layout,
  onUpdate,
  onReplace,
  onDelete,
  onCopyUrl,
}: MediaToolbarProps) {
  return (
    <div className="cms-media-toolbar" role="toolbar" aria-label="Image settings">
      <ToolbarRow label="Align">
        {ALIGNMENTS.map((a) => (
          <button
            key={a.value}
            type="button"
            title={a.label}
            className={`cms-toolbar-btn cms-toolbar-btn--icon ${presentation.alignment === a.value ? "active" : ""}`}
            onClick={() => onUpdate({ alignment: a.value })}
          >
            {a.icon}
          </button>
        ))}
      </ToolbarRow>

      <ToolbarRow label="Width">
        {widthPresetOptions().map((w) => (
          <button
            key={w}
            type="button"
            className={`cms-toolbar-btn ${presentation.widthPercent === w ? "active" : ""}`}
            onClick={() => onUpdate({ widthPercent: w })}
          >
            {w}%
          </button>
        ))}
      </ToolbarRow>

      <ToolbarRow label="Style">
        {STYLES.map((s) => (
          <button
            key={s.value}
            type="button"
            className={`cms-toolbar-btn ${presentation.style === s.value ? "active" : ""}`}
            onClick={() => onUpdate({ style: s.value })}
          >
            {s.label}
          </button>
        ))}
      </ToolbarRow>

      <ToolbarRow label="Layout">
        {LAYOUTS.map((l) => (
          <button
            key={l.value}
            type="button"
            className={`cms-toolbar-btn ${layout === l.value ? "active" : ""}`}
            onClick={() => onUpdate({ layout: l.value } as { layout: StandaloneLayout })}
          >
            {l.label}
          </button>
        ))}
      </ToolbarRow>

      <ToolbarRow label="Actions">
        <button type="button" className="cms-toolbar-btn" onClick={onReplace}>
          <ImageIcon className="w-3.5 h-3.5" />
          Replace
        </button>
        <button
          type="button"
          className="cms-toolbar-btn cms-toolbar-btn--icon"
          onClick={onCopyUrl}
          title="Copy URL"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          className="cms-toolbar-btn"
          onClick={() => {
            const caption = window.prompt("Caption", presentation.caption) ?? presentation.caption;
            onUpdate({ caption });
          }}
        >
          <Type className="w-3.5 h-3.5" />
          Caption
        </button>
        <button
          type="button"
          className="cms-toolbar-btn"
          onClick={() => {
            const alt = window.prompt("Alt text", presentation.alt) ?? presentation.alt;
            onUpdate({ alt });
          }}
        >
          Alt text
        </button>
        <button
          type="button"
          className="cms-toolbar-btn cms-toolbar-btn--danger"
          onClick={onDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </ToolbarRow>
    </div>
  );
}
