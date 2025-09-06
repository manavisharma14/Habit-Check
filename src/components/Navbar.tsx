"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#F8EFDA] to-[#F3E8C8] shadow-md px-6 py-3 border-b border-[#E6CFCB]/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link
          href="/"
          className="text-[#7A8450] font-extrabold text-xl tracking-wide"
        >
          HabitTracker
        </Link>

        {/* Nav Links */}
        <div className="space-x-6 flex items-center">
          <Link href="/" className="text-[#7A8450] hover:text-[#939D7A] transition">
            Home
          </Link>
          <Link href="/tracker" className="text-[#7A8450] hover:text-[#939D7A] transition">
            Tracker
          </Link>

          {/* Loading state */}
          {status === "loading" && (
            <span className="text-sm text-gray-400">Loading...</span>
          )}

          {/* Logged in */}
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-[#7A8450] font-medium">
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="ml-2 px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : null}

          {/* Not logged in */}
          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                className="ml-4 px-3 py-1 rounded-lg bg-[#7A8450] text-white text-sm hover:bg-[#6E7B52] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="ml-2 px-3 py-1 rounded-lg bg-[#C1CBA5] text-[#5C5136] text-sm hover:bg-[#A7B88C] transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}