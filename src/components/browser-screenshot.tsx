import Image from "next/image";
import type { GalleryImage } from "@/lib/experiences";

type BrowserScreenshotProps = {
  image: GalleryImage;
  projectName: string;
  index?: number;
  uniformSize?: boolean;
  presentation?: "browser" | "image";
};

export function BrowserScreenshot({ image, projectName, index = 0 }: BrowserScreenshotProps) {
  return (
    <figure className="project-figure">
      <div className="project-media" style={{ aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : "16 / 9" }}>
        {image.mediaType === "video" ? (
          <video aria-label={image.label} controls playsInline preload="metadata">
            <source src={image.src} type="video/mp4" />
          </video>
        ) : (
          <Image src={image.src} alt={image.label} fill priority={index === 0} sizes="(max-width: 820px) 90vw, 746px" className="object-contain" />
        )}
      </div>
      <figcaption>{image.label || projectName}</figcaption>
    </figure>
  );
}
