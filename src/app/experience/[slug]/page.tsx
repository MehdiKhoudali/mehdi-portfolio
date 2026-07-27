import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowserScreenshot } from "@/components/browser-screenshot";
import { experiences, getExperience } from "@/lib/experiences";

type ExperiencePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return experiences.map((experience) => ({
    slug: experience.slug,
  }));
}

export async function generateMetadata({
  params,
}: ExperiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperience(slug);

  if (!experience) {
    return {};
  }

  return {
    title: `${experience.company} - Mehdi Khoudali`,
    description: experience.summary,
  };
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { slug } = await params;
  const experience = getExperience(slug);

  if (!experience) {
    notFound();
  }

  return (
    <main className="grain min-h-screen bg-[#070707] text-[#efefea]">
      <div className="glass-shell flex min-h-screen w-full flex-col border-white/15">
        <header className="glass-section border-b border-white/15 px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Project navigation"
            className="reveal flex items-center justify-between border-b border-white/15 py-5 text-sm text-white/55 sm:py-6"
          >
            <Link className="transition-colors hover:text-white/85" href="/">
              Home
            </Link>
            <Link
              className="transition-colors hover:text-white/85"
              href="/#experience-title"
            >
              Experience
            </Link>
          </nav>

          <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:py-16">
            <div className="reveal reveal-delay-1">
              <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.17em] text-white/38">
                <span>Work detail</span>
                <span className="h-px w-8 bg-white/20" />
                <span>{experience.category}</span>
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl leading-[0.92] font-semibold tracking-[-0.045em] text-white sm:text-7xl lg:text-[5.25rem]">
                {experience.company}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/52 sm:text-lg sm:leading-8">
                {experience.summary}
              </p>
            </div>

            <aside className="reveal reveal-delay-2 grid grid-cols-3 border border-white/15 bg-white/[0.02]">
              {[
                ["Role", experience.role],
                ["Joined", experience.date],
                ["Based", experience.location],
              ].map(([label, value], index) => (
                <div
                  className={`p-3 sm:p-4 ${index < 2 ? "border-r border-white/12" : ""}`}
                  key={label}
                >
                  <span className="text-[9px] uppercase tracking-[0.14em] text-white/30 sm:text-[10px]">
                    {label}
                  </span>
                  <strong className="mt-2 block text-xs leading-5 font-medium text-white/78 sm:text-sm">
                    {value}
                  </strong>
                </div>
              ))}
            </aside>
          </div>
        </header>

        {experience.gallery.length > 0 && (
          <section
            aria-labelledby="product-snapshot-title"
            className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8"
          >
            <div className="reveal mb-6 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  Product snapshot
                </p>
                <h2
                  id="product-snapshot-title"
                  className="mt-4 text-4xl leading-none font-semibold tracking-[-0.035em] sm:text-5xl"
                >
                  Inside the platform
                </h2>
              </div>
              <p className="hidden max-w-sm text-right text-sm leading-6 text-white/42 sm:block">
                A live product surface from the operational dashboard used by
                Kitt Medical customers.
              </p>
            </div>

            <div className="grid gap-5">
              {experience.gallery.map((image, index) => (
                <BrowserScreenshot image={image} index={index} key={image.src} />
              ))}
            </div>
          </section>
        )}

        <section className="glass-section grid gap-10 border-b border-white/15 p-5 sm:p-7 lg:grid-cols-[0.55fr_1fr] lg:p-10">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
              The project
            </p>
            <h2 className="mt-4 text-4xl leading-none font-semibold tracking-[-0.035em] sm:text-5xl">
              Software for
              <br />
              real emergencies.
            </h2>
          </div>

          <div className="reveal reveal-delay-1 grid gap-6 text-base leading-8 text-white/58 md:grid-cols-2">
            {experience.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="glass-section border-b border-white/15 p-5 sm:p-7 lg:p-10">
          <div className="reveal mb-8 flex items-end justify-between gap-6 lg:mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                Selected work
              </p>
              <h2 className="mt-4 text-4xl leading-none font-semibold tracking-[-0.035em] sm:text-5xl">
                What I contributed
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-6 text-white/45 sm:block">
              A compact set of responsibilities, product decisions, and
              engineering touchpoints.
            </p>
          </div>

          <div className="border-t border-white/18">
            {experience.highlights.map((highlight, index) => (
              <div
                className="glass-row reveal grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/15 px-4 py-4 text-sm text-white/62 transition-colors sm:px-5 sm:py-5 sm:text-base lg:px-6"
                style={{ animationDelay: `${120 + index * 65}ms` }}
                key={highlight}
              >
                <span className="text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </section>

        {experience.techStack.length > 0 && (
          <section
            className="glass-section border-b border-white/15 p-5 sm:p-7 lg:p-10"
            aria-labelledby="stack-title"
          >
            <div className="grid gap-10 lg:grid-cols-[0.36fr_1fr]">
              <div className="reveal">
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  Technical layer
                </p>
                <h2
                  id="stack-title"
                  className="mt-4 text-4xl leading-none font-semibold tracking-[-0.035em] sm:text-5xl"
                >
                  Stack
                </h2>
              </div>

              <div className="reveal reveal-delay-1 flex flex-wrap gap-2 self-start">
                {experience.techStack.map((tool, index) => (
                  <span
                    className="glass-chip"
                    style={{ animationDelay: `${90 + index * 35}ms` }}
                    key={tool}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="glass-section reveal mt-auto grid gap-5 border-t border-white/15 p-4 text-sm text-white/55 sm:grid-cols-2 sm:p-6 lg:p-8">
          <p className="text-white/80">{experience.company}</p>
          <Link
            className="transition-colors hover:text-white/85 sm:text-right"
            href="/"
          >
            Back to homepage
          </Link>
        </footer>
      </div>
    </main>
  );
}
