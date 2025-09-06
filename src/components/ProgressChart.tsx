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
    <div className="w-full h-72 bg-[#F8DCD9]/40 rounded-2xl shadow-md p-6 mt-6">
      <h3 className="text-lg font-semibold text-[#7A8450] mb-4">
        Daily Progress
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="day"
            label={{
              value: "Day",
              position: "insideBottom",
              offset: -5,
              style: { fill: "#7A8450", fontSize: 12 },
            }}
            tick={{ fontSize: 12, fill: "#7A8450" }}
          />
          <YAxis
            domain={[0, 100]}
            label={{
              value: "Progress %",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#7A8450", fontSize: 12 },
            }}
            tick={{ fontSize: 12, fill: "#7A8450" }}
          />
          <Tooltip
            formatter={(value: any) => `${value}%`}
            contentStyle={{
              backgroundColor: "#F8DCD9",
              borderRadius: "8px",
              border: "1px solid #939D7A",
            }}
          />
          <Line
            type="monotone" // 👈 smooth curved line
            dataKey="progress"
            stroke="#939D7A" // Moss Green
            strokeWidth={3}
            dot={{ r: 4, fill: "#7A8450" }}
            activeDot={{ r: 6, stroke: "#F8DCD9", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}