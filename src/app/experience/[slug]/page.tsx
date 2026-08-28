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

const highlightedTerms = [
  "TypeScript",
  "700 users",
  "50K+",
  "thousands of venues",
  "acquired",
  "core systems",
  "product judgment",
  "AI SaaS",
  "short-form content",
  "full-stack",
  "automation",
  "payment logic",
];

function HighlightedText({ text }: { text: string }) {
  const terms = [...highlightedTerms].sort((a, b) => b.length - a.length);
  const escapedTerms = terms.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi");

  return text.split(pattern).map((part, index) => {
    const isHighlighted = terms.some(
      (term) => term.toLowerCase() === part.toLowerCase(),
    );

    return isHighlighted ? (
      <strong className="font-medium text-white" key={`${part}-${index}`}>
        {part}
      </strong>
    ) : (
      part
    );
  });
}

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

  const projectIndex = experiences.findIndex((item) => item.slug === slug);
  const nextProject = experiences[(projectIndex + 1) % experiences.length];

  return (
    <main className="portfolio-page min-h-screen bg-[#0a0a0a] text-[#f0eee8]">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-12">
        <header className="portfolio-header reveal flex items-center justify-between py-6 text-xs text-white/55 sm:py-8">
          <Link className="font-medium text-white/85" href="/">
            Mehdi Khoudali
          </Link>
          <nav aria-label="Project navigation" className="flex items-center gap-5 sm:gap-8">
            <Link className="transition-colors hover:text-white" href="/#work">
              Work
            </Link>
            <Link className="transition-colors hover:text-white" href="/#about">
              About me
            </Link>
            <Link className="transition-colors hover:text-white" href="/#contact">
              Let&apos;s talk
            </Link>
          </nav>
        </header>

        {experience.gallery.length > 0 && (
          <section aria-label="Project images" className="border-t border-white/12 py-16 sm:py-24">
            <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-white/38">
              <div className="flex items-center gap-4">
                <span>Project / {String(projectIndex + 1).padStart(2, "0")}</span>
                <h1 className="text-xs font-medium tracking-normal text-white/78 normal-case">{experience.company}</h1>
              </div>
              <span>{experience.category}</span>
            </div>
            <div className={`grid gap-6 ${experience.galleryLayout === "grid" ? "lg:grid-cols-2" : ""}`}>
              {experience.gallery.map((image, index) => (
                <BrowserScreenshot
                  image={image}
                  projectName={experience.company}
                  index={index}
                  uniformSize={experience.galleryLayout === "grid"}
                  key={image.src}
                />
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-white/12 py-16 sm:py-24">
          <div className="grid gap-10 sm:grid-cols-[0.75fr_1fr] sm:gap-12">
            <div>
              <h2 className="portfolio-serif text-4xl text-white/78 sm:text-5xl">What it took.</h2>
            </div>
            <div className="max-w-xl space-y-6 text-base leading-8 text-white/62 sm:text-lg">
              <p className="text-white/78"><HighlightedText text={experience.summary} /></p>
              {experience.description.map((paragraph) => (
                <p key={paragraph}><HighlightedText text={paragraph} /></p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/12 py-16 sm:py-24">
          <div className="grid gap-10 sm:grid-cols-[0.75fr_1fr] sm:gap-12">
            <div>
              <h2 className="portfolio-serif text-4xl text-white/78 sm:text-5xl">Contribution.</h2>
            </div>
            <div className="border-t border-white/15">
              {experience.highlights.map((highlight, index) => (
                <div className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/12 py-5 text-sm text-white/64 sm:py-6 sm:text-base" key={highlight}>
                  <span className="text-white/30">{String(index + 1).padStart(2, "0")}</span>
                  <span><HighlightedText text={highlight} /></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {experience.techStack.length > 0 && (
          <section className="border-t border-white/12 py-16 sm:py-24">
            <div className="grid gap-10 sm:grid-cols-[0.75fr_1fr] sm:gap-12">
              <div>
                <h2 className="portfolio-serif text-4xl text-white/78 sm:text-5xl">Stack.</h2>
              </div>
              <div className="flex max-w-xl flex-wrap content-start gap-x-5 gap-y-3 text-sm text-white/62 sm:text-base">
                {experience.techStack.map((tool) => (
                  <span className="border-b border-white/20 pb-1" key={tool}>{tool}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="border-t border-white/12 py-10 sm:py-14">
          <Link className="group flex items-end justify-between gap-6" href={`/experience/${nextProject.slug}`}>
            <span>
              <span className="mb-3 block text-xs uppercase tracking-[0.14em] text-white/38">Next project</span>
              <span className="portfolio-serif text-3xl text-white/78 transition-colors group-hover:text-white sm:text-4xl">{nextProject.company}</span>
            </span>
            <span className="pb-1 text-sm text-white/45 transition-colors group-hover:text-white">View project ↗</span>
          </Link>
          <div className="mt-12 flex flex-col gap-3 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
            <Link className="transition-colors hover:text-white" href="/#work">Back to all work</Link>
            <a className="transition-colors hover:text-white" href="mailto:mehdikhoudalpro@gmail.com">mehdikhoudalpro@gmail.com</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
