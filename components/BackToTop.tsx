"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 600);
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-3
                 shadow-[0_10px_30px_rgba(0,0,0,.35)] hover:translate-y-[-2px] transition"
    >
      ↑
    </button>
  );
}
