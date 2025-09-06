"use client";
import { useState, useEffect } from "react";
import MonthlyTracker from "@/components/MonthlyTracker";

export default function TrackerPage() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        Monthly Progress
      </h1>
      <MonthlyTracker habits={habits} />
    </main>
  );
}