// app/projects/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import projectsData from "@/data/projects.json";
import GalleryGrid from "@/components/GalleryGrid";

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
  images?: unknown;    // อนุโลมชนิด ข้อมูลอาจมาจาก JSON หลากหลาย
  imagesDir?: unknown; // อนุโลมชนิดเช่นกัน
};

export async function generateStaticParams() {
  return (projectsData as Project[]).map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const p = (projectsData as Project[]).find((x) => x.slug === params.slug);

  if (!p) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">ไม่พบโปรเจกต์</h1>
        <Link href="/projects" className="inline-block mt-6 underline">← กลับ Projects</Link>
      </main>
    );
  }

  // ---- รวมรูปจาก images หรือ imagesDir (อ่านจาก /public) ----
  const norm = (u: string) =>
    u.replace(/^\s*public\/?/, "") // ตัด "public/" ถ้าเผลอใส่มา
     .replace(/^\/?/, "/");        // บังคับขึ้นต้นด้วย "/"

  let gallery: string[] = [];

  // 1) ถ้ามี images และเป็นอาเรย์ของสตริง → ใช้เลย
  if (Array.isArray(p.images)) {
    gallery = (p.images as unknown[])
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
      .map(norm)
      .map((u) => {
        const parts = u.split("/");
        const file = parts.pop()!;
        return `${parts.join("/")}/${encodeURIComponent(file)}`;
      });
  } else {
    // 2) มิฉะนั้นลองใช้ imagesDir (รับทั้งสตริงหรืออาเรย์ เอาตัวแรก)
    const dirFromJson =
      typeof p.imagesDir === "string"
        ? p.imagesDir
        : Array.isArray(p.imagesDir) && typeof p.imagesDir[0] === "string"
        ? p.imagesDir[0]
        : undefined;

    if (dirFromJson && dirFromJson.trim()) {
      const dirPublic = norm(dirFromJson); // e.g. "/images/projects/xxx"
      const dirFs = path.join(process.cwd(), "public", dirPublic.slice(1));
      try {
        const files = fs.readdirSync(dirFs, { withFileTypes: true });
        const allow = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
        gallery = files
          .filter((f) => f.isFile() && allow.has(path.extname(f.name).toLowerCase()))
          .sort((a, b) => a.name.localeCompare(b.name, "en"))
          .map((f) => `${dirPublic}/${encodeURIComponent(f.name)}`);
      } catch {
        gallery = [];
      }
    }
  }

  const imagesForLightbox = gallery.map((src) => ({ src, alt: p.title }));

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
            src={norm(p.cover)}
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

      {/* Gallery (client → ควบคุม Lightbox) */}
      {imagesForLightbox.length > 0 && <GalleryGrid images={imagesForLightbox} />}

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
