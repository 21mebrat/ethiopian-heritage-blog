import type { Extensions } from "@tiptap/react";
import { getBlockExtensions } from "./extensions/index";

/** Extensions shared by the editor and read-only blog renderer. */
export function getEditorExtensions(options?: { placeholder?: string }): Extensions {
  return getBlockExtensions(options);
}

/** @deprecated Use cms-document typography — prose conflicts with media layouts */
export const BLOG_PROSE_CLASS = "cms-document";
