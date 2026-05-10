import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { getAdminSupabase, type Work } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function loadGallery(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", "projects", slug);
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    return files
      .filter((f) => f.isFile() && IMAGE_EXTS.has(path.extname(f.name).toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((f) => `/images/projects/${slug}/${f.name}`);
  } catch {
    return [];
  }
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const db = getAdminSupabase();
  let p: Work | null = null;

  const bySlug = await db.from("works").select("*").eq("slug", slug).maybeSingle();
  if (bySlug.data) {
    p = bySlug.data as Work;
  } else {
    const byId = await db.from("works").select("*").eq("id", slug).maybeSingle();
    p = (byId.data as Work) ?? null;
  }

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

  const cover = p.image_url;

  // ใช้รูปจาก DB ก่อน ถ้าไม่มีค่อยโหลดจาก local folder
  const dbImages = (p.images ?? []).filter((src) => src !== cover);
  const localImages = dbImages.length === 0 && p.slug ? loadGallery(p.slug).filter((src) => src !== cover) : [];
  const galleryFiltered = dbImages.length > 0 ? dbImages : localImages;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <h1 className="text-3xl font-extrabold">{p.title}</h1>
        {p.date && <div className="mt-2 text-sm opacity-60">{p.date}</div>}
        <div className="mt-3 flex flex-wrap gap-2">
          {(p.tags ?? []).map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full border text-xs border-black/15 dark:border-white/20">
              {t}
            </span>
          ))}
        </div>
      </header>

      {/* Cover */}
      {cover && (
        <div className="mt-6 aspect-[16/9] rounded-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/15">
          {cover.startsWith("/") ? (
            <Image
              src={cover}
              alt={p.title}
              width={900}
              height={506}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={p.title} className="w-full h-full object-cover" />
          )}
        </div>
      )}

      {p.description && (
        <p className="mt-6 leading-relaxed opacity-90 whitespace-pre-wrap">{p.description}</p>
      )}

      {/* Gallery */}
      {galleryFiltered.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">รูปภาพเพิ่มเติม</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryFiltered.map((src) => (
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
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {p.link && (
          <Link
            href={p.link}
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
