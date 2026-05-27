import Image from "next/image";
import type { GalleryImage } from "@/lib/experiences";

type EditorialGalleryProps = {
  images: GalleryImage[];
  emptyLabel?: string;
  emptySlots?: number;
};

export function EditorialGallery({
  images,
  emptyLabel = "Image pending",
  emptySlots = 6,
}: EditorialGalleryProps) {
  const slots =
    images.length > 0
      ? images
      : Array.from({ length: emptySlots }, (_, index) => ({
          src: "",
          label: `${emptyLabel} ${String(index + 1).padStart(2, "0")}`,
        }));

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {slots.map((image, index) => (
        <div
          className="glass-card reveal group relative min-h-72 overflow-hidden border border-white/15 sm:min-h-96"
          style={{ animationDelay: `${160 + index * 70}ms` }}
          key={`${image.label}-${index}`}
        >
          {image.src ? (
            <Image
              src={image.src}
              alt={`${image.label} photo`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.035]"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_35%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.08),transparent_24%)] opacity-70 transition-opacity group-hover:opacity-100" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),transparent_38%,rgba(0,0,0,0.62)),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_24%)] opacity-85 transition-opacity group-hover:opacity-65" />
          <div className="absolute inset-0 mix-blend-overlay opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.42)_1px,transparent_0)] [background-size:16px_16px]" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/12 px-4 py-3 text-xs uppercase text-white/35">
            <span>Image stop</span>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-sm text-white/45">
            <span className="max-w-36">{image.label}</span>
            <span className="text-white/25">
              {image.src ? "Personal archive" : "Coming soon"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
