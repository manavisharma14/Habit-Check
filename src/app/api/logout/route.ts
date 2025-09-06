import { NextResponse } from "next/server";

export async function POST() {
  // clear cookie
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}