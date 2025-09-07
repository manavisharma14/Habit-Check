import "./globals.css";
import Navbar from "../components/Navbar";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { ReactNode } from "react";
import Script from "next/script";

// ✅ Font setup
const myCustomFont = localFont({
  src: [
    { path: "../../public/fonts/font.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/font.ttf", weight: "700", style: "normal" },
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
        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-72X4P93JFJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-72X4P93JFJ');
          `}
        </Script>

        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}