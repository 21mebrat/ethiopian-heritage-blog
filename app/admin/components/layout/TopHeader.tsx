"use client";

import { useSidebar } from "@/app/context/ui-context";
import { useAuth } from "@/app/context/auth-context";
import {
  Bell,
  Menu,
  Search,
  X,
  User,
  LogOut,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  link?: string;
}

export default function TopHeader() {
  const { open, setOpen } = useSidebar();
  const { user: authUser, isLoading: authLoading, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Listen for logout events from child components (ProfileDropdown)
  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [logout]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const lastCheckedId = useRef<string | null>(null);

  const fetchNotifications = useCallback(async (isFirstLoad = false) => {
    try {
      const res = await fetch("/api/admin/notifications/recent-comments");
      const data = await res.json();
      if (data.success) {
        const newNotifications = data.data;
        setNotifications(newNotifications);

        // Browser notification logic
        if (!isFirstLoad && newNotifications.length > 0) {
          const newest = newNotifications[0];
          if (newest.id !== lastCheckedId.current) {
            lastCheckedId.current = newest.id;
            if (Notification.permission === "granted") {
              new window.Notification(newest.title, {
                body: newest.message,
                icon: "/favicon.ico"
              });
            }
          }
        } else if (isFirstLoad && newNotifications.length > 0) {
          lastCheckedId.current = newNotifications[0].id;
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  useEffect(() => {
    // Request permission on mount
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    fetchNotifications(true);
    const interval = setInterval(() => fetchNotifications(), 30000); // 30s poll
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen]);

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsMobileSearchOpen(false);
      }
    };

    if (isMobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSearchOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Real user data from auth context
  const user: UserData = {
    name: authUser?.name ?? (authLoading ? "Loading..." : "Guest"),
    email: authUser?.email ?? "",
    avatar: authUser?.avatar ?? undefined,
    role: authUser?.role === "admin" ? "Administrator" : authUser?.role === "author" ? "Author" : undefined,
  };

  return (
    <header
      className="
        sticky top-0 z-50
        flex h-16 items-center justify-between
        header-glass
        px-6 md:px-10
      "
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* MOBILE SIDEBAR TOGGLER */}
        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center justify-center
            h-9 w-9
            rounded-lg
            text-white/80
            cursor-pointer
            transition-all duration-200
            hover:bg-white/10
            hover:text-white
            md:hidden
            focus:outline-none
            focus:ring-2
            focus:ring-primary/20
            active:scale-95
          "
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* DESKTOP SEARCH */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <DesktopSearchBar />
        </div>

        {/* MOBILE SEARCH TRIGGER */}
        {!isMobileSearchOpen && (
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="
              sm:hidden
              flex items-center justify-center
              h-9 w-9
              rounded-lg
              text-white/80
              hover:bg-white/10
              transition-colors
              active:scale-95
            "
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        {/* MOBILE SEARCH OVERLAY */}
        {isMobileSearchOpen && (
          <div
            ref={mobileSearchRef}
            className="
              absolute left-0 top-0 z-50
              flex h-16 w-full items-center
              bg-[#0a0a0a]/95
              px-4
              backdrop-blur-xl
              animate-in slide-in-from-top-2 fade-in
              duration-200
              md:hidden
            "
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <MobileSearchBar onClose={() => setIsMobileSearchOpen(false)} />
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="
                ml-2 flex h-9 w-9 items-center justify-center
                rounded-lg
                text-white/40
                hover:bg-white/10
                hover:text-white
                transition-colors
              "
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* NOTIFICATIONS */}
        <div className="relative" ref={notificationsRef}>
          <ActionButton
            icon={Bell}
            label="Notifications"
            badge={unreadCount}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          />

          {/* NOTIFICATIONS DROPDOWN */}
          {isNotificationsOpen && (
            <NotificationsDropdown
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
              onClose={() => setIsNotificationsOpen(false)}
            />
          )}
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={profileRef}>
          <button
            className="
              flex items-center gap-2
              rounded-full
              transition-all duration-200
              hover:bg-primary
              hover:text-primary-foreground
              focus:outline-none
              focus:ring-2
              focus:ring-primary/20
              active:scale-95
              p-1
            "
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Open profile menu"
            aria-expanded={isProfileOpen}
          >
            <ProfileAvatar user={user} />
          </button>

          {/* PROFILE DROPDOWN MENU */}
          {isProfileOpen && (
            <ProfileDropdown user={user} onClose={() => setIsProfileOpen(false)} />
          )}
        </div>
      </div>
    </header>
  );
}

// NOTIFICATIONS DROPDOWN - FIXED FOR MOBILE
interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function NotificationsDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClose,
}: NotificationsDropdownProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div
        className="
          fixed md:absolute
          left-4 right-4 md:left-auto md:right-0
          top-[4rem] md:top-full
          mt-0 md:mt-2
          w-auto md:w-96
          max-h-[calc(100vh-6rem)]
          rounded-xl
          border border-white/20
          bg-[#0a0a0a]/80
          backdrop-blur-xl
          shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          animate-in fade-in slide-in-from-top-2
          duration-200
          overflow-hidden
          z-50
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="h-12 w-12 text-white/10 mb-3" />
              <p className="text-sm text-white/40">No notifications</p>
              <p className="text-xs text-white/20 mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  group relative border-b border-white/5 last:border-0
                  transition-all duration-200 hover:bg-white/5
                  ${!notification.read ? "bg-primary/5" : ""}
                `}
              >
                <button
                  onClick={() => {
                    if (!notification.read) {
                      onMarkAsRead(notification.id);
                    }
                    if (notification.link) {
                      window.location.href = notification.link;
                      onClose();
                    }
                  }}
                  className="w-full text-left p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* ICON */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${!notification.read ? "text-white" : "text-white/60"}`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-primary" />
                          )}
                        </p>
                        <span className="text-[10px] text-white/30 flex-shrink-0 whitespace-nowrap mt-1">
                          {getTimeAgo(notification.time)}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </button>

                {/* DELETE BUTTON (on hover) */}
                <button
                  onClick={() => onDelete(notification.id)}
                  className="
                    absolute right-2 top-11 -translate-y-1/2
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    p-1.5 rounded-lg
                    hover:bg-red-400/10 cursor-pointer
                    text-white/20 hover:text-red-400
                  "
                  aria-label="Delete notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER (optional) */}
        {notifications.length > 0 && (
          <div className="border-t border-white/5 px-4 py-2.5 text-center">
            <button
              onClick={() => {
                window.location.href = '/admin/comments';
                onClose();
              }}
              className="text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer"
            >
              View all notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}


// DESKTOP SEARCH BAR
function DesktopSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Implement debounced search logic here
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearch}
      onKeyDown={handleKeyDown}
      placeholder="Search..."
      className="
        h-10 w-full
        rounded-xl
        border border-white/10
        bg-white/5
        pl-10 pr-4
        text-sm text-white
        placeholder:text-white/20
        transition-all duration-300
        outline-none
        focus:bg-white/10
        focus:border-primary/40
        focus:shadow-[0_0_15px_rgba(212,165,116,0.1)]
      "
    />
  );
}

// MOBILE SEARCH BAR
interface MobileSearchBarProps {
  onClose: () => void;
}

function MobileSearchBar({ onClose }: MobileSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      onClose();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={searchQuery}
      onChange={handleSearch}
      onKeyDown={handleKeyDown}
      placeholder="Search..."
      className="
        h-11 w-full
        rounded-xl
        border border-white/10
        bg-white/5
        backdrop-blur-md
        pl-10 pr-4
        text-sm text-foreground
        placeholder:text-muted-foreground/60
        outline-none
        focus:bg-white/10
        focus:border-primary/40
      "
    />
  );
}

// PROFILE AVATAR
interface ProfileAvatarProps {
  user: UserData;
}

function ProfileAvatar({ user }: ProfileAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative h-8 w-8 md:h-9 md:w-9">
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          className="rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-primary/20"
          sizes="(max-width: 768px) 32px, 36px"
        />
      ) : (
        <div
          className="
            flex h-full w-full items-center justify-center
            rounded-full
            bg-gradient-to-br from-primary/20 to-primary/10
            text-sm font-semibold text-primary
            ring-2 ring-transparent
            transition-all duration-200
            group-hover:ring-primary/20
          "
        >
          {getInitials(user.name)}
        </div>
      )}
    </div>
  );
}

