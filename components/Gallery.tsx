"use client";

import Image from "next/image";
import { useState } from "react";

export default function Gallery({
  images,
  altBase,
}: {
  images: string[];
  altBase?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const openAt = (idx: number) => {
    setActive(idx);
    setOpen(true);
  };

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => openAt(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-black/10 dark:border-white/10"
            aria-label={`เปิดรูปที่ ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${altBase ?? "image"} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl aspect-[16/10] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={`${altBase ?? "image"} full`}
              fill
              sizes="100vw"
              className="object-contain bg-black"
              priority
            />
            {/* Controls */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 rounded-full bg-white/90 text-black px-3 py-1 text-sm"
            >
              ปิด
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActive((active - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 text-black px-3 py-1 text-sm"
                >
                  ‹
                </button>
                <button
                  onClick={() => setActive((active + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 text-black px-3 py-1 text-sm"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
