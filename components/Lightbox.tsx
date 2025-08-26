"use client";
import { useEffect, useMemo, useState } from "react";

type LightboxProps = {
  images: { src: string; alt?: string }[];
  start?: number;
  open?: boolean;
  onClose?: () => void;
};

export default function Lightbox({ images, start = 0, open = false, onClose }: LightboxProps) {
  const [index, setIndex] = useState(start);
  const safe = useMemo(() => images.filter(Boolean), [images]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % safe.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + safe.length) % safe.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, safe.length, onClose]);

  if (!open || safe.length === 0) return null;
  const img = safe[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={img.src}
          alt={img.alt ?? ""}
          className="w-full h-auto rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.5)] select-none"
        />
        {/* Controls */}
        <button
          aria-label="Prev"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur px-3 py-2 border border-white/20 hover:bg-white/20"
          onClick={() => setIndex((i) => (i - 1 + safe.length) % safe.length)}
        >
          ←
        </button>
        <button
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur px-3 py-2 border border-white/20 hover:bg-white/20"
          onClick={() => setIndex((i) => (i + 1) % safe.length)}
        >
          →
        </button>
        <button
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full bg-white/10 backdrop-blur px-3 py-1 border border-white/20 hover:bg-white/20 text-sm"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 text-xs opacity-80">
          {index + 1} / {safe.length}
        </div>
      </div>
    </div>
  );
}
