"use client";
import { useState } from "react";
import Lightbox from "@/components/Lightbox";

export default function GalleryGrid({ images }: { images: { src: string; alt?: string }[] }) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(0);

  return (
    <>
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Gallery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/15"
              onClick={() => { setStart(i); setOpen(true); }}
            >
              <img
                src={img.src}
                alt={img.alt ?? ""}
                className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>

      <Lightbox images={images} start={start} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
