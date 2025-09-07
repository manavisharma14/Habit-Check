"use client";
import { useEffect, useState } from "react";
import HabitForm from "@/components/HabitForm";
import HabitList from "@/components/HabitList";
import MonthlyTracker from "@/components/MonthlyTracker";

export default function HomePage() {
  const [habits, setHabits] = useState<{ id: string; name: string; completed?: boolean }[]>([]);

  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching habits:", err);
      setHabits([]);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleHabitAdded = (habit: { id: string; name: string; completed?: boolean }) => {
    setHabits((prev) => [...prev, habit]);
  };

  const handleHabitDeleted = (id: string) => {   // ✅ id is string
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8EFDA] to-[#F3E8C8] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-[#7A8450] tracking-tight">
            Habit Tracker
          </h1>
          <p className="text-[#5C5136] mt-3 text-lg">
            Build better habits, one day at a time ✨
          </p>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Habit Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-[#7A8450]/10 hover:shadow-lg hover:-translate-y-0.5 transition">
            <h2 className="text-lg font-semibold text-[#7A8450] mb-4">
              Add a New Habit
            </h2>
            <HabitForm onAdded={handleHabitAdded} />
          </div>

          {/* Habit List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-[#7A8450]/10 hover:shadow-lg hover:-translate-y-0.5 transition">
            <h2 className="text-lg font-semibold text-[#7A8450] mb-4">
              Your Habits
            </h2>
            <HabitList habits={habits} onDeleted={handleHabitDeleted} />
          </div>
        </div>

        {/* Monthly Tracker */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-[#7A8450]/10 hover:shadow-lg hover:-translate-y-0.5 transition">
          <h2 className="text-lg font-semibold text-[#7A8450] mb-4">
            Monthly Progress
          </h2>
          <MonthlyTracker habits={habits} />
        </div>
      </div>
    </div>
  );
}