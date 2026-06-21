"use client";

import { useCallback, useRef } from "react";

export interface MediaResizeDimensions {
  widthPercent?: number;
  heightPx?: number | null;
}

interface MediaResizeHandlesProps {
  hostRef: React.RefObject<HTMLElement | null>;
  widthPercent: number;
  heightPx: number | null;
  onResize: (dims: MediaResizeDimensions) => void;
  disabled?: boolean;
}

export default function MediaResizeHandles({
  hostRef,
  widthPercent,
  heightPx,
  onResize,
  disabled,
}: MediaResizeHandlesProps) {
  const startRef = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
    widthPercent: number;
    heightPx: number | null;
    edge: string;
    containerWidth: number;
  } | null>(null);

  const getContainerWidth = useCallback(() => {
    const host = hostRef.current;
    if (!host) return window.innerWidth;
    const prose = host.closest(".cms-prose-surface");
    return prose?.clientWidth ?? host.parentElement?.clientWidth ?? window.innerWidth;
  }, [hostRef]);

  const onPointerDown = useCallback(
    (edge: string) => (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      const host = hostRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startRef.current = {
        x: e.clientX,
        y: e.clientY,
        w: rect.width,
        h: rect.height,
        widthPercent,
        heightPx,
        edge,
        containerWidth: getContainerWidth(),
      };
    },
    [disabled, getContainerWidth, heightPx, hostRef, widthPercent]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startRef.current) return;
      const s = startRef.current;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      const patch: MediaResizeDimensions = {};

      if (s.edge.includes("e") || s.edge.includes("w")) {
        let newW = s.w;
        if (s.edge.includes("e")) newW += dx;
        if (s.edge.includes("w")) newW -= dx;
        const pct = Math.min(100, Math.max(15, Math.round((newW / s.containerWidth) * 100)));
        patch.widthPercent = pct;
      }

      if (s.edge.includes("s") || s.edge.includes("n")) {
        let newH = s.h;
        if (s.edge.includes("s")) newH += dy;
        if (s.edge.includes("n")) newH -= dy;
        patch.heightPx = Math.min(1200, Math.max(80, Math.round(newH)));
      }

      if (Object.keys(patch).length > 0) onResize(patch);
    },
    [onResize]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    startRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  if (disabled) return null;

  const handleClass =
    "cms-resize-handle absolute z-30 bg-white border border-stone-300 shadow-md rounded-sm pointer-events-auto touch-none";

  return (
    <div
      className="cms-resize-handles absolute inset-0 z-20 pointer-events-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className={`${handleClass} left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-8 cursor-ew-resize`}
        onPointerDown={onPointerDown("w")}
      />
      <div
        className={`${handleClass} right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-8 cursor-ew-resize`}
        onPointerDown={onPointerDown("e")}
      />
      <div
        className={`${handleClass} top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2.5 cursor-ns-resize`}
        onPointerDown={onPointerDown("n")}
      />
      <div
        className={`${handleClass} bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-2.5 cursor-ns-resize`}
        onPointerDown={onPointerDown("s")}
      />
      <div
        className={`${handleClass} left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 cursor-nwse-resize`}
        onPointerDown={onPointerDown("nw")}
      />
      <div
        className={`${handleClass} right-0 top-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 cursor-nesw-resize`}
        onPointerDown={onPointerDown("ne")}
      />
      <div
        className={`${handleClass} left-0 bottom-0 -translate-x-1/2 translate-y-1/2 w-3 h-3 cursor-nesw-resize`}
        onPointerDown={onPointerDown("sw")}
      />
      <div
        className={`${handleClass} right-0 bottom-0 translate-x-1/2 translate-y-1/2 w-3 h-3 cursor-nwse-resize`}
        onPointerDown={onPointerDown("se")}
      />
    </div>
  );
}
