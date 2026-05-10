"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Work } from "@/lib/supabase";

const EMPTY_FORM = {
  slug: "",
  title: "",
  description: "",
  category: "",
  tags: "",
  image_url: "",   // URL ของรูปปก
  images: [] as string[], // รูปทั้งหมด
  link: "",
  github: "",
  date: "",
  year: new Date().getFullYear(),
  featured: false,
};

type FormState = typeof EMPTY_FORM;

export default function AdminPage() {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);

  const [aiLoading, setAiLoading] = useState<"image" | "text" | null>(null);
  const [aiContext, setAiContext] = useState("");

  const multiFileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);
  const aiFileRef = useRef<HTMLInputElement>(null);

  async function fetchWorks() {
    setLoading(true);
    const res = await fetch("/api/works");
    if (res.ok) setWorks(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchWorks(); }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function uploadFiles(files: FileList | File[]): Promise<string[]> {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return [];

    setUploadProgress({ done: 0, total: arr.length });
    const urls: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      const fd = new FormData();
      fd.append("file", arr[i]);
      fd.append("slug", form.slug.trim() || "uncategorized");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        urls.push(url);
      }
      setUploadProgress({ done: i + 1, total: arr.length });
    }

    setUploadProgress(null);

    setForm((f) => {
      const merged = [...f.images, ...urls];
      const cover = f.image_url || urls[0] || "";
      return { ...f, images: merged, image_url: cover };
    });

    return urls;
  }

  function setCover(url: string) {
    setForm((f) => ({ ...f, image_url: url }));
  }

  async function removeImage(url: string) {
    // ลบจาก storage ถ้าเป็น Supabase URL
    if (url.includes("/storage/v1/object/public/")) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    }
    setForm((f) => ({
      ...f,
      images: f.images.filter((u) => u !== url),
      image_url: f.image_url === url
        ? f.images.find((u) => u !== url) ?? ""
        : f.image_url,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug.trim() || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      year: form.year ? Number(form.year) : null,
    };

    const url = editId ? `/api/works/${editId}` : "/api/works";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      fetchWorks();
    } else {
      const err = await res.json();
      alert(err.error ?? "เกิดข้อผิดพลาด");
    }
  }

  function startEdit(w: Work) {
    setForm({
      slug: w.slug ?? "",
      title: w.title,
      description: w.description ?? "",
      category: w.category ?? "",
      tags: w.tags?.join(", ") ?? "",
      image_url: w.image_url ?? "",
      images: w.images ?? [],
      link: w.link ?? "",
      github: w.github ?? "",
      date: w.date ?? "",
      year: w.year ?? new Date().getFullYear(),
      featured: w.featured ?? false,
    });
    setEditId(w.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบผลงานนี้?")) return;
    await fetch(`/api/works/${id}`, { method: "DELETE" });
    fetchWorks();
  }

  function set(key: keyof FormState, value: string | number | boolean | string[]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAIUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const urls = await uploadFiles(files);
    const imageUrl = urls[0];
    if (!imageUrl && !aiContext.trim()) return;
    setAiLoading("image");
    try {
      const res = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, context: aiContext.trim() || undefined }),
      });
      const raw = await res.text();
      let data: Record<string, unknown>;
      try { data = JSON.parse(raw); } catch { alert("AI ตอบผิดรูปแบบ: " + raw.slice(0, 200)); return; }
      if (!res.ok) { alert((data.error as string) ?? "AI เกิดข้อผิดพลาด"); return; }
      setForm((f) => ({
        ...f,
        title: (data.title as string) ?? f.title,
        slug: (data.slug as string) ?? f.slug,
        description: (data.description as string) ?? f.description,
        category: (data.category as string) ?? f.category,
        tags: Array.isArray(data.tags) ? (data.tags as string[]).join(", ") : f.tags,
        year: (data.year as number) ?? f.year,
      }));
    } finally {
      setAiLoading(null);
    }
  }

  async function handleAIGenerate(mode: "image" | "text") {
    const imageUrl = mode === "image" ? (form.image_url || form.images[0]) : undefined;
    const context = aiContext.trim() || undefined;
    if (!imageUrl && !context) return;
    setAiLoading(mode);
    try {
      const res = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, context }),
      });
      const raw = await res.text();
      let data: Record<string, unknown>;
      try { data = JSON.parse(raw); } catch { alert("AI ตอบผิดรูปแบบ: " + raw.slice(0, 200)); return; }
      if (!res.ok) { alert((data.error as string) ?? "AI เกิดข้อผิดพลาด"); return; }
      setForm((f) => ({
        ...f,
        title: (data.title as string) ?? f.title,
        slug: (data.slug as string) ?? f.slug,
        description: (data.description as string) ?? f.description,
        category: (data.category as string) ?? f.category,
        tags: Array.isArray(data.tags) ? (data.tags as string[]).join(", ") : f.tags,
        year: (data.year as number) ?? f.year,
      }));
    } finally {
      setAiLoading(null);
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Admin — Projects</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm((v) => !v); }}
            className="rounded-xl bg-white text-black text-sm font-semibold px-3 py-2 sm:px-4 hover:bg-white/90 transition"
          >
            {showForm ? "ยกเลิก" : "+ เพิ่มผลงาน"}
          </button>
          <button onClick={handleLogout} className="rounded-xl border border-white/20 text-sm px-3 py-2 sm:px-4 hover:bg-white/10 transition">
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 space-y-5">
          <h2 className="font-semibold">{editId ? "แก้ไขผลงาน" : "เพิ่มผลงานใหม่"}</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title *">
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="input" />
            </Field>
            <Field label="Slug (URL)">
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="input" placeholder="my-project" />
            </Field>
            <Field label="Date (YYYY-MM-DD)">
              <input value={form.date} onChange={(e) => set("date", e.target.value)} className="input" placeholder="2025-10-01" />
            </Field>
            <Field label="Category">
              <input value={form.category} onChange={(e) => set("category", e.target.value)} className="input" />
            </Field>
            <Field label="Tags (คั่นด้วย ,)">
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} className="input" placeholder="React, Next.js" />
            </Field>
            <Field label="Year">
              <input type="number" value={form.year} onChange={(e) => set("year", Number(e.target.value))} className="input" />
            </Field>
            <Field label="Demo Link">
              <input value={form.link} onChange={(e) => set("link", e.target.value)} className="input" />
            </Field>
            <Field label="GitHub URL">
              <input value={form.github} onChange={(e) => set("github", e.target.value)} className="input" />
            </Field>
          </div>

          {/* ===== รูปภาพ ===== */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider">รูปภาพโปรเจกต์</p>

              {/* Upload buttons */}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => multiFileRef.current?.click()} disabled={!!uploadProgress}
                  className="rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10 transition disabled:opacity-50">
                  📁 เลือกหลายรูป
                </button>
                <button type="button" onClick={() => folderRef.current?.click()} disabled={!!uploadProgress}
                  className="rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10 transition disabled:opacity-50">
                  📂 เลือกโฟลเดอร์
                </button>
                <input ref={multiFileRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
                {/* @ts-expect-error webkitdirectory is non-standard */}
                <input ref={folderRef} type="file" accept="image/*" webkitdirectory="" className="hidden"
                  onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
              </div>

              {form.images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {form.images.map((url) => {
                    const isCover = url === form.image_url;
                    return (
                      <div key={url}
                        className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition ${isCover ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.3)]" : "border-transparent"}`}
                        onClick={() => setCover(url)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {isCover && (
                          <div className="absolute top-1 left-1 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">ปก⭐</div>
                        )}
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(url); }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
                        {!isCover && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-[10px] font-medium">ตั้งปก</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <input value={form.image_url} onChange={(e) => set("image_url", e.target.value)}
                className="input text-sm" placeholder="หรือวาง URL รูปปกโดยตรง…" />
          </div>

          {/* ===== AI ===== */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-3">
              <p className="text-xs font-medium text-indigo-300/60 uppercase tracking-wider">✨ AI เติมรายละเอียด</p>

              <textarea rows={3} value={aiContext} onChange={(e) => setAiContext(e.target.value)}
                placeholder="บอก AI เพิ่มเติม เช่น: ฉันเป็นผู้จัดกิจกรรม, ได้รับรางวัล, ใช้เทคโนโลยีอะไร… (ไม่บังคับ)"
                className="input resize-none text-sm placeholder:text-white/20" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button type="button" onClick={() => aiFileRef.current?.click()}
                  disabled={!!uploadProgress || !!aiLoading}
                  className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 disabled:opacity-40 transition text-indigo-300 text-sm px-3 py-2">
                  📎 อัปโหลดรูปให้ AI
                </button>
                <input ref={aiFileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => handleAIUpload(e.target.files)} />
                <button type="button" onClick={() => handleAIGenerate("image")}
                  disabled={!!aiLoading || (!form.image_url && form.images.length === 0 && !aiContext.trim())}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition text-white text-sm font-semibold px-4 py-2">
                  {aiLoading
                    ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />กำลังวิเคราะห์…</>
                    : "✨ ให้ AI เติมรายละเอียด"}
                </button>
              </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-white/80">Featured (แสดงหน้าแรก)</span>
          </label>

          <Field label="Description / Details">
            <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="input resize-none" />
          </Field>

          <button
            type="submit"
            disabled={saving || !!uploadProgress}
            className="rounded-xl bg-white text-black font-semibold px-6 py-2.5 hover:bg-white/90 transition disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก…" : editId ? "บันทึกการแก้ไข" : "เพิ่มผลงาน"}
          </button>
        </form>
      )}

      {/* Works list */}
      {loading ? (
        <p className="text-white/50">กำลังโหลด…</p>
      ) : works.length === 0 ? (
        <p className="text-white/50">ยังไม่มีผลงาน</p>
      ) : (
        <div className="space-y-3">
          {works.map((w) => (
            <div key={w.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="flex items-start gap-3">
                {w.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.image_url} alt={w.title} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="font-semibold truncate">{w.title}</p>
                    {w.featured && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/80">Featured</span>
                    )}
                    {(w.images?.length ?? 0) > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-white/50">
                        🖼 {w.images.length} รูป
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/50 mt-0.5 truncate">
                    {[w.slug ? `/${w.slug}` : null, w.category, w.date].filter(Boolean).join(" · ")}
                  </p>
                  {w.tags?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {w.tags.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-white/15 text-white/60">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-1 border-t border-white/5">
                <button onClick={() => startEdit(w)} className="flex-1 text-sm py-2 rounded-lg border border-white/15 hover:bg-white/10 transition">
                  แก้ไข
                </button>
                <button onClick={() => handleDelete(w.id)} className="flex-1 text-sm py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition">
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-white/60">{label}</label>}
      {children}
    </div>
  );
}
