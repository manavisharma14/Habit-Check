"use client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function HabitItem({
  habit,
  onDeleted,
}: {
  habit: { id: string; name: string; completed?: boolean }; // ✅ id is string
  onDeleted?: (id: string) => void; // ✅ id is string
}) {
  const handleDeleteHabit = async () => {
    try {
      const res = await fetch(`/api/habits/${habit.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      if (onDeleted) onDeleted(habit.id); // ✅ string id
      toast.success("Habit deleted ✨");
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Could not delete habit ❌");
    }
  };

  return (
    <div className="flex justify-between items-center p-3 border border-[#939D7A]/30 bg-[#F8DCD9]/40 rounded-lg mb-2 shadow-sm hover:shadow-md transition">
      <span
        className={`text-[#4A4A4A] ${
          habit.completed ? "line-through text-[#939D7A]/70" : ""
        }`}
      >
        {habit.name}
      </span>
      <button
        onClick={handleDeleteHabit}
        className="ml-4 text-[#939D7A] hover:text-[#6E7B52] transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}