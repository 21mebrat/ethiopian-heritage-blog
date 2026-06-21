"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { useCallback } from "react";
import BlockChrome from "../../components/BlockChrome";
import { deleteBlockAt, duplicateBlockAt, moveBlockAt } from "../../lib/block-commands";
import type { CalloutBlockAttrs } from "../../types/blocks";

const VARIANT_CLASS: Record<CalloutBlockAttrs["variant"], string> = {
  info: "cms-callout-info",
  warning: "cms-callout-warning",
  success: "cms-callout-success",
  tip: "cms-callout-tip",
};

export default function CalloutBlockView({
  node,
  selected,
  editor,
  getPos,
  updateAttributes,
}: NodeViewProps) {
  const attrs = node.attrs as CalloutBlockAttrs;
  const getBlockPos = useCallback(() => getPos(), [getPos]);

  return (
    <NodeViewWrapper
      as="aside"
      className={`cms-callout ${VARIANT_CLASS[attrs.variant] ?? VARIANT_CLASS.info}`}
      data-type="callout-block"
    >
      <BlockChrome
        label="Callout"
        selected={selected}
        onMoveUp={() => moveBlockAt(editor, getBlockPos, "up")}
        onMoveDown={() => moveBlockAt(editor, getBlockPos, "down")}
        onDuplicate={() => duplicateBlockAt(editor, getBlockPos)}
        onDelete={() => deleteBlockAt(editor, getBlockPos)}
        toolbar={
          selected ? (
            <div className="cms-media-toolbar">
              {(["info", "warning", "success", "tip"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`cms-toolbar-btn text-xs capitalize ${attrs.variant === v ? "active" : ""}`}
                  onClick={() => updateAttributes({ variant: v })}
                >
                  {v}
                </button>
              ))}
              <button
                type="button"
                className="cms-toolbar-btn"
                onClick={() => {
                  const emoji = window.prompt("Emoji", attrs.emoji) ?? attrs.emoji;
                  updateAttributes({ emoji });
                }}
              >
                {attrs.emoji || "💡"}
              </button>
            </div>
          ) : null
        }
      >
        <div className="cms-callout-inner">
          <span className="cms-callout-emoji" contentEditable={false}>
            {attrs.emoji || "💡"}
          </span>
          <NodeViewContent className="cms-callout-content" />
        </div>
      </BlockChrome>
    </NodeViewWrapper>
  );
}
