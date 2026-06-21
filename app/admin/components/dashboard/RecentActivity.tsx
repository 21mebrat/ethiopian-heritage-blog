"use client";

import { motion } from "framer-motion";
import { FilePlus, MessageCircle, UserPlus, Heart, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
  title: string;
  user: string;
  time: string;
  color: string;
}

interface RecentActivityProps {
  activities: Activity[];
  isLoading?: boolean;
}

const ICON_MAP: Record<string, any> = {
  post: FilePlus,
  comment: MessageCircle,
  user: UserPlus,
  like: Heart,
};

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
       <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-md h-full animate-pulse">
         <div className="h-4 w-48 rounded bg-white/5 mb-8" />
         <div className="space-y-6">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                   <div className="h-3 w-1/3 rounded bg-white/5" />
                   <div className="h-4 w-full rounded bg-white/5" />
                </div>
             </div>
           ))}
         </div>
       </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-md h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-white leading-none mb-1">Live Feed</h3>
          <p className="text-xs text-white/40 font-medium">Real-time platform activity</p>
        </div>
        <Link 
          href="/admin/activity" 
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
        >
          <ExternalLink size={16} />
        </Link>
      </div>

      <div className="space-y-6 flex-1">
        {activities.map((activity, i) => {
          const Icon = ICON_MAP[activity.type] || FilePlus;
          return (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex items-start gap-4"
            >
              <div 
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${activity.color}15`, color: activity.color }}
              >
                <Icon size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                    {activity.user}
                  </span>
                  <span className="text-[10px] font-medium text-white/20 whitespace-nowrap ml-2">{activity.time}</span>
                </div>
                <p className="text-sm text-white/40 line-clamp-1 group-hover:text-white/60 transition-colors">
                  {activity.title}
                </p>
              </div>
            </motion.div>
          );
        })}

        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
             <p className="text-sm text-white/20">No recent activity detected.</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <button className="w-full py-3 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all">
          View full report
        </button>
      </div>
    </div>
  );
}
