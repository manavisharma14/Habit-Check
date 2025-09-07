import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Build a UTC midnight Date from a dayKey like "2025-09-03"
function dateFromDayKey(dayKey: string) {
  // Basic validation: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return null;
  return new Date(`${dayKey}T00:00:00.000Z`);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const progress = await prisma.habitProgress.findMany({
    where: { userId: user.id.toString() }, // ensure string for @db.ObjectId
  });

  return NextResponse.json(progress);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const habitId: string | undefined = body?.habitId;
  const dayKey: string | undefined = body?.dayKey;

  if (!habitId || !dayKey) {
    return NextResponse.json({ error: "habitId and dayKey required" }, { status: 400 });
  }

  const dateObj = dateFromDayKey(dayKey);
  if (!dateObj) {
    return NextResponse.json({ error: "Invalid dayKey format (use YYYY-MM-DD)" }, { status: 400 });
  }
  const nextDay = new Date(dateObj);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  // Find any existing entry for this user+habit on that UTC day
  const existing = await prisma.habitProgress.findFirst({
    where: {
      userId: user.id.toString(),
      habitId,
      date: { gte: dateObj, lt: nextDay },
    },
  });

  if (existing) {
    // Delete all matches for the day to clean up any dupes from earlier bugs
    await prisma.habitProgress.deleteMany({
      where: {
        userId: user.id.toString(),
        habitId,
        date: { gte: dateObj, lt: nextDay },
      },
    });
  } else {
    await prisma.habitProgress.create({
      data: {
        userId: user.id.toString(),
        habitId,
        date: dateObj,      // exact UTC midnight
        completed: true,
      },
    });
  }

  return NextResponse.json({ success: true });
}