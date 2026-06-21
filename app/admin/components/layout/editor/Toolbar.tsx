"use client";

import { Editor } from "@tiptap/react";

export default function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex gap-2 p-2 border-b bg-muted/40">
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        B
      </button>

      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        I
      </button>

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </button>
    </div>
  );
}