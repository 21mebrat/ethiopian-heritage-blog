export default function ListingLayout({
    children,
    featured,
    sidebar,
    modal,
}: {
    children: React.ReactNode;
    featured: React.ReactNode;
    sidebar: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* Two-column: [left] [right sidebar] */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-5 items-start">

                {/* LEFT COLUMN */}
                <div className="min-w-0 flex flex-col gap-5">

                    {/* @featured — full width of left column */}
                    {featured}

                    {/* Main Content */}
                    {children}

                </div>

                {/* RIGHT COLUMN — sticky sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-[80px]">
                        {sidebar}
                    </div>
                </aside>

            </div>

            {/* @modal overlay */}
            {modal}

        </div>
    );
}