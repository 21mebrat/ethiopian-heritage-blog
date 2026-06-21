import Link from "next/link";
import Image from "next/image";
import { IPostPopulated } from "@/app/types";

const CATEGORY_STYLES: Record<string, string> = {
    History: "bg-[#E6F1FB] text-[#0C447C]",
    Heritage: "bg-[#EAF3DE] text-[#27500A]",
    Religious: "bg-[#FAEEDA] text-[#633806]",
};

export default function FeaturedPost({ post }: { post: IPostPopulated }) {
    const categoryName = post.category.name;
    const tagStyle = CATEGORY_STYLES[categoryName] ?? "bg-secondary text-secondary-foreground";
    const imageUrl = post.coverImage
        || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800";
    const href = `/main-blog/blog/${post.slug}`;

    return (
        <article className="group bg-background rounded-xl overflow-hidden flex flex-col">

            {/* Image — fixed height so fill works */}
            <Link href={href} className="relative w-full h-56 sm:h-64 block overflow-hidden shrink-0">
                <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, calc(100vw - 320px)"
                    className="object-cover rounded-md transition-transform duration-500 group-hover:scale-100"
                    priority
                />
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2.5">

                {/* Category badge */}
                <span className={`self-start text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full ${tagStyle}`}>
                    {categoryName}
                </span>

                {/* Title — 2 line clamp */}
                <h2 className="text-base font-medium leading-snug text-foreground line-clamp-2 group-hover:text-foreground/70 transition-colors">
                    <Link href={href}>{post.title}</Link>
                </h2>

                {/* Author row + Read button */}
                <div className="flex items-center gap-3 pt-1 mt-auto">
                    <div className="w-7 h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center text-[10px] font-semibold text-[#0C447C] shrink-0">
                        {(post.author?.name ?? "A").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <Link href={href} className="text-xs font-medium text-foreground truncate  hover:text-amber-600 transition-colors">{post.author?.name}</Link>
                        <span className="text-[11px] text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}