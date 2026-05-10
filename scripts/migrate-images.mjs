/**
 * รัน: node scripts/migrate-images.mjs
 * อ่านรูปจาก public/images/projects/[slug]/ แล้วบันทึก path ลง Supabase
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// อ่าน env
const envRaw = readFileSync(resolve(root, ".env.local"), "utf8");
const env = Object.fromEntries(
  envRaw.split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]; })
    .filter(([k]) => k)
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function readImageDir(slug) {
  const dir = resolve(root, "public", "images", "projects", slug);
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((f) => f.isFile() && IMAGE_EXTS.has(extname(f.name).toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((f) => `/images/projects/${slug}/${f.name}`);
  } catch {
    return [];
  }
}

// ดึง works ทั้งหมดจาก DB
const { data: works, error } = await supabase.from("works").select("id, slug, image_url, images");
if (error) { console.error(error.message); process.exit(1); }

let updated = 0;

for (const w of works) {
  if (!w.slug) continue;

  const localImages = readImageDir(w.slug);
  if (localImages.length === 0) continue;

  // รูปปก: ถ้า cover ปัจจุบันอยู่ใน localImages ให้ใช้ต่อ ไม่งั้นใช้รูปแรก
  const cover = localImages.includes(w.image_url) ? w.image_url : localImages[0];

  // ไม่ต้องอัปเดตถ้ามีข้อมูลครบแล้ว
  const alreadySynced = (w.images ?? []).length === localImages.length && w.image_url === cover;
  if (alreadySynced) {
    console.log(`  skip  ${w.slug} (${localImages.length} รูป)`);
    continue;
  }

  const { error: upErr } = await supabase
    .from("works")
    .update({ images: localImages, image_url: cover })
    .eq("id", w.id);

  if (upErr) {
    console.error(`  ❌ ${w.slug}: ${upErr.message}`);
  } else {
    console.log(`  ✅ ${w.slug}: ${localImages.length} รูป, ปก = ${cover}`);
    updated++;
  }
}

console.log(`\nเสร็จ: อัปเดต ${updated} โปรเจกต์`);
