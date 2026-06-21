import { Suspense } from "react";
import BlogArticleSkeleton from "@/app/components/blog/BlogArticleSkeleton";
import PreviewClient from "./PreviewClient";

export default function PreviewPage() {
  return (
    <Suspense fallback={<BlogArticleSkeleton />}>
      <PreviewClient />
    </Suspense>
  );
}
