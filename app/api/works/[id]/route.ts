import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { extractStoragePath } from "@/app/api/upload/route";

const BUCKET = "project-images";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { slug, title, description, category, tags, image_url, images, link, github, year, date, featured } = body;

  const { data, error } = await getAdminSupabase()
    .from("works")
    .update({ slug: slug || null, title, description, category, tags, image_url, images: images ?? [], link, github, year, date, featured: featured ?? false })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getAdminSupabase();

  // ดึง images ก่อนลบ
  const { data: work } = await db.from("works").select("images, image_url").eq("id", id).maybeSingle();

  // รวม URL ทั้งหมดที่ต้องลบจาก storage
  const allUrls = Array.from(new Set([
    ...(work?.images ?? []),
    ...(work?.image_url ? [work.image_url] : []),
  ]));

  const storagePaths = allUrls.map(extractStoragePath).filter((p): p is string => p !== null);

  if (storagePaths.length > 0) {
    await db.storage.from(BUCKET).remove(storagePaths);
  }

  const { error } = await db.from("works").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
