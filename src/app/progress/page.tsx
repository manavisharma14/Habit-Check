"use client";
import { useState, useEffect } from "react";
import ProgressChart from "@/components/ProgressChart";

export default function ProgressPage() {
  const [chartData, setChartData] = useState<{ day: number; progress: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [habitsCount, setHabitsCount] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [progressRes, habitsRes] = await Promise.all([
          fetch("/api/progress"),
          fetch("/api/habits"),
        ]);

        if (!progressRes.ok || !habitsRes.ok) return;

        const progressData = await progressRes.json();
        const habitsData = await habitsRes.json();
        const totalHabits = Array.isArray(habitsData) ? habitsData.length : 0;
        setHabitsCount(totalHabits);

        const today = new Date();
        const month = today.getUTCMonth();
        const year = today.getUTCFullYear();
        const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

        // group completions per day
        const dailyMap: Record<number, number> = {};
        progressData.forEach((p: any) => {
          const d = new Date(p.date);
          if (d.getUTCFullYear() === year && d.getUTCMonth() === month) {
            const day = d.getUTCDate();
            dailyMap[day] = (dailyMap[day] || 0) + 1;
          }
        });

        const chart = Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const completed = dailyMap[day] || 0;
          const progress =
            totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;
          return { day, progress };
        });

        setChartData(chart);
      } catch (err) {
        console.error("Error loading progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-[#49596B] mb-2">
        📊 Progress Overview
      </h1>
      <p className="text-[#49596B]/70 mb-6">
        See how your daily habit completion looks this month 🌿
      </p>

      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-6 
                      border border-[#A8C686]/40 transition hover:shadow-lg">
        {loading ? (
          <p className="text-center text-[#49596B]/60 animate-pulse">
            Loading your progress...
          </p>
        ) : chartData.length === 0 || habitsCount === 0 ? (
          <p className="text-center text-[#49596B]/70">
            No progress to show yet — start building habits 🍵
          </p>
        ) : (
          <ProgressChart data={chartData} />
        )}
      </div>
    </div>
  );
}