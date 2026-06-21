import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import { POST_POPULATION } from "@/app/types";
import { estimateReadingTime } from "@/app/lib/reading-time";
import type { BlogPostView } from "@/app/components/blog/types";

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostView | null> {
  await connectDB();

  const post = await Post.findOne({ slug, status: "published" })
    .populate(POST_POPULATION.author)
    .populate(POST_POPULATION.category)
    .lean();

  if (!post) return null;

  const author = post.author as { name?: string; avatar?: string | null } | undefined;
  const category = post.category as { name?: string; slug?: string } | undefined;

  return {
    _id: post._id.toString(),
    title: post.title,
    content: post.content as BlogPostView["content"],
    coverImage: post.coverImage,
    tags: post.tags ?? [],
    publishedAt: post.publishedAt ?? post.createdAt,
    readingTime: post.readingTime || estimateReadingTime(post.content),
    author: author
      ? { name: author.name, avatar: author.avatar ?? null }
      : undefined,
    category: category
      ? { name: category.name, slug: category.slug }
      : undefined,
  };
}
