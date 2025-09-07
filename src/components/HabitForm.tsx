"use client";
import { useState, useRef } from "react";

export default function HabitForm({
  onAdded,
}: {
  onAdded?: (habit: any) => void;
}) {
  const [habit, setHabit] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habit.trim()) return;

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: habit }),
      });

      if (!res.ok) throw new Error("Failed to add habit");

      const newHabit = await res.json();
      if (onAdded) onAdded(newHabit);

      setHabit("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 bg-[#F9FAFB] p-3 rounded-xl border border-[#49596B]/20 shadow-sm"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="✨ Add a new habit..."
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        className="flex-1 border border-[#49596B]/30 rounded-lg px-3 py-2 bg-white 
                   text-[#49596B] placeholder:text-[#9CA3AF]
                   focus:outline-none focus:ring-2 focus:ring-[#49596B]/50 focus:bg-white"
      />
      <button
        type="submit"
        className="bg-[#49596B] hover:bg-[#3b4757] text-white px-5 py-2 rounded-lg shadow-md 
                   transition-all active:scale-95"
      >
        Add
      </button>
    </form>
  );
}