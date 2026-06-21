import { Eye } from "lucide-react";

export default function PreviewBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/95 text-amber-950 text-sm font-medium shadow-md"
    >
      <Eye className="w-4 h-4 shrink-0" aria-hidden />
      <span>Preview mode — this is how your post will look when published</span>
    </div>
  );
}
