// "use client";

// import { useEffect } from "react";
// import PostModal from "../../../../components/PostModal";
// import PostBody from "../../../../components/PostBody";
// import { useBlog } from "@/app/context/blog-context";
// import { useParams } from "next/navigation";

// export default function PostInterceptPage() {
//     const { currentPost, isLoading, error, fetchPostBySlug } = useBlog();
//     const params = useParams();
//     const slug = params?.slug as string;

//     useEffect(() => {
//         if (slug) {
//             fetchPostBySlug(slug);
//         }
//     }, [slug, fetchPostBySlug]);

//     if (isLoading) {
//         return (
//             <PostModal>
//                 <div className="flex items-center justify-center min-h-[400px]">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
//                 </div>
//             </PostModal>
//         );
//     }

//     if (error || !currentPost) {
//         return (
//             <PostModal>
//                 <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
//                     <p className="text-destructive font-medium">{error || "Post not found"}</p>
//                 </div>
//             </PostModal>
//         );
//     }

//     // Map DB post to PostBody props
//     const postData = {
//         title: currentPost.title,
//         image: currentPost.coverImage || "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=1200",
//     };

//     return (
//         <PostModal>
//             <PostBody {...postData} />
//         </PostModal>
//     );
// }

