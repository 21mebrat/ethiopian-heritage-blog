import Link from "next/link";
import Image from "next/image";
import { IPostPopulated } from "@/app/types";

const CATEGORY_STYLES: Record<string, string> = {
    History: "bg-[#E6F1FB] text-[#0C447C]",
    Heritage: "bg-[#EAF3DE] text-[#27500A]",
    Religious: "bg-[#FAEEDA] text-[#633806]",
};

export default function BlogCard({ post }: { post: IPostPopulated }) {
    const href = `/main-blog/blog/${post.slug}`;
    const categoryName = post.category.name;
    const tagStyle = CATEGORY_STYLES[categoryName] ?? "bg-secondary text-secondary-foreground";
    const imageUrl = post.coverImage
        || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800";

    const formattedDate = new Date(post.publishedAt || (post as any).createdAt).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });
    const readTime = post.readingTime ? `${post.readingTime} min` : null;

    return (
        <article className="group bg-background rounded-xl overflow-hidden flex flex-col hover:border-border/60 transition-colors">

            {/* 1. Pure image — no overlay */}
            <Link href={href} className="relative w-full h-44 block overflow-hidden shrink-0">
                <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform rounded-md duration-500 group-hover:scale-100"
                />
            </Link>

            {/* 2. Content below image */}
            <div className="p-3 flex flex-col gap-2 flex-1">

                {/* 2a. Category badge */}
                <span className={`self-start text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full ${tagStyle}`}>
                    {categoryName}
                </span>

                {/* 2b. Title */}
                <h3 className="text-lg font-medium leading-snug text-foreground line-clamp-2 group-hover:text-amber-500 transition-colors">
                    <Link href={href}>{post.title}</Link>
                </h3>

                {/* 2c. Date · read time */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-auto">
                    <span>{formattedDate}</span>
                    {readTime && (
                        <>
                            <span className="opacity-30">·</span>
                            <span>{readTime}</span>
                        </>
                    )}
                </div>

            </div>
        </article>
    );
}