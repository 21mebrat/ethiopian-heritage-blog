"use client";

import { useRef, type CSSProperties } from "react";
import { GripVertical } from "lucide-react";
import type { MediaOverlay } from "../types/media-schema";
import { presentationFromAttrs } from "../lib/media-attrs";
import { buildMediaClasses, buildMediaStyle } from "../lib/presentation";
import MediaCaption from "./MediaCaption";
import MediaResizeHandles, {
  type MediaResizeDimensions,
} from "../components/media/MediaResizeHandles";

interface MediaDisplayProps {
  attrs: Record<string, unknown>;
  mediaType: "image" | "video";
  /** Editor-only chrome */
  selected?: boolean;
  onSelect?: () => void;
  onResize?: (dims: MediaResizeDimensions) => void;
  showDragHandle?: boolean;
}

function overlayClass(overlay: MediaOverlay): string {
  if (overlay === "none") return "";
  return `cms-media-overlay cms-media-overlay--${overlay}`;
}

export default function MediaDisplay({
  attrs,
  mediaType,
  selected,
  onSelect,
  onResize,
  showDragHandle,
}: MediaDisplayProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const { presentation, layout, mediaLayout, overlay, overlayOpacity, hero } =
    presentationFromAttrs(attrs);

  const heightPx =
    typeof attrs.heightPx === "number" && attrs.heightPx > 0
      ? attrs.heightPx
      : null;

  const resolvedLayout =
    mediaLayout === "hero" || hero.enabled ? "hero" : layout;
  const classes = buildMediaClasses(presentation, resolvedLayout);
  const figureStyle = buildMediaStyle(presentation);

  const frameStyle: CSSProperties = heightPx
    ? { height: heightPx, maxHeight: "none" }
    : {};

  const mediaStyle: CSSProperties = heightPx
    ? { height: "100%", width: "100%", objectFit: "cover" }
    : {};

  const src = attrs.src as string | null;
  const embedUrl = (attrs.embedUrl ?? attrs.src) as string | null;
  const isHero = hero.enabled || mediaLayout === "hero";
  const showHeroScrim = isHero && overlay === "none";
  const heroPosition = hero.textPosition || "center";

  const mediaEl =
    mediaType === "video" ? (
      attrs.provider === "youtube" || attrs.provider === "vimeo" ? (
        embedUrl ? (
          <div className="cms-video-embed" style={mediaStyle}>
            <iframe
              src={embedUrl}
              title={presentation.caption || "Video"}
              className="cms-video-iframe"
              allowFullScreen
            />
          </div>
        ) : null
      ) : src ? (
        isHero ? (
          <div className="cms-media-media-layer">
            <video
              src={src}
              poster={(attrs.poster as string) ?? undefined}
              controls={attrs.controls !== false}
              autoPlay={!!attrs.autoplay}
              loop={!!attrs.loop}
              muted={!!attrs.muted}
              playsInline
              className="cms-video-native"
            />
          </div>
        ) : (
          <video
            src={src}
            poster={(attrs.poster as string) ?? undefined}
            controls={attrs.controls !== false}
            autoPlay={!!attrs.autoplay}
            loop={!!attrs.loop}
            muted={!!attrs.muted}
            playsInline
            className="cms-video-native"
            style={mediaStyle}
          />
        )
      ) : null
    ) : src ? (
      isHero ? (
        <div className="cms-media-media-layer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={presentation.alt}
            className="cms-media-img"
            loading="lazy"
            draggable={false}
          />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={presentation.alt}
          className="cms-media-img"
          loading="lazy"
          style={mediaStyle}
          draggable={false}
        />
      )
    ) : null;

  if (!mediaEl && !isHero) return null;

  return (
    <figure
      className={`${classes.figure} ${isHero ? "cms-media--hero-mode" : ""} ${selected ? "cms-media--selected" : ""}`}
      style={figureStyle}
      data-media-layout={mediaLayout}
      data-overlay={overlay}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      <div
        ref={frameRef}
        className={`${classes.frame} cms-media-resize-host ${selected ? "is-selected" : ""}`}
        style={frameStyle}
        contentEditable={false}
      >
        {showDragHandle && (
          <button
            type="button"
            className="cms-media-drag-handle"
            contentEditable={false}
            draggable
            data-drag-handle
            title="Drag to move"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
        )}
        {mediaEl}
        {overlay !== "none" && (
          <div
            className={`${overlayClass(overlay)} cms-media-layer-overlay`}
            style={
              {
                "--cms-overlay-opacity": overlayOpacity / 100,
              } as CSSProperties
            }
            aria-hidden
          />
        )}
        {showHeroScrim && (
          <div className="cms-media-hero-scrim cms-media-layer-overlay" aria-hidden />
        )}
        {isHero && (
          <div
            className={`cms-media-hero-content cms-media-hero-content--${heroPosition}`}
            contentEditable={false}
          >
            {(hero.title || hero.subtitle || (hero.buttonLabel && hero.buttonHref)) ? (
              <>
                {hero.title ? (
                  <h2 className="cms-media-hero-title">{hero.title}</h2>
                ) : null}
                {hero.subtitle ? (
                  <p className="cms-media-hero-subtitle">{hero.subtitle}</p>
                ) : null}
                {hero.buttonLabel && hero.buttonHref ? (
                  <a href={hero.buttonHref} className="cms-media-hero-btn">
                    {hero.buttonLabel}
                  </a>
                ) : null}
              </>
            ) : showDragHandle ? (
              <p className="cms-media-hero-placeholder">Hero title & description</p>
            ) : null}
          </div>
        )}
        {selected && onResize && (
          <MediaResizeHandles
            hostRef={frameRef}
            widthPercent={Number(presentation.widthPercent)}
            heightPx={heightPx}
            onResize={onResize}
          />
        )}
      </div>
      {!isHero && <MediaCaption meta={presentation} />}
    </figure>
  );
}
