"use client";
import { useState } from "react";
import ProgressChart from "../components/ProgressChart";

export default function MonthlyTracker({
  habits,
}: {
  habits: { id: number; name: string }[];
}) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year] = useState(today.getFullYear());
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const [progress, setProgress] = useState<Record<number, Set<number>>>({});

  const toggleDay = (habitId: number, day: number) => {
    setProgress((prev) => {
      const current = new Set(prev[habitId] || []);
      current.has(day) ? current.delete(day) : current.add(day);
      return { ...prev, [habitId]: current };
    });
  };

  const getDailyProgress = (day: number) => {
    let completed = 0;
    habits.forEach((h) => {
      if (progress[h.id]?.has(day)) completed++;
    });
    return Math.round((completed / habits.length) * 100) || 0;
  };

  const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    progress: getDailyProgress(i + 1),
  }));

  return (
    <div className="mt-10 max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#7A8450]">Monthly Tracker</h2>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#7A8450]"
          >
            {monthNames.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <span className="font-medium text-gray-600">{year}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="table-fixed w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-center w-12 font-semibold text-gray-700">Day</th>
              {habits.map((h) => (
                <th
                  key={h.id}
                  className="px-3 py-2 text-center w-28 truncate text-gray-700 font-medium"
                  title={h.name}
                >
                  {h.name}
                </th>
              ))}
              <th className="px-3 py-2 text-center w-24 text-gray-700 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dailyProgress = getDailyProgress(day);
              return (
                <tr key={day} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-3 py-2 text-center font-medium text-gray-600">{day}</td>
                  {habits.map((h) => (
                    <td key={h.id} className="text-center">
                      <input
                        type="checkbox"
                        checked={progress[h.id]?.has(day) || false}
                        onChange={() => toggleDay(h.id, day)}
                        className="h-4 w-4 text-[#7A8450] rounded accent-[#7A8450] cursor-pointer"
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1 text-center">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${dailyProgress}%`,
                          backgroundColor:
                            dailyProgress >= 70
                              ? "#7A8450" // green
                              : dailyProgress >= 30
                              ? "#D9B650" // amber
                              : "#F8DCD9", // rose
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{dailyProgress}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="mt-8 bg-white rounded-xl shadow p-4 border border-gray-200">
        <ProgressChart data={chartData} />
      </div>
    </div>
  );
}