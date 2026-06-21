"use client";

import type { MediaPresentation, StandaloneLayout } from "../types/media-schema";
import {
  buildMediaClasses,
  buildMediaStyle,
  presentationFromAttrs,
} from "../lib/presentation";
import MediaCaption from "./MediaCaption";

export interface MediaFigureProps {
  src: string;
  attrs?: Record<string, unknown>;
  presentation?: MediaPresentation;
  layout?: StandaloneLayout;
  className?: string;
}

/**
 * Single source of truth for image rendering (editor + preview + published).
 * No editor chrome — presentation only.
 */
export default function MediaFigure({
  src,
  attrs = {},
  presentation: presentationOverride,
  layout: layoutOverride,
  className = "",
}: MediaFigureProps) {
  const { presentation, layout } = presentationOverride
    ? { presentation: presentationOverride, layout: layoutOverride ?? "default" }
    : presentationFromAttrs(attrs);

  const resolvedLayout = layoutOverride ?? layout;
  const classes = buildMediaClasses(presentation, resolvedLayout);
  const style = buildMediaStyle(presentation);

  return (
    <figure
      className={`${classes.figure} ${className}`.trim()}
      style={style}
      data-alignment={presentation.alignment}
      data-width={presentation.widthPercent}
      data-style={presentation.style}
      data-layout={resolvedLayout}
    >
      <div className={classes.frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={presentation.alt || ""}
          className={classes.img}
          loading="lazy"
          decoding="async"
        />
      </div>
      <MediaCaption meta={presentation} />
    </figure>
  );
}
