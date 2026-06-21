"use client";

import { useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Captions,
  ImageIcon,
  Layers,
  LayoutGrid,
  Maximize2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Editor } from "@tiptap/react";
import type { SelectedMedia } from "../../lib/media-selection";
import { deleteBlockAt } from "../../lib/block-commands";
import { applyMediaLayout } from "../../lib/apply-media-layout";
import { getSelectedMedia } from "../../lib/media-selection";
import { patchMediaAttrs } from "../../lib/patch-media-attrs";
import { useLiveMediaSelection } from "../../hooks/useLiveMediaSelection";
import type { MediaLayout, MediaOverlay, MediaStyle } from "../../types/media-schema";
import { widthPresetOptions } from "../../lib/presentation";

type Tab = "resize" | "layout" | "style" | "overlay" | "caption" | "hero";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "resize", label: "Size & Layout", icon: <Maximize2 className="w-3.5 h-3.5" /> },
  { id: "style", label: "Style", icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { id: "overlay", label: "Overlay", icon: <Layers className="w-3.5 h-3.5" /> },
  { id: "caption", label: "Caption", icon: <Captions className="w-3.5 h-3.5" /> },
  { id: "hero", label: "Hero", icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const STYLES: MediaStyle[] = [
  "none",
  "rounded-lg",
  "rounded-xl",
  "shadow-md",
  "shadow-lg",
  "border",
  "glass",
  "card",
];

const OVERLAYS: MediaOverlay[] = ["none", "dark", "light", "gradient", "blur"];

const LAYOUTS: { id: MediaLayout; label: string }[] = [
  { id: "media-only", label: "Default" },
  { id: "wide", label: "Wide" },
  { id: "full", label: "Full" },
  { id: "hero", label: "Hero" },
];

interface FloatingMediaToolbarProps {
  editor: Editor;
  selected: SelectedMedia;
  onClose: () => void;
}

export default function FloatingMediaToolbar({
  editor,
  selected,
  onClose,
}: FloatingMediaToolbarProps) {
  const [tab, setTab] = useState<Tab>("resize");
  const { attrs, parsed, pos } = useLiveMediaSelection(editor, selected);
  const isVideo = selected.type === "videoBlock";

  const patch = (p: Record<string, unknown>) => {
    patchMediaAttrs(editor, pos, p);
  };

  const patchHero = (heroPatch: Partial<typeof parsed.hero>) => {
    patch({
      hero: { ...parsed.hero, ...heroPatch },
      ...(heroPatch.enabled !== undefined
        ? {
          mediaLayout: heroPatch.enabled ? "hero" : "media-only",
          layout: heroPatch.enabled ? "hero" : "default",
        }
        : {}),
    });
  };

  const stopBubble = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      className="cms-float-toolbar"
      onMouseDown={stopBubble}
      onPointerDown={stopBubble}
    >
      <div className="cms-float-toolbar-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`cms-float-tab ${tab === t.id ? "active" : ""}`}
            onMouseDown={stopBubble}
            onClick={() => setTab(t.id)}
            title={t.label}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
        <button
          type="button"
          className="cms-float-tab cms-float-tab--danger"
          onMouseDown={stopBubble}
          onClick={() => {
            deleteBlockAt(editor, () => pos);
            onClose();
          }}
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="cms-float-panel"
        >
          {tab === "resize" && (
            <div className="cms-float-grid">
              <p className="cms-float-hint">
                Drag handles on edges for free resize, or use presets:
              </p>

              <div className="cms-float-btns">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={`cms-float-btn grow ${parsed.mediaLayout === l.id ? "active" : ""}`}
                    onMouseDown={stopBubble}
                    onClick={() => {
                      const current = getSelectedMedia(editor);
                      if (current) applyMediaLayout(editor, current, l.id);
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <div className="h-px bg-white/5 my-1" />

              <div className="cms-float-btns">
                {widthPresetOptions().map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={`cms-float-btn ${parsed.presentation.widthPercent === w ? "active" : ""}`}
                    onMouseDown={stopBubble}
                    onClick={() => patch({ widthPercent: w, mediaLayout: "media-only" })}
                  >
                    {w}%
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="cms-float-btn cms-float-btn--wide"
                onMouseDown={stopBubble}
                onClick={() => patch({ heightPx: null })}
              >
                Reset height (auto)
              </button>

              <p className="cms-float-sub">Placement</p>
              <div className="cms-float-btns">
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`cms-float-btn grow capitalize ${parsed.presentation.alignment === a ? "active" : ""}`}
                    onMouseDown={stopBubble}
                    onClick={() => patch({ alignment: a })}
                  >
                    {a === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                    {a === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                    {a === "right" && <AlignRight className="w-3.5 h-3.5" />}
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "style" && (
            <div className="cms-float-btns">
              {STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`cms-float-btn ${parsed.presentation.style === s ? "active" : ""}`}
                  onMouseDown={stopBubble}
                  onClick={() => patch({ style: s })}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {tab === "overlay" && (
            <div className="cms-float-grid">
              <div className="cms-float-btns">
                {OVERLAYS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className={`cms-float-btn capitalize ${parsed.overlay === o ? "active" : ""}`}
                    onMouseDown={stopBubble}
                    onClick={() => patch({ overlay: o })}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <label className="cms-float-slider" onMouseDown={stopBubble}>
                Opacity {parsed.overlayOpacity}%
                <input
                  type="range"
                  min={5}
                  max={95}
                  step={5}
                  value={parsed.overlayOpacity}
                  onMouseDown={stopBubble}
                  onChange={(e) => patch({ overlayOpacity: Number(e.target.value) })}
                />
              </label>
              {parsed.overlay === "none" && (
                <p className="cms-float-hint">Pick an overlay type above to preview</p>
              )}
            </div>
          )}

          {tab === "caption" && (
            <div className="cms-float-form">
              <label onMouseDown={stopBubble}>
                Caption
                <input
                  type="text"
                  value={parsed.presentation.caption}
                  onMouseDown={stopBubble}
                  onChange={(e) => patch({ caption: e.target.value })}
                  placeholder="Image caption"
                />
              </label>
              <label onMouseDown={stopBubble}>
                Alt text
                <input
                  type="text"
                  value={parsed.presentation.alt}
                  onMouseDown={stopBubble}
                  onChange={(e) => patch({ alt: e.target.value })}
                  placeholder="Describe for accessibility"
                />
              </label>
              {isVideo && (
                <>
                  <label className="cms-float-check" onMouseDown={stopBubble}>
                    <input
                      type="checkbox"
                      checked={!!attrs.autoplay}
                      onChange={(e) => patch({ autoplay: e.target.checked })}
                    />
                    Autoplay
                  </label>
                  <label className="cms-float-check" onMouseDown={stopBubble}>
                    <input
                      type="checkbox"
                      checked={attrs.controls !== false}
                      onChange={(e) => patch({ controls: e.target.checked })}
                    />
                    Show controls
                  </label>
                  <label className="cms-float-check" onMouseDown={stopBubble}>
                    <input
                      type="checkbox"
                      checked={!!attrs.muted}
                      onChange={(e) => patch({ muted: e.target.checked })}
                    />
                    Muted
                  </label>
                </>
              )}
            </div>
          )}

          {tab === "hero" && (
            <div className="cms-float-form">
              <label className="cms-float-check" onMouseDown={stopBubble}>
                <input
                  type="checkbox"
                  checked={parsed.hero.enabled || parsed.mediaLayout === "hero"}
                  onChange={(e) => patchHero({ enabled: e.target.checked })}
                />
                Hero mode
              </label>
              <label onMouseDown={stopBubble}>
                Title
                <input
                  type="text"
                  value={parsed.hero.title}
                  onMouseDown={stopBubble}
                  onChange={(e) => patchHero({ title: e.target.value })}
                  placeholder="Main title"
                />
              </label>
              <label onMouseDown={stopBubble}>
                Description
                <input
                  type="text"
                  value={parsed.hero.subtitle}
                  onMouseDown={stopBubble}
                  onChange={(e) => patchHero({ subtitle: e.target.value })}
                  placeholder="Subtitle"
                />
              </label>
              <label onMouseDown={stopBubble}>
                Button label
                <input
                  type="text"
                  value={parsed.hero.buttonLabel}
                  onMouseDown={stopBubble}
                  onChange={(e) => patchHero({ buttonLabel: e.target.value })}
                />
              </label>
              <label onMouseDown={stopBubble}>
                Button URL
                <input
                  type="url"
                  value={parsed.hero.buttonHref}
                  onMouseDown={stopBubble}
                  onChange={(e) => patchHero({ buttonHref: e.target.value })}
                />
              </label>
              <div className="cms-float-btns">
                {(["left", "center", "right"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`cms-float-btn ${parsed.hero.textPosition === p ? "active" : ""}`}
                    onMouseDown={stopBubble}
                    onClick={() => patchHero({ textPosition: p })}
                  >
                    Text {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
