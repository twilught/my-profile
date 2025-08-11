import Image from "next/image";
import Link from "next/link";
import Socials from "../components/Socials";
import ContactForm from "../components/ContactForm";
import FadeIn from "../components/FadeIn";

const PROFILE = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop";

export default function Home() {
  const skills = ["JavaScript","TypeScript","React","Next.js","Node.js","Tailwind CSS","REST API","Git","SQL","Python"];

  return (
    <main>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] opacity-60">Hello, I’m</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mt-3 leading-tight">
            <span className="bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
              ATHIP BUASAMLEE
            </span>
          </h1>
          <p className="mt-5 text-lg opacity-85">นักพัฒนาเว็บสายมินิมอล โทนขาว/ดำ เน้น UX และคุณภาพของโค้ด</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/projects" className="btn btn-primary">ดูผลงาน</Link>
            <a href="#contact" className="btn btn-ghost">ติดต่อฉัน</a>
          </div>
          <div className="mt-6"><Socials /></div>
        </div>

        <FadeIn>
          <div className="flex justify-center md:justify-end">
            <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden ring-1 ring-white/20 shadow-[0_8px_40px_rgba(0,0,0,.45)]">
              <Image src={PROFILE} alt="Profile" fill className="object-cover" priority />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="mt-4 leading-relaxed opacity-90">
          ฉันชอบแก้ปัญหา ออกแบบสถาปัตยกรรมระบบ และเล่าเรื่องผ่าน UI ที่เป็นมิตร รักการเรียนรู้เทคโนโลยีใหม่ ๆ และ Agile
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map(s => <span key={s} className="tag">{s}</span>)}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <ContactForm />
          <div className="card">
            <h3 className="font-semibold">พร้อมคุยงานเสมอ</h3>
            <p className="mt-2 opacity-80">แจ้งรายละเอียดโปรเจกต์, ระยะเวลา, และงบประมาณคร่าว ๆ ได้เลย</p>
          </div>
        </div>
      </section>
    </main>
  );
}
