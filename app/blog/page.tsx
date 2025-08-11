import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export default function Home() {
  const skills = ["JavaScript","TypeScript","React","Next.js","Node.js","Tailwind CSS","REST API","Git","SQL","Python"];

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-60">Hello, I’m</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-1">Your Name</h1>
          <p className="mt-4 text-lg opacity-80">
            นักพัฒนาเว็บสายมินิมอล โทนขาวดำ เน้น UX และคุณภาพของโค้ด
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/projects" className="btn btn-primary">ดูผลงาน</Link>
            <a href="#contact" className="btn btn-ghost">ติดต่อฉัน</a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-2xl overflow-hidden ring-4 ring-white/60 dark:ring-white/10 shadow">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=640&auto=format&fit=crop"
              alt="Profile"
              fill className="object-cover" priority
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="mt-4 leading-relaxed opacity-90">
          ฉันชอบแก้ปัญหา ออกแบบสถาปัตยกรรมระบบ และเล่าเรื่องผ่าน UI ที่เป็นมิตร
          รักการเรียนรู้เทคโนโลยีใหม่ ๆ และ Agile
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((s) => (<span key={s} className="tag">{s}</span>))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <ContactForm />
      </section>
    </main>
  );
}