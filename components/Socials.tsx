"use client";
import Link from "next/link";
import { Github, Mail } from "lucide-react";

const EMAIL = "kongba5555@gmail.com";
const GITHUB = "https://github.com/twilught";

export default function Socials() {
  const base = "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm shadow-sm border-black/10 dark:border-white/10 hover:-translate-y-[1px] transition";
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`mailto:${EMAIL}`} className={base}><Mail size={16}/> Email</Link>
      <Link href={GITHUB} target="_blank" className={base}><Github size={16}/> GitHub</Link>
    </div>
  );
}
