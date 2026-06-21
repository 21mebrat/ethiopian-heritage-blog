import type { Editor } from "@tiptap/react";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import { getSelectedMedia } from "./media-selection";

const IGNORE_SELECTORS = [
  ".cms-float-toolbar",
  ".cms-float-toolbar-portal",
  ".cms-main-toolbar",
  ".cms-main-toolbar-wrap",
].join(",");

/** Clear media node selection when clicking outside image + toolbar */
export function setupDismissMediaSelection(editor: Editor): () => void {
  const onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(IGNORE_SELECTORS)) return;
    if (target.closest(".cms-media-resize-host")) return;

    const media = getSelectedMedia(editor);
    if (!media) return;

    const nodeDom = editor.view.nodeDOM(media.pos);
    if (nodeDom instanceof HTMLElement && nodeDom.contains(target)) return;

    const { state, view } = editor;
    if (!(state.selection instanceof NodeSelection)) return;

    const after = Math.min(media.pos + media.node.nodeSize, state.doc.content.size);
    const $pos = state.doc.resolve(after);
    const sel = TextSelection.near($pos, 1);
    view.dispatch(state.tr.setSelection(sel));
  };

  document.addEventListener("pointerdown", onPointerDown, true);
  return () => document.removeEventListener("pointerdown", onPointerDown, true);
}
