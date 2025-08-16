import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // แค่รับแล้วตอบกลับ 200 ให้ฟอร์มทำงานต่อได้
  const body = await req.json().catch(() => ({}));
  console.log("Contact form (mock):", body);
  return NextResponse.json({ ok: true });
}
