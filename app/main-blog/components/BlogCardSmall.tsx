import Link from "next/link";
import Image from "next/image";
import { IPostPopulated } from "@/app/types";

export default function BlogCardSmall({ post, index }: { post: IPostPopulated; index: number }) {
    const imageUrl = post.coverImage || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200";
    const formattedDate = new Date(post.publishedAt || (post as any).createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    return (
        <Link
            href={`/main-blog/blog/${post.slug}`}
            className="group flex items-start gap-4"
        >
            <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-md">
                <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
            </div>
            <div className="space-y-1 min-w-0">
                <h4 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {post.title}
                </h4>
                <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
        </Link>
    );
}
