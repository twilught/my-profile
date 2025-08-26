"use client";

import { GraduationCap, Briefcase, Sparkles } from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";

const base = { opacity: 0, y: 10 };
const show = { opacity: 1, y: 0 };

// ใช้ spring แทน ease (แก้ type error)
const spring = { type: "spring" as const, stiffness: 220, damping: 26, mass: 0.9 };

export default function ProfileSections() {
  const reduce = useReducedMotion();

  // ฟังก์ชันช่วยใส่ delay ให้แต่ละ block
  const delay = (i = 0) => ({
    ...spring,
    delay: reduce ? 0 : 0.05 * i,
  });

  const skills = [
    { label: "3D MODELING", style: "bg-white/70 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/15 backdrop-blur" },
    { label: "SOFT SKILLS", style: "bg-white/70 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/15 backdrop-blur" },
    { label: "INTERNET OF THINGS", style: "bg-black text-white dark:bg-white dark:text-black" },
    { label: "DEVELOPMENT", style: "bg-white/70 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/15 backdrop-blur" },
    { label: "DESIGN", style: "bg-white/70 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/15 backdrop-blur" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="section-education"
        className="mx-auto max-w-6xl px-4 py-16 grid gap-10 md:grid-cols-2"
      >
        {/* การศึกษา */}
        <motion.div
          initial={base}
          whileInView={show}
          viewport={{ once: true, margin: "-80px" }}
          transition={delay(0)}
        >
          <h2 id="section-education" className="text-2xl font-extrabold flex items-center gap-2">
            <GraduationCap className="size-6" aria-hidden="true" />
            การศึกษา
          </h2>
          <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/15 space-y-1">
            <p className="font-bold">กำลังศึกษา ปริญญาตรี</p>
            <p>วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี</p>
            <p>สาขานวัตกรรมดิจิทัล</p>
          </div>
        </motion.div>

        {/* ประสบการณ์ระหว่างการศึกษา */}
        <motion.div
          initial={base}
          whileInView={show}
          viewport={{ once: true, margin: "-80px" }}
          transition={delay(1)}
        >
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <Briefcase className="size-6" aria-hidden="true" />
            ประสบการณ์ ระหว่างการศึกษา
          </h2>
          <ul className="mt-3 pt-3 border-t border-black/10 dark:border-white/15 space-y-2 text-sm sm:text-base list-disc pl-5">
            <li>โชว์ผลงานที่งาน <b>THAILAND NEW GEN INVENTORS AWARD 2024</b></li>
            <li>เข้าร่วมการแข่งขัน <b>STARTUP THAILAND LEAGUE 2024</b></li>
            <li>เข้าร่วมการแข่งขัน <b>TED FUND THAILAND</b></li>
            <li>ทำถ้วยรางวัลให้กับบริษัท <b>KUBOTA</b></li>
          </ul>
        </motion.div>

        {/* ทักษะ */}
        <motion.div
          className="md:col-span-2"
          initial={base}
          whileInView={show}
          viewport={{ once: true, margin: "-80px" }}
          transition={delay(2)}
        >
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <Sparkles className="size-6" aria-hidden="true" />
            ทักษะความสามารถ และ <span className="hidden sm:inline">ความสามารถพิเศษ</span>
          </h2>
          <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/15 flex flex-wrap gap-3">
            {skills.map((s, i) => (
              <motion.span
                key={s.label}
                className={`px-3.5 py-1.5 rounded-full text-sm ${s.style}`}
                initial={base}
                whileInView={show}
                viewport={{ once: true, margin: "-80px" }}
                transition={delay(3 + i)}
              >
                {s.label}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
