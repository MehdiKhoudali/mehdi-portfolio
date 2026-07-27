import Image from "next/image";
import type { GalleryImage } from "@/lib/experiences";

type BrowserScreenshotProps = {
  image: GalleryImage;
  index?: number;
};

export function BrowserScreenshot({
  image,
  index = 0,
}: BrowserScreenshotProps) {
  return (
    <figure className="reveal overflow-hidden rounded-xl border border-white/15 bg-[#0d0d0d] shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
      <div className="grid min-h-11 grid-cols-[1fr_auto_1fr] items-center border-b border-white/10 bg-[#151515] px-3 sm:min-h-12 sm:px-4">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <div className="flex max-w-[46vw] items-center gap-2 rounded-md border border-white/8 bg-black/25 px-3 py-1.5 text-[10px] text-white/38 sm:min-w-64 sm:text-xs">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300/65" />
          <span className="truncate">Kitt Medical / Team dashboard</span>
        </div>
        <span className="justify-self-end text-[9px] uppercase tracking-[0.16em] text-white/22 sm:text-[10px]">
          0{index + 1}
        </span>
      </div>

      <div className="relative aspect-[1915/874] overflow-hidden bg-white">
        <Image
          src={image.src}
          alt={image.label}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 94vw, 100vw"
          className="object-cover"
        />
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-xs text-white/35 sm:px-5 sm:py-4">
        <span className="text-white/58">{image.label}</span>
        <span>Product interface / Kitt Medical</span>
      </figcaption>
    </figure>
  );
}
