/**
 * รัน: node scripts/migrate-projects.mjs
 * ย้ายข้อมูลจาก data/projects.json เข้า Supabase works table
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// อ่าน env จาก .env.local
const envRaw = readFileSync(resolve(root, ".env.local"), "utf8");
const env = Object.fromEntries(
  envRaw
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((p) => p.trim()))
    .filter(([k]) => k)
    .map(([k, ...v]) => [k, v.join("=").replace(/^"|"$/g, "")])
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const projects = JSON.parse(readFileSync(resolve(root, "data", "projects.json"), "utf8"));

const rows = projects.map((p) => ({
  slug: p.slug ?? null,
  title: p.title,
  description: [p.summary, p.details].filter(Boolean).join("\n\n") || null,
  category: null,
  tags: p.tags ?? [],
  image_url: p.cover ?? null,
  link: p.demo || null,
  github: p.github || null,
  date: p.date ?? null,
  year: p.date ? parseInt(p.date.slice(0, 4)) : null,
  featured: p.featured ?? false,
}));

console.log(`Migrating ${rows.length} projects…`);

const { data, error } = await supabase
  .from("works")
  .upsert(rows, { onConflict: "slug", ignoreDuplicates: false })
  .select("slug, title");

if (error) {
  console.error("Error:", error.message);
  process.exit(1);
}

console.log("Done! Inserted/updated:");
data.forEach((r) => console.log(` · ${r.slug ?? "(no slug)"} — ${r.title}`));
