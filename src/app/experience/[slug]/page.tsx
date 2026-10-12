import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { BrowserScreenshot } from "@/components/browser-screenshot";
import { experiences, getExperience } from "@/lib/experiences";

type ExperiencePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return experiences.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
  const experience = getExperience((await params).slug);
  return experience ? { title: `${experience.company} - Mehdi Khoudali`, description: experience.summary } : {};
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) notFound();
  const projectIndex = experiences.findIndex((item) => item.slug === slug);
  const nextProject = experiences[(projectIndex + 1) % experiences.length];

  return (
    <main className="detail-page">
      <Link prefetch={false} className="quiet-link back-link" href="/#work">Back to all work</Link>
      <header className="detail-intro">
        <p className="eyebrow">{experience.category}</p>
        <h1>{experience.company}</h1>
        <p className="detail-summary">{experience.summary}</p>
        <dl className="project-meta">
          <div><dt>Role</dt><dd>{experience.role}</dd></div>
          <div><dt>Based in</dt><dd>{experience.location}</dd></div>
          <div><dt>Started</dt><dd>{experience.date}</dd></div>
        </dl>
        {experience.liveUrl && <a className="quiet-link visit-link" href={experience.liveUrl} target="_blank" rel="noopener noreferrer">Visit app <ArrowRightIcon aria-hidden="true" /></a>}
      </header>
      {experience.gallery.length > 0 && (
        <section className="project-gallery" aria-label="Project images">
          {experience.gallery.map((image, index) => (
            <BrowserScreenshot image={image} projectName={experience.company} index={index} key={image.src} />
          ))}
        </section>
      )}
      <section className="detail-section" aria-labelledby="story-title">
        <h2 id="story-title">What it took</h2>
        <div className="prose">{experience.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>
      <section className="detail-section" aria-labelledby="contribution-title">
        <h2 id="contribution-title">Contribution</h2>
        <ul className="plain-list">{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
      </section>
      {experience.techStack.length > 0 && (
        <section className="detail-section" aria-labelledby="stack-title">
          <h2 id="stack-title">Stack</h2>
          <ul className="stack-list">{experience.techStack.map((tool) => <li key={tool}>{tool}</li>)}</ul>
        </section>
      )}
      <nav className="next-project" aria-label="More projects">
        <a href={`/experience/${nextProject.slug}`}>
          <span><span className="eyebrow">Next project</span><span className="next-project-name">{nextProject.company}</span></span>
          <ArrowRightIcon aria-hidden="true" />
        </a>
      </nav>
    </main>
  );
}
