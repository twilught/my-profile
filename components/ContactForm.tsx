"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    try {
      const form = e.target as HTMLFormElement;
      const fd = new FormData(form);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "API error");
      }

      setStatus("sent");
      form.reset();
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message ?? "ส่งไม่สำเร็จ");
    }
  };

  const onEdit = () => {
    if (status !== "idle") setStatus("idle");
    if (errorMsg) setErrorMsg(null);
  };

  return (
    <form onSubmit={submit} className="card">
      <label className="block text-sm">ชื่อ</label>
      <input
        name="name"
        required
        onChange={onEdit}
        className="mt-1 mb-3 w-full rounded-xl border px-3 py-2 
                   bg-white/80 dark:bg-white/10
                   border-black/10 dark:border-white/10"
      />

      <label className="block text-sm">อีเมล</label>
      <input
        type="email"
        name="email"
        required
        onChange={onEdit}
        className="mt-1 mb-3 w-full rounded-xl border px-3 py-2 
                   bg-white/80 dark:bg-white/10
                   border-black/10 dark:border-white/10"
      />

      <label className="block text-sm">ข้อความ</label>
      <textarea
        name="message"
        rows={5}
        required
        onChange={onEdit}
        className="mt-1 mb-4 w-full rounded-xl border px-3 py-2 
                   bg-white/80 dark:bg-white/10
                   border-black/10 dark:border-white/10"
      />

      <button disabled={status === "loading"} className="btn btn-primary">
        {status === "loading" ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>

      {status === "sent" && (
        <p className="mt-3 text-green-600 dark:text-green-400">ส่งแล้ว ขอบคุณ!</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-red-600">
          {errorMsg || "ส่งไม่สำเร็จ"}
        </p>
      )}
    </form>
  );
}
