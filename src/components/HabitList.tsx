"use client";
import HabitItem from "./HabitItem";

export default function HabitList({
  habits,
  onDeleted,
}: {
  habits: any[];
  onDeleted?: (id: string) => void; // ✅ string not number
}) {
  if (habits.length === 0) {
    return (
      <p className="text-[#49596B]/70 italic text-center py-4">
        No habits added yet. Start by creating one above 🌱
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} onDeleted={onDeleted} />
      ))}
    </div>
  );
}