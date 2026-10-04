import Image from "next/image";
import Link from "next/link";
import { experiences } from "@/lib/experiences";

const homepageExperiences = experiences.filter(
  (experience) => experience.showOnHomepage !== false,
);

export default function Home() {
  return (
    <main className="portfolio-page min-h-screen bg-[#0a0a0a] text-[#f0eee8]">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-12">
        <header className="portfolio-header reveal flex items-center justify-between py-6 text-xs text-white/55 sm:py-8">
          <a className="font-medium text-white/85" href="#top">
            Mehdi Khoudali
          </a>
          <nav aria-label="Primary navigation" className="flex items-center gap-5 sm:gap-8">
            <a className="transition-colors hover:text-white" href="#work">
              Work
            </a>
            <a className="transition-colors hover:text-white" href="#about">
              About me
            </a>
            <a className="transition-colors hover:text-white" href="#contact">
              Let&apos;s talk
            </a>
          </nav>
        </header>

        <section id="top" className="portfolio-hero border-t border-white/12 py-16 sm:py-24 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-16">
            <div>
              <div className="reveal mb-10 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/10 sm:mb-12 lg:hidden">
                <Image
                  src="/mehdi-portrait.jpg"
                  alt="Portrait of Mehdi Khoudali"
                  width={96}
                  height={96}
                  priority
                  className="h-full w-full object-cover object-[center_35%] grayscale"
                />
              </div>

              <p className="reveal reveal-delay-1 mb-5 text-xs uppercase tracking-[0.14em] text-white/42">
                Casablanca, Morocco / Building apps for influencers.
              </p>
              <h1 className="reveal reveal-delay-2 max-w-5xl text-[clamp(3.5rem,7.2vw,7.1rem)] leading-[0.86] tracking-[-0.065em] text-white">
                <span className="block font-medium">Software</span>
                <span className="portfolio-serif portfolio-hero-serif block text-white/62">engineer.</span>
              </h1>
              <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-12">
                <a
                  className="portfolio-cta-button"
                  href="https://mehdikhoudali.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join my newsletter
                </a>
                <p className="text-xs text-white/42">Read by +1000 founders.</p>
              </div>
            </div>

            <div className="reveal reveal-delay-2 relative hidden min-h-[540px] overflow-hidden border border-white/12 bg-[#111] lg:block">
              <Image
                src="/mehdi-portrait.jpg"
                alt="Portrait of Mehdi Khoudali"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-[center_34%] contrast-105 grayscale-[0.2]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/[0.06]" />
              <div className="absolute inset-x-0 bottom-0 border-t border-white/15 px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-white/42">
                <span>Mehdi Khoudali</span>
              </div>
            </div>
          </div>

          <div id="about" className="reveal reveal-delay-3 mt-14 grid gap-7 border-t border-white/12 pt-6 sm:mt-20 sm:grid-cols-[0.75fr_1fr] sm:gap-12">
            <p className="text-sm uppercase tracking-[0.12em] text-white/38">About me</p>
            <div className="max-w-xl">
              <p className="text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
                I&apos;m <strong className="font-medium text-white">Mehdi Khoudali</strong>, a <strong className="font-medium text-white">software engineer</strong>{" "}based in Casablanca. I build and ship web products across the frontend, backend, and infrastructure, staying close to both the product and the people using it. I&apos;ve founded products, scaled FeedbackLoop to 700 users, and worked on software used across thousands of venues. That experience keeps me focused on building software that is clear, useful, and reliable.
              </p>
            </div>
          </div>
        </section>

        <section id="work" aria-labelledby="work-title" className="border-t border-white/12 py-16 sm:py-24">
          <div className="mb-10 grid gap-6 sm:grid-cols-[0.75fr_1fr] sm:gap-12">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.14em] text-white/38">Selected work</p>
              <h2 id="work-title" className="portfolio-serif text-4xl text-white/78 sm:text-5xl">Things I&apos;ve built</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/48 sm:pt-1">
              Full-stack products, internal systems, and businesses built from
              an early idea into something people could use.
            </p>
          </div>

          <div className="border-t border-white/15">
            {homepageExperiences.map((item, index) => (
              <Link
                className="portfolio-work-row reveal grid gap-4 border-b border-white/12 py-6 transition-colors sm:grid-cols-[1fr_1.2fr_auto] sm:items-start sm:gap-6 sm:py-8"
                href={`/experience/${item.slug}`}
                style={{ animationDelay: `${120 + index * 65}ms` }}
                key={`${item.role}-${item.company}`}
              >
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-white sm:text-2xl">{item.company}</h3>
                  <p className="mt-1 text-sm text-white/42">{item.role}</p>
                </div>
                <p className="max-w-md text-sm leading-6 text-white/52">{item.summary}</p>
                <span className="text-xs text-white/35 sm:pt-1">View project</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="contact" className="border-t border-white/12 py-16 sm:py-20">
          <div className="grid gap-8 sm:grid-cols-[0.75fr_1fr] sm:gap-12">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.14em] text-white/38">Contact</p>
              <h2 className="portfolio-serif text-4xl text-white/78 sm:text-5xl">Have a product in mind?</h2>
            </div>
            <div className="flex max-w-xl flex-col items-start gap-7 sm:pt-1">
              <p className="text-lg leading-8 text-white/66 sm:text-xl">
                Tell me what you&apos;re building, where you&apos;re stuck, or what needs
                to ship next.
              </p>
              <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/12 pt-6">
                <a
                  className="portfolio-cta-button"
                  href="mailto:mehdikhoudalpro@gmail.com?subject=Let%27s%20talk%20about%20a%20project"
                >
                  Get in touch
                </a>
                <a className="portfolio-contact-email" href="mailto:mehdikhoudalpro@gmail.com">
                  mehdikhoudalpro@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/12 py-6 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between sm:py-8">
          <p>Mehdi Khoudali / Software engineer</p>
          <div className="flex gap-5">
            <a className="transition-colors hover:text-white" href="https://x.com/mehdi_khoudali" target="_blank" rel="noreferrer">X</a>
            <a className="transition-colors hover:text-white" href="https://www.instagram.com/mehdi_khoudali/" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
