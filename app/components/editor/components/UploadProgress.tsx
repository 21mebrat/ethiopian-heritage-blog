"use client";

import { AlertCircle, RotateCcw, Upload } from "lucide-react";
import type { UploadStatus } from "../types/blocks";

interface UploadProgressProps {
  status: UploadStatus;
  progress: number;
  error?: string | null;
  onRetry?: () => void;
  label?: string;
}

export default function UploadProgress({
  status,
  progress,
  error,
  onRetry,
  label = "Uploading",
}: UploadProgressProps) {
  if (status === "idle" || status === "success") return null;

  if (status === "error") {
    return (
      <div className="cms-upload-state cms-upload-error">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Upload failed</p>
          <p className="text-xs opacity-80 truncate">{error ?? "Unknown error"}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="cms-btn-icon"
            title="Retry upload"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="cms-upload-state">
      <Upload className="w-5 h-5 shrink-0 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>{label}…</span>
          <span>{progress}%</span>
        </div>
        <div className="cms-progress-track">
          <div
            className="cms-progress-bar"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
