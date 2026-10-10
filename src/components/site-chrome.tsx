import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="portfolio-header reveal flex items-center justify-between py-6 text-xs text-white/55 sm:py-8">
      <Link className="font-medium text-white/85" href="/">
        Mehdi Khoudali
      </Link>
      <nav aria-label="Primary navigation" className="flex items-center gap-5 sm:gap-8">
        <Link className="transition-colors hover:text-white" href="/#work">
          Work
        </Link>
        <Link className="transition-colors hover:text-white" href="/#about">
          About me
        </Link>
        <a className="transition-colors hover:text-white" href="#contact">
          Let&apos;s talk
        </a>
      </nav>
    </header>
  );
}

export function SiteContact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-white/12 py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.72fr_1fr] lg:items-center lg:gap-16">
        <div className="reveal relative min-h-[280px] overflow-hidden border border-white/12 bg-[#111] sm:min-h-[380px] lg:min-h-[540px]">
          <Image
            src="/mehdi-contact.png"
            alt="Mehdi taking a mirror portrait"
            fill
            sizes="(min-width: 1180px) 420px, (min-width: 1024px) 38vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
            className="object-cover object-[center_40%]"
          />
        </div>
        <div className="min-w-0">
          <p className="reveal reveal-delay-1 mb-5 text-xs uppercase tracking-[0.14em] text-white/42">Contact</p>
          <h2 id="contact-title" className="reveal reveal-delay-2 text-[clamp(3.5rem,7.2vw,7.1rem)] leading-[0.86] tracking-[-0.065em] text-white">
            <span className="block font-medium">Let&apos;s</span>
            <span className="portfolio-serif portfolio-hero-serif block text-white/62">talk.</span>
          </h2>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center gap-x-5 gap-y-4 sm:mt-12">
            <a
              className="portfolio-cta-button"
              href="mailto:mehdikhoudalpro@gmail.com"
            >
              Say hello
            </a>
            <a className="portfolio-contact-email break-all" href="mailto:mehdikhoudalpro@gmail.com">
              mehdikhoudalpro@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-white/12 py-6 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between sm:py-8">
      <p>Mehdi Khoudali / Software engineer</p>
      <div className="flex gap-5">
        <a className="transition-colors hover:text-white" href="https://x.com/mehdi_khoudali" target="_blank" rel="noreferrer">X</a>
        <a className="transition-colors hover:text-white" href="https://www.instagram.com/mehdi_khoudali/" target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </footer>
  );
}
