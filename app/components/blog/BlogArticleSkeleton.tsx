export default function BlogArticleSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse" aria-busy aria-label="Loading article">
      <div className="h-12 bg-muted/40 border-b border-border" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="space-y-4">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-10 sm:h-12 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="aspect-[21/9] bg-muted rounded-2xl" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-muted rounded"
              style={{ width: `${85 - (i % 3) * 12}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
