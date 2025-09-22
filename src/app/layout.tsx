import "./globals.css";
import Navbar from "../components/Navbar";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { ReactNode } from "react";
import Script from "next/script";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // <- your next-auth config

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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions); // ✅ fetch session on server

  return (
    <html lang="en" className={myCustomFont.className}>
      <body className={`bg-[#F8EFDA] min-h-screen ${myCustomFont.className}`}>
        {/* Google Analytics */}
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

        {/* Pass session into Provider */}
        <Providers session={session}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}