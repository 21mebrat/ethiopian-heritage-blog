"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export default function PostModal({ children }: { children: ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-8">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => router.back()}
            />

            {/* Panel */}
            <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 26, stiffness: 260 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            >
                <button
                    onClick={() => router.back()}
                    className="absolute right-5 top-5 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border hover:bg-muted transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {children}
            </motion.div>
        </div>
    );
}
