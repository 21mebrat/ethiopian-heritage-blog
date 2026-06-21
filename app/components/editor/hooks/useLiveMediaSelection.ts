"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  getSelectedMedia,
  type SelectedMedia,
} from "../lib/media-selection";
import { getMediaAttrsAt } from "../lib/patch-media-attrs";
import { presentationFromAttrs } from "../lib/media-attrs";

export function useLiveMediaSelection(editor: Editor, selected: SelectedMedia) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    editor.on("transaction", bump);
    return () => {
      editor.off("transaction", bump);
    };
  }, [editor]);

  const live = getSelectedMedia(editor);
  const pos = live?.pos ?? selected.pos;
  const attrs = getMediaAttrsAt(editor, pos) ?? selected.attrs;
  const parsed = presentationFromAttrs(attrs);

  return { attrs, parsed, pos, tick };
}
