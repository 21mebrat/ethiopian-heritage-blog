"use client";

import type { JSONContent } from "@tiptap/core";
import ContentNode from "./ContentNode";

export default function ContentInline({ nodes }: { nodes: unknown[] }) {
  return (
    <>
      {(nodes as JSONContent[]).map((node, i) => (
        <ContentNode key={`${node.type}-${i}`} node={node} />
      ))}
    </>
  );
}
