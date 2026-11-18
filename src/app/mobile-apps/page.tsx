import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export const metadata: Metadata = {
  title: "I build mobile apps - Mehdi Khoudali",
  description: "The iPhone apps Mehdi Khoudali is building right now: Wandwick and Wumbles.",
  robots: { index: false, follow: false },
};

const apps = [
  {
    name: "Wandwick",
    category: "Live on the App Store",
    icon: "/apps/wandwick/icon.png",
    url: "https://apps.apple.com/us/app/wandwick-stories-daily/id6829309820",
    summary: "A feed of short, true stories from history, science, faith and culture, picked around what you love. A few minutes a day instead of endless scrolling.",
    highlights: [
      "A personal feed that learns from likes, saves and skips",
      "More than 60 languages",
      "A daily fact at the time you choose, a reading streak and a home screen widget",
      "Subscriptions with a free trial",
    ],
    stack: ["React Native", "Expo", "Supabase", "Superwall", "PostHog"],
    screenshots: [
      { src: "/apps/wandwick/01-scroll-less.jpg", alt: "Wandwick story feed" },
      { src: "/apps/wandwick/02-your-feed.jpg", alt: "Wandwick topic picker" },
      { src: "/apps/wandwick/06-daily-fact.jpg", alt: "Wandwick daily fact notification" },
    ],
  },
  {
    name: "Wumbles",
    category: "Coming soon",
    icon: "/apps/wumbles/icon.png",
    summary: "Conversation cards for couples, friends, family and yourself. Pick a pack, pass the phone and really talk.",
    highlights: [
      "Question packs from light to deep, with cards that use your names",
      "A daily question two people answer together on their own phones",
      "Five languages, switched inside the app",
      "No account: data stays on the phone, shared answers are encrypted",
    ],
    stack: ["Swift", "SwiftUI", "SwiftData", "CloudKit", "Superwall", "PostHog"],
    screenshots: [
      { src: "/apps/wumbles/01-talk.jpg", alt: "Wumbles question card" },
      { src: "/apps/wumbles/02-packs.jpg", alt: "Wumbles question packs" },
      { src: "/apps/wumbles/04-friends.jpg", alt: "Wumbles card for friends" },
    ],
  },
];

export default function MobileAppsPage() {
  return (
    <main className="detail-page">
      <header className="detail-intro">
        <p className="eyebrow">Mobile apps</p>
        <h1>I build mobile apps</h1>
        <p className="detail-summary">Two iPhone apps I&apos;m building right now, from the idea and design to the App Store.</p>
      </header>
      {apps.map((app) => (
        <section className="detail-section app-section" aria-labelledby={`${app.name}-title`} key={app.name}>
          <div className="app-heading">
            <Image className="app-icon" src={app.icon} alt="" width={64} height={64} />
            <div>
              <h2 id={`${app.name}-title`}>{app.name}</h2>
              <p className="eyebrow">{app.category}</p>
            </div>
          </div>
          <p className="prose">{app.summary}</p>
          <div className="app-screens">
            {app.screenshots.map((shot) => (
              <Image src={shot.src} alt={shot.alt} width={660} height={1434} sizes="(max-width: 600px) 30vw, 240px" key={shot.src} />
            ))}
          </div>
          <ul className="plain-list">{app.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          <ul className="stack-list app-stack">{app.stack.map((tool) => <li key={tool}>{tool}</li>)}</ul>
          {app.url && <a className="quiet-link visit-link" href={app.url} target="_blank" rel="noopener noreferrer">View on the App Store <ArrowRightIcon aria-hidden="true" /></a>}
        </section>
      ))}
    </main>
  );
}
