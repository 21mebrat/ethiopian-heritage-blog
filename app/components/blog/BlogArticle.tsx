import Image from "next/image";
import BlogRenderer from "./BlogRenderer";
import PreviewBanner from "./PreviewBanner";
import type { BlogPostView } from "./types";

interface BlogArticleProps {
  post: BlogPostView;
  isPreview?: boolean;
}

function formatDate(date: string | Date | null | undefined) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogArticle({ post, isPreview = false }: BlogArticleProps) {
  const formattedDate = formatDate(post.publishedAt);
  const readingTime = post.readingTime ?? 1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isPreview && <PreviewBanner />}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 pb-24">
        <header className="mb-8 sm:mb-10 space-y-4">
          {post.category?.name && (
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {post.category.name}
            </p>
          )}

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-foreground">
            {post.title || "Untitled"}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {post.author?.name && (
              <span className="font-medium text-foreground/80">{post.author.name}</span>
            )}
            {formattedDate && (
              <>
                <span className="text-border" aria-hidden>
                  ·
                </span>
                <time dateTime={new Date(post.publishedAt!).toISOString()}>
                  {formattedDate}
                </time>
              </>
            )}
            <span className="text-border" aria-hidden>
              ·
            </span>
            <span>{readingTime} min read</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {post.coverImage && (
          <figure className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden mb-10 sm:mb-12 border border-border shadow-lg">
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </figure>
        )}

        <div className="blog-content w-full overflow-x-hidden">
          <BlogRenderer content={post.content} />
        </div>
      </article>
    </div>
  );
}
