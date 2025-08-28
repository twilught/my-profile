import Image from "next/image";
import Link from "next/link";
import { loadProjects, loadProject, type Project } from "@/lib/projects";

export async function generateStaticParams() {
  return loadProjects().map((p) => ({ slug: p.slug }));
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const p = loadProject(params.slug);

  if (!p) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">ไม่พบโปรเจกต์</h1>
        <Link href="/projects" className="inline-block mt-6 underline">← กลับ Projects</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <h1 className="text-3xl font-extrabold">{p.title}</h1>
        <div className="mt-2 text-sm opacity-60">{p.date}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(p.tags ?? []).map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full border text-xs border-black/15 dark:border-white/20">
              {t}
            </span>
          ))}
        </div>
      </header>

      {p.cover && (
        <div className="relative mt-6 aspect-[16/9] rounded-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/15">
          <Image
            src={p.cover}
            alt={p.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {p.summary && <p className="mt-6 text-lg">{p.summary}</p>}
      {p.details && <p className="mt-4 leading-relaxed opacity-90 whitespace-pre-wrap">{p.details}</p>}

      <div className="mt-8 flex flex-wrap gap-3">
        {p.demo && (
          <Link
            href={p.demo}
            target="_blank"
            className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20 hover:-translate-y-[1px] transition"
          >
            เปิด Demo ↗
          </Link>
        )}
        {p.github && (
          <Link
            href={p.github}
            target="_blank"
            className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20 hover:-translate-y-[1px] transition"
          >
            GitHub
          </Link>
        )}
        <Link href="/projects" className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20">
          ← กลับ Projects
        </Link>
      </div>
    </main>
  );
}
