import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY ยังไม่ได้ตั้งค่า" }, { status: 500 });
  }

  try {
    const { imageUrl, context } = await req.json();

    if (!imageUrl && !context) {
      return NextResponse.json({ error: "ต้องมีรูปหรือข้อความอย่างน้อยหนึ่งอย่าง" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { maxOutputTokens: 2048 } });

    const prompt = `คุณคือผู้ช่วยสร้าง personal portfolio ของ "อธิป บัวสำลี"

วิเคราะห์ข้อมูลที่ให้มา (อาจเป็นรูป ข้อความ หรือทั้งคู่) แล้วสร้างรายละเอียดสำหรับลงใน portfolio
เนื้อหาอาจเป็น: โปรเจกต์ซอฟต์แวร์ / ความสำเร็จ / รางวัล / ทุนการศึกษา / กิจกรรมที่จัด / ประสบการณ์

สำคัญ: อ่านข้อมูลทั้งหมดให้ครบก่อน แล้วเขียน description แบบธรรมชาติ ตรงกับสิ่งที่เกิดขึ้นจริง${context ? `\n\nข้อมูลเพิ่มเติม: ${context}` : ""}

ตอบเป็น JSON อย่างเดียว ห้ามมี markdown code block:
{
  "title": "ชื่อที่กระชับและตรงประเด็น (ภาษาไทย)",
  "slug": "url-friendly-slug-english-only",
  "description": "รายละเอียดภาษาไทย 5-7 ประโยค เล่าให้ครบว่าทำอะไร เกิดขึ้นที่ไหน เมื่อไหร่ มีใครเกี่ยวข้อง ได้เรียนรู้หรือได้รับอะไร และมีความสำคัญอย่างไรต่อการพัฒนาตัวเอง เขียนแบบธรรมชาติเหมือนบันทึกความทรงจำ",
  "category": "เลือกหนึ่ง: Web App / Mobile App / Dashboard / Startup / Award / Scholarship / Activity / Design / Tool / Other",
  "tags": ["tag 3-5 อัน"],
  "year": ${new Date().getFullYear()}
}`;

    const parts: Parameters<typeof model.generateContent>[0] = [];

    if (imageUrl) {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        return NextResponse.json({ error: "โหลดรูปไม่ได้" }, { status: 400 });
      }
      const buffer = await imgRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = (imgRes.headers.get("content-type") ?? "image/jpeg") as string;
      parts.push({ inlineData: { mimeType, data: base64 } });
    }

    parts.push(prompt);

    const result = await model.generateContent(parts);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI ตอบในรูปแบบที่ไม่ถูกต้อง: " + text.slice(0, 200) }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
