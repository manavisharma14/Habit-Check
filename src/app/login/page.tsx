"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", { ...form, redirect: false });
    if (res?.error) {
      setError("❌ Oops! Invalid email or password 🌻");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen 
                     px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5 
                   border border-[#49596B]/10 transition-all hover:shadow-xl"
      >
        {/* Header with fun touch */}
        <h1 className="text-3xl font-bold text-[#49596B] text-center flex items-center justify-center gap-2">
        🌱 Login
        </h1>
        <p className="text-center text-[#49596B]/70 text-sm">
          Welcome back! Let’s keep your streak going 🌿
        </p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-[#49596B]/20 p-3 rounded-lg 
                     focus:ring-2 focus:ring-[#49596B]/40 outline-none 
                     transition-all hover:scale-[1.01]"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-[#49596B]/20 p-3 rounded-lg 
                     focus:ring-2 focus:ring-[#49596B]/40 outline-none 
                     transition-all hover:scale-[1.01]"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="w-full bg-[#49596B] text-white py-3 rounded-lg font-medium 
                     hover:bg-[#3b4757] hover:scale-[1.02] active:scale-95 
                     transition-transform"
        >
          Login 
        </button>

        {/* Fun footer link */}
        <p className="text-center text-sm text-[#49596B]/70">
          New here?{" "}
          <a href="/register" className="text-[#49596B] font-medium hover:underline">
            Create an account 🌱
          </a>
        </p>
      </form>
    </div>
  );
}