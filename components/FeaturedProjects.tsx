// components/FeaturedProjects.tsx
import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import { getSupabase, type Work } from "@/lib/supabase";

function isNew(date?: string | null) {
  if (!date) return false;
  const d = new Date(date);
  if (Number.isNaN(+d)) return false;
  return (Date.now() - d.getTime()) / 86400000 <= 60;
}

function projectHref(p: Work) {
  return p.slug ? `/projects/${p.slug}` : `/projects/${p.id}`;
}

export default async function FeaturedProjects() {
  const { data: raw } = await getSupabase()
    .from("works")
    .select("*")
    .order("date", { ascending: false, nullsFirst: false });

  const all = (raw ?? []) as Work[];

  const featured = all.filter((p) => p.featured).slice(0, 6);
  const list = featured.length > 0 ? featured : all.slice(0, 3);

  if (list.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8" aria-labelledby="feat-title">
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

      <div className="grid grid-flow-col auto-cols-[85%] gap-4 overflow-x-auto pb-3 [scroll-snap-type:x_mandatory] sm:[scroll-snap-type:none] sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible">
        {list.map((p) => (
          <TiltCard key={p.id}>
            <article className="group relative scroll-snap-align-start rounded-[20px] border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur overflow-hidden transition will-change-transform">
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] -m-px bg-gradient-to-br from-black/10 to-transparent dark:from-white/10" />
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-black/10 dark:ring-white/10" />

              <Link href={projectHref(p)} className="block">
                <div className="relative h-44 w-full overflow-hidden">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover transition group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-b from-black/10 to-transparent dark:from-white/10" />
                  )}

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

                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-black/70" />
                </div>
              </Link>

              <div className="relative p-4 sm:p-5">
                <h3 className="font-semibold leading-tight">
                  <Link href={projectHref(p)} className="hover:underline">
                    {p.title}
                  </Link>
                </h3>

                {p.description && (
                  <p className="mt-1 text-sm opacity-80 line-clamp-2">{p.description}</p>
                )}

                {p.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full border text-xs border-black/15 dark:border-white/20 bg-white/60 dark:bg-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={projectHref(p)}
                    className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20 transition group-hover:-translate-y-[1px]"
                  >
                    รายละเอียด →
                  </Link>
                </div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition"
                  style={{
                    background: "radial-gradient(1200px 200px at var(--mx,50%) -20%, rgba(255,255,255,.18), transparent 60%)",
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
