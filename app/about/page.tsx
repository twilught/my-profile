import Image from "next/image";

const PROFILE = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 space-y-16">
      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-extrabold mb-4">About Me</h1>
          <p className="leading-relaxed opacity-90">
            สวัสดีครับ ผมชื่อ <b>Athip Buasamlee</b> — นักพัฒนาเว็บที่ชอบสร้างสรรค์
            งานโทนมินิมอล ขาว–ดำ โฟกัส UX, Accessibility และคุณภาพของโค้ด
            สนุกกับการเรียนรู้เทคโนโลยีใหม่ ๆ และการทำงานแบบ Agile
          </p>
          <p className="mt-4 opacity-80">
            นอกเหนือจากการเขียนโค้ด ผมยังชอบงานดีไซน์, 3D, และการทดลอง
            ไอเดียใหม่ ๆ เพื่อเชื่อมโยงเทคโนโลยีเข้ากับชีวิตประจำวัน
          </p>
        </div>
        <div className="flex justify-center">
          <div className="relative w-64 h-64 rounded-3xl overflow-hidden ring-1 ring-white/20 shadow-[0_8px_40px_rgba(0,0,0,.45)]">
            <Image src={PROFILE} alt="Profile" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* การศึกษา */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">การศึกษา</h2>
        <div className="pt-3 border-t border-white/15 space-y-1">
          <p className="font-semibold">ปริญญาตรี (กำลังศึกษา)</p>
          <p>วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี</p>
          <p>สาขานวัตกรรมดิจิทัล</p>
        </div>
      </section>

      {/* ประสบการณ์ */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">ประสบการณ์ระหว่างศึกษา</h2>
        <div className="pt-3 border-t border-white/15 space-y-2 text-sm sm:text-base">
          <p>– โชว์ผลงานที่งาน <b>THAILAND NEW GEN INVENTORS AWARD 2024</b></p>
          <p>– เข้าร่วมการแข่งขัน <b>STARTUP THAILAND LEAGUE 2024</b></p>
          <p>– เข้าร่วมการแข่งขัน <b>TED FUND THAILAND</b></p>
          <p>– ทำถ้วยรางวัลให้กับบริษัท <b>KUBOTA</b></p>
        </div>
      </section>

      {/* ทักษะ */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">ทักษะความสามารถ</h2>
        <div className="pt-3 border-t border-white/15 flex flex-wrap gap-3">
          {[
            "3D Modeling",
            "Soft Skills",
            "Internet of Things",
            "Development",
            "Design",
            "JavaScript",
            "React / Next.js",
            "Tailwind CSS",
          ].map((s) => (
            <span
              key={s}
              className="px-4 py-2 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"
            >
              {s}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
