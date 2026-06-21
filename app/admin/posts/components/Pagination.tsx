"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const showEllipsis = totalPages > 5;

  if (showEllipsis) {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage);
      pages.push("...");
      pages.push(totalPages);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
         <span className="text-white/40">Sequence</span>
         <span className="text-primary">{currentPage}</span>
         <span className="h-0.5 w-4 bg-white/10" />
         <span>{totalPages}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="group flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm font-bold text-white transition-all hover:bg-white/[0.06] hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="hidden sm:inline">Prior</span>
        </button>

        <div className="flex items-center gap-2">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={`h-11 w-11 rounded-xl text-sm font-bold transition-all border ${
                page === currentPage
                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                  : "bg-white/[0.03] border-white/5 text-white/40 hover:text-white hover:bg-white/[0.08]"
              } ${page === "..." ? "cursor-default border-none hover:bg-transparent" : "active:scale-90"}`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="group flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm font-bold text-white transition-all hover:bg-white/[0.06] hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
