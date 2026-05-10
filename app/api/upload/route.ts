import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

const BUCKET = "project-images";

function sanitize(name: string) {
  return name.replace(/[^\w.\-]/g, "_");
}

/** POST — อัปโหลดรูป เก็บไว้ใน {slug}/{filename} */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const slug = (form.get("slug") as string | null)?.trim() || "uncategorized";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = `${sanitize(file.name.replace(/\.[^.]+$/, ""))}-${Date.now()}.${ext}`;
  const storagePath = `${slug}/${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await getAdminSupabase().storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = getAdminSupabase().storage.from(BUCKET).getPublicUrl(storagePath);
  return NextResponse.json({ url: data.publicUrl });
}

/** DELETE — ลบรูปออกจาก storage ด้วย public URL */
export async function DELETE(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "No url provided" }, { status: 400 });

  const storagePath = extractStoragePath(url);
  if (!storagePath) return NextResponse.json({ error: "Invalid url" }, { status: 400 });

  const { error } = await getAdminSupabase().storage.from(BUCKET).remove([storagePath]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

/** แปลง public URL → storage path เช่น "slug/filename.jpg" */
export function extractStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    // /storage/v1/object/public/project-images/slug/file.jpg
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return null;
    return url.pathname.slice(idx + marker.length);
  } catch {
    return null;
  }
}
