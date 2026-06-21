import { IPostPopulated } from "@/app/types";
import BlogCardSmall from "./BlogCardSmall";

export default function PopularSidebar({ posts }: { posts: IPostPopulated[] }) {
    return (
        <aside className="flex w-full flex-col gap-4">

            {/* Popular posts */}
            <div className="bg-background rounded-xl overflow-hidden">

                {/* Header */}
                <div className="px-4 py-3">
                    <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-muted-foreground">
                        Popular posts
                    </p>
                </div>

                {/* List */}
                <div className="grid gap-1.5">
                    {posts.map((post, idx) => (
                        <BlogCardSmall key={post.slug} post={post} index={idx} />
                    ))}
                </div>

            </div>
        </aside>
    );
}