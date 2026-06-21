import Footer from "../components/Footer"
import PublicHeader from "../components/publicHeader"
import "../components/editor/styles/cms-content.css"

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <PublicHeader />
            <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
                {children}
            </main>
            <Footer />
        </div>
    )
}