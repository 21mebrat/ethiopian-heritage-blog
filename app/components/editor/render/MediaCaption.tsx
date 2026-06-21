import type { MediaCaptionMeta } from "../types/media-schema";

export default function MediaCaption({ meta }: { meta: MediaCaptionMeta }) {
  if (!meta.caption && !meta.credit) return null;

  return (
    <figcaption className="cms-media-caption">
      {meta.caption && <span className="cms-media-caption-text">{meta.caption}</span>}
      {meta.credit && (
        <span className="cms-media-credit">
          {meta.photographer && <span>{meta.photographer} · </span>}
          {meta.credit}
          {meta.sourceUrl && (
            <a
              href={meta.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cms-media-source"
            >
              Source
            </a>
          )}
        </span>
      )}
    </figcaption>
  );
}
