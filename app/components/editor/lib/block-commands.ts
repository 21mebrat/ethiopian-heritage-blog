import type { Editor } from "@tiptap/react";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

export function getNodeAtPos(editor: Editor, pos: number): { node: ProseMirrorNode; pos: number } | null {
  const $pos = editor.state.doc.resolve(pos);
  const depth = $pos.depth;
  const nodePos = depth > 0 ? $pos.before(depth) : 0;
  const node = $pos.node(depth) ?? editor.state.doc.nodeAt(pos);
  if (!node) return null;
  return { node, pos: nodePos };
}

export function duplicateBlockAt(editor: Editor, getPos: () => number | undefined): boolean {
  const pos = getPos();
  if (pos === undefined) return false;
  const node = editor.state.doc.nodeAt(pos);
  if (!node) return false;
  const insertPos = pos + node.nodeSize;
  return editor
    .chain()
    .focus()
    .insertContentAt(insertPos, node.toJSON())
    .run();
}

export function deleteBlockAt(editor: Editor, getPos: () => number | undefined): boolean {
  const pos = getPos();
  if (pos === undefined) return false;
  const node = editor.state.doc.nodeAt(pos);
  if (!node) return false;
  return editor
    .chain()
    .focus()
    .deleteRange({ from: pos, to: pos + node.nodeSize })
    .run();
}

export function moveBlockAt(
  editor: Editor,
  getPos: () => number | undefined,
  direction: "up" | "down"
): boolean {
  const pos = getPos();
  if (pos === undefined) return false;
  const node = editor.state.doc.nodeAt(pos);
  if (!node) return false;

  const $pos = editor.state.doc.resolve(pos);
  const index = $pos.index();
  const parent = $pos.parent;

  if (direction === "up" && index === 0) return false;
  if (direction === "down" && index >= parent.childCount - 1) return false;

  const siblingIndex = direction === "up" ? index - 1 : index + 1;
  let siblingPos = $pos.start();
  for (let i = 0; i < siblingIndex; i++) {
    siblingPos += parent.child(i).nodeSize;
  }
  const sibling = parent.child(siblingIndex);

  const tr = editor.state.tr;
  const nodeJson = node.toJSON();
  const siblingJson = sibling.toJSON();

  if (direction === "up") {
    tr.replaceWith(siblingPos, pos + node.nodeSize, [
      editor.schema.nodeFromJSON(nodeJson),
      editor.schema.nodeFromJSON(siblingJson),
    ]);
  } else {
    tr.replaceWith(pos, siblingPos + sibling.nodeSize, [
      editor.schema.nodeFromJSON(siblingJson),
      editor.schema.nodeFromJSON(nodeJson),
    ]);
  }

  editor.view.dispatch(tr);
  return true;
}

export function updateBlockAttrs(
  editor: Editor,
  getPos: () => number | undefined,
  attrs: Record<string, unknown>
): void {
  const pos = getPos();
  if (pos === undefined) return;
  const node = editor.state.doc.nodeAt(pos);
  if (!node) return;
  editor.view.dispatch(
    editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs })
  );
}
