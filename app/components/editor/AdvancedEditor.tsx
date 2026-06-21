"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import React, { useCallback, useMemo, useRef } from "react";
import BottomToolbar from "./BottomToolbar";
import FloatingToolbarHost from "./components/floating/FloatingToolbarHost";
import { getEditorExtensions } from "./extensions";
import { EditorModeProvider } from "./context/EditorModeContext";
import { migrateEditorContent } from "./lib/migrate-content";
import { insertImageBlock, insertVideoBlock } from "./lib/upload-media";

interface EditorProps {
  initialContent?: string | Record<string, unknown> | null;
  onChange?: (json: Record<string, unknown>) => void;
}

export default function AdvancedEditor({ initialContent, onChange }: EditorProps) {
  const content = useMemo(() => {
    if (!initialContent) return "";
    if (typeof initialContent === "string") return initialContent;
    return migrateEditorContent(initialContent as Parameters<typeof migrateEditorContent>[0]);
  }, [initialContent]);

  const handleUpdate = useCallback(
    ({ editor }: { editor: { getJSON: () => Record<string, unknown> } }) => {
      if (onChange) onChange(editor.getJSON());
    },
    [onChange]
  );

  const editorRef = useRef<Editor | null>(null);

  const handleFileUpload = useCallback((file: File) => {
    const ed = editorRef.current;
    if (!ed) return false;
    if (file.type.startsWith("image/")) {
      insertImageBlock(ed, file);
      return true;
    }
    if (file.type.startsWith("video/")) {
      insertVideoBlock(ed, file);
      return true;
    }
    return false;
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getEditorExtensions({ placeholder: "Start writing your story..." }),
    content,
    onCreate: ({ editor: e }) => {
      editorRef.current = e;
    },
    onUpdate: ({ editor: e }) => {
      editorRef.current = e;
      handleUpdate({ editor: e });
    },
    editorProps: {
      attributes: {
        class:
          "cms-prose-surface focus:outline-none min-h-[300px] sm:min-h-[500px] pb-24 sm:pb-32 max-w-none",
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]) {
          handleFileUpload(event.dataTransfer.files[0]);
          return true;
        }
        return false;
      },
      handlePaste: (_view, event) => {
        if (event.clipboardData?.files?.[0]) {
          handleFileUpload(event.clipboardData.files[0]);
          return true;
        }
        return false;
      },
    },
  });

  return (
    <EditorModeProvider mode="edit">
      <div className="cms-editor-shell relative w-full">
        <div className="bg-white/3 rounded-xl sm:rounded-2xl border border-white/5 min-h-[400px] sm:min-h-[600px] backdrop-blur-sm">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 text-white">
            <EditorContent editor={editor} />
          </div>
        </div>
        {editor && (
          <>
            <FloatingToolbarHost editor={editor} />
            <BottomToolbar editor={editor} />
          </>
        )}
      </div>
    </EditorModeProvider>
  );
}
