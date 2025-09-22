"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F9F5ED] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5 
                   border border-[#A8C686]/30 transition-all hover:shadow-xl"
      >
        {/* Header with fun touch */}
        <h1 className="text-3xl font-bold text-[#49596B] text-center flex items-center justify-center gap-2">
           Register
        </h1>
        <p className="text-center text-[#49596B]/70 text-sm">
          Start fresh, let’s grow better habits together ✨
        </p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full border border-[#A8C686]/40 p-3 rounded-lg 
                     focus:ring-2 focus:ring-[#A8C686]/60 outline-none 
                     transition-all hover:scale-[1.01] text-[#49596B] placeholder:text-gray-400 bg-white"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-[#A8C686]/40 p-3 rounded-lg 
                     focus:ring-2 focus:ring-[#A8C686]/60 outline-none 
                     transition-all hover:scale-[1.01] text-[#49596B] placeholder:text-gray-400 bg-white"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-[#A8C686]/40 p-3 rounded-lg 
                     focus:ring-2 focus:ring-[#A8C686]/60 outline-none 
                     transition-all hover:scale-[1.01] text-[#49596B] placeholder:text-gray-400 bg-white"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="w-full bg-[#A8C686] text-white py-3 rounded-lg font-medium 
                     hover:bg-[#93b373] hover:scale-[1.02] active:scale-95 
                     transition-transform shadow-md"
        >
          Register
        </button>

        {/* Fun footer link */}
        <p className="text-center text-sm text-[#49596B]/70">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#A8C686] font-medium hover:underline"
          >
            Login 
          </a>
        </p>
      </form>
    </div>
  );
}