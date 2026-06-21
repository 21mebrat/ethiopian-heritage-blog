"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { useCallback, useRef } from "react";
import BlockChrome from "../../components/BlockChrome";
import { galleryLayoutClass, alignmentClass } from "../../lib/layout-classes";
import { deleteBlockAt, duplicateBlockAt, moveBlockAt } from "../../lib/block-commands";
import { uploadToCloudinary } from "../../core/upload-api";
import { createBlockId } from "../../lib/block-id";
import type { GalleryBlockAttrs, GalleryItem, GalleryLayout } from "../../types/blocks";

export default function GalleryBlockView({
  node,
  selected,
  editor,
  getPos,
  updateAttributes,
}: NodeViewProps) {
  const attrs = node.attrs as GalleryBlockAttrs;
  const fileRef = useRef<HTMLInputElement>(null);
  const getBlockPos = useCallback(() => getPos(), [getPos]);

  const addImages = async (files: FileList) => {
    const newItems: GalleryItem[] = [...(attrs.items ?? [])];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const result = await uploadToCloudinary(file);
        if (result?.url) {
          newItems.push({
            id: createBlockId(),
            src: result.url,
            alt: file.name,
            caption: "",
            credit: "",
            photographer: "",
            sourceUrl: "",
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    updateAttributes({ items: newItems });
  };

  const wrapperClass = [
    "cms-gallery-block",
    alignmentClass(attrs.alignment ?? "center"),
    galleryLayoutClass(attrs.layout ?? "grid-2"),
  ].join(" ");

  return (
    <NodeViewWrapper as="figure" className={wrapperClass} data-type="gallery-block">
      <BlockChrome
        label="Gallery"
        selected={selected}
        onMoveUp={() => moveBlockAt(editor, getBlockPos, "up")}
        onMoveDown={() => moveBlockAt(editor, getBlockPos, "down")}
        onDuplicate={() => duplicateBlockAt(editor, getBlockPos)}
        onDelete={() => deleteBlockAt(editor, getBlockPos)}
        toolbar={
          selected ? (
            <div className="cms-media-toolbar">
              {(["grid-2", "grid-3", "masonry", "carousel"] as GalleryLayout[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`cms-toolbar-btn text-xs ${attrs.layout === l ? "active" : ""}`}
                  onClick={() => updateAttributes({ layout: l })}
                >
                  {l}
                </button>
              ))}
              <button type="button" className="cms-toolbar-btn" onClick={() => fileRef.current?.click()}>
                Add images
              </button>
            </div>
          ) : null
        }
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void addImages(e.target.files);
            e.target.value = "";
          }}
        />

        {!attrs.items?.length ? (
          <button type="button" className="cms-media-placeholder" onClick={() => fileRef.current?.click()}>
            Add gallery images
          </button>
        ) : (
          <div className="cms-gallery-grid">
            {attrs.items.map((item, index) => (
              <div key={item.id} className="cms-gallery-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} className="cms-gallery-img" draggable={false} />
                {item.caption && <span className="cms-gallery-item-caption">{item.caption}</span>}
                {selected && (
                  <button
                    type="button"
                    className="cms-gallery-remove"
                    onClick={() => {
                      const items = [...attrs.items];
                      items.splice(index, 1);
                      updateAttributes({ items });
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {attrs.caption && <figcaption className="cms-caption">{attrs.caption}</figcaption>}
      </BlockChrome>
    </NodeViewWrapper>
  );
}
