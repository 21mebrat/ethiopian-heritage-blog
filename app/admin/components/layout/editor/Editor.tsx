"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { ImageIcon, Bold, Italic } from "lucide-react";
import { useRef } from "react";
import { uploadToCloudinary } from "@/app/lib/clientUpload";

export default function Editor() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Start writing...</p>",
  });

  if (!editor) return null;

  const openFile = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const upload = await uploadToCloudinary(file);

    editor.chain().focus().setImage({
      src: upload.url,
    }).run();
  };

  return (
    <div className="relative min-h-screen bg-background p-6">

      {/* EDITOR */}
      <div className="mx-auto max-w-3xl border rounded-xl p-4 bg-card min-h-[500px]">
        <EditorContent editor={editor} />
      </div>

      {/* HIDDEN INPUT */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {/* 🧠 FIGMA STYLE BOTTOM TOOLBAR */}
      <div className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        flex items-center gap-2
        bg-background/80 backdrop-blur-xl
        border border-border
        rounded-2xl
        px-4 py-2
        shadow-xl
      ">
        {/* IMAGE */}
        <button
          onClick={openFile}
          className="p-2 rounded-xl hover:bg-accent transition"
        >
          <ImageIcon size={18} />
        </button>

        {/* BOLD */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="p-2 rounded-xl hover:bg-accent transition"
        >
          <Bold size={18} />
        </button>

        {/* ITALIC */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-2 rounded-xl hover:bg-accent transition"
        >
          <Italic size={18} />
        </button>
      </div>
    </div>
  );
}