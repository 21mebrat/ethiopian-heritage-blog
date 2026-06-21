import { NextResponse } from "next/server";
import { getPublishedPostBySlug } from "@/app/lib/posts";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const post = await getPublishedPostBySlug(slug);

        if (!post) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: post });
    } catch (err: any) {
        console.error("GET_POST_BY_SLUG_ERROR:", err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}
