import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { NewsletterButton } from "@/components/newsletter-button";
import { SiteFooter } from "@/components/site-chrome";
import styles from "./home.module.css";

const selectedWork = [
  { name: "Ryvalise", slug: "ryvalise", description: "Competitive intelligence that turns competitor changes into useful briefs." },
  { name: "Kitt Medical", slug: "kitt-medical", description: "Software supporting emergency allergy response in schools and businesses." },
  { name: "FeedbackLoop", slug: "feedbackloop", description: "Feedback and roadmaps. Built at 15, grew to 700 users, then acquired." },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.column}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <div className={styles.portraitFrame}>
              <Image className={styles.portrait} src="/mehdi-portrait.jpg" alt="Mehdi Khoudali" width={400} height={400} sizes="(max-width: 600px) 140px, 190px" priority />
            </div>
            <div>
              <p className={styles.name}>Mehdi Khoudali</p>
              <p className={styles.role}>Software engineer &amp; founder</p>
            </div>
          </div>
          <p className={styles.location}>Casablanca</p>
        </header>
        <main>
          <section className={styles.intro} aria-labelledby="intro-title">
            <h1 id="intro-title" className={styles.headline}>
              I build software for creators, founders, and teams.
              <br />
              And share what I learn along the way.
            </h1>
            <div className={styles.subscribe}>
              <NewsletterButton className={styles.newsletter} />
              <p className={styles.proof}>Read by 1,000+ founders.</p>
            </div>
          </section>
          <section id="work" className={styles.work} aria-labelledby="work-title">
            <h2 id="work-title" className={styles.sectionTitle}>A few things I&apos;ve built</h2>
            <ul className={styles.projects}>
              {selectedWork.map((project) => (
                <li key={project.slug}>
                  <a className={styles.project} href={`/experience/${project.slug}`}>
                    <p><span className={styles.projectName}>{project.name}.</span>{" "}{project.description}</p>
                    <ArrowRightIcon className={styles.arrow} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section id="about" className={styles.about} aria-label="About Mehdi">
            <p>Based in Casablanca. Building since 15.</p>
            <p>I write about the products I build, the experiments I try, and what I learn.</p>
          </section>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
