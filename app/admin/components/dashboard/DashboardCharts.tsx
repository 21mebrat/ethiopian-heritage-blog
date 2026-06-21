"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface AnalyticsChartProps {
  data: { day: string; value: number }[];
  isLoading?: boolean;
}

export function AnalyticsChart({ data, isLoading }: AnalyticsChartProps) {
  if (isLoading || !data || data.length === 0) {
    return (
       <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-md h-[320px] animate-pulse">
         <div className="h-4 w-48 rounded bg-white/5 mb-8" />
         <div className="h-full w-full bg-white/5 rounded-2xl" />
       </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 10);
  const height = 200;
  const width = 600;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - (d.value / maxValue) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `
    ${padding},${height} 
    ${points} 
    ${width - padding},${height}
  `;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-white leading-none mb-1">Audience Engagement</h3>
          <p className="text-xs text-white/40 font-medium">Weekly traffic analysis based on post views</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
          <TrendingUp size={12} />
          <span>Real-time Sync</span>
        </div>
      </div>

      <div className="relative h-[200px] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4a574" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d4a574" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="100%" stopColor="#c28b5a" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1={padding}
              y1={height - p * (height - padding * 2) - padding}
              x2={width - padding}
              y2={height - p * (height - padding * 2) - padding}
              stroke="white"
              strokeOpacity="0.05"
              strokeDasharray="4 4"
            />
          ))}

          <motion.polygon
            points={areaPoints}
            fill="url(#areaGradient)"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ originY: "100%" }}
          />

          <motion.polyline
            points={points}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
            const y = height - (d.value / maxValue) * (height - padding * 2) - padding;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#d4a574"
                stroke="#0a0a0a"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.5 }}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-6 px-2">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}

interface DistributionPieProps {
  data: { name: string; value: number; color: string }[];
  isLoading?: boolean;
}

export function DistributionPie({ data, isLoading }: DistributionPieProps) {
  if (isLoading || !data || data.length === 0) {
    return (
       <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-md h-full animate-pulse">
         <div className="h-4 w-48 rounded bg-white/5 mb-8" />
         <div className="flex-1 flex justify-center items-center">
            <div className="h-40 w-40 rounded-full border-4 border-dashed border-white/5" />
         </div>
       </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-md flex flex-col h-full">
      <h3 className="text-lg font-bold text-white leading-none mb-1">Content Distribution</h3>
      <p className="text-xs text-white/40 font-medium mb-8">By primary category</p>

      <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
        <svg viewBox="0 0 100 100" className="w-40 h-40">
          {data.map((cat, i) => {
            const cumulative = data.slice(0, i).reduce((acc, curr) => acc + curr.value, 0);
            const startAngle = (cumulative / 100) * 360;
            const angle = (cat.value / 100) * 360;
            
            return (
              <motion.circle
                key={i}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={cat.color}
                strokeWidth="12"
                strokeDasharray={`${angle} ${360 - angle}`}
                strokeDashoffset={-startAngle}
                transform="rotate(-90 50 50)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.2 }}
                className="cursor-pointer transition-all hover:stroke-white"
              />
            );
          })}
          <circle cx="50" cy="50" r="30" fill="#0a0a0a" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-2xl font-black text-white">{data.length > 0 ? "100%" : "0%"}</span>
           <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Total</span>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {data.map((cat, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-xs text-white/60 font-medium truncate">{cat.name}</span>
            </div>
            <span className="text-xs text-white font-bold">{cat.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
