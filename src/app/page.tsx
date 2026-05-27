import Image from "next/image";
import Link from "next/link";
import { EditorialGallery } from "@/components/editorial-gallery";
import { HeroRoleSwitcher } from "@/components/hero-role-switcher";
import { experiences } from "@/lib/experiences";

const galleryImages = [
  { src: "/img1.png", label: "Work table" },
  { src: "/img2.png", label: "Cafe wall" },
  { src: "/img3.png", label: "Atlantic sunset" },
  { src: "/img4.png", label: "Night hotel" },
  { src: "/img5.png", label: "Transit fit" },
  { src: "/img6.png", label: "Street detail" },
];

const homepageExperiences = experiences.filter(
  (experience) => experience.showOnHomepage !== false,
);

export default function Home() {
  return (
    <main className="grain min-h-screen bg-[#070707] text-[#efefea]">
      <div className="glass-shell flex min-h-screen w-full flex-col border-white/15">
        <section
          id="top"
          className="grid min-h-screen grid-cols-1 border-b border-white/15 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="glass-section grid min-h-screen grid-rows-[auto_auto_1fr_auto] border-b border-white/15 p-4 sm:p-6 lg:border-r lg:border-b-0 lg:p-8">
            <nav
              aria-label="Primary navigation"
              className="reveal mb-10 flex items-center justify-between border-b border-white/15 pt-2 pb-6 text-sm text-white/55 sm:pt-3 sm:pb-7"
            >
              <a className="transition-colors hover:text-white/85" href="#top">
                Home
              </a>
              <a className="transition-colors hover:text-white/85" href="#about">
                About
              </a>
            </nav>

            <div className="reveal reveal-delay-1">
              <p className="mb-6 text-xs uppercase text-white/40">
                Casablanca, Morocco / Software and startups
              </p>
              <h1 className="max-w-full text-5xl leading-none font-semibold text-white sm:text-8xl lg:text-9xl">
                MEHDI.K
              </h1>
            </div>

            <div className="reveal reveal-delay-2 flex self-center pt-10 sm:pt-14 lg:pt-18">
              <HeroRoleSwitcher />
            </div>

            <div className="reveal reveal-delay-3 grid gap-3 border-t border-white/15 pt-7 pb-3 text-sm text-white/58 sm:grid-cols-2 sm:pt-8 sm:pb-4">
              <a
                className="transition-colors hover:text-white/85"
                href="mailto:mehdikhoudalpro@gmail.com"
              >
                mehdikhoudalpro@gmail.com
              </a>
              <p className="sm:text-right">+1K newsletter readers</p>
            </div>
          </div>

          <aside className="reveal reveal-delay-3 relative min-h-[520px] min-w-0 overflow-hidden bg-[#10100f] lg:min-h-screen">
            <Image
              src="/mehdi-hero.jpeg"
              alt="Portrait of Mehdi Khoudali"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover contrast-105 saturate-90"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.46)),radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_32%)]" />
            <div className="absolute inset-0 mix-blend-overlay opacity-35 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.34)_1px,transparent_0)] [background-size:18px_18px]" />
          </aside>
        </section>

        <section
          aria-labelledby="gallery-title"
          className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8"
        >
          <div className="reveal mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs uppercase text-white/40">Visual notes</p>
              <h2
                id="gallery-title"
                className="text-4xl leading-none font-semibold sm:text-5xl"
              >
                Image Index
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-6 text-white/45 sm:block">
              Six large image slots for portraits, product moments, or raw
              behind-the-scenes visuals.
            </p>
          </div>

          <EditorialGallery images={galleryImages} />
        </section>

        <section
          id="about"
          className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8"
        >
          <div className="grid gap-10 lg:grid-cols-[0.36fr_1fr]">
            <div className="reveal">
              <p className="mb-3 text-xs uppercase text-white/40">About</p>
              <h2 className="text-5xl leading-none font-semibold sm:text-6xl">
                Briefly
              </h2>
            </div>

            <div className="reveal reveal-delay-1 grid gap-7 text-lg leading-9 text-white/68 md:grid-cols-2">
              <p>
                I am Mehdi Khoudali, a software engineer, freelancer, and
                startup founder based in Casablanca, Morocco. I enjoy turning
                rough ideas into usable products, then learning from how people
                actually respond.
              </p>
              <p>
                I freelance with teams on product and engineering work while
                continuing to build my own projects. That balance keeps the work
                grounded: client systems teach discipline, and startups keep the
                pace sharp.
              </p>
            </div>
          </div>
        </section>

        <section
          className="glass-section p-4 sm:p-6 lg:p-8"
          aria-labelledby="experience-title"
        >
          <div className="reveal mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs uppercase text-white/40">Archive</p>
              <h2
                id="experience-title"
                className="text-5xl leading-none font-semibold sm:text-6xl"
              >
                Experience
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-6 text-white/45 sm:block">
              A compact record of the work, products, and teams behind the
              current direction.
            </p>
          </div>

          <div className="border-t border-white/18">
            {homepageExperiences.map((item, index) => (
              <Link
                className="glass-row reveal grid gap-2 border-b border-white/15 px-4 py-5 transition-colors sm:grid-cols-[1fr_0.75fr_0.55fr] sm:gap-6 sm:px-5 lg:px-6"
                href={`/experience/${item.slug}`}
                style={{ animationDelay: `${120 + index * 65}ms` }}
                key={`${item.role}-${item.company}`}
              >
                <div>
                  <h3 className="text-xl font-medium text-white">{item.role}</h3>
                  <p className="mt-1 text-white/55">{item.company}</p>
                </div>
                <p className="text-white/58 sm:pt-1">{item.location}</p>
                <p className="text-white/42 sm:pt-1 sm:text-right">
                  {item.date}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="glass-section reveal mt-auto grid gap-5 border-t border-white/15 p-4 text-sm text-white/55 sm:grid-cols-2 sm:p-6 lg:p-8">
          <div>
            <p className="text-white/80">Mehdi K / Mehdi Khoudali</p>
            <a
              className="mt-2 block transition-colors hover:text-white/85"
              href="mailto:mehdikhoudalpro@gmail.com"
            >
              mehdikhoudalpro@gmail.com
            </a>
          </div>
          <div className="flex gap-5 sm:justify-end">
            <a
              className="transition-colors hover:text-white/85"
              href="https://x.com/mehdi_khoudali"
              target="_blank"
              rel="noreferrer"
            >
              Twitter/X
            </a>
            <a
              className="transition-colors hover:text-white/85"
              href="https://www.instagram.com/mehdi_khoudali/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
