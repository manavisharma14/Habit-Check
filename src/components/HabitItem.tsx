"use client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function HabitItem({
  habit,
  onDeleted,
}: {
  habit: { id: string; name: string; completed?: boolean };
  onDeleted?: (id: string) => void;
}) {
  const handleDeleteHabit = async () => {
    try {
      const res = await fetch(`/api/habits/${habit.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      if (onDeleted) onDeleted(habit.id);
      toast.success("Habit deleted ✨");
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Could not delete habit ❌");
    }
  };

  return (
    <div className="flex justify-between items-center p-3 
                    border border-[#A8C686]/40 bg-[#F5F3EC] 
                    rounded-lg mb-2 shadow-sm hover:shadow-md 
                    transition">
      <span
        className={`text-[#49596B] font-medium ${
          habit.completed ? "line-through text-[#A8C686]/60" : ""
        }`}
      >
        {habit.name}
      </span>
      <button
        onClick={handleDeleteHabit}
        className="ml-4 text-[#A8C686] hover:text-[#7CA35E] transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}