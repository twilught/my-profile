"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle"|"loading"|"sent"|"error">("idle");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    try {
      // TODO: ต่อ /api/contact จริงเมื่อพร้อม
      await new Promise(r => setTimeout(r, 700));
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <label className="block text-sm">ชื่อ</label>
      <input name="name" required className="mt-1 mb-3 w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-white/10 border-black/10 dark:border-white/10"/>

      <label className="block text-sm">อีเมล</label>
      <input type="email" name="email" required className="mt-1 mb-3 w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-white/10 border-black/10 dark:border-white/10"/>

      <label className="block text-sm">ข้อความ</label>
      <textarea name="message" rows={5} required className="mt-1 mb-4 w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-white/10 border-black/10 dark:border-white/10"/>

      <button disabled={status==="loading"} className="btn btn-primary">
        {status==="loading" ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>

      {status==="sent" && <p className="mt-3 text-green-600 dark:text-green-400">ส่งแล้ว ขอบคุณ!</p>}
      {status==="error" && <p className="mt-3 text-red-600">ส่งไม่สำเร็จ</p>}
    </form>
  );
}
