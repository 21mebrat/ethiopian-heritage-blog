import React from "react";
import { buildMediaClasses } from "./editor/lib/presentation";
import { isCompositeLayout } from "./editor/lib/media-attrs";

interface ReaderContentProps {
  content: any;
}

export default function ReaderContent({ content }: ReaderContentProps) {
  if (!content) return null;

  // If content is a string (legacy or already HTML), we might want to handle it
  // But for this request, it's Tiptap JSON.
  const nodes = Array.isArray(content) ? content : content.content || [];

  return (
    <div className="cms-document cms-prose">
      {nodes.map((node: any, idx: number) => (
        <RenderNode key={idx} node={node} />
      ))}
    </div>
  );
}

function RenderNode({ node }: { node: any }) {
  if (!node) return null;

  switch (node.type) {
    case "paragraph":
      return (
        <p className="cms-p">
          <RenderMarks node={node} />
        </p>
      );

    case "heading": {
      const level = node.attrs?.level || 1;
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag className={`cms-heading cms-h${level}`}>
          <RenderMarks node={node} />
        </Tag>
      );
    }

    case "imageBlock": {
      const a = node.attrs || {};
      const { figure } = buildMediaClasses({
        alignment: a.alignment || "center",
        widthPercent: a.widthPercent || 100,
        style: a.style || "none",
        aspectRatio: a.aspectRatio || "auto",
        alt: a.alt || "",
        caption: a.caption || "",
        credit: a.credit || "",
        photographer: a.photographer || "",
        sourceUrl: a.sourceUrl || "",
      }, a.layout || "default");

      const styles: React.CSSProperties = {
        width: a.widthPercent ? `${a.widthPercent}%` : "100%",
        aspectRatio: a.aspectRatio && a.aspectRatio !== "auto" ? a.aspectRatio : undefined
      };

      return (
        <figure className={figure} style={styles}>
          <div className="cms-media-frame">
            <img src={a.src} alt={a.alt || ""} className="cms-media-img" />
          </div>
          {a.caption && (
            <figcaption className="cms-media-caption">
              <span className="cms-media-caption-text">{a.caption}</span>
            </figcaption>
          )}
        </figure>
      );
    }

    case "videoBlock": {
      const a = node.attrs || {};
      const { figure } = buildMediaClasses({
        alignment: a.alignment || "center",
        widthPercent: a.widthPercent || 100,
        style: a.style || "none",
        aspectRatio: a.aspectRatio || "auto",
        alt: "",
        caption: a.caption || "",
        credit: "",
        photographer: "",
        sourceUrl: "",
      }, "default");

      const styles: React.CSSProperties = {
        width: a.widthPercent ? `${a.widthPercent}%` : "100%",
        aspectRatio: a.aspectRatio && a.aspectRatio !== "auto" ? a.aspectRatio : "16/9"
      };

      return (
        <figure className={`${figure} cms-media--video`} style={styles}>
          <div className="cms-media-frame">
            {a.provider === "youtube" || a.provider === "vimeo" ? (
              <div className="cms-video-embed">
                <iframe src={a.embedUrl || a.src} className="cms-video-iframe" allowFullScreen />
              </div>
            ) : (
              <video src={a.src} controls className="cms-video-native" />
            )}
          </div>
          {a.caption && (
            <figcaption className="cms-media-caption">
              <span className="cms-media-caption-text">{a.caption}</span>
            </figcaption>
          )}
        </figure>
      );
    }

    case "mediaTextBlock": {
      const a = node.attrs || {};
      const layout = a.layout || "side-left";
      return (
        <div className={`cms-composite cms-composite--${layout}`}>
          <div className="cms-composite-media">
            <RenderNode node={{
              type: "imageBlock",
              attrs: {
                src: a.imageSrc,
                alignment: "center",
                widthPercent: 100,
                style: a.imageStyle || a.style
              }
            }} />
          </div>
          <div className="cms-composite-body">
            {node.content?.map((child: any, i: number) => (
              <RenderNode key={i} node={child} />
            ))}
          </div>
        </div>
      );
    }

    case "section": {
      const layout = node.attrs?.layout || "1-1";
      return (
        <div className={`cms-section cms-section--${layout}`}>
          {node.content?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </div>
      );
    }

    case "column": {
      return (
        <div className="cms-column">
          {node.content?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </div>
      );
    }

    case "bulletList":
      return (
        <ul className="cms-ul">
          {node.content?.map((item: any, i: number) => (
            <li key={i}>{item.content?.map((c: any, j: number) => <RenderNode key={j} node={c} />)}</li>
          ))}
        </ul>
      );

    case "orderedList":
      return (
        <ol className="cms-ol">
          {node.content?.map((item: any, i: number) => (
            <li key={i}>{item.content?.map((c: any, j: number) => <RenderNode key={j} node={c} />)}</li>
          ))}
        </ol>
      );

    case "blockquote":
      return (
        <blockquote className="cms-blockquote">
          {node.content?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </blockquote>
      );

    case "horizontalRule":
      return <hr className="cms-hr" />;

    case "hardBreak":
      return <br />;

    default:
      if (node.content) {
        return (
          <>
            {node.content.map((child: any, i: number) => (
              <RenderNode key={i} node={child} />
            ))}
          </>
        );
      }
      return null;
  }
}


function RenderMarks({ node }: { node: any }) {
  if (!node.content) return null;
  return (
    <>
      {node.content.map((contentNode: any, i: number) => {
        let element = <>{contentNode.text}</>;

        if (contentNode.marks) {
          contentNode.marks.forEach((mark: any) => {
            if (mark.type === "bold") element = <strong>{element}</strong>;
            if (mark.type === "italic") element = <em>{element}</em>;
            if (mark.type === "link") element = <a href={mark.attrs.href} className="cms-link" target="_blank" rel="noopener noreferrer">{element}</a>;
            if (mark.type === "textStyle" && mark.attrs.color) element = <span style={{ color: mark.attrs.color }}>{element}</span>;
          });
        }

        return <React.Fragment key={i}>{element}</React.Fragment>;
      })}
    </>
  );
}
