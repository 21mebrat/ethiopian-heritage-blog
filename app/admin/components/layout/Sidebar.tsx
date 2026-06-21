"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/app/context/ui-context";
import { useAuth } from "@/app/context/auth-context";
import {
  LayoutDashboard,
  FileText,
  Image,
  Folder,
  MessageCircle,
  Settings,
  X,
  Menu,
  LogOut,
} from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Posts", href: "/admin/posts", icon: FileText },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Categories", href: "/admin/category", icon: Folder },
  { label: "Comments", href: "/admin/comments", icon: MessageCircle },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { open, setOpen, collapsed, toggleCollapsed } = useSidebar();
  const { user, logout } = useAuth();

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-2xl md:hidden z-40"
        />
      )}

      <aside
        className={`
          fixed
          md:static
          h-screen
          sidebar-glass
          text-white
          transition-all
          duration-500
          ease-in-out
          z-50
          md:z-auto
          flex flex-col
          ${collapsed ? "md:w-20" : "md:w-56"}
          w-56
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between py-6 border-b border-white/5">
          <h1 className={`bg-linear-to-r from-primary to-primary/40 bg-clip-text text-transparent font-black tracking-tighter text-xl ${collapsed ? "hidden" : "px-6 block"}`}>
            HERITAGE
          </h1>
          <div className="flex gap-2">
            <button onClick={toggleCollapsed} className="hidden px-3 cursor-pointer md:block ">
              <Menu className="w-5 h-5" />
            </button>

            <button onClick={() => setOpen(false)} className="md:hidden">
              <X />
            </button>
          </div>
        </div>

        <nav className="space-y-2 w-full flex-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 w-full
                  transition
                  ${isActive ? "bg-muted-foreground/20 text-primary border-r-4 border-r-primary" : "hover:bg-muted-foreground/20 hover:text-primary"}
                `}
              >
                <Icon className="w-5 h-5" />

                <span className={`text-sm font-medium block  md:${collapsed ? "hidden" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom section: User info + Sign Out ── */}
        <div className="border-t border-border/40">
          {/* User info (visible when expanded) */}
          {!collapsed && user && (
            <div className="px-3 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Sign Out */}
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full px-3 py-3
              text-sm text-destructive
              transition-colors cursor-pointer
              hover:bg-destructive/10
              ${collapsed ? "justify-center" : ""}
            `}
            title="Sign out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={`font-medium md:${collapsed ? "hidden" : "block"} block`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}