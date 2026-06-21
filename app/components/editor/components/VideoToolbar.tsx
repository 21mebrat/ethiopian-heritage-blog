"use client";

import { Link2, Trash2, Video } from "lucide-react";
import type { MediaAlignment, MediaPresentation } from "../types/media-schema";
import { widthPresetOptions } from "../lib/presentation";

const ALIGNMENTS: MediaAlignment[] = ["left", "center", "right", "full", "wide"];

interface VideoToolbarProps {
  presentation: MediaPresentation;
  attrs: Record<string, unknown>;
  onUpdate: (patch: Record<string, unknown>) => void;
  onReplace: () => void;
  onEmbed: () => void;
  onDelete: () => void;
}

export default function VideoToolbar({
  presentation,
  attrs,
  onUpdate,
  onReplace,
  onEmbed,
  onDelete,
}: VideoToolbarProps) {
  return (
    <div className="cms-media-toolbar" role="toolbar" aria-label="Video settings">
      <div className="cms-toolbar-row">
        <span className="cms-toolbar-row-label">Align</span>
        <div className="cms-toolbar-group">
          {ALIGNMENTS.map((a) => (
            <button
              key={a}
              type="button"
              className={`cms-toolbar-btn capitalize ${presentation.alignment === a ? "active" : ""}`}
              onClick={() => onUpdate({ alignment: a })}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="cms-toolbar-row">
        <span className="cms-toolbar-row-label">Width</span>
        <div className="cms-toolbar-group">
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
        </div>
      </div>

      <div className="cms-toolbar-row">
        <span className="cms-toolbar-row-label">Playback</span>
        <div className="cms-toolbar-group">
          <label className="cms-toggle">
            <input
              type="checkbox"
              checked={!!attrs.autoplay}
              onChange={(e) => onUpdate({ autoplay: e.target.checked })}
            />
            Autoplay
          </label>
          <label className="cms-toggle">
            <input
              type="checkbox"
              checked={!!attrs.loop}
              onChange={(e) => onUpdate({ loop: e.target.checked })}
            />
            Loop
          </label>
          <label className="cms-toggle">
            <input
              type="checkbox"
              checked={!!attrs.muted}
              onChange={(e) => onUpdate({ muted: e.target.checked })}
            />
            Mute
          </label>
        </div>
      </div>

      <div className="cms-toolbar-row">
        <span className="cms-toolbar-row-label">Actions</span>
        <div className="cms-toolbar-group">
          <button type="button" className="cms-toolbar-btn" onClick={onReplace}>
            <Video className="w-3.5 h-3.5" />
            Replace
          </button>
          <button type="button" className="cms-toolbar-btn" onClick={onEmbed}>
            <Link2 className="w-3.5 h-3.5" />
            Embed URL
          </button>
          <button type="button" className="cms-toolbar-btn cms-toolbar-btn--danger" onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
