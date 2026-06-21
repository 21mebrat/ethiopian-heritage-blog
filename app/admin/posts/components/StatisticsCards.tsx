import { FileText, Globe, FileQuestion, Eye, TrendingUp, TrendingDown } from "lucide-react";

interface StatisticsCardsProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  index: number;
}

function StatCard({ title, value, icon: Icon, trend, isLoading, index }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
           <div className="h-10 w-10 rounded-xl bg-white/5" />
           <div className="h-4 w-16 rounded bg-white/5" />
        </div>
        <div className="space-y-2">
           <div className="h-8 w-24 rounded bg-white/5" />
           <div className="h-4 w-32 rounded bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all hover:bg-white/[0.06] hover:border-white/20 hover:shadow-xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
           <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
             trend.isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
           }`}>
             {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
             {trend.value}%
           </div>
        )}
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">{title}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
        </div>
        <p className="mt-1 text-[10px] text-white/20 font-medium">Since last session</p>
      </div>
    </div>
  );
}

export function StatisticsCards({
  totalPosts,
  publishedPosts,
  draftPosts,
  totalViews,
  isLoading = false,
}: StatisticsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        index={0}
        title="Total Posts"
        value={totalPosts}
        icon={FileText}
        isLoading={isLoading}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        index={1}
        title="Published"
        value={publishedPosts}
        icon={Globe}
        isLoading={isLoading}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        index={2}
        title="In Drafts"
        value={draftPosts}
        icon={FileQuestion}
        isLoading={isLoading}
        trend={{ value: 2, isPositive: false }}
      />
      <StatCard
        index={3}
        title="Total Audience"
        value={totalViews.toLocaleString()}
        icon={Eye}
        isLoading={isLoading}
        trend={{ value: 24, isPositive: true }}
      />
    </div>
  );
}
