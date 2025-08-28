// lib/projects.ts
import fs from "node:fs";
import path from "node:path";

export type Project = {
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

// โหลดไฟล์ data/projects.json แบบชัวร์ ๆ
export function loadProjects(): Project[] {
  try {
    const file = path.join(process.cwd(), "data", "projects.json");
    const raw = fs.readFileSync(file, "utf8");
    const json = JSON.parse(raw);
    if (Array.isArray(json)) return json as Project[];
    return [];
  } catch (e) {
    console.error("loadProjects error:", e);
    return [];
  }
}

export function loadProject(slug: string): Project | undefined {
  return loadProjects().find((p) => p.slug === slug);
}
