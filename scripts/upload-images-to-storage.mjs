/**
 * รัน: node scripts/upload-images-to-storage.mjs
 * อัปโหลดรูปทุกรูปจาก public/images/projects/ ขึ้น Supabase Storage
 * แล้วอัปเดต URL ใน DB
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, extname, basename } from "node:path";
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

const BUCKET = "project-images";
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const MIME = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".webp": "image/webp",
  ".gif": "image/gif", ".avif": "image/avif",
};

function sanitizeStorageName(name) {
  // เปลี่ยนอักขระที่ Supabase Storage ไม่รับ (non-ASCII, space) เป็น underscore
  return name.replace(/[^\w.\-]/g, "_");
}

async function uploadFile(localPath, storagePath) {
  // ถ้าไฟล์อยู่ใน Storage แล้วให้ข้าม
  const { data: existing } = await supabase.storage.from(BUCKET).list(
    storagePath.split("/").slice(0, -1).join("/"),
    { search: basename(storagePath) }
  );
  if (existing?.length > 0) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    return data.publicUrl;
  }

  const buffer = readFileSync(localPath);
  const ext = extname(localPath).toLowerCase();
  const contentType = MIME[ext] ?? "image/jpeg";

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: true,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

// ดึง works ทั้งหมด
const { data: works, error } = await supabase.from("works").select("id, slug, image_url, images");
if (error) { console.error(error.message); process.exit(1); }

for (const w of works) {
  if (!w.slug) continue;

  const localDir = resolve(root, "public", "images", "projects", w.slug);
  let localFiles;
  try {
    localFiles = readdirSync(localDir, { withFileTypes: true })
      .filter((f) => f.isFile() && IMAGE_EXTS.has(extname(f.name).toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    continue; // ไม่มีโฟลเดอร์ ข้ามไป
  }

  if (localFiles.length === 0) continue;

  console.log(`\n📁 ${w.slug} (${localFiles.length} รูป)`);

  const uploadedUrls = [];
  let coverUrl = "";

  for (const file of localFiles) {
    const localPath = resolve(localDir, file.name);
    const storagePath = `${w.slug}/${sanitizeStorageName(file.name)}`;
    const localRelPath = `/images/projects/${w.slug}/${file.name}`;

    try {
      const url = await uploadFile(localPath, storagePath);
      uploadedUrls.push(url);

      // ถ้า local cover ตรงกับไฟล์นี้ → ใช้ URL นี้เป็น cover
      if (w.image_url === localRelPath || w.image_url?.includes(file.name)) {
        coverUrl = url;
      }

      process.stdout.write(`  ✅ ${file.name}\n`);
    } catch (err) {
      process.stdout.write(`  ❌ ${file.name}: ${err.message}\n`);
    }
  }

  if (uploadedUrls.length === 0) continue;

  // ถ้าหา cover ไม่เจอให้ใช้รูปแรก
  if (!coverUrl) coverUrl = uploadedUrls[0];

  const { error: upErr } = await supabase
    .from("works")
    .update({ images: uploadedUrls, image_url: coverUrl })
    .eq("id", w.id);

  if (upErr) {
    console.error(`  ❌ อัปเดต DB ไม่สำเร็จ: ${upErr.message}`);
  } else {
    console.log(`  💾 บันทึก DB: ${uploadedUrls.length} รูป, ปก = ${coverUrl.split("/").pop()}`);
  }
}

console.log("\n✅ เสร็จทั้งหมด");
