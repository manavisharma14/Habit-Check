import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { id } = await params;

  try {
    const habit = await prisma.habit.delete({
      where: {
        id: Number(id),
        userId: user.id, // ✅ ensure only owner can delete
      },
    });

    return NextResponse.json({ message: "Habit deleted", habit });
  } catch (err) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }
}