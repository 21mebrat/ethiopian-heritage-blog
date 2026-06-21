export default function PostDetailLayout({
    children,
    social,
    popular,
    related,
}: {
    children: React.ReactNode;
    social: React.ReactNode;
    popular: React.ReactNode;
    related: React.ReactNode;
}) {
    return (
        <div className="w-full min-h-screen">
            {/* Outer container for the main content grid — now free to be full width */}
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8 lg:pb-4">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 xl:gap-4">

                    {/* Left: Sticky Social Share - Hidden on mobile */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 flex justify-center">
                            {social}
                        </div>
                    </aside>

                    {/* Middle: Main Post Content + Comments */}
                    <main className="lg:col-span-11 xl:col-span-8">
                        <section className="min-w-0">
                            {children}
                        </section>
                    </main>

                    {/* Right: Popular List - Sticky on Desktop, Below on Mobile/Tablet */}
                    <aside className="hidden md:block lg:col-span-11 xl:col-span-3 space-y-10">
                        <div className="sticky top-24">
                            {popular}
                        </div>
                    </aside>

                </div>

                {/* Bottom: Related Posts */}
                <footer className="pt-6">
                    <h2 className="text-2xl font-serif font-bold mb-6 tracking-tight">You might also like</h2>
                    {related}
                </footer>

            </div>
        </div>
    );
}
