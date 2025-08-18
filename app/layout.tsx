import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "../components/ThemeToggle"; // สร้างในข้อถัดไป

export const metadata = {
  title: "Athip Buasamlee — Portfolio",
  description: "Minimal portfolio in black & white, Next.js + Tailwind.",
  keywords: ["Athip Buasamlee","Portfolio","Next.js","Developer"],
  openGraph: {
    title: "Athip Buasamlee — Portfolio",
    description: "Minimal portfolio in black & white, Next.js + Tailwind.",
    url: "https://my-profile-lilac-six.vercel.app",
    siteName: "Athip Buasamlee",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Athip Buasamlee — Portfolio",
    description: "Minimal portfolio in black & white, Next.js + Tailwind.",
    images: ["/og-image.png"],
  },
};
