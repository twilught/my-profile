// app/projects/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import raw from "@/data/projects.json";

export const metadata: Metadata = {
  title: "Projects — Athip Buasamlee",
  description: "รวมผลงาน โปรเจกต์ และสิ่งที่ได้ทำ",
};

type Project = {
  slug: string;
  title: string;
  summary?: string;
  details?: string;
  date?: string;
  tags?: string[];
  demo?: string;
  github?: string;
  cover?: string;
};

export default async function ProjectsPage({
  searchParams,
}: {
  // รองรับทั้ง object และ promise (แบบที่ Vercel คาด)
  searchParams?: { q?: string; tag?: string } | Promise<{ q?: string; tag?: string }>;
}) {
  // ปรับให้เป็น object เสมอ
  const sp =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ q?: string; tag?: string }>)
      : ((searchParams as { q?: string; tag?: string }) ?? {});

  const q = (sp.q ?? "").toLowerCase();
  const activeTag = (sp.tag ?? "").toLowerCase();

  const list = (raw as Project[])
    .map((p) => ({ ...p, _dateNum: p.date ? new Date(p.date).getTime() : 0 }))
    .sort((a, b) => b._dateNum - a._dateNum);

  const filtered = list.filter((p) => {
    const hay = (p.title + " " + (p.summary ?? "") + " " + (p.tags ?? []).join(" ")).toLowerCase();
    const okQ = q ? hay.includes(q) : true;
    const okTag = activeTag ? (p.tags ?? []).some((t) => t.toLowerCase() === activeTag) : true;
    return okQ && okTag;
  });

  const allTags = Array.from(new Set(list.flatMap((p) => p.tags ?? []))).sort();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Projects</h1>
          <p className="opacity-70 mt-1">
            {filtered.length} รายการ
            {q ? ` • ค้นหา: “${q}”` : ""}
            {activeTag ? ` • แท็ก: ${activeTag}` : ""}
          </p>
        </div>

        <form className="flex gap-2" action="/projects" method="get" role="search">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="ค้นหาโปรเจกต์..."
            className="w-64 max-w-full rounded-xl border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/10 px-3 py-2"
          />
          {activeTag && <input type="hidden" name="tag" value={activeTag} />}
          <button className="rounded-xl border px-4 py-2 text-sm border-black/15 dark:border-white/20 hover:-translate-y-[1px] transition">
            ค้นหา
          </button>
        </form>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/projects"
          className={`px-3 py-1 rounded-full border text-sm ${
            !activeTag
              ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
              : "border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          ทั้งหมด
        </Link>
        {allTags.map((t) => {
          const current = t.toLowerCase() === activeTag;
          const params = new URLSearchParams({ ...(q ? { q } : {}), tag: t }).toString();
          return (
            <Link
              key={t}
              href={`/projects?${params}`}
              className={`px-3 py-1 rounded-full border text-sm ${
                current
                  ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                  : "border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {t}
            </Link>
          );
        })}
      </div>

      <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <article
            key={p.slug}
            className="group overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <Link href={`/projects/${p.slug}`} className="block">
              {p.cover ? (
                <div className="relative h-40">
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    className="object-cover transition group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-b from-black/10 to-black/0 dark:from-white/10 dark:to-transparent" />
              )}
            </Link>

            <div className="p-5">
              <h2 className="font-semibold text-lg">
                <Link href={`/projects/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h2>
              {p.summary && <p className="mt-2 text-sm opacity-80">{p.summary}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {(p.tags ?? []).map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full border text-xs border-black/15 dark:border-white/20">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-sm opacity-60">{p.date}</div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/projects/${p.slug}`}
                  className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20 hover:-translate-y-[1px] transition"
                >
                  รายละเอียด →
                </Link>
                {p.github && (
                  <Link
                    href={p.github}
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20 hover:-translate-y-[1px] transition"
                  >
                    GitHub
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      {filtered.length === 0 && <p className="mt-10 opacity-70">ไม่พบโปรเจกต์ที่ตรงกับเงื่อนไข</p>}
    </main>
  );
}
