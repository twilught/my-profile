// app/blog/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Your Name",
  description: "บทความและบันทึก",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  // ห้ามใส่ <html>/<body> ใน sub-layout
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      {children}
    </section>
  );
}
