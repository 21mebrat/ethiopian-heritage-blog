import { SidebarProvider } from "../context/ui-context";
import { AuthProvider } from "../context/auth-context";
import Sidebar from "./components/layout/Sidebar";
import TopHeader from "./components/layout/TopHeader";
import "./admin-layout.css";
import "../login/login.css";

export const metadata = {
  title: "Admin Dashboard | Ethiopian Heritage",
  description: "Manage posts, media, and heritage content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="admin-dashboard-container flex h-screen w-full overflow-hidden">
          {/* Animated Background Layers System */}
          <div className="admin-bg-layer login-bg opacity-40" />
          <div className="admin-bg-layer login-grid-pattern opacity-100" />
          <div className="admin-bg-layer login-orb login-orb-1 opacity-10" />
          <div className="admin-bg-layer login-orb login-orb-2 opacity-15" />
          <div className="admin-bg-layer login-orb login-orb-3 opacity-5" />

          {/* LEFT SIDEBAR */}
          <Sidebar />

          {/* RIGHT MAIN AREA */}
          <div className="relative z-10 flex flex-col flex-1 min-w-0">
            {/* TOP HEADER */}
            <TopHeader />

            {/* PAGE CONTENT */}
            <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}