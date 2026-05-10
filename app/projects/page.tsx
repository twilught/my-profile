import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAdminSupabase, type Work } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects — Athip Buasamlee",
  description: "รวมผลงาน โปรเจกต์ และสิ่งที่ได้ทำ",
};

export default async function ProjectsPage(props: { searchParams?: Promise<Record<string, string>> }) {
  const sp = props.searchParams ? await props.searchParams : {};
  const q = ((sp.q ?? "") as string).toLowerCase();
  const activeTag = ((sp.tag ?? "") as string).toLowerCase();

  const { data: raw } = await getAdminSupabase()
    .from("works")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (raw ?? []) as Work[];

  const filtered = list.filter((p) => {
    const hay = (p.title + " " + (p.description ?? "") + " " + (p.tags ?? []).join(" ")).toLowerCase();
    const okQ = q ? hay.includes(q) : true;
    const okTag = activeTag ? (p.tags ?? []).some((t) => t.toLowerCase() === activeTag) : true;
    return okQ && okTag;
  });

  const allTags = Array.from(new Set(list.flatMap((p) => p.tags ?? []))).sort();

  function href(p: Work) {
    return p.slug ? `/projects/${p.slug}` : `/projects/${p.id}`;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Projects</h1>
          <p className="opacity-70 mt-1">
            {filtered.length} รายการ
            {q ? ` • ค้นหา: "${q}"` : ""}
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
            key={p.id}
            className="group overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <Link href={href(p)} className="block">
              {p.image_url ? (
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover transition group-hover:scale-[1.02]"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-b from-black/10 to-black/0 dark:from-white/10 dark:to-transparent" />
              )}
            </Link>

            <div className="p-5">
              <h2 className="font-semibold text-lg">
                <Link href={href(p)} className="hover:underline">
                  {p.title}
                </Link>
              </h2>
              {p.description && <p className="mt-2 text-sm opacity-80 line-clamp-2">{p.description}</p>}
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
                  href={href(p)}
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
