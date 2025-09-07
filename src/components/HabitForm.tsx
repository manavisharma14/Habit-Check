"use client";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";

export default function HabitForm({
  onAdded,
}: {
  onAdded?: (habit: any) => void;
}) {
  const [habit, setHabit] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { status } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habit.trim()) return;

    if (status !== "authenticated") {
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 2000);
      return;
    }

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
      className="relative flex gap-3 bg-[#F9FAFB] p-3 rounded-xl border border-[#B5C99A]/40 shadow-sm"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="✨ Add a new habit..."
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        className="flex-1 border border-[#B5C99A]/50 rounded-lg px-3 py-2 bg-white 
                   text-[#49596B] placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#718355]/40"
      />
      <button
        type="submit"
        className="relative bg-[#718355] hover:bg-[#5c6f44] text-white px-5 py-2 rounded-lg shadow-md 
                   transition-all active:scale-95"
      >
        Add
      </button>

      {/* Cute Popover */}
      {showPopover && (
        <div className="absolute right-1/2 translate-x-1/2 top-[-50px] 
                        bg-white/90 border border-[#B5C99A]/40 shadow-md 
                        px-4 py-2 rounded-lg text-sm text-[#49596B] animate-bounce">
          🌱 Please login to add habits
        </div>
      )}
    </form>
  );
}