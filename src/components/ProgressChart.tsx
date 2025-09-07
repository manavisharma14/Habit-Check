"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProgressChart({
  data,
}: {
  data: { day: number; progress: number }[];
}) {
  return (
    <div className="w-full h-72 bg-[#FAFAF7] rounded-2xl shadow-md p-6 mt-6 border border-[#49596B]/20">
      <h3 className="text-lg font-semibold text-[#49596B] mb-4">
        Daily Progress
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" /> 
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
              backgroundColor: "#FAFAF7",
              borderRadius: "8px",
              border: "1px solid #49596B",
              color: "#49596B",
            }}
          />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#49596B"
            strokeWidth={3}
            dot={{ r: 4, fill: "#49596B" }}
            activeDot={{ r: 6, stroke: "#FAFAF7", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}