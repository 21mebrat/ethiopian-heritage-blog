"use client";

import { Editor } from "@tiptap/react";
import { Bold, Italic, Image, List } from "lucide-react";

export default function BottomBar({ editor }: { editor: Editor }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
      <div className="flex gap-2 px-4 py-2 rounded-2xl border bg-background shadow-xl backdrop-blur-xl">
        
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="p-2 hover:bg-accent rounded-lg"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-2 hover:bg-accent rounded-lg"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => {
            const url = prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="p-2 hover:bg-accent rounded-lg"
        >
          <Image size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="p-2 hover:bg-accent rounded-lg"
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );
}