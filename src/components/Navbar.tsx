"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ❌ remove explicit "Loading…" text
  // ✅ don’t render navbar links until status is settled
  if (status === "loading") {
    return null; // or return a shimmer if you want
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-lg shadow-md border-b border-[#A8C686]/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand */}
        <Link
          href="/"
          className="font-extrabold text-2xl tracking-wide text-[#A8C686] 
                     hover:scale-105 transition-transform duration-300"
        >
          HabitCheck 🍵
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="relative text-[#374151] hover:text-[#A8C686] transition 
                       after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] 
                       after:w-0 after:bg-[#A8C686] hover:after:w-full after:transition-all after:duration-300"
          >
            Home
          </Link>

          <Link
            href="/progress"
            className="relative text-[#374151] hover:text-[#A8C686] transition 
                       after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] 
                       after:w-0 after:bg-[#A8C686] hover:after:w-full after:transition-all after:duration-300"
          >
            Progress
          </Link>

          {/* Authenticated */}
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-[#374151] font-medium">
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="ml-2 px-4 py-1.5 rounded-full bg-gradient-to-r 
                           from-[#A8C686] to-[#8FAE5F] text-white text-sm 
                           hover:scale-105 active:scale-95 transition-transform shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            // Unauthenticated
            <>
              <Link
                href="/login"
                className="ml-4 px-4 py-1.5 rounded-full bg-gradient-to-r 
                           from-[#A8C686] to-[#8FAE5F] text-white text-sm 
                           hover:scale-105 active:scale-95 transition-transform shadow-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="ml-2 px-4 py-1.5 rounded-full border border-[#A8C686]/60 
                           text-[#374151] text-sm bg-white/70 hover:bg-white 
                           hover:scale-105 active:scale-95 transition-transform shadow-sm"
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