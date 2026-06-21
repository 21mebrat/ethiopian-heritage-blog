"use client";

import type { MediaPresentation } from "../types/media-schema";
import {
  buildMediaClasses,
  buildMediaStyle,
  extractPresentation,
} from "../lib/presentation";
import MediaCaption from "./MediaCaption";

export interface MediaVideoProps {
  attrs: Record<string, unknown>;
  presentation?: MediaPresentation;
}

export default function MediaVideo({ attrs, presentation: override }: MediaVideoProps) {
  const presentation = override ?? extractPresentation(attrs);
  const classes = buildMediaClasses(presentation, "default");
  const style = buildMediaStyle(presentation);

  const provider = attrs.provider as string;
  const embedUrl = (attrs.embedUrl ?? attrs.src) as string | null;
  const src = attrs.src as string | null;
  const caption = presentation;

  const player =
    provider === "youtube" || provider === "vimeo" ? (
      embedUrl ? (
        <div className="cms-video-embed">
          <iframe
            src={embedUrl}
            title={presentation.caption || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="cms-video-iframe"
          />
        </div>
      ) : null
    ) : src ? (
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
    ) : null;

  if (!player) return null;

  return (
    <figure
      className={`${classes.figure} cms-media--video`}
      style={style}
      data-alignment={presentation.alignment}
      data-width={presentation.widthPercent}
    >
      <div className={classes.frame}>{player}</div>
      <MediaCaption meta={caption} />
    </figure>
  );
}
