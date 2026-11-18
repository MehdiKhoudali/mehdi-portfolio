import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRightIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";

export const metadata: Metadata = {
  title: "I build mobile apps - Mehdi Khoudali",
  description: "Mehdi Khoudali designs, builds and launches mobile apps.",
  robots: { index: false, follow: false },
};

const contactUrl = "mailto:mehdikhoudalpro@gmail.com?subject=Mobile%20app%20project";

const skills = ["Design", "App development", "Subscriptions", "Analytics", "App Store launch"];

const heroShots = ["/apps/wandwick/01-scroll-less.jpg", "/apps/wumbles/02-packs.jpg", "/apps/wandwick/03-worth-keeping.jpg", "/apps/wumbles/01-talk.jpg"];

const apps = [
  {
    name: "Wandwick",
    status: "Live on the App Store",
    icon: "/apps/wandwick/icon.png",
    url: "https://apps.apple.com/us/app/wandwick-stories-daily/id6829309820",
    summary: "Short, true stories from history, science and culture, picked around what you love.",
    screenshots: ["01-scroll-less", "02-your-feed", "03-worth-keeping", "05-your-taste", "06-daily-fact"],
  },
  {
    name: "Wumbles",
    status: "Coming soon",
    icon: "/apps/wumbles/icon.png",
    summary: "Conversation cards for couples, friends and family.",
    screenshots: ["01-talk", "02-packs", "03-names", "04-friends", "05-deeper", "06-share"],
  },
];

export default function MobileAppsPage() {
  return (
    <main className="detail-page">
      <header className="detail-intro">
        <h1>I build mobile apps.</h1>
        <p className="detail-summary">Have an idea? I&apos;ll design, build and launch it for you.</p>
        <a className="raised-button app-cta" href={contactUrl}>
          <EnvelopeClosedIcon aria-hidden="true" />
          <span>Tell me about your app</span>
        </a>
        <div className="hero-peek" aria-hidden="true">
          {heroShots.map((shot) => (
            <Image src={shot} alt="" width={660} height={1434} sizes="180px" priority key={shot} />
          ))}
        </div>
      </header>
      {apps.map((app) => (
        <section className="detail-section" aria-labelledby={`${app.name}-title`} key={app.name}>
          <div className="app-heading">
            <Image className="app-icon" src={app.icon} alt="" width={64} height={64} />
            <div>
              <h2 id={`${app.name}-title`}>{app.name}</h2>
              <p className="eyebrow">{app.status}</p>
            </div>
          </div>
          <p className="prose">{app.summary}</p>
          <div className="app-screens">
            {app.screenshots.map((shot) => (
              <Image src={`/apps/${app.name.toLowerCase()}/${shot}.jpg`} alt={`${app.name} screenshot`} width={660} height={1434} sizes="220px" key={shot} />
            ))}
          </div>
          {app.url && <a className="quiet-link" href={app.url} target="_blank" rel="noopener noreferrer">View on the App Store <ArrowRightIcon aria-hidden="true" /></a>}
        </section>
      ))}
      <section className="detail-section" aria-labelledby="skills-title">
        <h2 id="skills-title">What I handle</h2>
        <ul className="stack-list">{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
      </section>
      <section className="detail-section" aria-labelledby="contact-title">
        <h2 id="contact-title">Have an app in mind?</h2>
        <a className="raised-button" href={contactUrl}>
          <EnvelopeClosedIcon aria-hidden="true" />
          <span>Tell me about your app</span>
        </a>
      </section>
    </main>
  );
}
