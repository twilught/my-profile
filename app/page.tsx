import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import Socials from "@/components/Socials";
import ContactForm from "@/components/ContactForm";
import ProfileSections from "@/components/ProfileSections";
import Reveal from "@/components/Reveal";
import GradientDivider from "@/components/GradientDivider";

import profileImg from "@/public/images/profile/IMG_0704.png";
import FeaturedProjects from "@/components/FeaturedProjects";

export const metadata: Metadata = {
  title: "Athip Buasamlee — Portfolio",
  description:
    "เว็บพอร์ตโฟลิโอ ผลงาน และข้อมูลติดต่อของ Athip Buasamlee นักพัฒนาเว็บสาย UX-first เน้นคุณภาพโค้ดและประสบการณ์ผู้ใช้",
  openGraph: {
    title: "Athip Buasamlee — Portfolio",
    description: "ดูผลงาน วิจัย และติดต่อ Athip Buasamlee นักพัฒนาเว็บ UX-first",
    url: "https://your-domain.com",
    siteName: "Athip Buasamlee Portfolio",
    images: [
      {
        url: "/images/profile/IMG_0704.png",
        width: 800,
        height: 800,
        alt: "Athip Buasamlee Portfolio",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
};

export default function Home() {
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "REST API",
    "Git",
    "SQL",
    "Python",
  ];

  return (
    <main aria-label="Homepage" className="relative overflow-clip">
      {/* === Background layers === */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-black/10 to-transparent dark:from-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tl from-black/10 to-transparent dark:from-white/10 blur-3xl" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04] dark:opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.18),transparent_70%)] dark:bg-[radial-gradient(closest-side,rgba(255,255,255,0.25),transparent_70%)] blur-xl" />
      </div>

      {/* === HERO (mobile-first) === */}
      <section
        className="mx-auto max-w-[900px] px-4 py-16 sm:py-20 grid md:grid-cols-2 gap-10 items-center"
        aria-labelledby="hero-title"
      >
        {/* รูป: ขึ้นก่อนในจอเล็ก, ย้ายไปขวาเมื่อจอ ≥ md */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 transition-transform duration-200 will-change-transform hover:scale-[1.01]">
            <div className="absolute inset-0 rounded-[1.6rem] bg-gradient-to-tr from-black/10 to-transparent dark:from-white/15" />
            <div className="absolute -inset-[1px] rounded-[1.7rem] ring-1 ring-black/10 dark:ring-white/15" />
            <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] shadow-[0_8px_40px_rgba(0,0,0,.45)]">
              <Image
                src={profileImg}
                alt="รูปโปรไฟล์ Athip Buasamlee"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 10rem, (max-width: 1024px) 14rem, 16rem"
              />
            </div>
          </div>
        </div>

        {/* ข้อความ: จัดกลางบนมือถือ, ซ้ายเมื่อจอ ≥ md */}
        <div className="order-2 md:order-1 text-center md:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs tracking-wide text-black/70 dark:text-white/70 bg-white/50 dark:bg-white/10 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Minimal · UX-first · Quality
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              id="hero-title"
              className="mt-3 text-balance text-[clamp(2rem,7vw,3.5rem)] font-black leading-[1.05] tracking-tight"
            >
              <span className="bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/60 bg-clip-text text-transparent">
                ATHIP&nbsp;BUASAMLEE
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-3 text-pretty text-base sm:text-lg opacity-85 leading-relaxed">
              ผมคือผู้ที่มองเห็นปัญหาในฐานะโอกาสในการสร้างสรรค์ ใช้ความเข้าใจเชิงลึกในการออกแบบระบบ
              และเล่าเรื่องเพื่อสื่อสารไอเดียซับซ้อนให้เข้าใจง่าย
            </p>
          </Reveal>

          {/* ปุ่ม: เต็มแถวบนมือถือ, แถวเดียวเมื่อจอ ≥ sm */}
          <Reveal delay={0.16}>
            <div className="mt-6 grid grid-cols-1 sm:inline-flex sm:flex-wrap gap-3">
              <Link
                href="/projects"
                aria-label="ดูผลงานทั้งหมด"
                className="shine-btn h-11 rounded-xl sm:px-4 justify-center"
              >
                ดูผลงาน
              </Link>
              <Link href="#about" className="btn-ghost h-11 rounded-xl sm:px-4 justify-center">
                About
              </Link>
              <Link href="#contact" className="btn-ghost h-11 rounded-xl sm:px-4 justify-center">
                ติดต่อฉัน
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-5 flex justify-center md:justify-start">
              <Socials />
            </div>
          </Reveal>

          {/* Stats: แตะง่ายขึ้นบนมือถือ */}
          <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { k: "Projects", v: "15+" },
              { k: "Awards", v: "4" },
              { k: "Years", v: "2+" },
            ].map((s, i) => (
              <Reveal key={s.k} delay={0.22 + i * 0.06}>
                <div className="rounded-2xl border border-black/10 dark:border-white/15 px-3 py-3 sm:px-4 sm:py-3 bg-white/55 dark:bg-white/10 backdrop-blur text-center">
                  <div className="text-lg sm:text-xl font-extrabold leading-none">{s.v}</div>
                  <div className="mt-1 text-[10px] sm:text-[11px] uppercase tracking-wider opacity-60">
                    {s.k}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* === ABOUT === */}
      <Reveal>
        <section id="about" className="mx-auto max-w-6xl px-4 pb-6" aria-labelledby="about-title">
          <h2 id="about-title" className="text-2xl font-semibold">
            About
          </h2>
          <p className="mt-4 leading-relaxed opacity-90">
            ผมคือผู้ที่มองเห็นปัญหาเป็นโอกาสในการสร้างสรรค์ ด้วยความเข้าใจเชิงลึก ผมออกแบบสถาปัตยกรรมระบบ
            เพื่อสร้างรากฐานที่มั่นคง และใช้การเล่าเรื่องเพื่อสื่อสารแนวคิดที่ซับซ้อนให้ทุกคนเข้าถึงได้ง่าย
            ผมไม่เคยหยุดเรียนรู้เทคโนโลยีใหม่ ๆ เพราะเชื่อว่านวัตกรรมคือกุญแจสำคัญในการขับเคลื่อนอนาคต
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "REST API", "Git", "SQL", "Python"].map(
              (s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full text-sm border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/10 backdrop-blur"
                >
                  {s}
                </span>
              )
            )}
          </div>
        </section>
      </Reveal>

      {/* === PROFILE SECTIONS === */}
      <Reveal>
        <ProfileSections />
      </Reveal>

      <GradientDivider />
      <GradientDivider />

      {/* === FEATURED PROJECTS === */}
      <Reveal>
        {/* ts-expect-error Async Server Component */}
        <FeaturedProjects />
      </Reveal>

      <GradientDivider />

      {/* === CONTACT === */}
      <Reveal>
        <section id="contact" className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="contact-title">
          <h2 id="contact-title" className="flex items-center gap-2 text-2xl font-semibold mb-4">
            ✉️ Contact
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <ContactForm />
            <div className="rounded-2xl border border-black/10 dark:border-white/15 p-6 bg-white/50 dark:bg-white/10 backdrop-blur transition-transform duration-200 hover:-translate-y-0.5">
              <h3 className="font-semibold">พร้อมคุยงานเสมอ</h3>
              <p className="mt-2 opacity-80">แจ้งรายละเอียดโปรเจกต์, ระยะเวลา, และงบประมาณคร่าว ๆ ได้เลย</p>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
