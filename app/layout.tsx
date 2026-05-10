import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import CommandPalette from "@/components/CommandPalette";
import NavBar from "@/components/NavBar";

/* === Meta === */
export const metadata: Metadata = {
  title: "Portfolio",
  description: "portfolio.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/* === (ถ้ามี) ตัวเลือก: Progress/BackToTop/Footer === */
// import ScrollProgress from "@/components/ScrollProgress";
// import BackToTop from "@/components/BackToTop";
// import Footer from "@/components/Footer";

/* === RootLayout (ตัวเดียวเท่านั้น) === */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="bg-gradient-to-b from-neutral-50 to-white text-neutral-900 dark:from-black dark:via-neutral-950 dark:to-black dark:text-white antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NavBar />
          {/* <ScrollProgress /> */}
          <main className="mx-auto max-w-7xl px-6">{children}</main>
          {/* <Footer /> */}
          {/* <BackToTop /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
