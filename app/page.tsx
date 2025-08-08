// app/page.tsx
import Image from "next/image";

export default function Home() {
  const skills = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
    "Tailwind CSS", "REST API", "Git", "SQL", "Python"
  ];

  const projects = [
    {
      title: "My Portfolio",
      desc: "เว็บโปรไฟล์ส่วนตัวด้วย Next.js + Tailwind",
      link: "https://example.com",
    },
    {
      title: "API Dashboard",
      desc: "แดชบอร์ดเชื่อมต่อ REST API พร้อมกราฟ",
      link: "https://example.com",
    },
    {
      title: "E‑commerce UI",
      desc: "หน้าเว็บขายของ ดีไซน์มินิมอล รองรับมือถือ",
      link: "https://example.com",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">MyProfile</span>
          <ul className="flex gap-6 text-sm">
            <li><a href="#about" className="hover:text-gray-600">About</a></li>
            <li><a href="#skills" className="hover:text-gray-600">Skills</a></li>
            <li><a href="#projects" className="hover:text-gray-600">Projects</a></li>
            <li><a href="#contact" className="hover:text-gray-600">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-500">Hello, I’m</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-1">Your Name</h1>
          <p className="mt-4 text-lg text-gray-600">
            Front‑end / Full‑stack Developer ที่ชอบสร้างเว็บสวย เร็ว ใช้งานง่าย
            โฟกัสที่ประสบการณ์ผู้ใช้และคุณภาพของโค้ด
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#projects" className="px-5 py-2 rounded-xl bg-black text-white hover:opacity-90">
              ดูผลงาน
            </a>
            <a href="#contact" className="px-5 py-2 rounded-xl border hover:bg-gray-100">
              ติดต่อฉัน
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-3xl overflow-hidden ring-4 ring-white shadow">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=640&auto=format&fit=crop"
              alt="Profile"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          สวัสดีครับ/ค่ะ ฉันเป็นนักพัฒนาที่ชอบแก้ปัญหา ออกแบบสถาปัตยกรรมระบบ
          และเล่าเรื่องผ่าน UI ที่เป็นมิตร รักการเรียนรู้เทคโนโลยีใหม่ ๆ
          และการทำงานร่วมกับทีมแบบ Agile
        </p>
      </section>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="px-3 py-1 rounded-full border bg-white text-sm">{s}</span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <a
              key={p.title}
              href={p.link}
              target="_blank"
              className="group rounded-2xl border bg-white p-5 hover:shadow-md transition"
            >
              <h3 className="font-semibold group-hover:underline">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{p.desc}</p>
              <span className="inline-block mt-4 text-sm opacity-70">Visit →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="mt-4 text-gray-700">เปิดรับงาน/คุยงานได้ที่:</p>
        <ul className="mt-2 space-y-2 text-gray-700">
          <li>📧 your@email.com</li>
          <li>🐦 twitter.com/yourhandle</li>
          <li>💼 linkedin.com/in/yourprofile</li>
          <li>🧑‍💻 github.com/yourname</li>
        </ul>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Your Name. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
