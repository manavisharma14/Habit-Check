"use client";
import { useState, useEffect } from "react";
import ProgressChart from "../components/ProgressChart";

// Build "YYYY-MM-DD" (UTC day key) for a given day in current view
function toDayKey(year: number, month: number, day: number) {
  const y = String(year);
  const m = String(month + 1).padStart(2, "0"); // month is 0-based
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function MonthlyTracker({
  habits,
}: {
  habits: { id: string; name: string }[];
}) {
  const today = new Date();
  const [month, setMonth] = useState(today.getUTCMonth());      // use UTC month
  const [year] = useState(today.getUTCFullYear());              // use UTC year
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  // Map: habitId -> Set<dayNumber>
  const [progress, setProgress] = useState<Record<string, Set<number>>>({});

  // Load saved progress from API
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) return;

        const data = await res.json();
        const grouped: Record<string, Set<number>> = {};

        data.forEach((p: any) => {
          const d = new Date(p.date);
          const y = d.getUTCFullYear();
          const m = d.getUTCMonth();
          const day = d.getUTCDate();

          if (y === year && m === month) {
            if (!grouped[p.habitId]) grouped[p.habitId] = new Set();
            grouped[p.habitId].add(day);
          }
        });

        setProgress(grouped);
      } catch (err) {
        console.error("Error loading progress:", err);
      }
    };

    fetchProgress();
  }, [month, year]);

  // Toggle day both locally + in DB (send dayKey to avoid any TZ ambiguity)
  const toggleDay = async (habitId: string, day: number) => {
    const dayKey = toDayKey(year, month, day);

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, dayKey }),
      });

      setProgress((prev) => {
        const current = new Set(prev[habitId] || []);
        current.has(day) ? current.delete(day) : current.add(day);
        return { ...prev, [habitId]: current };
      });
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  // Daily completion %
  const getDailyProgress = (day: number) => {
    let completed = 0;
    habits.forEach((h) => {
      if (progress[h.id]?.has(day)) completed++;
    });
    return Math.round((completed / habits.length) * 100) || 0;
  };

  // Chart data
  const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    progress: getDailyProgress(i + 1),
  }));

  return (
    <div className="mt-10 max-w-6xl mx-auto bg-[#FAFAF7] rounded-2xl shadow-md p-6 border border-[#49596B]/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#49596B]">Monthly Tracker</h2>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-[#49596B] rounded-lg px-3 py-2 text-sm bg-[#FAFAF7] text-[#49596B] focus:ring-2 focus:ring-[#49596B]"
          >
            {monthNames.map((m, i) => (
              <option key={i} value={i} className="bg-[#FAFAF7] text-[#49596B]">
                {m}
              </option>
            ))}
          </select>
          <span className="font-medium text-[#49596B]">{year}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#49596B]/40">
        <table className="table-fixed w-full text-sm border-collapse">
          <thead className="bg-[#49596B]">
            <tr>
              <th className="px-3 py-2 text-center w-12 font-semibold text-[#FAFAF7]">Day</th>
              {habits.map((h) => (
                <th
                  key={h.id}
                  className="px-3 py-2 text-center w-28 truncate font-medium text-[#FAFAF7]"
                  title={h.name}
                >
                  {h.name}
                </th>
              ))}
              <th className="px-3 py-2 text-center w-24 font-medium text-[#FAFAF7]">Progress</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dailyProgress = getDailyProgress(day);
              return (
                <tr key={day} className={i % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#FAFAF7]"}>
                  <td className="px-3 py-2 text-center font-medium text-[#49596B]">{day}</td>
                  {habits.map((h) => (
                    <td key={h.id} className="text-center">
                      <input
                        type="checkbox"
                        checked={progress[h.id]?.has(day) || false}
                        onChange={() => toggleDay(h.id, day)}
                        className="h-4 w-4 accent-[#49596B] cursor-pointer"
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1 text-center">
                    <div className="w-full bg-[#FAFAF7] border border-[#49596B]/40 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300 bg-[#49596B]"
                        style={{ width: `${dailyProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#49596B]">{dailyProgress}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="mt-8 bg-[#FAFAF7] rounded-xl shadow p-4 border border-[#49596B]/30">
        <ProgressChart data={chartData} />
      </div>
    </div>
  );
}