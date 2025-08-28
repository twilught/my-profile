"use client";

import { useState } from "react";
import Image from "next/image";

type Item = { src: string; alt?: string };

export default function GalleryGrid({ images }: { images: Item[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  const onPrev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const onNext = () => setIdx((i) => (i + 1) % images.length);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => openAt(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/15"
            aria-label={`เปิดรูปที่ ${i + 1}`}
          >
            <Image
              src={img.src}
              alt={img.alt ?? ""}
              fill
              className="object-cover transition group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-white/20">
              <Image
                src={images[idx].src}
                alt={images[idx].alt ?? ""}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-white/90">
              <button
                onClick={onPrev}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              >
                ← ก่อนหน้า
              </button>
              <div className="text-sm opacity-80">
                {idx + 1} / {images.length}
              </div>
              <button
                onClick={onNext}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              >
                ถัดไป →
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white"
              aria-label="ปิด"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
