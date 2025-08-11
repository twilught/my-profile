import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type MDoc = {
  slug: string;
  content: string; // HTML
  data: { [key: string]: any } & { title: string; date?: string; description?: string };
};

async function mdToHtml(markdown: string) {
  const processed = await remark().use(html).process(markdown);
  return String(processed);
}

export async function getCollection(dir: "projects" | "blog"): Promise<MDoc[]> {
  const base = path.join(process.cwd(), "content", dir);
  const files = fs.readdirSync(base).filter(f => f.endsWith(".md"));
  const docs: MDoc[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(base, file), "utf8");
    const { content, data } = matter(raw);
    const htmlContent = await mdToHtml(content);
    docs.push({ slug: file.replace(/\.md$/, ""), content: htmlContent, data: data as any });
  }
  // sort by date desc if present
  docs.sort((a, b) => (b.data.date?.localeCompare(a.data.date ?? "") ?? 0));
  return docs;
}

export async function getBySlug(dir: "blog" | "projects", slug: string): Promise<MDoc | null> {
  const base = path.join(process.cwd(), "content", dir, `${slug}.md`);
  if (!fs.existsSync(base)) return null;
  const raw = fs.readFileSync(base, "utf8");
  const { content, data } = matter(raw);
  const htmlContent = await mdToHtml(content);
  return { slug, content: htmlContent, data: data as any };
}