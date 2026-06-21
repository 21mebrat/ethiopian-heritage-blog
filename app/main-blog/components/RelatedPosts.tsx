import Link from "next/link";
import Image from "next/image";
import { IPostPopulated } from "@/app/types";

export default function RelatedPosts({ posts }: { posts: IPostPopulated[] }) {
    return (
        <section className="">
            <h3 className="text-lg font-bold">Related Stories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {posts.map((post) => {
                    const imageUrl = post.coverImage || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800";
                    const categoryName = post.category.name;

                    return (
                        <Link
                            key={post.slug}
                            href={`/main-blog/blog/${post.slug}`}
                            className="group flex flex-col gap-3"
                        >
                            <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border">
                                <Image
                                    src={imageUrl}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600">
                                    {categoryName}
                                </span>
                                <h4 className="text-sm font-bold leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
}
