import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex items-center justify-between pt-10 border-t border-border mt-10">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
                {pages.map((n) => (
                    <button
                        key={n}
                        onClick={() => onPageChange(n)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer ${n === currentPage
                            ? "bg-amber-600 text-white shadow-sm"
                            : "text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        {n}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-background text-sm font-medium hover:bg-stone-900 disabled:opacity-30 disabled:hover:bg-gray-800 transition-all cursor-pointer"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}

