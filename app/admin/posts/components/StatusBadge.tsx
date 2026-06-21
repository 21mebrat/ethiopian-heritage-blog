import { PostStatus } from "@/app/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PostStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        status === "published"
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        className
      )}
    >
      {status === "published" ? (
        <>
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
          Published
        </>
      ) : (
        <>
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-gray-600 dark:bg-gray-400" />
          Draft
        </>
      )}
    </span>
  );
}
