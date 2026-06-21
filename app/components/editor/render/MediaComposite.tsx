"use client";

import type { CompositeLayout } from "../types/media-schema";
import { buildCompositeClasses, extractPresentation } from "../lib/presentation";
import MediaFigure from "./MediaFigure";
import ContentInline from "./ContentInline";

export interface MediaCompositeProps {
  layout: CompositeLayout;
  imageSrc: string | null;
  attrs: Record<string, unknown>;
  /** Read path: Tiptap child nodes */
  content?: unknown[];
  /** Edit path: ProseMirror editable region */
  children?: React.ReactNode;
}

export default function MediaComposite({
  layout,
  imageSrc,
  attrs,
  content = [],
  children,
}: MediaCompositeProps) {
  const presentation = extractPresentation({
    alt: attrs.alt,
    caption: attrs.caption,
    credit: attrs.credit,
    photographer: attrs.photographer,
    sourceUrl: attrs.sourceUrl,
    alignment: attrs.alignment ?? "left",
    widthPercent: attrs.widthPercent ?? 42,
    style: attrs.imageStyle ?? attrs.style,
  });

  return (
    <div className={buildCompositeClasses(layout)} data-layout={layout}>
      {imageSrc && (
        <div className="cms-composite-media">
          <MediaFigure
            src={imageSrc}
            presentation={{
              ...presentation,
              widthPercent: layout.startsWith("float") ? 100 : presentation.widthPercent,
            }}
            layout="default"
          />
        </div>
      )}
      <div className="cms-composite-body cms-prose">
        {children ?? <ContentInline nodes={content} />}
      </div>
    </div>
  );
}
