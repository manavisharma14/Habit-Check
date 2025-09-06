import "./globals.css";
import Navbar from "../components/Navbar";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { ReactNode } from "react";

// ✅ just a const, not exported
const myCustomFont = localFont({
  src: [
    {
      path: "../../public/fonts/font.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/font.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-my-custom-font",
  display: "swap",
});

export const metadata = {
  title: "Habit Tracker",
  description: "Build better habits, one day at a time",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={myCustomFont.className}>
      <body className="bg-[#F8EFDA] min-h-screen">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}