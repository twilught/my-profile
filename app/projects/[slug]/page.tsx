// app/projects/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import projectsData from "@/data/projects.json";

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
  images?: string[];
  imagesDir?: string;
};

export async function generateStaticParams() {
  return (projectsData as Project[]).map((p) => ({ slug: p.slug }));
}

// 👇 สำคัญ: ใช้ Promise แล้ว await params
export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (projectsData as Project[]).find((x) => x.slug === slug);

  if (!p) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">ไม่พบโปรเจกต์</h1>
        <Link href="/projects" className="inline-block mt-6 underline">
          ← กลับ Projects
        </Link>
      </main>
    );
  }

  // รวมรูปจาก images / imagesDir (อ่านโฟลเดอร์ใน public)
  let gallery: string[] = [];
  if (Array.isArray(p.images) && p.images.length) {
    gallery = p.images;
  } else if (p.imagesDir) {
    const dir = path.join(process.cwd(), "public", p.imagesDir.replace(/^\/+/, ""));
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      const allow = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
      gallery = files
        .filter((f) => f.isFile() && allow.has(path.extname(f.name).toLowerCase()))
        .sort()
        .map((f) => path.posix.join(p.imagesDir!, f.name));
    } catch {
      // ถ้าอ่านโฟลเดอร์ไม่ได้ก็ไม่เป็นไร ปล่อยว่าง
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <h1 className="text-3xl font-extrabold">{p.title}</h1>
        {p.date && <div className="mt-2 text-sm opacity-60">{p.date}</div>}
        <div className="mt-3 flex flex-wrap gap-2">
          {(p.tags ?? []).map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full border text-xs border-black/15 dark:border-white/20"
            >
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
      {p.details && (
        <p className="mt-4 leading-relaxed opacity-90 whitespace-pre-wrap">{p.details}</p>
      )}

      {/* แกลเลอรีจากโฟลเดอร์ */}
      {gallery.length > 0 && (
        <section className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {gallery.map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={src}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </section>
      )}

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
        <Link
          href="/projects"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm border-black/15 dark:border-white/20"
        >
          ← กลับ Projects
        </Link>
      </div>
    </main>
  );
}
