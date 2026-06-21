import { notFound } from "next/navigation";
import BlogArticle from "@/app/components/blog/BlogArticle";
import { getPublishedPostBySlug } from "@/app/lib/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function HeritagePostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogArticle post={post} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.tags?.slice(0, 3).join(", ") || undefined,
  };
}