// PROFILE DROPDOWN MENU
interface ProfileDropdownProps {
  user: UserData;
  onClose: () => void;
}

function ProfileDropdown({ user, onClose }: ProfileDropdownProps) {
  return (
    <div
      className="
        absolute right-0 top-full mt-2
        w-72
        rounded-xl
        border border-white/20
        bg-[#0a0a0a]/80
        backdrop-blur-xl
        shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        animate-in fade-in slide-in-from-top-2
        duration-200
        overflow-hidden
      "
    >
      {/* USER INFO SECTION */}
      <div className="flex items-center gap-3 p-4">
        <div className="relative h-12 w-12 shrink-0">
          {user.avatar ? (
            <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {user.name}
          </p>
          <p className="truncate text-xs text-white/40">
            {user.email}
          </p>
          {user.role && (
            <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-white/5" />

      {/* LOGOUT SECTION */}
      <div className="p-2">
        <button
          onClick={async () => {
            onClose();
            const event = new CustomEvent("auth:logout");
            window.dispatchEvent(event);
          }}
          className="
            flex w-full items-center gap-3
            rounded-lg px-3 py-2
            text-sm text-red-400
            transition-colors cursor-pointer
            hover:bg-red-400/10
          "
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

// ACTION BUTTON
interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  badge?: number;
  onClick?: () => void;
}

function ActionButton({ icon: Icon, label, badge, onClick }: ActionButtonProps) {
  return (
    <button
      className="
        relative
        flex h-9 w-9 items-center justify-center
        rounded-full
        text-white/80
        transition-all duration-200
        hover:bg-primary/20
        hover:text-primary
        focus:outline-none
        focus:ring-2
        focus:ring-primary/20
        active:scale-95
      "
      onClick={onClick}
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-black animate-in zoom-in duration-300 shadow-[0_0_10px_rgba(212,165,116,0.3)]">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

function getTimeAgo(date: string | Date) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "now";
}