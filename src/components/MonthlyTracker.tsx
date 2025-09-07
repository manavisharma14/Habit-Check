"use client";
import { useState, useEffect } from "react";

// Build "YYYY-MM-DD" (UTC day key)
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
  const [month, setMonth] = useState(today.getUTCMonth());
  const [year] = useState(today.getUTCFullYear());
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const [progress, setProgress] = useState<Record<string, Set<number>>>({});

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) return;

        const data = await res.json();
        const grouped: Record<string, Set<number>> = {};

        data.forEach((p: any) => {
          const d = new Date(p.date);
          if (d.getUTCFullYear() === year && d.getUTCMonth() === month) {
            if (!grouped[p.habitId]) grouped[p.habitId] = new Set();
            grouped[p.habitId].add(d.getUTCDate());
          }
        });

        setProgress(grouped);
      } catch (err) {
        console.error("Error loading progress:", err);
      }
    };

    fetchProgress();
  }, [month, year]);

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

  const getDailyProgress = (day: number) => {
    let completed = 0;
    habits.forEach((h) => {
      if (progress[h.id]?.has(day)) completed++;
    });
    return Math.round((completed / habits.length) * 100) || 0;
  };

  return (

    <div>
      <div className="flex items-center justify-between mb-6">
  <h2 className="text-xl font-bold text-[#718355]">Monthly Tracker</h2>
  <div className="flex items-center gap-2">
    <select
      value={month}
      onChange={(e) => setMonth(Number(e.target.value))}
      className="border border-[#B5C99A] rounded-lg px-3 py-2 text-sm bg-white text-[#718355] focus:ring-2 focus:ring-[#97A97C]"
    >
      {monthNames.map((m, i) => (
        <option key={i} value={i}>
          {m}
        </option>
      ))}
    </select>
    <span className="font-medium text-[#718355]">{year}</span>
  </div>
</div>
    
    <div className="overflow-x-auto rounded-lg border border-[#B5C99A]/50">
  <div className="max-h-[500px] overflow-y-scroll">
    <table className="table-fixed w-full text-sm border-collapse">
      <thead className="bg-[#718355] sticky top-0 z-10">
        <tr>
          <th className="px-3 py-2 text-center w-12 font-semibold text-white">
            Day
          </th>
          {habits.map((h) => (
            <th
              key={h.id}
              className="px-3 py-2 text-center w-28 truncate font-medium text-white"
              title={h.name}
            >
              {h.name}
            </th>
          ))}
          <th className="px-3 py-2 text-center w-24 font-medium text-white">
            Progress
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dailyProgress = getDailyProgress(day);
          return (
            <tr
              key={day}
              className={i % 2 === 0 ? "bg-white" : "bg-[#F0F5EB]"}
            >
              <td className="px-3 py-2 text-center font-medium text-[#49596B]">
                {day}
              </td>
              {habits.map((h) => (
                <td key={h.id} className="text-center">
                  <input
                    type="checkbox"
                    checked={progress[h.id]?.has(day) || false}
                    onChange={() => toggleDay(h.id, day)}
                    className="h-4 w-4 accent-[#718355] cursor-pointer"
                  />
                </td>
              ))}
              {/* Progress circle smaller with padding */}
              <td className="px-3 py-3 text-center w-20">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-10 h-10">
                    <circle
                      className="text-gray-200"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="transparent"
                      r="16"
                      cx="20"
                      cy="20"
                    />
                    <circle
                      className="text-[#718355] transition-[stroke-dashoffset] duration-500 ease-out"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="16"
                      cx="20"
                      cy="20"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={
                        2 * Math.PI * 16 * (1 - dailyProgress / 100)
                      }
                    />
                  </svg>
                  <span className="absolute text-[10px] font-semibold text-[#49596B]">
                    {dailyProgress}%
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>
</div>
  );
}