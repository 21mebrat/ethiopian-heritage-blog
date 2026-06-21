"use client";

import type { JSX } from "react";
import type { JSONContent } from "@tiptap/core";
import MediaDisplay from "./MediaDisplay";
import MediaFigure from "./MediaFigure";
import MediaComposite from "./MediaComposite";
import type { CompositeLayout } from "../types/media-schema";
import { normalizeStyle, legacySizeToWidth } from "../lib/presentation";

function renderMarks(text: string, marks?: JSONContent["marks"]) {
  if (!marks?.length) return text;
  let el: React.ReactNode = text;
  for (const mark of marks) {
    if (mark.type === "bold") el = <strong>{el}</strong>;
    if (mark.type === "italic") el = <em>{el}</em>;
    if (mark.type === "strike") el = <s>{el}</s>;
    if (mark.type === "code") el = <code>{el}</code>;
    if (mark.type === "link" && mark.attrs?.href) {
      el = (
        <a href={mark.attrs.href as string} className="cms-link" rel="noopener noreferrer">
          {el}
        </a>
      );
    }
    if (mark.type === "textStyle" && mark.attrs?.color) {
      el = <span style={{ color: mark.attrs.color as string }}>{el}</span>;
    }
  }
  return el;
}

function renderTextContent(node: JSONContent) {
  if (node.type === "text") {
    return renderMarks(node.text ?? "", node.marks);
  }
  if (node.content) {
    return node.content.map((child, i) => (
      <span key={i}>{renderTextContent(child)}</span>
    ));
  }
  return null;
}

const COMPOSITE_LAYOUTS: CompositeLayout[] = [
  "side-left",
  "side-right",
  "stack-top",
  "stack-bottom",
  "float-left",
  "float-right",
];

function mapLegacyCompositeLayout(attrs: Record<string, unknown>): CompositeLayout {
  const layout = attrs.layout as string;
  if (COMPOSITE_LAYOUTS.includes(layout as CompositeLayout)) {
    return layout as CompositeLayout;
  }
  if (layout === "above-text") return "stack-top";
  if (layout === "below-text") return "stack-bottom";
  if (attrs.imageSide === "right") return "side-right";
  return "side-left";
}

export default function ContentNode({ node }: { node: JSONContent }) {
  const attrs = (node.attrs ?? {}) as Record<string, unknown>;
  const children = node.content ?? [];

  switch (node.type) {
    case "paragraph":
      return <p className="cms-p">{children.map((c, i) => <span key={i}>{renderTextContent(c)}</span>)}</p>;

    case "heading": {
      const level = (attrs.level as number) ?? 2;
      const Tag = `h${Math.min(6, Math.max(1, level))}` as keyof JSX.IntrinsicElements;
      return (
        <Tag className={`cms-heading cms-h${level}`}>
          {children.map((c, i) => (
            <span key={i}>{renderTextContent(c)}</span>
          ))}
        </Tag>
      );
    }

    case "bulletList":
      return (
        <ul className="cms-ul">
          {children.map((li, i) => (
            <ContentNode key={i} node={li} />
          ))}
        </ul>
      );

    case "orderedList":
      return (
        <ol className="cms-ol">
          {children.map((li, i) => (
            <ContentNode key={i} node={li} />
          ))}
        </ol>
      );

    case "listItem":
      return (
        <li className="cms-li">
          {children.map((c, i) => (
            <ContentNode key={i} node={c} />
          ))}
        </li>
      );

    case "blockquote":
      return (
        <blockquote className="cms-blockquote">
          {children.map((c, i) => (
            <ContentNode key={i} node={c} />
          ))}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre className="cms-code-block">
          <code>{node.content?.[0]?.text ?? ""}</code>
        </pre>
      );

    case "horizontalRule":
      return <hr className="cms-hr" />;

    case "image":
    case "imageBlock": {
      const src = (attrs.src as string) ?? "";
      if (!src) return null;
      return <MediaDisplay attrs={attrs} mediaType="image" />;
    }

    case "video":
    case "videoBlock":
      return <MediaDisplay attrs={attrs} mediaType="video" />;

    case "galleryBlock": {
      const items = (attrs.items as { id: string; src: string; alt?: string; caption?: string }[]) ?? [];
      const layout = (attrs.layout as string) ?? "grid-2";
      return (
        <figure className={`cms-gallery cms-gallery--${layout}`} data-layout={layout}>
          <div className="cms-gallery-grid">
            {items.map((item) => (
              <div key={item.id} className="cms-gallery-cell">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt ?? ""} className="cms-gallery-img" loading="lazy" />
                {item.caption && <span className="cms-gallery-cell-caption">{item.caption}</span>}
              </div>
            ))}
          </div>
          {attrs.caption && (
            <figcaption className="cms-media-caption">{attrs.caption as string}</figcaption>
          )}
        </figure>
      );
    }

    case "calloutBlock": {
      const variant = (attrs.variant as string) ?? "info";
      return (
        <aside className={`cms-callout cms-callout--${variant}`}>
          <span className="cms-callout-emoji">{(attrs.emoji as string) || "💡"}</span>
          <div className="cms-callout-body cms-prose">
            {children.map((c, i) => (
              <ContentNode key={i} node={c} />
            ))}
          </div>
        </aside>
      );
    }

    case "heroBlock": {
      const src = attrs.src as string | null;
      if (!src) return null;
      return (
        <section className={`cms-hero cms-hero--${attrs.height ?? "lg"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="cms-hero-bg" />
          {attrs.overlay !== false && <div className="cms-hero-overlay" />}
          <div className="cms-hero-content">
            {attrs.title && <h2 className="cms-hero-title">{attrs.title as string}</h2>}
            {attrs.subtitle && <p className="cms-hero-subtitle">{attrs.subtitle as string}</p>}
          </div>
        </section>
      );
    }

    case "mediaTextBlock":
      return (
        <MediaComposite
          layout={mapLegacyCompositeLayout(attrs)}
          imageSrc={(attrs.imageSrc as string) ?? null}
          attrs={{
            ...attrs,
            style: normalizeStyle((attrs.imageStyle ?? attrs.style) as string),
            widthPercent: attrs.widthPercent ?? legacySizeToWidth(attrs.imageSize as string),
          }}
          content={children}
        />
      );

    default:
      if (children.length) {
        return (
          <>
            {children.map((c, i) => (
              <ContentNode key={i} node={c} />
            ))}
          </>
        );
      }
      return null;
  }
}
