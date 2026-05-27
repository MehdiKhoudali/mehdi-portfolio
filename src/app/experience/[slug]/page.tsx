import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialGallery } from "@/components/editorial-gallery";
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
        <section className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8">
          <nav
            aria-label="Project navigation"
            className="reveal mb-12 flex items-center justify-between border-b border-white/15 pt-2 pb-6 text-sm text-white/55 sm:pt-3 sm:pb-7"
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

          <div className="grid gap-10 lg:grid-cols-[0.95fr_0.65fr]">
            <div className="reveal reveal-delay-1">
              <p className="mb-5 text-xs uppercase text-white/40">
                {experience.category} / {experience.location}
              </p>
              <h1 className="max-w-5xl text-5xl leading-none font-semibold text-white sm:text-7xl lg:text-8xl">
                {experience.company}
              </h1>
            </div>

            <aside className="project-meta-card reveal reveal-delay-2 border border-white/15">
              <div className="flex items-center justify-between gap-4 border-b border-white/12 px-4 py-4 text-xs uppercase tracking-[0.18em] text-white/38 sm:px-5">
                <span>Project file</span>
                <span>{experience.category}</span>
              </div>
              <div className="divide-y divide-white/10">
                {[
                  ["01", "Role", experience.role],
                  ["02", "Date", experience.date],
                  ["03", "Location", experience.location],
                ].map(([number, label, value]) => (
                  <div
                    className="project-meta-row grid grid-cols-[2.25rem_1fr] gap-4 px-4 py-5 sm:px-5"
                    key={label}
                  >
                    <span className="pt-1 text-xs text-white/28">{number}</span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-white/32">
                        {label}
                      </p>
                      <p className="mt-2 text-lg leading-7 text-white/82">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8">
          <div className="grid gap-10 lg:grid-cols-[0.36fr_1fr]">
            <div className="reveal">
              <p className="mb-3 text-xs uppercase text-white/40">Project note</p>
              <h2 className="text-5xl leading-none font-semibold sm:text-6xl">
                Context
              </h2>
            </div>

            <div className="reveal reveal-delay-1 grid gap-7 text-lg leading-9 text-white/68 md:grid-cols-2">
              <p className="text-white/80">{experience.summary}</p>
              {experience.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8">
          <div className="reveal mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs uppercase text-white/40">Build log</p>
              <h2 className="text-5xl leading-none font-semibold sm:text-6xl">
                Notes
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
                className="glass-row reveal border-b border-white/15 px-4 py-5 text-lg text-white/72 transition-colors sm:px-5 lg:px-6"
                style={{ animationDelay: `${120 + index * 65}ms` }}
                key={highlight}
              >
                {highlight}
              </div>
            ))}
          </div>
        </section>

        {experience.techStack.length > 0 && (
          <section
            className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8"
            aria-labelledby="stack-title"
          >
            <div className="grid gap-10 lg:grid-cols-[0.36fr_1fr]">
              <div className="reveal">
                <p className="mb-3 text-xs uppercase text-white/40">
                  Technical layer
                </p>
                <h2
                  id="stack-title"
                  className="text-5xl leading-none font-semibold sm:text-6xl"
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

        {experience.gallery.length > 0 && (
          <section
            aria-labelledby="project-gallery-title"
            className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8"
          >
            <div className="reveal mb-6 flex items-end justify-between gap-6">
              <div>
                <p className="mb-3 text-xs uppercase text-white/40">Archive</p>
                <h2
                  id="project-gallery-title"
                  className="text-4xl leading-none font-semibold sm:text-5xl"
                >
                  Image Index
                </h2>
              </div>
              <p className="hidden max-w-xs text-right text-sm leading-6 text-white/45 sm:block">
                Visual references, product moments, and project screenshots in
                the same archive style as the homepage.
              </p>
            </div>

            <EditorialGallery images={experience.gallery} />
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
