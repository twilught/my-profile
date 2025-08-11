import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "../components/ThemeToggle"; // สร้างในข้อถัดไป

export const metadata: Metadata = {
  title: "Your Name — Portfolio",
  description: "โปรไฟล์ส่วนตัว โทนขาว/ดำ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"          // ใช้ class 'dark' บน html
          defaultTheme="system"      // ค่าเริ่มต้นตามระบบ
          enableSystem               // เปิดให้ตามระบบเครื่อง
          disableTransitionOnChange  // เปลี่ยนธีมไม่กระพริบ
        >
          {/* ตัวอย่าง navbar + ปุ่มสลับธีม */}
          <nav className="p-4 flex justify-between border-b border-black/10 dark:border-white/10">
            <div>YourName</div>
            <ThemeToggle />
          </nav>

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
