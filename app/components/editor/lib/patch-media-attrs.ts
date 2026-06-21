import type { Editor } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import { DEFAULT_HERO } from "../types/media-schema";
import type { HeroConfig } from "../types/media-schema";

function mergeHero(
  current: unknown,
  patch: unknown
): HeroConfig {
  const base =
    current && typeof current === "object"
      ? { ...DEFAULT_HERO, ...(current as HeroConfig) }
      : { ...DEFAULT_HERO };
  if (patch && typeof patch === "object") {
    return { ...base, ...(patch as HeroConfig) };
  }
  return base;
}

/** Patch media node attrs without stealing focus / breaking NodeSelection */
export function patchMediaAttrs(
  editor: Editor,
  pos: number,
  patch: Record<string, unknown>
): boolean {
  const { state, view } = editor;
  const node = state.doc.nodeAt(pos);
  if (!node) return false;

  const next: Record<string, unknown> = { ...node.attrs };

  for (const [key, value] of Object.entries(patch)) {
    if (key === "hero") {
      next.hero = mergeHero(node.attrs.hero, value);
    } else {
      next[key] = value;
    }
  }

  let tr = state.tr.setNodeMarkup(pos, undefined, next);

  try {
    tr = tr.setSelection(NodeSelection.create(tr.doc, pos));
  } catch {
    // position invalid after layout transform
  }

  view.dispatch(tr);
  return true;
}

export function getMediaAttrsAt(
  editor: Editor,
  pos: number
): Record<string, unknown> | null {
  const node = editor.state.doc.nodeAt(pos);
  if (!node) return null;
  return { ...(node.attrs as Record<string, unknown>) };
}
