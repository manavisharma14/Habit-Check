import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all habits
export async function GET() {
  const habits = await prisma.habit.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(habits);
}

// CREATE a new habit
export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const habit = await prisma.habit.create({
    data: { name, completed: false },
  });

  return NextResponse.json(habit, { status: 201 });
}