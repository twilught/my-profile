// components/FeaturedProjects.tsx
import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import TiltCard from "@/components/TiltCard";  // ⬅️ import


type Project = {
  slug: string;
  title: string;
  summary?: string;
  date?: string;     // "YYYY-MM" หรือ "YYYY-MM-DD"
  tags?: string[];
  cover?: string;
  featured?: boolean;
};

async function loadProjects(): Promise<Project[]> {
  const file = path.join(process.cwd(), "data", "projects.json");
  const raw = await fs.promises.readFile(file, "utf8");
  return JSON.parse(raw) as Project[];
}

function isNew(date?: string) {
  if (!date) return false;
  const d = new Date(date);
  if (Number.isNaN(+d)) return false;
  const diff = Date.now() - d.getTime();
  const days = diff / 86400000;
  return days <= 60; // 60 วันล่าสุดให้ติด NEW
}

export default async function FeaturedProjects() {
  const all = await loadProjects();

  const list =
    all.filter(p => p.featured).slice(0, 6).length > 0
      ? all.filter(p => p.featured).slice(0, 6)
      : [...all]
          .map(p => ({ ...p, _d: p.date ? new Date(p.date).getTime() : 0 }))
          .sort((a, b) => b._d - a._d)
          .slice(0, 3);

  if (list.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="feat-title">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h2 id="feat-title" className="text-2xl md:text-3xl font-semibold tracking-tight">
            ตัวอย่างผลงานล่าสุด
          </h2>
          <p className="mt-1 text-sm opacity-70">สไลด์ดูในมือถือได้ · แตะการ์ดเพื่อดูรายละเอียด</p>
        </div>
        <Link
          href="/projects"
          className="hidden sm:inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20 hover:-translate-y-[1px] transition"
        >
          ดูทั้งหมด →
        </Link>
      </div>
        
      {/* มือถือ: แนวนอน / จอใหญ่: กริด */}
      <div className="grid grid-flow-col auto-cols-[85%] gap-4 overflow-x-auto pb-3 [scroll-snap-type:x_mandatory] sm:[scroll-snap-type:none] sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible">

        {list.map((p) => (
        <TiltCard key={p.slug}>
            <article
            className="group relative scroll-snap-align-start rounded-[20px] border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur overflow-hidden transition will-change-transform"
            >
            {/* กรอบเรืองแสง */}
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] -m-px bg-gradient-to-br from-black/10 to-transparent dark:from-white/10" />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-black/10 dark:ring-white/10" />

            <Link href={`/projects/${p.slug}`} className="block">
              <div className="relative h-44 w-full overflow-hidden">
                {p.cover ? (
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    sizes="(max-width:640px) 85vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition group-hover:scale-[1.03]"
                    priority={false}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-b from-black/10 to-transparent dark:from-white/10" />
                )}

                {/* top badges */}
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  {isNew(p.date) && (
                    <span className="rounded-full bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 text-[10px] font-semibold shadow/50">
                      NEW
                    </span>
                  )}
                  {p.date && (
                    <span className="rounded-full backdrop-blur bg-white/70 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/20 px-2.5 py-1 text-[10px]">
                      {p.date}
                    </span>
                  )}
                </div>

                {/* gradient overlay ด้านล่างรูป */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-black/70"
                />
              </div>
            </Link>

            {/* เนื้อหา */}
            <div className="relative p-4 sm:p-5">
              <h3 className="font-semibold leading-tight">
                <Link href={`/projects/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h3>

              {p.summary && (
                <p className="mt-1 text-sm opacity-80 line-clamp-2">
                  {p.summary}
                </p>
              )}

              {p.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full border text-xs border-black/15 dark:border-white/20 bg-white/60 dark:bg-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/projects/${p.slug}`}
                  className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20 transition group-hover:-translate-y-[1px]"
                >
                  รายละเอียด →
                </Link>
              </div>

              {/* shine */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition"
                style={{
                  background:
                    "radial-gradient(1200px 200px at var(--mx,50%) -20%, rgba(255,255,255,.18), transparent 60%)",
                }}
              />
            </div>
          </article>
          </TiltCard>
        ))}
      </div>

      <div className="mt-5 sm:hidden">
        <Link
          href="/projects"
          className="inline-flex w-full items-center justify-center rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20"
        >
          ดูทั้งหมด →
        </Link>
      </div>
    </section>
  );
}
