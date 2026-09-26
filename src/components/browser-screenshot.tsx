import Image from "next/image";
import type { GalleryImage } from "@/lib/experiences";

type BrowserScreenshotProps = {
  image: GalleryImage;
  projectName: string;
  index?: number;
  uniformSize?: boolean;
};

export function BrowserScreenshot({
  image,
  projectName,
  index = 0,
  uniformSize = false,
}: BrowserScreenshotProps) {
  return (
    <figure className="reveal flex h-full flex-col overflow-hidden border border-white/15 bg-[#111]">
      <div className="flex min-h-11 items-center justify-between gap-4 border-b border-white/10 bg-[#161616] px-3 sm:min-h-12 sm:px-4">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <div className="flex max-w-[70%] items-center gap-2 border-l border-white/8 pl-3 py-1.5 text-[10px] text-white/38 sm:min-w-64 sm:text-xs">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
          <span className="truncate">
            {image.browserLabel ?? projectName}
          </span>
        </div>
      </div>

      <div
        className={`relative overflow-hidden bg-white ${
          uniformSize ? "aspect-[3/2]" : ""
        }`}
        style={
          uniformSize
            ? undefined
            : {
                aspectRatio:
                  image.width && image.height
                    ? `${image.width} / ${image.height}`
                    : "16 / 9",
              }
        }
      >
        {image.mediaType === "video" ? (
          <video
            aria-label={image.label}
            className="absolute inset-0 h-full w-full object-contain"
            controls
            playsInline
            preload="metadata"
          >
            <source src={image.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={image.src}
            alt={image.label}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 94vw, 100vw"
            className={uniformSize ? "object-contain" : "object-cover"}
          />
        )}
      </div>

      <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-white/58 sm:px-5 sm:py-4">
        <span className="text-white/58">{image.label}</span>
      </figcaption>
    </figure>
  );
}
