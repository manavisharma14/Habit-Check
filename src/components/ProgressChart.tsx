"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ✅ helper to calculate today’s progress
function getTodayProgress(data: { day: number; progress: number }[]) {
  if (!data || data.length === 0) return 0;
  const today = new Date().getDate();
  const todayData = data.find((d) => d.day === today);
  return todayData ? todayData.progress : 0;
}

export default function ProgressChart({
  data,
}: {
  data: { day: number; progress: number }[];
}) {
  const todayProgress = getTodayProgress(data);

  // Animation state for circle
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;

    const duration = 1200; // ms
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setAnimatedProgress(Math.floor(progress * todayProgress));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [todayProgress]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 mt-6 border border-[#B5C99A]/40">
      <h3 className="text-lg font-semibold text-[#718355] mb-6">
        Daily Progress
      </h3>

      {/* Today’s Circular Progress */}
      <div className="flex justify-center mb-8">
        <div className="relative w-28 h-28">
          {/* Outer circle with conic gradient */}
          <div
            className="absolute inset-0 rounded-full transition-all"
            style={{
              background: `conic-gradient(#718355 ${animatedProgress}%, #E5EEDC 0)`,
            }}
          />
          {/* Inner circle */}
          <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
            <span className="text-[#49596B] font-bold text-lg">
              {animatedProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Line Chart for monthly trends */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke="#E5EEDC"
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="day"
              label={{
                value: "Day",
                position: "insideBottom",
                offset: -5,
                style: { fill: "#49596B", fontSize: 12 },
              }}
              tick={{ fontSize: 12, fill: "#49596B" }}
            />
            <YAxis
              domain={[0, 100]}
              label={{
                value: "Progress %",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#49596B", fontSize: 12 },
              }}
              tick={{ fontSize: 12, fill: "#49596B" }}
            />
            <Tooltip
              formatter={(value: any) => `${value}%`}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "10px",
                border: "1px solid #B5C99A",
                color: "#49596B",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#718355" // 🌿 primary moss green
              strokeWidth={3}
              dot={{ r: 3, fill: "#B5C99A" }} // 🪴 sage green dots
              activeDot={{ r: 6, stroke: "#E5EEDC", strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}