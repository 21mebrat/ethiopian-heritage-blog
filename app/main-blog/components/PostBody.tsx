import Image from "next/image";
import Link from "next/link";
import ReaderContent from "@/app/components/ReaderContent";

const CATEGORY_STYLES: Record<string, string> = {
    History: "bg-[#E6F1FB] text-[#0C447C]",
    Heritage: "bg-[#EAF3DE] text-[#27500A]",
    Religious: "bg-[#FAEEDA] text-[#633806]",
};

interface PostBodyProps {
    title: string;
    category: string;
    categoryHref?: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    content: any;
    quote?: string;
}

export default function PostBody({
    title,
    category,
    categoryHref,
    author,
    date,
    readTime,
    image,
    content,
    quote,
}: PostBodyProps) {
    const tagStyle = CATEGORY_STYLES[category] ?? "bg-secondary text-secondary-foreground";

    return (
        <article className="bg-background rounded-xl overflow-hidden">
            {/* Category breadcrumb */}
            <div>
                <Link
                    href={categoryHref ?? `/main-blog?category=${category.toLowerCase()}`}
                    className={`text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full ${tagStyle}`}
                >
                    {category}
                </Link>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-medium leading-snug tracking-tight text-foreground mt-4">
                {title}
            </h1>

            {/* Author · Date · Read time */}
            <p className="text-[11px] text-muted-foreground pb-5 border-b border-border mb-6">
                By <span className="text-foreground font-medium">{author}</span>
                {" · "}{date}
                {" · "}{readTime}
            </p>
            {/* Hero image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="100vw"
                    className="object-cover rounded-md"
                    priority
                />
            </div>

            <div className="py-8">
                {/* Rich Content rendering */}
                <ReaderContent content={content} />

                {/* Pull quote */}
                {quote && (
                    <blockquote className="border-l-2 border-border pl-5 my-6">
                        <p className="text-base font-medium italic text-foreground/60 leading-relaxed">
                            "{quote}"
                        </p>
                    </blockquote>
                )}
            </div>
        </article>
    );
}