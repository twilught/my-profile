import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import CommandPalette from "@/components/CommandPalette";


/* === Meta === */
export const metadata: Metadata = {
  title: "Your Name — Portfolio",
  description: "Minimal black & white portfolio.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/* === Simple glass NavBar (ภายในไฟล์ ลด dependency) === */
function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-extrabold tracking-tight">ATHIP</a>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <a className="opacity-80 hover:opacity-100 transition" href="/projects">Projects</a>
          <a className="opacity-80 hover:opacity-100 transition" href="/#about">About</a>
          <a className="opacity-80 hover:opacity-100 transition" href="/#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

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
