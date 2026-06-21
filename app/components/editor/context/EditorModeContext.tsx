"use client";

import { createContext, useContext } from "react";

export type EditorMode = "edit" | "read";

const EditorModeContext = createContext<EditorMode>("edit");

export function EditorModeProvider({
  mode,
  children,
}: {
  mode: EditorMode;
  children: React.ReactNode;
}) {
  return (
    <EditorModeContext.Provider value={mode}>{children}</EditorModeContext.Provider>
  );
}

export function useEditorMode(): EditorMode {
  return useContext(EditorModeContext);
}
