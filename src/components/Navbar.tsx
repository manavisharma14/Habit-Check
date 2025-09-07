"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] shadow px-6 py-3 border-b border-[#B5C99A]/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link
          href="/"
          className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-[#718355] to-[#B5C99A] bg-clip-text text-transparent"
        >
          HabitCheck
        </Link>

        {/* Nav Links */}
        <div className="space-x-6 flex items-center">
          <Link
            href="/"
            className="text-[#49596B] hover:text-[#718355] transition"
          >
            Home
          </Link>

          <Link
            href="/progress"
            className="text-[#49596B] hover:text-[#718355] transition"
          >
            Progress
          </Link>

          {/* Loading */}
          {status === "loading" && (
            <span className="text-sm text-gray-400">Loading...</span>
          )}

          {/* Logged in */}
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-[#49596B] font-medium">
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="ml-2 px-3 py-1 rounded-lg bg-[#718355] text-white text-sm hover:bg-[#5f6d49] transition"
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
                className="ml-4 px-3 py-1 rounded-lg bg-[#718355] text-white text-sm hover:bg-[#5f6d49] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="ml-2 px-3 py-1 rounded-lg bg-[#E9F5DB] text-[#49596B] text-sm hover:bg-[#DCEBC8] transition"
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