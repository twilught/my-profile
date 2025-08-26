// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // validate เบื้องต้น
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing fields (name/email/message)" },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;
    const to = process.env.CONTACT_RECEIVER || user;

    if (!user || !pass || !from || !to) {
      return NextResponse.json(
        { ok: false, error: "SMTP is not configured on server" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user, pass },
    });

    // optional: verify การเชื่อมต่อ (ดีตอนตั้งค่าใหม่)
    await transporter.verify();

    await transporter.sendMail({
      from,
      to,
      subject: `📩 ข้อความใหม่จาก ${name}`,
      text: `ชื่อ: ${name}\nอีเมล: ${email}\n\nข้อความ:\n${message}`,
      replyTo: email, // กด Reply แล้วตอบกลับผู้กรอกฟอร์มได้
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // production: log แบบสั้นๆ พอ
    console.error("Contact API error:", (err as Error)?.message || err);
    return NextResponse.json(
      { ok: false, error: "Failed to send" },
      { status: 500 }
    );
  }
}
