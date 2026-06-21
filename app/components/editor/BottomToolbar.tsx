"use client";

import React, { useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Image as ImageIcon,
  Video as VideoIcon,
  Quote,
  List,
  ListOrdered,
  ChevronDown,
  Undo2,
  Redo2,
  Palette,
  Link2,
  Type,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { insertImageBlock, insertVideoBlock } from "./lib/upload-media";

interface BottomToolbarProps {
  editor: Editor;
}

const HEADING_OPTIONS = [
  { label: "Text", value: "paragraph", level: 0 },
  { label: "Heading 1", value: "heading", level: 1 },
  { label: "Heading 2", value: "heading", level: 2 },
  { label: "Heading 3", value: "heading", level: 3 },
];

const COLOR_SWATCHES = [
  "#1c1917", "#57534e", "#dc2626", "#ea580c", "#ca8a04", "#16a34a",
  "#2563eb", "#7c3aed", "#db2777",
];

export default function BottomToolbar({ editor }: BottomToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [headingOpen, setHeadingOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);

  if (!editor) return null;

  const getActiveHeading = () => {
    for (let i = 1; i <= 3; i++) {
      if (editor.isActive("heading", { level: i })) return `H${i}`;
    }
    return "Text";
  };

  const btn = (active: boolean) =>
    `cms-main-toolbar-btn ${active ? "active" : ""}`;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="cms-main-toolbar-wrap"
    >
      <AnimatePresence>
        {(headingOpen || colorOpen || listOpen) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="cms-main-toolbar-popup"
          >
            {headingOpen &&
              HEADING_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className="cms-main-toolbar-popup-item"
                  onClick={() => {
                    if (opt.value === "paragraph") editor.chain().focus().setParagraph().run();
                    else editor.chain().focus().toggleHeading({ level: opt.level as 1 | 2 | 3 }).run();
                    setHeadingOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            {colorOpen && (
              <div className="cms-main-toolbar-colors">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="cms-color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setColorOpen(false);
                    }}
                  />
                ))}
                <button
                  type="button"
                  className="cms-main-toolbar-popup-item w-full mt-1"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setColorOpen(false);
                  }}
                >
                  Reset
                </button>
              </div>
            )}
            {listOpen && (
              <>
                <button
                  type="button"
                  className="cms-main-toolbar-popup-item"
                  onClick={() => {
                    editor.chain().focus().toggleBulletList().run();
                    setListOpen(false);
                  }}
                >
                  Bullet list
                </button>
                <button
                  type="button"
                  className="cms-main-toolbar-popup-item"
                  onClick={() => {
                    editor.chain().focus().toggleOrderedList().run();
                    setListOpen(false);
                  }}
                >
                  Numbered list
                </button>
              </>
            )}
            {gridOpen && (
              <>
                <button
                  type="button"
                  className="cms-main-toolbar-popup-item"
                  onClick={() => {
                    // @ts-ignore
                    editor.chain().focus().insertSection("1-1").run();
                    setGridOpen(false);
                  }}
                >
                  <LayoutGrid className="w-4 h-4" />
                  2 Columns (50:50)
                </button>
                <button
                  type="button"
                  className="cms-main-toolbar-popup-item"
                  onClick={() => {
                    // @ts-ignore
                    editor.chain().focus().insertSection("1-1-1").run();
                    setGridOpen(false);
                  }}
                >
                  <LayoutGrid className="w-4 h-4" />
                  3 Columns
                </button>
                <button
                  type="button"
                  className="cms-main-toolbar-popup-item"
                  onClick={() => {
                    // @ts-ignore
                    editor.chain().focus().insertSection("2-1").run();
                    setGridOpen(false);
                  }}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Sidebar Left (2:1)
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="cms-main-toolbar">
        <button
          type="button"
          className={`cms-main-toolbar-btn cms-main-toolbar-btn--label ${headingOpen ? "active" : ""}`}
          onClick={() => {
            setHeadingOpen(!headingOpen);
            setColorOpen(false);
            setListOpen(false);
          }}
        >
          <Type className="w-4 h-4" />
          <span>{getActiveHeading()}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        <span className="cms-main-toolbar-sep" />

        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={btn(colorOpen)}
          onClick={() => {
            setColorOpen(!colorOpen);
            setHeadingOpen(false);
            setListOpen(false);
          }}
          title="Color"
        >
          <Palette className="w-4 h-4" />
        </button>

        <span className="cms-main-toolbar-sep" />

        <button
          type="button"
          className={btn(listOpen)}
          onClick={() => {
            setListOpen(!listOpen);
            setHeadingOpen(false);
            setColorOpen(false);
          }}
          title="List"
        >
          <List className="w-4 h-4" />
        </button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
          <Quote className="w-4 h-4" />
        </button>

        <span className="cms-main-toolbar-sep" />

        <button type="button" className={btn(false)} onClick={() => imageInputRef.current?.click()} title="Image">
          <ImageIcon className="w-4 h-4" />
        </button>
        <button type="button" className={btn(false)} onClick={() => videoInputRef.current?.click()} title="Video">
          <VideoIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={btn(gridOpen)}
          onClick={() => {
            setGridOpen(!gridOpen);
            setHeadingOpen(false);
            setColorOpen(false);
            setListOpen(false);
          }}
          title="Grid Layout"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button type="button" className={btn(editor.isActive("link"))} onClick={setLink} title="Link">
          <Link2 className="w-4 h-4" />
        </button>

        <span className="cms-main-toolbar-sep" />

        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo2 className="w-4 h-4" />
        </button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo2 className="w-4 h-4" />
        </button>

        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) insertImageBlock(editor, f);
          e.target.value = "";
        }} />
        <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) insertVideoBlock(editor, f);
          e.target.value = "";
        }} />
      </div>
    </motion.div>
  );
}
