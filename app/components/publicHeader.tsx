"use client";

import { Menu, Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAppContext } from "../context/ui-context";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";



/* =========================
   SEARCH INPUT
========================= */
function SearchInput({
    value,
    onChange,
    autoFocus = false,
}: {
    value: string;
    onChange: (v: string) => void;
    autoFocus?: boolean;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus) inputRef.current?.focus();
    }, [autoFocus]);

    return (
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search the archive…"
                className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm outline-none focus:border-ring transition-all"
            />
        </div>
    );
}

/* =========================
   CONSTANTS
========================= */
const CATEGORIES = [
    { label: "All", value: "all" },
    { label: "History", value: "history" },
    { label: "Heritage", value: "heritage" },
    { label: "Religious", value: "religious" },
];

/* =========================
   HEADER
========================= */
export default function PublicHeader() {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const {
        search,
        setSearch,
        category,
        setCategory,
        open: sidebarOpen,
        setOpen: setSidebarOpen,
    } = useAppContext();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleCancelSearch = () => {
        setSearch("");
        setMobileSearchOpen(false);
    };

    return (
        <>
            <header
                className={`sticky top-0 z-50 w-full md:px-16 transition-all duration-300 ${scrolled
                    ? "bg-background/95 backdrop-blur-xl shadow-sm"
                    : "bg-background/85 backdrop-blur-md"
                    }`}
            >
                <div className="h-16 flex items-center px-4">

                    {/* ── MOBILE (< sm) ── */}
                    <div className="flex sm:hidden w-full items-center">
                        <AnimatePresence mode="wait" initial={false}>

                            {/* Default: (menu + logo) | search icon */}
                            {!mobileSearchOpen ? (
                                <motion.div
                                    key="default"
                                    className="flex w-full items-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSidebarOpen(true)}
                                            aria-label="Open menu"
                                            className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                                        >
                                            <Menu className="h-5 w-5" />
                                        </button>

                                        <Image
                                            src="/logo.png"
                                            alt="Ethio Archives Logo"
                                            width={32}
                                            height={32}
                                            className="object-contain"
                                        />
                                    </div>

                                    <button
                                        onClick={() => setMobileSearchOpen(true)}
                                        aria-label="Open search"
                                        className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors ml-auto"
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            ) : (
                                /* Search: input | cancel icon */
                                <motion.div
                                    key="search"
                                    className="flex w-full items-center gap-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="flex-1">
                                        <SearchInput
                                            value={search}
                                            onChange={setSearch}
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        onClick={handleCancelSearch}
                                        aria-label="Cancel search"
                                        className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── DESKTOP (≥ sm) ── */}
                    <div className="hidden sm:flex w-full items-center gap-4">

                        {/* Left: logo + wordmark */}
                        <div className="flex items-center gap-2.5 shrink-0">
                            <Image
                                src="/logo.png"
                                alt="Ethio Archives Logo"
                                width={44}
                                height={44}
                                className="object-contain"
                            />
                            <div className="flex flex-col leading-none">
                                <span className="font-semibold text-sm tracking-wide text-foreground">
                                    Ethio Archives
                                </span>
                                <span className="text-[10px] tracking-widest uppercase text-muted-foreground mt-0.5">
                                    Cultural Heritage
                                </span>
                            </div>
                        </div>

                        <div className="w-px h-6 bg-border shrink-0" />

                        {/* Right: category select + search */}
                        <div className="flex items-center gap-3 ml-auto">
                            <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                                <SelectTrigger className="w-fit border-none h-10">
                                    <SelectValue placeholder="Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {CATEGORIES.map((c) => (
                                            <SelectItem key={c.value} value={c.value}>
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <div className="w-72">
                                <SearchInput value={search} onChange={setSearch} />
                            </div>
                        </div>
                    </div>

                </div>
            </header>

            {/* Spacer - minimized */}
            <div className="h-4" />

            {/* ── SIDEBAR ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            key="backdrop"
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                        />

                        <motion.aside
                            key="drawer"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 260 }}
                            className="fixed left-0 top-0 w-[264px] h-full bg-background border-r border-border z-50"
                        >
                            {/* Drawer header */}
                            <div className="h-16 px-4 flex items-center justify-between border-b border-border">
                                <div className="flex items-center gap-2.5">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                    <span className="font-semibold text-sm">Browse</span>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Close menu"
                                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Category nav */}
                            <nav className="p-3 space-y-0.5">
                                <button
                                    onClick={() => { setCategory("all"); setSidebarOpen(false); }}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${category === "all"
                                        ? "bg-secondary text-secondary-foreground font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    All
                                </button>
                                {CATEGORIES.map((c) => (
                                    <button
                                        key={c.value}
                                        onClick={() => { setCategory(c.value); setSidebarOpen(false); }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${category === c.value
                                            ? "bg-secondary text-secondary-foreground font-medium"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}