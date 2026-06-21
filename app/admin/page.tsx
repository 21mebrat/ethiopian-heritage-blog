"use client";

import { useAuth } from "../context/auth-context";
import { 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  FileText, 
  Users, 
  Settings, 
  Share2 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StatisticsCards } from "./posts/components/StatisticsCards";
import { AnalyticsChart, DistributionPie } from "./components/dashboard/DashboardCharts";
import { RecentActivity } from "./components/dashboard/RecentActivity";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
  });
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real statistics and analytics
  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetch("/api/posts/admin/statistics"),
          fetch("/api/admin/analytics")
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* ─── WELCOME HEADER ─── */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-[0.3em] uppercase text-[10px]">
             <Sparkles size={14} className="animate-pulse" />
             <span>System Ready</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter">
            Welcome back, <span className="text-primary italic">{user?.name?.split(" ")[0] || "Admin"}</span>
          </h1>
          <div className="flex items-center gap-2 text-white/40 font-medium">
            <Calendar size={14} />
            <span className="text-sm">{today}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/posts/create"
            className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
          >
            <span>Rapid Launch</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="p-3 rounded-2xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all">
             <Settings size={20} />
          </button>
        </div>
      </section>

      {/* ─── OVERVIEW STATS ─── */}
      <section>
        <StatisticsCards
          totalPosts={stats.totalPosts}
          publishedPosts={stats.publishedPosts}
          draftPosts={stats.draftPosts}
          totalViews={stats.totalViews}
          isLoading={isLoading}
        />
      </section>

      {/* ─── ANALYTICS GRID ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <AnalyticsChart 
            data={analytics?.engagement} 
            isLoading={isLoading} 
          />
        </div>
        <div className="xl:col-span-1">
          <DistributionPie 
            data={analytics?.distribution} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* ─── SECONDARY GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <RecentActivity 
            activities={analytics?.activity || []} 
            isLoading={isLoading} 
          />
        </div>

        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           <QuickActionCard 
              title="Cloudinary Sync"
              desc="Asset pipeline is healthy and responding."
              status="Online"
              icon={Share2}
              delay={0.1}
           />
           <QuickActionCard 
              title="Identity Engine"
              desc="JWT Token verification is operational at Edge."
              status="Secure"
              icon={FileText}
              delay={0.2}
           />
           <QuickActionCard 
              title="Author Network"
              desc={`${stats.totalPosts} heritage stories currently managed.`}
              status="Stable"
              icon={Users}
              delay={0.3}
           />
           <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-primary/10 transition-all">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                 <PlusIcon size={24} />
              </div>
              <h4 className="font-bold text-white mb-1">Add Widget</h4>
              <p className="text-xs text-white/40">Customize your dashboard experience</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function QuickActionCard({ title, desc, status, icon: Icon, delay }: { title: string, desc: string, status: string, icon: any, delay: number }) {
  const isOnline = status === "Online" || status === "Stable" || status === "Secure";
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-md hover:bg-white/6 transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 rounded-2xl bg-white/5 text-white/40">
           <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          isOnline ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-500"
        }`}>
          <div className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-yellow-500"}`} />
          {status}
        </div>
      </div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
    </motion.div>
  );
}